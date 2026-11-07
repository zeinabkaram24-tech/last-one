const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Arabic Seeder for Block 2 - Week 5 (Grade 2)...');

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

// 1. Clean any existing Block 2 Week 5 Arabic entries to ensure clean idempotency
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !(Number(cw.block) === 2 && Number(cw.week) === 5 && (cw.subject === 'Arabic' || cw.subject === 'لغة عربية' || cw.subject === 'arabic'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !(Number(hw.block) === 2 && Number(hw.week) === 5 && (hw.subject === 'Arabic' || hw.subject === 'لغة عربية' || hw.subject === 'arabic'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !(Number(tn.block) === 2 && Number(tn.week) === 5 && (tn.subject === 'Arabic' || tn.subject === 'لغة عربية' || tn.subject === 'arabic'))
);

// Unblock deleted IDs for Arabic B2 W5
plannerData.deletedPlannerItemIds = plannerData.deletedPlannerItemIds.filter(
  (id) => !id.includes('b2-w5') || (!id.includes('arabic') && !id.includes('عربي'))
);
plannerData.deletedTomorrowNoteIds = plannerData.deletedTomorrowNoteIds.filter(
  (id) => !id.includes('b2-w5') || (!id.includes('arabic') && !id.includes('عربي'))
);

const classes = ['G2A', 'G2B', 'G2C'];
const block = 2;
const week = 5;

// Period timetable mapping according to official schedule
const arabicPeriods = {
  G2A: {
    Sunday: 7,
    Monday: 1,
    Tuesday: 8,
    Wednesday: 6,
    Thursday: 5,
  },
  G2B: {
    Sunday: 4,
    Monday: 8,
    Tuesday: 4,
    Wednesday: 4,
    Thursday: 8,
  },
  G2C: {
    Sunday: 6,
    Monday: 1,
    Tuesday: 7,
    Wednesday: 6,
    Thursday: 7,
  },
};

const newClasswork = [];
const newHomework = [];
const newTomorrowNotes = [];

classes.forEach((cls) => {
  // ================= 1. Classwork =================
  // الأحد (Sunday - 2026/11/8): قراءة درس أحمد في متجر الملابس الرياضية
  newClasswork.push({
    id: `cw-b2-w5-${cls.toLowerCase()}-sun-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Sunday',
    period: arabicPeriods[cls].Sunday,
    subject: 'Arabic',
    title: 'قراءة درس أحمد في متجر الملابس الرياضية',
    details: 'الوحدة الثالثة (التسوق) - قراءة درس أحمد في متجر الملابس الرياضية واستخراج المفردات ومعاني الكلمات ومناقشة الفكرة الرئيسية.',
    pages: 'أوراق عمل الوحدة الثالثة ص 36-37',
    completed: false,
    block,
    week,
  });

  // الإثنين (Monday - 2026/11/9): المناقشة اللغوية لدرس أحمد في متجر الألعاب الرياضية + قراءة إعلان
  newClasswork.push({
    id: `cw-b2-w5-${cls.toLowerCase()}-mon-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Monday',
    period: arabicPeriods[cls].Monday,
    subject: 'Arabic',
    title: 'المناقشة اللغوية لدرس أحمد في متجر الألعاب الرياضية + قراءة إعلان',
    details: 'الوحدة الثالثة (التسوق) - المناقشة اللغوية والتراكيب لدرس أحمد في متجر الألعاب الرياضية + تدريب قراءة إعلان وتحليل عناصره.',
    pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 38-39',
    completed: false,
    block,
    week,
  });

  // الثلاثاء (Tuesday - 2026/11/10): الفعل الماضي والمضارع
  newClasswork.push({
    id: `cw-b2-w5-${cls.toLowerCase()}-tue-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Tuesday',
    period: arabicPeriods[cls].Tuesday,
    subject: 'Arabic',
    title: 'الفعل الماضي والمضارع',
    details: 'الوحدة الثالثة (التسوق) - شرح وتمييز الفعل الماضي والفعل المضارع وكيفية صياغتهما واستخدامهما في جمل مفيدة.',
    pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 40',
    completed: false,
    block,
    week,
  });

  // الأربعاء (Wednesday - 2026/11/11): الجملة الاسمية والجملة الفعلية
  newClasswork.push({
    id: `cw-b2-w5-${cls.toLowerCase()}-wed-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Wednesday',
    period: arabicPeriods[cls].Wednesday,
    subject: 'Arabic',
    title: 'الجملة الاسمية والجملة الفعلية',
    details: 'الوحدة الثالثة (التسوق) - التعرف على الجملة الاسمية والجملة الفعلية والتمييز بينهما والتحويل من الجملة الاسمية إلى الفعلية والعكس.',
    pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 41',
    completed: false,
    block,
    week,
  });

  // الخميس (Thursday - 2026/11/12): نشاط استماع (الديك المغرور)
  newClasswork.push({
    id: `cw-b2-w5-${cls.toLowerCase()}-thu-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Thursday',
    period: arabicPeriods[cls].Thursday,
    subject: 'Arabic',
    title: 'نشاط استماع (الديك المغرور)',
    details: 'الوحدة الثالثة (التسوق) - استماع نص قصة (الديك المغرور) ومناقشة الدروس المستفادة وقيم القصة وحل أنشطة الفهم والاستيعاب.',
    pages: 'استماع النص + أوراق عمل الوحدة الثالثة ص 45',
    completed: false,
    block,
    week,
  });

  // ================= 2. Homework =================
  // الأحد (Sunday): كتابة الفقرة الأولى من درس (أحمد في متجر الملابس الرياضية)
  newHomework.push({
    id: `hw-b2-w5-${cls.toLowerCase()}-sun-arabic`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Monday',
    due_day: 'Monday',
    subject: 'Arabic',
    task: 'كتابة الفقرة الأولى من درس (أحمد في متجر الملابس الرياضية)',
    title: 'كتابة الفقرة الأولى من درس (أحمد في متجر الملابس الرياضية)',
    details: 'الوحدة الثالثة (التسوق) - كتابة الفقرة الأولى من درس (أحمد في متجر الملابس الرياضية) بخط جميل ومرتب في كشكول اللغة العربية مع ضبط الحركات.',
    pages: 'كشكول اللغة العربية / كتابة الفقرة الأولى',
    completed: false,
    priority: 'normal',
    block,
    week,
  });

  // الثلاثاء (Tuesday): كراسة التكليفات المنزلية ص 62
  newHomework.push({
    id: `hw-b2-w5-${cls.toLowerCase()}-tue-arabic`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Tuesday',
    assigned_day: 'Tuesday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'Arabic',
    task: 'حل كراسة التكليفات المنزلية ص 62',
    title: 'حل كراسة التكليفات المنزلية ص 62',
    details: 'الوحدة الثالثة (التسوق) - إنجاز تدريبات درس الفعل الماضي والمضارع المقررة في كراسة التكليفات المنزلية ص 62.',
    pages: 'كراسة التكليفات المنزلية ص 62',
    completed: false,
    priority: 'normal',
    block,
    week,
  });

  // ================= 3. Tomorrow Notes =================
  // التحضير ليوم الأحد (تجهيز شنطة السبت مساءً)
  newTomorrowNotes.push({
    id: `tn-b2-w5-${cls.toLowerCase()}-sun-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Sunday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Sunday,
    title: 'تحضير درس قراءة (أحمد في متجر الملابس الرياضية)',
    note: 'تحضير درس قراءة (أحمد في متجر الملابس الرياضية) - إحضار أوراق عمل الوحدة الثالثة ص 36-37 وكتاب وكشكول اللغة العربية.',
    arabicNote: 'تحضير درس قراءة (أحمد في متجر الملابس الرياضية) - إحضار أوراق عمل الوحدة الثالثة ص 36-37 وكتاب وكشكول اللغة العربية.',
    bagItem: 'أوراق عمل الوحدة الثالثة ص 36-37 وكتاب وكشكول العربي',
    isQuiz: false,
    categoryType: 'note',
    block,
    week,
  });

  // التحضير ليوم الإثنين (تجهيز شنطة الأحد مساءً)
  newTomorrowNotes.push({
    id: `tn-b2-w5-${cls.toLowerCase()}-mon-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Monday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Monday,
    title: 'تسليم واجب العربي ومتابعة درس أحمد في متجر الملابس',
    note: 'تسليم واجب كتابة الفقرة الأولى من درس أحمد في متجر الملابس الرياضية + إحضار أوراق عمل الوحدة الثالثة ص 38-39.',
    arabicNote: 'تسليم واجب كتابة الفقرة الأولى من درس أحمد في متجر الملابس الرياضية + إحضار أوراق عمل الوحدة الثالثة ص 38-39.',
    bagItem: 'كشكول واجب العربي وأوراق عمل الوحدة الثالثة ص 38-39',
    isQuiz: false,
    categoryType: 'note',
    block,
    week,
  });

  // التحضير ليوم الثلاثاء (تجهيز شنطة الإثنين مساءً)
  newTomorrowNotes.push({
    id: `tn-b2-w5-${cls.toLowerCase()}-tue-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Tuesday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Tuesday,
    title: 'تحضير درس الفعل الماضي والمضارع',
    note: 'تحضير درس الفعل الماضي والمضارع - إحضار أوراق عمل الوحدة الثالثة ص 40 وكتاب وكشكول اللغة العربية.',
    arabicNote: 'تحضير درس الفعل الماضي والمضارع - إحضار أوراق عمل الوحدة الثالثة ص 40 وكتاب وكشكول اللغة العربية.',
    bagItem: 'أوراق عمل الوحدة الثالثة ص 40 وكتاب وكشكول العربي',
    isQuiz: false,
    categoryType: 'note',
    block,
    week,
  });

  // التحضير ليوم الأربعاء (تجهيز شنطة الثلاثاء مساءً)
  newTomorrowNotes.push({
    id: `tn-b2-w5-${cls.toLowerCase()}-wed-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Wednesday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Wednesday,
    title: 'تسليم واجب كراسة التكليفات ص 62 وتحضير الجملة الاسمية والفعلية',
    note: 'تسليم واجب كراسة التكليفات المنزلية ص 62 + إحضار أوراق عمل الوحدة الثالثة ص 41.',
    arabicNote: 'تسليم واجب كراسة التكليفات المنزلية ص 62 + إحضار أوراق عمل الوحدة الثالثة ص 41.',
    bagItem: 'كراسة التكليفات المنزلية ص 62 وأوراق عمل الوحدة الثالثة ص 41',
    isQuiz: false,
    categoryType: 'note',
    block,
    week,
  });

  // التحضير ليوم الخميس (تجهيز شنطة الأربعاء مساءً)
  newTomorrowNotes.push({
    id: `tn-b2-w5-${cls.toLowerCase()}-thu-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Thursday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Thursday,
    title: 'تحضير نشاط استماع (الديك المغرور)',
    note: 'تحضير نشاط استماع قصة (الديك المغرور) - إحضار أوراق عمل الوحدة الثالثة ص 45 وكتاب اللغة العربية.',
    arabicNote: 'تحضير نشاط استماع قصة (الديك المغرور) - إحضار أوراق عمل الوحدة الثالثة ص 45 وكتاب اللغة العربية.',
    bagItem: 'أوراق عمل الوحدة الثالثة ص 45 وكتاب العربي',
    isQuiz: false,
    categoryType: 'note',
    block,
    week,
  });
});

// Append to plannerData
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
      (cw) => !(Number(cw.block) === 2 && Number(cw.week) === 5 && (cw.subject === 'Arabic' || cw.subject === 'لغة عربية' || cw.subject === 'arabic'))
    );
    initData.homework = initData.homework.filter(
      (hw) => !(Number(hw.block) === 2 && Number(hw.week) === 5 && (hw.subject === 'Arabic' || hw.subject === 'لغة عربية' || hw.subject === 'arabic'))
    );
    initData.tomorrowNotes = initData.tomorrowNotes.filter(
      (tn) => !(Number(tn.block) === 2 && Number(tn.week) === 5 && (tn.subject === 'Arabic' || tn.subject === 'لغة عربية' || tn.subject === 'arabic'))
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

// Register Weekly Plan in materials.json if available
if (fs.existsSync(materialsPath)) {
  try {
    let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));
    if (!Array.isArray(materials)) materials = [];
    const pdfPath = '/assets/aistudio/Weekly_Plan_Arabic_-_B2_-_W5-_Minia____631fb03f.pdf';
    const matId = 'mat_weekly_plan_arabic_b2_w5';

    // Remove if already exists
    materials = materials.filter((m) => m.id !== matId);
    materials.unshift({
      id: matId,
      fileName: 'Weekly_Plan_Arabic_-_B2_-_W5-_Minia____631fb03f.pdf',
      fileSize: 450000,
      storageUrl: pdfPath,
      linkUrl: pdfPath,
      subject: 'Arabic',
      grade: 'Grade 2',
      term: 'Term 1',
      block: 2,
      week: 5,
      section: 'Weekly Plan',
      classId: 'ALL',
      type: 'pdf',
      uploadedAt: new Date().toISOString(),
      description: 'الخطة الأسبوعية لمادة اللغة العربية - الصف الثاني - الفترة الثانية - الأسبوع الخامس (أ/ مروة ممدوح)',
    });

    fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2), 'utf8');
    console.log('✅ Updated data/materials.json with Weekly Plan PDF');
  } catch (mErr) {
    console.warn('Could not update materials.json:', mErr);
  }
}

console.log(`🎉 Arabic Block 2 Week 5 Seeding Complete!`);
console.log(`- Classwork added: ${newClasswork.length} entries`);
console.log(`- Homework added: ${newHomework.length} entries`);
console.log(`- Tomorrow Notes added: ${newTomorrowNotes.length} entries`);
