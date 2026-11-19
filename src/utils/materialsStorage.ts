import { MaterialItem } from '../types';
export type { MaterialItem };
import {
  isSupabaseConfigured,
  fetchAllMaterialsFromSupabase,
  saveMaterialToSupabase,
  deleteMaterialFromSupabase,
  withTimeout,
} from '../lib/supabase';
import initialData from '../data/initialData.json';

const DB_NAME = 'SchoolMaterialsDB';
const STORE_NAME = 'materials';
const DB_VERSION = 1;
const EVENT_NAME = 'school_materials_updated';
const DELETED_IDS_KEY = 'school_materials_deleted_ids';
const META_CACHE_KEY = 'school_materials_meta_cache_v1';
const MATERIALS_CACHE_TTL_MS = 10000;

let materialsMemCache: { items: MaterialItem[]; ts: number } | null = null;
let materialsInFlight: Promise<MaterialItem[]> | null = null;
const prefetchedFileUrls = new Set<string>();

export function invalidateMaterialsClientCache(): void {
  materialsMemCache = null;
  materialsInFlight = null;
}

export function getLocalDeletedMaterialIds(): string[] {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(DELETED_IDS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  } catch {
    return [];
  }
  return [];
}

export function recordLocalDeletedMaterialId(id: string): void {
  try {
    if (typeof window !== 'undefined') {
      const set = new Set(getLocalDeletedMaterialIds());
      set.add(id);
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
    }
  } catch (e) {
    console.warn('Error saving deleted material id:', e);
  }
}

export function resolveMaterialUrl(item?: Partial<MaterialItem> | null): string {
  if (!item) return '';
  return (
    item.fileData ||
    item.storageUrl ||
    item.fileUrl ||
    item.linkUrl ||
    (item.id ? `/api/materials/${encodeURIComponent(item.id)}/file` : '')
  );
}

export function getProxiedOrLocalUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  if (
    rawUrl.startsWith('data:') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.startsWith('/') ||
    rawUrl.startsWith('.') ||
    (typeof window !== 'undefined' && rawUrl.includes(window.location.host))
  ) {
    return rawUrl;
  }
  return `/api/proxy-file?url=${encodeURIComponent(rawUrl)}`;
}

function normalizeMaterialItem(m: MaterialItem): MaterialItem {
  const effectiveUrl = m.storageUrl || m.fileUrl || m.linkUrl;
  let type = m.type;
  if (!type) {
    const checkTarget = `${m.fileName || ''} ${effectiveUrl || ''}`.toLowerCase();
    if (/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(checkTarget)) {
      type = 'image';
    } else if (/\.(html|htm)(\?|$)/i.test(checkTarget)) {
      type = 'html';
    } else if (/\.(doc|docx)(\?|$)/i.test(checkTarget)) {
      type = 'doc';
    } else if (
      effectiveUrl &&
      (effectiveUrl.startsWith('http://') || effectiveUrl.startsWith('https://')) &&
      !/\.pdf(\?|$)/i.test(checkTarget)
    ) {
      type = 'link';
    } else {
      type = 'pdf';
    }
  }
  return {
    ...m,
    type,
    ...(effectiveUrl && !m.storageUrl ? { storageUrl: effectiveUrl } : {}),
  };
}

function saveMetaCacheToStorage(items: MaterialItem[]): void {
  try {
    if (typeof window === 'undefined') return;
    const lightweight = items.map((m) => {
      const { fileData, ...rest } = m;
      return rest;
    });
    localStorage.setItem(META_CACHE_KEY, JSON.stringify(lightweight));
  } catch {}
}

