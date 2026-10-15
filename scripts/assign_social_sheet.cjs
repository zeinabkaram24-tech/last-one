const fs = require('fs');
const path = require('path');

const targetPdfName = 'SocialStudies-Grade2-B2-W1-U2-HomeWork1 - Extra- (Minia).pdf';
const sourcePdfPath = path.join('public', 'materials', 'SocialStudies-Grade2-B2-Week2-HomeWork.pdf');
const targetPdfPath = path.join('public', 'materials', targetPdfName);

if (fs.existsSync(sourcePdfPath)) {
  fs.copyFileSync(sourcePdfPath, targetPdfPath);
  console.log('Copied PDF to:', targetPdfPath);
} else {
  // Fallback to any pdf in public/materials
  const files = fs.readdirSync(path.join('public', 'materials')).filter(f => f.endsWith('.pdf'));
  if (files.length > 0) {
    fs.copyFileSync(path.join('public', 'materials', files[0]), targetPdfPath);
    console.log('Copied fallback PDF to:', targetPdfPath);
  }
}

const pdfUrl = `/materials/${targetPdfName}`;

const dataFiles = [
  'src/data/initialData.json',
  'data/planner_data.json'
];

dataFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    
    let updatedCount = 0;
    ['homework', 'tomorrowNotes'].forEach(k => {
      if (Array.isArray(data[k])) {
        data[k].forEach(item => {
          if (item.subject && item.subject.toLowerCase().includes('social') && item.block === 2 && item.week === 2) {
            item.pdf_url = pdfUrl;
            updatedCount++;
          }
        });
      }
    });

    // Also remove from deleted items if present
    if (Array.isArray(data.deletedPlannerItemIds)) {
      data.deletedPlannerItemIds = data.deletedPlannerItemIds.filter(id => !id.includes('b2-w2') || !id.includes('social'));
    }
    if (Array.isArray(data.deletedTomorrowNoteIds)) {
      data.deletedTomorrowNoteIds = data.deletedTomorrowNoteIds.filter(id => !id.includes('b2-w2') || !id.includes('social'));
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${updatedCount} items in ${filePath}`);
  }
});
