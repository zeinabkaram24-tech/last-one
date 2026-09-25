import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, BookOpen, ExternalLink, Pencil, Trash, Plus, AlertTriangle } from 'lucide-react';
import { ClassId, SchoolDay, PeriodSlot, TomorrowSpecialNote, HomeworkEntry, ClassworkEntry } from '../types';
import {
  CLASS_TIMETABLES,
  NEXT_SCHOOL_DAY,
  SUBJECT_METADATA,
} from '../data/timetables';
import { SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { SubjectIcon } from './SubjectIcon';
import {
  getTomorrowNotesForDay,
  subscribeToTomorrowNotes,
  getDeletedTomorrowNoteIds,
  getDeletedTomorrowNoteIdsSync,
  saveDeletedTomorrowNoteId,
  WEEK3_SPECIAL_NOTES
} from '../utils/tomorrowNotesStorage';
import { AttachmentPdfCard } from './AttachmentPdfCard';

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

interface TomorrowViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  currentBlock?: number;
  currentWeek?: number;
  homeworkList?: HomeworkEntry[];
  classworkList?: ClassworkEntry[];
  isAdminEditMode?: boolean;
  onAddTomorrowNote?: (prefilled?: Partial<TomorrowSpecialNote>) => void;
  onEditTomorrowNote?: (entry: TomorrowSpecialNote) => void;
  onDeleteTomorrowNote?: (id: string) => void;
}

const ARABIC_DAY_NAMES: Record<SchoolDay, string> = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
};

