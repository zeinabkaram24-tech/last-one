const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('--- Updating Social Studies Homework & Tomorrow Notes to Exact School Formatting & Name ---');

const EXACT_SHEET_NAME = 'Social Studies Grade 2 B1 Week 5 U1 Homework 5';
const EXACT_PDF_FILENAME = 'Social Studies Grade 2 B1 Week 5 U1 Homework 5.pdf';
const EXACT_PDF_URL = `/materials/${EXACT_PDF_FILENAME}`;
const EXACT_FILE_SIZE = 714575;

// 1. Ensure physical files exist and match exactly
const sourceWeek5Pdf = 'public/materials/SocialStudies-Grade2-B1-HomeWork-Week5.pdf';
const targetWeek5Pdf = `public/materials/${EXACT_PDF_FILENAME}`;
const targetB2W1Pdf = 'public/materials/SocialStudies-Grade2-B2-Week1-HomeWork.pdf';

if (fs.existsSync(sourceWeek5Pdf)) {
  fs.copyFileSync(sourceWeek5Pdf, targetWeek5Pdf);
  fs.copyFileSync(sourceWeek5Pdf, targetB2W1Pdf);
  console.log(`Copied original school PDF to: "${targetWeek5Pdf}" and "${targetB2W1Pdf}"`);
}

// 2. Update data/materials.json
if (fs.existsSync('data/materials.json')) {
  let materials = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
  
  // Remove any conflicting Social Studies materials for B1W5 and B2W1
  materials = materials.filter(m => 
    m.id !== 'mat_social_studies_b1_w5_u1_hw5' &&
    m.id !== 'mat_social_studies_b2_w1_pdf' &&
    m.id !== 'mat_social_studies_b2_w1_hw'
  );

  // Add the official single material
  materials.unshift({
    id: 'mat_social_studies_b1_w5_u1_hw5',
    fileName: EXACT_PDF_FILENAME,
    fileSize: EXACT_FILE_SIZE,
    storageUrl: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    subject: 'Social Studies',
    grade: 'Grade 2',
    term: 'Term 1',
    block: 2,
    week: 1,
    type: 'pdf',
    uploadedAt: '2026-10-11T06:00:00.000Z',
    description: EXACT_SHEET_NAME
  });

  fs.writeFileSync('data/materials.json', JSON.stringify(materials, null, 2), 'utf8');
  console.log('Updated data/materials.json with exact sheet name and PDF.');
}

// 3. Define the exact Homework entries for Block 1 Week 5 and Block 2 Week 1
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
    task: EXACT_SHEET_NAME,
    details: EXACT_SHEET_NAME,
    pages: EXACT_SHEET_NAME,
    priority: 'normal',
    completed: false,
    block: 1,
    week: 5,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
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
    task: EXACT_SHEET_NAME,
    details: EXACT_SHEET_NAME,
    pages: EXACT_SHEET_NAME,
    priority: 'normal',
    completed: false,
    block: 1,
    week: 5,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
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
    task: EXACT_SHEET_NAME,
    details: `${EXACT_SHEET_NAME} (تسليم يوم الاثنين)`,
    pages: EXACT_SHEET_NAME,
    priority: 'normal',
    completed: false,
    block: 1,
    week: 5,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
  }
];

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
    task: EXACT_SHEET_NAME,
    details: EXACT_SHEET_NAME,
    pages: EXACT_SHEET_NAME,
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
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
    task: EXACT_SHEET_NAME,
    details: EXACT_SHEET_NAME,
    pages: EXACT_SHEET_NAME,
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
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
    task: EXACT_SHEET_NAME,
    details: `${EXACT_SHEET_NAME} (تسليم يوم الاثنين)`,
    pages: EXACT_SHEET_NAME,
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
  }
];

// 4. Define Tomorrow Notes
const b1w5TomorrowNotes = [
  {
    id: 'tn-b1-w5-G2A-sat-social-hw-submit',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    title: EXACT_SHEET_NAME,
    note: EXACT_SHEET_NAME,
    arabicNote: `${EXACT_SHEET_NAME} (تسليم يوم الأحد)`,
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    priority: 'normal',
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    block: 1,
    week: 5
  },
  {
    id: 'tn-b1-w5-G2C-sat-social-hw-submit',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    title: EXACT_SHEET_NAME,
    note: EXACT_SHEET_NAME,
    arabicNote: `${EXACT_SHEET_NAME} (تسليم يوم الأحد)`,
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    priority: 'normal',
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    block: 1,
    week: 5
  },
  {
    id: 'tn-b1-w5-G2B-sun-social-hw-submit',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'Social Studies',
    title: EXACT_SHEET_NAME,
    note: EXACT_SHEET_NAME,
    arabicNote: `${EXACT_SHEET_NAME} (تسليم يوم الاثنين)`,
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    priority: 'normal',
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    block: 1,
    week: 5
  }
];

