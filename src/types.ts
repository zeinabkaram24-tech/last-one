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
  block?: number;
  week?: number;
  linkUrl?: string;
  linkTitle?: string;
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
  block?: number;
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

export type UserMode = 'guest' | 'student';

export interface UserProfile {
  mode: UserMode;
  studentName?: string;
  classId?: ClassId;
}

export type MaterialSection = 'main-sheet' | 'week-1' | 'week-2' | 'week-3' | 'week-4' | string;

export interface UploadedMaterial {
  id: string;
  title: string;
  subtitle?: string;
  subject: string;
  blockNumber: number; // 1 | 2 | 3 | 4
  section: MaterialSection; // 'main-sheet' | 'week-1' | 'week-2' | etc.
  fileName: string;
  fileSize: string;
  fileUrl: string;
  fileData?: string; // base64 data for fallback / offline preview
  uploadedAt: string;
  pages?: string;
}
