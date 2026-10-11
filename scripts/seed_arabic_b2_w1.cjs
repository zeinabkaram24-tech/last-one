const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Starting Arabic Block 2 - Week 1 Seeder (11/10/2026 - 15/10/2026)...');

const classes = ['G2A', 'G2B', 'G2C'];

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
  // ===================== 1. CLASSWORK =====================
  // الأحد 11/10/2026: قراءة درس من السوق إلى المائدة
  newClasswork.push({
    id: `cw-b2-w1-${cls}-Sunday-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Sunday',
    period: arabicPeriods[cls].Sunday,
    subject: 'Arabic',
    title: 'قراءة درس من السوق إلى المائدة',
    details: 'الوحدة الثالثة: (التسوق) - قراءة درس من السوق إلى المائدة والتعرف على المفردات الجديدة وتطوير مهارات القراءة الجهرية.',
    pages: 'أوراق عمل الوحدة الثالثة ص 3-4',
    completed: false,
    block: 2,
    week: 1,
  });

  // الاثنين 12/10/2026: المناقشة اللغوية لدرس من السوق إلى المائدة + الألف المقصورة
  newClasswork.push({
    id: `cw-b2-w1-${cls}-Monday-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Monday',
    period: arabicPeriods[cls].Monday,
    subject: 'Arabic',
    title: 'المناقشة اللغوية لدرس من السوق إلى المائدة + الألف المقصورة',
    details: 'الوحدة الثالثة: (التسوق) - المناقشة اللغوية لدرس من السوق إلى المائدة وشرح قاعدة الألف المقصورة وحل التدريبات.',
    pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 5-6-7-8',
    completed: false,
    block: 2,
    week: 1,
  });

  // الثلاثاء 13/10/2026: نص استماع (سوق الخضار)
  newClasswork.push({
    id: `cw-b2-w1-${cls}-Tuesday-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Tuesday',
    period: arabicPeriods[cls].Tuesday,
    subject: 'Arabic',
    title: 'نص استماع (سوق الخضار)',
    details: 'الوحدة الثالثة: (التسوق) - الاستماع إلى نص سوق الخضار، مناقشة فهم المسموع واستخراج التراكيب والظواهر اللغوية.',
    pages: 'فيديو + أوراق عمل الوحدة الثالثة ص 9',
    completed: false,
    block: 2,
    week: 1,
  });

  // الأربعاء 14/10/2026: إملاء
  newClasswork.push({
    id: `cw-b2-w1-${cls}-Wednesday-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Wednesday',
    period: arabicPeriods[cls].Wednesday,
    subject: 'Arabic',
    title: 'إملاء (أوراق عمل الوحدة الثالثة)',
    details: 'الوحدة الثالثة: (التسوق) - تقييم إملاء على كلمات وقواعد وظواهر الوحدة الثالثة في كراسة الطالب.',
    pages: 'أوراق عمل الوحدة الثالثة ص 10 + كراسة الطالب',
    completed: false,
    block: 2,
    week: 1,
  });

  // الخميس 15/10/2026: نشاط تطبيقي
  newClasswork.push({
    id: `cw-b2-w1-${cls}-Thursday-arabic`,
    classId: cls,
    class_id: cls,
    day: 'Thursday',
    period: arabicPeriods[cls].Thursday,
    subject: 'Arabic',
    title: 'نشاط تطبيقي',
    details: 'الوحدة الثالثة: (التسوق) - نشاط تطبيقي ومراجعة تطبيقية شاملة على مهارات وقواعد الوحدة في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  });

  // ===================== 2. HOMEWORK =====================
  // الأحد 11/10/2026: كراسة التكليفات المنزلية ص 53
  newHomework.push({
    id: `hw-b2-w1-${cls}-Sunday-arabic`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Monday',
    due_day: 'Monday',
    subject: 'Arabic',
    task: 'كراسة التكليفات المنزلية ص 53',
    details: 'الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 53.',
    pages: 'كراسة التكليفات المنزلية ص 53',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  });

  // الثلاثاء 13/10/2026: كراسة التكليفات المنزلية ص 56
  newHomework.push({
    id: `hw-b2-w1-${cls}-Tuesday-arabic`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Tuesday',
    assigned_day: 'Tuesday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'Arabic',
    task: 'كراسة التكليفات المنزلية ص 56',
    details: 'الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 56.',
    pages: 'كراسة التكليفات المنزلية ص 56',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  });

  // ===================== 3. TOMORROW NOTES =====================
  // الأحد (Sunday lookahead - Preparing on Saturday)
  newTomorrowNotes.push({
    id: `tn-b2-w1-${cls}-Sunday-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Sunday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Sunday,
    title: 'لغة عربية: قراءة درس من السوق إلى المائدة',
    note: 'قراءة درس من السوق إلى المائدة وإحضار أوراق عمل الوحدة الثالثة ص 3-4',
    arabicNote: 'حصة لغة عربية: قراءة درس (من السوق إلى المائدة) - يُرجى إحضار أوراق عمل الوحدة الثالثة ص 3-4 وكشكول العربي.',
    bagItem: 'أوراق عمل الوحدة الثالثة ص 3-4 + كشكول العربي',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  });

  // الاثنين (Monday lookahead - Preparing on Sunday)
  newTomorrowNotes.push({
    id: `tn-b2-w1-${cls}-Monday-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Monday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Monday,
    title: 'لغة عربية: مناقشة لغوية + الألف المقصورة وتسليم واجب ص 53',
    note: 'المناقشة اللغوية وشرح الألف المقصورة + تسليم واجب ص 53',
    arabicNote: 'حصة لغة عربية: المناقشة اللغوية لدرس (من السوق إلى المائدة) والألف المقصورة - إحضار أوراق عمل ص 5-8 وتسليم كراسة التكليفات ص 53.',
    bagItem: 'أوراق عمل الوحدة الثالثة ص 5-8 + كراسة التكليفات ص 53',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  });

  // الثلاثاء (Tuesday lookahead - Preparing on Monday)
  newTomorrowNotes.push({
    id: `tn-b2-w1-${cls}-Tuesday-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Tuesday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Tuesday,
    title: 'لغة عربية: نص استماع (سوق الخضار)',
    note: 'نص استماع (سوق الخضار) وإحضار أوراق عمل الوحدة الثالثة ص 9',
    arabicNote: 'حصة لغة عربية: نص استماع (سوق الخضار) - إحضار أوراق عمل الوحدة الثالثة ص 9 وكشكول العربي.',
    bagItem: 'أوراق عمل الوحدة الثالثة ص 9 + كشكول العربي',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  });

  // الأربعاء (Wednesday lookahead - Preparing on Tuesday)
  newTomorrowNotes.push({
    id: `tn-b2-w1-${cls}-Wednesday-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Wednesday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Wednesday,
    title: '📝 إملاء لغة عربية (أوراق عمل الوحدة الثالثة ص 10)',
    note: 'تقييم إملاء على مهارات الوحدة الثالثة ص 10 + إحضار كراسة الطالب وتسليم واجب ص 56',
    arabicNote: '📝 إملاء في مادة اللغة العربية (أوراق عمل الوحدة الثالثة ص 10): يُرجى التدريب الجيد في المنزل وإحضار كراسة الطالب وتسليم واجب كراسة التكليفات ص 56.',
    bagItem: 'كراسة الطالب + أوراق عمل الوحدة الثالثة ص 10 + كراسة التكليفات ص 56',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
  });

  // الخميس (Thursday lookahead - Preparing on Wednesday)
  newTomorrowNotes.push({
    id: `tn-b2-w1-${cls}-Thursday-arabic`,
    classId: cls,
    class_id: cls,
    targetDay: 'Thursday',
    subject: 'Arabic',
    period: arabicPeriods[cls].Thursday,
    title: 'لغة عربية: نشاط تطبيقي ومراجعة',
    note: 'نشاط تطبيقي ومراجعة شاملة في أوراق العمل',
    arabicNote: 'حصة لغة عربية: نشاط تطبيقي ومراجعة شاملة على مهارات وقواعد الوحدة الثالثة - إحضار أوراق العمل وكشكول العربي.',
    bagItem: 'أوراق العمل + كشكول العربي',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  });
});

