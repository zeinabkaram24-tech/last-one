import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { CLASS_TIMETABLES } from './src/data/timetables';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to get GoogleGenAI client safely (lazy initialization)
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Third session mapping for French and ICT as strictly requested
const THIRD_SESSION_MAP: Record<string, { French: string; ICT: string }> = {
  G2A: { French: 'Thursday', ICT: 'Wednesday' },
  G2B: { French: 'Tuesday', ICT: 'Wednesday' },
  G2C: { French: 'Wednesday', ICT: 'Thursday' },
};

// Post-processing to enforce timetable alignment, 3rd session rules, and IDs
function postProcessParsedPlan(
  raw: { classwork?: any[]; homework?: any[]; tomorrowNotes?: any[] },
  block: number = 1,
  week: number = 1,
  targetClasses: string[] = ['G2A', 'G2B', 'G2C']
) {
  const classwork: any[] = [];
  const homework: any[] = [];
  const tomorrowNotes: any[] = [];

  const rawCw = Array.isArray(raw.classwork) ? raw.classwork : [];
  const rawHw = Array.isArray(raw.homework) ? raw.homework : [];
  const rawNotes = Array.isArray(raw.tomorrowNotes) ? raw.tomorrowNotes : [];

  // 1. Process Classwork
  for (const item of rawCw) {
    const classId = targetClasses.includes(item.classId) ? item.classId : targetClasses[0] || 'G2B';
    const day = item.day || 'Sunday';
    let period = Number(item.period) || 1;

    // Verify against timetable if possible
    const timetableDay = (CLASS_TIMETABLES as any)?.[classId]?.[day] || [];
    if (timetableDay.length > 0 && item.subject) {
      // Find matching period for this subject on this day
      const matchingSlot = timetableDay.find((slot: any) => slot.subject === item.subject);
      if (matchingSlot) {
        period = matchingSlot.period;
      }
    }

    classwork.push({
      id: `cw-b${block}-w${week}-${classId}-${day}-p${period}-${Math.random().toString(36).substring(2, 7)}`,
      classId,
      day,
      period,
      subject: item.subject || 'English',
      title: item.title || 'Lesson Topic',
      details: item.details || undefined,
      pages: item.pages || undefined,
      completed: false,
      block,
      week,
    });
  }

  // 2. Process Homework (Enforce 3rd session for French & ICT)
  for (const item of rawHw) {
    const classId = targetClasses.includes(item.classId) ? item.classId : targetClasses[0] || 'G2B';
    let assignedDay = item.assignedDay || 'Sunday';
    let dueDay = item.dueDay || 'Monday';
    const subject = item.subject || 'English';

    // Strict Rule: "عندنا الفرنش والـ ICT بيتحطوا الواجب بتاعهم في الحصة التالتة"
    if (subject === 'French') {
      assignedDay = THIRD_SESSION_MAP[classId]?.French || assignedDay;
      dueDay = assignedDay === 'Thursday' ? 'Sunday' : 'Monday';
    } else if (subject === 'ICT') {
      assignedDay = THIRD_SESSION_MAP[classId]?.ICT || assignedDay;
      dueDay = assignedDay === 'Thursday' ? 'Sunday' : 'Sunday';
    }

    homework.push({
      id: `hw-b${block}-w${week}-${classId}-${subject.toLowerCase()}-${assignedDay}-${Math.random().toString(36).substring(2, 7)}`,
      classId,
      assignedDay,
      dueDay,
      subject,
      task: item.task || 'Homework task',
      details: item.details || undefined,
      pages: item.pages || undefined,
      completed: false,
      priority: item.priority === 'urgent' ? 'urgent' : 'normal',
      block,
      week,
    });
  }

  // 3. Process Tomorrow Notes (Remarks & Arabic/Social notes)
  for (const item of rawNotes) {
    const classId = targetClasses.includes(item.classId) ? item.classId : targetClasses[0] || 'G2B';
    tomorrowNotes.push({
      classId,
      targetDay: item.targetDay || item.day || 'Sunday',
      subject: item.subject || 'General',
      note: item.note || '',
      arabicNote: item.arabicNote || item.note || '',
      bagItem: item.bagItem || undefined,
      block,
      week,
    });
  }

  return { classwork, homework, tomorrowNotes };
}

