import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const INIT_PATH = 'src/data/initialData.json';
const PLANNER_PATH = 'data/planner_data.json';

const SUPABASE_URL = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

const w4Cw = [];
const w4Hw = [];
const w4Tn = [];

const w5Cw = [];
const w5Hw = [];
const w5Tn = [];

// =========================================================================
// PART A: BLOCK 2 - WEEK 4 (1/11/2026 - 5/11/2026)
// Exact Weekly Plan PDF content & Oct 29 Official Timetable
// =========================================================================

// --- 1. Arabic B2W4 (أ/ مروة ممدوح & أ/ إيمان) ---
const arabicPeriodsW4 = {
  G2A: { Sunday: 7, Monday: 1, Tuesday: 8, Wednesday: 6, Thursday: 5 },
  G2B: { Sunday: 4, Monday: 8, Tuesday: 4, Wednesday: 4, Thursday: 8 },
  G2C: { Sunday: 6, Monday: 1, Tuesday: 7, Wednesday: 6, Thursday: 7 },
};

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  w4Cw.push(
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-sun-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Sunday',
      period: arabicPeriodsW4[cls].Sunday,
      subject: 'Arabic',
      title: 'قراءة درس في سوق الثياب',
      details: 'الوحدة الثالثة (التسوق) - قراءة درس في سوق الثياب. مصادر للصف: أوراق عمل الوحدة الثالثة ص 28-29.',
      pages: 'أوراق عمل الوحدة الثالثة ص 28-29',
      completed: false,
      block: 2,
      week: 4,
    },
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-mon-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Monday',
      period: arabicPeriodsW4[cls].Monday,
      subject: 'Arabic',
      title: 'المناقشة اللغوية لدرس في سوق الثياب + أسماء الإشارة للقريب والبعيد',
      details: 'الوحدة الثالثة (التسوق) - المناقشة اللغوية لدرس في سوق الثياب + أسماء الإشارة للقريب والبعيد.',
      pages: 'فيديو تعليمي+ أوراق عمل الوحدة الثالثة ص 30-31-32',
      completed: false,
      block: 2,
      week: 4,
    },
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-tue-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Tuesday',
      period: arabicPeriodsW4[cls].Tuesday,
      subject: 'Arabic',
      title: 'نشاط كتابة',
      details: 'الوحدة الثالثة (التسوق) - نشاط كتابة. مصادر للصف: أوراق عمل الوحدة الثالثة ص 34.',
      pages: 'أوراق عمل الوحدة الثالثة ص 34',
      completed: false,
      block: 2,
      week: 4,
    },
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-wed-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Wednesday',
      period: arabicPeriodsW4[cls].Wednesday,
      subject: 'Arabic',
      title: 'نص استماع ( السمكات الثلاث)',
      details: 'الوحدة الثالثة (التسوق) - نص استماع (السمكات الثلاث).',
      pages: 'فيديو + أوراق عمل الوحدة الثالثة ص 35',
      completed: false,
      block: 2,
      week: 4,
    },
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-thu-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Thursday',
      period: arabicPeriodsW4[cls].Thursday,
      subject: 'Arabic',
      title: 'نشاط تطبيقي',
      details: 'الوحدة الثالثة (التسوق) - نشاط تطبيقي. مصادر للصف: كراسة الطالب + أوراق العمل.',
      pages: 'كراسة الطالب + أوراق العمل',
      completed: false,
      block: 2,
      week: 4,
    }
  );

  w4Hw.push(
    {
      id: `hw-b2-w4-${cls.toLowerCase()}-sun-arabic`,
      classId: cls,
      class_id: cls,
      assignedDay: 'Sunday',
      assigned_day: 'Sunday',
      dueDay: 'Monday',
      due_day: 'Monday',
      subject: 'Arabic',
      task: 'كراسة التكليفات المنزلية ص 60',
      title: 'كراسة التكليفات المنزلية ص 60',
      details: 'الوحدة الثالثة (التسوق) - حل واجب كراسة التكليفات المنزلية ص 60.',
      pages: 'كراسة التكليفات المنزلية ص 60',
      completed: false,
      priority: 'normal',
      block: 2,
      week: 4,
    },
    {
      id: `hw-b2-w4-${cls.toLowerCase()}-tue-arabic`,
      classId: cls,
      class_id: cls,
      assignedDay: 'Tuesday',
      assigned_day: 'Tuesday',
      dueDay: 'Wednesday',
      due_day: 'Wednesday',
      subject: 'Arabic',
      task: 'كراسة التكليفات المنزلية ص 61',
      title: 'كراسة التكليفات المنزلية ص 61',
      details: 'الوحدة الثالثة (التسوق) - حل واجب كراسة التكليفات المنزلية ص 61.',
      pages: 'كراسة التكليفات المنزلية ص 61',
      completed: false,
      priority: 'normal',
      block: 2,
      week: 4,
    }
  );
});

// --- 2. English B2W4 (Weekly_Plan_English_-_B2_-_W4 + Oct 29 Timetable) ---
const englishPeriodsW4 = {
  G2A: { Sunday: 5, Monday: 3, Tuesday: 7, Wednesday: 7, Thursday: 6 },
  G2B: { Sunday: 1, Monday: 5, Tuesday: 7, Wednesday: 1, Thursday: 3 },
  G2C: { Sunday: 4, Monday: 5, Tuesday: 4, Wednesday: 4, Thursday: 4 },
};

