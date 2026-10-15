const fs = require('fs');

console.log('Starting Science Block 2 Week 2 Seeder...');

const plannerPath = '/app/applet/data/planner_data.json';
let plannerData = { classwork: [], homework: [], tomorrowNotes: [] };

if (fs.existsSync(plannerPath)) {
  try {
    plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse planner_data.json, starting fresh:', err);
  }
}

// Clean existing B2W2 Science entries
plannerData.classwork = (plannerData.classwork || []).filter(
  (cw) => !(cw.block === 2 && cw.week === 2 && cw.subject === 'Science')
);
plannerData.homework = (plannerData.homework || []).filter(
  (hw) => !(hw.block === 2 && hw.week === 2 && hw.subject === 'Science')
);

// Define Classwork (placeholder)
const newClasswork = [
  { id: "cw-b2-w2-G2A-sci", classId: "G2A", day: "Monday", period: 5, subject: "Science", title: "Science Lesson", details: "Science lesson content", block: 2, week: 2, class_id: "G2A" },
  { id: "cw-b2-w2-G2B-sci", classId: "G2B", day: "Wednesday", period: 5, subject: "Science", title: "Science Lesson", details: "Science lesson content", block: 2, week: 2, class_id: "G2B" },
  { id: "cw-b2-w2-G2C-sci", classId: "G2C", day: "Monday", period: 5, subject: "Science", title: "Science Lesson", details: "Science lesson content", block: 2, week: 2, class_id: "G2C" }
];

// Define Homework
const newHomework = [
  { id: "hw-b2-w2-G2A-sci", classId: "G2A", assignedDay: "Monday", dueDay: "Monday", subject: "Science", task: "Page 20", details: "Page 20", block: 2, week: 2, class_id: "G2A" },
  { id: "hw-b2-w2-G2C-sci", classId: "G2C", assignedDay: "Monday", dueDay: "Monday", subject: "Science", task: "Page 20", details: "Page 20", block: 2, week: 2, class_id: "G2C" },
  { id: "hw-b2-w2-G2B-sci", classId: "G2B", assignedDay: "Wednesday", dueDay: "Wednesday", subject: "Science", task: "Extra worksheet", details: "Extra worksheet", block: 2, week: 2, class_id: "G2B" }
];

plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('Saved Science Block 2 Week 2 successfully!');
