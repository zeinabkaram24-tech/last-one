import React from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
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

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  currentClass,
  homeworkList,
  currentWeek = 2,
  onToggleHomework,
}) => {
  // Strictly Arabic and French for the selected Class & Week (selected globally in header)
  // Only items from the weekly plan marked as واجب منزلي / Devoir
  const classHomework = homeworkList.filter(
    (h) =>
      h.classId === currentClass &&
      (h.subject === 'Arabic' || h.subject === 'French') &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  return (
    <div className="space-y-4">
      {/* Homework Cards List: Ultra Clean (Subject Name + Homework Task + Required Tools + Checkbox) */}
      <div className="space-y-3">
        {classHomework.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-dashed border-slate-200">
            <BookOpen className="w-7 h-7 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-black text-slate-800">
              لا توجد واجبات منزلية مسجلة
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              يتم عرض الواجبات المقررة في الخطة الأسبوعية تحت بند (واجب منزلي) فقط لمادتي العربي والفرنش.
            </p>
          </div>
        ) : (
          classHomework.map((hw) => {
            const meta = SUBJECT_METADATA[hw.subject];
            return (
              <div
                key={hw.id}
                className={`bg-white rounded-xl border p-4 transition-all shadow-2xs flex items-start justify-between gap-3 ${
                  hw.completed
                    ? 'border-emerald-300 bg-emerald-50/20 opacity-80'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                {/* Checkbox & Homework Content */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => onToggleHomework(hw.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={hw.completed ? 'وضع كغير منجز' : 'وضع كمنجز'}
                  >
                    {hw.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    {/* Header badges: Subject + Day assigned & Due */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-black border ${
                          meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'
                        }`}
                      >
                        <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                        <span>{hw.subject}</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        يوم الحصة: {hw.assignedDay} {hw.dueDay ? `• التسليم: ${hw.dueDay}` : ''}
                      </span>
                    </div>

                    {/* The Homework Task Directly Underneath */}
                    <p
                      className={`text-sm font-bold text-slate-900 leading-snug pt-0.5 ${
                        hw.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {hw.task}
                    </p>

                    {/* Tools / Required Materials (الأدوات المطلوبة للواجب) */}
                    {hw.pages && (
                      <div className="text-xs text-indigo-900 font-bold bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100/80 inline-block">
                        الأدوات / الكراسة المطلوبة: {hw.pages}
                      </div>
                    )}

                    {/* Link button if present */}
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

                {/* Right Action Button */}
                <button
                  onClick={() => onToggleHomework(hw.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all shrink-0 self-start sm:self-center ${
                    hw.completed
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                  }`}
                >
                  {hw.completed ? 'غير مكتمل' : 'تم الإنجاز ✓'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
