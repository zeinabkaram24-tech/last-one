const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Finalizing Social Studies sheets for both B1 W5 and B2 W1...');

// Ensure physical files exist in public/materials/
const week5PdfSource = 'public/materials/SocialStudies-Grade2-B1-HomeWork-Week5.pdf';
const week5TargetName = 'public/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf';
if (fs.existsSync(week5PdfSource)) {
  fs.copyFileSync(week5PdfSource, week5TargetName);
  console.log(`Copied Week 5 PDF to: "${week5TargetName}"`);
}

// 1. Update data/materials.json
if (fs.existsSync('data/materials.json')) {
  const materials = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));

  // Remove any stale entries for these specific materials
  const filtered = materials.filter(
    (m) =>
      m.id !== 'mat_social_studies_b1_w5_u1_hw5' &&
      m.id !== 'mat_social_studies_b2_w1_hw' &&
      m.id !== 'mat_social_studies_b2_w1_pdf'
  );

  // Add Block 2 Week 1 HTML & PDF
  filtered.unshift({
    id: 'mat_social_studies_b2_w1_hw',
    fileName: 'SocialStudies-Grade2-B2-Week1-HomeWork.html',
    fileSize: 18500,
    storageUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    linkUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    subject: 'Social Studies',
    grade: 'Grade 2',
    term: 'Term 1',
    block: 2,
    week: 1,
    type: 'html',
    uploadedAt: '2026-10-11T06:00:00.000Z',
    description: 'شيت واجب وتدريبات الدراسات الاجتماعية (تفاعلي للموبايل واللابتوب) - Block 2 Week 1',
  });

  filtered.unshift({
    id: 'mat_social_studies_b2_w1_pdf',
    fileName: 'SocialStudies-Grade2-B2-Week1-HomeWork.pdf',
    fileSize: 292131,
    storageUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.pdf',
    linkUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.pdf',
    subject: 'Social Studies',
    grade: 'Grade 2',
    term: 'Term 1',
    block: 2,
    week: 1,
    type: 'pdf',
    uploadedAt: '2026-10-11T06:00:00.000Z',
    description: 'شيت واجب الدراسات الاجتماعية بصيغة PDF قابلة للطباعة - Block 2 Week 1',
  });

  // Add Block 1 Week 5 exact named PDF
  filtered.unshift({
    id: 'mat_social_studies_b1_w5_u1_hw5',
    fileName: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    fileSize: 714575,
    storageUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    linkUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    subject: 'Social Studies',
    grade: 'Grade 2',
    term: 'Term 1',
    block: 1,
    week: 5,
    type: 'pdf',
    uploadedAt: '2026-10-11T06:00:00.000Z',
    description: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
  });

  fs.writeFileSync('data/materials.json', JSON.stringify(filtered, null, 2), 'utf8');
  console.log('Updated data/materials.json with all Social Studies sheets.');
}

// 2. Prepare Homework and Tomorrow Notes for Block 1 Week 5
const b1w5Homework = [
  {
    id: 'hw-b1-w5-G2A-sat-social-hw',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Saturday',
    assigned_day: 'Saturday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'Social Studies',
    task: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    details: 'واجب الدراسات الاجتماعية الأسبوعي: Social Studies Grade 2 B1 Week 5 U1 Homework 5 (شيت قواعد الصف المرفق).',
    pages: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    priority: 'normal',
    completed: false,
    block: 1,
    week: 5,
    pdfUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    pdf_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    linkUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    link_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    isLinkTask: true,
    is_link_task: true,
  },
  {
    id: 'hw-b1-w5-G2C-sat-social-hw',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Saturday',
    assigned_day: 'Saturday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'Social Studies',
    task: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    details: 'واجب الدراسات الاجتماعية الأسبوعي: Social Studies Grade 2 B1 Week 5 U1 Homework 5 (شيت قواعد الصف المرفق).',
    pages: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    priority: 'normal',
    completed: false,
    block: 1,
    week: 5,
    pdfUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    pdf_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    linkUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    link_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    isLinkTask: true,
    is_link_task: true,
  },
  {
    id: 'hw-b1-w5-G2B-sun-social-hw',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Sunday',
    assigned_day: 'Sunday',
    dueDay: 'Monday',
    due_day: 'Monday',
    subject: 'Social Studies',
    task: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    details: 'واجب الدراسات الاجتماعية الأسبوعي: Social Studies Grade 2 B1 Week 5 U1 Homework 5 (شيت قواعد الصف المرفق).',
    pages: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    priority: 'normal',
    completed: false,
    block: 1,
    week: 5,
    pdfUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    pdf_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    linkUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    link_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    isLinkTask: true,
    is_link_task: true,
  },
];

