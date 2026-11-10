const fs = require('fs');
const path = require('path');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.json');
const plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));

// Find G2B Sunday P6 ICT entry
const targetEntry = (plannerData.classwork || []).find(c => 
    c.block === 2 && c.week === 5 && c.classId === 'G2B' && c.day === 'Sunday' && c.period === 6 && c.subject === 'ICT'
);

if (targetEntry) {
    // Session 1 Details: Unit: Communicating with Email & E-safety. Topics: Comprehensive review of Email components, sending/receiving messages, safe email etiquette, and avoiding online risks. Hands-on computer lab session.
    targetEntry.title = 'Unit 2: Communicating with Email & E-safety — Session 1 (Review & Practical Lab Practice)';
    targetEntry.details = 'Unit: Communicating with Email & E-safety. Topics: Comprehensive review of Email components, sending/receiving messages, safe email etiquette, and avoiding online risks. Hands-on computer lab session.';
    targetEntry.pages = 'Study sheet W5, ICT Booklet';
    console.log('✅ Updated G2B Sunday ICT entry with correct details.');
} else {
    console.log('⚠️ Could not find G2B Sunday ICT entry, reseeding...');
    // If not found, it might need reseeding
    const newEntry = {
        id: `cw-b2-w5-G2B-Sunday-6-ICT`,
        classId: 'G2B',
        class_id: 'G2B',
        day: 'Sunday',
        period: 6,
        subject: 'ICT',
        title: 'Unit 2: Communicating with Email & E-safety — Session 1 (Review & Practical Lab Practice)',
        details: 'Unit: Communicating with Email & E-safety. Topics: Comprehensive review of Email components, sending/receiving messages, safe email etiquette, and avoiding online risks. Hands-on computer lab session.',
        pages: 'Study sheet W5, ICT Booklet',
        completed: false,
        block: 2,
        week: 5
    };
    plannerData.classwork.push(newEntry);
}

// Update both files
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
const initialData = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
initialData.classwork = plannerData.classwork;
fs.writeFileSync(initialDataPath, JSON.stringify(initialData, null, 2), 'utf8');
console.log('✅ Updated data files.');
