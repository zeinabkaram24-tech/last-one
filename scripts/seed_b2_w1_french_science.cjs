const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Seeding Block 2 Week 1 French and Science data...');

// =========================================================================
// 1. FRENCH CLASSWORK (NO Homework, NO Tomorrow Notes per strict user rule)
// =========================================================================
const frenchClasswork = [
  // --- Class A (G2A): Tuesday P1, Wednesday P4, Thursday P3 ---
  {
    id: 'cw-b2-w1-G2A-Tuesday-french-c1',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 1,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Passe-passe Leçon 1 & 2)',
    details: 'Unité 4: La petite sœur de Lilly. Passe – passe Leçon 1 & 2. Activités en classe.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2A-Wednesday-french-c2',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Il est comment ?)',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: Il est comment ? Activités et pratique en classe.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2A-Thursday-french-c3',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 3,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Il est comment ? - Suite)',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: Il est comment ? Suite et exercices d’application.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Class B (G2B): Sunday P5, Monday P7, Thursday P5 ---
  {
    id: 'cw-b2-w1-G2B-Sunday-french-c1',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Passe-passe Leçon 1 & 2)',
    details: 'Unité 4: La petite sœur de Lilly. Passe – passe Leçon 1 & 2. Activités en classe.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Monday-french-c2',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 7,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Il est comment ?)',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: Il est comment ? Activités et pratique en classe.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-Thursday-french-c3',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Il est comment ? - Suite)',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: Il est comment ? Suite et exercices d’application.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Class C (G2C): Sunday P8, Tuesday P6, Wednesday P2 ---
  {
    id: 'cw-b2-w1-G2C-Sunday-french-c1',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 8,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Passe-passe Leçon 1 & 2)',
    details: 'Unité 4: La petite sœur de Lilly. Passe – passe Leçon 1 & 2. Activités en classe.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Tuesday-french-c2',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 6,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Il est comment ?)',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: Il est comment ? Activités et pratique en classe.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-Wednesday-french-c3',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 2,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly (Il est comment ? - Suite)',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: Il est comment ? Suite et exercices d’application.',
    pages: 'Livre passe-passe',
    completed: false,
    block: 2,
    week: 1,
  },
];

