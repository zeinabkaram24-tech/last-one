const fs = require('fs');
const plannerPath = 'data/planner_data.json';
const plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));

const w = 2; // Week 2
const b = 2; // Block 2
const classes = ['G2A', 'G2B', 'G2C'];

const newClasswork = [];
const newHomework = [];
const newTomorrowNotes = [];

const mathData = [
    { day: 'Sunday', date: '18/10/2026', unit: 'unit 5 multiplication and division', title: 'Test your self', classwork: 'Maths-Grade2-B2-All-Sheet2 - Main', homework: null },
    { day: 'Monday', date: '19/10/2026', unit: 'unit 6 fraction', title: 'Lesson 1 Fractions', classwork: 'Maths-Grade2-B2-All-Sheet2 - Main', homework: null },
    { day: 'Tuesday', date: '20/10/2026', unit: 'unit 6 fractions', title: 'Lesson 2 Fractions of a number', classwork: 'Maths-Grade2-B2-All-Sheet2 - Main', homework: 'Page 97' },
    { day: 'Wednesday', date: '21/10/2026', unit: 'unit 6 fractions', title: 'Test your self', classwork: 'Maths-Grade2-B2-All-Sheet2 - Main', homework: 'Page 98' },
    { day: 'Thursday', date: '22/10/2026', unit: 'unit 7 measuring length and time', title: 'Lesson 1 Measuring length', classwork: 'Maths-Grade2-B2-All-Sheet2 - Main', homework: 'Page 100' }
];

classes.forEach(cls => {
    mathData.forEach((item, index) => {
        // Classwork
        newClasswork.push({
            id: `cw-b${b}-w${w}-${cls}-${item.day}-math`,
            classId: cls,
            day: item.day,
            subject: 'Math',
            title: item.title,
            details: `Unit: ${item.unit}`,
            pages: item.classwork,
            completed: false,
            block: b,
            week: w,
            class_id: cls,
        });

        // Homework
        if (item.homework) {
            const prevDayIndex = index - 1;
            const assignedDay = prevDayIndex >= 0 ? mathData[prevDayIndex].day : item.day;
            
            newHomework.push({
                id: `hw-b${b}-w${w}-${cls}-${item.day}-math`,
                classId: cls,
                assignedDay: assignedDay,
                dueDay: item.day,
                subject: 'Math',
                task: `Solve: ${item.homework}`,
                details: `Unit: ${item.unit}`,
                pages: item.homework,
                completed: false,
                priority: 'normal',
                block: b,
                week: w,
                class_id: cls,
            });
        }

        // Tomorrow Notes (Test Alerts)
        if (item.title.toLowerCase().includes('test')) {
            // Alert for the test day
            newTomorrowNotes.push({
                id: `tn-b${b}-w${w}-${cls}-${item.day}-math-test-alert`,
                classId: cls,
                targetDay: item.day,
                subject: 'Math',
                note: `Math Test: ${item.title}`,
                arabicNote: `تنبيه: اختبار رياضيات اليوم (${item.title})`,
                bagItem: 'أدوات الرياضيات',
                isQuiz: true,
                categoryType: 'quiz',
                block: b,
                week: w,
                class_id: cls,
            });
        }
    });
});

// Append to plannerData
plannerData.classwork.push(...newClasswork);
plannerData.homework.push(...newHomework);
plannerData.tomorrowNotes.push(...newTomorrowNotes);

// Write back to data/planner_data.json
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('Math Week 2 Weekly Plan Seeding Completed Successfully!');
