const fs = require('fs');
const path = require('path');

console.log('Starting Mathematics Block 2 Week 1 Seeder...');

const plannerPath = path.join(process.cwd(), 'data', 'planner_data.json');
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

// Remove any existing Block 2 Week 1 Math entries to avoid duplicates
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(Number(cw.block) === 2 && Number(cw.week) === 1 && (cw.subject === 'Mathematics' || cw.subject === 'Math'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(Number(hw.block) === 2 && Number(hw.week) === 1 && (hw.subject === 'Mathematics' || hw.subject === 'Math'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(Number(tn.block) === 2 && Number(tn.week) === 1 && (tn.subject === 'Mathematics' || tn.subject === 'Math'))
);

const mathClasswork = [
  // --- Sunday (11/10/2026): Lesson 1 ---
  {
    id: 'cw-b2-w1-G2A-Sunday-p8-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 1 - Multiplication as repeat addition and commutative property',
    details: 'Unit 5: multiplication and division - Lesson 1: Multiplication as repeat addition and commutative property. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Sunday-p3-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 1 - Multiplication as repeat addition and commutative property',
    details: 'Unit 5: multiplication and division - Lesson 1: Multiplication as repeat addition and commutative property. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Sunday-p3-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 1 - Multiplication as repeat addition and commutative property',
    details: 'Unit 5: multiplication and division - Lesson 1: Multiplication as repeat addition and commutative property. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Monday (12/10/2026): Lesson 3 ---
  {
    id: 'cw-b2-w1-G2A-Monday-p6-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: 6,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 3 - 2, 5 and 10 times table',
    details: 'Unit 5: multiplication and division - Lesson 3: 2, 5 and 10 times table. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Monday-p3-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 3 - 2, 5 and 10 times table',
    details: 'Unit 5: multiplication and division - Lesson 3: 2, 5 and 10 times table. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Monday-p8-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 3 - 2, 5 and 10 times table',
    details: 'Unit 5: multiplication and division - Lesson 3: 2, 5 and 10 times table. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Tuesday (13/10/2026): Lesson 2 ---
  {
    id: 'cw-b2-w1-G2A-Tuesday-p3-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 2 - Relation between multiplication and division',
    details: 'Unit 5: multiplication and division - Lesson 2: Relation between multiplication and division. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Tuesday-p1-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: 1,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 2 - Relation between multiplication and division',
    details: 'Unit 5: multiplication and division - Lesson 2: Relation between multiplication and division. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Tuesday-p3-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 2 - Relation between multiplication and division',
    details: 'Unit 5: multiplication and division - Lesson 2: Relation between multiplication and division. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Wednesday (14/10/2026): Lesson 4 ---
  {
    id: 'cw-b2-w1-G2A-Wednesday-p1-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 1,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 4 - Halving and doubling',
    details: 'Unit 5: multiplication and division - Lesson 4: Halving and doubling. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Wednesday-p5-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 5,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 4 - Halving and doubling',
    details: 'Unit 5: multiplication and division - Lesson 4: Halving and doubling. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Wednesday-p7-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 7,
    subject: 'Mathematics',
    title: 'Unit 5: Lesson 4 - Halving and doubling',
    details: 'Unit 5: multiplication and division - Lesson 4: Halving and doubling. Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Thursday (15/10/2026): Test your self ---
  {
    id: 'cw-b2-w1-G2A-Thursday-p2-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 2,
    subject: 'Mathematics',
    title: '🚨 Test your self (Math Test)',
    details: 'Unit 5: multiplication and division - Test your self assessment covering Lessons 1 to 4 (multiplication as repeat addition, commutative property, 2, 5 & 10 times table, relation between multiplication & division, halving & doubling). Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Thursday-p6-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 6,
    subject: 'Mathematics',
    title: '🚨 Test your self (Math Test)',
    details: 'Unit 5: multiplication and division - Test your self assessment covering Lessons 1 to 4 (multiplication as repeat addition, commutative property, 2, 5 & 10 times table, relation between multiplication & division, halving & doubling). Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Thursday-p6-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 6,
    subject: 'Mathematics',
    title: '🚨 Test your self (Math Test)',
    details: 'Unit 5: multiplication and division - Test your self assessment covering Lessons 1 to 4 (multiplication as repeat addition, commutative property, 2, 5 & 10 times table, relation between multiplication & division, halving & doubling). Resource: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
];

const mathHomework = [
  // Sunday (Page 91)
  {
    id: 'hw-b2-w1-G2A-Sun-math',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'Mathematics',
    task: 'Page 91',
    details: 'Unit 5: Lesson 1 (Multiplication as repeat addition and commutative property) - Solve Page 91 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 91',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2B-Sun-math',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'Mathematics',
    task: 'Page 91',
    details: 'Unit 5: Lesson 1 (Multiplication as repeat addition and commutative property) - Solve Page 91 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 91',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2C-Sun-math',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'Mathematics',
    task: 'Page 91',
    details: 'Unit 5: Lesson 1 (Multiplication as repeat addition and commutative property) - Solve Page 91 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 91',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },

  // Monday (Page 92)
  {
    id: 'hw-b2-w1-G2A-Mon-math',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'Mathematics',
    task: 'Page 92',
    details: 'Unit 5: Lesson 3 (2, 5 and 10 times table) - Solve Page 92 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 92',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2B-Mon-math',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'Mathematics',
    task: 'Page 92',
    details: 'Unit 5: Lesson 3 (2, 5 and 10 times table) - Solve Page 92 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 92',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2C-Mon-math',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'Mathematics',
    task: 'Page 92',
    details: 'Unit 5: Lesson 3 (2, 5 and 10 times table) - Solve Page 92 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 92',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },

  // Tuesday (Page 93)
  {
    id: 'hw-b2-w1-G2A-Tue-math',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'Mathematics',
    task: 'Page 93',
    details: 'Unit 5: Lesson 2 (Relation between multiplication and division) - Solve Page 93 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 93',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2B-Tue-math',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'Mathematics',
    task: 'Page 93',
    details: 'Unit 5: Lesson 2 (Relation between multiplication and division) - Solve Page 93 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 93',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2C-Tue-math',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'Mathematics',
    task: 'Page 93',
    details: 'Unit 5: Lesson 2 (Relation between multiplication and division) - Solve Page 93 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 93',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },

  // Wednesday (Page 94)
  {
    id: 'hw-b2-w1-G2A-Wed-math',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: 'Page 94',
    details: 'Unit 5: Lesson 4 (Halving and doubling) - Solve Page 94 from Maths-Grade2-B2-All-Sheet2 - Main. 🚨 استعد للاختبار القصير غداً الخميس!',
    pages: 'Page 94',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2B-Wed-math',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: 'Page 94',
    details: 'Unit 5: Lesson 4 (Halving and doubling) - Solve Page 94 from Maths-Grade2-B2-All-Sheet2 - Main. 🚨 استعد للاختبار القصير غداً الخميس!',
    pages: 'Page 94',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2C-Wed-math',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: 'Page 94',
    details: 'Unit 5: Lesson 4 (Halving and doubling) - Solve Page 94 from Maths-Grade2-B2-All-Sheet2 - Main. 🚨 استعد للاختبار القصير غداً الخميس!',
    pages: 'Page 94',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
  },

  // Thursday (Page 95)
  {
    id: 'hw-b2-w1-G2A-Thu-math',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'Mathematics',
    task: 'Page 95',
    details: 'Unit 5: Post-test practice - Solve Page 95 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 95',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2B-Thu-math',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'Mathematics',
    task: 'Page 95',
    details: 'Unit 5: Post-test practice - Solve Page 95 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 95',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2C-Thu-math',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'Mathematics',
    task: 'Page 95',
    details: 'Unit 5: Post-test practice - Solve Page 95 from Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Page 95',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
];

// Tomorrow notes for Wednesday night alert (targetDay: Thursday)
const mathTomorrowNotes = [
  {
    id: 'tn-b2-w1-math-thu-test-g2a',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: 2,
    title: 'Test your self (Math Test)',
    note: 'Math Test: Test your self on Unit 5 multiplication and division tomorrow Thursday.',
    arabicNote: '🚨 اختبار مادة الرياضيات (Math Test - Test your self) غداً الخميس على Unit 5: Multiplication and Division (جداول الضرب والعلاقة بين الضرب والقسمة والمضاعفة والتنصيف).',
    bagItem: 'Maths-Grade2-B2-All-Sheet2 - Main (كشكول الماث وأدوات الهندسة وشيت 2)',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-math-thu-test-g2b',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: 6,
    title: 'Test your self (Math Test)',
    note: 'Math Test: Test your self on Unit 5 multiplication and division tomorrow Thursday.',
    arabicNote: '🚨 اختبار مادة الرياضيات (Math Test - Test your self) غداً الخميس على Unit 5: Multiplication and Division (جداول الضرب والعلاقة بين الضرب والقسمة والمضاعفة والتنصيف).',
    bagItem: 'Maths-Grade2-B2-All-Sheet2 - Main (كشكول الماث وأدوات الهندسة وشيت 2)',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-math-thu-test-g2c',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: 6,
    title: 'Test your self (Math Test)',
    note: 'Math Test: Test your self on Unit 5 multiplication and division tomorrow Thursday.',
    arabicNote: '🚨 اختبار مادة الرياضيات (Math Test - Test your self) غداً الخميس على Unit 5: Multiplication and Division (جداول الضرب والعلاقة بين الضرب والقسمة والمضاعفة والتنصيف).',
    bagItem: 'Maths-Grade2-B2-All-Sheet2 - Main (كشكول الماث وأدوات الهندسة وشيت 2)',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 2,
    week: 1,
  },
];

// Append to plannerData
plannerData.classwork.push(...mathClasswork);
plannerData.homework.push(...mathHomework);
plannerData.tomorrowNotes.push(...mathTomorrowNotes);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('Successfully written to data/planner_data.json!');

// Also update src/data/initialData.json if it exists
const initialDataPath = path.join(process.cwd(), 'src', 'data', 'initialData.json');
if (fs.existsSync(initialDataPath)) {
  try {
    let initialData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    if (!initialData.classwork) initialData.classwork = [];
    if (!initialData.homework) initialData.homework = [];
    if (!initialData.tomorrowNotes) initialData.tomorrowNotes = [];

    initialData.classwork = initialData.classwork.filter(
      (cw) => !(Number(cw.block) === 2 && Number(cw.week) === 1 && (cw.subject === 'Mathematics' || cw.subject === 'Math'))
    );
    initialData.homework = initialData.homework.filter(
      (hw) => !(Number(hw.block) === 2 && Number(hw.week) === 1 && (hw.subject === 'Mathematics' || hw.subject === 'Math'))
    );
    initialData.tomorrowNotes = initialData.tomorrowNotes.filter(
      (tn) => !(Number(tn.block) === 2 && Number(tn.week) === 1 && (tn.subject === 'Mathematics' || tn.subject === 'Math'))
    );

    initialData.classwork.push(...mathClasswork);
    initialData.homework.push(...mathHomework);
    initialData.tomorrowNotes.push(...mathTomorrowNotes);

    fs.writeFileSync(initialDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Successfully updated src/data/initialData.json!');
  } catch (err) {
    console.warn('Could not update src/data/initialData.json:', err);
  }
}

console.log('Mathematics Block 2 Week 1 Seeding Completed Successfully!');
console.log(`Classwork items added: ${mathClasswork.length}`);
console.log(`Homework items added: ${mathHomework.length}`);
console.log(`Tomorrow notes added: ${mathTomorrowNotes.length}`);
