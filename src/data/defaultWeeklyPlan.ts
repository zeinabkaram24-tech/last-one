import { ClassworkEntry, HomeworkEntry, TomorrowSpecialNote } from '../types';
import initialData from './initialData.json';

export type { TomorrowSpecialNote };

export const INITIAL_CLASSWORK: ClassworkEntry[] = ((initialData.classwork as any[]) || []);
export const INITIAL_HOMEWORK: HomeworkEntry[] = ((initialData.homework as any[]) || []);
export const SPECIAL_TEACHER_NOTES: TomorrowSpecialNote[] = ((initialData.tomorrowNotes as any[]) || []);

export const BLOCK2_WEEK1_CLASSWORK: ClassworkEntry[] = INITIAL_CLASSWORK.filter(
  (c) => Number(c.block || 1) === 2 && Number(c.week || 1) === 1
);

export const BLOCK2_WEEK1_HOMEWORK: HomeworkEntry[] = INITIAL_HOMEWORK.filter(
  (h) => Number(h.block || 1) === 2 && Number(h.week || 1) === 1
);

export const BLOCK2_WEEK1_SPECIAL_NOTES: TomorrowSpecialNote[] = SPECIAL_TEACHER_NOTES.filter(
  (n) => Number(n.block || 1) === 2 && Number(n.week || 1) === 1
);

export const BLOCK2_WEEK2_SPECIAL_NOTES: TomorrowSpecialNote[] = SPECIAL_TEACHER_NOTES.filter(
  (n) => Number(n.block || 1) === 2 && Number(n.week || 1) === 2
);

export const BLOCK2_WEEK3_SPECIAL_NOTES: TomorrowSpecialNote[] = SPECIAL_TEACHER_NOTES.filter(
  (n) => Number(n.block || 1) === 2 && Number(n.week || 1) === 3
);

export const BLOCK2_WEEK4_SPECIAL_NOTES: TomorrowSpecialNote[] = SPECIAL_TEACHER_NOTES.filter(
  (n) => Number(n.block || 1) === 2 && Number(n.week || 1) === 4
);

export const WEEK5_SPECIAL_NOTES: TomorrowSpecialNote[] = SPECIAL_TEACHER_NOTES.filter(
  (n) => Number(n.block || 1) === 1 && Number(n.week || 1) === 5
);

// Week 4 specific subsets for granular filtering if needed
export const WEEK4_ARABIC_CLASSWORK = INITIAL_CLASSWORK.filter(c => Number(c.block || 1) === 1 && Number(c.week || 1) === 4 && c.subject === 'Arabic');
export const WEEK4_FRENCH_CLASSWORK = INITIAL_CLASSWORK.filter(c => Number(c.block || 1) === 1 && Number(c.week || 1) === 4 && c.subject === 'French');
export const WEEK4_ENGLISH_CLASSWORK = INITIAL_CLASSWORK.filter(c => Number(c.block || 1) === 1 && Number(c.week || 1) === 4 && c.subject === 'English');
export const WEEK4_SOCIAL_CLASSWORK = INITIAL_CLASSWORK.filter(c => Number(c.block || 1) === 1 && Number(c.week || 1) === 4 && c.subject === 'Social Studies');
export const WEEK4_MATH_CLASSWORK = INITIAL_CLASSWORK.filter(c => Number(c.block || 1) === 1 && Number(c.week || 1) === 4 && c.subject === 'Mathematics');
export const WEEK4_SCIENCE_CLASSWORK = INITIAL_CLASSWORK.filter(c => Number(c.block || 1) === 1 && Number(c.week || 1) === 4 && c.subject === 'Science');
export const WEEK4_ICT_CLASSWORK = INITIAL_CLASSWORK.filter(c => Number(c.block || 1) === 1 && Number(c.week || 1) === 4 && c.subject === 'ICT');

export const WEEK4_ARABIC_HOMEWORK = INITIAL_HOMEWORK.filter(h => Number(h.block || 1) === 1 && Number(h.week || 1) === 4 && h.subject === 'Arabic');
export const WEEK4_FRENCH_HOMEWORK = INITIAL_HOMEWORK.filter(h => Number(h.block || 1) === 1 && Number(h.week || 1) === 4 && h.subject === 'French');
export const WEEK4_ENGLISH_HOMEWORK = INITIAL_HOMEWORK.filter(h => Number(h.block || 1) === 1 && Number(h.week || 1) === 4 && h.subject === 'English');
export const WEEK4_MATH_HOMEWORK = INITIAL_HOMEWORK.filter(h => Number(h.block || 1) === 1 && Number(h.week || 1) === 4 && h.subject === 'Mathematics');
export const WEEK4_SOCIAL_HOMEWORK = INITIAL_HOMEWORK.filter(h => Number(h.block || 1) === 1 && Number(h.week || 1) === 4 && h.subject === 'Social Studies');
export const WEEK4_SCIENCE_HOMEWORK = INITIAL_HOMEWORK.filter(h => Number(h.block || 1) === 1 && Number(h.week || 1) === 4 && h.subject === 'Science');
export const WEEK4_ICT_HOMEWORK = INITIAL_HOMEWORK.filter(h => Number(h.block || 1) === 1 && Number(h.week || 1) === 4 && h.subject === 'ICT');
