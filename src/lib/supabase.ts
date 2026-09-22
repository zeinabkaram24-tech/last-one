import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClassId, ClassworkEntry, HomeworkEntry, SchoolDay, SubjectName, MaterialItem } from '../types';
import { INITIAL_CLASSWORK, INITIAL_HOMEWORK } from '../data/defaultWeeklyPlan';
import initialData from '../data/initialData.json';
import localPlannerData from '../../data/planner_data.json';

export function cleanSupabaseUrl(rawUrl: string): string {
  let cleaned = (rawUrl || '').trim().replace(/^["']|["']$/g, '');
  if (!cleaned) return '';

  try {
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = 'https://' + cleaned;
    }
    const parsed = new URL(cleaned);
    // If it is a Supabase project domain (e.g. xyz.supabase.co/rest/v1 or xyz.supabase.co/)
    if (parsed.hostname.endsWith('.supabase.co')) {
      return parsed.origin;
    }
    // For custom or self-hosted domains, strip /rest/v1 or trailing slashes
    return cleaned.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  } catch {
    return cleaned.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  }
}

export function cleanSupabaseKey(rawKey: string): string {
  return (rawKey || '').trim().replace(/^["']|["']$/g, '');
}

export const STORAGE_KEYS_SUPABASE = {
  URL: 'nile_supabase_url',
  KEY: 'nile_supabase_anon_key',
};

export const DEFAULT_SUPABASE_URL = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

export function getActiveSupabaseConfig(): { url: string; key: string } {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(STORAGE_KEYS_SUPABASE.URL);
    const savedKey = localStorage.getItem(STORAGE_KEYS_SUPABASE.KEY);
    if (savedUrl && savedKey && savedUrl.trim() !== '' && savedKey.trim() !== '') {
      return {
        url: cleanSupabaseUrl(savedUrl),
        key: cleanSupabaseKey(savedKey),
      };
    }
  }
  // Fall back to environment variable or central default if not saved locally
  const url = (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;
  return {
    url: cleanSupabaseUrl(url),
    key: cleanSupabaseKey(key),
  };
}

export function saveActiveSupabaseConfig(url: string, key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS_SUPABASE.URL, cleanSupabaseUrl(url));
    localStorage.setItem(STORAGE_KEYS_SUPABASE.KEY, cleanSupabaseKey(key));
    window.dispatchEvent(new Event('supabase_config_updated'));
  }
}

const initialConfig = getActiveSupabaseConfig();
export let supabaseUrl = initialConfig.url;
export let supabaseAnonKey = initialConfig.key;

export let isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('placeholder')
);

export let supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export function updateSupabaseClient(url: string, key: string): SupabaseClient {
  const cleanedUrl = cleanSupabaseUrl(url);
  const cleanedKey = cleanSupabaseKey(key);
  saveActiveSupabaseConfig(cleanedUrl, cleanedKey);
  supabaseUrl = cleanedUrl;
  supabaseAnonKey = cleanedKey;
  isSupabaseConfigured = Boolean(
    cleanedUrl &&
      cleanedKey &&
      cleanedUrl.trim() !== '' &&
      cleanedKey.trim() !== '' &&
      cleanedUrl !== 'https://your-project.supabase.co' &&
      !cleanedUrl.includes('placeholder')
  );
  supabase = createClient(
    cleanedUrl || 'https://placeholder.supabase.co',
    cleanedKey || 'placeholder'
  );
  return supabase;
}

export function withTimeout<T>(promise: Promise<T> | PromiseLike<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(fallback);
      }
    }, ms);

    Promise.resolve(promise)
      .then((val) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(val);
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(fallback);
        }
      });
  });
}

export async function syncSupabaseConfigWithServer(): Promise<boolean> {
  try {
    const localUrl = localStorage.getItem(STORAGE_KEYS_SUPABASE.URL) || '';
    const localKey = localStorage.getItem(STORAGE_KEYS_SUPABASE.KEY) || '';
    
    // Check server-side Supabase credentials with timeout
    const res = await withTimeout(fetch('/api/supabase-config'), 2500, null as any);
    let hasUpdatedLocal = false;
    if (res && res.ok) {
      const srvConfig = await res.json();
      if (srvConfig && srvConfig.url && srvConfig.key) {
        const cleanedUrl = cleanSupabaseUrl(srvConfig.url);
        const cleanedKey = cleanSupabaseKey(srvConfig.key);
        
        if (cleanedUrl && cleanedKey && (cleanedUrl !== localUrl || cleanedKey !== localKey)) {
          console.log('[Supabase Sync] Replicating Supabase config from centralized server...');
          saveActiveSupabaseConfig(cleanedUrl, cleanedKey);
          supabaseUrl = cleanedUrl;
          supabaseAnonKey = cleanedKey;
          isSupabaseConfigured = true;
          supabase = createClient(supabaseUrl, supabaseAnonKey);
          
          window.dispatchEvent(new Event('supabase_config_updated'));
          hasUpdatedLocal = true;
        }
      } else if (localUrl && localKey && localUrl.trim() !== '' && !localUrl.includes('placeholder')) {
        // If server is unconfigured, but client has config, upload it to the server in background
        fetch('/api/supabase-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: localUrl, key: localKey }),
        }).catch(() => {});
      }
    }
    
    return hasUpdatedLocal;
  } catch (e) {
    console.warn('[Supabase Sync] Could not fetch/sync shared config:', e);
  }
  return false;
}

export async function syncLocalDataToServer(): Promise<void> {
  try {
    const localCw = getLocalCustomClasswork();
    const localHw = getLocalCustomHomework();
    if (localCw.length > 0 || localHw.length > 0) {
      const dataRes = await fetch('/api/planner-data');
      if (dataRes.ok) {
        const srvData = await dataRes.json();
        const serverCwEmpty = !srvData || !Array.isArray(srvData.classwork) || srvData.classwork.length === 0;
        const serverHwEmpty = !srvData || !Array.isArray(srvData.homework) || srvData.homework.length === 0;
        
        if (serverCwEmpty && localCw.length > 0) {
          console.log('[Sync] Uploading pre-existing local custom classwork to server...');
          await fetch('/api/planner-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classwork: localCw, mode: 'merge' }),
          });
        }
        if (serverHwEmpty && localHw.length > 0) {
          console.log('[Sync] Uploading pre-existing local custom homework to server...');
          await fetch('/api/planner-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ homework: localHw, mode: 'merge' }),
          });
        }
      }
    }
  } catch (e) {
    console.warn('[Sync] Local data upload failed:', e);
  }
}

