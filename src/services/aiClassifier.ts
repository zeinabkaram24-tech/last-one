import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClassId, ParsedWeeklyPlanResponse, SchoolDay, SubjectName } from '../types';
import { CLASS_TIMETABLES } from '../data/timetables';

// Third session mapping for French and ICT as strictly requested
const THIRD_SESSION_MAP: Record<string, { French: string; ICT: string }> = {
  G2A: { French: 'Thursday', ICT: 'Wednesday' },
  G2B: { French: 'Tuesday', ICT: 'Wednesday' },
  G2C: { French: 'Wednesday', ICT: 'Thursday' },
};

// Normalize subject names across multilingual variants (including Arabic & English)
function normalizeSubject(sub: string): SubjectName {
  if (!sub) return 'English';
  const s = sub.trim().toLowerCase();
  if (
    s.includes('soc') ||
    s.includes('دراسات') ||
    s.includes('سوشيال') ||
    s.includes('سوشيل') ||
    s.includes('اجتماع')
  ) return 'Social Studies';
  if (s.includes('math') || s.includes('حساب') || s.includes('رياض') || s.includes('ماث')) return 'Mathematics';
  if (s.includes('eng') || s.includes('إنجل') || s.includes('انجل') || s.includes('انجلش')) return 'English';
  if (s.includes('arab') || s.includes('عرب')) return 'Arabic';
  if (s.includes('sci') || s.includes('علوم') || s.includes('ساينس')) return 'Science';
  if (s.includes('fren') || s.includes('franç') || s.includes('فرنس') || s.includes('فرنساوي') || s.includes('فرنش')) return 'French';
  if (s.includes('relig') || s.includes('دين') || s.includes('islam') || s.includes('اسلام') || s.includes('إسلام')) return 'Religion';
  if (s.includes('ict') || s.includes('comp') || s.includes('حاسب') || s.includes('تكنول') || s.includes('اي سي تي') || s.includes('كمبيوتر')) return 'ICT';
  if (s.includes('art') || s.includes('رسم') || s.includes('فني') || s.includes('فنية') || s.includes('ارت') || s.includes('آرت')) return 'Arts';
  if (s.includes('music') || s.includes('موسيق') || s.includes('ميوزيك')) return 'Music';
  if (s.includes('pe') || s.includes('sport') || s.includes('رياضي') || s.includes('بدن') || s.includes('ألعاب')) return 'PE';
  return (sub.charAt(0).toUpperCase() + sub.slice(1)) as SubjectName;
}

// Timetable-aligned slot allocator for each specific class
function allocateClassworkSlot(
  classId: string,
  preferredDay: string,
  subject: string,
  usedSlots: Map<string, Set<string>>,
  itemWeek: number = 1
): { day: string; period: number } | null {
  const normSub = normalizeSubject(subject);
  const classTimetable = (CLASS_TIMETABLES as any)?.[classId];
  if (!classTimetable) return { day: preferredDay, period: 1 };

  const classKey = `${itemWeek}-${classId}-${normSub}`;
  const classUsed = usedSlots.get(classKey) || new Set<string>();

  // 1. Try preferred day first if unused
  const daySlots = classTimetable[preferredDay] || [];
  const unusedMatchOnDay = daySlots.find(
    (slot: any) => normalizeSubject(slot.subject) === normSub && !classUsed.has(`${preferredDay}-${slot.period}`)
  );
  if (unusedMatchOnDay) {
    classUsed.add(`${preferredDay}-${unusedMatchOnDay.period}`);
    usedSlots.set(classKey, classUsed);
    return { day: preferredDay, period: unusedMatchOnDay.period };
  }

  // 2. Try other days of the school week in timetable order
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  for (const d of days) {
    const slots = classTimetable[d] || [];
    const unusedMatch = slots.find(
      (slot: any) => normalizeSubject(slot.subject) === normSub && !classUsed.has(`${d}-${slot.period}`)
    );
    if (unusedMatch) {
      classUsed.add(`${d}-${unusedMatch.period}`);
      usedSlots.set(classKey, classUsed);
      return { day: d, period: unusedMatch.period };
    }
  }

  // Fallback if all scheduled slots are used
  const preferredSlots = classTimetable[preferredDay] || [];
  const existingSubSlot = preferredSlots.find((slot: any) => normalizeSubject(slot.subject) === normSub);
  const fallbackPeriod = existingSubSlot ? existingSubSlot.period : (preferredSlots.length > 0 ? preferredSlots[0].period : 2);
  return { day: preferredDay || 'Sunday', period: fallbackPeriod };
}

