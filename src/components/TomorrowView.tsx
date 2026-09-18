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
    const text = (n.note + ' ' + (n.arabicNote || '')).toLowerCase();
    return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test(text);
  };

  // Notes from weekly plan for tomorrow (only teacher instructions / tools / bag items / quizzes, strictly excluding plain homework)
  const isDisallowedTomorrowItem = (n: TomorrowSpecialNote) => {
    if (isQuizOrTest(n) || n.bagItem) return false;
    const lower = (n.note + ' ' + (n.arabicNote || '')).toLowerCase().trim();
    return lower.startsWith('hw:') || lower.startsWith('homework:') || lower.startsWith('واجب:');
  };

  const [tomorrowNotes, setTomorrowNotes] = useState<TomorrowSpecialNote[]>(() => {
    const base =
      currentBlock === 1 && currentWeek === 2
        ? WEEK2_SPECIAL_NOTES.filter(
            (n) => (n.classId === currentClass || (n.classId as any) === 'ALL') && n.targetDay === tomorrowDay
          )
        : currentBlock === 1 && currentWeek === 1
        ? SPECIAL_TEACHER_NOTES.filter(
            (n) =>
              (n.classId === currentClass || (n.classId as any) === 'ALL') &&
              n.targetDay === tomorrowDay &&
              (n.week === 1 || !n.week)
          )
        : [];

    // Check local storage cached notes first for instant 0ms render
    const storageKey = `nile_tomorrow_notes_${currentBlock}_${currentWeek}`;
    try {
      const rawStored = localStorage.getItem(storageKey);
      let parsedList: TomorrowSpecialNote[] = [];
      if (rawStored) {
        const parsed = JSON.parse(rawStored);
        if (Array.isArray(parsed)) {
          parsedList = parsed.filter(
            (n) => (n.classId === currentClass || n.classId === 'ALL') && n.targetDay === tomorrowDay
          );
        }
      }

      // If tomorrowDay is Sunday, seamlessly merge Sunday notes from adjacent weeks (Thursday <-> Saturday repetition)
      if (tomorrowDay === 'Sunday') {
        const adjacentKeys = [
          currentWeek > 1 ? `nile_tomorrow_notes_${currentBlock}_${currentWeek - 1}` : null,
          currentWeek < 4 ? `nile_tomorrow_notes_${currentBlock}_${currentWeek + 1}` : null,
        ].filter(Boolean) as string[];

        adjacentKeys.forEach((key) => {
          try {
            const adjRaw = localStorage.getItem(key);
            if (adjRaw) {
              const adjParsed = JSON.parse(adjRaw);
              if (Array.isArray(adjParsed)) {
                adjParsed
                  .filter((n) => (n.classId === currentClass || n.classId === 'ALL') && n.targetDay === 'Sunday')
                  .forEach((n) => parsedList.push(n));
              }
            }
          } catch {}
        });
      }

      if (parsedList.length > 0) {
        const map = new Map<string, TomorrowSpecialNote>();
        base.forEach((n) => map.set(n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`, n));
        parsedList.forEach((n) => map.set(n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`, n));
        return Array.from(map.values()).filter((n) => !isDisallowedTomorrowItem(n));
      }
    } catch {}

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
    const fullText = (note.note + ' ' + (note.arabicNote || '')).toLowerCase();
    const isDictation = fullText.includes('إملاء') || fullText.includes('dictation') || fullText.includes('تسميع');

    if (quiz) {
      return {
        label: isDictation ? '✍️ إملاء / Dictation' : '🚨 اختبار / Quiz',
        badgeClass: 'bg-rose-600 text-white font-black',
        cardClass: 'bg-rose-50/85 border-rose-300 shadow-2xs ring-1 ring-rose-200',
        subjectName:
          note.subject === 'French'
            ? 'French / لغة فرنسية'
            : note.subject === 'Mathematics' || note.subject === 'Math'
            ? 'Mathematics / رياضيات'
            : note.subject === 'Social Studies'
            ? 'الدراسات الاجتماعية'
            : note.subject === 'Arabic'
            ? 'اللغة العربية'
            : note.subject,
      };
    }
    if (note.subject === 'French') {
      return {
        label: 'Remarque',
        badgeClass: 'bg-purple-100 text-purple-950 font-black',
        cardClass: 'bg-purple-50/50 border-purple-200/80 shadow-2xs',
        subjectName: 'French',
      };
    }
    if (note.subject === 'Arabic' || note.subject === 'Social Studies') {
      return {
        label: 'ملاحظات',
        badgeClass: note.subject === 'Arabic' ? 'bg-emerald-100 text-emerald-950 font-black' : 'bg-amber-100 text-amber-950 font-black',
        cardClass: note.subject === 'Arabic' ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs' : 'bg-amber-50/50 border-amber-200/80 shadow-2xs',
        subjectName: note.subject === 'Social Studies' ? 'الدراسات الاجتماعية' : 'اللغة العربية',
      };
    }
    return {
      label: 'Notes',
      badgeClass: 'bg-blue-100 text-blue-950 font-black',
      cardClass: 'bg-amber-50/40 border-amber-200/70 shadow-2xs',
      subjectName: note.subject,
    };
  };

  // Automatically link and synchronize tests/quizzes/dictations from homework and classwork (strictly for Block 1 Week 3 per instructions)
  const linkedAlerts = useMemo<TomorrowSpecialNote[]>(() => {
    // Only apply for Block 1 Week 3
    if (currentBlock !== 1 || currentWeek !== 3) {
      return [];
    }

    const alerts: TomorrowSpecialNote[] = [];
    const checkText = (txt: string) => {
      return /quiz|test|اختبار|امتحان|كويز|إملاء|dictation|تسميع|تقييم/.test((txt || '').toLowerCase());
    };

    // 1. Linked from Homework:
    // If any homework item for this class mentions a test/quiz/dictation and is due/assigned for tomorrowDay
    homeworkList.forEach((h) => {
      if (h.classId !== currentClass && (h.classId as any) !== 'ALL') return;
      if (h.week && h.week !== currentWeek) return;

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

    tomorrowNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });

    linkedAlerts.forEach((la) => {
      // If a quiz note for this subject already exists in tomorrowNotes, don't duplicate
      const hasExistingSubjectQuiz = tomorrowNotes.some(
        (n) => n.subject === la.subject && isQuizOrTest(n)
      );
      if (!hasExistingSubjectQuiz) {
        map.set(la.id, la);
      }
    });

    return Array.from(map.values()).filter((n) => !isDisallowedTomorrowItem(n));
  }, [tomorrowNotes, linkedAlerts]);

  // Extract any quizzes/tests/dictations scheduled for tomorrow to show high-visibility alert banner
  const upcomingQuizzes = useMemo(() => {
    return mergedNotes.filter((n) => isQuizOrTest(n));
  }, [mergedNotes]);

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
      {/* 🚨 High-Priority Tomorrow Quiz Alert Banner */}
      {upcomingQuizzes.length > 0 && (
        <div className="bg-rose-500/10 border-2 border-rose-500/80 rounded-2xl p-3.5 sm:p-4 text-rose-950 shadow-2xs space-y-2.5 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <h4 className="text-sm font-black text-rose-950">
              🚨 إنذار هام ومؤكد: يوجد اختبار / كويز غداً يوم {ARABIC_DAY_NAMES[tomorrowDay]}!
            </h4>
          </div>
          <div className="space-y-1.5 pt-0.5">
            {upcomingQuizzes.map((q, idx) => (
              <div
                key={q.id || `quiz-banner-${idx}`}
                className="flex items-center justify-between gap-2 bg-white/95 border border-rose-200 rounded-xl px-3 py-2 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] shadow-2xs">
                    {q.subject === 'French'
                      ? '🇫🇷 كويز لغة فرنسية'
                      : q.subject === 'Mathematics' || q.subject === 'Math'
                      ? '📐 اختبار رياضيات'
                      : (q.note?.includes('إملاء') || q.arabicNote?.includes('إملاء'))
                      ? '✍️ إملاء لغة عربية'
                      : `🚨 اختبار ${q.subject}`}
                  </span>
                  <span className="font-black text-slate-900">{q.arabicNote || q.note}</span>
                </div>
                {q.bagItem && (
                  <span className="text-[11px] font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 shrink-0">
                    🎒 {q.bagItem}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thursday <-> Saturday Continuity Card */}
      {selectedDay === 'Saturday' && (
        <div className="bg-sky-50 border-2 border-sky-200/90 rounded-2xl px-3.5 sm:p-4 text-sky-950 shadow-2xs flex items-center gap-2.5 animate-fade-in">
          <span className="text-xl shrink-0">🔁</span>
          <div className="text-xs sm:text-sm">
            <span className="font-black text-sky-950">تكرار تلقائي لملاحظات وتحضير يوم الخميس: </span>
            <span className="font-medium text-sky-900">
              تم استدعاء وتكرار ملاحظات وتجهيزات نهاية الأسبوع (الخميس) لتجهيز حقيبة يوم الأحد للأسبوع الجديد.
            </span>
          </div>
        </div>
      )}
      {selectedDay === 'Thursday' && (
        <div className="bg-indigo-50 border-2 border-indigo-200/90 rounded-2xl px-3.5 sm:p-4 text-indigo-950 shadow-2xs flex items-center gap-2.5 animate-fade-in">
          <span className="text-xl shrink-0">🗓️</span>
          <div className="text-xs sm:text-sm">
            <span className="font-black text-indigo-950">تحضير يوم الأحد للأسبوع القادم: </span>
            <span className="font-medium text-indigo-900">
              هذه الملاحظات وتجهيزات الحقيبة تتكرر تلقائياً في تومورو يوم السبت للأسبوع الجديد لتسهيل المتابعة على أولياء الأمور.
            </span>
          </div>
        </div>
      )}

      {/* 2x4 Grid of Subject Blocks (8 periods) */}
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

      {/* Block for Notes Underneath (ملاحظات العربي، ريمارك الفرنش، نوتس باقي المواد) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>الملاحظات ليوم {ARABIC_DAY_NAMES[tomorrowDay]} ({tomorrowDay})</span>
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
                  className={`rounded-xl border p-3 transition-all space-y-1.5 text-xs ${badgeInfo.cardClass}`}
                >
                  <div className="flex items-start justify-between gap-3 text-slate-900">
                    <div className="flex items-start gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] shrink-0 ${badgeInfo.badgeClass}`}>
                        {badgeInfo.label} • {badgeInfo.subjectName}
                      </span>
                      <span className="font-bold leading-relaxed">{note.arabicNote || note.note}</span>
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
                    <div className="text-[11px] text-amber-950 font-semibold bg-white px-2.5 py-1 rounded-lg border border-amber-200/90 inline-block">
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
