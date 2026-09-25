const fs = require('fs');

console.log('Starting Social Studies Week 3 & 4 Seeder...');

// Read original data
const plannerPath = 'data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// 1. Clean existing Week 3 and Week 4 Social Studies entries from local json (just in case)
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !((cw.week === 3 || cw.week === 4) && cw.subject === 'Social Studies')
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !((hw.week === 3 || hw.week === 4) && hw.subject === 'Social Studies')
);
plannerData.tomorrowNotes = (plannerData.tomorrowNotes || []).filter(
  (tn) => !((tn.week === 3 || tn.week === 4) && tn.subject === 'Social Studies')
);

// 2. Define Classwork (الكلاس وورك) for Week 3
const week3Classwork = [
  // --- G2A ---
  {
    id: "cw-b1-w3-G2A-Sunday-p2-soc",
    classId: "G2A",
    day: "Sunday",
    period: 2,
    subject: "Social Studies",
    title: "الدرس الأول: فصلي الجديد وقواعد العمل المشترك",
    details: "التعرف على بيئة الفصل وأهمية احترام قواعد الفصل، والتعاون مع الزملاء، واستخدام بطاقات التعلم النشط.",
    pages: "ص 14",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2A-Wednesday-p5-soc",
    classId: "G2A",
    day: "Wednesday",
    period: 5,
    subject: "Social Studies",
    title: "الدرس الثاني: مشاعري وكيفية التعبير عنها بإيجابية",
    details: "مناقشة المشاعر المختلفة (الفرح، الغضب، الحزن، الحماس) وكيفية التعامل مع المشاعر والتواصل اللطيف مع الآخرين.",
    pages: "ص 15-18",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w3-G2A-Thursday-p7-soc",
    classId: "G2A",
    day: "Thursday",
    period: 7,
    subject: "Social Studies",
    title: "الدرس الثالث: من هو الصديق؟ وصفات الصديق الصالح",
    details: "استكشاف معنى الصداقة الحقيقية، والصفات الإيجابية في الصديق مثل الصدق، الأمانة، والمساعدة، والمشاركة في الأنشطة المدرسية.",
    pages: "ص 19-20",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2A"
  },

  // --- G2B ---
  {
    id: "cw-b1-w3-G2B-Monday-p1-soc",
    classId: "G2B",
    day: "Monday",
    period: 1,
    subject: "Social Studies",
    title: "الدرس الأول: فصلي الجديد وقواعد العمل المشترك",
    details: "التعرف على بيئة الفصل وأهمية احترام قواعد الفصل، والتعاون مع الزملاء، واستخدام بطاقات التعلم النشط.",
    pages: "ص 14",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2B-Wednesday-p2-soc",
    classId: "G2B",
    day: "Wednesday",
    period: 2,
    subject: "Social Studies",
    title: "الدرس الثاني: مشاعري وكيفية التعبير عنها بإيجابية",
    details: "مناقشة المشاعر المختلفة (الفرح، الغضب، الحزن، الحماس) وكيفية التعامل مع المشاعر والتواصل اللطيف مع الآخرين.",
    pages: "ص 15-18",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w3-G2B-Thursday-p3-soc",
    classId: "G2B",
    day: "Thursday",
    period: 3,
    subject: "Social Studies",
    title: "الدرس الثالث: من هو الصديق؟ وصفات الصديق الصالح",
    details: "استكشاف معنى الصداقة الحقيقية، والصفات الإيجابية في الصديق مثل الصدق، الأمانة، والمساعدة، والمشاركة في الأنشطة المدرسية.",
    pages: "ص 19-20",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2B"
  },

  // --- G2C ---
  {
    id: "cw-b1-w3-G2C-Sunday-p7-soc",
    classId: "G2C",
    day: "Sunday",
    period: 7,
    subject: "Social Studies",
    title: "الدرس الأول: فصلي الجديد وقواعد العمل المشترك",
    details: "التعرف على بيئة الفصل وأهمية احترام قواعد الفصل، والتعاون مع الزملاء، واستخدام بطاقات التعلم النشط.",
    pages: "ص 14",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },
  {
    id: "cw-b1-w3-G2C-Monday-p4-soc",
    classId: "G2C",
    day: "Monday",
    period: 4,
    subject: "Social Studies",
    title: "الدرس الثاني: مشاعري وكيفية التعبير عنها بإيجابية",
    details: "مناقشة المشاعر المختلفة (الفرح، الغضب، الحزن، الحماس) وكيفية التعامل مع المشاعر والتواصل اللطيف مع الآخرين.",
    pages: "ص 15-18",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  },
  {
    id: "cw-b1-w3-G2C-Wednesday-p8-soc",
    classId: "G2C",
    day: "Wednesday",
    period: 8,
    subject: "Social Studies",
    title: "الدرس الثالث: من هو الصديق؟ وصفات الصديق الصالح",
    details: "استكشاف معنى الصداقة الحقيقية، والصفات الإيجابية في الصديق مثل الصدق، الأمانة، والمساعدة، والمشاركة في الأنشطة المدرسية.",
    pages: "ص 19-20",
    completed: false,
    block: 1,
    week: 3,
    class_id: "G2C"
  }
];

