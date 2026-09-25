const fs = require('fs');

console.log('Starting Social Studies Week 3 Seeder...');

// Read original data
const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// 1. Clean existing Week 3 Social Studies entries from local json (just in case)
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(cw.week === 3 && cw.subject === 'Social Studies')
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(hw.week === 3 && hw.subject === 'Social Studies')
);
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (tn) => !(tn.week === 3 && tn.subject === 'Social Studies')
);

// 2. Define Classwork (الكلاس وورك) for Week 3
const newClasswork = [
  // --- G2A ---
  {
    id: "cw-b1-w3-G2A-Sunday-p2-soc",
    classId: "G2A",
    day: "Sunday",
    period: 2,
    subject: "Social Studies",
    title: "الدرس الأول: فصلي الجديد",
    details: "الدرس الأول: فصلي الجديد",
    pages: "ص 14",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2A-Wednesday-p5-soc",
    classId: "G2A",
    day: "Wednesday",
    period: 5,
    subject: "Social Studies",
    title: "الدرس الثاني: مشاعري",
    details: "الدرس الثاني: مشاعري",
    pages: "ص 15-18",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2A-Thursday-p7-soc",
    classId: "G2A",
    day: "Thursday",
    period: 7,
    subject: "Social Studies",
    title: "الدرس الثالث: من هو الصديق",
    details: "الدرس الثالث: من هو الصديق",
    pages: "ص 19-20",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },

  // --- G2B ---
  {
    id: "cw-b1-w3-G2B-Monday-p1-soc",
    classId: "G2B",
    day: "Monday",
    period: 1,
    subject: "Social Studies",
    title: "الدرس الأول: فصلي الجديد",
    details: "الدرس الأول: فصلي الجديد",
    pages: "ص 14",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2B-Wednesday-p2-soc",
    classId: "G2B",
    day: "Wednesday",
    period: 2,
    subject: "Social Studies",
    title: "الدرس الثاني: مشاعري",
    details: "الدرس الثاني: مشاعري",
    pages: "ص 15-18",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2B-Thursday-p3-soc",
    classId: "G2B",
    day: "Thursday",
    period: 3,
    subject: "Social Studies",
    title: "الدرس الثالث: من هو الصديق",
    details: "الدرس الثالث: من هو الصديق",
    pages: "ص 19-20",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },

  // --- G2C ---
  {
    id: "cw-b1-w3-G2C-Sunday-p7-soc",
    classId: "G2C",
    day: "Sunday",
    period: 7,
    subject: "Social Studies",
    title: "الدرس الأول: فصلي الجديد",
    details: "الدرس الأول: فصلي الجديد",
    pages: "ص 14",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },
  {
    id: "cw-b1-w3-G2C-Monday-p4-soc",
    classId: "G2C",
    day: "Monday",
    period: 4,
    subject: "Social Studies",
    title: "الدرس الثاني: مشاعري",
    details: "الدرس الثاني: مشاعري",
    pages: "ص 15-18",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },
  {
    id: "cw-b1-w3-G2C-Wednesday-p8-soc",
    classId: "G2C",
    day: "Wednesday",
    period: 8,
    subject: "Social Studies",
    title: "الدرس الثالث: من هو الصديق",
    details: "الدرس الثالث: من هو الصديق",
    pages: "ص 19-20",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  }
];

// 3. Define Homework (الواجب المنزلي) for Week 3
const newHomework = [
  {
    id: "hw-b1-w3-G2A-social-Wed",
    classId: "G2A",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Social Studies",
    task: "إرسال الواجب المنزلي",
    details: "يتم إرسال الواجب المنزلي يوم الأربعاء (حل ورقة العمل المرفقة Home Work 1 الخاصة بقواعد الصف)",
    pages: "Home Work 1 (ص 1-2)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2A",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf"
  },
  {
    id: "hw-b1-w3-G2B-social-Wed",
    classId: "G2B",
    assignedDay: "Wednesday",
    dueDay: "Monday",
    subject: "Social Studies",
    task: "إرسال الواجب المنزلي",
    details: "يتم إرسال الواجب المنزلي يوم الأربعاء (حل ورقة العمل المرفقة Home Work 1 الخاصة بقواعد الصف)",
    pages: "Home Work 1 (ص 1-2)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2B",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf"
  },
  {
    id: "hw-b1-w3-G2C-social-Wed",
    classId: "G2C",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Social Studies",
    task: "إرسال الواجب المنزلي",
    details: "يتم إرسال الواجب المنزلي يوم الأربعاء (حل ورقة العمل المرفقة Home Work 1 الخاصة بقواعد الصف)",
    pages: "Home Work 1 (ص 1-2)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2C",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf"
  }
];

// 4. Define Tomorrow Notes (تذكيرات شاشة الغد) for Week 3
const newTomorrowNotes = [
  {
    id: "tn-b1-w3-G2A-Sat-social-submit",
    classId: "G2A",
    targetDay: "Sunday",
    subject: "Social Studies",
    note: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 1)",
    arabicNote: "تذكير لكلاس A: تسليم واجب الدراسات الاجتماعية غداً الأحد (شيت الواجب المنزلي 1)",
    bagItem: "شيت واجب الدراسات الاجتماعية (Home Work 1)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2A",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf"
  },
  {
    id: "tn-b1-w3-G2B-Sun-social-submit",
    classId: "G2B",
    targetDay: "Monday",
    subject: "Social Studies",
    note: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 1)",
    arabicNote: "تذكير لكلاس B: تسليم واجب الدراسات الاجتماعية غداً الاثنين (شيت الواجب المنزلي 1)",
    bagItem: "شيت واجب الدراسات الاجتماعية (Home Work 1)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2B",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf"
  },
  {
    id: "tn-b1-w3-G2C-Sat-social-submit",
    classId: "G2C",
    targetDay: "Sunday",
    subject: "Social Studies",
    note: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 1)",
    arabicNote: "تذكير لكلاس C: تسليم واجب الدراسات الاجتماعية غداً الأحد (شيت الواجب المنزلي 1)",
    bagItem: "شيت واجب الدراسات الاجتماعية (Home Work 1)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2C",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf"
  }
];

// Append
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
if (!plannerData.tomorrowNotes) plannerData.tomorrowNotes = [];
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Save back
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('Saved to local JSON successfully!');
console.log('Added classwork entries:', newClasswork.length);
console.log('Added homework entries:', newHomework.length);
console.log('Added tomorrow notes:', newTomorrowNotes.length);
