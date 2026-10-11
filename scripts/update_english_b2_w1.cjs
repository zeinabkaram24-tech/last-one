const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Updating English Block 2 Week 1 tasks (Tomorrow single task & Homework Spelling Bee list)...');

const WORDS_STRING = "Apple, Baby, Ball, Banana, Bedroom, Bird, Book, Aunt, Cake, Uncle, Chair, Clean, Carrot, Door, Family, Fish, Food, Friend, Happy, House, Jump, Milk, Mother, School, Shoe, Sister, Small, Sun, Water, Yellow, Animal, Ruler, Sharpener, Autumn, Desk, Pencil, Grandmother, Cousin, Niece, Eraser";

const SPELLING_HOMEWORK_DETAILS = `Prepare for Spelling Bee Round 1 Competition. Memorize and practice spelling and pronunciation of the 40 required words from the interactive list.
Words to study:
${WORDS_STRING}`;

// --- 1. Define Tomorrow Notes for English Block 2 Week 1 ---
// EXACTLY ONE single task per class, 1 day before the Spelling Bee!
const newEnglishTomorrowNotes = [
  // G2A: Competition is on Tuesday -> Reminder is for Tuesday (viewed Monday)
  {
    id: 'tn-b2-w1-english-tue-spellingbee-g2a',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Tuesday',
    subject: 'English',
    period: 7,
    title: '🐝 مسابقة Spelling Bee Competition (Round 1)',
    note: 'Tomorrow is Spelling Bee Competition Round 1! Memorize and practice the 40 competition words.',
    arabicNote: '🚨 تذكير وتنبيه هام غداً الثلاثاء: مسابقة التهجئة Spelling Bee (Round 1) لكلاس 2A! يرجى الاستعداد والتدريب على نطق وكتابة الـ 40 كلمة المرفقة.',
    bagItem: "English Pupil's Book & Activity Book",
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  // G2C: Competition is on Tuesday -> Reminder is for Tuesday (viewed Monday)
  {
    id: 'tn-b2-w1-english-tue-spellingbee-g2c',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Tuesday',
    subject: 'English',
    period: 4,
    title: '🐝 مسابقة Spelling Bee Competition (Round 1)',
    note: 'Tomorrow is Spelling Bee Competition Round 1! Memorize and practice the 40 competition words.',
    arabicNote: '🚨 تذكير وتنبيه هام غداً الثلاثاء: مسابقة التهجئة Spelling Bee (Round 1) لكلاس 2C! يرجى الاستعداد والتدريب على نطق وكتابة الـ 40 كلمة المرفقة.',
    bagItem: "English Pupil's Book & Activity Book",
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  // G2B: Competition is on Wednesday -> Reminder is for Wednesday (viewed Tuesday)
  {
    id: 'tn-b2-w1-english-wed-spellingbee-g2b',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Wednesday',
    subject: 'English',
    period: 1,
    title: '🐝 مسابقة Spelling Bee Competition (Round 1)',
    note: 'Tomorrow is Spelling Bee Competition Round 1! Memorize and practice the 40 competition words.',
    arabicNote: '🚨 تذكير وتنبيه هام غداً الأربعاء: مسابقة التهجئة Spelling Bee (Round 1) لكلاس 2B! يرجى الاستعداد والتدريب على نطق وكتابة الـ 40 كلمة المرفقة.',
    bagItem: "English Pupil's Book & Activity Book",
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
];

// --- 2. Define Homework Items for Spelling Bee ---
// G2B: Saturday, Sunday, Monday, Tuesday (Due Wednesday)
// G2A: Saturday, Sunday, Monday (Due Tuesday)
// G2C: Saturday, Sunday, Monday (Due Tuesday)
const newSpellingHomework = [
  // --- Class B (G2B): Saturday, Sunday, Monday, Tuesday ---
  {
    id: 'hw-b2-w1-G2B-Sat-spellingbee',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Saturday',
    assigned_day: 'Saturday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  {
    id: 'hw-b2-w1-G2B-Sun-spellingbee',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  {
    id: 'hw-b2-w1-G2B-Mon-spellingbee',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  {
    id: 'hw-b2-w1-G2B-Tue-spellingbee',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Tuesday',
    assigned_day: 'Tuesday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },

  // --- Class A (G2A): Saturday, Sunday, Monday ---
  {
    id: 'hw-b2-w1-G2A-Sat-spellingbee',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Saturday',
    assigned_day: 'Saturday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  {
    id: 'hw-b2-w1-G2A-Sun-spellingbee',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  {
    id: 'hw-b2-w1-G2A-Mon-spellingbee',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },

  // --- Class C (G2C): Saturday, Sunday, Monday ---
  {
    id: 'hw-b2-w1-G2C-Sat-spellingbee',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Saturday',
    assigned_day: 'Saturday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  {
    id: 'hw-b2-w1-G2C-Sun-spellingbee',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
  {
    id: 'hw-b2-w1-G2C-Mon-spellingbee',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: '🐝 Spelling Bee Round 1 Word List (حفظ وتدريب ونطق كلمات مسابقة التهجئة)',
    details: SPELLING_HOMEWORK_DETAILS,
    pages: '40 Words List',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html',
  },
];

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // 1. In Tomorrow Notes: filter out ALL English Block 2 Week 1 items
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && t.subject === 'English')
    );
    // Add ONLY the 3 exact Tomorrow Notes (1 for G2A on Tue, 1 for G2C on Tue, 1 for G2B on Wed)
    data.tomorrowNotes.push(...newEnglishTomorrowNotes);

    // 2. In Homework: filter out previous Spelling Bee homework items for Block 2 Week 1
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'English' && (h.id?.includes('spelling') || h.task?.toLowerCase().includes('spelling')))
    );
    // Add the new 10 Spelling Bee homework items (4 for G2B, 3 for G2A, 3 for G2C)
    data.homework.push(...newSpellingHomework);

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
    console.log('Syncing updated English tasks to Supabase...');

    // 1. Remove old spelling homework from Supabase
    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'English')
      .ilike('task', '%spelling%');

    // 2. Insert new spelling homework into Supabase
    const hwRows = newSpellingHomework.map((h) => ({
      id: h.id,
      class_id: h.class_id,
      assigned_day: h.assigned_day,
      due_day: h.due_day,
      subject: h.subject,
      task: h.task,
      details: h.details + (h.pdfUrl ? ` ||PDF_URL:${h.pdfUrl}` : ''),
      pages: h.pages,
      completed: false,
      priority: h.priority,
      block: 2,
      week: 1,
    }));

    const { error: hwErr } = await client.from('homework').upsert(hwRows);
    if (hwErr) console.warn('Supabase homework upsert error:', hwErr.message);
    else console.log(`Upserted ${hwRows.length} Spelling Bee homework rows into Supabase.`);

    // 3. Update tomorrow_special_notes in planner_settings
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
    console.error('Supabase sync failed:', err);
  }
}

syncToSupabase();
