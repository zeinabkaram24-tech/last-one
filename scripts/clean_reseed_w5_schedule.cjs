const fs = require('fs');
const path = require('path');
const ttContent = fs.readFileSync('src/data/timetables.ts', 'utf-8');
const match = ttContent.match(/export const CLASS_TIMETABLES:[\s\S]*?=\s*(\{[\s\S]*?\n\})/);
const CLASS_TIMETABLES = eval('(' + match[1] + ')');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));

// 1. CLEAR ONLY ICT, MATH, ENGLISH, ARABIC, FRENCH, SCIENCE, SOCIAL STUDIES classwork entries for B2 Week 5
const subjectsToClear = ['ICT', 'Mathematics', 'English', 'Arabic', 'French', 'Science', 'Social Studies'];
plannerData.classwork = (plannerData.classwork || []).filter(c => 
    !(c.block === 2 && c.week === 5 && subjectsToClear.includes(c.subject))
);

// 2. Re-seed W5 based on new timetable (only subjects present in timetable)
const newW5Cw = [];
['G2A', 'G2B', 'G2C'].forEach(cls => {
    const tt = CLASS_TIMETABLES[cls];
    if (!tt) return;
    
    for (const [day, periods] of Object.entries(tt)) {
        periods.forEach(p => {
            // Skip empty slots or irrelevant subjects for automatic seeding
            if (!subjectsToClear.includes(p.subject)) return;

            newW5Cw.push({
                id: `cw-b2-w5-${cls}-${day}-${p.period}-${p.subject.replace(/\s+/g, '')}`,
                classId: cls,
                class_id: cls,
                day: day,
                period: p.period,
                subject: p.subject,
                title: `${p.subject} - Class`,
                details: p.notes || '',
                completed: false,
                block: 2,
                week: 5
            });
        });
    }
});

plannerData.classwork.push(...newW5Cw);
fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('✅ Cleanly re-seeded Week 5 classwork based on new timetable.');
