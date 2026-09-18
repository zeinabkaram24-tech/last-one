import React, { useState, useEffect } from 'react';
import { X, Upload, Link2, FileText, Sparkles, BookOpen, ExternalLink, Calendar, HelpCircle } from 'lucide-react';
import { ClassId, SchoolDay, SubjectName, ClassworkEntry, HomeworkEntry, TomorrowSpecialNote } from '../types';

interface InteractiveEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  itemType: 'classwork' | 'homework' | 'tomorrow';
  initialData?: any; // could be ClassworkEntry, HomeworkEntry, or TomorrowSpecialNote
  currentClass: ClassId;
  currentBlock: number;
  currentWeek: number;
  selectedDay: SchoolDay;
  onSave: (type: 'classwork' | 'homework' | 'tomorrow', data: any) => void;
}

const DAYS: SchoolDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
const CLASSES: (ClassId | 'ALL')[] = ['G2A', 'G2B', 'G2C', 'ALL'];
const SUBJECTS: SubjectName[] = [
  'Arabic',
  'English',
  'Mathematics',
  'Science',
  'French',
  'Social Studies',
  'Religion',
  'ICT',
  'Arts',
  'Music',
  'PE'
];

export const InteractiveEditorModal: React.FC<InteractiveEditorModalProps> = ({
  isOpen,
  onClose,
  mode,
  itemType,
  initialData,
  currentClass,
  currentBlock,
  currentWeek,
  selectedDay,
  onSave,
}) => {
  // State variables for form
  const [classId, setClassId] = useState<ClassId | 'ALL'>('G2B');
  const [subject, setSubject] = useState<SubjectName>('Arabic');
  const [block, setBlock] = useState<number>(1);
  const [week, setWeek] = useState<number>(2);
  
  // Specific fields
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [pages, setPages] = useState('');
  const [day, setDay] = useState<SchoolDay>('Sunday');
  const [period, setPeriod] = useState<number>(1);
  
  // Homework fields
  const [assignedDay, setAssignedDay] = useState<SchoolDay>('Sunday');
  const [dueDay, setDueDay] = useState<SchoolDay>('Monday');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  // Tomorrow notes fields
  const [arabicNote, setArabicNote] = useState('');
  const [bagItem, setBagItem] = useState('');
  const [isQuiz, setIsQuiz] = useState(false);
  const [targetDay, setTargetDay] = useState<SchoolDay>('Sunday');

  // Attachment fields
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);

  // Initialize form with initialData or defaults
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setClassId(initialData.classId || currentClass);
        setSubject(initialData.subject || 'Arabic');
        setBlock(initialData.block || currentBlock);
        setWeek(initialData.week || currentWeek);
        setLinkUrl(initialData.linkUrl || '');
        setLinkTitle(initialData.linkTitle || '');
        setFileBase64(initialData.pdfUrl || '');
        setFileName(initialData.pdfUrl ? 'الملف المرفق الحالي 📄' : '');

        if (itemType === 'classwork') {
          setTitle(initialData.title || '');
          setDetails(initialData.details || '');
          setPages(initialData.pages || '');
          setDay(initialData.day || selectedDay);
          setPeriod(initialData.period || 1);
        } else if (itemType === 'homework') {
          setTitle(initialData.task || '');
          setDetails(initialData.details || '');
          setPages(initialData.pages || '');
          setAssignedDay(initialData.assignedDay || selectedDay);
          setDueDay(initialData.dueDay || 'Monday');
          setPriority(initialData.priority || 'normal');
        } else if (itemType === 'tomorrow') {
          setArabicNote(initialData.arabicNote || initialData.note || '');
          setBagItem(initialData.bagItem || '');
          setIsQuiz(initialData.isQuiz || initialData.categoryType === 'quiz' || false);
          setTargetDay(initialData.targetDay || selectedDay);
        }
      } else {
        // Defaults for Add Mode
        setClassId(currentClass);
        setSubject('Arabic');
        setBlock(currentBlock);
        setWeek(currentWeek);
        setTitle('');
        setDetails('');
        setPages('');
        setDay(selectedDay === 'Saturday' ? 'Sunday' : selectedDay);
        setPeriod(1);
        setAssignedDay(selectedDay === 'Saturday' ? 'Sunday' : selectedDay);
        
        // set next day for due day
        const dayOrder: SchoolDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
        const currentIdx = dayOrder.indexOf(selectedDay);
        const nextDayVal = dayOrder[(currentIdx + 1) % dayOrder.length];
        setDueDay(nextDayVal);
        setPriority('normal');

        setArabicNote('');
        setBagItem('');
        setIsQuiz(false);
        setTargetDay(selectedDay === 'Saturday' ? 'Sunday' : selectedDay);
        
        setLinkUrl('');
        setLinkTitle('');
        setFileBase64('');
        setFileName('');
      }
    }
  }, [isOpen, mode, itemType, initialData, currentClass, currentBlock, currentWeek, selectedDay]);

  if (!isOpen) return null;

  // Handle file selection and convert to Base64 (supporting PDF, Word docs, etc.)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFileBase64(event.target.result as string);
      }
      setUploadProgress(false);
    };
    reader.onerror = () => {
      alert('خطأ في قراءة وتحميل الملف، يرجى المحاولة مرة أخرى.');
      setUploadProgress(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData: any = {
      id: mode === 'edit' ? initialData.id : `${itemType}-${Date.now()}`,
      classId: classId === 'ALL' ? currentClass : classId, // default to active class if ALL to ensure it saves correctly
      subject,
      block,
      week,
      linkUrl: linkUrl.trim() || undefined,
      linkTitle: linkTitle.trim() || (linkUrl ? 'رابط إلكتروني 🔗' : undefined),
      pdfUrl: fileBase64 || undefined,
    };

    if (itemType === 'classwork') {
      if (!title.trim()) {
        alert('يرجى إدخال عنوان الحصة الدراسية.');
        return;
      }
      onSave('classwork', {
        ...baseData,
        title: title.trim(),
        details: details.trim() || undefined,
        pages: pages.trim() || undefined,
        day,
        period,
        completed: mode === 'edit' ? initialData.completed : false,
      });
    } else if (itemType === 'homework') {
      if (!title.trim()) {
        alert('يرجى إدخال تفاصيل الواجب المنزلي.');
        return;
      }
      onSave('homework', {
        ...baseData,
        task: title.trim(),
        details: details.trim() || undefined,
        pages: pages.trim() || undefined,
        assignedDay,
        dueDay,
        priority,
        completed: mode === 'edit' ? initialData.completed : false,
      });
    } else if (itemType === 'tomorrow') {
      if (!arabicNote.trim()) {
        alert('يرجى إدخال نص التنبيه أو الملاحظة.');
        return;
      }
      onSave('tomorrow', {
        ...baseData,
        note: arabicNote.trim(),
        arabicNote: arabicNote.trim(),
        bagItem: bagItem.trim() || undefined,
        isQuiz,
        categoryType: isQuiz ? 'quiz' : 'note',
        targetDay,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">
                {mode === 'add' ? '➕ إضافة محتوى جديد تفاعلي' : '✏️ تعديل المحتوى مباشرة'}
              </h3>
              <p className="text-[11px] font-bold text-slate-400">
                نوع المحتوى الحالي: {itemType === 'classwork' ? 'حصة صفية (Classwork)' : itemType === 'homework' ? 'واجب منزلي (Homework)' : 'تنبيه غد / اختبار (Tomorrow Notes)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3.5 space-y-4">
          
          {/* Quick Selection: Subject, Block, Week, Class */}
          <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-black text-slate-600 mb-1">المادة الدراسية:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-600 mb-1">الفصل المستهدف:</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value as ClassId | 'ALL')}
                className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-600 mb-1">الـ Block:</label>
              <select
                value={block}
                onChange={(e) => setBlock(Number(e.target.value))}
                className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
              >
                {[1, 2, 3, 4].map((b) => (
                  <option key={b} value={b}>Block {b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-600 mb-1">الأسبوع الدراسـي:</label>
              <select
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
              >
                {[1, 2, 3, 4].map((w) => (
                  <option key={w} value={w}>الأسبوع {w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form fields based on itemType */}
          {itemType === 'classwork' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">يوم الحصة:</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as SchoolDay)}
                    className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">رقم الحصة (1 - 8):</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={period}
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">عنوان الدرس الرئيسي:</label>
                <input
                  type="text"
                  placeholder="مثال: درس الطرح مع إعادة التسمية"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">شرح/تفاصيل إضافية للدرس:</label>
                <textarea
                  placeholder="اكتب هنا تفاصيل الحصة، المهارات المطلوبة، أو الأهداف..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-400 h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">أرقام الصفحات في كتاب الطالب / البوكليت (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: ص 34 - 36"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                />
              </div>
            </div>
          )}

          {itemType === 'homework' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">تاريخ التكليف (Assigned):</label>
                  <select
                    value={assignedDay}
                    onChange={(e) => setAssignedDay(e.target.value as SchoolDay)}
                    className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">تاريخ التسليم (Due):</label>
                  <select
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value as SchoolDay)}
                    className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">أهمية الواجب (الأولوية):</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === 'normal'}
                      onChange={() => setPriority('normal')}
                      className="text-indigo-600 focus:ring-indigo-400"
                    />
                    <span>عادي (Normal)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === 'urgent'}
                      onChange={() => setPriority('urgent')}
                      className="text-rose-600 focus:ring-rose-400"
                    />
                    <span>🚨 عاجل وهام جداً (Urgent)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">محتوى وتفاصيل الواجب المطلوب:</label>
                <input
                  type="text"
                  placeholder="مثال: حل صفحة 43 كاملة بالدفتر"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">أرقام صفحات الواجب أو تفاصيل إضافية (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: كتاب الطالب ص 43 - 44"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">إرشادات حل الواجب للطلاب وأولياء الأمور:</label>
                <textarea
                  placeholder="أكتب أي تفاصيل إضافية أو إرشادات لتسليم الواجب للمدرسة..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-400 h-16 resize-none"
                />
              </div>
            </div>
          )}

          {itemType === 'tomorrow' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">الملاحظة تتبع ليوم (تاريخ التجهيز):</label>
                <select
                  value={targetDay}
                  onChange={(e) => setTargetDay(e.target.value as SchoolDay)}
                  className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">طبيعة التنبيه:</label>
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-rose-50 border border-rose-200/60 p-2.5 rounded-xl cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={isQuiz}
                    onChange={(e) => setIsQuiz(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-400 w-4 h-4"
                  />
                  <div>
                    <span className="font-black text-rose-950">🚨 تحديد كـ "اختبار / كويز / إملاء غداً"</span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">يعمل على تمييز التنبيه بلون أحمر لافت وتحذير الطلاب تلقائياً</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">نص التنبيه والملاحظة (بالعربية):</label>
                <textarea
                  placeholder="مثال: يرجى إحضار الألوان الخشبية غداً، أو: إملاء درس عائلتي غداً بجميع الصفوف."
                  value={arabicNote}
                  onChange={(e) => setArabicNote(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-400 h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">الأدوات والحقيبة المدرسية المطلوبة (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: كتاب الطالب + الدفتر الصغير + ألوان"
                  value={bagItem}
                  onChange={(e) => setBagItem(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                />
              </div>
            </div>
          )}

          {/* Attachments Section: File (PDF, Word, Doc, PNG) or Link */}
          <div className="border-t border-slate-100 pt-3.5 space-y-3">
            <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-600" />
              <span>المرفقات ووسائط التعلم (ملفات PDF, Word, روابط خارجية)</span>
            </h4>

            {/* Link inputs */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1">رابط إلكتروني مرفق (URL):</label>
                <input
                  type="url"
                  placeholder="https://example.com/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full text-[11px] font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1">اسم الرابط المرفق:</label>
                <input
                  type="text"
                  placeholder="مثال: فيديو شرح الدرس 📺"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full text-[11px] font-bold p-2 bg-white border border-slate-200 rounded-xl focus:border-indigo-400"
                />
              </div>
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1">تحميل ملف مرفق (PDF, Word, صور، إلخ):</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 bg-slate-50 hover:bg-indigo-50/20 text-center transition-all relative cursor-pointer group">
                <input
                  type="file"
                  id="modal-attachment-upload"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xs font-black text-slate-700">
                    {uploadProgress ? 'جاري رفع وتجهيز الملف...' : 'اسحب الملف هنا أو انقر للتصفح 📂'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold">
                    يدعم ملفات Word, PDF, شيتات العمل، والصور
                  </div>
                </div>
              </div>
              {fileName && (
                <div className="mt-2 p-2 bg-indigo-50 text-indigo-950 rounded-xl border border-indigo-200 text-xs font-black flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFileBase64('');
                      setFileName('');
                    }}
                    className="text-rose-600 hover:text-rose-800 font-black cursor-pointer text-[10px]"
                  >
                    حذف ❌
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={uploadProgress}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
            >
              {uploadProgress ? 'جاري التحميل...' : 'حفظ ونشر التغييرات 💾'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
