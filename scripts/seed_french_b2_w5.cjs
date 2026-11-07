const fs = require('fs');
const path = require('path');

console.log('🇫🇷 Starting French Seeder for Block 2 - Week 5 (Grade 2)...');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.json');
const materialsPath = path.join(__dirname, '..', 'data', 'materials.json');

let plannerData = { classwork: [], homework: [], tomorrowNotes: [], deletedPlannerItemIds: [], deletedTomorrowNoteIds: [] };

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
if (!plannerData.deletedPlannerItemIds) plannerData.deletedPlannerItemIds = [];
if (!plannerData.deletedTomorrowNoteIds) plannerData.deletedTomorrowNoteIds = [];

const block = 2;
const week = 5;

// 1. Clean existing French Block 2 Week 5 entries to ensure clean idempotency
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(Number(cw.block) === block && Number(cw.week) === week && (cw.subject === 'French' || cw.subject === 'french' || cw.subject === 'Français'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(Number(hw.block) === block && Number(hw.week) === week && (hw.subject === 'French' || hw.subject === 'french' || hw.subject === 'Français'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(Number(tn.block) === block && Number(tn.week) === week && (tn.subject === 'French' || tn.subject === 'french' || tn.subject === 'Français'))
);

// Unblock any deleted IDs for French B2 W5
plannerData.deletedPlannerItemIds = plannerData.deletedPlannerItemIds.filter(
  (id) => !id.includes('b2-w5') || (!id.includes('french') && !id.includes('فرنش') && !id.includes('فرنسي'))
);
plannerData.deletedTomorrowNoteIds = plannerData.deletedTomorrowNoteIds.filter(
  (id) => !id.includes('b2-w5') || (!id.includes('french') && !id.includes('فرنش') && !id.includes('فرنسي'))
);

const newClasswork = [];
const newHomework = [];
const newTomorrowNotes = [];

// =========================================================================
// 1. CLASSWORK ENTRIES (Block 2 - Week 5)
// Unité 4: La petite sœur de Lilly
// =========================================================================

// ----------------- CLASS G2A (Mme. Doaa Fekery) -----------------
// Session 1: Tuesday Period 1 (Le premier cours: Où habites-tu ?)
newClasswork.push({
  id: 'cw-b2-w5-g2a-tue-french-c1',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Tuesday',
  period: 1,
  subject: 'French',
  title: 'Unité 4: Où habites-tu ? (Cours 1)',
  details: 'Unité 4: La petite sœur de Lilly - Apprendre à poser et répondre à la question: Où habites-tu ? (Fiche de classe).',
  pages: 'Fiche de classe',
  completed: false,
  block,
  week,
});
// Session 2: Wednesday Period 4 (Le deuxième cours: Où habites-tu ? Compréhension orale)
newClasswork.push({
  id: 'cw-b2-w5-g2a-wed-french-c2',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Wednesday',
  period: 4,
  subject: 'French',
  title: 'Unité 4: Où habites-tu ? Compréhension orale (Cours 2)',
  details: 'Unité 4: La petite sœur de Lilly - Activités de compréhension orale et d’écoute: Où habites-tu ? (Fiche de classe).',
  pages: 'Fiche de classe',
  completed: false,
  block,
  week,
});
// Session 3: Thursday Period 3 (Le troisième cours: Production orale et Écrite)
newClasswork.push({
  id: 'cw-b2-w5-g2a-thu-french-c3',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Thursday',
  period: 3,
  subject: 'French',
  title: 'Unité 4: Production orale et Écrite (Cours 3)',
  details: 'Unité 4: La petite sœur de Lilly - Production orale et écrite. Expression guidée (Fiche de classe). Devoir: p. 54.',
  pages: 'Fiche de classe (Devoir p. 54)',
  completed: false,
  block,
  week,
});

// ----------------- CLASS G2B (Mme. Doaa Fekery) -----------------
// Session 1: Sunday Period 2 (Le premier cours: Où habites-tu ?)
newClasswork.push({
  id: 'cw-b2-w5-g2b-sun-french-c1',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Sunday',
  period: 2,
  subject: 'French',
  title: 'Unité 4: Où habites-tu ? (Cours 1)',
  details: 'Unité 4: La petite sœur de Lilly - Apprendre à poser et répondre à la question: Où habites-tu ? (Fiche de classe).',
  pages: 'Fiche de classe',
  completed: false,
  block,
  week,
});
// Session 2: Monday Period 7 (Le deuxième cours: Où habites-tu ? Compréhension orale)
newClasswork.push({
  id: 'cw-b2-w5-g2b-mon-french-c2',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Monday',
  period: 7,
  subject: 'French',
  title: 'Unité 4: Où habites-tu ? Compréhension orale (Cours 2)',
  details: 'Unité 4: La petite sœur de Lilly - Activités de compréhension orale et d’écoute: Où habites-tu ? (Fiche de classe).',
  pages: 'Fiche de classe',
  completed: false,
  block,
  week,
});
// Session 3: Thursday Period 5 (Le troisième cours: Production orale et Écrite)
newClasswork.push({
  id: 'cw-b2-w5-g2b-thu-french-c3',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Thursday',
  period: 5,
  subject: 'French',
  title: 'Unité 4: Production orale et Écrite (Cours 3)',
  details: 'Unité 4: La petite sœur de Lilly - Production orale et écrite. Expression guidée (Fiche de classe). Devoir: p. 54.',
  pages: 'Fiche de classe (Devoir p. 54)',
  completed: false,
  block,
  week,
});

// ----------------- CLASS G2C (Mme. Lamiaa Mouhammed) -----------------
// Session 1: Sunday Period 8 (Le premier cours: Où habites-tu ?)
newClasswork.push({
  id: 'cw-b2-w5-g2c-sun-french-c1',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Sunday',
  period: 8,
  subject: 'French',
  title: 'Unité 4: Où habites-tu ? (Cours 1)',
  details: 'Unité 4: La petite sœur de Lilly - Apprendre à poser et répondre à la question: Où habites-tu ? (Fiche de classe).',
  pages: 'Fiche de classe',
  completed: false,
  block,
  week,
});
// Session 2: Tuesday Period 6 (Le deuxième cours: Où habites-tu ? Compréhension orale)
newClasswork.push({
  id: 'cw-b2-w5-g2c-tue-french-c2',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Tuesday',
  period: 6,
  subject: 'French',
  title: 'Unité 4: Où habites-tu ? Compréhension orale (Cours 2)',
  details: 'Unité 4: La petite sœur de Lilly - Activités de compréhension orale et d’écoute: Où habites-tu ? (Fiche de classe).',
  pages: 'Fiche de classe',
  completed: false,
  block,
  week,
});
// Session 3: Wednesday Period 2 (Le troisième cours: Production orale et Écrite)
newClasswork.push({
  id: 'cw-b2-w5-g2c-wed-french-c3',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Wednesday',
  period: 2,
  subject: 'French',
  title: 'Unité 4: Production orale et Écrite (Cours 3)',
  details: 'Unité 4: La petite sœur de Lilly - Production orale et écrite. Expression guidée (Fiche de classe). Devoir: p. 54.',
  pages: 'Fiche de classe (Devoir p. 54)',
  completed: false,
  block,
  week,
});

// =========================================================================
// 2. HOMEWORK ENTRIES (Block 2 - Week 5)
// User Mandate: "الـ Homework بينزل في تالت حصة لكل فصل."
// Third Session per class:
// - G2A: Thursday (Period 3)
// - G2B: Thursday (Period 5)
// - G2C: Wednesday (Period 2)
// =========================================================================

// --- Class G2A: Assigned Thursday (Session 3) -> Due Sunday ---
newHomework.push({
  id: 'hw-b2-w5-g2a-thu-french-p54',
  classId: 'G2A',
  class_id: 'G2A',
  assignedDay: 'Thursday',
  assigned_day: 'Thursday',
  dueDay: 'Sunday',
  due_day: 'Sunday',
  subject: 'French',
  task: 'Devoir de français: Fiche de devoir p. 54 📝',
  title: 'Devoir de français: Fiche de devoir p. 54',
  details: 'Unité 4: La petite sœur de Lilly - Résoudre les exercices de la fiche de devoir page 54 (Production orale et écrite).',
  pages: 'Fiche de devoir p. 54',
  completed: false,
  priority: 'normal',
  block,
  week,
});

// --- Class G2B: Assigned Thursday (Session 3) -> Due Sunday ---
newHomework.push({
  id: 'hw-b2-w5-g2b-thu-french-p54',
  classId: 'G2B',
  class_id: 'G2B',
  assignedDay: 'Thursday',
  assigned_day: 'Thursday',
  dueDay: 'Sunday',
  due_day: 'Sunday',
  subject: 'French',
  task: 'Devoir de français: Fiche de devoir p. 54 📝',
  title: 'Devoir de français: Fiche de devoir p. 54',
  details: 'Unité 4: La petite sœur de Lilly - Résoudre les exercices de la fiche de devoir page 54 (Production orale et écrite).',
  pages: 'Fiche de devoir p. 54',
  completed: false,
  priority: 'normal',
  block,
  week,
});

// --- Class G2C: Assigned Wednesday (Session 3) -> Due Sunday (next French session is Sunday) ---
newHomework.push({
  id: 'hw-b2-w5-g2c-wed-french-p54',
  classId: 'G2C',
  class_id: 'G2C',
  assignedDay: 'Wednesday',
  assigned_day: 'Wednesday',
  dueDay: 'Sunday',
  due_day: 'Sunday',
  subject: 'French',
  task: 'Devoir de français: Fiche de devoir p. 54 📝',
  title: 'Devoir de français: Fiche de devoir p. 54',
  details: 'Unité 4: La petite sœur de Lilly - Résoudre les exercices de la fiche de devoir page 54 (Production orale et écrite).',
  pages: 'Fiche de devoir p. 54',
  completed: false,
  priority: 'normal',
  block,
  week,
});

// =========================================================================
// 3. TOMORROW NOTES (Block 2 - Week 5)
// =========================================================================
// الخطة الأسبوعية لم تنص على أي ملاحظات للفرنش (Remarques: فارغة)
// لا توجد أي ملاحظات للتومارو لمادة اللغة الفرنسية


// Append to plannerData
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Write to data/planner_data.json
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('✅ Updated data/planner_data.json');

// Write to src/data/initialData.json
if (fs.existsSync(initialDataPath)) {
  try {
    const initData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    if (!initData.classwork) initData.classwork = [];
    if (!initData.homework) initData.homework = [];
    if (!initData.tomorrowNotes) initData.tomorrowNotes = [];

    initData.classwork = initData.classwork.filter(
      (cw) => !(Number(cw.block) === block && Number(cw.week) === week && (cw.subject === 'French' || cw.subject === 'french' || cw.subject === 'Français'))
    );
    initData.homework = initData.homework.filter(
      (hw) => !(Number(hw.block) === block && Number(hw.week) === week && (hw.subject === 'French' || hw.subject === 'french' || hw.subject === 'Français'))
    );
    initData.tomorrowNotes = initData.tomorrowNotes.filter(
      (tn) => !(Number(tn.block) === block && Number(tn.week) === week && (tn.subject === 'French' || tn.subject === 'french' || tn.subject === 'Français'))
    );

    initData.classwork.push(...newClasswork);
    initData.homework.push(...newHomework);
    initData.tomorrowNotes.push(...newTomorrowNotes);

    fs.writeFileSync(initialDataPath, JSON.stringify(initData, null, 2), 'utf8');
    console.log('✅ Updated src/data/initialData.json');
  } catch (err) {
    console.warn('Could not update initialData.json:', err);
  }
}

// Register Weekly Plan in materials.json
if (fs.existsSync(materialsPath)) {
  try {
    let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
    if (!Array.isArray(materials)) materials = [];
    const pdfPath = '/assets/aistudio/Weekly_Plan_French_-_B2_-_W5-_Minia____deb03e2e.pdf';
    const matId = 'mat_weekly_plan_french_b2_w5';

    materials = materials.filter((m) => m.id !== matId);
    materials.unshift({
      id: matId,
      fileName: 'Weekly_Plan_French_-_B2_-_W5-_Minia____deb03e2e.pdf',
      fileSize: 420000,
      storageUrl: pdfPath,
      linkUrl: pdfPath,
      subject: 'French',
      grade: 'Grade 2',
      term: 'Term 1',
      block: 2,
      week: 5,
      section: 'Weekly Plan',
      classId: 'ALL',
      type: 'pdf',
      uploadedAt: new Date().toISOString(),
      description: 'Le plan de la semaine - Français - Grade 2 - Block 2 - Week 5 (Mme. Doaa Fekery & Mme. Lamiaa Mouhammed)',
    });

    fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2), 'utf8');
    console.log('✅ Updated data/materials.json with French Weekly Plan PDF');
  } catch (mErr) {
    console.warn('Could not update materials.json:', mErr);
  }
}

console.log(`🎉 French Block 2 Week 5 Seeding Complete!`);
console.log(`- Classwork added: ${newClasswork.length} entries (3 sessions x 3 classes)`);
console.log(`- Homework added: ${newHomework.length} entries (Session 3 for each class)`);
console.log(`- Tomorrow Notes added: ${newTomorrowNotes.length} entries`);