// 3. Define Homework (الواجب المنزلي) for Week 3
const week3Homework = [
  {
    id: "hw-b1-w3-G2A-social-Wed-1",
    classId: "G2A",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Social Studies",
    task: "تسليم شيت الدراسات الاجتماعية (شيت 1 - الرئيسي)",
    details: "حل ومراجعة شيت الدراسات الاجتماعية المرفق (شيت 1 - الرئيسي) ص 14-20.",
    pages: "شيت الدراسات الاجتماعية (ص 14-20)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2A",
    pdfUrl: "https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483174967_SocialStudies-Grade2-B1-All-U1-Sheet1_-_Main__1_.pdf"
  },
  {
    id: "hw-b1-w3-G2B-social-Wed-1",
    classId: "G2B",
    assignedDay: "Wednesday",
    dueDay: "Monday",
    subject: "Social Studies",
    task: "تسليم شيت الدراسات الاجتماعية (شيت 1 - الرئيسي)",
    details: "حل ومراجعة شيت الدراسات الاجتماعية المرفق (شيت 1 - الرئيسي) ص 14-20.",
    pages: "شيت الدراسات الاجتماعية (ص 14-20)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2B",
    pdfUrl: "https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483174967_SocialStudies-Grade2-B1-All-U1-Sheet1_-_Main__1_.pdf"
  },
  {
    id: "hw-b1-w3-G2C-social-Wed-1",
    classId: "G2C",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Social Studies",
    task: "تسليم شيت الدراسات الاجتماعية (شيت 1 - الرئيسي)",
    details: "حل ومراجعة شيت الدراسات الاجتماعية المرفق (شيت 1 - الرئيسي) ص 14-20.",
    pages: "شيت الدراسات الاجتماعية (ص 14-20)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 3,
    class_id: "G2C",
    pdfUrl: "https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483174967_SocialStudies-Grade2-B1-All-U1-Sheet1_-_Main__1_.pdf"
  }
];

