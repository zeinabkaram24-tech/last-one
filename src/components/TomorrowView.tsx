import React from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  CheckSquare,
  Sparkles,
  User,
} from 'lucide-react';
import { ClassId, SchoolDay, HomeworkEntry, PeriodSlot } from '../types';
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
  homeworkList: HomeworkEntry[];
  currentWeek?: number;
  onToggleHomework: (id: string) => void;
  onPrint?: () => void;
}

export const TomorrowView: React.FC<TomorrowViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  currentWeek = 2,
  onToggleHomework,
}) => {
  // Target tomorrow day is strictly determined by selectedDay
  // When selectedDay is Sunday -> tomorrowDay is Monday
  // When selectedDay is Saturday -> tomorrowDay is Sunday
  const tomorrowDay: SchoolDay = NEXT_SCHOOL_DAY[selectedDay] || 'Sunday';

  // Tomorrow's timetable periods preserved as is (all 8 periods)
  const targetPeriods: PeriodSlot[] = CLASS_TIMETABLES[currentClass][tomorrowDay] || [];

  // Notes and required tools strictly from the official weekly plan
  // Only show if explicitly written in the plan notes / ملاحظات
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

  // Homework strictly assigned for tomorrowDay (Arabic & French only)
  const dayHomework = homeworkList.filter(
    (h) =>
      (h.subject === 'Arabic' || h.subject === 'French') &&
      h.classId === currentClass &&
      h.assignedDay === tomorrowDay &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  // Split the 8 periods into two balanced columns (P1-P4 and P5-P8)
  // This allows all 8 periods to fit on a single screen without scrolling
  const col1Periods = targetPeriods.filter((s) => s.period <= 4);
  const col2Periods = targetPeriods.filter((s) => s.period > 4);

  const renderPeriodBoxRow = (slot: PeriodSlot) => {
    const meta = SUBJECT_METADATA[slot.subject];
    const hasHw = dayHomework.some((h) => h.subject === slot.subject);

    return (
      <div
        key={slot.period}
        className="grid grid-cols-3 gap-1 sm:gap-1.5 items-stretch w-full"
      >
        {/* Box 1: رقم الحصة (Period Number) */}
        <div className="bg-slate-900 text-white font-black text-[11px] sm:text-xs py-1.5 px-1 sm:px-2 rounded-lg sm:rounded-xl flex items-center justify-center text-center shadow-2xs">
          <span>Period {slot.period}</span>
        </div>

        {/* Box 2: اسم المادة (Subject Name in English with colorful icon) */}
        <div
          className={`border font-black text-[11px] sm:text-xs py-1.5 px-1 sm:px-2 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 text-center truncate shadow-2xs ${
            meta?.badgeBg || 'bg-slate-100 text-slate-900 border-slate-300'
          }`}
        >
          <SubjectIcon subject={slot.subject} className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{slot.subject}</span>
          {hasHw && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-600 text-white font-black shrink-0">
              واجب
            </span>
          )}
        </div>

        {/* Box 3: اسم المدرس (Teacher Name) */}
        <div className="bg-white border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs py-1.5 px-1 sm:px-2 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 text-center truncate shadow-2xs">
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{slot.teacher}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 8 Periods: 2 Columns of 4 rows side-by-side fitting on screen without scrolling */}
      {targetPeriods.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center">
          <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <h4 className="text-sm font-black text-slate-800">
            لا توجد حصص مقررة ليوم {tomorrowDay} ({currentClass})
          </h4>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          {/* Header indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 pb-1 border-b border-slate-100 px-0.5">
            <span className="text-indigo-950 font-black">
              جدول حصص الغد ({tomorrowDay})
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              8 حصص • {currentClass}
            </span>
          </div>

          {/* 2-Column Compact Grid (P1-P4 on left, P5-P8 on right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2.5">
            {/* Column 1: Periods 1 - 4 */}
            <div className="space-y-1.5">
              {col1Periods.map((slot) => renderPeriodBoxRow(slot))}
            </div>

            {/* Column 2: Periods 5 - 8 */}
            <div className="space-y-1.5">
              {col2Periods.map((slot) => renderPeriodBoxRow(slot))}
            </div>
          </div>
        </div>
      )}

      {/* Required Notes from Weekly Plan for Tomorrow: ONLY shown if explicitly in the weekly plan notes */}
      {tomorrowNotes.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-3 sm:p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>الملاحظات والأدوات المطلوبة ليوم {tomorrowDay}</span>
          </div>
          <div className="space-y-1.5">
            {tomorrowNotes.map((note, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-amber-200/80 p-2.5 shadow-2xs space-y-1 text-xs"
              >
                <div className="flex items-start gap-2 font-bold text-slate-900">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 font-black text-[10.5px] shrink-0">
                    {note.subject === 'Arabic' ? 'ملاحظات' : 'Notes'} • {note.subject}
                  </span>
                  <span className="leading-snug">{note.arabicNote || note.note}</span>
                </div>
                {note.bagItem && (
                  <div className="text-[11px] text-amber-900 font-semibold bg-amber-50/60 px-2 py-1 rounded-md border border-amber-100/80">
                    الأدوات المطلوبة: {note.bagItem}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homework for tomorrowDay (Only rendered if homework exists - with toggle Done/Not Done button) */}
      {dayHomework.length > 0 && (
        <div className="space-y-2 bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-black text-slate-900">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>واجبات مستحقة أو مقررة ليوم {tomorrowDay}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              أنتِ تحددين الإنجاز (Done)
            </span>
          </div>

          <div className="space-y-2">
            {dayHomework.map((hw) => {
              const meta = SUBJECT_METADATA[hw.subject];
              return (
                <div
                  key={hw.id}
                  className={`rounded-xl border p-2.5 transition-all shadow-2xs flex items-start justify-between gap-2.5 ${
                    hw.completed
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-indigo-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleHomework(hw.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={hw.completed ? 'وضع كغير منجز' : 'وضع كمنجز'}
                    >
                      {hw.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                      )}
                    </button>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10.5px] font-black border ${
                            meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'
                          }`}
                        >
                          <SubjectIcon subject={hw.subject} className="w-3 h-3" />
                          <span>{hw.subject}</span>
                        </span>
                        {hw.dueDay && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            تسليم: {hw.dueDay}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs font-bold leading-snug ${
                          hw.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {hw.task}
                      </p>

                      {hw.pages && (
                        <p className="text-[10.5px] text-indigo-900 font-bold bg-indigo-50/80 px-2 py-0.5 rounded inline-block">
                          المطلوب: {hw.pages}
                        </p>
                      )}

                      {hw.linkUrl && (
                        <div className="pt-1">
                          <a
                            href={hw.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-blue-700" />
                            <span>رابط النشاط</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Toggle button explicitly controlled by the user */}
                  <button
                    onClick={() => onToggleHomework(hw.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all shrink-0 ${
                      hw.completed
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs'
                    }`}
                  >
                    {hw.completed ? 'Done ✓' : 'Mark Done'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
