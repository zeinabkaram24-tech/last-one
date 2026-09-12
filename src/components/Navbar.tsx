import React from 'react';
import {
  CalendarDays,
  BookOpen,
  CheckSquare,
  Briefcase,
  School,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { ClassId, SchoolDay } from '../types';
import { SCHOOL_DAYS } from '../data/timetables';
import { getWeekDateRange } from '../data/calendarDates';

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
  const currentDateRange = getWeekDateRange(currentBlock, currentWeek);

  const tabs = [
    {
      id: 'classwork',
      label: 'Classwork',
      icon: BookOpen,
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: CheckSquare,
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      icon: Briefcase,
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: CalendarDays,
    },
  ] as const;

  return (
    <header className="sticky top-0 z-40 shadow-md print:hidden bg-slate-900 border-b border-slate-800">
      {/* ========================================================= */}
      {/* ROW 1: صف النايل (Nile School Branding & Branch Info)      */}
      {/* ========================================================= */}
      <div className="bg-[#0b1329] border-b border-slate-800/90 px-3 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md ring-1 ring-white/20 shrink-0">
              <School className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white tracking-tight leading-none">
                Nile Egyptian International Schools – Minya Branch
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-bold mt-1 leading-none flex items-center gap-1.5 flex-wrap">
                <span className="text-amber-400 font-extrabold">مدارس النيل المصرية الدولية – فرع المنيا</span>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-300 font-black">Grade 2 (الصف الثاني الابتدائي)</span>
              </p>
            </div>
          </div>

          {/* Quick Date Indicator on Top Right */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-bold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-black">الفترة:</span>
            <span>{currentDateRange.simpleRange}</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 2: صف الـ 2A (Classes + Block/Week Dropdowns + Date)  */}
      {/* ========================================================= */}
      <div className="bg-[#131f37] border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Class Selection Buttons: 2A, 2B, 2C */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
              <span className="text-[11px] font-black text-slate-400 px-1.5 hidden xs:inline">الفصل:</span>
              {(['G2A', 'G2B', 'G2C'] as const).map((cls) => {
                const isSelected = currentClass === cls;
                const label = cls.replace('G', '');
                return (
                  <button
                    key={cls}
                    onClick={() => onSelectClass(cls)}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Block Dropdown */}
            <div className="relative">
              <select
                id="block-select"
                value={currentBlock}
                onChange={(e) => onSelectBlock(Number(e.target.value))}
                className="appearance-none bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-200 font-black text-xs rounded-xl pl-2.5 pr-6 py-1 cursor-pointer transition-colors shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                title="Block"
              >
                <option value={1}>Block 1</option>
                <option value={2}>Block 2</option>
                <option value={3}>Block 3</option>
                <option value={4}>Block 4</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Week Dropdown with Dates Displayed Inside */}
            <div className="relative">
              <select
                id="week-select"
                value={currentWeek}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="appearance-none bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-200 font-black text-xs rounded-xl pl-2.5 pr-6 py-1 cursor-pointer transition-colors shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                title="Week"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
                  const r = getWeekDateRange(currentBlock, w);
                  return (
                    <option key={w} value={w}>
                      Week {w} ({r.rangeShort})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Prominent Week Date Range Display */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold shadow-2xs self-start md:self-auto">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-black">الفترة:</span>
            <span className="font-bold">{currentDateRange.labelArabic}</span>
            <span className="text-amber-200/90 font-mono text-[11px]">({currentDateRange.rangeShort})</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 3: صف الكلاس وورك (Navigation Tabs: 4 Views)           */}
      {/* ========================================================= */}
      <div className="bg-[#1a2744] border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto">
          <nav className="grid grid-cols-4 gap-1 sm:gap-2 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs font-black transition-all truncate ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md ring-1 ring-white/20'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.label}</span>
                  {tab.id === 'homework' && pendingHomeworkCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white ml-0.5">
                      {pendingHomeworkCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 4: صف الـ Saturday (Days: Saturday through Thursday)   */}
      {/* ========================================================= */}
      {activeTab !== 'timetable' && (
        <div className="bg-[#0f172a] px-3 sm:px-6 lg:px-8 py-1.5">
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
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300 font-black'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                    title={day}
                  >
                    <span>{day}</span>
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
