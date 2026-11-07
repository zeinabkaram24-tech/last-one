const fs = require('fs');
const path = require('path');

console.log('🚀 Running ICT Seeder & English Tomorrow Note Cleanup...');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.json');
const materialsPath = path.join(__dirname, '..', 'data', 'materials.json');

let plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));

// -------------------------------------------------------------
// 1. CLEAN UP ENGLISH TOMORROW NOTES FOR BLOCK 2 WEEK 5
// -------------------------------------------------------------
const englishRoutineNoteIdsToDelete = [
  'tn-b2-w5-g2a-sun-english',
  'tn-b2-w5-g2b-sun-english',
  'tn-b2-w5-g2c-sun-english',
  'tn-b2-w5-g2a-mon-english',
  'tn-b2-w5-g2b-mon-english',
  'tn-b2-w5-g2c-mon-english',
  'tn-b2-w5-g2a-tue-english',
  'tn-b2-w5-g2a-wed-english',
  'tn-b2-w5-g2b-wed-english',
  'tn-b2-w5-g2c-wed-english',
  'tn-b2-w5-g2b-thu-english',
  'tn-b2-w5-g2c-thu-english',
];

// Add deleted IDs to deletedTomorrowNoteIds
if (!plannerData.deletedTomorrowNoteIds) plannerData.deletedTomorrowNoteIds = [];
const deletedTnSet = new Set(plannerData.deletedTomorrowNoteIds);
englishRoutineNoteIdsToDelete.forEach((id) => deletedTnSet.add(id));
plannerData.deletedTomorrowNoteIds = Array.from(deletedTnSet);

// Remove the routine English tomorrow notes from plannerData.tomorrowNotes
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (n) => !englishRoutineNoteIdsToDelete.includes(n.id)
);

// Clean up the 3 dictation notes to remove any "Hand in Extra Sheet" or routine sheet demands
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

const dictationPdfUrl = '/assets/aistudio/English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';
const dictationPdfName = 'English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';

plannerData.tomorrowNotes = plannerData.tomorrowNotes.map((n) => {
  if (n.id === 'tn-b2-w5-g2b-tue-dictation' || n.id === 'tn-b2-w5-g2c-tue-dictation') {
    return {
      ...n,
      title: `🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الثلاثاء (Class ${n.classId.replace('G', '')})`,
      note: `🚨 Tomorrow Tuesday is English Dictation for Class ${n.classId.replace('G', '')} in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.`,
      arabicNote: `🚨 إنذار وتنبيه هام: غداً الثلاثاء موعد اختبار الإملاء (English Dictation) لكلاس ${n.classId.replace('G', '')} في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
      bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    };
  }
  if (n.id === 'tn-b2-w5-g2a-thu-dictation') {
    return {
      ...n,
      title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الخميس (Class 2A)',
      note: '🚨 Tomorrow Thursday is English Dictation for Class 2A in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
      arabicNote: `🚨 إنذار وتنبيه هام: غداً الخميس موعد اختبار الإملاء (English Dictation) لكلاس 2A في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
      bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    };
  }
  return n;
});

// -------------------------------------------------------------
// 2. SEED ICT FOR BLOCK 2 WEEK 4 & WEEK 5 (3 SESSIONS EACH)
// -------------------------------------------------------------
// Timetable mapping for ICT:
// G2A: Sunday P3, Tuesday P6, Wednesday P2 (Teacher: Mariem)
// G2B: Sunday P5 (Leadership -> ICT), Tuesday P3, Thursday P1 (Teacher: Mariem)
// G2C: Monday P7, Tuesday P1, Thursday P2 (Leadership -> ICT) (Teacher: Abeer)

const ictSchedule = {
  G2A: [
    { day: 'Sunday', period: 3, teacher: 'Mariem' },
    { day: 'Tuesday', period: 6, teacher: 'Mariem' },
    { day: 'Wednesday', period: 2, teacher: 'Mariem', isLast: true },
  ],
  G2B: [
    { day: 'Sunday', period: 5, teacher: 'Mariem' }, // Formerly Leadership slot
    { day: 'Tuesday', period: 3, teacher: 'Mariem' },
    { day: 'Thursday', period: 1, teacher: 'Mariem', isLast: true },
  ],
  G2C: [
    { day: 'Monday', period: 7, teacher: 'Abeer' },
    { day: 'Tuesday', period: 1, teacher: 'Abeer' },
    { day: 'Thursday', period: 2, teacher: 'Abeer', isLast: true }, // Formerly Leadership slot
  ],
};

