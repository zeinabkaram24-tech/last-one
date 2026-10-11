const fs = require('fs');

console.log('Starting English Block 2 - Week 1 Seeder...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

if (!plannerData.classwork) plannerData.classwork = [];
if (!plannerData.homework) plannerData.homework = [];
if (!plannerData.tomorrowNotes) plannerData.tomorrowNotes = [];

// 1. Clean existing Block 2 Week 1 English entries
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(Number(cw.block) === 2 && Number(cw.week) === 1 && (cw.subject === 'English' || cw.subject === 'english'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(Number(hw.block) === 2 && Number(hw.week) === 1 && (hw.subject === 'English' || hw.subject === 'english'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(Number(tn.block) === 2 && Number(tn.week) === 1 && (tn.subject === 'English' || tn.subject === 'english'))
);

// 2. Define Classwork for Block 2 Week 1 English (15 entries: 5 days x 3 classes)
const newClasswork = [
  // =================== Sunday (11/10/2026) ===================
  {
    id: "cw-b2-w1-G2A-Sunday-english",
    classId: "G2A",
    class_id: "G2A",
    day: "Sunday",
    period: 5,
    subject: "English",
    title: "Adding -ing",
    details: "Unit: Meet my family. Topic: Adding -ing. Classwork practice on page CW. 8.",
    pages: "CW. 8",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2B-Sunday-english",
    classId: "G2B",
    class_id: "G2B",
    day: "Sunday",
    period: 1,
    subject: "English",
    title: "Adding -ing",
    details: "Unit: Meet my family. Topic: Adding -ing. Classwork practice on page CW. 8.",
    pages: "CW. 8",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2C-Sunday-english",
    classId: "G2C",
    class_id: "G2C",
    day: "Sunday",
    period: 1,
    subject: "English",
    title: "Adding -ing",
    details: "Unit: Meet my family. Topic: Adding -ing. Classwork practice on page CW. 8.",
    pages: "CW. 8",
    completed: false,
    block: 2,
    week: 1
  },

  // =================== Monday (12/10/2026) ===================
  {
    id: "cw-b2-w1-G2A-Monday-english",
    classId: "G2A",
    class_id: "G2A",
    day: "Monday",
    period: 3,
    subject: "English",
    title: "Present continuous & Mr. Fox",
    details: "Unit: Meet my family. Grammar: Present continuous and Mr. Fox. Practice on page CW. 9.",
    pages: "CW. 9",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2B-Monday-english",
    classId: "G2B",
    class_id: "G2B",
    day: "Monday",
    period: 5,
    subject: "English",
    title: "Present continuous",
    details: "Unit: Meet my family. Grammar: Present continuous. Practice on page CW. 9.",
    pages: "CW. 9",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2C-Monday-english",
    classId: "G2C",
    class_id: "G2C",
    day: "Monday",
    period: 6,
    subject: "English",
    title: "Present continuous",
    details: "Unit: Meet my family. Grammar: Present continuous. Practice on page CW. 9.",
    pages: "CW. 9",
    completed: false,
    block: 2,
    week: 1
  },

  // =================== Tuesday (13/10/2026) ===================
  {
    id: "cw-b2-w1-G2A-Tuesday-english",
    classId: "G2A",
    class_id: "G2A",
    day: "Tuesday",
    period: 7,
    subject: "English",
    title: "Spelling Bee (Round 1)",
    details: "Unit: Meet my family. Spelling Bee Competition Round 1. Class competition on Week 1 Word List (40 words).",
    pages: "Words included below",
    completed: false,
    block: 2,
    week: 1,
    linkUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html",
    linkTitle: "قائمة كلمات Spelling Bee 🐝"
  },
  {
    id: "cw-b2-w1-G2B-Tuesday-english",
    classId: "G2B",
    class_id: "G2B",
    day: "Tuesday",
    period: 7,
    subject: "English",
    title: "Writing Mr. Fox",
    details: "Unit: Meet my family. Writing activity: Mr. Fox. Practice on page CW. 13.",
    pages: "CW. 13",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2C-Tuesday-english",
    classId: "G2C",
    class_id: "G2C",
    day: "Tuesday",
    period: 4,
    subject: "English",
    title: "Spelling Bee (Round 1)",
    details: "Unit: Meet my family. Spelling Bee Competition Round 1. Class competition on Week 1 Word List (40 words).",
    pages: "Words included below",
    completed: false,
    block: 2,
    week: 1,
    linkUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html",
    linkTitle: "قائمة كلمات Spelling Bee 🐝"
  },

  // =================== Wednesday (14/10/2026) ===================
  {
    id: "cw-b2-w1-G2A-Wednesday-english",
    classId: "G2A",
    class_id: "G2A",
    day: "Wednesday",
    period: 7,
    subject: "English",
    title: "Family members - My family story",
    details: "Unit: Meet my family. Reading & Vocabulary: Family members and My family story. Pages: CW. 4, 5, 6.",
    pages: "CW. 4, 5, 6",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2B-Wednesday-english",
    classId: "G2B",
    class_id: "G2B",
    day: "Wednesday",
    period: 1,
    subject: "English",
    title: "Spelling Bee (Round 1)",
    details: "Unit: Meet my family. Spelling Bee Competition Round 1. Class competition on Week 1 Word List (40 words).",
    pages: "Words included below",
    completed: false,
    block: 2,
    week: 1,
    linkUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html",
    linkTitle: "قائمة كلمات Spelling Bee 🐝"
  },
  {
    id: "cw-b2-w1-G2C-Wednesday-english",
    classId: "G2C",
    class_id: "G2C",
    day: "Wednesday",
    period: 4,
    subject: "English",
    title: "Family members - My family story",
    details: "Unit: Meet my family. Reading & Vocabulary: Family members and My family story. Pages: CW. 4, 5, 6.",
    pages: "CW. 4, 5, 6",
    completed: false,
    block: 2,
    week: 1
  },

  // =================== Thursday (15/10/2026) ===================
  {
    id: "cw-b2-w1-G2A-Thursday-english",
    classId: "G2A",
    class_id: "G2A",
    day: "Thursday",
    period: 6,
    subject: "English",
    title: "Writing",
    details: "Unit: Meet my family. Writing exercises on page CW. 13.",
    pages: "CW. 13",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2B-Thursday-english",
    classId: "G2B",
    class_id: "G2B",
    day: "Thursday",
    period: 3,
    subject: "English",
    title: "My Family",
    details: "Unit: Meet my family. Vocabulary & Reading: My Family. Exercises on pages CW. 4, 5, 6.",
    pages: "CW. 4, 5, 6",
    completed: false,
    block: 2,
    week: 1
  },
  {
    id: "cw-b2-w1-G2C-Thursday-english",
    classId: "G2C",
    class_id: "G2C",
    day: "Thursday",
    period: 3,
    subject: "English",
    title: "Writing Mr. Fox",
    details: "Unit: Meet my family. Writing exercises: Mr. Fox on page CW. 13.",
    pages: "CW. 13",
    completed: false,
    block: 2,
    week: 1
  }
];

// 3. Define Homework for Block 2 Week 1 English
const newHomework = [
  // --- Monday Homework (P.71, 73, 74) for G2A, G2B, G2C ---
  {
    id: "hw-b2-w1-G2A-english-p71-73-74",
    classId: "G2A",
    class_id: "G2A",
    assignedDay: "Monday",
    dueDay: "Tuesday",
    subject: "English",
    task: "English Activity Book - Pages 71, 73, 74",
    details: "Unit: Meet my family. Complete workbook exercises on pages 71, 73, and 74 (Present continuous & story activities).",
    pages: "P.71, 73, 74",
    completed: false,
    priority: "normal",
    block: 2,
    week: 1
  },
  {
    id: "hw-b2-w1-G2B-english-p71-73-74",
    classId: "G2B",
    class_id: "G2B",
    assignedDay: "Monday",
    dueDay: "Tuesday",
    subject: "English",
    task: "English Activity Book - Pages 71, 73, 74",
    details: "Unit: Meet my family. Complete workbook exercises on pages 71, 73, and 74 (Present continuous & story activities).",
    pages: "P.71, 73, 74",
    completed: false,
    priority: "normal",
    block: 2,
    week: 1
  },
  {
    id: "hw-b2-w1-G2C-english-p71-73-74",
    classId: "G2C",
    class_id: "G2C",
    assignedDay: "Monday",
    dueDay: "Tuesday",
    subject: "English",
    task: "English Activity Book - Pages 71, 73, 74",
    details: "Unit: Meet my family. Complete workbook exercises on pages 71, 73, and 74 (Present continuous & story activities).",
    pages: "P.71, 73, 74",
    completed: false,
    priority: "normal",
    block: 2,
    week: 1
  },

  // --- Thursday Homework (P. 70) for G2A, G2B, G2C ---
  {
    id: "hw-b2-w1-G2A-english-p70",
    classId: "G2A",
    class_id: "G2A",
    assignedDay: "Thursday",
    dueDay: "Sunday",
    subject: "English",
    task: "English Activity Book - Page 70",
    details: "Unit: Meet my family. Complete writing exercises on page 70 of the Activity Book.",
    pages: "P. 70",
    completed: false,
    priority: "normal",
    block: 2,
    week: 1
  },
  {
    id: "hw-b2-w1-G2B-english-p70",
    classId: "G2B",
    class_id: "G2B",
    assignedDay: "Thursday",
    dueDay: "Sunday",
    subject: "English",
    task: "English Activity Book - Page 70",
    details: "Unit: Meet my family. Complete writing exercises on page 70 of the Activity Book.",
    pages: "P. 70",
    completed: false,
    priority: "normal",
    block: 2,
    week: 1
  },
  {
    id: "hw-b2-w1-G2C-english-p70",
    classId: "G2C",
    class_id: "G2C",
    assignedDay: "Thursday",
    dueDay: "Sunday",
    subject: "English",
    task: "English Activity Book - Page 70",
    details: "Unit: Meet my family. Complete writing exercises on page 70 of the Activity Book.",
    pages: "P. 70",
    completed: false,
    priority: "normal",
    block: 2,
    week: 1
  },

  // --- Sunday Homework: Spelling Bee Preparation ---
  {
    id: "hw-b2-w1-G2A-english-spellingbee-prep",
    classId: "G2A",
    class_id: "G2A",
    assignedDay: "Sunday",
    dueDay: "Tuesday",
    subject: "English",
    task: "🚨 Spelling Bee Round 1 Word List (حفظ وتدريب كلمات مسابقة التهجئة)",
    details: "Prepare for Spelling Bee Round 1 Competition. Memorize and practice spelling the 40 required words from the interactive study sheet.",
    pages: "Spelling Bee Word List",
    completed: false,
    priority: "urgent",
    block: 2,
    week: 1,
    pdfUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html"
  },
  {
    id: "hw-b2-w1-G2B-english-spellingbee-prep",
    classId: "G2B",
    class_id: "G2B",
    assignedDay: "Sunday",
    dueDay: "Wednesday",
    subject: "English",
    task: "🚨 Spelling Bee Round 1 Word List (حفظ وتدريب كلمات مسابقة التهجئة)",
    details: "Prepare for Spelling Bee Round 1 Competition. Memorize and practice spelling the 40 required words from the interactive study sheet.",
    pages: "Spelling Bee Word List",
    completed: false,
    priority: "urgent",
    block: 2,
    week: 1,
    pdfUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html"
  },
  {
    id: "hw-b2-w1-G2C-english-spellingbee-prep",
    classId: "G2C",
    class_id: "G2C",
    assignedDay: "Sunday",
    dueDay: "Tuesday",
    subject: "English",
    task: "🚨 Spelling Bee Round 1 Word List (حفظ وتدريب كلمات مسابقة التهجئة)",
    details: "Prepare for Spelling Bee Round 1 Competition. Memorize and practice spelling the 40 required words from the interactive study sheet.",
    pages: "Spelling Bee Word List",
    completed: false,
    priority: "urgent",
    block: 2,
    week: 1,
    pdfUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html"
  }
];

// 4. Define Tomorrow Notes (Treated as Dictation / Quiz assessment alerts)
const newTomorrowNotes = [
  // --- G2A: Spelling Bee is on Tuesday ---
  {
    id: "tn-b2-w1-english-tue-spellingbee-g2a",
    classId: "G2A",
    class_id: "G2A",
    targetDay: "Tuesday",
    subject: "English",
    title: "Spelling Bee Competition",
    note: "Spelling Bee Round 1 Competition (Block 2 - Week 1 Word List)",
    arabicNote: "🚨 مسابقة واختبار هام: غداً الثلاثاء مسابقة التهجئة (Spelling Bee Competition - Round 1) لفصل G2A في حصة اللغة الإنجليزية! يرجى الاستعداد والتدريب الجيد على قائمة الـ 40 كلمة المرفقة.",
    bagItem: "English Notebook (كشكول اللغة الإنجليزية)",
    isQuiz: true,
    categoryType: "quiz",
    block: 2,
    week: 1,
    pdfUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html"
  },

  // --- G2C: Spelling Bee is on Tuesday ---
  {
    id: "tn-b2-w1-english-tue-spellingbee-g2c",
    classId: "G2C",
    class_id: "G2C",
    targetDay: "Tuesday",
    subject: "English",
    title: "Spelling Bee Competition",
    note: "Spelling Bee Round 1 Competition (Block 2 - Week 1 Word List)",
    arabicNote: "🚨 مسابقة واختبار هام: غداً الثلاثاء مسابقة التهجئة (Spelling Bee Competition - Round 1) لفصل G2C في حصة اللغة الإنجليزية! يرجى الاستعداد والتدريب الجيد على قائمة الـ 40 كلمة المرفقة.",
    bagItem: "English Notebook (كشكول اللغة الإنجليزية)",
    isQuiz: true,
    categoryType: "quiz",
    block: 2,
    week: 1,
    pdfUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html"
  },

  // --- G2B: Spelling Bee is on Wednesday ---
  {
    id: "tn-b2-w1-english-wed-spellingbee-g2b",
    classId: "G2B",
    class_id: "G2B",
    targetDay: "Wednesday",
    subject: "English",
    title: "Spelling Bee Competition",
    note: "Spelling Bee Round 1 Competition (Block 2 - Week 1 Word List)",
    arabicNote: "🚨 مسابقة واختبار هام: غداً الأربعاء مسابقة التهجئة (Spelling Bee Competition - Round 1) لفصل G2B في حصة اللغة الإنجليزية! يرجى الاستعداد والتدريب الجيد على قائمة الـ 40 كلمة المرفقة.",
    bagItem: "English Notebook (كشكول اللغة الإنجليزية)",
    isQuiz: true,
    categoryType: "quiz",
    block: 2,
    week: 1,
    pdfUrl: "/materials/English-Grade2-B2-Week1-SpellingBee.html"
  },

  // Advance notice for Monday Tomorrow for G2A & G2C
  {
    id: "tn-b2-w1-english-mon-advance-g2a",
    classId: "G2A",
    class_id: "G2A",
    targetDay: "Monday",
    subject: "English",
    title: "English Classwork CW. 9 & Spelling Bee prep",
    note: "English lesson on Present continuous CW. 9 and continue Spelling Bee Round 1 preparation.",
    arabicNote: "درس لغة إنجليزية: المضارع المستمر (CW. 9) والاستعداد لمسابقة Spelling Bee المقررة يوم الثلاثاء.",
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: "note",
    block: 2,
    week: 1
  },
  {
    id: "tn-b2-w1-english-mon-advance-g2b",
    classId: "G2B",
    class_id: "G2B",
    targetDay: "Monday",
    subject: "English",
    title: "English Classwork CW. 9 & Spelling Bee prep",
    note: "English lesson on Present continuous CW. 9 and continue Spelling Bee Round 1 preparation.",
    arabicNote: "درس لغة إنجليزية: المضارع المستمر (CW. 9) والاستعداد لمسابقة Spelling Bee المقررة يوم الأربعاء.",
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: "note",
    block: 2,
    week: 1
  },
  {
    id: "tn-b2-w1-english-mon-advance-g2c",
    classId: "G2C",
    class_id: "G2C",
    targetDay: "Monday",
    subject: "English",
    title: "English Classwork CW. 9 & Spelling Bee prep",
    note: "English lesson on Present continuous CW. 9 and continue Spelling Bee Round 1 preparation.",
    arabicNote: "درس لغة إنجليزية: المضارع المستمر (CW. 9) والاستعداد لمسابقة Spelling Bee المقررة يوم الثلاثاء.",
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: "note",
    block: 2,
    week: 1
  }
];

// Append to plannerData
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Write back to planner_data.json
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('✅ Successfully added Block 2 - Week 1 English data:');
console.log(`- Classwork: ${newClasswork.length} entries (all 5 days, classes 2A, 2B, 2C)`);
console.log(`- Homework: ${newHomework.length} entries`);
console.log(`- Tomorrow Notes: ${newTomorrowNotes.length} notes (Spelling Bee treated as Dictation/Quiz)`);
