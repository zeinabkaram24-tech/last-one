const fs = require('fs');

console.log('Starting French Week 5 Seeder (Block 1 - Week 5)...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [], deletedTomorrowNoteIds: [] };

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
if (!plannerData.deletedTomorrowNoteIds) plannerData.deletedTomorrowNoteIds = [];

// 1. Clean existing Week 5 French entries to avoid duplicates
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(cw.week === 5 && (cw.subject === 'French' || cw.subject === 'Français'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(hw.week === 5 && (hw.subject === 'French' || hw.subject === 'Français'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(tn.week === 5 && (tn.subject === 'French' || tn.subject === 'Français'))
);

// Unblock any deletedTomorrowNoteIds related to French
plannerData.deletedTomorrowNoteIds = plannerData.deletedTomorrowNoteIds.filter(
  (id) => !id.toLowerCase().includes('french') && !id.includes('فرنش')
);

// 2. Classwork entries for Week 5 French
const frenchClasswork = [
  // ================== G2A French ==================
  // Session 1: Tuesday Period 1
  {
    id: 'cw-b1-w5-G2A-Tuesday-p1-french',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 1,
    subject: 'French',
    title: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Cours 1)',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? Fiche de classe Pages 31 & 32 مع ميس دعاء فكري.',
    pages: 'Pages 31 & 32',
    completed: false,
    block: 1,
    week: 5
  },
  // Session 2: Wednesday Period 4 (With Quiz due to Thursday holiday)
  {
    id: 'cw-b1-w5-G2A-Wednesday-p4-french',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Cours 2) + Quiz 🚨',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Page 34) مع ميس دعاء فكري. + أداء كويز فرنسي (Quiz: Les animaux) لتعويض عطلة يوم الخميس.',
    pages: 'Page 34',
    completed: false,
    block: 1,
    week: 5
  },

  // ================== G2B French ==================
  // Session 1: Sunday Period 5
  {
    id: 'cw-b1-w5-G2B-Sunday-p5-french',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 5,
    subject: 'French',
    title: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Cours 1)',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? Fiche de classe Pages 31 & 32 مع ميس دعاء فكري.',
    pages: 'Pages 31 & 32',
    completed: false,
    block: 1,
    week: 5
  },
  // Session 2: Monday Period 7 (With Quiz due to Thursday holiday)
  {
    id: 'cw-b1-w5-G2B-Monday-p7-french',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 7,
    subject: 'French',
    title: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Cours 2) + Quiz 🚨',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Page 34) مع ميس دعاء فكري. + أداء كويز فرنسي (Quiz: Les animaux) لتعويض عطلة يوم الخميس.',
    pages: 'Page 34',
    completed: false,
    block: 1,
    week: 5
  },

  // ================== G2C French ==================
  // Session 1: Sunday Period 8
  {
    id: 'cw-b1-w5-G2C-Sunday-p8-french',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 8,
    subject: 'French',
    title: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Cours 1)',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? Fiche de classe Pages 31 & 32 مع ميس لمياء محمد.',
    pages: 'Pages 31 & 32',
    completed: false,
    block: 1,
    week: 5
  },
  // Session 2: Tuesday Period 6
  {
    id: 'cw-b1-w5-G2C-Tuesday-p6-french',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 6,
    subject: 'French',
    title: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Cours 2)',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Page 34) مع ميس لمياء محمد.',
    pages: 'Page 34',
    completed: false,
    block: 1,
    week: 5
  },
  // Session 3: Wednesday Period 2 (Normal Quiz session)
  {
    id: 'cw-b1-w5-G2C-Wednesday-p2-french',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 2,
    subject: 'French',
    title: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Cours 3) + Quiz 🚨',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? (Activité en classe) مع ميس لمياء محمد. + أداء كويز فرنسي (Quiz: Les animaux).',
    pages: 'Activité en classe',
    completed: false,
    block: 1,
    week: 5
  }
];

