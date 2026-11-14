import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const INIT_PATH = 'src/data/initialData.json';
const PLANNER_PATH = 'data/planner_data.json';

const SUPABASE_URL = 'https://umryrjwmlkdbjmgmnbkt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nVMt4oGVfTD9TVyDB4HPag_maw8OXag';

const initData = JSON.parse(fs.readFileSync(INIT_PATH, 'utf8'));
const plannerData = JSON.parse(fs.readFileSync(PLANNER_PATH, 'utf8'));

function normalizeClassworkB2W6(item) {
  const cid = item.class_id || item.classId || 'G2B';
  let title = item.title || item.lessonTitle || '';
  const unit = item.unit || '';
  const rawDesc = item.details || item.description || '';
  const teacher = item.teacher || '';

  // Subject-specific clean titles with Unit + Lesson Title
  if (item.subject === 'English') {
    if (title && !title.startsWith('Review')) {
      title = `Review — ${title}`;
    }
  } else if (item.subject === 'Mathematics') {
    title = title.replace(/^Unit 9::/i, 'Unit 9:');
    if (title && !title.toLowerCase().includes('unit 9') && unit) {
      title = `${unit.replace(/^unit 9:?/i, 'Unit 9:')} — ${title}`;
    }
  } else if (item.subject === 'Arabic') {
    if (title && !title.includes('الوحدة الثالثة')) {
      title = `الوحدة الثالثة (التسوق): ${title}`;
    }
  } else if (item.subject === 'Science') {
    // Clean up A-C / B prefixes for clean per-class title
    title = title
      .replace(/^Unit 4:\s*Exploring and using materials\s*—\s*/i, '')
      .replace(/^A-C:\s*/i, '')
      .replace(/^B\s*:\s*/i, '')
      .trim();
    title = `Unit 4: Exploring and using materials — ${title}`;
  } else if (item.subject === 'French') {
    if (item.id === 'cw-b2-w6-g2b-sun-french') {
      item.period = 3;
    }
  } else if (item.subject === 'ICT') {
    // Fix G2B Session 2 day & period (Tuesday P3!)
    if (item.id === 'cw-b2-w6-g2b-s2-ict') {
      item.day = 'Tuesday';
      item.period = 3;
    }
    if (item.id === 'cw-b2-w6-g2b-s1-ict') {
      item.day = 'Sunday';
      item.period = 6;
    }
    if (item.id === 'cw-b2-w6-g2b-s3-ict') {
      item.day = 'Thursday';
      item.period = 1;
    }
  }

  let details = rawDesc;
  if (item.subject === 'Arabic' && details) {
    details = details.trim();
  }
  if (teacher && details && !details.includes(teacher)) {
    details = `${details} • المعلمة: ${teacher}`;
  } else if (teacher && !details) {
    details = `المعلمة: ${teacher}`;
  }

  let cleanPages = item.pages && item.pages !== 'Unit 4' && item.pages !== '-' ? item.pages : undefined;
  if (item.id === 'cw-b2-w6-g2b-sun-science') {
    cleanPages = undefined;
  }

  const cleaned = {
    id: item.id,
    classId: cid,
    class_id: cid,
    day: item.day,
    period: Number(item.period) || 1,
    subject: item.subject,
    title: title.trim(),
    details: details ? details.trim() : undefined,
    pages: cleanPages,
    completed: false,
    block: 2,
    week: 6,
  };
  if (item.linkUrl) cleaned.linkUrl = item.linkUrl;
  if (item.linkTitle) cleaned.linkTitle = item.linkTitle;
  if (item.pdfUrl) cleaned.pdfUrl = item.pdfUrl;
  return cleaned;
}

// 1. Normalize Classwork B2W6 (and filter out dummy "لا يوجد حصص في الجدول" placeholders)
initData.classwork = (initData.classwork || [])
  .filter((c) => {
    if (Number(c.block) === 2 && Number(c.week) === 6 && String(c.title || '').includes('لا يوجد حصص')) {
      return false;
    }
    return true;
  })
  .map((c) => {
    if (Number(c.block) === 2 && Number(c.week) === 6) {
      return normalizeClassworkB2W6(c);
    }
    return c;
  });

