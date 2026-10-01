import React, { useState, useEffect, useRef } from 'react';
import { X, Download, ExternalLink, Printer, FileText, Image as ImageIcon, Maximize2, Loader2, AlertTriangle } from 'lucide-react';
import { MaterialItem, formatBytes, downloadPdfItem, printPdfItem } from '../utils/materialsStorage';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker in browser environment
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions?.workerSrc) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch {}
}

// Sub-component to render a single PDF page with crisp details on canvas
const PdfPageCanvas: React.FC<{ page: any; index: number }> = ({ page, index }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!page || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Use a scale of 1.5 for crisp and sharp text rendering on all screens
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Cancel existing render task if any
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    const renderTask = page.render(renderContext);
    renderTaskRef.current = renderTask;

    renderTask.promise.then(
      () => {
        renderTaskRef.current = null;
      },
      (err: any) => {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Page rendering error:', err);
        }
      }
    );

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [page]);

  return (
    <div className="bg-white p-2.5 sm:p-4 rounded-2xl shadow-sm border border-slate-200/80 max-w-full flex flex-col items-center gap-2 relative mb-6">
      <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl shadow-2xs border border-slate-100" />
      <div className="text-[11px] font-black text-slate-500 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
        صفحة {index}
      </div>
    </div>
  );
};

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

  // Client-side PDF rendering states
  const [pdfPages, setPdfPages] = useState<any[]>([]);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState('');

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

  // Fetch and parse PDF pages using pdfjs-dist safely inside client session
  useEffect(() => {
    if (!isOpen || !activeUrl || isImage) {
      setPdfPages([]);
      return;
    }

    let isCurrent = true;
    setLoadingPdf(true);
    setPdfError('');
    setPdfPages([]);

    const fetchAndLoadPdf = async () => {
      try {
        const response = await fetch(activeUrl);
        if (!response.ok) {
          throw new Error(`تعذر تحميل الملف من الخادم (رمز الخطأ: ${response.status})`);
        }
        const arrayBuffer = await response.arrayBuffer();
        if (!isCurrent) return;

        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        if (!isCurrent) return;

        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          pages.push(page);
        }

        if (isCurrent) {
          setPdfPages(pages);
          setLoadingPdf(false);
        }
      } catch (err: any) {
        console.error('Failed to load PDF via Canvas:', err);
        if (isCurrent) {
          setPdfError(err.message || 'فشل تحميل الملف للتصفح المباشر. يرجى الضغط على زر تحميل لقراءة الملف.');
          setLoadingPdf(false);
        }
      }
    };

    fetchAndLoadPdf();

    return () => {
      isCurrent = false;
    };
  }, [activeUrl, isOpen, isImage]);

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
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                  <span className="truncate text-slate-200 font-bold">معاينة آمنة وفائقة الدقة داخل التطبيق</span>
                </div>
              </div>

              {/* Scrollable container for Canvas pages */}
              <div className="flex-1 w-full min-h-0 relative bg-slate-100 overflow-y-auto p-4 flex flex-col items-center">
                {loadingPdf && (
                  <div className="my-auto flex flex-col items-center gap-3 p-8 text-center max-w-sm">
                    <Loader2 className="w-9 h-9 text-indigo-600 animate-spin shrink-0" />
                    <div className="text-sm font-black text-slate-800">جاري تحميل شيت الدراسات الاجتماعية...</div>
                    <div className="text-xs text-slate-500 font-bold leading-relaxed">
                      نقوم الآن بتهيئة صفحات الملف وعرضها بدقة عالية تناسب جميع الشاشات.
                    </div>
                  </div>
                )}

                {pdfError && (
                  <div className="my-auto flex flex-col items-center gap-3 p-8 max-w-md text-center">
                    <AlertTriangle className="w-10 h-10 text-rose-500 shrink-0" />
                    <div className="text-sm font-black text-slate-800 leading-relaxed">{pdfError}</div>
                    <button
                      onClick={handleDownload}
                      className="mt-2 py-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-xs hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
                    >
                      تحميل الملف مباشرة لقراءته 📥
                    </button>
                  </div>
                )}

                {!loadingPdf && !pdfError && pdfPages.length === 0 && (
                  <div className="my-auto text-xs text-slate-500 font-bold">لا توجد صفحات لعرضها.</div>
                )}

                {!loadingPdf && !pdfError && pdfPages.map((page, idx) => (
                  <PdfPageCanvas key={`pdf-page-${idx}`} page={page} index={idx + 1} />
                ))}
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
