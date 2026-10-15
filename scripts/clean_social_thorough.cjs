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
            const str = JSON.stringify(item).toLowerCase();
            if (str.includes('social') || str.includes('دراسات')) {
              console.log(`Clearing social item in ${filePath} -> ${k} -> ${item.id}`);
              item.pdfUrl = null;
              item.pdf_url = null;
              item.linkUrl = null;
              item.link_url = null;
              item.attachment = null;
              item.sheet = null;
              item.attachmentName = null;
              item.fileName = null;
              item.file = null;
              item.fileUrl = null;
              item.bagItem = null;
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

// Also check if any other block 2 week 2 items across the entire JSON contain social attachments
files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    const data = JSON.parse(raw);
    let modified = false;
    Object.keys(data).forEach(k => {
      if (Array.isArray(data[k])) {
        data[k].forEach(item => {
          if (item && (String(item.id || '').toLowerCase().includes('social') || String(item.bagItem || '').toLowerCase().includes('social') || String(item.note || '').toLowerCase().includes('social'))) {
            // Check if it's block 2 week 2 or related
            if (item.block === 2 && item.week === 2) {
              console.log(`Force cleaning social item by id/bagItem in ${filePath} -> ${k} -> ${item.id}`);
              item.pdfUrl = null;
              item.pdf_url = null;
              item.linkUrl = null;
              item.link_url = null;
              item.attachment = null;
              item.sheet = null;
              item.attachmentName = null;
              item.fileName = null;
              item.file = null;
              item.fileUrl = null;
              item.bagItem = null;
              modified = true;
            }
          }
        });
      }
    });
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
  } catch {}
});

console.log('Thorough cleanup script completed.');
