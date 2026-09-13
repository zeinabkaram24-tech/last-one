import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Printer,
  Maximize2,
  Minimize2,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker to the locally served public worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: string;
  subject?: string;
  sectionLabel?: string;
  blockNumber?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  fileUrl,
  fileName,
  fileSize,
  subject,
  sectionLabel,
  blockNumber,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [pageInputVal, setPageInputVal] = useState<string>('1');
  const [fitMode, setFitMode] = useState<'width' | 'custom'>('custom');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any | null>(null);

  const downloadFilename = fileName || `${title.replace(/[\s/\\?%*:|"<>]/g, '_')}.pdf`;

  // Load PDF Document
  const loadPdf = useCallback(async () => {
    if (!fileUrl) {
      setLoadError('لم يتم العثور على رابط لملف الـ PDF.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);

      // Cancel previous render task if any
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      // Configure PDF loading
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/cmaps/',
        cMapPacked: true,
      });

      const loadedDoc = await loadingTask.promise;
      setPdfDoc(loadedDoc);
      setNumPages(loadedDoc.numPages);
      setCurrentPage(1);
      setPageInputVal('1');
      setIsLoading(false);
    } catch (err: any) {
      console.error('Failed to load PDF document:', err);
      // If worker fails, attempt fallback without cmaps
      setLoadError(err?.message || 'تعذر تحميل أو قراءة ملف الـ PDF. يرجى التحقق من الملف.');
      setIsLoading(false);
    }
  }, [fileUrl]);

  useEffect(() => {
    if (isOpen && fileUrl) {
      loadPdf();
    } else {
      setPdfDoc(null);
      setNumPages(0);
      setCurrentPage(1);
      setLoadError(null);
    }
  }, [isOpen, fileUrl, loadPdf]);

  // Render current page to canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || currentPage < 1 || currentPage > numPages) {
      return;
    }

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Calculate scale if fit width is enabled
      let effectiveScale = scale;
      if (fitMode === 'width' && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; // padding
        const unscaledViewport = page.getViewport({ scale: 1.0, rotation });
        effectiveScale = Math.max(0.6, containerWidth / unscaledViewport.width);
      }

      const viewport = page.getViewport({ scale: effectiveScale, rotation });

      // Handle HiDPI / Retina displays
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      await renderTask.promise;
      renderTaskRef.current = null;
    } catch (err: any) {
      if (err?.name === 'RenderingCancelledException') {
        // Expected when user switches pages rapidly
        return;
      }
      console.error('Error rendering PDF page:', err);
    }
  }, [pdfDoc, currentPage, numPages, scale, rotation, fitMode]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, numPages, isFullscreen, onClose]);

  if (!isOpen) return null;

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        const next = prev - 1;
        setPageInputVal(String(next));
        return next;
      });
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => {
        const next = prev + 1;
        setPageInputVal(String(next));
        return next;
      });
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(pageInputVal, 10);
    if (!isNaN(val) && val >= 1 && val <= numPages) {
      setCurrentPage(val);
    } else {
      setPageInputVal(String(currentPage));
    }
  };

  const handleZoomIn = () => {
    setFitMode('custom');
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setFitMode('custom');
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleFitWidth = () => {
    setFitMode((prev) => (prev === 'width' ? 'custom' : 'width'));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="pdf-viewer-container"
        className={`bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-2 z-50 w-[calc(100%-1rem)] h-[calc(100%-1rem)]'
            : 'w-full max-w-5xl h-[92vh] max-h-[860px]'
        }`}
      >
        {/* Top Header & Info Toolbar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md" title={title}>
                  {title}
                </h3>
                {subject && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {subject}
                  </span>
                )}
                {blockNumber && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Block {blockNumber}
                  </span>
                )}
                {sectionLabel && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {sectionLabel}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5 flex items-center gap-2">
                <span>تنسيق PDF الأصلي</span>
                {numPages > 0 && <span>&bull; {numPages} صفحة</span>}
                {fileSize && <span>&bull; {fileSize}</span>}
              </div>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0 ms-auto">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-2xs cursor-pointer"
              title="تحميل ملف الـ PDF مباشرة"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تحميل PDF</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="طباعة"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Open in New Window */}
            <button
              onClick={handleOpenNewTab}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="فتح في نافذة مستقلة"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Navigation & Zoom Control Bar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white text-xs">
          {/* Page Navigator */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1 || isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
              <span className="text-slate-400">صفحة</span>
              <input
                type="text"
                value={pageInputVal}
                onChange={(e) => setPageInputVal(e.target.value)}
                onBlur={handlePageInputSubmit}
                className="w-12 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-center font-bold text-white focus:outline-hidden focus:border-amber-500"
              />
              <span className="text-slate-400">من {numPages || '...'}</span>
            </form>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages || isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Slider for multi-page documents */}
            {numPages > 1 && (
              <div className="hidden md:flex items-center gap-1.5 ms-2">
                <input
                  type="range"
                  min="1"
                  max={numPages}
                  value={currentPage}
                  onChange={(e) => {
                    const p = parseInt(e.target.value, 10);
                    setCurrentPage(p);
                    setPageInputVal(String(p));
                  }}
                  className="w-24 sm:w-36 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  title="شريط التمرير السريع بين الصفحات"
                />
              </div>
            )}
          </div>

          {/* Zoom & View Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={isLoading || scale <= 0.5}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
              title="تصغير (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleFitWidth}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                fitMode === 'width'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="ملائمة عرض الصفحة"
            >
              ملائمة العرض
            </button>

            <span className="text-[11px] font-mono text-slate-400 px-1">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={isLoading || scale >= 3.0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
              title="تكبير (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleRotate}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer ms-1"
              title="تدوير 90 درجة"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Canvas Display Body */}
        <div
          ref={containerRef}
          className="flex-1 bg-slate-800/90 relative overflow-auto flex items-start justify-center p-4 sm:p-6 select-none"
        >
          {isLoading && (
            <div className="flex flex-col items-center justify-center my-auto p-8 text-center">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">
                جاري فتح وقراءة ملف الـ PDF الأصلي...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                يتم معالجة المستند وعرضه بتنسيقه الأصلي الكامل بدقة عالية
              </p>
            </div>
          )}

          {loadError && !isLoading && (
            <div className="flex flex-col items-center justify-center my-auto p-8 text-center max-w-md bg-slate-900 rounded-2xl border border-rose-900/50">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
              <h4 className="text-base font-bold text-white mb-1">تعذر عرض الملف</h4>
              <p className="text-xs text-slate-400 mb-4">{loadError}</p>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={loadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الملف المباشر</span>
                </button>
                <button
                  onClick={handleOpenNewTab}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في تبويب جديد</span>
                </button>
              </div>
            </div>
          )}

          {/* Native HTML5 Canvas for PDF Rendering */}
          <div
            className={`transition-opacity duration-150 ${
              isLoading || loadError ? 'hidden' : 'block'
            } shadow-2xl rounded-sm bg-white overflow-hidden`}
          >
            <canvas ref={canvasRef} className="block mx-auto max-w-full" />
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">عرض أصلي مباشر عالي الدقة (HTML5 Native Canvas)</span>
            <span className="sm:hidden">عرض أصلي مباشر</span>
          </div>

          <div className="flex items-center gap-3">
            {numPages > 0 && (
              <span className="text-slate-300 font-semibold">
                صفحة {currentPage} من {numPages}
              </span>
            )}
            <button
              onClick={handleDownload}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
            >
              تنزيل PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
