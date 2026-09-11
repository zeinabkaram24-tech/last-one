import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ClassId, HomeworkEntry, SchoolDay } from '../types';
import { SUBJECT_METADATA } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface HomeworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  homeworkList: HomeworkEntry[];
  currentWeek?: number;
  onToggleHomework: (id: string) => void;
  onAddHomework?: (entry: HomeworkEntry) => void;
  onDeleteHomework?: (id: string) => void;
}

const SCHOOL_DAYS_ORDER: SchoolDay[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
];

const ARABIC_DAY_NAMES: Record<SchoolDay, string> = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
};

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  currentWeek = 2,
  onToggleHomework,
}) => {
  // Mode: show selected day or show all days of the week
  const [viewMode, setViewMode] = useState<'selected' | 'all'>('all');

  // Strictly Arabic and French for the selected Class & Week
  const classHomework = homeworkList.filter(
    (h) =>
      h.classId === currentClass &&
      (h.subject === 'Arabic' || h.subject === 'French') &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  const completedCount = classHomework.filter((h) => h.completed).length;
  const totalCount = classHomework.length;

  const daysToDisplay =
    viewMode === 'selected'
      ? [selectedDay]
      : SCHOOL_DAYS_ORDER;

  return (
    <div className="space-y-3.5">
      {/* Top Banner: Header + Stats INSIDE (as requested, count is inside the page) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">
              واجبات {currentClass} • الأسبوع {currentWeek}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-black border border-indigo-200">
              عربي وفرنش
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            الواجبات مقررة في أيامها المحددة حسب الخطة الأسبوعية المعتمدة.
          </p>
        </div>

        {/* Counts inside the page + Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            <span>المكتمل: </span>
            <strong className="text-emerald-700 font-black">{completedCount}</strong>
            <span className="text-slate-400 mx-1">/</span>
            <span>{totalCount}</span>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'all'
                  ? 'bg-white text-indigo-900 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              كل الأسبوع
            </button>
            <button
              onClick={() => setViewMode('selected')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'selected'
                  ? 'bg-white text-indigo-900 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              يوم {ARABIC_DAY_NAMES[selectedDay] || selectedDay}
            </button>
          </div>
        </div>
      </div>

      {/* Homework organized strictly by Day */}
      <div className="space-y-3">
        {daysToDisplay.map((day) => {
          const dayItems = classHomework.filter((h) => h.assignedDay === day);
          const isCurrentSelected = day === selectedDay;

          return (
            <div
              key={day}
              className={`rounded-2xl border transition-all ${
                isCurrentSelected
                  ? 'bg-white border-indigo-200 shadow-2xs ring-1 ring-indigo-500/20'
                  : 'bg-white/90 border-slate-200 shadow-2xs'
              } p-3 sm:p-3.5 space-y-2.5`}
            >
              {/* Day Header Row */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    يوم {ARABIC_DAY_NAMES[day]} ({day})
                  </span>
                  {isCurrentSelected && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 font-black">
                      اليوم المحدد
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold text-slate-500">
                  {dayItems.length > 0
                    ? `${dayItems.length} واجب مقرر`
                    : 'لا يوجد واجبات'}
                </span>
              </div>

              {/* Day's homework list or clean empty indicator */}
              {dayItems.length === 0 ? (
                <div className="py-2 px-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-400 font-medium">
                    لا يوجد واجب عربي أو فرنسي مقرر ليوم {ARABIC_DAY_NAMES[day]} في الخطة الأسبوعية
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dayItems.map((hw) => {
                    const meta = SUBJECT_METADATA[hw.subject];
                    return (
                      <div
                        key={hw.id}
                        className={`rounded-xl border p-3 transition-all flex items-start justify-between gap-3 ${
                          hw.completed
                            ? 'border-emerald-300 bg-emerald-50/25 opacity-85'
                            : 'border-slate-200 bg-slate-50/40 hover:border-indigo-300 hover:bg-white'
                        }`}
                      >
                        {/* Checkbox and Task Details */}
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => onToggleHomework(hw.id)}
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                            title={hw.completed ? 'وضع كغير منجز' : 'وضع كمنجز'}
                          >
                            {hw.completed ? (
                              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-emerald-600" />
                            )}
                          </button>

                          <div className="space-y-1 flex-1 min-w-0">
                            {/* Badges: Subject with colorful icon + Due date */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-black border ${
                                  meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'
                                }`}
                              >
                                <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                                <span>{hw.subject}</span>
                              </span>

                              {hw.dueDay && (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                                  تسليم: يوم {ARABIC_DAY_NAMES[hw.dueDay] || hw.dueDay}
                                </span>
                              )}
                            </div>

                            {/* Task Description */}
                            <p
                              className={`text-xs sm:text-sm font-bold leading-snug pt-0.5 ${
                                hw.completed ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {hw.task}
                            </p>

                            {/* Required Tools / Pages */}
                            {hw.pages && (
                              <div className="text-[11px] text-indigo-900 font-bold bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100 inline-block">
                                المطلوب / الكراسة: {hw.pages}
                              </div>
                            )}

                            {/* Link if available */}
                            {hw.linkUrl && (
                              <div className="pt-1">
                                <a
                                  href={hw.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3 text-blue-700" />
                                  <span>رابط الواجب / النشاط</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive toggle button: She decides if Done or Not Done */}
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