w4Cw.push(
  // Sunday 1/11
  {
    id: 'cw-b2-w4-g2a-sun-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: englishPeriodsW4.G2A.Sunday,
    subject: 'English',
    title: 'Reading & Writing / Prepositions',
    details: 'Unit: My town. Topics: Reading & Writing, Prepositions. Classwork pages: CW. 46, 47, CW. 48, 49.',
    pages: 'CW. 46,47 | CW. 48, 49',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-sun-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: englishPeriodsW4.G2B.Sunday,
    subject: 'English',
    title: 'Reading & Writing',
    details: 'Unit: My town. Topic: Reading & Writing. Classwork pages: CW. 46, 47.',
    pages: 'CW. 46, 47',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-sun-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: englishPeriodsW4.G2C.Sunday,
    subject: 'English',
    title: 'Reading & Writing / Prepositions',
    details: 'Unit: My town. Topics: Reading & Writing, Prepositions. Classwork pages: CW.46, 47, CW. 48, 49.',
    pages: 'CW.46, 47 | CW. 48, 49',
    completed: false,
    block: 2,
    week: 4,
  },
  // Monday 2/11
  {
    id: 'cw-b2-w4-g2a-mon-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: englishPeriodsW4.G2A.Monday,
    subject: 'English',
    title: 'Prepositions / Story',
    details: 'Unit: My town. Topics: Prepositions, Story. Classwork pages: CW. 49, 50. Homework assigned: P. 84, 85.',
    pages: 'CW. 49, 50',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-mon-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: englishPeriodsW4.G2B.Monday,
    subject: 'English',
    title: 'Prepositions',
    details: 'Unit: My town. Topic: Prepositions. Classwork pages: CW. 48, 49, 50. Homework assigned: P. 84, 85.',
    pages: 'CW. 48, 49, 50',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-mon-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: englishPeriodsW4.G2C.Monday,
    subject: 'English',
    title: 'Prepositions',
    details: 'Unit: My town. Topic: Prepositions. Classwork pages: CW. 49, 50. Homework assigned: P. 84, 85.',
    pages: 'CW. 49, 50',
    completed: false,
    block: 2,
    week: 4,
  },
  // Tuesday 3/11
  {
    id: 'cw-b2-w4-g2a-tue-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: englishPeriodsW4.G2A.Tuesday,
    subject: 'English',
    title: 'Listening / Cross calicular- Science',
    details: 'Unit: My town. Topics: Listening, Cross calicular- Science. Classwork pages: CW. 44, CW. 56.',
    pages: 'CW. 44 | CW. 56',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-tue-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: englishPeriodsW4.G2B.Tuesday,
    subject: 'English',
    title: "Kid's Box",
    details: "Unit: My town. Topic: Kid's Box. Activity Book P.54, 55.",
    pages: 'Activity Book P.54, 55',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-tue-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: englishPeriodsW4.G2C.Tuesday,
    subject: 'English',
    title: 'Movers- Reading / Story',
    details: 'Unit: My town. Topics: Movers- Reading, Story.',
    pages: 'Movers- Reading & Story',
    completed: false,
    block: 2,
    week: 4,
  },
  // Wednesday 4/11
  {
    id: 'cw-b2-w4-g2a-wed-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: englishPeriodsW4.G2A.Wednesday,
    subject: 'English',
    title: "Kid's Box",
    details: "Unit: My town. Topic: Kid's Box. Activity Book2 p.54, 55.",
    pages: 'Activity Book2 p.54, 55',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-wed-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: englishPeriodsW4.G2B.Wednesday,
    subject: 'English',
    title: 'Listening / Cross calicular- Science',
    details: 'Unit: My town. Topics: Listening, Cross calicular- Science. Classwork pages: CW.44, CW. 56.',
    pages: 'CW.44 | CW. 56',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-wed-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: englishPeriodsW4.G2C.Wednesday,
    subject: 'English',
    title: "Kid's Box",
    details: "Unit: My town. Topic: Kid's Box. Activity Book2 p.54, 55.",
    pages: 'Activity Book2 p.54, 55',
    completed: false,
    block: 2,
    week: 4,
  },
  // Thursday 5/11
  {
    id: 'cw-b2-w4-g2a-thu-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: englishPeriodsW4.G2A.Thursday,
    subject: 'English',
    title: 'Movers- Reading',
    details: 'Unit: My town. Topic: Movers- Reading. Classwork pages: CW. 52,53. Homework assigned: P. 86, 87.',
    pages: 'CW. 52,53',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-thu-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: englishPeriodsW4.G2B.Thursday,
    subject: 'English',
    title: 'Story / Movers- Reading',
    details: 'Unit: My town. Topics: Story, Movers- Reading. Classwork pages: CW. 52, 53. Homework assigned: P. 86, 87.',
    pages: 'CW. 52, 53',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-thu-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: englishPeriodsW4.G2C.Thursday,
    subject: 'English',
    title: 'Listening / Cross calicular- Science / Movers- Reading',
    details: 'Unit: My town. Topics: Listening, Cross calicular- Science, Movers- Reading. Classwork pages: CW. 44, CW. 56, CW. 52, 53. Homework assigned: P. 86, 87.',
    pages: 'CW. 44 | CW. 56 | CW. 52, 53',
    completed: false,
    block: 2,
    week: 4,
  }
);

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  w4Hw.push(
    {
      id: `hw-b2-w4-${cls.toLowerCase()}-mon-english`,
      classId: cls,
      class_id: cls,
      assignedDay: 'Monday',
      assigned_day: 'Monday',
      dueDay: 'Tuesday',
      due_day: 'Tuesday',
      subject: 'English',
      task: 'English Homework: P. 84, 85',
      title: 'English Homework: P. 84, 85',
      details: 'Unit: My town. Solve homework pages P. 84, 85.',
      pages: 'P. 84, 85',
      completed: false,
      priority: 'normal',
      block: 2,
      week: 4,
    },
    {
      id: `hw-b2-w4-${cls.toLowerCase()}-thu-english`,
      classId: cls,
      class_id: cls,
      assignedDay: 'Thursday',
      assigned_day: 'Thursday',
      dueDay: 'Sunday',
      due_day: 'Sunday',
      subject: 'English',
      task: 'English Homework: P. 86, 87',
      title: 'English Homework: P. 86, 87',
      details: 'Unit: My town. Solve homework pages P. 86, 87.',
      pages: 'P. 86, 87',
      completed: false,
      priority: 'normal',
      block: 2,
      week: 4,
    }
  );
});

// --- 3. French B2W4 (Weekly_Plan_French_-_B2_-_W4 + Oct 29 Timetable) ---
const frenchDicteeImg = '/assets/aistudio/WhatsApp_Image_2026-10-30_at_4.44.33_PM_a6ceb7f2.jpeg';
const frenchW4Sessions = {
  G2A: [
    { day: 'Tuesday', period: 1 },
    { day: 'Wednesday', period: 4 },
    { day: 'Thursday', period: 3, dueDay: 'Sunday' },
  ],
  G2B: [
    { day: 'Sunday', period: 2 },
    { day: 'Monday', period: 7 },
    { day: 'Thursday', period: 5, dueDay: 'Sunday' },
  ],
  G2C: [
    { day: 'Sunday', period: 8 },
    { day: 'Tuesday', period: 6 },
    { day: 'Wednesday', period: 2, dueDay: 'Sunday' },
  ],
};

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  const [s1, s2, s3] = frenchW4Sessions[cls];
  w4Cw.push(
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-${s1.day.toLowerCase().slice(0, 3)}-french-c1`,
      classId: cls,
      class_id: cls,
      day: s1.day,
      period: s1.period,
      subject: 'French',
      title: 'Unité 4 — Leçon 2: Il est comment? (1er cours)',
      details: 'Unité 4: La petite sœur de Lilly - Leçon 2: Il est comment? Fiche de classe 24:27. Remarques: Dictée.',
      pages: 'Fiche de classe 24:27',
      completed: false,
      block: 2,
      week: 4,
    },
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-${s2.day.toLowerCase().slice(0, 3)}-french-c2`,
      classId: cls,
      class_id: cls,
      day: s2.day,
      period: s2.period,
      subject: 'French',
      title: 'Unité 4 — Leçon 3: Où habites-tu? (2ème cours)',
      details: 'Unité 4: La petite sœur de Lilly - Leçon 3: Où habites-tu? Fiche de classe 29:30. Remarques: Quiz (les adjectifs & les animaux).',
      pages: 'Fiche de classe 29:30',
      completed: false,
      block: 2,
      week: 4,
    },
    {
      id: `cw-b2-w4-${cls.toLowerCase()}-${s3.day.toLowerCase().slice(0, 3)}-french-c3`,
      classId: cls,
      class_id: cls,
      day: s3.day,
      period: s3.period,
      subject: 'French',
      title: 'Unité 4 — Leçon 3: Où habites-tu? (3ème cours)',
      details: 'Unité 4: La petite sœur de Lilly - Leçon 3: Où habites-tu? Fiche de classe 31:36. Fiche de devoir: P 37 & 38.',
      pages: 'Fiche de classe 31:36 (Devoir P 37 & 38)',
      completed: false,
      block: 2,
      week: 4,
    }
  );

  w4Hw.push({
    id: `hw-b2-w4-${cls.toLowerCase()}-${s3.day.toLowerCase().slice(0, 3)}-french-p37-38`,
    classId: cls,
    class_id: cls,
    assignedDay: s3.day,
    assigned_day: s3.day,
    dueDay: s3.dueDay,
    due_day: s3.dueDay,
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir P 37 & 38 📝',
    title: 'Devoir de français: Fiche de devoir P 37 & 38',
    details: 'Unité 4: Leçon 3: Où habites-tu? - Résoudre Fiche de devoir P 37 & 38.',
    pages: 'P 37 & 38',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 4,
  });

  w4Tn.push(
    {
      id: `tn-b2-w4-${cls.toLowerCase()}-french-dictee`,
      classId: cls,
      class_id: cls,
      targetDay: s1.day,
      subject: 'French',
      period: s1.period,
      title: '📝 Dictée de français غداً (Unité 4 Leçon 2)',
      note: 'Dictée (Unité 4 Leçon 2: Le masculin et le féminin avec les adjectifs)',
      arabicNote: '🚨 إملاء لغة فرنسية (Dictée) غداً في الحصة الأولى: مراجعة قواعد المذكر والمؤنث للصفات (petit/petite, grand/grande, méchant/méchante, fort/forte).',
      bagItem: 'كشكول الإملاء والكتاب',
      isQuiz: true,
      categoryType: 'quiz',
      block: 2,
      week: 4,
      linkUrl: frenchDicteeImg,
      linkTitle: 'صورة مراجعة Dictée (Le masculin et le féminin) 🖼️',
    },
    {
      id: `tn-b2-w4-${cls.toLowerCase()}-french-quiz`,
      classId: cls,
      class_id: cls,
      targetDay: s2.day,
      subject: 'French',
      period: s2.period,
      title: '🚨 Quiz de français (les adjectifs & les animaux)',
      note: 'Quiz (les adjectifs & les animaux)',
      arabicNote: '🚨 كويز لغة فرنسية غداً في الحصة الثانية على الصفات والحيوانات (Quiz: les adjectifs & les animaux). يرجى المراجعة والاستعداد.',
      bagItem: 'Passe-passe / Fiche de classe',
      isQuiz: true,
      categoryType: 'quiz',
      block: 2,
      week: 4,
    }
  );
});

