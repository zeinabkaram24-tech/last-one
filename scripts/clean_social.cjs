const fs = require('fs');

const files = [
  'src/data/initialData.json',
  'data/planner_data.json',
  'data/materials.json'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    const data = JSON.parse(raw);
    let modified = false;

    ['homework', 'classwork', 'tomorrowNotes'].forEach(k => {
      if (Array.isArray(data[k])) {
        data[k].forEach(item => {
          if (item && item.block === 2 && item.week === 2) {
            const subj = String(item.subject || item.title || '').toLowerCase();
            if (subj.includes('social') || subj.includes('دراسات') || subj.includes('social studies')) {
              console.log(`Clearing attachment/pdf/link in ${filePath} -> ${k} -> ${item.id}`);
              item.pdfUrl = null;
              item.linkUrl = null;
              item.attachment = null;
              item.sheet = null;
              item.attachmentName = null;
              item.file = null;
              item.fileUrl = null;
              modified = true;
            }
          }
        });
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Successfully updated ${filePath}`);
    }
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err);
  }
});

// Also check localStorage reset mechanism in client code or clear localStorage reset if any
console.log('Cleanup script completed.');
