const fs = require('fs');
const path = require('path');

console.log('🚀 Starting English Seeder for Block 2 - Week 5 (Grade 2)...');

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
  details: 'Unit: My town. 📝 Weekly Dictation in Copy Book + Movers Story reading and comprehension exercises on pages CW. 61, 62.',
  pages: 'Copy Book, CW. 61, 62',
  completed: false,
  block,
  week,
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
  details: 'Unit: My town. 📝 Weekly Dictation assessment in Copy Book.',
  pages: 'Copy Book',
  completed: false,
  block,
  week,
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
  details: 'Unit: My town. 📝 Weekly Dictation assessment in Copy Book for Class 2A.',
  pages: 'Copy Book',
  completed: false,
  block,
  week,
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

// --- Monday Homework for ALL Classes (Assigned Monday, Due Tuesday): Extra Sheet with A.k ---
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

// --- Thursday Homework for Class G2A Only (Assigned Thursday, Due Sunday): P. 88, 89 ---
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

// --- Dictation Homework Reminders (Every day, as requested by user) ---

// For Class B and Class C -> Dictation is on TUESDAY
['G2B', 'G2C'].forEach((cls) => {
  ['Saturday', 'Sunday'].forEach((day) => {
    newHomework.push({
      id: `hw-b2-w5-${cls.toLowerCase()}-${day.toLowerCase()}-dictation-alert`,
      classId: cls,
      class_id: cls,
      assignedDay: day,
      assigned_day: day,
      dueDay: 'Tuesday',
      due_day: 'Tuesday',
      subject: 'English',
      task: `🚨 Dictation Reminder: Prepare for English Dictation on Tuesday (${cls})!`,
      title: `English Dictation on Tuesday (${cls})`,
      details: `🚨 تذكير وتنبيه هام: إملاء لغة إنجليزية يوم الثلاثاء لكلاس (${cls}) في كشكول الإملاء (Copy Book). قائمة الكلمات ستُحدد قريباً وسيتم تحديثها فور إعلانها من المعلمة.`,
      pages: 'Copy Book (قائمة الكلمات ستحدد قريباً)',
      completed: false,
      priority: 'high',
      block,
      week,
    });
  });

  // Monday Night Alert (Due Tuesday morning)
  newHomework.push({
    id: `hw-b2-w5-${cls.toLowerCase()}-mon-dictation-urgent`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: `🚨 Tomorrow is English Dictation! (${cls} - Tuesday)`,
    title: `Tomorrow is English Dictation! (${cls})`,
    details: `🚨 تنبيه عاجل: غداً الثلاثاء موعد إملاء اللغة الإنجليزية لكلاس (${cls}) في كشكول الإملاء (Copy Book). يرجى تجهيز كشكول الإملاء وقلم رصاص وممحاة (قائمة الكلمات ستحدد قريباً).`,
    pages: 'Copy Book',
    completed: false,
    priority: 'urgent',
    block,
    week,
  });
});

// For Class A -> Dictation is on THURSDAY
['Saturday', 'Sunday', 'Monday', 'Tuesday'].forEach((day) => {
  newHomework.push({
    id: `hw-b2-w5-g2a-${day.toLowerCase()}-dictation-alert`,
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: day,
    assigned_day: day,
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'English',
    task: '🚨 Dictation Reminder: Prepare for English Dictation on Thursday (Class 2A)!',
    title: 'English Dictation on Thursday (Class 2A)',
    details: '🚨 تذكير وتنبيه: إملاء لغة إنجليزية يوم الخميس لكلاس 2A في كشكول الإملاء (Copy Book). قائمة الكلمات ستُحدد قريباً وسيتم تحديثها فور إعلانها من المعلمة.',
    pages: 'Copy Book (قائمة الكلمات ستحدد قريباً)',
    completed: false,
    priority: 'high',
    block,
    week,
  });
});

// Wednesday Night Alert for Class A (Due Thursday morning)
newHomework.push({
  id: 'hw-b2-w5-g2a-wed-dictation-urgent',
  classId: 'G2A',
  class_id: 'G2A',
  assignedDay: 'Wednesday',
  assigned_day: 'Wednesday',
  dueDay: 'Thursday',
  due_day: 'Thursday',
  subject: 'English',
  task: '🚨 Tomorrow is English Dictation! (Class 2A - Thursday)',
  title: 'Tomorrow is English Dictation! (Class 2A)',
  details: '🚨 تنبيه عاجل: غداً الخميس موعد إملاء اللغة الإنجليزية لكلاس 2A في كشكول الإملاء (Copy Book). يرجى إحضار وتجهيز كشكول الإملاء وقلم رصاص وممحاة (قائمة الكلمات ستحدد قريباً).',
  pages: 'Copy Book',
  completed: false,
  priority: 'urgent',
  block,
  week,
});

