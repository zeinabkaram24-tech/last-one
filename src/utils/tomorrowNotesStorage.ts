import { ClassId, SchoolDay } from '../types';
import { TomorrowSpecialNote, SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { fetchPlannerSettings, savePlannerSetting } from '../lib/supabase';

const LOCAL_STORAGE_PREFIX = 'nile_tomorrow_notes_';
const LISTENERS: Array<() => void> = [];

export function notifyTomorrowNotesListeners() {
  LISTENERS.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn('Listener error in tomorrow notes:', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nile-tomorrow-notes-updated'));
  }
}

export function subscribeToTomorrowNotes(callback: () => void): () => void {
  LISTENERS.push(callback);
  return () => {
    const idx = LISTENERS.indexOf(callback);
    if (idx !== -1) LISTENERS.splice(idx, 1);
  };
}

// Get tomorrow notes for a specific day, class, block, and week
export async function getTomorrowNotesForDay(
  block: number,
  week: number,
  classId: ClassId,
  targetDay: SchoolDay
): Promise<TomorrowSpecialNote[]> {
  const storageKey = `${LOCAL_STORAGE_PREFIX}${block}_${week}`;

  // 1. Check local cache
  let loadedNotes: TomorrowSpecialNote[] | null = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      loadedNotes = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not parse cached tomorrow notes:', e);
  }

  // 2. Check server /api/planner-data (Centralized cross-device sync)
  if (!loadedNotes) {
    try {
      const res = await fetch('/api/planner-data');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.tomorrowNotes) && data.tomorrowNotes.length > 0) {
          const matching = data.tomorrowNotes.filter(
            (n: any) => Number(n.block || 1) === Number(block) && Number(n.week || 1) === Number(week)
          );
          if (matching.length > 0) {
            loadedNotes = matching;
            try {
              localStorage.setItem(storageKey, JSON.stringify(matching));
            } catch {}
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch tomorrow notes from /api/planner-data:', e);
    }
  }

  // 3. If still not found, check Supabase planner_settings
  if (!loadedNotes) {
    try {
      const settings = await fetchPlannerSettings();
      const settingKey = `tomorrow_notes_${block}_${week}`;
      if (settings[settingKey]) {
        loadedNotes = JSON.parse(settings[settingKey]);
        if (loadedNotes && Array.isArray(loadedNotes)) {
          localStorage.setItem(storageKey, JSON.stringify(loadedNotes));
        }
      }
    } catch (e) {
      console.warn('Could not fetch tomorrow notes from Supabase settings:', e);
    }
  }

  // 4. Filter if dynamic notes found
  if (loadedNotes && Array.isArray(loadedNotes) && loadedNotes.length > 0) {
    return loadedNotes.filter(
      (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay
    );
  }

  // 5. Default Static Fallbacks (Block 1 Week 2 & Block 1 Week 1)
  if (block === 1 && week === 2) {
    return WEEK2_SPECIAL_NOTES.filter(
      (n) => n.classId === classId && n.targetDay === targetDay
    );
  }

  if (block === 1 && week === 1) {
    return SPECIAL_TEACHER_NOTES.filter(
      (n) => n.classId === classId && n.targetDay === targetDay && (n.week === 1 || !n.week)
    );
  }

  return [];
}

// Save tomorrow notes for a specific block and week
export async function saveTomorrowNotes(
  block: number,
  week: number,
  notes: TomorrowSpecialNote[]
): Promise<void> {
  const storageKey = `${LOCAL_STORAGE_PREFIX}${block}_${week}`;
  const settingKey = `tomorrow_notes_${block}_${week}`;

  // 1. Cache locally
  try {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  } catch (e) {
    console.warn('Could not cache tomorrow notes to localStorage:', e);
  }

  // 2. Sync to centralized server endpoint
  try {
    await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tomorrowNotes: notes }),
    });
  } catch (e) {
    console.warn('Failed to sync tomorrow notes to /api/planner-data:', e);
  }

  // 3. Save to Supabase Cloud planner_settings
  try {
    await savePlannerSetting(settingKey, JSON.stringify(notes));
  } catch (e) {
    console.warn('Could not save tomorrow notes to Supabase settings:', e);
  }

  notifyTomorrowNotesListeners();
}
