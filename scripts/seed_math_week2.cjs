const fs = require('fs');
const plannerPath = 'data/planner_data.json';
const plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));

const w = 2; // Week 2
const b = 2; // Block 2
const classes = ['G2A', 'G2B', 'G2C']; 

const newClasswork = [];
const newHomework = [];
const newTomorrowNotes = [];

classes.forEach(cls => {
    // 1. Classwork & Homework setup
    const plan = [
        { day: 'Sunday', unit: 'unit 5 multiplication and division', title: 'Test your self', cw: 'Maths-Grade2-B2-All-Sheet2 - Main', hw: null },
        { day: 'Monday', unit: 'unit 6 fraction', title: 'Lesson 1 Fractions', cw: 'Maths-Grade2-B2-All-Sheet2 - Main', hw: null },
        { day: 'Tuesday', unit: 'unit 6 fractions', title: 'Lesson 2 Fractions of a number', cw: 'Maths-Grade2-B2-All-Sheet2 - Main', hw: 'Page 97' },
        { day: 'Wednesday', unit: 'unit 6 fractions', title: 'Test your self', cw: 'Maths-Grade2-B2-All-Sheet2 - Main', hw: 'Page 98' },
        { day: 'Thursday', unit: 'unit 7 measuring length and time', title: 'Lesson 1 Measuring length', cw: 'Maths-Grade2-B2-All-Sheet2 - Main', hw: 'Page 100' },
    ];

    plan.forEach((item, index) => {
        const idSuffix = `${cls}-${item.day}`;
        
        // Add Classwork
        newClasswork.push({
            id: `cw-b${b}-w${w}-${idSuffix}-math`,
            classId: cls,
            day: item.day,
            subject: 'Math',
            title: `${item.unit}: ${item.title}`,
            details: `Unit: ${item.unit} - Topic: ${item.title}`,
            pages: item.cw,
            completed: false,
            block: b,
            week: w,
            class_id: cls,
        });

        // Add Homework
        if (item.hw) {
            newHomework.push({
                id: `hw-b${b}-w${w}-${idSuffix}-math`,
                classId: cls,
                assignedDay: item.day,
                subject: 'Math',
                task: `حل ${item.hw}`,
                details: `Unit: ${item.unit} - Topic: ${item.title} - ${item.hw}`,
                pages: item.hw,
                completed: false,
                priority: 'normal',
                block: b,
                week: w,
                class_id: cls,
            });
        }

        // Add Tomorrow Notes for Tests
        if (item.title.toLowerCase().includes('test')) {
            const targetDay = item.day;
            // Identify day before
            const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
            const dayIndex = days.indexOf(targetDay);
            const prevDay = dayIndex > 0 ? days[dayIndex - 1] : 'Saturday';

            newTomorrowNotes.push({
                id: `tn-b${b}-w${w}-${idSuffix}-math-test-alert`,
                classId: cls,
                targetDay: prevDay,
                subject: 'Math',
                note: `🚨 Math Test Tomorrow: ${item.title}`,
                arabicNote: `🚨 تنبيه هام: غداً يوجد اختبار (Math Test) في مادة الرياضيات بعنوان: ${item.title}. يرجى المراجعة والاستعداد.`,
                bagItem: 'كراسة الرياضيات',
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
