import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCheck,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ClassId, HomeworkEntry, SchoolDay, SubjectName } from '../types';
import { SUBJECT_METADATA, SCHOOL_DAYS } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface HomeworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  homeworkList: HomeworkEntry[];
  onToggleHomework: (id: string) => void;
  onAddHomework: (entry: HomeworkEntry) => void;
  onDeleteHomework: (id: string) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  onToggleHomework,
  onAddHomework,
  onDeleteHomework,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'urgent' | 'completed'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New HW form state
  const [newSubject, setNewSubject] = useState<SubjectName>('Mathematics');
  const [newTask, setNewTask] = useState('');
  const [newPages, setNewPages] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newAssignedDay, setNewAssignedDay] = useState<SchoolDay>(selectedDay);
  const [newDueDay, setNewDueDay] = useState<SchoolDay>(
    selectedDay === 'Thursday' ? 'Sunday' : 'Monday'
  );
  const [newPriority, setNewPriority] = useState<'normal' | 'urgent'>('normal');

  const classHomework = homeworkList.filter((h) => h.classId === currentClass);

  const pendingList = classHomework.filter((h) => !h.completed);
  const completedList = classHomework.filter((h) => h.completed);
  const urgentList = pendingList.filter((h) => h.priority === 'urgent');

  // Filtered display
  const displayedHomework = classHomework.filter((h) => {
    if (filterMode === 'pending') return !h.completed;
    if (filterMode === 'urgent') return !h.completed && h.priority === 'urgent';
    if (filterMode === 'completed') return h.completed;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const newHw: HomeworkEntry = {
      id: `hw-${Date.now()}`,
      classId: currentClass,
      subject: newSubject,
      task: newTask.trim(),
      pages: newPages.trim() || undefined,
      details: newDetails.trim() || undefined,
      assignedDay: newAssignedDay,
      dueDay: newDueDay,
      priority: newPriority,
      completed: false,
    };

    onAddHomework(newHw);
    setNewTask('');
    setNewPages('');
    setNewDetails('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentClass}
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Homework & Assignments Tracker
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track exercises, reading tasks, workbooks, and due dates across the school week.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterMode('all')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterMode === 'all'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500">Total Assignments</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{classHomework.length}</div>
        </button>

        <button
          onClick={() => setFilterMode('pending')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterMode === 'pending'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-amber-700">To Do (Pending)</span>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingList.length}</div>
        </button>

        <button
          onClick={() => setFilterMode('urgent')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterMode === 'urgent'
              ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-rose-700">Urgent / Quizzes</span>
          <div className="text-2xl font-black text-rose-800 mt-1">{urgentList.length}</div>
        </button>

        <button
          onClick={() => setFilterMode('completed')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterMode === 'completed'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-emerald-700">Completed</span>
          <div className="text-2xl font-black text-emerald-900 mt-1">{completedList.length}</div>
        </button>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-3">
        {displayedHomework.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
            <CheckCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No homework in this view!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All tasks are completed or there are no assignments under this filter.
            </p>
          </div>
        ) : (
          displayedHomework.map((hw) => {
            const meta = SUBJECT_METADATA[hw.subject];
            return (
              <div
                key={hw.id}
                className={`bg-white rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  hw.completed
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                    : hw.priority === 'urgent'
                    ? 'border-rose-200 hover:border-rose-300 hover:shadow-xs'
                    : 'border-slate-200 hover:border-indigo-200 hover:shadow-xs'
                }`}
              >
                {/* Left: Checkbox & Task Info */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => onToggleHomework(hw.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={hw.completed ? 'Mark as incomplete' : 'Mark as done'}
                  >
                    {hw.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border ${meta?.badgeBg || 'bg-slate-100 text-slate-800 border-slate-200'}`}
                      >
                        <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                        <span>{hw.subject}</span>
                      </span>

                      {hw.priority === 'urgent' && !hw.completed && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          Urgent / Exam
                        </span>
                      )}

                      {hw.pages && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          📖 {hw.pages}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-semibold ${
                        hw.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}
                    >
                      {hw.task}
                    </h4>

                    {hw.details && (
                      <p className="text-xs text-slate-500 leading-relaxed">{hw.details}</p>
                    )}
                  </div>
                </div>

                {/* Right: Due Date & Delete Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Due By</div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-700">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{hw.dueDay}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteHomework(hw.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete homework"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Homework Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Assignment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Create a homework task with due date for {currentClass}
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectName)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.keys(SUBJECT_METADATA).map((s) => (
                      <option key={s} value={s}>
                        {s} ({SUBJECT_METADATA[s as SubjectName].arabicName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent / Quiz / Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Homework Task Description *
                </label>
                <input
                  type="text"
                  required
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="e.g. Workbook page 15, exercises 1 to 6"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Day
                  </label>
                  <select
                    value={newAssignedDay}
                    onChange={(e) => setNewAssignedDay(e.target.value as SchoolDay)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {SCHOOL_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Day *
                  </label>
                  <select
                    value={newDueDay}
                    onChange={(e) => setNewDueDay(e.target.value as SchoolDay)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {SCHOOL_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Page Reference
                  </label>
                  <input
                    type="text"
                    value={newPages}
                    onChange={(e) => setNewPages(e.target.value)}
                    placeholder="p. 15"
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="e.g. Write with neat handwriting in blue pen, draw margin..."
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
