import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Calendar,
  FolderOpen,
} from 'lucide-react';
import { uploadMaterial } from '../services/materialsService';
import { UploadedMaterial } from '../types';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBlockNumber?: number;
  defaultSection?: string;
  onSuccess: (material: UploadedMaterial) => void;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  onClose,
  defaultBlockNumber = 1,
  defaultSection = 'main-sheet',
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSubtitle, setFormSubtitle] = useState<string>('');
  const [formSubject, setFormSubject] = useState<string>('English');
  const [formBlock, setFormBlock] = useState<number>(defaultBlockNumber);
  const [formSection, setFormSection] = useState<string>(
    defaultSection.startsWith('week-') ? defaultSection : 'main-sheet'
  );
  const [customWeekNum, setCustomWeekNum] = useState<number>(5);
  const [isCustomWeek, setIsCustomWeek] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync defaults when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormBlock(defaultBlockNumber);
      if (defaultSection.startsWith('week-')) {
        const num = parseInt(defaultSection.replace('week-', ''), 10);
        if (num > 4) {
          setIsCustomWeek(true);
          setCustomWeekNum(num);
        } else {
          setIsCustomWeek(false);
          setFormSection(defaultSection);
        }
      } else {
        setIsCustomWeek(false);
        setFormSection('main-sheet');
      }
      setErrorMsg(null);
    }
  }, [isOpen, defaultBlockNumber, defaultSection]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('يرجى اختيار ملف بصيغة PDF فقط (.pdf)');
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);

    if (!formTitle) {
      const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');
      setFormTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMsg('حدث خطأ أثناء قراءة الملف، يرجى المحاولة مرة أخرى.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !fileBase64) {
      setErrorMsg('يرجى اختيار ملف PDF للرفع.');
      return;
    }
    if (!formTitle.trim()) {
      setErrorMsg('يرجى كتابة عنوان للملف.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    const targetSection = isCustomWeek ? `week-${customWeekNum}` : formSection;

    try {
      const created = await uploadMaterial({
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

      onSuccess(created);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'فشل رفع الملف، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="upload-material-modal"
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                رفع شيت PDF في مكانه المخصص
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                اختر البلوك والقسم ليتم إضافة الملف وحفظه بتنسيقه الأصلي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-2xs border border-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Destination Block & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            {/* Block selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>البلوك الأكاديمي:</span>
              </label>
              <select
                value={formBlock}
                onChange={(e) => setFormBlock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                <option value={1}>Block 1</option>
                <option value={2}>Block 2</option>
                <option value={3}>Block 3</option>
                <option value={4}>Block 4</option>
              </select>
            </div>

            {/* Section selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>مكان الإضافة في البلوك:</span>
              </label>
              <select
                value={isCustomWeek ? 'custom' : formSection}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomWeek(true);
                  } else {
                    setIsCustomWeek(false);
                    setFormSection(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                <option value="main-sheet">Main sheet (الشيت الرئيسي)</option>
                <option value="week-1">Week 1 (الأسبوع الأول)</option>
                <option value="week-2">Week 2 (الأسبوع الثاني)</option>
                <option value="week-3">Week 3 (الأسبوع الثالث)</option>
                <option value="week-4">Week 4 (الأسبوع الرابع)</option>
                <option value="custom">أسبوع مخصص (Custom Week)</option>
              </select>
            </div>

            {isCustomWeek && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-200 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">رقم الأسبوع:</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={customWeekNum}
                  onChange={(e) => setCustomWeekNum(parseInt(e.target.value, 10) || 1)}
                  className="w-24 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
                <span className="text-xs text-slate-500 font-medium">
                  سيتم حفظه تحت: Week {customWeekNum}
                </span>
              </div>
            )}
          </div>

          {/* File Picker Drag & Drop Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ملف الـ PDF:
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                selectedFile
                  ? 'border-emerald-400 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-amber-400 hover:bg-amber-50/20 bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900 truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {formatFileSize(selectedFile.size)} &bull; بصيغة PDF الأصلية
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold ms-auto">
                    جاهز للرفع
                  </span>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-800">
                    اسحب وأفلت ملف الـ PDF هنا أو <span className="text-amber-600 underline">اضغط للاختيار</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    يقبل ملفات .pdf حتى 50 ميجابايت مع الاحتفاظ بالخطوط والرسوم الأصلية
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields: Title & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان الشيت أو الملف: *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="مثال: English Unit 1 Practice Sheet"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المادة:
              </label>
              <select
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                <option value="English">English</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Arabic">Arabic</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
                <option value="ICT">ICT</option>
                <option value="Religion">Religion</option>
                <option value="French">French</option>
                <option value="General">عام / General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              وصف مختصر أو ملاحظات (اختياري):
            </label>
            <input
              type="text"
              value={formSubtitle}
              onChange={(e) => setFormSubtitle(e.target.value)}
              placeholder="مثال: التدريبات الرسمية للأسبوع الأول"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري رفع الملف وحفظه...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>تأكيد ورفع الملف في مكانه</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
