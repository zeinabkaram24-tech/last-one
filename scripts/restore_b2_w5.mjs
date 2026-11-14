import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const INIT_PATH = 'src/data/initialData.json';
const PLANNER_PATH = 'data/planner_data.json';

const SUPABASE_URL = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

const BLOCK = 2;
const WEEK = 5;

const cw = [];
const hw = [];
const tn = [];

// =========================================================================
// 1. ARABIC (Block 2 - Week 5: 8/11 - 12/11)
// =========================================================================
const arabicPeriods = {
  G2A: { Sunday: 7, Monday: 1, Tuesday: 8, Wednesday: 6, Thursday: 5 },
  G2B: { Sunday: 4, Monday: 8, Tuesday: 4, Wednesday: 4, Thursday: 8 },
  G2C: { Sunday: 6, Monday: 1, Tuesday: 7, Wednesday: 6, Thursday: 7 },
};

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  cw.push(
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-sun-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Sunday',
      period: arabicPeriods[cls].Sunday,
      subject: 'Arabic',
      title: 'الوحدة الثالثة (التسوق): قراءة درس أحمد في متجر الملابس الرياضية',
      details: 'الوحدة الثالثة (التسوق) - قراءة درس أحمد في متجر الملابس الرياضية واستخراج المفردات ومعاني الكلمات ومناقشة الفكرة الرئيسية.',
      pages: 'أوراق عمل الوحدة الثالثة ص 36-37',
      completed: false,
      block: BLOCK,
      week: WEEK,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-mon-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Monday',
      period: arabicPeriods[cls].Monday,
      subject: 'Arabic',
      title: 'الوحدة الثالثة (التسوق): المناقشة اللغوية لدرس أحمد في متجر الألعاب الرياضية + قراءة إعلان',
      details: 'الوحدة الثالثة (التسوق) - المناقشة اللغوية والتراكيب لدرس أحمد في متجر الألعاب الرياضية + تدريب قراءة إعلان وتحليل عناصره.',
      pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 38-39',
      completed: false,
      block: BLOCK,
      week: WEEK,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-tue-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Tuesday',
      period: arabicPeriods[cls].Tuesday,
      subject: 'Arabic',
      title: 'الوحدة الثالثة (التسوق): الفعل الماضي والمضارع',
      details: 'الوحدة الثالثة (التسوق) - شرح وتمييز الفعل الماضي والفعل المضارع وكيفية صياغتهما واستخدامهما في جمل مفيدة.',
      pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 40',
      completed: false,
      block: BLOCK,
      week: WEEK,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-wed-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Wednesday',
      period: arabicPeriods[cls].Wednesday,
      subject: 'Arabic',
      title: 'الوحدة الثالثة (التسوق): الجملة الاسمية والجملة الفعلية',
      details: 'الوحدة الثالثة (التسوق) - التعرف على الجملة الاسمية والجملة الفعلية والتمييز بينهما والتحويل من الجملة الاسمية إلى الفعلية والعكس.',
      pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 41',
      completed: false,
      block: BLOCK,
      week: WEEK,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-thu-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Thursday',
      period: arabicPeriods[cls].Thursday,
      subject: 'Arabic',
      title: 'الوحدة الثالثة (التسوق): نشاط استماع (الديك المغرور)',
      details: 'الوحدة الثالثة (التسوق) - استماع نص قصة (الديك المغرور) ومناقشة الدروس المستفادة وقيم القصة وحل أنشطة الفهم والاستيعاب.',
      pages: 'استماع النص + أوراق عمل الوحدة الثالثة ص 45',
      completed: false,
      block: BLOCK,
      week: WEEK,
    }
  );

  hw.push(
    {
      id: `hw-b2-w5-${cls.toLowerCase()}-sun-arabic`,
      classId: cls,
      class_id: cls,
      assignedDay: 'Sunday',
      assigned_day: 'Sunday',
      dueDay: 'Monday',
      due_day: 'Monday',
      subject: 'Arabic',
      task: 'كتابة الفقرة الأولى من درس (أحمد في متجر الملابس الرياضية)',
      title: 'كتابة الفقرة الأولى من درس (أحمد في متجر الملابس الرياضية)',
      details: 'الوحدة الثالثة (التسوق) - كتابة الفقرة الأولى من درس (أحمد في متجر الملابس الرياضية) بخط جميل ومرتب في كشكول اللغة العربية مع ضبط الحركات.',
      pages: 'كشكول اللغة العربية / كتابة الفقرة الأولى',
      completed: false,
      priority: 'normal',
      block: BLOCK,
      week: WEEK,
    },
    {
      id: `hw-b2-w5-${cls.toLowerCase()}-tue-arabic`,
      classId: cls,
      class_id: cls,
      assignedDay: 'Tuesday',
      assigned_day: 'Tuesday',
      dueDay: 'Wednesday',
      due_day: 'Wednesday',
      subject: 'Arabic',
      task: 'حل كراسة التكليفات المنزلية ص 62',
      title: 'حل كراسة التكليفات المنزلية ص 62',
      details: 'الوحدة الثالثة (التسوق) - إنجاز تدريبات درس الفعل الماضي والمضارع المقررة في كراسة التكليفات المنزلية ص 62.',
      pages: 'كراسة التكليفات المنزلية ص 62',
      completed: false,
      priority: 'normal',
      block: BLOCK,
      week: WEEK,
    }
  );
});

// =========================================================================
// 2. ENGLISH (Block 2 - Week 5: 8/11 - 12/11)
// Periods strictly matched to src/data/timetables.ts
// =========================================================================
const dictationPdfUrl = '/assets/aistudio/English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';
const dictationPdfName = 'English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';

