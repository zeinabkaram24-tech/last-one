import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClassId, ClassworkEntry, HomeworkEntry, SchoolDay, SubjectName } from '../types';
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

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseUrl = cleanSupabaseUrl(rawSupabaseUrl);
export const supabaseAnonKey = cleanSupabaseKey(rawSupabaseAnonKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

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

// Convert from Row to HomeworkEntry
export function rowToHomework(row: HomeworkRow): HomeworkEntry {
  return {
    id: row.id,
    classId: row.class_id as ClassId,
    assignedDay: row.assigned_day as SchoolDay,
    dueDay: row.due_day as SchoolDay,
    subject: row.subject as SubjectName,
    task: row.task,
    details: row.details || undefined,
    pages: row.pages || undefined,
    completed: Boolean(row.completed),
    priority: (row.priority as 'normal' | 'urgent') || 'normal',
    block: row.block || 1,
    week: row.week || 1,
    isLinkTask: Boolean(row.is_link_task),
    linkUrl: row.link_url || undefined,
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
    details: entry.details || null,
    pages: entry.pages || null,
    completed: Boolean(entry.completed),
    priority: entry.priority || 'normal',
    block: entry.block || 1,
    week: entry.week || 1,
    is_link_task: Boolean(entry.isLinkTask),
    link_url: entry.linkUrl || null,
  };
}

// =========================================================================
// CRUD Operations for Classwork
// =========================================================================

export async function fetchAllClasswork(): Promise<ClassworkEntry[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_CLASSWORK;
  }

  try {
    const { data, error } = await supabase
      .from('classwork')
      .select('*')
      .order('period', { ascending: true });

    if (error) {
      console.warn('Supabase fetch classwork notice (using local baseline):', error.message || error);
      return INITIAL_CLASSWORK;
    }

    if (!data || data.length === 0) {
      return INITIAL_CLASSWORK;
    }

    return (data as ClassworkRow[]).map(rowToClasswork);
  } catch (err) {
    console.warn('Network exception fetching classwork from Supabase (using local baseline):', err);
    return INITIAL_CLASSWORK;
  }
}

export async function upsertClasswork(entry: ClassworkEntry): Promise<ClassworkEntry> {
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

export async function bulkInsertClasswork(entries: ClassworkEntry[]): Promise<void> {
  if (!isSupabaseConfigured || entries.length === 0) return;

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
  if (!isSupabaseConfigured) {
    return INITIAL_HOMEWORK;
  }

  try {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch homework notice (using local baseline):', error.message || error);
      return INITIAL_HOMEWORK;
    }

    if (!data || data.length === 0) {
      return INITIAL_HOMEWORK;
    }

    return (data as HomeworkRow[]).map(rowToHomework);
  } catch (err) {
    console.warn('Network exception fetching homework from Supabase (using local baseline):', err);
    return INITIAL_HOMEWORK;
  }
}

export async function upsertHomework(entry: HomeworkEntry): Promise<HomeworkEntry> {
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

export async function bulkInsertHomework(entries: HomeworkEntry[]): Promise<void> {
  if (!isSupabaseConfigured || entries.length === 0) return;

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
