const fs = require('fs');

console.log('Starting English Week 3 Seeder...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// 1. Clean existing Week 3 English entries
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(cw.week === 3 && (cw.subject === 'English' || cw.subject === 'english'))
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(hw.week === 3 && (hw.subject === 'English' || hw.subject === 'english'))
);
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (tn) => !((tn.week === 3 || tn.week === 4) && (tn.subject === 'English' || tn.subject === 'english'))
);

// 2. Define Classwork for Week 3 English
const newClasswork = [
  // --- Sunday ---
  {
    id: "cw-b1-w3-G2A-Sunday-english",
    classId: "G2A",
    day: "Sunday",
    period: 1,
    subject: "English",
    title: "Articles",
    details: "Articles topic and practice",
    pages: "p 23,24",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2B-Sunday-english",
    classId: "G2B",
    day: "Sunday",
    period: 1,
    subject: "English",
    title: "Singular and plural",
    details: "Singular and plural learning and exercises",
    pages: "From p. 25 to 26",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2C-Sunday-english",
    classId: "G2C",
    day: "Sunday",
    period: 2,
    subject: "English",
    title: "Articles",
    details: "Articles topic and practice",
    pages: "p 23,24",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Monday ---
  {
    id: "cw-b1-w3-G2A-Monday-english",
    classId: "G2A",
    day: "Monday",
    period: 2,
    subject: "English",
    title: "Singular and plural & Dictation",
    details: "Singular and plural. Weekly Dictation assessment on Block 1 Week 3 words list.",
    pages: "From p. 25 to 26",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2B-Monday-english",
    classId: "G2B",
    day: "Monday",
    period: 2,
    subject: "English",
    title: "Reading & Dictation",
    details: "Reading comprehension practice. Weekly Dictation assessment on Block 1 Week 3 words list.",
    pages: "From p. 29, 30",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2C-Monday-english",
    classId: "G2C",
    day: "Monday",
    period: 1,
    subject: "English",
    title: "Listening & Dictation",
    details: "Listening comprehension practice. Weekly Dictation assessment on Block 1 Week 3 words list.",
    pages: "P 31",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Tuesday ---
  {
    id: "cw-b1-w3-G2A-Tuesday-english",
    classId: "G2A",
    day: "Tuesday",
    period: 3,
    subject: "English",
    title: "Reading",
    details: "Reading practice",
    pages: "From p. 29, 30",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2B-Tuesday-english",
    classId: "G2B",
    day: "Tuesday",
    period: 3,
    subject: "English",
    title: "Articles",
    details: "Articles review and practice",
    pages: "p 23,24",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2C-Tuesday-english",
    classId: "G2C",
    day: "Tuesday",
    period: 4,
    subject: "English",
    title: "Singular and plural",
    details: "Singular and plural practice",
    pages: "From p. 25 to 26",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Wednesday ---
  {
    id: "cw-b1-w3-G2A-Wednesday-english",
    classId: "G2A",
    day: "Wednesday",
    period: 4,
    subject: "English",
    title: "Story",
    details: "Story exploration and discussion",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2B-Wednesday-english",
    classId: "G2B",
    day: "Wednesday",
    period: 4,
    subject: "English",
    title: "Listening",
    details: "Listening comprehension exercises",
    pages: "p.31",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2C-Wednesday-english",
    classId: "G2C",
    day: "Wednesday",
    period: 3,
    subject: "English",
    title: "Reading",
    details: "Reading comprehension and exercises",
    pages: "From p. 29, 30",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Thursday ---
  {
    id: "cw-b1-w3-G2A-Thursday-english",
    classId: "G2A",
    day: "Thursday",
    period: 5,
    subject: "English",
    title: "Listening",
    details: "Listening skills and practice",
    pages: "p.31",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2B-Thursday-english",
    classId: "G2B",
    day: "Thursday",
    period: 5,
    subject: "English",
    title: "Story",
    details: "Story comprehension and story elements discussion",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2C-Thursday-english",
    classId: "G2C",
    day: "Thursday",
    period: 6,
    subject: "English",
    title: "Story",
    details: "Story comprehension and discussion",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  }
];

// 3. Define Homework for Week 3 English
const newHomework = [
  // --- Monday Homework (Page 64) ---
  {
    id: "hw-b1-w3-G2A-english-page64",
    classId: "G2A",
    assignedDay: "Monday",
    dueDay: "Wednesday",
    subject: "English",
    task: "English Workbook - Page 64",
    details: "Complete exercises on page 64 of the English Workbook.",
    pages: "ص 64",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "hw-b1-w3-G2B-english-page64",
    classId: "G2B",
    assignedDay: "Monday",
    dueDay: "Wednesday",
    subject: "English",
    task: "English Workbook - Page 64",
    details: "Complete exercises on page 64 of the English Workbook.",
    pages: "ص 64",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "hw-b1-w3-G2C-english-page64",
    classId: "G2C",
    assignedDay: "Monday",
    dueDay: "Wednesday",
    subject: "English",
    task: "English Workbook - Page 64",
    details: "Complete exercises on page 64 of the English Workbook.",
    pages: "ص 64",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Thursday Homework (Pages 65, 66) ---
  {
    id: "hw-b1-w3-G2A-english-page65-66",
    classId: "G2A",
    assignedDay: "Thursday",
    dueDay: "Sunday",
    subject: "English",
    task: "English Workbook - Pages 65, 66",
    details: "Complete exercises on pages 65 and 66 of the English Workbook (Story Review).",
    pages: "65,66",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "hw-b1-w3-G2B-english-page65-66",
    classId: "G2B",
    assignedDay: "Thursday",
    dueDay: "Sunday",
    subject: "English",
    task: "English Workbook - Pages 65, 66",
    details: "Complete exercises on pages 65 and 66 of the English Workbook (Story Review).",
    pages: "65,66",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "hw-b1-w3-G2C-english-page65-66",
    classId: "G2C",
    assignedDay: "Thursday",
    dueDay: "Sunday",
    subject: "English",
    task: "English Workbook - Pages 65, 66",
    details: "Complete exercises on pages 65 and 66 of the English Workbook (Story Review).",
    pages: "65,66",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Dictation Preparation Homework assigned on Sunday for all classes (as requested) ---
  {
    id: "hw-b1-w3-G2A-english-dictation-prep",
    classId: "G2A",
    assignedDay: "Sunday",
    dueDay: "Monday",
    subject: "English",
    task: "English Dictation Preparation (حفظ كلمات الإملاء)",
    details: "Prepare for Monday's English Dictation using the attached Week 3 Words study sheet.",
    pages: "قائمة الإملاء",
    completed: false,
    priority: "high",
    block: 1,
    week: 3,
    pdfUrl: "/materials/English-Grade2-B1-Week3-Dictation.html",
    class_id: "G2A"
  },
  {
    id: "hw-b1-w3-G2B-english-dictation-prep",
    classId: "G2B",
    assignedDay: "Sunday",
    dueDay: "Monday",
    subject: "English",
    task: "English Dictation Preparation (حفظ كلمات الإملاء)",
    details: "Prepare for Monday's English Dictation using the attached Week 3 Words study sheet.",
    pages: "قائمة الإملاء",
    completed: false,
    priority: "high",
    block: 1,
    week: 3,
    pdfUrl: "/materials/English-Grade2-B1-Week3-Dictation.html",
    class_id: "G2B"
  },
  {
    id: "hw-b1-w3-G2C-english-dictation-prep",
    classId: "G2C",
    assignedDay: "Sunday",
    dueDay: "Monday",
    subject: "English",
    task: "English Dictation Preparation (حفظ كلمات الإملاء)",
    details: "Prepare for Monday's English Dictation using the attached Week 3 Words study sheet.",
    pages: "قائمة الإملاء",
    completed: false,
    priority: "high",
    block: 1,
    week: 3,
    pdfUrl: "/materials/English-Grade2-B1-Week3-Dictation.html",
    class_id: "G2C"
  }
];

// 4. Define Tomorrow Notes for Week 3 English (Sunday Tomorrow - dictation check)
const newTomorrowNotes = [
  {
    id: "tn-english-w3-G2A-Sun-dictation",
    classId: "G2A",
    targetDay: "Monday",
    subject: "English",
    note: "English Dictation check on Block 1 - Week 3 Words",
    arabicNote: "ديكتيشن هام: اختبار الإملاء الأسبوعي (Dictation) غداً الاثنين! يرجى الاستعداد وحفظ الكلمات من الشيت التفاعلي المرفق.",
    bagItem: "English Notebook (كشكول اللغة الإنجليزية)",
    isQuiz: true,
    categoryType: "quiz",
    block: 1,
    week: 3,
    pdfUrl: "/materials/English-Grade2-B1-Week3-Dictation.html",
    class_id: "G2A"
  },
  {
    id: "tn-english-w3-G2B-Sun-dictation",
    classId: "G2B",
    targetDay: "Monday",
    subject: "English",
    note: "English Dictation check on Block 1 - Week 3 Words",
    arabicNote: "ديكتيشن هام: اختبار الإملاء الأسبوعي (Dictation) غداً الاثنين! يرجى الاستعداد وحفظ الكلمات من الشيت التفاعلي المرفق.",
    bagItem: "English Notebook (كشكول اللغة الإنجليزية)",
    isQuiz: true,
    categoryType: "quiz",
    block: 1,
    week: 3,
    pdfUrl: "/materials/English-Grade2-B1-Week3-Dictation.html",
    class_id: "G2B"
  },
  {
    id: "tn-english-w3-G2C-Sun-dictation",
    classId: "G2C",
    targetDay: "Monday",
    subject: "English",
    note: "English Dictation check on Block 1 - Week 3 Words",
    arabicNote: "ديكتيشن هام: اختبار الإملاء الأسبوعي (Dictation) غداً الاثنين! يرجى الاستعداد وحفظ الكلمات من الشيت التفاعلي المرفق.",
    bagItem: "English Notebook (كشكول اللغة الإنجليزية)",
    isQuiz: true,
    categoryType: "quiz",
    block: 1,
    week: 3,
    pdfUrl: "/materials/English-Grade2-B1-Week3-Dictation.html",
    class_id: "G2C"
  }
];

// Append
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
if (!plannerData.tomorrowNotes) plannerData.tomorrowNotes = [];
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Save back
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('Saved English Week 3 Plan to local JSON successfully!');
console.log('Added classwork entries:', newClasswork.length);
console.log('Added homework entries:', newHomework.length);
console.log('Added tomorrow notes:', newTomorrowNotes.length);
