import { ClassId, SchoolDay } from '../types';
import { TomorrowSpecialNote, SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { supabase, isSupabaseConfigured, unpackHomeworkDetails, appStorage } from '../lib/supabase';

export const WEEK3_SPECIAL_NOTES: TomorrowSpecialNote[] = [
  ...(['G2A', 'G2B', 'G2C', 'ALL'] as const).map((cls) => ({
    id: `tn-b1-w3-${cls}-mon-eng-dictation`,
    classId: cls as ClassId,
    targetDay: 'Monday' as SchoolDay,
    subject: 'English' as const,
    note: 'Dictation',
    arabicNote: 'ديكتيشن',
    isQuiz: true,
    categoryType: 'quiz' as const,
    block: 1,
    week: 3,
  })),
];

const LOCAL_CUSTOM_TOMORROW_KEY = 'tomorrow_special_notes_custom_v3';

export function getLocalCustomTomorrowNotes(): TomorrowSpecialNote[] {
  try {
    const raw = appStorage.getItem(LOCAL_CUSTOM_TOMORROW_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveLocalCustomTomorrowNotes(notes: TomorrowSpecialNote[], mode: 'merge' | 'replace' = 'merge') {
  try {
    if (mode === 'replace') {
      appStorage.setItem(LOCAL_CUSTOM_TOMORROW_KEY, JSON.stringify(notes));
      return;
    }
    const current = getLocalCustomTomorrowNotes();
    const map = new Map<string, TomorrowSpecialNote>();
    current.forEach((n) => {
      const key = n.id || `${n.classId || 'ALL'}-${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });
    notes.forEach((n) => {
      const key = n.id || `${n.classId || 'ALL'}-${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });
    appStorage.setItem(LOCAL_CUSTOM_TOMORROW_KEY, JSON.stringify(Array.from(map.values())));
  } catch {}
}

// In-memory fallback cache
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
    block === 1 && (week === 3 || effectiveWeek === 3)
      ? WEEK3_SPECIAL_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay
        )
      : block === 1 && (week === 2 || effectiveWeek === 2)
      ? WEEK2_SPECIAL_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay
        )
      : block === 1 && (week === 1 || effectiveWeek === 1)
      ? SPECIAL_TEACHER_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay && (n.week === 1 || !n.week)
        )
      : [];

  // Load custom notes from localStorage
  const localCustom = getLocalCustomTomorrowNotes().filter(
    (n) =>
      (n.classId === classId || (n.classId as any) === 'ALL') &&
      n.targetDay === targetDay &&
      (n.block || 1) === block &&
      (n.week || 1) === week
  );

  const deletedIds = await getDeletedTomorrowNoteIds();

  if (!isSupabaseConfigured) {
    const map = new Map<string, TomorrowSpecialNote>();
    baseNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });
    // Custom notes override base notes
    localCustom.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });
    const merged = Array.from(map.values());
    const filtered = merged.filter((n) => {
      if (isDisallowedMathNote(n)) return false;
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      if (deletedIds.includes(key) || (n.id && deletedIds.includes(n.id))) {
        return false;
      }
      return true;
    });
    return filtered;
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

    // 3. Fetch from central planner-data endpoint
    try {
      const res = await fetch('/api/planner-data');
      if (res.ok) {
        const pData = await res.json();
        if (pData && Array.isArray(pData.tomorrowNotes)) {
          pData.tomorrowNotes.forEach((n: any) => {
            if (
              (n.classId === classId || n.classId === 'ALL') &&
              n.targetDay === targetDay &&
              (n.block || 1) === block &&
              (n.week || 1) === week
            ) {
              dynamicNotes.push(n);
            }
          });
        }
      }
    } catch {}

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
      } else if (
        note.subject === 'Science' &&
        (note.note?.toLowerCase().includes('submission') ||
          note.note?.includes('تسليم') ||
          note.arabicNote?.includes('تسليم') ||
          note.note?.toLowerCase().includes('submit') ||
          note.id?.includes('hw-submit'))
      ) {
        // Enforce exact format requested by user: strictly "تسليم بوكلت الساينس"
        note.note = 'تسليم بوكلت الساينس';
        note.arabicNote = 'تسليم بوكلت الساينس';
        note.bagItem = 'بوكليت الساينس';
      }
    });

    // Add specific Science Homework submission reminders for Class B and A on Wednesday/Thursday:
    // Strictly without any page numbers as requested: "تسليم بوكلت الساينس"
    // G2C Monday submission was removed per user request.
    if (targetDay === 'Thursday' || targetDay === 'Wednesday') {
      if (classId === 'G2A' || classId === 'G2B') {
        const remId = `tn-b1-w3-${classId}-Wed-science-hw-submit`;
        const semKey = `science-booklet-submission-${targetDay}`;
        const hasSciRem = filtered.some(
          (n) => n.subject === 'Science' && (n.note?.includes('تسليم') || n.arabicNote?.includes('تسليم') || n.id?.includes('hw-submit'))
        );
        if (!hasSciRem && !deletedIds.includes(remId) && !deletedIds.includes(semKey)) {
          filtered.push({
            id: remId,
            classId: classId,
            targetDay: targetDay,
            subject: 'Science',
            note: 'تسليم بوكلت الساينس',
            arabicNote: 'تسليم بوكلت الساينس',
            bagItem: 'بوكليت الساينس',
            isQuiz: false,
            categoryType: 'note',
            block: 1,
            week: 3,
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
        if (
          note.note?.toLowerCase().includes('submission') ||
          note.note?.includes('تسليم') ||
          note.arabicNote?.includes('تسليم') ||
          note.note?.toLowerCase().includes('submit') ||
          note.id?.includes('hw-submit')
        ) {
          note.note = 'تسليم بوكلت الساينس';
          note.arabicNote = 'تسليم بوكلت الساينس';
          note.bagItem = 'بوكليت الساينس';
        } else {
          const materialText = "Colored sheets with different colors , glue , colored pencils , a little crochet yarn";
          const arabicMaterialText = "ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه.";
          note.bagItem = materialText;
          note.note = `Science Tools: ${materialText}`;
          note.arabicNote = `أدوات الساينس المطلوبة: ${arabicMaterialText}`;
        }
      }
    });

    if (targetDay === 'Thursday' || targetDay === 'Wednesday') {
      if (classId === 'G2A' || classId === 'G2B') {
        fb.push({
          id: `tn-b1-w3-${classId}-Wed-science-hw-submit`,
          classId: classId,
          targetDay: targetDay,
          subject: 'Science',
          note: 'تسليم بوكلت الساينس',
          arabicNote: 'تسليم بوكلت الساينس',
          bagItem: 'بوكليت الساينس',
          isQuiz: false,
          categoryType: 'note',
          block: 1,
          week: 3,
        });
      }
    }

    return fb;
  }
}

