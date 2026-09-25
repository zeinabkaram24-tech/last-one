const fs = require('fs');

console.log('Starting English Week 4 Seeder (Block 1 - Week 4)...');

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

// 1. Clean existing Week 4 English entries to avoid duplicates
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(cw.week === 4 && (cw.subject === 'English' || cw.subject === 'english'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(hw.week === 4 && (hw.subject === 'English' || hw.subject === 'english'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(tn.week === 4 && (tn.subject === 'English' || tn.subject === 'english'))
);

// 2. Classwork entries for Week 4 English (5 days x 3 classes)
const englishClasswork = [
  // --- Sunday (27/9/2026) ---
  {
    id: 'cw-b1-w4-G2A-Sunday-p5-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 5,
    subject: 'English',
    title: 'Grammar: Look at us',
    details: 'Unit: Look at us. Focus on Grammar lesson. Classwork exercises on pages: CW. 35, 36 and 37.',
    pages: 'CW. 35, 36, 37',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2B-Sunday-p1-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 1,
    subject: 'English',
    title: 'Punctuation & Listening: Look at us',
    details: 'Unit: Look at us. Practice punctuation rules and listening comprehension. Resources: CW. 44 and CW. 38.',
    pages: 'CW. 44, 38',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Sunday-p1-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 1,
    subject: 'English',
    title: 'Grammar: Look at us',
    details: 'Unit: Look at us. Focus on Grammar lesson. Classwork exercises on pages: CW. 35, 36 and 37.',
    pages: 'CW. 35, 36, 37',
    completed: false,
    block: 1,
    week: 4
  },

  // --- Monday (28/9/2026) ---
  {
    id: 'cw-b1-w4-G2A-Monday-p4-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: 4,
    subject: 'English',
    title: 'Reading: Look at us',
    details: 'Unit: Look at us. Reading comprehension and fluency practice. Resources: CW. 41, 42 and 43.',
    pages: 'CW. 41, 42, 43',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2B-Monday-p5-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 5,
    subject: 'English',
    title: 'Grammar: Look at us',
    details: 'Unit: Look at us. Grammar structures. Resources: CW. 35, 36 and 37.',
    pages: 'CW. 35, 36, 37',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Monday-p7-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 7,
    subject: 'English',
    title: 'Punctuation & Listening: Look at us',
    details: 'Unit: Look at us. Punctuation exercises and listening activities. Resources: CW. 44 and CW. 38.',
    pages: 'CW. 44, 38',
    completed: false,
    block: 1,
    week: 4
  },

  // --- Tuesday (29/9/2026) ---
  {
    id: 'cw-b1-w4-G2A-Tuesday-p7-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 7,
    subject: 'English',
    title: 'Revision: Look at us',
    details: 'Unit: Look at us. General revision and exercises on Extra sheet.',
    pages: 'Extra sheet',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2B-Tuesday-p7-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: 7,
    subject: 'English',
    title: 'Revision & Vocabulary: Look at us',
    details: 'Unit: Look at us. Revision of vocabulary words. Resources: Extra sheet & CW. 33, 34.',
    pages: 'Extra sheet, CW. 33, 34',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Tuesday-p6-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 6,
    subject: 'English',
    title: 'Revision: Look at us',
    details: 'Unit: Look at us. General revision and exercises on Extra sheet.',
    pages: 'Extra sheet',
    completed: false,
    block: 1,
    week: 4
  },

  // --- Wednesday (30/9/2026) ---
  {
    id: 'cw-b1-w4-G2A-Wednesday-p7-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 7,
    subject: 'English',
    title: 'Story "MR. Fox" & Punctuation',
    details: 'Reading the story "MR. Fox" and practicing punctuation & listening. Resources: CW. 44 and CW. 38.',
    pages: 'CW. 44, 38',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2B-Wednesday-p1-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 1,
    subject: 'English',
    title: 'Story "Mr. Fox"',
    details: 'Reading and discussing the story "Mr. Fox" with focus on characters and plot.',
    pages: 'Storybook',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Wednesday-p4-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 4,
    subject: 'English',
    title: 'Story "Mr. Fox" & Punctuation',
    details: 'Reading the story "Mr. Fox" and practicing punctuation & listening. Resources: CW. 44 and CW. 38.',
    pages: 'CW. 44, 38',
    completed: false,
    block: 1,
    week: 4
  },

  // --- Thursday (1/10/2026) ---
  {
    id: 'cw-b1-w4-G2A-Thursday-p6-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 6,
    subject: 'English',
    title: '🚨 Dictation & Vocabulary',
    details: 'Dictation check in Dictation copybook and vocabulary study. Resources: CW. 33 and 34.',
    pages: 'Dictation copybook, CW. 33, 34',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2B-Thursday-p5-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 5,
    subject: 'English',
    title: '🚨 Dictation & Reading',
    details: 'Dictation check in Dictation copybook and reading comprehension practice. Resources: CW. 41, 42 and 43.',
    pages: 'Dictation copybook, CW. 41, 42, 43',
    completed: false,
    block: 1,
    week: 4
  },
  {
    id: 'cw-b1-w4-G2C-Thursday-p3-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 3,
    subject: 'English',
    title: '🚨 Dictation & Reading',
    details: 'Dictation check in Dictation copybook and reading comprehension practice. Resources: CW. 41, 42 and 43.',
    pages: 'Dictation copybook, CW. 41, 42, 43',
    completed: false,
    block: 1,
    week: 4
  }
];

// 3. Homework entries for Week 4 English
const englishHomework = [
  // --- Monday Homework (Due Tuesday 29/9/2026) ---
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Mon-english-pages`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'English',
    task: 'English Homework: Solve Pages 67, 68 & 69',
    details: 'Unit: Look at us. Solve exercises on Pages 67, 68, and 69 in the Activity Book.',
    pages: 'Pages 67, 68, 69',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4
  })),

  // --- Wednesday Alert Homework (Due Thursday 1/10/2026) ---
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Wed-english-dictation-alert`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'English',
    task: '🚨 Dictation List: Prepare for Dictation tomorrow!',
    details: 'Prepare for the Dictation tomorrow. Dictation list is written in simple sentences. Always start sentences with CAPITAL letters.\nWords to study:\nThere is, There are, like – love, singing, fishing, watching TV, riding a bike, running, eating chocolate, park.',
    pages: 'Dictation List',
    completed: false,
    priority: 'high',
    block: 1,
    week: 4
  })),

  // --- Thursday Homework for ALL THREE CLASSES (Due Sunday) ---
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b1-w4-${cls}-Thu-english-pages`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'English',
    task: 'English Homework: Solve Pages 71 & 72',
    details: 'Unit: Look at us. Solve exercises on Pages 71 and 72 in the Activity book.',
    pages: 'Pages 71, 72',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4
  }))
];

// 4. Tomorrow Notes for Week 4 English (Wednesday evening -> targetDay: Thursday)
const englishTomorrowNotes = [
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `tn-b1-w4-english-thu-dictation-${cls.toLowerCase()}`,
    classId: cls,
    class_id: cls,
    targetDay: 'Thursday',
    subject: 'English',
    period: cls === 'G2A' ? 6 : (cls === 'G2B' ? 5 : 3),
    title: 'Dictation',
    note: 'Dictation',
    arabicNote: '🚨 ديكتيشن لغة إنجليزية غداً - مراجعة وحفظ كلمات الإملاء وكتابة جمل بسيطة تبدأ بحرف كبير (Capital Letter).',
    bagItem: 'Dictation copybook (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 1,
    week: 4
  }))
];

// Append new entries to plannerData
plannerData.classwork.push(...englishClasswork);
plannerData.homework.push(...englishHomework);
plannerData.tomorrowNotes.push(...englishTomorrowNotes);

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
      (cw) => !(cw.week === 4 && (cw.subject === 'English' || cw.subject === 'english'))
    );
    initialData.homework = initialData.homework.filter(
      (hw) => !(hw.week === 4 && (hw.subject === 'English' || hw.subject === 'english'))
    );
    initialData.tomorrowNotes = initialData.tomorrowNotes.filter(
      (tn) => !(tn.week === 4 && (tn.subject === 'English' || tn.subject === 'english'))
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

console.log('English Week 4 Seeding Completed Successfully!');
console.log(`Classwork items added: ${englishClasswork.length}`);
console.log(`Homework items added: ${englishHomework.length}`);
console.log(`Tomorrow notes added: ${englishTomorrowNotes.length}`);