// --- 4. Mathematics B2W4 (Weekly_Plan_Maths_-_B2_-_W4 + Oct 29 Timetable + Clock Past HW) ---
const mathPeriodsW4 = {
  G2A: { Sunday: 2, Monday: 8, Tuesday: 3, Wednesday: 1, Thursday: 2 },
  G2B: { Sunday: 3, Monday: 3, Tuesday: 1, Wednesday: 5, Thursday: 6 },
  G2C: { Sunday: 1, Monday: 8, Tuesday: 3, Wednesday: 7, Thursday: 6 },
};
const mathClockHwPdf = '/materials/Math-Grade2-B2-W4-Clock-Past-HW.pdf';

const mathLessonsW4 = [
  {
    day: 'Sunday',
    key: 'sun',
    title: 'Unit 7: Measuring length and time — Lesson 4: Writing in word ( to )',
    details: 'Unit 7: Measuring length and time - Lesson 4: Writing in word ( to ). Resources: Maths-Grade2-B2-All-Sheet2 – Main & Extra work sheet.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main + Extra work sheet',
    hwTask: 'Math Extra H.w (Clock: Past — Write the time in two ways: Digital and word form)',
    hwPages: 'Extra H.w',
    dueDay: 'Monday',
    pdfUrl: mathClockHwPdf,
  },
  {
    day: 'Monday',
    key: 'mon',
    title: 'Unit 7: Measuring length and time — Follow lesson 4',
    details: 'Unit 7: Measuring length and time - Follow lesson 4. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwTask: 'Math Homework — Page 103',
    hwPages: 'Page 103',
    dueDay: 'Tuesday',
  },
  {
    day: 'Tuesday',
    key: 'tue',
    title: 'Unit 7: Measuring length and time — Lesson 5: Time intervals',
    details: 'Unit 7: Measuring length and time - Lesson 5: Time intervals. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwTask: 'Math Homework — Page 104',
    hwPages: '104',
    dueDay: 'Wednesday',
  },
  {
    day: 'Wednesday',
    key: 'wed',
    title: 'Unit 7: Measuring length and time — Test your self',
    details: 'Unit 7: Measuring length and time - Test your self. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwTask: 'Math Homework — Page 105',
    hwPages: '105',
    dueDay: 'Thursday',
  },
  {
    day: 'Thursday',
    key: 'thu',
    title: 'Unit 8: Using data — Lesson 1: Tally marks',
    details: 'Unit 8: Using data - Lesson 1: Tally marks. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
    pages: 'Maths-Grade2-B2-All-Sheet2 – Main',
    hwTask: 'Math Homework — Page 108',
    hwPages: '108',
    dueDay: 'Sunday',
  },
];

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  mathLessonsW4.forEach((l) => {
    w4Cw.push({
      id: `cw-b2-w4-${cls.toLowerCase()}-${l.key}-math`,
      classId: cls,
      class_id: cls,
      day: l.day,
      period: mathPeriodsW4[cls][l.day],
      subject: 'Mathematics',
      title: l.title,
      details: l.details,
      pages: l.pages,
      completed: false,
      block: 2,
      week: 4,
    });

    const hwEntry = {
      id: `hw-b2-w4-${cls.toLowerCase()}-${l.key}-math`,
      classId: cls,
      class_id: cls,
      assignedDay: l.day,
      assigned_day: l.day,
      dueDay: l.dueDay,
      due_day: l.dueDay,
      subject: 'Mathematics',
      task: l.hwTask,
      title: l.hwTask,
      details: l.pdfUrl
        ? 'حل شيت الساعة المرفق (Write the time in two ways: Digital and word form).'
        : `Solve exercises on ${l.hwPages} in Maths-Grade2-B2-All-Sheet2 – Main.`,
      pages: l.hwPages,
      completed: false,
      priority: 'normal',
      block: 2,
      week: 4,
    };
    if (l.pdfUrl) {
      hwEntry.pdfUrl = l.pdfUrl;
      hwEntry.pdf_url = l.pdfUrl;
      hwEntry.fileName = 'Math-Grade2-B2-W4-Clock-Past-HW.pdf';
    }
    w4Hw.push(hwEntry);
  });

  w4Tn.push({
    id: `tn-b2-w4-math-test-${cls}-Tue`,
    classId: cls,
    class_id: cls,
    targetDay: 'Wednesday',
    subject: 'Mathematics',
    period: mathPeriodsW4[cls].Wednesday,
    title: '🚨 اختبار ماث غداً (Test your self - Unit 7)',
    note: 'Math Test (Test your self): Unit 7 Measuring length and time',
    arabicNote: 'تذكير هام: اختبار ماث (Test your self) غداً الأربعاء على الوحدة السابعة (Unit 7: Measuring length and time). يرجى المراجعة والاستعداد.',
    bagItem: 'Math Sheet + Pencils',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 4,
  });
});

// --- 5. Science B2W4 (Weekly_Plan_Science_-_B2_-_W4 + Oct 29 Timetable) — STRICTLY ZERO PDFs! ---
// Oct 29 Science: G2A (Mon P6, Tue P5, Thu P8), G2B (Sun P6, Wed P7, Thu P7), G2C (Sun P3, Mon P4, Thu P1)
w4Cw.push(
  // Sunday 1/11
  {
    id: 'cw-b2-w4-g2b-sun-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 6,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials (soft/hard – flexible /rigid)',
    details: 'Unit 4: Exploring and using materials. Class B: page 52. • Mrs. Salma Ahmed',
    pages: 'page : 52',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-sun-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 3,
    subject: 'Science',
    title: 'Quiz on unit 3',
    details: 'Unit 4: Exploring and using materials - Class C: quiz on unit 3. • Mrs. Salma Ahmed',
    pages: 'Quiz on Unit 3',
    completed: false,
    block: 2,
    week: 4,
  },
  // Monday 2/11
  {
    id: 'cw-b2-w4-g2a-mon-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: 6,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials (soft/hard – flexible /rigid)',
    details: 'Unit 4: Exploring and using materials. Class A: page 52. • Mrs. Salma Ahmed',
    pages: 'page 52',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-mon-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 4,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The types of materials',
    details: 'Unit 4: Exploring and using materials. Class C: page 47. • Mrs. Salma Ahmed',
    pages: 'page 47',
    completed: false,
    block: 2,
    week: 4,
  },
  // Tuesday 3/11
  {
    id: 'cw-b2-w4-g2a-tue-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 5,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials (waterproof/ absorbent – float / sink)',
    details: 'Unit 4: Exploring and using materials. Class A: Page : 49. • Mrs. Salma Ahmed',
    pages: 'Page : 49',
    completed: false,
    block: 2,
    week: 4,
  },
  // Wednesday 4/11
  {
    id: 'cw-b2-w4-g2b-wed-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 7,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials (waterproof/ absorbent – float / sink)',
    details: 'Unit 4: Exploring and using materials. Class B: Page : 49. • Mrs. Salma Ahmed',
    pages: 'Page : 49',
    completed: false,
    block: 2,
    week: 4,
  },
  // Thursday 5/11
  {
    id: 'cw-b2-w4-g2a-thu-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 8,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The magnets',
    details: 'Unit 4: Exploring and using materials - Classes A-B: The magnets. • Mrs. Salma Ahmed',
    pages: 'Unit 4',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-thu-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 7,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The magnets',
    details: 'Unit 4: Exploring and using materials - Classes A-B: The magnets. • Mrs. Salma Ahmed',
    pages: 'Unit 4',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-thu-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 1,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials (soft/hard – flexible /rigid)',
    details: 'Unit 4: Exploring and using materials. Class C: Page 52. • Mrs. Salma Ahmed',
    pages: 'Page 52',
    completed: false,
    block: 2,
    week: 4,
  }
);

