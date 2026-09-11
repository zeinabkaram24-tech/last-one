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
import { ClassId, SchoolDay, ClassworkEntry, SubjectName, HomeworkEntry } from '../types';
import { CLASS_TIMETABLES, SUBJECT_METADATA } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface ClassworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  classworkList: ClassworkEntry[];
  homeworkList?: HomeworkEntry[];
  onToggleClasswork: (id: string) => void;
  onSaveClasswork: (entry: ClassworkEntry) => void;
}

export const ClassworkView: React.FC<ClassworkViewProps> = ({
  currentClass,
  selectedDay,
  classworkList,
  homeworkList = [],
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

      {/* Timetable Period Cards */}
      <div className="space-y-2.5">
        {timetablePeriods.map((slot, index) => {
          const meta = SUBJECT_METADATA[slot.subject];
          const cwEntry = classworkList.find(
            (c) => c.classId === currentClass && c.day === selectedDay && c.period === slot.period
          );

          return (
            <React.Fragment key={slot.period}>
              {/* Period Card */}
              <div
                className={`group bg-white rounded-xl border transition-all p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs ${
                  cwEntry?.completed
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                {/* Left: Period & Subject badge */}
                <div className="flex items-start sm:items-center gap-2.5 min-w-[220px]">
                  <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 shrink-0">
                    <span className="text-[9px] uppercase font-black text-slate-600">P</span>
                    <span className="text-sm font-black text-slate-950 leading-none">{slot.period}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-black border ${meta?.badgeBg || 'bg-slate-100 text-slate-950 border-slate-300'}`}
                      >
                        <SubjectIcon subject={slot.subject} className="w-3.5 h-3.5" />
                        <span>{slot.subject}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mt-1 text-xs">
                      <span className="flex items-center gap-1 font-bold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {slot.time}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {slot.teacher}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Classwork content */}
                <div className="flex-1 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
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
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white text-indigo-900 border border-indigo-200 whitespace-nowrap shrink-0">
                            📖 {cwEntry.pages}
                          </span>
                        )}
                      </div>
                      {cwEntry.details && (
                        <p className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">
                          {cwEntry.details}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500 py-0.5">
                      <span className="italic font-medium">Standard curriculum plan for this period.</span>
                      <button
                        onClick={() => openEdit(slot.period, slot.subject)}
                        className="text-indigo-700 hover:text-indigo-900 font-bold inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Lesson Note
                      </button>
                    </div>
                  )}

                  {/* Period Homework Tags: Assigned Today or Due Today */}
                  {(() => {
                    const assignedHw = homeworkList.filter(
                      (h) => h.classId === currentClass && h.assignedDay === selectedDay && h.subject === slot.subject
                    );
                    const dueHw = homeworkList.filter(
                      (h) => h.classId === currentClass && h.dueDay === selectedDay && h.subject === slot.subject
                    );

                    if (assignedHw.length === 0 && dueHw.length === 0) return null;

                    return (
                      <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5">
                        {assignedHw.map((hw) => (
                          <div
                            key={hw.id}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-950 border border-amber-300 text-[11px] font-medium"
                          >
                            <span className="font-bold text-amber-900">📝 Assigned:</span>
                            <span className="font-black text-slate-900 max-w-[200px] truncate">{hw.task}</span>
                            <span className="bg-amber-200/90 text-amber-950 px-1.5 py-0.2 rounded font-black text-[10px]">
                              Due: {hw.dueDay}
                            </span>
                          </div>
                        ))}

                        {dueHw.map((hw) => (
                          <div
                            key={hw.id}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-950 border border-indigo-300 text-[11px] font-medium"
                          >
                            <span className="font-bold text-indigo-900">📥 Due Today:</span>
                            <span className="font-black text-slate-900 max-w-[200px] truncate">{hw.task}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Right: Actions (Check completion & Edit) */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {cwEntry && (
                    <button
                      onClick={() => onToggleClasswork(cwEntry.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        cwEntry.completed
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cwEntry.completed ? (
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
                  )}

                  <button
                    onClick={() => openEdit(slot.period, slot.subject, cwEntry)}
                    className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
                    title="Edit Classwork"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lunch break after Period 6 */}
              {slot.period === 6 && (
                <div className="bg-blue-50/70 border border-dashed border-blue-300 rounded-xl px-4 py-2 flex items-center justify-between text-blue-950 text-xs font-bold my-1.5">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-blue-700" />
                    <span>13:05 - 13:25 PM: Lunch Break (20 min)</span>
                  </div>
                  <span className="text-blue-800 text-[11px] font-semibold">Meal & Refresh</span>
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
