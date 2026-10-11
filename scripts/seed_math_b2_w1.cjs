const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Seeding Math Block 2 Week 1 (Multiplication and Division) and fixing Social Studies PDF links...');

// =========================================================================
// 1. MATH CLASSWORK & HOMEWORK (Block 2 - Week 1: 11/10/2026 - 15/10/2026)
// Unit 5: Multiplication and division
// Timetable periods for Math:
// G2A: Sunday P8, Monday P6, Tuesday P3, Wednesday P2, Thursday P6
// G2B: Sunday P3, Monday P3, Tuesday P1, Wednesday P5, Thursday P6
// G2C: Sunday P3, Monday P8, Tuesday P3, Wednesday P7, Thursday P6
// =========================================================================
const mathClasswork = [
  // --- Sunday 11/10/2026 ---
  // Lesson 1: Multiplication as repeat addition and commutative property (Page 91 homework)
  {
    id: 'cw-b2-w1-G2A-Sunday-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 1 (Multiplication as repeated addition and commutative property)',
    details: 'Unit 5: Multiplication and division. Lesson 1: Multiplication as repeat addition and commutative property. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Sunday-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 1 (Multiplication as repeated addition and commutative property)',
    details: 'Unit 5: Multiplication and division. Lesson 1: Multiplication as repeat addition and commutative property. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Sunday-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 1 (Multiplication as repeated addition and commutative property)',
    details: 'Unit 5: Multiplication and division. Lesson 1: Multiplication as repeat addition and commutative property. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Monday 12/10/2026 ---
  // Lesson 3: 2, 5 and 10 times table (Page 92 homework)
  {
    id: 'cw-b2-w1-G2A-Monday-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: 6,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 3 (2, 5 and 10 times table)',
    details: 'Unit 5: Multiplication and division. Lesson 3: 2, 5 and 10 times table. Resources: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Monday-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 3 (2, 5 and 10 times table)',
    details: 'Unit 5: Multiplication and division. Lesson 3: 2, 5 and 10 times table. Resources: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Monday-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 8,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 3 (2, 5 and 10 times table)',
    details: 'Unit 5: Multiplication and division. Lesson 3: 2, 5 and 10 times table. Resources: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Tuesday 13/10/2026 ---
  // Lesson 2: Relation between multiplication and division (Page 93 homework)
  {
    id: 'cw-b2-w1-G2A-Tuesday-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 2 (Relation between multiplication and division)',
    details: 'Unit 5: Multiplication and division. Lesson 2: Relation between multiplication and division. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Tuesday-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: 1,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 2 (Relation between multiplication and division)',
    details: 'Unit 5: Multiplication and division. Lesson 2: Relation between multiplication and division. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Tuesday-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 3,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 2 (Relation between multiplication and division)',
    details: 'Unit 5: Multiplication and division. Lesson 2: Relation between multiplication and division. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Wednesday 14/10/2026 ---
  // Lesson 4: Halving and doubling (Page 94 homework)
  {
    id: 'cw-b2-w1-G2A-Wednesday-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 2,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 4 (Halving and doubling)',
    details: 'Unit 5: Multiplication and division. Lesson 4: Halving and doubling. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Wednesday-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 5,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 4 (Halving and doubling)',
    details: 'Unit 5: Multiplication and division. Lesson 4: Halving and doubling. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Wednesday-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 7,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Lesson 4 (Halving and doubling)',
    details: 'Unit 5: Multiplication and division. Lesson 4: Halving and doubling. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Thursday 15/10/2026 ---
  // Test your self (Page 95 homework)
  {
    id: 'cw-b2-w1-G2A-Thursday-math',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 6,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Test your self (Math Test)',
    details: 'Unit 5: Multiplication and division. Test your self and unit review assessment. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Thursday-math',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 6,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Test your self (Math Test)',
    details: 'Unit 5: Multiplication and division. Test your self and unit review assessment. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Thursday-math',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 6,
    subject: 'Mathematics',
    title: 'Unit 5: Multiplication & Division — Test your self (Math Test)',
    details: 'Unit 5: Multiplication and division. Test your self and unit review assessment. Resources: Maths-Grade2-B2-All-Sheet2 - Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 - Main',
    completed: false,
    block: 2,
    week: 1,
  },
];

// Math Homework items corresponding to the weekly plan
const mathHomework = [
  // Sunday -> Page 91 (Due Monday)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b2-w1-${cls}-Sunday-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Monday',
    due_day: 'Monday',
    subject: 'Mathematics',
    task: 'Math Homework — Page 91 (Multiplication as repeated addition and commutative property)',
    details: 'Unit 5: Multiplication and division. Solve exercises on Page 91 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).',
    pages: 'Page 91',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  })),
  // Monday -> Page 92 (Due Tuesday)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b2-w1-${cls}-Monday-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'Mathematics',
    task: 'Math Homework — Page 92 (2, 5 and 10 times table)',
    details: 'Unit 5: Multiplication and division. Solve exercises on Page 92 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).',
    pages: 'Page 92',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  })),
  // Tuesday -> Page 93 (Due Wednesday)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b2-w1-${cls}-Tuesday-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Tuesday',
    assigned_day: 'Tuesday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'Mathematics',
    task: 'Math Homework — Page 93 (Relation between multiplication and division)',
    details: 'Unit 5: Multiplication and division. Solve exercises on Page 93 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).',
    pages: 'Page 93',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  })),
  // Wednesday -> Page 94 (Due Thursday) + Alert to prepare for Thursday's test!
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b2-w1-${cls}-Wednesday-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Mathematics',
    task: 'Math Homework — Page 94 (Halving and doubling) + الاستعداد لاختبار الغد (Test your self)',
    details: 'Unit 5: Multiplication and division. Solve exercises on Page 94 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main)، ومراجعة دروس الوحدة الخامسة جيداً لأن غداً الخميس موعد اختبار Test your self.',
    pages: 'Page 94',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
  })),
  // Thursday -> Page 95 (Due Sunday next week)
  ...['G2A', 'G2B', 'G2C'].map((cls) => ({
    id: `hw-b2-w1-${cls}-Thursday-math`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Thursday',
    assigned_day: 'Thursday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'Mathematics',
    task: 'Math Homework — Page 95 (Test your self)',
    details: 'Unit 5: Multiplication and division. Solve exercises on Page 95 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).',
    pages: 'Page 95',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  })),
];

