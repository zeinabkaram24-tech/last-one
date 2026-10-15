const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

console.log('🇫🇷 Seeding French Homework for Block 2 Week 1 & Week 2 for all 3 classes...');

const SUPABASE_URL = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

const b2Homework = [
  // --- Block 2 Week 1 ---
  // Class A: Thursday (Session 3)
  {
    id: 'hw-b2-w1-G2A-Thu-french',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p.16 (Unité 4: Décrire une personne) 📝',
    details: 'Unité 4: La petite sœur de Lilly - Décrire une personne. Résoudre la fiche de devoir p.16.',
    pages: 'Fiche de devoir p.16',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
    isLinkTask: false,
  },
  // Class B: Thursday (Session 3)
  {
    id: 'hw-b2-w1-G2B-Thu-french',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p.16 (Unité 4: Décrire une personne) 📝',
    details: 'Unité 4: La petite sœur de Lilly - Décrire une personne. Résoudre la fiche de devoir p.16.',
    pages: 'Fiche de devoir p.16',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
    isLinkTask: false,
  },
  // Class C: Wednesday (Session 3)
  {
    id: 'hw-b2-w1-G2C-Wed-french',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Wednesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p.16 (Unité 4: Décrire une personne) 📝',
    details: 'Unité 4: La petite sœur de Lilly - Décrire une personne. Résoudre la fiche de devoir p.16.',
    pages: 'Fiche de devoir p.16',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 1,
    isLinkTask: false,
  },

  // --- Block 2 Week 2 ---
  // Class A: Thursday (Session 3)
  {
    id: 'hw-b2-w2-G2A-Thu-french',
    classId: 'G2A',
    class_id: 'G2A',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p.16 (Unité 4: Décrire une personne) 📝',
    details: 'Unité 4: La petite sœur de Lilly - Décrire une personne. Résoudre la fiche de devoir p.16.',
    pages: 'Fiche de devoir p.16',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 2,
    isLinkTask: false,
  },
  // Class B: Thursday (Session 3)
  {
    id: 'hw-b2-w2-G2B-Thu-french',
    classId: 'G2B',
    class_id: 'G2B',
    assignedDay: 'Thursday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p.16 (Unité 4: Décrire une personne) 📝',
    details: 'Unité 4: La petite sœur de Lilly - Décrire une personne. Résoudre la fiche de devoir p.16.',
    pages: 'Fiche de devoir p.16',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 2,
    isLinkTask: false,
  },
  // Class C: Wednesday (Session 3)
  {
    id: 'hw-b2-w2-G2C-Wed-french',
    classId: 'G2C',
    class_id: 'G2C',
    assignedDay: 'Wednesday',
    dueDay: 'Sunday',
    subject: 'French',
    task: 'Devoir de français: Fiche de devoir p.16 (Unité 4: Décrire une personne) 📝',
    details: 'Unité 4: La petite sœur de Lilly - Décrire une personne. Résoudre la fiche de devoir p.16.',
    pages: 'Fiche de devoir p.16',
    completed: false,
    priority: 'normal',
    block: 2,
    week: 2,
    isLinkTask: false,
  },
];

async function main() {
  // 1. Update data/planner_data.json
  const plannerPath = path.join(process.cwd(), 'data', 'planner_data.json');
  let plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf-8'));

  // Remove any existing B2 French homework to avoid duplicates
  plannerData.homework = (plannerData.homework || []).filter(
    (h) => !(h.subject === 'French' && Number(h.block) === 2)
  );
  plannerData.homework.push(...b2Homework);

  fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf-8');
  console.log('✅ Updated data/planner_data.json with Block 2 French Homework (Weeks 1 & 2)');

  // 2. Update src/data/initialData.json
  const initialPath = path.join(process.cwd(), 'src', 'data', 'initialData.json');
  let initialData = JSON.parse(fs.readFileSync(initialPath, 'utf-8'));

  initialData.homework = (initialData.homework || []).filter(
    (h) => !(h.subject === 'French' && Number(h.block) === 2)
  );
  initialData.homework.push(...b2Homework);

  fs.writeFileSync(initialPath, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('✅ Updated src/data/initialData.json with Block 2 French Homework (Weeks 1 & 2)');

  // 3. Upsert into Supabase
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Delete existing B2 French homework
    await supabase.from('homework').delete().eq('subject', 'French').eq('block', 2);

    const hwRows = b2Homework.map((h) => ({
      id: h.id,
      class_id: h.classId,
      assigned_day: h.assignedDay,
      due_day: h.dueDay,
      subject: h.subject,
      task: h.task,
      details: h.details,
      pages: h.pages,
      completed: false,
      priority: h.priority,
      block: h.block,
      week: h.week,
      is_link_task: false,
      link_url: null,
    }));

    const { error: hwErr } = await supabase.from('homework').upsert(hwRows);
    if (hwErr) {
      console.warn('Supabase HW error:', hwErr);
    } else {
      console.log('✅ Successfully synced 6 Block 2 French homework items to Supabase!');
    }
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }

  console.log('🎉 Done seeding French homework for Block 2!');
}

main();
