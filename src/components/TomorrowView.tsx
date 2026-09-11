import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  User,
  Coffee,
  Utensils,
  Sparkles,
  Printer,
  Calendar,
  CheckSquare,
  PackageCheck,
  ChevronRight,
  Pin,
} from 'lucide-react';
import { ClassId, SchoolDay, HomeworkEntry } from '../types';
import {
  CLASS_TIMETABLES,
  NEXT_SCHOOL_DAY,
  SUBJECT_METADATA,
  SCHOOL_DAYS,
} from '../data/timetables';
import { SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { SubjectIcon } from './SubjectIcon';

interface TomorrowViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay; // The reference today
  homeworkList: HomeworkEntry[];
  onToggleHomework: (id: string) => void;
  onPrint: () => void;
}

export const TomorrowView: React.FC<TomorrowViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  onToggleHomework,
  onPrint,
}) => {
  // Target tomorrow day based on selectedDay
  const tomorrowDay = NEXT_SCHOOL_DAY[selectedDay];

  // Packed items interactive checklist state (saved locally in session)
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

  const togglePacked = (itemKey: string) => {
    setPackedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  // Tomorrow's timetable periods
  const tomorrowPeriods = CLASS_TIMETABLES[currentClass][tomorrowDay] || [];

  // Homework due tomorrow
  const dueHomework = homeworkList.filter(
    (h) => h.classId === currentClass && h.dueDay === tomorrowDay
  );
  const pendingDueHomework = dueHomework.filter((h) => !h.completed);

  // Derive unique required bag items based on tomorrow's subjects
  const subjectBagItemsMap = new Map<string, { subject: string; items: string[] }>();
  for (const slot of tomorrowPeriods) {
    const meta = SUBJECT_METADATA[slot.subject];
    if (meta && !subjectBagItemsMap.has(slot.subject)) {
      subjectBagItemsMap.set(slot.subject, {
        subject: slot.subject,
        items: meta.standardBagItems,
      });
    }
  }

  // Teacher special instructions and notes from Block 1 Week 1 plan
  const tomorrowSpecialNotes = SPECIAL_TEACHER_NOTES.filter(
    (n) => n.classId === currentClass && n.targetDay === tomorrowDay
  );

  // Daily universal bag essentials
  const universalEssentials = [
    'Pencil case with sharpened pencils, eraser, ruler, and glue',
    'Healthy breakfast box & snack (for 9:25 AM break)',
    'Water bottle (filled)',
    'Nile Egyptian International School ID card / Bus badge',
  ];

  // Calculate total packing progress
  let totalPackItems = universalEssentials.length;
  let packedCount = 0;

  universalEssentials.forEach((item, idx) => {
    if (packedItems[`essential-${idx}`]) packedCount++;
  });

  tomorrowSpecialNotes.forEach((sn, idx) => {
    if (sn.bagItem) {
      totalPackItems++;
      if (packedItems[`special-note-${idx}`]) packedCount++;
    }
  });

  Array.from(subjectBagItemsMap.values()).forEach((grp) => {
    grp.items.forEach((it, idx) => {
      totalPackItems++;
      if (packedItems[`subject-${grp.subject}-${idx}`]) packedCount++;
    });
  });

  const packProgressPercent =
    totalPackItems > 0 ? Math.round((packedCount / totalPackItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header card with Tomorrow info */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Evening Bag & Prep Routine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white">
              {currentClass}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            Preparing for Tomorrow: <span className="text-amber-400">{tomorrowDay}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Check off your school bag essentials, verify homework due tomorrow morning, and review
            tomorrow's 8 periods.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-300">
              Bag Packing
            </div>
            <div className="text-xl font-black text-white">
              {packedCount} / {totalPackItems} items
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400/30 flex items-center justify-center font-bold text-xs text-emerald-300 bg-emerald-950/40">
            {packProgressPercent}%
          </div>
        </div>
      </div>

      {/* Alert if there is pending homework due tomorrow! */}
      {pendingDueHomework.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Action Required: {pendingDueHomework.length} Homework assignment(s) due tomorrow!
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Complete and place inside the school bag before tomorrow morning:
              </p>
              <ul className="mt-2 space-y-1">
                {pendingDueHomework.map((hw) => (
                  <li key={hw.id} className="text-xs font-semibold text-rose-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    <strong>{hw.subject}:</strong> {hw.task}
                    {hw.pages && <span className="font-normal">({hw.pages})</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="self-end sm:self-center shrink-0">
            <button
              onClick={() => {
                pendingDueHomework.forEach((h) => onToggleHomework(h.id));
              }}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
            >
              Mark All Done & Packed
            </button>
          </div>
        </div>
      )}

      {/* Teacher Special Instructions & Notes for Tomorrow */}
      {tomorrowSpecialNotes.length > 0 && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Pin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Teacher Notes & Special Preparation for {tomorrowDay}
              </h3>
              <p className="text-xs text-amber-800">
                ملاحظات وتوجيهات المعلمين الخاصة بتجهيزات الغد (خطة الأسبوع الأول)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tomorrowSpecialNotes.map((sn, idx) => (
              <div
                key={idx}
                className="bg-white/90 p-3 rounded-xl border border-amber-200 flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900">{sn.subject}</span>
                    <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                      Notice
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                    {sn.note}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-snug dir-rtl">
                    {sn.arabicNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Tomorrow's Schedule & Tomorrow's Bag Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Bag Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    School Bag Packing Checklist
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-generated from {tomorrowDay}'s periods & subjects
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                {packProgressPercent === 100 ? 'Bag Ready!' : `${packedCount}/${totalPackItems} Packed`}
              </span>
            </div>

            {/* Special Teacher Requested Items (if any for tomorrow) */}
            {tomorrowSpecialNotes.filter((n) => !!n.bagItem).length > 0 && (
              <div className="mb-5 p-3.5 rounded-xl border-2 border-amber-300 bg-amber-50/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5 text-amber-600" />
                    Special Teacher Requests for {tomorrowDay}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                    تجهيزات هامة
                  </span>
                </div>
                <div className="space-y-2">
                  {tomorrowSpecialNotes
                    .filter((n) => !!n.bagItem)
                    .map((sn, idx) => {
                      const key = `special-note-${idx}`;
                      const isChecked = !!packedItems[key];
                      return (
                        <button
                          key={key}
                          onClick={() => togglePacked(key)}
                          className={`w-full text-left p-2.5 rounded-lg border flex items-center gap-3 transition-all ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-slate-400 line-through'
                              : 'bg-white border-amber-200 hover:border-amber-300 text-slate-900'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <div className="text-xs font-semibold leading-tight">
                            <span className="text-amber-800 font-bold mr-1">[{sn.subject}]</span>
                            {sn.bagItem}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Universal Essentials */}
            <div className="mb-5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Daily Essentials
              </div>
              <div className="space-y-2">
                {universalEssentials.map((item, idx) => {
                  const key = `essential-${idx}`;
                  const isChecked = !!packedItems[key];
                  return (
                    <button
                      key={key}
                      onClick={() => togglePacked(key)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                      <span className={`text-xs font-semibold ${isChecked ? 'line-through' : ''}`}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Specific Books & Materials */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Required Books & Subject Materials for {tomorrowDay}
              </div>

              {Array.from(subjectBagItemsMap.values()).map((group) => {
                const meta = SUBJECT_METADATA[group.subject as any];
                return (
                  <div
                    key={group.subject}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold border ${meta?.badgeBg || 'bg-slate-200 text-slate-800'}`}
                      >
                        <SubjectIcon subject={group.subject as any} className="w-3.5 h-3.5" />
                        <span>{group.subject}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({meta?.arabicName})
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-1">
                      {group.items.map((item, idx) => {
                        const key = `subject-${group.subject}-${idx}`;
                        const isChecked = !!packedItems[key];
                        return (
                          <button
                            key={key}
                            onClick={() => togglePacked(key)}
                            className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 text-xs transition-all ${
                              isChecked
                                ? 'bg-emerald-100/50 text-slate-400 line-through'
                                : 'hover:bg-white text-slate-700'
                            }`}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <span className="font-medium">{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Tomorrow's Schedule Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Schedule Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tomorrow's Timetable ({tomorrowDay})
                  </h3>
                  <p className="text-xs text-slate-500">Periods order 1 to 8</p>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                8 Periods
              </span>
            </div>

            {/* Period List */}
            <div className="space-y-2">
              {tomorrowPeriods.map((slot) => {
                const meta = SUBJECT_METADATA[slot.subject];
                return (
                  <div
                    key={slot.period}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200">
                        {slot.period}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-950">{slot.subject}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{slot.teacher}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {slot.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Parent & Student Reminder Box */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Night-Before Tips (Grade 2)
            </h4>
            <ul className="text-xs text-indigo-950 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Sleep early (by 8:30 PM) so the child wakes up fresh for the 7:30 AM line.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Ensure PE sportswear is washed and ready if sports class is scheduled.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Double check that pencils are sharpened and no heavy unnecessary books are carried.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