const b1w5TomorrowNotes = [
  {
    id: 'tn-b1-w5-G2A-sat-social-hw-submit',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    title: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    note: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    arabicNote: 'تسليم شيت واجب الدراسات الاجتماعية: Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    bagItem: 'شيت الواجب المرفق (Social Studies Grade 2 B1 Week 5 U1 Homework 5)',
    isQuiz: false,
    categoryType: 'note',
    priority: 'normal',
    pdfUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    pdf_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    block: 1,
    week: 5,
  },
  {
    id: 'tn-b1-w5-G2C-sat-social-hw-submit',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    title: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    note: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    arabicNote: 'تسليم شيت واجب الدراسات الاجتماعية: Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    bagItem: 'شيت الواجب المرفق (Social Studies Grade 2 B1 Week 5 U1 Homework 5)',
    isQuiz: false,
    categoryType: 'note',
    priority: 'normal',
    pdfUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    pdf_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    block: 1,
    week: 5,
  },
  {
    id: 'tn-b1-w5-G2B-sun-social-hw-submit',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'Social Studies',
    title: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    note: 'Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    arabicNote: 'تسليم شيت واجب الدراسات الاجتماعية: Social Studies Grade 2 B1 Week 5 U1 Homework 5',
    bagItem: 'شيت الواجب المرفق (Social Studies Grade 2 B1 Week 5 U1 Homework 5)',
    isQuiz: false,
    categoryType: 'note',
    priority: 'normal',
    pdfUrl: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    pdf_url: '/materials/Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf',
    block: 1,
    week: 5,
  },
];

// 3. Prepare Homework and Tomorrow Notes for Block 2 Week 1
const b2w1Homework = [
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
    pdfUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    pdf_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    linkUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    link_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
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
    pdfUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    pdf_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    linkUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    link_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
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
    pdfUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    pdf_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    linkUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    link_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
  },
];

const b2w1TomorrowNotes = [
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
    pdfUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    pdf_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
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
    pdfUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    pdf_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
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
    pdfUrl: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
    pdf_url: '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html',
  },
];

// Update local files: data/planner_data.json, src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove old Social Studies items for B1W5 and B2W1
    data.homework = (data.homework || []).filter(
      (h) =>
        !(h.block === 1 && h.week === 5 && h.subject === 'Social Studies') &&
        !(h.block === 2 && h.week === 1 && h.subject === 'Social Studies')
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) =>
        !(t.block === 1 && t.week === 5 && t.subject === 'Social Studies') &&
        !(t.block === 2 && t.week === 1 && t.subject === 'Social Studies')
    );

    // Push updated items
    data.homework.push(...b1w5Homework, ...b2w1Homework);
    data.tomorrowNotes.push(...b1w5TomorrowNotes, ...b2w1TomorrowNotes);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: hw count=${data.homework.length}, tn count=${data.tomorrowNotes.length}`);
  }
});

// Update Supabase
async function syncToSupabase() {
  const url = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
  const key = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

  try {
    const client = createClient(url, key);
    console.log('Syncing all updated Social Studies data to Supabase...');

    // Delete existing Social Studies rows for B1W5 and B2W1
    await client
      .from('homework')
      .delete()
      .eq('block', 1)
      .eq('week', 5)
      .eq('subject', 'Social Studies');

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'Social Studies');

    const allHw = [...b1w5Homework, ...b2w1Homework].map((h) => ({
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
      block: h.block,
      week: h.week,
      is_link_task: true,
      link_url: h.pdfUrl,
    }));

    const { error: hwErr } = await client.from('homework').insert(allHw);
    if (hwErr) console.warn('Supabase homework insert error:', hwErr.message);
    else console.log(`Inserted ${allHw.length} Social Studies homework rows into Supabase.`);

    // Sync all tomorrow notes to planner_settings
    const fullData = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf8'));
    const { error: tnErr } = await client.from('planner_settings').upsert(
      {
        key: 'tomorrow_special_notes',
        value: JSON.stringify(fullData.tomorrowNotes),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );
    if (tnErr) console.warn('Supabase tomorrow_special_notes error:', tnErr.message);
    else console.log('Updated tomorrow_special_notes in Supabase.');

    console.log('Supabase sync completed successfully!');
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

syncToSupabase();
