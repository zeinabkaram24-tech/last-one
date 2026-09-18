import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, BookOpen, ExternalLink, Pencil, Trash, Plus } from 'lucide-react';
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

  // Effective week for notes: On Saturday, always take notes from Thursday of the previous week (currentWeek - 1)
  const effectiveWeek = selectedDay === 'Saturday' ? Math.max(1, currentWeek - 1) : currentWeek;

  // Tomorrow's timetable periods (8 periods)
  const targetPeriods: PeriodSlot[] = CLASS_TIMETABLES[currentClass][tomorrowDay] || [];

  // Helper to determine whether an item is a Quiz, Test, Exam, or Dictation
  const isQuizOrTest = (n: TomorrowSpecialNote) => {
    if (n.isQuiz || n.categoryType === 'quiz') return true;
    const text = (n.note + ' ' + (n.arabicNote || '')).toLowerCase();
    return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test(text);
  };

  // Strictly filter out any unauthorized whiteboard, marker, 100 chart, or math notebook notes
  const isDisallowedTomorrowItem = (n: TomorrowSpecialNote) => {
    const combined = (
      (n.note || '') + ' ' +
      (n.arabicNote || '') + ' ' +
      (n.bagItem || '')
    ).toLowerCase();

    if (
      combined.includes('white board') ||
      combined.includes('whiteboard') ||
      combined.includes('سبورة بيضاء') ||
      combined.includes('لوحة بيضاء') ||
      combined.includes('100 chart') ||
      combined.includes('مخطط المائة') ||
      combined.includes('مخطط الـ 100') ||
      combined.includes('كشكول الماس')
    ) {
      return true;
    }

    if (isQuizOrTest(n) || n.bagItem) return false;
    const trimmed = combined.trim();
    return trimmed.startsWith('hw:') || trimmed.startsWith('homework:') || trimmed.startsWith('واجب:');
  };

  const [tomorrowNotes, setTomorrowNotes] = useState<TomorrowSpecialNote[]>(() => {
    const base =
      currentBlock === 1 && effectiveWeek === 2
        ? WEEK2_SPECIAL_NOTES.filter(
            (n) => (n.classId === currentClass || (n.classId as any) === 'ALL') && n.targetDay === tomorrowDay
          )
        : currentBlock === 1 && effectiveWeek === 1
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
          effectiveWeek,
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
  }, [currentBlock, effectiveWeek, currentClass, tomorrowDay]);

  // Badge and styling information for each note
  // Strictly enforce:
  // 1. Tests/exams/quizzes/dictations MUST be in RED.
  // 2. Arabic dictation is strictly labeled "إملاء" (without "Dictation").
  // 3. English dictation is labeled "Dictation".
  const getNoteBadgeInfo = (note: TomorrowSpecialNote) => {
    const quiz = isQuizOrTest(note);
    const fullText = (note.note + ' ' + (note.arabicNote || '')).toLowerCase();

    const isArabicSubject = note.subject === 'Arabic' || fullText.includes('لغة عربية') || fullText.includes('عربي');
    const isEnglishSubject = note.subject === 'English' || fullText.includes('english') || fullText.includes('إنجليزي');

    const hasDictationWord = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('تسميع');

    if (quiz) {
      let badgeLabel = '🚨 اختبار';
      if (hasDictationWord) {
        if (isEnglishSubject) {
          badgeLabel = '✍️ Dictation';
        } else {
          // Strictly "إملاء" for Arabic per user requirement
          badgeLabel = '✍️ إملاء';
        }
      } else if (fullText.includes('كويز') || fullText.includes('quiz')) {
        badgeLabel = '🚨 كويز';
      } else if (fullText.includes('امتحان')) {
        badgeLabel = '🚨 امتحان';
      }

      return {
        isAlert: true,
        label: badgeLabel,
        badgeClass: 'bg-rose-600 text-white font-black shadow-xs',
        cardClass: 'bg-rose-50 border-2 border-rose-300 ring-1 ring-rose-200 text-rose-950',
        textColor: 'text-rose-950',
        bagItemClass: 'text-rose-950 bg-white border border-rose-200',
        subjectName:
          note.subject === 'French'
            ? 'French / لغة فرنسية'
            : note.subject === 'Mathematics' || note.subject === 'Math'
            ? 'Mathematics / رياضيات'
            : note.subject === 'Social Studies'
            ? 'الدراسات الاجتماعية'
            : note.subject === 'Arabic'
            ? 'اللغة العربية'
            : note.subject === 'English'
            ? 'اللغة الإنجليزية'
            : note.subject,
      };
    }

    if (note.subject === 'French') {
      return {
        isAlert: false,
        label: 'Remarque',
        badgeClass: 'bg-purple-100 text-purple-950 font-black border border-purple-200',
        cardClass: 'bg-purple-50/50 border border-purple-200/80 shadow-2xs text-slate-900',
        textColor: 'text-slate-900',
        bagItemClass: 'text-purple-950 bg-white border border-purple-200',
        subjectName: 'French',
      };
    }

    if (note.subject === 'Arabic' || note.subject === 'Social Studies') {
      const isArabic = note.subject === 'Arabic';
      return {
        isAlert: false,
        label: 'ملاحظات',
        badgeClass: isArabic
          ? 'bg-emerald-100 text-emerald-950 font-black border border-emerald-200'
          : 'bg-amber-100 text-amber-950 font-black border border-amber-200',
        cardClass: isArabic
          ? 'bg-emerald-50/40 border border-emerald-200/80 shadow-2xs text-slate-900'
          : 'bg-amber-50/50 border border-amber-200/80 shadow-2xs text-slate-900',
        textColor: 'text-slate-900',
        bagItemClass: isArabic
          ? 'text-emerald-950 bg-white border border-emerald-200'
          : 'text-amber-950 bg-white border border-amber-200',
        subjectName: isArabic ? 'اللغة العربية' : 'الدراسات الاجتماعية',
      };
    }

    return {
      isAlert: false,
      label: 'Notes',
      badgeClass: 'bg-blue-100 text-blue-950 font-black border border-blue-200',
      cardClass: 'bg-slate-50 border border-slate-200 shadow-2xs text-slate-900',
      textColor: 'text-slate-900',
      bagItemClass: 'text-slate-900 bg-white border border-slate-200',
      subjectName: note.subject,
    };
  };

  // Automatically link tests/quizzes/dictations from homework and classwork
  // Strictly for Block 1 Week 3 per user instructions
  const linkedAlerts = useMemo<TomorrowSpecialNote[]>(() => {
    if (currentBlock !== 1 || effectiveWeek !== 3) {
      return [];
    }

    const alerts: TomorrowSpecialNote[] = [];
    const checkText = (txt: string) => {
      return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((txt || '').toLowerCase());
    };

    // 1. Linked from Homework:
    homeworkList.forEach((h) => {
      if (h.classId !== currentClass && (h.classId as any) !== 'ALL') return;
      if (h.week && h.week !== effectiveWeek) return;

      const isForTomorrow = h.dueDay === tomorrowDay || h.assignedDay === tomorrowDay;
      const fullText = `${h.task} ${h.details || ''} ${h.subject}`;
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
          week: effectiveWeek,
          pdfUrl: h.pdfUrl,
        });
      }
    });

    // 2. Linked from Classwork:
    classworkList.forEach((cw) => {
      if (cw.classId !== currentClass && (cw.classId as any) !== 'ALL') return;
      if (cw.day !== tomorrowDay) return;
      if (cw.week && cw.week !== effectiveWeek) return;

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
          week: effectiveWeek,
        });
      }
    });

    return alerts;
  }, [homeworkList, classworkList, currentClass, tomorrowDay, effectiveWeek, currentBlock]);

  // Merge tomorrowNotes with linkedAlerts without duplicates
  const mergedNotes = useMemo<TomorrowSpecialNote[]>(() => {
    const map = new Map<string, TomorrowSpecialNote>();

    tomorrowNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });

    linkedAlerts.forEach((la) => {
      const hasExistingSubjectQuiz = tomorrowNotes.some(
        (n) => n.subject === la.subject && isQuizOrTest(n)
      );
      if (!hasExistingSubjectQuiz) {
        map.set(la.id, la);
      }
    });

    return Array.from(map.values()).filter((n) => !isDisallowedTomorrowItem(n));
  }, [tomorrowNotes, linkedAlerts]);

  // Sort notes: Tests, exams, quizzes, and dictation appear at the top of the notes section
  const sortedNotes = useMemo(() => {
    return [...mergedNotes].sort((a, b) => {
      const aQuiz = isQuizOrTest(a) ? 1 : 0;
      const bQuiz = isQuizOrTest(b) ? 1 : 0;
      return bQuiz - aQuiz;
    });
  }, [mergedNotes]);

  return (
    <div className="space-y-4" dir="rtl">
      {/* 
        Rule 1 & 2: The very FIRST element is the Timetable box (جدول حصص الغد).
        No duplicate banners above. All alerts and notes go directly underneath in the notes section.
      */}
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

      {/* 
        Rule 3: Notes & Alerts Section Directly Underneath the Table.
        - Tests, exams, quizzes, and dictation are styled in RED.
        - Arabic dictation is labeled "إملاء" only.
        - No duplication.
      */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>الملاحظات ليوم {ARABIC_DAY_NAMES[tomorrowDay]} ({tomorrowDay})</span>
            {selectedDay === 'Saturday' && (
              <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                (تكرار تجهيز يوم الخميس)
              </span>
            )}
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
          <div className="py-5 px-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
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
                  className={`rounded-xl p-3 sm:p-3.5 transition-all space-y-2 text-xs ${badgeInfo.cardClass}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] shrink-0 ${badgeInfo.badgeClass}`}>
                        {badgeInfo.label} • {badgeInfo.subjectName}
                      </span>
                      <span className={`font-bold leading-relaxed pt-0.5 ${badgeInfo.textColor}`}>
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
                            if (confirm('هل أنتِ متأكدة من رغبتكِ في حذف هذه الملاحظة نهائياً؟')) {
                              onDeleteTomorrowNote?.(note.id || '');
                            }
                          }}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-md transition-colors cursor-pointer"
                          title="حذف الملاحظة"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {note.bagItem && (
                    <div className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-block ${badgeInfo.bagItemClass}`}>
                      🎒 الأدوات المطلوبة: {note.bagItem}
                    </div>
                  )}

                  {note.linkUrl && (
                    <div className="pt-0.5 flex">
                      <a
                        href={note.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-50 text-blue-950 border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3 text-blue-700" />
                        <span>{note.linkTitle || 'رابط مرفق 🔗'}</span>
                      </a>
                    </div>
                  )}

                  {/* Clean PDF Attachment Row */}
                  {note.pdfUrl && (
                    <div className="pt-1">
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
