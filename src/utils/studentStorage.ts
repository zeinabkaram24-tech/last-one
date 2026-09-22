import { ClassId, UserMode, UserProfile } from '../types';
import {
  saveStudentProgressToDb,
  fetchStudentProgressFromDb,
  fetchKnownStudentsFromDb,
  isSupabaseConfigured,
} from '../lib/supabase';

const PROFILE_KEY = 'nile_planner_active_user_profile_v1';
const KNOWN_STUDENTS_KEY = 'nile_planner_known_students_list_v1';
const PROGRESS_PREFIX = 'nile_student_progress_v2_';

export interface StudentProgressData {
  studentName: string;
  classId?: ClassId;
  completedClassworkIds: string[];
  completedHomeworkIds: string[];
  lastActive: number;
}

// Safe persistent local storage with memory fallback
const IN_MEMORY_STUDENT_STORAGE: Record<string, string> = {};

function getCookie(name: string): string | null {
  try {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const encodedVal = parts.pop()?.split(';').shift();
      return encodedVal ? decodeURIComponent(encodedVal) : null;
    }
  } catch (e) {
    console.error('Error reading cookie fallback', e);
  }
  return null;
}

function setCookie(name: string, value: string): void {
  try {
    if (typeof document === 'undefined') return;
    const encodedVal = encodeURIComponent(value);
    document.cookie = `${name}=${encodedVal}; path=/; max-age=31536000; SameSite=None; Secure`;
  } catch (e) {
    console.error('Error setting cookie fallback', e);
  }
}

function removeCookie(name: string): void {
  try {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`;
  } catch (e) {
    console.error('Error removing cookie fallback', e);
  }
}

const studentStorageHelper = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {}
    // Try cookie fallback
    const cookieVal = getCookie(key);
    if (cookieVal !== null) return cookieVal;

    return IN_MEMORY_STUDENT_STORAGE[key] || null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch {}
    // Set cookie fallback
    setCookie(key, val);

    IN_MEMORY_STUDENT_STORAGE[key] = val;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
    // Remove cookie fallback
    removeCookie(key);

    delete IN_MEMORY_STUDENT_STORAGE[key];
  },
};

export function normalizeStudentName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getActiveUserProfile(): UserProfile | null {
  try {
    const raw = studentStorageHelper.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading user profile', e);
    return null;
  }
}

export function setActiveUserProfile(profile: UserProfile | null): void {
  try {
    if (!profile) {
      studentStorageHelper.removeItem(PROFILE_KEY);
    } else {
      studentStorageHelper.setItem(PROFILE_KEY, JSON.stringify(profile));
      if (profile.mode === 'student' && profile.studentName) {
        addKnownStudent(profile.studentName, profile.classId);
      }
    }
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

export function getKnownStudents(): { name: string; classId?: ClassId; lastActive: number }[] {
  try {
    const raw = studentStorageHelper.getItem(KNOWN_STUDENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function addKnownStudent(name: string, classId?: ClassId): void {
  const cleanName = name.trim();
  if (!cleanName) return;
  try {
    const list = getKnownStudents();
    const existingIdx = list.findIndex(
      (s) => normalizeStudentName(s.name) === normalizeStudentName(cleanName)
    );
    if (existingIdx >= 0) {
      list[existingIdx].lastActive = Date.now();
      if (classId) list[existingIdx].classId = classId;
    } else {
      list.unshift({
        name: cleanName,
        classId,
        lastActive: Date.now(),
      });
    }
    studentStorageHelper.setItem(KNOWN_STUDENTS_KEY, JSON.stringify(list.slice(0, 10)));
  } catch (e) {
    console.error('Error adding known student', e);
  }
}

export function removeKnownStudent(name: string): void {
  try {
    const list = getKnownStudents().filter(
      (s) => normalizeStudentName(s.name) !== normalizeStudentName(name)
    );
    studentStorageHelper.setItem(KNOWN_STUDENTS_KEY, JSON.stringify(list));
    studentStorageHelper.removeItem(PROGRESS_PREFIX + normalizeStudentName(name));
  } catch (e) {
    console.error('Error removing known student', e);
  }
}

export function getStudentProgress(studentName: string): StudentProgressData {
  const norm = normalizeStudentName(studentName);
  try {
    const raw = studentStorageHelper.getItem(PROGRESS_PREFIX + norm);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading student progress', e);
  }

  return {
    studentName: studentName.trim(),
    completedClassworkIds: [],
    completedHomeworkIds: [],
    lastActive: Date.now(),
  };
}

export function saveStudentProgress(
  studentName: string,
  completedClassworkIds: string[],
  completedHomeworkIds: string[],
  classId?: ClassId
): void {
  const cleanName = studentName.trim();
  if (!cleanName) return;
  const norm = normalizeStudentName(cleanName);

  const data: StudentProgressData = {
    studentName: cleanName,
    classId,
    completedClassworkIds,
    completedHomeworkIds,
    lastActive: Date.now(),
  };

  try {
    studentStorageHelper.setItem(PROGRESS_PREFIX + norm, JSON.stringify(data));
    addKnownStudent(cleanName, classId);
    // Sync with Supabase in background
    if (isSupabaseConfigured) {
      saveStudentProgressToDb(cleanName, completedClassworkIds, completedHomeworkIds, classId);
    }
  } catch (e) {
    console.error('Error saving student progress', e);
  }
}

export async function syncStudentProgressFromDb(studentName: string): Promise<StudentProgressData> {
  const local = getStudentProgress(studentName);
  if (!isSupabaseConfigured) return local;

  try {
    const remote = await fetchStudentProgressFromDb(studentName);
    if (remote) {
      saveStudentProgress(
        remote.studentName,
        remote.completedClassworkIds,
        remote.completedHomeworkIds,
        remote.classId
      );
      return remote;
    }
  } catch (e) {
    console.warn('Could not sync student progress from Supabase:', e);
  }
  return local;
}

const GUEST_PROGRESS_KEY = 'nile_planner_guest_progress_v2';

export function getGuestProgress(): { completedClassworkIds: string[]; completedHomeworkIds: string[] } {
  try {
    const raw = studentStorageHelper.getItem(GUEST_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedClassworkIds: Array.isArray(parsed.completedClassworkIds) ? parsed.completedClassworkIds : [],
        completedHomeworkIds: Array.isArray(parsed.completedHomeworkIds) ? parsed.completedHomeworkIds : [],
      };
    }
  } catch (e) {
    console.error('Error reading guest progress', e);
  }
  return { completedClassworkIds: [], completedHomeworkIds: [] };
}

export function saveGuestProgress(
  completedClassworkIds: string[],
  completedHomeworkIds: string[]
): void {
  try {
    studentStorageHelper.setItem(GUEST_PROGRESS_KEY, JSON.stringify({
      completedClassworkIds,
      completedHomeworkIds,
      updatedAt: Date.now(),
    }));
  } catch (e) {
    console.error('Error saving guest progress', e);
  }
}
