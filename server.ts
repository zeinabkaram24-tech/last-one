import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client safely (lazy initialization)
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Heuristic fallback parser if no API key is provided or if network fails
function heuristicParser(planText: string, classId: string) {
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

  const classwork: any[] = [];
  const homework: any[] = [];
  const tomorrowNotes: any[] = [];

  let currentDay = 'Sunday';
  let currentSubject = 'English';

  // Specific naming convention for tomorrow notes:
  // Arabic: ملاحظات | French: remarque | All other subjects: notes
  const getSubjectNoteLabel = (subj: string): string => {
    const s = (subj || '').toLowerCase();
    if (s.includes('arabic') || s.includes('عربي')) return 'ملاحظات';
    if (s.includes('french') || s.includes('français') || s.includes('فرنش')) return 'remarque';
    return 'notes';
  };

  // Timetable periods for Mathematics in Grade 2
  const MATH_PERIOD_MAP: Record<string, Record<string, number>> = {
    G2A: { Sunday: 8, Monday: 2, Tuesday: 3, Wednesday: 1, Thursday: 5 },
    G2B: { Sunday: 2, Monday: 5, Tuesday: 1, Wednesday: 5, Thursday: 4 },
    G2C: { Sunday: 3, Monday: 8, Tuesday: 4, Wednesday: 7, Thursday: 6 },
  };

  // Check if text has global Math notes (e.g. bring whiteboard, marker & 100 chart)
  const mathNotesRegex = /(?:white\s*board|whiteboard|marker|100\s*chart|سبورة|لوحة بيضاء)/i;
  const hasGlobalMathNote = mathNotesRegex.test(planText);

  if (hasGlobalMathNote) {
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

    // Identify Note indicators
    const isNote = /note|notes|remarque|ملاحظة|ملاحظات|bring|احضار|إحضار/i.test(line);
    // Identify Homework indicators
    const isHw = /hw|homework|واجب|h\.w/i.test(line);
    // Identify Classwork indicators
    const isCw = /cw|classwork|صف|حصة|درس|c\.w/i.test(line);

    const cleanText = line.replace(/^(hw|cw|h\.w|c\.w|homework|classwork|واجب|حصة|note|notes|remarque|ملاحظات)[:\-–\s]*/i, '').trim();

    if (isNote && !hasGlobalMathNote) {
      tomorrowNotes.push({
        day: currentDay,
        subject: currentSubject,
        label: getSubjectNoteLabel(currentSubject),
        note: cleanText || line,
        bagItem: cleanText,
      });
    } else if (isHw) {
      const nextDayMap: Record<string, string> = {
        Sunday: 'Monday',
        Monday: 'Tuesday',
        Tuesday: currentSubject === 'Mathematics' ? 'Wednesday' : 'Wednesday',
        Wednesday: 'Thursday',
        Thursday: 'Sunday',
      };
      homework.push({
        classId: classId || 'G2B',
        assignedDay: currentDay,
        dueDay: nextDayMap[currentDay] || 'Monday',
        subject: currentSubject,
        task: cleanText || line,
        completed: false,
        priority: /urgent|هام|ضروري|quiz|امتحان|test/i.test(line) ? 'urgent' : 'normal',
      });
    } else if (isCw || cleanText.length > 5) {
      let assignedPeriod = (classwork.length % 8) + 1;
      const targetClass = classId || 'G2B';
      if (currentSubject === 'Mathematics' && MATH_PERIOD_MAP[targetClass]?.[currentDay]) {
        assignedPeriod = MATH_PERIOD_MAP[targetClass][currentDay];
      }

      classwork.push({
        classId: targetClass,
        day: currentDay,
        period: assignedPeriod,
        subject: currentSubject,
        title: cleanText || line,
        completed: false,
      });
    }
  }

  return { classwork, homework, tomorrowNotes };
}

