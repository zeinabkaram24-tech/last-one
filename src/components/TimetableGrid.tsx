import React from 'react';
import { Clock, User, Coffee, Utensils, Flag, CalendarDays } from 'lucide-react';
import { ClassId, SchoolDay } from '../types';
import {
  CLASS_TIMETABLES,
  SCHOOL_DAYS,
  PERIOD_TIMES,
  SUBJECT_METADATA,
  SCHOOL_NAME,
  SCHOOL_BRANCH,
} from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface TimetableGridProps {
  currentClass: ClassId;
  onSelectDay: (day: SchoolDay) => void;
  selectedDay: SchoolDay;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  currentClass,
  onSelectDay,
  selectedDay,
}) => {
  const schedule = CLASS_TIMETABLES[currentClass];

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentClass} Timetable
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Official 8-Period Weekly Schedule
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {SCHOOL_NAME} • {SCHOOL_BRANCH} Campus • Grade 2 ({currentClass})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <CalendarDays className="w-4 h-4 text-indigo-600" />
          <span>Click any day row to inspect Classwork and Homework</span>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Timetable Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left min-w-[980px]">
            {/* Table Header with Periods & Times */}
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-300">
                <th className="p-2.5 font-black text-center border-r border-slate-300 w-24 bg-slate-200/80 text-slate-900 text-xs">
                  Day
                </th>
                <th className="p-1.5 font-extrabold text-center border-r border-slate-300 min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 1</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[1]}</div>
                </th>
                <th className="p-1.5 font-extrabold text-center border-r border-slate-300 min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 2</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[2]}</div>
                </th>
                <th className="p-1.5 font-extrabold text-center border-r border-slate-300 min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 3</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[3]}</div>
                </th>
                <th className="p-1.5 font-extrabold text-center border-r border-slate-300 min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 4</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[4]}</div>
                </th>
                <th className="p-1.5 font-extrabold text-center border-r border-slate-300 min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 5</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[5]}</div>
                </th>
                <th className="p-1.5 font-extrabold text-center border-r border-slate-300 min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 6</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[6]}</div>
                </th>
                <th className="p-1 font-bold text-center border-r border-slate-300 w-16 bg-blue-50/70">
                  <div className="text-blue-900 font-black text-[10px]">Lunch</div>
                  <div className="text-[9px] text-blue-700 font-semibold">13:05</div>
                </th>
                <th className="p-1.5 font-extrabold text-center border-r border-slate-300 min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 7</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[7]}</div>
                </th>
                <th className="p-1.5 font-extrabold text-center min-w-[90px]">
                  <div className="text-slate-900 font-black text-xs">Period 8</div>
                  <div className="text-[10px] text-slate-600 font-bold">{PERIOD_TIMES[8]}</div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {SCHOOL_DAYS.filter((d) => (schedule[d] || []).length > 0).map((day) => {
                const daySlots = schedule[day] || [];
                const isSelected = selectedDay === day;

                const getPeriod = (num: number) => daySlots.find((p) => p.period === num);

                return (
                  <tr
                    key={day}
                    onClick={() => onSelectDay(day)}
                    className={`cursor-pointer transition-colors border-b border-slate-200 ${
                      isSelected
                        ? 'bg-indigo-50/60 hover:bg-indigo-50/80'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Day Column */}
                    <td className="p-2.5 font-black border-r border-slate-300 text-center bg-slate-100/70">
                      <div className="text-xs font-black text-slate-950">{day}</div>
                      {isSelected && (
                        <span className="text-[9px] font-black text-indigo-800 bg-indigo-100/90 border border-indigo-200 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Period 1 */}
                    <SlotCell slot={getPeriod(1)} />

                    {/* Period 2 */}
                    <SlotCell slot={getPeriod(2)} />

                    {/* Period 3 */}
                    <SlotCell slot={getPeriod(3)} />

                    {/* Period 4 */}
                    <SlotCell slot={getPeriod(4)} />

                    {/* Period 5 */}
                    <SlotCell slot={getPeriod(5)} />

                    {/* Period 6 */}
                    <SlotCell slot={getPeriod(6)} />

                    {/* Lunch Break */}
                    <td className="p-1 text-center border-r border-slate-300 bg-blue-50/40 text-blue-950">
                      <div className="flex flex-col items-center justify-center">
                        <Utensils className="w-3.5 h-3.5 text-blue-600 mb-0.5" />
                        <span className="text-[9px] font-extrabold">Lunch</span>
                      </div>
                    </td>

                    {/* Period 7 */}
                    <SlotCell slot={getPeriod(7)} />

                    {/* Period 8 */}
                    <SlotCell slot={getPeriod(8)} isLast />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface SlotCellProps {
  slot?: {
    period: number;
    subject: any;
    teacher: string;
    notes?: string;
  };
  isLast?: boolean;
}

const SlotCell: React.FC<SlotCellProps> = ({ slot, isLast }) => {
  if (!slot) {
    return (
      <td
        className={`p-1 text-center text-slate-300 font-bold ${isLast ? '' : 'border-r border-slate-300'}`}
      >
        -
      </td>
    );
  }

  const meta = SUBJECT_METADATA[slot.subject];

  return (
    <td
      className={`p-1 text-center align-top ${isLast ? '' : 'border-r border-slate-300'} transition-all`}
    >
      <div
        className={`rounded-lg p-1.5 border shadow-2xs ${meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'} flex flex-col items-center justify-between min-h-[58px] transition-transform hover:scale-[1.02]`}
      >
        <div className="flex flex-col items-center gap-0.5 w-full">
          <SubjectIcon subject={slot.subject} className="w-3.5 h-3.5 shrink-0" />
          <span className="font-black text-[11px] leading-tight text-center text-slate-950 block">
            {slot.subject}
          </span>
        </div>

        <div className="mt-1 pt-0.5 border-t border-slate-300/60 w-full text-center">
          <span className="text-[10px] font-bold text-slate-800 block truncate leading-tight" title={slot.teacher}>
            {slot.teacher}
          </span>
        </div>
      </div>
    </td>
  );
};
