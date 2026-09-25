import React from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  AlertCircle,
  Pencil,
  Trash,
  Plus,
  Volume2,
} from 'lucide-react';
import { ClassId, SchoolDay, HomeworkEntry, ClassworkEntry } from '../types';
import { SUBJECT_METADATA } from '../data/timetables';
import { SubjectIcon } from './SubjectIcon';
import { triggerDoneCelebration } from '../utils/celebrate';
import { getSubjectTheme } from '../data/subjectThemes';
import { AttachmentPdfCard } from './AttachmentPdfCard';

interface HomeworkViewProps {
  currentClass: ClassId;
  selectedDay: SchoolDay;
  homeworkList: HomeworkEntry[];
  classworkList?: ClassworkEntry[];
  currentBlock?: number;
  currentWeek?: number;
  onToggleHomework: (id: string) => void;
  onPrint?: () => void;
  isAdminEditMode?: boolean;
  onAddHomework?: () => void;
  onEditHomework?: (entry: HomeworkEntry) => void;
  onDeleteHomework?: (id: string) => void;
}

const ARABIC_DAY_NAMES: Record<SchoolDay, string> = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
};

const NEXT_SCHOOL_DAY: Record<SchoolDay, SchoolDay> = {
  Sunday: 'Monday',
  Monday: 'Tuesday',
  Tuesday: 'Wednesday',
  Wednesday: 'Thursday',
  Thursday: 'Sunday',
  Saturday: 'Sunday',
};

