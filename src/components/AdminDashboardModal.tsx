import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { ClassId, MaterialItem, ClassworkEntry, HomeworkEntry } from '../types';
import { TomorrowSpecialNote } from '../data/defaultWeeklyPlan';
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
import { uploadPdfToSupabaseStorage, bulkInsertClasswork, bulkInsertHomework } from '../lib/supabase';
import { saveTomorrowNotes } from '../utils/tomorrowNotesStorage';
import { fileToBase64, extractTextFromPdf } from '../utils/pdfExtractor';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanUpdated?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onPlanUpdated,
}) => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Materials Upload Form State
  const [targetBlock, setTargetBlock] = useState<number>(1);
  const [targetSection, setTargetSection] = useState<string>('Main sheet');
  const [targetClass, setTargetClass] = useState<ClassId | 'ALL'>('ALL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Weekly Plan Upload State
  const [showPlanUploadForm, setShowPlanUploadForm] = useState(false);
  const [planBlock, setPlanBlock] = useState<number>(1);
  const [planWeek, setPlanWeek] = useState<number>(2);
  const [planClass, setPlanClass] = useState<ClassId | 'ALL'>('ALL');
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [isParsingPlan, setIsParsingPlan] = useState(false);
  const [parsingStep, setParsingStep] = useState<string>('');
  const [parsedResult, setParsedResult] = useState<{
    classwork: ClassworkEntry[];
    homework: HomeworkEntry[];
    tomorrowNotes: TomorrowSpecialNote[];
  } | null>(null);
  const [isPublishingPlan, setIsPublishingPlan] = useState(false);
  const [previewTab, setPreviewTab] = useState<'classwork' | 'homework' | 'tomorrow'>('classwork');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const planFileInputRef = useRef<HTMLInputElement>(null);

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

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('عفواً، الملف المحدد ليس بصيغة PDF. يرجى اختيار ملف PDF فقط.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  // Submit Upload
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('يرجى اختيار ملف PDF أولاً.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);

      // 1. Try uploading to Supabase Storage bucket first
      let cloudUrl: string | null = null;
      try {
        cloudUrl = await uploadPdfToSupabaseStorage(selectedFile, selectedFile.name);
      } catch (uploadErr) {
        console.warn('Direct bucket upload failed, using local/DB fallback:', uploadErr);
      }

      // 2. Read file binary as Base64 Data URL for local offline cache and fallback
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileData = reader.result as string;

          const newItem: MaterialItem = {
            id: 'mat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileData: fileData,
            storageUrl: cloudUrl || undefined,
            block: targetBlock,
            section: targetSection,
            classId: targetClass,
            uploadedAt: new Date().toISOString(),
          };

          await saveMaterial(newItem);
          await refreshMaterials();

          setSuccessMessage(
            cloudUrl
              ? `تم رفع الملف سحابياً بنجاح وتوفيره لجميع الأجهزة واللابتوب!`
              : `تم حفظ الملف بنجاح في Block ${targetBlock} — ${targetSection}!`
          );
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setIsUploading(false);

          // Auto clear success message after 4s
          setTimeout(() => {
            setSuccessMessage(null);
          }, 4000);
        } catch (saveErr) {
          console.error(saveErr);
          setErrorMessage('حدث خطأ أثناء حفظ الملف. يرجى المحاولة مرة أخرى.');
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setErrorMessage('تعذر قراءة ملف الـ PDF. يرجى التحقق من الملف.');
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ غير متوقع أثناء الرفع.');
      setIsUploading(false);
    }
  };

  // Handle Delete with Confirmation
  const handleDelete = async (item: MaterialItem) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من مسح ملف "${item.fileName}" نهائياً من Block ${item.block} (${item.section})؟`
    );
    if (!confirmed) return;

    try {
      await deleteMaterial(item.id, item.storageUrl);
      await refreshMaterials();
      setSuccessMessage(`تم مسح الملف "${item.fileName}" بنجاح.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage('فشل مسح الملف.');
    }
  };

  // Helper to open PDF directly in new tab
  const handlePreview = (item: MaterialItem) => {
    openPdfItem(item);
  };

  // Print helper
  const handlePrint = (item: MaterialItem) => {
    printPdfItem(item);
  };

  // Download helper
  const handleDownload = (item: MaterialItem) => {
    downloadPdfItem(item);
  };

  // Plan File Change Handler
  const handlePlanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('عفواً، ملف الخطة الأسبوعية يجب أن يكون بصيغة PDF.');
      setPlanFile(null);
      if (planFileInputRef.current) planFileInputRef.current.value = '';
      return;
    }

    setPlanFile(file);
    setParsedResult(null);
  };

  // AI Parse Weekly Plan Handler
  const handleParseWeeklyPlan = async () => {
    if (!planFile) {
      setErrorMessage('يرجى اختيار ملف PDF الخاص بالخطة الأسبوعية أولاً.');
      return;
    }

    try {
      setIsParsingPlan(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setParsingStep('جاري قراءة ملف الـ PDF...');

      const base64 = await fileToBase64(planFile);

      setParsingStep('جاري استخراج النصوص من صفحات الـ PDF...');
      const extractedText = await extractTextFromPdf(planFile);

      setParsingStep('الذكاء الاصطناعي يحلل الجدول وحصص الفصل وواجبات الحصة الثالثة...');
      const response = await fetch('/api/parse-weekly-plan-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: base64,
          planText: extractedText,
          block: planBlock,
          week: planWeek,
          targetClass: planClass,
        }),
      });

      if (!response.ok) {
        throw new Error(`خطأ في استجابة الخادم (${response.status})`);
      }

      const data = await response.json();
      const cw = data.classwork || [];
      const hw = data.homework || [];
      const notes = data.tomorrowNotes || [];

      setParsedResult({
        classwork: cw,
        homework: hw,
        tomorrowNotes: notes,
      });

      setSuccessMessage(
        `✨ تم تفكيك الخطة بنجاح! تم استخراج ${cw.length} حصة صفية، ${hw.length} واجب مدرسي، و ${notes.length} ملاحظة للغد وحقيبة المدرسة.`
      );
    } catch (err: any) {
      console.error('Error parsing weekly plan:', err);
      setErrorMessage(`تعذر تحليل ملف الـ PDF: ${err.message || 'حدث خطأ أثناء المعالجة'}`);
    } finally {
      setIsParsingPlan(false);
      setParsingStep('');
    }
  };

  // Publish Parsed Plan to Supabase & Storage
  const handlePublishPlan = async () => {
    if (!parsedResult) return;

    try {
      setIsPublishingPlan(true);
      setErrorMessage(null);

      // 1. Bulk insert classwork
      if (parsedResult.classwork.length > 0) {
        await bulkInsertClasswork(parsedResult.classwork);
      }

      // 2. Bulk insert homework
      if (parsedResult.homework.length > 0) {
        await bulkInsertHomework(parsedResult.homework);
      }

      // 3. Save tomorrow notes
      if (parsedResult.tomorrowNotes.length > 0) {
        await saveTomorrowNotes(planBlock, planWeek, parsedResult.tomorrowNotes);
      }

      setSuccessMessage(
        `🎉 تم بنجاح اعتماد ونشر الخطة الأسبوعية (Block ${planBlock} — Week ${planWeek}) في قاعدة البيانات وتحديث التطبيق فوراً لجميع الطلاب!`
      );
      setParsedResult(null);
      setPlanFile(null);
      if (planFileInputRef.current) planFileInputRef.current.value = '';

      if (onPlanUpdated) {
        onPlanUpdated();
      }
    } catch (err: any) {
      console.error('Error publishing plan:', err);
      setErrorMessage(`تعذر حفظ الخطة في قاعدة البيانات: ${err.message || err}`);
    } finally {
      setIsPublishingPlan(false);
    }
  };

  const blocks = [1, 2, 3, 4];
  const planWeeks = [1, 2, 3, 4];
  const sections = ['Main sheet', 'Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <div
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full p-5 sm:p-7 relative max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xs">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  لوحة الأدمن — إدارة الخطة الأسبوعية والمواد
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-semibold">
                  رفع ومعالجة الـ Weekly Plan ذكياً + تحميل وتوزيع ملفات وملازم الـ Materials
                </p>
              </div>
            </div>
            <button
              id="admin-dashboard-close-btn"
              onClick={onClose}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span>خروج</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-4 overflow-y-auto flex-1 space-y-5">
            {/* Success & Error alerts */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* NEW: Primary Weekly Plan Upload & AI Parser Card */}
            <div className="bg-linear-to-br from-indigo-50/90 via-purple-50/40 to-white border border-indigo-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-indigo-950">
                        زر رفع ومعالجة الـ Weekly Plan ذكياً
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
                        تفكيك ذكي AI
                      </span>
                    </div>
                    <p className="text-xs text-indigo-900/70 font-medium">
                      ارفع ملف PDF للخطة الأسبوعية لتفكيك الحصص وجدولة الواجبات (حصة 3 للفرنساوي و ICT) واستخراج ملاحظات الغد
                    </p>
                  </div>
                </div>

                <button
                  id="toggle-plan-upload-form-btn"
                  type="button"
                  onClick={() => setShowPlanUploadForm(!showPlanUploadForm)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5 ${
                    showPlanUploadForm
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{showPlanUploadForm ? 'إخفاء نموذج الخطة' : 'رفع Weekly Plan جديد (PDF)'}</span>
                </button>
              </div>

              {/* Weekly Plan Upload Form (when opened) */}
              {showPlanUploadForm && (
                <div className="pt-3 border-t border-indigo-200/80 space-y-4 animate-in fade-in duration-200">
                  {/* Step 1: Select Block */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      1. اختر البلوك المستهدف (Target Block):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {blocks.map((b) => (
                        <button
                          key={b}
                          type="button"
                          id={`admin-plan-block-${b}-btn`}
                          onClick={() => setPlanBlock(b)}
                          className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            planBlock === b
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50/50'
                          }`}
                        >
                          Block {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Week */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      2. اختر الأسبوع (Target Week):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {planWeeks.map((w) => (
                        <button
                          key={w}
                          type="button"
                          id={`admin-plan-week-${w}-btn`}
                          onClick={() => setPlanWeek(w)}
                          className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            planWeek === w
                              ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50/50'
                          }`}
                        >
                          Week {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Target Class */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      3. تحديد الفصل (المستهدفين بتوزيع الجدول):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'ALL', label: 'كل الفصول (G2A, G2B, G2C)' },
                        { id: 'G2A', label: 'فصل G2A' },
                        { id: 'G2B', label: 'فصل G2B' },
                        { id: 'G2C', label: 'فصل G2C' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          id={`admin-plan-class-${c.id}-btn`}
                          onClick={() => setPlanClass(c.id as ClassId | 'ALL')}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            planClass === c.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Choose Plan PDF */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      4. اختيار ملف الـ PDF الخاص بالخطة الأسبوعية (Weekly Plan):
                    </label>
                    <input
                      ref={planFileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePlanFileChange}
                      className="block w-full text-xs text-slate-500 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs"
                    />

                    {planFile && (
                      <div className="mt-2 p-2.5 bg-white rounded-xl border border-indigo-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-800 font-bold truncate">
                          <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="truncate">{planFile.name}</span>
                          <span className="text-slate-400 font-medium">
                            ({formatBytes(planFile.size)})
                          </span>
                        </div>
                        <span className="text-indigo-700 font-black bg-indigo-50 px-2 py-0.5 rounded-lg shrink-0">
                          جاهز للتحليل والتفكيك
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Parse Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      id="admin-parse-plan-btn"
                      type="button"
                      disabled={!planFile || isParsingPlan}
                      onClick={handleParseWeeklyPlan}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                    >
                      {isParsingPlan ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{parsingStep || 'جاري تفكيك الخطة وقراءتها...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>قراءة وتفكيك الخطة ذكياً بالـ AI</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-slate-500">
                      * يوزع الحصص بالجدول تلقائياً، ويخصص واجب الفرنساوي والـ ICT بالحصة الثالثة، ويجهز ملاحظات الغد.
                    </p>
                  </div>

                  {/* Parsed Result Preview Box */}
                  {parsedResult && (
                    <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-indigo-200/90 shadow-sm space-y-4 animate-in fade-in duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <h4 className="text-sm font-black text-slate-900">
                              تم تفكيك الخطة بنجاح! جاهزة للاعتماد والحفظ
                            </h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            تمت مواءمة الحصص مع جدول الفصول، وتعيين واجبات الفرنساوي والـ ICT في الحصة الثالثة.
                          </p>
                        </div>

                        {/* Summary Badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            📘 {parsedResult.classwork.length} حصة
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-100">
                            📝 {parsedResult.homework.length} واجب
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                            🎒 {parsedResult.tomorrowNotes.length} ملاحظة غد
                          </span>
                        </div>
                      </div>

                      {/* Preview Tabs */}
                      <div className="flex border-b border-slate-100 gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewTab('classwork')}
                          className={`pb-2 px-3 text-xs font-black border-b-2 transition-colors cursor-pointer ${
                            previewTab === 'classwork'
                              ? 'border-indigo-600 text-indigo-600'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          الحصص الصفية (Classwork) ({parsedResult.classwork.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab('homework')}
                          className={`pb-2 px-3 text-xs font-black border-b-2 transition-colors cursor-pointer ${
                            previewTab === 'homework'
                              ? 'border-indigo-600 text-indigo-600'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          الواجبات المنزلية (Homework) ({parsedResult.homework.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab('tomorrow')}
                          className={`pb-2 px-3 text-xs font-black border-b-2 transition-colors cursor-pointer ${
                            previewTab === 'tomorrow'
                              ? 'border-indigo-600 text-indigo-600'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          ملاحظات الغد والحقيبة (Tomorrow Notes) ({parsedResult.tomorrowNotes.length})
                        </button>
                      </div>

                      {/* Preview Tab Content */}
                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
                        {previewTab === 'classwork' && (
                          <div className="space-y-1.5">
                            {parsedResult.classwork.slice(0, 15).map((cw, idx) => (
                              <div
                                key={cw.id || idx}
                                className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-black text-[11px] flex items-center justify-center shrink-0">
                                    ح{cw.period}
                                  </span>
                                  <span className="font-bold text-slate-900">{cw.subject}</span>
                                  <span className="text-slate-500 text-[11px]">({cw.day} - {cw.classId})</span>
                                </div>
                                <span className="text-slate-600 truncate max-w-[200px] text-left" dir="ltr">
                                  {cw.lesson || cw.details}
                                </span>
                              </div>
                            ))}
                            {parsedResult.classwork.length > 15 && (
                              <p className="text-center text-slate-400 text-[11px] py-1">
                                + {parsedResult.classwork.length - 15} حصة إضافية سيتم حفظها...
                              </p>
                            )}
                          </div>
                        )}

                        {previewTab === 'homework' && (
                          <div className="space-y-1.5">
                            {parsedResult.homework.map((hw, idx) => (
                              <div
                                key={hw.id || idx}
                                className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                                    {hw.subject}
                                  </span>
                                  <span className="text-slate-500 text-[11px]">({hw.assignedDay} - {hw.classId})</span>
                                  {(hw.subject.toLowerCase().includes('french') ||
                                    hw.subject.toLowerCase().includes('ict') ||
                                    hw.subject.includes('فرنساوي') ||
                                    hw.subject.includes('حاسب')) && (
                                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-black">
                                      مجدول بالحصة 3 ✅
                                    </span>
                                  )}
                                </div>
                                <span className="text-slate-700 font-medium truncate max-w-[250px]">
                                  {hw.task} {hw.pages && `(${hw.pages})`}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {previewTab === 'tomorrow' && (
                          <div className="space-y-1.5">
                            {parsedResult.tomorrowNotes.map((note, idx) => (
                              <div
                                key={note.id || idx}
                                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-black text-indigo-900 text-xs">
                                    يوم {note.day}: {note.title}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                                    {note.category}
                                  </span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed">{note.content}</p>
                                {note.items && note.items.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {note.items.map((it, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-medium"
                                      >
                                        🎒 {it}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Publish and Cancel Buttons */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 border-t border-slate-100">
                        <button
                          id="admin-publish-plan-btn"
                          type="button"
                          disabled={isPublishingPlan}
                          onClick={handlePublishPlan}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                        >
                          {isPublishingPlan ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>جاري الاعتماد والحفظ في قاعدة البيانات...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>اعتماد ونشر الخطة في التطبيق وقاعدة البيانات</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setParsedResult(null)}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer text-center"
                        >
                          إلغاء أو إعادة المحاولة
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Top Action Card: Primary Upload Button */}
            <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-amber-950">
                      زر تحميل وتوزيع الـ PDF على الـ Materials
                    </h3>
                    <p className="text-xs text-amber-800/80 font-medium">
                      اختر الـ Block والقسم لتحميل ملف الـ PDF بنفس ألوانه وتنسيقه الأصلي
                    </p>
                  </div>
                </div>

                <button
                  id="toggle-upload-form-btn"
                  type="button"
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5 ${
                    showUploadForm
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{showUploadForm ? 'إخفاء نموذج التحميل' : 'تحميل ملف PDF جديد'}</span>
                </button>
              </div>

              {/* Upload Form Box (when opened) */}
              {showUploadForm && (
                <div className="pt-3 border-t border-amber-200/80 space-y-4 animate-in fade-in duration-200">
                  {/* Step 1: Select Block */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      1. أنت عايز تحمل في أي بلوك؟ (اختر الـ Block):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {blocks.map((b) => (
                        <button
                          key={b}
                          type="button"
                          id={`admin-select-block-${b}-btn`}
                          onClick={() => setTargetBlock(b)}
                          className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            targetBlock === b
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/50'
                          }`}
                        >
                          Block {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Section */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      2. عايز تحمل في الـ Main Sheet ولا في ويك معين؟:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {sections.map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          id={`admin-select-sec-${sec.replace(/\s+/g, '-')}-btn`}
                          onClick={() => setTargetSection(sec)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                            targetSection === sec
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50/50'
                          }`}
                        >
                          {sec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Select Target Class */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      3. تحديد الفصل (المستفيدين):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'ALL', label: 'كل الفصول (All Classes)' },
                        { id: 'G2A', label: 'فصل G2A' },
                        { id: 'G2B', label: 'فصل G2B' },
                        { id: 'G2C', label: 'فصل G2C' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          id={`admin-select-class-${c.id}-btn`}
                          onClick={() => setTargetClass(c.id as ClassId | 'ALL')}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            targetClass === c.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Choose PDF file */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1.5">
                      4. اختيار ملف الـ PDF المطلوب رفعه:
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="block w-full text-xs text-slate-500 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-600 file:text-white hover:file:bg-amber-700 file:cursor-pointer bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs"
                      />
                    </div>
                    {selectedFile && (
                      <div className="mt-2 p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-800 font-bold truncate">
                          <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="truncate">{selectedFile.name}</span>
                          <span className="text-slate-400 font-medium">
                            ({formatBytes(selectedFile.size)})
                          </span>
                        </div>
                        <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0">
                          جاهز للرفع
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload Confirm Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      id="admin-submit-upload-btn"
                      type="button"
                      disabled={!selectedFile || isUploading}
                      onClick={handleConfirmUpload}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                        !selectedFile || isUploading
                          ? 'bg-slate-300 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {isUploading
                          ? 'جاري حفظ ورفع الملف...'
                          : `تأكيد الرفع في Block ${targetBlock} (${targetSection})`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List of Uploaded Materials with Delete Button */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-black text-slate-900">
                    الملفات المرفوعة حالياً في Materials ({materials.length})
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  يمكنك المعاينة أو الطباعة أو المسح
                </span>
              </div>

              {materials.length === 0 ? (
                <div className="py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-bold">
                    لا توجد ملفات مرفوعة حتى الآن.
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    اضغط على زر "تحميل ملف PDF جديد" بالأعلى لرفع وتوزيع الملفات.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {materials.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all"
                    >
                      {/* Left: Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-slate-900 truncate">
                              {item.fileName}
                            </span>
                            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                              Block {item.block}
                            </span>
                            <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md">
                              {item.section}
                            </span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md">
                              {item.classId === 'ALL' ? 'كل الفصول' : item.classId}
                            </span>
                            {item.storageUrl && (
                              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded-md">
                                سحابي ☁️
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mt-1">
                            <span>الحجم: {formatBytes(item.fileSize)}</span>
                            <span>•</span>
                            <span>
                              {new Date(item.uploadedAt).toLocaleDateString('ar-EG', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions (Preview, Print, Download, Delete) */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {/* Preview */}
                        <button
                          type="button"
                          id={`admin-preview-${item.id}-btn`}
                          onClick={() => handlePreview(item)}
                          className="p-2 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                          title="معاينة الملف"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Print */}
                        <button
                          type="button"
                          id={`admin-print-${item.id}-btn`}
                          onClick={() => handlePrint(item)}
                          className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                          title="طباعة الملف"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Download */}
                        <button
                          type="button"
                          id={`admin-download-${item.id}-btn`}
                          onClick={() => handleDownload(item)}
                          className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                          title="تحميل الملف"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button (زرار مسح) */}
                        <button
                          type="button"
                          id={`admin-delete-${item.id}-btn`}
                          onClick={() => handleDelete(item)}
                          className="p-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          title="مسح وحذف الملف نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
