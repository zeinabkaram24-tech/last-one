import { UploadedMaterial } from '../types';

const STORAGE_KEY = 'nile_planner_uploaded_materials_v1';

type Listener = (materials: UploadedMaterial[]) => void;
const listeners: Set<Listener> = new Set();

function notifyListeners(materials: UploadedMaterial[]) {
  listeners.forEach((listener) => {
    try {
      listener(materials);
    } catch (e) {
      console.error('Error notifying material listener', e);
    }
  });
}

export function subscribeMaterials(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCachedMaterials(): UploadedMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      let hasOversizedData = false;
      const sanitized = parsed.map((item: any) => {
        if (item.fileData || (typeof item.fileUrl === 'string' && item.fileUrl.startsWith('data:'))) {
          hasOversizedData = true;
        }
        const { fileData, ...rest } = item;
        return {
          ...rest,
          fileUrl:
            typeof rest.fileUrl === 'string' && rest.fileUrl.startsWith('data:')
              ? ''
              : rest.fileUrl || '',
        };
      });

      // Automatically migrate and heal localStorage if an oversized base64 payload was stored
      if (hasOversizedData) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      return sanitized;
    }
    return [];
  } catch (err) {
    console.error('Error reading cached materials:', err);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return [];
  }
}

export function setCachedMaterials(materials: UploadedMaterial[]): void {
  try {
    // Strip any large base64 fileData or data: URIs before storing in localStorage
    // to strictly prevent "Setting the value exceeded the quota" DOMException errors.
    const lightweightMaterials = materials.map((item) => {
      const { fileData, ...cleanMeta } = item;
      return {
        ...cleanMeta,
        fileUrl:
          typeof cleanMeta.fileUrl === 'string' && cleanMeta.fileUrl.startsWith('data:')
            ? ''
            : cleanMeta.fileUrl || '',
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightMaterials));
    notifyListeners(materials);
  } catch (err) {
    console.error('Error setting cached materials:', err);
    // If quota is still exceeded for any reason, safely reset storage to prevent persistent errors
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    notifyListeners(materials);
  }
}

export async function fetchMaterials(): Promise<UploadedMaterial[]> {
  try {
    const res = await fetch('/api/materials');
    if (res.ok) {
      const data: UploadedMaterial[] = await res.json();
      if (Array.isArray(data)) {
        setCachedMaterials(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Network error fetching materials, using cache:', err);
  }
  return getCachedMaterials();
}

export interface UploadMaterialPayload {
  title: string;
  subtitle?: string;
  subject: string;
  blockNumber: number;
  section: string; // 'main-sheet' | 'week-1' | 'week-2' | 'week-3' | 'week-4' etc.
  fileName: string;
  fileSize: string;
  base64Data: string;
  pages?: string;
}

export async function uploadMaterial(payload: UploadMaterialPayload): Promise<UploadedMaterial> {
  try {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const created: UploadedMaterial = await res.json();
      const current = getCachedMaterials().filter((m) => m.id !== created.id);
      const updated = [created, ...current];
      setCachedMaterials(updated);
      return created;
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Upload failed with status ${res.status}`);
    }
  } catch (netErr: any) {
    console.warn('Server upload failed, falling back to local client persistence:', netErr);
    // Client-side fallback so user is never blocked
    const fallbackId = 'mat_local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const cleanDataUrl = payload.base64Data.startsWith('data:')
      ? payload.base64Data
      : `data:application/pdf;base64,${payload.base64Data}`;

    const fallbackItem: UploadedMaterial = {
      id: fallbackId,
      title: payload.title,
      subtitle: payload.subtitle || '',
      subject: payload.subject || 'General',
      blockNumber: payload.blockNumber,
      section: payload.section,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
      fileUrl: cleanDataUrl,
      fileData: cleanDataUrl,
      uploadedAt: new Date().toISOString(),
      pages: payload.pages || 'PDF Document',
    };

    const current = getCachedMaterials();
    const updated = [fallbackItem, ...current];
    setCachedMaterials(updated);
    return fallbackItem;
  }
}

export async function deleteMaterial(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/materials/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const current = getCachedMaterials().filter((m) => m.id !== id);
      setCachedMaterials(current);
      return true;
    }
  } catch (netErr) {
    console.warn('Network error deleting material, removing from local cache:', netErr);
  }

  // Fallback deletion from cache
  const current = getCachedMaterials().filter((m) => m.id !== id);
  setCachedMaterials(current);
  return true;
}