// 4. Define Tomorrow Notes (تذكيرات شاشة الغد) for Week 3 using the MAIN SHEET
const week3TomorrowNotes = [
  {
    id: "tn-b1-w3-G2A-Sat-social-submit",
    classId: "G2A",
    targetDay: "Sunday",
    subject: "Social Studies",
    note: "تسليم شيت الدراسات الاجتماعية (شيت 1 - الرئيسي)",
    arabicNote: "تذكير لكلاس A: تسليم شيت الدراسات الاجتماعية غداً الأحد (شيت 1 - الرئيسي)",
    bagItem: "شيت الدراسات الاجتماعية (Sheet 1 - Main)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2A",
    pdfUrl: "https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483174967_SocialStudies-Grade2-B1-All-U1-Sheet1_-_Main__1_.pdf"
  },
  {
    id: "tn-b1-w3-G2B-Sun-social-submit",
    classId: "G2B",
    targetDay: "Monday",
    subject: "Social Studies",
    note: "تسليم شيت الدراسات الاجتماعية (شيت 1 - الرئيسي)",
    arabicNote: "تذكير لكلاس B: تسليم شيت الدراسات الاجتماعية غداً الاثنين (شيت 1 - الرئيسي)",
    bagItem: "شيت الدراسات الاجتماعية (Sheet 1 - Main)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2B",
    pdfUrl: "https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483174967_SocialStudies-Grade2-B1-All-U1-Sheet1_-_Main__1_.pdf"
  },
  {
    id: "tn-b1-w3-G2C-Sat-social-submit",
    classId: "G2C",
    targetDay: "Sunday",
    subject: "Social Studies",
    note: "تسليم شيت الدراسات الاجتماعية (شيت 1 - الرئيسي)",
    arabicNote: "تذكير لكلاس C: تسليم شيت الدراسات الاجتماعية غداً الأحد (شيت 1 - الرئيسي)",
    bagItem: "شيت الدراسات الاجتماعية (Sheet 1 - Main)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 3,
    class_id: "G2C",
    pdfUrl: "https://umryrjwmlkdbjmgmnbkt.supabase.co/storage/v1/object/public/school_materials/1789483174967_SocialStudies-Grade2-B1-All-U1-Sheet1_-_Main__1_.pdf"
  }
];

