import React from 'react';
import {
  CalendarDays,
  BookOpen,
  CheckSquare,
  Briefcase,
  School,
  ChevronDown,
} from 'lucide-react';
import { ClassId, SchoolDay } from '../types';
import { SCHOOL_DAYS } from '../data/timetables';

interface NavbarProps {
  currentClass: ClassId;
  onSelectClass: (c: ClassId) => void;
  currentBlock: number;
  onSelectBlock: (b: number) => void;
  currentWeek: number;
  onSelectWeek: (w: number) => void;
  activeTab: 'classwork' | 'homework' | 'tomorrow' | 'timetable';
  onSelectTab: (t: 'classwork' | 'homework' | 'tomorrow' | 'timetable') => void;
  selectedDay: SchoolDay;
  onSelectDay: (d: SchoolDay) => void;
  onPrint?: () => void;
  pendingHomeworkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentClass,
  onSelectClass,
  currentBlock,
  onSelectBlock,
  currentWeek,
  onSelectWeek,
  activeTab,
  onSelectTab,
  selectedDay,
  onSelectDay,
  pendingHomeworkCount,
}) => {
  const tabs = [
    {
      id: 'classwork',
      label: 'Classwork',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: CheckSquare,
      badge: pendingHomeworkCount > 0 ? pendingHomeworkCount : null,
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow Prep',
      icon: Briefcase,
      badge: null,
    },
    {
      id: 'timetable',
      label: 'Full Timetable',
      icon: CalendarDays,
      badge: null,
    },
  ] as const;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      {/* Top Bar: Brand & Dropdowns (Grade, Block, Week) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-2.5">
          {/* Logo & School info */}
          <div className="flex items-center gap-2.5 bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-800 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-inner shrink-0">
              <School className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-black text-white tracking-tight leading-none">
                  Nile Egyptian Int. School
                </h1>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-400 text-slate-950">
                  Menia
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium leading-tight">
                Grade 2 • Arabic & French Organizer
              </p>
            </div>
          </div>

          {/* 3 Selectable Dropdowns Side-by-Side: Grade, Block, Week */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* Grade Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                id="grade-select"
                value={currentClass}
                onChange={(e) => onSelectClass(e.target.value as ClassId)}
                className="w-full sm:w-auto appearance-none bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-900 font-black text-xs rounded-xl pl-3 pr-7 py-2 cursor-pointer transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Class Grade"
              >
                <option value="G2A">Grade 2A</option>
                <option value="G2B">Grade 2B</option>
                <option value="G2C">Grade 2C</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Block Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                id="block-select"
                value={currentBlock}
                onChange={(e) => onSelectBlock(Number(e.target.value))}
                className="w-full sm:w-auto appearance-none bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-950 font-black text-xs rounded-xl pl-3 pr-7 py-2 cursor-pointer transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Block"
              >
                <option value={1}>Block 1</option>
                <option value={2}>Block 2</option>
                <option value={3}>Block 3</option>
                <option value={4}>Block 4</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-700 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Week Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                id="week-select"
                value={currentWeek}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="w-full sm:w-auto appearance-none bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-950 font-black text-xs rounded-xl pl-3 pr-7 py-2 cursor-pointer transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Week"
              >
                <option value={1}>Week 1</option>
                <option value={2}>Week 2</option>
                <option value={3}>Week 3</option>
                <option value={4}>Week 4</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-purple-700 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 pb-1">
          <nav className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-rose-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Active Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{currentClass} • Block {currentBlock} • Week {currentWeek}</span>
          </div>
        </div>
      </div>

      {/* Day Ribbon: NO scroll, NO 'School Day' label, ALL 6 days visible side-by-side in one single row */}
      {activeTab !== 'timetable' && (
        <div className="bg-slate-50 border-t border-slate-200 py-1.5 px-2 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5 w-full">
              {SCHOOL_DAYS.map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => onSelectDay(day)}
                    className={`w-full py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-lg text-center transition-all text-[11px] sm:text-xs font-black truncate ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-100'
                    }`}
                    title={day}
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