// Database Row Types (snake_case in Supabase)
export interface ClassworkRow {
  id: string;
  class_id: string;
  day: string;
  period: number;
  subject: string;
  title: string;
  details: string | null;
  pages: string | null;
  completed: boolean;
  block: number;
  week: number;
  link_url: string | null;
  link_title: string | null;
  created_at?: string;
}

export interface HomeworkRow {
  id: string;
  class_id: string;
  assigned_day: string;
  due_day: string;
  subject: string;
  task: string;
  details: string | null;
  pages: string | null;
  completed: boolean;
  priority: string;
  block: number;
  week: number;
  is_link_task: boolean;
  link_url: string | null;
  created_at?: string;
}

export interface StudentProgressRow {
  student_name: string;
  class_id: string | null;
  completed_classwork_ids: string[];
  completed_homework_ids: string[];
  last_active: number;
}

// Convert from Row to ClassworkEntry - Supports both class_id and classId interchangeably
export function rowToClasswork(row: any): ClassworkEntry {
  const resolvedClassId = (row.class_id || row.classId || 'G2B') as ClassId;
  return {
    id: row.id,
    classId: resolvedClassId,
    class_id: resolvedClassId,
    day: row.day as SchoolDay,
    period: Number(row.period) || 1,
    subject: row.subject as SubjectName,
    title: row.title || '',
    details: row.details || undefined,
    pages: row.pages || undefined,
    completed: Boolean(row.completed),
    block: Number(row.block) || 1,
    week: Number(row.week) || 1,
    linkUrl: row.link_url || row.linkUrl || undefined,
    linkTitle: row.link_title || row.linkTitle || undefined,
  };
}

// Convert from ClassworkEntry to Row - Supports both class_id and classId
export function classworkToRow(entry: any): Omit<ClassworkRow, 'created_at'> {
  const resolvedClassId = entry.class_id || entry.classId || 'G2B';
  return {
    id: entry.id,
    class_id: resolvedClassId,
    day: entry.day,
    period: Number(entry.period) || 1,
    subject: entry.subject,
    title: entry.title || '',
    details: entry.details || null,
    pages: entry.pages || null,
    completed: Boolean(entry.completed),
    block: Number(entry.block) || 1,
    week: Number(entry.week) || 1,
    link_url: entry.link_url || entry.linkUrl || null,
    link_title: entry.link_title || entry.linkTitle || null,
  };
}

// Helper to pack and unpack homework details to support storing pdfUrl in details column without DB schema change
export function unpackHomeworkDetails(detailsStr?: string | null) {
  if (!detailsStr) return { details: undefined, pdfUrl: undefined };
  const parts = detailsStr.split('||PDF_URL:');
  return {
    details: parts[0]?.trim() || undefined,
    pdfUrl: parts[1]?.trim() || undefined,
  };
}

export function packHomeworkDetails(details?: string, pdfUrl?: string) {
  let res = details?.trim() || '';
  if (pdfUrl) {
    res += ` ||PDF_URL:${pdfUrl.trim()}`;
  }
  return res || undefined;
}

// Convert from Row to HomeworkEntry - Supports both class_id and classId interchangeably
export function rowToHomework(row: any): HomeworkEntry {
  const unpacked = unpackHomeworkDetails(row.details);
  const resolvedClassId = (row.class_id || row.classId || 'G2B') as ClassId;
  return {
    id: row.id,
    classId: resolvedClassId,
    class_id: resolvedClassId,
    assignedDay: (row.assigned_day || row.assignedDay) as SchoolDay,
    dueDay: (row.due_day || row.dueDay) as SchoolDay,
    subject: row.subject as SubjectName,
    task: row.task || '',
    details: unpacked.details,
    pages: row.pages || undefined,
    completed: Boolean(row.completed),
    priority: (row.priority as 'normal' | 'urgent') || 'normal',
    block: Number(row.block) || 1,
    week: Number(row.week) || 1,
    isLinkTask: Boolean(row.is_link_task ?? row.isLinkTask),
    linkUrl: row.link_url || row.linkUrl || undefined,
    pdfUrl: unpacked.pdfUrl || row.pdfUrl || undefined,
  };
}

// Convert from HomeworkEntry to Row - Supports both class_id and classId
export function homeworkToRow(entry: any): Omit<HomeworkRow, 'created_at'> {
  const resolvedClassId = entry.class_id || entry.classId || 'G2B';
  return {
    id: entry.id,
    class_id: resolvedClassId,
    assigned_day: entry.assigned_day || entry.assignedDay,
    due_day: entry.due_day || entry.dueDay,
    subject: entry.subject,
    task: entry.task || '',
    details: packHomeworkDetails(entry.details, entry.pdfUrl) || null,
    pages: entry.pages || null,
    completed: Boolean(entry.completed),
    priority: entry.priority || 'normal',
    block: Number(entry.block) || 1,
    week: Number(entry.week) || 1,
    is_link_task: Boolean(entry.is_link_task ?? entry.isLinkTask),
    link_url: entry.link_url || entry.linkUrl || null,
  };
}

// Local persistence keys for offline and unconfigured Supabase environments
const LOCAL_STORAGE_CUSTOM_CLASSWORK = 'nile_planner_custom_classwork';
const LOCAL_STORAGE_CUSTOM_HOMEWORK = 'nile_planner_custom_homework';

// Remove obsolete historical planner keys if any exist
if (typeof window !== 'undefined') {
  try {
    const obsoleteKeys = [
      'nile_planner_custom_classwork',
      'nile_planner_custom_homework',
      'nile_planner_custom_classwork_v2',
      'nile_planner_custom_homework_v2',
      'nile_planner_guest_progress_v2',
      'school_materials_fallback',
    ];
    obsoleteKeys.forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  } catch {}
}

export const appStorage = {
  getItem: (k: string) => {
    try {
      return typeof window !== 'undefined' ? window.localStorage?.getItem(k) : null;
    } catch {
      return null;
    }
  },
  setItem: (k: string, v: string) => {
    try {
      if (typeof window !== 'undefined') window.localStorage?.setItem(k, v);
    } catch {}
  },
  removeItem: (k: string) => {
    try {
      if (typeof window !== 'undefined') window.localStorage?.removeItem(k);
    } catch {}
  },
};

const LOCAL_CUSTOM_HW_KEY = 'homework_planner_custom_entries_v3';
const LOCAL_CUSTOM_CW_KEY = 'classwork_planner_custom_entries_v3';

