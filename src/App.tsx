import React, { useState, useEffect } from 'react';
import { ClassId, SchoolDay, ClassworkEntry, HomeworkEntry } from './types';
import { INITIAL_CLASSWORK, INITIAL_HOMEWORK } from './data/defaultWeeklyPlan';
import { SCHOOL_DAYS, SCHOOL_NAME, SCHOOL_BRANCH } from './data/timetables';
import { Navbar } from './components/Navbar';
import { ClassworkView } from './components/ClassworkView';
import { HomeworkView } from './components/HomeworkView';
import { TomorrowView } from './components/TomorrowView';
import { TimetableGrid } from './components/TimetableGrid';
import { PrintSheet } from './components/PrintSheet';
import { WeeklyPlanModal } from './components/WeeklyPlanModal';
import { Sparkles, RotateCcw } from 'lucide-react';

const STORAGE_KEYS = {
  CLASS: 'nile_planner_current_class_v3',
  DAY: 'nile_planner_selected_day_v3',
  WEEK: 'nile_planner_current_week_v3',
  CLASSWORK: 'nile_planner_classwork_b1_w1_w2_v7',
  HOMEWORK: 'nile_planner_homework_b1_w1_w2_v7',
};

export default function App() {
  // Class selection (G2A, G2B, G2C)
  const [currentClass, setCurrentClass] = useState<ClassId>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASS);
    return saved === 'G2A' || saved === 'G2B' || saved === 'G2C' ? saved : 'G2B';
  });

  // Current Block (1, 2, 3, 4)
  const [currentBlock, setCurrentBlock] = useState<number>(() => {
    const saved = localStorage.getItem('nile_planner_block');
    return saved ? Number(saved) : 1;
  });

  // Current Week (1, 2, 3, 4)
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEK);
    return saved ? Number(saved) : 2;
  });

  // Selected Day (Sunday, Monday, Tuesday, Wednesday, Thursday)
  const [selectedDay, setSelectedDay] = useState<SchoolDay>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAY);
    if (saved && SCHOOL_DAYS.includes(saved as SchoolDay)) {
      return saved as SchoolDay;
    }
    // Determine current day of week if within Sunday - Thursday
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayMap: Record<number, SchoolDay> = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Sunday', // Friday -> prep for Sunday
      6: 'Sunday', // Saturday -> prep for Sunday
    };
    return dayMap[dayOfWeek] || 'Sunday';
  });

  // Active View Tab: 'classwork' | 'homework' | 'tomorrow' | 'timetable'
  const [activeTab, setActiveTab] = useState<'classwork' | 'homework' | 'tomorrow' | 'timetable'>('classwork');

  // Classwork state
  const [classworkList, setClassworkList] = useState<ClassworkEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSWORK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading classwork from storage', e);
    }
    return INITIAL_CLASSWORK;
  });

  // Homework state
  const [homeworkList, setHomeworkList] = useState<HomeworkEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOMEWORK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading homework from storage', e);
    }
    return INITIAL_HOMEWORK;
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASS, currentClass);
  }, [currentClass]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEK, String(currentWeek));
  }, [currentWeek]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAY, selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSWORK, JSON.stringify(classworkList));
  }, [classworkList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(homeworkList));
  }, [homeworkList]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Classwork handlers
  const handleToggleClasswork = (id: string) => {
    setClassworkList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const handleSaveClasswork = (entry: ClassworkEntry) => {
    setClassworkList((prev) => {
      const idx = prev.findIndex((c) => c.id === entry.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [...prev, entry];
    });
    showToast('Classwork saved successfully!');
  };

  // Homework handlers
  const handleToggleHomework = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const handleAddHomework = (entry: HomeworkEntry) => {
    setHomeworkList((prev) => [entry, ...prev]);
    showToast('New homework assignment added!');
  };

  const handleDeleteHomework = (id: string) => {
    setHomeworkList((prev) => prev.filter((h) => h.id !== id));
    showToast('Assignment removed.');
  };

  const handleApplyWeeklyPlan = (newClasswork: ClassworkEntry[], newHomework: HomeworkEntry[]) => {
    setClassworkList((prev) => [...newClasswork, ...prev]);
    setHomeworkList((prev) => [...newHomework, ...prev]);
    showToast('Weekly plan imported successfully!');
  };

  // Reset to sample plan
  const handleResetToDefaults = () => {
    if (confirm('Reset to standard Grade 2 Nile International School weekly plan?')) {
      setClassworkList(INITIAL_CLASSWORK);
      setHomeworkList(INITIAL_HOMEWORK);
      showToast('Reset to default sample plan.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate pending homework count for current class
  const pendingHomeworkCount = homeworkList.filter(
    (h) => h.classId === currentClass && !h.completed
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Interactive Navigation Bar */}
      <Navbar
        currentClass={currentClass}
        onSelectClass={setCurrentClass}
        currentBlock={currentBlock}
        onSelectBlock={(b) => {
          setCurrentBlock(b);
          localStorage.setItem('nile_planner_block', String(b));
          showToast(`Switched to Block ${b}`);
        }}
        currentWeek={currentWeek}
        onSelectWeek={(w) => {
          setCurrentWeek(w);
          localStorage.setItem(STORAGE_KEYS.WEEK, String(w));
          showToast(`Switched to Week ${w}`);
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrint={handlePrint}
        pendingHomeworkCount={pendingHomeworkCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="mb-4 p-3.5 bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-between gap-3 animate-fade-in print:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{toastMsg}</span>
            </div>
            <button
              onClick={() => setToastMsg(null)}
              className="text-emerald-200 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic View rendering based on activeTab */}
        <div className="print:hidden">
          {activeTab === 'classwork' && (
            <ClassworkView
              currentClass={currentClass}
              selectedDay={selectedDay}
              classworkList={classworkList}
              currentWeek={currentWeek}
              onToggleClasswork={handleToggleClasswork}
              onSaveClasswork={handleSaveClasswork}
            />
          )}

          {activeTab === 'homework' && (
            <HomeworkView
              currentClass={currentClass}
              selectedDay={selectedDay}
              homeworkList={homeworkList}
              currentWeek={currentWeek}
              onToggleHomework={handleToggleHomework}
              onAddHomework={handleAddHomework}
              onDeleteHomework={handleDeleteHomework}
            />
          )}

          {activeTab === 'tomorrow' && (
            <TomorrowView
              currentClass={currentClass}
              selectedDay={selectedDay}
              homeworkList={homeworkList}
              currentWeek={currentWeek}
              onToggleHomework={handleToggleHomework}
              onPrint={handlePrint}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableGrid
              currentClass={currentClass}
              selectedDay={selectedDay}
              onSelectDay={(d) => {
                setSelectedDay(d);
                setActiveTab('classwork');
              }}
            />
          )}
        </div>

        {/* Clean Print Layout for parents and students */}
        <PrintSheet
          currentClass={currentClass}
          selectedDay={selectedDay}
          classworkList={classworkList}
          homeworkList={homeworkList}
        />
      </main>

      {/* Bottom Footer with quick stats and reset */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">{SCHOOL_NAME}</span>
            <span>•</span>
            <span>{SCHOOL_BRANCH} Branch</span>
            <span>•</span>
            <span>Classes: G2A, G2B, G2C</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Smart Plan Classifier
            </button>
            <button
              onClick={handleResetToDefaults}
              className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Defaults
            </button>
          </div>
        </div>
      </footer>

      {/* Weekly Plan Smart Classifier Modal */}
      <WeeklyPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentClass={currentClass}
        onApplyPlan={handleApplyWeeklyPlan}
      />
    </div>
  );
}
