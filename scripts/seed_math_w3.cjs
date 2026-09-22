const fs = require('fs');

console.log('Starting Mathematics Week 3 Seeder (Block 1 - Week 3)...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// 1. Clean existing Week 3 Mathematics entries to avoid duplicates
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(cw.week === 3 && (cw.subject === 'Mathematics' || cw.subject === 'Math'))
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(hw.week === 3 && (hw.subject === 'Mathematics' || hw.subject === 'Math'))
);
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (tn) => !(tn.week === 3 && (tn.subject === 'Mathematics' || tn.subject === 'Math'))
);

const mathPdfUrl = 'https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483250130_Maths-Grade2-B1-All-Sheet1_-_Main.pdf';

// 2. Classwork entries for Week 3 Mathematics (5 days x 3 classes)
// Timetable periods for Math:
// G2A: Sunday p8, Monday p8, Tuesday p3, Wednesday p1, Thursday p1
// G2B: Sunday p2, Monday p3, Tuesday p1, Wednesday p5, Thursday p4
// G2C: Sunday p3, Monday p8, Tuesday p3, Wednesday p7, Thursday p6

const mathClasswork = [
  // --- Sunday (20/9/2026): Adding single number to 2 digit numbers ---
  {
    id: 'cw-b1-w3-G2A-Sunday-p8-math',
    classId: 'G2A',
    day: 'Sunday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 2: Adding single number to 2 digit numbers',
    details: 'Unit 2: Adding single number to 2 digit numbers. Learning place value and counting on strategies. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2B-Sunday-p2-math',
    classId: 'G2B',
    day: 'Sunday',
    period: 2,
    subject: 'Mathematics',
    title: 'Unit 2: Adding single number to 2 digit numbers',
    details: 'Unit 2: Adding single number to 2 digit numbers. Learning place value and counting on strategies. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2C-Sunday-p3-math',
    classId: 'G2C',
    day: 'Sunday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 2: Adding single number to 2 digit numbers',
    details: 'Unit 2: Adding single number to 2 digit numbers. Learning place value and counting on strategies. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },

  // --- Monday (21/9/2026): Subtracting single number from 2 digit numbers ---
  {
    id: 'cw-b1-w3-G2A-Monday-p8-math',
    classId: 'G2A',
    day: 'Monday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 2: Subtracting single number from 2 digit numbers',
    details: 'Unit 2: Subtracting single number from 2 digit numbers. Counting back and regrouping concepts. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2B-Monday-p3-math',
    classId: 'G2B',
    day: 'Monday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 2: Subtracting single number from 2 digit numbers',
    details: 'Unit 2: Subtracting single number from 2 digit numbers. Counting back and regrouping concepts. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2C-Monday-p8-math',
    classId: 'G2C',
    day: 'Monday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 2: Subtracting single number from 2 digit numbers',
    details: 'Unit 2: Subtracting single number from 2 digit numbers. Counting back and regrouping concepts. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },

  // --- Tuesday (22/9/2026): Add and subtract 10 and multiples of 10 to and from two-digit numbers ---
  {
    id: 'cw-b1-w3-G2A-Tuesday-p3-math',
    classId: 'G2A',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 2: Add and subtract 10 and multiples of 10',
    details: 'Unit 2: Add and subtract 10 and multiples of 10 to and from two-digit numbers using mental math and hundred chart patterns. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2B-Tuesday-p1-math',
    classId: 'G2B',
    day: 'Tuesday',
    period: 1,
    subject: 'Mathematics',
    title: 'Unit 2: Add and subtract 10 and multiples of 10',
    details: 'Unit 2: Add and subtract 10 and multiples of 10 to and from two-digit numbers using mental math and hundred chart patterns. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2C-Tuesday-p3-math',
    classId: 'G2C',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 2: Add and subtract 10 and multiples of 10',
    details: 'Unit 2: Add and subtract 10 and multiples of 10 to and from two-digit numbers using mental math and hundred chart patterns. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },

  // --- Wednesday (23/9/2026): Money ---
  {
    id: 'cw-b1-w3-G2A-Wednesday-p1-math',
    classId: 'G2A',
    day: 'Wednesday',
    period: 1,
    subject: 'Mathematics',
    title: 'Unit 2: Money',
    details: 'Unit 2: Money - Identifying coins and bills, calculating amounts, and solving simple shopping problems. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2B-Wednesday-p5-math',
    classId: 'G2B',
    day: 'Wednesday',
    period: 5,
    subject: 'Mathematics',
    title: 'Unit 2: Money',
    details: 'Unit 2: Money - Identifying coins and bills, calculating amounts, and solving simple shopping problems. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2C-Wednesday-p7-math',
    classId: 'G2C',
    day: 'Wednesday',
    period: 7,
    subject: 'Mathematics',
    title: 'Unit 2: Money',
    details: 'Unit 2: Money - Identifying coins and bills, calculating amounts, and solving simple shopping problems. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },

  // --- Thursday (24/9/2026): Test ---
  {
    id: 'cw-b1-w3-G2A-Thursday-p1-math',
    classId: 'G2A',
    day: 'Thursday',
    period: 1,
    subject: 'Mathematics',
    title: '🚨 Unit 2 Math Test (اختبار رياضيات)',
    details: 'Unit 2 Test - Assessment covering all Unit 2 topics: Adding and subtracting single digit to 2 digit numbers, add/subtract 10 and multiples of 10, and money. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Unit 2 Test (Maths Sheet 1)',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2B-Thursday-p4-math',
    classId: 'G2B',
    day: 'Thursday',
    period: 4,
    subject: 'Mathematics',
    title: '🚨 Unit 2 Math Test (اختبار رياضيات)',
    details: 'Unit 2 Test - Assessment covering all Unit 2 topics: Adding and subtracting single digit to 2 digit numbers, add/subtract 10 and multiples of 10, and money. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Unit 2 Test (Maths Sheet 1)',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w3-G2C-Thursday-p6-math',
    classId: 'G2C',
    day: 'Thursday',
    period: 6,
    subject: 'Mathematics',
    title: '🚨 Unit 2 Math Test (اختبار رياضيات)',
    details: 'Unit 2 Test - Assessment covering all Unit 2 topics: Adding and subtracting single digit to 2 digit numbers, add/subtract 10 and multiples of 10, and money. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Unit 2 Test (Maths Sheet 1)',
    completed: false,
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  }
];

// 3. Homework entries for Week 3 Mathematics
const mathHomework = [
  // Sunday 20/9 -> Due Monday 21/9: Pages 82, 83
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w3-${cls}-Sun-math-82-83`,
    classId: cls,
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Pages 82, 83',
    details: 'Unit 2: Adding single number to 2 digit numbers - Solve exercises on Pages 82 and 83 on Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Pages 82, 83',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  })),

  // Monday 21/9 -> Due Tuesday 22/9: Page 88
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w3-${cls}-Mon-math-88`,
    classId: cls,
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Page 88',
    details: 'Unit 2: Subtracting single number from 2 digit numbers - Solve exercises on Page 88 on Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Page 88',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  })),

  // Tuesday 22/9 -> Due Wednesday 23/9: Page 89
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w3-${cls}-Tue-math-89`,
    classId: cls,
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Page 89',
    details: 'Unit 2: Add and subtract 10 and multiples of 10 to and from two-digit numbers - Solve Page 89 on Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Page 89',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  })),

  // Wednesday 23/9 -> Due Thursday 24/9: Page 89 (Money)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w3-${cls}-Wed-math-89-money`,
    classId: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Page 89 (Money)',
    details: 'Unit 2: Money - Complete money exercises on Page 89 on Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Page 89',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  })),

  // Wednesday 23/9 -> INSTRUCTION: "ولو في Test، حطي إنذار قبله في الـ Homework وفي الـ Tomorrow، اليوم اللي قبله."
  // Math Test is on Thursday, so add alert in Homework on Wednesday!
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w3-${cls}-Wed-math-test-alert`,
    classId: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: '🚨 إنذار وتنبيه هام: غداً الخميس اختبار رياضيات (Unit 2 Math Test)',
    details: 'تنبيه اختبار هام: الاستعداد لاختبار مادة الرياضيات (Unit 2 Test) غداً الخميس! يرجى مراجعة دروس الوحدة الثانية (الجمع، الطرح، مضاعفات الـ 10، والنقود) في شيت الرياضيات (Pages 82 to 89)، وإحضار الأدوات كاملة (قلم رصاص، ممحاة، مسطرة، كشكول الماث).',
    pages: 'Maths Sheet 1 (Pages 82 - 89)',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 3,
    pdfUrl: mathPdfUrl
  }))
];

// 4. Tomorrow Notes for Week 3 Mathematics
const mathTomorrowNotes = [
  // Saturday evening -> for Sunday (targetDay: Sunday)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-w3-math-sun-prep-${cls.toLowerCase()}`,
    classId: cls,
    targetDay: 'Sunday',
    subject: 'Mathematics',
    period: cls === 'G2A' ? 8 : (cls === 'G2B' ? 2 : 3),
    title: 'تحضير الرياضيات: Adding single number to 2 digit numbers',
    note: 'Unit 2: Adding single number to 2 digit numbers. Bring Maths Sheet 1 and Grid Notebook.',
    arabicNote: 'إحضار شيت الماث (Maths-Grade2-B1-All-Sheet1 - Main) وكشكول الماث المسطر لحصة الرياضيات (Unit 2: Adding single number to 2 digit numbers).',
    bagItem: 'Maths-Grade2-B1-All-Sheet1 - Main & Grid Notebook',
    priority: 'normal',
    block: 1,
    week: 3
  })),

  // Sunday evening -> for Monday (targetDay: Monday)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-w3-math-mon-prep-${cls.toLowerCase()}`,
    classId: cls,
    targetDay: 'Monday',
    subject: 'Mathematics',
    period: cls === 'G2A' ? 8 : (cls === 'G2B' ? 3 : 8),
    title: 'تسليم واجب الماث وحصة الطرح',
    note: 'Submit Math HW Pages 82, 83. Unit 2: Subtracting single number from 2 digit numbers.',
    arabicNote: 'تسليم واجب الماث ص 82 و 83 وإحضار شيت الماث وكشكول الرياضيات لدراسة طرح الأعداد.',
    bagItem: 'Maths Sheet 1 (Pages 82, 83 HW)',
    priority: 'normal',
    block: 1,
    week: 3
  })),

  // Monday evening -> for Tuesday (targetDay: Tuesday)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-w3-math-tue-prep-${cls.toLowerCase()}`,
    classId: cls,
    targetDay: 'Tuesday',
    subject: 'Mathematics',
    period: cls === 'G2A' ? 3 : (cls === 'G2B' ? 1 : 3),
    title: 'تسليم واجب الماث وحصة مضاعفات 10',
    note: 'Submit Math HW Page 88. Unit 2: Add and subtract 10 and multiples of 10.',
    arabicNote: 'تسليم واجب الماث ص 88 في شيت الرياضيات وإحضار الأدوات لحصة الجمع والطرح بمضاعفات الـ 10.',
    bagItem: 'Maths Sheet 1 (Page 88 HW)',
    priority: 'normal',
    block: 1,
    week: 3
  })),

  // Tuesday evening -> for Wednesday (targetDay: Wednesday)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-w3-math-wed-prep-${cls.toLowerCase()}`,
    classId: cls,
    targetDay: 'Wednesday',
    subject: 'Mathematics',
    period: cls === 'G2A' ? 1 : (cls === 'G2B' ? 5 : 7),
    title: 'تسليم واجب الماث وحصة Money',
    note: 'Submit Math HW Page 89. Unit 2: Money topic.',
    arabicNote: 'تسليم واجب الماث ص 89 وإحضار شيت الماث لمتابعة درس النقود (Money).',
    bagItem: 'Maths Sheet 1 (Page 89 HW)',
    priority: 'normal',
    block: 1,
    week: 3
  })),

  // Wednesday evening -> for Thursday (targetDay: Thursday)
  // INSTRUCTION: "ولو في Test، حطي إنذار قبله في الـ Homework وفي الـ Tomorrow، اليوم اللي قبله."
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-w3-math-thu-test-${cls.toLowerCase()}`,
    classId: cls,
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: cls === 'G2A' ? 1 : (cls === 'G2B' ? 4 : 6),
    title: '🚨 إنذار وتنبيه هام: غداً الخميس اختبار رياضيات (Unit 2 Math Test)',
    note: '🚨 Alert: Unit 2 Math Test Tomorrow (Thursday)! Review addition, subtraction, multiples of 10, and money (Pages 82 to 89). Bring pencil, eraser, ruler, and Grid Notebook.',
    arabicNote: '🚨 إنذار وتنبيه هام: غداً الخميس اختبار رياضيات (Unit 2 Math Test) لجميع فصول الصف الثاني! يرجى المذاكرة الجيدة ومراجعة دروس الوحدة الثانية في شيت الماث، وإحضار قلم رصاص، مسطرة، ممحاة، وكشكول الماث.',
    bagItem: 'Maths Sheet 1, Pencil Case (Pencil, Eraser, Ruler) & Grid Notebook',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 3
  }))
];

// Append new entries
plannerData.classwork.push(...mathClasswork);
plannerData.homework.push(...mathHomework);
plannerData.tomorrowNotes.push(...mathTomorrowNotes);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('Mathematics Week 3 Seeding Completed Successfully!');
console.log(`Classwork items added: ${mathClasswork.length}`);
console.log(`Homework items added: ${mathHomework.length}`);
console.log(`Tomorrow notes added: ${mathTomorrowNotes.length}`);