// Helper to fix and normalize page numbers
function normalizePageNumbers(pagesStr?: any): string | undefined {
  if (!pagesStr || typeof pagesStr !== 'string') return undefined;
  let s = pagesStr.trim();
  if (!s || /^(none|لا يوجد|\-|\/|n\/a)$/i.test(s)) return undefined;

  s = s.replace(/\b42\b/g, '24')
       .replace(/\b41-42\b/g, '14-24')
       .replace(/\b42-41\b/g, '14-24')
       .replace(/\b81-51\b/g, '15-18')
       .replace(/\b51-81\b/g, '15-18')
       .replace(/\b49-50\b/g, '29-32')
       .replace(/\b94-05\b/g, '29-32')
       .replace(/\b05-94\b/g, '29-32');

  if (/^(\d+[\d\s\-\–]*\d*)$/.test(s)) {
    s = `ص ${s}`;
  }
  return s;
}

// Clean and Parse JSON from Gemini markdown
function cleanAndParseJson(text: string): any {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty or invalid response from AI');
  }
  let clean = text.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const firstBrace = clean.search(/[{\[]/);
  const lastBrace = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']'));
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(clean);
}

// Post-process response to align with timetable
function postProcessParsedPlan(
  raw: { classwork?: any[]; homework?: any[]; tomorrowNotes?: any[] },
  block: number = 1,
  week: number = 1,
  targetClasses: string[] = ['G2A', 'G2B', 'G2C']
): ParsedWeeklyPlanResponse {
  const classwork: any[] = [];
  const homework: any[] = [];
  const rawTomorrowNotes: any[] = Array.isArray(raw.tomorrowNotes) ? [...raw.tomorrowNotes] : [];

  const urlRegex = /(https?:\/\/[^\s)"]+)/i;
  const testRegex = /\b(quiz|test|exam|dictation)\b|اختبار|امتحان|كويز|إملاء|تسميع|تقييم/i;
  const bagRegex = /كشكول|كتاب|ألوان|مسطرة|أدوات|زي|sketch|whiteboard|markers?|notebook|cahier|palette|ورق/i;

  const rawCw = Array.isArray(raw.classwork) ? raw.classwork : [];
  const rawHw = Array.isArray(raw.homework) ? raw.homework : [];

  const usedSlots = new Map<string, Set<string>>();
  const seenCwKeys = new Set<string>();

  for (const item of rawCw) {
    const normSub = normalizeSubject(item.subject);
    const itemWeek = Number(item.week) || week;
    const classesForThisItem = (item.classId && item.classId !== 'ALL' && targetClasses.includes(item.classId))
      ? [item.classId]
      : targetClasses;

    const rawTitle = (item.title || item.details || '').trim();
    if (!rawTitle) continue;

    for (const classId of classesForThisItem) {
      const dedupeKey = `${itemWeek}-${classId}-${normSub}-${rawTitle.slice(0, 40).toLowerCase()}`;
      if (seenCwKeys.has(dedupeKey)) continue;

      const preferredDay = item.day || 'Sunday';
      const slot = allocateClassworkSlot(classId, preferredDay, normSub, usedSlots, itemWeek);
      if (!slot) continue;

      seenCwKeys.add(dedupeKey);

      let linkUrl = item.linkUrl;
      let linkTitle = item.linkTitle;
      const combinedCwText = `${item.title || ''} ${item.details || ''}`;
      if (!linkUrl) {
        const urlMatch = combinedCwText.match(urlRegex);
        if (urlMatch) {
          linkUrl = urlMatch[1];
          linkTitle = linkTitle || (normSub === 'French' ? 'Lien Kahoot / Activité 🔗' : 'رابط الدرس 🔗');
        }
      }

      if (testRegex.test(combinedCwText)) {
        rawTomorrowNotes.push({
          classId,
          targetDay: slot.day,
          subject: normSub,
          note: item.title || 'Classroom Quiz / Test',
          arabicNote: (item.title && /اختبار|امتحان|كويز|إملاء|تسميع|تقييم/.test(item.title))
            ? item.title
            : `اختبار / Quiz في مادة ${normSub}: ${item.title || ''}`,
          isQuiz: true,
          categoryType: 'quiz',
          block,
          week: itemWeek,
        });
      }

      classwork.push({
        id: `cw-b${block}-w${itemWeek}-${classId}-${slot.day}-p${slot.period}-${Math.random().toString(36).substring(2, 7)}`,
        classId,
        day: slot.day,
        period: slot.period,
        subject: normSub,
        title: item.title || `${normSub} Lesson`,
        details: item.details || undefined,
        pages: normalizePageNumbers(item.pages),
        completed: false,
        block,
        week: itemWeek,
        linkUrl: linkUrl || undefined,
        linkTitle: linkTitle || undefined,
      });
    }
  }

  const seenHwKeys = new Set<string>();

  for (const item of rawHw) {
    const normSub = normalizeSubject(item.subject);
    const itemWeek = Number(item.week) || week;
    const classesForThisItem = (item.classId && item.classId !== 'ALL' && targetClasses.includes(item.classId))
      ? [item.classId]
      : targetClasses;

    const rawTask = (item.task || item.details || '').trim();
    if (!rawTask) continue;

    for (const classId of classesForThisItem) {
      const dedupeKey = `${itemWeek}-${classId}-${normSub}-${rawTask.slice(0, 40).toLowerCase()}`;
      if (seenHwKeys.has(dedupeKey)) continue;
      seenHwKeys.add(dedupeKey);

      let assignedDay = item.assignedDay || 'Sunday';
      let dueDay = item.dueDay || 'Monday';

      if (normSub === 'French') {
        assignedDay = THIRD_SESSION_MAP[classId]?.French || assignedDay;
        dueDay = assignedDay === 'Thursday' ? 'Sunday' : 'Monday';
      } else if (normSub === 'ICT') {
        assignedDay = THIRD_SESSION_MAP[classId]?.ICT || assignedDay;
        dueDay = assignedDay === 'Thursday' ? 'Sunday' : 'Monday';
      }

      let linkUrl = item.linkUrl;
      let isLinkTask = Boolean(item.isLinkTask);
      const combinedHwText = `${item.task || ''} ${item.details || ''}`;
      if (!linkUrl) {
        const urlMatch = combinedHwText.match(urlRegex);
        if (urlMatch) {
          linkUrl = urlMatch[1];
          isLinkTask = true;
        }
      }

      const isTestHw = testRegex.test(combinedHwText);
      if (isTestHw) {
        const targetDay = dueDay || assignedDay;
        rawTomorrowNotes.push({
          classId,
          targetDay,
          subject: normSub,
          note: item.task || 'Homework Quiz / Test Reminder',
          arabicNote: (item.task && /اختبار|امتحان|كويز|إملاء|تسميع|تقييم/.test(item.task))
            ? item.task
            : `اختبار / Quiz (${normSub}): ${item.task || ''}`,
          isQuiz: true,
          categoryType: 'quiz',
          block,
          week: itemWeek,
        });
      }

      homework.push({
        id: `hw-b${block}-w${itemWeek}-${classId}-${normSub.toLowerCase()}-${assignedDay}-${Math.random().toString(36).substring(2, 7)}`,
        classId,
        assignedDay,
        dueDay,
        subject: normSub,
        task: item.task || 'Homework task',
        details: item.details || undefined,
        pages: normalizePageNumbers(item.pages),
        completed: false,
        priority: (item.priority === 'urgent' || isTestHw) ? 'urgent' : 'normal',
        block,
        week: itemWeek,
        linkUrl: linkUrl || undefined,
        isLinkTask: isLinkTask || undefined,
      });
    }
  }

  const tomorrowNotes: any[] = [];
  const seenNoteKeys = new Set<string>();

  for (const item of rawTomorrowNotes) {
    const normSub = normalizeSubject(item.subject);
    const itemWeek = Number(item.week) || week;
    const classesForThisItem = (item.classId && item.classId !== 'ALL' && targetClasses.includes(item.classId))
      ? [item.classId]
      : targetClasses;

    for (const classId of classesForThisItem) {
      const targetDay = item.targetDay || item.day || 'Sunday';
      const rawNote = (item.note || item.arabicNote || '').trim();
      if (!rawNote) continue;

      const isQuiz = Boolean(
        item.isQuiz || item.categoryType === 'quiz' || testRegex.test(rawNote + ' ' + (item.arabicNote || ''))
      );

      let bagItem = item.bagItem;
      if (!bagItem && bagRegex.test(rawNote + ' ' + (item.arabicNote || ''))) {
        bagItem = item.arabicNote || rawNote;
      }

      const dedupeKey = `${itemWeek}-${classId}-${targetDay}-${normSub}-${rawNote.slice(0, 30)}`;
      if (seenNoteKeys.has(dedupeKey)) continue;
      seenNoteKeys.add(dedupeKey);

      tomorrowNotes.push({
        classId,
        targetDay,
        subject: normSub,
        note: item.note || rawNote,
        arabicNote: item.arabicNote || rawNote,
        bagItem: bagItem || undefined,
        isQuiz,
        categoryType: isQuiz ? 'quiz' : 'note',
        block,
        week: itemWeek,
      });
    }
  }

  return {
    classwork,
    homework,
    tomorrowNotes,
  };
}

// Convert File to Base64 (helper for client-side multi-modal input)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Master Client-side parsing function leveraging Gemini API directly
export async function parseWeeklyPlanWithAI(
  planText: string,
  classId: ClassId | 'ALL',
  block: number = 1,
  week: number = 2,
  pdfFile?: File
): Promise<ParsedWeeklyPlanResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === 'null') {
    alert('تنبيه: مفتاح الـ API الخاص بـ Gemini (VITE_GEMINI_API_KEY) غير موجود في المتغيرات الافتراضية. يرجى تهيئة المفتاح لتشغيل القارئ الذكي.');
    throw new Error('VITE_GEMINI_API_KEY is missing or undefined.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const targetClasses: string[] = classId === 'ALL' ? ['G2A', 'G2B', 'G2C'] : [classId];
    const timetableContext = {};
    for (const cid of targetClasses) {
      (timetableContext as any)[cid] = CLASS_TIMETABLES[cid as ClassId] || {};
    }

    const systemPrompt = `
You are the expert Senior Academic Coordinator for Nile Egyptian International Schools (Grade 2).
You are analyzing an official Nile School Grade 2 Weekly Plan (Block ${block}, Week ${week}) for class(es): ${targetClasses.join(', ')}.

Timetable Context:
${JSON.stringify(timetableContext, null, 2)}

MANDATORY PARSING & MAPPING RULES:
1. "classwork" (أعمال الفصل):
   - "الـ Classwork هو هو أعمال الفصل": Map all in-class lessons, page numbers, and practice exercises to "classwork".
   - Match each lesson to the EXACT period slot for that day from the class timetable.
   - LINKS: If there are ANY links or URLs in the classwork (e.g. Kahoot, Wordwall, YouTube, Drive), extract them into "linkUrl" and set a descriptive "linkTitle" (e.g. "Lien Kahoot / Activité 🔗" or "رابط الدرس 🔗").
   - Format:
     {
       "classId": "G2A" | "G2B" | "G2C",
       "day": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "subject": "Mathematics" | "English" | "Arabic" | "Science" | "Social Studies" | "French" | "Religion" | "ICT" | "Arts" | "Music" | "PE",
       "title": "Short descriptive lesson title",
       "details": "Details or workbook exercises",
       "pages": "Page numbers (e.g. p. 24-26 or ص 47)",
       "linkUrl": "Optional URL if present",
       "linkTitle": "Optional title for link"
     }

2. "homework" (الواجب المنزلي):
   - "الـ Homework هو هو الواجب المنزلي": Map all homework, workbook exercises, and home tasks to "homework".
   - STRICT RULE: For French and ICT, homework is ALWAYS assigned on the 3rd period/session of the week:
     * G2A: French Thursday, ICT Wednesday
     * G2B: French Tuesday, ICT Wednesday
     * G2C: French Wednesday, ICT Thursday
   - LINKS: If there are links or URLs in the homework, extract them into "linkUrl" and set "isLinkTask": true.
   - Format:
     {
       "classId": "G2A" | "G2B" | "G2C",
       "assignedDay": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "dueDay": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "subject": "Mathematics" | "English" | "Arabic" | "Science" | "Social Studies" | "French" | "Religion" | "ICT" | "Arts" | "Music" | "PE",
       "task": "Clear homework description",
       "details": "Extra notes or links",
       "pages": "Page numbers",
       "priority": "normal" | "urgent",
       "linkUrl": "Optional URL if present",
       "isLinkTask": true // if link present
     }

3. "tomorrowNotes" (تنبيهات الغد، الملاحظات، الكويزات والاختبارات):
   - STRICT USER REQUIREMENT 1: "ولو في كلمة Quiz أو Test أو اختبار بتنزل في الـ Tomorrow"
     * ANY Quiz, Test, Exam, Short Test, Dictation, اختبار, كويز, امتحان, تسميع, تقييم mentioned in the plan MUST be added to "tomorrowNotes" for the target day so students are alerted immediately!
     * Set "isQuiz": true and "categoryType": "quiz".
   - STRICT USER REQUIREMENT 2: "الملاحظات في العربي والسوشيال بتبقى اسمها ملاحظات، في الفرنش بتبقى اسمها Remarque، في باقي المواد بتبقى اسمها Notes"
     * For Arabic & Social Studies: Notes and instructions must be classified as "ملاحظات".
     * For French: Notes and instructions must be classified as "Remarque".
     * For all other subjects: Notes must be classified as "Notes".
   - Format:
     {
       "classId": "G2A" | "G2B" | "G2C",
       "targetDay": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "subject": "Mathematics" | "English" | "Arabic" | "Science" | "Social Studies" | "French" | "Religion" | "ICT" | "Arts" | "Music" | "PE",
       "note": "Note text",
       "arabicNote": "Note text in Arabic",
       "bagItem": "Optional bag items to bring",
       "isQuiz": boolean,
       "categoryType": "note" | "quiz"
     }

CRITICAL RULES TO PREVENT DUPLICATION & PHANTOM SESSIONS:
- "الحصص التي لا يذكر لها أي بيانات أو لا يكون لها محتوى في الخطة لا تنزل مطلقاً في الـ Classwork".
- NEVER generate placeholder or filler sessions. Only create a classwork or homework item if the plan explicitly lists real educational content.

Return ONLY JSON block formatted like:
{
  "classwork": [...],
  "homework": [...],
  "tomorrowNotes": [...]
}
`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let responseText = '';
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Smart Reader] Attempting generation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        if (pdfFile) {
          const b64Data = await fileToBase64(pdfFile);
          const cleanB64 = b64Data.replace(/^data:application\/pdf;base64,/, '').trim();
          
          const parts: any[] = [
            {
              inlineData: {
                data: cleanB64,
                mimeType: 'application/pdf'
              }
            },
            { text: systemPrompt + `\n\nFallback Extracted Text:\n${planText}` }
          ];
          
          const response = await model.generateContent(parts);
          responseText = response.response.text();
        } else {
          const response = await model.generateContent(systemPrompt + `\n\nPlan Text:\n${planText}`);
          responseText = response.response.text();
        }

        if (responseText) {
          console.log(`[Smart Reader] Successfully generated content using model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Smart Reader] Model ${modelName} failed:`, err);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error('Gemini API returned an empty response for all attempted models.');
    }

    const rawParsed = cleanAndParseJson(responseText);
    const postProcessed = postProcessParsedPlan(rawParsed, block, week, targetClasses);
    return postProcessed;

  } catch (err: any) {
    console.error('Gemini API error detailed:', err);
    throw new Error(err.message || 'خطأ غير متوقع أثناء الاتصال بـ Gemini API');
  }
}

