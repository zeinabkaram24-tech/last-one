import React from 'react';
import {
  CheckCircle2,
  Circle,
  User,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { ClassId, SchoolDay, ClassworkEntry, SubjectName } from '../types';
import { CLASS_TIMETABLES, SUBJECT_METADATA } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';
import { triggerDoneCelebration } from '../utils/celebrate';
import { getSubjectTheme } from '../data/subjectThemes';

interface ClassworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  classworkList: ClassworkEntry[];
  currentBlock?: number;
  currentWeek?: number;
  onToggleClasswork: (id: string) => void;
  onSaveClasswork?: (entry: ClassworkEntry) => void;
}

export const ClassworkView: React.FC<ClassworkViewProps> = ({
  currentClass,
  selectedDay,
  classworkList,
  currentBlock = 1,
  currentWeek = 2,
  onToggleClasswork,
}) => {
  // Check if current class has ANY weekly plan entered for this Block and Week
  const hasPlanForWeek = classworkList.some(
    (c) =>
      (c.classId === currentClass || (c.classId as any) === 'ALL') &&
      (c.block || 1) === currentBlock &&
      (c.week || 1) === currentWeek
  );

  // Filter to subjects with weekly plans (Arabic, French, Mathematics, Social Studies, English, ICT, Science)
  const rawTimetablePeriods = (CLASS_TIMETABLES[currentClass][selectedDay] || []).filter(
    (s) =>
      s.subject === 'Arabic' ||
      s.subject === 'French' ||
      s.subject === 'Mathematics' ||
      s.subject === 'Social Studies' ||
      s.subject === 'English' ||
      s.subject === 'ICT' ||
      s.subject === 'Science'
  );

  // Group repeated periods (especially English or Mathematics) so they appear once only
  interface GroupedPeriodSlot {
    slotId: string;
    periods: number[];
    periodLabel: string;
    time: string;
    subject: SubjectName;
    teacher: string;
    notes?: string;
    cwEntry?: ClassworkEntry;
  }

  const timetablePeriods: GroupedPeriodSlot[] = [];
  for (const slot of rawTimetablePeriods) {
    const last = timetablePeriods[timetablePeriods.length - 1];
    if (last && last.subject === slot.subject && (slot.subject === 'English' || slot.subject === 'Mathematics')) {
      last.periods.push(slot.period);
      const startTime = last.time.split(' - ')[0];
      const endTime = slot.time.split(' - ')[1] || slot.time;
      last.time = `${startTime} - ${endTime}`;
      last.periodLabel = last.periods.map((p) => `P${p}`).join(' & ');
      last.slotId = `tt-${selectedDay}-${last.periodLabel}-${last.subject}-${last.periods.join('_')}`;
    } else {
      timetablePeriods.push({
        slotId: `tt-${selectedDay}-P${slot.period}-${slot.subject}-${slot.period}`,
        periods: [slot.period],
        periodLabel: `P${slot.period}`,
        time: slot.time,
        subject: slot.subject,
        teacher: slot.teacher,
        notes: slot.notes,
      });
    }
  }

  // Helper to find valid classwork entry with actual educational content
  const getCwEntryForSlot = (slot: GroupedPeriodSlot): ClassworkEntry | undefined => {
    if (slot.cwEntry) return slot.cwEntry;
    return (
      classworkList.find(
        (c) =>
          (c.classId === currentClass || (c.classId as any) === 'ALL') &&
          c.day === selectedDay &&
          slot.periods.includes(c.period) &&
          (c.block || 1) === currentBlock &&
          (c.week || 1) === currentWeek &&
          Boolean(c.title && c.title.trim().length > 0 && !/^(none|لا يوجد|\-|\/|n\/a|لم يتم إدخال|بدون عنوان)$/i.test(c.title.trim()))
      ) ||
      classworkList.find(
        (c) =>
          (c.classId === currentClass || (c.classId as any) === 'ALL') &&
          c.day === selectedDay &&
          c.subject === slot.subject &&
          (c.block || 1) === currentBlock &&
          (c.week || 1) === currentWeek &&
          Boolean(c.title && c.title.trim().length > 0 && !/^(none|لا يوجد|\-|\/|n\/a|لم يتم إدخال|بدون عنوان)$/i.test(c.title.trim()))
      )
    );
  };

  // Collect all valid educational classwork items for this class, day, block, and week
  const dayClasswork = classworkList.filter(
    (c) =>
      (c.classId === currentClass || (c.classId as any) === 'ALL') &&
      c.day === selectedDay &&
      (c.block || 1) === currentBlock &&
      (c.week || 1) === currentWeek &&
      Boolean(c.title && c.title.trim().length > 0 && !/^(none|لا يوجد|\-|\/|n\/a|لم يتم إدخال|بدون عنوان)$/i.test(c.title.trim()))
  );

  // Deduplicate entries by ID to protect against any data-level duplicates
  const uniqueClassworkMap = new Map<string, ClassworkEntry>();
  dayClasswork.forEach((c) => {
    if (!uniqueClassworkMap.has(c.id)) {
      uniqueClassworkMap.set(c.id, c);
    }
  });
  const availableClasswork = Array.from(uniqueClassworkMap.values());

  // STRICT USER RULE: Only display periods that actually have educational content in the weekly plan!
  // "اتفقنا قبل كده ان الحصص اللي ما يتذكرلهاش أي بيانات أو ما يبقاش ليها ويكلابان ما تنزلش، الحاجات اللي ليها محتوى بس هي اللي تنزل في الكلاس وورك."
  // 1-to-1 matching to prevent duplicate card claims across timetable periods
  const matchedCwIds = new Set<string>();
  const activeTimetablePeriods: GroupedPeriodSlot[] = [];

  for (const slot of timetablePeriods) {
    // 1. Match by exact period AND subject
    let matched = availableClasswork.find(
      (c) => !matchedCwIds.has(c.id) && c.subject === slot.subject && slot.periods.includes(c.period)
    );

    // 2. If no exact period match for this subject, match by subject only
    if (!matched) {
      matched = availableClasswork.find(
        (c) => !matchedCwIds.has(c.id) && c.subject === slot.subject
      );
    }

    if (matched) {
      matchedCwIds.add(matched.id);
      activeTimetablePeriods.push({
        ...slot,
        slotId: `active-tt-${selectedDay}-${slot.periodLabel}-${slot.subject}-${matched.id}`,
        cwEntry: matched,
      });
    }
  }

  // Also include any standalone custom classwork entries for this class/day/block/week that weren't in standard timetable
  const additionalCustomEntries = availableClasswork.filter((c) => !matchedCwIds.has(c.id));
  const additionalSlots: GroupedPeriodSlot[] = additionalCustomEntries.map((c, i) => ({
    slotId: `custom-${selectedDay}-${c.id || i}`,
    periods: [c.period || 1],
    periodLabel: `P${c.period || 1}`,
    time: 'الحصة الصفية',
    subject: c.subject,
    teacher: 'معلم المادة',
    cwEntry: c,
  }));

  const visibleSlots = [...activeTimetablePeriods, ...additionalSlots];

  // Stats for the day based on visible cards
  const completedCount = visibleSlots.filter((slot) => (slot.cwEntry || getCwEntryForSlot(slot))?.completed).length;
  const totalCount = visibleSlots.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // If this entire week has no plan entered, render clean empty state
  if (!hasPlanForWeek) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-800">
          لا توجد خطة أسبوعية مسجلة لهذا الأسبوع
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          الأسبوع المحدد (Block {currentBlock} - Week {currentWeek}) فارغ حالياً ولم يتم إدخال أو رفع أي خطة دراسية له بعد.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timetable Period Cards or Weekend / Empty Day Message */}
      {visibleSlots.length === 0 ? (
        selectedDay === 'Saturday' ? (
          <div
            id="saturday-prep-card"
            className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 max-w-xl mx-auto shadow-sm text-right"
            dir="rtl"
          >
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-start gap-2">
              <span className="text-xl">📌</span>
              <span>يُخصص يوم السبت للتجهيز والتحضير الأسبوعي:</span>
            </h3>

            {/* Blue accent divider */}
            <div className="h-[2.5px] bg-blue-600 rounded-full my-4 sm:my-5" />

            <div className="space-y-3 sm:space-y-3.5">
              {/* Item 1: Tomorrow */}
              <div className="bg-indigo-50/60 border-e-4 border-e-blue-600 rounded-xl p-3.5 sm:p-4 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                <span className="text-slate-900 text-base leading-none">•</span>
                <span className="text-blue-600 font-extrabold" dir="ltr">
                  (Tomorrow):
                </span>
                <span>لتجهيز حقيبة يوم الأحد.</span>
              </div>

              {/* Item 2: Homework */}
              <div className="bg-indigo-50/60 border-e-4 border-e-blue-600 rounded-xl p-3.5 sm:p-4 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                <span className="text-slate-900 text-base leading-none">•</span>
                <span className="text-blue-600 font-extrabold" dir="ltr">
                  (Homework):
                </span>
                <span>لتجهيز الاختبارات والكويزات.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              لا توجد حصص مسجلة بالخطة الأسبوعية لهذا اليوم ({selectedDay})
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
              يقتصر العرض فقط على الحصص التي لها محتوى أو بيانات مسجلة في الخطة الأسبوعية (الكلاس وورك).
            </p>
          </div>
        )
      ) : (
        <div className="space-y-2.5">
          {visibleSlots.map((slot, idx) => {
            const isFrench = slot.subject === 'French';
            const meta = SUBJECT_METADATA[slot.subject];
            const theme = getSubjectTheme(slot.subject);
            const cwEntry = slot.cwEntry || getCwEntryForSlot(slot);

            const activeLinkUrl = cwEntry?.linkUrl;
            const activeLinkTitle = cwEntry?.linkTitle || 'رابط الدرس 🔗';

            const handleToggleLesson = () => {
              if (cwEntry) {
                if (!cwEntry.completed) {
                  triggerDoneCelebration();
                }
                onToggleClasswork(cwEntry.id);
              }
            };

            return (
              <React.Fragment key={cwEntry?.id || slot.slotId}>
                {/* Period Card */}
              <div
                className={`group rounded-2xl border transition-all p-3 sm:p-3.5 space-y-3 shadow-2xs ${
                  cwEntry?.completed
                    ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                    : `${theme.cwCard} shadow-xs`
                }`}
              >
                {/* 3 Equal-Width Boxes in a row: Period, Subject, Teacher */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full items-stretch">
                  {/* Box 1: رقم الحصة */}
                  <div
                    className={`${
                      cwEntry?.completed ? 'bg-emerald-700 text-white' : theme.cwPeriodBox
                    } font-black py-2 px-2 rounded-xl flex items-center justify-center text-center shadow-2xs transition-colors`}
                  >
                    <span className="text-xs sm:text-sm font-black tracking-tight">{slot.periodLabel}</span>
                  </div>

                  {/* Box 2: اسم المادة */}
                  <div
                    className={`border font-black text-xs sm:text-sm py-2 px-2 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-center truncate transition-colors ${
                      cwEntry?.completed
                        ? 'bg-white/95 text-emerald-950 border-emerald-300 shadow-2xs'
                        : theme.cwSubjectBox
                    }`}
                  >
                    <SubjectIcon subject={slot.subject} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{slot.subject}</span>
                  </div>

                  {/* Box 3: اسم المدرس */}
                  <div
                    className={`border font-bold text-xs sm:text-sm py-2 px-2 rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-center truncate transition-colors ${
                      cwEntry?.completed
                        ? 'bg-white/95 border-emerald-200 text-slate-800 shadow-2xs'
                        : theme.cwTeacherBox
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{slot.teacher}</span>
                  </div>
                </div>

                {/* Center: Classwork content & actions */}
                <div
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border transition-all ${
                    cwEntry?.completed
                      ? 'bg-white/95 border-emerald-200/80 shadow-2xs'
                      : theme.cwContentBox
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    {cwEntry ? (
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm font-black ${
                              cwEntry.completed ? 'text-slate-500 line-through' : 'text-slate-950'
                            }`}
                          >
                            {cwEntry.title}
                          </h4>
                          {cwEntry.pages && (
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border whitespace-nowrap shrink-0 ${
                                cwEntry.completed
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                  : theme.cwPageBadge
                              }`}
                            >
                              📖 {cwEntry.pages}
                            </span>
                          )}
                        </div>
                        {cwEntry.details && (
                          <p className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">
                            {cwEntry.details}
                          </p>
                        )}
                        {activeLinkUrl && (
                          <div className="pt-2">
                            <a
                              href={activeLinkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all shadow-2xs ${
                                isFrench
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-700'
                                  : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                              }`}
                            >
                              <ExternalLink className={`w-3.5 h-3.5 ${isFrench ? 'text-white' : 'text-blue-700'}`} />
                              <span>{activeLinkTitle}</span>
                              {isFrench && <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Kahoot 🎯</span>}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 py-0.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="italic font-normal">
                            لا توجد تفاصيل مسجلة لهذه الحصة في الخطة
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions (Check completion) */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleToggleLesson}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        cwEntry?.completed
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-2xs'
                      }`}
                    >
                      {cwEntry?.completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-slate-400" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      )}
    </div>
  );
};
