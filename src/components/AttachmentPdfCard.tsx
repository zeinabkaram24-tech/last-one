import React, { useState } from 'react';
import { FileText, Eye, Printer, Download, ExternalLink, X } from 'lucide-react';
import {
  formatBytes,
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
  label = 'شيت مرفق',
  className = '',
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const item: MaterialItem = resolveMaterialItem(pdfUrl, fileName);

  // Exact file name as uploaded by user
  const exactDisplayName =
    fileName ||
    (pdfUrl ? pdfUrl.split('/').pop()?.split('?')[0] : null) ||
    item.fileName ||
    'SocialStudies-Grade2-B1-HomeWork-1.pdf';

  const targetUrl =
    item.linkUrl ||
    item.storageUrl ||
    (item.id && item.type !== 'link' ? `/api/materials/${item.id}/file` : null) ||
    pdfUrl ||
    '/materials/SocialStudies-Grade2-B1-HomeWork-1.pdf';

  const handleOpenViewer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewerOpen(true);
  };

  const handleOpenExternal = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <div
        id={id || `attachment-card-${item.id}`}
        className={`bg-slate-50/90 hover:bg-slate-100/90 border border-slate-300/80 hover:border-slate-400 rounded-xl p-2.5 sm:p-3 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${className}`}
        dir="rtl"
      >
        {/* File icon and exact name */}
        <div
          onClick={handleOpenViewer}
          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
          title={`انقر لمعاينة الملف: ${exactDisplayName}`}
        >
          <div className="w-8 h-8 rounded-lg bg-rose-100/90 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-[13px] font-black text-slate-900 group-hover:text-indigo-900 transition-colors break-all">
                {exactDisplayName}
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 shrink-0">
                PDF
              </span>
              {label && (
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-1.5 py-0.2 rounded shrink-0">
                  {label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-0.5">
              <span>{formatBytes(item.fileSize || 678480)}</span>
              {subject && (
                <>
                  <span>•</span>
                  <span className="text-indigo-700 font-bold">{subject}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Compact action buttons */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          {/* 1. View / Preview in App Modal */}
          <button
            type="button"
            onClick={handleOpenViewer}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
            title="معاينة الملف المرفق"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-100" />
            <span>معاينة</span>
          </button>

          {/* 2. Download direct */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              downloadPdfItem({ ...item, fileName: exactDisplayName });
            }}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition-colors shadow-2xs cursor-pointer active:scale-95"
            title="تحميل الملف"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">تحميل</span>
          </button>

          {/* 3. Print direct */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              printPdfItem(item);
            }}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition-colors shadow-2xs cursor-pointer active:scale-95"
            title="طباعة الملف"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">طباعة</span>
          </button>
        </div>
      </div>

      {/* In-App PDF Viewer Modal (Guarantees 100% opening without popup blocker issues) */}
      {isViewerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in"
          onClick={() => setIsViewerOpen(false)}
          dir="rtl"
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-rose-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-black truncate" title={exactDisplayName}>
                  {exactDisplayName}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Open in new tab link */}
                <button
                  onClick={handleOpenExternal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  title="فتح في نافذة متصفح جديدة"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">نافذة جديدة</span>
                </button>

                {/* Direct Download */}
                <a
                  href={targetUrl}
                  download={exactDisplayName}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  title="تحميل الملف"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-100" />
                  <span className="hidden sm:inline">تحميل</span>
                </a>

                {/* Print */}
                <button
                  onClick={() => printPdfItem(item)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  title="طباعة"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">طباعة</span>
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsViewerOpen(false)}
                  className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                  title="إغلاق المعاينة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Embedded PDF */}
            <div className="flex-1 bg-slate-100 relative min-h-0">
              <iframe
                src={`${targetUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0"
                title={exactDisplayName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