// Client-side quick parser fallback
export function fallbackClientParser(
  text: string,
  classId: ClassId | 'ALL',
  block: number = 1,
  week: number = 2
): ParsedWeeklyPlanResponse {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const classwork: any[] = [];
  const homework: any[] = [];
  const tomorrowNotes: any[] = [];
  let currentDay = 'Sunday';
  let currentSubject = 'English';

  const targetClasses: ClassId[] = classId === 'ALL' ? ['G2A', 'G2B', 'G2C'] : [classId];

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
      for (const targetCls of targetClasses) {
        tomorrowNotes.push({
          id: `note-${targetCls}-${currentDay}-${Date.now()}-${tomorrowNotes.length}`,
          classId: targetCls,
          targetDay: currentDay as any,
          subject: currentSubject,
          note: cleanNote,
          arabicNote: cleanNote,
          bagItem: /كشكول|كتاب|ألوان|مسطرة|أدوات|زي|sketch|whiteboard|notebook|cahier/i.test(line) ? cleanNote : undefined,
          isQuiz: testRegex.test(cleanNote),
          categoryType: testRegex.test(cleanNote) ? 'quiz' : 'note',
          block,
          week,
        });
      }
      continue;
    }

    // Check Quiz / Test Standalone
    const isTest = testRegex.test(line);
    if (isTest && !/cw|classwork|hw|homework/i.test(line)) {
      for (const targetCls of targetClasses) {
        tomorrowNotes.push({
          id: `quiz-${targetCls}-${currentDay}-${Date.now()}-${tomorrowNotes.length}`,
          classId: targetCls,
          targetDay: currentDay as any,
          subject: currentSubject,
          note: line,
          arabicNote: line,
          isQuiz: true,
          categoryType: 'quiz',
          block,
          week,
        });
      }
    }

    const isHw = /hw|homework|الواجب|الواجب المنزلي|devoir|h\.w/i.test(line);
    const isCw = /cw|classwork|أعمال الفصل|الصف|الحصة|درس|c\.w/i.test(line);
    const clean = line.replace(/^(hw|cw|h\.w|c\.w|homework|classwork|الواجب|الواجب المنزلي|أعمال الفصل|الحصة)[:\-–\s]*/i, '').trim();
    const urlMatch = line.match(urlRegex);

    if (isHw) {
      for (const targetCls of targetClasses) {
        if (isTest) {
          tomorrowNotes.push({
            id: `hw-quiz-${targetCls}-${currentDay}-${Date.now()}-${tomorrowNotes.length}`,
            classId: targetCls,
            targetDay: currentDay === 'Thursday' ? 'Sunday' : 'Monday',
            subject: currentSubject,
            note: clean || line,
            arabicNote: clean || line,
            isQuiz: true,
            categoryType: 'quiz',
            block,
            week,
          });
        }
        homework.push({
          id: `hw-${targetCls}-${currentDay}-${Date.now()}-${homework.length}`,
          classId: targetCls,
          assignedDay: currentDay as any,
          dueDay: currentDay === 'Thursday' ? 'Sunday' : 'Monday',
          subject: currentSubject as any,
          task: clean || line,
          completed: false,
          priority: isTest ? 'urgent' : 'normal',
          linkUrl: urlMatch ? urlMatch[1] : undefined,
          isLinkTask: Boolean(urlMatch),
          block,
          week,
        });
      }
    } else if (isCw || clean.length > 3) {
      for (const targetCls of targetClasses) {
        if (isTest) {
          tomorrowNotes.push({
            id: `cw-quiz-${targetCls}-${currentDay}-${Date.now()}-${tomorrowNotes.length}`,
            classId: targetCls,
            targetDay: currentDay as any,
            subject: currentSubject,
            note: clean || line,
            arabicNote: clean || line,
            isQuiz: true,
            categoryType: 'quiz',
            block,
            week,
          });
        }
        const daySchedule = (CLASS_TIMETABLES as any)?.[targetCls]?.[currentDay] || [];
        const matchedSlot = daySchedule.find((s: any) => s.subject === currentSubject);
        const resolvedPeriod = matchedSlot ? matchedSlot.period : Math.min((classwork.length % 6) + 1, 7);

        classwork.push({
          id: `cw-${targetCls}-${currentDay}-${Date.now()}-${classwork.length}`,
          classId: targetCls,
          day: currentDay as any,
          period: resolvedPeriod,
          subject: currentSubject as any,
          title: clean,
          completed: false,
          linkUrl: urlMatch ? urlMatch[1] : undefined,
          linkTitle: urlMatch ? (currentSubject === 'French' ? 'Lien Kahoot / Activité 🔗' : 'رابط الدرس 🔗') : undefined,
          block,
          week,
        });
      }
    }
  }

  return { classwork, homework, tomorrowNotes };
}
