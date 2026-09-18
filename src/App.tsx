import React, { useState, useEffect } from 'react';
import { ClassId, SchoolDay, ClassworkEntry, HomeworkEntry, UserProfile } from './types';
import { INITIAL_CLASSWORK, INITIAL_HOMEWORK } from './data/defaultWeeklyPlan';
import { SCHOOL_DAYS, SCHOOL_NAME, SCHOOL_BRANCH } from './data/timetables';
import { Navbar } from './components/Navbar';
import { ClassworkView } from './components/ClassworkView';
import { HomeworkView } from './components/HomeworkView';
import { TomorrowView } from './components/TomorrowView';
import { TimetableGrid } from './components/TimetableGrid';
import { PrintSheet } from './components/PrintSheet';
import { WeeklyPlanModal } from './components/WeeklyPlanModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { MaterialsModal } from './components/MaterialsModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { notifyTomorrowNotesListeners } from './utils/tomorrowNotesStorage';
import {
  getActiveUserProfile,
  setActiveUserProfile,
  getStudentProgress,
  saveStudentProgress,
  getGuestProgress,
  saveGuestProgress,
} from './utils/studentStorage';
import {
  isSupabaseConfigured,
  supabase,
  fetchAllClasswork,
  upsertClasswork,
  updateClassworkCompletion,
  deleteClasswork,
  bulkInsertClasswork,
  fetchAllHomework,
  upsertHomework,
  updateHomeworkCompletion,
  deleteHomework,
  bulkInsertHomework,
  seedInitialDataIfEmpty,
  fetchPlannerSettings,
  savePlannerSetting,
  rowToClasswork,
  rowToHomework,
  ClassworkRow,
  HomeworkRow,
} from './lib/supabase';
import initialData from './data/initialData.json';
import { Sparkles, RotateCcw, Database, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEYS = {
  CLASS: 'nile_planner_current_class_v3',
  DAY: 'nile_planner_selected_day_v3',
  WEEK: 'nile_planner_current_week_v3',
};

function getProfileClasswork(profile: UserProfile | null): ClassworkEntry[] {
  if (profile?.mode === 'student' && profile.studentName) {
    const progress = getStudentProgress(profile.studentName);
    const set = new Set(progress.completedClassworkIds);
    return INITIAL_CLASSWORK.map((c) => ({
      ...c,
      completed: set.has(c.id),
    }));
  }
  const guestProgress = getGuestProgress();
  const guestSet = new Set(guestProgress.completedClassworkIds);
  return INITIAL_CLASSWORK.map((c) => ({
    ...c,
    completed: guestSet.has(c.id),
  }));
}

function getProfileHomework(profile: UserProfile | null): HomeworkEntry[] {
  if (profile?.mode === 'student' && profile.studentName) {
    const progress = getStudentProgress(profile.studentName);
    const set = new Set(progress.completedHomeworkIds);
    return INITIAL_HOMEWORK.map((h) => ({
      ...h,
      completed: set.has(h.id),
    }));
  }
  const guestProgress = getGuestProgress();
  const guestSet = new Set(guestProgress.completedHomeworkIds);
  return INITIAL_HOMEWORK.map((h) => ({
    ...h,
    completed: guestSet.has(h.id),
  }));
}

export default function App() {
  // Active User Profile (Guest vs Student)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    return getActiveUserProfile();
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    return getActiveUserProfile() === null;
  });

  // Class selection (G2A, G2B, G2C)
  const [currentClass, setCurrentClass] = useState<ClassId>(() => {
    const profile = getActiveUserProfile();
    if (profile?.classId) return profile.classId;
    const saved = localStorage.getItem(STORAGE_KEYS.CLASS);
    return saved === 'G2A' || saved === 'G2B' || saved === 'G2C' ? saved : 'G2B';
  });

  // Current Block (1, 2, 3, 4)
  const [currentBlock, setCurrentBlock] = useState<number>(() => {
    const saved = localStorage.getItem('nile_planner_block');
    return saved ? Number(saved) : 1;
  });

  // Current Week (1, 2, 3, 4)
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEK);
    return saved ? Number(saved) : 2;
  });

  // Selected Day (Sunday, Monday, Tuesday, Wednesday, Thursday)
  const [selectedDay, setSelectedDay] = useState<SchoolDay>(() => {
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayMap: Record<number, SchoolDay> = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Sunday',
      6: 'Sunday',
    };
    return dayMap[dayOfWeek] || 'Sunday';
  });

  // Active View Tab: 'classwork' | 'homework' | 'tomorrow' | 'timetable'
  const [activeTab, setActiveTab] = useState<'classwork' | 'homework' | 'tomorrow' | 'timetable'>('classwork');

  // Supabase Connection Status
  const [supabaseStatus, setSupabaseStatus] = useState<'connecting' | 'connected' | 'unconfigured' | 'error'>(() => {
    return isSupabaseConfigured ? 'connecting' : 'unconfigured';
  });

  // Classwork state initialized based on user profile
  const [classworkList, setClassworkList] = useState<ClassworkEntry[]>(() => {
    return getProfileClasswork(getActiveUserProfile());
  });

  // Homework state initialized based on user profile
  const [homeworkList, setHomeworkList] = useState<HomeworkEntry[]>(() => {
    return getProfileHomework(getActiveUserProfile());
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  // Listen for Supabase config updates (saving URL / API Key from UI)
  useEffect(() => {
    const handleConfigUpdated = async () => {
      setSupabaseStatus('connecting');
      try {
        const [cwData, hwData] = await Promise.all([
          fetchAllClasswork(),
          fetchAllHomework(),
        ]);
        if (cwData && cwData.length > 0) setClassworkList(cwData);
        if (hwData && hwData.length > 0) setHomeworkList(hwData);
        setSupabaseStatus('connected');
        showToast('تم تحديث اتصال Supabase وقراءة البيانات السحابية بنجاح!');
      } catch (err) {
        console.error('Error reloading data after Supabase config change:', err);
        setSupabaseStatus('error');
      }
    };

    window.addEventListener('supabase_config_updated', handleConfigUpdated);
    return () => {
      window.removeEventListener('supabase_config_updated', handleConfigUpdated);
    };
  }, []);

  // Persistence & Sync effects for class, week, day
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASS, currentClass);
    if (isSupabaseConfigured) {
      savePlannerSetting('current_class', currentClass);
    }
  }, [currentClass]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEK, String(currentWeek));
    if (isSupabaseConfigured) {
      savePlannerSetting('current_week', String(currentWeek));
    }
  }, [currentWeek]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAY, selectedDay);
    if (isSupabaseConfigured) {
      savePlannerSetting('selected_day', selectedDay);
    }
  }, [selectedDay]);

  // Initial Server and Supabase Data Initialization & Realtime Subscriptions
  useEffect(() => {
    let isMounted = true;

    async function initializeFromSupabase() {
      try {
        if (isSupabaseConfigured) {
          setSupabaseStatus('connecting');
          const seedResult = await seedInitialDataIfEmpty();
          if (seedResult.seeded) {
            console.log('✅ Initial data automatically seeded into Supabase tables.');
          }
        } else {
          setSupabaseStatus('unconfigured');
        }

        // Fetch classwork, homework, and planner settings from centralized server / Supabase
        const [cwData, hwData, settings] = await Promise.all([
          fetchAllClasswork(),
          fetchAllHomework(),
          fetchPlannerSettings(),
        ]);

        if (!isMounted) return;

        // Apply classwork with student or guest completion checks
        if (cwData && cwData.length > 0) {
          const uniqueCwMap = new Map<string, ClassworkEntry>();
          cwData.forEach((c) => uniqueCwMap.set(c.id, c));
          const dedupedCw = Array.from(uniqueCwMap.values());

          const profile = getActiveUserProfile();
          if (profile?.mode === 'student' && profile.studentName) {
            const progress = getStudentProgress(profile.studentName);
            const cwSet = new Set(progress.completedClassworkIds);
            setClassworkList(dedupedCw.map((c) => ({ ...c, completed: cwSet.has(c.id) })));
          } else {
            const guestProgress = getGuestProgress();
            const cwSet = new Set(guestProgress.completedClassworkIds);
            setClassworkList(dedupedCw.map((c) => ({ ...c, completed: cwSet.has(c.id) })));
          }
        }

        // Apply homework with student or guest completion checks
        if (hwData && hwData.length > 0) {
          const uniqueHwMap = new Map<string, HomeworkEntry>();
          hwData.forEach((h) => uniqueHwMap.set(h.id, h));
          const dedupedHw = Array.from(uniqueHwMap.values());

          const profile = getActiveUserProfile();
          const normalizedHw = dedupedHw.map((h) => {
            if (
              (h.id === 'hw-w2-ar-tue-g2a-wb' ||
                h.id === 'hw-w2-ar-tue-g2b-wb' ||
                h.id === 'hw-w2-ar-tue-g2c-wb' ||
                (h.subject === 'Arabic' && h.assignedDay === 'Tuesday' && h.week === 2)) &&
              (h.task.includes('46') || h.pages.includes('46') || h.details.includes('46'))
            ) {
              return {
                ...h,
                task: h.task.replace(/46/g, '47'),
                pages: h.pages.replace(/46/g, '47'),
                details: h.details.replace(/46/g, '47'),
              };
            }
            return h;
          });

          if (profile?.mode === 'student' && profile.studentName) {
            const progress = getStudentProgress(profile.studentName);
            const hwSet = new Set(progress.completedHomeworkIds);
            setHomeworkList(normalizedHw.map((h) => ({ ...h, completed: hwSet.has(h.id) })));
          } else {
            const guestProgress = getGuestProgress();
            const hwSet = new Set(guestProgress.completedHomeworkIds);
            setHomeworkList(normalizedHw.map((h) => ({ ...h, completed: hwSet.has(h.id) })));
          }
        }

        // Apply settings if found in DB
        if (
          settings.current_class &&
          (settings.current_class === 'G2A' || settings.current_class === 'G2B' || settings.current_class === 'G2C')
        ) {
          setCurrentClass(settings.current_class as ClassId);
        }
        if (settings.current_week) {
          setCurrentWeek(Number(settings.current_week) || 2);
        }

        if (isSupabaseConfigured) {
          setSupabaseStatus('connected');
        }
      } catch (err) {
        console.error('Failed to initialize data from server/Supabase:', err);
        if (isMounted && isSupabaseConfigured) setSupabaseStatus('error');
      }
    }

    initializeFromSupabase();

    // Setup Supabase Realtime Channels only if configured
    if (!isSupabaseConfigured) return;
    const channel = supabase
      .channel('planner-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classwork' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newCw = rowToClasswork(payload.new as ClassworkRow);
          setClassworkList((prev) => [newCw, ...prev.filter((c) => c.id !== newCw.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedCw = rowToClasswork(payload.new as ClassworkRow);
          setClassworkList((prev) =>
            prev.map((c) => (c.id === updatedCw.id ? { ...c, ...updatedCw, completed: c.completed } : c))
          );
        } else if (payload.eventType === 'DELETE') {
          const oldId = payload.old.id;
          setClassworkList((prev) => prev.filter((c) => c.id !== oldId));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'homework' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newHw = rowToHomework(payload.new as HomeworkRow);
          setHomeworkList((prev) => [newHw, ...prev.filter((h) => h.id !== newHw.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedHw = rowToHomework(payload.new as HomeworkRow);
          setHomeworkList((prev) =>
            prev.map((h) => (h.id === updatedHw.id ? { ...h, ...updatedHw, completed: h.completed } : h))
          );
        } else if (payload.eventType === 'DELETE') {
          const oldId = payload.old.id;
          setHomeworkList((prev) => prev.filter((h) => h.id !== oldId));
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4500);
  };

  // Handle switching user profile (Student vs Guest)
  const handleSelectProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setActiveUserProfile(newProfile);

    if (newProfile.classId && newProfile.classId !== currentClass) {
      setCurrentClass(newProfile.classId);
    }

    if (newProfile.mode === 'student' && newProfile.studentName) {
      const progress = getStudentProgress(newProfile.studentName);
      const cwSet = new Set(progress.completedClassworkIds);
      const hwSet = new Set(progress.completedHomeworkIds);

      setClassworkList((prev) =>
        prev.map((c) => ({
          ...c,
          completed: cwSet.has(c.id),
        }))
      );
      setHomeworkList((prev) =>
        prev.map((h) => ({
          ...h,
          completed: hwSet.has(h.id),
        }))
      );
      showToast(`مرحباً يا ${newProfile.studentName}! تم تحميل إنجازاتك وواجباتك المحفوظة.`);
    } else {
      // Guest mode: Restore guest progress
      const guestProgress = getGuestProgress();
      const cwSet = new Set(guestProgress.completedClassworkIds);
      const hwSet = new Set(guestProgress.completedHomeworkIds);
      setClassworkList((prev) => prev.map((c) => ({ ...c, completed: cwSet.has(c.id) })));
      setHomeworkList((prev) => prev.map((h) => ({ ...h, completed: hwSet.has(h.id) })));
      showToast('تم التبديل لوضع الزائر (تُحفظ علامات الإنجاز على هذا الجهاز).');
    }
  };

  // Classwork handlers with Supabase CRUD
  const handleToggleClasswork = async (id: string) => {
    const currentItem = classworkList.find((c) => c.id === id);
    const nextCompleted = currentItem ? !currentItem.completed : true;

    // 1. Synchronous state update for immediate UI feedback
    setClassworkList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: nextCompleted } : c))
    );

    // 2. Persist progress in student or guest storage
    if (userProfile?.mode === 'student' && userProfile.studentName) {
      const currentProgress = getStudentProgress(userProfile.studentName);
      const cwSet = new Set(currentProgress.completedClassworkIds);
      if (nextCompleted) {
        cwSet.add(id);
      } else {
        cwSet.delete(id);
      }
      const newCwIds = Array.from(cwSet);
      const hwIds = homeworkList.filter((h) => h.completed).map((h) => h.id);
      saveStudentProgress(userProfile.studentName, newCwIds, hwIds, currentClass);
    } else {
      const guestProgress = getGuestProgress();
      const cwSet = new Set(guestProgress.completedClassworkIds);
      if (nextCompleted) {
        cwSet.add(id);
      } else {
        cwSet.delete(id);
      }
      saveGuestProgress(
        Array.from(cwSet),
        homeworkList.filter((h) => h.completed).map((h) => h.id)
      );
    }

    if (isSupabaseConfigured) {
      try {
        await updateClassworkCompletion(id, nextCompleted);
      } catch (e) {
        console.warn('Could not update classwork completion in Supabase:', e);
      }
    }
  };

  const handleSaveClasswork = async (entry: ClassworkEntry) => {
    setClassworkList((prev) => {
      const idx = prev.findIndex((c) => c.id === entry.id);
      let next: ClassworkEntry[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = entry;
      } else {
        next = [...prev, entry];
      }
      if (userProfile?.mode === 'student' && userProfile.studentName) {
        const completedCwIds = next.filter((c) => c.completed).map((c) => c.id);
        const completedHwIds = homeworkList.filter((h) => h.completed).map((h) => h.id);
        saveStudentProgress(userProfile.studentName, completedCwIds, completedHwIds, currentClass);
      }
      return next;
    });

    if (isSupabaseConfigured) {
      try {
        await upsertClasswork(entry);
      } catch (e) {
        console.error('Error saving classwork to Supabase:', e);
      }
    }
    showToast('تم حفظ الحصة بنجاح في قاعدة بيانات Supabase!');
  };

  // Homework handlers with Supabase CRUD
  const handleToggleHomework = async (id: string) => {
    const currentItem = homeworkList.find((h) => h.id === id);
    const nextCompleted = currentItem ? !currentItem.completed : true;

    // 1. Synchronous state update for immediate UI feedback
    setHomeworkList((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: nextCompleted } : h))
    );

    // 2. Persist progress in student or guest storage
    if (userProfile?.mode === 'student' && userProfile.studentName) {
      const currentProgress = getStudentProgress(userProfile.studentName);
      const hwSet = new Set(currentProgress.completedHomeworkIds);
      if (nextCompleted) {
        hwSet.add(id);
      } else {
        hwSet.delete(id);
      }
      const newHwIds = Array.from(hwSet);
      const cwIds = classworkList.filter((c) => c.completed).map((c) => c.id);
      saveStudentProgress(userProfile.studentName, cwIds, newHwIds, currentClass);
    } else {
      const guestProgress = getGuestProgress();
      const hwSet = new Set(guestProgress.completedHomeworkIds);
      if (nextCompleted) {
        hwSet.add(id);
      } else {
        hwSet.delete(id);
      }
      saveGuestProgress(
        classworkList.filter((c) => c.completed).map((c) => c.id),
        Array.from(hwSet)
      );
    }

    if (isSupabaseConfigured) {
      try {
        await updateHomeworkCompletion(id, nextCompleted);
      } catch (e) {
        console.warn('Could not update homework completion in Supabase:', e);
      }
    }
  };

  const handleAddHomework = async (entry: HomeworkEntry) => {
    setHomeworkList((prev) => {
      const next = [entry, ...prev.filter((h) => h.id !== entry.id)];
      if (userProfile?.mode === 'student' && userProfile.studentName) {
        const completedCwIds = classworkList.filter((c) => c.completed).map((c) => c.id);
        const completedHwIds = next.filter((h) => h.completed).map((h) => h.id);
        saveStudentProgress(userProfile.studentName, completedCwIds, completedHwIds, currentClass);
      }
      return next;
    });

    if (isSupabaseConfigured) {
      try {
        await upsertHomework(entry);
      } catch (e) {
        console.error('Error adding homework to Supabase:', e);
      }
    }
    showToast('تمت إضافة الواجب المنزلي بنجاح إلى Supabase!');
  };

  const handleDeleteHomework = async (id: string) => {
    setHomeworkList((prev) => {
      const next = prev.filter((h) => h.id !== id);
      if (userProfile?.mode === 'student' && userProfile.studentName) {
        const currentProgress = getStudentProgress(userProfile.studentName);
        const hwSet = new Set(currentProgress.completedHomeworkIds);
        hwSet.delete(id);
        const cwIds = classworkList.filter((c) => c.completed).map((c) => c.id);
        saveStudentProgress(userProfile.studentName, cwIds, Array.from(hwSet), currentClass);
      } else {
        const guestProgress = getGuestProgress();
        const hwSet = new Set(guestProgress.completedHomeworkIds);
        hwSet.delete(id);
        saveGuestProgress(guestProgress.completedClassworkIds, Array.from(hwSet));
      }
      return next;
    });

    if (isSupabaseConfigured) {
      try {
        await deleteHomework(id);
      } catch (e) {
        console.error('Error deleting homework from Supabase:', e);
      }
    }
    showToast('تم حذف الواجب من قاعدة بيانات Supabase.');
  };

  const handleApplyWeeklyPlan = async (
    newClasswork: ClassworkEntry[],
    newHomework: HomeworkEntry[],
    mode: 'merge' | 'replace' = 'replace'
  ) => {
    if (mode === 'replace') {
      const cwKeys = new Set(newClasswork.map((c) => `${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`));
      const hwKeys = new Set(newHomework.map((h) => `${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`));

      setClassworkList((prev) => [
        ...newClasswork,
        ...prev.filter((c) => !cwKeys.has(`${c.block || 1}-${c.week || 1}-${c.classId}-${c.subject}`)),
      ]);
      setHomeworkList((prev) => [
        ...newHomework,
        ...prev.filter((h) => !hwKeys.has(`${h.block || 1}-${h.week || 1}-${h.classId}-${h.subject}`)),
      ]);
    } else {
      setClassworkList((prev) => [...newClasswork, ...prev]);
      setHomeworkList((prev) => [...newHomework, ...prev]);
    }

    if (isSupabaseConfigured) {
      try {
        await Promise.all([
          bulkInsertClasswork(newClasswork, mode),
          bulkInsertHomework(newHomework, mode),
        ]);
      } catch (e) {
        console.error('Error saving weekly plan to Supabase:', e);
      }
    }
    showToast(
      mode === 'replace'
        ? 'تم استبدال الخطة السابقة بالخطة الجديدة وتحديث البيانات بنجاح!'
        : 'تم استيراد الخطة الأسبوعية ودمجها بنجاح!'
    );
  };

  // Reset to sample plan
  const handleResetToDefaults = async () => {
    if (confirm('هل تريد استعادة الخطة الأصلية ومزامنتها مباشرة مع Supabase؟')) {
      setClassworkList(INITIAL_CLASSWORK.map((c) => ({ ...c, completed: false })));
      setHomeworkList(INITIAL_HOMEWORK.map((h) => ({ ...h, completed: false })));

      if (userProfile?.mode === 'student' && userProfile.studentName) {
        saveStudentProgress(userProfile.studentName, [], [], currentClass);
      }

      if (isSupabaseConfigured) {
        try {
          await Promise.all([
            bulkInsertClasswork(INITIAL_CLASSWORK),
            bulkInsertHomework(INITIAL_HOMEWORK),
          ]);
        } catch (e) {
          console.error('Failed to sync default data to Supabase:', e);
        }
      }
      showToast('تمت استعادة الخطة الأولية وتحديث Supabase.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate pending homework count for current class
  const pendingHomeworkCount = homeworkList.filter(
    (h) => h.classId === currentClass && !h.completed
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Interactive Navigation Bar */}
      <Navbar
        currentClass={currentClass}
        onSelectClass={setCurrentClass}
        currentBlock={currentBlock}
        onSelectBlock={(b) => {
          setCurrentBlock(b);
          localStorage.setItem('nile_planner_block', String(b));
          showToast(`Switched to Block ${b}`);
        }}
        currentWeek={currentWeek}
        onSelectWeek={(w) => {
          setCurrentWeek(w);
          localStorage.setItem(STORAGE_KEYS.WEEK, String(w));
          showToast(`Switched to Week ${w}`);
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrint={handlePrint}
        pendingHomeworkCount={pendingHomeworkCount}
        userProfile={userProfile}
        onOpenProfileModal={() => setIsAuthModalOpen(true)}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenMaterials={() => setIsMaterialsModalOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        supabaseStatus={supabaseStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="mb-4 p-3.5 bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-between gap-3 animate-fade-in print:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{toastMsg}</span>
            </div>
            <button
              onClick={() => setToastMsg(null)}
              className="text-emerald-200 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic View rendering based on activeTab */}
        <div className="print:hidden">
          {activeTab === 'classwork' && (
            <ClassworkView
              currentClass={currentClass}
              selectedDay={selectedDay}
              classworkList={classworkList}
              currentBlock={currentBlock}
              currentWeek={currentWeek}
              onToggleClasswork={handleToggleClasswork}
              onSaveClasswork={handleSaveClasswork}
            />
          )}

          {activeTab === 'homework' && (
            <HomeworkView
              currentClass={currentClass}
              selectedDay={selectedDay}
              homeworkList={homeworkList}
              classworkList={classworkList}
              currentBlock={currentBlock}
              currentWeek={currentWeek}
              onToggleHomework={handleToggleHomework}
              onAddHomework={handleAddHomework}
              onDeleteHomework={handleDeleteHomework}
            />
          )}

          {activeTab === 'tomorrow' && (
            <TomorrowView
              currentClass={currentClass}
              selectedDay={selectedDay}
              currentBlock={currentBlock}
              currentWeek={currentWeek}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableGrid
              currentClass={currentClass}
              selectedDay={selectedDay}
              onSelectDay={(d) => {
                setSelectedDay(d);
                setActiveTab('classwork');
              }}
            />
          )}
        </div>

        {/* Clean Print Layout for parents and students */}
        <PrintSheet
          currentClass={currentClass}
          selectedDay={selectedDay}
          classworkList={classworkList}
          homeworkList={homeworkList}
        />
      </main>

      {/* Bottom Footer with quick stats and reset */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">{SCHOOL_NAME}</span>
            <span>•</span>
            <span>{SCHOOL_BRANCH} Branch</span>
            <span>•</span>
            <span>Classes: G2A, G2B, G2C</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Supabase connection indicator */}
            {supabaseStatus === 'connected' && (
              <button
                type="button"
                onClick={() => setIsSupabaseConfigOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="قاعدة بيانات Supabase السحابية متصلة - انقر لتعديل الإعدادات"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase متصل</span>
              </button>
            )}
            {supabaseStatus === 'connecting' && (
              <button
                type="button"
                onClick={() => setIsSupabaseConfigOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>جاري الاتصال بـ Supabase...</span>
              </button>
            )}
            {supabaseStatus === 'unconfigured' && (
              <button
                type="button"
                onClick={() => setIsSupabaseConfigOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                title="انقر لإدخال وحفظ رابط ومفتاح Supabase بسهولة"
              >
                <Database className="w-3.5 h-3.5 text-slate-600" />
                <span>إعداد وحفظ Supabase</span>
              </button>
            )}
            {supabaseStatus === 'error' && (
              <button
                type="button"
                onClick={() => setIsSupabaseConfigOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                title="انقر لتصحيح إعدادات ومفاتيح الربط"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>خطأ في اتصال Supabase (تعديل)</span>
              </button>
            )}

            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Smart Plan Classifier
            </button>
            <button
              onClick={handleResetToDefaults}
              className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Defaults
            </button>
          </div>
        </div>
      </footer>

      {/* Weekly Plan Smart Classifier Modal */}
      <WeeklyPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentClass={currentClass}
        onApplyPlan={handleApplyWeeklyPlan}
      />

      {/* Student Profile / Guest Login Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentProfile={userProfile}
        currentClass={currentClass}
        onSelectProfile={handleSelectProfile}
      />

      {/* Admin Password Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Admin Dashboard / Settings Panel (Placeholder for custom settings) */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onPlanUpdated={async (updatedBlock?: number, updatedWeek?: number) => {
          try {
            if (updatedBlock) {
              setCurrentBlock(updatedBlock);
              localStorage.setItem('nile_planner_block', String(updatedBlock));
            }
            if (updatedWeek) {
              setCurrentWeek(updatedWeek);
              localStorage.setItem(STORAGE_KEYS.WEEK, String(updatedWeek));
            }
            const [cwData, hwData] = await Promise.all([
              fetchAllClasswork(),
              fetchAllHomework(),
            ]);
            if (cwData && cwData.length > 0) {
              setClassworkList(cwData);
            }
            if (hwData && hwData.length > 0) {
              setHomeworkList(hwData);
            }
            notifyTomorrowNotesListeners();
            setToastMsg('تم تحديث الخطة الأسبوعية والحصص والواجبات بنجاح!');
            setTimeout(() => setToastMsg(null), 4000);
          } catch (err) {
            console.error('Failed to reload after plan update:', err);
          }
        }}
      />

      {/* Materials Modal */}
      <MaterialsModal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
        currentClass={currentClass}
        currentBlock={currentBlock}
        currentWeek={currentWeek}
      />

      {/* Supabase Cloud Connection & Persistent Credentials Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
        onSaved={async () => {
          setSupabaseStatus('connecting');
          try {
            const [cwData, hwData] = await Promise.all([
              fetchAllClasswork(),
              fetchAllHomework(),
            ]);
            if (cwData && cwData.length > 0) setClassworkList(cwData);
            if (hwData && hwData.length > 0) setHomeworkList(hwData);
            setSupabaseStatus('connected');
            showToast('تم حفظ إعدادات Supabase وتحديث البيانات بنجاح!');
          } catch {
            setSupabaseStatus('error');
          }
        }}
      />
    </div>
  );
}
