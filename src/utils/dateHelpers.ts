import { SchoolDay } from '../types';

export interface AcademicWeekRange {
  block: number;
  week: number;
  // School week starts Sunday (or previous Friday afternoon / Saturday preparation)
  startDate: Date;
  // School week ends Thursday end of day
  endDate: Date;
}

/**
 * Academic Calendar Schedule for Block & Week detection based on actual dates.
 * Egyptian/Arab International School calendar (Sunday to Thursday):
 * Block 1:
 *  Week 1: 06/09/2026 - 10/09/2026
 *  Week 2: 13/09/2026 - 17/09/2026
 *  Week 3: 20/09/2026 - 24/09/2026
 *  Week 4: 27/09/2026 - 01/10/2026
 *  Week 5: 04/10/2026 - 08/10/2026
 * Block 2:
 *  Week 1: 11/10/2026 - 15/10/2026 (From Friday 09/10 weekend preparing for Sunday 11/10)
 *  Week 2: 18/10/2026 - 22/10/2026
 *  Week 3: 25/10/2026 - 29/10/2026
 *  Week 4: 01/11/2026 - 05/11/2026
 *  Week 5: 08/11/2026 - 12/11/2026
 * Block 3:
 *  Week 1: 15/11/2026 - 19/11/2026
 *  Week 2: 22/11/2026 - 26/11/2026
 *  Week 3: 29/11/2026 - 03/12/2026
 *  Week 4: 06/12/2026 - 10/12/2026
 *  Week 5: 13/12/2026 - 17/12/2026
 * Block 4:
 *  Week 1: 20/12/2026 - 24/12/2026
 *  Week 2: 27/12/2026 - 31/12/2026
 *  Week 3: 03/01/2027 - 07/01/2027
 *  Week 4: 10/01/2027 - 14/01/2027
 *  Week 5: 17/01/2027 - 21/01/2027
 */
export const ACADEMIC_CALENDAR: AcademicWeekRange[] = [
  // Block 1
  { block: 1, week: 1, startDate: new Date(2026, 8, 4), endDate: new Date(2026, 8, 10, 23, 59, 59) },   // 6/9 - 10/9
  { block: 1, week: 2, startDate: new Date(2026, 8, 11), endDate: new Date(2026, 8, 17, 23, 59, 59) },  // 13/9 - 17/9
  { block: 1, week: 3, startDate: new Date(2026, 8, 18), endDate: new Date(2026, 8, 24, 23, 59, 59) },  // 20/9 - 24/9
  { block: 1, week: 4, startDate: new Date(2026, 8, 25), endDate: new Date(2026, 9, 1, 23, 59, 59) },   // 27/9 - 1/10
  { block: 1, week: 5, startDate: new Date(2026, 9, 2), endDate: new Date(2026, 9, 8, 23, 59, 59) },    // 4/10 - 8/10

  // Block 2: Week 1 begins preparing on Friday 9/10 / Saturday 10/10 for school week 11/10 - 15/10
  { block: 2, week: 1, startDate: new Date(2026, 9, 9), endDate: new Date(2026, 9, 15, 23, 59, 59) },   // 11/10 - 15/10
  { block: 2, week: 2, startDate: new Date(2026, 9, 16), endDate: new Date(2026, 9, 22, 23, 59, 59) },  // 18/10 - 22/10
  { block: 2, week: 3, startDate: new Date(2026, 9, 23), endDate: new Date(2026, 9, 29, 23, 59, 59) },  // 25/10 - 29/10
  { block: 2, week: 4, startDate: new Date(2026, 9, 30), endDate: new Date(2026, 10, 5, 23, 59, 59) },  // 1/11 - 5/11
  { block: 2, week: 5, startDate: new Date(2026, 10, 6), endDate: new Date(2026, 10, 12, 23, 59, 59) }, // 8/11 - 12/11

  // Block 3
  { block: 3, week: 1, startDate: new Date(2026, 10, 13), endDate: new Date(2026, 10, 19, 23, 59, 59) }, // 15/11 - 19/11
  { block: 3, week: 2, startDate: new Date(2026, 10, 20), endDate: new Date(2026, 10, 26, 23, 59, 59) }, // 22/11 - 26/11
  { block: 3, week: 3, startDate: new Date(2026, 10, 27), endDate: new Date(2026, 11, 3, 23, 59, 59) },  // 29/11 - 3/12
  { block: 3, week: 4, startDate: new Date(2026, 11, 4), endDate: new Date(2026, 11, 10, 23, 59, 59) },  // 6/12 - 10/12
  { block: 3, week: 5, startDate: new Date(2026, 11, 11), endDate: new Date(2026, 11, 17, 23, 59, 59) }, // 13/12 - 17/12

  // Block 4
  { block: 4, week: 1, startDate: new Date(2026, 11, 18), endDate: new Date(2026, 11, 24, 23, 59, 59) }, // 20/12 - 24/12
  { block: 4, week: 2, startDate: new Date(2026, 11, 25), endDate: new Date(2026, 11, 31, 23, 59, 59) }, // 27/12 - 31/12
  { block: 4, week: 3, startDate: new Date(2027, 0, 1), endDate: new Date(2027, 0, 7, 23, 59, 59) },     // 3/1 - 7/1
  { block: 4, week: 4, startDate: new Date(2027, 0, 8), endDate: new Date(2027, 0, 14, 23, 59, 59) },    // 10/1 - 14/1
  { block: 4, week: 5, startDate: new Date(2027, 0, 15), endDate: new Date(2027, 0, 21, 23, 59, 59) },   // 17/1 - 21/1
];

/**
 * Returns the current academic Block and Week based on the current real date.
 */
export function getCurrentAcademicBlockAndWeek(referenceDate: Date = new Date()): { block: number; week: number } {
  const time = referenceDate.getTime();

  for (const range of ACADEMIC_CALENDAR) {
    if (time >= range.startDate.getTime() && time <= range.endDate.getTime()) {
      return { block: range.block, week: range.week };
    }
  }

  // If before the first range, default to Block 1 Week 1
  if (time < ACADEMIC_CALENDAR[0].startDate.getTime()) {
    return { block: 1, week: 1 };
  }

  // If between ranges or later, find next matching range or fallback to Block 2 Week 1
  for (const range of ACADEMIC_CALENDAR) {
    if (time <= range.endDate.getTime()) {
      return { block: range.block, week: range.week };
    }
  }

  return { block: 2, week: 1 };
}

/**
 * Returns the SchoolDay (Sunday - Thursday) corresponding to the current date.
 * If today is Friday or Saturday (weekend), returns Sunday (the start of the school week).
 */
export function getCurrentSchoolDay(referenceDate: Date = new Date()): SchoolDay {
  const dayOfWeek = referenceDate.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  const dayMap: Record<number, SchoolDay> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Sunday', // Friday weekend opens Sunday
    6: 'Sunday', // Saturday weekend opens Sunday
  };

  return dayMap[dayOfWeek] || 'Sunday';
}
