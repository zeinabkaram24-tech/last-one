const fs = require('fs');

console.log('Starting Arabic Weekly Plan Seeder (Block 1 - Week 2 & Week 3)...');

const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [], deletedPlannerItemIds: [] };

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
if (!plannerData.deletedPlannerItemIds) plannerData.deletedPlannerItemIds = [];

// Clean any deleted IDs that might block Arabic dictation or Arabic items
plannerData.deletedPlannerItemIds = plannerData.deletedPlannerItemIds.filter(
  (id) => !id.toLowerCase().includes('arabic') && !id.toLowerCase().includes('عربي')
);

// 1. Clean existing Week 2 and Week 3 Arabic entries to prevent duplication
plannerData.classwork = plannerData.classwork.filter(
  (cw) => !((cw.week === 2 || cw.week === 3) && (cw.subject === 'Arabic' || cw.subject === 'arabic'))
);
plannerData.homework = plannerData.homework.filter(
  (hw) => !((hw.week === 2 || hw.week === 3) && (hw.subject === 'Arabic' || hw.subject === 'arabic'))
);
plannerData.tomorrowNotes = plannerData.tomorrowNotes.filter(
  (tn) => !((tn.week === 2 || tn.week === 3 || tn.week === 4) && (tn.subject === 'Arabic' || tn.subject === 'arabic'))
);

// Classes list
const classes = ['G2A', 'G2B', 'G2C'];
const weeks = [2, 3]; // Add to both Week 2 and Week 3 so it works seamlessly

// Period mappings according to official timetable
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
    Tuesday: 5,
    Wednesday: 4,
    Thursday: 1,
  },
  G2C: {
    Sunday: 6,
    Monday: 1,
    Tuesday: 7,
    Wednesday: 6,
    Thursday: 8,
  },
};

const newClasswork = [];
const newHomework = [];
const newTomorrowNotes = [];

