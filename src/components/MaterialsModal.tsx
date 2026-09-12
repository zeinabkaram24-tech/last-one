import React from 'react';
import { X, FolderOpen, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ClassId } from '../types';

interface MaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassId;
  currentBlock: number;
  currentWeek: number;
}

export const MaterialsModal: React.FC<MaterialsModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  currentBlock,
  currentWeek,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Header with icon & close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/80 shadow-2xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                Materials (المواد والملفات)
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                {currentClass} • Block {currentBlock} • Week {currentWeek}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Box */}
        <div className="py-6 px-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-amber-600 flex items-center justify-center mx-auto shadow-2xs border border-amber-200">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-amber-950">
            قسم Materials جاهز ومفعّل
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold max-w-sm mx-auto">
            تم تخصيص هذا القسم لعرض وتحميل المواد والملفات التعليمية (Materials) الخاصة بالطلاب. سيتم توزيع المحتوى وربطه حسب المواد بالتنسيق المطلوب.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
};
