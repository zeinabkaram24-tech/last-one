const fs = require('fs');

console.log('Starting English Week 5 Seeder (Block 1 - Week 5)...');

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

// 1. Clean existing Week 5 English entries to avoid duplicates
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(cw.week === 5 && (cw.subject === 'English' || cw.subject === 'english'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(hw.week === 5 && (hw.subject === 'English' || hw.subject === 'english'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(tn.week === 5 && (tn.subject === 'English' || tn.subject === 'english'))
);

// 2. Classwork entries for Week 5 English (4 days x 3 classes)
const englishClasswork = [
  // --- Sunday (4/10/2026) ---
  {
    id: 'cw-b1-w5-G2A-Sunday-p5-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 5,
    subject: 'English',
    title: 'Vocabulary & Prepositions: Look at us',
    details: 'Unit: Look at us. Focus on Vocabulary & Prepositions. Classwork exercises on pages: CW. 45, 46 and 48.',
    pages: 'CW. 45, 46, 48',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2B-Sunday-p1-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 1,
    subject: 'English',
    title: 'Prepositions: Look at us',
    details: 'Unit: Look at us. Practice prepositions on page: CW. 48.',
    pages: 'CW. 48',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2C-Sunday-p1-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 1,
    subject: 'English',
    title: 'Vocabulary & Prepositions: Look at us',
    details: 'Unit: Look at us. Focus on Vocabulary & Prepositions. Classwork exercises on pages: CW. 45, 46 and 48.',
    pages: 'CW. 45, 46, 48',
    completed: false,
    block: 1,
    week: 5
  },

  // --- Monday (5/10/2026) ---
  {
    id: 'cw-b1-w5-G2A-Monday-p3-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: 3,
    subject: 'English',
    title: 'Listening, Reading & Revision: Look at us',
    details: 'Unit: Look at us. Focus on Listening, Reading & Revision. Classwork exercises on pages: CW. 47 and 52.',
    pages: 'CW. 47, 52',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2B-Monday-p5-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 5,
    subject: 'English',
    title: 'Grammar, Listening & Reading: Look at us',
    details: 'Unit: Look at us. Focus on Grammar, Listening & Reading. Classwork exercises on pages: CW. 50, 47 and 52.',
    pages: 'CW. 50, 47, 52',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2C-Monday-p6-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 6,
    subject: 'English',
    title: 'Listening & Reading: Look at us',
    details: 'Unit: Look at us. Focus on Listening and Reading. Classwork exercises on pages: CW. 47 and 52.',
    pages: 'CW. 47, 52',
    completed: false,
    block: 1,
    week: 5
  },

  // --- Tuesday (6/10/2026) ---
  {
    id: 'cw-b1-w5-G2A-Tuesday-p7-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 7,
    subject: 'English',
    title: 'Grammar: Look at us',
    details: 'Unit: Look at us. Focus on Grammar lesson. Classwork exercises on page: CW. 50.',
    pages: 'CW. 50',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2B-Tuesday-p7-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: 7,
    subject: 'English',
    title: 'Grammar & Vocabulary: Look at us',
    details: 'Unit: Look at us. Grammar and Vocabulary. Classwork exercises on pages: CW. 51, 45 and 46.',
    pages: 'CW. 51, 45, 46',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2C-Tuesday-p4-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 4,
    subject: 'English',
    title: 'Grammar: Look at us',
    details: 'Unit: Look at us. Focus on Grammar lesson. Classwork exercises on page: CW. 50.',
    pages: 'CW. 50',
    completed: false,
    block: 1,
    week: 5
  },

  // --- Wednesday (7/10/2026) ---
  {
    id: 'cw-b1-w5-G2A-Wednesday-p7-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 7,
    subject: 'English',
    title: '🚨 Dictation & Grammar: Look at us',
    details: 'Weekly Dictation list assessment in Dictation Copybook & Grammar lesson on page CW. 51.',
    pages: 'Dictation Copybook, CW. 51',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2B-Wednesday-p1-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 1,
    subject: 'English',
    title: '🚨 Dictation: Look at us',
    details: 'Weekly Dictation list assessment in Dictation Copybook.',
    pages: 'Dictation Copybook',
    completed: false,
    block: 1,
    week: 5
  },
  {
    id: 'cw-b1-w5-G2C-Wednesday-p4-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 4,
    subject: 'English',
    title: '🚨 Dictation & Grammar: Look at us',
    details: 'Weekly Dictation list assessment in Dictation Copybook & Grammar lesson on page CW. 51.',
    pages: 'Dictation Copybook, CW. 51',
    completed: false,
    block: 1,
    week: 5
  }
];

// 3. Homework entries for Week 5 English
const englishHomework = [
  // --- Monday Homework (Due Tuesday 6/10/2026) ---
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w5-${cls}-Mon-english-pages`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'English',
    task: 'English Homework: Solve Pages 77, 78 & 79',
    details: 'Unit: Look at us. Solve exercises on Pages 77, 78, and 79 in the Workbook / Classwork book.',
    pages: 'Pages 77, 78, 79',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 5
  })),

  // --- Dictation Alert Homework for Saturday, Sunday, Monday, Tuesday ---
  ...['Saturday', 'Sunday', 'Monday', 'Tuesday'].flatMap((day) => 
    ['G2A', 'G2B', 'G2C'].map((cls) => ({
      id: `hw-b1-w5-${cls}-${day.substring(0, 3)}-english-dictation-list`,
      classId: cls,
      class_id: cls,
      assignedDay: day,
      dueDay: 'Wednesday',
      subject: 'English',
      task: '🚨 Dictation List: Prepare for Dictation on Wednesday!',
      details: 'Prepare for the English Dictation on Wednesday. Dictation list is written in simple sentences. Always start sentences with CAPITAL letters.\nWords to study:\nTeddy bear, Rocket, Puzzle, Train, Plane, Robot, Bike, Kite, Ball, Doll, Car, Top.',
      pages: 'Dictation List',
      completed: false,
      priority: 'high',
      block: 1,
      week: 5
    }))
  )
];

// 4. Tomorrow Notes for Week 5 English (Tuesday evening -> targetDay: Wednesday)
const englishTomorrowNotes = [
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-b1-w5-english-wed-dictation-${cls.toLowerCase()}`,
    classId: cls,
    class_id: cls,
    targetDay: 'Wednesday',
    subject: 'English',
    period: cls === 'G2A' ? 7 : (cls === 'G2B' ? 1 : 4),
    title: 'Dictation',
    note: 'Dictation',
    arabicNote: '🚨 إنذار وتنبيه هام: غداً الأربعاء إملاء لغة إنجليزية (English Dictation) لكل الفصول! يرجى المراجعة والاستعداد وحفظ الكلمات وكتابتها في جمل تبدأ بحرف كبير (Capital Letter). الكلمات المطلوبة: Teddy bear, Rocket, Puzzle, Train, Plane, Robot, Bike, Kite, Ball, Doll, Car, Top.',
    bagItem: 'Dictation copybook (كشكول الإملاء) وقلم رصاص وممحاة',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 5
  }))
];

// Append new entries to plannerData
plannerData.classwork.push(...englishClasswork);
plannerData.homework.push(...englishHomework);
plannerData.tomorrowNotes.push(...englishTomorrowNotes);

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
      (cw) => !(cw.week === 5 && (cw.subject === 'English' || cw.subject === 'english'))
    );
    initialData.homework = initialData.homework.filter(
      (hw) => !(hw.week === 5 && (hw.subject === 'English' || hw.subject === 'english'))
    );
    initialData.tomorrowNotes = initialData.tomorrowNotes.filter(
      (tn) => !(tn.week === 5 && (tn.subject === 'English' || tn.subject === 'english'))
    );

    initialData.classwork.push(...englishClasswork);
    initialData.homework.push(...englishHomework);
    initialData.tomorrowNotes.push(...englishTomorrowNotes);

    fs.writeFileSync(initialDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Successfully updated src/data/initialData.json as well!');
  } catch (err) {
    console.warn('Could not update src/data/initialData.json:', err);
  }
}

console.log('English Week 5 Seeding Completed Successfully!');
console.log(`Classwork items added: ${englishClasswork.length}`);
console.log(`Homework items added: ${englishHomework.length}`);
console.log(`Tomorrow notes added: ${englishTomorrowNotes.length}`);
