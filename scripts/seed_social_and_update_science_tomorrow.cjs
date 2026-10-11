const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Seeding Social Studies B2W1 and fixing Science Tomorrow & Spelling Bee Tomorrow...');

// =========================================================================
// 1. SOCIAL STUDIES CLASSWORK & HOMEWORK (Block 2 - Week 1: 11/10/2026 - 15/10/2026)
// =========================================================================
const socialClasswork = [
  // --- Sunday ---
  // G2A: Period 2 -> ما هي مدرستي؟
  {
    id: 'cw-b2-w1-G2A-Sunday-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 2,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (ما هي مدرستي؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: ما هي مدرستي؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2C: Period 7 -> ما هي مدرستي؟
  {
    id: 'cw-b2-w1-G2C-Sunday-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 7,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (ما هي مدرستي؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: ما هي مدرستي؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Monday ---
  // G2B: Period 1 -> ما هي مدرستي؟
  {
    id: 'cw-b2-w1-G2B-Monday-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 1,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (ما هي مدرستي؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: ما هي مدرستي؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2C: Period 4 -> أين تقع مدرستي؟
  {
    id: 'cw-b2-w1-G2C-Monday-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 4,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (أين تقع مدرستي؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: أين تقع مدرستي؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Wednesday ---
  // G2A: Period 5 -> أين تقع مدرستي؟
  {
    id: 'cw-b2-w1-G2A-Wednesday-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 5,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (أين تقع مدرستي؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: أين تقع مدرستي؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2B: Period 8 -> أين تقع مدرستي؟
  {
    id: 'cw-b2-w1-G2B-Wednesday-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 8,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (أين تقع مدرستي؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: أين تقع مدرستي؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2C: Period 1 -> كيف نحافظ على مدرستنا؟
  {
    id: 'cw-b2-w1-G2C-Wednesday-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 1,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (كيف نحافظ على مدرستنا؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: كيف نحافظ على مدرستنا؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },

  // --- Thursday ---
  // G2A: Period 7 -> كيف نحافظ على مدرستنا؟
  {
    id: 'cw-b2-w1-G2A-Thursday-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 7,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (كيف نحافظ على مدرستنا؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: كيف نحافظ على مدرستنا؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },
  // G2B: Period 2 -> كيف نحافظ على مدرستنا؟
  {
    id: 'cw-b2-w1-G2B-Thursday-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 2,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي (كيف نحافظ على مدرستنا؟)',
    details: 'الوحدة الثانية: المجتمع المدرسي. موضوع: كيف نحافظ على مدرستنا؟ وتطبيقات في أوراق العمل.',
    pages: 'أوراق العمل',
    completed: false,
    block: 2,
    week: 1,
  },
];

// Homework on Wednesday for G2A, G2B, G2C (Due Sunday next week)
const socialHomework = ['G2A', 'G2B', 'G2C'].map((cls) => ({
  id: `hw-b2-w1-${cls}-Wednesday-social`,
  classId: cls,
  class_id: cls,
  assignedDay: 'Wednesday',
  assigned_day: 'Wednesday',
  dueDay: 'Sunday',
  due_day: 'Sunday',
  subject: 'Social Studies',
  task: 'واجب الدراسات الاجتماعية (يتم الإرسال على LMS)',
  details: 'الوحدة الثانية: المجتمع المدرسي - يتم إرسال الواجب على LMS (يتم استلام الواجبات أول حصة الأسبوع القادم).',
  pages: 'LMS / أوراق العمل',
  completed: false,
  priority: 'normal',
  block: 2,
  week: 1,
}));

// =========================================================================
// 2. SCIENCE TOMORROW NOTES (Bringing supplies ONLY - NO booklet submission)
// =========================================================================
const scienceMaterialsNote = (cls, targetDay, period) => ({
  id: `tn-b2-w1-science-materials-${cls}-${targetDay}`,
  classId: cls,
  class_id: cls,
  targetDay: targetDay,
  subject: 'Science',
  period: period,
  title: '🔬 أدوات وطلبات حصة الساينس',
  note: 'Bring Science materials: Foam clay (different colors), A4 colored sheet, Glue, Ruler.',
  arabicNote: 'تنبيه لحصة الساينس غداً: يرجى إحضار الطلبات المطلوبة: صلصال فوم بألوان مختلفة (Foam clay) + ورقة A4 ملونة + صمغ (Glue) + مسطرة (Ruler).',
  bagItem: 'صلصال فوم بألوان مختلفة (Foam clay)، ورقة A4 ملونة، صمغ، مسطرة',
  isQuiz: false,
  categoryType: 'note',
  block: 2,
  week: 1,
});

const cleanScienceTomorrowNotes = [
  // G2A Science days: Monday (P7), Tuesday (P5), Thursday (P8)
  scienceMaterialsNote('G2A', 'Monday', 7),
  scienceMaterialsNote('G2A', 'Tuesday', 5),
  scienceMaterialsNote('G2A', 'Thursday', 8),

  // G2B Science days: Sunday (P2), Wednesday (P7), Thursday (P7)
  scienceMaterialsNote('G2B', 'Sunday', 2),
  scienceMaterialsNote('G2B', 'Wednesday', 7),
  scienceMaterialsNote('G2B', 'Thursday', 7),

  // G2C Science days: Sunday (P5), Monday (P3), Thursday (P1)
  scienceMaterialsNote('G2C', 'Sunday', 5),
  scienceMaterialsNote('G2C', 'Monday', 3),
  scienceMaterialsNote('G2C', 'Thursday', 1),
];

// =========================================================================
// 3. EXACT ENGLISH SPELLING BEE & ARABIC DICTATION TOMORROW NOTES
// =========================================================================
const cleanEnglishAndArabicTomorrowNotes = [
  // Spelling Bee: G2A on Tuesday, G2C on Tuesday, G2B on Wednesday
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

  // Arabic Dictation: Wednesday for G2A, G2B, G2C
  {
    id: 'tn-b2-w1-arabic-wed-dictation-g2a',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Wednesday',
    subject: 'Arabic',
    period: 6,
    title: '📝 إملاء لغة عربية (أوراق عمل الوحدة الثالثة ص 10)',
    note: 'تقييم إملاء على مهارات الوحدة الثالثة ص 10 + إحضار كراسة الطالب',
    arabicNote: '📝 إملاء في مادة اللغة العربية غداً الأربعاء (أوراق عمل الوحدة الثالثة ص 10): يُرجى التدريب الجيد في المنزل وإحضار كراسة الطالب.',
    bagItem: 'كراسة الطالب + أوراق عمل الوحدة الثالثة ص 10',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-arabic-wed-dictation-g2b',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Wednesday',
    subject: 'Arabic',
    period: 4,
    title: '📝 إملاء لغة عربية (أوراق عمل الوحدة الثالثة ص 10)',
    note: 'تقييم إملاء على مهارات الوحدة الثالثة ص 10 + إحضار كراسة الطالب',
    arabicNote: '📝 إملاء في مادة اللغة العربية غداً الأربعاء (أوراق عمل الوحدة الثالثة ص 10): يُرجى التدريب الجيد في المنزل وإحضار كراسة الطالب.',
    bagItem: 'كراسة الطالب + أوراق عمل الوحدة الثالثة ص 10',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
  },
  {
    id: 'tn-b2-w1-arabic-wed-dictation-g2c',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Wednesday',
    subject: 'Arabic',
    period: 6,
    title: '📝 إملاء لغة عربية (أوراق عمل الوحدة الثالثة ص 10)',
    note: 'تقييم إملاء على مهارات الوحدة الثالثة ص 10 + إحضار كراسة الطالب',
    arabicNote: '📝 إملاء في مادة اللغة العربية غداً الأربعاء (أوراق عمل الوحدة الثالثة ص 10): يُرجى التدريب الجيد في المنزل وإحضار كراسة الطالب.',
    bagItem: 'كراسة الطالب + أوراق عمل الوحدة الثالثة ص 10',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
  },
];

const allMandatedB2W1TomorrowNotes = [
  ...cleanEnglishAndArabicTomorrowNotes,
  ...cleanScienceTomorrowNotes,
];

// Update local files: data/planner_data.json and src/data/initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // 1. Clean existing Social Studies B2W1
    data.classwork = (data.classwork || []).filter(
      (c) => !(c.block === 2 && c.week === 1 && c.subject === 'Social Studies')
    );
    data.homework = (data.homework || []).filter(
      (h) => !(h.block === 2 && h.week === 1 && h.subject === 'Social Studies')
    );

    // 2. Replace ALL B2W1 tomorrow notes with exact mandated list (Zero extra or duplicate notes!)
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1)
    );
    data.tomorrowNotes.push(...allMandatedB2W1TomorrowNotes);

    // 3. Add Social Studies Classwork and Homework
    data.classwork.push(...socialClasswork);
    data.homework.push(...socialHomework);

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
    console.log('Syncing to Supabase...');

    // 1. Clean existing Social Studies B2W1
    await client
      .from('classwork')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'Social Studies');

    await client
      .from('homework')
      .delete()
      .eq('block', 2)
      .eq('week', 1)
      .eq('subject', 'Social Studies');

    // 2. Insert Social Studies Classwork (9 rows)
    const cwRows = socialClasswork.map((c) => ({
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
    const { error: cwErr } = await client.from('classwork').insert(cwRows);
    if (cwErr) console.warn('Supabase social classwork error:', cwErr.message);
    else console.log(`Inserted ${cwRows.length} Social Studies classwork rows into Supabase.`);

    // 3. Insert Social Studies Homework (3 rows)
    const hwRows = socialHomework.map((h) => ({
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
    const { error: hwErr } = await client.from('homework').insert(hwRows);
    if (hwErr) console.warn('Supabase social homework error:', hwErr.message);
    else console.log(`Inserted ${hwRows.length} Social Studies homework rows into Supabase.`);

    // 4. Update tomorrow_special_notes in Supabase
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