export function getLocalCustomClasswork(): ClassworkEntry[] {
  try {
    const raw = appStorage.getItem(LOCAL_CUSTOM_CW_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveLocalCustomClasswork(entries: ClassworkEntry[], mode: 'merge' | 'replace' = 'merge') {
  try {
    if (mode === 'replace') {
      appStorage.setItem(LOCAL_CUSTOM_CW_KEY, JSON.stringify(entries));
      return;
    }
    const current = getLocalCustomClasswork();
    const map = new Map<string, ClassworkEntry>();
    current.forEach((c) => { if (c && c.id) map.set(c.id, c); });
    entries.forEach((c) => { if (c && c.id) map.set(c.id, c); });
    appStorage.setItem(LOCAL_CUSTOM_CW_KEY, JSON.stringify(Array.from(map.values())));
  } catch {}
}

export function getLocalCustomHomework(): HomeworkEntry[] {
  try {
    const raw = appStorage.getItem(LOCAL_CUSTOM_HW_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveLocalCustomHomework(entries: HomeworkEntry[], mode: 'merge' | 'replace' = 'merge') {
  try {
    if (mode === 'replace') {
      appStorage.setItem(LOCAL_CUSTOM_HW_KEY, JSON.stringify(entries));
      return;
    }
    const current = getLocalCustomHomework();
    const map = new Map<string, HomeworkEntry>();
    current.forEach((h) => { if (h && h.id) map.set(h.id, h); });
    entries.forEach((h) => { if (h && h.id) map.set(h.id, h); });
    appStorage.setItem(LOCAL_CUSTOM_HW_KEY, JSON.stringify(Array.from(map.values())));
  } catch {}
}

// =========================================================================
// CRUD Operations for Classwork
// =========================================================================

export async function fetchAllClasswork(): Promise<ClassworkEntry[]> {
  const deletedIds = await getDeletedPlannerItemIds();
  const deletedSet = new Set(deletedIds);

  // Load Week 1 and Week 2 statically to be extremely fast and lightweight as per user request
  const staticItems = INITIAL_CLASSWORK.filter((c) => (c.week || 1) < 3);
  const resultList: ClassworkEntry[] = [...staticItems];

  // If Supabase is configured, fetch directly from cloud database with a 3.5s timeout
  if (isSupabaseConfigured) {
    try {
      // ONLY fetch Week 3 classwork from Supabase to dramatically reduce database overhead and speed up the app!
      const res = await withTimeout<any>(
        supabase.from('classwork').select('*').eq('week', 3).order('period', { ascending: true }),
        3500,
        { data: null, error: { message: 'Supabase classwork query timeout' } }
      );
      const { data, error } = res;

      if (!error && data && Array.isArray(data)) {
        const dbItems = (data as ClassworkRow[]).map(rowToClasswork);

        const map = new Map<string, ClassworkEntry>();
        if (dbItems.length > 0) {
          // Cloud database is active: use as single source of truth without resurrecting deleted items
          dbItems.forEach((c) => {
            if (c && c.id && !deletedSet.has(c.id)) map.set(c.id, c);
          });
          const localCustom = getLocalCustomClasswork();
          localCustom.forEach((c) => {
            if (c && c.id && (c.week || 1) === 3 && !deletedSet.has(c.id)) map.set(c.id, c);
          });
        } else {
          // Fresh unseeded database
          INITIAL_CLASSWORK.filter((c) => (c.week || 1) === 3).forEach((c) => {
            if (c && c.id && !deletedSet.has(c.id)) map.set(c.id, c);
          });
        }
        resultList.push(...Array.from(map.values()));
        return resultList;
      }
    } catch (err) {
      console.warn('Network exception fetching classwork from Supabase (falling back):', err);
    }
  }

  // Fallback ONLY if Supabase is unconfigured or returns offline/empty
  const localCustom = getLocalCustomClasswork();
  let baseItems = [...INITIAL_CLASSWORK];

  // 1. Fetch from server-side centralized storage for cross-device sync (Laptop, Mobile, Desktop)
  try {
    const res = await fetch('/api/planner-data');
    if (res.ok) {
      const srvData = await res.json();
      if (srvData && Array.isArray(srvData.classwork) && srvData.classwork.length > 0) {
        const srvKeys = new Set(
          srvData.classwork.map((c: ClassworkEntry) => `${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)
        );
        baseItems = baseItems.filter(
          (c) => !srvKeys.has(`${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)
        );
        const srvMap = new Map<string, ClassworkEntry>();
        baseItems.forEach((c) => srvMap.set(c.id, c));
        srvData.classwork.forEach((c: ClassworkEntry) => srvMap.set(c.id, c));
        baseItems = Array.from(srvMap.values());
      }
    }
  } catch (err) {
    // Server fetch fallback
  }

  // Merge srvData and localCustom over baseItems
  const map = new Map<string, ClassworkEntry>();
  baseItems.forEach((c) => {
    if (c && c.id && !deletedSet.has(c.id)) map.set(c.id, c);
  });
  localCustom.forEach((c) => {
    if (c && c.id && !deletedSet.has(c.id)) map.set(c.id, c);
  });
  return Array.from(map.values());
}

export async function upsertClasswork(entry: ClassworkEntry): Promise<ClassworkEntry> {
  // If item was previously deleted, un-delete it
  await removeDeletedPlannerItemId(entry.id);
  saveLocalCustomClasswork([entry]);

  // Centralized cross-device sync backup
  try {
    await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classwork: [entry], mode: 'merge' }),
    });
  } catch (err) {
    console.warn('Central server sync error in upsertClasswork:', err);
  }

  if (!isSupabaseConfigured) {
    return entry;
  }

  try {
    const row = classworkToRow(entry);
    const { data, error } = await supabase
      .from('classwork')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Warning upserting classwork to Supabase:', error.message || error);
      return entry;
    }

    return rowToClasswork(data as ClassworkRow);
  } catch (e) {
    console.warn('Network exception upserting classwork:', e);
    return entry;
  }
}

export async function updateClassworkCompletion(id: string, completed: boolean): Promise<void> {
  const local = getLocalCustomClasswork();
  const target = local.find((c) => c.id === id);
  if (target) {
    target.completed = completed;
    saveLocalCustomClasswork([target]);

    // Centralized cross-device sync backup
    try {
      await fetch('/api/planner-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classwork: [target], mode: 'merge' }),
      });
    } catch (err) {
      console.warn('Central server sync error in updateClassworkCompletion:', err);
    }
  }

  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase
      .from('classwork')
      .update({ completed })
      .eq('id', id);

    if (error) {
      console.warn(`Warning updating classwork ${id} completion:`, error.message || error);
    }
  } catch (e) {
    console.warn(`Network error updating classwork ${id} completion:`, e);
  }
}

const DELETED_ITEMS_STORAGE_KEY = 'nile_deleted_planner_item_ids_v3';