// 3. Homework entries for Week 5 French
const frenchHomework = [
  // ================== G2A Homework ==================
  // Homework on shifted Session 2: Wednesday -> Sunday
  {
    id: 'hw-b1-w5-G2A-Wed-french-p33',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Wednesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Cahier d’activités: Page 33',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? - حل تدريبات صفحة 33 في كراسة الواجب (Fiche de devoir).',
    pages: 'Page 33',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 5
  },
  // Quiz Alert: Tuesday -> Wednesday Quiz
  {
    id: 'hw-b1-w5-G2A-Tue-french-quiz-alert',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'French',
    task: '🚨 مراجعة واستعداد لكويز الفرنش غداً الأربعاء (Quiz: Les animaux)',
    details: 'يرجى مراجعة درس الحيوانات (Les animaux) جيداً في كتاب وشيت الفرنش استعداداً للكويز غداً الأربعاء.',
    pages: 'Les animaux',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 5
  },

  // ================== G2B Homework ==================
  // Homework on shifted Session 2: Monday -> Sunday
  {
    id: 'hw-b1-w5-G2B-Mon-french-p33',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Monday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Cahier d’activités: Page 33',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? - حل تدريبات صفحة 33 في كراسة الواجب (Fiche de devoir).',
    pages: 'Page 33',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 5
  },
  // Quiz Alert: Sunday -> Monday Quiz
  {
    id: 'hw-b1-w5-G2B-Sun-french-quiz-alert',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'French',
    task: '🚨 مراجعة واستعداد لكويز الفرنش غداً الاثنين (Quiz: Les animaux)',
    details: 'يرجى مراجعة درس الحيوانات (Les animaux) جيداً في كتاب وشيت الفرنش استعداداً للكويز غداً الاثنين.',
    pages: 'Les animaux',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 5
  },

  // ================== G2C Homework ==================
  // Homework on standard Session 3: Wednesday -> Sunday
  {
    id: 'hw-b1-w5-G2C-Wed-french-p33',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Wednesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Cahier d’activités: Page 33',
    details: 'Unité 4 leçon 2: Tu as combien de frères et soeurs? - حل تدريبات صفحة 33 في كراسة الواجب (Fiche de devoir).',
    pages: 'Page 33',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 5
  },
  // Quiz Alert: Tuesday -> Wednesday Quiz
  {
    id: 'hw-b1-w5-G2C-Tue-french-quiz-alert',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'French',
    task: '🚨 مراجعة واستعداد لكويز الفرنش غداً الأربعاء (Quiz: Les animaux)',
    details: 'يرجى مراجعة درس الحيوانات (Les animaux) جيداً في كتاب وشيت الفرنش استعداداً للكويز غداً الأربعاء.',
    pages: 'Les animaux',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 5
  }
];

// 4. Tomorrow Notes for Week 5 French
const frenchTomorrowNotes = [
  // G2A Quiz is Wednesday -> Alert on Tuesday
  {
    id: 'tn-b1-w5-G2A-french-quiz',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Wednesday',
    subject: 'French',
    period: 4,
    title: '🚨 تذكير هام: غداً الأربعاء كويز فرنش (Quiz: Les animaux)',
    note: '🚨 French Quiz Tomorrow (Wednesday): Quiz (Les animaux)',
    arabicNote: '🚨 تذكير هام: غداً الأربعاء كويز لغة فرنسية في الحصة الرابعة على موضوع الحيوانات (Les animaux). يرجى المذاكرة الجيدة وإحضار كتاب وكشكول الفرنش.',
    bagItem: 'French Manuel de cours & Cahier de français',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 5
  },
  // G2B Quiz is Monday -> Alert on Sunday
  {
    id: 'tn-b1-w5-G2B-french-quiz',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'French',
    period: 7,
    title: '🚨 تذكير هام: غداً الاثنين كويز فرنش (Quiz: Les animaux)',
    note: '🚨 French Quiz Tomorrow (Monday): Quiz (Les animaux)',
    arabicNote: '🚨 تذكير هام: غداً الاثنين كويز لغة فرنسية في الحصة السابعة على موضوع الحيوانات (Les animaux). يرجى المذاكرة الجيدة وإحضار كتاب وكشكول الفرنش.',
    bagItem: 'French Manuel de cours & Cahier de français',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 5
  },
  // G2C Quiz is Wednesday -> Alert on Tuesday
  {
    id: 'tn-b1-w5-G2C-french-quiz',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Wednesday',
    subject: 'French',
    period: 2,
    title: '🚨 تذكير هام: غداً الأربعاء كويز فرنش (Quiz: Les animaux)',
    note: '🚨 French Quiz Tomorrow (Wednesday): Quiz (Les animaux)',
    arabicNote: '🚨 تذكير هام: غداً الأربعاء كويز لغة فرنسية في الحصة الثانية على موضوع الحيوانات (Les animaux). يرجى المذاكرة الجيدة وإحضار كتاب وكشكول الفرنش.',
    bagItem: 'French Manuel de cours & Cahier de français',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 5
  }
];

// Append new entries to plannerData
plannerData.classwork.push(...frenchClasswork);
plannerData.homework.push(...frenchHomework);
plannerData.tomorrowNotes.push(...frenchTomorrowNotes);

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
      (cw) => !(cw.week === 5 && (cw.subject === 'French' || cw.subject === 'Français'))
    );
    initialData.homework = initialData.homework.filter(
      (hw) => !(hw.week === 5 && (hw.subject === 'French' || hw.subject === 'Français'))
    );
    initialData.tomorrowNotes = initialData.tomorrowNotes.filter(
      (tn) => !(tn.week === 5 && (tn.subject === 'French' || tn.subject === 'Français'))
    );

    initialData.classwork.push(...frenchClasswork);
    initialData.homework.push(...frenchHomework);
    initialData.tomorrowNotes.push(...frenchTomorrowNotes);

    fs.writeFileSync(initialDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('Successfully updated src/data/initialData.json as well!');
  } catch (err) {
    console.warn('Could not update src/data/initialData.json:', err);
  }
}

console.log('French Week 5 Seeding Completed Successfully!');
console.log(`Classwork items added: ${frenchClasswork.length}`);
console.log(`Homework items added: ${frenchHomework.length}`);
console.log(`Tomorrow notes added: ${frenchTomorrowNotes.length}`);
