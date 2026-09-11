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

  // Notes and required tools strictly from the weekly plan
  const allNotes =
    currentWeek === 2
      ? [...WEEK2_SPECIAL_NOTES, ...SPECIAL_TEACHER_NOTES.filter((n) => n.week === 2)]
      : SPECIAL_TEACHER_NOTES.filter((n) => n.week === 1 || !n.week);

  const tomorrowNotes = allNotes.filter(
    (n) => n.classId === currentClass && n.targetDay === tomorrowDay
  );

  // Homework strictly assigned for tomorrowDay (Arabic & French only)
  const dayHomework = homeworkList.filter(
    (h) =>
      (h.subject === 'Arabic' || h.subject === 'French') &&
      h.classId === currentClass &&
      h.assignedDay === tomorrowDay &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  const renderPeriodRow = (slot: PeriodSlot) => {
    const meta = SUBJECT_METADATA[slot.subject];
    const hasHw = dayHomework.some((h) => h.subject === slot.subject);

    return (
      <div
        key={slot.period}
        className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full items-stretch"
      >
        {/* Box 1: رقم الحصة (Period Number) */}
        <div className="bg-slate-900 text-white font-black text-xs sm:text-sm py-2.5 px-2 rounded-xl flex items-center justify-center text-center shadow-2xs">
          <span>Period {slot.period}</span>
        </div>

        {/* Box 2: اسم المادة (Subject Name in English) */}
        <div
          className={`border font-black text-xs sm:text-sm py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-center truncate shadow-2xs ${
            meta?.badgeBg || 'bg-slate-100 text-slate-900 border-slate-300'
          }`}
        >
          <SubjectIcon subject={slot.subject} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">{slot.subject}</span>
          {hasHw && (
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-black shrink-0">
              واجب
            </span>
          )}
        </div>

        {/* Box 3: اسم المدرس (Teacher Name) */}
        <div className="bg-white border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-center truncate shadow-2xs">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{slot.teacher}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 8 Periods: Each period in 3 equal-width boxes side-by-side in one row */}
      <div className="space-y-2 sm:space-y-2.5">
        {targetPeriods.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center">
            <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <h4 className="text-sm font-black text-slate-800">
              لا توجد حصص مقررة ليوم {tomorrowDay} ({currentClass})
            </h4>
          </div>
        ) : (
          targetPeriods.map((slot) => renderPeriodRow(slot))
        )}
      </div>

      {/* Required Notes from Weekly Plan for Tomorrow */}
      {tomorrowNotes.length > 0 && (
        <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>الملاحظات والأدوات المطلوبة ليوم {tomorrowDay}</span>
          </div>
          <div className="space-y-2">
            {tomorrowNotes.map((note, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-amber-200/70 p-3 shadow-2xs space-y-1 text-xs"
              >
                <div className="flex items-start gap-2 font-bold text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-black text-[11px] shrink-0">
                    {note.subject === 'Arabic' ? 'ملاحظات' : 'Notes'} • {note.subject}
                  </span>
                  <span>{note.arabicNote || note.note}</span>
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

      {/* Homework for tomorrowDay (Only rendered if homework exists - NO empty box) */}
      {dayHomework.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>واجبات يوم {tomorrowDay}</span>
          </div>

          <div className="space-y-2.5">
            {dayHomework.map((hw) => {
              const meta = SUBJECT_METADATA[hw.subject];
              return (
                <div
                  key={hw.id}
                  className={`bg-white rounded-xl border p-3.5 transition-all shadow-2xs flex items-start justify-between gap-3 ${
                    hw.completed
                      ? 'border-emerald-300 bg-emerald-50/20 opacity-80'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <button
                      onClick={() => onToggleHomework(hw.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {hw.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-black border ${
                            meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'
                          }`}
                        >
                          <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                          <span>{hw.subject}</span>
                        </span>
                      </div>

                      <p
                        className={`text-sm font-bold text-slate-900 leading-snug ${
                          hw.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {hw.task}
                      </p>

                      {hw.pages && (
                        <p className="text-xs text-indigo-900 font-bold bg-indigo-50/80 px-2 py-0.5 rounded-md inline-block">
                          الأدوات / المطلوب: {hw.pages}
                        </p>
                      )}

                      {hw.linkUrl && (
                        <div className="pt-1">
                          <a
                            href={hw.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                            <span>رابط الواجب / النشاط</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleHomework(hw.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all shrink-0 ${
                      hw.completed
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                    }`}
                  >
                    {hw.completed ? 'غير مكتمل' : 'تم الإنجاز ✓'}
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
