import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ArrowRight,
  Upload,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  FolderOpen,
  Layers,
  Plus,
  RefreshCw,
  Sparkles,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { UploadedMaterial, MaterialSection } from '../types';
import {
  fetchMaterials,
  uploadMaterial,
  deleteMaterial,
  subscribeMaterials,
  getCachedMaterials,
} from '../services/materialsService';
import { PdfViewerModal } from './PdfViewerModal';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMaterials?: () => void;
}

const SUBJECT_OPTIONS = [
  'Mathematics',
  'English',
  'Arabic',
  'Science',
  'Discover',
  'Social Studies',
  'French',
  'Religion',
  'ICT',
  'Arts',
  'Music',
  'PE',
  'General',
];

const DESTINATION_OPTIONS: { id: MaterialSection; label: string; description: string }[] = [
  { id: 'main-sheet', label: 'Main sheet', description: 'الشيت الرئيسي ومخطط المنهج للبلوك' },
  { id: 'week-1', label: 'Week 1', description: 'شيتات وتدريبات الأسبوع 1' },
  { id: 'week-2', label: 'Week 2', description: 'شيتات وتدريبات الأسبوع 2' },
  { id: 'week-3', label: 'Week 3', description: 'شيتات وتدريبات الأسبوع 3' },
  { id: 'week-4', label: 'Week 4', description: 'شيتات وتدريبات الأسبوع 4' },
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenMaterials,
}) => {
  const [materials, setMaterials] = useState<UploadedMaterial[]>(() => getCachedMaterials());
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilterBlock, setActiveFilterBlock] = useState<number>(0); // 0 = all blocks

  // Upload Form State
  const [isUploadCardOpen, setIsUploadCardOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formSubject, setFormSubject] = useState('English');
  const [formBlock, setFormBlock] = useState<number>(1);
  const [formSection, setFormSection] = useState<MaterialSection>('main-sheet');
  const [customWeekNum, setCustomWeekNum] = useState('5');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // PDF Preview state
  const [previewMaterial, setPreviewMaterial] = useState<UploadedMaterial | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load materials from server/cache and subscribe to changes
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    fetchMaterials()
      .then((data) => {
        setMaterials(data);
      })
      .finally(() => setIsLoading(false));

    const unsubscribe = subscribeMaterials((updated) => {
      setMaterials(updated);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleFileChange = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('يرجى اختيار ملف بصيغة PDF فقط (.pdf)');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    // Auto-populate title if empty
    if (!formTitle) {
      const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');
      setFormTitle(cleanName);
    }

    // Read file to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setUploadError('حدث خطأ أثناء قراءة الملف، يرجى المحاولة مرة أخرى.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !fileBase64) {
      setUploadError('يرجى اختيار ملف PDF للرفع.');
      return;
    }
    if (!formTitle.trim()) {
      setUploadError('يرجى كتابة عنوان للملف.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const targetSection = formSection === 'custom' ? `week-${customWeekNum}` : formSection;

    try {
      await uploadMaterial({
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        subject: formSubject,
        blockNumber: formBlock,
        section: targetSection,
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        base64Data: fileBase64,
        pages: 'PDF Document',
      });

      showToast(`تم رفع ملف "${formTitle}" بنجاح وحفظه بتنسيقه الأصلي!`);
      // Reset form
      setSelectedFile(null);
      setFileBase64('');
      setFormTitle('');
      setFormSubtitle('');
      setIsUploadCardOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setUploadError(err?.message || 'فشل رفع الملف، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف ملف "${title}" نهائياً من مساحة المواد؟`)) {
      setDeletingId(id);
      try {
        await deleteMaterial(id);
        showToast(`تم حذف الملف "${title}" بنجاح.`);
      } catch (err) {
        alert('حدث خطأ أثناء حذف الملف.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredMaterials = activeFilterBlock === 0
    ? materials
    : materials.filter((m) => m.blockNumber === activeFilterBlock);

  const getSectionBadge = (section: string) => {
    if (section === 'main-sheet') {
      return {
        label: 'Main sheet',
        color: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (section.startsWith('week-')) {
      const num = section.replace('week-', '');
      return {
        label: `Week ${num}`,
        color: 'bg-purple-100 text-purple-900 border-purple-300',
      };
    }
    return {
      label: section,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs"
      dir="rtl"
    >
      <div
        id="admin-dashboard-modal"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[92vh] max-h-[800px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                  لوحة تحكم الأدمن (Admin Panel)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  إدارة ملفات الـ PDF
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                رفع وحذف مذكرات وشيتات PDF للطلاب والزوار مع حفظ التنسيق الأصلي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMaterials && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMaterials();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition-colors cursor-pointer"
                title="معاينة الشيتات كما يراها الزائر والطالب"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>معاينة تبويب Materials</span>
              </button>
            )}

            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer border border-slate-700"
            >
              <span>خروج</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-700 text-white rounded-2xl shadow-md flex items-center justify-between text-xs font-bold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Action Bar: Upload Button & Quick Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-l from-indigo-50 via-white to-slate-50 rounded-2xl border border-indigo-100 shadow-2xs">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>مستودع المذكرات والشيتات (Materials)</span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-indigo-600 text-white">
                  {materials.length} ملف
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                الملفات المرفوعة يتم حفظها بتنسيق PDF الأصلي وتظهر مباشرة في تبويب Materials للزوار والطلاب.
              </p>
            </div>

            <button
              id="admin-upload-pdf-trigger-btn"
              type="button"
              onClick={() => setIsUploadCardOpen(!isUploadCardOpen)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-xs cursor-pointer shrink-0 ${
                isUploadCardOpen
                  ? 'bg-slate-800 text-white hover:bg-slate-900'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-500/20'
              }`}
            >
              {isUploadCardOpen ? (
                <>
                  <X className="w-4 h-4" />
                  <span>إلغاء الرفع</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>رفع ملف PDF جديد (Upload)</span>
                </>
              )}
            </button>
          </div>

          {/* Upload Form Card (Expandable) */}
          {isUploadCardOpen && (
            <div
              id="admin-upload-form-card"
              className="p-5 bg-white rounded-3xl border-2 border-indigo-500/40 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      إضافة ملف PDF جديد إلى تبويب Material
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      اختر الملف وحدد مكان إضافته بدقة (Main sheet أو Week 1 أو Week 2 ...)
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  تنسيق PDF الأصلي محفوظ
                </span>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* 1. PDF File Selector with Drag & Drop */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">
                    1. اختيار ملف الـ PDF:
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                      selectedFile
                        ? 'border-emerald-500 bg-emerald-50/40'
                        : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900 truncate max-w-sm">
                            {selectedFile.name}
                          </div>
                          <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                            الحجم: {formatFileSize(selectedFile.size)} &bull; جاهز للرفع
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setFileBase64('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="mr-auto p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600"
                          title="إلغاء الملف"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-2">
                        <Upload className="w-7 h-7 text-indigo-500 mx-auto mb-1.5" />
                        <p className="text-xs font-black text-slate-800">
                          اضغط هنا لاختيار ملف PDF أو اسحبه إلى هنا
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          يدعم صيغة PDF فقط حتى 50 ميجابايت مع الاحتفاظ بالخطوط والتصميم
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Target Choice: Block & Section (Main sheet / Week 1 / Week 2 / etc.) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>2. أين سيتم إضافة هذا الملف داخل تبويب Materials؟</span>
                  </div>

                  {/* Block Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      اختر البلوك (Block):
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((bNum) => (
                        <button
                          key={bNum}
                          type="button"
                          onClick={() => setFormBlock(bNum)}
                          className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                            formBlock === bNum
                              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Block {bNum}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section Selection: Main sheet vs Week 1 vs Week 2 vs Week 3 vs Week 4 */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                      خيار الإضافة (Main sheet أو Week 1 أو Week 2 ...):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DESTINATION_OPTIONS.map((opt) => {
                        const isSelected = formSection === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormSection(opt.id)}
                            className={`p-2.5 rounded-xl text-right transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs ring-1 ring-indigo-400'
                                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-xs font-black flex items-center justify-between">
                              <span>{opt.label}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
                            </div>
                            <div
                              className={`text-[10px] font-medium mt-1 leading-tight truncate ${
                                isSelected ? 'text-indigo-100' : 'text-slate-400'
                              }`}
                            >
                              {opt.description}
                            </div>
                          </button>
                        );
                      })}

                      {/* Custom Week Option */}
                      <button
                        type="button"
                        onClick={() => setFormSection('custom')}
                        className={`p-2.5 rounded-xl text-right transition-all cursor-pointer border ${
                          formSection === 'custom'
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs ring-1 ring-indigo-400'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-black flex items-center justify-between">
                          <span>أسبوع مخصص...</span>
                          {formSection === 'custom' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                          )}
                        </div>
                        <div
                          className={`text-[10px] font-medium mt-1 leading-tight ${
                            formSection === 'custom' ? 'text-indigo-100' : 'text-slate-400'
                          }`}
                        >
                          تحديد رقم أسبوع آخر
                        </div>
                      </button>
                    </div>

                    {formSection === 'custom' && (
                      <div className="mt-2 p-2.5 bg-white rounded-xl border border-indigo-200 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">رقم الأسبوع:</span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={customWeekNum}
                          onChange={(e) => setCustomWeekNum(e.target.value)}
                          className="w-20 px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg text-center"
                        />
                        <span className="text-[11px] text-slate-500">
                          (سيظهر كـ Week {customWeekNum})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Metadata: Title, Subject, Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      عنوان الملف (يظهر للطلاب والزوار):
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="مثال: Week 1 English Phonics Sheet"
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      المادة الدراسية (Subject):
                    </label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {SUBJECT_OPTIONS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      وصف مختصر أو تعليمات (اختياري):
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="مثال: شيت تدريبات أسبوعي يتضمن أسئلة الفهم القرائي"
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadCardOpen(false);
                      setSelectedFile(null);
                      setFileBase64('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    id="admin-submit-upload-btn"
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جارٍ الرفع والتجهيز...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>رفع وحفظ ملف الـ PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Bar: All Blocks vs Block 1, 2, 3, 4 */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">تصفية حسب البلوك:</span>
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {[
                  { num: 0, label: 'الكل' },
                  { num: 1, label: 'Block 1' },
                  { num: 2, label: 'Block 2' },
                  { num: 3, label: 'Block 3' },
                  { num: 4, label: 'Block 4' },
                ].map((b) => (
                  <button
                    key={b.num}
                    onClick={() => setActiveFilterBlock(b.num)}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                      activeFilterBlock === b.num
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 font-bold">
              عرض {filteredMaterials.length} من أصل {materials.length} ملف مرفوع
            </div>
          </div>

          {/* Uploaded Materials List */}
          <div className="space-y-3">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((mat) => {
                const secBadge = getSectionBadge(mat.section);
                return (
                  <div
                    key={mat.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                            {mat.title}
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {mat.subject}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            Block {mat.blockNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded-md border ${secBadge.color}`}
                          >
                            {secBadge.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                          {mat.subtitle && <span>{mat.subtitle} &bull; </span>}
                          <span>الحجم: {mat.fileSize}</span>
                          <span>&bull; الملف: {mat.fileName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Preview, Download, Delete */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewMaterial(mat)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black border border-indigo-200 transition-colors cursor-pointer"
                        title="معاينة الملف بتنسيقه الأصلي"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة</span>
                      </button>

                      {/* Download Button */}
                      <a
                        href={mat.fileUrl || mat.fileData}
                        download={mat.fileName || `${mat.title}.pdf`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        title="تحميل الملف"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">تنزيل</span>
                      </a>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(mat.id, mat.title)}
                        disabled={deletingId === mat.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 transition-colors cursor-pointer"
                        title="حذف هذا الملف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">
                  لا توجد ملفات PDF مرفوعة {activeFilterBlock > 0 ? `في Block ${activeFilterBlock}` : ''} حتى الآن
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  اضغط على زر "رفع ملف PDF جديد" بالأعلى لرفع مذكرات وشيتات المنهج واختيار مكان إضافتها.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>نظام إدارة المحتوى الأكاديمي لمدارس النيل المصرية الدولية</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>

      {/* PDF Viewer Modal for Previewing */}
      {previewMaterial && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setPreviewMaterial(null)}
          title={previewMaterial.title}
          fileUrl={previewMaterial.fileUrl || previewMaterial.fileData || ''}
          fileName={previewMaterial.fileName}
          fileSize={previewMaterial.fileSize}
          subject={previewMaterial.subject}
          blockNumber={previewMaterial.blockNumber}
          sectionLabel={
            previewMaterial.section === 'main-sheet'
              ? 'Main sheet'
              : `Week ${previewMaterial.section.replace('week-', '')}`
          }
        />
      )}
    </div>
  );
};