// =========================================================================
// 3. TOMORROW NOTES (Block 2 - Week 5)
// =========================================================================

// --- Target: Sunday (Packed Saturday Night) ---
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2a-sun-english',
  classId: 'G2A',
  class_id: 'G2A',
  targetDay: 'Sunday',
  subject: 'English',
  period: englishPeriods.G2A.Sunday,
  title: 'Present Continuous (CW. 57, 58)',
  note: 'English Lesson: Present Continuous - Bring English Pupil Book & CW pages 57, 58 + English Dictation is on Thursday.',
  arabicNote: 'تحضير درس Present Continuous - إحضار كتاب الإنجليزي والبوكليت ص 57 و 58. (تنبيه: الإملاء لكلاس A يوم الخميس، وقائمة الكلمات ستحدد قريباً).',
  bagItem: 'English Pupil Book & Booklet (CW. 57, 58)',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2b-sun-english',
  classId: 'G2B',
  class_id: 'G2B',
  targetDay: 'Sunday',
  subject: 'English',
  period: englishPeriods.G2B.Sunday,
  title: 'Reading & Listening (CW. 59, 60)',
  note: 'English: Reading & Listening - Bring English Book (CW. 59, 60). Note: Dictation for Class B is on Tuesday!',
  arabicNote: 'تحضير درس Reading & Listening - إحضار كتاب الإنجليزي والبوكليت ص 59 و 60. (🚨 تنبيه: الإملاء لكلاس B يوم الثلاثاء، وقائمة الكلمات ستحدد قريباً).',
  bagItem: 'English Book & Booklet (CW. 59, 60)',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2c-sun-english',
  classId: 'G2C',
  class_id: 'G2C',
  targetDay: 'Sunday',
  subject: 'English',
  period: englishPeriods.G2C.Sunday,
  title: 'Present Continuous (CW. 57, 58)',
  note: 'English: Present Continuous - Bring English Book (CW. 57, 58). Note: Dictation for Class C is on Tuesday!',
  arabicNote: 'تحضير درس Present Continuous - إحضار كتاب الإنجليزي والبوكليت ص 57 و 58. (🚨 تنبيه: الإملاء لكلاس C يوم الثلاثاء، وقائمة الكلمات ستحدد قريباً).',
  bagItem: 'English Book & Booklet (CW. 57, 58)',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

// --- Target: Monday (Packed Sunday Night) ---
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2a-mon-english',
  classId: 'G2A',
  class_id: 'G2A',
  targetDay: 'Monday',
  subject: 'English',
  period: englishPeriods.G2A.Monday,
  title: 'Movers Story (CW. 61, 62)',
  note: 'English: Movers Story - Bring English Booklet (CW. 61, 62) + Dictation on Thursday.',
  arabicNote: 'تحضير درس Movers Story - إحضار بوكليت الإنجليزي ص 61 و 62. (تنبيه: إملاء كلاس A يوم الخميس).',
  bagItem: 'English Booklet (CW. 61, 62)',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2b-mon-english',
  classId: 'G2B',
  class_id: 'G2B',
  targetDay: 'Monday',
  subject: 'English',
  period: englishPeriods.G2B.Monday,
  title: 'Present Continuous (CW. 57, 58)',
  note: 'English: Present Continuous - Bring English Booklet (CW. 57, 58) + 🚨 Tomorrow is Dictation (Tuesday)!',
  arabicNote: 'تحضير درس Present Continuous - إحضار بوكليت الإنجليزي ص 57 و 58. (🚨 تذكير: غداً الثلاثاء إملاء إنجليزي لكلاس B).',
  bagItem: 'English Booklet (CW. 57, 58)',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2c-mon-english',
  classId: 'G2C',
  class_id: 'G2C',
  targetDay: 'Monday',
  subject: 'English',
  period: englishPeriods.G2C.Monday,
  title: 'Outdoor Activity',
  note: 'English: Outdoor Activity - Interactive language session + 🚨 Tomorrow is Dictation (Tuesday)!',
  arabicNote: 'نشاط لغوي تفاعلي خارجي (Outdoor Activity). (🚨 تذكير: غداً الثلاثاء إملاء إنجليزي لكلاس C).',
  bagItem: 'English Notebook & Pencil Case',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