// 5. Define Classwork (الكلاس وورك) for Week 4
const week4Classwork = [
  {
    id: "cw-b1-w4-G2A-Sunday-p2-soc1",
    classId: "G2A",
    day: "Sunday",
    period: 2,
    subject: "Social Studies",
    title: "الدرس الأول: سلوكي يحافظ على بيئتي + تسليم واجب الدراسات الاجتماعية (شيت 2)",
    details: "الدرس الأول: سلوكي يحافظ على بيئتي - التعرف على السلوكيات الإيجابية والمسؤولة التي تساعد في الحفاظ على البيئة المحيطة بنا وحمايتها من التلوث، بالإضافة لتسليم واستلام شيت الواجب المنزلي 2 - إضافي.",
    pages: "من الصفحة 21 - 22 + شيت 2",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf",
    linkUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-2.html",
    linkTitle: "شيت الواجب التفاعلي (رقم 2)",
    class_id: "G2A"
  },
  {
    id: "cw-b1-w4-G2C-Sunday-p7-soc1",
    classId: "G2C",
    day: "Sunday",
    period: 7,
    subject: "Social Studies",
    title: "الدرس الأول: سلوكي يحافظ على بيئتي + تسليم واجب الدراسات الاجتماعية (شيت 2)",
    details: "الدرس الأول: سلوكي يحافظ على بيئتي - التعرف على السلوكيات الإيجابية والمسؤولة التي تساعد في الحفاظ على البيئة المحيطة بنا وحمايتها من التلوث، بالإضافة لتسليم واستلام شيت الواجب المنزلي 2 - إضافي.",
    pages: "من الصفحة 21 - 22 + شيت 2",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf",
    linkUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-2.html",
    linkTitle: "شيت الواجب التفاعلي (رقم 2)",
    class_id: "G2C"
  },
  {
    id: "cw-b1-w4-G2B-Monday-p1-soc1",
    classId: "G2B",
    day: "Monday",
    period: 1,
    subject: "Social Studies",
    title: "الدرس الأول: سلوكي يحافظ على بيئتي + تسليم واجب الدراسات الاجتماعية (شيت 2)",
    details: "الدرس الأول: سلوكي يحافظ على بيئتي - التعرف على السلوكيات الإيجابية والمسؤولة التي تساعد في الحفاظ على البيئة المحيطة بنا وحمايتها من التلوث، بالإضافة لتسليم واستلام شيت الواجب المنزلي 2 - إضافي.",
    pages: "من الصفحة 21 - 22 + شيت 2",
    completed: false,
    block: 1,
    week: 4,
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf",
    linkUrl: "/materials/SocialStudies-Grade2-B1-HomeWork-2.html",
    linkTitle: "شيت الواجب التفاعلي (رقم 2)",
    class_id: "G2B"
  },
  {
    id: "cw-b1-w4-G2C-Wednesday-p8-soc2",
    classId: "G2C",
    day: "Wednesday",
    period: 8,
    subject: "Social Studies",
    title: "الدرس الثاني: منزلي ومدرستي",
    details: "الدرس الثاني: منزلي ومدرستي - فهم أهمية الحفاظ على نظافة وترتيب المنزل والمدرسة والالتزام بالقواعد والواجبات داخل كل منهما.",
    pages: "الصفحة 23",
    completed: false,
    block: 1,
    week: 4,
    class_id: "G2C"
  },
  {
    id: "cw-b1-w4-G2B-Wednesday-p2-soc2",
    classId: "G2B",
    day: "Wednesday",
    period: 2,
    subject: "Social Studies",
    title: "الدرس الثاني: منزلي ومدرستي",
    details: "الدرس الثاني: منزلي ومدرستي - فهم أهمية الحفاظ على نظافة وترتيب المنزل والمدرسة والالتزام بالقواعد والواجبات داخل كل منهما.",
    pages: "الصفحة 23",
    completed: false,
    block: 1,
    week: 4,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w4-G2A-Wednesday-p5-soc2",
    classId: "G2A",
    day: "Wednesday",
    period: 5,
    subject: "Social Studies",
    title: "الدرس الثاني: منزلي ومدرستي",
    details: "الدرس الثاني: منزلي ومدرستي - فهم أهمية الحفاظ على نظافة وترتيب المنزل والمدرسة والالتزام بالقواعد والواجبات داخل كل منهما.",
    pages: "الصفحة 23",
    completed: false,
    block: 1,
    week: 4,
    class_id: "G2A"
  },
  {
    id: "cw-b1-w4-G2C-Thursday-p4-soc3",
    classId: "G2C",
    day: "Thursday",
    period: 4,
    subject: "Social Studies",
    title: "الدرس الثالث: اختلافنا سر تميزنا",
    details: "الدرس الثالث: اختلافنا سر تميزنا - تقدير الاختلاف بين البشر في المظهر والقدرات والاهتمامات، وفهم أن الاختلاف يكمل بعضنا البعض وهو سر تميز مجتمعنا.",
    pages: "من الصفحة 24 - 29",
    completed: false,
    block: 1,
    week: 4,
    class_id: "G2C"
  },
  {
    id: "cw-b1-w4-G2B-Thursday-p3-soc3",
    classId: "G2B",
    day: "Thursday",
    period: 3,
    subject: "Social Studies",
    title: "الدرس الثالث: اختلافنا سر تميزنا",
    details: "الدرس الثالث: اختلافنا سر تميزنا - تقدير الاختلاف بين البشر في المظهر والقدرات والاهتمامات، وفهم أن الاختلاف يكمل بعضنا البعض وهو سر تميز مجتمعنا.",
    pages: "من الصفحة 24 - 29",
    completed: false,
    block: 1,
    week: 4,
    class_id: "G2B"
  },
  {
    id: "cw-b1-w4-G2A-Thursday-p7-soc3",
    classId: "G2A",
    day: "Thursday",
    period: 7,
    subject: "Social Studies",
    title: "الدرس الثالث: اختلافنا سر تميزنا",
    details: "الدرس الثالث: اختلافنا سر تميزنا - تقدير الاختلاف بين البشر في المظهر والقدرات والاهتمامات، وفهم أن الاختلاف يكمل بعضنا البعض وهو سر تميز مجتمعنا.",
    pages: "من الصفحة 24 - 29",
    completed: false,
    block: 1,
    week: 4,
    class_id: "G2A"
  }
];