export async function getDeletedPlannerItemIds(): Promise<string[]> {
  let localList: string[] = [];
  try {
    const localRaw = appStorage.getItem(DELETED_ITEMS_STORAGE_KEY);
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed)) localList = parsed;
    }
  } catch {}

  try {
    const res = await fetch('/api/planner-data');
    if (res.ok) {
      const srvData = await res.json();
      if (Array.isArray(srvData.deletedPlannerItemIds)) {
        localList = Array.from(new Set([...localList, ...srvData.deletedPlannerItemIds]));
      }
    }
  } catch {}

  if (!isSupabaseConfigured) return localList;

  try {
    const { data, error } = await supabase
      .from('planner_settings')
      .select('value')
      .eq('key', 'deleted_planner_item_ids')
      .maybeSingle();
    if (!error && data && data.value) {
      const dbList = JSON.parse(data.value);
      if (Array.isArray(dbList)) {
        const combined = Array.from(new Set([...localList, ...dbList]));
        appStorage.setItem(DELETED_ITEMS_STORAGE_KEY, JSON.stringify(combined));
        return combined;
      }
    }
  } catch (e) {
    console.warn('Error fetching deleted planner item ids:', e);
  }
  return localList;
}

export async function saveDeletedPlannerItemId(itemId: string): Promise<void> {
  let currentList = await getDeletedPlannerItemIds();
  if (!currentList.includes(itemId)) {
    currentList.push(itemId);
  }
  appStorage.setItem(DELETED_ITEMS_STORAGE_KEY, JSON.stringify(currentList));

  if (!isSupabaseConfigured) return;
  try {
    await supabase
      .from('planner_settings')
      .upsert({
        key: 'deleted_planner_item_ids',
        value: JSON.stringify(currentList),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
  } catch (e) {
    console.warn('Error saving deleted planner item id to Supabase settings:', e);
  }
}

export async function removeDeletedPlannerItemId(itemId: string): Promise<void> {
  let currentList = await getDeletedPlannerItemIds();
  if (currentList.includes(itemId)) {
    currentList = currentList.filter(id => id !== itemId);
    appStorage.setItem(DELETED_ITEMS_STORAGE_KEY, JSON.stringify(currentList));
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('planner_settings')
          .upsert({
            key: 'deleted_planner_item_ids',
            value: JSON.stringify(currentList),
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });
      } catch (e) {
        console.warn('Error removing deleted planner item id from Supabase settings:', e);
      }
    }
  }
}

export async function deleteClasswork(id: string): Promise<void> {
  await saveDeletedPlannerItemId(id);

  // Remove from local custom classwork storage immediately
  try {
    const current = getLocalCustomClasswork();
    const updated = current.filter((c) => c.id !== id);
    appStorage.setItem(LOCAL_CUSTOM_CW_KEY, JSON.stringify(updated));
  } catch {}

  // Centralized cross-device sync backup
  try {
    await fetch('/api/planner-data/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'classwork' }),
    });
  } catch (err) {
    console.warn('Central server delete error in deleteClasswork:', err);
  }

  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase.from('classwork').delete().eq('id', id);
    if (error) {
      console.warn(`Warning deleting classwork ${id}:`, error.message || error);
    }
  } catch (e) {
    console.warn(`Network error deleting classwork ${id}:`, e);
  }
}

export async function bulkInsertClasswork(entries: ClassworkEntry[], mode: 'merge' | 'replace' = 'merge'): Promise<void> {
  if (entries.length === 0) return;
  saveLocalCustomClasswork(entries, mode);

  // Centralized cross-device sync backup
  try {
    await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classwork: entries, mode }),
    });
  } catch (err) {
    console.warn('Central server sync error in bulkInsertClasswork:', err);
  }

  if (!isSupabaseConfigured) return;

  const rows = entries.map(classworkToRow);
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    try {
      const { error } = await supabase.from('classwork').upsert(chunk, { onConflict: 'id' });
      if (error) {
        console.warn('Warning bulk inserting classwork chunk:', error.message || error);
      }
    } catch (e) {
      console.warn('Network exception bulk inserting classwork chunk:', e);
    }
  }
}

// =========================================================================
// CRUD Operations for Homework
// =========================================================================

