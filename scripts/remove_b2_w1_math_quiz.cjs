const fs = require('fs');

const files = ['src/data/initialData.json', 'data/planner_data.json'];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  if (data.homework) {
    data.homework.forEach(item => {
      if (item.block === 2 && item.week === 1 && item.subject === 'Mathematics' && item.assignedDay === 'Wednesday') {
        if (item.task && item.task.includes('Test your self')) {
          item.task = 'Math Homework — Page 94 (Halving and doubling)';
        }
        if (item.details && item.details.includes('موعد اختبار')) {
          item.details = 'Unit 5: Multiplication and division. Solve exercises on Page 94 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).';
        }
        if (item.priority === 'urgent') {
          item.priority = 'normal';
        }
      }
    });
  }

  if (data.tomorrowNotes) {
    data.tomorrowNotes = data.tomorrowNotes.filter(note => {
      if (note.block === 2 && note.week === 1 && note.subject === 'Mathematics' && note.targetDay === 'Thursday') {
        return false; // remove the math test note on Thursday
      }
      return true;
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated', filePath);
});
