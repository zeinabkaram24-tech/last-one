const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Seeding Social Studies Homework and Tomorrow reminders before first session of each class...');

const WORKSHEET_FILE = '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html';

// 1. Social Studies Homework before the first class of each section
// G2A: First class is Sunday -> Assigned on Saturday, due Sunday
// G2C: First class is Sunday -> Assigned on Saturday, due Sunday
// G2B: First class is Monday -> Assigned on Sunday, due Monday
const newSocialHomework = [
  {
    id: 'hw-b2-w1-G2A-Sat-social-sheet',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Saturday',
    assigned_day: 'Saturday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'Social Studies',
    task: 'واجب الدراسات الاجتماعية (شيت السلوكيات الإيجابية وقواعد الفصل)',
    details: 'حل شيت واجب الدراسات الاجتماعية المرفق (سلوكيات الفصل وتنظيم الوقت) وتجهيزه للتسليم في الحصة الأولى.',
    pages: 'شيت الواجب المرفق (صفحتين)',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: WORKSHEET_FILE,
  },
  {
    id: 'hw-b2-w1-G2C-Sat-social-sheet',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Saturday',
    assigned_day: 'Saturday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'Social Studies',
    task: 'واجب الدراسات الاجتماعية (شيت السلوكيات الإيجابية وقواعد الفصل)',
    details: 'حل شيت واجب الدراسات الاجتماعية المرفق (سلوكيات الفصل وتنظيم الوقت) وتجهيزه للتسليم في الحصة الأولى.',
    pages: 'شيت الواجب المرفق (صفحتين)',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: WORKSHEET_FILE,
  },
  {
    id: 'hw-b2-w1-G2B-Sun-social-sheet',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Monday',
    due_day: 'Monday',
    subject: 'Social Studies',
    task: 'واجب الدراسات الاجتماعية (شيت السلوكيات الإيجابية وقواعد الفصل)',
    details: 'حل شيت واجب الدراسات الاجتماعية المرفق (سلوكيات الفصل وتنظيم الوقت) وتجهيزه للتسليم في الحصة الأولى.',
    pages: 'شيت الواجب المرفق (صفحتين)',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: WORKSHEET_FILE,
  },
];

// 2. Social Studies Tomorrow Notes before the first class of each section
// G2A: First class is Sunday -> Target day is Sunday (viewed Saturday night)
// G2C: First class is Sunday -> Target day is Sunday (viewed Saturday night)
// G2B: First class is Monday -> Target day is Monday (viewed Sunday night)
const newSocialTomorrowNotes = [
  {
    id: 'tn-b2-w1-social-sheet-G2A-Sunday',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 2,
    title: '🌍 واجب وتجهيز الدراسات الاجتماعية (Home Work)',
    note: 'Social Studies Homework sheet. Solve and bring for submission in the first class.',
    arabicNote: 'تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق (السلوكيات وقواعد الفصل وتنظيم الوقت) وإحضاره جاهزاً للتسليم في أول حصة غداً الأحد.',
    bagItem: 'شيت واجب الدراسات الاجتماعية المرفق',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: WORKSHEET_FILE,
  },
  {
    id: 'tn-b2-w1-social-sheet-G2C-Sunday',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 7,
    title: '🌍 واجب وتجهيز الدراسات الاجتماعية (Home Work)',
    note: 'Social Studies Homework sheet. Solve and bring for submission in the first class.',
    arabicNote: 'تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق (السلوكيات وقواعد الفصل وتنظيم الوقت) وإحضاره جاهزاً للتسليم في أول حصة غداً الأحد.',
    bagItem: 'شيت واجب الدراسات الاجتماعية المرفق',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: WORKSHEET_FILE,
  },
  {
    id: 'tn-b2-w1-social-sheet-G2B-Monday',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'Social Studies',
    period: 1,
    title: '🌍 واجب وتجهيز الدراسات الاجتماعية (Home Work)',
    note: 'Social Studies Homework sheet. Solve and bring for submission in the first class.',
    arabicNote: 'تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق (السلوكيات وقواعد الفصل وتنظيم الوقت) وإحضاره جاهزاً للتسليم في أول حصة غداً الإثنين.',
    bagItem: 'شيت واجب الدراسات الاجتماعية المرفق',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: WORKSHEET_FILE,
  },
];

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove old social sheet homework if any
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'Social Studies' && h.id?.includes('sheet'))
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && t.subject === 'Social Studies')
    );

    data.homework.push(...newSocialHomework);
    data.tomorrowNotes.push(...newSocialTomorrowNotes);

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
    console.log('Syncing Social Studies Homework & Tomorrow to Supabase...');

    // Upsert homework
    const hwRows = newSocialHomework.map((h) => ({
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
    if (hwErr) console.warn('Supabase social homework error:', hwErr.message);
    else console.log(`Upserted ${hwRows.length} Social Studies homework rows into Supabase.`);

    // Update tomorrow_special_notes
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
