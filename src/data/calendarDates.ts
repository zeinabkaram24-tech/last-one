export interface WeekDateRange {
  block: number;
  week: number;
  startDate: string;   // e.g. '13/9/2026'
  endDate: string;     // e.g. '17/9/2026'
  rangeShort: string;  // e.g. '13/9 - 17/9/2026'
  labelArabic: string; // e.g. 'من 13 سبتمبر إلى 17 سبتمبر 2026'
  simpleRange: string; // e.g. '13 سبتمبر - 17 سبتمبر'
}

export const BLOCK_WEEK_DATES: Record<number, Record<number, WeekDateRange>> = {
  // Block 1 (Academic Year 2026-2027)
  1: {
    1: {
      block: 1,
      week: 1,
      startDate: '6/9/2026',
      endDate: '10/9/2026',
      rangeShort: '6/9 - 10/9/2026',
      labelArabic: 'من 6 سبتمبر إلى 10 سبتمبر 2026',
      simpleRange: '6 سبتمبر - 10 سبتمبر',
    },
    2: {
      block: 1,
      week: 2,
      startDate: '13/9/2026',
      endDate: '17/9/2026',
      rangeShort: '13/9 - 17/9/2026',
      labelArabic: 'من 13 سبتمبر إلى 17 سبتمبر 2026',
      simpleRange: '13 سبتمبر - 17 سبتمبر',
    },
    3: {
      block: 1,
      week: 3,
      startDate: '20/9/2026',
      endDate: '24/9/2026',
      rangeShort: '20/9 - 24/9/2026',
      labelArabic: 'من 20 سبتمبر إلى 24 سبتمبر 2026',
      simpleRange: '20 سبتمبر - 24 سبتمبر',
    },
    4: {
      block: 1,
      week: 4,
      startDate: '27/9/2026',
      endDate: '1/10/2026',
      rangeShort: '27/9 - 1/10/2026',
      labelArabic: 'من 27 سبتمبر إلى 1 أكتوبر 2026',
      simpleRange: '27 سبتمبر - 1 أكتوبر',
    },
    5: {
      block: 1,
      week: 5,
      startDate: '4/10/2026',
      endDate: '8/10/2026',
      rangeShort: '4/10 - 8/10/2026',
      labelArabic: 'من 4 أكتوبر إلى 8 أكتوبر 2026',
      simpleRange: '4 أكتوبر - 8 أكتوبر',
    },
    6: {
      block: 1,
      week: 6,
      startDate: '11/10/2026',
      endDate: '15/10/2026',
      rangeShort: '11/10 - 15/10/2026',
      labelArabic: 'من 11 أكتوبر إلى 15 أكتوبر 2026',
      simpleRange: '11 أكتوبر - 15 أكتوبر',
    },
    7: {
      block: 1,
      week: 7,
      startDate: '18/10/2026',
      endDate: '22/10/2026',
      rangeShort: '18/10 - 22/10/2026',
      labelArabic: 'من 18 أكتوبر إلى 22 أكتوبر 2026',
      simpleRange: '18 أكتوبر - 22 أكتوبر',
    },
    8: {
      block: 1,
      week: 8,
      startDate: '25/10/2026',
      endDate: '29/10/2026',
      rangeShort: '25/10 - 29/10/2026',
      labelArabic: 'من 25 أكتوبر إلى 29 أكتوبر 2026',
      simpleRange: '25 أكتوبر - 29 أكتوبر',
    },
  },
  // Block 2
  2: {
    1: {
      block: 2,
      week: 1,
      startDate: '1/11/2026',
      endDate: '5/11/2026',
      rangeShort: '1/11 - 5/11/2026',
      labelArabic: 'من 1 نوفمبر إلى 5 نوفمبر 2026',
      simpleRange: '1 نوفمبر - 5 نوفمبر',
    },
    2: {
      block: 2,
      week: 2,
      startDate: '8/11/2026',
      endDate: '12/11/2026',
      rangeShort: '8/11 - 12/11/2026',
      labelArabic: 'من 8 نوفمبر إلى 12 نوفمبر 2026',
      simpleRange: '8 نوفمبر - 12 نوفمبر',
    },
    3: {
      block: 2,
      week: 3,
      startDate: '15/11/2026',
      endDate: '19/11/2026',
      rangeShort: '15/11 - 19/11/2026',
      labelArabic: 'من 15 نوفمبر إلى 19 نوفمبر 2026',
      simpleRange: '15 نوفمبر - 19 نوفمبر',
    },
    4: {
      block: 2,
      week: 4,
      startDate: '22/11/2026',
      endDate: '26/11/2026',
      rangeShort: '22/11 - 26/11/2026',
      labelArabic: 'من 22 نوفمبر إلى 26 نوفمبر 2026',
      simpleRange: '22 نوفمبر - 26 نوفمبر',
    },
  },
  // Block 3
  3: {
    1: {
      block: 3,
      week: 1,
      startDate: '3/1/2027',
      endDate: '7/1/2027',
      rangeShort: '3/1 - 7/1/2027',
      labelArabic: 'من 3 يناير إلى 7 يناير 2027',
      simpleRange: '3 يناير - 7 يناير',
    },
    2: {
      block: 3,
      week: 2,
      startDate: '10/1/2027',
      endDate: '14/1/2027',
      rangeShort: '10/1 - 14/1/2027',
      labelArabic: 'من 10 يناير إلى 14 يناير 2027',
      simpleRange: '10 يناير - 14 يناير',
    },
    3: {
      block: 3,
      week: 3,
      startDate: '17/1/2027',
      endDate: '21/1/2027',
      rangeShort: '17/1 - 21/1/2027',
      labelArabic: 'من 17 يناير إلى 21 يناير 2027',
      simpleRange: '17 يناير - 21 يناير',
    },
    4: {
      block: 3,
      week: 4,
      startDate: '24/1/2027',
      endDate: '28/1/2027',
      rangeShort: '24/1 - 28/1/2027',
      labelArabic: 'من 24 يناير إلى 28 يناير 2027',
      simpleRange: '24 يناير - 28 يناير',
    },
  },
  // Block 4
  4: {
    1: {
      block: 4,
      week: 1,
      startDate: '28/2/2027',
      endDate: '4/3/2027',
      rangeShort: '28/2 - 4/3/2027',
      labelArabic: 'من 28 فبراير إلى 4 مارس 2027',
      simpleRange: '28 فبراير - 4 مارس',
    },
    2: {
      block: 4,
      week: 2,
      startDate: '7/3/2027',
      endDate: '11/3/2027',
      rangeShort: '7/3 - 11/3/2027',
      labelArabic: 'من 7 مارس إلى 11 مارس 2027',
      simpleRange: '7 مارس - 11 مارس',
    },
    3: {
      block: 4,
      week: 3,
      startDate: '14/3/2027',
      endDate: '18/3/2027',
      rangeShort: '14/3 - 18/3/2027',
      labelArabic: 'من 14 مارس إلى 18 مارس 2027',
      simpleRange: '14 مارس - 18 مارس',
    },
    4: {
      block: 4,
      week: 4,
      startDate: '21/3/2027',
      endDate: '25/3/2027',
      rangeShort: '21/3 - 25/3/2027',
      labelArabic: 'من 21 مارس إلى 25 مارس 2027',
      simpleRange: '21 مارس - 25 مارس',
    },
  },
};

export function getWeekDateRange(block: number = 1, week: number = 2): WeekDateRange {
  const blockData = BLOCK_WEEK_DATES[block];
  if (blockData && blockData[week]) {
    return blockData[week];
  }
  return {
    block,
    week,
    startDate: `Week ${week}`,
    endDate: `Block ${block}`,
    rangeShort: `Block ${block} - W${week}`,
    labelArabic: `الأسبوع ${week} - بلوك ${block}`,
    simpleRange: `الأسبوع ${week}`,
  };
}