weeks.forEach((w) => {
  classes.forEach((cls) => {
    // --- 1. Classwork (الكلاس وورك) ---
    // الأحد (Sunday): نص استماع (مهنة أبي)
    newClasswork.push({
      id: `cw-b1-w${w}-${cls}-Sunday-arabic-listening`,
      classId: cls,
      day: 'Sunday',
      period: arabicPeriods[cls].Sunday,
      subject: 'Arabic',
      title: 'نص استماع (مهنة أبي)',
      details: 'الوحدة الأولى: العودة إلى المدرسة - نص استماع (مهنة أبي) ومناقشة فهم المسموع واستخراج المفردات.',
      pages: 'فيديو تعليمي + كراسة نشاط الوحدة الأولى ص 19',
      completed: false,
      block: 1,
      week: w,
      class_id: cls,
    });

    // الإثنين (Monday): ظرف الزمان وظرف المكان + حل تدريبات
    newClasswork.push({
      id: `cw-b1-w${w}-${cls}-Monday-arabic-grammar`,
      classId: cls,
      day: 'Monday',
      period: arabicPeriods[cls].Monday,
      subject: 'Arabic',
      title: 'ظرف الزمان وظرف المكان + حل تدريبات',
      details: 'الوحدة الأولى: العودة إلى المدرسة - التعرف على ظرفي الزمان والمكان واستخدامهما في جمل مفيدة وحل تدريبات كراسة النشاط.',
      pages: 'فيديو تعليمي + كراسة نشاط الوحدة الأولى ص 16-17-18',
      completed: false,
      block: 1,
      week: w,
      class_id: cls,
    });

    // الثلاثاء (Tuesday): مكتبة
    newClasswork.push({
      id: `cw-b1-w${w}-${cls}-Tuesday-arabic-library`,
      classId: cls,
      day: 'Tuesday',
      period: arabicPeriods[cls].Tuesday,
      subject: 'Arabic',
      title: 'مكتبة',
      details: 'الوحدة الأولى: العودة إلى المدرسة - حصة المكتبة وقراءة قصص تعليمية لتنمية مهارات القراءة الصامتة والجهرية واكتساب مفردات جديدة.',
      pages: 'قصص تعليمية',
      completed: false,
      block: 1,
      week: w,
      class_id: cls,
    });

    // الأربعاء (Wednesday): إملاء
    newClasswork.push({
      id: `cw-b1-w${w}-${cls}-Wednesday-arabic-dictation`,
      classId: cls,
      day: 'Wednesday',
      period: arabicPeriods[cls].Wednesday,
      subject: 'Arabic',
      title: 'إملاء',
      details: 'الوحدة الأولى: العودة إلى المدرسة - تطبيق الإملاء الأسبوعي لتقييم المهارات الإملائية والظواهر اللغوية في كراسة الطالب.',
      pages: 'كراسة الطالب',
      completed: false,
      block: 1,
      week: w,
      class_id: cls,
    });

    // الخميس (Thursday): نشاط تطبيقي
    newClasswork.push({
      id: `cw-b1-w${w}-${cls}-Thursday-arabic-practice`,
      classId: cls,
      day: 'Thursday',
      period: arabicPeriods[cls].Thursday,
      subject: 'Arabic',
      title: 'نشاط تطبيقي',
      details: 'الوحدة الأولى: العودة إلى المدرسة - حل وتطبيق أوراق العمل الشاملة وتطبيقات المفاهيم المكتسبة خلال الأسبوع.',
      pages: 'أوراق العمل',
      completed: false,
      block: 1,
      week: w,
      class_id: cls,
    });

    // --- 2. Homework (الهوم وورك) ---
    // الأحد (Sunday): كتابة نشيد (مدرستي بيتي الثاني)
    newHomework.push({
      id: `hw-b1-w${w}-${cls}-Sun-arabic-poem`,
      classId: cls,
      assignedDay: 'Sunday',
      dueDay: 'Monday',
      subject: 'Arabic',
      task: 'كتابة نشيد (مدرستي بيتي الثاني) بخط جميل في كراسة الطالب',
      details: 'الوحدة الأولى: العودة إلى المدرسة - كتابة نشيد مدرستي بيتي الثاني بخط جميل ومرتب في كراسة الطالب مع مراعاة قواعد الخط.',
      pages: 'كراسة الطالب',
      completed: false,
      priority: 'normal',
      block: 1,
      week: w,
      class_id: cls,
    });

    // الثلاثاء (Tuesday): كراسة نشاط الوحدة الأولى صفحة 37-38
    newHomework.push({
      id: `hw-b1-w${w}-${cls}-Tue-arabic-activity`,
      classId: cls,
      assignedDay: 'Tuesday',
      dueDay: 'Wednesday',
      subject: 'Arabic',
      task: 'حل تدريبات كراسة نشاط الوحدة الأولى صفحة 37-38',
      details: 'الوحدة الأولى: العودة إلى المدرسة - إنجاز التدريبات والأنشطة المقررة ص 37 و 38 في كراسة نشاط الوحدة الأولى.',
      pages: 'كراسة نشاط الوحدة الأولى ص 37-38',
      completed: false,
      priority: 'normal',
      block: 1,
      week: w,
      class_id: cls,
    });

    // الثلاثاء (Tuesday): تنبيه الإملاء قبلها بيوم في الهوم وورك
    newHomework.push({
      id: `hw-b1-w${w}-${cls}-Tue-arabic-dictation-alert`,
      classId: cls,
      assignedDay: 'Tuesday',
      dueDay: 'Wednesday',
      subject: 'Arabic',
      task: '🔔 إنذار وتنبيه هام: إملاء لغة عربية غداً الأربعاء في كراسة الطالب',
      details: 'تنبيه إملاء: الاستعداد لإملاء مادة اللغة العربية غداً الأربعاء، ومراجعة الكلمات والظواهر اللغوية المقررة وإحضار كراسة الطالب وقلم رصاص وممحاة.',
      pages: 'كراسة الطالب',
      completed: false,
      priority: 'urgent',
      block: 1,
      week: w,
      class_id: cls,
    });

    // --- 3. Tomorrow Notes (التومارو) ---
    // التحضير ليوم الأحد (Target: Sunday - Packed Saturday night)
    newTomorrowNotes.push({
      id: `tn-b1-w${w}-${cls}-Sun-arabic-prep`,
      classId: cls,
      targetDay: 'Sunday',
      subject: 'Arabic',
      note: 'تحضير نص استماع (مهنة أبي) وإحضار كراسة نشاط الوحدة الأولى ص 19 وكتاب اللغة العربية',
      arabicNote: 'تحضير نص استماع (مهنة أبي) - إحضار كراسة نشاط الوحدة الأولى ص 19 وكتاب اللغة العربية',
      bagItem: 'كراسة نشاط الوحدة الأولى ص 19 وكتاب اللغة العربية',
      isQuiz: false,
      categoryType: 'note',
      block: 1,
      week: w,
      class_id: cls,
    });

    // التحضير ليوم الثلاثاء (حصة المكتبة)
    newTomorrowNotes.push({
      id: `tn-b1-w${w}-${cls}-Tue-arabic-library-prep`,
      classId: cls,
      targetDay: 'Tuesday',
      subject: 'Arabic',
      note: 'حصة قراءة في المكتبة - إحضار قصة تعليمية وكتاب اللغة العربية',
      arabicNote: 'حصة قراءة في المكتبة - إحضار قصة تعليمية أو كشكول القراءة وكتاب اللغة العربية',
      bagItem: 'قصص تعليمية / كشكول اللغة العربية',
      isQuiz: false,
      categoryType: 'note',
      block: 1,
      week: w,
      class_id: cls,
    });

    // التحضير ليوم الأربعاء - تنبيه وإنذار الإملاء قبلها بيوم في التومارو
    newTomorrowNotes.push({
      id: `tn-b1-w${w}-${cls}-Wed-arabic-dictation-alert`,
      classId: cls,
      targetDay: 'Wednesday',
      subject: 'Arabic',
      note: 'Arabic Dictation in Student Notebook tomorrow',
      arabicNote: '🚨 إنذار وتنبيه هام: غداً الأربعاء إملاء أسبوعي في مادة اللغة العربية في كراسة الطالب! يرجى المراجعة والاستعداد وتجهيز كراسة الطالب وقلم رصاص وممحاة.',
      bagItem: 'كراسة الطالب (كراسة الإملاء) وقلم رصاص وممحاة',
      isQuiz: true,
      categoryType: 'quiz',
      block: 1,
      week: w,
      class_id: cls,
    });
  });
});

// Append to plannerData
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Write back to data/planner_data.json
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('Arabic Weekly Plan Seeding Completed Successfully!');
console.log('Classwork items added:', newClasswork.length);
console.log('Homework items added:', newHomework.length);
console.log('Tomorrow notes added:', newTomorrowNotes.length);
