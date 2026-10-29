import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Shield,
  ArrowRight,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Printer,
  Calendar,
  Layers,
  X,
  Sparkles,
  BookOpen,
  ListChecks,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit2,
  Plus,
  Link2,
  ExternalLink,
  Globe,
  Database,
  RotateCcw,
} from 'lucide-react';
import { ClassId, MaterialItem, ClassworkEntry, HomeworkEntry } from '../types';
import { TomorrowSpecialNote } from '../data/defaultWeeklyPlan';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import {
  getAllMaterials,
  saveMaterial,
  deleteMaterial,
  subscribeToMaterials,
  formatBytes,
  openPdfItem,
  printPdfItem,
  downloadPdfItem,
} from '../utils/materialsStorage';
import {
  uploadPdfToSupabaseStorage,
  bulkInsertClasswork,
  bulkInsertHomework,
  getLocalCustomClasswork,
  getLocalCustomHomework,
  upsertClasswork,
  upsertHomework,
  deleteClasswork,
  deleteHomework,
  removeDeletedPlannerItemId,
} from '../lib/supabase';
import { saveTomorrowNotes, saveDeletedTomorrowNoteId, getSemanticKey, notifyTomorrowNotesListeners, removeDeletedTomorrowNoteId, WEEK3_SPECIAL_NOTES } from '../utils/tomorrowNotesStorage';
import { INITIAL_CLASSWORK, INITIAL_HOMEWORK, SPECIAL_TEACHER_NOTES } from '../data/defaultWeeklyPlan';
import { WEEK2_CLASSWORK, ALL_LINK_AND_WEEK2_HOMEWORK, WEEK2_SPECIAL_NOTES } from '../data/week2Plan';
import { fileToBase64, extractTextFromPdf } from '../utils/pdfExtractor';
import { fallbackClientParser, parseWeeklyPlanWithAI } from '../services/aiClassifier';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanUpdated?: (block?: number, week?: number) => void;
  isAdminEditMode: boolean;
  onToggleAdminEditMode: (enabled: boolean) => void;
  currentBlock?: number;
  currentWeek?: number;
  currentClass?: ClassId;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onPlanUpdated,
  isAdminEditMode,
  onToggleAdminEditMode,
  currentBlock = 1,
  currentWeek = 4,
  currentClass = 'ALL',
}) => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Materials Upload Form State
  const [materialUploadMode, setMaterialUploadMode] = useState<'pdf' | 'link'>('pdf');
  const [targetBlock, setTargetBlock] = useState<number>(currentBlock || 1);
  const [targetWeek, setTargetWeek] = useState<number>(currentWeek || 1);
  const [targetSection, setTargetSection] = useState<string>('Week 1');
  const [targetSubject, setTargetSubject] = useState<string>('English');
  const [targetClass, setTargetClass] = useState<ClassId | 'ALL'>('ALL');
  const [materialTitle, setMaterialTitle] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [materialLinkTitle, setMaterialLinkTitle] = useState<string>('');
  const [materialLinkUrl, setMaterialLinkUrl] = useState<string>('');

  // Weekly Plan Upload State (Set to true by default so all controls are immediately visible!)
  const [showPlanUploadForm, setShowPlanUploadForm] = useState(true);
  const [planBlock, setPlanBlock] = useState<number>(currentBlock || 1);
  const [planWeek, setPlanWeek] = useState<number>(currentWeek || 4);
  const [planClass, setPlanClass] = useState<ClassId | 'ALL'>('ALL');
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [planTextInput, setPlanTextInput] = useState<string>('');
  const [planInputMode, setPlanInputMode] = useState<'pdf' | 'text'>('pdf');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('replace');
  const [isParsingPlan, setIsParsingPlan] = useState(false);
  const [parsingStep, setParsingStep] = useState<string>('');
  const [parsedResult, setParsedResult] = useState<{
    classwork: ClassworkEntry[];
    homework: HomeworkEntry[];
    tomorrowNotes: TomorrowSpecialNote[];
  } | null>(null);
  const [isPublishingPlan, setIsPublishingPlan] = useState(false);
  const [previewTab, setPreviewTab] = useState<'classwork' | 'homework' | 'tomorrow'>('classwork');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Synchronize when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentBlock) setPlanBlock(currentBlock);
      if (currentWeek) setPlanWeek(currentWeek);
    }
  }, [isOpen, currentBlock, currentWeek]);

  // Editing state for parsed weekly plan before publishing
  const [editingItemType, setEditingItemType] = useState<'classwork' | 'homework' | 'tomorrow' | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);

  // Edit Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formPages, setFormPages] = useState('');
  const [formSubject, setFormSubject] = useState<string>('English');
  const [formClassId, setFormClassId] = useState<ClassId | 'ALL'>('G2B');
  const [formDay, setFormDay] = useState<string>('Sunday');
  const [formDueDay, setFormDueDay] = useState<string>('Monday');
  const [formPeriod, setFormPeriod] = useState<number>(1);
  const [formPriority, setFormPriority] = useState<'normal' | 'urgent'>('normal');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formLinkTitle, setFormLinkTitle] = useState('');
  const [formArabicNote, setFormArabicNote] = useState('');
  const [formBagItem, setFormBagItem] = useState('');
  const [formIsQuiz, setFormIsQuiz] = useState(false);
  const [formPdfUrl, setFormPdfUrl] = useState('');
  const [hwSelectedFile, setHwSelectedFile] = useState<File | null>(null);
  const [isUploadingHwPdf, setIsUploadingHwPdf] = useState(false);

  const openEditClasswork = (cw: ClassworkEntry, index: number) => {
    setEditingItemType('classwork');
    setEditingItemIndex(index);
    setIsAddingNewItem(false);
    setFormTitle(cw.title || '');
    setFormDetails(cw.details || '');
    setFormPages(cw.pages || '');
    setFormSubject(cw.subject || 'English');
    setFormClassId(cw.classId || 'G2B');
    setFormDay(cw.day || 'Sunday');
    setFormPeriod(cw.period || 1);
    setFormLinkUrl(cw.linkUrl || '');
    setFormLinkTitle(cw.linkTitle || '');
    setFormPdfUrl(cw.pdfUrl || '');
    setHwSelectedFile(null);
  };

  const openAddClasswork = () => {
    setEditingItemType('classwork');
    setEditingItemIndex(null);
    setIsAddingNewItem(true);
    setFormTitle('');
    setFormDetails('');
    setFormPages('');
    setFormSubject('English');
    setFormClassId(planClass === 'ALL' ? 'G2B' : planClass);
    setFormDay('Sunday');
    setFormPeriod(1);
    setFormLinkUrl('');
    setFormLinkTitle('');
    setFormPdfUrl('');
    setHwSelectedFile(null);
  };

  const openEditHomework = (hw: HomeworkEntry, index: number) => {
    setEditingItemType('homework');
    setEditingItemIndex(index);
    setIsAddingNewItem(false);
    setFormTitle(hw.task || '');
    setFormDetails(hw.details || '');
    setFormPages(hw.pages || '');
    setFormSubject(hw.subject || 'English');
    setFormClassId(hw.classId || 'G2B');
    setFormDay(hw.assignedDay || 'Sunday');
    setFormDueDay(hw.dueDay || 'Monday');
    setFormPriority(hw.priority || 'normal');
    setFormLinkUrl(hw.linkUrl || '');
    setFormPdfUrl(hw.pdfUrl || '');
    setHwSelectedFile(null);
  };

  const openAddHomework = () => {
    setEditingItemType('homework');
    setEditingItemIndex(null);
    setIsAddingNewItem(true);
    setFormTitle('');
    setFormDetails('');
    setFormPages('');
    setFormSubject('English');
    setFormClassId(planClass === 'ALL' ? 'G2B' : planClass);
    setFormDay('Sunday');
    setFormDueDay('Monday');
    setFormPriority('normal');
    setFormLinkUrl('');
    setFormPdfUrl('');
    setHwSelectedFile(null);
  };

  const openEditTomorrowNote = (note: TomorrowSpecialNote, index: number) => {
    setEditingItemType('tomorrow');
    setEditingItemIndex(index);
    setIsAddingNewItem(false);
    setFormTitle(note.note || '');
    setFormArabicNote(note.arabicNote || note.note || '');
    setFormSubject(note.subject || 'English');
    setFormClassId(note.classId || 'G2B');
    setFormDay(note.targetDay || 'Sunday');
    setFormBagItem(note.bagItem || '');
    setFormIsQuiz(Boolean(note.isQuiz || note.categoryType === 'quiz'));
    setFormLinkUrl(note.linkUrl || '');
    setFormLinkTitle(note.linkTitle || '');
    setFormPdfUrl(note.pdfUrl || '');
    setHwSelectedFile(null);
  };

  const openAddTomorrowNote = () => {
    setEditingItemType('tomorrow');
    setEditingItemIndex(null);
    setIsAddingNewItem(true);
    setFormTitle('');
    setFormArabicNote('');
    setFormSubject('English');
    setFormClassId(planClass === 'ALL' ? 'G2B' : planClass);
    setFormDay('Sunday');
    setFormBagItem('');
    setFormIsQuiz(false);
    setFormLinkUrl('');
    setFormLinkTitle('');
    setFormPdfUrl('');
    setHwSelectedFile(null);
  };

  const handleDeleteItem = async (type: 'classwork' | 'homework' | 'tomorrow', index: number) => {
    const currentParsed = parsedResult || { classwork: [], homework: [], tomorrowNotes: [] };
    if (type === 'classwork') {
      const item = currentParsed.classwork[index];
      if (item?.id) {
        await deleteClasswork(item.id);
        await fetch('/api/planner-data/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, type: 'classwork' }),
        }).catch(() => {});
      }
      setParsedResult({
        ...currentParsed,
        classwork: currentParsed.classwork.filter((_, i) => i !== index),
      });
      if (onPlanUpdated) await onPlanUpdated(planBlock, planWeek);
    } else if (type === 'homework') {
      const item = currentParsed.homework[index];
      if (item?.id) {
        await deleteHomework(item.id);
        await fetch('/api/planner-data/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, type: 'homework' }),
        }).catch(() => {});
      }
      setParsedResult({
        ...currentParsed,
        homework: currentParsed.homework.filter((_, i) => i !== index),
      });
      if (onPlanUpdated) await onPlanUpdated(planBlock, planWeek);
    } else if (type === 'tomorrow') {
      const item = currentParsed.tomorrowNotes[index];
      if (item) {
        const itemIds = [
          item.id,
          ...(item.linkedIds || []),
          getSemanticKey(item),
        ].filter(Boolean) as string[];

        for (const idToDelete of itemIds) {
          await saveDeletedTomorrowNoteId(idToDelete);
        }

        await fetch('/api/planner-data/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: itemIds, type: 'tomorrowNotes' }),
        }).catch(() => {});
      }
      setParsedResult({
        ...currentParsed,
        tomorrowNotes: currentParsed.tomorrowNotes.filter((_, i) => i !== index),
      });
      notifyTomorrowNotesListeners();
      if (onPlanUpdated) await onPlanUpdated(planBlock, planWeek);
    }
  };

  const handleSaveModalItem = async () => {
    if (!editingItemType) return;
    const currentParsed = parsedResult || { classwork: [], homework: [], tomorrowNotes: [] };

    let finalPdfUrl = formPdfUrl;

    if (hwSelectedFile) {
      try {
        setIsUploadingHwPdf(true);
        const cloudUrl = await uploadPdfToSupabaseStorage(hwSelectedFile, hwSelectedFile.name);
        if (cloudUrl) {
          finalPdfUrl = cloudUrl;
        } else {
          const readerPromise = new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.readAsDataURL(hwSelectedFile);
          });
          finalPdfUrl = await readerPromise;
        }
      } catch (uploadErr) {
        console.error('PDF upload error:', uploadErr);
        const readerPromise = new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(hwSelectedFile);
        });
        finalPdfUrl = await readerPromise;
      } finally {
        setIsUploadingHwPdf(false);
      }
    }

    if (editingItemType === 'classwork') {
      const entry: ClassworkEntry = {
        id: isAddingNewItem || editingItemIndex === null
          ? `cw-manual-${Date.now()}`
          : currentParsed.classwork[editingItemIndex]?.id || `cw-manual-${Date.now()}`,
        classId: formClassId as any,
        day: formDay as any,
        period: Number(formPeriod) || 1,
        subject: formSubject as any,
        title: formTitle.trim() || `${formSubject} Lesson`,
        details: formDetails.trim() || undefined,
        pages: formPages.trim() || undefined,
        completed: false,
        block: planBlock,
        week: planWeek,
        linkUrl: formLinkUrl.trim() || undefined,
        linkTitle: formLinkTitle.trim() || (formLinkUrl.trim() ? 'رابط الدرس 🔗' : undefined),
        pdfUrl: finalPdfUrl.trim() || undefined,
      };

      // Persist immediately to Supabase and local storage
      await upsertClasswork(entry);

      if (isAddingNewItem || editingItemIndex === null) {
        setParsedResult({
          ...currentParsed,
          classwork: [entry, ...currentParsed.classwork],
        });
      } else {
        setParsedResult({
          ...currentParsed,
          classwork: currentParsed.classwork.map((c, i) => (i === editingItemIndex ? entry : c)),
        });
      }
      if (onPlanUpdated) await onPlanUpdated(planBlock, planWeek);
    } else if (editingItemType === 'homework') {
      const entry: HomeworkEntry = {
        id: isAddingNewItem || editingItemIndex === null
          ? `hw-manual-${Date.now()}`
          : currentParsed.homework[editingItemIndex]?.id || `hw-manual-${Date.now()}`,
        classId: formClassId as any,
        assignedDay: formDay as any,
        dueDay: formDueDay as any,
        subject: formSubject as any,
        task: formTitle.trim() || 'Homework task',
        details: formDetails.trim() || undefined,
        pages: formPages.trim() || undefined,
        completed: false,
        priority: formPriority,
        block: planBlock,
        week: planWeek,
        linkUrl: formLinkUrl.trim() || undefined,
        isLinkTask: Boolean(formLinkUrl.trim()),
        pdfUrl: finalPdfUrl.trim() || undefined,
      };

      // Persist immediately to Supabase and local storage
      await upsertHomework(entry);

      if (isAddingNewItem || editingItemIndex === null) {
        setParsedResult({
          ...currentParsed,
          homework: [entry, ...currentParsed.homework],
        });
      } else {
        setParsedResult({
          ...currentParsed,
          homework: currentParsed.homework.map((h, i) => (i === editingItemIndex ? entry : h)),
        });
      }
      if (onPlanUpdated) await onPlanUpdated(planBlock, planWeek);
    } else if (editingItemType === 'tomorrow') {
      const entry: TomorrowSpecialNote = {
        id: isAddingNewItem || editingItemIndex === null
          ? `note-manual-${Date.now()}`
          : currentParsed.tomorrowNotes[editingItemIndex]?.id || `note-manual-${Date.now()}`,
        classId: formClassId as any,
        targetDay: formDay as any,
        subject: formSubject as any,
        note: formTitle.trim() || formArabicNote.trim() || 'School Note',
        arabicNote: formArabicNote.trim() || formTitle.trim() || 'ملاحظة مدرسية',
        bagItem: formBagItem.trim() || undefined,
        isQuiz: formIsQuiz,
        categoryType: formIsQuiz ? 'quiz' : 'note',
        isCustom: true,
        block: planBlock,
        week: planWeek,
        linkUrl: formLinkUrl.trim() || undefined,
        linkTitle: formLinkTitle.trim() || (formLinkUrl.trim() ? 'رابط مرفق 🔗' : undefined),
        pdfUrl: finalPdfUrl.trim() || undefined,
      };

      // Persist immediately to Supabase and local storage
      await saveTomorrowNotes(planBlock, planWeek, [entry], 'merge');
      notifyTomorrowNotesListeners();

      if (isAddingNewItem || editingItemIndex === null) {
        setParsedResult({
          ...currentParsed,
          tomorrowNotes: [entry, ...currentParsed.tomorrowNotes],
        });
      } else {
        setParsedResult({
          ...currentParsed,
          tomorrowNotes: currentParsed.tomorrowNotes.map((n, i) => (i === editingItemIndex ? entry : n)),
        });
      }
      if (onPlanUpdated) await onPlanUpdated(planBlock, planWeek);
    }

    setSuccessMessage('تم الحفظ والتثبيت بنجاح ✅');
    setTimeout(() => setSuccessMessage(null), 3000);

    setEditingItemType(null);
    setEditingItemIndex(null);
    setIsAddingNewItem(false);
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const planFileInputRef = useRef<HTMLInputElement>(null);

  const [deletedHistory, setDeletedHistory] = useState<any[]>([]);

  // Dynamically filtered items based on selected class filter (planClass)
  const displayClasswork = useMemo(() => {
    return (parsedResult?.classwork || []).filter(
      (c: any) => planClass === 'ALL' || (c.class_id || c.classId) === planClass
    );
  }, [parsedResult?.classwork, planClass]);

  const displayHomework = useMemo(() => {
    return (parsedResult?.homework || []).filter(
      (h: any) => planClass === 'ALL' || (h.class_id || h.classId) === planClass
    );
  }, [parsedResult?.homework, planClass]);

  const displayTomorrow = useMemo(() => {
    return (parsedResult?.tomorrowNotes || []).filter(
      (n: any) => planClass === 'ALL' || (n.class_id || n.classId) === planClass
    );
  }, [parsedResult?.tomorrowNotes, planClass]);

  // Load recently deleted history
  const fetchDeletedHistory = async () => {
    try {
      const res = await fetch('/api/planner-data');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.deletedHistory)) {
          // Sort with newest deletions first
          const sorted = [...data.deletedHistory].sort((a, b) => b.deletedAt - a.deletedAt);
          setDeletedHistory(sorted);
        } else {
          setDeletedHistory([]);
        }
      }
    } catch (err) {
      console.warn('Error fetching deleted history:', err);
    }
  };

  const formatElapsedTime = (deletedAt: number): string => {
    const elapsedMs = Date.now() - deletedAt;
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
    if (elapsedMinutes < 1) return 'أقل من دقيقة';
    if (elapsedMinutes === 1) return 'دقيقة واحدة';
    if (elapsedMinutes === 2) return 'دقيقتين';
    if (elapsedMinutes < 11) return `${elapsedMinutes} دقائق`;
    
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 1) return `${elapsedMinutes} دقيقة`;
    if (elapsedHours === 1) return 'ساعة واحدة';
    if (elapsedHours === 2) return 'ساعتين';
    if (elapsedHours < 11) return `${elapsedHours} ساعات`;
    return `${elapsedHours} ساعة`;
  };

  const handleRestoreItemFromHistory = async (id: string, type: 'classwork' | 'homework' | 'tomorrowNotes') => {
    try {
      setSuccessMessage('');
      setErrorMessage('');
      
      const res = await fetch('/api/planner-data/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      });
      
      if (res.ok) {
        // Clear client side deleted caches
        if (type === 'classwork' || type === 'homework') {
          await removeDeletedPlannerItemId(id);
        } else if (type === 'tomorrowNotes') {
          await removeDeletedTomorrowNoteId(id);
        }

        setSuccessMessage('تم التراجع واستعادة العنصر بنجاح لجميع الأجهزة والطلاب! 🔄');
        fetchDeletedHistory();
        if (onPlanUpdated) {
          onPlanUpdated();
        }
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || 'فشلت عملية استعادة العنصر');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء الاتصال بالخادم لاستعادة العنصر');
    }
  };

  // Load materials
  const refreshMaterials = async () => {
    const list = await getAllMaterials();
    // Sort latest first
    list.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    setMaterials(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshMaterials();
      fetchDeletedHistory();
    }
  }, [isOpen]);

  // When modal closes, reset parsed result if needed
  useEffect(() => {
    if (!isOpen) {
      setParsedResult(null);
      setPlanFile(null);
      setPlanTextInput('');
    }
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = subscribeToMaterials(() => {
      refreshMaterials();
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || lowerName.endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(lowerName);
    const isDoc = file.type.includes('word') || /\.(doc|docx)$/i.test(lowerName);

    if (!isPdf && !isImage && !isDoc) {
      setErrorMessage('عفواً، يرجى اختيار ملف بصيغة PDF أو صورة (JPG, PNG, WEBP) أو مستند Word.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  // Submit Upload (PDF, Image, Word or External Link)
    const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleConfirmUpload = async () => {
    if (materialUploadMode === "pdf") {
      if (!selectedFile) {
        setErrorMessage("يرجى اختيار ملف (PDF أو صورة JPG/PNG أو Word) أولاً.");
        return;
      }

      try {
        setIsUploading(true);
        setErrorMessage(null);

        // 1. Try uploading to Supabase Storage bucket first (with fast timeout)
        let cloudUrl: string | null = null;
        try {
          cloudUrl = await uploadPdfToSupabaseStorage(selectedFile, selectedFile.name);
        } catch (uploadErr) {
          console.warn("Direct bucket upload failed, using local/DB fallback:", uploadErr);
        }

        // 2. Read file binary as Base64 Data URL for server & local fallback
        let fileData = "";
        try {
          fileData = await readFileAsDataUrl(selectedFile);
        } catch (readErr) {
          setErrorMessage("تعذر قراءة الملف. يرجى التحقق من الملف والمحاولة مرة أخرى.");
          return;
        }

        let fileType: "pdf" | "image" | "doc" = "pdf";
        const lowerName = selectedFile.name.toLowerCase();
        if (/\.(jpg|jpeg|png|webp|gif)$/i.test(lowerName) || selectedFile.type.startsWith("image/")) {
          fileType = "image";
        } else if (/\.(doc|docx)$/i.test(lowerName) || selectedFile.type.includes("word")) {
          fileType = "doc";
        }

        const effectiveTitle = materialTitle.trim() || selectedFile.name;

        const newItem: MaterialItem = {
          id: "mat_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          fileName: effectiveTitle,
          fileSize: selectedFile.size,
          fileData: fileData,
          storageUrl: cloudUrl || undefined,
          type: fileType,
          block: targetBlock,
          week: targetWeek,
          section: targetSection,
          subject: targetSubject,
          classId: targetClass,
          uploadedAt: new Date().toISOString(),
        };

        await saveMaterial(newItem);
        await refreshMaterials();

        setSuccessMessage(
          cloudUrl
            ? `تم رفع الملف سحابياً بنجاح وتوفيره لجميع الأجهزة واللابتوب!`
            : `تم حفظ الملف بنجاح في Block ${targetBlock} — ${targetSection} (${targetSubject})!`
        );

        setSelectedFile(null);
        setMaterialTitle("");
        if (fileInputRef.current) fileInputRef.current.value = "";

        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      } catch (err) {
        console.error("Upload failed:", err);
        setErrorMessage("حدث خطأ أثناء حفظ الملف. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsUploading(false);
      }
    } else {
      // Link Upload Mode
      if (!materialLinkUrl.trim()) {
        setErrorMessage("يرجى إدخال رابط الويب (URL).");
        return;
      }
      const effectiveLinkTitle = materialLinkTitle.trim() || materialTitle.trim();
      if (!effectiveLinkTitle) {
        setErrorMessage("يرجى إدخال اسم أو عنوان الرابط / المادة.");
        return;
      }

      try {
        setIsUploading(true);
        setErrorMessage(null);

        let cleanUrl = materialLinkUrl.trim();
        if (!/^https?:\/\//i.test(cleanUrl)) {
          cleanUrl = "https://" + cleanUrl;
        }

        const newItem: MaterialItem = {
          id: "mat_link_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          fileName: effectiveLinkTitle,
          fileSize: 0,
          storageUrl: cleanUrl,
          linkUrl: cleanUrl,
          type: "link",
          block: targetBlock,
          week: targetWeek,
          section: targetSection,
          subject: targetSubject,
          classId: targetClass,
          uploadedAt: new Date().toISOString(),
        };

        await saveMaterial(newItem);
        await refreshMaterials();

        setSuccessMessage(
          `✨ تمت إضافة الرابط بنجاح في Block ${targetBlock} — ${targetSection} (${targetSubject})!`
        );

        setMaterialLinkTitle("");
        setMaterialTitle("");
        setMaterialLinkUrl("");

        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      } catch (err) {
        console.error("Link save failed:", err);
        setErrorMessage("حدث خطأ أثناء حفظ الرابط. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeleteMaterial = async (item: MaterialItem) => {
    if (window.confirm(`هل أنت تأكد من حذف "${item.fileName}"؟`)) {
      try {
        await deleteMaterial(item.id);
        await refreshMaterials();
        setSuccessMessage("تم حذف المادة بنجاح.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error("Error deleting material:", err);
        setErrorMessage("حدث خطأ أثناء حذف المادة.");
      }
    }
  };

  const handlePreviewMaterial = (item: MaterialItem) => {
    if (item.type === "link") {
      window.open(item.linkUrl || item.storageUrl, "_blank", "noopener,noreferrer");
    } else {
      openPdfItem(item);
    }
  };

  const handlePrintMaterial = (item: MaterialItem) => {
    printPdfItem(item);
  };

  const handleDownloadMaterial = (item: MaterialItem) => {
    downloadPdfItem(item);
  };

  const handleParsePlan = async () => {
    setIsParsingPlan(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      let rawText = planTextInput;
      if (planInputMode === "pdf" && planFile) {
        setParsingStep("جاري قراءة واستخراج النصوص من ملف PDF...");
        rawText = await extractTextFromPdf(planFile);
      }

      if (!rawText || !rawText.trim()) {
        setErrorMessage("عفواً، يرجى اختيار ملف PDF يحتوي على نصوص أو إدخال نص الخطة.");
        setIsParsingPlan(false);
        return;
      }

      setParsingStep("جاري تحليل وتفكيك الخطة الذكية بواسطة الذكاء الاصطناعي...");
      let parsed = await parseWeeklyPlanWithAI(rawText, planBlock, planWeek, planClass);

      if (!parsed || (!parsed.classwork?.length && !parsed.homework?.length && !parsed.tomorrowNotes?.length)) {
        setParsingStep("جاري التفكيك التلقائي الاحتياطي...");
        parsed = fallbackClientParser(rawText, planBlock, planWeek, planClass);
      }

      setParsedResult(parsed);
      setSuccessMessage("تم تفكيك الخطة بنجاح! يمكنك الآن مراجعتها وتعديلها أو اعتمادها مباشرةً.");
    } catch (err: any) {
      console.error("Error parsing plan:", err);
      setErrorMessage("حدث خطأ أثناء تفكيك الخطة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsParsingPlan(false);
      setParsingStep("");
    }
  };

  const handlePublishPlan = async () => {
    if (!parsedResult) return;
    setIsPublishingPlan(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      if (parsedResult.classwork?.length) {
        await bulkInsertClasswork(parsedResult.classwork, importMode);
      }
      if (parsedResult.homework?.length) {
        await bulkInsertHomework(parsedResult.homework, importMode);
      }
      if (parsedResult.tomorrowNotes?.length) {
        await saveTomorrowNotes(planBlock, planWeek, parsedResult.tomorrowNotes, importMode);
        notifyTomorrowNotesListeners();
      }

      setSuccessMessage("🎉 تم اعتماد ونشر الخطة الأسبوعية بنجاح لجميع الفصول والأجهزة!");
      if (onPlanUpdated) {
        await onPlanUpdated(planBlock, planWeek);
      }
    } catch (err: any) {
      console.error("Error publishing plan:", err);
      setErrorMessage("حدث خطأ أثناء نشر الخطة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsPublishingPlan(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                لوحة التحكم بالأدمين والمواد الخطة الأسبوعية
              </h2>
              <p className="text-xs text-indigo-200/80 font-medium">
                إدارة الخطة، رفع المواد، المعاينة والتحكم الشامل
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-right" dir="rtl">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mode Switch Bar */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-800">وضع التعديل السريع في الصفحة:</span>
              <button
                type="button"
                onClick={() => onToggleAdminEditMode(!isAdminEditMode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  isAdminEditMode
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {isAdminEditMode ? "وضع التعديل مفعل ✏️" : "تفعيل التعديل السريع 🔒"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSupabaseModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>إعدادات السحابة (Supabase)</span>
            </button>
          </div>

          {/* Section 1: Upload Materials */}
          <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">إضافة مادة تعليمية جديدة (PDF أو رابط)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMaterialUploadMode("pdf")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    materialUploadMode === "pdf"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  ملف PDF / مستند
                </button>
                <button
                  type="button"
                  onClick={() => setMaterialUploadMode("link")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    materialUploadMode === "link"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  رابط إلكتروني 🔗
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">اختر البلوك (Block)</label>
                <select
                  value={targetBlock}
                  onChange={(e) => setTargetBlock(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>Block 1</option>
                  <option value={2}>Block 2</option>
                  <option value={3}>Block 3</option>
                  <option value={4}>Block 4</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">اختر الأسبوع / القسم (Week)</label>
                <select
                  value={targetSection}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTargetSection(val);
                    if (val.startsWith("Week ")) {
                      setTargetWeek(Number(val.replace("Week ", "")));
                    } else if (val === "Main sheet") {
                      setTargetWeek(1);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Week 1">Week 1 (الأسبوع الأول)</option>
                  <option value="Week 2">Week 2 (الأسبوع الثاني)</option>
                  <option value="Week 3">Week 3 (الأسبوع الثالث)</option>
                  <option value="Week 4">Week 4 (الأسبوع الرابع)</option>
                  <option value="Week 5">Week 5 (الأسبوع الخامس)</option>
                  <option value="Main sheet">Main Sheet (المخطط الرئيسي)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">اختر المادة (Subject)</label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="English">English (لغة إنجليزية)</option>
                  <option value="Mathematics">Mathematics (رياضيات / ماس)</option>
                  <option value="Science">Science (علوم / ساينس)</option>
                  <option value="Social Studies">Social Studies (دراسات)</option>
                  <option value="French">French (لغة فرنسية)</option>
                  <option value="ICT">ICT (تكنولوجيا المعلومات)</option>
                  <option value="Arabic">Arabic (لغة عربية)</option>
                  <option value="Religion">Religion (تربية دينية)</option>
                  <option value="German">German (لغة ألمانية)</option>
                  <option value="Arts">Arts (تربية فنية)</option>
                  <option value="Music">Music (تربية موسيقية)</option>
                  <option value="PE">PE (تربية رياضية)</option>
                  <option value="Leadership">Leadership (القيادة)</option>
                  <option value="Main sheet">Main Sheet (عام)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">الفصل الموجه (Class)</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">جميع الفصول (G2A, G2B, G2C)</option>
                  <option value="G2A">G2A فقط</option>
                  <option value="G2B">G2B فقط</option>
                  <option value="G2C">G2C فقط</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  اسم المادة / عنوان الملف أو الرابط (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: شيت مراجعة الماس الخارجية - Block 2 Week 3"
                  value={materialTitle}
                  onChange={(e) => {
                    setMaterialTitle(e.target.value);
                    setMaterialLinkTitle(e.target.value);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {materialUploadMode === "pdf" ? (
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">اختر الملف المراد رفعه (PDF / صورة / Word)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-600 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">رابط الويب أو الفيديو (URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={materialLinkUrl}
                    onChange={(e) => setMaterialLinkUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    dir="ltr"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isUploading}
              onClick={handleConfirmUpload}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ والرفع...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>حفظ المادة المرفوعة وتوزيعها 🚀</span>
                </>
              )}
            </button>
          </div>

          {/* Section 2: Deleted Items History (24 Hours) */}
          <div className="p-4 sm:p-5 bg-rose-50/60 border border-rose-200/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-700" />
                <h3 className="text-sm font-black text-rose-950">سلة محذوفات التراجع (24 ساعة) 🗑️</h3>
              </div>
              <button
                type="button"
                onClick={fetchDeletedHistory}
                className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                title="تحديث القائمة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {deletedHistory.length === 0 ? (
              <div className="py-6 px-4 bg-white/50 rounded-xl border border-dashed border-rose-200 text-center space-y-1">
                <Trash2 className="w-6 h-6 text-rose-300 mx-auto opacity-60" />
                <p className="text-xs text-rose-900 font-bold">سلة المحذوفات فارغة حالياً.</p>
                <p className="text-[10px] text-rose-700/70 font-medium">
                  أي درس أو واجب أو تنبيه تقوم بحذفه سيظهر هنا لمدة 24 ساعة لتتمكن من استعادته في أي وقت.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 select-none">
                {deletedHistory.map((item) => {
                  const { id, type, deletedAt, itemData } = item;
                  if (!itemData) return null;
                  const elapsedText = formatElapsedTime(deletedAt);
                  let typeLabel = "";
                  let detailsText = "";
                  let badgeStyle = "";

                  if (type === "classwork") {
                    typeLabel = "حصة صفية 📘";
                    detailsText = `${itemData.subject || ""} • Block ${itemData.block || ""} • Week ${itemData.week || ""} • ${itemData.classId || itemData.class_id || ""} • ${itemData.day || ""}`;
                    badgeStyle = "bg-blue-50 text-blue-800 border-blue-200";
                  } else if (type === "homework") {
                    typeLabel = "واجب منزلي 📝";
                    detailsText = `${itemData.subject || ""} • Block ${itemData.block || ""} • Week ${itemData.week || ""} • ${itemData.classId || itemData.class_id || ""} • ${itemData.assignedDay || ""}`;
                    badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
                  } else if (type === "tomorrowNotes") {
                    typeLabel = "تنبيه الغد 🎒";
                    detailsText = `${itemData.subject || ""} • Block ${itemData.block || ""} • Week ${itemData.week || ""} • ${itemData.classId || itemData.class_id || ""} • ${itemData.targetDay || ""}`;
                    badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  }

                  const title = itemData.title || itemData.task || itemData.arabicNote || itemData.note || "عنصر بدون عنوان";

                  return (
                    <div
                      key={id}
                      className="p-3 bg-white border border-rose-100 rounded-xl hover:border-rose-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${badgeStyle} shrink-0 mt-0.5`}>
                          {typeLabel}
                        </span>
                        <div className="min-w-0 text-right">
                          <p className="text-slate-900 font-black truncate text-xs">{title}</p>
                          <p className="text-slate-500 font-semibold text-[11px] mt-0.5 leading-tight">{detailsText}</p>
                          <p className="text-rose-600 text-[10px] font-bold mt-1 inline-flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded-md">
                            <span>🗑️</span>
                            <span>حُذف منذ {elapsedText}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRestoreItemFromHistory(id, type)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs hover:shadow-sm cursor-pointer transition-all self-end sm:self-auto shrink-0 flex items-center gap-1.5 active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>استعادة والتراجع 🔄</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Existing Materials List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-black text-slate-900">
                  المحتويات المرفوعة حالياً في Materials ({materials.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                يمكنك المعاينة أو الفتح أو الطباعة أو المسح
              </span>
            </div>

            {materials.length === 0 ? (
              <div className="py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-bold">لا توجد ملفات أو روابط مرفوعة حتى الآن.</p>
                <p className="text-[11px] text-slate-400 font-medium">
                  اضغط على زر "إضافة مادة تعليمية جديدة" بالأعلى لرفع وتوزيع المواد.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {materials.map((item) => {
                  const isLink = item.type === "link";
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                            isLink
                              ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                              : "bg-rose-50 border-rose-200 text-rose-600"
                          }`}
                        >
                          {isLink ? <Link2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-slate-900 truncate">{item.fileName}</span>
                            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                              Block {item.block}
                            </span>
                            <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md">
                              {item.section}
                            </span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md">
                              {item.classId === "ALL" ? "كل الفصول" : item.classId}
                            </span>
                            {isLink ? (
                              <span className="text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200 px-1.5 py-0.5 rounded-md">
                                رابط إلكتروني 🔗
                              </span>
                            ) : (
                              item.storageUrl && (
                                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded-md">
                                  سحابي ☁️
                                </span>
                              )
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mt-1">
                            {isLink ? (
                              <span className="truncate max-w-[220px] text-indigo-600 font-mono" dir="ltr">
                                {item.linkUrl || item.storageUrl}
                              </span>
                            ) : (
                              <span>الحجم: {formatBytes(item.fileSize)}</span>
                            )}
                            <span>•</span>
                            <span>
                              {new Date(item.uploadedAt).toLocaleDateString("ar-EG", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          id={`admin-preview-${item.id}-btn`}
                          onClick={() => handlePreviewMaterial(item)}
                          className="p-2 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                          title={isLink ? "فتح الرابط في صفحة جديدة" : "معاينة الملف"}
                        >
                          {isLink ? <Link2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        {!isLink && (
                          <button
                            type="button"
                            id={`admin-print-${item.id}-btn`}
                            onClick={() => handlePrintMaterial(item)}
                            className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                            title="طباعة الملف"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isLink && (
                          <button
                            type="button"
                            id={`admin-download-${item.id}-btn`}
                            onClick={() => handleDownloadMaterial(item)}
                            className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                            title="تحميل الملف"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          id={`admin-delete-${item.id}-btn`}
                          onClick={() => handleDeleteMaterial(item)}
                          className="p-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          title="مسح وحذف نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSaved={() => {
          setSuccessMessage("تم حفظ إعدادات ومفاتيح Supabase وتحديث الاتصال بنجاح!");
        }}
      />
    </div>
  );
};


