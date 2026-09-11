import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Utensils,
  ExternalLink,
  BookOpen,
  CheckSquare,
  AlertCircle,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ClassId, SchoolDay, HomeworkEntry } from '../types';
import {
  CLASS_TIMETABLES,
  NEXT_SCHOOL_DAY,
  SUBJECT_METADATA,
  SCHOOL_DAYS,
} from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface TomorrowViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay; // The reference today
  homeworkList: HomeworkEntry[];
  currentWeek?: number;
  onToggleHomework: (id: string) => void;
  onPrint: () => void;
}

export const TomorrowView: React.FC<TomorrowViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  currentWeek = 2,
  onToggleHomework,
  onPrint,
}) => {
  // Target tomorrow day based on selectedDay
  const defaultTomorrow = NEXT_SCHOOL_DAY[selectedDay];
  const [activeDay, setActiveDay] = useState<SchoolDay>(defaultTomorrow);

  // Update activeDay if selectedDay changes
  React.useEffect(() => {
    setActiveDay(NEXT_SCHOOL_DAY[selectedDay]);
  }, [selectedDay]);

  // Target day's timetable periods (8 periods)
  const targetPeriods = CLASS_TIMETABLES[currentClass][activeDay] || [];

  // Homework strictly organized for this day (Assigned on activeDay)
  const dayHomework = homeworkList.filter(
    (h) =>
      h.classId === currentClass &&
      h.assignedDay === activeDay &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  const completedHwCount = dayHomework.filter((h) => h.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Grade 2 • {currentClass}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white shadow-xs">
              Block 1 • Week {currentWeek}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Reference Today: {selectedDay}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Schedule & Homework for:</span>
            <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-4">
              {activeDay}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            8 periods arranged side-by-side in pairs (2, 4, 6, 8) with all homework for {activeDay}.
          </p>
        </div>

        {/* Quick Day Switcher & Print */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/10 flex-wrap gap-1">
            {SCHOOL_DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  activeDay === d
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>

          <button
            onClick={onPrint}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-white/20 self-end sm:self-auto"
            title="Print Schedule & Prep Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 2-by-2 Timetable Grid (2, 4, 6, 8 side-by-side) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {activeDay}'s 8-Period Timetable
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Official periods laid out in side-by-side pairs (1 & 2, 3 & 4, 5 & 6, 7 & 8)
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/60 self-start sm:self-auto">
            8 Periods • 4 Pairs
          </span>
        </div>

        {/* The 2-Column Grid: 2 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Periods 1 to 6 (Pairs 1 & 2, 3 & 4, 5 & 6) */}
          {targetPeriods.slice(0, 6).map((slot) => {
            const meta = SUBJECT_METADATA[slot.subject];
            const hasHw = dayHomework.some((h) => h.subject === slot.subject);

            return (
              <div
                key={slot.period}
                className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-3.5 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Period Badge */}
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-900 font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
                    <span className="text-[9px] uppercase tracking-tighter text-slate-400">P</span>
                    <span className="leading-none text-sm font-black">{slot.period}</span>
                  </div>

                  {/* Subject Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                      meta?.badgeBg || 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    <SubjectIcon subject={slot.subject} className="w-5 h-5" />
                  </div>

                  {/* Subject Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-black text-slate-900 truncate leading-tight">
                        {slot.subject}
                      </h4>
                      {meta?.arabicName && (
                        <span className="text-[11px] text-slate-500 font-semibold truncate">
                          ({meta.arabicName})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[130px]">{slot.teacher}</span>
                      </span>
                      {hasHw && (
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                          📝 Homework
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Badge */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{slot.time}</span>
                  </span>
                </div>
              </div>
            );
          })}

          {/* Lunch Break Banner across both columns between Period 6 and 7 */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-blue-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <span>Lunch & Recess Break (استراحة الغداء والصلاة)</span>
            </div>
            <span className="bg-white text-blue-900 px-2.5 py-0.5 rounded-md border border-blue-200 font-black text-[11px]">
              13:05 – 13:40
            </span>
          </div>

          {/* Periods 7 & 8 (Final Pair) */}
          {targetPeriods.slice(6, 8).map((slot) => {
            const meta = SUBJECT_METADATA[slot.subject];
            const hasHw = dayHomework.some((h) => h.subject === slot.subject);

            return (
              <div
                key={slot.period}
                className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-3.5 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Period Badge */}
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-900 font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
                    <span className="text-[9px] uppercase tracking-tighter text-slate-400">P</span>
                    <span className="leading-none text-sm font-black">{slot.period}</span>
                  </div>

                  {/* Subject Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                      meta?.badgeBg || 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    <SubjectIcon subject={slot.subject} className="w-5 h-5" />
                  </div>

                  {/* Subject Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-black text-slate-900 truncate leading-tight">
                        {slot.subject}
                      </h4>
                      {meta?.arabicName && (
                        <span className="text-[11px] text-slate-500 font-semibold truncate">
                          ({meta.arabicName})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[130px]">{slot.teacher}</span>
                      </span>
                      {hasHw && (
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                          📝 Homework
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Badge */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{slot.time}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Homework of this Day Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Homework Assigned on {activeDay} (واجبات يوم {activeDay})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Directly associated with {activeDay}'s lessons (Week {currentWeek})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-black text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              {completedHwCount} / {dayHomework.length} Completed
            </span>
          </div>
        </div>

        {dayHomework.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-black text-slate-800">
              No Homework Assigned on {activeDay}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              There are no homework assignments scheduled for {activeDay} in Week {currentWeek}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayHomework.map((hw) => {
              const meta = SUBJECT_METADATA[hw.subject];
              return (
                <div
                  key={hw.id}
                  className={`border rounded-xl p-3.5 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    hw.completed
                      ? 'bg-emerald-50/30 border-emerald-300 opacity-85'
                      : hw.priority === 'urgent'
                      ? 'bg-rose-50/20 border-rose-300 hover:shadow-xs'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => onToggleHomework(hw.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={hw.completed ? 'Mark as incomplete' : 'Mark as done'}
                    >
                      {hw.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-black border ${
                            meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'
                          }`}
                        >
                          <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                          <span>{hw.subject}</span>
                        </span>

                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200">
                          Day: {hw.assignedDay}
                        </span>

                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Hand in: {hw.dueDay}
                        </span>

                        {(hw.isLinkTask || hw.linkUrl) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-300">
                            <ExternalLink className="w-3 h-3 text-blue-700" />
                            <span>رابط فيديو</span>
                          </span>
                        )}

                        {hw.priority === 'urgent' && !hw.completed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">
                            <AlertCircle className="w-3 h-3 text-rose-700" />
                            Urgent
                          </span>
                        )}

                        {hw.pages && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-950 border border-indigo-200">
                            📖 {hw.pages}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm font-semibold text-slate-900 leading-snug ${
                          hw.completed ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {hw.task}
                      </p>

                      {hw.details && (
                        <p className="text-xs text-slate-600 leading-snug font-medium dir-rtl">
                          {hw.details}
                        </p>
                      )}

                      {hw.linkUrl && (
                        <div className="pt-1">
                          <a
                            href={hw.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 transition-colors shadow-2xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                            <span>فتح رابط الفيديو والمشاهدة 🔗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleHomework(hw.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all shrink-0 self-end sm:self-center ${
                      hw.completed
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                    }`}
                  >
                    {hw.completed ? 'Mark Incomplete' : 'Done ✓'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
