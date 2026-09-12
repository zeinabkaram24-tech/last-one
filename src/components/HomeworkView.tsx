import React from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { ClassId, SchoolDay, HomeworkEntry } from '../types';
import { SUBJECT_METADATA } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';
import { triggerDoneCelebration } from '../utils/celebrate';
import { getSubjectTheme } from '../data/subjectThemes';

interface HomeworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  homeworkList: HomeworkEntry[];
  currentWeek?: number;
  onToggleHomework: (id: string) => void;
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

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  currentWeek = 2,
  onToggleHomework,
}) => {
  // Only homework assigned for the selected day (Arabic, French, Mathematics, Social Studies, English, ICT)
  const dayHomework = homeworkList.filter(
    (h) =>
      h.classId === currentClass &&
      (h.subject === 'Arabic' ||
        h.subject === 'French' ||
        h.subject === 'Mathematics' ||
        h.subject === 'Social Studies' ||
        h.subject === 'English' ||
        h.subject === 'ICT') &&
      h.assignedDay === selectedDay &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      triggerDoneCelebration();
    }
    onToggleHomework(id);
  };

  const completedCount = dayHomework.filter((h) => h.completed).length;
  const totalCount = dayHomework.length;

  return (
    <div className="space-y-3.5">
      {/* Top Banner: Header for the selected day only */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">
              واجبات يوم {ARABIC_DAY_NAMES[selectedDay]} ({selectedDay}) • {currentClass}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-black border border-indigo-200">
              الأسبوع {currentWeek}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            الواجبات المقررة ليوم {ARABIC_DAY_NAMES[selectedDay]} فقط حسب الخطة الأسبوعية المعتمدة.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
            <span>المكتمل: </span>
            <strong className="text-emerald-700 font-black">{completedCount}</strong>
            <span className="text-slate-400 mx-1">/</span>
            <span>{totalCount}</span>
          </div>
        )}
      </div>

      {/* Selected Day Homework List */}
      {dayHomework.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-2xs space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">
            لا توجد واجبات مقررة ليوم {ARABIC_DAY_NAMES[selectedDay]} ({selectedDay})
          </h4>
          <p className="text-xs text-slate-400">
            بحسب الخطة الأسبوعية المعتمدة، لا يوجد واجب منزلي مقرر لهذا اليوم في المواد المسجلة.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {dayHomework.map((hw) => {
            const meta = SUBJECT_METADATA[hw.subject];
            const theme = getSubjectTheme(hw.subject);
            return (
              <div
                key={hw.id}
                className={`rounded-2xl border border-s-4 p-3.5 sm:p-4 transition-all flex items-start justify-between gap-3 shadow-2xs ${
                  hw.completed
                    ? 'border-emerald-300 border-s-emerald-600 bg-emerald-50/30 opacity-85'
                    : `${theme.hwCard} ${theme.hwAccentBorder} shadow-xs`
                }`}
              >
                {/* Checkbox and Task Details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(hw.id, hw.completed)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={hw.completed ? 'Done' : 'Mark as Done'}
                  >
                    {hw.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Badges: Subject with colorful icon + الواجب المنزلي + Due date */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border transition-colors ${
                          theme.hwSubjectBadge
                        }`}
                      >
                        <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                        <span>{hw.subject}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black border transition-colors ${
                          theme.hwTag
                        }`}
                      >
                        الواجب المنزلي
                      </span>

                      {hw.dueDay && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/95 text-slate-800 border border-slate-200 shadow-2xs">
                          موعد التسليم: يوم {ARABIC_DAY_NAMES[hw.dueDay] || hw.dueDay}
                        </span>
                      )}
                    </div>

                    {/* Task Description */}
                    <p
                      className={`text-sm font-black leading-snug pt-0.5 ${
                        hw.completed ? 'line-through text-slate-400' : 'text-slate-950'
                      }`}
                    >
                      {hw.task}
                    </p>

                    {/* Link if available */}
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

                {/* Interactive toggle button: Done with celebration */}
                <button
                  onClick={() => handleToggle(hw.id, hw.completed)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 self-start sm:self-center flex items-center gap-1.5 ${
                    hw.completed
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-slate-100 hover:text-slate-600 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs hover:scale-105 active:scale-95'
                  }`}
                  title={hw.completed ? 'اضغطي للإلغاء' : 'اضغطي للتحديد كـ Done'}
                >
                  {hw.completed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Done ✓</span>
                    </>
                  ) : (
                    <span>Done</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