w4Hw.push(
  {
    id: 'hw-b2-w4-g2a-mon-science',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'Science',
    task: 'Science Homework: Page : 53',
    title: 'Science Homework: Page : 53',
    details: 'Unit 4: Exploring and using materials. Solve Page : 53.',
    pages: 'Page : 53',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 4,
  },
  {
    id: 'hw-b2-w4-g2c-mon-science',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework: Page : 53',
    title: 'Science Homework: Page : 53',
    details: 'Unit 4: Exploring and using materials. Solve Page : 53.',
    pages: 'Page : 53',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 4,
  },
  {
    id: 'hw-b2-w4-g2a-wed-science',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework: Page : 48',
    title: 'Science Homework: Page : 48',
    details: 'Unit 4: Exploring and using materials. Solve Page : 48.',
    pages: 'Page : 48',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 4,
  },
  {
    id: 'hw-b2-w4-g2b-wed-science',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay: 'Thursday',
    due_day: 'Thursday',
    subject: 'Science',
    task: 'Science Homework: Page : 48',
    title: 'Science Homework: Page : 48',
    details: 'Unit 4: Exploring and using materials. Solve Page : 48 (Class C not included).',
    pages: 'Page : 48',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 4,
  }
);

w4Tn.push({
  id: 'tn-b2-w4-g2c-sun-science-quiz',
  classId: 'G2C',
  class_id: 'G2C',
  targetDay: 'Sunday',
  subject: 'Science',
  period: 3,
  title: '🚨 كويز ساينس غداً (Quiz on Unit 3 - Class 2C)',
  note: 'Class C: Quiz on Unit 3',
  arabicNote: '🚨 كويز ساينس غداً الأحد لكلاس 2C على الوحدة الثالثة (Quiz on Unit 3). يرجى المراجعة والاستعداد.',
  bagItem: 'بوكليت الساينس والأدوات',
  isQuiz: true,
  categoryType: 'quiz',
  block: 2,
  week: 4,
});

// --- 6. Social Studies B2W4 (Weekly_Plan_SocialStudies_-_B2_-_W4) ---
const ssHw3Pdf = '/assets/aistudio/SocialStudies-Grade2-B2-W3-U2-HomeWork3_-_Extra-__Minia__e3148d4c.pdf';
const ssHw3FileName = 'SocialStudies-Grade2-B2-W3-U2-HomeWork3 - Extra- (Minia).pdf';
const ssHw4PdfW4 = '/materials/SocialStudies-Grade2-B2-W4-U2-HomeWork4 - Extra- (Minia).pdf';
const ssHw4FileNameW4 = 'SocialStudies-Grade2-B2-W4-U2-HomeWork4 - Extra- (Minia).pdf';

w4Cw.push(
  // Sun 1/11: G2A, G2C -> المدرسة بين الماضي والحاضر (اوراق العمل 31-32)
  {
    id: 'cw-b2-w4-g2a-sun-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 8,
    subject: 'Social Studies',
    title: 'المدرسة بين الماضي و الحاضر',
    details: 'الوحدة الثانية: المجتمع المدرسي - المدرسة بين الماضي و الحاضر (اوراق العمل 31-32). • أ/ ولاء فايز',
    pages: 'اوراق العمل 31-32',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-sun-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 7,
    subject: 'Social Studies',
    title: 'المدرسة بين الماضي و الحاضر',
    details: 'الوحدة الثانية: المجتمع المدرسي - المدرسة بين الماضي و الحاضر (اوراق العمل 31-32). • أ/ منار حسن',
    pages: 'اوراق العمل 31-32',
    completed: false,
    block: 2,
    week: 4,
  },
  // Mon 2/11: G2B -> المدرسة بين الماضي والحاضر (31-32), G2C -> شعار مدرستي (33)
  {
    id: 'cw-b2-w4-g2b-mon-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 1,
    subject: 'Social Studies',
    title: 'المدرسة بين الماضي و الحاضر',
    details: 'الوحدة الثانية: المجتمع المدرسي - المدرسة بين الماضي و الحاضر (اوراق العمل 31-32). • أ/ منار حسن',
    pages: 'اوراق العمل 31-32',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-mon-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 3,
    subject: 'Social Studies',
    title: 'شعار مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - شعار مدرستي (اوراق العمل 33). • أ/ منار حسن',
    pages: 'اوراق العمل 33',
    completed: false,
    block: 2,
    week: 4,
  },
  // Wed 4/11: G2A, G2B -> شعار مدرستي (33), G2C -> لماذا تغيرت المدرسة الان عن الماضي؟
  {
    id: 'cw-b2-w4-g2a-wed-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 5,
    subject: 'Social Studies',
    title: 'شعار مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - شعار مدرستي (اوراق العمل 33). • أ/ ولاء فايز',
    pages: 'اوراق العمل 33',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-wed-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 8,
    subject: 'Social Studies',
    title: 'شعار مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - شعار مدرستي (اوراق العمل 33). • أ/ منار حسن',
    pages: 'اوراق العمل 33',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2c-wed-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 1,
    subject: 'Social Studies',
    title: 'لماذا تغيرت المدرسة الان عن الماضي؟',
    details: 'الوحدة الثانية: المجتمع المدرسي - لماذا تغيرت المدرسة الان عن الماضي؟ (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 4,
  },
  // Thu 5/11: G2A, G2B -> لماذا تغيرت المدرسة الان عن الماضي؟
  {
    id: 'cw-b2-w4-g2a-thu-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 7,
    subject: 'Social Studies',
    title: 'لماذا تغيرت المدرسة الان عن الماضي؟',
    details: 'الوحدة الثانية: المجتمع المدرسي - لماذا تغيرت المدرسة الان عن الماضي؟ (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ ولاء فايز',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 4,
  },
  {
    id: 'cw-b2-w4-g2b-thu-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 2,
    subject: 'Social Studies',
    title: 'لماذا تغيرت المدرسة الان عن الماضي؟',
    details: 'الوحدة الثانية: المجتمع المدرسي - لماذا تغيرت المدرسة الان عن الماضي؟ (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 4,
  }
);

// Social W4 HW3 (start of W4) + Wednesday LMS HW4
[
  { cls: 'G2A', assignedDay: 'Saturday', dueDay: 'Sunday', period: 8 },
  { cls: 'G2C', assignedDay: 'Saturday', dueDay: 'Sunday', period: 7 },
  { cls: 'G2B', assignedDay: 'Sunday', dueDay: 'Monday', period: 1 },
].forEach(({ cls, assignedDay, dueDay, period }) => {
  w4Hw.push({
    id: `hw-b2-w4-${cls.toLowerCase()}-${assignedDay.toLowerCase().slice(0, 3)}-social-hw3`,
    classId: cls,
    class_id: cls,
    assignedDay,
    assigned_day: assignedDay,
    dueDay,
    due_day: dueDay,
    subject: 'Social Studies',
    task: 'شيت واجب الدراسات الاجتماعية - الوحدة الثانية (Home Work 3): تصنيف السلوكيات وأسئلة صح وخطأ 📄',
    title: 'شيت واجب الدراسات الاجتماعية (Home Work 3)',
    details: 'حل شيت واجب الدراسات الاجتماعية المرفق (Home Work 3) وتسليمه أول حصة.',
    pages: 'Home Work 3 (ص 1-3)',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 4,
    pdfUrl: ssHw3Pdf,
    pdf_url: ssHw3Pdf,
    attachment: ssHw3Pdf,
    fileName: ssHw3FileName,
  });

  w4Tn.push({
    id: `tn-b2-w4-${cls.toLowerCase()}-${dueDay.toLowerCase().slice(0, 3)}-social-hw3`,
    classId: cls,
    class_id: cls,
    targetDay: dueDay,
    subject: 'Social Studies',
    period,
    title: '🌍 تسليم شيت واجب الدراسات الاجتماعية (Home Work 3)',
    note: 'Submit Social Studies Home Work 3 sheet',
    arabicNote: `تذكير هام لمادة الدراسات الاجتماعية: تسليم شيت الواجب (Home Work 3) المرفق غداً ${dueDay === 'Sunday' ? 'الأحد' : 'الإثنين'} في أول حصة دراسات.`,
    bagItem: 'شيت واجب الدراسات الاجتماعية (Home Work 3)',
    isQuiz: false,
    categoryType: 'note',
    block: 2,
    week: 4,
    pdfUrl: ssHw3Pdf,
    pdf_url: ssHw3Pdf,
    fileName: ssHw3FileName,
  });
});

