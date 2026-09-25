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
plannerData.homework = plannerData.homework.filter(
  (hw) => !(hw.week === 4 && (hw.subject === 'Social Studies' || hw.subject === 'Social'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(tn.week === 4 && (tn.subject === 'Social Studies' || tn.subject === 'Social'))
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

// 3. Homework entries for Week 4 Social Studies
const socialHomework = [
  {
    id: 'hw-b1-w4-G2A-Sat-social-hw2',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Saturday',
    dueDay: 'Sunday',
    subject: 'Social Studies',
    task: 'تسليم الواجب الأسبوعي لمادة السوشيال',
    details: 'السؤال الأول: صل العبارة من العمود (أ) بما يناسبها من العمود (ب). السؤال الثاني: ضع دائرة حول الكلمة التي ليست جزءاً من مكونات الفصل الدراسي.',
    pages: 'Home Work 2 (واجب 2)',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 4,
    pdfUrl: '/materials/SocialStudies-Grade2-B1-HomeWork-2.html'
  },
  {
    id: 'hw-b1-w4-G2B-Sun-social-hw2',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'Social Studies',
    task: 'تسليم الواجب الأسبوعي لمادة السوشيال',
    details: 'السؤال الأول: صل العبارة من العمود (أ) بما يناسبها من العمود (ب). السؤال الثاني: ضع دائرة حول الكلمة التي ليست جزءاً من مكونات الفصل الدراسي.',
    pages: 'Home Work 2 (واجب 2)',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 4,
    pdfUrl: '/materials/SocialStudies-Grade2-B1-HomeWork-2.html'
  },
  {
    id: 'hw-b1-w4-G2C-Sat-social-hw2',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Saturday',
    dueDay: 'Sunday',
    subject: 'Social Studies',
    task: 'تسليم الواجب الأسبوعي لمادة السوشيال',
    details: 'السؤال الأول: صل العبارة من العمود (أ) بما يناسبها من العمود (ب). السؤال الثاني: ضع دائرة حول الكلمة التي ليست جزءاً من مكونات الفصل الدراسي.',
    pages: 'Home Work 2 (واجب 2)',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 4,
    pdfUrl: '/materials/SocialStudies-Grade2-B1-HomeWork-2.html'
  }
];

// 4. Tomorrow Notes for Week 4 Social Studies
const socialTomorrowNotes = [
  {
    id: 'tn-b1-w4-G2A-social-hw2',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 2,
    title: 'Submit Social Studies HW2',
    note: 'Submit Social Studies HW2',
    arabicNote: '🚨 تسليم الواجب الأسبوعي لمادة الدراسات الاجتماعية (Home Work 2) غداً.',
    bagItem: 'Social Studies HW2 Sheet (شيت واجب الدراسات)',
    isQuiz: false,
    categoryType: 'note',
    block: 1,
    week: 4
  },
  {
    id: 'tn-b1-w4-G2B-social-hw2',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'Social Studies',
    period: 1,
    title: 'Submit Social Studies HW2',
    note: 'Submit Social Studies HW2',
    arabicNote: '🚨 تسليم الواجب الأسبوعي لمادة الدراسات الاجتماعية (Home Work 2) غداً.',
    bagItem: 'Social Studies HW2 Sheet (شيت واجب الدراسات)',
    isQuiz: false,
    categoryType: 'note',
    block: 1,
    week: 4
  },
  {
    id: 'tn-b1-w4-G2C-social-hw2',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 7,
    title: 'Submit Social Studies HW2',
    note: 'Submit Social Studies HW2',
    arabicNote: '🚨 تسليم الواجب الأسبوعي لمادة الدراسات الاجتماعية (Home Work 2) غداً.',
    bagItem: 'Social Studies HW2 Sheet (شيت واجب الدراسات)',
    isQuiz: false,
    categoryType: 'note',
    block: 1,
    week: 4
  }
];

// Append new entries to plannerData
plannerData.classwork.push(...socialClasswork);
plannerData.homework.push(...socialHomework);
plannerData.tomorrowNotes.push(...socialTomorrowNotes);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

// Also update src/data/initialData.json if it exists
const initialDataPath = 'src/data/initialData.json';
if (fs.existsSync(initialDataPath)) {
  try {
    let initialData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    if (!initialData.classwork) initialData.classwork = [];
    if (!initialData.homework) initialData.homework = [];
    if (!initialData.tomorrowNotes) initialData.tomorrowNotes = [];

    initialData.classwork = initialData.classwork.filter(
      (cw) => !(cw.week === 4 && (cw.subject === 'Social Studies' || cw.subject === 'Social'))
    );
    initialData.homework = initialData.homework.filter(
      (hw) => !(hw.week === 4 && (hw.subject === 'Social Studies' || hw.subject === 'Social'))
    );
    initialData.tomorrowNotes = initialData.tomorrowNotes.filter(
      (tn) => !(tn.week === 4 && (tn.subject === 'Social Studies' || tn.subject === 'Social'))
    );

    initialData.classwork.push(...socialClasswork);
    initialData.homework.push(...socialHomework);
    initialData.tomorrowNotes.push(...socialTomorrowNotes);

    fs.writeFileSync(initialDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Successfully updated src/data/initialData.json as well!');
  } catch (err) {
    console.warn('Could not update src/data/initialData.json:', err);
  }
}

console.log('Social Studies Week 4 Seeding Completed Successfully!');
console.log(`Classwork items added: ${socialClasswork.length}`);
console.log(`Homework items added: ${socialHomework.length}`);
console.log(`Tomorrow notes added: ${socialTomorrowNotes.length}`);
