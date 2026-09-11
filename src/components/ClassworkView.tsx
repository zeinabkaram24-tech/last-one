import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  Clock,
  User,
  Coffee,
  Utensils,
  BookOpen,
  CheckCheck,
} from 'lucide-react';
import { ClassId, SchoolDay, ClassworkEntry, SubjectName } from '../types';
import { CLASS_TIMETABLES, SUBJECT_METADATA } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface ClassworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  classworkList: ClassworkEntry[];
  onToggleClasswork: (id: string) => void;
  onSaveClasswork: (entry: ClassworkEntry) => void;
}

export const ClassworkView: React.FC<ClassworkViewProps> = ({
  currentClass,
  selectedDay,
  classworkList,
  onToggleClasswork,
  onSaveClasswork,
}) => {
  const timetablePeriods = CLASS_TIMETABLES[currentClass][selectedDay] || [];

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
      (c) => c.classId === currentClass && c.day === selectedDay && c.period === editingPeriod
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
    };

    onSaveClasswork(newEntry);
    setEditingPeriod(null);
  };

  // Stats for the day
  const dayClassworks = classworkList.filter(
    (c) => c.classId === currentClass && c.day === selectedDay
  );
  const completedCount = dayClassworks.filter((c) => c.completed).length;
  const progressPercent = dayClassworks.length > 0 ? Math.round((completedCount / dayClassworks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentClass}
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Classwork for {selectedDay}
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Official 8-period timetable with daily lesson plans, student book pages & exercises.
          </p>
        </div>

        {/* Daily progress counter */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lessons Completed
            </div>
            <div className="text-base font-bold text-slate-800">
              {completedCount} of {dayClassworks.length} completed
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 bg-white shadow-2xs">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Assembly line banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-amber-900 text-xs font-medium">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span><strong>7:30 - 7:45 AM:</strong> Morning Line & National Anthem (طابور الصباح)</span>
        </div>
        <span className="hidden sm:inline text-amber-700 text-[11px]">School starts promptly</span>
      </div>

      {/* Timetable Period Cards with Breaks */}
      <div className="space-y-3">
        {timetablePeriods.map((slot, index) => {
          const meta = SUBJECT_METADATA[slot.subject];
          const cwEntry = classworkList.find(
            (c) => c.classId === currentClass && c.day === selectedDay && c.period === slot.period
          );

          return (
            <React.Fragment key={slot.period}>
              {/* Period Card */}
              <div
                className={`group bg-white rounded-xl border transition-all p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  cwEntry?.completed
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-indigo-200 hover:shadow-xs'
                }`}
              >
                {/* Left: Period & Subject badge */}
                <div className="flex items-start sm:items-center gap-3 min-w-[240px]">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Period</span>
                    <span className="text-base font-extrabold text-slate-800">{slot.period}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border ${meta?.badgeBg || 'bg-slate-100 text-slate-800 border-slate-200'}`}
                      >
                        <SubjectIcon subject={slot.subject} className="w-3.5 h-3.5" />
                        <span>{slot.subject}</span>
                      </span>
                      <span className="text-xs text-slate-400 font-medium">({meta?.arabicName})</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.time}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {slot.teacher}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Classwork content */}
                <div className="flex-1 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {cwEntry ? (
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            cwEntry.completed ? 'text-slate-500 line-through' : 'text-slate-800'
                          }`}
                        >
                          {cwEntry.title}
                        </h4>
                        {cwEntry.pages && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-indigo-700 border border-indigo-100 whitespace-nowrap shrink-0">
                            📖 {cwEntry.pages}
                          </span>
                        )}
                      </div>
                      {cwEntry.details && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {cwEntry.details}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                      <span className="italic">No specific classwork entered yet for this period.</span>
                      <button
                        onClick={() => openEdit(slot.period, slot.subject)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Lesson Note
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Actions (Check completion & Edit) */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {cwEntry && (
                    <button
                      onClick={() => onToggleClasswork(cwEntry.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        cwEntry.completed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cwEntry.completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-slate-400" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => openEdit(slot.period, slot.subject, cwEntry)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Classwork"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Breakfast break after Period 2 */}
              {slot.period === 2 && (
                <div className="bg-emerald-50/70 border border-dashed border-emerald-300 rounded-xl px-4 py-2.5 flex items-center justify-between text-emerald-900 text-xs font-semibold my-2">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-emerald-600" />
                    <span>9:25 - 9:45 AM: Breakfast Break (فسحة الإفطار)</span>
                  </div>
                  <span className="text-emerald-700 text-[11px]">20 Minutes Snack & Play</span>
                </div>
              )}

              {/* Lunch break after Period 6 */}
              {slot.period === 6 && (
                <div className="bg-blue-50/70 border border-dashed border-blue-300 rounded-xl px-4 py-2.5 flex items-center justify-between text-blue-900 text-xs font-semibold my-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-blue-600" />
                    <span>13:05 - 13:25 PM: Lunch Break (فسحة الغداء والراحة)</span>
                  </div>
                  <span className="text-blue-700 text-[11px]">20 Minutes Meal & Refresh</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Edit Classwork Modal */}
      {editingPeriod !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Edit Period {editingPeriod} Classwork
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedDay} • {editSubject} • {currentClass}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lesson Title / Topic
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Place Value & 2-Digit Addition"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Book Pages / Material References
                </label>
                <input
                  type="text"
                  value={editPages}
                  onChange={(e) => setEditPages(e.target.value)}
                  placeholder="e.g. Student Book p. 24 - 26"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  placeholder="e.g. Solve exercises 1 to 4 on board, check mental math strategies..."
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingPeriod(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Save Lesson Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