export async function fetchAllHomework(): Promise<HomeworkEntry[]> {
  const deletedIds = await getDeletedPlannerItemIds();
  const deletedSet = new Set(deletedIds);

  // Load Week 1 and Week 2 statically to be extremely fast and lightweight as per user request
  const staticItems = INITIAL_HOMEWORK.filter((h) => (h.week || 1) < 3);
  const resultList: HomeworkEntry[] = [...staticItems];

  // If Supabase is configured, fetch directly from cloud database with a 3.5s timeout
  if (isSupabaseConfigured) {
    try {
      // ONLY fetch Week 3 homework from Supabase to dramatically reduce database overhead and speed up the app!
      const res = await withTimeout<any>(
        supabase.from('homework').select('*').eq('week', 3).order('created_at', { ascending: false }),
        3500,
        { data: null, error: { message: 'Supabase homework query timeout' } }
      );
      const { data, error } = res;

      if (!error && data && Array.isArray(data)) {
        const dbItems = (data as HomeworkRow[]).map(rowToHomework);
        
        // Ensure Tuesday Week 2 Arabic homework is page 47 (if any exist)
        dbItems.forEach(item => {
          const isTargetArabicHw =
            item.id === 'hw-w2-ar-tue-g2a-wb' ||
            item.id === 'hw-w2-ar-tue-g2b-wb' ||
            item.id === 'hw-w2-ar-tue-g2c-wb' ||
            (item.subject === 'Arabic' && item.assignedDay === 'Tuesday' && item.week === 2);

          if (
            isTargetArabicHw &&
            item.task &&
            (item.task.includes('46') || (item.pages && item.pages.includes('46')) || (item.details && item.details.includes('46')))
          ) {
            item.task = item.task.replace(/46/g, '47');
            if (item.pages) item.pages = item.pages.replace(/46/g, '47');
            if (item.details) item.details = item.details.replace(/46/g, '47');
          }
        });

        const map = new Map<string, HomeworkEntry>();
        if (dbItems.length > 0) {
          // Cloud database is active: use as single source of truth without resurrecting deleted items
          dbItems.forEach((h) => {
            // Exclude Tuesday Dictation / Dictation Alert for Week 3
            const isTuesdayDictation = h.week === 3 && h.assignedDay === 'Tuesday' && 
              (/dictation|إملاء|تنبيه إملاء/.test((h.task || '').toLowerCase()) || /dictation|إملاء|تنبيه إملاء/.test((h.subject || '').toLowerCase()));
            if (isTuesdayDictation) return;

            if (h && h.id && !deletedSet.has(h.id)) map.set(h.id, h);
          });
          const localCustom = getLocalCustomHomework();
          localCustom.forEach((h) => {
            // Exclude Tuesday Dictation / Dictation Alert for Week 3
            const isTuesdayDictation = h.week === 3 && h.assignedDay === 'Tuesday' && 
              (/dictation|إملاء|تنبيه إملاء/.test((h.task || '').toLowerCase()) || /dictation|إملاء|تنبيه إملاء/.test((h.subject || '').toLowerCase()));
            if (isTuesdayDictation) return;

            if (h && h.id && (h.week || 1) === 3 && !deletedSet.has(h.id)) map.set(h.id, h);
          });
        } else {
          // Fresh unseeded database for Week 3
          INITIAL_HOMEWORK.filter((h) => (h.week || 1) === 3).forEach((h) => {
            // Exclude Tuesday Dictation / Dictation Alert for Week 3
            const isTuesdayDictation = h.week === 3 && h.assignedDay === 'Tuesday' && 
              (/dictation|إملاء|تنبيه إملاء/.test((h.task || '').toLowerCase()) || /dictation|إملاء|تنبيه إملاء/.test((h.subject || '').toLowerCase()));
            if (isTuesdayDictation) return;

            if (h && h.id && !deletedSet.has(h.id)) map.set(h.id, h);
          });
        }
        
        resultList.push(...Array.from(map.values()));
        return resultList;
      }
    } catch (err) {
      console.warn('Network exception fetching homework from Supabase (falling back):', err);
    }
  }

  // Fallback ONLY if Supabase is unconfigured or returns offline/empty
  const localCustom = getLocalCustomHomework();
  let baseItems = [...INITIAL_HOMEWORK];

  // 1. Fetch from server-side centralized storage for cross-device sync (Laptop, Mobile, Desktop)
  try {
    const res = await fetch('/api/planner-data');
    if (res.ok) {
      const srvData = await res.json();
      if (srvData && Array.isArray(srvData.homework) && srvData.homework.length > 0) {
        const srvKeys = new Set(
          srvData.homework.map((h: HomeworkEntry) => `${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)
        );
        baseItems = baseItems.filter(
          (h) => !srvKeys.has(`${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)
        );
        const srvMap = new Map<string, HomeworkEntry>();
        baseItems.forEach((h) => srvMap.set(h.id, h));
        srvData.homework.forEach((h: HomeworkEntry) => srvMap.set(h.id, h));
        baseItems = Array.from(srvMap.values());
      }
    }
  } catch (err) {
    // Server fetch fallback
  }

  // Ensure Tuesday Week 2 Arabic homework is page 47
  const normalizedBase = baseItems.map((item) => {
    const isTargetArabicHw =
      item.id === 'hw-w2-ar-tue-g2a-wb' ||
      item.id === 'hw-w2-ar-tue-g2b-wb' ||
      item.id === 'hw-w2-ar-tue-g2c-wb' ||
      (item.subject === 'Arabic' && item.assignedDay === 'Tuesday' && item.week === 2);

    if (
      isTargetArabicHw &&
      (item.task.includes('46') || (item.pages && item.pages.includes('46')) || (item.details && item.details.includes('46')))
    ) {
      const corrected: HomeworkEntry = {
        ...item,
        task: item.task.replace(/46/g, '47'),
        pages: item.pages ? item.pages.replace(/46/g, '47') : '47',
        details: item.details ? item.details.replace(/46/g, '47') : item.details,
      };
      return corrected;
    }

    return item;
  });

  // Merge normalizedBase and localCustom
  const map = new Map<string, HomeworkEntry>();
  normalizedBase.forEach((h) => {
    // Exclude Tuesday Dictation / Dictation Alert for Week 3
    const isTuesdayDictation = h.week === 3 && h.assignedDay === 'Tuesday' && 
      (/dictation|إملاء|تنبيه إملاء/.test((h.task || '').toLowerCase()) || /dictation|إملاء|تنبيه إملاء/.test((h.subject || '').toLowerCase()));
    if (isTuesdayDictation) return;

    if (h && h.id && !deletedSet.has(h.id)) map.set(h.id, h);
  });
  localCustom.forEach((h) => {
    // Exclude Tuesday Dictation / Dictation Alert for Week 3
    const isTuesdayDictation = h.week === 3 && h.assignedDay === 'Tuesday' && 
      (/dictation|إملاء|تنبيه إملاء/.test((h.task || '').toLowerCase()) || /dictation|إملاء|تنبيه إملاء/.test((h.subject || '').toLowerCase()));
    if (isTuesdayDictation) return;

    if (h && h.id && !deletedSet.has(h.id)) map.set(h.id, h);
  });
  
  return Array.from(map.values());
}

export async function upsertHomework(entry: HomeworkEntry): Promise<HomeworkEntry> {
  // If item was previously deleted, un-delete it
  await removeDeletedPlannerItemId(entry.id);
  saveLocalCustomHomework([entry]);

  // Centralized cross-device sync backup
  try {
    await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homework: [entry], mode: 'merge' }),
    });
  } catch (err) {
    console.warn('Central server sync error in upsertHomework:', err);
  }

  if (!isSupabaseConfigured) {
    return entry;
  }

  try {
    const row = homeworkToRow(entry);
    const { data, error } = await supabase
      .from('homework')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Warning upserting homework to Supabase:', error.message || error);
      return entry;
    }

    return rowToHomework(data as HomeworkRow);
  } catch (e) {
    console.warn('Network exception upserting homework:', e);
    return entry;
  }
}

export async function updateHomeworkCompletion(id: string, completed: boolean): Promise<void> {
  const local = getLocalCustomHomework();
  const target = local.find((h) => h.id === id);
  if (target) {
    target.completed = completed;
    saveLocalCustomHomework([target]);

    // Centralized cross-device sync backup
    try {
      await fetch('/api/planner-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homework: [target], mode: 'merge' }),
      });
    } catch (err) {
      console.warn('Central server sync error in updateHomeworkCompletion:', err);
    }
  }

  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase
      .from('homework')
      .update({ completed })
      .eq('id', id);

    if (error) {
      console.warn(`Warning updating homework ${id} completion:`, error.message || error);
    }
  } catch (e) {
    console.warn(`Network error updating homework ${id} completion:`, e);
  }
}

export async function deleteHomework(id: string): Promise<void> {
  await saveDeletedPlannerItemId(id);

  // Remove from local custom homework storage immediately
  try {
    const current = getLocalCustomHomework();
    const updated = current.filter((h) => h.id !== id);
    appStorage.setItem(LOCAL_CUSTOM_HW_KEY, JSON.stringify(updated));
  } catch {}

  // Centralized cross-device sync backup
  try {
    await fetch('/api/planner-data/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'homework' }),
    });
  } catch (err) {
    console.warn('Central server delete error in deleteHomework:', err);
  }

  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase.from('homework').delete().eq('id', id);
    if (error) {
      console.warn(`Warning deleting homework ${id}:`, error.message || error);
    }
  } catch (e) {
    console.warn(`Network error deleting homework ${id}:`, e);
  }
}