export const TomorrowView: React.FC<TomorrowViewProps> = ({
  currentClass,
  selectedDay,
  currentBlock = 1,
  currentWeek = 2,
  homeworkList = [],
  classworkList = [],
  isAdminEditMode = false,
  onAddTomorrowNote,
  onEditTomorrowNote,
  onDeleteTomorrowNote,
}) => {
  // Tomorrow's target day based on the active selected day
  const tomorrowDay: SchoolDay = NEXT_SCHOOL_DAY[selectedDay] || 'Sunday';

  // Tomorrow's timetable periods (the 8 periods)
  const targetPeriods: PeriodSlot[] = CLASS_TIMETABLES[currentClass][tomorrowDay] || [];

  // Helper to determine whether an item is a Quiz or Test
  const isQuizOrTest = (n: TomorrowSpecialNote) => {
    if (!n) return false;
    if (n.subject === 'Social Studies') return false;
    const text = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
    
    // Explicitly exclude Science booklet/booklet submissions from being classified as quizzes/tests
    if (
      n.subject === 'Science' &&
      (text.includes('بوكلت') ||
        text.includes('بوكليت') ||
        text.includes('booklet') ||
        text.includes('submission'))
    ) {
      return false;
    }

    if (n.isQuiz || n.categoryType === 'quiz') return true;
    
    // Explicitly exclude any homework, homework submissions, tools, or materials tasks
    if (
      text.includes('واجب') ||
      text.includes('هوم ورك') ||
      text.includes('هومورك') ||
      text.includes('تسليم') ||
      text.includes('submission') ||
      text.includes('homework') ||
      text.includes('tools') ||
      text.includes('أدوات') ||
      text.includes('حقيبة') ||
      text.includes('كشكول') ||
      text.includes('bag') ||
      text.includes('sheet') ||
      text.includes('شيت')
    ) {
      return false;
    }

    return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test(text);
  };

  // User mandate: strictly remove any fabricated math supplies notes (whiteboard, 100 chart, markers, etc.)
  const isFabricatedMathNote = (n: TomorrowSpecialNote) => {
    if (!n) return false;
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
  };

  // Notes from weekly plan for tomorrow (only teacher instructions / tools / bag items / quizzes, strictly excluding plain homework)
  const isDisallowedTomorrowItem = (n: TomorrowSpecialNote) => {
    if (!n) return true;

    // UNCONDITIONAL ADMIN / USER OVERRIDE:
    // Any note created, added, or edited by admin or user is unconditionally allowed without ANY restrictions!
    if (
      n.isCustom ||
      (n as any).isUserCreated ||
      (n as any).isAdminModified ||
      (n as any).source === 'user' ||
      (n as any).source === 'admin' ||
      n.id?.startsWith('custom-') ||
      n.id?.startsWith('tn-') ||
      n.id?.startsWith('tomorrow-') ||
      n.id?.startsWith('note-') ||
      n.id?.startsWith('manual-') ||
      (n as any).isCustomOrExplicit ||
      currentWeek >= 4
    ) {
      return false;
    }

    if (currentWeek === 3) {
      // Strict user rule: "كلاس B وكلاس C يوم الاتنين في tomorrow." (No reminders/notes on Monday for G2B and G2C!)
      if (tomorrowDay === 'Monday' && (currentClass === 'G2B' || currentClass === 'G2C')) {
        return true; // Strictly disallow all system/default reminders/notes on Monday for Class B and Class C!
      }

      // Strict Saturday / Sunday lookahead French Homework exclusion:
      // "وعايزة أمسح الـ task بتاع تسليم هوم ورك الفرنش اللي هي في 2A في السبت tomorrow. وامسح حكاية الـ homework الـ French من يوم السبت."
      if ((selectedDay === 'Saturday' || tomorrowDay === 'Sunday') && (n.subject === 'French' || (n.subject as string)?.toLowerCase() === 'french')) {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        if (fullText.includes('homework') || fullText.includes('واجب') || fullText.includes('تسليم') || fullText.includes('page 26') || fullText.includes('fiche')) {
          return true;
        }
      }

      // 1. Strict G2A Monday & Tuesday rule:
      // "يوم الاثنين في التومورو لكلاس 2 أ، هيتحط لي بس تاسك إحضار الأدوات للساينس."
      // "في نفس اليوم ونفس الفصل هيتشال تاسك الإملاء اللي انت عامله. بوهيتشال تاسك كويز فرنسي اللي انت عامله."
      if (currentClass === 'G2A' && (tomorrowDay === 'Monday' || tomorrowDay === 'Tuesday')) {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isSciTools = n.subject === 'Science' && (fullText.includes('أدوات') || fullText.includes('tools') || fullText.includes('materials') || fullText.includes('كروشيه') || fullText.includes('خيط'));
        const isEnglishDictation = n.subject === 'English' && (fullText.includes('dictation') || fullText.includes('إملاء') || fullText.includes('ديكتيشن'));
        
        if (tomorrowDay === 'Monday') {
          if (!isSciTools && !isEnglishDictation) {
            return true; // Strictly disallowed (Allow ONLY Science tools or English dictation!)
          }
        } else {
          if (!isSciTools) {
            return true; // Strictly disallowed (ONLY allow Science tools!)
          }
        }
      }

      // Cancel/remove any dictation reminder for Class B (G2B) and Class C (G2C) on Monday (tomorrowDay === 'Monday')
      if (tomorrowDay === 'Monday' && (currentClass === 'G2B' || currentClass === 'G2C')) {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isDictation = fullText.includes('dictation') || fullText.includes('إملاء') || fullText.includes('ديكتيشن') || fullText.includes('تسميع');
        if (isDictation) {
          return true; // Strictly disallowed!
        }
      }

      // Strictly disallow any Science booklet submission for Class C (G2C) on ANY day in the tomorrow view
      if (currentClass === 'G2C') {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isSciBooklet = n.subject === 'Science' && (fullText.includes('بوكلت') || fullText.includes('بوكليت') || fullText.includes('booklet') || fullText.includes('submission') || fullText.includes('تسليم'));
        if (isSciBooklet) {
          return true; // Strictly disallowed for G2C!
        }
      }

      // G2C French Quiz on Monday (Sunday tomorrow) is disallowed!
      if (currentClass === 'G2C' && tomorrowDay === 'Monday' && n.subject === 'French') {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isFrenchQuiz = fullText.includes('quiz') || fullText.includes('كويز') || fullText.includes('اختبار');
        if (isFrenchQuiz) {
          return true;
        }
      }

      // Strict Saturday rules for Tomorrow view:
      // 1) "قم بحذف task dictation من يوم السبت لـ class A و C في tomorrow." (and B as well)
      // 2) French is disallowed on Saturday
      if (selectedDay === 'Saturday' || tomorrowDay === 'Saturday') {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isDictation = fullText.includes('dictation') || fullText.includes('ديكتيشن') || fullText.includes('إملاء');
        if (isDictation) {
          return true; // Strictly disallowed on Saturday for all classes!
        }
        const isFrench = n.subject === 'French' || fullText.includes('french') || fullText.includes('فرنش') || fullText.includes('فرنسي');
        if (isFrench) {
          return true; // Strictly disallowed on Saturday
        }
      }

      // 2. Strict Math test reminder rule: only show on Wednesday (tomorrowDay === 'Thursday')
      if (n.subject === 'Mathematics' || n.subject === 'Math') {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isTest = n.isQuiz || n.categoryType === 'quiz' || fullText.includes('test') || fullText.includes('quiz') || fullText.includes('اختبار') || fullText.includes('كويز') || fullText.includes('امتحان') || fullText.includes('تقييم');
        if (isTest && (tomorrowDay as string) !== 'Thursday') {
          return true; // Strictly disallowed on any day other than Wednesday (where tomorrowDay === 'Thursday')
        }
      }

      // 3. Strict Science rules for Sunday (Saturday-Tomorrow view):
      if (tomorrowDay === 'Sunday' && n.subject === 'Science') {
        const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isTools = fullText.includes('أدوات') || fullText.includes('tools') || fullText.includes('materials') || fullText.includes('كروشيه') || fullText.includes('خيط');
        const isBooklet = fullText.includes('بوكلت') || fullText.includes('بوكليت') || fullText.includes('تسليم') || fullText.includes('booklet') || fullText.includes('submission');

        if (isTools) {
          // G2B and G2C have Science tools on Sunday
          // G2A does NOT have Science tools on Sunday
          if (currentClass === 'G2A') {
            return true; // Strictly disallowed for G2A on Sunday
          }
          return false; // Explicitly allowed for G2B and G2C
        }

        if (isBooklet) {
          // G2A and G2B have Science booklet submission on Sunday
          return false; // Explicitly allowed for G2A and G2B
        }
      }
    }

    // 4. Week 3 Subject Dictation rules
    if (currentWeek === 3) {
      // Strict English rule: ONLY allow dictation ("dictation" or "إملاء" or "ديكتيشن") on Monday (Sunday looked ahead), completely block all other English notes/alerts/submissions on any day
      if (n.subject === 'English') {
        const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isDictation = fullText.includes('dictation') || fullText.includes('إملاء') || fullText.includes('ديكتيشن');
        if ((tomorrowDay === 'Monday' || tomorrowDay === 'Sunday') && isDictation) {
          // Allowed!
        } else if (isDictation) {
          // Allowed!
        } else {
          return true; // Disallowed
        }
      }

      // Strict Arabic rule: ONLY allow dictation ("إملاء") notes for Arabic, disallow any other Arabic notes
      if (n.subject === 'Arabic' || n.subject === 'عربي' || n.subject === 'اللغة العربية') {
        const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isDictation = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('تسميع');
        if (!isDictation) {
          return true; // Disallowed
        }
      }
    }

    // 5. Universal Arabic rule: ONLY allow Dictation (إملاء) or Quiz/Test (اختبار / كويز) for Arabic in Tomorrow!
    // Never allow any other Arabic items (no prep, reading, library, or general notes, no matter if manual/seeded/custom)
    const normSubjectText = (n.subject || '').trim().toLowerCase();
    const isArabicSubject = normSubjectText === 'arabic' || normSubjectText.includes('عربي') || normSubjectText.includes('اللغة العربية');
    if (isArabicSubject) {
      const fullText = ((n.title || '') + ' ' + (n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
      const isDictation = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('تسميع');
      const isQuiz = n.isQuiz || isQuizOrTest(n) || fullText.includes('اختبار') || fullText.includes('كويز') || fullText.includes('امتحان') || fullText.includes('تقييم') || fullText.includes('test') || fullText.includes('quiz');
      if (!isDictation && !isQuiz) {
        return true; // Strictly block any other Arabic items
      }
    }

    // 6. Strict user rule: "التاسكات اللي بتتحط بتسليم واجب دي ما بتتحطش غير للساينس والسوشيال بس"
    // Homework submission tasks (تسليم واجب) are STRICTLY FORBIDDEN for any subject other than Science and Social Studies!
    const normSubject = (n.subject || '').toLowerCase();
    const isSciOrSoc =
      normSubject.includes('science') ||
      normSubject.includes('ساينس') ||
      normSubject.includes('social') ||
      normSubject.includes('دراسات');
    const noteFullText = (
      ((n as any).title || '') +
      ' ' +
      (n.note || '') +
      ' ' +
      (n.arabicNote || '') +
      ' ' +
      (n.bagItem || '')
    ).toLowerCase();
    const isSubmission =
      noteFullText.includes('تسليم واجب') ||
      noteFullText.includes('تسليم الواجب') ||
      (noteFullText.includes('تسليم') &&
        (noteFullText.includes('واجب') ||
          noteFullText.includes('hw') ||
          noteFullText.includes('homework') ||
          noteFullText.includes('شيت') ||
          noteFullText.includes('sheet')));
    if (!isSciOrSoc && isSubmission) {
      return true; // Disallow any homework submission task for subjects other than Science and Social Studies
    }

    // =========================================================================
    // DEFAULT DISPLAY LOGIC FOR MANUAL / SPECIAL / GENERIC ITEMS
    // =========================================================================

    // User or admin manually added notes or special tn- notes must always be displayed (unless they violate the strict overrides above)
    if (n.isCustom || (n.id && (n.id.includes('manual') || n.id.includes('tomorrow-') || n.id.includes('note-') || n.id.includes('tn-') || n.id.includes('custom')))) {
      return false;
    }
    if (isFabricatedMathNote(n)) return true;

    // Filter out community notes / "مجتمع الصف الثاني"
    const lowerText = ((n.note || '') + ' ' + (n.arabicNote || '') + ' ' + (n.bagItem || '')).toLowerCase();
    if (
      lowerText.includes('مجتمع الصف الثاني') ||
      lowerText.includes('مجتمع الصف الدراسي') ||
      lowerText.includes('مجتمع')
    ) {
      return true;
    }

    // Week 3 general Sunday restriction
    if (currentWeek === 3 && tomorrowDay === 'Sunday') {
      const isQuiz = isQuizOrTest(n);
      const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
      const isFrench = n.subject === 'French';
      const isSocialStudiesSubmission =
        n.subject === 'Social Studies' &&
        (currentClass === 'G2A' || currentClass === 'G2C') &&
        (fullText.includes('تسليم') || fullText.includes('submission') || fullText.includes('واجب'));
      const isScienceBookletSubmission =
        n.subject === 'Science' &&
        (fullText.includes('تسليم') || fullText.includes('submission') || fullText.includes('booklet') || fullText.includes('بوكلت') || fullText.includes('بوكليت'));
      const hasBagItem = !!n.bagItem;

      if (!isQuiz && !isFrench && !isSocialStudiesSubmission && !isScienceBookletSubmission && !hasBagItem) {
        return true; // Disallowed
      }
    }

    if (isQuizOrTest(n) || n.bagItem) return false;
    const lower = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase().trim();
    if (lower.includes('تسليم') || lower.includes('submission') || lower.includes('استلام') || lower.includes('شيت') || lower.includes('sheet')) return false;
    return lower.startsWith('hw:') || lower.startsWith('homework:') || lower.startsWith('واجب:');
  };

  // Support current week
  const effectiveWeek = currentWeek;

  // Synchronous initialization for deleted note IDs to prevent initial frame flickering
  const [deletedNoteIds, setDeletedNoteIds] = useState<string[]>(() => {
    const raw = getDeletedTomorrowNoteIdsSync();
    return raw.filter((id) => !OBSOLETE_DELETED_TOMORROW_IDS.has(id));
  });

  const getSemanticKey = (n: TomorrowSpecialNote): string => {
    const normSubject = (n.subject || '').trim().toLowerCase();
    const text = ((n.title || '') + ' ' + (n.arabicNote || '') + ' ' + (n.note || '')).toLowerCase().replace(/[🚨📝🎒]/g, '').trim();

    // 1. Social studies homework submission
    if (normSubject.includes('social') || normSubject.includes('دراسات')) {
      if (text.includes('واجب') || text.includes('تسليم') || text.includes('شيت')) {
        return `social-hw-submission-${n.targetDay}`;
      }
    }

    // 2. Science booklet submission or tools
    if (normSubject.includes('science') || normSubject.includes('علوم') || normSubject.includes('ساينس')) {
      if (text.includes('بوكلت') || text.includes('بوكليت') || text.includes('تسليم') || text.includes('تجميع') || n.id?.includes('hw-submit') || n.id?.includes('booklet')) {
        return `science-booklet-submission-${n.classId || currentClass || 'ALL'}-${n.targetDay}`;
      }
      if (text.includes('أدوات') || text.includes('tools') || text.includes('خيط') || text.includes('كروشيه') || n.id?.includes('materials') || n.id?.includes('tools')) {
        return `science-tools-${n.classId || currentClass || 'ALL'}-${n.targetDay}`;
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
      if (text.includes('test') || text.includes('اختبار') || text.includes('unit 1') || text.includes('unit 2')) {
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
  };

  const handleDeleteTomorrowNote = (noteOrId: TomorrowSpecialNote | string) => {
    const note = typeof noteOrId === 'object' ? noteOrId : tomorrowNotes.find((n) => n.id === noteOrId);
    const noteId = typeof noteOrId === 'string' ? noteOrId : noteOrId?.id;
    const semKey = note ? getSemanticKey(note) : '';
    const idsToDelete = [noteId, ...(note?.linkedIds || []), semKey].filter(Boolean) as string[];

    setDeletedNoteIds((prev) => Array.from(new Set([...prev, ...idsToDelete])));
    setTomorrowNotes((prev) =>
      prev.filter((n) => {
        if (noteId && n.id === noteId) return false;
        if (note?.linkedIds && n.id && note.linkedIds.includes(n.id)) return false;
        if (semKey && getSemanticKey(n) === semKey) return false;
        return true;
      })
    );

    idsToDelete.forEach((id) => {
      saveDeletedTomorrowNoteId(id).catch(() => {});
      onDeleteTomorrowNote?.(id);
    });
  };

  const [tomorrowNotes, setTomorrowNotes] = useState<TomorrowSpecialNote[]>(() => {
    if (currentWeek === 4 || effectiveWeek === 4) {
      return [];
    }

    const base =
      currentBlock === 1 && (currentWeek === 3 || effectiveWeek === 3)
        ? WEEK3_SPECIAL_NOTES.filter(
            (n) => (n.classId === currentClass || (n.classId as any) === 'ALL') && n.targetDay === tomorrowDay
          )
        : currentBlock === 1 && (currentWeek === 2 || effectiveWeek === 2)
        ? WEEK2_SPECIAL_NOTES.filter(
            (n) => (n.classId === currentClass || (n.classId as any) === 'ALL') && n.targetDay === tomorrowDay
          )
        : currentBlock === 1 && (currentWeek === 1 || effectiveWeek === 1)
        ? SPECIAL_TEACHER_NOTES.filter(
            (n) =>
              (n.classId === currentClass || (n.classId as any) === 'ALL') &&
              n.targetDay === tomorrowDay &&
              (n.week === 1 || !n.week)
          )
        : [];

    return base.filter((n) => !isDisallowedTomorrowItem(n));
  });

  useEffect(() => {
    let isMounted = true;
    const loadNotes = async () => {
      try {

        const [deletedIds, notes] = await Promise.all([
          getDeletedTomorrowNoteIds(),
          getTomorrowNotesForDay(
            currentBlock,
            currentWeek,
            currentClass,
            tomorrowDay
          )
        ]);
        if (isMounted) {
          const sanitizedDeletedIds = deletedIds.filter((id) => !OBSOLETE_DELETED_TOMORROW_IDS.has(id));
          setDeletedNoteIds((prev) => Array.from(new Set([...prev, ...sanitizedDeletedIds])));
          setTomorrowNotes(notes.filter((n) => !isDisallowedTomorrowItem(n)));
        }
      } catch (err) {
        console.warn('Error loading tomorrow notes:', err);
      }
    };

    loadNotes();
    const unsubscribe = subscribeToTomorrowNotes(loadNotes);
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentBlock, currentWeek, currentClass, tomorrowDay]);

  const getNoteDisplayArabic = (n: TomorrowSpecialNote) => {
    if (!n) return '';
    const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
    
    // Force Science booklet/submission text to strictly be "تسليم بوكليت الساينس" with no pages or details as per user request
    if (n.subject === 'Science' && (fullText.includes('بوكلت') || fullText.includes('بوكليت') || fullText.includes('booklet') || fullText.includes('submission') || fullText.includes('تسليم'))) {
      return 'تسليم بوكليت الساينس';
    }

    const isEnglish = n.subject === 'English' || fullText.includes('english');
    const isDictation = fullText.includes('dictation') || fullText.includes('ديكتيشن') || fullText.includes('إملاء');
    if (isEnglish && isDictation) {
      return 'ديكتيشن';
    }
    // Always respect user-edited or custom note text directly, cleaning out any appended English text
    let display = (n.arabicNote && n.arabicNote.trim()) ? n.arabicNote.trim() : (n.note && n.note.trim()) ? n.note.trim() : '';
    display = display.replace(/Required Materials:.*$/i, '').replace(/Required:.*$/i, '').replace(/\(Tools:.*$/i, '').trim();
    return display;
  };

  const getNoteDisplayBagItem = (n: TomorrowSpecialNote) => {
    if (!n) return '';
    const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
    
    // Force Science booklet bagItem to be strictly "بوكليت الساينس" as per user request
    if (n.subject === 'Science' && (fullText.includes('بوكلت') || fullText.includes('بوكليت') || fullText.includes('booklet') || fullText.includes('submission') || fullText.includes('تسليم'))) {
      return 'بوكليت الساينس';
    }

    if (fullText.includes('dictation') || fullText.includes('ديكتيشن') || fullText.includes('إملاء')) {
      return '';
    }
    let item = n.bagItem || '';
    if (item.includes('Colored sheets') || item.includes('colored sheets') || item.includes('chrochet') || item.includes('crochet')) {
      if (item.includes('بوكليت') || item.includes('Booklet') || item.includes('Workbook') || item.includes('كتاب')) {
        return 'بوكليت الساينس، أدوات الساينس المطلوبة (ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وخيط كروشيه)';
      }
      return 'ورق ملون بألوان مختلفة، صمغ، ألوان خشبية، وخيط كروشيه';
    }
    if (item.includes('Workbook') || item.includes('Booklet')) {
      return item.replace(/Science Workbook \/ Booklet/gi, 'كتاب أو بوكليت الساينس')
                 .replace(/Booklet/gi, 'بوكليت')
                 .replace(/Workbook/gi, 'كتاب التمارين');
    }
    return item;
  };

  const getNoteBadgeInfo = (note: TomorrowSpecialNote) => {
    if (!note) {
      return {
        label: 'ملاحظات',
        badgeClass: 'bg-blue-100 text-blue-950 font-black',
        cardClass: 'bg-slate-50 border border-slate-200 shadow-2xs',
        subjectName: '',
        isAlert: false,
      };
    }
    
    const fullText = ((note.note || '') + ' ' + (note.arabicNote || '')).toLowerCase();

    // Force Science booklet/booklet submissions to always be styled as regular, non-critical notes
    if (
      note.subject === 'Science' &&
      (fullText.includes('بوكلت') ||
        fullText.includes('بوكليت') ||
        fullText.includes('booklet') ||
        fullText.includes('submission'))
    ) {
      return {
        label: 'ملاحظات الساينس',
        badgeClass: 'bg-blue-100 text-blue-950 font-black border border-blue-200',
        cardClass: 'bg-slate-50 border border-slate-200 shadow-2xs',
        subjectName: 'الساينس (Science)',
        isAlert: false,
      };
    }

    const quiz = isQuizOrTest(note);
    const isDictation = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('ديكتيشن') || fullText.includes('تسميع');
    const isArabic = note.subject === 'Arabic' || fullText.includes('عربي') || fullText.includes('عربية');
    const isEnglish = note.subject === 'English' || fullText.includes('english');

    // Is it a homework submission task?
    const isSubmission =
      fullText.includes('تسليم') ||
      fullText.includes('submission') ||
      fullText.includes('استلام') ||
      fullText.includes('واجب') ||
      fullText.includes('homework') ||
      fullText.includes('hw:');

    // Arabic translation helper for subject names
    const getArabicSubjectName = (subj: string) => {
      const s = subj.toLowerCase();
      if (s.includes('science') || s.includes('ساينس') || s.includes('علوم')) return 'الساينس (Science)';
      if (s.includes('social') || s.includes('دراسات')) return 'الدراسات الاجتماعية';
      if (s.includes('math') || s.includes('رياضيات')) return 'الماث (Math)';
      if (s.includes('french') || s.includes('فرنش')) return 'اللغة الفرنسية';
      if (s.includes('arabic') || s.includes('عربي')) return 'اللغة العربية';
      if (s.includes('religion') || s.includes('دين')) return 'التربية الدينية';
      if (s.includes('ict') || s.includes('تكنولوجيا')) return 'ICT';
      if (s.includes('art') || s.includes('رسم')) return 'التربية الفنية';
      if (s.includes('music') || s.includes('موسيقى')) return 'الموسيقى';
      return subj;
    };

    const arabName = getArabicSubjectName(note.subject);

    if (isSubmission) {
      return {
        label: 'تسليم هوم ورك 📋',
        badgeClass: 'bg-indigo-600 text-white font-black shadow-2xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px]',
        cardClass: 'bg-indigo-50/70 border-2 border-indigo-300 text-indigo-950 font-bold shadow-2xs',
        subjectName: arabName,
        isAlert: false,
      };
    }

    if (quiz) {
      // User directive: Arabic dictation is strictly 'إملاء' (NO 'Dictation'), English dictation is 'Dictation' / 'ديكتيشن'
      let label = '🚨 اختبار';
      if (isDictation) {
        label = isArabic ? '✍️ إملاء كشكول الطالب' : isEnglish ? '🚨 ديكتيشن' : '✍️ إملاء كشكول الطالب';
      } else if (note.subject === 'French') {
        label = '🇫🇷 كويز فرنسي';
      } else if (note.subject === 'Mathematics' || note.subject === 'Math') {
        label = '📐 اختبار رياضيات';
      } else if (fullText.includes('quiz') || fullText.includes('كويز')) {
        label = '🚨 كويز';
      }

      return {
        label,
        badgeClass: 'bg-rose-600 text-white font-black shadow-xs',
        cardClass: 'bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold shadow-xs',
        subjectName: isEnglish ? 'English' : arabName,
        isAlert: true,
      };
    }

    if (note.subject === 'French') {
      return {
        label: 'Remarque',
        badgeClass: 'bg-purple-100 text-purple-950 font-black',
        cardClass: 'bg-purple-50/50 border border-purple-200/80 shadow-2xs',
        subjectName: 'French',
        isAlert: false,
      };
    }
    if (note.subject === 'Social Studies') {
      return {
        label: 'ملاحظات',
        badgeClass: 'bg-amber-100 text-amber-950 font-black border border-amber-300',
        cardClass: 'bg-amber-50/80 border-2 border-amber-300/90 shadow-2xs text-amber-950',
        subjectName: 'الدراسات الاجتماعية',
        isAlert: false,
      };
    }
    if (note.subject === 'Arabic') {
      return {
        label: 'ملاحظات',
        badgeClass: 'bg-emerald-100 text-emerald-950 font-black',
        cardClass: 'bg-emerald-50/40 border border-emerald-200/80 shadow-2xs',
        subjectName: 'اللغة العربية',
        isAlert: false,
      };
    }
    return {
      label: 'ملاحظات',
      badgeClass: 'bg-blue-100 text-blue-950 font-black',
      cardClass: 'bg-slate-50 border border-slate-200 shadow-2xs',
      subjectName: arabName,
      isAlert: false,
    };
  };

  // Automatically link and synchronize tests/quizzes/dictations and homework submissions from homework and classwork
  const linkedAlerts = useMemo<TomorrowSpecialNote[]>(() => {
    const alerts: TomorrowSpecialNote[] = [];
    const checkText = (txt: string) => {
      return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((txt || '').toLowerCase());
    };

    const effectiveWeekForHw = currentWeek;

    // 1. Linked from Homework:
    homeworkList.forEach((h) => {
      const cid = h.class_id || h.classId;
      if (cid !== currentClass && (cid as any) !== 'ALL') return;
      if (h.week && h.week !== effectiveWeekForHw) return;

      const fullText = `${h.task} ${h.details || ''} ${h.subject}`;
      const isForTomorrow = h.dueDay === tomorrowDay || h.assignedDay === tomorrowDay;
      const hwAlertId = `linked-hw-${h.id}`;
      const hwDueAlertId = `linked-hw-due-${h.id}`;
      if (deletedNoteIds.includes(hwAlertId) || deletedNoteIds.includes(hwDueAlertId)) return;

      // A) Tests, quizzes, dictations
      if (isForTomorrow && checkText(fullText)) {
        if (selectedDay === 'Saturday') {
          const lower = fullText.toLowerCase();
          if (lower.includes('dictation') || lower.includes('ديكتيشن') || lower.includes('إملاء')) {
            return;
          }
        }
        alerts.push({
          id: hwAlertId,
          classId: currentClass,
          targetDay: tomorrowDay,
          subject: h.subject,
          note: h.task,
          arabicNote: h.details ? `${h.task} (${h.details})` : h.task,
          bagItem: h.pages || undefined,
          isQuiz: true,
          categoryType: 'quiz',
          block: currentBlock,
          week: currentWeek,
          pdfUrl: h.pdfUrl,
        });
      }
      // B) Due for submission tomorrow - STRICT USER MANDATE: ONLY for Social Studies and Science
      else if (h.dueDay === tomorrowDay && (h.subject === 'Social Studies' || h.subject === 'Science')) {
        const isSocial = h.subject === 'Social Studies';
        const isG2ASocialNewSheet = isSocial && currentClass === 'G2A' && tomorrowDay === 'Sunday';
        alerts.push({
          id: hwDueAlertId,
          classId: currentClass,
          targetDay: tomorrowDay,
          subject: h.subject,
          note: isSocial
            ? (isG2ASocialNewSheet ? 'تسليم واجب الدراسات الاجتماعية الجديد' : 'تسليم واجب الدراسات الاجتماعية (أول حصة في الأسبوع)')
            : 'تسليم بوكلت الـ science',
          arabicNote: isSocial
            ? (isG2ASocialNewSheet 
                ? 'تذكير: تجهيز وتسليم واجب الدراسات الاجتماعية الجديد (الشيت جديد يوزع لاحقاً ولا توجد أرقام صفحات حالياً)'
                : 'تذكير: تجهيز وتسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي) في أول حصة في الأسبوع')
            : 'تسليم بوكلت الـ science',
          bagItem: isSocial ? (isG2ASocialNewSheet ? 'شيت واجب الدراسات الاجتماعية الجديد (يوزع لاحقاً)' : 'شيت واجب الدراسات الاجتماعية المرفق') : 'بوكليت الـ science',
          isQuiz: false,
          categoryType: 'note',
          block: currentBlock,
          week: currentWeek,
          pdfUrl: (isG2ASocialNewSheet || (selectedDay === 'Thursday' && h.subject === 'Social Studies')) ? undefined : h.pdfUrl,
        });
      }
    });

    // 2. Linked from Classwork:
    // If any classwork on tomorrowDay mentions a test/quiz/dictation
    classworkList.forEach((cw) => {
      if (cw.classId !== currentClass && (cw.classId as any) !== 'ALL') return;
      if (cw.day !== tomorrowDay) return;
      if (cw.week && cw.week !== currentWeek) return;
      const cwAlertId = `linked-cw-${cw.id}`;
      if (deletedNoteIds.includes(cwAlertId)) return;

      const fullText = `${cw.title} ${cw.details || ''} ${cw.subject}`;
      if (checkText(fullText)) {
        alerts.push({
          id: cwAlertId,
          classId: currentClass,
          targetDay: tomorrowDay,
          subject: cw.subject,
          note: cw.title,
          arabicNote: cw.details ? `${cw.title} (${cw.details})` : cw.title,
          bagItem: cw.pages || undefined,
          isQuiz: true,
          categoryType: 'quiz',
          block: currentBlock,
          week: currentWeek,
        });
      }
    });

    return alerts;
  }, [homeworkList, classworkList, currentClass, tomorrowDay, currentWeek, currentBlock]);

  // Merge tomorrowNotes with linkedAlerts without duplicates
  const mergedNotes = useMemo<TomorrowSpecialNote[]>(() => {
    const map = new Map<string, TomorrowSpecialNote>();
    let hasArabicDictation = false;

    const addOrMergeNote = (n: TomorrowSpecialNote, isHighPriority: boolean = false) => {
      if (isDisallowedTomorrowItem(n)) return;
      const semKey = getSemanticKey(n);

      // Check if this note, its IDs, or its semantic key is deleted
      const noteIds = [n.id, ...(n.linkedIds || [])].filter(Boolean) as string[];
      const isCustomOrExplicit =
        n.isCustom ||
        (n as any).isAdminModified ||
        (n as any).source === 'user' ||
        (n as any).source === 'admin' ||
        n.id?.startsWith('custom-') ||
        n.id?.startsWith('tomorrow-') ||
        n.id?.startsWith('tn-');

      // If the note was explicitly deleted by its exact ID
      if (noteIds.some((id) => deletedNoteIds.includes(id))) {
        return;
      }
      // If deleted by semantic key (only block semantic keys for default uncustomized items)
      if (!isCustomOrExplicit && deletedNoteIds.includes(semKey)) {
        return;
      }

      const isArabic = n.subject === 'Arabic';
      const text = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
      const isDictation = text.includes('إملاء') || text.includes('dictation') || text.includes('تسميع');
      if (isArabic && isDictation) {
        if (hasArabicDictation && !map.has(semKey)) return; // Strict rule: dictation is ONE task per day
        hasArabicDictation = true;
      }

      // Strict rule: For Math Test, user mandate: ONLY write "Test" and never display sheet
      if (semKey.startsWith('math-test-')) {
        n.title = 'Test';
        n.note = 'Test';
        n.arabicNote = 'Test';
        n.bagItem = undefined;
        n.pdfUrl = undefined;
      }

      // Strict rule: For French Quiz, user mandate: ONLY once before the session, no clutter
      if (semKey.startsWith('french-quiz-')) {
        n.title = 'Quiz';
        n.note = 'Quiz';
        n.arabicNote = 'كويز فرنش (Quiz)';
        n.bagItem = undefined;
        n.pdfUrl = undefined;
      }

      const isG2ASocialNewSheet = currentClass === 'G2A' && n.subject === 'Social Studies' && n.targetDay === 'Sunday';
      const isSocialOnThursday = selectedDay === 'Thursday' && n.subject === 'Social Studies';
      if (isG2ASocialNewSheet || isSocialOnThursday) {
        n.pdfUrl = undefined;
      }

      if (map.has(semKey)) {
        const existing = map.get(semKey)!;
        // Merge them cleanly without duplicating:
        const merged: TomorrowSpecialNote = {
          ...existing,
          ...(isHighPriority ? n : {}),
          id: (isHighPriority && n.id) ? n.id : existing.id || n.id,
          pdfUrl: (semKey.startsWith('math-test-') || isG2ASocialNewSheet || isSocialOnThursday) ? undefined : (existing.pdfUrl || n.pdfUrl),
          bagItem: semKey.startsWith('math-test-') ? undefined : (existing.bagItem || n.bagItem),
          linkUrl: existing.linkUrl || n.linkUrl,
          linkTitle: existing.linkTitle || n.linkTitle,
          arabicNote: isHighPriority && n.arabicNote ? n.arabicNote : (existing.arabicNote || n.arabicNote),
          note: isHighPriority && n.note ? n.note : (existing.note || n.note),
          title: isHighPriority && n.title ? n.title : (existing.title || n.title),
          linkedIds: Array.from(new Set([...(existing.linkedIds || []), ...(n.linkedIds || []), existing.id, n.id].filter(Boolean) as string[])),
        };
        map.set(semKey, merged);
      } else {
        map.set(semKey, {
          ...n,
          pdfUrl: (isG2ASocialNewSheet || isSocialOnThursday) ? undefined : n.pdfUrl,
          linkedIds: n.id ? [n.id] : [],
        });
      }
    };

    // Automatically inject French Quiz warning (ONLY for Block 1 - Week 3, exactly 1 day before the session per class)
    if (currentBlock === 1 && currentWeek === 3) {
      let injectFrenchQuiz = false;
      if (currentClass === 'G2A' && tomorrowDay === 'Wednesday') injectFrenchQuiz = true;
      if (currentClass === 'G2B' && tomorrowDay === 'Monday' && selectedDay !== 'Saturday') injectFrenchQuiz = true;
      if (currentClass === 'G2C' && tomorrowDay === 'Tuesday') injectFrenchQuiz = true;

      if (injectFrenchQuiz) {
        const fQuizId = `french-quiz-${currentClass}-${tomorrowDay}`;
        addOrMergeNote({
          id: fQuizId,
          classId: currentClass,
          targetDay: tomorrowDay,
          subject: 'French',
          title: 'Quiz',
          note: 'Quiz',
          arabicNote: 'كويز فرنش (Quiz)',
          isQuiz: true,
          categoryType: 'quiz',
          block: 1,
          week: 3,
        });
      }

      // Automatically inject Monday English Dictation alert ONLY for G2A in Week 3
      if (tomorrowDay === 'Monday' && currentClass === 'G2A' && selectedDay !== 'Saturday') {
        const engDictationId = `eng-dictation-${currentClass}-${tomorrowDay}`;
        addOrMergeNote({
          id: engDictationId,
          classId: currentClass,
          targetDay: tomorrowDay,
          subject: 'English',
          note: 'Dictation',
          arabicNote: 'ديكتيشن',
          isQuiz: true,
          categoryType: 'quiz',
          block: 1,
          week: 3,
        }, true);
      }

      // Saturday / Sunday explicit Science tasks injection (Week 3 ONLY)
      if (selectedDay === 'Saturday' || tomorrowDay === 'Sunday') {
        if (currentClass === 'G2B') {
          // G2B: Science tools required
          addOrMergeNote({
            id: `tn-science-w3-G2B-Sat-materials`,
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
            week: 3,
          }, true);

          // G2B: Science booklet submission
          addOrMergeNote({
            id: `tn-science-w3-G2B-Sat-booklet`,
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
            week: 3,
          }, true);
        }

        if (currentClass === 'G2A') {
          // G2A: Science booklet submission
          addOrMergeNote({
            id: `tn-science-w3-G2A-Sat-booklet`,
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
            week: 3,
          }, true);
        }

        if (currentClass === 'G2C') {
          // G2C: Science tools required
          addOrMergeNote({
            id: `tn-science-w3-G2C-Sat-materials`,
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
            week: 3,
          }, true);
        }
      }

      // Wednesday / Thursday explicit Science tools injection for G2A (Week 3 ONLY)
      if (tomorrowDay === 'Thursday' && currentClass === 'G2A') {
        const sciId = 'tn-science-w3-G2A-Wed-materials';
        if (!deletedNoteIds.includes(sciId)) {
          addOrMergeNote({
            id: sciId,
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
          }, true);
        }
      }
    }

    // Process linked alerts first
    linkedAlerts.forEach((la) => {
      addOrMergeNote(la, false);
    });

    // Custom or stored notes take precedence and enrich
    tomorrowNotes.forEach((n) => {
      addOrMergeNote(n, true);
    });

    return Array.from(map.values()).filter((n) => !isDisallowedTomorrowItem(n));
  }, [tomorrowNotes, linkedAlerts, deletedNoteIds, tomorrowDay, currentClass, currentBlock, currentWeek]);

  // Prioritize quizzes and tests to appear first in the notes list
  const sortedNotes = useMemo(() => {
    return [...mergedNotes].sort((a, b) => {
      const aQuiz = isQuizOrTest(a) ? 1 : 0;
      const bQuiz = isQuizOrTest(b) ? 1 : 0;
      return bQuiz - aQuiz;
    });
  }, [mergedNotes]);

  if (selectedDay === 'Thursday') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs text-center space-y-3">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <p className="text-sm font-black text-slate-800">يوم الجمعة إجازة رسمية ولا توجد حصص أو مهام مطلوبة للغد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* First: 2x4 Grid of Subject Blocks (8 periods) - جدول حصص الغد أولاً */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <span className="text-sm font-black text-slate-900">
            جدول حصص الغد — يوم {ARABIC_DAY_NAMES[tomorrowDay]} ({tomorrowDay})
          </span>
          <span className="text-xs text-indigo-900 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            {currentClass} • 8 حصص
          </span>
        </div>

        {targetPeriods.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <BookOpen className="w-6 h-6 mx-auto mb-1 text-slate-300" />
            <p className="text-xs font-bold">لا توجد حصص مسجلة ليوم {ARABIC_DAY_NAMES[tomorrowDay]}</p>
          </div>
        ) : (
          /* 2x4 Grid: 4 columns on desktop/tablet, 2 columns on mobile, exactly 8 blocks */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {targetPeriods.map((slot) => {
              const meta = SUBJECT_METADATA[slot.subject];
              return (
                <div
                  key={slot.period}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-center shadow-2xs transition-all ${
                    meta?.badgeBg || 'bg-slate-100 text-slate-900 border-slate-300'
                  }`}
                >
                  <SubjectIcon subject={slot.subject} className="w-4 h-4 shrink-0" />
                  <span className="font-black text-xs sm:text-sm truncate">
                    {slot.subject}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Second: Block for Notes Underneath (ملاحظات وتحذيرات حصص الغد - كويزات واختبارات باللون الأحمر) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>الملاحظات والإنذارات ليوم {ARABIC_DAY_NAMES[tomorrowDay]} ({tomorrowDay})</span>
          </div>
          {isAdminEditMode && onAddTomorrowNote && (
            <button
              onClick={() => onAddTomorrowNote({ targetDay: tomorrowDay })}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-100" />
              <span>كتابة ملاحظة</span>
            </button>
          )}
        </div>

        {sortedNotes.length === 0 ? (
          <div className="py-4 px-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-semibold">
              لا توجد ملاحظات خاصة مسجلة ليوم {ARABIC_DAY_NAMES[tomorrowDay]} في الخطة الأسبوعية
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedNotes.map((note, idx) => {
              const badgeInfo = getNoteBadgeInfo(note);
              return (
                <div
                  key={note.id || `${note.subject}-${note.targetDay}-${idx}`}
                  className={`rounded-2xl p-3.5 sm:p-4 transition-all space-y-2 text-xs ${badgeInfo.cardClass}`}
                >
                  {/* Top row: Badge on one side + Admin actions on the other */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black shadow-2xs ${badgeInfo.badgeClass}`}>
                      {badgeInfo.label} • {badgeInfo.subjectName}
                    </span>
                    {isAdminEditMode && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onEditTomorrowNote?.(note)}
                          className="p-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-md transition-colors cursor-pointer"
                          title="تعديل الملاحظة"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteTomorrowNote(note);
                          }}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-md transition-colors cursor-pointer"
                          title="حذف الملاحظة"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Task text goes below the badge, extending across the entire card width */}
                  <div className="w-full pt-0.5">
                    <p className={`leading-relaxed text-xs sm:text-sm text-slate-950 ${badgeInfo.isAlert ? 'font-black text-rose-950' : 'font-bold'}`}>
                      {getNoteDisplayArabic(note)}
                    </p>
                  </div>
                  {getNoteDisplayBagItem(note) &&
                    !(
                      ((note.note || '') + ' ' + (note.arabicNote || '')).toLowerCase().includes('إملاء') ||
                      ((note.note || '') + ' ' + (note.arabicNote || '')).toLowerCase().includes('dictation')
                    ) && (
                    <div className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-block ${
                      badgeInfo.isAlert
                        ? 'text-rose-900 bg-white border border-rose-200'
                        : 'text-amber-950 bg-white border border-amber-200/90'
                    }`}>
                      الأدوات المطلوبة: {getNoteDisplayBagItem(note)}
                    </div>
                  )}
                  {note.linkUrl && (
                    <div className="pt-1 flex">
                      <a
                        href={note.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black bg-blue-50 text-blue-950 border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3 text-blue-700" />
                        <span>{note.linkTitle || 'رابط مرفق 🔗'}</span>
                      </a>
                    </div>
                  )}
                  {(() => {
                    if (!note.pdfUrl) return null;
                    const isAllowed =
                      note.subject === 'Social Studies' ||
                      (note.subject === 'English' && (
                        ((note.note || '') + ' ' + (note.arabicNote || '')).toLowerCase().includes('dictation') ||
                        ((note.note || '') + ' ' + (note.arabicNote || '')).includes('إملاء')
                      ));
                    if (!isAllowed) return null;
                    return (
                      <div className="pt-2">
                        <AttachmentPdfCard
                          pdfUrl={note.pdfUrl}
                          subject={note.subject}
                          label="مرفق التنبيه"
                        />
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