// Filter out old ICT entries for B2 W4 and B2 W5 to avoid duplicates
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(Number(cw.block) === 2 && (Number(cw.week) === 4 || Number(cw.week) === 5) && (cw.subject === 'ICT' || cw.subject === 'ict'))
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(Number(hw.block) === 2 && (Number(hw.week) === 4 || Number(hw.week) === 5) && (hw.subject === 'ICT' || hw.subject === 'ict'))
);

const newIctClasswork = [];
const newIctHomework = [];

// --- WEEK 4 SEEDING ---
const w4Sessions = [
  {
    sessionNum: 1,
    title: 'Unit 2: Communicating with Email / E-safety — Session 1 (E-safety & Rules + Quiz)',
    details: 'Unit: Communicating with Email / E-safety. Topics: E-safety, E-safety rules, and Quiz covering Weeks 1 & 2. Resources: Study sheet W4, Classwork W4 Pg. 25-27-29.',
    pages: 'Study sheet W4, Classwork W4 Pg. 25-27-29',
  },
  {
    sessionNum: 2,
    title: 'Unit 2: Communicating with Email / E-safety — Session 2 (Personal Info & Data Privacy)',
    details: 'Unit: Communicating with Email / E-safety. Topics: Personal information, Public and private information, and The importance of data privacy. Resources: Study sheet W4, Classwork W4 Pg. 25-27-29.',
    pages: 'Study sheet W4, Classwork W4 Pg. 25-27-29',
  },
  {
    sessionNum: 3,
    title: 'Unit 2: Communicating with Email / E-safety — Session 3 (Assessment & Quiz)',
    details: 'Unit: Communicating with Email / E-safety. Topics: Practical Quiz and assessment on E-safety concepts. Resources: Classwork W4. Homework assigned on Session 3: Homework W4 Pg. 30.',
    pages: 'Classwork W4 Pg. 25-27-29',
  },
];

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  const sched = ictSchedule[cls];
  sched.forEach((slot, idx) => {
    const sess = w4Sessions[idx];
    newIctClasswork.push({
      id: `cw-b2-w4-${cls.toLowerCase()}-${slot.day.toLowerCase()}-p${slot.period}-ict`,
      classId: cls,
      class_id: cls,
      day: slot.day,
      period: slot.period,
      subject: 'ICT',
      title: sess.title,
      details: sess.details,
      pages: sess.pages,
      completed: false,
      block: 2,
      week: 4,
    });

    if (slot.isLast) {
      newIctHomework.push({
        id: `hw-b2-w4-${cls.toLowerCase()}-${slot.day.toLowerCase()}-ict`,
        classId: cls,
        class_id: cls,
        assignedDay: slot.day,
        assigned_day: slot.day,
        dueDay: 'Sunday',
        due_day: 'Sunday',
        subject: 'ICT',
        task: 'ICT Homework W4 Pg. 30',
        details: 'Unit 2: Communicating with Email / E-safety. Complete exercises on Homework W4 Page 30 in the ICT booklet.',
        pages: 'Homework W4 Pg. 30',
        completed: false,
        priority: 'normal',
        block: 2,
        week: 4,
      });
    }
  });
});

// --- WEEK 5 SEEDING ---
const w5Sessions = [
  {
    sessionNum: 1,
    title: 'Unit 2: Communicating with Email & E-safety — Session 1 (Review & Practical Lab Practice)',
    details: 'Unit: Communicating with Email & E-safety. Topics: Comprehensive review of Email components, sending/receiving messages, safe email etiquette, and avoiding online risks. Hands-on computer lab session.',
    pages: 'Study sheet W5, ICT Booklet',
  },
  {
    sessionNum: 2,
    title: 'Unit 2: Data Privacy, Strong Passwords & Safe Browsing — Session 2',
    details: 'Unit: Communicating with Email & E-safety. Topics: Practical lab exercises on distinguishing public vs private data, constructing strong passwords, and safe online navigation rules.',
    pages: 'Study sheet W5, ICT Booklet',
  },
  {
    sessionNum: 3,
    title: 'Unit 2: Practical Lab Project & Evaluation — Session 3',
    details: 'Unit: Communicating with Email & E-safety. Topics: Evaluation of practical typing and computer skills, completing the end-of-unit review. Homework assigned on Session 3: ICT Homework W5.',
    pages: 'ICT Booklet / Study Sheet W5',
  },
];

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  const sched = ictSchedule[cls];
  sched.forEach((slot, idx) => {
    const sess = w5Sessions[idx];
    newIctClasswork.push({
      id: `cw-b2-w5-${cls.toLowerCase()}-${slot.day.toLowerCase()}-p${slot.period}-ict`,
      classId: cls,
      class_id: cls,
      day: slot.day,
      period: slot.period,
      subject: 'ICT',
      title: sess.title,
      details: sess.details,
      pages: sess.pages,
      completed: false,
      block: 2,
      week: 5,
    });

    if (slot.isLast) {
      newIctHomework.push({
        id: `hw-b2-w5-${cls.toLowerCase()}-${slot.day.toLowerCase()}-ict`,
        classId: cls,
        class_id: cls,
        assignedDay: slot.day,
        assigned_day: slot.day,
        dueDay: 'Sunday',
        due_day: 'Sunday',
        subject: 'ICT',
        task: 'ICT Homework W5 (Unit 2 Practical Review & Exercises)',
        details: 'Unit: Communicating with Email & E-safety. Complete the Unit 2 review exercises in the ICT study sheet / booklet.',
        pages: 'ICT Booklet W5',
        completed: false,
        priority: 'normal',
        block: 2,
        week: 5,
      });
    }
  });
});

