const fs = require('fs');

console.log('Starting French Week 3 Seeder (Block 1 - Week 3)...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [], deletedTomorrowNoteIds: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// 1. Clean existing Week 3 French entries
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(cw.week === 3 && (cw.subject === 'French' || cw.subject === 'Français'))
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(hw.week === 3 && (hw.subject === 'French' || hw.subject === 'Français'))
);
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (tn) => !(tn.week === 3 && (tn.subject === 'French' || tn.subject === 'Français'))
);

// 2. Unblock any deletedTomorrowNoteIds related to French quizzes
plannerData.deletedTomorrowNoteIds = (plannerData.deletedTomorrowNoteIds || []).filter(
  (id) => !id.toLowerCase().includes('french') && !id.includes('فرنش')
);

// 3. French Week 3 Classwork Entries
// Weekly Plan: Unité 4 - La petite sœur de Lilly
// Teachers: Doaa Fekery (G2A, G2B), Lamiaa Mouhammed (G2C)
// Cours 1: Les goûts et les activités & la prononciation (ui-oi) - Pages 20 & 21
// Cours 2: Présenter la famille + Quiz - Pages 24 & 25
// Cours 3: Présenter la famille (Les adjectifs possessifs) - Passe-passe (8 & 9)
const frenchClasswork = [
  // --- G2A ---
  // Tuesday Period 1: Cours 1
  {
    id: 'cw-b1-w3-G2A-Tuesday-p1-french',
    classId: 'G2A',
    day: 'Tuesday',
    period: 1,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly — Les goûts et les activités',
    details: 'Le premier cours: Les goûts et les activités & la prononciation (ui-oi) مع ميس دعاء فكري. Fiche de classe Pages 20 & 21.',
    pages: 'Pages 20 & 21',
    completed: false,
    block: 1,
    week: 3
  },
  // Wednesday Period 4: Cours 2 (Quiz)
  {
    id: 'cw-b1-w3-G2A-Wednesday-p4-french',
    classId: 'G2A',
    day: 'Wednesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4: Présenter la famille + 🚨 Quiz de Français',
    details: 'Le deuxième cours: Présenter la famille (Pages 24 & 25) + أداء كويز اللغة الفرنسية في الحصة الثانية مع ميس دعاء فكري.',
    pages: 'Pages 24 & 25',
    completed: false,
    block: 1,
    week: 3
  },
  // Thursday Period 2: Cours 3
  {
    id: 'cw-b1-w3-G2A-Thursday-p2-french',
    classId: 'G2A',
    day: 'Thursday',
    period: 2,
    subject: 'French',
    title: 'Unité 4: Présenter la famille (Les adjectifs possessifs)',
    details: 'Le troisième cours: Présenter la famille (Les adjectifs possessifs صفات الملكية) في كتاب Passe-passe ص 8 و 9 مع ميس دعاء فكري.',
    pages: 'Passe-passe (8 & 9)',
    completed: false,
    block: 1,
    week: 3
  },

  // --- G2B ---
  // Sunday Period 5: Cours 1
  {
    id: 'cw-b1-w3-G2B-Sunday-p5-french',
    classId: 'G2B',
    day: 'Sunday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly — Les goûts et les activités',
    details: 'Le premier cours: Les goûts et les activités & la prononciation (ui-oi) مع ميس دعاء فكري. Fiche de classe Pages 20 & 21.',
    pages: 'Pages 20 & 21',
    completed: false,
    block: 1,
    week: 3
  },
  // Monday Period 7: Cours 2 (Quiz)
  {
    id: 'cw-b1-w3-G2B-Monday-p7-french',
    classId: 'G2B',
    day: 'Monday',
    period: 7,
    subject: 'French',
    title: 'Unité 4: Présenter la famille + 🚨 Quiz de Français',
    details: 'Le deuxième cours: Présenter la famille (Pages 24 & 25) + أداء كويز اللغة الفرنسية في الحصة الثانية مع ميس دعاء فكري.',
    pages: 'Pages 24 & 25',
    completed: false,
    block: 1,
    week: 3
  },
  // Tuesday Period 4: Cours 3
  {
    id: 'cw-b1-w3-G2B-Tuesday-p4-french',
    classId: 'G2B',
    day: 'Tuesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4: Présenter la famille (Les adjectifs possessifs)',
    details: 'Le troisième cours: Présenter la famille (Les adjectifs possessifs صفات الملكية) في كتاب Passe-passe ص 8 و 9 مع ميس دعاء فكري.',
    pages: 'Passe-passe (8 & 9)',
    completed: false,
    block: 1,
    week: 3
  },

  // --- G2C ---
  // Sunday Period 8: Cours 1
  {
    id: 'cw-b1-w3-G2C-Sunday-p8-french',
    classId: 'G2C',
    day: 'Sunday',
    period: 8,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly — Les goûts et les activités',
    details: 'Le premier cours: Les goûts et les activités & la prononciation (ui-oi) مع ميس لمياء محمد. Fiche de classe Pages 20 & 21.',
    pages: 'Pages 20 & 21',
    completed: false,
    block: 1,
    week: 3
  },
  // Tuesday Period 5: Cours 2 (Quiz)
  {
    id: 'cw-b1-w3-G2C-Tuesday-p5-french',
    classId: 'G2C',
    day: 'Tuesday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: Présenter la famille + 🚨 Quiz de Français',
    details: 'Le deuxième cours: Présenter la famille (Pages 24 & 25) + أداء كويز اللغة الفرنسية في الحصة الثانية مع ميس لمياء محمد.',
    pages: 'Pages 24 & 25',
    completed: false,
    block: 1,
    week: 3
  },
  // Wednesday Period 2: Cours 3
  {
    id: 'cw-b1-w3-G2C-Wednesday-p2-french',
    classId: 'G2C',
    day: 'Wednesday',
    period: 2,
    subject: 'French',
    title: 'Unité 4: Présenter la famille (Les adjectifs possessifs)',
    details: 'Le troisième cours: Présenter la famille (Les adjectifs possessifs صفات الملكية) في كتاب Passe-passe ص 8 و 9 مع ميس لمياء محمد.',
    pages: 'Passe-passe (8 & 9)',
    completed: false,
    block: 1,
    week: 3
  }
];

