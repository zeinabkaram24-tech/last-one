const fs = require('fs');
const path = require('path');

const classes = ["G2A", "G2B", "G2C"];

const cw_data = {
    "G2A": [
        {"day": "Sunday", "period": 5, "title": "Unit: At the farm - Farm animals / So do I / I don't", "details": "Unit: At the farm - Farm animals & So do I / I don't (أسماء حيوانات المزرعة والتعبير عن التوافق مع الآراء)", "pages": "CW. 31, 32, 33 / CW. 39"},
        {"day": "Monday", "period": 3, "title": "Unit: At the farm - Listening & Reading", "details": "Unit: At the farm - Listening & Reading (تمارين الاستماع والقراءة بالشيت)", "pages": "CW. 41, 42, 43"},
        {"day": "Tuesday", "period": 7, "title": "Unit: At the farm - Phonetics", "details": "Unit: At the farm - Phonetics (درس الصوتيات والتمارين الصوتية)", "pages": "CW. 35, 36, 37, 38"},
        {"day": "Wednesday", "period": 7, "title": "Unit: At the farm - Kid's Box / Writing", "details": "Unit: At the farm - Kid's Box & Writing (تمارين كتاب النشاط والتدريب على الكتابة)", "pages": "Activity Book 2 p. 48, 49 / CW. 34"},
        {"day": "Thursday", "period": 6, "title": "Unit: At the farm - Kid's Box", "details": "Unit: At the farm - Kid's Box Activity Book exercises", "pages": "Activity Book 2 p. 48, 49"},
    ],
    "G2B": [
        {"day": "Sunday", "period": 1, "title": "Unit: At the farm - Phonetics", "details": "Unit: At the farm - Phonetics (درس الصوتيات والتمارين الصوتية)", "pages": "CW. 35, 36, 37, 38"},
        {"day": "Monday", "period": 5, "title": "Unit: At the farm - Farm animals", "details": "Unit: At the farm - Farm animals (أسماء حيوانات المزرعة وحفظ المفردات)", "pages": "CW. 31, 32, 33"},
        {"day": "Tuesday", "period": 7, "title": "Unit: At the farm - Reading & Listening", "details": "Unit: At the farm - Reading & Listening (تمارين القراءة والاستماع بالشيت)", "pages": "CW. 41, 42, 43"},
        {"day": "Wednesday", "period": 1, "title": "Unit: At the farm - Writing", "details": "Unit: At the farm - Writing (التدريب على الكتابة وتكوين الجمل)", "pages": "CW. 34"},
        {"day": "Thursday", "period": 3, "title": "Unit: At the farm - Kid's Box / So do I / I don't", "details": "Unit: At the farm - Kid's Box & So do I / I don't", "pages": "Activity Book 2 P. 48, 49 / CW. 39"},
    ],
    "G2C": [
        {"day": "Sunday", "period": 1, "title": "Unit: At the farm - Farm animals / So do I / I don't", "details": "Unit: At the farm - Farm animals & So do I / I don't (أسماء حيوانات المزرعة والتعبير عن التوافق مع الآراء)", "pages": "CW. 31, 32, 33 / CW. 39"},
        {"day": "Monday", "period": 6, "title": "Unit: At the farm - Kid's Box", "details": "Unit: At the farm - Kid's Box Activity Book exercises", "pages": "Activity Book 2 p. 48, 49"},
        {"day": "Tuesday", "period": 4, "title": "Unit: At the farm - Phonetics", "details": "Unit: At the farm - Phonetics (درس الصوتيات والتمارين الصوتية)", "pages": "CW. 35, 36, 37, 38"},
        {"day": "Wednesday", "period": 4, "title": "Unit: At the farm - Kid's Box / Writing", "details": "Unit: At the farm - Kid's Box & Writing (تمارين كتاب النشاط والتدريب على الكتابة)", "pages": "Activity Book 2 p. 48, 49 / CW. 34"},
        {"day": "Thursday", "period": 3, "title": "Unit: At the farm - Listening & Reading", "details": "Unit: At the farm - Listening & Reading (تمارين الاستماع والقراءة بالشيت)", "pages": "CW. 41, 42, 43"},
    ]
};

const new_cw = [];
const new_hw = [];

for (const cls of classes) {
    for (const cw of cw_data[cls]) {
        const day = cw.day;
        new_cw.push({
            id: `cw-b2-w3-${cls.toLowerCase()}-${day.toLowerCase()}-eng`,
            classId: cls,
            class_id: cls,
            day: day,
            period: cw.period,
            subject: "English",
            title: cw.title,
            details: cw.details,
            pages: cw.pages,
            completed: false,
            block: 2,
            week: 3,
        });
    }
        
    // Homework for Monday
    new_hw.push({
        id: `hw-b2-w3-${cls.toLowerCase()}-mon-eng`,
        classId: cls,
        class_id: cls,
        assignedDay: "Monday",
        assigned_day: "Monday",
        dueDay: "Tuesday",
        due_day: "Tuesday",
        subject: "English",
        task: "حل تدريبات كتاب النشاط ص 83 (P.83)",
        details: "Unit: At the farm - Activity Book 2 Page 83",
        pages: "P.83",
        completed: false,
        priority: "normal",
        block: 2,
        week: 3,
    });
    
    // Homework for Thursday
    new_hw.push({
        id: `hw-b2-w3-${cls.toLowerCase()}-thu-eng`,
        classId: cls,
        class_id: cls,
        assignedDay: "Thursday",
        assigned_day: "Thursday",
        dueDay: "Sunday",
        due_day: "Sunday",
        subject: "English",
        task: "حل تدريبات كتاب النشاط ص 80 (P.80)",
        details: "Unit: At the farm - Activity Book 2 Page 80",
        pages: "P.80",
        completed: false,
        priority: "normal",
        block: 2,
        week: 3,
    });
}

console.log(`Generated ${new_cw.length} Classwork, ${new_hw.length} Homework for English B2W3`);

function update_file(filePath) {
    const absPath = path.resolve(filePath);
    const data = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
    
    data.classwork = (data.classwork || []).filter(c => !(c.subject === 'English' && c.block === 2 && c.week === 3));
    data.homework = (data.homework || []).filter(h => !(h.subject === 'English' && h.block === 2 && h.week === 3));
    data.tomorrowNotes = (data.tomorrowNotes || []).filter(t => !(t.subject === 'English' && t.block === 2 && t.week === 3));
    
    data.classwork.push(...new_cw);
    data.homework.push(...new_hw);
    
    fs.writeFileSync(absPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Successfully updated ${filePath}!`);
}

update_file("data/planner_data.json");
update_file("src/data/initialData.json");
