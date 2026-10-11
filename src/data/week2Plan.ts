import { ClassworkEntry, HomeworkEntry, TomorrowSpecialNote } from '../types';
import initialData from './initialData.json';

export const WEEK2_CLASSWORK: ClassworkEntry[] = ((initialData.classwork as any[]) || []).filter(
  (c) => (c.block || 1) === 1 && c.week === 2
);

export const ALL_LINK_AND_WEEK2_HOMEWORK: HomeworkEntry[] = ((initialData.homework as any[]) || []).filter(
  (h) => (h.block || 1) === 1 && h.week === 2
);

export const WEEK2_SPECIAL_NOTES: TomorrowSpecialNote[] = ((initialData.tomorrowNotes as any[]) || []).filter(
  (n) => (n.block || 1) === 1 && n.week === 2
);