// Verify no missing titles in B2W6
const b2w6Cw = initData.classwork.filter((c) => Number(c.block) === 2 && Number(c.week) === 6);
const missingTitle = b2w6Cw.filter((c) => !c.title || c.title.trim() === '');
if (missingTitle.length > 0) {
  throw new Error('Missing title in CW: ' + JSON.stringify(missingTitle));
}

// 2. Normalize Homework B2W6
initData.homework = (initData.homework || [])
  .filter((h) => {
    // Ensure NO ICT homework in B2W6
    if (Number(h.block) === 2 && Number(h.week) === 6 && h.subject === 'ICT') return false;
    return true;
  })
  .map((h) => {
    if (Number(h.block) === 2 && Number(h.week) === 6) {
      const cid = h.class_id || h.classId || 'G2B';
      const updated = {
        ...h,
        classId: cid,
        class_id: cid,
        completed: false,
        block: 2,
        week: 6,
      };
      if (
        updated.subject === 'English' &&
        (updated.task?.toLowerCase().includes('dictation') || updated.task?.includes('إملاء'))
      ) {
        updated.pdfUrl = '/assets/aistudio/English_Dictation_Days_Of_The_Week_Page2.pdf';
      }
      return updated;
    }
    return h;
  });

// 3. Normalize TomorrowNotes B2W6
initData.tomorrowNotes = (initData.tomorrowNotes || []).map((n) => {
  if (Number(n.block) === 2 && Number(n.week) === 6) {
    const cid = n.class_id || n.classId || 'G2B';
    const updated = {
      ...n,
      classId: cid,
      class_id: cid,
      block: 2,
      week: 6,
    };
    if (updated.subject === 'ICT' || updated.subject === 'Mathematics' || updated.subject === 'Math') {
      delete updated.pdfUrl;
    }
    if (
      updated.subject === 'English' &&
      (updated.title?.toLowerCase().includes('dictation') || updated.note?.toLowerCase().includes('dictation') || updated.arabicNote?.includes('إملاء'))
    ) {
      updated.pdfUrl = '/assets/aistudio/English_Dictation_Days_Of_The_Week_Page2.pdf';
    }
    return updated;
  }
  return n;
});

// Keep specialTeacherNotes synced if present
if (Array.isArray(initData.specialTeacherNotes)) {
  initData.specialTeacherNotes = initData.tomorrowNotes.filter(
    (n) => Number(n.block) === 2 && Number(n.week) === 6
  );
}

// 4. Write initialData.json and sync planner_data.json
fs.writeFileSync(INIT_PATH, JSON.stringify(initData, null, 2), 'utf8');

const b2w6Tn = initData.tomorrowNotes.filter((n) => Number(n.block) === 2 && Number(n.week) === 6);
const b2w6Hw = initData.homework.filter((h) => Number(h.block) === 2 && Number(h.week) === 6);

const cleanDeletedIds = (arr) =>
  (Array.isArray(arr) ? arr : []).filter((id) => !String(id).includes('b2-w6'));

const updatedPlanner = {
  ...plannerData,
  classwork: initData.classwork,
  homework: initData.homework,
  tomorrowNotes: initData.tomorrowNotes,
  specialTeacherNotes: b2w6Tn,
  deletedTomorrowNoteIds: cleanDeletedIds(plannerData.deletedTomorrowNoteIds),
  deletedPlannerItemIds: cleanDeletedIds(plannerData.deletedPlannerItemIds),
};
fs.writeFileSync(PLANNER_PATH, JSON.stringify(updatedPlanner, null, 2), 'utf8');

console.log(`✅ Local JSON updated: CW B2W6=${b2w6Cw.length}, HW B2W6=${b2w6Hw.length}, TN B2W6=${b2w6Tn.length}`);