plannerData.classwork.push(...newIctClasswork);
plannerData.homework.push(...newIctHomework);

// Save to data/planner_data.json
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('✅ Updated data/planner_data.json with cleaned English notes and seeded ICT B2W4 & B2W5');

// Also sync to src/data/initialData.json
try {
  let initData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
  initData.deletedTomorrowNoteIds = plannerData.deletedTomorrowNoteIds;
  initData.tomorrowNotes = (initData.tomorrowNotes || []).filter(
    (n) => !englishRoutineNoteIdsToDelete.includes(n.id)
  );
  initData.tomorrowNotes = plannerData.tomorrowNotes;

  initData.classwork = (initData.classwork || []).filter(
    (cw) => !(Number(cw.block) === 2 && (Number(cw.week) === 4 || Number(cw.week) === 5) && (cw.subject === 'ICT' || cw.subject === 'ict'))
  );
  initData.homework = (initData.homework || []).filter(
    (hw) => !(Number(hw.block) === 2 && (Number(hw.week) === 4 || Number(hw.week) === 5) && (hw.subject === 'ICT' || hw.subject === 'ict'))
  );

  initData.classwork.push(...newIctClasswork);
  initData.homework.push(...newIctHomework);

  fs.writeFileSync(initialDataPath, JSON.stringify(initData, null, 2), 'utf8');
  console.log('✅ Updated src/data/initialData.json');
} catch (e) {
  console.error('Error updating initialData.json:', e);
}

// Update data/materials.json to include ICT W4 weekly plan if missing
if (fs.existsSync(materialsPath)) {
  try {
    let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
    if (!materials.some((m) => m.fileName && m.fileName.includes('Weekly_Plan_ICT_-_B2_-_W4'))) {
      materials.push({
        id: 'mat_weekly_plan_ict_b2_w4',
        fileName: 'Weekly_Plan_ICT_-_B2_-_W4-_Minia____93a7af56.pdf',
        fileSize: 330000,
        storageUrl: '/assets/aistudio/Weekly_Plan_ICT_-_B2_-_W4-_Minia____93a7af56.pdf',
        linkUrl: '/assets/aistudio/Weekly_Plan_ICT_-_B2_-_W4-_Minia____93a7af56.pdf',
        subject: 'ICT',
        grade: 'Grade 2',
        term: 'Term 1',
        block: 2,
        week: 4,
        section: 'Weekly Plan',
        classId: 'ALL',
        type: 'pdf',
        uploadedAt: new Date().toISOString(),
        description: 'The Weekly Plan - ICT - Grade 2 - Block 2 - Week 4 (Mrs. Abeer Hassan & Ms. Mariam Ahmed)',
      });
      fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2), 'utf8');
      console.log('✅ Added Weekly_Plan_ICT_-_B2_-_W4 to materials.json');
    }
  } catch (err) {
    console.error('Error updating materials.json:', err);
  }
}

console.log('🎉 Done! Summary:');
console.log(`- Routine English Tomorrow notes removed: ${englishRoutineNoteIdsToDelete.length}`);
console.log(`- New ICT Classwork entries (W4 + W5): ${newIctClasswork.length}`);
console.log(`- New ICT Homework entries (W4 + W5): ${newIctHomework.length}`);
