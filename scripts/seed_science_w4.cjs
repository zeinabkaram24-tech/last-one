const fs = require('fs');

console.log('Seeding Science Week 4 data...');

const plannerPath = 'data/planner_data.json';
const initialDataPath = 'src/data/initialData.json';

let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json:', err);
  }
}

// Remove any existing Week 4 Science entries to avoid duplication
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(Number(cw.week) === 4 && cw.subject === 'Science')
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(Number(hw.week) === 4 && hw.subject === 'Science')
);
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (tn) => !(Number(tn.week) === 4 && tn.subject === 'Science')
);

// New Classwork for Science Week 4
const sciencePdf = "https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483060058_Science-Grade2-B1-All-Sheet1_-_Main.pdf";

const newClasswork = [
  // --- Sunday ---
  {
    id: "cw-b1-w4-G2B-Sunday-p2-sci",
    classId: "G2B",
    class_id: "G2B",
    day: "Sunday",
    period: 2,
    subject: "Science",
    title: "Unit 2: Plant life cycle",
    details: "Unit 2: Getting to know plants - Plant life cycle",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  {
    id: "cw-b1-w4-G2C-Sunday-p5-sci",
    classId: "G2C",
    class_id: "G2C",
    day: "Sunday",
    period: 5,
    subject: "Science",
    title: "Unit 2: Plant life cycle",
    details: "Unit 2: Getting to know plants - Plant life cycle",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  // --- Monday ---
  {
    id: "cw-b1-w4-G2A-Monday-p7-sci",
    classId: "G2A",
    class_id: "G2A",
    day: "Monday",
    period: 7,
    subject: "Science",
    title: "Unit 2: Plant life cycle",
    details: "Unit 2: Getting to know plants - Plant life cycle",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  {
    id: "cw-b1-w4-G2C-Monday-p3-sci",
    classId: "G2C",
    class_id: "G2C",
    day: "Monday",
    period: 3,
    subject: "Science",
    title: "Unit 2: Plant habitats",
    details: "Unit 2: Getting to know plants - Plant habitats",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  // --- Tuesday ---
  {
    id: "cw-b1-w4-G2A-Tuesday-p5-sci",
    classId: "G2A",
    class_id: "G2A",
    day: "Tuesday",
    period: 5,
    subject: "Science",
    title: "Unit 2: Plant habitats",
    details: "Unit 2: Getting to know plants - Plant habitats",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  // --- Wednesday ---
  {
    id: "cw-b1-w4-G2B-Wednesday-p7-sci",
    classId: "G2B",
    class_id: "G2B",
    day: "Wednesday",
    period: 7,
    subject: "Science",
    title: "Unit 2: Plant habitats",
    details: "Unit 2: Getting to know plants - Plant habitats",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  // --- Thursday ---
  {
    id: "cw-b1-w4-G2A-Thursday-p8-sci",
    classId: "G2A",
    class_id: "G2A",
    day: "Thursday",
    period: 8,
    subject: "Science",
    title: "Unit 2: Sorting of plants",
    details: "Unit 2: Getting to know plants - Sorting of plants",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  {
    id: "cw-b1-w4-G2B-Thursday-p7-sci",
    classId: "G2B",
    class_id: "G2B",
    day: "Thursday",
    period: 7,
    subject: "Science",
    title: "Unit 2: Sorting of plants",
    details: "Unit 2: Getting to know plants - Sorting of plants",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  {
    id: "cw-b1-w4-G2C-Thursday-p1-sci",
    classId: "G2C",
    class_id: "G2C",
    day: "Thursday",
    period: 1,
    subject: "Science",
    title: "Unit 2: Sorting of plants",
    details: "Unit 2: Getting to know plants - Sorting of plants",
    pages: "كتاب الطالب",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  }
];

// New Homework for Science Week 4
const newHomework = [
  {
    id: "hw-b1-w4-G2A-science-page41",
    classId: "G2A",
    class_id: "G2A",
    assignedDay: "Monday",
    dueDay: "Tuesday",
    subject: "Science",
    task: "Page 41 (حل ص 41)",
    details: "حل صفحة 41 في كتاب الساينس (Page 41)",
    pages: "ص 41",
    completed: false,
    priority: "normal",
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  {
    id: "hw-b1-w4-G2C-science-page41",
    classId: "G2C",
    class_id: "G2C",
    assignedDay: "Monday",
    dueDay: "Thursday",
    subject: "Science",
    task: "Page 41 (حل ص 41)",
    details: "حل صفحة 41 في كتاب الساينس (Page 41)",
    pages: "ص 41",
    completed: false,
    priority: "normal",
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  },
  {
    id: "hw-b1-w4-G2B-science-page42-43",
    classId: "G2B",
    class_id: "G2B",
    assignedDay: "Wednesday",
    dueDay: "Thursday",
    subject: "Science",
    task: "Page 42, 43 (حل ص 42 و 43)",
    details: "حل صفحة 42 وصفحة 43 في كتاب الساينس (Page 42 & 43)",
    pages: "ص 42-43",
    completed: false,
    priority: "normal",
    block: 1,
    week: 4,
    pdfUrl: sciencePdf
  }
];

// New Tomorrow Notes for Science Week 4
const newTomorrowNotes = [
  {
    id: "tn-science-w4-G2A-Sat-materials",
    classId: "G2A",
    class_id: "G2A",
    targetDay: "Sunday",
    subject: "Science",
    note: "Materials required for Plant life cycle lesson",
    arabicNote: "تنبيه لدرس Plant life cycle: يرجى إحضار لوحة (A Chart) + نسخة مطبوعة من الشيت على EduMaster + صمغ (Glue) + مقص (Scissors).",
    bagItem: "لوحة (A Chart)، شيت مطبوع من EduMaster، صمغ (Glue)، مقص (Scissors)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4
  },
  {
    id: "tn-science-w4-G2B-Sat-materials",
    classId: "G2B",
    class_id: "G2B",
    targetDay: "Sunday",
    subject: "Science",
    note: "Materials required for Plant life cycle lesson",
    arabicNote: "تنبيه لدرس Plant life cycle: يرجى إحضار لوحة (A Chart) + نسخة مطبوعة من الشيت على EduMaster + صمغ (Glue) + مقص (Scissors).",
    bagItem: "لوحة (A Chart)، شيت مطبوع من EduMaster، صمغ (Glue)، مقص (Scissors)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4
  },
  {
    id: "tn-science-w4-G2C-Sat-materials",
    classId: "G2C",
    class_id: "G2C",
    targetDay: "Sunday",
    subject: "Science",
    note: "Materials required for Plant life cycle lesson",
    arabicNote: "تنبيه لدرس Plant life cycle: يرجى إحضار لوحة (A Chart) + نسخة مطبوعة من الشيت على EduMaster + صمغ (Glue) + مقص (Scissors).",
    bagItem: "لوحة (A Chart)، شيت مطبوع من EduMaster، صمغ (Glue)، مقص (Scissors)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4
  },
  {
    id: "tn-science-w4-G2A-Sun-materials",
    classId: "G2A",
    class_id: "G2A",
    targetDay: "Monday",
    subject: "Science",
    note: "Materials required for Plant life cycle lesson",
    arabicNote: "تنبيه لدرس Plant life cycle: يرجى إحضار لوحة (A Chart) + نسخة مطبوعة من الشيت على EduMaster + صمغ (Glue) + مقص (Scissors).",
    bagItem: "لوحة (A Chart)، شيت مطبوع من EduMaster، صمغ (Glue)، مقص (Scissors)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4
  },
  {
    id: "tn-science-w4-G2C-Sun-materials",
    classId: "G2C",
    class_id: "G2C",
    targetDay: "Monday",
    subject: "Science",
    note: "Materials required for Plant life cycle lesson",
    arabicNote: "تنبيه لدرس Plant life cycle: يرجى إحضار لوحة (A Chart) + نسخة مطبوعة من الشيت على EduMaster + صمغ (Glue) + مقص (Scissors).",
    bagItem: "لوحة (A Chart)، شيت مطبوع من EduMaster، صمغ (Glue)، مقص (Scissors)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4
  }
];

plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
if (!plannerData.tomorrowNotes) plannerData.tomorrowNotes = [];
plannerData.tomorrowNotes.push(...newTomorrowNotes);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
if (fs.existsSync(initialDataPath)) {
  fs.writeFileSync(initialDataPath, JSON.stringify(plannerData, null, 2), 'utf8');
}

console.log('Successfully seeded Science Week 4!');
console.log(`Added ${newClasswork.length} classwork items, ${newHomework.length} homework items, and ${newTomorrowNotes.length} tomorrow notes.`);
