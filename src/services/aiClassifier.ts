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
  let currentDay = 'Sunday';
  let currentSubject = 'English';

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

  const urlRegex = /(https?:\/\/[^\s)"]+)/i;
  const testRegex = /\b(quiz|test|exam|dictation)\b|اختبار|امتحان|كويز|إملاء|تسميع|تقييم/i;

  for (const line of lines) {
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

    // Check Notes / Remarks
    const isNote = /ملاحظات|ملاحظة|remarque|remarks|notes?|أدوات|تنبيه/i.test(line);
    if (isNote) {
      const cleanNote = line.replace(/^(ملاحظات|ملاحظة|remarques?|remarks?|notes?|أدوات|تنبيه)[:\-–\s]*/i, '').trim();
      tomorrowNotes.push({
        classId,
        targetDay: currentDay as any,
        subject: currentSubject,
        note: cleanNote,
        arabicNote: cleanNote,
        bagItem: /كشكول|كتاب|ألوان|مسطرة|أدوات|زي|sketch|whiteboard|notebook|cahier/i.test(line) ? cleanNote : undefined,
        isQuiz: testRegex.test(cleanNote),
        categoryType: testRegex.test(cleanNote) ? 'quiz' : 'note',
      });
      continue;
    }

    // Check Quiz / Test Standalone
    const isTest = testRegex.test(line);
    if (isTest && !/cw|classwork|hw|homework/i.test(line)) {
      tomorrowNotes.push({
        classId,
        targetDay: currentDay as any,
        subject: currentSubject,
        note: line,
        arabicNote: line,
        isQuiz: true,
        categoryType: 'quiz',
      });
    }

    const isHw = /hw|homework|الواجب|الواجب المنزلي|devoir|h\.w/i.test(line);
    const isCw = /cw|classwork|أعمال الفصل|الصف|الحصة|درس|c\.w/i.test(line);
    const clean = line.replace(/^(hw|cw|h\.w|c\.w|homework|classwork|الواجب|الواجب المنزلي|أعمال الفصل|الحصة)[:\-–\s]*/i, '').trim();
    const urlMatch = line.match(urlRegex);

    if (isHw) {
      if (isTest) {
        tomorrowNotes.push({
          classId,
          targetDay: currentDay === 'Thursday' ? 'Sunday' : 'Monday',
          subject: currentSubject,
          note: clean || line,
          arabicNote: clean || line,
          isQuiz: true,
          categoryType: 'quiz',
        });
      }
      homework.push({
        classId,
        assignedDay: currentDay as any,
        dueDay: currentDay === 'Thursday' ? 'Sunday' : 'Monday',
        subject: currentSubject as any,
        task: clean || line,
        completed: false,
        priority: isTest ? 'urgent' : 'normal',
        linkUrl: urlMatch ? urlMatch[1] : undefined,
        isLinkTask: Boolean(urlMatch),
      });
    } else if (isCw || clean.length > 3) {
      if (isTest) {
        tomorrowNotes.push({
          classId,
          targetDay: currentDay as any,
          subject: currentSubject,
          note: clean || line,
          arabicNote: clean || line,
          isQuiz: true,
          categoryType: 'quiz',
        });
      }
      classwork.push({
        classId,
        day: currentDay as any,
        period: (classwork.length % 8) + 1,
        subject: currentSubject as any,
        title: clean,
        completed: false,
        linkUrl: urlMatch ? urlMatch[1] : undefined,
        linkTitle: urlMatch ? (currentSubject === 'French' ? 'Lien Kahoot / Activité 🔗' : 'رابط الدرس 🔗') : undefined,
      });
    }
  }

  return { classwork, homework, tomorrowNotes };
}
