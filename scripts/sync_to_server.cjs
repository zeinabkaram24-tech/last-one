const fs = require('fs');

async function sync() {
  try {
    const data = JSON.parse(fs.readFileSync('data/planner_data.json', 'utf8'));
    const response = await fetch('http://localhost:3000/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classwork: data.classwork,
        homework: data.homework,
        tomorrowNotes: data.tomorrowNotes,
        mode: 'merge'
      })
    });
    const result = await response.json();
    console.log('Server sync result:', result);
  } catch (err) {
    console.error('Failed to sync to running server:', err.message);
  }
}

sync();
