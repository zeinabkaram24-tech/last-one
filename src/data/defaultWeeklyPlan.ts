import { ClassworkEntry, HomeworkEntry, TomorrowSpecialNote } from '../types';
import plannerData from '../../data/planner_data.json';

export type { TomorrowSpecialNote };

export const INITIAL_CLASSWORK: ClassworkEntry[] = (plannerData.classwork || []) as ClassworkEntry[];
export const INITIAL_HOMEWORK: HomeworkEntry[] = (plannerData.homework || []) as HomeworkEntry[];
export const SPECIAL_TEACHER_NOTES: TomorrowSpecialNote[] = (plannerData.tomorrowNotes || []) as TomorrowSpecialNote[];
