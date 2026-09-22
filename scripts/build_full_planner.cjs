const fs = require('fs');

// Read existing planner data
const existingData = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf-8'));
const ttContent = fs.readFileSync('src/data/timetables.ts', 'utf-8');
const match = ttContent.match(/export const CLASS_TIMETABLES:[\s\S]*?=\s*(\{[\s\S]*?\n\})/);
const timetables = eval('(' + match[1] + ')');

const existingCw = existingData.classwork || [];
const existingHw = existingData.homework || [];

// Preserve Week 1 & 2
const preservedCw = existingCw.filter(c => c.week !== 3);
const preservedHw = existingHw.filter(h => h.week !== 3);

// Subject Curricular Plans for Week 3:
// Sequence of lessons for each subject across the week:

const MATH_LESSONS = [
  {
    title: "Unit 1: 10 more / 10 less & Represent 3-digit number",
    details: "Use base-ten blocks, place value charts, and 100-squares to find 10 more and 10 less than any 2-digit or 3-digit number. Represent numbers using hundreds, tens, and ones.",
    pages: "Math Learner's Book p. 24-25, Practice Sheet 1 (Main)",
  },
  {
    title: "Unit 1: Pairs of 20 (Number Bonds to 20)",
    details: "Develop mental calculation strategies for finding pairs that make 20 (e.g., 14+6, 17+3). Solve number puzzles and missing number equations.",
    pages: "Math Practice Book p. 26-27, Grid Notebook",
  },
  {
    title: "Unit 1: Word problems (Addition & Subtraction)",
    details: "Solving multi-step real-world story problems involving addition and subtraction. Identifying clue words, bar model representations, and checking answers.",
    pages: "Math Learner's Book p. 28-29",
  },
  {
    title: "Unit 1: Add several numbers (Grouping strategies)",
    details: "Strategies for adding three or four single-digit numbers quickly by making 10 or finding doubles (e.g., 4 + 7 + 6 = 10 + 7 = 17).",
    pages: "Math Learner's Book p. 30-31, Math Sheet 1",
  },
  {
    title: "Unit 1: Mathematics - Review & Problem Solving Practice",
    details: "Comprehensive weekly review covering place value, pairs of 20, mental addition, and word problems. Formative assessment.",
    pages: "Math Practice Book p. 32-33",
  },
];

const ENGLISH_LESSONS = [
  {
    title: "Phonics & Vocabulary: Unit 1 Review & Blends",
    details: "Phonics practice focusing on short and long vowel sounds, initial consonant blends (bl, cl, fl, st, sp). Word building on the board.",
    pages: "Pupil's Book p. 12-14, Activity Book p. 10",
  },
  {
    title: "Grammar & Speaking: Class Objects & Verb to Be",
    details: "Classroom vocabulary (desk, whiteboard, backpack, ruler) and practicing 'am / is / are' in affirmative and question forms ('Is this a ruler? Yes, it is.').",
    pages: "Pupil's Book p. 15-16",
  },
  {
    title: "Reading & Punctuation marks: Capital Letters & Full Stops",
    details: "Guided reading of short sentences. Rules for capitalizing names, 'I', and beginning of sentences. Placing full stops and question marks accurately.",
    pages: "Pupil's Book p. 17-18, Copybook",
  },
  {
    title: "Story Reading & School Library Session",
    details: "Reading comprehension in the library: 'Our School Day'. Exploring picture dictionaries to find meanings of new classroom words.",
    pages: "Storybook, Picture Dictionary",
  },
  {
    title: "Cross-curricular & Writing: My School Community",
    details: "Writing simple sentences about school helpers and classroom spaces. Combining English vocabulary with Science and Art observations.",
    pages: "Activity Book p. 15-16",
  },
  {
    title: "Language Practice & Phonics Games",
    details: "Interactive spelling and phonics team games. Reinforcing correct pronunciation and word identification.",
    pages: "Pupil's Book p. 19-20",
  },
  {
    title: "Reading Comprehension & Dialogue",
    details: "Pair work dialogues practicing asking for classroom objects ('May I borrow a pencil?'). Reading fluency checks.",
    pages: "Activity Book p. 17-18",
  },
  {
    title: "Weekly Dictation & Handwriting Review",
    details: "Dictation evaluation on Week 3 classroom vocabulary (21 words). Emphasizing neat handwriting, baseline alignment, and capital letters.",
    pages: "Copybook (Dictation Sheet 1)",
  },
];

