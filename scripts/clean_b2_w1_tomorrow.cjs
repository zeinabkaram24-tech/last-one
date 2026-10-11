const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

console.log('Cleaning Block 2 Week 1 Tomorrow notes to EXACTLY mandated items...');

// The ONLY allowed Tomorrow notes for Block 2 Week 1:
// 1) Spelling Bee: G2A on Tue, G2C on Tue, G2B on Wed
// 2) Arabic Dictation: G2A on Wed, G2B on Wed, G2C on Wed
const allowedB2W1TomorrowNotes = [
  // --- SPELLING BEE (English) ---
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

  // --- ARABIC DICTATION (إملاء) ---
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

// Update local files
['data/planner_data.json', 'src/data/initialData.json'].forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove ALL Block 2 Week 1 tomorrow notes
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(
      (t) => !(t.block === 2 && t.week === 1)
    );

    // Add ONLY the 6 allowed notes
    data.tomorrowNotes.push(...allowedB2W1TomorrowNotes);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: Total tn=${data.tomorrowNotes.length}`);
  }
});

// Update Supabase planner_settings
async function syncToSupabase() {
  const url = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
  const key = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

  try {
    const client = createClient(url, key);
    console.log('Syncing clean tomorrow_special_notes to Supabase...');

    const fullData = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf8'));
    const { error: tnErr } = await client.from('planner_settings').upsert({
      key: 'tomorrow_special_notes',
      value: JSON.stringify(fullData.tomorrowNotes),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' });
    if (tnErr) console.warn('Supabase tomorrow_special_notes update error:', tnErr.message);
    else console.log('Successfully updated clean tomorrow_special_notes in Supabase.');

    console.log('Supabase sync complete!');
  } catch (err) {
    console.error('Supabase sync failed:', err);
  }
}

syncToSupabase();