[
  { cls: 'G2A', dueDay: 'Sunday' },
  { cls: 'G2B', dueDay: 'Monday' },
  { cls: 'G2C', dueDay: 'Sunday' },
].forEach(({ cls, dueDay }) => {
  w4Hw.push({
    id: `hw-b2-w4-${cls.toLowerCase()}-wed-social-hw4`,
    classId: cls,
    class_id: cls,
    assignedDay: 'Wednesday',
    assigned_day: 'Wednesday',
    dueDay,
    due_day: dueDay,
    subject: 'Social Studies',
    task: 'واجب الدراسات الاجتماعية (LMS - يوم الأربعاء): شيت المدرسة قديماً وحديثاً (Home Work 4) 📄',
    title: 'واجب الدراسات الاجتماعية (Home Work 4)',
    details: 'الوحدة الثانية: المجتمع المدرسي - يتم إرسال الواجب على LMS يوم الأربعاء (Home Work 4) ويتم استلام الواجبات أول حصة الأسبوع القادم.',
    pages: 'LMS / Home Work 4 (ص 1 و 2)',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 4,
    pdfUrl: ssHw4PdfW4,
    pdf_url: ssHw4PdfW4,
    attachment: ssHw4PdfW4,
    fileName: ssHw4FileNameW4,
  });
});

// --- 7. ICT B2W4 (Exact from seed_ict_and_clean_english.cjs + Oct 29 Timetable + W4 Notes Quiz) ---
const ictScheduleW4 = {
  G2A: [
    { day: 'Sunday', dayAr: 'الأحد', period: 3, teacher: 'Mariem' },
    { day: 'Tuesday', dayAr: 'الثلاثاء', period: 6, teacher: 'Mariem' },
    { day: 'Wednesday', dayAr: 'الأربعاء', period: 2, teacher: 'Mariem', isLast: true, dueDay: 'Sunday' },
  ],
  G2B: [
    { day: 'Sunday', dayAr: 'الأحد', period: 5, teacher: 'Mariem' },
    { day: 'Tuesday', dayAr: 'الثلاثاء', period: 3, teacher: 'Mariem' },
    { day: 'Thursday', dayAr: 'الخميس', period: 1, teacher: 'Mariem', isLast: true, dueDay: 'Sunday' },
  ],
  G2C: [
    { day: 'Monday', dayAr: 'الإثنين', period: 7, teacher: 'Abeer' },
    { day: 'Tuesday', dayAr: 'الثلاثاء', period: 1, teacher: 'Abeer' },
    { day: 'Thursday', dayAr: 'الخميس', period: 2, teacher: 'Abeer', isLast: true, dueDay: 'Monday' },
  ],
};

const ictW4Sessions = [
  {
    title: 'Unit 2: Communicating with Email / E-safety — Session 1 (E-safety & Rules + Quiz)',
    details: 'Unit: Communicating with Email / E-safety. Topics: E-safety, E-safety rules, and Quiz covering Weeks 1 & 2. Resources: Study sheet W4, Classwork W4 Pg. 25-27-29.',
    pages: 'Study sheet W4, Classwork W4 Pg. 25-27-29',
    isQuiz: true,
  },
  {
    title: 'Unit 2: Communicating with Email / E-safety — Session 2 (Personal Info & Data Privacy)',
    details: 'Unit: Communicating with Email / E-safety. Topics: Personal information, Public and private information, and The importance of data privacy. Resources: Study sheet W4, Classwork W4 Pg. 25-27-29.',
    pages: 'Study sheet W4, Classwork W4 Pg. 25-27-29',
    isQuiz: false,
  },
  {
    title: 'Unit 2: Communicating with Email / E-safety — Session 3 (Assessment & Quiz)',
    details: 'Unit: Communicating with Email / E-safety. Topics: Practical Quiz and assessment on E-safety concepts. Resources: Classwork W4. Homework assigned on Session 3: Homework W4 Pg. 30.',
    pages: 'Classwork W4 Pg. 25-27-29',
    isQuiz: true,
  },
];

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  ictScheduleW4[cls].forEach((slot, idx) => {
    const sess = ictW4Sessions[idx];
    w4Cw.push({
      id: `cw-b2-w4-${cls.toLowerCase()}-${slot.day.toLowerCase()}-p${slot.period}-ict`,
      classId: cls,
      class_id: cls,
      day: slot.day,
      period: slot.period,
      subject: 'ICT',
      title: sess.title,
      details: sess.details,
      pages: sess.pages,
      completed: false,
      block: 2,
      week: 4,
    });

    if (slot.isLast) {
      w4Hw.push({
        id: `hw-b2-w4-${cls.toLowerCase()}-${slot.day.toLowerCase()}-ict`,
        classId: cls,
        class_id: cls,
        assignedDay: slot.day,
        assigned_day: slot.day,
        dueDay: slot.dueDay,
        due_day: slot.dueDay,
        subject: 'ICT',
        task: 'ICT Homework W4 Pg. 30',
        title: 'ICT Homework W4 Pg. 30',
        details: 'Unit 2: Communicating with Email / E-safety. Complete exercises on Homework W4 Page 30 in the ICT booklet.',
        pages: 'Homework W4 Pg. 30',
        completed: false,
        priority: 'normal',
        block: 2,
        week: 4,
      });
    }

    w4Tn.push({
      id: `tn-b2-w4-ict-${cls}-${slot.day.toLowerCase()}-p${slot.period}`,
      classId: cls,
      class_id: cls,
      targetDay: slot.day,
      subject: 'ICT',
      period: slot.period,
      title: sess.isQuiz
        ? '🔌 إحضار أدوات الـ ICT + كويز ICT غداً (Quiz Cover Week 1-2)'
        : '🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)',
      note: sess.isQuiz
        ? 'Please ensure students bring: ICT sheet, Flash drive. Quizzes cover week 1-2.'
        : 'Please ensure the students bring: ICT sheet, Flash drive',
      arabicNote: sess.isQuiz
        ? `🚨 كويز ICT غداً ${slot.dayAr} في الحصة (${slot.period}) على الأسبوعين 1 و 2! يرجى إحضار (ICT sheet - Flash drive).`
        : `تذكير حصة الـ ICT غداً ${slot.dayAr} في الحصة (${slot.period}): يرجى إحضار (ICT sheet - Flash drive).`,
      bagItem: 'ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)',
      isQuiz: sess.isQuiz,
      categoryType: sess.isQuiz ? 'quiz' : 'supplies',
      block: 2,
      week: 4,
    });
  });
});

// =========================================================================
// PART B: BLOCK 2 - WEEK 5 (8/11/2026 - 12/11/2026)
// Exact titles/pages from seed_arabic_b2_w5, seed_english_b2_w5, seed_french_b2_w5,
// seed_ict_and_clean_english + Nov 6 Official Timetable + Official PDFs
// =========================================================================