// --- Target: Tuesday (Packed Monday Night) ---
// G2A: Reading & Listening + Extra Sheet
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2a-tue-english',
  classId: 'G2A',
  class_id: 'G2A',
  targetDay: 'Tuesday',
  subject: 'English',
  period: englishPeriods.G2A.Tuesday,
  title: 'Reading & Listening (CW. 59, 60) + Extra Sheet',
  note: 'English: Reading & Listening (CW. 59, 60) + Hand in Extra Sheet + Dictation on Thursday.',
  arabicNote: 'تحضير درس Reading & Listening ص 59 و 60 + تسليم شيت Extra Sheet مع الإجابات النموذجية. (تنبيه: إملاء كلاس A يوم الخميس).',
  bagItem: 'English Booklet (CW. 59, 60) & Solved Extra Sheet',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

// G2B: 🚨 DICTATION DAY (Tuesday)
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2b-tue-dictation',
  classId: 'G2B',
  class_id: 'G2B',
  targetDay: 'Tuesday',
  subject: 'English',
  period: englishPeriods.G2B.Tuesday,
  title: '🚨 English Dictation Day (Class 2B) & Movers Story',
  note: '🚨 Tomorrow Tuesday is English Dictation for Class 2B in Copy Book! Also bring CW. 61, 62 + Hand in Extra Sheet.',
  arabicNote: '🚨 إنذار وتنبيه هام: غداً الثلاثاء اختبار الإملاء (English Dictation) لكلاس 2B في كشكول الإملاء (Copy Book)! يرجى إحضار كشكول الإملاء، وبوكليت الإنجليزي ص 61 و 62، وتسليم شيت Extra Sheet. (قائمة الكلمات ستحدد قريباً).',
  bagItem: 'Dictation Copy Book (كشكول الإملاء), Pencil, Eraser, CW 61-62 & Extra Sheet',
  isQuiz: true,
  categoryType: 'quiz',
  block,
  week,
});

// G2C: 🚨 DICTATION DAY (Tuesday)
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2c-tue-dictation',
  classId: 'G2C',
  class_id: 'G2C',
  targetDay: 'Tuesday',
  subject: 'English',
  period: englishPeriods.G2C.Tuesday,
  title: '🚨 English Dictation Day (Class 2C)',
  note: '🚨 Tomorrow Tuesday is English Dictation for Class 2C in Copy Book! Hand in Extra Sheet.',
  arabicNote: '🚨 إنذار وتنبيه هام: غداً الثلاثاء اختبار الإملاء (English Dictation) لكلاس 2C في كشكول الإملاء (Copy Book)! يرجى إحضار كشكول الإملاء وقلم وممحاة، وتسليم شيت Extra Sheet. (قائمة الكلمات ستحدد قريباً).',
  bagItem: 'Dictation Copy Book (كشكول الإملاء), Pencil, Eraser & Extra Sheet',
  isQuiz: true,
  categoryType: 'quiz',
  block,
  week,
});

// --- Target: Wednesday (Packed Tuesday Night) ---
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2a-wed-english',
  classId: 'G2A',
  class_id: 'G2A',
  targetDay: 'Wednesday',
  subject: 'English',
  period: englishPeriods.G2A.Wednesday,
  title: 'Outdoor Activity + 🚨 Tomorrow is Dictation (Thursday)!',
  note: 'English: Outdoor Activity + 🚨 Tomorrow Thursday is English Dictation for Class 2A in Copy Book!',
  arabicNote: 'نشاط تفاعلي خارجي (Outdoor Activity). (🚨 تذكير هام جداً: غداً الخميس موعد إملاء الإنجليزي لكلاس 2A في كشكول الإملاء، يرجى الاستعداد!).',
  bagItem: 'English Notebook & Pencil Case',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2b-wed-english',
  classId: 'G2B',
  class_id: 'G2B',
  targetDay: 'Wednesday',
  subject: 'English',
  period: englishPeriods.G2B.Wednesday,
  title: 'Story Comprehension',
  note: 'English: Story reading and discussion - Bring English Story Book & Notebook.',
  arabicNote: 'تحضير حصة القصة (Story) - إحضار كتاب وقصة الإنجليزي وكشكول المادة.',
  bagItem: 'English Story Book & Notebook',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2c-wed-english',
  classId: 'G2C',
  class_id: 'G2C',
  targetDay: 'Wednesday',
  subject: 'English',
  period: englishPeriods.G2C.Wednesday,
  title: 'Movers Story (CW. 61, 62)',
  note: 'English: Movers Story - Bring English Booklet (CW. 61, 62).',
  arabicNote: 'تحضير درس Movers Story - إحضار بوكليت الإنجليزي ص 61 و 62.',
  bagItem: 'English Booklet (CW. 61, 62)',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