// 4. French Week 3 Homework Entries
// Mandate 1: Homework is assigned on the last French session of the week:
// G2A -> Thursday (Period 2)
// G2B -> Tuesday (Period 4)
// G2C -> Wednesday (Period 2)
// Homework task: Fiche de devoir Page 26
// Mandate 2: Quiz alerts in Homework the day before the quiz:
// G2A Quiz is Wednesday -> Alert in Homework on Tuesday
// G2B Quiz is Monday -> Alert in Homework on Sunday
// G2C Quiz is Tuesday -> Alert in Homework on Monday
const frenchHomework = [
  // --- G2A ---
  // Tuesday Homework: Alert for Wednesday Quiz
  {
    id: 'hw-b1-w3-G2A-Tue-french-quiz-alert',
    classId: 'G2A',
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'French',
    task: '🚨 مراجعة واستعداد لكويز الفرنش غداً الأربعاء (Quiz de Français)',
    details: 'مراجعة دروس الوحدة الرابعة (La petite sœur de Lilly: Les goûts et les activités & Présenter la famille) ص 20، 21، 24، 25 في كتاب وشيت الفرنش استعداداً للكويز غداً الأربعاء.',
    pages: 'Pages 20, 21, 24, 25',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 3
  },
  // Thursday Homework: Last French session of the week
  {
    id: 'hw-b1-w3-G2A-Thu-french-page26',
    classId: 'G2A',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'French Homework: Fiche de devoir Page 26',
    details: 'Unité 4: Présenter la famille (Les adjectifs possessifs) - حل تدريبات صفحة 26 في شيت واجب الفرنش (Fiche de devoir).',
    pages: 'Page 26',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3
  },

  // --- G2B ---
  // Sunday Homework: Alert for Monday Quiz
  {
    id: 'hw-b1-w3-G2B-Sun-french-quiz-alert',
    classId: 'G2B',
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'French',
    task: '🚨 مراجعة واستعداد لكويز الفرنش غداً الاثنين (Quiz de Français)',
    details: 'مراجعة دروس الوحدة الرابعة (La petite sœur de Lilly: Les goûts et les activités & Présenter la famille) ص 20، 21، 24، 25 في كتاب وشيت الفرنش استعداداً للكويز غداً الاثنين.',
    pages: 'Pages 20, 21, 24, 25',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 3
  },
  // Tuesday Homework: Last French session of the week
  {
    id: 'hw-b1-w3-G2B-Tue-french-page26',
    classId: 'G2B',
    assignedDay: 'Tuesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'French Homework: Fiche de devoir Page 26',
    details: 'Unité 4: Présenter la famille (Les adjectifs possessifs) - حل تدريبات صفحة 26 في شيت واجب الفرنش (Fiche de devoir).',
    pages: 'Page 26',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3
  },

  // --- G2C ---
  // Monday Homework: Alert for Tuesday Quiz
  {
    id: 'hw-b1-w3-G2C-Mon-french-quiz-alert',
    classId: 'G2C',
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'French',
    task: '🚨 مراجعة واستعداد لكويز الفرنش غداً الثلاثاء (Quiz de Français)',
    details: 'مراجعة دروس الوحدة الرابعة (La petite sœur de Lilly: Les goûts et les activités & Présenter la famille) ص 20، 21، 24، 25 في كتاب وشيت الفرنش استعداداً للكويز غداً الثلاثاء.',
    pages: 'Pages 20, 21, 24, 25',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 3
  },
  // Wednesday Homework: Last French session of the week
  {
    id: 'hw-b1-w3-G2C-Wed-french-page26',
    classId: 'G2C',
    assignedDay: 'Wednesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'French Homework: Fiche de devoir Page 26',
    details: 'Unité 4: Présenter la famille (Les adjectifs possessifs) - حل تدريبات صفحة 26 في شيت واجب الفرنش (Fiche de devoir).',
    pages: 'Page 26',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3
  }
];

