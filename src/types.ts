export type ClassId = 'G2A' | 'G2B' | 'G2C';

export type SchoolDay = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';

export type SubjectName =
  | 'Mathematics'
  | 'English'
  | 'Arabic'
  | 'Science'
  | 'Social Studies'
  | 'French'
  | 'Religion'
  | 'ICT'
  | 'Arts'
  | 'Music'
  | 'PE';

export interface PeriodSlot {
  period: number; // 1 to 8
  time: string; // e.g., "7:45 - 8:35"
  subject: SubjectName;
  teacher: string;
  notes?: string;
}

export interface BreakSlot {
  name: string;
  time: string;
  type: 'line' | 'breakfast' | 'lunch';
}

export interface DaySchedule {
  day: SchoolDay;
  periods: PeriodSlot[];
}

export interface ClassworkEntry {
  id: string;
  classId: ClassId;
  day: SchoolDay;
  period: number;
  subject: SubjectName;
  title: string;
  details?: string;
  pages?: string;
  completed: boolean;
  week?: number;
  linkUrl?: string;
}

export interface HomeworkEntry {
  id: string;
  classId: ClassId;
  assignedDay: SchoolDay;
  dueDay: SchoolDay;
  subject: SubjectName;
  task: string;
  details?: string;
  pages?: string;
  completed: boolean;
  priority?: 'normal' | 'urgent';
  week?: number;
  isLinkTask?: boolean;
  linkUrl?: string;
}

export interface TomorrowItem {
  subject: SubjectName;
  period: number;
  time: string;
  teacher: string;
  requiredBagItems: string[];
  dueHomework?: HomeworkEntry[];
  specialNote?: string;
}

export interface ParsedWeeklyPlanResponse {
  classwork: Omit<ClassworkEntry, 'id'>[];
  homework: Omit<HomeworkEntry, 'id'>[];
  tomorrowNotes?: {
    day: SchoolDay;
    note: string;
  }[];
}