// Smart heuristic fallback parser
function heuristicParser(planText: string, classId: string, block: number = 1, week: number = 1) {
  const lines = planText.split('\n').map((l) => l.trim()).filter(Boolean);
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
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const rawCw: any[] = [];
  const rawHw: any[] = [];
  const rawNotes: any[] = [];

  let currentDay = 'Sunday';
  let currentSubject = 'English';

  for (const line of lines) {
    // Check if line indicates a day
    for (const d of days) {
      if (new RegExp(`^#*\\s*${d}`, 'i').test(line) || new RegExp(`\\b${d}\\b`, 'i').test(line)) {
        currentDay = d;
        break;
      }
    }

    // Check Arabic days
    if (/الأحد/i.test(line)) currentDay = 'Sunday';
    else if (/الاثنين|الإثنين/i.test(line)) currentDay = 'Monday';
    else if (/الثلاثاء/i.test(line)) currentDay = 'Tuesday';
    else if (/الأربعاء/i.test(line)) currentDay = 'Wednesday';
    else if (/الخميس/i.test(line)) currentDay = 'Thursday';

    // Check subject
    for (const s of subjects) {
      if (new RegExp(`\\b${s}\\b`, 'i').test(line)) {
        currentSubject = s;
        break;
      }
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

    // Check Notes / Remarks for Tomorrow
    const isNote = /ملاحظات|ملاحظة|remarque|remarks|note|أدوات|تنبيه/i.test(line);
    if (isNote) {
      const cleanNote = line.replace(/^(ملاحظات|ملاحظة|remarques?|remarks?|notes?|أدوات)[:\-–\s]*/i, '').trim();
      rawNotes.push({
        classId: classId || 'G2B',
        targetDay: currentDay,
        subject: currentSubject,
        note: cleanNote,
        arabicNote: cleanNote,
        bagItem: /كشكول|كتاب|ألوان|مسطرة|أدوات|زي|sketch|whiteboard|notebook/i.test(line) ? cleanNote : undefined,
      });
      continue;
    }

    // Identify Homework indicators
    const isHw = /hw|homework|واجب|h\.w/i.test(line);
    // Identify Classwork indicators
    const isCw = /cw|classwork|صف|حصة|درس|c\.w/i.test(line);

    const cleanText = line.replace(/^(hw|cw|h\.w|c\.w|homework|classwork|واجب|حصة)[:\-–\s]*/i, '').trim();

    if (isHw) {
      const nextDayMap: Record<string, string> = {
        Sunday: 'Monday',
        Monday: 'Tuesday',
        Tuesday: 'Wednesday',
        Wednesday: 'Thursday',
        Thursday: 'Sunday',
      };
      rawHw.push({
        classId: classId || 'G2B',
        assignedDay: currentDay,
        dueDay: nextDayMap[currentDay] || 'Monday',
        subject: currentSubject,
        task: cleanText || line,
        completed: false,
        priority: /urgent|هام|ضروري|quiz|امتحان/i.test(line) ? 'urgent' : 'normal',
      });
    } else if (isCw || cleanText.length > 5) {
      rawCw.push({
        classId: classId || 'G2B',
        day: currentDay,
        period: (rawCw.length % 8) + 1,
        subject: currentSubject,
        title: cleanText || line,
        completed: false,
      });
    }
  }

  const targetClasses = classId === 'ALL' ? ['G2A', 'G2B', 'G2C'] : [classId || 'G2B'];
  return postProcessParsedPlan({ classwork: rawCw, homework: rawHw, tomorrowNotes: rawNotes }, block, week, targetClasses);
}

// Build timetable reference snippet for Gemini
function buildTimetableContext(targetClasses: string[]) {
  const result: Record<string, any> = {};
  for (const c of targetClasses) {
    if ((CLASS_TIMETABLES as any)[c]) {
      result[c] = (CLASS_TIMETABLES as any)[c];
    }
  }
  return result;
}

// Endpoint 1: Parse Weekly Plan from PDF buffer or text using Gemini
app.post('/api/parse-weekly-plan-pdf', async (req, res) => {
  try {
    const { pdfBase64, planText, block = 1, week = 2, targetClass = 'ALL' } = req.body;
    const targetClasses = targetClass === 'ALL' ? ['G2A', 'G2B', 'G2C'] : [targetClass];

    const ai = getGenAI();
    if (!ai) {
      console.log('No GEMINI_API_KEY set, using smart heuristic parser.');
      const parsed = heuristicParser(planText || '', targetClass, Number(block), Number(week));
      return res.json(parsed);
    }

    const timetableContext = buildTimetableContext(targetClasses);

    const systemPrompt = `
You are the expert Senior Academic Coordinator for Nile Egyptian International Schools (Grade 2).
You are analyzing an official Nile School Grade 2 Weekly Plan (Block ${block}, Week ${week}) for class(es): ${targetClasses.join(', ')}.

Analyze the document with extreme precision and extract three core components:

1. "classwork": An array of every lesson taught in class this week.
   - Match each subject lesson to the EXACT period slot for that day from the class timetable:
${JSON.stringify(timetableContext, null, 2)}
   - Each item format:
     {
       "classId": "${targetClasses[0]}", // or G2A, G2B, G2C
       "day": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "period": 1 to 8, // matching the exact period in the timetable for that subject
       "subject": "Mathematics" | "English" | "Arabic" | "Science" | "Social Studies" | "French" | "Religion" | "ICT" | "Arts" | "Music" | "PE",
       "title": "Short descriptive lesson title",
       "details": "Details or workbook exercises",
       "pages": "Page numbers (e.g. p. 24-26 or ص 47)"
     }

2. "homework": An array of all homework tasks assigned.
   - MANDATORY STRICT RULE: For French and ICT, the homework must ALWAYS be assigned on the day of the 3rd period/session of the week:
     * G2A: French 3rd session is Thursday (period 2). ICT 3rd session is Wednesday (period 3).
     * G2B: French 3rd session is Tuesday (period 7). ICT 3rd session is Wednesday (period 8).
     * G2C: French 3rd session is Wednesday (period 2). ICT 3rd session is Thursday (period 1).
   - For all other subjects (Arabic, Math, English, Science, Social Studies, Religion), homework is assigned on the day of the lesson.
   - Each item format:
     {
       "classId": "${targetClasses[0]}",
       "assignedDay": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "dueDay": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "subject": "Subject name",
       "task": "Clear homework description",
       "details": "Extra notes or links",
       "pages": "Page numbers",
       "priority": "normal" | "urgent"
     }

3. "tomorrowNotes": Teacher notes, supplies, bag items, and reminders for tomorrow.
   - USER SPECIFICATION:
     * French: Extract all "Remarks" / "Remarques" (e.g., Cahier, Vocabulaire, Devoirs).
     * Arabic: Extract all "ملاحظات" (كشكول، إملاء، تحضير...).
     * Social Studies: Extract all "ملاحظات" (كشكول، أدوات...).
     * Math / English / Science / Arts / PE: Extract all equipment, sketchbooks, sports uniforms, whiteboards & markers.
   - Each item format:
     {
       "classId": "${targetClasses[0]}",
       "targetDay": "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday",
       "subject": "Subject name",
       "note": "English or original note text",
       "arabicNote": "Clear Arabic translation or original Arabic note",
       "bagItem": "Specific school bag item or tool needed (e.g. لوحة بيضاء وقلم سبورة, كراسة الرسم)"
     }

Return ONLY valid JSON matching this schema:
{
  "classwork": [...],
  "homework": [...],
  "tomorrowNotes": [...]
}
`;

    const contents: any[] = [];
    if (pdfBase64 && typeof pdfBase64 === 'string') {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '').trim();
      contents.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      });
    }

    const textContent = planText ? `Extracted/Supplementary Weekly Plan Text:\n${planText}\n\n${systemPrompt}` : systemPrompt;
    contents.push({ text: textContent });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '';
    try {
      const parsed = JSON.parse(textOutput);
      const finalized = postProcessParsedPlan(parsed, Number(block), Number(week), targetClasses);
      return res.json(finalized);
    } catch (parseErr) {
      console.warn('Gemini JSON parse failed, falling back to heuristic:', parseErr);
      const fallback = heuristicParser(planText || textOutput, targetClass, Number(block), Number(week));
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Error in /api/parse-weekly-plan-pdf:', error);
    const fallback = heuristicParser(req.body?.planText || '', req.body?.targetClass || 'ALL', Number(req.body?.block || 1), Number(req.body?.week || 2));
    return res.json(fallback);
  }
});

