const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Exact English Seeder for Block 2 - Week 5 with Dictation Words List...');

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
const dictationPdfUrl = '/assets/aistudio/English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';
const dictationPdfName = 'English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';

// 1. Clean existing English Block 2 Week 5 entries to ensure clean idempotency
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(Number(cw.block) === block && Number(cw.week) === week && (cw.subject === 'English' || cw.subject === 'english'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(Number(hw.block) === block && Number(hw.week) === week && (hw.subject === 'English' || hw.subject === 'english'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(Number(tn.block) === block && Number(tn.week) === week && (tn.subject === 'English' || tn.subject === 'english'))
);

// Unblock any deleted IDs for English B2 W5
plannerData.deletedPlannerItemIds = plannerData.deletedPlannerItemIds.filter(
  (id) => !id.includes('b2-w5') || (!id.includes('english') && !id.includes('dictation'))
);
plannerData.deletedTomorrowNoteIds = plannerData.deletedTomorrowNoteIds.filter(
  (id) => !id.includes('b2-w5') || (!id.includes('english') && !id.includes('dictation'))
);

// Timetable periods for English from src/data/timetables.ts
const englishPeriods = {
  G2A: {
    Sunday: 5,
    Monday: 3,
    Tuesday: 7,
    Wednesday: 7,
    Thursday: 6,
  },
  G2B: {
    Sunday: 1,
    Monday: 5,
    Tuesday: 7,
    Wednesday: 1,
    Thursday: 3,
  },
  G2C: {
    Sunday: 4,
    Monday: 5,
    Tuesday: 4,
    Wednesday: 4,
    Thursday: 4,
  },
};

const newClasswork = [];
const newHomework = [];
const newTomorrowNotes = [];

const dictationWordsArabic = `📝 قائمة كلمات الإملاء المقررة (Dictation List - 11 كلمة):
1. Cinema
2. Post Office
3. Hospital
4. Flat
5. Shop
6. Cafe
7. Police Station
8. Park
9. Restaurant
10. Street
11. School

💡 Helping Words (كلمات مساعدة لتكوين الجمل):
• next to • in front of • behind • across from • the

⭐ تنبيه هام من المعلمة:
Always start with a capital letter and end with a full stop.
(يجب دائماً أن تبدأ الجملة بحرف كبير Capital Letter وتنتهي بنقطة Full Stop).`;

// =========================================================================
// 1. CLASSWORK ENTRIES (Block 2 - Week 5)
// =========================================================================

// --- Sunday (8/11/2026) ---
// G2A: Present Continuous (CW. 57, 58)
newClasswork.push({
  id: 'cw-b2-w5-g2a-sun-english',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Sunday',
  period: englishPeriods.G2A.Sunday,
  subject: 'English',
  title: 'Present Continuous',
  details: 'Unit: My town. Grammar focus: Present Continuous tense rules and sentence structure. Classwork exercises on pages CW. 57, 58.',
  pages: 'CW. 57, 58',
  completed: false,
  block,
  week,
});
// G2B: Reading & Listening (CW. 59, 60)
newClasswork.push({
  id: 'cw-b2-w5-g2b-sun-english',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Sunday',
  period: englishPeriods.G2B.Sunday,
  subject: 'English',
  title: 'Reading & Listening',
  details: 'Unit: My town. Focus on Reading & Listening comprehension skills. Classwork exercises on pages CW. 59, 60.',
  pages: 'CW. 59, 60',
  completed: false,
  block,
  week,
});
// G2C: Present Continuous (CW. 57, 58)
newClasswork.push({
  id: 'cw-b2-w5-g2c-sun-english',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Sunday',
  period: englishPeriods.G2C.Sunday,
  subject: 'English',
  title: 'Present Continuous',
  details: 'Unit: My town. Grammar focus: Present Continuous tense rules and practice. Classwork exercises on pages CW. 57, 58.',
  pages: 'CW. 57, 58',
  completed: false,
  block,
  week,
});

// --- Monday (9/11/2026) ---
// G2A: Movers Story (CW. 61, 62)
newClasswork.push({
  id: 'cw-b2-w5-g2a-mon-english',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Monday',
  period: englishPeriods.G2A.Monday,
  subject: 'English',
  title: 'Movers Story',
  details: 'Unit: My town. Movers story reading, vocabulary discussion, and comprehension exercises on pages CW. 61, 62.',
  pages: 'CW. 61, 62',
  completed: false,
  block,
  week,
});
// G2B: Present continuous (CW. 57, 58)
newClasswork.push({
  id: 'cw-b2-w5-g2b-mon-english',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Monday',
  period: englishPeriods.G2B.Monday,
  subject: 'English',
  title: 'Present Continuous',
  details: 'Unit: My town. Grammar focus: Present Continuous rules and usage. Classwork exercises on pages CW. 57, 58.',
  pages: 'CW. 57, 58',
  completed: false,
  block,
  week,
});
// G2C: Outdoor Activity
newClasswork.push({
  id: 'cw-b2-w5-g2c-mon-english',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Monday',
  period: englishPeriods.G2C.Monday,
  subject: 'English',
  title: 'Outdoor Activity',
  details: 'Unit: My town. Outdoor interactive language activity and communication practice.',
  pages: 'Outdoor Activity',
  completed: false,
  block,
  week,
});

// --- Tuesday (10/11/2026) ---
// G2A: Reading & Listening (CW. 59, 60)
newClasswork.push({
  id: 'cw-b2-w5-g2a-tue-english',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Tuesday',
  period: englishPeriods.G2A.Tuesday,
  subject: 'English',
  title: 'Reading & Listening',
  details: 'Unit: My town. Reading comprehension and active listening skills. Classwork exercises on pages CW. 59, 60.',
  pages: 'CW. 59, 60',
  completed: false,
  block,
  week,
});
// G2B: 📝 Dictation + Movers Story (Copy Book + CW. 61, 62)
newClasswork.push({
  id: 'cw-b2-w5-g2b-tue-english',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Tuesday',
  period: englishPeriods.G2B.Tuesday,
  subject: 'English',
  title: '📝 Dictation & Movers Story',
  details: `Unit: My town. 📝 Weekly Dictation in Copy Book on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School) + Movers Story on pages CW. 61, 62.`,
  pages: 'Copy Book, CW. 61, 62',
  completed: false,
  block,
  week,
  pdfUrl: dictationPdfUrl,
  pdf_url: dictationPdfUrl,
  attachment: dictationPdfUrl,
  attachmentName: dictationPdfName,
});
// G2C: 📝 Dictation (Copy Book)
newClasswork.push({
  id: 'cw-b2-w5-g2c-tue-english',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Tuesday',
  period: englishPeriods.G2C.Tuesday,
  subject: 'English',
  title: '📝 Dictation',
  details: `Unit: My town. 📝 Weekly Dictation in Copy Book on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School).`,
  pages: 'Copy Book',
  completed: false,
  block,
  week,
  pdfUrl: dictationPdfUrl,
  pdf_url: dictationPdfUrl,
  attachment: dictationPdfUrl,
  attachmentName: dictationPdfName,
});

// --- Wednesday (11/11/2026) ---
// G2A: Outdoor Activity
newClasswork.push({
  id: 'cw-b2-w5-g2a-wed-english',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Wednesday',
  period: englishPeriods.G2A.Wednesday,
  subject: 'English',
  title: 'Outdoor Activity',
  details: 'Unit: My town. Outdoor interactive language activity and collaborative exercises.',
  pages: 'Outdoor Activity',
  completed: false,
  block,
  week,
});
// G2B: Story
newClasswork.push({
  id: 'cw-b2-w5-g2b-wed-english',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Wednesday',
  period: englishPeriods.G2B.Wednesday,
  subject: 'English',
  title: 'Story Comprehension',
  details: 'Unit: My town. Story reading, vocabulary exploration, and comprehension discussion.',
  pages: 'Story',
  completed: false,
  block,
  week,
});
// G2C: Movers Story (CW. 61, 62)
newClasswork.push({
  id: 'cw-b2-w5-g2c-wed-english',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Wednesday',
  period: englishPeriods.G2C.Wednesday,
  subject: 'English',
  title: 'Movers Story',
  details: 'Unit: My town. Movers reading and story comprehension exercises on pages CW. 61, 62.',
  pages: 'CW. 61, 62',
  completed: false,
  block,
  week,
});

// --- Thursday (12/11/2026) ---
// G2A: 📝 Dictation (Copy Book)
newClasswork.push({
  id: 'cw-b2-w5-g2a-thu-english',
  classId: 'G2A',
  class_id: 'G2A',
  day: 'Thursday',
  period: englishPeriods.G2A.Thursday,
  subject: 'English',
  title: '📝 Dictation',
  details: `Unit: My town. 📝 Weekly Dictation in Copy Book for Class 2A on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School).`,
  pages: 'Copy Book',
  completed: false,
  block,
  week,
  pdfUrl: dictationPdfUrl,
  pdf_url: dictationPdfUrl,
  attachment: dictationPdfUrl,
  attachmentName: dictationPdfName,
});
// G2B: Outdoor Activity
newClasswork.push({
  id: 'cw-b2-w5-g2b-thu-english',
  classId: 'G2B',
  class_id: 'G2B',
  day: 'Thursday',
  period: englishPeriods.G2B.Thursday,
  subject: 'English',
  title: 'Outdoor Activity',
  details: 'Unit: My town. Outdoor interactive communicative language activity.',
  pages: 'Outdoor Activity',
  completed: false,
  block,
  week,
});
// G2C: Reading & Listening (CW. 59, 60)
newClasswork.push({
  id: 'cw-b2-w5-g2c-thu-english',
  classId: 'G2C',
  class_id: 'G2C',
  day: 'Thursday',
  period: englishPeriods.G2C.Thursday,
  subject: 'English',
  title: 'Reading & Listening',
  details: 'Unit: My town. Reading comprehension and listening activities on pages CW. 59, 60.',
  pages: 'CW. 59, 60',
  completed: false,
  block,
  week,
});

// =========================================================================
// 2. HOMEWORK ENTRIES (Block 2 - Week 5)
// =========================================================================

// --- Monday Regular Homework for ALL Classes: Extra Sheet with A.k ---
['G2A', 'G2B', 'G2C'].forEach((cls) => {
  newHomework.push({
    id: `hw-b2-w5-${cls.toLowerCase()}-mon-english-extrasheet`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: 'English Extra Sheet (Uploaded with Answer Key A.k)',
    title: 'English Extra Sheet (with Answer Key)',
    details: 'Unit: My town. Solve the English Extra Sheet. An answer key (A.k) is uploaded for reference and checking.',
    pages: 'Extra Sheet (with A.k)',
    completed: false,
    priority: 'normal',
    block,
    week,
  });
});

// --- Thursday Regular Homework for Class G2A Only: P. 88, 89 ---
newHomework.push({
  id: 'hw-b2-w5-g2a-thu-english-p88-89',
  classId: 'G2A',
  class_id: 'G2A',
  assignedDay: 'Thursday',
  assigned_day: 'Thursday',
  dueDay: 'Sunday',
  due_day: 'Sunday',
  subject: 'English',
  task: 'English Homework: Solve Workbook Pages 88 & 89',
  title: 'Solve Workbook Pages 88 & 89',
  details: 'Unit: My town. Complete all exercises on pages P. 88 and 89 in the English workbook / activity book.',
  pages: 'P. 88, 89',
  completed: false,
  priority: 'normal',
  block,
  week,
});

// --- User Mandate: Dictation Homework Tasks with full words list ---
// 1) For Class B and Class C -> Saturday through Monday (Assigned: Sat, Sun, Mon | Due: Tuesday)
['G2B', 'G2C'].forEach((cls) => {
  ['Saturday', 'Sunday', 'Monday'].forEach((day) => {
    const isNightBefore = day === 'Monday';
    newHomework.push({
      id: `hw-b2-w5-${cls.toLowerCase()}-${day.toLowerCase()}-dictation`,
      classId: cls,
      class_id: cls,
      assignedDay: day,
      assigned_day: day,
      dueDay: 'Tuesday',
      due_day: 'Tuesday',
      subject: 'English',
      task: `🚨 Dictation List: Prepare for English Dictation on Tuesday (${cls})!`,
      title: `English Dictation on Tuesday (${cls}) - 11 Words`,
      details: isNightBefore
        ? `🚨 تنبيه عاجل: غداً الثلاثاء موعد اختبار إملاء مادة اللغة الإنجليزية لكلاس (${cls}) في كشكول الإملاء (Copy Book)! يرجى تجهيز الكشكول وقلم رصاص وممحاة.\n\n${dictationWordsArabic}`
        : `🚨 تنبيه واستعداد لاختبار الإملاء: إملاء مادة اللغة الإنجليزية يوم الثلاثاء لكلاس (${cls}) في كشكول الإملاء (Copy Book).\n\n${dictationWordsArabic}`,
      pages: 'Dictation Study Sheet (11 Words + Helping Words)',
      completed: false,
      priority: isNightBefore ? 'urgent' : 'high',
      block,
      week,
      pdfUrl: dictationPdfUrl,
      pdf_url: dictationPdfUrl,
      pdfUrls: [dictationPdfUrl],
      attachment: dictationPdfUrl,
      attachmentName: dictationPdfName,
      fileUrl: dictationPdfUrl,
      fileName: dictationPdfName,
      sheet: dictationPdfUrl,
    });
  });
});

// 2) For Class A -> Saturday through Wednesday (Assigned: Sat, Sun, Mon, Tue, Wed | Due: Thursday)
['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'].forEach((day) => {
  const isNightBefore = day === 'Wednesday';
  newHomework.push({
    id: `hw-b2-w5-g2a-${day.toLowerCase()}-dictation`,
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: day,
    assigned_day: day,
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'English',
    task: `🚨 Dictation List: Prepare for English Dictation on Thursday (Class 2A)!`,
    title: `English Dictation on Thursday (Class 2A) - 11 Words`,
    details: isNightBefore
      ? `🚨 تنبيه عاجل: غداً الخميس موعد اختبار إملاء مادة اللغة الإنجليزية لكلاس 2A في كشكول الإملاء (Copy Book)! يرجى تجهيز الكشكول وقلم رصاص وممحاة.\n\n${dictationWordsArabic}`
      : `🚨 تنبيه واستعداد لاختبار الإملاء: إملاء مادة اللغة الإنجليزية يوم الخميس لكلاس 2A في كشكول الإملاء (Copy Book).\n\n${dictationWordsArabic}`,
    pages: 'Dictation Study Sheet (11 Words + Helping Words)',
    completed: false,
    priority: isNightBefore ? 'urgent' : 'high',
    block,
    week,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    pdfUrls: [dictationPdfUrl],
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
    fileUrl: dictationPdfUrl,
    fileName: dictationPdfName,
    sheet: dictationPdfUrl,
  });
});

// =========================================================================
// 3. TOMORROW NOTES (Block 2 - Week 5)
// STRICT USER MANDATE: No routine notes or "bring sheet" notes in English Tomorrow!
// ONLY the Dictation warning 1 day before the dictation per class:
// - Tuesday for G2B and G2C (targetDay: Tuesday)
// - Thursday for G2A (targetDay: Thursday)
// =========================================================================

// G2B: 🚨 إنذار الديكتيشن قبليها بيوم (تجهيز الإثنين مساءً للثلاثاء) مع قائمة الكلمات وشيت الـ PDF
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2b-tue-dictation',
  classId: 'G2B',
  class_id: 'G2B',
  targetDay: 'Tuesday',
  subject: 'English',
  period: englishPeriods.G2B.Tuesday,
  title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الثلاثاء (Class 2B)',
  note: '🚨 Tomorrow Tuesday is English Dictation for Class 2B in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
  arabicNote: `🚨 إنذار وتنبيه هام: غداً الثلاثاء موعد اختبار الإملاء (English Dictation) لكلاس 2B في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
  bagItem: 'Dictation Copy Book (كشكول الإملاء)',
  isQuiz: true,
  categoryType: 'quiz',
  block,
  week,
  pdfUrl: dictationPdfUrl,
  pdf_url: dictationPdfUrl,
  pdfUrls: [dictationPdfUrl],
  attachment: dictationPdfUrl,
  attachmentName: dictationPdfName,
});

// G2C: 🚨 إنذار الديكتيشن قبليها بيوم (تجهيز الإثنين مساءً للثلاثاء) مع قائمة الكلمات وشيت الـ PDF
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2c-tue-dictation',
  classId: 'G2C',
  class_id: 'G2C',
  targetDay: 'Tuesday',
  subject: 'English',
  period: englishPeriods.G2C.Tuesday,
  title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الثلاثاء (Class 2C)',
  note: '🚨 Tomorrow Tuesday is English Dictation for Class 2C in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
  arabicNote: `🚨 إنذار وتنبيه هام: غداً الثلاثاء موعد اختبار الإملاء (English Dictation) لكلاس 2C في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
  bagItem: 'Dictation Copy Book (كشكول الإملاء)',
  isQuiz: true,
  categoryType: 'quiz',
  block,
  week,
  pdfUrl: dictationPdfUrl,
  pdf_url: dictationPdfUrl,
  pdfUrls: [dictationPdfUrl],
  attachment: dictationPdfUrl,
  attachmentName: dictationPdfName,
});

// G2A: 🚨 إنذار الديكتيشن قبليها بيوم (تجهيز الأربعاء مساءً للخميس) مع قائمة الكلمات وشيت الـ PDF
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2a-thu-dictation',
  classId: 'G2A',
  class_id: 'G2A',
  targetDay: 'Thursday',
  subject: 'English',
  period: englishPeriods.G2A.Thursday,
  title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الخميس (Class 2A)',
  note: '🚨 Tomorrow Thursday is English Dictation for Class 2A in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
  arabicNote: `🚨 إنذار وتنبيه هام: غداً الخميس موعد اختبار الإملاء (English Dictation) لكلاس 2A في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
  bagItem: 'Dictation Copy Book (كشكول الإملاء)',
  isQuiz: true,
  categoryType: 'quiz',
  block,
  week,
  pdfUrl: dictationPdfUrl,
  pdf_url: dictationPdfUrl,
  pdfUrls: [dictationPdfUrl],
  attachment: dictationPdfUrl,
  attachmentName: dictationPdfName,
});

// Append entries to plannerData
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Write to data/planner_data.json
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('✅ Updated data/planner_data.json');

// Write to src/data/initialData.json as well
if (fs.existsSync(initialDataPath)) {
  try {
    const initData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    if (!initData.classwork) initData.classwork = [];
    if (!initData.homework) initData.homework = [];
    if (!initData.tomorrowNotes) initData.tomorrowNotes = [];

    initData.classwork = initData.classwork.filter(
      (cw) => !(Number(cw.block) === block && Number(cw.week) === week && (cw.subject === 'English' || cw.subject === 'english'))
    );
    initData.homework = initData.homework.filter(
      (hw) => !(Number(hw.block) === block && Number(hw.week) === week && (hw.subject === 'English' || hw.subject === 'english'))
    );
    initData.tomorrowNotes = initData.tomorrowNotes.filter(
      (tn) => !(Number(tn.block) === block && Number(tn.week) === week && (tn.subject === 'English' || tn.subject === 'english'))
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

// Register Dictation Study Sheet PDF in materials.json
if (fs.existsSync(materialsPath)) {
  try {
    let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
    if (!Array.isArray(materials)) materials = [];
    const matId = 'mat_english_b2_w5_dictation_list';

    materials = materials.filter((m) => m.id !== matId);
    materials.unshift({
      id: matId,
      fileName: dictationPdfName,
      fileSize: 380000,
      storageUrl: dictationPdfUrl,
      linkUrl: dictationPdfUrl,
      subject: 'English',
      grade: 'Grade 2',
      term: 'Term 1',
      block: 2,
      week: 5,
      section: 'Dictation',
      classId: 'ALL',
      type: 'pdf',
      uploadedAt: new Date().toISOString(),
      description: 'English Dictation List (11 Words + Helping Words) - Unit: My town - Block 2 Week 5 (Ms. Aya Abdalla)',
    });

    fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2), 'utf8');
    console.log('✅ Updated data/materials.json with Dictation Study Sheet PDF');
  } catch (mErr) {
    console.warn('Could not update materials.json:', mErr);
  }
}

console.log(`🎉 English Block 2 Week 5 Seeding Complete with Dictation Sheet!`);
console.log(`- Classwork added: ${newClasswork.length} entries`);
console.log(`- Homework added: ${newHomework.length} entries`);
console.log(`- Tomorrow Notes added: ${newTomorrowNotes.length} entries`);
