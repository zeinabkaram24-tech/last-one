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

  let loadedNotes: TomorrowSpecialNote[] | null = null;
  let fetchedFromServer = false;

  // 1. Check server /api/planner-data first (Centralized cross-device sync)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/planner-data', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.tomorrowNotes)) {
        // Match current week's notes
        const matching = data.tomorrowNotes.filter(
          (n: any) => Number(n.block || 1) === Number(block) && Number(n.week || 1) === Number(week)
        );

        // Always repeat Thursday's Sunday preparation on next Saturday's Tomorrow:
        // When targetDay is Sunday, merge Sunday notes from adjacent weeks (week-1 and week+1)
        if (targetDay === 'Sunday') {
          const crossWeekSundayNotes = data.tomorrowNotes.filter(
            (n: any) =>
              Number(n.block || 1) === Number(block) &&
              (Number(n.week || 1) === Number(week - 1) || Number(n.week || 1) === Number(week + 1)) &&
              n.targetDay === 'Sunday'
          );
          crossWeekSundayNotes.forEach((extra: TomorrowSpecialNote) => {
            if (!matching.some((m: any) => m.id === extra.id || (m.subject === extra.subject && m.note === extra.note))) {
              matching.push(extra);
            }
          });
        }

        // If server returned tomorrowNotes, trust it as the source of truth
        if (data.tomorrowNotes.length > 0) {
          loadedNotes = matching;
          fetchedFromServer = true;
          try {
            localStorage.setItem(storageKey, JSON.stringify(matching));
          } catch {}
        }
      }
    }
  } catch (e) {
    console.warn('Could not fetch tomorrow notes from /api/planner-data, checking local cache:', e);
  }

  // 2. Fallback to local cache only if not fetched from server
  if (!fetchedFromServer && !loadedNotes) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        loadedNotes = JSON.parse(raw);
      }
      // If targetDay is Sunday, also merge cached Sunday notes from adjacent weeks
      if (targetDay === 'Sunday') {
        const adjacentKeys = [
          week > 1 ? `${LOCAL_STORAGE_PREFIX}${block}_${week - 1}` : null,
          week < 4 ? `${LOCAL_STORAGE_PREFIX}${block}_${week + 1}` : null,
        ].filter(Boolean) as string[];

        const extraSundayNotes: TomorrowSpecialNote[] = [];
        adjacentKeys.forEach((key) => {
          try {
            const adjRaw = localStorage.getItem(key);
            if (adjRaw) {
              const parsed = JSON.parse(adjRaw);
              if (Array.isArray(parsed)) {
                parsed
                  .filter((n) => n.targetDay === 'Sunday')
                  .forEach((n) => extraSundayNotes.push(n));
              }
            }
          } catch {}
        });

        if (extraSundayNotes.length > 0) {
          const currentList = loadedNotes || [];
          const map = new Map<string, TomorrowSpecialNote>();
          currentList.forEach((n) => map.set(n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`, n));
          extraSundayNotes.forEach((n) => map.set(n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`, n));
          loadedNotes = Array.from(map.values());
        }
      }
    } catch (e) {
      console.warn('Could not parse cached tomorrow notes:', e);
    }
  }

  // 3. If still not found and not fetched from server, check Supabase planner_settings
  if (!fetchedFromServer && !loadedNotes) {
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

  // Base official notes for Block/Week
  const baseNotes: TomorrowSpecialNote[] =
    block === 1 && week === 2
      ? WEEK2_SPECIAL_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay
        )
      : block === 1 && week === 1
      ? SPECIAL_TEACHER_NOTES.filter(
          (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay && (n.week === 1 || !n.week)
        )
      : [];

  // When targetDay is Sunday, also merge Sunday base notes from Week 1 and Week 2 so preparations repeat
  if (targetDay === 'Sunday') {
    const additionalBase = [
      ...WEEK2_SPECIAL_NOTES.filter(
        (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === 'Sunday'
      ),
      ...SPECIAL_TEACHER_NOTES.filter(
        (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === 'Sunday'
      ),
    ];
    additionalBase.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      if (!baseNotes.some((b) => (b.id && b.id === n.id) || `${b.targetDay}-${b.subject}-${(b.note || '').slice(0, 30)}` === key)) {
        baseNotes.push(n);
      }
    });
  }

  // 4. Merge dynamic notes and base notes
  if (loadedNotes && Array.isArray(loadedNotes) && loadedNotes.length > 0) {
    const dynamicNotes = loadedNotes.filter(
      (n) => (n.classId === classId || (n.classId as any) === 'ALL') && n.targetDay === targetDay
    );
    const map = new Map<string, TomorrowSpecialNote>();
    baseNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });
    dynamicNotes.forEach((n) => {
      const key = n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 30)}`;
      map.set(key, n);
    });
    return Array.from(map.values());
  }

  // 5. Default Static Fallbacks (Block 1 Week 2 & Block 1 Week 1)
  return baseNotes;
}

// Save tomorrow notes for a specific block and week
export async function saveTomorrowNotes(
  block: number,
  week: number,
  notes: TomorrowSpecialNote[],
  mode: 'merge' | 'replace' = 'merge'
): Promise<void> {
  const storageKey = `${LOCAL_STORAGE_PREFIX}${block}_${week}`;
  const settingKey = `tomorrow_notes_${block}_${week}`;

  // 1. Cache locally
  try {
    let finalNotes = notes;
    if (mode === 'merge') {
      const existingRaw = localStorage.getItem(storageKey);
      const existing: TomorrowSpecialNote[] = existingRaw ? JSON.parse(existingRaw) : [];
      const map = new Map<string, TomorrowSpecialNote>();
      existing.forEach((n) => map.set(n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 20)}`, n));
      notes.forEach((n) => map.set(n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 20)}`, n));
      finalNotes = Array.from(map.values());
    }
    localStorage.setItem(storageKey, JSON.stringify(finalNotes));

    // Sunday notes seamless replication:
    // If there are Sunday notes, replicate them to week+1 and week-1 cache so Thursday <-> Saturday always repeat
    const sundayNotes = finalNotes.filter((n) => n.targetDay === 'Sunday');
    if (sundayNotes.length > 0) {
      const targetWeeks = [week > 1 ? week - 1 : null, week < 4 ? week + 1 : null].filter(Boolean) as number[];
      targetWeeks.forEach((tw) => {
        try {
          const adjKey = `${LOCAL_STORAGE_PREFIX}${block}_${tw}`;
          const adjRaw = localStorage.getItem(adjKey);
          const adjList: TomorrowSpecialNote[] = adjRaw ? JSON.parse(adjRaw) : [];
          const adjMap = new Map<string, TomorrowSpecialNote>();
          adjList.forEach((n) => adjMap.set(n.id || `${n.targetDay}-${n.subject}-${(n.note || '').slice(0, 20)}`, n));
          sundayNotes.forEach((n) => {
            const copy = { ...n, week: tw };
            adjMap.set(copy.id || `${copy.targetDay}-${copy.subject}-${(copy.note || '').slice(0, 20)}`, copy);
          });
          localStorage.setItem(adjKey, JSON.stringify(Array.from(adjMap.values())));
        } catch {}
      });
    }
  } catch (e) {
    console.warn('Could not cache tomorrow notes to localStorage:', e);
  }

  // 2. Sync to centralized server endpoint
  try {
    await fetch('/api/planner-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tomorrowNotes: notes, mode }),
    });

    // Also sync Sunday notes for adjacent week to server if present
    const sundayNotes = notes.filter((n) => n.targetDay === 'Sunday');
    if (sundayNotes.length > 0 && week < 4) {
      const nextWeekSundayNotes = sundayNotes.map((n) => ({ ...n, week: week + 1 }));
      await fetch('/api/planner-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tomorrowNotes: nextWeekSundayNotes, mode: 'merge' }),
      });
    }
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