// 5. Tomorrow Notes for French Quiz
// G2A Quiz is Wednesday -> Alert on Tuesday (targetDay: Wednesday)
// G2B Quiz is Monday -> Alert on Sunday (targetDay: Monday)
// G2C Quiz is Tuesday -> Alert on Monday (targetDay: Tuesday)
const frenchTomorrowNotes = [
  // G2A: targetDay Wednesday (viewed on Tuesday evening)
  {
    id: 'tn-b1-w3-G2A-Wed-french-quiz',
    classId: 'G2A',
    targetDay: 'Wednesday',
    subject: 'French',
    period: 4,
    title: '🚨 تذكير هام: غداً الأربعاء كويز فرنش (Quiz de Français)',
    note: '🚨 French Quiz Tomorrow (Wednesday): Unité 4 (La petite sœur de Lilly) - Pages 20, 21, 24, 25',
    arabicNote: '🚨 تذكير هام: غداً الأربعاء كويز لغة فرنسية في الحصة الرابعة على الوحدة الرابعة (صفحات 20، 21، 24، 25 في كتاب وشيت الفرنش). يرجى المذاكرة الجيدة وإحضار كتاب وكشكول الفرنش.',
    bagItem: 'French Manuel de cours p. 20, 21, 24, 25 & Cahier de français',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 3
  },

  // G2B: targetDay Monday (viewed on Sunday evening)
  {
    id: 'tn-b1-w3-G2B-Mon-french-quiz',
    classId: 'G2B',
    targetDay: 'Monday',
    subject: 'French',
    period: 7,
    title: '🚨 إنذار وتنبيه هام: غداً الاثنين كويز فرنش (Quiz de Français)',
    note: '🚨 French Quiz Tomorrow (Monday): Unité 4 (La petite sœur de Lilly) - Pages 20, 21, 24, 25',
    arabicNote: '🚨 إنذار وتنبيه هام: غداً الاثنين كويز لغة فرنسية في الحصة السابعة على الوحدة الرابعة (صفحات 20، 21، 24، 25 في كتاب وشيت الفرنش). يرجى المذاكرة الجيدة وإحضار كتاب وكشكول الفرنش.',
    bagItem: 'French Manuel de cours p. 20, 21, 24, 25 & Cahier de français',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 3
  },

  // G2C: targetDay Tuesday (viewed on Monday evening)
  {
    id: 'tn-b1-w3-G2C-Tue-french-quiz',
    classId: 'G2C',
    targetDay: 'Tuesday',
    subject: 'French',
    period: 5,
    title: '🚨 إنذار وتنبيه هام: غداً الثلاثاء كويز فرنش (Quiz de Français)',
    note: '🚨 French Quiz Tomorrow (Tuesday): Unité 4 (La petite sœur de Lilly) - Pages 20, 21, 24, 25',
    arabicNote: '🚨 إنذار وتنبيه هام: غداً الثلاثاء كويز لغة فرنسية في الحصة الخامسة على الوحدة الرابعة (صفحات 20، 21، 24، 25 في كتاب وشيت الفرنش). يرجى المذاكرة الجيدة وإحضار كتاب وكشكول الفرنش.',
    bagItem: 'French Manuel de cours p. 20, 21, 24, 25 & Cahier de français',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 3
  }
];

// Append new entries
plannerData.classwork.push(...frenchClasswork);
plannerData.homework.push(...frenchHomework);
plannerData.tomorrowNotes.push(...frenchTomorrowNotes);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('French Week 3 Seeding Completed Successfully!');
console.log(`Classwork items added: ${frenchClasswork.length}`);
console.log(`Homework items added: ${frenchHomework.length}`);
console.log(`Tomorrow notes added: ${frenchTomorrowNotes.length}`);
