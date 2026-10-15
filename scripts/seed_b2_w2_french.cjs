const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

console.log('🇫🇷 Seeding Block 2 Week 2 French Classwork & Homework...');

const SUPABASE_URL = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

// 9 Classwork Entries (3 sessions per class)
const frenchClasswork = [
  // --- Class A (G2A): Tuesday P1, Wednesday P4, Thursday P3 ---
  {
    id: 'cw-b2-w2-G2A-Tuesday-french-c1',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Tuesday',
    period: 1,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) La description physique et morale',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) La description physique et morale. Fiche de classe p.12.',
    pages: 'Fiche de classe p.12',
    completed: false,
    block: 2,
    week: 2,
  },
  {
    id: 'cw-b2-w2-G2A-Wednesday-french-c2',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Wednesday',
    period: 4,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) Le féminin des adjectifs',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) Le féminin des adjectifs. Fiche de classe p.13, 14, 15.',
    pages: 'Fiche de classe p.13, 14, 15',
    completed: false,
    block: 2,
    week: 2,
  },
  {
    id: 'cw-b2-w2-G2A-Thursday-french-c3',
    classId: 'G2A',
    class_id: 'G2A',
    day: 'Thursday',
    period: 3,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) Décrire une personne',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) Décrire une personne. Activités et pratique orale en classe.',
    pages: 'Livre / Cahier',
    completed: false,
    block: 2,
    week: 2,
  },

  // --- Class B (G2B): Sunday P5, Monday P7, Thursday P5 ---
  {
    id: 'cw-b2-w2-G2B-Sunday-french-c1',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Sunday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) La description physique et morale',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) La description physique et morale. Fiche de classe p.12.',
    pages: 'Fiche de classe p.12',
    completed: false,
    block: 2,
    week: 2,
  },
  {
    id: 'cw-b2-w2-G2B-Monday-french-c2',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Monday',
    period: 7,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) Le féminin des adjectifs',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) Le féminin des adjectifs. Fiche de classe p.13, 14, 15.',
    pages: 'Fiche de classe p.13, 14, 15',
    completed: false,
    block: 2,
    week: 2,
  },
  {
    id: 'cw-b2-w2-G2B-Thursday-french-c3',
    classId: 'G2B',
    class_id: 'G2B',
    day: 'Thursday',
    period: 5,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) Décrire une personne',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) Décrire une personne. Activités et pratique orale en classe.',
    pages: 'Livre / Cahier',
    completed: false,
    block: 2,
    week: 2,
  },

  // --- Class C (G2C): Sunday P8, Tuesday P6, Wednesday P2 ---
  {
    id: 'cw-b2-w2-G2C-Sunday-french-c1',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Sunday',
    period: 8,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) La description physique et morale',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) La description physique et morale. Fiche de classe p.12.',
    pages: 'Fiche de classe p.12',
    completed: false,
    block: 2,
    week: 2,
  },
  {
    id: 'cw-b2-w2-G2C-Tuesday-french-c2',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Tuesday',
    period: 6,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) Le féminin des adjectifs',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) Le féminin des adjectifs. Fiche de classe p.13, 14, 15.',
    pages: 'Fiche de classe p.13, 14, 15',
    completed: false,
    block: 2,
    week: 2,
  },
  {
    id: 'cw-b2-w2-G2C-Wednesday-french-c3',
    classId: 'G2C',
    class_id: 'G2C',
    day: 'Wednesday',
    period: 2,
    subject: 'French',
    title: 'Unité 4: La petite sœur de Lilly - (il est comment ?) Décrire une personne',
    details: 'Unité 4: La petite sœur de Lilly. Sujet: (il est comment ?) Décrire une personne. Activités et pratique orale en classe.',
    pages: 'Livre / Cahier',
    completed: false,
    block: 2,
    week: 2,
  },
];

// 3 Homework Entries (in session 3 of each class)
// Class A: Thursday (Session 3)
// Class B: Thursday (Session 3)
// Class C: Wednesday (Session 3)
const frenchHomework = [
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

async function run() {
  // 1. Update data/planner_data.json
  const plannerPath = path.join(process.cwd(), 'data', 'planner_data.json');
  let plannerData = JSON.parse(fs.readFileSync(plannerPath, 'utf-8'));

  // Filter out any existing B2 W2 French
  plannerData.classwork = (plannerData.classwork || []).filter(
    (c) => !(c.subject === 'French' && Number(c.block) === 2 && Number(c.week) === 2)
  );
  plannerData.homework = (plannerData.homework || []).filter(
    (h) => !(h.subject === 'French' && Number(h.block) === 2 && Number(h.week) === 2)
  );

  plannerData.classwork.push(...frenchClasswork);
  plannerData.homework.push(...frenchHomework);

  fs.writeFileSync(plannerPath, JSON.stringify(plannerData, null, 2), 'utf-8');
  console.log('✅ Updated data/planner_data.json with Block 2 Week 2 French');

  // 2. Update src/data/initialData.json
  const initialPath = path.join(process.cwd(), 'src', 'data', 'initialData.json');
  let initialData = JSON.parse(fs.readFileSync(initialPath, 'utf-8'));

  initialData.classwork = (initialData.classwork || []).filter(
    (c) => !(c.subject === 'French' && Number(c.block) === 2 && Number(c.week) === 2)
  );
  initialData.homework = (initialData.homework || []).filter(
    (h) => !(h.subject === 'French' && Number(h.block) === 2 && Number(h.week) === 2)
  );

  initialData.classwork.push(...frenchClasswork);
  initialData.homework.push(...frenchHomework);

  fs.writeFileSync(initialPath, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('✅ Updated src/data/initialData.json with Block 2 Week 2 French');

  // 3. Upsert to Supabase
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Delete any existing Block 2 Week 2 French in Supabase
    await supabase.from('classwork').delete().eq('subject', 'French').eq('block', 2).eq('week', 2);
    await supabase.from('homework').delete().eq('subject', 'French').eq('block', 2).eq('week', 2);

    // Prepare Supabase rows
    const cwRows = frenchClasswork.map((c) => ({
      id: c.id,
      class_id: c.classId,
      day: c.day,
      period: c.period,
      subject: c.subject,
      title: c.title,
      details: c.details,
      pages: c.pages,
      completed: false,
      block: c.block,
      week: c.week,
      link_url: null,
      link_title: null,
    }));

    const hwRows = frenchHomework.map((h) => ({
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

    const { error: cwErr } = await supabase.from('classwork').upsert(cwRows);
    if (cwErr) console.warn('Supabase CW error:', cwErr);
    else console.log('✅ Successfully synced 9 French classwork items to Supabase!');

    const { error: hwErr } = await supabase.from('homework').upsert(hwRows);
    if (hwErr) console.warn('Supabase HW error:', hwErr);
    else console.log('✅ Successfully synced 3 French homework items to Supabase!');
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }

  console.log('🎉 Block 2 Week 2 French setup complete!');
}

run();