export async function bulkInsertHomework(entries: HomeworkEntry[], mode: 'merge' | 'replace' = 'merge'): Promise<void> {
  if (entries.length === 0) return;
  saveLocalCustomHomework(entries, mode);

  // Centralized cross-device sync backup
  try {
    await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homework: entries, mode }),
    });
  } catch (err) {
    console.warn('Central server sync error in bulkInsertHomework:', err);
  }

  if (!isSupabaseConfigured) return;

  const rows = entries.map(homeworkToRow);
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    try {
      const { error } = await supabase.from('homework').upsert(chunk, { onConflict: 'id' });
      if (error) {
        console.warn('Warning bulk inserting homework chunk:', error.message || error);
      }
    } catch (e) {
      console.warn('Network error bulk inserting homework chunk:', e);
    }
  }
}

// =========================================================================
// Planner App Settings (Class, Week, Day, Profile)
// =========================================================================

export async function fetchPlannerSettings(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) return {};

  try {
    const res = await withTimeout<any>(
      supabase.from('planner_settings').select('*'),
      2500,
      { data: null, error: { message: 'Settings query timeout' } }
    );
    const { data, error } = res;
    if (error || !data) {
      return {};
    }

    const map: Record<string, string> = {};
    for (const item of data || []) {
      map[item.key] = item.value;
    }
    return map;
  } catch {
    return {};
  }
}

export async function savePlannerSetting(key: string, value: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('planner_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) {
    console.warn(`Could not save planner setting ${key} to Supabase:`, error.message);
  }
}

// =========================================================================
// Student Progress (Saved per Student)
// =========================================================================

export async function fetchStudentProgressFromDb(studentName: string): Promise<{
  studentName: string;
  classId?: ClassId;
  completedClassworkIds: string[];
  completedHomeworkIds: string[];
  lastActive: number;
} | null> {
  if (!isSupabaseConfigured) return null;

  const clean = studentName.trim().toLowerCase();
  const { data, error } = await supabase
    .from('student_progress')
    .select('*')
    .eq('student_name', clean)
    .maybeSingle();

  if (error || !data) return null;

  return {
    studentName: data.student_name,
    classId: (data.class_id as ClassId) || undefined,
    completedClassworkIds: Array.isArray(data.completed_classwork_ids) ? data.completed_classwork_ids : [],
    completedHomeworkIds: Array.isArray(data.completed_homework_ids) ? data.completed_homework_ids : [],
    lastActive: data.last_active || Date.now(),
  };
}

export async function saveStudentProgressToDb(
  studentName: string,
  completedClassworkIds: string[],
  completedHomeworkIds: string[],
  classId?: ClassId
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const clean = studentName.trim().toLowerCase();
  const { error } = await supabase.from('student_progress').upsert(
    {
      student_name: clean,
      class_id: classId || null,
      completed_classwork_ids: completedClassworkIds,
      completed_homework_ids: completedHomeworkIds,
      last_active: Date.now(),
    },
    { onConflict: 'student_name' }
  );

  if (error) {
    console.warn(`Could not save progress for ${studentName} to Supabase:`, error.message);
  }
}

