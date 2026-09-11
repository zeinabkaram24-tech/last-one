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

  // Tomorrow's timetable periods strictly filtered to Arabic and French
  const targetPeriods: PeriodSlot[] = (CLASS_TIMETABLES[currentClass][tomorrowDay] || []).filter(
    (p) => p.subject === 'Arabic' || p.subject === 'French'
  );

  // Notes from weekly plan for tomorrow
  const tomorrowNotes = SPECIAL_TEACHER_NOTES.filter(
    (n) =>
      n.classId === currentClass &&
      n.targetDay === tomorrowDay &&
      (n.subject === 'Arabic' || n.subject === 'French') &&
      (currentWeek === 2 ? n.week === 2 : n.week === 1 || !n.week)
  );

  // Homework strictly assigned for tomorrowDay (Arabic & French only)
  const dayHomework = homeworkList.filter(
    (h) =>
      (h.subject === 'Arabic' || h.subject === 'French') &&
      h.classId === currentClass &&
      h.assignedDay === tomorrowDay &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  const renderSquareCard = (slot: PeriodSlot) => {
    const meta = SUBJECT_METADATA[slot.subject];
    const hasHw = dayHomework.some((h) => h.subject === slot.subject);

    return (
      <div
        key={slot.period}
        className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-3.5 sm:p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all group min-h-[125px]"
      >
        {/* Top Header: Period only (no time, no 'الحصة') */}
        <div className="flex items-center justify-between gap-1">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-slate-900 text-white shadow-2xs group-hover:bg-indigo-600 transition-colors">
            P{slot.period}
          </span>
          {hasHw ? (
            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              📝 واجب
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-semibold">
              لا واجب
            </span>
          )}
        </div>

        {/* Center: Icon + Subject Name (Strictly English, No Arabic translation under French) */}
        <div className="my-2 flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
              meta?.badgeBg || 'bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            <SubjectIcon subject={slot.subject} className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-black text-slate-900 leading-tight truncate">
              {slot.subject}
            </h4>
          </div>
        </div>

        {/* Bottom: Teacher */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100 text-[11px]">
          <span className="inline-flex items-center gap-1 text-slate-600 font-medium truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{slot.teacher}</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Timetable Period Squares Section (Direct, No Dark Blue Box, No Explanation Box, No Break Intervals) */}
      <div className="space-y-3">
        {targetPeriods.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center">
            <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <h4 className="text-sm font-black text-slate-800">
              لا توجد حصص لغة عربية أو فرنسية مقررة ليوم {tomorrowDay} ({currentClass})
            </h4>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {targetPeriods.map((slot) => renderSquareCard(slot))}
          </div>
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
                    {note.subject}
                  </span>
                  <span>{note.arabicNote || note.note}</span>
                </div>
                {note.bagItem && (
                  <div className="text-[11px] text-amber-900 font-semibold bg-amber-50/60 px-2 py-1 rounded-md border border-amber-100/80">
                    الأدوات / المطلوب: {note.bagItem}
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
