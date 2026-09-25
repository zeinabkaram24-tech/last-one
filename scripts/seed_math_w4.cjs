const fs = require('fs');
const path = require('path');

console.log('Starting Mathematics Week 4 Seeder (Block 1 - Week 4)...');

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

// 1. Clean existing Week 4 Mathematics entries to avoid duplicates
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(cw.week === 4 && (cw.subject === 'Mathematics' || cw.subject === 'Math'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(hw.week === 4 && (hw.subject === 'Mathematics' || hw.subject === 'Math'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(tn.week === 4 && (tn.subject === 'Mathematics' || tn.subject === 'Math'))
);

const mathPdfUrl = 'https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483250130_Maths-Grade2-B1-All-Sheet1_-_Main.pdf';

// 2. Classwork entries for Week 4 Mathematics (5 days x 3 classes)
const mathClasswork = [
  // --- Sunday (27/9/2026): 2D shapes ---
  {
    id: 'cw-b1-w4-G2A-Sunday-p8-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes',
    details: 'Unit 3: 2D shapes - Identifying and naming basic 2D shapes. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2B-Sunday-p2-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 2,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes',
    details: 'Unit 3: 2D shapes - Identifying and naming basic 2D shapes. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2C-Sunday-p3-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes',
    details: 'Unit 3: 2D shapes - Identifying and naming basic 2D shapes. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2C-Sunday-p4-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 4,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes - Practice',
    details: 'Practice drawing and labeling vertices and sides of 2D shapes on Sheet 1.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },

  // --- Monday (28/9/2026): 2D shapes ---
  {
    id: 'cw-b1-w4-G2A-Monday-p8-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes',
    details: 'Unit 3: 2D shapes - Describing shapes (vertices, sides) and solving shape puzzles. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2B-Monday-p3-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes',
    details: 'Unit 3: 2D shapes - Describing shapes (vertices, sides) and solving shape puzzles. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2B-Monday-p4-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 4,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes - Vertices & Sides',
    details: 'Deep practice on properties of 2D shapes: triangles, rectangles, squares, pentagons, hexagons.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2C-Monday-p8-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 3: 2D shapes',
    details: 'Unit 3: 2D shapes - Describing shapes (vertices, sides) and solving shape puzzles. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },

  // --- Tuesday (29/9/2026): Line of symmetry ---
  {
    id: 'cw-b1-w4-G2A-Tuesday-p3-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 3: Line of symmetry',
    details: 'Unit 3: Line of symmetry - Finding and drawing lines of symmetry in various 2D shapes. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2A-Tuesday-p4-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 4,
    subject: 'Mathematics',
    title: 'Unit 3: Line of symmetry - Drawing Lines',
    details: 'Practical drawing and folding exercises to identify lines of symmetry on sheet 1.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2B-Tuesday-p1-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: 1,
    subject: 'Mathematics',
    title: 'Unit 3: Line of symmetry',
    details: 'Unit 3: Line of symmetry - Finding and drawing lines of symmetry in various 2D shapes. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2C-Tuesday-p3-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 3: Line of symmetry',
    details: 'Unit 3: Line of symmetry - Finding and drawing lines of symmetry in various 2D shapes. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },

  // --- Wednesday (30/9/2026): Line of symmetry ---
  {
    id: 'cw-b1-w4-G2A-Wednesday-p1-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 1,
    subject: 'Mathematics',
    title: 'Unit 3: Line of symmetry',
    details: 'Unit 3: Line of symmetry - Exercises and puzzles regarding symmetric properties of regular polygons. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2B-Wednesday-p5-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 5,
    subject: 'Mathematics',
    title: 'Unit 3: Line of symmetry',
    details: 'Unit 3: Line of symmetry - Exercises and puzzles regarding symmetric properties of regular polygons. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2C-Wednesday-p7-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 7,
    subject: 'Mathematics',
    title: 'Unit 3: Line of symmetry',
    details: 'Unit 3: Line of symmetry - Exercises and puzzles regarding symmetric properties of regular polygons. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },

  // --- Thursday (1/10/2026): Test your self ---
  {
    id: 'cw-b1-w4-G2A-Thursday-p1-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 1,
    subject: 'Mathematics',
    title: '🚨 Unit 3 Math Test (Test your self)',
    details: 'Unit 3 Test - Comprehensive assessment covering 2D shapes (sides, vertices) and Line of symmetry. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Test your self (Maths Sheet 1)',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2B-Thursday-p4-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 4,
    subject: 'Mathematics',
    title: '🚨 Unit 3 Math Test (Test your self)',
    details: 'Unit 3 Test - Comprehensive assessment covering 2D shapes (sides, vertices) and Line of symmetry. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Test your self (Maths Sheet 1)',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  },
  {
    id: 'cw-b1-w4-G2C-Thursday-p6-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 6,
    subject: 'Mathematics',
    title: '🚨 Unit 3 Math Test (Test your self)',
    details: 'Unit 3 Test - Comprehensive assessment covering 2D shapes (sides, vertices) and Line of symmetry. Resource: Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Test your self (Maths Sheet 1)',
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  }
];

// 3. Homework entries for Week 4 Mathematics
const mathHomework = [
  // Sunday 27/9 -> Due Monday 28/9: Maths-Grade2-B1-All-Sheet1 - Main
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Sun-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Sunday Homework',
    details: 'Unit 3: 2D shapes - Solve exercises on Sunday homework section in Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  })),

  // Monday 28/9 -> Due Tuesday 29/9: Maths-Grade2-B1-All-Sheet1 - Main p.92
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Mon-math-p92`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Page 92',
    details: 'Unit 3: 2D shapes - Solve exercises on Page 92 on Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Page 92',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  })),

  // Tuesday 29/9 -> Due Wednesday 30/9: Maths-Grade2-B1-All-Sheet1 - Main
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Tue-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Tuesday Homework',
    details: 'Unit 3: Line of symmetry - Solve symmetric drawing exercises on Tuesday homework section in Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  })),

  // Wednesday 30/9 -> Due Thursday 1/10: Maths-Grade2-B1-All-Sheet1 - Main p. 93
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Wed-math-p93`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Page 93',
    details: 'Unit 3: Line of symmetry - Complete symmetrical pattern exercises on Page 93 in Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Page 93',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  })),

  // Wednesday 30/9 -> DUE THURSDAY: Task Test Alert in Homework section
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Wed-math-test-alert`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: '🚨 Task Test',
    details: '🚨 Study for the Math Test tomorrow! Assessment covers Unit 3 "2D shapes" and "Line of symmetry" from Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Test your self (Maths Sheet 1)',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  })),

  // Thursday 1/10 -> Due Sunday: Maths-Grade2-B1-All-Sheet1 - Main
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Thu-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'Mathematics',
    task: 'Maths Sheet 1: Solve Thursday Homework',
    details: 'Unit 3: Post-test revision - Solve Thursday exercises in Maths-Grade2-B1-All-Sheet1 - Main.',
    pages: 'Maths-Grade2-B1-All-Sheet1 - Main',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4,
    pdfUrl: mathPdfUrl
  }))
];

// 4. Tomorrow Notes for Week 4 Mathematics (Wednesday evening -> targetDay: Thursday)
const mathTomorrowNotes = [
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-b1-w4-math-thu-test-${cls.toLowerCase()}`,
    classId: cls,
    class_id: cls,
    targetDay: 'Thursday',
    subject: 'Mathematics',
    period: cls === 'G2A' ? 1 : (cls === 'G2B' ? 4 : 6),
    title: 'Task Test',
    note: 'Task Test',
    arabicNote: '🚨 اختبار قصير (Task Test) في مادة الرياضيات غداً - مراجعة دروس الوحدة الثالثة 2D shapes و Line of symmetry.',
    bagItem: 'Maths-Grade2-B1-All-Sheet1 - Main',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 4
  }))
];

// Append new entries to plannerData
plannerData.classwork.push(...mathClasswork);
plannerData.homework.push(...mathHomework);
plannerData.tomorrowNotes.push(...mathTomorrowNotes);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

// Also update src/data/initialData.json if it exists, to be perfectly safe
const initialDataPath = 'src/data/initialData.json';
if (fs.existsSync(initialDataPath)) {
  try {
    let initialData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    if (!initialData.classwork) initialData.classwork = [];
    if (!initialData.homework) initialData.homework = [];
    if (!initialData.tomorrowNotes) initialData.tomorrowNotes = [];

    initialData.classwork = initialData.classwork.filter(
      (cw) => !(cw.week === 4 && (cw.subject === 'Mathematics' || cw.subject === 'Math'))
    );
    initialData.homework = initialData.homework.filter(
      (hw) => !(hw.week === 4 && (hw.subject === 'Mathematics' || hw.subject === 'Math'))
    );
    initialData.tomorrowNotes = initialData.tomorrowNotes.filter(
      (tn) => !(tn.week === 4 && (tn.subject === 'Mathematics' || tn.subject === 'Math'))
    );

    initialData.classwork.push(...mathClasswork);
    initialData.homework.push(...mathHomework);
    initialData.tomorrowNotes.push(...mathTomorrowNotes);

    fs.writeFileSync(initialDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Successfully updated src/data/initialData.json as well!');
  } catch (err) {
    console.warn('Could not update src/data/initialData.json:', err);
  }
}

console.log('Mathematics Week 4 Seeding Completed Successfully!');
console.log(`Classwork items added: ${mathClasswork.length}`);
console.log(`Homework items added: ${mathHomework.length}`);
console.log(`Tomorrow notes added: ${mathTomorrowNotes.length}`);