export async function fetchKnownStudentsFromDb(): Promise<{ name: string; classId?: ClassId; lastActive: number }[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('student_progress')
    .select('student_name, class_id, last_active')
    .order('last_active', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((d) => ({
    name: d.student_name,
    classId: (d.class_id as ClassId) || undefined,
    lastActive: d.last_active || Date.now(),
  }));
}

// =========================================================================
// Automated Seeding & Sync from data/planner_data.json
// =========================================================================

export interface SeedResult {
  success: boolean;
  seeded: boolean;
  classworkCount: number;
  homeworkCount: number;
  tomorrowNotesCount: number;
  message: string;
}

/**
 * Reads local planner data (data/planner_data.json) and uploads all lessons,
 * homework, and planner items to Supabase if empty or when forced.
 */
export async function seedSupabaseFromPlannerData(options?: { force?: boolean }): Promise<SeedResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      seeded: false,
      classworkCount: 0,
      homeworkCount: 0,
      tomorrowNotesCount: 0,
      message: 'قاعدة بيانات Supabase غير مهيأة بعد (يرجى إدخال الرابط والمفتاح في الإعدادات).',
    };
  }

  try {
    // 1. Retrieve planner data: try central /api/planner-data endpoint, fallback to bundled localPlannerData
    let plannerJson: {
      classwork: any[];
      homework: any[];
      tomorrowNotes?: any[];
      deletedTomorrowNoteIds?: string[];
      deletedPlannerItemIds?: string[];
    } = localPlannerData as any;

    try {
      const res = await withTimeout(fetch('/api/planner-data'), 2500, null as any);
      if (res && res.ok) {
        const srvJson = await res.json();
        if (srvJson && (Array.isArray(srvJson.classwork) || Array.isArray(srvJson.homework))) {
          plannerJson = srvJson;
        }
      }
    } catch {
      // Fallback directly to localPlannerData
    }

    const cwList: any[] = Array.isArray(plannerJson.classwork) ? plannerJson.classwork : [];
    const hwList: any[] = Array.isArray(plannerJson.homework) ? plannerJson.homework : [];
    const tnList: any[] = Array.isArray(plannerJson.tomorrowNotes) ? plannerJson.tomorrowNotes : [];

    // Clear/Overwrite local stored browser caches first to ensure no merging of old data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('classwork_planner_custom_entries_v3');
      localStorage.removeItem('homework_planner_custom_entries_v3');
      localStorage.removeItem('nile_deleted_planner_item_ids_v3');
      localStorage.removeItem('nile_deleted_tomorrow_note_ids_v3');
      localStorage.removeItem('nile_planner_custom_classwork');
      localStorage.removeItem('nile_planner_custom_homework');
    }

    // Always perform a complete overwrite (delete all existing records) when forced or when seeding to prevent duplication or merging
    console.log('🧹 Clearing existing classwork, homework, and special settings from Supabase for a clean overwrite...');
    try {
      await Promise.all([
        supabase.from('classwork').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('homework').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('planner_settings').delete().in('key', ['deleted_planner_item_ids', 'deleted_tomorrow_note_ids', 'tomorrow_special_notes'])
      ]);
    } catch (clearErr) {
      console.warn('Notice clearing existing Supabase data:', clearErr);
    }

    let seededCwCount = 0;
    let seededHwCount = 0;
    let seededTnCount = 0;

    // 3. Upload Classwork (الدروس والحصص)
    if (cwList.length > 0) {
      console.log(`🌱 Seeding ${cwList.length} classwork entries from planner_data.json into Supabase...`);
      const cwRows: any[] = [];
      const seenCwIds = new Set<string>();
      for (const cw of cwList) {
        if (cw.id && !seenCwIds.has(cw.id)) {
          seenCwIds.add(cw.id);
          const resolvedClassId = cw.class_id || cw.classId || 'G2B';
          cwRows.push({
            id: cw.id,
            class_id: resolvedClassId,
            day: cw.day,
            period: Number(cw.period) || 1,
            subject: cw.subject,
            title: cw.title || '',
            details: cw.details || null,
            pages: cw.pages || null,
            completed: Boolean(cw.completed),
            block: Number(cw.block) || 1,
            week: Number(cw.week) || 1,
            link_url: cw.link_url || cw.linkUrl || null,
            link_title: cw.link_title || cw.linkTitle || null,
          });
        }
      }

      for (let i = 0; i < cwRows.length; i += 50) {
        const chunk = cwRows.slice(i, i + 50);
        const { error } = await supabase.from('classwork').insert(chunk);
        if (error) {
          console.warn('Notice seeding classwork chunk:', error.message);
        } else {
          seededCwCount += chunk.length;
        }
      }
      saveLocalCustomClasswork(cwList.map((c: any) => ({
        ...c,
        classId: c.class_id || c.classId || 'G2B',
        class_id: c.class_id || c.classId || 'G2B',
      })), 'replace');
    }

    // 4. Upload Homework (الواجبات والمهام)
    if (hwList.length > 0) {
      console.log(`🌱 Seeding ${hwList.length} homework entries from planner_data.json into Supabase...`);
      const hwRows: any[] = [];
      const seenHwIds = new Set<string>();
      for (const hw of hwList) {
        if (hw.id && !seenHwIds.has(hw.id)) {
          seenHwIds.add(hw.id);
          const resolvedClassId = hw.class_id || hw.classId || 'G2B';
          hwRows.push({
            id: hw.id,
            class_id: resolvedClassId,
            assigned_day: hw.assigned_day || hw.assignedDay || 'Sunday',
            due_day: hw.due_day || hw.dueDay || 'Sunday',
            subject: hw.subject,
            task: hw.task || '',
            details: packHomeworkDetails(hw.details, hw.pdfUrl) || null,
            pages: hw.pages || null,
            completed: Boolean(hw.completed),
            priority: hw.priority || 'normal',
            block: Number(hw.block) || 1,
            week: Number(hw.week) || 1,
            is_link_task: Boolean(hw.is_link_task ?? hw.isLinkTask),
            link_url: hw.link_url || hw.linkUrl || null,
          });
        }
      }

      for (let i = 0; i < hwRows.length; i += 50) {
        const chunk = hwRows.slice(i, i + 50);
        const { error } = await supabase.from('homework').insert(chunk);
        if (error) {
          console.warn('Notice seeding homework chunk:', error.message);
        } else {
          seededHwCount += chunk.length;
        }
      }
      saveLocalCustomHomework(hwList, 'replace');
    }

    // 5. Upload Tomorrow Notes & Planner Settings (المخطط والملاحظات)
    if (tnList.length > 0) {
      try {
        await supabase.from('planner_settings').upsert({
          key: 'tomorrow_special_notes',
          value: JSON.stringify(tnList),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
        seededTnCount = tnList.length;
      } catch (err) {
        console.warn('Notice saving tomorrow_special_notes in settings:', err);
      }
    }

    // Save deleted items lists if any
    if (Array.isArray(plannerJson.deletedPlannerItemIds) && plannerJson.deletedPlannerItemIds.length > 0) {
      try {
        await supabase.from('planner_settings').upsert({
          key: 'deleted_planner_item_ids',
          value: JSON.stringify(plannerJson.deletedPlannerItemIds),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
      } catch {}
    }

    if (Array.isArray(plannerJson.deletedTomorrowNoteIds) && plannerJson.deletedTomorrowNoteIds.length > 0) {
      try {
        await supabase.from('planner_settings').upsert({
          key: 'deleted_tomorrow_note_ids',
          value: JSON.stringify(plannerJson.deletedTomorrowNoteIds),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
      } catch {}
    }

    // Upsert default planner settings if empty
    try {
      const defaultSettings = [
        { key: 'current_class', value: initialData.nile_planner_current_class_v3 || 'G2B' },
        { key: 'current_week', value: initialData.nile_planner_current_week_v3 || '3' },
        { key: 'selected_day', value: initialData.nile_planner_selected_day_v3 || 'Sunday' },
        { key: 'current_block', value: '1' },
      ];
      await supabase.from('planner_settings').upsert(defaultSettings, { onConflict: 'key' });
    } catch {}

    const wasSeeded = seededCwCount > 0 || seededHwCount > 0 || seededTnCount > 0;

    if (wasSeeded && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('supabase_data_seeded', {
          detail: {
            classworkCount: seededCwCount,
            homeworkCount: seededHwCount,
            tomorrowNotesCount: seededTnCount,
          },
        })
      );
    }

    return {
      success: true,
      seeded: wasSeeded,
      classworkCount: seededCwCount || cwList.length,
      homeworkCount: seededHwCount || hwList.length,
      tomorrowNotesCount: seededTnCount || tnList.length,
      message: wasSeeded
        ? `تم بنجاح استيراد ورفع ${seededCwCount} درساً و ${seededHwCount} واجباً و ${seededTnCount} ملاحظة من planner_data.json إلى Supabase!`
        : 'قاعدة بيانات Supabase تحتوي بالفعل على بيانات الدروس والواجبات.',
    };
  } catch (err: any) {
    console.error('Error during seedSupabaseFromPlannerData:', err);
    return {
      success: false,
      seeded: false,
      classworkCount: 0,
      homeworkCount: 0,
      tomorrowNotesCount: 0,
      message: `خطأ أثناء استيراد البيانات إلى Supabase: ${err.message || 'خطأ غير معروف'}`,
    };
  }
}

export async function seedInitialDataIfEmpty(): Promise<{
  seeded: boolean;
  classworkCount: number;
  homeworkCount: number;
}> {
  if (!isSupabaseConfigured) {
    return { seeded: false, classworkCount: 0, homeworkCount: 0 };
  }

  try {
    // Perform a fast, lightweight exact-count head query to check if database already has records
    const { count, error } = await supabase
      .from('classwork')
      .select('*', { count: 'exact', head: true });

    if (!error && count !== null && count > 0) {
      console.log('[Supabase] Database already contains records. Skipping auto-seed to prevent overriding deletes and edits.');
      return { seeded: false, classworkCount: 0, homeworkCount: 0 };
    }

    const res = await seedSupabaseFromPlannerData();
    return {
      seeded: res.seeded,
      classworkCount: res.classworkCount,
      homeworkCount: res.homeworkCount,
    };
  } catch (e) {
    console.warn('Error inside seedInitialDataIfEmpty:', e);
    return { seeded: false, classworkCount: 0, homeworkCount: 0 };
  }
}

export async function forceSyncBaselineToSupabase(): Promise<void> {
  if (!isSupabaseConfigured) return;
  await seedSupabaseFromPlannerData();
}

export async function deleteWeek3Data(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Clear local browser custom entries (especially if they belong to week 3)
    if (typeof window !== 'undefined') {
      const storedCw = localStorage.getItem('classwork_planner_custom_entries_v3');
      if (storedCw) {
        try {
          const list = JSON.parse(storedCw);
          const filtered = list.filter((c: any) => c.week !== 3);
          localStorage.setItem('classwork_planner_custom_entries_v3', JSON.stringify(filtered));
        } catch {}
      }
      
      const storedHw = localStorage.getItem('homework_planner_custom_entries_v3');
      if (storedHw) {
        try {
          const list = JSON.parse(storedHw);
          const filtered = list.filter((h: any) => h.week !== 3);
          localStorage.setItem('homework_planner_custom_entries_v3', JSON.stringify(filtered));
        } catch {}
      }

      const storedNileCw = localStorage.getItem('nile_planner_custom_classwork');
      if (storedNileCw) {
        try {
          const list = JSON.parse(storedNileCw);
          const filtered = list.filter((c: any) => c.week !== 3);
          localStorage.setItem('nile_planner_custom_classwork', JSON.stringify(filtered));
        } catch {}
      }

      const storedNileHw = localStorage.getItem('nile_planner_custom_homework');
      if (storedNileHw) {
        try {
          const list = JSON.parse(storedNileHw);
          const filtered = list.filter((h: any) => h.week !== 3);
          localStorage.setItem('nile_planner_custom_homework', JSON.stringify(filtered));
        } catch {}
      }
    }

    // 2. Call backend to clean planner_data.json on server and Supabase
    const response = await fetch('/api/supabase/delete-week3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const resJson = await response.json();

    // 3. Delete directly from Supabase if client is initialized
    if (isSupabaseConfigured && supabase) {
      await Promise.all([
        supabase.from('classwork').delete().eq('week', 3),
        supabase.from('homework').delete().eq('week', 3),
      ]);
    }

    // Dispatch custom event to notify all components to reload their data!
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('supabase_data_seeded'));
    }

    return {
      success: true,
      message: resJson.message || 'تم حذف جميع بيانات الأسبوع الثالث بنجاح!'
    };
  } catch (err: any) {
    console.error('Error during deleteWeek3Data:', err);
    return {
      success: false,
      message: `خطأ أثناء الحذف: ${err.message || 'خطأ غير معروف'}`
    };
  }
}

// =============================================================================
// Materials & PDF Cloud Storage Functions (Supabase Storage + Database)
// =============================================================================

export interface MaterialRow {
  id: string;
  file_name: string;
  file_size: number;
  block: number;
  section: string;
  class_id: string | null;
  storage_url: string | null;
  file_data: string | null;
  uploaded_at: string;
}

export function materialToRow(item: MaterialItem): MaterialRow {
  const effectiveUrl = item.type === 'link' ? (item.linkUrl || item.storageUrl || null) : (item.storageUrl || null);
  return {
    id: item.id,
    file_name: item.fileName,
    file_size: item.fileSize || 0,
    block: item.block,
    section: item.section,
    class_id: item.classId || 'ALL',
    storage_url: effectiveUrl,
    // Only save file_data if small (< 1.5MB) to prevent large DB payloads
    file_data: item.fileSize < 1500000 ? (item.fileData || null) : null,
    uploaded_at: item.uploadedAt || new Date().toISOString(),
  };
}

export function rowToMaterial(row: MaterialRow): MaterialItem {
  const isWebUrl = Boolean(
    row.storage_url &&
    (row.storage_url.startsWith('http://') || row.storage_url.startsWith('https://')) &&
    !row.storage_url.toLowerCase().endsWith('.pdf') &&
    !row.storage_url.includes('.pdf?')
  );
  const isLink = isWebUrl || row.file_size === 0;

  return {
    id: row.id,
    fileName: row.file_name,
    fileSize: row.file_size,
    block: row.block,
    section: row.section,
    classId: (row.class_id as ClassId | 'ALL') || 'ALL',
    storageUrl: row.storage_url || undefined,
    linkUrl: isLink ? (row.storage_url || undefined) : undefined,
    type: isLink ? 'link' : 'pdf',
    fileData: row.file_data || undefined,
    uploadedAt: row.uploaded_at,
  };
}

/**
 * Upload a PDF file directly to Supabase Storage ('materials' bucket)
 * Returns the public URL if successful.
 */
export async function uploadPdfToSupabaseStorage(
  file: File | Blob,
  fileName: string
): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const bucketName = 'materials';
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${Date.now()}_${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
      });

    if (uploadError) {
      console.warn('Storage upload notice (falling back to database or local):', uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    return publicUrlData.publicUrl || null;
  } catch (e) {
    console.warn('Network exception during Supabase Storage upload:', e);
    return null;
  }
}

