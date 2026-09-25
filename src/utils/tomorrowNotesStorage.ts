import { ClassId, SchoolDay } from '../types';
import { TomorrowSpecialNote, SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { supabase, isSupabaseConfigured, unpackHomeworkDetails, appStorage } from '../lib/supabase';

export const WEEK4_SPECIAL_NOTES: TomorrowSpecialNote[] = [
  {
    id: 'tn-b1-w4-G2A-math-thu-test',
    classId: 'G2A',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: 1,
    title: 'Task Test',
    note: 'Task Test',
    arabicNote: '🚨 اختبار قصير (Task Test) في مادة الرياضيات غداً - مراجعة دروس الوحدة الثالثة 2D shapes و Line of symmetry.',
    bagItem: 'Maths-Grade2-B1-All-Sheet1 - Main',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  {
    id: 'tn-b1-w4-G2B-math-thu-test',
    classId: 'G2B',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: 4,
    title: 'Task Test',
    note: 'Task Test',
    arabicNote: '🚨 اختبار قصير (Task Test) في مادة الرياضيات غداً - مراجعة دروس الوحدة الثالثة 2D shapes و Line of symmetry.',
    bagItem: 'Maths-Grade2-B1-All-Sheet1 - Main',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  {
    id: 'tn-b1-w4-G2C-math-thu-test',
    classId: 'G2C',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: 6,
    title: 'Task Test',
    note: 'Task Test',
    arabicNote: '🚨 اختبار قصير (Task Test) في مادة الرياضيات غداً - مراجعة دروس الوحدة الثالثة 2D shapes و Line of symmetry.',
    bagItem: 'Maths-Grade2-B1-All-Sheet1 - Main',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  // G2A: Session 2 is Wednesday (Prepare Wednesday evening)
  {
    id: 'tn-b1-w4-G2A-french-tache',
    classId: 'G2A',
    targetDay: 'Wednesday',
    subject: 'French',
    period: 4,
    title: 'Tache (French Task)',
    note: 'Tache (French Task)',
    arabicNote: '🚨 كويز / تقييم فرنسي (Tache) غداً - مراجعة تصريف verb avoir و صفحة 50.',
    bagItem: 'Cahier de classe / Passe-passe (50)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  // G2B: Session 2 is Monday (Prepare Sunday evening)
  {
    id: 'tn-b1-w4-G2B-french-tache',
    classId: 'G2B',
    targetDay: 'Monday',
    subject: 'French',
    period: 7,
    title: 'Tache (French Task)',
    note: 'Tache (French Task)',
    arabicNote: '🚨 كويز / تقييم فرنسي (Tache) غداً - مراجعة تصريف verb avoir و صفحة 50.',
    bagItem: 'Cahier de classe / Passe-passe (50)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  // G2C: Session 2 is Tuesday (Prepare Monday evening)
  {
    id: 'tn-b1-w4-G2C-french-tache',
    classId: 'G2C',
    targetDay: 'Tuesday',
    subject: 'French',
    period: 5,
    title: 'Tache (French Task)',
    note: 'Tache (French Task)',
    arabicNote: '🚨 كويز / تقييم فرنسي (Tache) غداً - مراجعة تصريف verb avoir و صفحة 50.',
    bagItem: 'Cahier de classe / Passe-passe (50)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  // English Dictation (Prepare Wednesday evening)
  {
    id: 'tn-b1-w4-G2A-english-dictation',
    classId: 'G2A',
    targetDay: 'Thursday',
    subject: 'English',
    period: 6,
    title: 'Dictation',
    note: 'Dictation',
    arabicNote: '🚨 ديكتيشن لغة إنجليزية غداً - مراجعة وحفظ كلمات الإملاء وكتابة جمل بسيطة تبدأ بحرف كبير (Capital Letter).',
    bagItem: 'Dictation copybook (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  {
    id: 'tn-b1-w4-G2B-english-dictation',
    classId: 'G2B',
    targetDay: 'Thursday',
    subject: 'English',
    period: 5,
    title: 'Dictation',
    note: 'Dictation',
    arabicNote: '🚨 ديكتيشن لغة إنجليزية غداً - مراجعة وحفظ كلمات الإملاء وكتابة جمل بسيطة تبدأ بحرف كبير (Capital Letter).',
    bagItem: 'Dictation copybook (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  },
  {
    id: 'tn-b1-w4-G2C-english-dictation',
    classId: 'G2C',
    targetDay: 'Thursday',
    subject: 'English',
    period: 3,
    title: 'Dictation',
    note: 'Dictation',
    arabicNote: '🚨 ديكتيشن لغة إنجليزية غداً - مراجعة وحفظ كلمات الإملاء وكتابة جمل بسيطة تبدأ بحرف كبير (Capital Letter).',
    bagItem: 'Dictation copybook (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  }
];

export const WEEK3_SPECIAL_NOTES: TomorrowSpecialNote[] = [
  // Math tests
  {
    id: 'tn-b1-w3-G2A-Wed-math-test',
    classId: 'G2A',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    title: 'Test',
    note: 'Test',
    arabicNote: 'Test',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 3
  },
  {
    id: 'tn-b1-w3-G2B-Wed-math-test',
    classId: 'G2B',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    title: 'Test',
    note: 'Test',
    arabicNote: 'Test',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 3
  },
  {
    id: 'tn-b1-w3-G2C-Wed-math-test',
    classId: 'G2C',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    title: 'Test',
    note: 'Test',
    arabicNote: 'Test',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 3
  },
  // G2B Science Tools on Sunday (Saturday Tomorrow)
  {
    id: 'tn-science-w3-G2B-Sat-materials',
    classId: 'G2B',
    targetDay: 'Sunday',
    subject: 'Science',
    title: 'Science tools required for this week',
    note: 'Science tools required for this week',
    arabicNote: 'تذكير لكلاس B: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).',
    bagItem: 'أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه)',
    categoryType: 'tools',
    isQuiz: false,
    block: 1,
    week: 3
  },
  // G2B Science Booklet on Sunday (Saturday Tomorrow)
  {
    id: 'tn-science-w3-G2B-Sat-booklet',
    classId: 'G2B',
    targetDay: 'Sunday',
    subject: 'Science',
    title: 'Science booklet submission (Unit 1)',
    note: 'Science booklet submission (Unit 1)',
    arabicNote: 'تذكير لكلاس B: تسليم بوكليت الساينس (Science Booklet) غداً الأحد لتصحيح تمارين Unit 1.',
    bagItem: 'Science Booklet (بوكليت الساينس)',
    categoryType: 'note',
    isQuiz: false,
    block: 1,
    week: 3
  },
  // G2A Science Booklet on Sunday (Saturday Tomorrow)
  {
    id: 'tn-science-w3-G2A-Sat-booklet',
    classId: 'G2A',
    targetDay: 'Sunday',
    subject: 'Science',
    title: 'Science booklet submission (Unit 1)',
    note: 'Science booklet submission (Unit 1)',
    arabicNote: 'تذكير لكلاس A: تسليم بوكليت الساينس (Science Booklet) غداً الأحد لتصحيح تمارين Unit 1.',
    bagItem: 'Science Booklet (بوكليت الساينس)',
    categoryType: 'note',
    isQuiz: false,
    block: 1,
    week: 3
  },
  // G2C Science Tools on Sunday (Saturday Tomorrow)
  {
    id: 'tn-science-w3-G2C-Sat-materials',
    classId: 'G2C',
    targetDay: 'Sunday',
    subject: 'Science',
    title: 'Science tools required for this week',
    note: 'Science tools required for this week',
    arabicNote: 'تذكير لكلاس C: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).',
    bagItem: 'أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه)',
    categoryType: 'tools',
    isQuiz: false,
    block: 1,
    week: 3
  },
  // G2A Social Studies submission on Sunday (Saturday Tomorrow)
  {
    id: 'tn-b1-w3-G2A-Sat-social-submit',
    classId: 'G2A',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    note: 'تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 1)',
    arabicNote: 'تذكير لكلاس A: تسليم واجب الدراسات الاجتماعية غداً الأحد (شيت الواجب المنزلي 1)',
    bagItem: 'شيت واجب الدراسات الاجتماعية 1',
    isQuiz: false,
    block: 1,
    week: 3
  },
  // G2A Science Tools on Thursday (Wednesday Tomorrow)
  {
    id: 'tn-science-w3-G2A-Wed-materials',
    classId: 'G2A',
    targetDay: 'Thursday',
    subject: 'Science',
    title: 'Science tools required',
    note: 'Science tools required',
    arabicNote: 'تذكير لكلاس A: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).',
    bagItem: 'أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)',
    categoryType: 'tools',
    isQuiz: false,
    block: 1,
    week: 3,
    isCustom: true
  },
  // G2A Science Tools on Wednesday (Tuesday Tomorrow)
  {
    id: 'tn-science-w3-G2A-Tue-materials',
    classId: 'G2A',
    targetDay: 'Wednesday',
    subject: 'Science',
    title: 'Science tools required',
    note: 'Science tools required',
    arabicNote: 'تذكير لكلاس A: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).',
    bagItem: 'أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)',
    categoryType: 'tools',
    isQuiz: false,
    block: 1,
    week: 3,
    isCustom: true
  },
  // G2C Social Studies submission on Sunday (Saturday Tomorrow)
  {
    id: 'tn-b1-w3-G2C-Sat-social-submit',
    classId: 'G2C',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    note: 'تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 1)',
    arabicNote: 'تذكير لكلاس C: تسليم واجب الدراسات الاجتماعية غداً الأحد (شيت الواجب المنزلي 1)',
    bagItem: 'شيت واجب الدراسات الاجتماعية 1',
    isQuiz: false,
    block: 1,
    week: 3
  }
];

const LOCAL_CUSTOM_TOMORROW_KEY = 'tomorrow_special_notes_custom_v3';

export function getLocalCustomTomorrowNotes(): TomorrowSpecialNote[] {
  try {
    const raw = appStorage.getItem(LOCAL_CUSTOM_TOMORROW_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Sanitize out any rogue lookahead-w4 or outdated week 3 lookahead notes
        return parsed.filter(n => !(n.id && (n.id.includes('lookahead-w4') || (n.id.includes('w3') && n.week === 4))));
      }
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

export function isDisallowedArabicNote(n: TomorrowSpecialNote): boolean {
  if (n.subject === 'Arabic' || n.subject === 'عربي' || n.subject === 'اللغة العربية') {
    const fullText = ((n.note || '') + ' ' + (n.arabicNote || '') + ' ' + (n.title || '')).toLowerCase();
    const isDictation = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('تسميع');
    const isQuiz = n.isQuiz || n.categoryType === 'quiz' || fullText.includes('اختبار') || fullText.includes('كويز') || fullText.includes('امتحان') || fullText.includes('تقييم') || fullText.includes('test') || fullText.includes('quiz');
    if (!isDictation && !isQuiz) {
      return true;
    }
  }
  return false;
}

// Get tomorrow notes for a specific day, class, block, and week
export async function getTomorrowNotesForDay(
  block: number,
  week: number,
  classId: ClassId,
  targetDay: SchoolDay
): Promise<TomorrowSpecialNote[]> {
  const effectiveWeek = week;

  // Base official notes for Block/Week or EffectiveWeek from static files
  const baseNotes: TomorrowSpecialNote[] =
    block === 1 && (week === 4 || effectiveWeek === 4)
      ? WEEK4_SPECIAL_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay
        )
      : block === 1 && (week === 3 || effectiveWeek === 3)
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
              const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
              map.set(key, n);
            }
          });
        }
      }
    } catch {}

    const merged = Array.from(map.values());
    const filtered = merged.filter((n) => {
      if (isDisallowedMathNote(n)) return false;
      
      // Strict user rule: "كلاس B وكلاس C يوم الاتنين في tomorrow." (Only for Week 3)
      const isCustomNote = n.isCustom || n.id?.startsWith('tomorrow-') || n.id?.startsWith('tn-') || n.id?.startsWith('note-') || n.id?.startsWith('custom-');
      if (week === 3 && !isCustomNote && targetDay === 'Monday' && (classId === 'G2B' || classId === 'G2C')) return false;

      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      if (deletedIds.includes(key) || (n.id && deletedIds.includes(n.id))) {
        return false;
      }
      return true;
    });

    // Deduplicate English dictation
    filtered.sort((a, b) => {
      const aHasPdf = a.pdfUrl ? 1 : 0;
      const bHasPdf = b.pdfUrl ? 1 : 0;
      return bHasPdf - aHasPdf;
    });
    const seenNotes = new Set<string>();
    const deduplicated = filtered.filter(n => {
      const text = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
      if (n.subject === 'English' && (text.includes('dictation') || text.includes('إملاء') || text.includes('ديكتيشن'))) {
        const key = `${n.classId || 'ALL'}-${n.targetDay}`;
        if (seenNotes.has(key)) return false;
        seenNotes.add(key);
      }
      return true;
    });
    return deduplicated;
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

    // Map classwork to TomorrowSpecialNote (only if it is a quiz/alert or explicitly a user-created tomorrow note)
    if (cwList && Array.isArray(cwList)) {
      cwList.forEach((cw: any) => {
        const isQuiz = /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((cw.title + ' ' + (cw.details || '')).toLowerCase());
        const isTomorrowNote = cw.id?.startsWith('tomorrow-') || cw.id?.startsWith('tn-') || cw.id?.startsWith('custom-');
        if (isQuiz || isTomorrowNote) {
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
        }
      });
    }

    // Map homework to TomorrowSpecialNote (ONLY if it is explicitly a quiz/test/dictation alert)
    if (hwList && Array.isArray(hwList)) {
      hwList.forEach((hw: any) => {
        const isQuiz = /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test(((hw.task || '') + ' ' + (hw.details || '')).toLowerCase());
        // Ordinary homework or Arabic homework must NEVER be mapped as a tomorrow quiz note!
        if (!isQuiz || hw.subject === 'Arabic' || (hw.week && hw.week > 4)) return;
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

    // 2.5 Fetch from Supabase planner_settings (tomorrow_special_notes)
    try {
      const { data: psRow } = await supabase
        .from('planner_settings')
        .select('value')
        .eq('key', 'tomorrow_special_notes')
        .single();
      if (psRow && psRow.value) {
        const parsed = JSON.parse(psRow.value);
        if (Array.isArray(parsed)) {
          parsed.forEach((n: any) => {
            if (
              (n.classId === classId || n.classId === 'ALL') &&
              n.targetDay === targetDay &&
              (n.block || 1) === block &&
              (n.week || 1) === week
            ) {
              dynamicNotes.push({ ...n, isCustom: true });
            }
          });
        }
      }
    } catch {}

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
              dynamicNotes.push({ ...n, isCustom: true });
            }
          });
        }
      }
    } catch {}

    // Merge base notes, local custom notes, and dynamic notes
    const map = new Map<string, TomorrowSpecialNote>();
    baseNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });

    localCustom.forEach((n) => {
      if (
        (n.classId === classId || (n.classId as any) === 'ALL') &&
        n.targetDay === targetDay &&
        (n.block || 1) === block &&
        (n.week || 1) === week
      ) {
        const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
        map.set(key, { ...n, isCustom: true });
      }
    });

    dynamicNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });

    const deletedIds = await getDeletedTomorrowNoteIds();
    const merged = Array.from(map.values());
    const filtered = merged.filter((n) => {
      if (isDisallowedMathNote(n)) return false;

      // Strict user rule: "كلاس B وكلاس C يوم الاتنين في tomorrow." (Only for Week 3)
      const isCustomNote = n.isCustom || n.id?.startsWith('tomorrow-') || n.id?.startsWith('tn-') || n.id?.startsWith('note-') || n.id?.startsWith('custom-');
      if (week === 3 && !isCustomNote && targetDay === 'Monday' && (classId === 'G2B' || classId === 'G2C')) return false;

      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      const semKey = getSemanticKey(n);
      if (
        deletedIds.includes(key) ||
        (n.id && deletedIds.includes(n.id)) ||
        (semKey && deletedIds.includes(semKey))
      ) {
        return false;
      }
      return true;
    });

    // Block 1 - Week 3 specific curricular injections (Strictly disabled for Week 4 and all other weeks)
    if (block === 1 && (week === 3 || effectiveWeek === 3)) {
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

      if (targetDay === 'Sunday') {
        const sciSubId = `tn-b1-w3-${classId}-Sun-science-hw-submit`;
        const semKey = `science-booklet-submission-Sunday`;
        const hasSciSub = filtered.some(
          (n) => n.subject === 'Science' && (n.arabicNote?.includes('تسليم') || n.note?.includes('تسليم') || n.note?.includes('submission'))
        );
        const isG2A = classId === 'G2A';
        const isDeleted = deletedIds.includes(sciSubId) || deletedIds.includes(semKey);
        if (!hasSciSub && (isG2A || !isDeleted)) {
          filtered.push({
            id: sciSubId,
            classId: classId,
            targetDay: 'Sunday',
            subject: 'Science',
            note: 'تسليم بوكلت الساينس',
            arabicNote: 'تسليم بوكلت الساينس',
            bagItem: 'بوكليت الساينس',
            isQuiz: false,
            categoryType: 'note',
            block: 1,
            week: 3,
            isCustom: true
          });
        }

        if (classId === 'G2C' || classId === 'G2B') {
          const sciToolsId = `tn-science-w3-${classId}-Sat-materials`;
          const semKeySci = `science-tools-Sunday`;
          const hasSciTools = filtered.some(
            (n) => n.subject === 'Science' && (n.arabicNote?.includes('أدوات') || n.note?.includes('Tools'))
          );
          if (!hasSciTools && !deletedIds.includes(sciToolsId) && !deletedIds.includes(semKeySci)) {
            filtered.push({
              id: sciToolsId,
              classId: classId,
              targetDay: 'Sunday',
              subject: 'Science',
              note: 'Science tools required',
              arabicNote: `تذكير لكلاس ${classId === 'G2C' ? 'C' : 'B'}: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).`,
              bagItem: 'أوراق ملونة، صمغ، ألوان خشبية، وخيط كروشيه',
              isQuiz: false,
              categoryType: 'note',
              block: 1,
              week: 3,
              isCustom: true
            });
          }
        }

        // G2B French Quiz is on Monday (prepared on Sunday, targetDay: Monday)
      }

      if (targetDay === 'Monday' && classId === 'G2B') {
        const fQuizId = `tn-b1-w3-G2B-Mon-french-quiz`;
        const semKeyF = `french-quiz-Monday`;
        const hasFQuiz = filtered.some(
          (n) => n.subject === 'French' && (n.note?.toLowerCase().includes('quiz') || n.arabicNote?.includes('كويز'))
        );
        if (!hasFQuiz && !deletedIds.includes(fQuizId) && !deletedIds.includes(semKeyF)) {
          filtered.push({
            id: fQuizId,
            classId: 'G2B',
            targetDay: 'Monday',
            subject: 'French',
            title: 'Quiz',
            note: 'Quiz',
            arabicNote: 'كويز فرنش (Quiz)',
            bagItem: '',
            isQuiz: true,
            categoryType: 'quiz',
            block: 1,
            week: 3,
            isCustom: true
          });
        }
      }

      if (targetDay === 'Tuesday' && classId === 'G2C') {
        const fQuizId = `tn-b1-w3-G2C-Tue-french-quiz`;
        const semKeyF = `french-quiz-Tuesday`;
        const hasFQuiz = filtered.some(
          (n) => n.subject === 'French' && (n.note?.toLowerCase().includes('quiz') || n.arabicNote?.includes('كويز'))
        );
        if (!hasFQuiz && !deletedIds.includes(fQuizId) && !deletedIds.includes(semKeyF)) {
          filtered.push({
            id: fQuizId,
            classId: 'G2C',
            targetDay: 'Tuesday',
            subject: 'French',
            title: 'Quiz',
            note: 'Quiz',
            arabicNote: 'كويز فرنش (Quiz)',
            bagItem: '',
            isQuiz: true,
            categoryType: 'quiz',
            block: 1,
            week: 3,
            isCustom: true
          });
        }
      }

      if (targetDay === 'Wednesday' && classId === 'G2A') {
        const fQuizId = `tn-b1-w3-G2A-Wed-french-quiz`;
        const semKeyF = `french-quiz-Wednesday`;
        const hasFQuiz = filtered.some(
          (n) => n.subject === 'French' && (n.note?.toLowerCase().includes('quiz') || n.arabicNote?.includes('كويز'))
        );
        if (!hasFQuiz && !deletedIds.includes(fQuizId) && !deletedIds.includes(semKeyF)) {
          filtered.push({
            id: fQuizId,
            classId: 'G2A',
            targetDay: 'Wednesday',
            subject: 'French',
            title: 'Quiz',
            note: 'Quiz',
            arabicNote: 'كويز فرنش (Quiz)',
            bagItem: '',
            isQuiz: true,
            categoryType: 'quiz',
            block: 1,
            week: 3,
            isCustom: true
          });
        }
      }

      if (targetDay === 'Monday' && classId === 'G2A') {
        const sciToolsId = `tn-b1-w3-G2A-Mon-science-tools`;
        const semKey = `science-tools-Monday`;
        const hasSciTools = filtered.some(
          (n) => n.subject === 'Science' && (n.arabicNote?.includes('أدوات') || n.note?.includes('Tools') || n.arabicNote?.includes('كروشيه'))
        );
        if (!hasSciTools && !deletedIds.includes(sciToolsId) && !deletedIds.includes(semKey)) {
          filtered.push({
            id: sciToolsId,
            classId: 'G2A',
            targetDay: 'Monday',
            subject: 'Science',
            note: 'Bring Science tools: Colored sheets with different colors, glue, colored pencils, and a little crochet yarn.',
            arabicNote: 'أدوات الساينس المطلوبة: ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه.',
            bagItem: 'ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وخيط كروشيه',
            isQuiz: false,
            categoryType: 'note',
            block: 1,
            week: 3,
            isCustom: true
          });
        }
      }
    }

    // Deduplicate English dictation
    filtered.sort((a, b) => {
      const aHasPdf = a.pdfUrl ? 1 : 0;
      const bHasPdf = b.pdfUrl ? 1 : 0;
      return bHasPdf - aHasPdf;
    });
    const seenNotes = new Set<string>();
    const deduplicated = filtered.filter(n => {
      const text = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
      if (n.subject === 'English' && (text.includes('dictation') || text.includes('إملاء') || text.includes('ديكتيشن'))) {
        const key = `${n.classId || 'ALL'}-${n.targetDay}`;
        if (seenNotes.has(key)) return false;
        seenNotes.add(key);
      }
      return true;
    });

    let finalNotes = [...deduplicated];

    // Block 1 - Week 3 class-specific manual overrides (Strictly disabled for Week 4 and all other weeks)
    if (block === 1 && (week === 3 || effectiveWeek === 3)) {
      // For G2B (Class 2B) rules:
      if (classId === 'G2B') {
        // 1. Sunday (Saturday to be): Only bring booklet (removed Bring Tools)
        if (targetDay === 'Sunday') {
          // Remove any existing Science notes for G2B on Sunday to avoid duplicates
          finalNotes = finalNotes.filter(n => n.subject !== 'Science');
          
          // Push Bring Booklet
          finalNotes.push({
            id: 'tn-science-w3-G2B-Sat-booklet-forced',
            classId: 'G2B',
            targetDay: 'Sunday',
            subject: 'Science',
            note: 'Science booklet submission (Unit 1)',
            arabicNote: 'تذكير لكلاس B: تسليم بوكليت الساينس (Science Booklet) غداً الأحد لتصحيح تمارين Unit 1.',
            bagItem: 'Science Booklet (بوكليت الساينس)',
            isQuiz: false,
            categoryType: 'note',
            block: 1,
            week: 3,
            isCustom: true
          });
        }

        // 2. Monday (Sunday to be): Cancel/Remove Bring Tools task
        if (targetDay === 'Monday') {
          finalNotes = finalNotes.filter(n => {
            const isSciTools = n.subject === 'Science' && 
              (n.arabicNote?.includes('أدوات') || n.note?.toLowerCase().includes('tools') || n.note?.toLowerCase().includes('material'));
            return !isSciTools;
          });
        }

        // 3. Tuesday (Monday to be): Cancel/Remove Bring Tools task
        if (targetDay === 'Tuesday') {
          finalNotes = finalNotes.filter(n => {
            const isSciTools = n.subject === 'Science' && 
              (n.arabicNote?.includes('أدوات') || n.note?.toLowerCase().includes('tools') || n.note?.toLowerCase().includes('material'));
            return !isSciTools;
          });
        }

        // 4. Wednesday (Tuesday to be): Bring tools
        if (targetDay === 'Wednesday') {
          // Remove any existing Science tools notes to avoid duplicates
          finalNotes = finalNotes.filter(n => {
            const isSciTools = n.subject === 'Science' && 
              (n.arabicNote?.includes('أدوات') || n.note?.toLowerCase().includes('tools') || n.note?.toLowerCase().includes('material'));
            return !isSciTools;
          });
          
          finalNotes.push({
            id: 'tn-science-w3-G2B-Tue-materials-forced',
            classId: 'G2B',
            targetDay: 'Wednesday',
            subject: 'Science',
            note: 'Science tools required (Science on Wednesday)',
            arabicNote: 'تذكير لكلاس B: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه) لأن لديكم حصة ساينس غداً الأربعاء.',
            bagItem: 'أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)',
            isQuiz: false,
            categoryType: 'note',
            block: 1,
            week: 3,
            isCustom: true
          });
        }
      }

      // For G2A (Class 2A) rules:
      if (classId === 'G2A') {
        // Removed Sunday (Saturday to be): Bring tools

        // Monday (Sunday to be): Only show Science tools task and English dictation. Remove Arabic dictation and French quiz.
        if (targetDay === 'Monday') {
          finalNotes = finalNotes.filter((n) => {
            const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
            const isArabicDictation = (n.subject === 'Arabic' || n.subject === 'عربي' || n.subject === 'اللغة العربية') && (fullText.includes('إملاء') || fullText.includes('تسميع'));
            const isFrenchQuiz = n.subject === 'French' || fullText.includes('french') || fullText.includes('فرنش') || fullText.includes('فرنسي') || fullText.includes('quiz') || fullText.includes('كويز');
            return !isArabicDictation && !isFrenchQuiz;
          });

          const sciToolsId = `tn-b1-w3-G2A-Mon-science-tools`;
          const semKey = `science-tools-Monday`;
          const hasSciTools = finalNotes.some(
            (n) => n.subject === 'Science' && (n.arabicNote?.includes('أدوات') || n.note?.includes('Tools') || n.arabicNote?.includes('كروشيه'))
          );
          if (!hasSciTools && !deletedIds.includes(sciToolsId) && !deletedIds.includes(semKey)) {
            finalNotes.push({
              id: sciToolsId,
              classId: 'G2A',
              targetDay: 'Monday',
              subject: 'Science',
              note: 'Bring Science tools: Colored sheets with different colors, glue, colored pencils, and a little crochet yarn.',
              arabicNote: 'أدوات الساينس المطلوبة: ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه.',
              bagItem: 'ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وخيط كروشيه',
              isQuiz: false,
              categoryType: 'note',
              block: 1,
              week: 3,
              isCustom: true
            });
          }
        }

        // Tuesday (Monday to be): Only show Science tools task. Remove any dictation, French quiz, or Science booklet submission.
        if (targetDay === 'Tuesday') {
          finalNotes = finalNotes.filter((n) => {
            const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
            const isDictation = n.subject === 'English' || n.subject === 'Arabic' || fullText.includes('dictation') || fullText.includes('إملاء') || fullText.includes('ديكتيشن') || fullText.includes('تسميع');
            const isFrenchQuiz = n.subject === 'French' || fullText.includes('french') || fullText.includes('فرنش') || fullText.includes('فرنسي') || fullText.includes('quiz') || fullText.includes('كويز');
            const isScienceBooklet = n.subject === 'Science' && (fullText.includes('تسليم') || fullText.includes('booklet') || fullText.includes('بوكلت') || fullText.includes('بوكليت'));
            return !isDictation && !isFrenchQuiz && !isScienceBooklet;
          });

          const sciToolsId = `tn-b1-w3-G2A-Tue-science-tools`;
          const semKey = `science-tools-Tuesday`;
          const hasSciTools = finalNotes.some(
            (n) => n.subject === 'Science' && (n.arabicNote?.includes('أدوات') || n.note?.includes('Tools') || n.arabicNote?.includes('كروشيه'))
          );
          if (!hasSciTools && !deletedIds.includes(sciToolsId) && !deletedIds.includes(semKey)) {
            finalNotes.push({
              id: sciToolsId,
              classId: 'G2A',
              targetDay: 'Tuesday',
              subject: 'Science',
              note: 'Bring Science tools: Colored sheets with different colors, glue, colored pencils, and a little crochet yarn.',
              arabicNote: 'أدوات الساينس المطلوبة: ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه.',
              bagItem: 'ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وخيط كروشيه',
              isQuiz: false,
              categoryType: 'note',
              block: 1,
              week: 3,
              isCustom: true
            });
          }
        }

        // Thursday (Wednesday to be): Ensure Science tools task is present for G2A
        if (targetDay === 'Thursday') {
          const sciToolsId = 'tn-science-w3-G2A-Wed-materials';
          const semKey = 'science-tools-Thursday';
          const hasSciTools = finalNotes.some(
            (n) => n.subject === 'Science' && (n.arabicNote?.includes('أدوات') || n.note?.includes('tools') || n.arabicNote?.includes('كروشيه') || n.id === sciToolsId)
          );
          if (!hasSciTools && !deletedIds.includes(sciToolsId)) {
            finalNotes.push({
              id: sciToolsId,
              classId: 'G2A',
              targetDay: 'Thursday',
              subject: 'Science',
              title: 'Science tools required',
              note: 'Science tools required',
              arabicNote: 'تذكير لكلاس A: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).',
              bagItem: 'أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)',
              isQuiz: false,
              categoryType: 'tools',
              block: 1,
              week: 3,
              isCustom: true
            });
          }
        }
      }

      // For G2C (Class 2C) rules:
      if (classId === 'G2C') {
        // Removed Sunday (Saturday to be): Bring tools

        // Monday (Sunday to be): Remove any French Quiz
        if (targetDay === 'Monday') {
          finalNotes = finalNotes.filter((n) => {
            const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
            const isFrenchQuiz = n.subject === 'French' || fullText.includes('french') || fullText.includes('فرنش') || fullText.includes('فرنسي') || fullText.includes('quiz') || fullText.includes('كويز');
            return !isFrenchQuiz;
          });
        }
      }
    }

    return finalNotes;
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