// --- 1. Arabic B2W5 (Exact verbatim from seed_arabic_b2_w5.cjs) ---
const arabicPeriodsW5 = {
  G2A: { Sunday: 7, Monday: 1, Tuesday: 8, Wednesday: 6, Thursday: 5 },
  G2B: { Sunday: 4, Monday: 8, Tuesday: 4, Wednesday: 4, Thursday: 8 },
  G2C: { Sunday: 6, Monday: 1, Tuesday: 7, Wednesday: 6, Thursday: 7 },
};

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  w5Cw.push(
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-sun-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Sunday',
      period: arabicPeriodsW5[cls].Sunday,
      subject: 'Arabic',
      title: 'قراءة درس أحمد في متجر الملابس الرياضية',
      details: 'الوحدة الثالثة (التسوق) - قراءة درس أحمد في متجر الملابس الرياضية واستخراج المفردات ومعاني الكلمات ومناقشة الفكرة الرئيسية.',
      pages: 'أوراق عمل الوحدة الثالثة ص 36-37',
      completed: false,
      block: 2,
      week: 5,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-mon-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Monday',
      period: arabicPeriodsW5[cls].Monday,
      subject: 'Arabic',
      title: 'المناقشة اللغوية لدرس أحمد في متجر الألعاب الرياضية + قراءة إعلان',
      details: 'الوحدة الثالثة (التسوق) - المناقشة اللغوية والتراكيب لدرس أحمد في متجر الألعاب الرياضية + تدريب قراءة إعلان وتحليل عناصره.',
      pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 38-39',
      completed: false,
      block: 2,
      week: 5,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-tue-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Tuesday',
      period: arabicPeriodsW5[cls].Tuesday,
      subject: 'Arabic',
      title: 'الفعل الماضي والمضارع',
      details: 'الوحدة الثالثة (التسوق) - شرح وتمييز الفعل الماضي والفعل المضارع وكيفية صياغتهما واستخدامهما في جمل مفيدة.',
      pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 40',
      completed: false,
      block: 2,
      week: 5,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-wed-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Wednesday',
      period: arabicPeriodsW5[cls].Wednesday,
      subject: 'Arabic',
      title: 'الجملة الاسمية والجملة الفعلية',
      details: 'الوحدة الثالثة (التسوق) - التعرف على الجملة الاسمية والجملة الفعلية والتمييز بينهما والتحويل من الجملة الاسمية إلى الفعلية والعكس.',
      pages: 'فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 41',
      completed: false,
      block: 2,
      week: 5,
    },
    {
      id: `cw-b2-w5-${cls.toLowerCase()}-thu-arabic`,
      classId: cls,
      class_id: cls,
      day: 'Thursday',
      period: arabicPeriodsW5[cls].Thursday,
      subject: 'Arabic',
      title: 'نشاط استماع (الديك المغرور)',
      details: 'الوحدة الثالثة (التسوق) - استماع نص قصة (الديك المغرور) ومناقشة الدروس المستفادة وقيم القصة وحل أنشطة الفهم والاستيعاب.',
      pages: 'استماع النص + أوراق عمل الوحدة الثالثة ص 45',
      completed: false,
      block: 2,
      week: 5,
    }
  );

  w5Hw.push(
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
      block: 2,
      week: 5,
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
      block: 2,
      week: 5,
    }
  );
});

// --- 2. English B2W5 (Exact verbatim from seed_english_b2_w5.cjs, Nov 6 periods) ---
const dictationPdfUrl = '/assets/aistudio/English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';
const dictationPdfName = 'English-Grade2-B2-W5-U2-StudySheet1_-_Extra-__Minia__1433ed04.pdf';

const englishPeriodsW5 = {
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

w5Cw.push(
  {
    id: 'cw-b2-w5-g2a-sun-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: englishPeriodsW5.G2A.Sunday,
    subject: 'English',
    title: 'Present Continuous',
    details: 'Unit: My town. Grammar focus: Present Continuous tense rules and sentence structure. Classwork exercises on pages CW. 57, 58.',
    pages: 'CW. 57, 58',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-sun-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: englishPeriodsW5.G2B.Sunday,
    subject: 'English',
    title: 'Reading & Listening',
    details: 'Unit: My town. Focus on Reading & Listening comprehension skills. Classwork exercises on pages CW. 59, 60.',
    pages: 'CW. 59, 60',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-sun-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: englishPeriodsW5.G2C.Sunday,
    subject: 'English',
    title: 'Present Continuous',
    details: 'Unit: My town. Grammar focus: Present Continuous tense rules and practice. Classwork exercises on pages CW. 57, 58.',
    pages: 'CW. 57, 58',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2a-mon-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Monday',
    period: englishPeriodsW5.G2A.Monday,
    subject: 'English',
    title: 'Movers Story',
    details: 'Unit: My town. Movers story reading, vocabulary discussion, and comprehension exercises on pages CW. 61, 62.',
    pages: 'CW. 61, 62',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-mon-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: englishPeriodsW5.G2B.Monday,
    subject: 'English',
    title: 'Present Continuous',
    details: 'Unit: My town. Grammar focus: Present Continuous rules and usage. Classwork exercises on pages CW. 57, 58.',
    pages: 'CW. 57, 58',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-mon-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: englishPeriodsW5.G2C.Monday,
    subject: 'English',
    title: 'Outdoor Activity',
    details: 'Unit: My town. Outdoor interactive language activity and communication practice.',
    pages: 'Outdoor Activity',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2a-tue-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: englishPeriodsW5.G2A.Tuesday,
    subject: 'English',
    title: 'Reading & Listening',
    details: 'Unit: My town. Reading comprehension and active listening skills. Classwork exercises on pages CW. 59, 60.',
    pages: 'CW. 59, 60',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-tue-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Tuesday',
    period: englishPeriodsW5.G2B.Tuesday,
    subject: 'English',
    title: '📝 Dictation & Movers Story',
    details: 'Unit: My town. 📝 Weekly Dictation in Copy Book on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School) + Movers Story on pages CW. 61, 62.',
    pages: 'Copy Book, CW. 61, 62',
    completed: false,
    block: 2,
    week: 5,
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
    period: englishPeriodsW5.G2C.Tuesday,
    subject: 'English',
    title: '📝 Dictation',
    details: 'Unit: My town. 📝 Weekly Dictation in Copy Book on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School).',
    pages: 'Copy Book',
    completed: false,
    block: 2,
    week: 5,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  },
  {
    id: 'cw-b2-w5-g2a-wed-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: englishPeriodsW5.G2A.Wednesday,
    subject: 'English',
    title: 'Outdoor Activity',
    details: 'Unit: My town. Outdoor interactive language activity and collaborative exercises.',
    pages: 'Outdoor Activity',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-wed-english',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: englishPeriodsW5.G2B.Wednesday,
    subject: 'English',
    title: 'Story Comprehension',
    details: 'Unit: My town. Story reading, vocabulary exploration, and comprehension discussion.',
    pages: 'Story',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-wed-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: englishPeriodsW5.G2C.Wednesday,
    subject: 'English',
    title: 'Movers Story',
    details: 'Unit: My town. Movers reading and story comprehension exercises on pages CW. 61, 62.',
    pages: 'CW. 61, 62',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2a-thu-english',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: englishPeriodsW5.G2A.Thursday,
    subject: 'English',
    title: '📝 Dictation',
    details: 'Unit: My town. 📝 Weekly Dictation in Copy Book for Class 2A on the 11 Town words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School).',
    pages: 'Copy Book',
    completed: false,
    block: 2,
    week: 5,
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
    period: englishPeriodsW5.G2B.Thursday,
    subject: 'English',
    title: 'Outdoor Activity',
    details: 'Unit: My town. Outdoor interactive communicative language activity.',
    pages: 'Outdoor Activity',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-thu-english',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: englishPeriodsW5.G2C.Thursday,
    subject: 'English',
    title: 'Reading & Listening',
    details: 'Unit: My town. Reading comprehension and listening activities on pages CW. 59, 60.',
    pages: 'CW. 59, 60',
    completed: false,
    block: 2,
    week: 5,
  }
);

['G2A', 'G2B', 'G2C'].forEach((cls) => {
  w5Hw.push({
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
    block: 2,
    week: 5,
  });
});

w5Hw.push({
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
  block: 2,
  week: 5,
});

['G2B', 'G2C'].forEach((cls) => {
  ['Saturday', 'Sunday', 'Monday'].forEach((day) => {
    const isNightBefore = day === 'Monday';
    w5Hw.push({
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
      block: 2,
      week: 5,
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
  w5Hw.push({
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
    block: 2,
    week: 5,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    pdfUrls: [dictationPdfUrl],
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  });
});

w5Tn.push(
  {
    id: 'tn-b2-w5-g2b-tue-dictation',
    classId: 'G2B',
    class_id: 'G2B',
    targetDay: 'Tuesday',
    subject: 'English',
    period: englishPeriodsW5.G2B.Tuesday,
    title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الثلاثاء (Class 2B)',
    note: '🚨 Tomorrow Tuesday is English Dictation for Class 2B in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
    arabicNote: `🚨 إنذار وتنبيه هام: غداً الثلاثاء موعد اختبار الإملاء (English Dictation) لكلاس 2B في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
    bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 5,
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
    period: englishPeriodsW5.G2C.Tuesday,
    title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الثلاثاء (Class 2C)',
    note: '🚨 Tomorrow Tuesday is English Dictation for Class 2C in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
    arabicNote: `🚨 إنذار وتنبيه هام: غداً الثلاثاء موعد اختبار الإملاء (English Dictation) لكلاس 2C في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
    bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 5,
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
    period: englishPeriodsW5.G2A.Thursday,
    title: '🚨 إنذار وتنبيه: إملاء لغة إنجليزية غداً الخميس (Class 2A)',
    note: '🚨 Tomorrow Thursday is English Dictation for Class 2A in Copy Book! 11 Words (Cinema, Post Office, Hospital, Flat, Shop, Cafe, Police Station, Park, Restaurant, Street, School). Bring Copy Book.',
    arabicNote: `🚨 إنذار وتنبيه هام: غداً الخميس موعد اختبار الإملاء (English Dictation) لكلاس 2A في كشكول الإملاء (Copy Book)!\n\n${dictationWordsArabic}`,
    bagItem: 'Dictation Copy Book (كشكول الإملاء)',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 5,
    pdfUrl: dictationPdfUrl,
    pdf_url: dictationPdfUrl,
    pdfUrls: [dictationPdfUrl],
    attachment: dictationPdfUrl,
    attachmentName: dictationPdfName,
  }
);

// --- 3. French B2W5 (Exact verbatim from seed_french_b2_w5.cjs, Nov 6 periods) ---
w5Cw.push(
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
  },
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
  },
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
  }
);

w5Hw.push(
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
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
    block: 2,
    week: 5,
  }
);

// --- 4. Mathematics B2W5 (Exact Weekly Plan PDF + Nov 6 periods) ---
const mathPeriodsW5 = {
  G2A: { Sunday: 3, Monday: 8, Tuesday: 3, Wednesday: 1, Thursday: 2 },
  G2B: { Sunday: 2, Monday: 3, Tuesday: 1, Wednesday: 5, Thursday: 6 },
  G2C: { Sunday: 1, Monday: 8, Tuesday: 3, Wednesday: 7, Thursday: 6 },
};

const mathLessonsW5 = [
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
    title: 'Unit 8: Using data — Test your self',
    details: 'Unit 8: Using data - Test your self. Resource: Maths-Grade2-B2-All-Sheet2 – Main.',
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
  mathLessonsW5.forEach((l) => {
    w5Cw.push({
      id: `cw-b2-w5-${cls.toLowerCase()}-${l.key}-math`,
      classId: cls,
      class_id: cls,
      day: l.day,
      period: mathPeriodsW5[cls][l.day],
      subject: 'Mathematics',
      title: l.title,
      details: l.details,
      pages: l.pages,
      completed: false,
      block: 2,
      week: 5,
    });

    if (l.hwPage) {
      w5Hw.push({
        id: `hw-b2-w5-${cls.toLowerCase()}-${l.key}-math`,
        classId: cls,
        class_id: cls,
        assignedDay: l.day,
        assigned_day: l.day,
        dueDay: l.dueDay,
        due_day: l.dueDay,
        subject: 'Mathematics',
        task: `Math Homework — ${l.hwPage}`,
        title: `Math Homework — ${l.hwPage}`,
        details: `Solve exercises on Page ${l.hwPage} in Maths-Grade2-B2-All-Sheet2 – Main.`,
        pages: l.hwPage,
        completed: false,
        priority: 'normal',
        block: 2,
        week: 5,
      });
    }
  });

  w5Tn.push({
    id: `tn-b2-w5-math-test-${cls}-Monday`,
    classId: cls,
    class_id: cls,
    targetDay: 'Tuesday',
    subject: 'Mathematics',
    period: mathPeriodsW5[cls].Tuesday,
    title: '🚨 اختبار ماث غداً (Math Test: Test your self - Unit 8)',
    note: 'Math Test (Test your self): Unit 8 Using data (Maths-Grade2-B2-All-Sheet2 - Main)',
    arabicNote: 'تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء على الوحدة الثامنة (Unit 8: Using data). يرجى المراجعة والاستعداد.',
    bagItem: 'Math Sheet + Math Notebook / Pencils',
    isQuiz: true,
    categoryType: 'quiz',
    block: 2,
    week: 5,
  });
});