// 5. Sync Block 2 Week 6 directly to Supabase!
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function packHomeworkDetails(details, pdfUrl) {
  let res = details ? String(details).trim() : '';
  if (pdfUrl) {
    res = res ? `${res} ||PDF_URL:${pdfUrl.trim()}` : `||PDF_URL:${pdfUrl.trim()}`;
  }
  return res || null;
}

(async () => {
  // Delete any existing B2W6 rows in Supabase classwork & homework first to prevent orphans/duplicates
  await sb.from('classwork').delete().eq('block', 2).eq('week', 6);
  await sb.from('homework').delete().eq('block', 2).eq('week', 6);

  const cwRows = b2w6Cw.map((c) => ({
    id: c.id,
    class_id: c.class_id || c.classId,
    day: c.day,
    period: Number(c.period) || 1,
    subject: c.subject,
    title: c.title,
    details: c.details || null,
    pages: c.pages || null,
    completed: false,
    block: 2,
    week: 6,
    link_url: c.linkUrl || null,
    link_title: c.linkTitle || null,
  }));

  for (let i = 0; i < cwRows.length; i += 50) {
    const { error } = await sb.from('classwork').upsert(cwRows.slice(i, i + 50), { onConflict: 'id' });
    if (error) console.error('Supabase CW upsert error:', error);
  }

  const hwRows = b2w6Hw.map((h) => ({
    id: h.id,
    class_id: h.class_id || h.classId,
    assigned_day: h.assignedDay,
    due_day: h.dueDay,
    subject: h.subject,
    task: h.task,
    details: packHomeworkDetails(h.details, h.pdfUrl),
    pages: h.pages || null,
    completed: false,
    priority: h.priority || 'normal',
    block: 2,
    week: 6,
    is_link_task: Boolean(h.isLinkTask),
    link_url: h.linkUrl || null,
  }));

  for (let i = 0; i < hwRows.length; i += 50) {
    const { error } = await sb.from('homework').upsert(hwRows.slice(i, i + 50), { onConflict: 'id' });
    if (error) console.error('Supabase HW upsert error:', error);
  }

  // Update planner_settings.tomorrow_special_notes to include clean B2W6 notes without removing earlier notes
  const { data: existingSetting } = await sb
    .from('planner_settings')
    .select('value')
    .eq('key', 'tomorrow_special_notes')
    .maybeSingle();

  let existingNotes = [];
  if (existingSetting && existingSetting.value) {
    try {
      const parsed = JSON.parse(existingSetting.value);
      if (Array.isArray(parsed)) {
        existingNotes = parsed.filter((n) => !(Number(n.block) === 2 && Number(n.week) === 6));
      }
    } catch {}
  }

  const mergedNotes = [...existingNotes, ...b2w6Tn];
  const { error: tnErr } = await sb.from('planner_settings').upsert(
    {
      key: 'tomorrow_special_notes',
      value: JSON.stringify(mergedNotes),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  );
  if (tnErr) console.error('Supabase TN upsert error:', tnErr);

  // Also ensure g2_current_block=2 and g2_current_week=6 in planner_settings
  await sb.from('planner_settings').upsert(
    [
      { key: 'current_block', value: '2', updated_at: new Date().toISOString() },
      { key: 'g2_current_block', value: '2', updated_at: new Date().toISOString() },
      { key: 'current_week', value: '6', updated_at: new Date().toISOString() },
      { key: 'g2_current_week', value: '6', updated_at: new Date().toISOString() },
    ],
    { onConflict: 'key' }
  );

  // Verify counts back from Supabase
  const [vcw, vhw] = await Promise.all([
    sb.from('classwork').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 6),
    sb.from('homework').select('id', { count: 'exact', head: true }).eq('block', 2).eq('week', 6),
  ]);
  console.log(`✅ Live Supabase synced! Verified B2W6 CW=${vcw.count}, HW=${vhw.count}, TN=${b2w6Tn.length}`);
})();