// =========================================================================
// 2. MATH TOMORROW NOTES (Test on Thursday 15/10/2026 -> Target Day Thursday, viewed Wednesday night)
// Exactly ONE task per class for Math test on Thursday
// =========================================================================
const mathTomorrowNotes = ['G2A', 'G2B', 'G2C'].map((cls) => ({
  id: `tn-b2-w1-math-test-${cls}-Thursday`,
  classId: cls,
  class_id: cls,
  targetDay: 'Thursday',
  subject: 'Mathematics',
  period: 6,
  title: '📐 اختبار مادة الرياضيات (Math Test / Test your self)',
  note: 'Tomorrow Thursday is Math Test on Unit 5 (Multiplication and division). Please review lessons 1 to 4 and times tables (2, 5, 10).',
  arabicNote: '🚨 تنبيه هام جداً غداً الخميس: اختبار مادة الرياضيات (Math Test / Test your self) على الوحدة الخامسة (Unit 5: Multiplication and division)! يُرجى مراجعة الدروس من 1 إلى 4 وحفظ جدول الضرب (2, 5, 10) ومفاهيم التنصيف والمضاعفة (Halving and doubling).',
  bagItem: "Math Learner's Book & Sheet 2 (كتاب وشيت الماث)",
  isQuiz: true,
  categoryType: 'quiz',
  block: 2,
  week: 1,
}));

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // 1. Remove old Math Block 2 Week 1 entries
    data.classwork = (data.classwork || []).filter(
      (c) => !(c.block === 2 && c.week === 1 && (c.subject === 'Mathematics' || c.subject === 'Math'))
    );
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && (h.subject === 'Mathematics' || h.subject === 'Math'))
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && (t.subject === 'Mathematics' || t.subject === 'Math'))
    );

    // 2. Also ensure Social Studies sheet homework has correct PDF URL
    data.homework.forEach((h) => {
      if (h.subject === 'Social Studies' && h.id?.includes('sheet')) {
        h.pdfUrl = '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.pdf';
      }
    });

    // 3. Add Math classwork, homework, and tomorrow test notes
    data.classwork.push(...mathClasswork);
    data.homework.push(...mathHomework);
    data.tomorrowNotes.push(...mathTomorrowNotes);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: Total cw=${data.classwork.length}, hw=${data.homework.length}, tn=${data.tomorrowNotes.length}`);
  }
});

// Update Supabase
async function syncToSupabase() {
  const url = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
  const key = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

  try {
    const client = createClient(url, key);
    console.log('Syncing Math B2W1 to Supabase...');

    // 1. Clean existing Math B2W1
    await client
      .from('classwork')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .in('subject', ['Mathematics', 'Math']);

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .in('subject', ['Mathematics', 'Math']);

    // 2. Insert Math Classwork (15 rows)
    const cwRows = mathClasswork.map((c) => ({
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
    if (cwErr) console.warn('Supabase math classwork error:', cwErr.message);
    else console.log(`Inserted ${cwRows.length} Math classwork rows into Supabase.`);

    // 3. Insert Math Homework (15 rows)
    const hwRows = mathHomework.map((h) => ({
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
    if (hwErr) console.warn('Supabase math homework error:', hwErr.message);
    else console.log(`Inserted ${hwRows.length} Math homework rows into Supabase.`);

    // 4. Update tomorrow_special_notes in Supabase
    const fullData = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf8'));
    const { error: tnErr } = await client.from('planner_settings').upsert({
      key: 'tomorrow_special_notes',
      value: JSON.stringify(fullData.tomorrowNotes),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    if (tnErr) console.warn('Supabase tomorrow_special_notes error:', tnErr.message);
    else console.log('Updated tomorrow_special_notes in Supabase.');

    console.log('Supabase sync complete!');
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

syncToSupabase();