export async function getDeletedTomorrowNoteIds(): Promise<string[]> {
  let localList: string[] = ['tn-b1-w3-G2C-Mon-science-hw-submit', 'science-booklet-submission-Monday'];
  try {
    const raw = appStorage.getItem('nile_deleted_tomorrow_note_ids_v3');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localList = Array.from(new Set([...localList, ...parsed]));
      }
    }
  } catch {}

  try {
    const cached = IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'];
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        localList = Array.from(new Set([...localList, ...parsed]));
      }
    }
  } catch {}

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('planner_settings')
        .select('value')
        .eq('key', 'deleted_tomorrow_note_ids')
        .maybeSingle();
      if (!error && data && data.value) {
        const dbList = JSON.parse(data.value);
        if (Array.isArray(dbList)) {
          localList = Array.from(new Set([...localList, ...dbList]));
        }
      }
    } catch (e) {
      console.warn('Error fetching deleted tomorrow note ids from Supabase:', e);
    }
  }

  try {
    const res = await fetch('/api/planner-data');
    if (res.ok) {
      const serverData = await res.json();
      if (Array.isArray(serverData.deletedTomorrowNoteIds)) {
        localList = Array.from(new Set([...localList, ...serverData.deletedTomorrowNoteIds]));
      }
    }
  } catch {}

  appStorage.setItem('nile_deleted_tomorrow_note_ids_v3', JSON.stringify(localList));
  IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'] = JSON.stringify(localList);
  return localList;
}

export async function saveDeletedTomorrowNoteId(noteId: string): Promise<void> {
  if (!noteId) return;
  const currentList = await getDeletedTomorrowNoteIds();
  if (!currentList.includes(noteId)) {
    currentList.push(noteId);
  }
  appStorage.setItem('nile_deleted_tomorrow_note_ids_v3', JSON.stringify(currentList));
  IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'] = JSON.stringify(currentList);

  try {
    await fetch('/api/planner-data/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: noteId, type: 'tomorrowNotes' }),
    });
  } catch {}

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('planner_settings')
        .upsert({
          key: 'deleted_tomorrow_note_ids',
          value: JSON.stringify(currentList),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
    } catch (e) {
      console.warn('Error saving deleted tomorrow note id to Supabase:', e);
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
  saveLocalCustomTomorrowNotes(notes, mode);

  try {
    await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tomorrowNotes: notes, mode }),
    });
  } catch (err) {
    console.warn('Central server sync error in saveTomorrowNotes:', err);
  }

  if (isSupabaseConfigured) {
    try {
      for (const note of notes) {
        const isQuiz = note.isQuiz || note.categoryType === 'quiz' || /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((note.note + ' ' + (note.arabicNote || '')).toLowerCase());
        const targetId = note.id || `tomorrow-${isQuiz ? 'hw' : 'cw'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const targetClasses: ClassId[] =
          (note.classId as any) === 'ALL'
            ? ['G2A', 'G2B', 'G2C']
            : [note.classId as ClassId];

        for (const classId of targetClasses) {
          const rowId = (note.classId as any) === 'ALL' ? `${targetId}-${classId}` : targetId;
          if (isQuiz) {
            // Prepare row for homework table
            const row = {
              id: rowId,
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
              id: rowId,
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
      }
    } catch (err) {
      console.error('Error saving tomorrow notes as classwork/homework entries in Supabase:', err);
    }
  }

  notifyTomorrowNotesListeners();
}