const parseDictationWords = (details: string | undefined): string[] => {
  if (!details) return [];
  const match = details.match(/(?:Words:|الكلمات:)\s*([\s\S]+?)(?:\n\n|Note:|ملحوظة:|$)/i);
  const content = match ? match[1] : details;
  
  const rawWords = content
    .split(/[\n,•·\t*|]+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !w.toLowerCase().includes('dictation') && !w.toLowerCase().includes('learning') && !w.toLowerCase().includes('prepared') && w.length < 30);
    
  if (rawWords.length > 0) {
    return rawWords.flatMap(w => {
      if (w.includes('  ')) {
        return w.split(/\s{2,}/).map(sub => sub.trim()).filter(Boolean);
      }
      return [w];
    });
  }
  
  return [
    "Teacher", "Desk", "Chair", "Computer", "Door", "Whiteboard", "Window",
    "Pen", "Pencil", "Sharpener", "Eraser", "Table", "Notebook", "Glue",
    "Scissors", "Book", "Bookshelf", "Backpack", "Ruler", "Cupboard", "Bookcase"
  ];
};

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  currentClass,
  selectedDay,
  homeworkList,
  classworkList = [],
  currentBlock = 1,
  currentWeek = 2,
  onToggleHomework,
  isAdminEditMode = false,
  onAddHomework,
  onEditHomework,
  onDeleteHomework,
}) => {
  const matchesClass = (h: any) => {
    const cid = h.class_id || h.classId;
    return cid === currentClass || cid === 'ALL';
  };

  // Check if this Block and Week has ANY homework entered for current class
  const hasHomeworkForWeek = homeworkList.some(
    (h) =>
      matchesClass(h) &&
      (h.block || 1) === currentBlock &&
      (h.week || 1) === currentWeek &&
      !h.id?.startsWith('tomorrow-') &&
      !h.id?.startsWith('tn-') &&
      !h.id?.startsWith('custom-')
  );

  // Homework assigned for the selected day with strict deduplication by ID
  const rawDayHomework = homeworkList.filter(
    (h) => {
      if (!matchesClass(h)) return false;
      if (h.assignedDay !== selectedDay) return false;
      if ((h.block || 1) !== currentBlock) return false;
      if ((h.week || 1) !== currentWeek) return false;

      // Filter out tomorrow special lookahead notes/alerts from core homework lists
      if (h.id?.startsWith('tomorrow-') || h.id?.startsWith('tn-') || h.id?.startsWith('custom-')) {
        return false;
      }

      // Strict Saturday rule:
      // User mandate: "وامسح حكاية الـ homework الـ French من يوم السبت."
      if (selectedDay === 'Saturday' && (h.subject === 'French' || (h.subject as string)?.toLowerCase() === 'french')) {
        return false;
      }

      return true;
    }
  );

  const uniqueHwMap = new Map<string, HomeworkEntry>();
  rawDayHomework.forEach((h) => {
    if (h && h.id) {
      uniqueHwMap.set(h.id, h);
    }
  });
  const dayHomework = Array.from(uniqueHwMap.values());

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      triggerDoneCelebration();
    }
    onToggleHomework(id);
  };

  const completedCount = dayHomework.filter((h) => h.completed).length;
  const totalCount = dayHomework.length;

  // If this entire week has no homework entered, render clean empty state
  if (!hasHomeworkForWeek && !isAdminEditMode) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-800">
          لا توجد واجبات مسجلة لهذا الأسبوع
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          الأسبوع المحدد (Block {currentBlock} - Week {currentWeek}) فارغ حالياً ولم يتم إدخال أي واجبات له.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Admin Quick Add Row */}
      {isAdminEditMode && onAddHomework && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between gap-3 animate-fade-in" dir="rtl">
          <div className="text-right">
            <h4 className="text-xs font-black text-emerald-950">التحكم المباشر للأدمن ⚙️</h4>
            <p className="text-[10px] font-bold text-emerald-700">إضافة أو نشر واجبات منزلية جديدة مباشرةً لهذا اليوم الدراسي</p>
          </div>
          <button
            onClick={onAddHomework}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-xs hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-100" />
            <span>➕ إضافة واجب جديد يدوياً</span>
          </button>
        </div>
      )}

      {/* Top Banner: Header for the selected day only */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">
              واجبات يوم {ARABIC_DAY_NAMES[selectedDay]} ({selectedDay}) • {currentClass}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-black border border-indigo-200">
              الأسبوع {currentWeek}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            الواجبات المقررة ليوم {ARABIC_DAY_NAMES[selectedDay]} فقط حسب الخطة الأسبوعية المعتمدة.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
            <span>المكتمل: </span>
            <strong className="text-emerald-700 font-black">{completedCount}</strong>
            <span className="text-slate-400 mx-1">/</span>
            <span>{totalCount}</span>
          </div>
        )}
      </div>

      {/* Selected Day Homework List */}
      {dayHomework.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-2xs space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">
            لا توجد واجبات مقررة ليوم {ARABIC_DAY_NAMES[selectedDay]} ({selectedDay})
          </h4>
          <p className="text-xs text-slate-400">
            بحسب الخطة الأسبوعية المعتمدة، لا يوجد واجب منزلي مقرر لهذا اليوم في المواد المسجلة.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {dayHomework.map((hw) => {
            const meta = SUBJECT_METADATA[hw.subject];
            const theme = getSubjectTheme(hw.subject);
            const checkText = ((hw.task || '') + ' ' + (hw.details || '')).toLowerCase();
            const isHomeworkOrTools =
              checkText.includes('واجب') ||
              checkText.includes('هوم ورك') ||
              checkText.includes('هومورك') ||
              checkText.includes('تسليم') ||
              checkText.includes('submission') ||
              checkText.includes('homework') ||
              checkText.includes('tools') ||
              checkText.includes('أدوات') ||
              checkText.includes('حقيبة') ||
              checkText.includes('كشكول') ||
              checkText.includes('bag') ||
              checkText.includes('sheet') ||
              checkText.includes('شيت');

            const isTestOrQuiz =
              (hw.task || '').toLowerCase().includes('test') ||
              (hw.task || '').toLowerCase().includes('quiz') ||
              (hw.task || '').includes('اختبار') ||
              (hw.task || '').includes('كويز') ||
              (hw.task || '').includes('امتحان') ||
              (!isHomeworkOrTools && (
                (hw.details || '').toLowerCase().includes('test') ||
                (hw.details || '').toLowerCase().includes('quiz') ||
                (hw.details || '').includes('اختبار') ||
                (hw.details || '').includes('كويز')
              ));

            return (
              <div
                key={hw.id}
                className={`rounded-2xl border border-s-4 p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-2xs ${
                  hw.completed
                    ? 'border-emerald-300 border-s-emerald-600 bg-emerald-50/30 opacity-85'
                    : isTestOrQuiz
                    ? 'border-rose-300 border-s-rose-600 bg-rose-50/30 shadow-xs animate-pulse-subtle'
                    : `${theme.hwCard} ${theme.hwAccentBorder} shadow-xs`
                }`}
              >
                {/* Checkbox and Task Details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(hw.id, hw.completed)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={hw.completed ? 'Done' : 'Mark as Done'}
                  >
                    {hw.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Badges: Subject with colorful icon & Test Alert (if applicable) */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border transition-colors ${
                          theme.hwSubjectBadge
                        }`}
                      >
                        <SubjectIcon subject={hw.subject} className="w-3.5 h-3.5" />
                        <span>{hw.subject}</span>
                      </span>

                      {isTestOrQuiz && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-100 text-rose-950 border border-rose-300 shadow-2xs">
                          <AlertCircle className="w-3 h-3 text-rose-700 animate-bounce" />
                          تنبيه اختبار / كويز 🚨
                        </span>
                      )}

                      {hw.pages && !(hw.subject === 'Science' && (checkText.includes('بوكلت') || checkText.includes('بوكليت') || checkText.includes('booklet') || checkText.includes('submission') || checkText.includes('تسليم'))) && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-black bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>{hw.pages}</span>
                        </span>
                      )}

                      {hw.subject === 'English' && (hw.task.toLowerCase().includes('dictation') || hw.task.includes('إملاء') || (hw.details && hw.details.toLowerCase().includes('dictation'))) && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-black bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs">
                          <span>Dictation list 📝</span>
                        </span>
                      )}
                    </div>

                    {/* Task Description */}
                    <p
                      className={`text-sm font-black leading-snug pt-0.5 ${
                        hw.completed ? 'line-through text-slate-400' : 'text-slate-950'
                      }`}
                    >
                      {hw.subject === 'Science' && (checkText.includes('بوكلت') || checkText.includes('بوكليت') || checkText.includes('booklet') || checkText.includes('submission') || checkText.includes('تسليم'))
                        ? 'تسليم بوكليت الساينس'
                        : hw.task}
                    </p>

                    {/* Elegant Word Cards Grid for Dictation Lists */}
                    {hw.subject === 'English' && (hw.task.toLowerCase().includes('dictation') || hw.task.includes('إملاء') || (hw.details && hw.details.toLowerCase().includes('dictation'))) && (() => {
                      const words = parseDictationWords(hw.details);
                      return (
                        <div className="mt-3 p-3.5 bg-slate-50/50 rounded-2xl border border-slate-150/80 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-black text-slate-500 border-b border-slate-100 pb-2">
                            <span className="flex items-center gap-1">🗣️ English Dictation Words:</span>
                            <span className="text-indigo-600 font-black">{words.length} Words • {words.length} كلمة</span>
                          </div>
                          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {words.map((word) => (
                              <button
                                key={word}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if ('speechSynthesis' in window) {
                                    // Cancel any ongoing pronunciation
                                    window.speechSynthesis.cancel();
                                    const utterance = new SpeechSynthesisUtterance(word);
                                    utterance.lang = 'en-US';
                                    utterance.rate = 0.85; // Natural speed for kids to learn pronunciation
                                    window.speechSynthesis.speak(utterance);
                                  }
                                }}
                                title="Click to listen / اضغط للاستماع للنطق"
                                className={`px-2 py-1.5 flex items-center justify-center gap-1.5 rounded-xl border text-sm font-bold tracking-wider font-mono transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] shadow-3xs cursor-pointer ${
                                  hw.completed
                                    ? 'bg-slate-100/50 border-slate-200 text-slate-400 line-through'
                                    : 'bg-indigo-50/50 border-indigo-100/80 text-indigo-900 hover:border-indigo-400 hover:bg-indigo-100/60 hover:text-indigo-950 hover:shadow-xs'
                                }`}
                              >
                                <span>{word}</span>
                                {!hw.completed && (
                                  <Volume2 className="w-3.5 h-3.5 text-indigo-400 hover:text-indigo-600 transition-colors shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold flex justify-between pt-1 border-t border-slate-100/50 mt-1">
                            <span>⚠️ Note: Always start with capital letters.</span>
                            <span>Outcome: R7 picture dictionary</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* PDF Worksheet if available: strictly only allowed for Social Studies and English Dictation per school rule */}
                    {(() => {
                      if (!hw.pdfUrl) return null;
                      const isAllowed =
                        (hw.subject === 'Social Studies' && selectedDay !== 'Thursday') ||
                        (hw.subject === 'English' && (
                          hw.task?.toLowerCase().includes('dictation') ||
                          hw.details?.includes('إملاء') ||
                          hw.task?.includes('إملاء')
                        ));
                      if (!isAllowed) return null;
                      return (
                        <div className="pt-2">
                          <AttachmentPdfCard
                            pdfUrl={hw.pdfUrl}
                            subject={hw.subject}
                            label="مرفق شيت الواجب"
                          />
                        </div>
                      );
                    })()}

                    {/* Link if available */}
                    {hw.linkUrl && (
                      <div className="pt-1">
                        <a
                          href={hw.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-950 border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
                          <span>رابط الواجب / النشاط 🔗</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Done check and Admin controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  {isAdminEditMode && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditHomework?.(hw)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black rounded-lg transition-all cursor-pointer"
                        title="تعديل تفاصيل الواجب"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-700" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => {
                          onDeleteHomework?.(hw.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-300 text-xs font-black rounded-lg transition-all cursor-pointer"
                        title="حذف الواجب نهائياً"
                      >
                        <Trash className="w-3.5 h-3.5 text-rose-700" />
                        <span>حذف</span>
                      </button>
                    </div>
                  )}

                  {/* Interactive toggle button: Done with celebration */}
                  <button
                    onClick={() => handleToggle(hw.id, hw.completed)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                      hw.completed
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-slate-100 hover:text-slate-600 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs hover:scale-105 active:scale-95'
                    }`}
                    title={hw.completed ? 'اضغطي للإلغاء' : 'اضغطي للتحديد كـ Done'}
                  >
                    {hw.completed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Done ✓</span>
                      </>
                    ) : (
                      <span>Done</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
