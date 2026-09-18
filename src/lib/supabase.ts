import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClassId, ClassworkEntry, HomeworkEntry, SchoolDay, SubjectName, MaterialItem } from '../types';
import { INITIAL_CLASSWORK, INITIAL_HOMEWORK } from '../data/defaultWeeklyPlan';
import initialData from '../data/initialData.json';

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
  let url = '';
  let key = '';
  if (typeof window !== 'undefined') {
    url = localStorage.getItem(STORAGE_KEYS_SUPABASE.URL) || '';
    key = localStorage.getItem(STORAGE_KEYS_SUPABASE.KEY) || '';
  }
  if (!url) {
    url = (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
  }
  if (!key) {
    key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;
  }
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

export async function syncSupabaseConfigWithServer(): Promise<boolean> {
  try {
    const localUrl = localStorage.getItem(STORAGE_KEYS_SUPABASE.URL) || '';
    const localKey = localStorage.getItem(STORAGE_KEYS_SUPABASE.KEY) || '';
    
    // 1. Check server-side Supabase credentials
    const res = await fetch('/api/supabase-config');
    let hasUpdatedLocal = false;
    if (res.ok) {
      const srvConfig = await res.json();
      if (srvConfig && srvConfig.url && srvConfig.key) {
        const cleanedUrl = cleanSupabaseUrl(srvConfig.url);
        const cleanedKey = cleanSupabaseKey(srvConfig.key);
        
        if (cleanedUrl !== localUrl || cleanedKey !== localKey) {
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
        // If server is unconfigured, but laptop has config, upload it to the server
        console.log('[Supabase Sync] Server has no config. Uploading local configuration to server...');
        await fetch('/api/supabase-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: localUrl, key: localKey }),
        });
      }
    }

    // 2. Upload any existing local custom classwork/homework to the centralized server backup file
    // so that it propagates to mobile devices automatically
    const localCw = getLocalCustomClasswork();
    const localHw = getLocalCustomHomework();
    if (localCw.length > 0 || localHw.length > 0) {
      // Fetch current server data first
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
    
    return hasUpdatedLocal;
  } catch (e) {
    console.warn('[Supabase Sync] Could not fetch/sync shared config:', e);
  }
  return false;
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

// Convert from Row to ClassworkEntry
export function rowToClasswork(row: ClassworkRow): ClassworkEntry {
  return {
    id: row.id,
    classId: row.class_id as ClassId,
    day: row.day as SchoolDay,
    period: row.period,
    subject: row.subject as SubjectName,
    title: row.title,
    details: row.details || undefined,
    pages: row.pages || undefined,
    completed: Boolean(row.completed),
    block: row.block || 1,
    week: row.week || 1,
    linkUrl: row.link_url || undefined,
    linkTitle: row.link_title || undefined,
  };
}

// Convert from ClassworkEntry to Row
export function classworkToRow(entry: ClassworkEntry): Omit<ClassworkRow, 'created_at'> {
  return {
    id: entry.id,
    class_id: entry.classId,
    day: entry.day,
    period: entry.period,
    subject: entry.subject,
    title: entry.title,
    details: entry.details || null,
    pages: entry.pages || null,
    completed: Boolean(entry.completed),
    block: entry.block || 1,
    week: entry.week || 1,
    link_url: entry.linkUrl || null,
    link_title: entry.linkTitle || null,
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

// Convert from Row to HomeworkEntry
export function rowToHomework(row: HomeworkRow): HomeworkEntry {
  const unpacked = unpackHomeworkDetails(row.details);
  return {
    id: row.id,
    classId: row.class_id as ClassId,
    assignedDay: row.assigned_day as SchoolDay,
    dueDay: row.due_day as SchoolDay,
    subject: row.subject as SubjectName,
    task: row.task,
    details: unpacked.details,
    pages: row.pages || undefined,
    completed: Boolean(row.completed),
    priority: (row.priority as 'normal' | 'urgent') || 'normal',
    block: row.block || 1,
    week: row.week || 1,
    isLinkTask: Boolean(row.is_link_task),
    linkUrl: row.link_url || undefined,
    pdfUrl: unpacked.pdfUrl,
  };
}

// Convert from HomeworkEntry to Row
export function homeworkToRow(entry: HomeworkEntry): Omit<HomeworkRow, 'created_at'> {
  return {
    id: entry.id,
    class_id: entry.classId,
    assigned_day: entry.assignedDay,
    due_day: entry.dueDay,
    subject: entry.subject,
    task: entry.task,
    details: packHomeworkDetails(entry.details, entry.pdfUrl) || null,
    pages: entry.pages || null,
    completed: Boolean(entry.completed),
    priority: entry.priority || 'normal',
    block: entry.block || 1,
    week: entry.week || 1,
    is_link_task: Boolean(entry.isLinkTask),
    link_url: entry.linkUrl || null,
  };
}

// Local persistence keys for offline and unconfigured Supabase environments
const LOCAL_STORAGE_CUSTOM_CLASSWORK = 'nile_planner_custom_classwork';
const LOCAL_STORAGE_CUSTOM_HOMEWORK = 'nile_planner_custom_homework';

function getLocalCustomClasswork(): ClassworkEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_CLASSWORK);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomClasswork(entries: ClassworkEntry[], mode: 'merge' | 'replace' = 'merge') {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalCustomClasswork();
    let updated: ClassworkEntry[];
    if (mode === 'replace') {
      const targetKeys = new Set(
        entries.map((c) => `${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)
      );
      updated = existing.filter(
        (c) => !targetKeys.has(`${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)
      );
      updated = [...updated, ...entries];
    } else {
      const map = new Map<string, ClassworkEntry>();
      existing.forEach((e) => map.set(e.id, e));
      entries.forEach((e) => map.set(e.id, e));
      updated = Array.from(map.values());
    }
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_CLASSWORK, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save custom classwork to localStorage:', e);
  }
}

function getLocalCustomHomework(): HomeworkEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_HOMEWORK);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomHomework(entries: HomeworkEntry[], mode: 'merge' | 'replace' = 'merge') {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalCustomHomework();
    let updated: HomeworkEntry[];
    if (mode === 'replace') {
      const targetKeys = new Set(
        entries.map((h) => `${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)
      );
      updated = existing.filter(
        (h) => !targetKeys.has(`${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)
      );
      updated = [...updated, ...entries];
    } else {
      const map = new Map<string, HomeworkEntry>();
      existing.forEach((e) => map.set(e.id, e));
      entries.forEach((e) => map.set(e.id, e));
      updated = Array.from(map.values());
    }
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_HOMEWORK, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save custom homework to localStorage:', e);
  }
}

// =========================================================================
// CRUD Operations for Classwork
// =========================================================================

export async function fetchAllClasswork(): Promise<ClassworkEntry[]> {
  // If Supabase is configured, fetch directly from cloud database (Single Source of Truth)
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('classwork')
        .select('*')
        .order('period', { ascending: true });

      if (!error && data && data.length > 0) {
        // Strict Deduplication based on item.id directly from Supabase
        const uniqueMap = new Map<string, ClassworkEntry>();
        (data as ClassworkRow[]).forEach((row) => {
          const item = rowToClasswork(row);
          if (item && item.id) {
            uniqueMap.set(item.id, item);
          }
        });
        // Return pure Supabase cloud data without merging localStorage or baseline!
        return Array.from(uniqueMap.values());
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
        // Collect replaced keys from server custom data: block-week-classId-subject
        const srvKeys = new Set(
          srvData.classwork.map((c: ClassworkEntry) => `${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)
        );
        // Filter out base initial items that were replaced by new imports for that subject/week/class
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

  // Also filter out any base items that have been replaced in localCustom
  if (localCustom.length > 0) {
    const localKeys = new Set(
      localCustom.map((c) => `${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)
    );
    baseItems = baseItems.filter(
      (c) => !localKeys.has(`${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)
    );
  }

  // Deduplicate and merge custom entries over baseline items ONLY in offline fallback
  const map = new Map<string, ClassworkEntry>();
  baseItems.forEach((c) => {
    if (c && c.id) map.set(c.id, c);
  });
  localCustom.forEach((c) => {
    if (c && c.id) map.set(c.id, c);
  });
  return Array.from(map.values());
}

export async function upsertClasswork(entry: ClassworkEntry): Promise<ClassworkEntry> {
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

export async function deleteClasswork(id: string): Promise<void> {
  try {
    const local = getLocalCustomClasswork().filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_CLASSWORK, JSON.stringify(local));
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
  // If Supabase is configured, fetch directly from cloud database (Single Source of Truth)
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('homework')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Strict Deduplication based on item.id directly from Supabase
        const uniqueMap = new Map<string, HomeworkEntry>();
        (data as HomeworkRow[]).forEach((row) => {
          const item = rowToHomework(row);
          if (item && item.id) {
            // Ensure Tuesday Week 2 Arabic homework is page 47
            const isTargetArabicHw =
              item.id === 'hw-w2-ar-tue-g2a-wb' ||
              item.id === 'hw-w2-ar-tue-g2b-wb' ||
              item.id === 'hw-w2-ar-tue-g2c-wb' ||
              (item.subject === 'Arabic' && item.assignedDay === 'Tuesday' && item.week === 2);

            if (
              isTargetArabicHw &&
              (item.task.includes('46') || (item.pages && item.pages.includes('46')) || (item.details && item.details.includes('46')))
            ) {
              item.task = item.task.replace(/46/g, '47');
              if (item.pages) item.pages = item.pages.replace(/46/g, '47');
              if (item.details) item.details = item.details.replace(/46/g, '47');
            }

            uniqueMap.set(item.id, item);
          }
        });
        // Return pure Supabase cloud data without merging localStorage or baseline!
        return Array.from(uniqueMap.values());
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
        // Collect replaced keys from server custom data: block-week-classId-subject
        const srvKeys = new Set(
          srvData.homework.map((h: HomeworkEntry) => `${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)
        );
        // Filter out base initial items that were replaced by new imports for that subject/week/class
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

  // Also filter out any base items that have been replaced in localCustom
  if (localCustom.length > 0) {
    const localKeys = new Set(
      localCustom.map((h) => `${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)
    );
    baseItems = baseItems.filter(
      (h) => !localKeys.has(`${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)
    );
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

  // Deduplicate and merge custom local homework over base items ONLY in offline fallback
  const map = new Map<string, HomeworkEntry>();
  normalizedBase.forEach((h) => {
    if (h && h.id) map.set(h.id, h);
  });
  localCustom.forEach((h) => {
    if (h && h.id) map.set(h.id, h);
  });
  return Array.from(map.values());
}

export async function upsertHomework(entry: HomeworkEntry): Promise<HomeworkEntry> {
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
  try {
    const local = getLocalCustomHomework().filter((h) => h.id !== id);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_HOMEWORK, JSON.stringify(local));
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

  const { data, error } = await supabase.from('planner_settings').select('*');
  if (error) {
    console.warn('Could not fetch planner settings from Supabase:', error.message);
    return {};
  }

  const map: Record<string, string> = {};
  for (const item of data || []) {
    map[item.key] = item.value;
  }
  return map;
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
// Automated Initial Seeding
// =========================================================================

export async function seedInitialDataIfEmpty(): Promise<{
  seeded: boolean;
  classworkCount: number;
  homeworkCount: number;
}> {
  if (!isSupabaseConfigured) {
    return { seeded: false, classworkCount: 0, homeworkCount: 0 };
  }

  try {
    // Check existing count in classwork
    const { count: cwCount, error: cwErr } = await supabase
      .from('classwork')
      .select('*', { count: 'exact', head: true });

    if (cwErr) {
      console.warn('Error checking classwork table count:', cwErr.message);
      return { seeded: false, classworkCount: 0, homeworkCount: 0 };
    }

    // Check existing count in homework
    const { count: hwCount, error: hwErr } = await supabase
      .from('homework')
      .select('*', { count: 'exact', head: true });

    if (hwErr) {
      console.warn('Error checking homework table count:', hwErr.message);
      return { seeded: false, classworkCount: cwCount || 0, homeworkCount: 0 };
    }

    let seeded = false;

    // Seed classwork if empty
    if ((cwCount ?? 0) === 0) {
      const cwInitial = INITIAL_CLASSWORK;
      if (cwInitial && cwInitial.length > 0) {
        console.log(`🌱 Seeding ${cwInitial.length} classwork entries into Supabase...`);
        const rows = cwInitial.map(classworkToRow);
        for (let i = 0; i < rows.length; i += 50) {
          const chunk = rows.slice(i, i + 50);
          try {
            const { error: seedCwErr } = await supabase.from('classwork').upsert(chunk, { onConflict: 'id' });
            if (seedCwErr) {
              console.warn('Notice seeding classwork chunk:', seedCwErr.message || seedCwErr);
            } else {
              seeded = true;
            }
          } catch (e) {
            console.warn('Network exception during classwork seed chunk:', e);
          }
        }
      }
    }

    // Seed homework if empty
    if ((hwCount ?? 0) === 0) {
      const hwInitial = INITIAL_HOMEWORK;
      if (hwInitial && hwInitial.length > 0) {
        console.log(`🌱 Seeding ${hwInitial.length} homework entries into Supabase...`);
        const rows = hwInitial.map(homeworkToRow);
        for (let i = 0; i < rows.length; i += 50) {
          const chunk = rows.slice(i, i + 50);
          try {
            const { error: seedHwErr } = await supabase.from('homework').upsert(chunk, { onConflict: 'id' });
            if (seedHwErr) {
              console.warn('Notice seeding homework chunk:', seedHwErr.message || seedHwErr);
            } else {
              seeded = true;
            }
          } catch (e) {
            console.warn('Network exception during homework seed chunk:', e);
          }
        }
      }
    } else {
      // If homework was already seeded earlier, ensure Tuesday Arabic homework is updated to page 47
      try {
        const arabicUpdates = INITIAL_HOMEWORK.filter((h) =>
          h.id === 'hw-w2-ar-tue-g2a-wb' ||
          h.id === 'hw-w2-ar-tue-g2b-wb' ||
          h.id === 'hw-w2-ar-tue-g2c-wb'
        ).map(homeworkToRow);

        if (arabicUpdates.length > 0) {
          await supabase.from('homework').upsert(arabicUpdates, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Notice updating Arabic homework p. 47 in Supabase:', err);
      }
    }

    // Seed initial settings if empty
    try {
      const { count: settiingsCount } = await supabase
        .from('planner_settings')
        .select('*', { count: 'exact', head: true });

      if ((settiingsCount ?? 0) === 0) {
        const settingsToSeed = [
          { key: 'current_class', value: initialData.nile_planner_current_class_v3 || 'G2B' },
          { key: 'current_week', value: initialData.nile_planner_current_week_v3 || '2' },
          { key: 'selected_day', value: initialData.nile_planner_selected_day_v3 || 'Sunday' },
          { key: 'current_block', value: '1' },
        ];
        await supabase.from('planner_settings').upsert(settingsToSeed, { onConflict: 'key' });
      }
    } catch {
      // Ignore if table not yet created
    }

    return {
      seeded,
      classworkCount: cwCount ?? 0,
      homeworkCount: hwCount ?? 0,
    };
  } catch (err) {
    console.warn('Notice during auto-seeding:', err);
    return { seeded: false, classworkCount: 0, homeworkCount: 0 };
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
 * Upload a PDF file directly to Supabase Storage ('school_materials' bucket)
 * Returns the public URL if successful.
 */
export async function uploadPdfToSupabaseStorage(
  file: File | Blob,
  fileName: string
): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const bucketName = 'school_materials';
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

    // 2. If storageUrl points to school_materials, attempt file deletion
    if (storageUrl && storageUrl.includes('school_materials')) {
      const parts = storageUrl.split('/school_materials/');
      if (parts[1]) {
        await supabase.storage.from('school_materials').remove([parts[1]]);
      }
    }
  } catch (err) {
    console.warn('Network exception deleting material from Supabase:', err);
  }
}

