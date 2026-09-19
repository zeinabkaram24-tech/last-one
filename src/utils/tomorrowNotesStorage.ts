import { ClassId, SchoolDay } from '../types';
import { TomorrowSpecialNote, SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { supabase, isSupabaseConfigured, unpackHomeworkDetails } from '../lib/supabase';

// In-memory fallback cache to completely replace localStorage as requested
const IN_MEMORY_NOTES_CACHE: Record<string, string> = {};
const LISTENERS: Array<() => void> = [];

export function notifyTomorrowNotesListeners() {
  LISTENERS.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn('Listener error in tomorrow notes:', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nile-tomorrow-notes-updated'));
  }
}

export function subscribeToTomorrowNotes(callback: () => void): () => void {
  LISTENERS.push(callback);
  return () => {
    const idx = LISTENERS.indexOf(callback);
    if (idx !== -1) LISTENERS.splice(idx, 1);
  };
}

export function isDisallowedMathNote(n: TomorrowSpecialNote): boolean {
  const text = ((n.note || '') + ' ' + (n.arabicNote || '') + ' ' + (n.bagItem || '')).toLowerCase();
  return (
    text.includes('white board') ||
    text.includes('whiteboard') ||
    text.includes('سبورة بيضاء') ||
    text.includes('100 chart') ||
    text.includes('مخطط المائة') ||
    text.includes('مخطط الـ 100') ||
    (text.includes('كشكول الماث') && !n.isQuiz)
  );
}

// Get tomorrow notes for a specific day, class, block, and week
export async function getTomorrowNotesForDay(
  block: number,
  week: number,
  classId: ClassId,
  targetDay: SchoolDay
): Promise<TomorrowSpecialNote[]> {
  const effectiveWeek = targetDay === 'Sunday' && week > 1 ? week - 1 : week;

  // Base official notes for Block/Week or EffectiveWeek from static files
  const baseNotes: TomorrowSpecialNote[] =
    block === 1 && (week === 2 || effectiveWeek === 2)
      ? WEEK2_SPECIAL_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay
        )
      : block === 1 && (week === 1 || effectiveWeek === 1)
      ? SPECIAL_TEACHER_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay && (n.week === 1 || !n.week)
        )
      : [];

  if (!isSupabaseConfigured) {
    return baseNotes.filter((n) => !isDisallowedMathNote(n));
  }

  try {
    // 1. Fetch from classwork table
    const { data: cwList, error: cwErr } = await supabase
      .from('classwork')
      .select('*')
      .eq('class_id', classId)
      .eq('block', block)
      .eq('week', week)
      .eq('day', targetDay);

    if (cwErr) console.warn('Error fetching classwork for tomorrow view:', cwErr);

    // 2. Fetch from homework table (due tomorrow)
    const { data: hwList, error: hwErr } = await supabase
      .from('homework')
      .select('*')
      .eq('class_id', classId)
      .eq('block', block)
      .eq('week', week)
      .eq('due_day', targetDay);

    if (hwErr) console.warn('Error fetching homework for tomorrow view:', hwErr);

    const dynamicNotes: TomorrowSpecialNote[] = [];

    // Map classwork to TomorrowSpecialNote
    if (cwList && Array.isArray(cwList)) {
      cwList.forEach((cw: any) => {
        const isQuiz = /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((cw.title + ' ' + (cw.details || '')).toLowerCase());
        dynamicNotes.push({
          id: cw.id,
          classId: cw.class_id as ClassId,
          targetDay: cw.day as SchoolDay,
          subject: cw.subject,
          note: cw.title,
          arabicNote: cw.details || cw.title,
          bagItem: cw.pages || undefined,
          isQuiz,
          categoryType: isQuiz ? 'quiz' : 'note',
          block: cw.block,
          week: cw.week,
          linkUrl: cw.link_url || undefined,
          linkTitle: cw.link_title || undefined,
        });
      });
    }

    // Map homework to TomorrowSpecialNote
    if (hwList && Array.isArray(hwList)) {
      hwList.forEach((hw: any) => {
        const unpacked = unpackHomeworkDetails(hw.details);
        dynamicNotes.push({
          id: hw.id,
          classId: hw.class_id as ClassId,
          targetDay: hw.due_day as SchoolDay,
          subject: hw.subject,
          note: hw.task,
          arabicNote: unpacked.details || hw.task,
          bagItem: hw.pages || undefined,
          isQuiz: true,
          categoryType: 'quiz',
          block: hw.block,
          week: hw.week,
          pdfUrl: unpacked.pdfUrl || undefined,
          linkUrl: hw.link_url || undefined,
        });
      });
    }

    // Merge base notes and dynamic notes
    const map = new Map<string, TomorrowSpecialNote>();
    baseNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });

    dynamicNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });

    const merged = Array.from(map.values());
    return merged.filter((n) => !isDisallowedMathNote(n));
  } catch (err) {
    console.error('Error loading dynamic tomorrow notes from database tables:', err);
    return baseNotes.filter((n) => !isDisallowedMathNote(n));
  }
}

// Save tomorrow notes directly inside classwork or homework table
export async function saveTomorrowNotes(
  block: number,
  week: number,
  notes: TomorrowSpecialNote[],
  mode: 'merge' | 'replace' = 'merge'
): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    for (const note of notes) {
      const isQuiz = note.isQuiz || note.categoryType === 'quiz' || /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((note.note + ' ' + (note.arabicNote || '')).toLowerCase());
      const targetId = note.id || `tomorrow-${isQuiz ? 'hw' : 'cw'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const classId = (note.classId as any) === 'ALL' ? 'G2B' : note.classId;

      if (isQuiz) {
        // Prepare row for homework table
        const row = {
          id: targetId,
          class_id: classId,
          assigned_day: 'Sunday',
          due_day: note.targetDay,
          subject: note.subject,
          task: note.arabicNote || note.note || '',
          details: note.bagItem || null,
          completed: false,
          priority: 'urgent',
          block: note.block || block,
          week: note.week || week,
          link_url: note.linkUrl || null,
        };

        await supabase.from('homework').upsert(row, { onConflict: 'id' });
      } else {
        // Prepare row for classwork table
        const row = {
          id: targetId,
          class_id: classId,
          day: note.targetDay,
          period: 1,
          subject: note.subject,
          title: note.note || '',
          details: note.arabicNote || note.note || '',
          pages: note.bagItem || null,
          completed: false,
          block: note.block || block,
          week: note.week || week,
          link_url: note.linkUrl || null,
          link_title: note.linkTitle || null,
        };

        await supabase.from('classwork').upsert(row, { onConflict: 'id' });
      }
    }
  } catch (err) {
    console.error('Error saving tomorrow notes as classwork/homework entries:', err);
  }

  notifyTomorrowNotesListeners();
}