const OBSOLETE_DELETED_TOMORROW_IDS = new Set([
  'science-booklet-submission-Sunday',
  'science-tools-Sunday',
  'science-tools-Thursday',
  'science-tools-G2A-Thursday',
  'science-tools-Wednesday',
  'science-tools-G2A-Wednesday',
  'science-booklet-submission-G2A-Thursday',
  'science-materials-colored-sheets-with-Tuesday',
  'tn-science-w3-G2A-Sat-materials',
  'tn-science-w3-G2A-Sat-materials-forced',
  'tn-science-w3-G2B-Sat-materials',
  'tn-science-w3-G2B-Sat-booklet',
  'tn-science-w3-G2A-Sat-booklet',
  'tn-science-w2-G2B-Sat-materials',
  'tn-science-w2-G2B-Sat-booklet',
  'tn-science-w2-G2A-Sat-booklet',
  'linked-hw-due-hw-b1-w3-G2A-science-page38',
  'hw-b1-w3-G2A-science-page38',
  'linked-hw-due-hw-b1-w3-G2B-science-page38',
  'hw-b1-w3-G2B-science-page38',
]);

function purgeObsoleteDeletedIds(list: string[]): string[] {
  if (!Array.isArray(list)) return [];
  return list.filter(id => !OBSOLETE_DELETED_TOMORROW_IDS.has(id));
}

