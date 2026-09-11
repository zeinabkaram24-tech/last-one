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
  ExternalLink,
} from 'lucide-react';
import { ClassId, SchoolDay, ClassworkEntry, SubjectName, HomeworkEntry } from '../types';
import { CLASS_TIMETABLES, SUBJECT_METADATA } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';

interface ClassworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  classworkList: ClassworkEntry[];
  homeworkList?: HomeworkEntry[];
  currentWeek?: number;
  onToggleClasswork: (id: string) => void;
  onSaveClasswork: (entry: ClassworkEntry) => void;
}

export const ClassworkView: React.FC<ClassworkViewProps> = ({
  currentClass,
  selectedDay,
  classworkList,
  homeworkList = [],
  currentWeek = 2,
  onToggleClasswork,
  onSaveClasswork,
}) => {
  // Filter strictly to Arabic and French as requested by user
  const timetablePeriods = (CLASS_TIMETABLES[currentClass][selectedDay] || []).filter(
    (s) => s.subject === 'Arabic' || s.subject === 'French'
  );

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

  // Stats for the day
  const dayClassworks = classworkList.filter(
    (c) => c.classId === currentClass && c.day === selectedDay && (c.week === currentWeek || (!c.week && currentWeek === 1))
  );
  const completedCount = dayClassworks.filter((c) => c.completed).length;
  const progressPercent = dayClassworks.length > 0 ? Math.round((completedCount / dayClassworks.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Timetable Period Cards or Weekend / Empty Day Message */}
      {timetablePeriods.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          {selectedDay === 'Saturday' ? (
            <>
              <h3 className="text-base font-black text-slate-900">
                يوم السبت مخصص للتجهيز والتحضير (Weekend Prep)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                لا توجد حصص مدرسية يوم السبت. يمكنك الانتقال إلى تبويب <strong>Tomorrow Prep</strong> لتجهيز جدول وحقيبة يوم الأحد.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-base font-black text-slate-900">
                لا توجد حصص عربي أو فرنش مقررة ليوم {selectedDay} ({currentClass})
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                تم حجب باقي المواد مؤقتاً (PE, Art, Music...) حيث يقتصر العرض حالياً على مادتي العربي والفرنش لحين إدراج خطط باقي المواد.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {timetablePeriods.map((slot) => {
            const isFrench = slot.subject === 'French';
            const meta = SUBJECT_METADATA[slot.subject];
            const cwEntry = classworkList.find(
              (c) => c.classId === currentClass && c.day === selectedDay && c.period === slot.period && c.week === currentWeek
            ) || classworkList.find(
              (c) => c.classId === currentClass && c.day === selectedDay && c.period === slot.period && (!c.week || c.week === 1)
            );

            const activeLinkUrl = cwEntry?.linkUrl || (isFrench ? 'https://kahoot.it/solo/02420827?challenge-id=7feb71cb-9cdf-43f6-888a-1a97039524af_1758279666900' : undefined);
            const activeLinkTitle = isFrench ? 'Compétition de français' : (cwEntry?.linkTitle || 'رابط الدرس 🔗');

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
                    <div className="space-y-2 py-0.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="italic font-medium">
                          {isFrench ? 'Plan de cours de français.' : 'خطة الحصة لمادة اللغة العربية.'}
                        </span>
                        <button
                          onClick={() => openEdit(slot.period, slot.subject)}
                          className="text-indigo-700 hover:text-indigo-900 font-bold inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Lesson Note
                        </button>
                      </div>
                      {isFrench && activeLinkUrl && (
                        <div>
                          <a
                            href={activeLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black bg-purple-600 hover:bg-purple-700 text-white border border-purple-700 shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-white" />
                            <span>{activeLinkTitle}</span>
                            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Kahoot 🎯</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
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
      )}

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
