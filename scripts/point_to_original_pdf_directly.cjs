const fs = require('fs');
const path = require('path');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.json');
// Use the exact path provided for the file user sent
const pdfUrl = '/assets/aistudio/SocialStudies-Grade2-B2-W1-U2-HomeWork1_-_Extra-__Minia__398b1903.pdf';
const pdfName = 'SocialStudies-Grade2-B2-W1-U2-HomeWork1_-_Extra-__Minia__398b1903.pdf';

[plannerPath, initialDataPath].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update Homework to use original file path directly
    (data.homework || []).forEach(h => {
        if (h.block === 2 && h.week === 1 && h.subject === 'Social Studies') {
            h.pdfUrl = pdfUrl;
            h.attachment = pdfUrl;
            h.attachmentName = pdfName;
        }
    });

    // Update Tomorrow Notes to use original file path directly
    (data.tomorrowNotes || []).forEach(n => {
        if (n.block === 2 && n.week === 1 && n.subject === 'Social Studies') {
            n.pdfUrl = pdfUrl;
            n.attachment = pdfUrl;
            n.attachmentName = pdfName;
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated ${filePath} to use original PDF file directly.`);
});
