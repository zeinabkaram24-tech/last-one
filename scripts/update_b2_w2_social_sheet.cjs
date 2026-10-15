const fs = require('fs');

console.log('--- Updating Block 2 Week 2 Social Studies Homework & Tomorrow Notes to the Correct Official Sheet ---');

const EXACT_SHEET_NAME = 'Social Studies Grade 2 B1 Week 5 U1 Homework 5';
const EXACT_PDF_FILENAME = 'SocialStudies-Grade2-B1-W5-U1-HomeWork5 - Extra- (Minia).pdf';
const EXACT_PDF_URL = `/materials/${EXACT_PDF_FILENAME}`;

const socialHomework = [
  {
    id: 'hw-b2-w2-G2A-Sat-social-sheet',
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
    week: 2,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
  },
  {
    id: 'hw-b2-w2-G2C-Sat-social-sheet',
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
    week: 2,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
  },
  {
    id: 'hw-b2-w2-G2B-Sun-social-sheet',
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
    week: 2,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    link_url: EXACT_PDF_URL,
    isLinkTask: true,
    is_link_task: true
  }
];

const socialTomorrowNotes = [
  {
    id: 'tn-b2-w2-social-sheet-G2A-Sunday',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 2,
    title: '🌍 واجب وتجهيز الدراسات الاجتماعية (Home Work)',
    note: 'Social Studies Homework sheet. Solve and bring for submission in the first class.',
    arabicNote: 'تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق وإحضاره جاهزاً للتسليم في أول حصة غداً الأحد.',
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 2,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
  },
  {
    id: 'tn-b2-w2-social-sheet-G2C-Sunday',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'Social Studies',
    period: 7,
    title: '🌍 واجب وتجهيز الدراسات الاجتماعية (Home Work)',
    note: 'Social Studies Homework sheet. Solve and bring for submission in the first class.',
    arabicNote: 'تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق وإحضاره جاهزاً للتسليم في أول حصة غداً الأحد.',
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 2,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
  },
  {
    id: 'tn-b2-w2-social-sheet-G2B-Monday',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'Social Studies',
    period: 1,
    title: '🌍 واجب وتجهيز الدراسات الاجتماعية (Home Work)',
    note: 'Social Studies Homework sheet. Solve and bring for submission in the first class.',
    arabicNote: 'تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق وإحضاره جاهزاً للتسليم في أول حصة غداً الإثنين.',
    bagItem: EXACT_SHEET_NAME,
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 2,
    pdfUrl: EXACT_PDF_URL,
    pdf_url: EXACT_PDF_URL,
  }
];

// Update local files
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 2 && h.subject === 'Social Studies')
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 2 && t.subject === 'Social Studies')
    );

    data.homework.push(...socialHomework);
    data.tomorrowNotes.push(...socialTomorrowNotes);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath} for Block 2 Week 2 Social Studies.`);
  }
});

// Update data/materials.json
if (fs.existsSync('data/materials.json')) {
  let materials = JSON.parse(fs.readFileSync('data/materials.json', 'utf8'));
  materials = materials.filter((m) => m.id !== 'mat_social_studies_b2_w2_hw');
  materials.unshift({
    id: 'mat_social_studies_b2_w2_hw',
    fileName: EXACT_PDF_FILENAME,
    fileSize: 599624,
    storageUrl: EXACT_PDF_URL,
    linkUrl: EXACT_PDF_URL,
    subject: 'Social Studies',
    grade: 'Grade 2',
    term: 'Term 1',
    block: 2,
    week: 2,
    type: 'pdf',
    uploadedAt: '2026-10-15T06:00:00.000Z',
    description: `${EXACT_SHEET_NAME} - Block 2 Week 2`
  });
  fs.writeFileSync('data/materials.json', JSON.stringify(materials, null, 2), 'utf8');
  console.log('Updated data/materials.json for Block 2 Week 2 Social Studies worksheet.');
}
