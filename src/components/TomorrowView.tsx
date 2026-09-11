import React from 'react';
import {
  BookOpen,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { ClassId, SchoolDay, PeriodSlot, HomeworkEntry } from '../types';
import {
  CLASS_TIMETABLES,
  NEXT_SCHOOL_DAY,
  SUBJECT_METADATA,
} from '../data/timetables';
import { SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { SubjectIcon } from './SubjectIcon';

interface TomorrowViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay; // The active day in the top navbar
  homeworkList?: HomeworkEntry[];
  currentWeek?: number;
  onToggleHomework?: (id: string) => void;
  onPrint?: () => void;
}

const ARABIC_DAY_NAMES: Record<SchoolDay, string> = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
};

// Helper to determine note label based on subject
export const getTomorrowNoteLabel = (subject: string): string => {
  const s = subject.toLowerCase().trim();
  if (s.includes('arabic') || s.includes('عربي')) return 'ملاحظات';
  if (s.includes('french') || s.includes('français') || s.includes('فرنش')) return 'remarque';
  return 'notes';
};

export const TomorrowView: React.FC<TomorrowViewProps> = ({
  currentClass,
  selectedDay,
  currentWeek = 2,
}) => {
  // Target tomorrow day is strictly determined by selectedDay
  // When selectedDay is Sunday -> tomorrowDay is Monday
  // When selectedDay is Saturday -> tomorrowDay is Sunday
  const tomorrowDay: SchoolDay = NEXT_SCHOOL_DAY[selectedDay] || 'Sunday';

  // Tomorrow's timetable periods (all 8 periods)
  const targetPeriods: PeriodSlot[] = CLASS_TIMETABLES[currentClass][tomorrowDay] || [];

  // Notes and required tools strictly from the official weekly plan
  const tomorrowNotes =
    currentWeek === 2
      ? WEEK2_SPECIAL_NOTES.filter(
          (n) => n.classId === currentClass && n.targetDay === tomorrowDay
        )
      : SPECIAL_TEACHER_NOTES.filter(
          (n) =>
            n.classId === currentClass &&
            n.targetDay === tomorrowDay &&
            (n.week === currentWeek || (!n.week && currentWeek === 1))
        );

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black text-slate-900">
              جدول حصص الغد • يوم {ARABIC_DAY_NAMES[tomorrowDay]} ({tomorrowDay})
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200">
              {currentClass}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            تجهيز حقيبة الغد والمواد المقررة بالترتيب (8 حصص في شبكة 2 × 4)
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <span>تحضير حقيبة المدرسة</span>
        </div>
      </div>

      {/* 2x4 Grid of Subjects (No period numbers, No teacher names - Just Subject Icons & Names) */}
      {targetPeriods.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-black text-slate-800">
            لا توجد حصص مقررة ليوم {ARABIC_DAY_NAMES[tomorrowDay]} ({tomorrowDay})
          </h4>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-3">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {targetPeriods.map((slot, index) => {
              const meta = SUBJECT_METADATA[slot.subject];

              return (
                <div
                  key={index}
                  className={`py-3 px-3 sm:px-4 rounded-xl border flex items-center justify-between gap-2.5 shadow-2xs transition-all hover:shadow-xs ${
                    meta?.badgeBg || 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                >
                  {/* Left: Big Subject Icon + English Name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/90 border border-white/70 flex items-center justify-center shrink-0 shadow-2xs">
                      <SubjectIcon subject={slot.subject} className="w-5 h-5 shrink-0" />
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm tracking-tight truncate">
                      {slot.subject}
                    </span>
                  </div>

                  {/* Right: Arabic Name */}
                  <span className="text-[11.5px] sm:text-xs font-bold opacity-85 shrink-0 text-left">
                    {meta?.arabicName || slot.subject}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Required Notes & Bag Items for Tomorrow (Strictly from the official Weekly Plan) */}
      {tomorrowNotes.length > 0 && (
        <div className="bg-amber-50/90 rounded-2xl border border-amber-200/90 p-3.5 sm:p-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>الملاحظات والأدوات المطلوبة للحقيبة ليوم {ARABIC_DAY_NAMES[tomorrowDay]}</span>
          </div>

          <div className="space-y-2">
            {tomorrowNotes.map((note, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-amber-200 p-3 shadow-2xs space-y-1.5 text-xs"
              >
                <div className="flex items-start gap-2 font-bold text-slate-900">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 font-black text-[11px] shrink-0">
                    {getTomorrowNoteLabel(note.subject)} • {note.subject}
                  </span>
                  <span className="leading-relaxed text-slate-800">{note.arabicNote || note.note}</span>
                </div>

                {note.bagItem && (
                  <div className="text-[11.5px] text-amber-950 font-bold bg-amber-100/50 px-2.5 py-1 rounded-lg border border-amber-200/80 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>الأدوات المطلوبة في الحقيبة: {note.bagItem}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