const ARABIC_LESSONS = [
  {
    title: "نص استماع: (مهنة أبي) - فهم المسموع والمناقشة",
    details: "الاستماع إلى نص مهنة أبي، الإجابة عن الأسئلة الشفهية، التعبير عن المهن المختلفة وتقدير قيمة العمل في المجتمع.",
    pages: "كتاب اللغة العربية ص 28-30",
  },
  {
    title: "القواعد والتراكيب: ظرف الزمان وظرف المكان",
    details: "التعرف على ظرف الزمان (صباحاً، مساءً، ليلاً، نهاراً) وظرف المكان (أمام، خلف، فوق، تحت) واستخدامهما في جمل مفيدة وحل التدريبات.",
    pages: "كتاب اللغة العربية ص 31-33",
  },
  {
    title: "نشيد: (مدرستي بيتي الثاني) وقراءة معبرة",
    details: "قراءة النشيد قراءة جهرية معبرة، مناقشة معاني المفردات والأساليب والتراكيب واستخراج الظواهر اللغوية (اللام الشمسية والقمرية والمدود).",
    pages: "كتاب اللغة العربية ص 34-35",
  },
  {
    title: "مكتبة وقراءة حرة: قصص تعليمية",
    details: "حصة قراءة حرة في المكتبة المدرسية لتنمية مهارات القراءة الصامتة والجهرية واكتساب مفردات لغوية ثرية ومناقشة فكرة القصة.",
    pages: "المكتبة المدرسية - قصة قصيرة",
  },
  {
    title: "إملاء أسبوعي في كراسة الطالب وتطبيقات لغوية",
    details: "تطبيق الإملاء الأسبوعي على الكلمات المقررة ومراعاة قواعد الكتابة الصحيحة (الحركات، التنوين، التاء المربوطة والمفتوحة).",
    pages: "كراسة الإملاء ص 15",
  },
  {
    title: "نشاط تطبيقي وأوراق عمل شاملة للوحدة الأولى",
    details: "حل أوراق العمل والأنشطة الإثرائية الشاملة لقواعد وأساليب الوحدة الأولى وتقييم مهارات الطالب الكتابية.",
    pages: "أوراق العمل الإثرائية",
  },
];

const SCIENCE_LESSONS = [
  {
    title: "Unit 2: Getting to know plants - Living and non-living things",
    details: "Introduction to Unit 2. Discuss the characteristics of living things (grow, need food/water, reproduce) and non-living things. Required Materials: Colored sheets with different colors, glue, colored pencils, a little crochet yarn.",
    pages: "Learner's Book p. 34-36 — Required: Colored sheets, glue, colored pencils, crochet yarn",
  },
  {
    title: "Unit 2: Getting to know plants - Parts of plants",
    details: "Identify and describe the main parts of plants: roots, stem, leaves, and flowers. Understand their key functions. Required Materials: Colored sheets, glue, colored pencils, crochet yarn.",
    pages: "Learner's Book p. 37 — Required: Colored sheets, glue, colored pencils, crochet yarn",
  },
  {
    title: "Unit 2: Getting to know plants - The needs of plants",
    details: "Learn about the essential needs of plants to grow and survive: sunlight, water, air, and healthy soil. Conduct classroom plant observations.",
    pages: "Learner's Book p. 39 — Required: Colored sheets, glue, colored pencils, crochet yarn",
  },
];

const SOCIAL_STUDIES_LESSONS = [
  {
    title: "الدرس الأول: فصلي الجديد وقواعد العمل المشترك",
    details: "التعرف على بيئة الفصل وأهمية احترام قواعد الفصل، والتعاون مع الزملاء، واستخدام بطاقات التعلم النشط.",
    pages: "كتاب الدراسات الاجتماعية ص 10-12",
  },
  {
    title: "الدرس الثاني: مشاعري وكيفية التعبير عنها بإيجابية",
    details: "مناقشة المشاعر المختلفة (الفرح، الغضب، الحزن، الحماس) وكيفية التعامل مع المشاعر والتواصل اللطيف مع الآخرين.",
    pages: "كتاب الدراسات الاجتماعية ص 13-14",
  },
  {
    title: "الدرس الثالث: من هو الصديق؟ وصفات الصديق الصالح",
    details: "استكشاف معنى الصداقة الحقيقية، والصفات الإيجابية في الصديق مثل الصدق، الأمانة، والمساعدة، والمشاركة في الأنشطة المدرسية.",
    pages: "كتاب الدراسات الاجتماعية ص 15-16",
  },
];

