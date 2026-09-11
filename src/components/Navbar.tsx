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
      badge: null,
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      icon: Briefcase,
      badge: null,
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: CalendarDays,
      badge: null,
    },
  ] as const;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
      {/* Top Bar: Brand, Class buttons (2A, 2B, 2C), and compact Block & Week */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-2.5 gap-2">
          {/* Logo & School info: Nile Egyptian International School / Grade 2 */}
          <div className="flex items-center gap-2.5 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-800 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-inner shrink-0">
              <School className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white tracking-tight leading-none">
                Nile Egyptian International School
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-bold mt-0.5 leading-none">
                Grade 2
              </p>
            </div>
          </div>

          {/* Classes side-by-side (2A, 2B, 2C) + Compact Block & Week Dropdowns */}
          <div className="flex items-center gap-1.5 sm:gap-2 justify-between sm:justify-end w-full sm:w-auto">
            {/* Class Buttons Side-by-Side (2A, 2B, 2C) */}
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-2xs">
              {(['G2A', 'G2B', 'G2C'] as const).map((cls) => {
                const isSelected = currentClass === cls;
                const label = cls.replace('G', ''); // '2A', '2B', '2C'
                return (
                  <button
                    key={cls}
                    onClick={() => onSelectClass(cls)}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Compact Block Dropdown */}
            <div className="relative">
              <select
                id="block-select"
                value={currentBlock}
                onChange={(e) => onSelectBlock(Number(e.target.value))}
                className="appearance-none bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-950 font-black text-xs rounded-xl pl-2.5 pr-6 py-1 cursor-pointer transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Block"
              >
                <option value={1}>Block 1</option>
                <option value={2}>Block 2</option>
                <option value={3}>Block 3</option>
                <option value={4}>Block 4</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-700 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Compact Week Dropdown */}
            <div className="relative">
              <select
                id="week-select"
                value={currentWeek}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="appearance-none bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-950 font-black text-xs rounded-xl pl-2.5 pr-6 py-1 cursor-pointer transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Week"
              >
                <option value={1}>Week 1</option>
                <option value={2}>Week 2</option>
                <option value={3}>Week 3</option>
                <option value={4}>Week 4</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-purple-700 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs - All 4 visible side-by-side in one single line matching row width */}
        <div className="border-t border-slate-100 py-1.5">
          <nav className="grid grid-cols-4 gap-1 sm:gap-2 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all truncate ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
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
