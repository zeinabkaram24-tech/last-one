const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Updating Social Studies homework assigned days and setting up ICT exactly as per weekly plan...');

const WORKSHEET_FILE = '/materials/SocialStudies-Grade2-B2-Week1-HomeWork.html';

// 1. Social Studies Homework:
// - Class B: Assigned on Sunday (due Monday)
// - Class A and Class C: Assigned on Saturday (due Sunday)
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

// 2. ICT Classwork & Homework based on the uploaded weekly plan image:
// Sessions:
// Session 1: Explain meaning of communication, List some of communication methods, The meaning of communication, Communication methods, E-mail (Electronic mail). Resources: Study sheet W1 Pg. 4 to 8. Notes: ICT sheet, Flash drive, Support files.
// Session 2: The difference between letters and E-mail, Defining E-mail address, The parts of E-mail address. Resources: Study sheet W1.
// Session 3: Creating Google account (G-mail), How to create a strong password? Resources: Homework W1 Pg. 9.

const ictClasswork = [
  // --- Class A (G2A): Session 1 (Sunday), Session 2 (Tuesday), Session 3 (Thursday) ---
  {
    id: 'cw-b2-w1-G2A-session1-ict',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 1',
    details: 'Explain meaning of communication. List some of communication methods. Topics: The meaning of communication, Communication methods, E-mail (Electronic mail). Resources: Study sheet W1 Pg. 4 to 8. Please ensure students bring: ICT sheet, Flash drive, Support files.',
    pages: 'Study sheet W1 Pg. 4 to 8',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2A-session2-ict',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 2',
    details: 'Topics: The difference between letters and E-mail, Defining E-mail address, The parts of E-mail address. Resources: Study sheet W1.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2A-session3-ict',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 3',
    details: 'Topics: Creating Google account (G-mail), How to create a strong password? Resources: Study sheet W1, Homework W1 Pg. 9.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Class B (G2B): Session 1 (Sunday), Session 2 (Wednesday), Session 3 (Thursday) ---
  {
    id: 'cw-b2-w1-G2B-session1-ict',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 1',
    details: 'Explain meaning of communication. List some of communication methods. Topics: The meaning of communication, Communication methods, E-mail (Electronic mail). Resources: Study sheet W1 Pg. 4 to 8. Please ensure students bring: ICT sheet, Flash drive, Support files.',
    pages: 'Study sheet W1 Pg. 4 to 8',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-session2-ict',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 2',
    details: 'Topics: The difference between letters and E-mail, Defining E-mail address, The parts of E-mail address. Resources: Study sheet W1.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2B-session3-ict',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 3',
    details: 'Topics: Creating Google account (G-mail), How to create a strong password? Resources: Study sheet W1, Homework W1 Pg. 9.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Class C (G2C): Session 1 (Monday), Session 2 (Tuesday), Session 3 (Wednesday) ---
  {
    id: 'cw-b2-w1-G2C-session1-ict',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 1',
    details: 'Explain meaning of communication. List some of communication methods. Topics: The meaning of communication, Communication methods, E-mail (Electronic mail). Resources: Study sheet W1 Pg. 4 to 8. Please ensure students bring: ICT sheet, Flash drive, Support files.',
    pages: 'Study sheet W1 Pg. 4 to 8',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-session2-ict',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 2',
    details: 'Topics: The difference between letters and E-mail, Defining E-mail address, The parts of E-mail address. Resources: Study sheet W1.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  },
  {
    id: 'cw-b2-w1-G2C-session3-ict',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 4,
    subject: 'ICT',
    title: 'Communicating with Email — Session 3',
    details: 'Topics: Creating Google account (G-mail), How to create a strong password? Resources: Study sheet W1, Homework W1 Pg. 9.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  },
];

// ICT Homework assigned on Session 3 (last session) for each class
const ictHomework = [
  {
    id: 'hw-b2-w1-G2A-session3-ict',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Thursday',
    assigned_day: 'Thursday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'ICT',
    task: 'ICT Homework — Homework W1 Pg. 9',
    details: 'Communicating with Email. Complete exercises on Homework W1 Page 9.',
    pages: 'Homework W1 Pg. 9',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2B-session3-ict',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Thursday',
    assigned_day: 'Thursday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'ICT',
    task: 'ICT Homework — Homework W1 Pg. 9',
    details: 'Communicating with Email. Complete exercises on Homework W1 Page 9.',
    pages: 'Homework W1 Pg. 9',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
  {
    id: 'hw-b2-w1-G2C-session3-ict',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'ICT',
    task: 'ICT Homework — Homework W1 Pg. 9',
    details: 'Communicating with Email. Complete exercises on Homework W1 Page 9.',
    pages: 'Homework W1 Pg. 9',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
  },
];

// ICT Tomorrow note before Session 1 (bringing tools: ICT sheet, Flash drive, Support files)
const ictTomorrowNotes = [
  {
    id: 'tn-b2-w1-ict-prep-G2A',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'ICT',
    period: 4,
    title: '💻 تجهيز أدوات حصة الـ ICT',
    note: 'Please ensure the students bring: ICT sheet, Flash drive, Support files.',
    arabicNote: 'تنبيه لحصة الـ ICT غداً الأحد: يرجى التأكد من إحضار الطلاب للأدوات التالية: شيت الـ ICT + فلاش ميموري (Flash drive) + ملفات الدعم (Support files).',
    bagItem: 'شيت الـ ICT، فلاش ميموري (Flash drive)، ملفات الدعم (Support files)',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-ict-prep-G2B',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Sunday',
    subject: 'ICT',
    period: 4,
    title: '💻 تجهيز أدوات حصة الـ ICT',
    note: 'Please ensure the students bring: ICT sheet, Flash drive, Support files.',
    arabicNote: 'تنبيه لحصة الـ ICT غداً الأحد: يرجى التأكد من إحضار الطلاب للأدوات التالية: شيت الـ ICT + فلاش ميموري (Flash drive) + ملفات الدعم (Support files).',
    bagItem: 'شيت الـ ICT، فلاش ميموري (Flash drive)، ملفات الدعم (Support files)',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-ict-prep-G2C',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Monday',
    subject: 'ICT',
    period: 4,
    title: '💻 تجهيز أدوات حصة الـ ICT',
    note: 'Please ensure the students bring: ICT sheet, Flash drive, Support files.',
    arabicNote: 'تنبيه لحصة الـ ICT غداً الإثنين: يرجى التأكد من إحضار الطلاب للأدوات التالية: شيت الـ ICT + فلاش ميموري (Flash drive) + ملفات الدعم (Support files).',
    bagItem: 'شيت الـ ICT، فلاش ميموري (Flash drive)، ملفات الدعم (Support files)',
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

    // 1. Update Social Studies homework
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'Social Studies')
    );
    data.homework.push(...socialHomework);

    // 2. Update ICT classwork, homework, tomorrow notes
    data.classwork = (data.classwork || []).filter(
      (c) => !(c.block === 2 && c.week === 1 && c.subject === 'ICT')
    );
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'ICT')
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && t.subject === 'ICT')
    );

    data.classwork.push(...ictClasswork);
    data.homework.push(...ictHomework);
    data.tomorrowNotes.push(...ictTomorrowNotes);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: Total cw=${data.classwork.length}, hw=${data.homework.length}`);
  }
});

// Update Supabase
async function syncToSupabase() {
  const url = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
  const key = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

  try {
    const client = createClient(url, key);
    console.log('Syncing Social Studies and ICT to Supabase...');

    // Upsert Social Studies homework
    const socialRows = socialHomework.map((h) => ({
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
    await client.from('homework').upsert(socialRows);

    // Upsert ICT classwork & homework
    await client.from('classwork').delete().eq('block', 2).eq('week', 1).eq('subject', 'ICT');
    const cwRows = ictClasswork.map((c) => ({
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
    await client.from('classwork').insert(cwRows);

    await client.from('homework').delete().eq('block', 2).eq('week', 1).eq('subject', 'ICT');
    const hwRows = ictHomework.map((h) => ({
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
    await client.from('homework').insert(hwRows);

    const fullData = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf8'));
    await client.from('planner_settings').upsert({
      key: 'tomorrow_special_notes',
      value: JSON.stringify(fullData.tomorrowNotes),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });

    console.log('Supabase sync complete for Social Studies & ICT!');
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

syncToSupabase();