// API endpoint to parse Weekly Plan using Gemini or fallback
app.post('/api/parse-weekly-plan', async (req, res) => {
  try {
    const { planText, classId } = req.body;
    if (!planText || typeof planText !== 'string') {
      return res.status(400).json({ error: 'planText is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      console.log('No GEMINI_API_KEY set, using smart heuristic parser.');
      const parsed = heuristicParser(planText, classId);
      return res.json(parsed);
    }

    const prompt = `
You are an expert school coordinator assistant for Nile Egyptian International School, Grade 2 (${classId || 'G2B'}).
The user provided their weekly plan text (which can be in English, Arabic, or mixed).
Your job is to read the plan, categorize it accurately into its places for all days, extract any notes/materials needed, and adhere strictly to naming conventions.

### CRITICAL RULES FOR TOMORROW NOTES NAMING:
When creating items for "tomorrowNotes" or notes for a subject:
- For Arabic ('Arabic'): the note category/label MUST be "ملاحظات".
- For French ('French'): the note category/label MUST be "remarque".
- For all other subjects ('Mathematics', 'English', 'Science', etc.): the note category/label MUST be "notes".

### GRADE 2 MATHEMATICS TIMETABLE PERIODS:
- For G2A: Sunday: Period 8, Monday: Period 2, Tuesday: Periods 3 & 4, Wednesday: Period 1, Thursday: Period 5.
- For G2B: Sunday: Period 2, Monday: Periods 5 & 6, Tuesday: Period 1, Wednesday: Period 5, Thursday: Period 4.
- For G2C: Sunday: Periods 3 & 4, Monday: Period 8, Tuesday: Period 4, Wednesday: Period 7, Thursday: Period 6.

### OUTPUT STRUCTURE:
Extract and categorize:
1. "classwork": An array of lessons/topics taught in class for that day and period.
   Each item:
   - "classId": "${classId || 'G2B'}"
   - "day": One of "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"
   - "period": Number (1 to 8, matching the timetable if available)
   - "subject": One of "Mathematics", "English", "Arabic", "Science", "Social Studies", "French", "Religion", "ICT", "Arts", "Music", "PE"
   - "title": Short descriptive title of the topic/lesson
   - "details": Optional additional instructions or practice details
   - "pages": Optional page numbers or resource name
   - "completed": false

2. "homework": An array of homework tasks assigned.
   Each item:
   - "classId": "${classId || 'G2B'}"
   - "assignedDay": One of "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"
   - "dueDay": One of "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"
   - "subject": One of "Mathematics", "English", "Arabic", "Science", "Social Studies", "French", "Religion", "ICT", "Arts", "Music", "PE"
   - "task": The homework description
   - "details": Extra notes or materials needed
   - "pages": Page reference
   - "completed": false
   - "priority": "normal" or "urgent" (urgent if quiz, test, or due tomorrow)

3. "tomorrowNotes": Items to bring, pack, or special reminders for each day:
   - "day": One of "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"
   - "subject": Subject name (e.g. "Mathematics", "French", "Arabic")
   - "label": "ملاحظات" for Arabic, "remarque" for French, "notes" for all other subjects
   - "note": The reminder text (e.g. "Please bring a small white board, marker and 100 chart")
   - "bagItem": Bag item to prepare

Return ONLY valid JSON matching this structure without Markdown fences or commentary:
{
  "classwork": [...],
  "homework": [...],
  "tomorrowNotes": [...]
}

User's Weekly Plan Text:
${planText}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '';
    try {
      const parsed = JSON.parse(textOutput);
      return res.json({
        classwork: parsed.classwork || [],
        homework: parsed.homework || [],
        tomorrowNotes: parsed.tomorrowNotes || [],
      });
    } catch (parseErr) {
      console.warn('Gemini JSON parse failed, falling back to heuristic:', parseErr);
      const fallback = heuristicParser(planText, classId);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Error in /api/parse-weekly-plan:', error);
    // Fall back gracefully instead of crashing
    const fallback = heuristicParser(req.body?.planText || '', req.body?.classId || 'G2B');
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
