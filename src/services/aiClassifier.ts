import { ClassId, ParsedWeeklyPlanResponse } from '../types';

export async function parseWeeklyPlanWithAI(
  planText: string,
  classId: ClassId
): Promise<ParsedWeeklyPlanResponse> {
  try {
    const response = await fetch('/api/parse-weekly-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planText, classId }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    return {
      classwork: Array.isArray(data.classwork) ? data.classwork : [],
      homework: Array.isArray(data.homework) ? data.homework : [],
      tomorrowNotes: Array.isArray(data.tomorrowNotes) ? data.tomorrowNotes : [],
    };
  } catch (err) {
    console.warn('Network call failed, using client parser fallback:', err);
    // Client-side quick parser
    return fallbackClientParser(planText, classId);
  }
}

function fallbackClientParser(text: string, classId: ClassId): ParsedWeeklyPlanResponse {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const classwork: any[] = [];
  const homework: any[] = [];
  const tomorrowNotes: any[] = [];

  let currentDay: any = 'Sunday';
  let currentSubject: any = 'English';

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const subjects = [
    'Mathematics',
    'English',
    'Arabic',
    'Science',
    'Social Studies',
    'French',
    'Religion',
    'ICT',
    'Arts',
    'Music',
    'PE',
  ];

  // Helper for naming convention on tomorrow notes:
  // Arabic: ملاحظات | French: remarque | All other subjects: notes
  const getSubjectNoteLabel = (subj: string): string => {
    const s = subj.toLowerCase();
    if (s.includes('arabic') || s.includes('عربي')) return 'ملاحظات';
    if (s.includes('french') || s.includes('français') || s.includes('فرنش')) return 'remarque';
    return 'notes';
  };

  // Timetable default period mapper for Mathematics across Grade 2
  const MATH_DEFAULT_PERIODS: Record<ClassId, Record<string, number>> = {
    G2A: { Sunday: 8, Monday: 2, Tuesday: 3, Wednesday: 1, Thursday: 5 },
    G2B: { Sunday: 2, Monday: 5, Tuesday: 1, Wednesday: 5, Thursday: 4 },
    G2C: { Sunday: 3, Monday: 8, Tuesday: 4, Wednesday: 7, Thursday: 6 },
  };

  // Check if text has global Math notes (e.g. bring whiteboard, marker & 100 chart)
  const mathNotesRegex = /(?:white\s*board|whiteboard|marker|100\s*chart|سبورة|لوحة بيضاء)/i;
  const hasGlobalMathNote = mathNotesRegex.test(text);

  if (hasGlobalMathNote) {
    // Add notes for all school days for this class
    for (const d of days) {
      tomorrowNotes.push({
        day: d,
        subject: 'Mathematics',
        label: 'notes',
        note: 'Please bring a small white board, marker and 100 chart.',
        bagItem: 'Small Whiteboard, Dry-Erase Marker & 100-Chart',
      });
    }
  }

  for (const line of lines) {
    // Detect Day
    for (const d of days) {
      if (new RegExp(`^#*\\s*${d}`, 'i').test(line) || new RegExp(`\\b${d}\\b`, 'i').test(line)) {
        currentDay = d;
      }
    }
    if (/الأحد/i.test(line)) currentDay = 'Sunday';
    else if (/الاثنين|الإثنين/i.test(line)) currentDay = 'Monday';
    else if (/الثلاثاء/i.test(line)) currentDay = 'Tuesday';
    else if (/الأربعاء/i.test(line)) currentDay = 'Wednesday';
    else if (/الخميس/i.test(line)) currentDay = 'Thursday';

    // Detect Subject
    for (const s of subjects) {
      if (new RegExp(`\\b${s}\\b`, 'i').test(line)) currentSubject = s;
    }
    if (/عربي|لغة عربية/i.test(line)) currentSubject = 'Arabic';
    else if (/ماث|حساب|رياضيات|math/i.test(line)) currentSubject = 'Mathematics';
    else if (/انجليزي|انجلش|english/i.test(line)) currentSubject = 'English';
    else if (/علوم|ساينس|science/i.test(line)) currentSubject = 'Science';
    else if (/دراسات|social/i.test(line)) currentSubject = 'Social Studies';
    else if (/فرنساوي|فرنسي|french/i.test(line)) currentSubject = 'French';
    else if (/دين|تربية دينية|religion/i.test(line)) currentSubject = 'Religion';
    else if (/حاسب|تكنولوجيا|ict/i.test(line)) currentSubject = 'ICT';
    else if (/رسم|فنية|art/i.test(line)) currentSubject = 'Arts';
    else if (/موسيقى|music/i.test(line)) currentSubject = 'Music';
    else if (/ألعاب|رياضية|pe/i.test(line)) currentSubject = 'PE';

    // Detect Note / Remarque / ملاحظات
    const isNote = /note|notes|remarque|ملاحظة|ملاحظات|bring|احضار|إحضار/i.test(line);
    const isHw = /hw|homework|واجب|h\.w/i.test(line);
    const clean = line.replace(/^(hw|cw|h\.w|c\.w|homework|classwork|واجب|حصة|note|notes|remarque|ملاحظات)[:\-–\s]*/i, '').trim();

    if (isNote && !hasGlobalMathNote) {
      tomorrowNotes.push({
        day: currentDay,
        subject: currentSubject,
        label: getSubjectNoteLabel(currentSubject),
        note: clean || line,
        bagItem: clean,
      });
    } else if (isHw) {
      let dueDay = currentDay === 'Thursday' ? 'Sunday' : 'Monday';
      if (currentDay === 'Tuesday' && currentSubject === 'Mathematics') {
        dueDay = 'Wednesday';
      }
      homework.push({
        classId,
        assignedDay: currentDay,
        dueDay,
        subject: currentSubject,
        task: clean || line,
        completed: false,
        priority: /urgent|هام|اختبار|quiz|test/i.test(line) ? 'urgent' : 'normal',
      });
    } else if (clean.length > 3) {
      // Determine period
      let assignedPeriod = (classwork.length % 8) + 1;
      if (currentSubject === 'Mathematics' && MATH_DEFAULT_PERIODS[classId]?.[currentDay]) {
        assignedPeriod = MATH_DEFAULT_PERIODS[classId][currentDay];
      }

      classwork.push({
        classId,
        day: currentDay,
        period: assignedPeriod,
        subject: currentSubject,
        title: clean,
        completed: false,
      });
    }
  }

  return { classwork, homework, tomorrowNotes };
}
