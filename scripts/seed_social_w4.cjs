const fs = require('fs');

console.log('Starting Social Studies Week 4 Seeder (Block 1 - Week 4)...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// Ensure arrays exist
if (!plannerData.classwork) plannerData.classwork = [];
if (!plannerData.homework) plannerData.homework = [];
if (!plannerData.tomorrowNotes) plannerData.tomorrowNotes = [];

// 1. Clean existing Week 4 Social Studies entries to avoid duplicates
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(cw.week === 4 && (cw.subject === 'Social Studies' || cw.subject === 'Social'))
);

// 2. Classwork entries for Week 4 Social Studies
const socialClasswork = [
  // --- Sunday (27/9/2026) ---
  {
    id: 'cw-b1-w4-G2A-Sunday-p2-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 2,
    subject: 'Social Studies',
    title: 'الدرس الأول: سلوكي يحافظ على بيئتي',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الأول: سلوكي يحافظ على بيئتي. التعرف على السلوكيات الإيجابية للحفاظ على البيئة المدرسية والمنزلية.',
    pages: 'من الصفحة 21 إلى 22',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Sunday-p7-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 7,
    subject: 'Social Studies',
    title: 'الدرس الأول: سلوكي يحافظ على بيئتي',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الأول: سلوكي يحافظ على بيئتي. التعرف على السلوكيات الإيجابية للحفاظ على البيئة المدرسية والمنزلية.',
    pages: 'من الصفحة 21 إلى 22',
    completed: false,
    block: 1,
    week: 4
  },

  // --- Monday (28/9/2026) ---
  {
    id: 'cw-b1-w4-G2B-Monday-p1-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 1,
    subject: 'Social Studies',
    title: 'الدرس الأول: سلوكي يحافظ على بيئتي',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الأول: سلوكي يحافظ على بيئتي. التعرف على السلوكيات الإيجابية للحفاظ على البيئة المدرسية والمنزلية.',
    pages: 'من الصفحة 21 إلى 22',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Monday-p4-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 4,
    subject: 'Social Studies',
    title: 'الدرس الثاني: منزلي ومدرستي',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الثاني: منزلي ومدرستي. التعرف على دور المنزل والمدرسة في بناء شخصية الطالب والمجتمع.',
    pages: 'الصفحة 23',
    completed: false,
    block: 1,
    week: 4
  },

  // --- Wednesday (30/9/2026) ---
  {
    id: 'cw-b1-w4-G2B-Wednesday-p2-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 2,
    subject: 'Social Studies',
    title: 'الدرس الثاني: منزلي ومدرستي',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الثاني: منزلي ومدرستي. التعرف على دور المنزل والمدرسة في بناء شخصية الطالب والمجتمع.',
    pages: 'الصفحة 23',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2A-Wednesday-p5-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 5,
    subject: 'Social Studies',
    title: 'الدرس الثاني: منزلي ومدرستي',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الثاني: منزلي ومدرستي. التعرف على دور المنزل والمدرسة في بناء شخصية الطالب والمجتمع.',
    pages: 'الصفحة 23',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Wednesday-p8-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 8,
    subject: 'Social Studies',
    title: 'الدرس الثالث: اختلافنا سر تميزنا',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الثالث: اختلافنا سر تميزنا. مفهوم التنوع والاختلاف وأهمية تقبل الآخرين.',
    pages: 'من الصفحة 24 إلى 29',
    completed: false,
    block: 1,
    week: 4
  },

  // --- Thursday (1/10/2026) ---
  {
    id: 'cw-b1-w4-G2B-Thursday-p3-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 3,
    subject: 'Social Studies',
    title: 'الدرس الثالث: اختلافنا سر تميزنا',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الثالث: اختلافنا سر تميزنا. مفهوم التنوع والاختلاف وأهمية تقبل الآخرين.',
    pages: 'من الصفحة 24 إلى 29',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2A-Thursday-p7-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 7,
    subject: 'Social Studies',
    title: 'الدرس الثالث: اختلافنا سر تميزنا',
    details: 'الوحدة الأولى: مجتمع الصف الدراسي الثاني - الدرس الثالث: اختلافنا سر تميزنا. مفهوم التنوع والاختلاف وأهمية تقبل الآخرين.',
    pages: 'من الصفحة 24 إلى 29',
    completed: false,
    block: 1,
    week: 4
  }
];

// Append new entries to plannerData
plannerData.classwork.push(...socialClasswork);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

// Also update src/data/initialData.json if it exists
const initialDataPath = 'src/data/initialData.json';
if (fs.existsSync(initialDataPath)) {
  try {
    let initialData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    if (!initialData.classwork) initialData.classwork = [];

    initialData.classwork = initialData.classwork.filter(
      (cw) => !(cw.week === 4 && (cw.subject === 'Social Studies' || cw.subject === 'Social'))
    );

    initialData.classwork.push(...socialClasswork);

    fs.writeFileSync(initialDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Successfully updated src/data/initialData.json as well!');
  } catch (err) {
    console.warn('Could not update src/data/initialData.json:', err);
  }
}

console.log('Social Studies Week 4 Seeding Completed Successfully!');
console.log(`Classwork items added: ${socialClasswork.length}`);
