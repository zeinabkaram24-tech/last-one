import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  User,
  BookOpen,
  ExternalLink,
  CheckSquare,
  Clock,
  Coffee,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { ClassId, SchoolDay, ClassworkEntry, SubjectName, HomeworkEntry, PeriodSlot } from '../types';
import { CLASS_TIMETABLES, SUBJECT_METADATA, PERIOD_TIMES } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface ClassworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  classworkList: ClassworkEntry[];
  homeworkList?: HomeworkEntry[];
  currentWeek?: number;
  onToggleClasswork: (id: string) => void;
  onSaveClasswork: (entry: ClassworkEntry) => void;
  onToggleHomework?: (id: string) => void;
}

export const ClassworkView: React.FC<ClassworkViewProps> = ({
  currentClass,
  selectedDay,
  classworkList,
  homeworkList = [],
  currentWeek = 2,
  onToggleClasswork,
  onSaveClasswork,
  onToggleHomework,
}) => {
  // All 8 periods for this day from official timetable
  const daySchedule = CLASS_TIMETABLES[currentClass][selectedDay] || [];

  // Edit modal state
  const [editingPeriod, setEditingPeriod] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editPages, setEditPages] = useState('');
  const [editSubject, setEditSubject] = useState<SubjectName>('English');

  const openEdit = (period: number, subject: SubjectName, existing?: ClassworkEntry) => {
    setEditingPeriod(period);
    setEditSubject(subject);
    setEditTitle(existing ? existing.title : '');
    setEditDetails(existing?.details || '');
    setEditPages(existing?.pages || '');
  };

  const handleSave = () => {
    if (editingPeriod === null) return;
    const existing = classworkList.find(
      (c) => c.classId === currentClass && c.day === selectedDay && c.period === editingPeriod && (c.week === currentWeek || !c.week)
    );

    const newEntry: ClassworkEntry = {
      id: existing ? existing.id : `cw-${currentClass}-${selectedDay}-${editingPeriod}-${Date.now()}`,
      classId: currentClass,
      day: selectedDay,
      period: editingPeriod,
      subject: editSubject,
      title: editTitle.trim() || `${editSubject} Lesson`,
      details: editDetails.trim() || undefined,
      pages: editPages.trim() || undefined,
      completed: existing ? existing.completed : false,
      week: currentWeek,
    };

    onSaveClasswork(newEntry);
    setEditingPeriod(null);
  };

  // Find slot by period number (1 to 8)
  const getSlot = (pNum: number): PeriodSlot | undefined => {
    return daySchedule.find((s) => s.period === pNum);
  };

  const p1 = getSlot(1);
  const p2 = getSlot(2);
  const p3 = getSlot(3);
  const p4 = getSlot(4);
  const p5 = getSlot(5);
  const p6 = getSlot(6);
  const p7 = getSlot(7);
  const p8 = getSlot(8);

  // Render individual period card
  const renderPeriodCard = (slot?: PeriodSlot) => {
    if (!slot) return null;

    const isFrench = slot.subject === 'French';
    const meta = SUBJECT_METADATA[slot.subject];
    const time = PERIOD_TIMES[slot.period] || '';

    const cwEntry =
      classworkList.find(
        (c) => c.classId === currentClass && c.day === selectedDay && c.period === slot.period && c.week === currentWeek
      ) ||
      classworkList.find(
        (c) => c.classId === currentClass && c.day === selectedDay && c.period === slot.period && (!c.week || c.week === 1)
      );

    // Homework assigned on this day for this subject
    const slotHomework = homeworkList.find(
      (h) =>
        h.classId === currentClass &&
        h.assignedDay === selectedDay &&
        h.subject === slot.subject &&
        (h.week === currentWeek || (!h.week && currentWeek === 1))
    );

    const activeLinkUrl =
      cwEntry?.linkUrl ||
      (isFrench
        ? 'https://kahoot.it/solo/02420827?challenge-id=7feb71cb-9cdf-43f6-888a-1a97039524af_1758279666900'
        : undefined);
    const activeLinkTitle = isFrench ? 'Compétition de français' : (cwEntry?.linkTitle || 'رابط الدرس 🔗');

    const handleToggleLesson = () => {
      if (cwEntry) {
        onToggleClasswork(cwEntry.id);
      } else {
        onSaveClasswork({
          id: `cw-${currentClass}-${selectedDay}-${slot.period}-${Date.now()}`,
          classId: currentClass,
          day: selectedDay,
          period: slot.period,
          subject: slot.subject,
          title: `${slot.subject} Lesson`,
          completed: true,
          week: currentWeek,
        });
      }
    };

    return (
      <div
        key={slot.period}
        className={`group bg-white rounded-2xl border transition-all p-3.5 sm:p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md ${
          cwEntry?.completed
            ? 'border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-200/60'
            : 'border-slate-200/90 hover:border-indigo-300'
        }`}
      >
        {/* Top bar: Period tag & Teacher name */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
            <span>Period {slot.period}</span>
            <span className="text-slate-400 font-medium text-[11px]">• {time}</span>
          </div>

          <div className="flex items-center gap-1 text-[11.5px] font-semibold text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/70 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{slot.teacher}</span>
          </div>
        </div>

        {/* Subject Box: Striking, eye-friendly color theme */}
        <div
          className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between gap-2 shadow-2xs mb-3 transition-colors ${
            meta?.badgeBg || 'bg-slate-100 text-slate-900 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-white/80 border border-white/60 flex items-center justify-center shrink-0 shadow-2xs">
              <SubjectIcon subject={slot.subject} className="w-4 h-4 shrink-0" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight truncate">
              {slot.subject}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold opacity-80 shrink-0">
            {meta?.arabicName}
          </span>
        </div>

        {/* Content area: Active Lesson from Weekly Plan or Clean Minimal State */}
        <div className="flex-1 flex flex-col justify-between">
          {cwEntry ? (
            <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/80 mb-2.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={`text-xs sm:text-sm font-bold leading-snug ${
                    cwEntry.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}
                >
                  {cwEntry.title}
                </h4>
                {cwEntry.pages && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-indigo-900 border border-indigo-200 whitespace-nowrap shrink-0">
                    📖 {cwEntry.pages}
                  </span>
                )}
              </div>

              {cwEntry.details && (
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  {cwEntry.details}
                </p>
              )}

              {activeLinkUrl && (
                <div className="pt-1">
                  <a
                    href={activeLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                      isFrench
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{activeLinkTitle}</span>
                    {isFrench && (
                      <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                        Kahoot 🎯
                      </span>
                    )}
                  </a>
                </div>
              )}
            </div>
          ) : (
            /* Clean state when no plan is imported - NO dummy template placeholder box */
            <div className="py-1 mb-2 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="text-[11px] text-slate-400">حصة دراسية معتمدة في الجدول</span>
              <button
                onClick={() => openEdit(slot.period, slot.subject)}
                className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 text-[11px] transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة ملاحظة</span>
              </button>
            </div>
          )}

          {/* Associated Homework if assigned for this period */}
          {slotHomework && (
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-2.5 mb-2.5 flex items-start justify-between gap-2 shadow-2xs">
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-amber-200/90 text-amber-950 font-black text-[10px]">
                    واجب منزلي
                  </span>
                  {slotHomework.dueDay && (
                    <span className="text-[10.5px] text-amber-900 font-bold">
                      تسليم: {slotHomework.dueDay}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs font-bold leading-snug mt-0.5 ${
                    slotHomework.completed ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {slotHomework.task}
                </p>
                {slotHomework.pages && (
                  <span className="text-[10px] text-indigo-900 font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-100 inline-block mt-0.5">
                    المطلوب: {slotHomework.pages}
                  </span>
                )}
              </div>

              <button
                onClick={() => onToggleHomework && onToggleHomework(slotHomework.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 self-center ${
                  slotHomework.completed
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs'
                }`}
              >
                {slotHomework.completed ? 'Done ✓' : 'Mark'}
              </button>
            </div>
          )}

          {/* Card footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
            <button
              onClick={handleToggleLesson}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                cwEntry?.completed
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
              }`}
            >
              {cwEntry?.completed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>تم الإنجاز</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5 text-slate-400" />
                  <span>تحديد كمكتمل</span>
                </>
              )}
            </button>

            <button
              onClick={() => openEdit(slot.period, slot.subject, cwEntry)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="تعديل الحصة"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Weekend Check: Saturday is for Prep */}
      {selectedDay === 'Saturday' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            يوم السبت مخصص للتجهيز والتحضير (Weekend Prep)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            لا توجد حصص مدرسية يوم السبت. يمكنك الانتقال إلى تبويب <strong>Tomorrow</strong> لتجهيز جدول وحقيبة يوم الأحد القادم.
          </p>
        </div>
      ) : (
        /* 2x4 Grid Structure */
        <div className="space-y-3.5">
          {/* Row 1: Period 1 & Period 2 side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {renderPeriodCard(p1)}
            {renderPeriodCard(p2)}
          </div>

          {/* Breakfast Break separator */}
          <div className="flex items-center justify-between py-1.5 px-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-amber-950 text-xs font-bold shadow-2xs">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
              <span>استراحة الإفطار (Breakfast Break)</span>
            </div>
            <span className="text-amber-800 font-semibold text-[11px] font-mono">9:25 - 9:45</span>
          </div>

          {/* Row 2: Period 3 & Period 4 side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {renderPeriodCard(p3)}
            {renderPeriodCard(p4)}
          </div>

          {/* Row 3: Period 5 & Period 6 side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {renderPeriodCard(p5)}
            {renderPeriodCard(p6)}
          </div>

          {/* Lunch Break separator */}
          <div className="flex items-center justify-between py-1.5 px-3.5 bg-blue-50/70 border border-blue-200/70 rounded-xl text-blue-950 text-xs font-bold shadow-2xs">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-blue-600 shrink-0" />
              <span>استراحة الغداء (Lunch Break)</span>
            </div>
            <span className="text-blue-800 font-semibold text-[11px] font-mono">13:05 - 13:25</span>
          </div>

          {/* Row 4: Period 7 & Period 8 side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {renderPeriodCard(p7)}
            {renderPeriodCard(p8)}
          </div>
        </div>
      )}

      {/* Edit Classwork Modal */}
      {editingPeriod !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              تعديل حصة رقم {editingPeriod} ({editSubject})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedDay} • {currentClass} • الأسبوع {currentWeek}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  عنوان الدرس / الموضوع
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="مثال: Chapter 3: Place Value & 2-Digit Addition"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الصفحات / المرجع
                </label>
                <input
                  type="text"
                  value={editPages}
                  onChange={(e) => setEditPages(e.target.value)}
                  placeholder="مثال: Student Book p. 24 - 26 أو Sheet 1"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تفاصيل أو تعليمات الحصة
                </label>
                <textarea
                  rows={3}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  placeholder="مثال: حل التدريبات على السبورة، التركيز على الجمع بالحمل..."
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingPeriod(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                حفظ بيانات الحصة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
