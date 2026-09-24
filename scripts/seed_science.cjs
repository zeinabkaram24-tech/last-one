const fs = require('fs');

console.log('Starting Science Week 3 Seeder...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// 1. Clean existing Week 3 Science entries
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(cw.week === 3 && cw.subject === 'Science')
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(hw.week === 3 && hw.subject === 'Science')
);
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (tn) => !((tn.week === 3 || tn.week === 4) && tn.subject === 'Science')
);

// 2. Define Classwork (الكلاس وورك) for Week 3 Science
const newClasswork = [
  // --- Sunday A-B ---
  {
    id: "cw-b1-w3-G2A-Sunday-p7-sci",
    classId: "G2A",
    day: "Sunday",
    period: 7,
    subject: "Science",
    title: "Unit 2: Living and non-living things",
    details: "Unit 2: Getting to know plants - Living and non- living things",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2B-Sunday-p3-sci",
    classId: "G2B",
    day: "Sunday",
    period: 3,
    subject: "Science",
    title: "Unit 2: Living and non-living things",
    details: "Unit 2: Getting to know plants - Living and non- living things",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },

  // --- Monday C ---
  {
    id: "cw-b1-w3-G2C-Monday-p3-sci",
    classId: "G2C",
    day: "Monday",
    period: 3,
    subject: "Science",
    title: "Unit 2: Living and non-living things",
    details: "Unit 2: Getting to know plants - Living and non- living things",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Tuesday C ---
  {
    id: "cw-b1-w3-G2C-Tuesday-p5-sci",
    classId: "G2C",
    day: "Tuesday",
    period: 5,
    subject: "Science",
    title: "Unit 2: Parts of plants",
    details: "Unit 2: Getting to know plants - Parts of plants",
    pages: "ص 37",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- Tuesday G2A (We have science period 5 on Tuesday) ---
  {
    id: "cw-b1-w3-G2A-Tuesday-p5-sci",
    classId: "G2A",
    day: "Tuesday",
    period: 5,
    subject: "Science",
    title: "Unit 2: Parts of plants",
    details: "Unit 2: Getting to know plants - Parts of plants",
    pages: "ص 37",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },

  // --- Wednesday G2B (We have science period 7 on Wednesday) ---
  {
    id: "cw-b1-w3-G2B-Wednesday-p7-sci",
    classId: "G2B",
    day: "Wednesday",
    period: 7,
    subject: "Science",
    title: "Unit 2: Parts of plants",
    details: "Unit 2: Getting to know plants - Parts of plants",
    pages: "ص 37",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },

  // --- Thursday A-B-C ---
  {
    id: "cw-b1-w3-G2A-Thursday-p8-sci",
    classId: "G2A",
    day: "Thursday",
    period: 8,
    subject: "Science",
    title: "Unit 2: The needs of plants",
    details: "Unit 2: Getting to know plants - The needs of plants",
    pages: "ص 39",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2B-Thursday-p7-sci",
    classId: "G2B",
    day: "Thursday",
    period: 7,
    subject: "Science",
    title: "Unit 2: The needs of plants",
    details: "Unit 2: Getting to know plants - The needs of plants",
    pages: "ص 39",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2C-Thursday-p1-sci",
    classId: "G2C",
    day: "Thursday",
    period: 1,
    subject: "Science",
    title: "Unit 2: The needs of plants",
    details: "Unit 2: Getting to know plants - The needs of plants",
    pages: "ص 39",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  }
];

// 3. Define Homework (الواجب المنزلي) for Week 3 Science
const newHomework = [
  {
    id: "hw-b1-w3-G2A-science-page38",
    classId: "G2A",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Science",
    task: "Science Booklet - Page 38",
    details: "إكمال تمارين صفحة 38 في البوكليت (Unit 2: Parts of plants)",
    pages: "ص 38",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "hw-b1-w3-G2B-science-page38",
    classId: "G2B",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Science",
    task: "Science Booklet - Page 38",
    details: "إكمال تمارين صفحة 38 في البوكليت (Unit 2: Parts of plants)",
    pages: "ص 38",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "hw-b1-w3-G2C-science-page36",
    classId: "G2C",
    assignedDay: "Monday",
    dueDay: "Thursday",
    subject: "Science",
    task: "Science Booklet - Page 36",
    details: "إكمال تمارين صفحة 36 في البوكليت (Unit 2: Living and non-living things)",
    pages: "ص 36",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2C"
  }
];

// 4. Define Tomorrow Notes (تذكيرات شاشة الغد) for Week 3 Science
const newTomorrowNotes = [
  // --- Science Booklet submissions ---
  // NOTE: G2A Saturday Tomorrow Booklet Submission is REMOVED! G2A booklet submission is only on Wednesday Tomorrow!
  
  // G2B Saturday Tomorrow (Target Sunday Booklet submission)
  {
    id: "tn-science-w3-G2B-Sat-booklet",
    classId: "G2B",
    targetDay: "Sunday",
    subject: "Science",
    note: "Science booklet submission (Unit 1)",
    arabicNote: "تذكير لكلاس B: تسليم بوكليت الساينس (Science Booklet) غداً الأحد لتصحيح تمارين Unit 1.",
    bagItem: "Science Booklet (بوكليت الساينس)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  // G2C Sunday Tomorrow (Target Monday Booklet submission)
  {
    id: "tn-science-w3-G2C-Sun-booklet",
    classId: "G2C",
    targetDay: "Monday",
    subject: "Science",
    note: "Science booklet submission (Unit 1)",
    arabicNote: "تذكير لكلاس C: تسليم بوكليت الساينس (Science Booklet) غداً الاثنين لتصحيح تمارين Unit 1.",
    bagItem: "Science Booklet (بوكليت الساينس)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // G2A Booklet submission ONLY on Wednesday Tomorrow (targetDay: Thursday)
  {
    id: "tn-science-w3-G2A-Wed-booklet-submit",
    classId: "G2A",
    targetDay: "Thursday",
    subject: "Science",
    note: "Science booklet submission (Unit 1)",
    arabicNote: "تذكير لكلاس A: تسليم بوكليت الساينس (Science Booklet) غداً الخميس لتصحيح تمارين Unit 1.",
    bagItem: "Science Booklet (بوكليت الساينس)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2A"
  },

  // --- G2C Materials Reminders (Saturday, Sunday, Wednesday) ---
  {
    id: "tn-science-w3-G2C-Sat-materials",
    classId: "G2C",
    targetDay: "Sunday",
    subject: "Science",
    note: "Science tools required for this week",
    arabicNote: "تذكير لكلاس C: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2C"
  },
  {
    id: "tn-science-w3-G2C-Sun-materials",
    classId: "G2C",
    targetDay: "Monday",
    subject: "Science",
    note: "Science tools required for this week",
    arabicNote: "تذكير لكلاس C: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2C"
  },
  {
    id: "tn-science-w3-G2C-Wed-materials",
    classId: "G2C",
    targetDay: "Thursday",
    subject: "Science",
    note: "Science tools required",
    arabicNote: "تذكير لكلاس C: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2C"
  },

  // --- G2A Materials Reminders (Saturday, Monday, Wednesday) ---
  {
    id: "tn-science-w3-G2A-Sat-materials",
    classId: "G2A",
    targetDay: "Sunday",
    subject: "Science",
    note: "Science tools required for this week",
    arabicNote: "تذكير لكلاس A: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "tn-science-w3-G2A-Mon-materials",
    classId: "G2A",
    targetDay: "Tuesday",
    subject: "Science",
    note: "Science tools required for this week",
    arabicNote: "تذكير لكلاس A: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "tn-science-w3-G2A-Wed-materials",
    classId: "G2A",
    targetDay: "Thursday",
    subject: "Science",
    note: "Science tools required",
    arabicNote: "تذكير لكلاس A: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2A"
  },

  // --- G2B Materials Reminders (Sunday, Monday, Wednesday, plus Saturday for completeness) ---
  {
    id: "tn-science-w3-G2B-Sat-materials",
    classId: "G2B",
    targetDay: "Sunday",
    subject: "Science",
    note: "Science tools required for this week",
    arabicNote: "تذكير لكلاس B: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "tn-science-w3-G2B-Sun-materials",
    classId: "G2B",
    targetDay: "Monday",
    subject: "Science",
    note: "Science tools required for this week",
    arabicNote: "تذكير لكلاس B: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "tn-science-w3-G2B-Mon-materials",
    classId: "G2B",
    targetDay: "Tuesday",
    subject: "Science",
    note: "Science tools required for this week",
    arabicNote: "تذكير لكلاس B: يرجى إحضار أدوات الساينس المطلوبة طوال هذا الأسبوع (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "tn-science-w3-G2B-Wed-materials",
    classId: "G2B",
    targetDay: "Thursday",
    subject: "Science",
    note: "Science tools required",
    arabicNote: "تذكير لكلاس B: يرجى إحضار أدوات الساينس المطلوبة (أوراق ملونة، صمغ، ألوان خشبية، وقليل من خيط الكروشيه).",
    bagItem: "أدوات الساينس (أوراق ملونة، صمغ، ألوان، خيط كروشيه)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2B"
  }
];

// Append
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
if (!plannerData.tomorrowNotes) plannerData.tomorrowNotes = [];
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Save back
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('Saved Science Week 3 (with absolute Saturday/Wednesday 2A rules) to local JSON successfully!');
console.log('Added classwork entries:', newClasswork.length);
console.log('Added homework entries:', newHomework.length);
console.log('Added tomorrow notes:', newTomorrowNotes.length);