export function getDeletedTomorrowNoteIdsSync(): string[] {
  try {
    const mem = IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'];
    if (mem) return purgeObsoleteDeletedIds(JSON.parse(mem));
    const raw = appStorage.getItem('nile_deleted_tomorrow_note_ids_v3');
    if (raw) return purgeObsoleteDeletedIds(JSON.parse(raw));
  } catch {}
  return [];
}

export async function getDeletedTomorrowNoteIds(): Promise<string[]> {
  try {
    const mem = IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'];
    if (mem) return purgeObsoleteDeletedIds(JSON.parse(mem));
    
    const raw = appStorage.getItem('nile_deleted_tomorrow_note_ids_v3');
    let localList: string[] = [];
    if (raw) {
      localList = purgeObsoleteDeletedIds(JSON.parse(raw));
    }
    
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('planner_settings')
        .select('value')
        .eq('key', 'deleted_tomorrow_note_ids')
        .single();
      if (data && data.value) {
        const dbList = JSON.parse(data.value);
        if (Array.isArray(dbList)) {
          const merged = purgeObsoleteDeletedIds(Array.from(new Set([...localList, ...dbList])));
          appStorage.setItem('nile_deleted_tomorrow_note_ids_v3', JSON.stringify(merged));
          IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'] = JSON.stringify(merged);
          return merged;
        }
      }
    }
    
    return localList;
  } catch (err) {
    console.error('Error fetching deleted tomorrow note ids:', err);
  }
  return [];
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