// Endpoint 2: Existing text-based endpoint (backwards compatible)
app.post('/api/parse-weekly-plan', async (req, res) => {
  try {
    const { planText, classId, block = 1, week = 2 } = req.body;
    if (!planText || typeof planText !== 'string') {
      return res.status(400).json({ error: 'planText is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      const parsed = heuristicParser(planText, classId, Number(block), Number(week));
      return res.json(parsed);
    }

    const targetClasses = (!classId || classId === 'ALL') ? ['G2A', 'G2B', 'G2C'] : [classId];
    const timetableContext = buildTimetableContext(targetClasses);

    const prompt = `
You are the official Senior Academic Coordinator for Nile Egyptian International Schools (Grade 2).
Categorize and extract classwork, homework, and tomorrow notes for Nile Grade 2 (Block ${block}, Week ${week}, Classes: ${targetClasses.join(', ')}).

Rules:
1. "classwork": Match lessons to timetable slots:
${JSON.stringify(timetableContext, null, 2)}
2. "homework": STRICT RULE: For French and ICT, assign homework on the 3rd period/session of the week:
   - G2A: French Thursday, ICT Wednesday
   - G2B: French Tuesday, ICT Wednesday
   - G2C: French Wednesday, ICT Thursday
3. "tomorrowNotes":
   - French Remarks (Remarques)
   - Arabic ملاحظات
   - Social Studies ملاحظات
   - Math / Science / English / Arts / PE supplies and warnings
   Format: { classId, targetDay, subject, note, arabicNote, bagItem }

Return ONLY JSON:
{
  "classwork": [...],
  "homework": [...],
  "tomorrowNotes": [...]
}

Weekly Plan Text:
${planText}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '';
    try {
      const parsed = JSON.parse(textOutput);
      const finalized = postProcessParsedPlan(parsed, Number(block), Number(week), targetClasses);
      return res.json(finalized);
    } catch (parseErr) {
      console.warn('Gemini JSON parse failed, falling back to heuristic:', parseErr);
      const fallback = heuristicParser(planText, classId, Number(block), Number(week));
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Error in /api/parse-weekly-plan:', error);
    const fallback = heuristicParser(req.body?.planText || '', req.body?.classId || 'G2B', Number(req.body?.block || 1), Number(req.body?.week || 2));
    return res.json(fallback);
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
