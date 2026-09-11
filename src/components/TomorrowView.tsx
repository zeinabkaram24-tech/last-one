import React from 'react';
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
  ArrowRight,
} from 'lucide-react';
import { ClassId, SchoolDay, HomeworkEntry, PeriodSlot } from '../types';
import {
  CLASS_TIMETABLES,
  NEXT_SCHOOL_DAY,
  SUBJECT_METADATA,
} from '../data/timetables';
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

  // Homework strictly assigned for tomorrowDay (Arabic & French only)
  const dayHomework = homeworkList.filter(
    (h) =>
      (h.subject === 'Arabic' || h.subject === 'French') &&
      h.classId === currentClass &&
      h.assignedDay === tomorrowDay &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  const completedHwCount = dayHomework.filter((h) => h.completed).length;

  const renderSquareCard = (slot: PeriodSlot) => {
    const meta = SUBJECT_METADATA[slot.subject];
    const hasHw = dayHomework.some((h) => h.subject === slot.subject);

    return (
      <div
        key={slot.period}
        className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-3.5 sm:p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all group min-h-[130px]"
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
    <div className="space-y-6">
      {/* Header Banner - Explaining Today ➔ Tomorrow */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Grade 2 • {currentClass}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white shadow-xs">
              Block 1 • Week {currentWeek}
            </span>
            <span className="text-xs text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
              اليوم الحالي في التبويب: {selectedDay}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>تجهيز جدول بكرة:</span>
              <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-4">
                {tomorrowDay}
              </span>
            </h2>
            <div className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 bg-white/10 px-2 py-1 rounded-lg">
              <span>({selectedDay}</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
              <span className="font-bold text-amber-300">{tomorrowDay})</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            حصص العربي والفرنش المقررة ليوم <strong>{tomorrowDay}</strong> والواجبات المطلوبة لتجهيز الحقيبة المدرسية اليوم.
          </p>
        </div>
      </div>

      {/* Timetable Squares Section */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                حصص العربي والفرنش ليوم {tomorrowDay}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                مربعات الحصص لتجهيز الكتب والتحضير (بدون مواعيد الحصص)
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/60 self-start sm:self-auto">
            {targetPeriods.length} حصص • {tomorrowDay}
          </span>
        </div>

        {targetPeriods.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center">
            <BookOpen className="w-7 h-7 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-black text-slate-800">
              لا توجد حصص لغة عربية أو فرنسية مقررة ليوم {tomorrowDay} لهذا الفصل ({currentClass})
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              تم حجب باقي المواد مؤقتاً (PE, Art, Music...) لحين تزويدنا بخططها الأسبوعية.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {targetPeriods.map((slot) => renderSquareCard(slot))}
          </div>
        )}
      </div>

      {/* Homework for tomorrowDay Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                واجبات يوم {tomorrowDay} (Homework for {tomorrowDay})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                الواجبات المرتبطة بحصص ودروس يوم {tomorrowDay} (الأسبوع {currentWeek})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-black text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              {completedHwCount} من {dayHomework.length} مكتمل
            </span>
          </div>
        </div>

        {dayHomework.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-black text-slate-800">
              لا توجد واجبات مقررة ليوم {tomorrowDay}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              لم يتم تعيين أي واجبات مدرسية مسجلة ليوم {tomorrowDay} في الأسبوع {currentWeek}.
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
                      title={hw.completed ? 'وضع كغير مكتمل' : 'وضع كمكتمل'}
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
                          يوم الحصة: {hw.assignedDay}
                        </span>

                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          التسليم: {hw.dueDay}
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
                            عاجل
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
                    {hw.completed ? 'غير مكتمل' : 'تم الإنجاز ✓'}
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