export async function removeDeletedTomorrowNoteId(noteId: string): Promise<void> {
  if (!noteId) return;
  let currentList = await getDeletedTomorrowNoteIds();
  if (currentList.includes(noteId)) {
    currentList = currentList.filter((id) => id !== noteId);
    appStorage.setItem('nile_deleted_tomorrow_note_ids_v3', JSON.stringify(currentList));
    IN_MEMORY_NOTES_CACHE['deleted_tomorrow_note_ids'] = JSON.stringify(currentList);
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
        console.warn('Error removing deleted tomorrow note id from Supabase:', e);
      }
    }
  }
}

// Save tomorrow notes directly inside classwork or homework table
export async function saveTomorrowNotes(
  block: number,
  week: number,
  notes: TomorrowSpecialNote[],
  mode: 'merge' | 'replace' = 'merge'
): Promise<void> {
  for (const note of notes) {
    if (note.id) {
      await removeDeletedTomorrowNoteId(note.id);
    }
    const semKey = getSemanticKey(note);
    if (semKey) {
      await removeDeletedTomorrowNoteId(semKey);
    }
  }

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
      if (mode === 'replace') {
        const targetBlock = notes[0]?.block || block;
        const targetWeek = notes[0]?.week || week;
        const deletePatterns = ['tomorrow-%', 'note-%', 'tn-%'];
        for (const pattern of deletePatterns) {
          await supabase
            .from('classwork')
            .delete()
            .eq('block', targetBlock)
            .eq('week', targetWeek)
            .like('id', pattern);

          await supabase
            .from('homework')
            .delete()
            .eq('block', targetBlock)
            .eq('week', targetWeek)
            .like('id', pattern);
        }
      }

      for (const note of notes) {
        // ALWAYS use tomorrow-cw prefix to identify tomorrow notes, preventing leaks to the homework table!
        const targetId = note.id || `tomorrow-cw-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const targetClasses: ClassId[] =
          (note.classId as any) === 'ALL'
            ? ['G2A', 'G2B', 'G2C']
            : [note.classId as ClassId];

        for (const classId of targetClasses) {
          const rowId = (note.classId as any) === 'ALL' ? `${targetId}-${classId}` : targetId;
          
          // Prepare row strictly for classwork table to ensure tomorrow notes NEVER leak to homework
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
    } catch (err) {
      console.error('Error saving tomorrow notes as classwork/homework entries in Supabase:', err);
    }
  }

  notifyTomorrowNotesListeners();
}

export function getSemanticKey(n: TomorrowSpecialNote): string {
  const normSubject = (n.subject || '').trim().toLowerCase();
  const text = (n.arabicNote || n.note || '').toLowerCase().replace(/[🚨📝🎒]/g, '').trim();

  // 1. Social studies homework submission
  if (normSubject.includes('social') || normSubject.includes('دراسات')) {
    if (text.includes('واجب') || text.includes('تسليم') || text.includes('شيت')) {
      return `social-hw-submission-${n.targetDay}`;
    }
  }

  // 2. Science booklet submission or tools
  if (normSubject.includes('science') || normSubject.includes('علوم') || normSubject.includes('ساينس')) {
    if (text.includes('بوكلت') || text.includes('بوكليت') || text.includes('تسليم') || text.includes('تجميع') || n.id?.includes('hw-submit')) {
      return `science-booklet-submission-${n.targetDay}`;
    }
    if (text.includes('أدوات') || text.includes('tools') || text.includes('خيط') || text.includes('كروشيه')) {
      return `science-tools-${n.targetDay}`;
    }
  }

  // 3. French Quiz
  if (normSubject.includes('french') || normSubject.includes('فرنش') || normSubject.includes('فرنسي')) {
    if (text.includes('quiz') || text.includes('كويز') || text.includes('اختبار')) {
      return `french-quiz-${n.targetDay}`;
    }
  }

  // 4. Arabic specific tasks
  if (normSubject.includes('arabic') || normSubject.includes('عربي')) {
    if (text.includes('إملاء') || text.includes('dictation')) {
      return `arabic-dictation-${n.targetDay}`;
    }
    if (text.includes('تسميع') || text.includes('آيات') || text.includes('recitation')) {
      return `arabic-recitation-${n.targetDay}`;
    }
    if (text.includes('مهنة أبي') || text.includes('نص استماع')) {
      return `arabic-listening-${n.targetDay}`;
    }
    if (text.includes('المكتبة') || text.includes('مكتبة')) {
      return `arabic-library-${n.targetDay}`;
    }
  }

  // 5. Mathematics tests
  if (normSubject.includes('math') || normSubject.includes('رياضيات')) {
    if (text.includes('test') || text.includes('اختبار') || text.includes('unit 1')) {
      return `math-test-${n.targetDay}`;
    }
  }

  // 6. English dictation
  if (normSubject.includes('english') || normSubject.includes('إنجليزي') || normSubject.includes('انجليزي')) {
    if (text.includes('dictation') || text.includes('إملاء') || text.includes('ديكتيشن')) {
      return `english-dictation-${n.targetDay}`;
    }
  }

  // Default: group by subject and normalized first words
  const cleanWordSeq = text.replace(/[^a-z0-9\u0600-\u06FF]/gi, ' ').split(/\s+/).filter(Boolean).slice(0, 4).join('-');
  return `${normSubject}-${cleanWordSeq || n.id || 'note'}-${n.targetDay}`;
}

