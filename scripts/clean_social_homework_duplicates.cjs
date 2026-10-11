const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Cleaning duplicate Social Studies homework and applying exact assigned days...');

const WORKSHEET_FILE = '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.pdf';

// Strict user instruction:
// - Class B: Social Studies homework assigned on Sunday (due Monday before first class)
// - Class A and Class C: Social Studies homework assigned on Saturday (due Sunday before first class)
// - Remove any duplicate LMS homework items for Social Studies in Block 2 Week 1.

const cleanSocialHomework = [
  // Class A: Saturday -> Due Sunday
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
  // Class C: Saturday -> Due Sunday
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
  // Class B: Sunday -> Due Monday
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

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove ALL Social Studies homework for B2W1
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'Social Studies')
    );

    // Add only the clean non-duplicate homework items
    data.homework.push(...cleanSocialHomework);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: Total hw=${data.homework.length}`);
  }
});

// Update Supabase
async function syncToSupabase() {
  const url = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
  const key = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

  try {
    const client = createClient(url, key);
    console.log('Syncing clean Social Studies homework to Supabase...');

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'Social Studies');

    const hwRows = cleanSocialHomework.map((h) => ({
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
    else console.log(`Inserted ${hwRows.length} clean Social Studies homework rows into Supabase.`);

    console.log('Supabase sync complete!');
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

syncToSupabase();
