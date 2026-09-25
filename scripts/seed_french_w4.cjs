const fs = require('fs');
const path = require('path');

console.log('Starting French Week 4 Seeder (Block 1 - Week 4)...');

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

// 1. Clean existing Week 4 French entries to avoid duplicates
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(cw.week === 4 && (cw.subject === 'French' || cw.subject === 'Français'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(hw.week === 4 && (hw.subject === 'French' || hw.subject === 'Français'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(tn.week === 4 && (tn.subject === 'French' || tn.subject === 'Français'))
);

// 2. Classwork entries for Week 4 French (3 sessions x 3 classes)
const frenchClasswork = [
  // ================== G2A French ==================
  // Session 1: Tuesday Period 1 (Les adjectifs possessifs & passe-passe p10)
  {
    id: 'cw-b1-w4-G2A-Tuesday-p1-french',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 1,
    subject: 'French',
    title: 'Unité 4: Les adjectifs possessifs',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre les adjectifs possessifs & Passe-passe page 10. (Fiche de classe Pages 27 & 28).',
    pages: 'Pages 27 & 28',
    completed: false,
    block: 1,
    week: 4
  },
  // Session 2: Wednesday Period 4 (Le verbe avoir & passe-passe p50)
  {
    id: 'cw-b1-w4-G2A-Wednesday-p4-french',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4: Le verbe avoir',
    details: 'Unité 4: La petite sœur de Lilly - Le verbe avoir & Passe-passe page 50. (Fiche de classe Passe-passe 50). Remarque: Tache (évaluation en classe).',
    pages: 'Passe-passe (50)',
    completed: false,
    block: 1,
    week: 4
  },
  // Session 3: Thursday Period 2 (Avoir à la forme négative & passe-passe p51)
  {
    id: 'cw-b1-w4-G2A-Thursday-p2-french',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 2,
    subject: 'French',
    title: 'Unité 4: Avoir à la forme négative',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre avoir à la forme négative & Passe-passe page 51. (Fiche de classe Passe-passe 51).',
    pages: 'Passe-passe (51)',
    completed: false,
    block: 1,
    week: 4
  },

  // ================== G2B French ==================
  // Session 1: Sunday Period 5
  {
    id: 'cw-b1-w4-G2B-Sunday-p5-french',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: Les adjectifs possessifs',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre les adjectifs possessifs & Passe-passe page 10. (Fiche de classe Pages 27 & 28).',
    pages: 'Pages 27 & 28',
    completed: false,
    block: 1,
    week: 4
  },
  // Session 2: Monday Period 7
  {
    id: 'cw-b1-w4-G2B-Monday-p7-french',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 7,
    subject: 'French',
    title: 'Unité 4: Le verbe avoir',
    details: 'Unité 4: La petite sœur de Lilly - Le verbe avoir & Passe-passe page 50. (Fiche de classe Passe-passe 50). Remarque: Tache (évaluation en classe).',
    pages: 'Passe-passe (50)',
    completed: false,
    block: 1,
    week: 4
  },
  // Session 3: Tuesday Period 4
  {
    id: 'cw-b1-w4-G2B-Tuesday-p4-french',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4: Avoir à la forme négative',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre avoir à la forme négative & Passe-passe page 51. (Fiche de classe Passe-passe 51).',
    pages: 'Passe-passe (51)',
    completed: false,
    block: 1,
    week: 4
  },

  // ================== G2C French ==================
  // Session 1: Sunday Period 8
  {
    id: 'cw-b1-w4-G2C-Sunday-p8-french',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 8,
    subject: 'French',
    title: 'Unité 4: Les adjectifs possessifs',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre les adjectifs possessifs & Passe-passe page 10. (Fiche de classe Pages 27 & 28).',
    pages: 'Pages 27 & 28',
    completed: false,
    block: 1,
    week: 4
  },
  // Session 2: Tuesday Period 5
  {
    id: 'cw-b1-w4-G2C-Tuesday-p5-french',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: Le verbe avoir',
    details: 'Unité 4: La petite sœur de Lilly - Le verbe avoir & Passe-passe page 50. (Fiche de classe Passe-passe 50). Remarque: Tache (évaluation en classe).',
    pages: 'Passe-passe (50)',
    completed: false,
    block: 1,
    week: 4
  },
  // Session 3: Wednesday Period 2
  {
    id: 'cw-b1-w4-G2C-Wednesday-p2-french',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 2,
    subject: 'French',
    title: 'Unité 4: Avoir à la forme négative',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre avoir à la forme négative & Passe-passe page 51. (Fiche de classe Passe-passe 51).',
    pages: 'Passe-passe (51)',
    completed: false,
    block: 1,
    week: 4
  }
];

// 3. Homework entries for Week 4 French
const frenchHomework = [
  // Session 3 Homework: Page 30 (Fiche de devoir Page 30)
  // G2A: Assigned Thursday (due next Sunday/Tuesday)
  {
    id: 'hw-b1-w4-G2A-Thu-french-p30',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Cahier d’activités: Page 30',
    details: 'Unité 4: Avoir à la forme négative - Compléter les exercices de la page 30 dans le cahier d’activités.',
    pages: 'Page 30',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4
  },
  // G2B: Assigned Tuesday (due next Sunday)
  {
    id: 'hw-b1-w4-G2B-Tue-french-p30',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Tuesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Cahier d’activités: Page 30',
    details: 'Unité 4: Avoir à la forme négative - Compléter les exercices de la page 30 dans le cahier d’activités.',
    pages: 'Page 30',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4
  },
  // G2C: Assigned Wednesday (due next Sunday)
  {
    id: 'hw-b1-w4-G2C-Wed-french-p30',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Wednesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Cahier d’activités: Page 30',
    details: 'Unité 4: Avoir à la forme négative - Compléter les exercices de la page 30 dans le cahier d’activités.',
    pages: 'Page 30',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 4
  },

  // Tache / Quiz alerts (Remarques: tache on Session 2)
  // G2A: Session 2 is Wednesday. Alert assigned on Tuesday -> due Wednesday.
  {
    id: 'hw-b1-w4-G2A-Tue-french-tache-alert',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Tuesday',
    dueDay: 'Wednesday',
    subject: 'French',
    task: '🚨 Tache (French Task)',
    details: '🚨 Quiz / Evaluation in class tomorrow! Revise "le verbe avoir" and Passe-passe page 50.',
    pages: 'Passe-passe p.50',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 4
  },
  // G2B: Session 2 is Monday. Alert assigned on Sunday -> due Monday.
  {
    id: 'hw-b1-w4-G2B-Sun-french-tache-alert',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Sunday',
    dueDay: 'Monday',
    subject: 'French',
    task: '🚨 Tache (French Task)',
    details: '🚨 Quiz / Evaluation in class tomorrow! Revise "le verbe avoir" and Passe-passe page 50.',
    pages: 'Passe-passe p.50',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 4
  },
  // G2C: Session 2 is Tuesday. Alert assigned on Monday -> due Tuesday.
  {
    id: 'hw-b1-w4-G2C-Mon-french-tache-alert',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Monday',
    dueDay: 'Tuesday',
    subject: 'French',
    task: '🚨 Tache (French Task)',
    details: '🚨 Quiz / Evaluation in class tomorrow! Revise "le verbe avoir" and Passe-passe page 50.',
    pages: 'Passe-passe p.50',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 4
  }
];

// 4. Tomorrow Notes for Week 4 French
const frenchTomorrowNotes = [
  // G2A: Session 2 is Wednesday (Prepare Wednesday evening)
  {
    id: 'tn-b1-w4-G2A-french-tache',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Wednesday',
    subject: 'French',
    period: 4,
    title: 'Tache (French Task)',
    note: 'Tache (French Task)',
    arabicNote: '🚨 كويز / تقييم فرنسي (Tache) غداً - مراجعة تصريف verb avoir و صفحة 50.',
    bagItem: 'Cahier de classe / Passe-passe (50)',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 4
  },
  // G2B: Session 2 is Monday (Prepare Sunday evening)
  {
    id: 'tn-b1-w4-G2B-french-tache',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'French',
    period: 7,
    title: 'Tache (French Task)',
    note: 'Tache (French Task)',
    arabicNote: '🚨 كويز / تقييم فرنسي (Tache) غداً - مراجعة تصريف verb avoir و صفحة 50.',
    bagItem: 'Cahier de classe / Passe-passe (50)',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 4
  },
  // G2C: Session 2 is Tuesday (Prepare Monday evening)
  {
    id: 'tn-b1-w4-G2C-french-tache',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Tuesday',
    subject: 'French',
    period: 5,
    title: 'Tache (French Task)',
    note: 'Tache (French Task)',
    arabicNote: '🚨 كويز / تقييم فرنسي (Tache) غداً - مراجعة تصريف verb avoir و صفحة 50.',
    bagItem: 'Cahier de classe / Passe-passe (50)',
    isQuiz: true,
    categoryType: 'quiz',
    priority: 'urgent',
    block: 1,
    week: 4
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
      (cw) => !(cw.week === 4 && (cw.subject === 'French' || cw.subject === 'Français'))
    );
    initialData.homework = initialData.homework.filter(
      (hw) => !(hw.week === 4 && (hw.subject === 'French' || hw.subject === 'Français'))
    );
    initialData.tomorrowNotes = initialData.tomorrowNotes.filter(
      (tn) => !(tn.week === 4 && (tn.subject === 'French' || tn.subject === 'Français'))
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

console.log('French Week 4 Seeding Completed Successfully!');
console.log(`Classwork items added: ${frenchClasswork.length}`);
console.log(`Homework items added: ${frenchHomework.length}`);
console.log(`Tomorrow notes added: ${frenchTomorrowNotes.length}`);