// =========================================================================
// 2. SCIENCE CLASSWORK & HOMEWORK & TOMORROW NOTES (Unit 3: Rocks in our soil)
// =========================================================================
const scienceClasswork = [
  // --- Sunday ---
  // G2B: Period 2 -> The soil and it's properties (Page 18)
  {
    id: 'cw-b2-w1-G2B-Sunday-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 2,
    subject: 'Science',
    title: "Unit 3: Rocks in our soil (The soil and it's properties)",
    details: "Unit (3): Rocks in our soil. Topic: The soil and it's properties. Classwork exercises on page 18.",
    pages: 'Page : 18',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2C: Period 5 -> The soil and it's properties (Page 18)
  {
    id: 'cw-b2-w1-G2C-Sunday-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 5,
    subject: 'Science',
    title: "Unit 3: Rocks in our soil (The soil and it's properties)",
    details: "Unit (3): Rocks in our soil. Topic: The soil and it's properties. Classwork exercises on page 18.",
    pages: 'Page : 18',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Monday ---
  // G2A: Period 7 -> The soil and it's properties (Page 18)
  {
    id: 'cw-b2-w1-G2A-Monday-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: 7,
    subject: 'Science',
    title: "Unit 3: Rocks in our soil (The soil and it's properties)",
    details: "Unit (3): Rocks in our soil. Topic: The soil and it's properties. Classwork exercises on page 18 (2A).",
    pages: 'Page : 18 ( 2A)',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2C: Period 3 -> The types of soil
  {
    id: 'cw-b2-w1-G2C-Monday-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 3,
    subject: 'Science',
    title: 'Unit 3: Rocks in our soil (The types of soil)',
    details: 'Unit (3): Rocks in our soil. Topic: The types of soil. Exploring sandy soil, clay soil, and loam using foam clay.',
    pages: 'Student Booklet / Classwork',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Tuesday ---
  // G2A: Period 5 -> The types of soil
  {
    id: 'cw-b2-w1-G2A-Tuesday-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 5,
    subject: 'Science',
    title: 'Unit 3: Rocks in our soil (The types of soil)',
    details: 'Unit (3): Rocks in our soil. Topic: The types of soil. Exploring sandy soil, clay soil, and loam using foam clay.',
    pages: 'Student Booklet / Classwork',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Wednesday ---
  // G2B: Period 7 -> The types of soil
  {
    id: 'cw-b2-w1-G2B-Wednesday-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 7,
    subject: 'Science',
    title: 'Unit 3: Rocks in our soil (The types of soil)',
    details: 'Unit (3): Rocks in our soil. Topic: The types of soil. Exploring sandy soil, clay soil, and loam using foam clay.',
    pages: 'Student Booklet / Classwork',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Thursday ---
  // G2A: Period 8 -> Soil sifting (Page 20)
  {
    id: 'cw-b2-w1-G2A-Thursday-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 8,
    subject: 'Science',
    title: 'Unit 3: Rocks in our soil (Soil sifting)',
    details: 'Unit (3): Rocks in our soil. Topic: Soil sifting and separating soil particles. Exercises on page 20.',
    pages: 'Page: 20',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2B: Period 7 -> Soil sifting (Page 20)
  {
    id: 'cw-b2-w1-G2B-Thursday-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 7,
    subject: 'Science',
    title: 'Unit 3: Rocks in our soil (Soil sifting)',
    details: 'Unit (3): Rocks in our soil. Topic: Soil sifting and separating soil particles. Exercises on page 20.',
    pages: 'Page: 20',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2C: Period 1 -> Soil sifting (Page 20)
  {
    id: 'cw-b2-w1-G2C-Thursday-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 1,
    subject: 'Science',
    title: 'Unit 3: Rocks in our soil (Soil sifting)',
    details: 'Unit (3): Rocks in our soil. Topic: Soil sifting and separating soil particles. Exercises on page 20.',
    pages: 'Page: 20',
    completed: false,
    block: 2,
    week: 1,
  },
];

const scienceHomework = [
  // Class C on Monday: Page 19 (Due Thursday)
  {
    id: 'hw-b2-w1-G2C-Monday-science',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework - Page : 19',
    details: 'Unit (3): Rocks in our soil. Solve exercises on Page 19 in Science Booklet.',
    pages: 'Page : 19',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  // Class A on Tuesday: Page 19 (Due Thursday)
  {
    id: 'hw-b2-w1-G2A-Tuesday-science',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Tuesday',
    assigned_day: 'Tuesday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework - Page : 19',
    details: 'Unit (3): Rocks in our soil. Solve exercises on Page 19 in Science Booklet.',
    pages: 'Page : 19',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  // Class B on Wednesday: Page 21 (Due Thursday)
  {
    id: 'hw-b2-w1-G2B-Wednesday-science',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework - Page : 21',
    details: 'Unit (3): Rocks in our soil. Solve exercises on Page 21 in Science Booklet.',
    pages: 'Page : 21',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
];

// User requirement for Science Tomorrow Notes:
// "قبل كل حصة ساينس في كل فصل، ان هي هتبقى محتاجة الطلبات ديت تنزلها في التومورو"
// Specifically the required materials on the day studying "The types of soil":
// - Foam clay (different colors)
// - A4 colored sheet
// - Glue
// - Ruler
const scienceTomorrowNotes = [
  // --- Class C: Studies "The types of soil" on Monday (Prepped on Sunday night) ---
  {
    id: 'tn-b2-w1-science-materials-G2C-Monday',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Monday',
    subject: 'Science',
    period: 3,
    title: '🔬 أدوات حصة الساينس لدرس (The types of soil)',
    note: 'Materials required for (The types of soil) lesson: Foam clay (different colors), A4 colored sheet, Glue, Ruler.',
    arabicNote: 'تنبيه هام لحصة الساينس غداً الإثنين لدرس (The types of soil): يُرجى إحضار صلصال فوم بألوان مختلفة (Foam clay) + ورقة A4 ملونة (A4 colored sheet) + صمغ (Glue) + مسطرة (Ruler).',
    bagItem: 'Foam clay (different colors), A4 colored sheet, Glue, Ruler',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
  // Class C on Saturday night for Sunday: Book Page 18
  {
    id: 'tn-b2-w1-science-book-G2C-Sunday',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'Science',
    period: 5,
    title: '🔬 لدرس الساينس (The soil and its properties)',
    note: "Science lesson on The soil and it's properties. Bring Science Learner's Book & Booklet.",
    arabicNote: 'حصة ساينس غداً الأحد لدرس (The soil and its properties) ص 18: إحضار بوكليت وكتاب الساينس.',
    bagItem: "Science Booklet & Learner's Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },

  // --- Class A: Studies "The types of soil" on Tuesday (Prepped on Monday night) ---
  {
    id: 'tn-b2-w1-science-materials-G2A-Tuesday',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Tuesday',
    subject: 'Science',
    period: 5,
    title: '🔬 أدوات حصة الساينس لدرس (The types of soil)',
    note: 'Materials required for (The types of soil) lesson: Foam clay (different colors), A4 colored sheet, Glue, Ruler.',
    arabicNote: 'تنبيه هام لحصة الساينس غداً الثلاثاء لدرس (The types of soil): يُرجى إحضار صلصال فوم بألوان مختلفة (Foam clay) + ورقة A4 ملونة (A4 colored sheet) + صمغ (Glue) + مسطرة (Ruler).',
    bagItem: 'Foam clay (different colors), A4 colored sheet, Glue, Ruler',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
  // Class A on Sunday night for Monday: Book Page 18
  {
    id: 'tn-b2-w1-science-book-G2A-Monday',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Monday',
    subject: 'Science',
    period: 7,
    title: '🔬 لدرس الساينس (The soil and its properties)',
    note: "Science lesson on The soil and it's properties. Bring Science Learner's Book & Booklet.",
    arabicNote: 'حصة ساينس غداً الإثنين لدرس (The soil and its properties) ص 18: إحضار بوكليت وكتاب الساينس.',
    bagItem: "Science Booklet & Learner's Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },

  // --- Class B: Studies "The types of soil" on Wednesday (Prepped on Tuesday night) ---
  {
    id: 'tn-b2-w1-science-materials-G2B-Wednesday',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Wednesday',
    subject: 'Science',
    period: 7,
    title: '🔬 أدوات حصة الساينس لدرس (The types of soil)',
    note: 'Materials required for (The types of soil) lesson: Foam clay (different colors), A4 colored sheet, Glue, Ruler.',
    arabicNote: 'تنبيه هام لحصة الساينس غداً الأربعاء لدرس (The types of soil): يُرجى إحضار صلصال فوم بألوان مختلفة (Foam clay) + ورقة A4 ملونة (A4 colored sheet) + صمغ (Glue) + مسطرة (Ruler).',
    bagItem: 'Foam clay (different colors), A4 colored sheet, Glue, Ruler',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
  // Class B on Saturday night for Sunday: Book Page 18
  {
    id: 'tn-b2-w1-science-book-G2B-Sunday',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Sunday',
    subject: 'Science',
    period: 2,
    title: '🔬 لدرس الساينس (The soil and its properties)',
    note: "Science lesson on The soil and it's properties. Bring Science Learner's Book & Booklet.",
    arabicNote: 'حصة ساينس غداً الأحد لدرس (The soil and its properties) ص 18: إحضار بوكليت وكتاب الساينس.',
    bagItem: "Science Booklet & Learner's Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },

  // --- Thursday for all classes: Soil Sifting Page 20 ---
  {
    id: 'tn-b2-w1-science-sifting-G2A-Thursday',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Thursday',
    subject: 'Science',
    period: 8,
    title: '🔬 لحصة الساينس (Soil sifting)',
    note: 'Soil sifting lesson (Page 20). Bring Science Booklet.',
    arabicNote: 'حصة الساينس غداً الخميس لدرس (Soil sifting) ص 20: إحضار بوكليت الساينس.',
    bagItem: 'Science Booklet',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-science-sifting-G2B-Thursday',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Thursday',
    subject: 'Science',
    period: 7,
    title: '🔬 لحصة الساينس (Soil sifting)',
    note: 'Soil sifting lesson (Page 20). Bring Science Booklet.',
    arabicNote: 'حصة الساينس غداً الخميس لدرس (Soil sifting) ص 20: إحضار بوكليت الساينس.',
    bagItem: 'Science Booklet',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-science-sifting-G2C-Thursday',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Thursday',
    subject: 'Science',
    period: 1,
    title: '🔬 لحصة الساينس (Soil sifting)',
    note: 'Soil sifting lesson (Page 20). Bring Science Booklet.',
    arabicNote: 'حصة الساينس غداً الخميس لدرس (Soil sifting) ص 20: إحضار بوكليت الساينس.',
    bagItem: 'Science Booklet',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
];

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // 1. Remove old B2W1 French and Science entries
    data.classwork = (data.classwork || []).filter(
      (c) => !(c.block === 2 && c.week === 1 && (c.subject === 'French' || c.subject === 'Science'))
    );
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && (h.subject === 'French' || h.subject === 'Science'))
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && (t.subject === 'French' || t.subject === 'Science'))
    );

    // 2. Append new French Classwork (ZERO homework/tomorrow for French)
    data.classwork.push(...frenchClasswork);

    // 3. Append new Science Classwork, Homework, and Tomorrow Notes
    data.classwork.push(...scienceClasswork);
    data.homework.push(...scienceHomework);
    data.tomorrowNotes.push(...scienceTomorrowNotes);

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
    console.log('Syncing French & Science B2W1 to Supabase...');

    // 1. Clean existing B2W1 French & Science from Supabase
    await client
      .from('classwork')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .in('subject', ['French', 'Science']);

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .in('subject', ['French', 'Science']);

    // 2. Insert Classwork (9 French + 9 Science = 18 rows)
    const allCwRows = [...frenchClasswork, ...scienceClasswork].map((c) => ({
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
    const { error: cwErr } = await client.from('classwork').insert(allCwRows);
    if (cwErr) console.warn('Supabase classwork insert error:', cwErr.message);
    else console.log(`Inserted ${allCwRows.length} classwork rows into Supabase.`);

    // 3. Insert Homework (3 Science rows)
    const allHwRows = scienceHomework.map((h) => ({
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
    const { error: hwErr } = await client.from('homework').insert(allHwRows);
    if (hwErr) console.warn('Supabase homework insert error:', hwErr.message);
    else console.log(`Inserted ${allHwRows.length} homework rows into Supabase.`);

    // 4. Update tomorrow_special_notes in Supabase planner_settings
    const fullData = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf8'));
    const { error: tnErr } = await client.from('planner_settings').upsert({
      key: 'tomorrow_special_notes',
      value: JSON.stringify(fullData.tomorrowNotes),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    if (tnErr) console.warn('Supabase tomorrow_special_notes update error:', tnErr.message);
    else console.log('Updated tomorrow_special_notes in Supabase.');

    console.log('Supabase sync complete!');
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

syncToSupabase();
