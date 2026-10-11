const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Seeding ICT Block 2 Week 1 (Communicating with Email)...');

// =========================================================================
// ICT CLASSWORK & HOMEWORK (Block 2 - Week 1: 11/10/2026 - 15/10/2026)
// Unit: Communicating with Email
// 3 Sessions per class (A, B, C)
// Session 1: The meaning of communication, Communication methods, E-mail (Electronic mail)
// Session 2: The difference between letters and E-mail, Defining E-mail address, The parts of E-mail address
// Session 3: Creating Google account (G-mail), How to create a strong password? (HOMEWORK assigned on Session 3: Homework W1 Pg. 9)
// Notes: Ensure students bring ICT sheet, Flash drive, Support files
// =========================================================================

const ictClasswork = [];
const ictHomework = [];
const ictTomorrowNotes = [];

const ictSchedule = {
  G2A: { session1: 'Sunday', session2: 'Tuesday', session3: 'Thursday' },
  G2B: { session1: 'Sunday', session2: 'Wednesday', session3: 'Thursday' },
  G2C: { session1: 'Monday', session2: 'Tuesday', session3: 'Wednesday' },
};

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  const sched = ictSchedule[cls];

  // --- Session 1 ---
  ictClasswork.push({
    id: `cw-b2-w1-${cls}-session1-ict`,
    classId: cls,
    class_id: cls,
    day: sched.session1,
    period: 3,
    subject: 'ICT',
    title: 'Communicating with Email — Session 1 (Meaning of communication & methods)',
    details: 'Unit: Communicating with Email. Explain meaning of communication. List some of communication methods. Topics: The meaning of communication, Communication methods, E-mail (Electronic mail). Resources: Study sheet W1 Pg. 4 to 8. Notes: Bring ICT sheet, Flash drive, Support files.',
    pages: 'Study sheet W1 Pg. 4 to 8',
    completed: false,
    block: 2,
    week: 1,
  });

  // --- Session 2 ---
  ictClasswork.push({
    id: `cw-b2-w1-${cls}-session2-ict`,
    classId: cls,
    class_id: cls,
    day: sched.session2,
    period: 3,
    subject: 'ICT',
    title: 'Communicating with Email — Session 2 (E-mail address & parts)',
    details: 'Unit: Communicating with Email. Topics: The difference between letters and E-mail, Defining E-mail address, The parts of E-mail address. Resources: Study sheet W1.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  });

  // --- Session 3 (Last session -> HOMEWORK ASSIGNED HERE) ---
  ictClasswork.push({
    id: `cw-b2-w1-${cls}-session3-ict`,
    classId: cls,
    class_id: cls,
    day: sched.session3,
    period: 3,
    subject: 'ICT',
    title: 'Communicating with Email — Session 3 (Google account & strong password)',
    details: 'Unit: Communicating with Email. Topics: Creating Google account (G-mail), How to create a strong password?. Resources: Study sheet W1.',
    pages: 'Study sheet W1',
    completed: false,
    block: 2,
    week: 1,
  });

  // Homework assigned on Session 3 (last session), due next week
  ictHomework.push({
    id: `hw-b2-w1-${cls}-session3-ict`,
    classId: cls,
    class_id: cls,
    assignedDay: sched.session3,
    assigned_day: sched.session3,
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
  });

  // Tomorrow note for bringing ICT sheet, Flash drive, Support files before Session 1
  const session1Day = sched.session1;
  const prevDayMap = { Sunday: 'Saturday', Monday: 'Sunday', Tuesday: 'Monday', Wednesday: 'Tuesday', Thursday: 'Wednesday' };
  const targetDay = session1Day;

  ictTomorrowNotes.push({
    id: `tn-b2-w1-ict-prep-${cls}`,
    classId: cls,
    class_id: cls,
    targetDay: targetDay,
    subject: 'ICT',
    period: 3,
    title: '💻 تجهيز أدوات حصة الـ ICT',
    note: 'Please ensure the students bring: ICT sheet, Flash drive, Support files.',
    arabicNote: 'تنبيه لحصة الـ ICT غداً: يرجى التأكد من إحضار الطلاب للأدوات التالية: شيت الـ ICT + فلاش ميموري (Flash drive) + ملفات الدعم (Support files).',
    bagItem: 'شيت الـ ICT، فلاش ميموري (Flash drive)، ملفات الدعم (Support files)',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
  });
});

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove old ICT entries
    data.classwork = (data.classwork || []).filter(
      (c) => !(c.block === 2 && c.week === 1 && c.subject === 'ICT')
    );
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'ICT')
    );
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1 && t.subject === 'ICT')
    );

    // Add new ICT entries
    data.classwork.push(...ictClasswork);
    data.homework.push(...ictHomework);
    data.tomorrowNotes.push(...ictTomorrowNotes);

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
    console.log('Syncing ICT B2W1 to Supabase...');

    await client
      .from('classwork')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'ICT');

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'ICT');

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

    console.log('Supabase sync complete for ICT!');
  } catch (err) {
    console.error('Supabase sync error:', err);
  }
}

syncToSupabase();
