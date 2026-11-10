const fs = require('fs');
const path = require('path');

const plannerPath = path.join(__dirname, '..', 'data', 'planner_data.json');
const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.json');
// The file copied to public/materials
const newPdfUrl = '/materials/SocialStudies-Grade2-B2-W1-U2-HomeWork1.pdf';
const newPdfName = 'SocialStudies-Grade2-B2-W1-U2-HomeWork1.pdf';

[plannerPath, initialDataPath].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update Homework to use the direct path to the unchanged file
    (data.homework || []).forEach(h => {
        if (h.block === 2 && h.week === 1 && h.subject === 'Social Studies') {
            h.pdfUrl = newPdfUrl;
            h.attachment = newPdfUrl;
            h.attachmentName = newPdfName;
        }
    });

    // Update Tomorrow Notes to use the direct path
    (data.tomorrowNotes || []).forEach(n => {
        if (n.block === 2 && n.week === 1 && n.subject === 'Social Studies') {
            n.pdfUrl = newPdfUrl;
            n.attachment = newPdfUrl;
            n.attachmentName = newPdfName;
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated ${filePath} to use original PDF file.`);
});