/**
 * Fetch all materials metadata from Supabase 'materials' table
 */
export async function fetchAllMaterialsFromSupabase(): Promise<MaterialItem[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch materials notice:', error.message);
      return [];
    }

    return (data as MaterialRow[]).map(rowToMaterial);
  } catch (err) {
    console.warn('Network exception fetching materials:', err);
    return [];
  }
}

/**
 * Upsert material metadata record to Supabase
 */
export async function saveMaterialToSupabase(item: MaterialItem): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const row = materialToRow(item);
    const { error } = await supabase
      .from('materials')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase save material notice:', error.message);
    }
  } catch (err) {
    console.warn('Network exception saving material:', err);
  }
}

/**
 * Delete material from Supabase table and Storage if present
 */
export async function deleteMaterialFromSupabase(id: string, storageUrl?: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    // 1. Delete from database
    await supabase.from('materials').delete().eq('id', id);

    // 2. If storageUrl points to materials, attempt file deletion
    if (storageUrl && (storageUrl.includes('school_materials') || storageUrl.includes('materials'))) {
      const parts = storageUrl.split(storageUrl.includes('school_materials') ? '/school_materials/' : '/materials/');
      if (parts[1]) {
        await supabase.storage.from('materials').remove([parts[1]]);
      }
    }
  } catch (err) {
    console.warn('Network exception deleting material from Supabase:', err);
  }
}

