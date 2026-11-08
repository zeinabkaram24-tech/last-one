const fs = require('fs');
const path = require('path');
const ttContent = fs.readFileSync('src/data/timetables.ts', 'utf-8');
const match = ttContent.match(/export const CLASS_TIMETABLES:[\s\S]*?=\s*(\{[\s\S]*?\n\})/);
const CLASS_TIMETABLES = eval('(' + match[1] + ')');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf8'));

// Update Week 5 classwork according to new timetable
const B2W5_CW = (plannerData.classwork || []).filter(c => c.block === 2 && c.week === 5);
const OTHER_CW = (plannerData.classwork || []).filter(c => !(c.block === 2 && c.week === 5));

const updatedB2W5_CW = [];

B2W5_CW.forEach(cw => {
    const timetable = CLASS_TIMETABLES[cw.classId];
    if (!timetable) {
        updatedB2W5_CW.push(cw);
        return;
    }
    
    // Find the new day/period for this subject in the timetable
    let found = false;
    for (const [day, periods] of Object.entries(timetable)) {
        const period = periods.find(p => p.subject === cw.subject);
        if (period) {
            updatedB2W5_CW.push({
                ...cw,
                day: day,
                period: period.period
            });
            found = true;
            break;
        }
    }
    
    if (!found) {
        // If not found in new timetable, keep as is
        updatedB2W5_CW.push(cw);
    }
});

plannerData.classwork = [...OTHER_CW, ...updatedB2W5_CW];

fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf8');
console.log('✅ Updated Week 5 classwork based on new timetable.');