console.log(`Generated: ${newClasswork.length} classwork, ${newHomework.length} homework, ${newTomorrowNotes.length} tomorrow notes.`);

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove old Arabic Block 2 Week 1 items if any
    data.classwork = (data.classwork || []).filter(
      (c) => !(c.block === 2 && c.week === 1 && (c.subject === 'Arabic' || c.subject === 'arabic'))
    );
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && (h.subject === 'Arabic' || h.subject === 'arabic'))
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && (t.subject === 'Arabic' || t.subject === 'arabic'))
    );

    // Append new items
    data.classwork.push(...newClasswork);
    data.homework.push(...newHomework);
    data.tomorrowNotes.push(...newTomorrowNotes);

    // Save back
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: Total cw=${data.classwork.length}, hw=${data.homework.length}, tn=${data.tomorrowNotes.length}`);
  }
});

// Update Supabase Database
async function syncToSupabase() {
  const url = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
  const key = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

  try {
    const client = createClient(url, key);

    console.log('Syncing to Supabase...');

    // 1. Clean existing Arabic Block 2 Week 1 items from Supabase
    await client
      .from('classwork')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'Arabic');

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'Arabic');

    // 2. Insert new classwork
    const cwRows = newClasswork.map((c) => ({
      id: c.id,
      class_id: c.class_id,
      day: c.day,
      period: c.period,
      subject: c.subject,
      title: c.title,
      details: c.details,
      pages: c.pages,
      completed: false,
      block: 2,
      week: 1,
    }));
    const { error: cwErr } = await client.from('classwork').insert(cwRows);
    if (cwErr) console.warn('Supabase classwork insert error:', cwErr.message);
    else console.log(`Inserted ${cwRows.length} classwork rows into Supabase.`);

    // 3. Insert new homework
    const hwRows = newHomework.map((h) => ({
      id: h.id,
      class_id: h.class_id,
      assigned_day: h.assigned_day,
      due_day: h.due_day,
      subject: h.subject,
      task: h.task,
      details: h.details,
      pages: h.pages,
      completed: false,
      priority: h.priority,
      block: 2,
      week: 1,
    }));
    const { error: hwErr } = await client.from('homework').insert(hwRows);
    if (hwErr) console.warn('Supabase homework insert error:', hwErr.message);
    else console.log(`Inserted ${hwRows.length} homework rows into Supabase.`);

    // 4. Update tomorrow_special_notes in planner_settings
    const fullData = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf8'));
    const { error: tnErr } = await client.from('planner_settings').upsert({
      key: 'tomorrow_special_notes',
      value: JSON.stringify(fullData.tomorrowNotes),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    if (tnErr) console.warn('Supabase tomorrow_special_notes update error:', tnErr.message);
    else console.log(`Updated tomorrow_special_notes in Supabase planner_settings.`);

    console.log('Supabase sync complete!');
  } catch (err) {
    console.error('Supabase sync failed:', err);
  }
}

syncToSupabase();
