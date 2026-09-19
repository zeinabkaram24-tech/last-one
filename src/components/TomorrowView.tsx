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
import { getTomorrowNotesForDay, subscribeToTomorrowNotes } from '../utils/tomorrowNotesStorage';
import { AttachmentPdfCard } from './AttachmentPdfCard';

interface TomorrowViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  currentBlock?: number;
  currentWeek?: number;
  homeworkList?: HomeworkEntry[];
  classworkList?: ClassworkEntry[];
  isAdminEditMode?: boolean;
  onAddTomorrowNote?: () => void;
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
    if (n.isQuiz || n.categoryType === 'quiz') return true;
    const text = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
    return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test(text);
  };

  // User mandate: strictly remove any fabricated math supplies notes (whiteboard, 100 chart, markers, etc.)
  const isFabricatedMathNote = (n: TomorrowSpecialNote) => {
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
    if (isFabricatedMathNote(n)) return true;

    // These rules ONLY apply when we are in Week 3
    if (currentWeek === 3) {
      // Strict Mathematics/Math rule: Completely disallow Maths notes/alerts/submissions on any day
      if (n.subject === 'Mathematics' || n.subject === 'Math') {
        return true;
      }

      // Strict English rule: ONLY allow dictation ("dictation" or "إملاء") on Monday (Sunday looked ahead), completely block all other English notes/alerts/submissions on any day
      if (n.subject === 'English') {
        const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isDictation = fullText.includes('dictation') || fullText.includes('إملاء');
        if (tomorrowDay === 'Monday' && isDictation) {
          // Allowed!
        } else {
          return true; // Disallowed
        }
      }

      // Strict Arabic rule: ONLY allow dictation ("إملاء") notes for Arabic, disallow any other Arabic notes
      if (n.subject === 'Arabic') {
        const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isDictation = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('تسميع');
        if (!isDictation) {
          return true;
        }
      }

      // Strict user rule for Sunday (Saturday-Tomorrow view):
      // No notes allowed for Sunday unless:
      // 1. It's a quiz or test (and French/Maths/English are strictly excluded on Sunday).
      // 2. It's a Social Studies homework submission for G2A or G2C (which have Social Studies on Sunday).
      // 3. It's a specific requirement/material requested for Sunday (has a non-empty bagItem).
      if (tomorrowDay === 'Sunday') {
        if (n.subject === 'French') {
          return true; // French is completely disallowed on Sunday
        }

        const isQuiz = isQuizOrTest(n);
        const fullText = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
        const isSocialStudiesSubmission =
          n.subject === 'Social Studies' &&
          (currentClass === 'G2A' || currentClass === 'G2C') &&
          (fullText.includes('تسليم') || fullText.includes('submission') || fullText.includes('واجب'));
        const hasBagItem = !!n.bagItem;

        if (!isQuiz && !isSocialStudiesSubmission && !hasBagItem) {
          return true; // Disallowed
        }
      }
    }

    if (isQuizOrTest(n) || n.bagItem) return false;
    const lower = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase().trim();
    if (lower.includes('تسليم') || lower.includes('submission') || lower.includes('استلام') || lower.includes('شيت') || lower.includes('sheet')) return false;
    return lower.startsWith('hw:') || lower.startsWith('homework:') || lower.startsWith('واجب:');
  };

  // Support both currentWeek and previous week if applicable
  const effectiveWeek = tomorrowDay === 'Sunday' && currentWeek > 1 ? currentWeek - 1 : currentWeek;

  // In-memory cache for deleted note IDs to avoid localStorage completely as requested
  const [deletedNoteIds, setDeletedNoteIds] = useState<string[]>([]);

  const handleDeleteTomorrowNote = (noteId: string) => {
    setDeletedNoteIds((prev) => [...prev, noteId]);
    setTomorrowNotes((prev) => prev.filter((n) => n.id !== noteId && `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}` !== noteId));
    onDeleteTomorrowNote?.(noteId);
  };

  const [tomorrowNotes, setTomorrowNotes] = useState<TomorrowSpecialNote[]>(() => {
    const base =
      currentBlock === 1 && (currentWeek === 2 || effectiveWeek === 2)
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
        const notes = await getTomorrowNotesForDay(
          currentBlock,
          currentWeek,
          currentClass,
          tomorrowDay
        );
        if (isMounted) {
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

  const getNoteBadgeInfo = (note: TomorrowSpecialNote) => {
    const quiz = isQuizOrTest(note);
    const fullText = ((note.note || '') + ' ' + (note.arabicNote || '')).toLowerCase();
    const isDictation = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('تسميع');
    const isArabic = note.subject === 'Arabic' || fullText.includes('عربي') || fullText.includes('عربية');
    const isEnglish = note.subject === 'English' || fullText.includes('english');

    if (quiz) {
      // User directive: Arabic dictation is strictly 'إملاء' (NO 'Dictation'), English dictation is 'Dictation'
      let label = '🚨 اختبار';
      if (isDictation) {
        label = isArabic ? '✍️ إملاء' : isEnglish ? '✍️ Dictation' : '✍️ إملاء';
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
        subjectName:
          note.subject === 'French'
            ? 'لغة فرنسية'
            : note.subject === 'Mathematics' || note.subject === 'Math'
            ? 'رياضيات'
            : note.subject === 'Social Studies'
            ? 'الدراسات الاجتماعية'
            : note.subject === 'Arabic'
            ? 'اللغة العربية'
            : note.subject,
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
      const isSubmission =
        fullText.includes('تسليم') ||
        fullText.includes('submission') ||
        fullText.includes('استلام') ||
        fullText.includes('واجب');
      return {
        label: isSubmission ? 'تسليم واجب 📋' : 'ملاحظات',
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
      subjectName: note.subject,
      isAlert: false,
    };
  };

  // Automatically link and synchronize tests/quizzes/dictations and homework submissions from homework and classwork
  const linkedAlerts = useMemo<TomorrowSpecialNote[]>(() => {
    const alerts: TomorrowSpecialNote[] = [];
    const checkText = (txt: string) => {
      return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((txt || '').toLowerCase());
    };

    // 1. Linked from Homework:
    homeworkList.forEach((h) => {
      if (h.classId !== currentClass && (h.classId as any) !== 'ALL') return;
      if (h.week && h.week !== currentWeek) return;

      const fullText = `${h.task} ${h.details || ''} ${h.subject}`;
      const isForTomorrow = h.dueDay === tomorrowDay || h.assignedDay === tomorrowDay;

      // A) Tests, quizzes, dictations
      if (isForTomorrow && checkText(fullText)) {
        alerts.push({
          id: `linked-hw-${h.id}`,
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
      // B) Due for submission tomorrow (e.g. Social Studies homework sheet due on Sunday for 2A & 2C)
      else if (h.dueDay === tomorrowDay) {
        const isSocial = h.subject === 'Social Studies';
        alerts.push({
          id: `linked-hw-due-${h.id}`,
          classId: currentClass,
          targetDay: tomorrowDay,
          subject: h.subject,
          note: isSocial
            ? 'تسليم واجب الدراسات الاجتماعية (أول حصة في الأسبوع)'
            : `تسليم واجب ${h.subject}: ${h.task}`,
          arabicNote: isSocial
            ? 'تذكير: تجهيز وتسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي) في أول حصة في الأسبوع'
            : (h.details ? `تذكير: تسليم الواجب غداً (${h.details})` : `تذكير: تسليم واجب ${h.subject} غداً`),
          bagItem: isSocial ? 'شيت واجب الدراسات الاجتماعية المرفق' : (h.pages || undefined),
          isQuiz: false,
          categoryType: 'note',
          block: currentBlock,
          week: currentWeek,
          pdfUrl: h.pdfUrl,
        });
      }
    });

    // 2. Linked from Classwork:
    // If any classwork on tomorrowDay mentions a test/quiz/dictation
    classworkList.forEach((cw) => {
      if (cw.classId !== currentClass && (cw.classId as any) !== 'ALL') return;
      if (cw.day !== tomorrowDay) return;
      if (cw.week && cw.week !== currentWeek) return;

      const fullText = `${cw.title} ${cw.details || ''} ${cw.subject}`;
      if (checkText(fullText)) {
        alerts.push({
          id: `linked-cw-${cw.id}`,
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

    // Filter out deleted notes from base tomorrowNotes
    const activeBaseNotes = tomorrowNotes.filter((n) => {
      if (isDisallowedTomorrowItem(n)) return false;
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      if (deletedNoteIds.includes(key) || (n.id && deletedNoteIds.includes(n.id))) return false;
      return true;
    });

    activeBaseNotes.forEach((n) => {
      const isArabic = n.subject === 'Arabic';
      const text = ((n.note || '') + ' ' + (n.arabicNote || '')).toLowerCase();
      const isDictation = text.includes('إملاء') || text.includes('dictation') || text.includes('تسميع');
      if (isArabic && isDictation) {
        if (hasArabicDictation) return; // Strict user rule: dictation is ONE task per day
        hasArabicDictation = true;
      }
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });

    linkedAlerts.forEach((la) => {
      const key = la.id || `${la.targetDay}-${la.subject}-${(la.note || '').slice(0, 30)}`;
      if (deletedNoteIds.includes(key) || (la.id && deletedNoteIds.includes(la.id))) return;

      const isArabic = la.subject === 'Arabic';
      const text = ((la.note || '') + ' ' + (la.arabicNote || '')).toLowerCase();
      const isDictation = text.includes('إملاء') || text.includes('dictation') || text.includes('تسميع');
      if (isArabic && isDictation) {
        if (hasArabicDictation) return; // Strict user rule: dictation is ONE task per day
        hasArabicDictation = true;
      }

      // If a quiz note for this subject already exists in map, don't duplicate
      const hasExistingSubjectQuiz = Array.from(map.values()).some(
        (n) => n.subject === la.subject && isQuizOrTest(n)
      );
      if (isQuizOrTest(la) && hasExistingSubjectQuiz) {
        return;
      }

      // If a submission note for this subject already exists in map, don't duplicate
      const isSubmission = ((la.note || '') + ' ' + (la.arabicNote || '')).includes('تسليم');
      const hasExistingSubmission = Array.from(map.values()).some(
        (n) => n.subject === la.subject && ((n.note || '') + ' ' + (n.arabicNote || '')).includes('تسليم')
      );
      if (isSubmission && hasExistingSubmission) {
        return;
      }

      map.set(key, la);
    });

    return Array.from(map.values()).filter((n) => !isDisallowedTomorrowItem(n));
  }, [tomorrowNotes, linkedAlerts, deletedNoteIds]);

  // Prioritize quizzes and tests to appear first in the notes list
  const sortedNotes = useMemo(() => {
    return [...mergedNotes].sort((a, b) => {
      const aQuiz = isQuizOrTest(a) ? 1 : 0;
      const bQuiz = isQuizOrTest(b) ? 1 : 0;
      return bQuiz - aQuiz;
    });
  }, [mergedNotes]);

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
              onClick={onAddTomorrowNote}
              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-100" />
              <span>➕ إضافة ملاحظة للغد</span>
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
                  <div className="flex items-start justify-between gap-3 text-slate-900">
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] shrink-0 ${badgeInfo.badgeClass}`}>
                        {badgeInfo.label} • {badgeInfo.subjectName}
                      </span>
                      <span className={`leading-relaxed text-xs sm:text-sm ${badgeInfo.isAlert ? 'font-black text-rose-950' : 'font-bold text-slate-900'}`}>
                        {note.arabicNote || note.note}
                      </span>
                    </div>
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
                            handleDeleteTomorrowNote(note.id || `${note.targetDay}-${note.subject}-${(note.note || '').slice(0, 30)}`);
                          }}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-md transition-colors cursor-pointer"
                          title="حذف الملاحظة"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {note.bagItem &&
                    !(
                      ((note.note || '') + ' ' + (note.arabicNote || '')).toLowerCase().includes('إملاء') ||
                      ((note.note || '') + ' ' + (note.arabicNote || '')).toLowerCase().includes('dictation')
                    ) && (
                    <div className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-block ${
                      badgeInfo.isAlert
                        ? 'text-rose-900 bg-white border border-rose-200'
                        : 'text-amber-950 bg-white border border-amber-200/90'
                    }`}>
                      الأدوات المطلوبة: {note.bagItem}
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
                  {note.pdfUrl && (
                    <div className="pt-2">
                      <AttachmentPdfCard
                        pdfUrl={note.pdfUrl}
                        subject={note.subject}
                        label="مرفق التنبيه"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
