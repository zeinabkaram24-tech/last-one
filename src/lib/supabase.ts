import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ClassId, ClassworkEntry, HomeworkEntry, SchoolDay, SubjectName } from '../types';
import { INITIAL_CLASSWORK, INITIAL_HOMEWORK } from '../data/defaultWeeklyPlan';
import initialData from '../data/initialData.json';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    supabaseUrl !== 'https://your-project.supabase.co'
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
    console.warn('Supabase is not configured. Falling back to local/initial data.');
    return INITIAL_CLASSWORK;
  }

  const { data, error } = await supabase
    .from('classwork')
    .select('*')
    .order('period', { ascending: true });

  if (error) {
    console.error('Error fetching classwork from Supabase:', error);
    throw error;
  }

  return (data as ClassworkRow[]).map(rowToClasswork);
}

export async function upsertClasswork(entry: ClassworkEntry): Promise<ClassworkEntry> {
  if (!isSupabaseConfigured) {
    return entry;
  }

  const row = classworkToRow(entry);
  const { data, error } = await supabase
    .from('classwork')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting classwork to Supabase:', error);
    throw error;
  }

  return rowToClasswork(data as ClassworkRow);
}

export async function updateClassworkCompletion(id: string, completed: boolean): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('classwork')
    .update({ completed })
    .eq('id', id);

  if (error) {
    console.error(`Error updating classwork ${id} completion:`, error);
    throw error;
  }
}

export async function deleteClasswork(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.from('classwork').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting classwork ${id}:`, error);
    throw error;
  }
}

export async function bulkInsertClasswork(entries: ClassworkEntry[]): Promise<void> {
  if (!isSupabaseConfigured || entries.length === 0) return;

  const rows = entries.map(classworkToRow);
  const { error } = await supabase.from('classwork').upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('Error bulk inserting classwork:', error);
    throw error;
  }
}

// =========================================================================
// CRUD Operations for Homework
// =========================================================================

export async function fetchAllHomework(): Promise<HomeworkEntry[]> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Falling back to local/initial data.');
    return INITIAL_HOMEWORK;
  }

  const { data, error } = await supabase
    .from('homework')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching homework from Supabase:', error);
    throw error;
  }

  return (data as HomeworkRow[]).map(rowToHomework);
}

export async function upsertHomework(entry: HomeworkEntry): Promise<HomeworkEntry> {
  if (!isSupabaseConfigured) {
    return entry;
  }

  const row = homeworkToRow(entry);
  const { data, error } = await supabase
    .from('homework')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting homework to Supabase:', error);
    throw error;
  }

  return rowToHomework(data as HomeworkRow);
}

export async function updateHomeworkCompletion(id: string, completed: boolean): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('homework')
    .update({ completed })
    .eq('id', id);

  if (error) {
    console.error(`Error updating homework ${id} completion:`, error);
    throw error;
  }
}

export async function deleteHomework(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.from('homework').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting homework ${id}:`, error);
    throw error;
  }
}

export async function bulkInsertHomework(entries: HomeworkEntry[]): Promise<void> {
  if (!isSupabaseConfigured || entries.length === 0) return;

  const rows = entries.map(homeworkToRow);
  const { error } = await supabase.from('homework').upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('Error bulk inserting homework:', error);
    throw error;
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
        const { error: seedCwErr } = await supabase.from('classwork').insert(rows);
        if (seedCwErr) {
          console.error('Failed to seed classwork:', seedCwErr);
        } else {
          seeded = true;
        }
      }
    }

    // Seed homework if empty
    if ((hwCount ?? 0) === 0) {
      const hwInitial = INITIAL_HOMEWORK;
      if (hwInitial && hwInitial.length > 0) {
        console.log(`🌱 Seeding ${hwInitial.length} homework entries into Supabase...`);
        const rows = hwInitial.map(homeworkToRow);
        const { error: seedHwErr } = await supabase.from('homework').insert(rows);
        if (seedHwErr) {
          console.error('Failed to seed homework:', seedHwErr);
        } else {
          seeded = true;
        }
      }
    }

    // Seed initial settings if empty
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
      await supabase.from('planner_settings').insert(settingsToSeed);
    }

    return {
      seeded,
      classworkCount: cwCount ?? 0,
      homeworkCount: hwCount ?? 0,
    };
  } catch (err) {
    console.error('Error during auto-seeding:', err);
    return { seeded: false, classworkCount: 0, homeworkCount: 0 };
  }
}
