const fs = require('fs');

console.log('Updating Block 2 Week 1 planner data...');

const b2w1TomorrowNotes = [
  // --- SUNDAY (Preparing on Saturday night / Sunday) ---
  {
    id: 'tn-b2-w1-G2A-Sat-english',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Sunday',
    subject: 'English',
    period: 5,
    title: 'English: Adding -ing & Spelling Bee List',
    note: 'Adding -ing & start memorizing 40 Spelling Bee competition words',
    arabicNote: 'حصة لغة إنجليزية: قاعدة إضافة (Adding -ing) والبدء في حفظ وتدريب كلمات مسابقة Spelling Bee (قائمة الـ 40 كلمة المرفقة).',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },
  {
    id: 'tn-b2-w1-G2B-Sat-english',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Sunday',
    subject: 'English',
    period: 1,
    title: 'English: Adding -ing & Spelling Bee List',
    note: 'Adding -ing & start memorizing 40 Spelling Bee competition words',
    arabicNote: 'حصة لغة إنجليزية: قاعدة إضافة (Adding -ing) والبدء في حفظ وتدريب كلمات مسابقة Spelling Bee (قائمة الـ 40 كلمة المرفقة).',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },
  {
    id: 'tn-b2-w1-G2C-Sat-english',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Sunday',
    subject: 'English',
    period: 1,
    title: 'English: Adding -ing & Spelling Bee List',
    note: 'Adding -ing & start memorizing 40 Spelling Bee competition words',
    arabicNote: 'حصة لغة إنجليزية: قاعدة إضافة (Adding -ing) والبدء في حفظ وتدريب كلمات مسابقة Spelling Bee (قائمة الـ 40 كلمة المرفقة).',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },

  // --- MONDAY (Preparing on Sunday evening) ---
  {
    id: 'tn-b2-w1-english-mon-advance-g2a',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Monday',
    subject: 'English',
    period: 3,
    title: 'English Classwork CW. 9 & Spelling Bee prep',
    note: 'English lesson on Present continuous CW. 9 and continue Spelling Bee Round 1 preparation.',
    arabicNote: 'درس لغة إنجليزية: المضارع المستمر (CW. 9) والاستعداد لمسابقة Spelling Bee المقررة يوم الثلاثاء.',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },
  {
    id: 'tn-b2-w1-english-mon-advance-g2b',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Monday',
    subject: 'English',
    period: 5,
    title: 'English Classwork CW. 9 & Spelling Bee prep',
    note: 'English lesson on Present continuous CW. 9 and continue Spelling Bee Round 1 preparation.',
    arabicNote: 'درس لغة إنجليزية: المضارع المستمر (CW. 9) والاستعداد لمسابقة Spelling Bee المقررة يوم الأربعاء.',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },
  {
    id: 'tn-b2-w1-english-mon-advance-g2c',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Monday',
    subject: 'English',
    period: 6,
    title: 'English Classwork CW. 9 & Spelling Bee prep',
    note: 'English lesson on Present continuous CW. 9 and continue Spelling Bee Round 1 preparation.',
    arabicNote: 'درس لغة إنجليزية: المضارع المستمر (CW. 9) والاستعداد لمسابقة Spelling Bee المقررة يوم الثلاثاء.',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },

  // --- TUESDAY (Preparing on Monday evening) ---
  // G2A: Spelling Bee Competition (Round 1) - Tuesday Period 7
  {
    id: 'tn-b2-w1-english-tue-spellingbee-g2a',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Tuesday',
    subject: 'English',
    period: 7,
    title: '🐝 مسابقة Spelling Bee Competition (Round 1)',
    note: 'Spelling Bee Round 1 Competition (Block 2 - Week 1 Word List)',
    arabicNote: '🚨 مسابقة واختبار هام: غداً الثلاثاء مسابقة التهجئة (Spelling Bee Competition - Round 1) لفصل G2A في حصة اللغة الإنجليزية! يرجى الاستعداد والتدريب الجيد على قائمة الـ 40 كلمة المرفقة.',
    bagItem: 'English Notebook (كشكول اللغة الإنجليزية)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },
  // G2C: Spelling Bee Competition (Round 1) - Tuesday Period 4
  {
    id: 'tn-b2-w1-english-tue-spellingbee-g2c',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Tuesday',
    subject: 'English',
    period: 4,
    title: '🐝 مسابقة Spelling Bee Competition (Round 1)',
    note: 'Spelling Bee Round 1 Competition (Block 2 - Week 1 Word List)',
    arabicNote: '🚨 مسابقة واختبار هام: غداً الثلاثاء مسابقة التهجئة (Spelling Bee Competition - Round 1) لفصل G2C في حصة اللغة الإنجليزية! يرجى الاستعداد والتدريب الجيد على قائمة الـ 40 كلمة المرفقة.',
    bagItem: 'English Notebook (كشكول اللغة الإنجليزية)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },
  // G2B: Tuesday has Writing Mr. Fox (Period 7) & continue Spelling Bee prep for Wednesday
  {
    id: 'tn-b2-w1-english-tue-writing-g2b',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Tuesday',
    subject: 'English',
    period: 7,
    title: 'English: Writing Mr. Fox & Spelling Bee prep',
    note: 'Writing Mr. Fox and final preparation for Wednesday Spelling Bee',
    arabicNote: 'درس لغة إنجليزية: تدريب كتابة (Writing Mr. Fox) والاستعداد النهائي لمسابقة Spelling Bee المقررة يوم الأربعاء.',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },

  // --- WEDNESDAY (Preparing on Tuesday evening) ---
  // G2B: Spelling Bee Competition (Round 1) - Wednesday Period 1
  {
    id: 'tn-b2-w1-english-wed-spellingbee-g2b',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Wednesday',
    subject: 'English',
    period: 1,
    title: '🐝 مسابقة Spelling Bee Competition (Round 1)',
    note: 'Spelling Bee Round 1 Competition (Block 2 - Week 1 Word List)',
    arabicNote: '🚨 مسابقة واختبار هام: غداً الأربعاء مسابقة التهجئة (Spelling Bee Competition - Round 1) لفصل G2B في حصة اللغة الإنجليزية! يرجى الاستعداد والتدريب الجيد على قائمة الـ 40 كلمة المرفقة.',
    bagItem: 'English Notebook (كشكول اللغة الإنجليزية)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 1,
    pdfUrl: '/materials/English-Grade2-B2-Week1-SpellingBee.html'
  },
  // G2A: Wednesday Period 7: Family members - My family story
  {
    id: 'tn-b2-w1-english-wed-family-g2a',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Wednesday',
    subject: 'English',
    period: 7,
    title: 'English: Family members & My family story',
    note: 'Family members - My family story',
    arabicNote: 'درس لغة إنجليزية: أفراد العائلة وقصة عائلتي (Family members - My family story).',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1
  },
  // G2C: Wednesday Period 4: Family members - My family story
  {
    id: 'tn-b2-w1-english-wed-family-g2c',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Wednesday',
    subject: 'English',
    period: 4,
    title: 'English: Family members & My family story',
    note: 'Family members - My family story',
    arabicNote: 'درس لغة إنجليزية: أفراد العائلة وقصة عائلتي (Family members - My family story).',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1
  },

  // --- THURSDAY (Preparing on Wednesday evening) ---
  {
    id: 'tn-b2-w1-english-thu-writing-g2a',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Thursday',
    subject: 'English',
    period: 6,
    title: 'English: Writing exercises',
    note: 'Writing exercises in Activity Book',
    arabicNote: 'درس لغة إنجليزية: تدريبات كتابة (Writing exercises) بكتاب النشاط ص 70.',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1
  },
  {
    id: 'tn-b2-w1-english-thu-myfamily-g2b',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Thursday',
    subject: 'English',
    period: 3,
    title: 'English: My Family story',
    note: 'Reading and writing about My Family',
    arabicNote: 'درس لغة إنجليزية: قصة عائلتي (My Family) وتدريبات كتاب النشاط ص 70.',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1
  },
  {
    id: 'tn-b2-w1-english-thu-writing-g2c',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Thursday',
    subject: 'English',
    period: 3,
    title: 'English: Writing Mr. Fox',
    note: 'Writing exercises on Mr. Fox and Activity Book P.70',
    arabicNote: 'درس لغة إنجليزية: تدريبات كتابة (Writing Mr. Fox) وتدريبات كتاب النشاط ص 70.',
    bagItem: "Pupil's Book & Activity Book",
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 1
  }
];

// Update both planner_data.json and initialData.json
['data/planner_data.json', 'src/data/initialData.json'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Filter out old Block 2 Week 1 tomorrow notes
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(n => !(n.block === 2 && n.week === 1));
    
    // Add new Block 2 Week 1 tomorrow notes
    data.tomorrowNotes.push(...b2w1TomorrowNotes);

    // Ensure Block 2 contains only uploaded subjects (English, Arabic, Science)
    data.classwork = (data.classwork || []).filter(c => !(c.block === 2 && c.subject !== 'English' && c.subject !== 'Arabic' && c.subject !== 'Science'));
    data.homework = (data.homework || []).filter(h => !(h.block === 2 && h.subject !== 'English' && h.subject !== 'Arabic' && h.subject !== 'Science'));
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(t => !(t.block === 2 && t.subject !== 'English' && t.subject !== 'Arabic' && t.subject !== 'Science'));
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${filePath}: ${data.classwork.length} cw, ${data.homework.length} hw, ${data.tomorrowNotes.length} tn`);
  }
});