// --- 5. Science B2W5 (Exact Weekly Plan PDF + Nov 6 periods, STRICTLY ZERO PDFs!) ---
w5Cw.push(
  {
    id: 'cw-b2-w5-g2a-sun-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 6,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials',
    details: 'Unit 4: Exploring and using materials - The properties of materials (Page 52). • Mrs. Salma Ahmed',
    pages: '52',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2a-tue-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 5,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The magnets',
    details: 'Unit 4: Exploring and using materials - The magnets (Page : 50). • Mrs. Salma Ahmed',
    pages: 'Page : 50',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2a-thu-science',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 8,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — General revision on unit 3',
    details: 'General revision on unit 3. • Mrs. Salma Ahmed',
    pages: 'Unit 3 Revision',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-sun-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 5,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials',
    details: 'Unit 4: Exploring and using materials - B- the properties of materials (Class B: 52). • Mrs. Salma Ahmed',
    pages: '52',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-wed-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 7,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The magnets',
    details: 'Unit 4: Exploring and using materials - The magnets (Page : 50). • Mrs. Salma Ahmed',
    pages: 'Page : 50',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-thu-science',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 7,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — General revision on unit 3',
    details: 'General revision on unit 3. • Mrs. Salma Ahmed',
    pages: 'Unit 3 Revision',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-sun-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 3,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — Types of materials',
    details: 'Unit 4: Exploring and using materials - C- types of materials (Class C: 47). • Mrs. Salma Ahmed',
    pages: '47',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-mon-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Monday',
    period: 4,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — The properties of materials',
    details: 'Unit 4: Exploring and using materials - The properties of materials (Class C: 52). • Mrs. Salma Ahmed',
    pages: '52',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-thu-science',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 1,
    subject: 'Science',
    title: 'Unit 4: Exploring and using materials — General revision on unit 3',
    details: 'General revision on unit 3. • Mrs. Salma Ahmed',
    pages: 'Unit 3 Revision',
    completed: false,
    block: 2,
    week: 5,
  }
);

w5Hw.push(
  {
    id: 'hw-b2-w5-g2a-mon-science',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Monday',
    assigned_day: 'Monday',
    dueDay: 'Tuesday',
    due_day: 'Tuesday',
    subject: 'Science',
    task: 'Science Homework: 48+53',
    title: 'Science Homework: 48+53',
    details: 'Unit 4: Exploring and using materials. Class A: Pages 48+53.',
    pages: '48+53',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 5,
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
    task: 'Science Homework: 48+53',
    title: 'Science Homework: 48+53',
    details: 'Unit 4: Exploring and using materials. Class B: Pages 48+53.',
    pages: '48+53',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 5,
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
    task: 'Science Homework: 53',
    title: 'Science Homework: 53',
    details: 'Unit 4: Exploring and using materials. Class C: Page 53.',
    pages: '53',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 5,
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
    task: 'Science Homework: Page : 51',
    title: 'Science Homework: Page : 51',
    details: 'Unit 4: Exploring and using materials. Solve Page : 51 (Class C is not included).',
    pages: 'Page : 51',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 5,
  }
);

// --- 6. Social Studies B2W5 (Exact Weekly Plan PDF + Nov 6 periods) ---
const ssHw4PdfW5 = '/materials/SocialStudies-Grade2-B2-W4-U2-HomeWork4 - Extra- (Minia).pdf';
const ssHw4FileNameW5 = 'SocialStudies-Grade2-B2-W4-U2-HomeWork4 - Extra- (Minia).pdf';
const ssHw5PdfW5 = '/materials/SocialStudies-Grade2-B2-W5-U2-HomeWork5 - Extra- (Minia).pdf';
const ssHw5FileNameW5 = 'SocialStudies-Grade2-B2-W5-U2-HomeWork5 - Extra- (Minia).pdf';

