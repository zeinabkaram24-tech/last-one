const fs = require('fs');
const plannerPath = 'data/planner_data.json';
const plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));

const w = 2; // Week 2
const classes = ['G2A', 'G2B', 'G2C']; // Assuming these classes
const arabicPeriods = {
    G2A: { Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5 },
    G2B: { Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5 },
    G2C: { Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5 }
};

const newClasswork = [];
const newHomework = [];
const newTomorrowNotes = [];

classes.forEach(cls => {
    // 1. Classwork (الـ classwork)
    // الأحد (Sunday): قراءة درس من المكتبة إلى المدرسة + المناقشة القرائية للدرس
    newClasswork.push({
        id: `cw-b2-w${w}-${cls}-Sunday-arabic-reading`,
        classId: cls,
        day: 'Sunday',
        period: arabicPeriods[cls].Sunday,
        subject: 'Arabic',
        title: 'قراءة درس (من المكتبة إلى المدرسة) + المناقشة القرائية',
        details: 'الوحدة الثالثة: التسوق - قراءة درس من المكتبة إلى المدرسة ومناقشة الدرس واستخراج أهم المفردات.',
        pages: 'أوراق عمل الوحدة الثالثة ص 11-12',
        completed: false,
        block: 2,
        week: w,
        class_id: cls,
    });
    // الإثنين (Monday): تدريبات لغوية + نشاط كتابة
    newClasswork.push({
        id: `cw-b2-w${w}-${cls}-Monday-arabic-grammar`,
        classId: cls,
        day: 'Monday',
        period: arabicPeriods[cls].Monday,
        subject: 'Arabic',
        title: 'تدريبات لغوية + نشاط كتابة',
        details: 'الوحدة الثالثة: التسوق - تدريبات لغوية متنوعة ونشاط كتابة.',
        pages: 'أوراق عمل الوحدة الثالثة ص 13-14-15',
        completed: false,
        block: 2,
        week: w,
        class_id: cls,
    });
    // الثلاثاء (Tuesday): المفرد والمثنى
    newClasswork.push({
        id: `cw-b2-w${w}-${cls}-Tuesday-arabic-grammar`,
        classId: cls,
        day: 'Tuesday',
        period: arabicPeriods[cls].Tuesday,
        subject: 'Arabic',
        title: 'المفرد والمثنى',
        details: 'الوحدة الثالثة: التسوق - شرح درس المفرد والمثنى.',
        pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 16',
        completed: false,
        block: 2,
        week: w,
        class_id: cls,
    });
    // الأربعاء (Wednesday): نشاط صفي - نشاط خارج المدرسة
    newClasswork.push({
        id: `cw-b2-w${w}-${cls}-Wednesday-arabic-activity`,
        classId: cls,
        day: 'Wednesday',
        period: arabicPeriods[cls].Wednesday,
        subject: 'Arabic',
        title: 'نشاط صفي (نشاط خارج المدرسة)',
        details: 'الوحدة الثالثة: التسوق - نشاط صفي تطبيقي خارج المدرسة.',
        pages: 'نشاط خارج المدرسة',
        completed: false,
        block: 2,
        week: w,
        class_id: cls,
    });
    // الخميس (Thursday): نص استماع (ميدو الأكول)
    newClasswork.push({
        id: `cw-b2-w${w}-${cls}-Thursday-arabic-listening`,
        classId: cls,
        day: 'Thursday',
        period: arabicPeriods[cls].Thursday,
        subject: 'Arabic',
        title: 'نص استماع (ميدو الأكول)',
        details: 'الوحدة الثالثة: التسوق - نص استماع (ميدو الأكول).',
        pages: 'فيديو+ أوراق عمل الوحدة الثالثة ص 17',
        completed: false,
        block: 2,
        week: w,
        class_id: cls,
    });

    // 2. Homework (الهوم وورك)
    // الأحد (Sunday): كراسة التكليفات المنزلية ص 54-55
    newHomework.push({
        id: `hw-b2-w${w}-${cls}-Sun-arabic-task`,
        classId: cls,
        assignedDay: 'Sunday',
        dueDay: 'Monday',
        subject: 'Arabic',
        task: 'حل كراسة التكليفات المنزلية ص 54-55',
        details: 'الوحدة الثالثة: التسوق - حل كراسة التكليفات المنزلية ص 54-55.',
        pages: 'كراسة التكليفات المنزلية ص 54-55',
        completed: false,
        priority: 'normal',
        block: 2,
        week: w,
        class_id: cls,
    });
    // الثلاثاء (Tuesday): كراسة التكليفات المنزلية ص 57
    newHomework.push({
        id: `hw-b2-w${w}-${cls}-Tue-arabic-task`,
        classId: cls,
        assignedDay: 'Tuesday',
        dueDay: 'Wednesday',
        subject: 'Arabic',
        task: 'حل كراسة التكليفات المنزلية ص 57',
        details: 'الوحدة الثالثة: التسوق - حل كراسة التكليفات المنزلية ص 57.',
        pages: 'كراسة التكليفات المنزلية ص 57',
        completed: false,
        priority: 'normal',
        block: 2,
        week: w,
        class_id: cls,
    });
});

// Append to plannerData
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Write back to data/planner_data.json
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('Arabic Week 2 Weekly Plan Seeding Completed Successfully!');