// 6. Define Homework for Week 4
const week4Homework = [
  {
    id: "hw-b1-w4-G2A-social-Wed-1",
    classId: "G2A",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Social Studies",
    task: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 2 - إضافي)",
    details: "حل ومراجعة شيت الدراسات الاجتماعية المرفق (شيت الواجب المنزلي 2 - إضافي) ص 1-2.",
    pages: "شيت الواجب المنزلي 2 - إضافي (ص 1-2)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 4,
    class_id: "G2A",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf"
  },
  {
    id: "hw-b1-w4-G2B-social-Wed-1",
    classId: "G2B",
    assignedDay: "Wednesday",
    dueDay: "Monday",
    subject: "Social Studies",
    task: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 2 - إضافي)",
    details: "حل ومراجعة شيت الدراسات الاجتماعية المرفق (شيت الواجب المنزلي 2 - إضافي) ص 1-2.",
    pages: "شيت الواجب المنزلي 2 - إضافي (ص 1-2)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 4,
    class_id: "G2B",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf"
  },
  {
    id: "hw-b1-w4-G2C-social-Wed-1",
    classId: "G2C",
    assignedDay: "Wednesday",
    dueDay: "Sunday",
    subject: "Social Studies",
    task: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 2 - إضافي)",
    details: "حل ومراجعة شيت الدراسات الاجتماعية المرفق (شيت الواجب المنزلي 2 - إضافي) ص 1-2.",
    pages: "شيت الواجب المنزلي 2 - إضافي (ص 1-2)",
    completed: false,
    priority: "normal",
    block: 1,
    week: 4,
    class_id: "G2C",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf"
  }
];

// 6. Define Tomorrow Notes for Week 4 using Homework-2
const week4TomorrowNotes = [
  {
    id: "tn-b1-w4-G2A-Sat-social-submit",
    classId: "G2A",
    targetDay: "Sunday",
    subject: "Social Studies",
    note: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 2 - إضافي)",
    arabicNote: "تذكير لكلاس A: تسليم واجب الدراسات الاجتماعية غداً الأحد (شيت الواجب المنزلي 2 - إضافي)",
    bagItem: "شيت واجب الدراسات الاجتماعية (Home Work 2 - Extra)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4,
    class_id: "G2A",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf"
  },
  {
    id: "tn-b1-w4-G2B-Sun-social-submit",
    classId: "G2B",
    targetDay: "Monday",
    subject: "Social Studies",
    note: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 2 - إضافي)",
    arabicNote: "تذكير لكلاس B: تسليم واجب الدراسات الاجتماعية غداً الاثنين (شيت الواجب المنزلي 2 - إضافي)",
    bagItem: "شيت واجب الدراسات الاجتماعية (Home Work 2 - Extra)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4,
    class_id: "G2B",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf"
  },
  {
    id: "tn-b1-w4-G2C-Sat-social-submit",
    classId: "G2C",
    targetDay: "Sunday",
    subject: "Social Studies",
    note: "تسليم واجب الدراسات الاجتماعية (شيت الواجب المنزلي 2 - إضافي)",
    arabicNote: "تذكير لكلاس C: تسليم واجب الدراسات الاجتماعية غداً الأحد (شيت الواجب المنزلي 2 - إضافي)",
    bagItem: "شيت واجب الدراسات الاجتماعية (Home Work 2 - Extra)",
    isQuiz: false,
    categoryType: "note",
    block: 1,
    week: 4,
    class_id: "G2C",
    pdfUrl: "/materials/SocialStudies-Grade2-B1-W3-U1-HomeWork2 - Extra- (Minia).pdf"
  }
];

// Append Week 3 & Week 4
plannerData.classwork.push(...week3Classwork, ...week4Classwork);
plannerData.homework.push(...week3Homework, ...week4Homework);
if (!plannerData.tomorrowNotes) plannerData.tomorrowNotes = [];
plannerData.tomorrowNotes.push(...week3TomorrowNotes, ...week4TomorrowNotes);

// Save back
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');

console.log('Saved to local JSON successfully!');
console.log('Added classwork entries:', week3Classwork.length + week4Classwork.length);
console.log('Added homework entries:', week3Homework.length + week4Homework.length);
console.log('Added tomorrow notes:', week3TomorrowNotes.length + week4TomorrowNotes.length);
