const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Applying exact Social Studies schedule: Class 2A & 2C on Saturday, Class 2B on Monday...');

const WORKSHEET_HTML = '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html';

// 1. Social Studies Homework:
// - Class 2A: Saturday -> Due Sunday
// - Class 2C: Saturday -> Due Sunday
// - Class 2B: Monday -> Due Tuesday
const socialHomework = [
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
    pdfUrl: WORKSHEET_HTML,
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
    pdfUrl: WORKSHEET_HTML,
  },
  {
    id: 'hw-b2-w1-G2B-Mon-social-sheet',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'Social Studies',
    task: 'واجب الدراسات الاجتماعية (شيت السلوكيات الإيجابية وقواعد الفصل)',
    details: 'حل شيت واجب الدراسات الاجتماعية المرفق (سلوكيات الفصل وتنظيم الوقت) وتجهيزه للتسليم في الحصة الأولى.',
    pages: 'شيت الواجب المرفق (صفحتين)',
    completed: false,
    priority: 'urgent',
    block: 2,
    week: 1,
    pdfUrl: WORKSHEET_HTML,
  },
];

// 2. Social Studies Tomorrow Notes:
// - Class 2A: Target Sunday (appears on Saturday)
// - Class 2C: Target Sunday (appears on Saturday)
// - Class 2B: Target Monday (appears on Monday & Sunday)
const socialTomorrowNotes = [
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
    pdfUrl: WORKSHEET_HTML,
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
    pdfUrl: WORKSHEET_HTML,
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
    pdfUrl: WORKSHEET_HTML,
  },
];

// Update local files: data/planner_data.json, src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove old Social Studies items for B2W1
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'Social Studies')
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && t.subject === 'Social Studies')
    );

    data.homework.push(...socialHomework);
    data.tomorrowNotes.push(...socialTomorrowNotes);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: hw count=${data.homework.length}, tn count=${data.tomorrowNotes.length}`);
  }
});

// Update data/materials.json with worksheet entry
if (fs.existsSync('data/materials.json')) {
  const materials = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
  const filtered = materials.filter((m) => m.id !== 'mat_social_studies_b2_w1_hw');
  filtered.unshift({
    id: 'mat_social_studies_b2_w1_hw',
    fileName: 'SocialStudies-Grade2-B2-Week1-HomeWork.html',
    fileSize: 16500,
    storageUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    linkUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    subject: 'Social Studies',
    grade: 'Grade 2',
    term: 'Term 1',
    block: 2,
    week: 1,
    type: 'html',
    uploadedAt: '2026-10-11T06:00:00.000Z',
    description: 'شيت واجب الدراسات الاجتماعية (السلوكيات وقواعد الفصل وتنظيم الوقت) - Block 2 Week 1',
  });
  fs.writeFileSync('data/materials.json', JSON.stringify(filtered, null, 2), 'utf8');
  console.log('Updated data/materials.json with Social Studies B2W1 worksheet.');
}

// Update Supabase
async function syncToSupabase() {
  const url = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
  const key = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

  try {
    const client = createClient(url, key);
    console.log('Syncing updated Social Studies schedule to Supabase...');

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'Social Studies');

    const hwRows = socialHomework.map((h) => ({
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

    const { error: hwErr } = await client.from('homework').insert(hwRows);
    if (hwErr) console.warn('Supabase homework error:', hwErr.message);
    else console.log(`Inserted ${hwRows.length} Social Studies homework rows into Supabase.`);

    // Sync tomorrow notes to planner_settings
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