function readMetaCacheFromStorage(): MaterialItem[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(META_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCachedMaterialsSync(): MaterialItem[] {
  if (materialsMemCache && materialsMemCache.items.length > 0) {
    return materialsMemCache.items;
  }
  const deletedSet = new Set(getLocalDeletedMaterialIds());
  const map = new Map<string, MaterialItem>();
  if (initialData && Array.isArray((initialData as any).materials)) {
    (initialData as any).materials.forEach((m: MaterialItem) => {
      if (m && m.id && !deletedSet.has(m.id)) {
        map.set(m.id, normalizeMaterialItem(m));
      }
    });
  }
  const cachedMeta = readMetaCacheFromStorage();
  cachedMeta.forEach((m) => {
    if (m && m.id && !deletedSet.has(m.id)) {
      map.set(m.id, normalizeMaterialItem(m));
    }
  });
  const list = Array.from(map.values());
  if (!materialsMemCache && list.length > 0) {
    materialsMemCache = { items: list, ts: 0 };
  }
  return list;
}

export function prefetchMaterialFile(itemOrUrl?: MaterialItem | string | null): void {
  if (typeof window === 'undefined' || !itemOrUrl) return;
  let rawUrl = '';
  if (typeof itemOrUrl === 'string') {
    rawUrl = itemOrUrl;
  } else {
    if (itemOrUrl.fileData) return; // Already in memory
    if (itemOrUrl.type === 'link') return; // Don't prefetch generic web pages
    rawUrl = resolveMaterialUrl(itemOrUrl);
  }
  if (!rawUrl || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) return;

  const targetUrl = getProxiedOrLocalUrl(rawUrl);
  if (!targetUrl || prefetchedFileUrls.has(targetUrl)) return;
  if (prefetchedFileUrls.size > 40) {
    prefetchedFileUrls.clear();
  }
  prefetchedFileUrls.add(targetUrl);

  fetch(targetUrl).catch(() => {
    prefetchedFileUrls.delete(targetUrl);
  });
}

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// In-memory fallback if IndexedDB has issues
const FALLBACK_KEY = 'school_materials_fallback';
const IN_MEMORY_MATERIALS_FALLBACK: Record<string, string> = {};

function getFallbackMaterials(): MaterialItem[] {
  try {
    const raw = IN_MEMORY_MATERIALS_FALLBACK[FALLBACK_KEY];
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFallbackMaterials(items: MaterialItem[]) {
  try {
    IN_MEMORY_MATERIALS_FALLBACK[FALLBACK_KEY] = JSON.stringify(items);
  } catch (e) {
    console.warn('In-memory cache failed:', e);
  }
}

// Helper to save items into local IndexedDB
async function saveItemsToLocalDB(items: MaterialItem[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const item of items) {
      store.put(item);
    }
  } catch (e) {
    saveFallbackMaterials(items);
  }
}

async function readLocalIndexedDBItems(): Promise<MaterialItem[]> {
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve(getFallbackMaterials());
    });
  } catch {
    return getFallbackMaterials();
  }
}

// Retrieve all materials (from IndexedDB + Server API + Supabase Cloud IN PARALLEL with instant caching)
export async function getAllMaterials(forceRefresh = false): Promise<MaterialItem[]> {
  if (
    !forceRefresh &&
    materialsMemCache &&
    materialsMemCache.ts > 0 &&
    Date.now() - materialsMemCache.ts < MATERIALS_CACHE_TTL_MS
  ) {
    return materialsMemCache.items;
  }

  if (!forceRefresh && materialsInFlight) {
    return materialsInFlight;
  }

  const loadPromise = (async () => {
    const localPromise = readLocalIndexedDBItems();
    const serverPromise = withTimeout<MaterialItem[] | null>(
      fetch('/api/materials')
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      3000,
      null
    );
    const cloudPromise = isSupabaseConfigured
      ? withTimeout<MaterialItem[]>(
          fetchAllMaterialsFromSupabase().catch(() => []),
          1500,
          []
        )
      : Promise.resolve<MaterialItem[]>([]);

    const [localItems, serverItems, cloudItems] = await Promise.all([
      localPromise,
      serverPromise,
      cloudPromise,
    ]);

    const itemsMap = new Map<string, MaterialItem>();

    // 0. Seed base materials from initialData.json
    if (initialData && Array.isArray((initialData as any).materials)) {
      (initialData as any).materials.forEach((m: MaterialItem) => {
        if (m && m.id) itemsMap.set(m.id, normalizeMaterialItem(m));
      });
    }

    // 1. Merge local IndexedDB items
    localItems.forEach((item) => {
      if (item && item.id) itemsMap.set(item.id, normalizeMaterialItem(item));
    });

    // 2. Merge Server API (/api/materials)
    if (Array.isArray(serverItems)) {
      serverItems.forEach((serverItem) => {
        const normalized = normalizeMaterialItem(serverItem);
        const localMatch = itemsMap.get(normalized.id);
        if (localMatch && localMatch.fileData && !normalized.fileData) {
          itemsMap.set(normalized.id, { ...normalized, fileData: localMatch.fileData });
        } else {
          itemsMap.set(normalized.id, normalized);
        }
      });

      // Clean up dynamically deleted items from IndexedDB in background
      const baseIds = new Set(
        initialData && Array.isArray((initialData as any).materials)
          ? (initialData as any).materials.map((m: any) => m.id)
          : []
      );
      const missingOnServer = localItems.filter(
        (loc) => !baseIds.has(loc.id) && !serverItems.some((srv) => srv.id === loc.id)
      );
      if (missingOnServer.length > 0) {
        missingOnServer.forEach((item) => itemsMap.delete(item.id));
        openDB()
          .then((db) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            missingOnServer.forEach((item) => store.delete(item.id));
          })
          .catch(() => {});
      }
    }

    // 3. Merge Supabase Cloud
    if (Array.isArray(cloudItems) && cloudItems.length > 0) {
      cloudItems.forEach((cloudItem) => {
        const normalized = normalizeMaterialItem(cloudItem);
        const existing = itemsMap.get(normalized.id);
        if (existing && existing.fileData && !normalized.fileData) {
          itemsMap.set(normalized.id, { ...normalized, fileData: existing.fileData });
        } else {
          itemsMap.set(normalized.id, normalized);
        }
      });
    }

    const deletedSet = new Set(getLocalDeletedMaterialIds());
    const finalItems = Array.from(itemsMap.values()).filter((item) => !deletedSet.has(item.id));

    materialsMemCache = { items: finalItems, ts: Date.now() };
    saveMetaCacheToStorage(finalItems);
    saveItemsToLocalDB(finalItems).catch(() => {});

    return finalItems;
  })();

  materialsInFlight = loadPromise;
  try {
    return await loadPromise;
  } finally {
    if (materialsInFlight === loadPromise) {
      materialsInFlight = null;
    }
  }
}