w5Cw.push(
  {
    id: 'cw-b2-w5-g2a-sun-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Sunday',
    period: 8,
    subject: 'Social Studies',
    title: 'مراجعة الاتجاهات',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة الاتجاهات (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ ولاء فايز',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-sun-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 7,
    subject: 'Social Studies',
    title: 'مراجعة الاتجاهات',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة الاتجاهات (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-mon-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 1,
    subject: 'Social Studies',
    title: 'مراجعة الاتجاهات',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة الاتجاهات (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2a-wed-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 5,
    subject: 'Social Studies',
    title: 'مراجعة مسئوليتي تجاه مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة مسئوليتي تجاه مدرستي (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ ولاء فايز',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-wed-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Wednesday',
    period: 8,
    subject: 'Social Studies',
    title: 'مراجعة مسئوليتي تجاه مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة مسئوليتي تجاه مدرستي (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-wed-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 1,
    subject: 'Social Studies',
    title: 'مراجعة مسئوليتي تجاه مدرستي',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة مسئوليتي تجاه مدرستي (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2a-thu-social',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 7,
    subject: 'Social Studies',
    title: 'مراجعة شخصيات المدرسة',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة شخصيات المدرسة (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ ولاء فايز',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2b-thu-social',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 2,
    subject: 'Social Studies',
    title: 'مراجعة شخصيات المدرسة',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة شخصيات المدرسة (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  },
  {
    id: 'cw-b2-w5-g2c-thu-social',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Thursday',
    period: 3,
    subject: 'Social Studies',
    title: 'مراجعة شخصيات المدرسة',
    details: 'الوحدة الثانية: المجتمع المدرسي - مراجعة شخصيات المدرسة (أوراق يتم تقديمها للطلاب من المعلمة). • أ/ منار حسن',
    pages: 'أوراق يتم تقديمها للطلاب من المعلمة',
    completed: false,
    block: 2,
    week: 5,
  }
);

[
  { cls: 'G2A', assignedDay: 'Saturday', dueDay: 'Sunday', period: 8 },
  { cls: 'G2C', assignedDay: 'Saturday', dueDay: 'Sunday', period: 7 },
  { cls: 'G2B', assignedDay: 'Sunday', dueDay: 'Monday', period: 1 },
].forEach(({ cls, assignedDay, dueDay, period }) => {
  w5Hw.push({
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
    block: 2,
    week: 5,
    pdfUrl: ssHw4PdfW5,
    pdf_url: ssHw4PdfW5,
    attachment: ssHw4PdfW5,
    fileName: ssHw4FileNameW5,
  });

  w5Tn.push({
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
    block: 2,
    week: 5,
    pdfUrl: ssHw4PdfW5,
    pdf_url: ssHw4PdfW5,
    fileName: ssHw4FileNameW5,
  });
});

[
  { cls: 'G2A', dueDay: 'Sunday' },
  { cls: 'G2B', dueDay: 'Monday' },
  { cls: 'G2C', dueDay: 'Sunday' },
].forEach(({ cls, dueDay }) => {
  w5Hw.push({
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
    block: 2,
    week: 5,
    pdfUrl: ssHw5PdfW5,
    pdf_url: ssHw5PdfW5,
    attachment: ssHw5PdfW5,
    fileName: ssHw5FileNameW5,
  });
});

// --- 7. ICT B2W5 (Exact verbatim from seed_ict_and_clean_english + update_g2b_sunday_ict_p6 + Nov 6 periods) ---
const ictScheduleW5 = {
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

const ictW5Sessions = [
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
  ictScheduleW5[cls].forEach((slot, idx) => {
    const sess = ictW5Sessions[idx];
    w5Cw.push({
      id: `cw-b2-w5-${cls.toLowerCase()}-${slot.day.toLowerCase()}-p${slot.period}-ict`,
      classId: cls,
      class_id: cls,
      day: slot.day,
      period: slot.period,
      subject: 'ICT',
      title: sess.title,
      details: sess.details,
      pages: sess.pages,
      completed: false,
      block: 2,
      week: 5,
    });

    if (slot.isLast) {
      w5Hw.push({
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
        block: 2,
        week: 5,
      });
    }

    w5Tn.push({
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
      block: 2,
      week: 5,
    });
  });
});

// =========================================================================
// PART C: ATOMIC UPDATE OF LOCAL JSON STORES & LIVE SUPABASE
// =========================================================================
const isB2W4OrW5 = (x) => Number(x.block || 1) === 2 && (Number(x.week || 1) === 4 || Number(x.week || 1) === 5);
const cleanDeleted = (arr) =>
  (Array.isArray(arr) ? arr : []).filter((id) => {
    const s = String(id).toLowerCase();
    return !s.includes('b2-w4') && !s.includes('b2-w5');
  });

const initData = JSON.parse(fs.readFileSync(INIT_PATH, 'utf8'));
const plannerData = JSON.parse(fs.readFileSync(PLANNER_PATH, 'utf8'));

for (const store of [initData, plannerData]) {
  store.classwork = [...(store.classwork || []).filter((x) => !isB2W4OrW5(x)), ...w4Cw, ...w5Cw];
  store.homework = [...(store.homework || []).filter((x) => !isB2W4OrW5(x)), ...w4Hw, ...w5Hw];
  store.tomorrowNotes = [...(store.tomorrowNotes || []).filter((x) => !isB2W4OrW5(x)), ...w4Tn, ...w5Tn];
  if (Array.isArray(store.specialTeacherNotes)) {
    store.specialTeacherNotes = [...store.specialTeacherNotes.filter((x) => !isB2W4OrW5(x)), ...w4Tn, ...w5Tn];
  }
  if (store.deletedPlannerItemIds) {
    store.deletedPlannerItemIds = cleanDeleted(store.deletedPlannerItemIds);
  }
  if (store.deletedTomorrowNoteIds) {
    store.deletedTomorrowNoteIds = cleanDeleted(store.deletedTomorrowNoteIds);
  }
}

fs.writeFileSync(INIT_PATH, JSON.stringify(initData, null, 2), 'utf8');
fs.writeFileSync(PLANNER_PATH, JSON.stringify(plannerData, null, 2), 'utf8');

console.log(`✅ Local JSON updated: B2W4 (CW=${w4Cw.length}, HW=${w4Hw.length}, TN=${w4Tn.length}) | B2W5 (CW=${w5Cw.length}, HW=${w5Hw.length}, TN=${w5Tn.length})`);

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function packHomeworkDetails(details, pdfUrl) {
  let res = details ? String(details).trim() : '';
  if (pdfUrl) {
    res = res ? `${res} ||PDF_URL:${pdfUrl.trim()}` : `||PDF_URL:${pdfUrl.trim()}`;
  }
  return res || null;
}

(async () => {
  await sb.from('classwork').delete().eq('block', 2).in('week', [4, 5]);
  await sb.from('homework').delete().eq('block', 2).in('week', [4, 5]);

  const allCw = [...w4Cw, ...w5Cw].map((c) => ({
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
    week: Number(c.week),
    link_url: c.linkUrl || null,
    link_title: c.linkTitle || null,
  }));

  for (let i = 0; i < allCw.length; i += 50) {
    const { error } = await sb.from('classwork').upsert(allCw.slice(i, i + 50), { onConflict: 'id' });
    if (error) console.error('Supabase CW upsert error:', error);
  }

  const allHw = [...w4Hw, ...w5Hw].map((h) => ({
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
    week: Number(h.week),
    is_link_task: Boolean(h.isLinkTask),
    link_url: h.linkUrl || null,
  }));

  for (let i = 0; i < allHw.length; i += 50) {
    const { error } = await sb.from('homework').upsert(allHw.slice(i, i + 50), { onConflict: 'id' });
    if (error) console.error('Supabase HW upsert error:', error);
  }

  // Merge B2W4 & B2W5 Tomorrow Notes into planner_settings.tomorrow_special_notes
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
        existingNotes = parsed.filter((n) => !isB2W4OrW5(n));
      }
    } catch {}
  }

  const mergedNotes = [...existingNotes, ...w4Tn, ...w5Tn];
  const { error: tnErr } = await sb.from('planner_settings').upsert(
    {
      key: 'tomorrow_special_notes',
      value: JSON.stringify(mergedNotes),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  );
  if (tnErr) console.error('Supabase TN upsert error:', tnErr);

  const [vcw4, vhw4, vcw5, vhw5, vcw6, vhw6] = await Promise.all([
    sb.from('classwork').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 4),
    sb.from('homework').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 4),
    sb.from('classwork').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 5),
    sb.from('homework').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 5),
    sb.from('classwork').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 6),
    sb.from('homework').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 6),
  ]);

  console.log(`✅ Live Supabase synced!`);
  console.log(`   B2W4: CW=${vcw4.count}, HW=${vhw4.count}, TN=${w4Tn.length}`);
  console.log(`   B2W5: CW=${vcw5.count}, HW=${vhw5.count}, TN=${w5Tn.length}`);
  console.log(`   B2W6 untouched: CW=${vcw6.count}, HW=${vhw6.count}`);
})();
