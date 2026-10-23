const fs = require('fs');
const path = require('path');

const new_cw = [
    // Class 2A (G2A)
    {
        id: "cw-b2-w3-g2a-tue-fr",
        classId: "G2A",
        class_id: "G2A",
        day: "Tuesday",
        period: 1,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — La description (suite) Activité en groupe",
        details: "Unité 4: La petite sœur de Lilly - La description (suite) Activité en groupe (شرح الوصف وأنشطة جماعية)",
        pages: "p.17 & 18",
        completed: false,
        block: 2,
        week: 3
    },
    {
        id: "cw-b2-w3-g2a-wed-fr",
        classId: "G2A",
        class_id: "G2A",
        day: "Wednesday",
        period: 4,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — La description (suite) Exercice C.O + C.E",
        details: "Unité 4: La petite sœur de Lilly - La description (suite) Exercice C.O + C.E (تمارين الفهم الشفهي والكتابي)",
        pages: "p.19 & 20",
        completed: false,
        block: 2,
        week: 3
    },
    {
        id: "cw-b2-w3-g2a-thu-fr",
        classId: "G2A",
        class_id: "G2A",
        day: "Thursday",
        period: 3,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — Présenter la famille et décrire les membres",
        details: "Unité 4: La petite sœur de Lilly - Présenter la famille et décrire les membres (تقديم العائلة ووصف أفرادها)",
        pages: "p.21",
        completed: false,
        block: 2,
        week: 3
    },

    // Class 2B (G2B)
    {
        id: "cw-b2-w3-g2b-sun-fr",
        classId: "G2B",
        class_id: "G2B",
        day: "Sunday",
        period: 5,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — La description (suite) Activité en groupe",
        details: "Unité 4: La petite sœur de Lilly - La description (suite) Activité en groupe (شرح الوصف وأنشطة جماعية)",
        pages: "p.17 & 18",
        completed: false,
        block: 2,
        week: 3
    },
    {
        id: "cw-b2-w3-g2b-mon-fr",
        classId: "G2B",
        class_id: "G2B",
        day: "Monday",
        period: 7,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — La description (suite) Exercice C.O + C.E",
        details: "Unité 4: La petite sœur de Lilly - La description (suite) Exercice C.O + C.E (تمارين الفهم الشفهي والكتابي)",
        pages: "p.19 & 20",
        completed: false,
        block: 2,
        week: 3
    },
    {
        id: "cw-b2-w3-g2b-thu-fr",
        classId: "G2B",
        class_id: "G2B",
        day: "Thursday",
        period: 5,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — Présenter la famille et décrire les membres",
        details: "Unité 4: La petite sœur de Lilly - Présenter la famille et décrire les membres (تقديم العائلة ووصف أفرادها)",
        pages: "p.21",
        completed: false,
        block: 2,
        week: 3
    },

    // Class 2C (G2C)
    {
        id: "cw-b2-w3-g2c-sun-fr",
        classId: "G2C",
        class_id: "G2C",
        day: "Sunday",
        period: 8,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — La description (suite) Activité en groupe",
        details: "Unité 4: La petite sœur de Lilly - La description (suite) Activité en groupe (شرح الوصف وأنشطة جماعية)",
        pages: "p.17 & 18",
        completed: false,
        block: 2,
        week: 3
    },
    {
        id: "cw-b2-w3-g2c-tue-fr",
        classId: "G2C",
        class_id: "G2C",
        day: "Tuesday",
        period: 6,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — La description (suite) Exercice C.O + C.E",
        details: "Unité 4: La petite sœur de Lilly - La description (suite) Exercice C.O + C.E (تمارين الفهم الشفهي والكتابي)",
        pages: "p.19 & 20",
        completed: false,
        block: 2,
        week: 3
    },
    {
        id: "cw-b2-w3-g2c-wed-fr",
        classId: "G2C",
        class_id: "G2C",
        day: "Wednesday",
        period: 2,
        subject: "French",
        title: "Unité 4: La petite sœur de Lilly — Présenter la famille et décrire les membres",
        details: "Unité 4: La petite sœur de Lilly - Présenter la famille et décrire les membres (تقديم العائلة ووصف أفرادها)",
        pages: "p.21",
        completed: false,
        block: 2,
        week: 3
    }
];

const new_hw = [
    // Class 2A: Homework assigned on Thursday
    {
        id: "hw-b2-w3-g2a-thu-fr",
        classId: "G2A",
        class_id: "G2A",
        assignedDay: "Thursday",
        assigned_day: "Thursday",
        dueDay: "Sunday",
        due_day: "Sunday",
        subject: "French",
        task: "حل تدريبات شيت الواجب ص 22 و 23 (Fiche de devoir p.22 & 23)",
        details: "Unité 4: La petite sœur de Lilly - Fiche de devoir pages 22 & 23",
        pages: "p.22 & 23",
        completed: false,
        priority: "normal",
        block: 2,
        week: 3
    },
    // Class 2B: Homework assigned on Thursday
    {
        id: "hw-b2-w3-g2b-thu-fr",
        classId: "G2B",
        class_id: "G2B",
        assignedDay: "Thursday",
        assigned_day: "Thursday",
        dueDay: "Sunday",
        due_day: "Sunday",
        subject: "French",
        task: "حل تدريبات شيت الواجب ص 22 و 23 (Fiche de devoir p.22 & 23)",
        details: "Unité 4: La petite sœur de Lilly - Fiche de devoir pages 22 & 23",
        pages: "p.22 & 23",
        completed: false,
        priority: "normal",
        block: 2,
        week: 3
    },
    // Class 2C: Homework assigned on Wednesday
    {
        id: "hw-b2-w3-g2c-wed-fr",
        classId: "G2C",
        class_id: "G2C",
        assignedDay: "Wednesday",
        assigned_day: "Wednesday",
        dueDay: "Thursday",
        due_day: "Thursday",
        subject: "French",
        task: "حل تدريبات شيت الواجب ص 22 و 23 (Fiche de devoir p.22 & 23)",
        details: "Unité 4: La petite sœur de Lilly - Fiche de devoir pages 22 & 23",
        pages: "p.22 & 23",
        completed: false,
        priority: "normal",
        block: 2,
        week: 3
    }
];

console.log(`Generated ${new_cw.length} Classwork, ${new_hw.length} Homework for French B2W3`);

function update_file(filePath) {
    const absPath = path.resolve(filePath);
    const data = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
    
    data.classwork = (data.classwork || []).filter(c => !(c.subject === 'French' && c.block === 2 && c.week === 3));
    data.homework = (data.homework || []).filter(h => !(h.subject === 'French' && h.block === 2 && h.week === 3));
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(t => !(t.subject === 'French' && t.block === 2 && t.week === 3));
    
    data.classwork.push(...new_cw);
    data.homework.push(...new_hw);
    
    fs.writeFileSync(absPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Successfully updated ${filePath}!`);
}

update_file("data/planner_data.json");
update_file("src/data/initialData.json");
