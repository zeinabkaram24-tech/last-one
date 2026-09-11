import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCheck,
  Clock,
  Sparkles,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { ClassId, HomeworkEntry, SchoolDay, SubjectName } from '../types';
import { SUBJECT_METADATA, SCHOOL_DAYS } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface HomeworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  homeworkList: HomeworkEntry[];
  currentWeek?: number;
  onToggleHomework: (id: string) => void;
  onAddHomework: (entry: HomeworkEntry) => void;
  onDeleteHomework: (id: string) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  currentWeek = 2,
  onToggleHomework,
  onAddHomework,
  onDeleteHomework,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'urgent' | 'completed'>('all');
  const [weekFilter, setWeekFilter] = useState<'all' | number>('all');
  const [dayFilter, setDayFilter] = useState<SchoolDay | 'All'>('All');

  const classHomework = homeworkList.filter((h) => h.classId === currentClass);

  const pendingList = classHomework.filter((h) => !h.completed);
  const completedList = classHomework.filter((h) => h.completed);
  const urgentList = pendingList.filter((h) => h.priority === 'urgent');

  // Filtered display
  const displayedHomework = classHomework.filter((h) => {
    if (filterMode === 'pending' && h.completed) return false;
    if (filterMode === 'urgent' && (h.completed || h.priority !== 'urgent')) return false;
    if (filterMode === 'completed' && !h.completed) return false;

    if (weekFilter !== 'all') {
      const hwWeek = h.week || 1;
      if (hwWeek !== weekFilter) return false;
    }

    if (dayFilter !== 'All') {
      if (h.assignedDay !== dayFilter) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Metrics Row - 4 Compact Boxes Side-by-Side in One Horizontal Row */}
      <div className="grid grid-cols-4 gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
        <button
          onClick={() => setFilterMode('all')}
          className={`py-1.5 px-2 rounded-lg border text-center transition-all flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-1 ${
            filterMode === 'all'
              ? 'bg-white border-indigo-400 shadow-2xs text-indigo-950 font-bold'
              : 'bg-white/60 border-transparent text-slate-700 hover:bg-white'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-700 truncate">Total</span>
          <span className="text-xs font-black text-slate-900 bg-slate-200/80 px-1.5 py-0.2 rounded">
            {classHomework.length}
          </span>
        </button>

        <button
          onClick={() => setFilterMode('pending')}
          className={`py-1.5 px-2 rounded-lg border text-center transition-all flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-1 ${
            filterMode === 'pending'
              ? 'bg-amber-50 border-amber-400 shadow-2xs text-amber-950 font-bold'
              : 'bg-white/60 border-transparent text-amber-900 hover:bg-amber-50/60'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-800 truncate">To Do</span>
          <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setFilterMode('urgent')}
          className={`py-1.5 px-2 rounded-lg border text-center transition-all flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-1 ${
            filterMode === 'urgent'
              ? 'bg-rose-50 border-rose-400 shadow-2xs text-rose-950 font-bold'
              : 'bg-white/60 border-transparent text-rose-900 hover:bg-rose-50/60'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-800 truncate">Urgent</span>
          <span className="text-xs font-black text-rose-900 bg-rose-200/80 px-1.5 py-0.2 rounded">
            {urgentList.length}
          </span>
        </button>

        <button
          onClick={() => setFilterMode('completed')}
          className={`py-1.5 px-2 rounded-lg border text-center transition-all flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-1 ${
            filterMode === 'completed'
              ? 'bg-emerald-50 border-emerald-400 shadow-2xs text-emerald-950 font-bold'
              : 'bg-white/60 border-transparent text-emerald-900 hover:bg-emerald-50/60'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-800 truncate">Done</span>
          <span className="text-xs font-black text-emerald-900 bg-emerald-200/80 px-1.5 py-0.2 rounded">
            {completedList.length}
          </span>
        </button>
      </div>

      {/* Day Filter & View Basis Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['All', ...SCHOOL_DAYS] as const).map((day) => {
            const count = day === 'All'
              ? classHomework.length
              : classHomework.filter((h) => h.assignedDay === day).length;
            const isActive = dayFilter === day;

            return (
              <button
                key={day}
                onClick={() => setDayFilter(day)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                <span>{day === 'All' ? 'All Days' : day}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-800'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Controls: Week Filter */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Week Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs shrink-0">
            <span className="text-[10px] font-bold text-slate-500 px-1">Week:</span>
            <button
              onClick={() => setWeekFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-black transition-all ${
                weekFilter === 'all'
                  ? 'bg-white text-indigo-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setWeekFilter(1)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-black transition-all ${
                weekFilter === 1
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              W1
            </button>
            <button
              onClick={() => setWeekFilter(2)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-black transition-all ${
                weekFilter === 2
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              W2
            </button>
          </div>

          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
            كل واجب في يومه
          </span>
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-2.5">
        {displayedHomework.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-dashed border-slate-200">
            <CheckCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-black text-slate-900">No homework in this view</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-medium">
              No assignments recorded for this specific day or filter.
            </p>
          </div>
        ) : (
          displayedHomework.map((hw) => {
            const meta = SUBJECT_METADATA[hw.subject];
            return (
              <div
                key={hw.id}
                className={`bg-white rounded-xl border p-3 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                  hw.completed
                    ? 'border-emerald-300 bg-emerald-50/25 opacity-85'
                    : hw.priority === 'urgent'
                    ? 'border-rose-300 bg-rose-50/15 hover:shadow-xs'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                {/* Left: Checkbox & Task Info */}
                <div className="flex items-start gap-2.5 flex-1">
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
                      {/* Subject Name (English only) */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-black border ${meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'}`}
                      >
                        <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                        <span>{hw.subject}</span>
                      </span>

                      {/* Week tag */}
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                        W{hw.week || 1}
                      </span>

                      {/* Assigned day tag */}
                      <span className="text-[11px] font-black px-2 py-0.5 rounded bg-indigo-50 text-indigo-950 border border-indigo-200">
                        Day: {hw.assignedDay}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Hand in: {hw.dueDay}
                      </span>

                      {/* Link task badge */}
                      {(hw.isLinkTask || hw.linkUrl) && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-300">
                          <ExternalLink className="w-3 h-3 text-blue-700" />
                          <span>رابط فيديو</span>
                        </span>
                      )}

                      {hw.priority === 'urgent' && !hw.completed && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">
                          <AlertCircle className="w-3 h-3 text-rose-700" />
                          Urgent / Exam
                        </span>
                      )}

                      {hw.pages && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-950 border border-indigo-200">
                          📖 {hw.pages}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-black ${
                        hw.completed ? 'text-slate-500 line-through' : 'text-slate-950'
                      }`}
                    >
                      {hw.task}
                    </h4>

                    {hw.details && (
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {hw.details}
                      </p>
                    )}

                    {/* Interactive Video Link button */}
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

                {/* Right: Due Date Banner & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* High contrast, prominent Due Date */}
                  <div className="flex flex-col items-start sm:items-end">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-black text-xs shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Due: {hw.dueDay}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold mt-0.5">
                      Submit in {hw.dueDay}&apos;s period
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteHomework(hw.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                    title="Delete homework"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
