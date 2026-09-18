import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { ClassId, SchoolDay, PeriodSlot } from '../types';
import {
  CLASS_TIMETABLES,
  NEXT_SCHOOL_DAY,
  SUBJECT_METADATA,
} from '../data/timetables';
import { SPECIAL_TEACHER_NOTES, TomorrowSpecialNote } from '../data/defaultWeeklyPlan';
import { WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { SubjectIcon } from './SubjectIcon';
import { getTomorrowNotesForDay, subscribeToTomorrowNotes } from '../utils/tomorrowNotesStorage';

interface TomorrowViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  currentBlock?: number;
  currentWeek?: number;
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
    const raw =
      currentBlock === 1 && currentWeek === 2
        ? WEEK2_SPECIAL_NOTES.filter(
            (n) => n.classId === currentClass && n.targetDay === tomorrowDay
          )
        : currentBlock === 1 && currentWeek === 1
        ? SPECIAL_TEACHER_NOTES.filter(
            (n) =>
              n.classId === currentClass &&
              n.targetDay === tomorrowDay &&
              (n.week === 1 || !n.week)
          )
        : [];
    return raw.filter((n) => !isDisallowedTomorrowItem(n));
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
    if (quiz) {
      return {
        label: '🚨 اختبار / Quiz',
        badgeClass: 'bg-rose-600 text-white font-black',
        cardClass: 'bg-rose-50/70 border-rose-200/90 shadow-2xs',
        subjectName: note.subject === 'Social Studies' ? 'الدراسات الاجتماعية' : note.subject === 'Arabic' ? 'اللغة العربية' : note.subject,
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

  return (
    <div className="space-y-4">
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
        <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm pb-1 border-b border-slate-100">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>الملاحظات ليوم {ARABIC_DAY_NAMES[tomorrowDay]} ({tomorrowDay})</span>
        </div>

        {tomorrowNotes.length === 0 ? (
          <div className="py-4 px-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-semibold">
              لا توجد ملاحظات خاصة مسجلة ليوم {ARABIC_DAY_NAMES[tomorrowDay]} في الخطة الأسبوعية
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tomorrowNotes.map((note, idx) => {
              const badgeInfo = getNoteBadgeInfo(note);
              return (
                <div
                  key={note.id || `${note.subject}-${note.targetDay}-${idx}`}
                  className={`rounded-xl border p-3 transition-all space-y-1.5 text-xs ${badgeInfo.cardClass}`}
                >
                  <div className="flex items-start gap-2 text-slate-900">
                    <span className={`px-2 py-0.5 rounded text-[11px] shrink-0 ${badgeInfo.badgeClass}`}>
                      {badgeInfo.label} • {badgeInfo.subjectName}
                    </span>
                    <span className="font-bold leading-relaxed">{note.arabicNote || note.note}</span>
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
                    <div className="pt-1 flex">
                      <a
                        href={note.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black bg-rose-50 text-rose-950 border border-rose-300 hover:bg-rose-100 transition-all shadow-2xs"
                      >
                        <BookOpen className="w-3 h-3 text-rose-700" />
                        <span>📄 تحميل ملف PDF المرفق</span>
                      </a>
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