// Save or add a material (saves locally AND to central server AND Supabase Cloud)
export async function saveMaterial(item: MaterialItem): Promise<void> {
  // 1. Centralized Server Persistence (/api/materials) for laptop & all devices
  try {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.item && data.item.storageUrl) {
        item.storageUrl = data.item.storageUrl;
        delete item.fileData; // Clean up heavy base64 payload once stored on server
      }
    }
  } catch (serverErr) {
    console.warn('Failed to sync material to server API:', serverErr);
  }

  // Update client memory & localStorage metadata cache immediately
  const normalized = normalizeMaterialItem(item);
  const currentCached = getCachedMaterialsSync().filter((m) => m.id !== normalized.id);
  const updatedCache = [normalized, ...currentCached];
  materialsMemCache = { items: updatedCache, ts: Date.now() };
  saveMetaCacheToStorage(updatedCache);

  // 2. Save to local IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const itemToSave = { ...normalized };
      if (itemToSave.storageUrl && itemToSave.fileData) {
        delete itemToSave.fileData;
      }
      const req = store.put(itemToSave);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Failed to save to IndexedDB, saving to fallback', e);
    try {
      const fallbackItem = { ...normalized };
      delete fallbackItem.fileData; // Prevent localStorage QuotaExceededError
      const existing = getFallbackMaterials().filter((m) => m.id !== normalized.id);
      existing.push(fallbackItem);
      saveFallbackMaterials(existing);
    } catch {}
  }

  // 3. Sync to Supabase Cloud Database if configured
  if (isSupabaseConfigured) {
    try {
      await saveMaterialToSupabase(normalized);
    } catch (err) {
      console.warn('Failed to sync material to Supabase cloud:', err);
    }
  }

  // Notify components across app
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export async function deleteMaterial(id: string, storageUrl?: string): Promise<void> {
  // 0. Record deleted ID locally so it is filtered out everywhere
  recordLocalDeletedMaterialId(id);

  // Update client memory & localStorage metadata cache immediately
  const updatedCache = getCachedMaterialsSync().filter((m) => m.id !== id);
  materialsMemCache = { items: updatedCache, ts: Date.now() };
  saveMetaCacheToStorage(updatedCache);

  // 1. Delete from local IndexedDB and fallback cache
  try {
    const existing = getFallbackMaterials().filter((m) => m.id !== id);
    saveFallbackMaterials(existing);
  } catch (fe) {
    console.warn('Error clearing fallback material:', fe);
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Failed to delete from IndexedDB:', e);
  }

  // 2. Delete from centralized server
  try {
    await fetch(`/api/materials/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (serverErr) {
    console.warn('Failed to delete material from server API:', serverErr);
  }

  // 3. Delete from Supabase Cloud
  if (isSupabaseConfigured) {
    try {
      await deleteMaterialFromSupabase(id, storageUrl);
    } catch (err) {
      console.warn('Failed to delete material from Supabase cloud:', err);
    }
  }

  // Notify components
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// Subscribe to updates
export function subscribeToMaterials(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}

// Helper to format bytes
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Convert data URL to Blob
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Resolve a MaterialItem from a given URL or file name cleanly without unwanted cross-linking
export function resolveMaterialItem(urlOrName?: string, defaultTitle?: string): MaterialItem {
  const all = [...getCachedMaterialsSync(), ...getFallbackMaterials()];

  // 1. If specific URL or name matches known stored materials
  if (urlOrName) {
    const found = all.find(
      (m) =>
        m.storageUrl === urlOrName ||
        m.fileUrl === urlOrName ||
        m.linkUrl === urlOrName ||
        (m.fileName && urlOrName.includes(m.fileName)) ||
        (m.storageUrl && m.storageUrl.includes(urlOrName)) ||
        (m.fileUrl && m.fileUrl.includes(urlOrName))
    );
    if (found) return found;
  }

  // 2. If urlOrName is provided, extract its exact clean file name without rewriting or coupling
  if (urlOrName) {
    const rawName = urlOrName.split('/').pop()?.split('?')[0] || defaultTitle || 'ملف مرفق';
    let cleanName = rawName;
    try {
      cleanName = decodeURIComponent(rawName);
    } catch {}

    const isHtml = cleanName.endsWith('.html') || urlOrName.endsWith('.html');
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(cleanName);
    return {
      id: `mat-${cleanName.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
      fileName: cleanName,
      fileSize: 599624,
      block: 2,
      section: 'Materials',
      classId: 'ALL',
      type: isHtml ? 'html' : isImage ? 'image' : 'pdf',
      storageUrl: urlOrName,
      uploadedAt: new Date().toISOString(),
    };
  }

  // 3. Fallback directly to the exact user provided sheet
  return {
    id: 'mat_social_studies_user_sheet',
    fileName: 'SocialStudies-Grade2-B2-W1-U2-HomeWork1 - Extra- (Minia).pdf',
    fileSize: 599624,
    block: 2,
    section: 'Social Studies',
    classId: 'ALL',
    type: 'pdf',
    storageUrl: '/materials/SocialStudies-Grade2-B2-W1-U2-HomeWork1 - Extra- (Minia).pdf',
    uploadedAt: '2026-10-15T06:00:00.000Z',
  };
}

// Open PDF or Link directly in our guaranteed In-App Viewer Modal
export function openPdfItem(item: MaterialItem): void {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_pdf_viewer_modal', { detail: item }));
    }
  } catch (e) {
    console.error('Error opening PDF:', e);
  }
}

