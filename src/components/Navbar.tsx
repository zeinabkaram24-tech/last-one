import React from 'react';
import {
  CalendarDays,
  BookOpen,
  CheckSquare,
  Briefcase,
  Sparkles,
  Printer,
  School,
  FileSpreadsheet,
} from 'lucide-react';
import { ClassId, SchoolDay } from '../types';
import { SCHOOL_DAYS } from '../data/timetables';

interface NavbarProps {
  currentClass: ClassId;
  onSelectClass: (c: ClassId) => void;
  currentWeek: number;
  onSelectWeek: (w: number) => void;
  activeTab: 'classwork' | 'homework' | 'tomorrow' | 'timetable';
  onSelectTab: (t: 'classwork' | 'homework' | 'tomorrow' | 'timetable') => void;
  selectedDay: SchoolDay;
  onSelectDay: (d: SchoolDay) => void;
  onOpenPlanModal: () => void;
  onPrint: () => void;
  pendingHomeworkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentClass,
  onSelectClass,
  currentWeek,
  onSelectWeek,
  activeTab,
  onSelectTab,
  selectedDay,
  onSelectDay,
  onOpenPlanModal,
  onPrint,
  pendingHomeworkCount,
}) => {
  const classes: { id: ClassId; label: string; desc: string }[] = [
    { id: 'G2A', label: 'Grade 2A', desc: 'Class A' },
    { id: 'G2B', label: 'Grade 2B', desc: 'Class B' },
    { id: 'G2C', label: 'Grade 2C', desc: 'Class C' },
  ];

  const tabs = [
    {
      id: 'classwork',
      label: 'Classwork',
      icon: BookOpen,
      badge: null,
      desc: 'Lessons & Periods',
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: CheckSquare,
      badge: pendingHomeworkCount > 0 ? pendingHomeworkCount : null,
      desc: 'Assignments & Due',
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow Prep',
      icon: Briefcase,
      badge: 'Prep',
      desc: 'Bag & Schedule',
    },
    {
      id: 'timetable',
      label: 'Full Timetable',
      icon: CalendarDays,
      badge: null,
      desc: 'Official 8-Period Grid',
    },
  ] as const;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      {/* Top Bar: Brand & Class Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & School info */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-xs">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Nile Egyptian International School
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Menia
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Grade 2 Weekly Organizer • Classwork • Homework • Tomorrow Prep
              </p>
            </div>
          </div>

          {/* Right Controls: Class Picker & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Class Picker */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {classes.map((cls) => {
                const isActive = currentClass === cls.id;
                return (
                  <button
                    key={cls.id}
                    onClick={() => onSelectClass(cls.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cls.label}
                  </button>
                );
              })}
            </div>

            {/* Block 1 Week Picker */}
            <div className="flex items-center bg-indigo-50/60 p-1 rounded-xl border border-indigo-200">
              <button
                onClick={() => onSelectWeek(1)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentWeek === 1
                    ? 'bg-white text-indigo-900 shadow-xs border border-indigo-300'
                    : 'text-indigo-600 hover:text-indigo-950'
                }`}
                title="Week 1 (6 Sep - 10 Sep)"
              >
                Week 1
              </button>
              <button
                onClick={() => onSelectWeek(2)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentWeek === 2
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-600 hover:text-indigo-950'
                }`}
                title="Week 2 (13 Sep - 17 Sep)"
              >
                Week 2
              </button>
            </div>

            {/* Paste / Enter Weekly Plan Button */}
            <button
              onClick={onOpenPlanModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paste Weekly Plan</span>
            </button>

            {/* Print / Export button */}
            <button
              onClick={onPrint}
              title="Print daily preparation or schedule"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (The 3 Requirements + Full Timetable) */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 pb-1 overflow-x-auto">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        typeof tab.badge === 'number'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick indicator of current active class */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 pl-4 border-l border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Active: <strong className="text-slate-800 font-semibold">{currentClass}</strong></span>
          </div>
        </div>
      </div>

      {/* Day Selector Ribbon (Visible for Classwork, Homework, Tomorrow views) */}
      {activeTab !== 'timetable' && (
        <div className="bg-slate-50 border-t border-slate-200 py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              School Day:
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              {SCHOOL_DAYS.map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => onSelectDay(day)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