const FRENCH_LESSONS = [
  {
    title: "Unité 4: Présenter la famille - أفراد العائلة 🇫🇷",
    details: "Présenter les membres de la famille (le père, la mère, le frère, la sœur, le grand-père, la grand-mère). اضغط على الرابط بالأسفل لفتح شيت درس أفراد العائلة.",
    pages: "Manuel de cours p. 16, 18, 19 + Cahier",
    linkUrl: "https://drive.google.com/file/d/1IbBjKLoRTzA7gjQ72VXFOJO4R1NpRdJk/view",
    linkTitle: "شيت درس أفراد العائلة - Les membres de la famille 📄",
  },
  {
    title: "Unité 4: Les adjectifs possessifs (mon, ma, mes / ton, ta, tes)",
    details: "Apprendre et pratiquer les adjectifs possessifs pour désigner les membres de la famille et les objets personnels. Pratique orale et écrite.",
    pages: "Manuel de cours p. 20-21",
    linkUrl: "https://drive.google.com/file/d/1IbBjKLoRTzA7gjQ72VXFOJO4R1NpRdJk/view",
    linkTitle: "شيت درس أفراد العائلة - Les membres de la famille 📄",
  },
  {
    title: "Unité 4: Les goûts et les activités & Cahier d'activités",
    details: "Exprimer ce qu'on aime et ce qu'on n'aime pas (j'aime / je n'aime pas). Prononciation du son (ui - oi). Résolution des exercices du cahier.",
    pages: "Cahier d'activités p. 26",
    linkUrl: "https://drive.google.com/file/d/1IbBjKLoRTzA7gjQ72VXFOJO4R1NpRdJk/view",
    linkTitle: "شيت درس أفراد العائلة - Les membres de la famille 📄",
  },
];

const RELIGION_LESSONS = [
  {
    title: "تربية دينية: سورة التين وتفسير معاني الآيات الكريمة",
    details: "التربية الدينية الإسلامية: تلاوة سورة التين الكريمة وحفظها وفهم معاني الآيات الكريمة (خلق الإنسان في أحسن تقويم). / التربية المسيحية: دروس المحبة وعطاء الله من الكتاب المقدس.",
    pages: "كتاب التربية الدينية ص 18-20",
  },
  {
    title: "تربية دينية: أركان الإسلام والأخلاق الفاضلة",
    details: "التربية الدينية الإسلامية: دراسة أركان الإسلام وأهمية الصدق وبر الوالدين وحسن الخلق. / التربية المسيحية: قيم التسامح والتعاون ومساعدة المحتاجين.",
    pages: "كتاب التربية الدينية ص 21-23",
  },
];

const ICT_LESSONS = [
  {
    title: "Unit 1: Working with Text - The Keyboard and Special Keys",
    details: "Introduction to computer keyboard layout. Identifying and understanding special keys: Enter, Space bar, Shift, Backspace, Delete.",
    pages: "ICT Booklet / Computer Lab Session",
  },
  {
    title: "Unit 1: Practical Typing in the Computer Lab",
    details: "Hands-on computer practice: Opening a simple text editor, typing short words and sentences, using Space bar and Enter correctly.",
    pages: "Computer Lab Activities",
  },
];

const ARTS_LESSONS = [
  {
    title: "تربية فنية: استكشاف الألوان الأساسية والثانوية",
    details: "التعرف على الألوان الأساسية (الأحمر، الأزرق، الأصفر) وكيفية دمجها لتكوين ألوان ثانوية ورسم لوحة فنية لزهور الربيع والنباتات.",
    pages: "كراسة الرسم والألوان",
  },
  {
    title: "تربية فنية: تشكيل مجسمات ورقية وزخارف هندسية",
    details: "تطبيق عملي باستخدام الأوراق الملونة والقص واللصق لتكوين أشكال نباتية وزهور تعبيرية وتنسيق اللوحة.",
    pages: "الأوراق الملونة ومقص آمن وصمغ",
  },
];