// --- Target: Thursday (Packed Wednesday Night) ---
// G2A: 🚨 DICTATION DAY (Thursday)
newTomorrowNotes.push({
  id: 'tn-b2-w5-g2a-thu-dictation',
  classId: 'G2A',
  class_id: 'G2A',
  targetDay: 'Thursday',
  subject: 'English',
  period: englishPeriods.G2A.Thursday,
  title: '🚨 English Dictation Day (Class 2A)',
  note: '🚨 Tomorrow Thursday is English Dictation for Class 2A in Copy Book! Also homework P. 88, 89 assigned.',
  arabicNote: '🚨 إنذار وتنبيه هام: غداً الخميس اختبار الإملاء (English Dictation) لكلاس 2A في كشكول الإملاء (Copy Book)! يرجى إحضار كشكول الإملاء وقلم رصاص وممحاة (قائمة الكلمات ستحدد قريباً). وسيتم حل ص 88 و 89.',
  bagItem: 'Dictation Copy Book (كشكول الإملاء), Pencil & Eraser',
  isQuiz: true,
  categoryType: 'quiz',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2b-thu-english',
  classId: 'G2B',
  class_id: 'G2B',
  targetDay: 'Thursday',
  subject: 'English',
  period: englishPeriods.G2B.Thursday,
  title: 'Outdoor Activity',
  note: 'English: Outdoor Activity - Communicative games and language interaction.',
  arabicNote: 'نشاط تفاعلي خارجي لمادة الإنجليزي (Outdoor Activity).',
  bagItem: 'English Notebook & Pencil Case',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
});

newTomorrowNotes.push({
  id: 'tn-b2-w5-g2c-thu-english',
  classId: 'G2C',
  class_id: 'G2C',
  targetDay: 'Thursday',
  subject: 'English',
  period: englishPeriods.G2C.Thursday,
  title: 'Reading & Listening (CW. 59, 60)',
  note: 'English: Reading & Listening - Bring English Booklet (CW. 59, 60).',
  arabicNote: 'تحضير درس Reading & Listening ص 59 و 60 - إحضار بوكليت الإنجليزي.',
  bagItem: 'English Booklet (CW. 59, 60)',
  isQuiz: false,
  categoryType: 'note',
  block,
  week,
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

// Register Weekly Plan PDF in materials.json
if (fs.existsSync(materialsPath)) {
  try {
    let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
    if (!Array.isArray(materials)) materials = [];
    const pdfPath = '/assets/aistudio/Weekly_Plan_English_-_B2_-_W5-_Minia____2dfcefd4.pdf';
    const matId = 'mat_weekly_plan_english_b2_w5';

    materials = materials.filter((m) => m.id !== matId);
    materials.unshift({
      id: matId,
      fileName: 'Weekly_Plan_English_-_B2_-_W5-_Minia____2dfcefd4.pdf',
      fileSize: 480000,
      storageUrl: pdfPath,
      linkUrl: pdfPath,
      subject: 'English',
      grade: 'Grade 2',
      term: 'Term 1',
      block: 2,
      week: 5,
      section: 'Weekly Plan',
      classId: 'ALL',
      type: 'pdf',
      uploadedAt: new Date().toISOString(),
      description: 'The Weekly Plan - English - Grade 2 - Block 2 - Week 5 (Ms. Tuqa Mmdouh)',
    });

    fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2), 'utf8');
    console.log('✅ Updated data/materials.json with English Weekly Plan PDF');
  } catch (mErr) {
    console.warn('Could not update materials.json:', mErr);
  }
}

console.log(`🎉 English Block 2 Week 5 Seeding Complete!`);
console.log(`- Classwork added: ${newClasswork.length} entries`);
console.log(`- Homework added: ${newHomework.length} entries`);
console.log(`- Tomorrow Notes added: ${newTomorrowNotes.length} entries`);
