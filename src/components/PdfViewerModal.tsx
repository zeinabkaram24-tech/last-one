import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Printer, FileText, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { MaterialItem, formatBytes, downloadPdfItem, printPdfItem } from '../utils/materialsStorage';

interface PdfViewerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  pdfUrl?: string | null;
  fileName?: string;
  item?: MaterialItem | null;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  pdfUrl: propPdfUrl,
  fileName: propFileName,
  item: propItem,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MaterialItem | null>(null);
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'proxy' | 'direct'>('proxy');

  // Listen to global open_pdf_viewer_modal custom events
  useEffect(() => {
    const handleOpenEvent = (e: CustomEvent<any>) => {
      const detail = e.detail;
      if (!detail) return;

      if (typeof detail === 'string') {
        setActiveUrl(detail);
        const name = detail.split('/').pop()?.split('?')[0] || 'مستند مرفق';
        setActiveTitle(name);
        setActiveItem(null);
      } else if (detail && typeof detail === 'object') {
        const url = detail.fileData || detail.storageUrl || detail.linkUrl || (detail.id ? `/api/materials/${detail.id}/file` : '');
        setActiveUrl(url);
        setActiveTitle(detail.fileName || 'ملف مرفق');
        setActiveItem(detail);
      }
      setInternalOpen(true);
    };

    window.addEventListener('open_pdf_viewer_modal' as any, handleOpenEvent);
    return () => {
      window.removeEventListener('open_pdf_viewer_modal' as any, handleOpenEvent);
    };
  }, []);

  // Sync props if provided
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setInternalOpen(propIsOpen);
    }
    if (propPdfUrl) {
      setActiveUrl(propPdfUrl);
    }
    if (propFileName) {
      setActiveTitle(propFileName);
    }
    if (propItem) {
      setActiveItem(propItem);
      if (propItem.fileName) setActiveTitle(propItem.fileName);
      const url = propItem.fileData || propItem.storageUrl || propItem.linkUrl || (propItem.id ? `/api/materials/${propItem.id}/file` : '');
      if (url) setActiveUrl(url);
    }
  }, [propIsOpen, propPdfUrl, propFileName, propItem]);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalOpen;

  const handleClose = () => {
    setInternalOpen(false);
    if (propOnClose) propOnClose();
  };

  const fileTitle = activeTitle || activeItem?.fileName || 'مستند مرفق';
  const isImage = Boolean(
    activeItem?.type === 'image' ||
    activeUrl.startsWith('data:image/') ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(fileTitle || activeUrl)
  );

  // Compute optimal viewer URL
  let iframeSrc = activeUrl;
  if (!isImage && !activeUrl.startsWith('data:')) {
    const isLocalUrl =
      activeUrl.startsWith('/') ||
      activeUrl.startsWith('.') ||
      (typeof window !== 'undefined' && activeUrl.includes(window.location.host));

    if (isLocalUrl) {
      iframeSrc = activeUrl;
    } else if (viewMode === 'proxy') {
      iframeSrc = `/api/proxy-file?url=${encodeURIComponent(activeUrl)}`;
    } else {
      iframeSrc = activeUrl;
    }
  }

  const handleDownload = () => {
    if (activeItem) {
      downloadPdfItem(activeItem);
    } else {
      const a = document.createElement('a');
      a.href = activeUrl;
      a.download = fileTitle;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePrint = () => {
    if (activeItem) {
      printPdfItem(activeItem);
    } else {
      const a = window.open(activeUrl, '_blank');
      a?.focus();
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('pdf-viewer-modal-container');
    if (!document.fullscreenElement) {
      if (container?.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  if (!isOpen || !activeUrl) return null;

  return (
    <div
      id="pdf-viewer-modal-backdrop"
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4'
      } bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150`}
    >
      <div
        id="pdf-viewer-modal-container"
        className={`bg-white shadow-2xl border border-slate-200 flex flex-col transition-all overflow-hidden ${
          isFullscreen ? 'w-full h-full rounded-none border-0' : 'w-full max-w-5xl h-[92vh] rounded-3xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50/90 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${
              isImage ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-600 border-rose-200'
            }`}>
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate" title={fileTitle}>
                {fileTitle}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                <span className={`px-1.5 py-0.5 rounded font-bold border ${
                  isImage ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200/60'
                }`}>
                  {isImage ? 'صورة JPG/PNG 🖼️' : 'PDF / مستند 📄'}
                </span>
                {activeItem?.fileSize ? <span>• {formatBytes(activeItem.fileSize)}</span> : null}
                <span>• معاينة المستند</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Open in full tab - guaranteed 1-click view on any device */}
            <a
              id="pdf-modal-external-link"
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs text-xs font-black transition-all cursor-pointer"
              title="فتح المستند في تبويب مستقل بملء الشاشة"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح مباشر ↗</span>
            </a>

            {/* Download */}
            <button
              id="pdf-modal-download-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black transition-colors cursor-pointer"
              title="تحميل الملف للجهاز"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">تحميل</span>
            </button>

            {/* Print */}
            <button
              id="pdf-modal-print-btn"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-black transition-colors cursor-pointer"
              title="طباعة الملف"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              id="pdf-modal-fullscreen-btn"
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              id="pdf-modal-close-btn"
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body (Images vs PDF/Doc) */}
        <div className="flex-1 bg-slate-900/90 relative min-h-0 overflow-hidden flex flex-col p-2 sm:p-4">
          {isImage ? (
            <div className="flex flex-col items-center justify-center max-w-full max-h-full space-y-3 my-auto overflow-auto">
              <img
                src={activeUrl}
                alt={fileTitle}
                className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20 bg-white"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col relative rounded-xl overflow-hidden shadow-lg border border-slate-700/50 bg-white">
              {/* Notice bar at top of viewer */}
              <div className="px-4 py-2 bg-slate-800 text-white flex items-center justify-between text-xs gap-2 shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="truncate text-slate-200 font-bold">معاينة الملف داخل التطبيق</span>
                </div>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>عرض بملء الشاشة ↗</span>
                </a>
              </div>

              {/* Direct Native PDF Frame */}
              <div className="flex-1 w-full min-h-0 relative bg-slate-100">
                <iframe
                  id="pdf-modal-iframe"
                  src={iframeSrc}
                  title={fileTitle}
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom helper toolbar */}
        <div className="py-2.5 px-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-slate-500">
              طريقة العرض:
            </span>
            {!isImage && (
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 font-bold text-[11px]">
                <button
                  type="button"
                  onClick={() => setViewMode('proxy')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'proxy' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الخادم السريع ⚡
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('direct')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'direct' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  رابط مباشر 🔗
                </button>
              </div>
            )}
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-black flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>فتح في تبويب مستقل ↗</span>
            </a>
            <button
              onClick={handleDownload}
              className="text-emerald-700 hover:underline font-bold cursor-pointer"
            >
              تحميل الملف 📥
            </button>
          </div>
          <span className="text-[11px] text-slate-400 font-bold truncate max-w-xs">
            {fileTitle}
          </span>
        </div>
      </div>
    </div>
  );
};