const b2w1TomorrowNotes = [
  {
    id: 'tn-b2-w1-social-sheet-G2A-Sunday',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 2,
    title: EXACT_SHEET_NAME,
    note: EXACT_SHEET_NAME,
    arabicNote: `${EXACT_SHEET_NAME} (تسليم يوم الأحد)`,
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL
  },
  {
    id: 'tn-b2-w1-social-sheet-G2C-Sunday',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 7,
    title: EXACT_SHEET_NAME,
    note: EXACT_SHEET_NAME,
    arabicNote: `${EXACT_SHEET_NAME} (تسليم يوم الأحد)`,
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL
  },
  {
    id: 'tn-b2-w1-social-sheet-G2B-Monday',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'Social Studies',
    period: 1,
    title: EXACT_SHEET_NAME,
    note: EXACT_SHEET_NAME,
    arabicNote: `${EXACT_SHEET_NAME} (تسليم يوم الاثنين)`,
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL
  }
];

// 5. Update local JSON files
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove old Social Studies entries for B1W5 and B2W1
    data.homework = (data.homework || []).filter(h => 
      !(h.block === 1 && h.week === 5 && h.subject === 'Social Studies') &&
      !(h.block === 2 && h.week === 1 && h.subject === 'Social Studies')
    );

    data.tomorrowNotes = (data.tomorrowNotes || []).filter(t => 
      !(t.block === 1 && t.week === 5 && t.subject === 'Social Studies') &&
      !(t.block === 2 && t.week === 1 && t.subject === 'Social Studies')
    );

    // Add new entries
    data.homework.push(...b1w5Homework, ...b2w1Homework);
    data.tomorrowNotes.push(...b1w5TomorrowNotes, ...b2w1TomorrowNotes);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath} successfully.`);
  }
});

// 6. Sync to Supabase
(async () => {
  const supabase = createClient('https://umryrjwmlkdbjmgmnbkt.supabase.co', 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag');

  console.log('Syncing homework to Supabase...');
  // Delete existing B1W5 and B2W1 Social Studies homework
  await supabase
    .from('homework')
    .delete()
    .eq('subject', 'Social Studies')
    .eq('block', 1)
    .eq('week', 5);

  await supabase
    .from('homework')
    .delete()
    .eq('subject', 'Social Studies')
    .eq('block', 2)
    .eq('week', 1);

  // Insert fresh rows
  function packHomeworkDetails(details, pdfUrl) {
    let res = details?.trim() || '';
    if (pdfUrl) {
      res += ` ||PDF_URL:${pdfUrl.trim()}`;
    }
    return res || undefined;
  }

  const allHw = [...b1w5Homework, ...b2w1Homework];
  for (const hw of allHw) {
    const { error } = await supabase.from('homework').upsert({
      id: hw.id,
      class_id: hw.classId,
      assigned_day: hw.assignedDay,
      due_day: hw.dueDay,
      subject: hw.subject,
      task: hw.task,
      details: packHomeworkDetails(hw.details, hw.pdfUrl),
      pages: hw.pages,
      completed: hw.completed,
      priority: hw.priority,
      block: hw.block,
      week: hw.week,
      link_url: hw.linkUrl,
      is_link_task: true
    });
    if (error) {
      console.warn('Error inserting homework row:', hw.id, error.message);
    } else {
      console.log('Synced homework:', hw.id, hw.classId, hw.assignedDay);
    }
  }

  // Update planner_settings tomorrow_special_notes
  console.log('Syncing planner_settings tomorrow_special_notes...');
  const { data: psRow } = await supabase
    .from('planner_settings')
    .select('value')
    .eq('key', 'tomorrow_special_notes')
    .single();

  let existingNotes = [];
  if (psRow && psRow.value) {
    try {
      existingNotes = JSON.parse(psRow.value);
    } catch {}
  }

  // Filter out any old B1W5 or B2W1 Social Studies notes
  let updatedNotes = existingNotes.filter(n =>
    !(n.block === 1 && n.week === 5 && n.subject === 'Social Studies') &&
    !(n.block === 2 && n.week === 1 && n.subject === 'Social Studies')
  );

  updatedNotes.push(...b1w5TomorrowNotes, ...b2w1TomorrowNotes);

  const { error: psErr } = await supabase
    .from('planner_settings')
    .upsert({
      key: 'tomorrow_special_notes',
      value: JSON.stringify(updatedNotes),
      updated_at: new Date().toISOString()
    });

  if (psErr) {
    console.error('Error updating planner_settings:', psErr.message);
  } else {
    console.log('Successfully updated tomorrow_special_notes in planner_settings!');
  }

  console.log('All updates complete!');
})();
