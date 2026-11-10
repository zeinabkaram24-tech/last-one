const fs = require('fs');
const path = require('path');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.json');

[plannerPath, initialDataPath].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Remove PDF reference from Homework
    (data.homework || []).forEach(h => {
        if (h.block === 2 && h.week === 1 && h.subject === 'Social Studies') {
            delete h.pdfUrl;
            delete h.attachment;
            delete h.attachmentName;
        }
    });

    // Remove PDF reference from Tomorrow Notes
    (data.tomorrowNotes || []).forEach(n => {
        if (n.block === 2 && n.week === 1 && n.subject === 'Social Studies') {
            delete n.pdfUrl;
            delete n.attachment;
            delete n.attachmentName;
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Removed PDF attachments for Social Studies B2W1 in ${filePath}`);
});
