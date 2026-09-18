import React from 'react';
import { FileText, Eye, Printer, Download, Sparkles } from 'lucide-react';
import {
  formatBytes,
  openPdfItem,
  printPdfItem,
  downloadPdfItem,
  resolveMaterialItem,
  MaterialItem,
} from '../utils/materialsStorage';

interface AttachmentPdfCardProps {
  id?: string;
  pdfUrl?: string;
  fileName?: string;
  subject?: string;
  label?: string;
  className?: string;
}

export const AttachmentPdfCard: React.FC<AttachmentPdfCardProps> = ({
  id,
  pdfUrl,
  fileName,
  subject,
  label = 'ملف مرفق رسمي',
  className = '',
}) => {
  const item: MaterialItem = resolveMaterialItem(pdfUrl, fileName);

  return (
    <div
      id={id || `attachment-card-${item.id}`}
      className={`bg-white border-2 border-amber-200/90 hover:border-amber-300 rounded-2xl p-3.5 shadow-2xs space-y-3 transition-all ${className}`}
    >
      {/* File Details */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => openPdfItem(item)}
          className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
          title="انقر لفتح الملف"
        >
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4
              onClick={() => openPdfItem(item)}
              className="text-sm font-black text-slate-900 truncate hover:text-amber-800 cursor-pointer"
              title={item.fileName}
            >
              {item.fileName}
            </h4>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              {label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-0.5">
            <span>{formatBytes(item.fileSize)}</span>
            <span>•</span>
            <span className="font-bold text-rose-600">PDF</span>
            {subject && (
              <>
                <span>•</span>
                <span className="text-indigo-700 font-bold">{subject}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3 Interactive Buttons mirroring the Materials files system */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
        {/* 1. Preview Button */}
        <button
          type="button"
          id={`preview-attach-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            openPdfItem(item);
          }}
          className="py-2 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black text-xs border border-indigo-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          title="معاينة الملف في نافذة جديدة"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-600" />
          <span>معاينة</span>
        </button>

        {/* 2. Print Button */}
        <button
          type="button"
          id={`print-attach-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            printPdfItem(item);
          }}
          className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          title="طباعة الملف مباشرة"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>طباعة</span>
        </button>

        {/* 3. Download Button */}
        <button
          type="button"
          id={`download-attach-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            downloadPdfItem(item);
          }}
          className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          title="تحميل الملف للجهاز"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>تحميل</span>
        </button>
      </div>
    </div>
  );
};
