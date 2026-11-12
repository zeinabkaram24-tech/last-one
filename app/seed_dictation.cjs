const fs = require('fs');

const files = ['src/data/initialData.json', 'data/planner_data.json'];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
  const classes = ['G2A', 'G2B', 'G2C'];

  // Remove existing block 2 week 3 arabic dictation homework to avoid duplicates
  data.homework = data.homework.filter(h => !(h.block === 2 && h.week === 3 && h.subject === 'Arabic' && (h.task.includes('إملاء') || h.task.includes('Dictation'))));

  classes.forEach(cls => {
    days.forEach(day => {
      data.homework.push({
        id: `hw-b2-w3-${cls.toLowerCase()}-${day.toLowerCase()}-arabic-dictation`,
        classId: cls,
        class_id: cls,
        assignedDay: day,
        dueDay: 'Thursday',
        subject: 'Arabic',
        task: '🔔 تنبيه إملاء لغة عربية: الاستعداد لإملاء الكلمات المقررة في كراسة الإملاء',
        details: 'الاستعداد والتدريب اليومي على كلمات الإملاء في كراسة اللغة العربية استعداداً لحصة الإملاء يوم الخميس.',
        pages: 'كراسة الإملاء',
        completed: false,
        priority: 'high',
        block: 2,
        week: 3
      });
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated Arabic dictation homework in', filePath);
});
