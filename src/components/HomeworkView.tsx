import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Check,
  RotateCcw,
  Smile,
  PartyPopper,
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
  onSelectDay?: (day: SchoolDay) => void;
}

const SCHOOL_DAYS: { id: SchoolDay; ar: string; en: string }[] = [
  { id: 'Sunday', ar: 'الأحد', en: 'Sunday' },
  { id: 'Monday', ar: 'الإثنين', en: 'Monday' },
  { id: 'Tuesday', ar: 'الثلاثاء', en: 'Tuesday' },
  { id: 'Wednesday', ar: 'الأربعاء', en: 'Wednesday' },
  { id: 'Thursday', ar: 'الخميس', en: 'Thursday' },
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
  onSelectDay,
}) => {
  // Celebration state for balloons & confetti
  const [celebrating, setCelebrating] = useState(false);
  const [celebratedItemTask, setCelebratedItemTask] = useState<string>('');

  // Homework for the selected class, week, and strictly for the selected Day
  const dayHomework = homeworkList.filter(
    (h) =>
      h.classId === currentClass &&
      h.assignedDay === selectedDay &&
      (h.week === currentWeek || (!h.week && currentWeek === 1))
  );

  const completedTodayCount = dayHomework.filter((h) => h.completed).length;
  const totalTodayCount = dayHomework.length;

  const triggerCelebration = (taskName: string) => {
    setCelebratedItemTask(taskName);
    setCelebrating(true);

    // Fire colorful celebration confetti
    try {
      // First burst from center
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      });

      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8'],
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#818cf8', '#f472b6', '#38bdf8', '#10b981'],
        });
      }, 400);
    } catch {
      // Safe fallback
    }

    // Auto-dismiss celebration popup after 4 seconds
    setTimeout(() => {
      setCelebrating(false);
    }, 4000);
  };

  const handleDoneClick = (hw: HomeworkEntry) => {
    const willBeCompleted = !hw.completed;
    onToggleHomework(hw.id);

    if (willBeCompleted) {
      triggerCelebration(hw.task);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Floating Balloons Celebration Overlay for Children */}
      {celebrating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs pointer-events-auto transition-all animate-fadeIn">
          {/* Floating animated balloons in background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-around items-end">
            <div className="text-5xl sm:text-7xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎈</div>
            <div className="text-6xl sm:text-8xl animate-bounce" style={{ animationDuration: '0.9s' }}>🎉</div>
            <div className="text-5xl sm:text-7xl animate-bounce" style={{ animationDuration: '1.5s' }}>🎈</div>
            <div className="text-6xl sm:text-8xl animate-bounce" style={{ animationDuration: '1.1s' }}>🌟</div>
            <div className="text-5xl sm:text-7xl animate-bounce" style={{ animationDuration: '1.4s' }}>🎈</div>
            <div className="text-6xl sm:text-8xl animate-bounce" style={{ animationDuration: '1s' }}>🎊</div>
            <div className="text-5xl sm:text-7xl animate-bounce" style={{ animationDuration: '1.3s' }}>🎈</div>
          </div>

          {/* Celebration Card */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-emerald-400 space-y-3 z-10 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner text-3xl">
              🎈
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                برافو عليك يا شاطر! ⭐
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 pt-1">
                تم إنجاز الواجب بنجاح!
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                {celebratedItemTask}
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5">
              <PartyPopper className="w-4 h-4 text-amber-600 shrink-0" />
              <span>أحسنت يا بطل! كمل باقي واجباتك وشطارتك 🌟</span>
            </div>

            <button
              onClick={() => setCelebrating(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-95"
            >
              شكراً، كمل باقي اليوم 🚀
            </button>
          </div>
        </div>
      )}

      {/* Top Banner: Day details & quick day navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900">
                واجبات يوم {ARABIC_DAY_NAMES[selectedDay]} ({selectedDay})
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 font-bold border border-indigo-200">
                {currentClass} • الأسبوع {currentWeek}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              معروض هنا واجبات هذا اليوم فقط كما وردت بالخطة الأسبوعية المعتمدة
            </p>
          </div>

          {/* Today completion status pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>الإنجاز لليوم: </span>
              <strong className="text-emerald-700 font-black">{completedTodayCount}</strong>
              <span className="text-slate-400">/</span>
              <span>{totalTodayCount}</span>
            </div>
          </div>
        </div>

        {/* Quick Days Selector Bar for easy jumping between days right here */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">اختر اليوم:</span>
          {SCHOOL_DAYS.map((d) => {
            const isSelected = selectedDay === d.id;
            const count = homeworkList.filter(
              (h) =>
                h.classId === currentClass &&
                h.assignedDay === d.id &&
                (h.week === currentWeek || (!h.week && currentWeek === 1))
            ).length;

            return (
              <button
                key={d.id}
                onClick={() => onSelectDay && onSelectDay(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>يوم {d.ar}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Homework of the Selected Day ONLY */}
      {selectedDay === 'Saturday' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
            <Smile className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            يوم السبت عطلة أسبوعية (Weekend)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            لا توجد واجبات مقررة يوم السبت. اختاري أي يوم دراسي من شريط الأيام بالأعلى لمشاهدة واجباته.
          </p>
        </div>
      ) : dayHomework.length === 0 ? (
        /* Empty State for days without homework */
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center shadow-2xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            🎉
          </div>
          <h3 className="text-base font-black text-slate-900">
            لا يوجد واجب مقرر ليوم {ARABIC_DAY_NAMES[selectedDay]} في الخطة الأسبوعية
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            استمتع بوقتك في مراجعة الدروس أو الاستراحة! الواجبات مقررة في أيامها المحددة بالجدول.
          </p>
        </div>
      ) : (
        /* The Homework Cards */
        <div className="space-y-3">
          {dayHomework.map((hw) => {
            const meta = SUBJECT_METADATA[hw.subject];

            return (
              <div
                key={hw.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs space-y-3.5 ${
                  hw.completed
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                {/* Header of the Homework: Day + Subject + Due Date Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  {/* Left: Subject with colorful icon & Arabic name */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border shadow-2xs ${
                        meta?.badgeBg || 'bg-slate-100 text-slate-900 border-slate-300'
                      }`}
                    >
                      <SubjectIcon subject={hw.subject} className="w-4 h-4 shrink-0" />
                      <span>{hw.subject}</span>
                      <span className="opacity-75 text-[11px]">• {meta?.arabicName}</span>
                    </div>

                    <span className="text-xs font-bold text-slate-500">
                      يوم {ARABIC_DAY_NAMES[hw.assignedDay]} ({hw.assignedDay})
                    </span>
                  </div>

                  {/* Right: Due Date Badge (ميعاد تسليمه امتى) */}
                  {hw.dueDay && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-50 text-amber-950 border border-amber-200 px-3 py-1 rounded-xl shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>ميعاد التسليم: يوم {ARABIC_DAY_NAMES[hw.dueDay] || hw.dueDay}</span>
                    </div>
                  )}
                </div>

                {/* Body of the Homework: الهوم ورك بتاعي إيه */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      المطلوب في الواجب:
                    </span>
                    <p
                      className={`text-sm sm:text-base font-black leading-snug ${
                        hw.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {hw.task}
                    </p>
                  </div>

                  {/* Reference / Pages / Required Book */}
                  {hw.pages && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-indigo-950 font-black bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-200">
                      <span>الكتاب / الصفحات:</span>
                      <span className="text-indigo-700 underline underline-offset-2">{hw.pages}</span>
                    </div>
                  )}

                  {/* Detailed explanation if any */}
                  {hw.details && hw.details !== hw.task && (
                    <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      {hw.details}
                    </p>
                  )}

                  {/* Activity / Resource Link if available */}
                  {hw.linkUrl && (
                    <div className="pt-1">
                      <a
                        href={hw.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                        <span>فتح رابط الواجب / النشاط</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Big Cheerful Button: Done / تم الإنجاز with Celebratory Action */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {hw.completed ? (
                      <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>برافو! الواجب مكتمل ومحفوظ</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        اضغط على الزرار عند الانتهاء من الحل 👈
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDoneClick(hw)}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 active:scale-95 ${
                      hw.completed
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-md'
                    }`}
                  >
                    {hw.completed ? (
                      <>
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                        <span>إلغاء التحديد</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم الإنجاز 🎉</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