const PE_LESSONS = [
  {
    title: "تربية بدنية: الإحماء وتمارين الرشاقة والتوازن",
    details: "تمارين الإحماء الحركي، الجري الخفيف، تدريبات التوازن وتنمية التوافق العضلي العصبي في الملعب المدرسي.",
    pages: "الزي الرياضي المدرسي والحذاء الرياضي",
  },
  {
    title: "تربية بدنية: ألعاب التتابع والروح الرياضية والعمل الجماعي",
    details: "ألعاب جماعية صغيرة تعتمد على التتابع والسرعة والتعاون الإيجابي بين الطلاب مع التأكيد على الروح الرياضية.",
    pages: "أدوات التربية الرياضية بالملعب",
  },
];

const MUSIC_LESSONS = [
  {
    title: "تربية موسيقية: تدريبات الإيقاع والأناشيد المدرسية",
    details: "التعرف على الإيقاعات الموسيقية البسيطة والتدريب الصوتي الجماعي على النشيد الوطني وأناشيد المدرسة.",
    pages: "غرفة الموسيقى المدرسية",
  },
];

// Helper to track lesson indices per subject per class so sequential lessons progress naturally:
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const classes = ['G2A', 'G2B', 'G2C'];

const newWeek3Cw = [];

for (const cls of classes) {
  const lessonCounters = {
    Mathematics: 0,
    English: 0,
    Arabic: 0,
    Science: 0,
    'Social Studies': 0,
    French: 0,
    Religion: 0,
    ICT: 0,
    Arts: 0,
    PE: 0,
    Music: 0,
  };

  for (const day of days) {
    const slots = timetables[cls][day] || [];
    for (const slot of slots) {
      const subj = slot.subject;
      let lessonData;
      let counter = lessonCounters[subj] || 0;

      if (subj === 'Mathematics') {
        lessonData = MATH_LESSONS[counter % MATH_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'English') {
        lessonData = ENGLISH_LESSONS[counter % ENGLISH_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'Arabic') {
        lessonData = ARABIC_LESSONS[counter % ARABIC_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'Science') {
        lessonData = SCIENCE_LESSONS[counter % SCIENCE_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'Social Studies') {
        lessonData = SOCIAL_STUDIES_LESSONS[counter % SOCIAL_STUDIES_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'French') {
        lessonData = FRENCH_LESSONS[counter % FRENCH_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'Religion') {
        lessonData = RELIGION_LESSONS[counter % RELIGION_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'ICT') {
        lessonData = ICT_LESSONS[counter % ICT_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'Arts') {
        lessonData = ARTS_LESSONS[counter % ARTS_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'PE') {
        lessonData = PE_LESSONS[counter % PE_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else if (subj === 'Music') {
        lessonData = MUSIC_LESSONS[counter % MUSIC_LESSONS.length];
        lessonCounters[subj] = counter + 1;
      } else {
        lessonData = {
          title: `درس مادة ${subj}`,
          details: `الحصة الدراسية لمادة ${subj} وفق الخطة الأسبوعية`,
          pages: 'الكتب والكشاكيل المدرسية',
        };
      }

      newWeek3Cw.push({
        id: `cw-b1-w3-${cls}-${day}-p${slot.period}-${subj.toLowerCase().replace(/\s+/g, '-')}`,
        classId: cls,
        day: day,
        period: slot.period,
        subject: subj,
        title: lessonData.title,
        details: lessonData.details,
        pages: lessonData.pages,
        completed: false,
        block: 1,
        week: 3,
        linkUrl: lessonData.linkUrl || undefined,
        linkTitle: lessonData.linkTitle || undefined,
      });
    }
  }
}

// Generate Week 3 Homework for all subjects:
const newWeek3Hw = [];

// 1. English: Dictation list on every day (due next day) + Activity book homework
const nextDayMap = {
  Sunday: 'Monday',
  Monday: 'Tuesday',
  Tuesday: 'Wednesday',
  Wednesday: 'Thursday',
  Thursday: 'Sunday',
};

const dictationDetails = `Block 1 – W3 Dictation list:\n\nWords:\n• Teacher  • Desk  • Chair  • Computer  • Door  • Whiteboard  • Window\n• Pen  • Pencil  • Sharpener  • Eraser  • Table  • Notebook  • Glue\n• Scissors  • Book  • Bookshelf  • Backpack  • Ruler  • Cupboard  • Bookcase\n\nNote: Always start with capital letters.\nPrepared by: Mr. Mostafa Mohammed\nLearning Outcome: R7 use with some support a simple picture dictionary`;

for (const cls of classes) {
  // English Dictation for each day
  for (const day of days) {
    newWeek3Hw.push({
      id: `hw-b1-w3-${cls}-eng-dictation-${day}`,
      classId: cls,
      assignedDay: day,
      dueDay: nextDayMap[day],
      subject: 'English',
      task: 'dictation',
      details: dictationDetails,
      pages: 'Study Sheet (1 of 1)',
      completed: false,
      priority: 'normal',
      block: 1,
      week: 3,
    });
  }

  // English Activity Book (Tuesday -> Thursday)
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-eng-act-tue`,
    classId: cls,
    assignedDay: 'Tuesday',
    dueDay: 'Thursday',
    subject: 'English',
    task: 'English Homework: Activity Book pages 61 and 62',
    details: 'Complete exercises on Classroom Objects and Verb to Be (Activity Book p. 61 & 62).',
    pages: 'Activity Book pages 61 & 62',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // English Activity Book (Thursday -> Sunday)
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-eng-act-thu`,
    classId: cls,
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'English',
    task: 'English Homework: Activity Book pages 60 and 63',
    details: 'Complete reading comprehension, capital letters, and punctuation practice.',
    pages: 'Activity Book pages 60 & 63',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // 2. Mathematics Homework:
  // Sunday -> Tuesday: Place value & 10 more/less
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-math-sun-p79`,
    classId: cls,
    assignedDay: 'Sunday',
    dueDay: 'Tuesday',
    subject: 'Mathematics',
    task: 'Math Homework: Page 79 & Page 84 Q2',
    details: 'Practice 10 more / 10 less and representing 3-digit numbers on Page 79 and Page 84 (Question 2).',
    pages: 'Math Learner / Practice Book p. 79, 84 Q2',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // Tuesday -> Thursday: Pairs of 20
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-math-tue-pairs20`,
    classId: cls,
    assignedDay: 'Tuesday',
    dueDay: 'Thursday',
    subject: 'Mathematics',
    task: 'Math Homework: Practice Sheet 1 - Pairs of 20',
    details: 'Solve missing number bonds and pairs of 20 practice on Math Practice Sheet 1.',
    pages: 'Math Practice Sheet 1 (Main & Practice)',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // Wednesday -> Sunday: Adding several numbers & word problems
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-math-wed-p85`,
    classId: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Sunday',
    subject: 'Mathematics',
    task: 'Math Homework: Practice Book Pages 85 & 86',
    details: 'Complete word problems and strategies for adding several numbers on Pages 85 and 86.',
    pages: 'Math Practice Book p. 85, 86',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // 3. Arabic Homework:
  // Sunday -> Tuesday: كتابة نشيد مدرستي بيتي الثاني
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-arabic-sun-nasheed`,
    classId: cls,
    assignedDay: 'Sunday',
    dueDay: 'Tuesday',
    subject: 'Arabic',
    task: 'كتابة نشيد (مدرستي بيتي الثاني) في كراسة الطالب',
    details: 'كتابة أبيات نشيد مدرستي بيتي الثاني بخط النسخ الجميل ومضبوطاً بالحركات في كراسة الطالب وتجهيز الكشكول للمراجعة.',
    pages: 'كتاب اللغة العربية ص 34-35 والكراسة',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // Tuesday -> Thursday: حل تدريبات كراسة النشاط ص 37-38
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-arabic-tue-p37`,
    classId: cls,
    assignedDay: 'Tuesday',
    dueDay: 'Thursday',
    subject: 'Arabic',
    task: 'حل تدريبات كراسة نشاط الوحدة الأولى ص 37-38',
    details: 'حل تدريبات وتطبيقات ظرف الزمان وظرف المكان والمفردات في كراسة النشاط صفحة 37 وصفحة 38.',
    pages: 'كراسة النشاط ص 37-38',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // Wednesday -> Thursday: إملاء أسبوعي
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-arabic-wed-imlaa`,
    classId: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Arabic',
    task: 'التدريب على كلمات الإملاء الأسبوعي في كراسة الإملاء',
    details: 'التدرب على كتابة كلمات الإملاء للوحدة الأولى وقواعد التنوين والمدود استعداداً للاختبار الأسبوعي في الحصة.',
    pages: 'كراسة الإملاء ص 15',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // 4. Science Homework:
  // Monday -> Tuesday: Workbook p. 36
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-science-mon-p36`,
    classId: cls,
    assignedDay: cls === 'G2C' ? 'Monday' : 'Sunday',
    dueDay: cls === 'G2C' ? 'Tuesday' : 'Monday',
    subject: 'Science',
    task: 'Workbook / Booklet: Page 36',
    details: 'Unit 2: Getting to know plants - Solve Page 36 about Living and non-living things.',
    pages: 'Page 36',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // Wednesday -> Thursday: Workbook p. 38
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-science-wed-p38`,
    classId: cls,
    assignedDay: 'Wednesday',
    dueDay: 'Thursday',
    subject: 'Science',
    task: 'Workbook / Booklet: Page 38',
    details: 'Unit 2: Getting to know plants - Solve Page 38 about Parts of plants.',
    pages: 'Page 38',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });

  // 5. Social Studies Homework:
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-social-wed-sheet`,
    classId: cls,
    assignedDay: 'Wednesday',
    dueDay: cls === 'G2B' ? 'Monday' : 'Sunday',
    subject: 'Social Studies',
    task: 'إكمال واجب الدرس المنزلي (شيت الواجب المرفق ص 14)',
    details: 'يتم إرسال الواجب المنزلي يوم الأربعاء ويتم استلامه أول حصة في الأسبوع - حل شيت الواجب المرفق صفحة 14.',
    pages: 'شيت الواجب المنزلي ص 14',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
    pdfUrl: '/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf',
  });

  // 6. French Homework:
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-french-p26`,
    classId: cls,
    assignedDay: cls === 'G2A' ? 'Thursday' : (cls === 'G2B' ? 'Tuesday' : 'Wednesday'),
    dueDay: cls === 'G2A' ? 'Sunday' : (cls === 'G2B' ? 'Thursday' : 'Sunday'),
    subject: 'French',
    task: 'Fiche de devoir: حل صفحة 26 في كراسة الواجب',
    details: 'Résoudre les activités de la page 26 dans le cahier d\'activités (Les membres de la famille et les adjectifs possessifs).',
    pages: 'Cahier d\'activités p. 26',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
    linkUrl: 'https://drive.google.com/file/d/1IbBjKLoRTzA7gjQ72VXFOJO4R1NpRdJk/view',
  });

  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-french-quiz-rev`,
    classId: cls,
    assignedDay: 'Sunday',
    dueDay: 'Tuesday',
    subject: 'French',
    task: 'French Quiz: مراجعة درس أفراد العائلة',
    details: 'مراجعة أفراد العائلة (le père, la mère, le frère, la sœur, le grand-père, la grand-mère) للاختبار القصير.',
    pages: 'Manuel de cours p. 16, 18, 19 + Cahier',
    completed: false,
    priority: 'urgent',
    block: 1,
    week: 3,
    linkUrl: 'https://drive.google.com/file/d/1IbBjKLoRTzA7gjQ72VXFOJO4R1NpRdJk/view',
  });

  // 7. Religion Homework:
  newWeek3Hw.push({
    id: `hw-b1-w3-${cls}-religion-tin`,
    classId: cls,
    assignedDay: 'Tuesday',
    dueDay: 'Sunday',
    subject: 'Religion',
    task: 'حفظ ومراجعة سورة التين وحل أنشطة كتاب التربية الدينية',
    details: 'حفظ ومراجعة سورة التين الكريمة وتلاوتها بإتقان وحل أنشطة الدرس ص 18-20 في كتاب التربية الدينية.',
    pages: 'كتاب التربية الدينية ص 18-20',
    completed: false,
    priority: 'normal',
    block: 1,
    week: 3,
  });
}

// Assemble full lists
const finalClasswork = [...preservedCw, ...newWeek3Cw];
const finalHomework = [...preservedHw, ...newWeek3Hw];

const updatedPlannerData = {
  ...existingData,
  classwork: finalClasswork,
  homework: finalHomework,
};

fs.writeFileSync('data/planner_data.json', JSON.stringify(updatedPlannerData, null, 2), 'utf-8');
console.log('Successfully generated full planner_data.json:');
console.log('Total Classwork entries:', finalClasswork.length, '(Week 3:', newWeek3Cw.length, ')');
console.log('Total Homework entries:', finalHomework.length, '(Week 3:', newWeek3Hw.length, ')');
