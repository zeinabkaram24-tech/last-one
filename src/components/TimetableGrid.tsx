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
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="p-3 font-bold text-center border-r border-slate-200 w-28 bg-slate-100/70">
                  Day / Period
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-24 bg-amber-50/50">
                  <div className="text-amber-800 font-extrabold text-[11px]">Line</div>
                  <div className="text-[10px] text-amber-600 font-normal">7:30 - 7:45</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">1</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[1]}</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">2</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[2]}</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-24 bg-emerald-50/60">
                  <div className="text-emerald-800 font-extrabold text-[11px]">Breakfast</div>
                  <div className="text-[10px] text-emerald-600 font-normal">9:25 - 9:45</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">3</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[3]}</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">4</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[4]}</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">5</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[5]}</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">6</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[6]}</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-24 bg-blue-50/60">
                  <div className="text-blue-800 font-extrabold text-[11px]">Lunch</div>
                  <div className="text-[10px] text-blue-600 font-normal">13:05 - 13:25</div>
                </th>
                <th className="p-2 font-bold text-center border-r border-slate-200 w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">7</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[7]}</div>
                </th>
                <th className="p-2 font-bold text-center w-28">
                  <div className="text-slate-800 font-extrabold text-[11px]">8</div>
                  <div className="text-[10px] text-slate-500 font-normal">{PERIOD_TIMES[8]}</div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {SCHOOL_DAYS.map((day) => {
                const daySlots = schedule[day] || [];
                const isSelected = selectedDay === day;

                const getPeriod = (num: number) => daySlots.find((p) => p.period === num);

                return (
                  <tr
                    key={day}
                    onClick={() => onSelectDay(day)}
                    className={`cursor-pointer transition-colors border-b border-slate-100 ${
                      isSelected
                        ? 'bg-indigo-50/40 hover:bg-indigo-50/60'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Day Column */}
                    <td className="p-3 font-bold border-r border-slate-200 text-center bg-slate-50/60">
                      <div className="text-xs text-slate-900">{day}</div>
                      {isSelected && (
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Assembly Line */}
                    <td className="p-2 text-center border-r border-slate-200 bg-amber-50/30 text-amber-900">
                      <div className="flex flex-col items-center justify-center">
                        <Flag className="w-4 h-4 text-amber-600 mb-1" />
                        <span className="text-[10px] font-semibold">Assembly</span>
                      </div>
                    </td>

                    {/* Period 1 */}
                    <SlotCell slot={getPeriod(1)} />

                    {/* Period 2 */}
                    <SlotCell slot={getPeriod(2)} />

                    {/* Breakfast Break */}
                    <td className="p-2 text-center border-r border-slate-200 bg-emerald-50/30 text-emerald-900">
                      <div className="flex flex-col items-center justify-center">
                        <Coffee className="w-4 h-4 text-emerald-600 mb-1" />
                        <span className="text-[10px] font-semibold">Breakfast</span>
                      </div>
                    </td>

                    {/* Period 3 */}
                    <SlotCell slot={getPeriod(3)} />

                    {/* Period 4 */}
                    <SlotCell slot={getPeriod(4)} />

                    {/* Period 5 */}
                    <SlotCell slot={getPeriod(5)} />

                    {/* Period 6 */}
                    <SlotCell slot={getPeriod(6)} />

                    {/* Lunch Break */}
                    <td className="p-2 text-center border-r border-slate-200 bg-blue-50/30 text-blue-900">
                      <div className="flex flex-col items-center justify-center">
                        <Utensils className="w-4 h-4 text-blue-600 mb-1" />
                        <span className="text-[10px] font-semibold">Lunch</span>
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
        className={`p-2 text-center text-slate-300 ${isLast ? '' : 'border-r border-slate-200'}`}
      >
        -
      </td>
    );
  }

  const meta = SUBJECT_METADATA[slot.subject];

  return (
    <td
      className={`p-2 text-center align-top ${isLast ? '' : 'border-r border-slate-200'} transition-all`}
    >
      <div
        className={`rounded-lg p-2 border ${meta?.badgeBg || 'bg-slate-100 text-slate-800 border-slate-200'} flex flex-col items-center justify-between min-h-[76px]`}
      >
        <div className="flex flex-col items-center gap-0.5">
          <SubjectIcon subject={slot.subject} className="w-4 h-4 mb-0.5" />
          <span className="font-extrabold text-[11px] leading-tight text-center">
            {slot.subject}
          </span>
          <span className="text-[9px] opacity-75">({meta?.arabicName})</span>
        </div>

        <div className="mt-1 pt-1 border-t border-current/10 w-full text-center">
          <span className="text-[10px] font-medium leading-none block truncate" title={slot.teacher}>
            {slot.teacher}
          </span>
        </div>
      </div>
    </td>
  );
};
