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

    const deletedIds = await getDeletedTomorrowNoteIds();
    const merged = Array.from(map.values());
    const filtered = merged.filter((n) => {
      if (isDisallowedMathNote(n)) return false;
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      if (deletedIds.includes(key) || (n.id && deletedIds.includes(n.id))) {
        return false;
      }
      return true;
    });

    // Enrich any Science tomorrow note with the required materials as requested by the user
    filtered.forEach((note) => {
      if (note.subject === 'Science') {
        const materialText = "Colored sheets with different colors , glue , colored pencils , a little chrochet yarn";
        const arabicMaterialText = "ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه.";
        
        note.bagItem = note.bagItem && (note.bagItem.includes('crochet') || note.bagItem.includes('chrochet') || note.bagItem.includes('كروشيه'))
          ? note.bagItem
          : note.bagItem 
            ? `${note.bagItem} — Required: ${materialText}` 
            : materialText;
        
        note.note = note.note && (note.note.includes('crochet') || note.note.includes('chrochet') || note.note.includes('كروشيه'))
          ? note.note
          : note.note 
            ? `${note.note} (Tools: ${materialText})` 
            : `Science Tools: ${materialText}`;
        
        note.arabicNote = note.arabicNote && (note.arabicNote.includes('كروشيه') || note.arabicNote.includes('crochet'))
          ? note.arabicNote
          : note.arabicNote 
            ? `${note.arabicNote} (المواد المطلوبة: ${arabicMaterialText})` 
            : `أدوات الساينس المطلوبة: ${arabicMaterialText}`;
      }
    });

    // Add specific Science Homework submission reminders as requested by the user:
    // - For Class A (G2A) & Class B (G2B): Submit Science Homework on Sunday (Reminder shown on Saturday night, targetDay is Sunday)
    // - For Class C (G2C): Submit Science Homework on Monday (Reminder shown on Sunday night, targetDay is Monday)
    if (targetDay === 'Sunday') {
      if (classId === 'G2A' || classId === 'G2B') {
        const hasSciRem = filtered.some(n => n.subject === 'Science' && n.note?.includes('Homework Submission'));
        if (!hasSciRem) {
          filtered.push({
            id: `tn-b1-w3-${classId}-Sun-science-hw-submit`,
            classId: classId,
            targetDay: 'Sunday',
            subject: 'Science',
            note: 'Science Homework Submission: Submit Science Homework (Workbook/Booklet Page 38) tomorrow.',
            arabicNote: 'تذكير: تسليم واجب الساينس (كتاب التمارين/البوكليت صفحة 38) للمعلمة.',
            bagItem: 'Science Workbook / Booklet (كتاب أو بوكليت الساينس)',
            isQuiz: false,
            categoryType: 'note',
            block: 1,
            week: 3
          });
        }
      }
    } else if (targetDay === 'Monday') {
      if (classId === 'G2C') {
        const hasSciRem = filtered.some(n => n.subject === 'Science' && n.note?.includes('Homework Submission'));
        if (!hasSciRem) {
          filtered.push({
            id: `tn-b1-w3-G2C-Mon-science-hw-submit`,
            classId: 'G2C',
            targetDay: 'Monday',
            subject: 'Science',
            note: 'Science Homework Submission: Submit Science Homework (Workbook Page 36) tomorrow.',
            arabicNote: 'تذكير: تسليم واجب الساينس (كتاب التمارين صفحة 36) للمعلمة.',
            bagItem: 'Science Workbook / Booklet (كتاب أو بوكليت الساينس)',
            isQuiz: false,
            categoryType: 'note',
            block: 1,
            week: 3
          });
        }
      }
    }

    return filtered;
  } catch (err) {
    console.error('Error loading dynamic tomorrow notes from database tables:', err);
    const fb = baseNotes.filter((n) => !isDisallowedMathNote(n));
    fb.forEach((note) => {
      if (note.subject === 'Science') {
        const materialText = "Colored sheets with different colors , glue , colored pencils , a little chrochet yarn";
        const arabicMaterialText = "ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه.";
        note.bagItem = materialText;
        note.note = `Science Tools: ${materialText}`;
        note.arabicNote = `أدوات الساينس المطلوبة: ${arabicMaterialText}`;
      }
    });

    // Handle same dynamic science homework reminders in fallback
    if (targetDay === 'Sunday') {
      if (classId === 'G2A' || classId === 'G2B') {
        fb.push({
          id: `tn-b1-w3-${classId}-Sun-science-hw-submit`,
          classId: classId,
          targetDay: 'Sunday',
          subject: 'Science',
          note: 'Science Homework Submission: Submit Science Homework (Workbook/Booklet Page 38) tomorrow.',
          arabicNote: 'تذكير: تسليم واجب الساينس (كتاب التمارين/البوكليت صفحة 38) للمعلمة.',
          bagItem: 'Science Workbook / Booklet (كتاب أو بوكليت الساينس)',
          isQuiz: false,
          categoryType: 'note',
          block: 1,
          week: 3
        });
      }
    } else if (targetDay === 'Monday') {
      if (classId === 'G2C') {
        fb.push({
          id: `tn-b1-w3-G2C-Mon-science-hw-submit`,
          classId: 'G2C',
          targetDay: 'Monday',
          subject: 'Science',
          note: 'Science Homework Submission: Submit Science Homework (Workbook Page 36) tomorrow.',
          arabicNote: 'تذكير: تسليم واجب الساينس (كتاب التمارين صفحة 36) للمعلمة.',
          bagItem: 'Science Workbook / Booklet (كتاب أو بوكليت الساينس)',
          isQuiz: false,
          categoryType: 'note',
          block: 1,
          week: 3
        });
      }
    }

    return fb;
  }
}

export async function getDeletedTomorrowNoteIds(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    try {
      const cached = IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'];
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('planner_settings')
      .select('value')
      .eq('key', 'deleted_tomorrow_note_ids')
      .maybeSingle();
    if (!error && data && data.value) {
      return JSON.parse(data.value);
    }
  } catch (e) {
    console.warn('Error fetching deleted tomorrow note ids:', e);
  }
  return [];
}

export async function saveDeletedTomorrowNoteId(noteId: string): Promise<void> {
  const currentList = await getDeletedTomorrowNoteIds();
  if (!currentList.includes(noteId)) {
    currentList.push(noteId);
    
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('planner_settings')
          .upsert({
            key: 'deleted_tomorrow_note_ids',
            value: JSON.stringify(currentList),
            updated_at: new Date().toISOString()
          }, { onConflict: 'key' });
      } catch (e) {
        console.warn('Error saving deleted tomorrow note id to Supabase:', e);
      }
    } else {
      IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'] = JSON.stringify(currentList);
    }
  }
  notifyTomorrowNotesListeners();
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