// Universal Print Function for PDF item (supports storageUrl, fileUrl, linkUrl, server endpoint, and dataUrl via same-origin proxy)
export function printPdfItem(item: MaterialItem): void {
  try {
    const rawUrl = item.fileData
      ? URL.createObjectURL(dataUrlToBlob(item.fileData))
      : resolveMaterialUrl(item);

    if (!rawUrl) return;
    const targetUrl = getProxiedOrLocalUrl(rawUrl);

    // Create a hidden iframe with the same-origin URL to trigger browser print dialog without CORS issues
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.src = targetUrl;

    document.body.appendChild(iframe);

    let printed = false;
    const executePrint = () => {
      if (printed) return;
      printed = true;
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        const newTab = window.open(targetUrl, '_blank');
        if (newTab) {
          newTab.focus();
        }
      }
    };

    iframe.onload = () => {
      setTimeout(executePrint, 300);
    };

    setTimeout(() => {
      if (!printed) executePrint();
    }, 1000);
  } catch (e) {
    console.error('Print error:', e);
  }
}

// Universal Download Function (supports storageUrl, fileUrl, linkUrl, server endpoint, and dataUrl)
export function downloadPdfItem(item: MaterialItem): void {
  try {
    const targetUrl = item.fileData
      ? URL.createObjectURL(dataUrlToBlob(item.fileData))
      : resolveMaterialUrl(item);

    if (!targetUrl) return;

    const a = document.createElement('a');
    a.href = targetUrl;
    const cleanFileName = item.fileName?.trim() || 'document.pdf';
    a.download = cleanFileName.includes('.') ? cleanFileName : `${cleanFileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error('Download error:', e);
  }
}