const englishPeriods = {
  G2A: { Sunday: 1, Monday: 4, Tuesday: 7, Wednesday: 7, Thursday: 6 },
  G2B: { Sunday: 1, Monday: 5, Tuesday: 7, Wednesday: 1, Thursday: 3 },
  G2C: { Sunday: 4, Monday: 5, Tuesday: 4, Wednesday: 4, Thursday: 4 },
};

const dictationWordsArabic = `📝 قائمة كلمات الإملاء المقررة (Dictation List - 11 كلمة):
1. Cinema
2. Post Office
3. Hospital
4. Flat
5. Shop
6. Cafe
7. Police Station
8. Park
9. Restaurant
10. Street
11. School

💡 Helping Words (كلمات مساعدة لتكوين الجمل):
• next to • in front of • behind • across from • the

⭐ تنبيه هام من المعلمة:
Always start with a capital letter and end with a full stop.
(يجب دائماً أن تبدأ الجملة بحرف كبير Capital Letter وتنتهي بنقطة Full Stop).`;

cw.push(
  // Sunday
  {
    id: 'cw-b2-w5-g2a-sun-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: englishPeriods.G2A.Sunday,
    subject: 'English',
    title: 'Present Continuous',
    details: 'Unit: My town. Grammar focus: Present Continuous tense rules and sentence structure. Classwork exercises on pages CW. 57, 58.',
    pages: 'CW. 57, 58',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-sun-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: englishPeriods.G2B.Sunday,
    subject: 'English',
    title: 'Reading & Listening',
    details: 'Unit: My town. Focus on Reading & Listening comprehension skills. Classwork exercises on pages CW. 59, 60.',
    pages: 'CW. 59, 60',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-sun-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: englishPeriods.G2C.Sunday,
    subject: 'English',
    title: 'Present Continuous',
    details: 'Unit: My town. Grammar focus: Present Continuous tense rules and practice. Classwork exercises on pages CW. 57, 58.',
    pages: 'CW. 57, 58',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // Monday
  {
    id: 'cw-b2-w5-g2a-mon-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: englishPeriods.G2A.Monday,
    subject: 'English',
    title: 'Movers Story',
    details: 'Unit: My town. Movers story reading, vocabulary discussion, and comprehension exercises on pages CW. 61, 62.',
    pages: 'CW. 61, 62',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-mon-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: englishPeriods.G2B.Monday,
    subject: 'English',
    title: 'Present Continuous',
    details: 'Unit: My town. Grammar focus: Present Continuous rules and usage. Classwork exercises on pages CW. 57, 58.',
    pages: 'CW. 57, 58',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-mon-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: englishPeriods.G2C.Monday,
    subject: 'English',
    title: 'Outdoor Activity',
    details: 'Unit: My town. Outdoor interactive language activity and communication practice.',
    pages: 'Outdoor Activity',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // Tuesday
  {
    id: 'cw-b2-w5-g2a-tue-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: englishPeriods.G2A.Tuesday,
    subject: 'English',
    title: 'Reading & Listening',
    details: 'Unit: My town. Reading comprehension and active listening skills. Classwork exercises on pages CW. 59, 60.',
    pages: 'CW. 59, 60',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-tue-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: englishPeriods.G2B.Tuesday,
    subject: 'English',
    title: '📝 Dictation & Movers Story',
    details: 'Unit: My town. 📝 Weekly Dictation in Copy Book on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School) + Movers Story on pages CW. 61, 62.',
    pages: 'Copy Book, CW. 61, 62',
    completed: false,
    block: BLOCK,
    week: WEEK,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  },
  {
    id: 'cw-b2-w5-g2c-tue-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: englishPeriods.G2C.Tuesday,
    subject: 'English',
    title: '📝 Dictation',
    details: 'Unit: My town. 📝 Weekly Dictation in Copy Book on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School).',
    pages: 'Copy Book',
    completed: false,
    block: BLOCK,
    week: WEEK,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  },
  // Wednesday
  {
    id: 'cw-b2-w5-g2a-wed-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: englishPeriods.G2A.Wednesday,
    subject: 'English',
    title: 'Outdoor Activity',
    details: 'Unit: My town. Outdoor interactive language activity and collaborative exercises.',
    pages: 'Outdoor Activity',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-wed-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: englishPeriods.G2B.Wednesday,
    subject: 'English',
    title: 'Story Comprehension',
    details: 'Unit: My town. Story reading, vocabulary exploration, and comprehension discussion.',
    pages: 'Story',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-wed-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: englishPeriods.G2C.Wednesday,
    subject: 'English',
    title: 'Movers Story',
    details: 'Unit: My town. Movers reading and story comprehension exercises on pages CW. 61, 62.',
    pages: 'CW. 61, 62',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // Thursday
  {
    id: 'cw-b2-w5-g2a-thu-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: englishPeriods.G2A.Thursday,
    subject: 'English',
    title: '📝 Dictation',
    details: 'Unit: My town. 📝 Weekly Dictation in Copy Book for Class 2A on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School).',
    pages: 'Copy Book',
    completed: false,
    block: BLOCK,
    week: WEEK,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  },
  {
    id: 'cw-b2-w5-g2b-thu-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: englishPeriods.G2B.Thursday,
    subject: 'English',
    title: 'Outdoor Activity',
    details: 'Unit: My town. Outdoor interactive communicative language activity.',
    pages: 'Outdoor Activity',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-thu-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: englishPeriods.G2C.Thursday,
    subject: 'English',
    title: 'Reading & Listening',
    details: 'Unit: My town. Reading comprehension and listening activities on pages CW. 59, 60.',
    pages: 'CW. 59, 60',
    completed: false,
    block: BLOCK,
    week: WEEK,
  }
);

// Monday Extra Sheet for all classes
['G2A', 'G2B', 'G2C'].forEach((cls) => {
  hw.push({
    id: `hw-b2-w5-${cls.toLowerCase()}-mon-english-extrasheet`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'English',
    task: 'English Extra Sheet (Uploaded with Answer Key A.k)',
    title: 'English Extra Sheet (with Answer Key)',
    details: 'Unit: My town. Solve the English Extra Sheet. An answer key (A.k) is uploaded for reference and checking.',
    pages: 'Extra Sheet (with A.k)',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  });
});

// Thursday P.88,89 for G2A
hw.push({
  id: 'hw-b2-w5-g2a-thu-english-p88-89',
  classId: 'G2A',
  class_id: 'G2A',
  assignedDay: 'Thursday',
  assigned_day: 'Thursday',
  dueDay: 'Sunday',
  due_day: 'Sunday',
  subject: 'English',
  task: 'English Homework: Solve Workbook Pages 88 & 89',
  title: 'Solve Workbook Pages 88 & 89',
  details: 'Unit: My town. Complete all exercises on pages P. 88 and 89 in the English workbook / activity book.',
  pages: 'P. 88, 89',
  completed: false,
  priority: 'normal',
  block: BLOCK,
  week: WEEK,
});

// Dictation study tasks for G2B/G2C (Sat-Mon -> Tue) and G2A (Sat-Wed -> Thu)
['G2B', 'G2C'].forEach((cls) => {
  ['Saturday', 'Sunday', 'Monday'].forEach((day) => {
    const isNightBefore = day === 'Monday';
    hw.push({
      id: `hw-b2-w5-${cls.toLowerCase()}-${day.toLowerCase()}-dictation`,
      classId: cls,
      class_id: cls,
      assignedDay: day,
      assigned_day: day,
      dueDay: 'Tuesday',
      due_day: 'Tuesday',
      subject: 'English',
      task: `🚨 Dictation List: Prepare for English Dictation on Tuesday (${cls})!`,
      title: `English Dictation on Tuesday (${cls}) - 11 Words`,
      details: isNightBefore
        ? `🚨 تنبيه عاجل: غداً الثلاثاء موعد اختبار إملاء مادة اللغة الإنجليزية لكلاس (${cls}) في كشكول الإملاء (Copy Book)! يرجى تجهيز الكشكول وقلم رصاص وممحاة.\n\n${dictationWordsArabic}`
        : `🚨 تنبيه واستعداد لاختبار الإملاء: إملاء مادة اللغة الإنجليزية يوم الثلاثاء لكلاس (${cls}) في كشكول الإملاء (Copy Book).\n\n${dictationWordsArabic}`,
      pages: 'Dictation Study Sheet (11 Words + Helping Words)',
      completed: false,
      priority: isNightBefore ? 'urgent' : 'high',
      block: BLOCK,
      week: WEEK,
      pdfUrl: dictationPdfUrl,
      pdf_url: dictationPdfUrl,
      pdfUrls: [dictationPdfUrl],
      attachment: dictationPdfUrl,
      attachmentName: dictationPdfName,
    });
  });
});

['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'].forEach((day) => {
  const isNightBefore = day === 'Wednesday';
  hw.push({
    id: `hw-b2-w5-g2a-${day.toLowerCase()}-dictation`,
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: day,
    assigned_day: day,
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'English',
    task: '🚨 Dictation List: Prepare for English Dictation on Thursday (Class 2A)!',
    title: 'English Dictation on Thursday (Class 2A) - 11 Words',
    details: isNightBefore
      ? `🚨 تنبيه عاجل: غداً الخميس موعد اختبار إملاء مادة اللغة الإنجليزية لكلاس 2A في كشكول الإملاء (Copy Book)! يرجى تجهيز الكشكول وقلم رصاص وممحاة.\n\n${dictationWordsArabic}`
      : `🚨 تنبيه واستعداد لاختبار الإملاء: إملاء مادة اللغة الإنجليزية يوم الخميس لكلاس 2A في كشكول الإملاء (Copy Book).\n\n${dictationWordsArabic}`,
    pages: 'Dictation Study Sheet (11 Words + Helping Words)',
    completed: false,
    priority: isNightBefore ? 'urgent' : 'high',
    block: BLOCK,
    week: WEEK,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    pdfUrls: [dictationPdfUrl],
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  });
});

tn.push(
  {
    id: 'tn-b2-w5-g2b-tue-dictation',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Tuesday',
    subject: 'English',
    period: englishPeriods.G2B.Tuesday,
    title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الثلاثاء (Class 2B)',
    note: '🚨 Tomorrow Tuesday is English Dictation for Class 2B in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
    arabicNote: `🚨 إنذار وتنبيه هام: غداً الثلاثاء موعد اختبار الإملاء (English Dictation) لكلاس 2B في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
    bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: BLOCK,
    week: WEEK,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    pdfUrls: [dictationPdfUrl],
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  },
  {
    id: 'tn-b2-w5-g2c-tue-dictation',
    classId: 'G2C',
    class_id: 'G2C',
    targetDay: 'Tuesday',
    subject: 'English',
    period: englishPeriods.G2C.Tuesday,
    title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الثلاثاء (Class 2C)',
    note: '🚨 Tomorrow Tuesday is English Dictation for Class 2C in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
    arabicNote: `🚨 إنذار وتنبيه هام: غداً الثلاثاء موعد اختبار الإملاء (English Dictation) لكلاس 2C في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
    bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: BLOCK,
    week: WEEK,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    pdfUrls: [dictationPdfUrl],
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  },
  {
    id: 'tn-b2-w5-g2a-thu-dictation',
    classId: 'G2A',
    class_id: 'G2A',
    targetDay: 'Thursday',
    subject: 'English',
    period: englishPeriods.G2A.Thursday,
    title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الخميس (Class 2A)',
    note: '🚨 Tomorrow Thursday is English Dictation for Class 2A in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
    arabicNote: `🚨 إنذار وتنبيه هام: غداً الخميس موعد اختبار الإملاء (English Dictation) لكلاس 2A في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
    bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: BLOCK,
    week: WEEK,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    pdfUrls: [dictationPdfUrl],
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  }
);

// =========================================================================
// 3. FRENCH (Block 2 - Week 5: 8/11 - 12/11)
// Periods strictly matched to src/data/timetables.ts (G2B Sunday -> P3)
// =========================================================================
cw.push(
  // G2A: Tue 1, Wed 4, Thu 3
  {
    id: 'cw-b2-w5-g2a-tue-french-c1',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 1,
    subject: 'French',
    title: 'Unité 4: Où habites-tu ? (Cours 1)',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre à poser et répondre à la question: Où habites-tu ? (Fiche de classe).',
    pages: 'Fiche de classe',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2a-wed-french-c2',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4: Où habites-tu ? Compréhension orale (Cours 2)',
    details: 'Unité 4: La petite sœur de Lilly - Activités de compréhension orale et d’écoute: Où habites-tu ? (Fiche de classe).',
    pages: 'Fiche de classe',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2a-thu-french-c3',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 3,
    subject: 'French',
    title: 'Unité 4: Production orale et Écrite (Cours 3)',
    details: 'Unité 4: La petite sœur de Lilly - Production orale et écrite. Expression guidée (Fiche de classe). Devoir: p. 54.',
    pages: 'Fiche de classe (Devoir p. 54)',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // G2B: Sun 3, Mon 7, Thu 5
  {
    id: 'cw-b2-w5-g2b-sun-french-c1',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 3,
    subject: 'French',
    title: 'Unité 4: Où habites-tu ? (Cours 1)',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre à poser et répondre à la question: Où habites-tu ? (Fiche de classe).',
    pages: 'Fiche de classe',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-mon-french-c2',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 7,
    subject: 'French',
    title: 'Unité 4: Où habites-tu ? Compréhension orale (Cours 2)',
    details: 'Unité 4: La petite sœur de Lilly - Activités de compréhension orale et d’écoute: Où habites-tu ? (Fiche de classe).',
    pages: 'Fiche de classe',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-thu-french-c3',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: Production orale et Écrite (Cours 3)',
    details: 'Unité 4: La petite sœur de Lilly - Production orale et écrite. Expression guidée (Fiche de classe). Devoir: p. 54.',
    pages: 'Fiche de classe (Devoir p. 54)',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // G2C: Sun 8, Tue 6, Wed 2
  {
    id: 'cw-b2-w5-g2c-sun-french-c1',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 8,
    subject: 'French',
    title: 'Unité 4: Où habites-tu ? (Cours 1)',
    details: 'Unité 4: La petite sœur de Lilly - Apprendre à poser et répondre à la question: Où habites-tu ? (Fiche de classe).',
    pages: 'Fiche de classe',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-tue-french-c2',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 6,
    subject: 'French',
    title: 'Unité 4: Où habites-tu ? Compréhension orale (Cours 2)',
    details: 'Unité 4: La petite sœur de Lilly - Activités de compréhension orale et d’écoute: Où habites-tu ? (Fiche de classe).',
    pages: 'Fiche de classe',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-wed-french-c3',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 2,
    subject: 'French',
    title: 'Unité 4: Production orale et Écrite (Cours 3)',
    details: 'Unité 4: La petite sœur de Lilly - Production orale et écrite. Expression guidée (Fiche de classe). Devoir: p. 54.',
    pages: 'Fiche de classe (Devoir p. 54)',
    completed: false,
    block: BLOCK,
    week: WEEK,
  }
);

hw.push(
  {
    id: 'hw-b2-w5-g2a-thu-french-p54',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Thursday',
    assigned_day: 'Thursday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p. 54 📝',
    title: 'Devoir de français: Fiche de devoir p. 54',
    details: 'Unité 4: La petite sœur de Lilly - Résoudre les exercices de la fiche de devoir page 54 (Production orale et écrite).',
    pages: 'Fiche de devoir p. 54',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'hw-b2-w5-g2b-thu-french-p54',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Thursday',
    assigned_day: 'Thursday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p. 54 📝',
    title: 'Devoir de français: Fiche de devoir p. 54',
    details: 'Unité 4: La petite sœur de Lilly - Résoudre les exercices de la fiche de devoir page 54 (Production orale et écrite).',
    pages: 'Fiche de devoir p. 54',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'hw-b2-w5-g2c-wed-french-p54',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay: 'Sunday',
    due_day: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p. 54 📝',
    title: 'Devoir de français: Fiche de devoir p. 54',
    details: 'Unité 4: La petite sœur de Lilly - Résoudre les exercices de la fiche de devoir page 54 (Production orale et écrite).',
    pages: 'Fiche de devoir p. 54',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  }
);

// =========================================================================
// 4. MATHEMATICS (Block 2 - Week 5: 8/11 - 12/11) — NO Math PDFs attached!
// =========================================================================
const mathPeriods = {
  G2A: { Sunday: 3, Monday: 8, Tuesday: 3, Wednesday: 1, Thursday: 2 },
  G2B: { Sunday: 2, Monday: 3, Tuesday: 1, Wednesday: 5, Thursday: 6 },
  G2C: { Sunday: 1, Monday: 8, Tuesday: 3, Wednesday: 7, Thursday: 6 },
};

const mathLessons = [
  {
    day: 'Sunday',
    key: 'sun',
    title: 'Unit 8: Using data — Lesson 1: Use tally charts, simple frequency tables, pictograms and bar charts',
    details: 'Unit 8: Using data - Lesson 1: Use tally charts, simple frequency tables, pictograms and bar charts. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwPage: '108',
    dueDay: 'Monday',
  },
  {
    day: 'Monday',
    key: 'mon',
    title: 'Unit 8: Using data — Follow Lesson 1: Use tally charts, simple frequency tables, pictograms and bar charts',
    details: 'Unit 8: Using data - Follow Lesson 1: Use tally charts, simple frequency tables, pictograms and bar charts. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwPage: null,
  },
  {
    day: 'Tuesday',
    key: 'tue',
    title: 'Unit 8: Using data — Test your self (Math Assessment / Test)',
    details: 'Unit 8: Using data - Test your self (Assessment). Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwPage: '107',
    dueDay: 'Wednesday',
  },
  {
    day: 'Wednesday',
    key: 'wed',
    title: 'Unit 9: Solving problems — Lesson 1: Solve single-step word problems',
    details: 'Unit 9: Solving problems - Lesson 1: Solve single-step word problems. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwPage: '110',
    dueDay: 'Thursday',
  },
  {
    day: 'Thursday',
    key: 'thu',
    title: 'Unit 9: Solving problems — Lesson 2: Check the results of adding two numbers by using subtraction and adding them in a different order',
    details: 'Unit 9: Solving problems - Lesson 2: Check the results of adding two numbers by using subtraction and adding them in a different order. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwPage: '111',
    dueDay: 'Sunday',
  },
];

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  mathLessons.forEach((l) => {
    cw.push({
      id: `cw-b2-w5-${cls.toLowerCase()}-${l.key}-math`,
      classId: cls,
      class_id: cls,
      day: l.day,
      period: mathPeriods[cls][l.day],
      subject: 'Mathematics',
      title: l.title,
      details: `${l.details} • المعلمة: ${cls === 'G2C' ? 'Mrs. Sandy Samir' : 'Mrs. Mariam Samir'}`,
      pages: l.pages,
      completed: false,
      block: BLOCK,
      week: WEEK,
    });

    if (l.hwPage) {
      hw.push({
        id: `hw-b2-w5-${cls.toLowerCase()}-${l.key}-math`,
        classId: cls,
        class_id: cls,
        assignedDay: l.day,
        assigned_day: l.day,
        dueDay: l.dueDay,
        due_day: l.dueDay,
        subject: 'Mathematics',
        task: `Math Homework — Page ${l.hwPage}`,
        title: `Math Homework — Page ${l.hwPage}`,
        details: `Solve exercises on Page ${l.hwPage} in Maths-Grade2-B2-All-Sheet2 – Main.`,
        pages: `P. ${l.hwPage}`,
        completed: false,
        priority: 'normal',
        block: BLOCK,
        week: WEEK,
      });
    }
  });

  // Math Test (Test your self) on Tuesday -> Tomorrow alert on Monday evening
  tn.push({
    id: `tn-b2-w5-math-test-${cls}-Monday`,
    classId: cls,
    class_id: cls,
    targetDay: 'Tuesday',
    subject: 'Mathematics',
    period: mathPeriods[cls].Tuesday,
    title: '🚨 اختبار ماث غداً (Math Test: Test your self - Unit 8)',
    note: 'Math Test (Test your self): Unit 8 Using data (Maths-Grade2-B2-All-Sheet2 - Main)',
    arabicNote: 'تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء على الوحدة الثامنة (Unit 8: Using data). يرجى المراجعة والاستعداد.',
    bagItem: 'Math Sheet + Math Notebook / Pencils',
    isQuiz: true,
    categoryType: 'quiz',
    block: BLOCK,
    week: WEEK,
  });
});

// =========================================================================
// 5. SCIENCE (Block 2 - Week 5: 8/11 - 12/11) — STRICTLY ZERO PDFs!
// Aligned to timetables.ts (Nov 6):
// G2A: Sun P6, Tue P5, Thu P8 | G2B: Sun P5, Wed P7, Thu P7 | G2C: Sun P3, Mon P4, Thu P1
// =========================================================================
cw.push(
  // G2A
  {
    id: 'cw-b2-w5-g2a-sun-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 6,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials',
    details: 'Unit 4: Exploring and using materials - Lesson: The properties of materials (Page 52). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Page 52',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2a-tue-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 5,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The magnets',
    details: 'Unit 4: Exploring and using materials - Lesson: The magnets (Page 50). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Page 50',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2a-thu-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 8,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — General revision on Unit 3',
    details: 'General revision on Unit 3 (Rocks). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Unit 3 Revision',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // G2B
  {
    id: 'cw-b2-w5-g2b-sun-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 5,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials',
    details: 'Unit 4: Exploring and using materials - Lesson: The properties of materials (Page 52). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Page 52',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-wed-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 7,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The magnets',
    details: 'Unit 4: Exploring and using materials - Lesson: The magnets (Page 50). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Page 50',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-thu-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 7,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — General revision on Unit 3',
    details: 'General revision on Unit 3 (Rocks). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Unit 3 Revision',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // G2C
  {
    id: 'cw-b2-w5-g2c-sun-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 3,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — Types of materials',
    details: 'Unit 4: Exploring and using materials - Lesson: Types of materials (Page 47). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Page 47',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-mon-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 4,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials',
    details: 'Unit 4: Exploring and using materials - Lesson: The properties of materials (Page 52). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Page 52',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-thu-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 1,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — General revision on Unit 3',
    details: 'General revision on Unit 3 (Rocks). • المعلمة: Mrs. Salma Ahmed',
    pages: 'Unit 3 Revision',
    completed: false,
    block: BLOCK,
    week: WEEK,
  }
);

hw.push(
  {
    id: 'hw-b2-w5-g2a-mon-science',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'Science',
    task: 'Science Homework: Pages 48 & 53 (The properties of materials)',
    title: 'Science Homework: Pages 48 & 53',
    details: 'Unit 4: Exploring and using materials. Solve exercises on Pages 48 and 53 in Science Booklet.',
    pages: 'Pages 48 & 53',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'hw-b2-w5-g2b-mon-science',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Wednesday',
    due_day: 'Wednesday',
    subject: 'Science',
    task: 'Science Homework: Pages 48 & 53 (The properties of materials)',
    title: 'Science Homework: Pages 48 & 53',
    details: 'Unit 4: Exploring and using materials. Solve exercises on Pages 48 and 53 in Science Booklet.',
    pages: 'Pages 48 & 53',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'hw-b2-w5-g2c-mon-science',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework: Page 53 (The properties of materials)',
    title: 'Science Homework: Page 53',
    details: 'Unit 4: Exploring and using materials. Solve exercises on Page 53 in Science Booklet.',
    pages: 'Page 53',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'hw-b2-w5-g2b-wed-science',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework: Page 51 (The magnets)',
    title: 'Science Homework: Page 51',
    details: 'Unit 4: Exploring and using materials. Solve exercises on Page 51 in Science Booklet (Class 2B only; Class 2C is not included).',
    pages: 'Page 51',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
  }
);

// =========================================================================
// 6. SOCIAL STUDIES (Block 2 - Week 5: 8/11 - 12/11)
// =========================================================================
const ssHw4Pdf = '/materials/SocialStudies-Grade2-B2-W4-U2-HomeWork4 - Extra- (Minia).pdf';
const ssHw4FileName = 'SocialStudies-Grade2-B2-W4-U2-HomeWork4 - Extra- (Minia).pdf';
const ssHw5Pdf = '/materials/SocialStudies-Grade2-B2-W5-U2-HomeWork5 - Extra- (Minia).pdf';
const ssHw5FileName = 'SocialStudies-Grade2-B2-W5-U2-HomeWork5 - Extra- (Minia).pdf';

cw.push(
  // Sun 8/11: G2A P8, G2C P7
  {
    id: 'cw-b2-w5-g2a-sun-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 8,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة الاتجاهات',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة الاتجاهات (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ ولاء فايز',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-sun-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 7,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة الاتجاهات',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة الاتجاهات (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // Mon 9/11: G2B P1
  {
    id: 'cw-b2-w5-g2b-mon-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 1,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة الاتجاهات',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة الاتجاهات (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // Wed 11/11: G2A P5, G2B P8, G2C P1
  {
    id: 'cw-b2-w5-g2a-wed-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 5,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة مسئوليتي تجاه مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة مسئوليتي تجاه مدرستي (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ ولاء فايز',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-wed-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 8,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة مسئوليتي تجاه مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة مسئوليتي تجاه مدرستي (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-wed-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 1,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة مسئوليتي تجاه مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة مسئوليتي تجاه مدرستي (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  // Thu 12/11: G2A P7, G2B P2, G2C P3
  {
    id: 'cw-b2-w5-g2a-thu-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 7,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة شخصيات المدرسة',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة شخصيات المدرسة (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ ولاء فايز',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2b-thu-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 2,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة شخصيات المدرسة',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة شخصيات المدرسة (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  },
  {
    id: 'cw-b2-w5-g2c-thu-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 3,
    subject: 'Social Studies',
    title: 'الوحدة الثانية: المجتمع المدرسي — مراجعة شخصيات المدرسة',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة شخصيات المدرسة (أوراق يتم تقديمها للطلاب من المعلمة). • المعلمة: أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: BLOCK,
    week: WEEK,
  }
);

// HW4 at start of W5 (Sat for A/C -> Sun, Sun for B -> Mon)
[
  { cls: 'G2A', assignedDay: 'Saturday', dueDay: 'Sunday', period: 8 },
  { cls: 'G2C', assignedDay: 'Saturday', dueDay: 'Sunday', period: 7 },
  { cls: 'G2B', assignedDay: 'Sunday', dueDay: 'Monday', period: 1 },
].forEach(({ cls, assignedDay, dueDay, period }) => {
  hw.push({
    id: `hw-b2-w5-${cls.toLowerCase()}-${assignedDay.toLowerCase().slice(0, 3)}-social-hw4`,
    classId: cls,
    class_id: cls,
    assignedDay,
    assigned_day: assignedDay,
    dueDay,
    due_day: dueDay,
    subject: 'Social Studies',
    task: 'شيت واجب الدراسات الاجتماعية - الوحدة الثانية (Home Work 4): المدرسة قديماً وحديثاً 📄',
    title: 'شيت واجب الدراسات الاجتماعية - الوحدة الثانية (Home Work 4)',
    details: 'حل شيت واجب الدراسات الاجتماعية المرفق (Home Work 4: مقارنة المدرسة قديماً وحديثاً) وتسليمه أول حصة.',
    pages: 'Home Work 4 (ص 1 و 2)',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
    pdfUrl: ssHw4Pdf,
    pdf_url: ssHw4Pdf,
    attachment: ssHw4Pdf,
    fileName: ssHw4FileName,
  });

  tn.push({
    id: `tn-b2-w5-${cls.toLowerCase()}-${dueDay.toLowerCase().slice(0, 3)}-social-hw4`,
    classId: cls,
    class_id: cls,
    targetDay: dueDay,
    subject: 'Social Studies',
    period,
    title: '🌍 تسليم شيت واجب الدراسات الاجتماعية (Home Work 4)',
    note: 'Submit Social Studies Home Work 4 sheet (School in the past vs modern school)',
    arabicNote: `تذكير هام لمادة الدراسات الاجتماعية: تسليم شيت الواجب (Home Work 4 - المدرسة قديماً وحديثاً) المرفق غداً ${dueDay === 'Sunday' ? 'الأحد' : 'الإثنين'} في أول حصة دراسات.`,
    bagItem: 'شيت واجب الدراسات الاجتماعية (Home Work 4)',
    isQuiz: false,
    categoryType: 'note',
    block: BLOCK,
    week: WEEK,
    pdfUrl: ssHw4Pdf,
    pdf_url: ssHw4Pdf,
    fileName: ssHw4FileName,
  });
});

// Wednesday LMS HW5 sent on Wednesday 11/11 (collected first session of next week W6)
[
  { cls: 'G2A', dueDay: 'Sunday' },
  { cls: 'G2B', dueDay: 'Monday' },
  { cls: 'G2C', dueDay: 'Sunday' },
].forEach(({ cls, dueDay }) => {
  hw.push({
    id: `hw-b2-w5-${cls.toLowerCase()}-wed-social-hw5`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay,
    due_day: dueDay,
    subject: 'Social Studies',
    task: 'واجب الدراسات الاجتماعية (LMS - يوم الأربعاء): شيت الاتجاهات وشخصيات المدرسة (Home Work 5) 📄',
    title: 'واجب الدراسات الاجتماعية (Home Work 5)',
    details: 'الوحدة الثانية: المجتمع المدرسي - يتم إرسال الواجب على LMS يوم الأربعاء (شيت Home Work 5: الاتجاهات الأصلية والفرعية وشخصيات المدرسة) ويتم استلام الواجبات أول حصة الأسبوع القادم.',
    pages: 'LMS / Home Work 5 (ص 1 و 2)',
    completed: false,
    priority: 'normal',
    block: BLOCK,
    week: WEEK,
    pdfUrl: ssHw5Pdf,
    pdf_url: ssHw5Pdf,
    attachment: ssHw5Pdf,
    fileName: ssHw5FileName,
  });
});

// =========================================================================
// 7. ICT (Block 2 - Week 5: 8/11 - 12/11) — STRICTLY ZERO PDFs!
// Periods strictly matched to src/data/timetables.ts (G2A Sun P4, G2B Sun P6)
// =========================================================================
const ictSchedule = {
  G2A: [
    { day: 'Sunday', dayAr: 'الأحد', period: 4, teacher: 'Mariem' },
    { day: 'Tuesday', dayAr: 'الثلاثاء', period: 6, teacher: 'Mariem' },
    { day: 'Wednesday', dayAr: 'الأربعاء', period: 2, teacher: 'Mariem', isLast: true, dueDay: 'Sunday' },
  ],
  G2B: [
    { day: 'Sunday', dayAr: 'الأحد', period: 6, teacher: 'Mariem' },
    { day: 'Tuesday', dayAr: 'الثلاثاء', period: 3, teacher: 'Mariem' },
    { day: 'Thursday', dayAr: 'الخميس', period: 1, teacher: 'Mariem', isLast: true, dueDay: 'Sunday' },
  ],
  G2C: [
    { day: 'Monday', dayAr: 'الإثنين', period: 7, teacher: 'Abeer' },
    { day: 'Tuesday', dayAr: 'الثلاثاء', period: 1, teacher: 'Abeer' },
    { day: 'Thursday', dayAr: 'الخميس', period: 2, teacher: 'Abeer', isLast: true, dueDay: 'Monday' },
  ],
};

const ictSessions = [
  {
    title: 'Unit 2: Communicating with Email & E-safety — Session 1 (Review & Practical Lab Practice)',
    details: 'Unit: Communicating with Email & E-safety. Topics: Comprehensive review of Email components, sending/receiving messages, safe email etiquette, and avoiding online risks. Hands-on computer lab session.',
    pages: 'Study sheet W5, ICT Booklet',
  },
  {
    title: 'Unit 2: Data Privacy, Strong Passwords & Safe Browsing — Session 2',
    details: 'Unit: Communicating with Email & E-safety. Topics: Practical lab exercises on distinguishing public vs private data, constructing strong passwords, and safe online navigation rules.',
    pages: 'Study sheet W5, ICT Booklet',
  },
  {
    title: 'Unit 2: Practical Lab Project & Evaluation — Session 3',
    details: 'Unit: Communicating with Email & E-safety. Topics: Evaluation of practical typing and computer skills, completing the end-of-unit review. Homework assigned on Session 3: ICT Homework W5.',
    pages: 'ICT Booklet / Study Sheet W5',
  },
];

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  ictSchedule[cls].forEach((slot, idx) => {
    const sess = ictSessions[idx];
    cw.push({
      id: `cw-b2-w5-${cls.toLowerCase()}-${slot.day.toLowerCase()}-p${slot.period}-ict`,
      classId: cls,
      class_id: cls,
      day: slot.day,
      period: slot.period,
      subject: 'ICT',
      title: sess.title,
      details: `${sess.details} • المعلمة: ${slot.teacher}`,
      pages: sess.pages,
      completed: false,
      block: BLOCK,
      week: WEEK,
    });

    if (slot.isLast) {
      hw.push({
        id: `hw-b2-w5-${cls.toLowerCase()}-${slot.day.toLowerCase()}-ict`,
        classId: cls,
        class_id: cls,
        assignedDay: slot.day,
        assigned_day: slot.day,
        dueDay: slot.dueDay,
        due_day: slot.dueDay,
        subject: 'ICT',
        task: 'ICT Homework W5 (Unit 2 Practical Review & Exercises)',
        title: 'ICT Homework W5 (Unit 2 Practical Review & Exercises)',
        details: 'Unit: Communicating with Email & E-safety. Complete the Unit 2 review exercises in the ICT study sheet / booklet.',
        pages: 'ICT Booklet W5',
        completed: false,
        priority: 'normal',
        block: BLOCK,
        week: WEEK,
      });
    }

    tn.push({
      id: `tn-b2-w5-ict-supplies-${cls}-${slot.day.toLowerCase()}-p${slot.period}`,
      classId: cls,
      class_id: cls,
      targetDay: slot.day,
      subject: 'ICT',
      period: slot.period,
      title: '🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)',
      note: 'Please ensure the students bring: ICT sheet, Flash drive',
      arabicNote: `تذكير حصة الـ ICT غداً ${slot.dayAr} في الحصة (${slot.period}): يرجى إحضار (ICT sheet - Flash drive).`,
      bagItem: 'ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)',
      isQuiz: false,
      categoryType: 'supplies',
      block: BLOCK,
      week: WEEK,
    });
  });
});

// =========================================================================
// 8. UPDATE BOTH LOCAL JSON STORES (preserving all other weeks & B2W6!)
// =========================================================================
const isB2W5 = (x) => Number(x.block || 1) === 2 && Number(x.week || 1) === 5;
const cleanW5Deleted = (arr) =>
  (Array.isArray(arr) ? arr : []).filter((id) => !String(id).toLowerCase().includes('b2-w5'));

const initData = JSON.parse(fs.readFileSync(INIT_PATH, 'utf8'));
const plannerData = JSON.parse(fs.readFileSync(PLANNER_PATH, 'utf8'));

for (const store of [initData, plannerData]) {
  store.classwork = [...(store.classwork || []).filter((x) => !isB2W5(x)), ...cw];
  store.homework = [...(store.homework || []).filter((x) => !isB2W5(x)), ...hw];
  store.tomorrowNotes = [...(store.tomorrowNotes || []).filter((x) => !isB2W5(x)), ...tn];
  if (Array.isArray(store.specialTeacherNotes)) {
    store.specialTeacherNotes = [...store.specialTeacherNotes.filter((x) => !isB2W5(x)), ...tn];
  }
  if (store.deletedPlannerItemIds) {
    store.deletedPlannerItemIds = cleanW5Deleted(store.deletedPlannerItemIds);
  }
  if (store.deletedTomorrowNoteIds) {
    store.deletedTomorrowNoteIds = cleanW5Deleted(store.deletedTomorrowNoteIds);
  }
}

fs.writeFileSync(INIT_PATH, JSON.stringify(initData, null, 2), 'utf8');
fs.writeFileSync(PLANNER_PATH, JSON.stringify(plannerData, null, 2), 'utf8');

console.log(`✅ Restored B2W5 in JSON stores: CW=${cw.length}, HW=${hw.length}, TN=${tn.length}`);
console.log(`✅ Verified B2W6 intact in initialData: CW=${initData.classwork.filter(x=>x.block===2&&x.week===6).length}, HW=${initData.homework.filter(x=>x.block===2&&x.week===6).length}, TN=${initData.tomorrowNotes.filter(x=>x.block===2&&x.week===6).length}`);

// =========================================================================
// 9. SYNC B2W5 DIRECTLY TO LIVE SUPABASE (without touching B2W6!)
// =========================================================================
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function packHomeworkDetails(details, pdfUrl) {
  let res = details ? String(details).trim() : '';
  if (pdfUrl) {
    res = res ? `${res} ||PDF_URL:${pdfUrl.trim()}` : `||PDF_URL:${pdfUrl.trim()}`;
  }
  return res || null;
}

(async () => {
  await sb.from('classwork').delete().eq('block', 2).eq('week', 5);
  await sb.from('homework').delete().eq('block', 2).eq('week', 5);

  const cwRows = cw.map((c) => ({
    id: c.id,
    class_id: c.class_id || c.classId,
    day: c.day,
    period: Number(c.period) || 1,
    subject: c.subject,
    title: c.title,
    details: c.details || null,
    pages: c.pages || null,
    completed: false,
    block: 2,
    week: 5,
    link_url: c.linkUrl || null,
    link_title: c.linkTitle || null,
  }));

  for (let i = 0; i < cwRows.length; i += 50) {
    const { error } = await sb.from('classwork').upsert(cwRows.slice(i, i + 50), { onConflict: 'id' });
    if (error) console.error('Supabase CW upsert error:', error);
  }

  const hwRows = hw.map((h) => ({
    id: h.id,
    class_id: h.class_id || h.classId,
    assigned_day: h.assignedDay,
    due_day: h.dueDay,
    subject: h.subject,
    task: h.task,
    details: packHomeworkDetails(h.details, h.pdfUrl),
    pages: h.pages || null,
    completed: false,
    priority: h.priority || 'normal',
    block: 2,
    week: 5,
    is_link_task: Boolean(h.isLinkTask),
    link_url: h.linkUrl || null,
  }));

  for (let i = 0; i < hwRows.length; i += 50) {
    const { error } = await sb.from('homework').upsert(hwRows.slice(i, i + 50), { onConflict: 'id' });
    if (error) console.error('Supabase HW upsert error:', error);
  }

  // Merge B2W5 Tomorrow Notes into planner_settings.tomorrow_special_notes
  const { data: existingSetting } = await sb
    .from('planner_settings')
    .select('value')
    .eq('key', 'tomorrow_special_notes')
    .maybeSingle();

  let existingNotes = [];
  if (existingSetting && existingSetting.value) {
    try {
      const parsed = JSON.parse(existingSetting.value);
      if (Array.isArray(parsed)) {
        existingNotes = parsed.filter((n) => !isB2W5(n));
      }
    } catch {}
  }

  const mergedNotes = [...existingNotes, ...tn];
  const { error: tnErr } = await sb.from('planner_settings').upsert(
    {
      key: 'tomorrow_special_notes',
      value: JSON.stringify(mergedNotes),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  );
  if (tnErr) console.error('Supabase TN upsert error:', tnErr);

  const [vcw5, vhw5, vcw6, vhw6] = await Promise.all([
    sb.from('classwork').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 5),
    sb.from('homework').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 5),
    sb.from('classwork').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 6),
    sb.from('homework').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 6),
  ]);

  console.log(`✅ Live Supabase synced! B2W5: CW=${vcw5.count}, HW=${vhw5.count}, TN=${tn.length}`);
  console.log(`✅ Verified B2W6 untouched in Supabase: CW=${vcw6.count}, HW=${vhw6.count}`);
})();
