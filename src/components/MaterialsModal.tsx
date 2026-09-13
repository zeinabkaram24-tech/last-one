import React, { useState, useEffect } from 'react';
import {
  X,
  FolderOpen,
  FileSpreadsheet,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  Download,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Sparkles,
  FileCheck,
  Eye,
  UploadCloud,
  Trash2,
} from 'lucide-react';
import { ClassId, UploadedMaterial } from '../types';
import {
  fetchMaterials,
  subscribeMaterials,
  getCachedMaterials,
  deleteMaterial,
} from '../services/materialsService';
import { PdfViewerModal } from './PdfViewerModal';
import { UploadMaterialModal } from './UploadMaterialModal';

interface MaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass: ClassId;
  currentBlock: number;
  currentWeek: number;
}

type SheetItem = {
  id: string;
  title: string;
  subtitle: string;
  subject: string;
  pages?: string;
  type: 'pdf' | 'doc' | 'sheet';
};

interface BlockData {
  blockNumber: number;
  title: string;
  mainSheets: SheetItem[];
  weeks: {
    weekNumber: number;
    title: string;
    sheets: SheetItem[];
  }[];
}

const BLOCKS_DATA: BlockData[] = [
  {
    blockNumber: 1,
    title: 'Block 1 - Foundations & Welcome',
    mainSheets: [
      {
        id: 'b1-ms1',
        title: 'Main Sheet 1: Block 1 Curriculum & Objectives Matrix',
        subtitle: 'Comprehensive distribution of learning outcomes across all Grade 2 subjects',
        subject: 'General / All Subjects',
        pages: '6 Pages',
        type: 'pdf',
      },
      {
        id: 'b1-ms2',
        title: 'Main Sheet 2: Assessment Criteria & Rubrics',
        subtitle: 'Evaluation guidelines for classwork, homework, and weekly participation',
        subject: 'Academic Evaluation',
        pages: '4 Pages',
        type: 'sheet',
      },
    ],
    weeks: [
      {
        weekNumber: 1,
        title: 'Week 1 - Welcome & Getting Started',
        sheets: [
          {
            id: 'b1-w1-1',
            title: 'Week 1 English Practice & Phonics Sheet',
            subtitle: 'Alphabet review, initial sounds, and handwriting guide',
            subject: 'English',
            pages: '2 Pages',
            type: 'pdf',
          },
          {
            id: 'b1-w1-2',
            title: 'Week 1 Math Discovery Worksheet',
            subtitle: 'Numbers up to 50, counting in tens and ones',
            subject: 'Math',
            pages: '3 Pages',
            type: 'sheet',
          },
          {
            id: 'b1-w1-3',
            title: 'Week 1 Arabic Reading & Writing Sheet',
            subtitle: 'أنشطة الحروف الهجائية وقواعد القراءة',
            subject: 'Arabic',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 2,
        title: 'Week 2 - Building Skills',
        sheets: [
          {
            id: 'b1-w2-1',
            title: 'Week 2 English Vocabulary & Grammar Sheet',
            subtitle: 'Sight words and sentence building drills',
            subject: 'English',
            pages: '3 Pages',
            type: 'pdf',
          },
          {
            id: 'b1-w2-2',
            title: 'Week 2 Math Place Value Sheet',
            subtitle: 'Comparing numbers (<, >, =) and place values',
            subject: 'Math',
            pages: '2 Pages',
            type: 'sheet',
          },
          {
            id: 'b1-w2-3',
            title: 'Week 2 Discover Science Inquiry Sheet',
            subtitle: 'My Body & Healthy Habits interactive exercises',
            subject: 'Discover',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 3,
        title: 'Week 3 - Exploring Further',
        sheets: [
          {
            id: 'b1-w3-1',
            title: 'Week 3 English Comprehension Sheet',
            subtitle: 'Short story reading and guided questions',
            subject: 'English',
            pages: '2 Pages',
            type: 'pdf',
          },
          {
            id: 'b1-w3-2',
            title: 'Week 3 Math Addition & Subtraction Sheet',
            subtitle: 'Mental math strategies within 20',
            subject: 'Math',
            pages: '3 Pages',
            type: 'sheet',
          },
          {
            id: 'b1-w3-3',
            title: 'Week 3 Arabic Grammar Sheet',
            subtitle: 'ضمائر المتكلم والمخاطب والأسماء الموصولة',
            subject: 'Arabic',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 4,
        title: 'Week 4 - Review & Consolidation',
        sheets: [
          {
            id: 'b1-w4-1',
            title: 'Week 4 Block 1 Comprehensive Review Sheet',
            subtitle: 'Integrated review exercises across core topics',
            subject: 'General Review',
            pages: '4 Pages',
            type: 'pdf',
          },
          {
            id: 'b1-w4-2',
            title: 'Week 4 Math Problem Solving Sheet',
            subtitle: 'Word problems with real-world scenarios',
            subject: 'Math',
            pages: '2 Pages',
            type: 'sheet',
          },
          {
            id: 'b1-w4-3',
            title: 'Week 4 Self-Assessment & Portfolio Checklist',
            subtitle: 'Student progress tracker for Block 1',
            subject: 'Assessment',
            pages: '1 Page',
            type: 'pdf',
          },
        ],
      },
    ],
  },
  {
    blockNumber: 2,
    title: 'Block 2 - Expansion & Discovery',
    mainSheets: [
      {
        id: 'b2-ms1',
        title: 'Main Sheet 1: Block 2 Academic Blueprint',
        subtitle: 'Expanded curriculum outcomes for English, Math, Arabic & Discover',
        subject: 'Curriculum Plan',
        pages: '6 Pages',
        type: 'pdf',
      },
      {
        id: 'b2-ms2',
        title: 'Main Sheet 2: Project Milestones & Rubrics',
        subtitle: 'Block 2 collaborative projects and practical activities',
        subject: 'Project Matrix',
        pages: '3 Pages',
        type: 'sheet',
      },
    ],
    weeks: [
      {
        weekNumber: 1,
        title: 'Week 1 - New Concepts',
        sheets: [
          {
            id: 'b2-w1-1',
            title: 'Week 1 English Reading Booklet',
            subtitle: 'New story chapters & vocabulary flashcard companion',
            subject: 'English',
            pages: '3 Pages',
            type: 'pdf',
          },
          {
            id: 'b2-w1-2',
            title: 'Week 1 Math 2-Digit Addition Sheet',
            subtitle: 'Addition with regrouping exercises',
            subject: 'Math',
            pages: '3 Pages',
            type: 'sheet',
          },
        ],
      },
      {
        weekNumber: 2,
        title: 'Week 2 - Deepening Knowledge',
        sheets: [
          {
            id: 'b2-w2-1',
            title: 'Week 2 Math 2-Digit Subtraction Sheet',
            subtitle: 'Subtraction with borrowing and number lines',
            subject: 'Math',
            pages: '2 Pages',
            type: 'sheet',
          },
          {
            id: 'b2-w2-2',
            title: 'Week 2 Discover Living Things Worksheet',
            subtitle: 'Plant life cycles and animal habitats',
            subject: 'Discover',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 3,
        title: 'Week 3 - Application & Practice',
        sheets: [
          {
            id: 'b2-w3-1',
            title: 'Week 3 English Writing Workshop Sheet',
            subtitle: 'Descriptive paragraphs and creative sentences',
            subject: 'English',
            pages: '2 Pages',
            type: 'pdf',
          },
          {
            id: 'b2-w3-2',
            title: 'Week 3 Arabic Reading Comprehension Sheet',
            subtitle: 'نصوص قرائية وتطبيقات لغوية',
            subject: 'Arabic',
            pages: '3 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 4,
        title: 'Week 4 - Block 2 Wrap-up & Review',
        sheets: [
          {
            id: 'b2-w4-1',
            title: 'Week 4 Block 2 Master Revision Sheet',
            subtitle: 'Preparation exercises for Block 2 evaluations',
            subject: 'All Subjects',
            pages: '5 Pages',
            type: 'pdf',
          },
          {
            id: 'b2-w4-2',
            title: 'Week 4 Math Challenge & Logic Sheet',
            subtitle: 'Puzzles and pattern recognition challenges',
            subject: 'Math',
            pages: '2 Pages',
            type: 'sheet',
          },
        ],
      },
    ],
  },
  {
    blockNumber: 3,
    title: 'Block 3 - Skill Mastery',
    mainSheets: [
      {
        id: 'b3-ms1',
        title: 'Main Sheet 1: Block 3 Learning Roadmap',
        subtitle: 'Advanced term competencies and reading standards',
        subject: 'Roadmap',
        pages: '5 Pages',
        type: 'pdf',
      },
      {
        id: 'b3-ms2',
        title: 'Main Sheet 2: Mid-Year Competency Matrix',
        subtitle: 'Skill verification checklist for Grade 2',
        subject: 'Evaluation',
        pages: '4 Pages',
        type: 'sheet',
      },
    ],
    weeks: [
      {
        weekNumber: 1,
        title: 'Week 1 - Geometry & Measurements',
        sheets: [
          {
            id: 'b3-w1-1',
            title: 'Week 1 Math Shapes & Solids Sheet',
            subtitle: '2D shapes and 3D geometric solids exploration',
            subject: 'Math',
            pages: '3 Pages',
            type: 'sheet',
          },
          {
            id: 'b3-w1-2',
            title: 'Week 1 English Adjectives & Descriptions',
            subtitle: 'Using adjectives to enrich short paragraphs',
            subject: 'English',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 2,
        title: 'Week 2 - Time & Fractions',
        sheets: [
          {
            id: 'b3-w2-1',
            title: 'Week 2 Math Telling Time Sheet',
            subtitle: 'Analog and digital clocks: half-hour and quarter-hour',
            subject: 'Math',
            pages: '3 Pages',
            type: 'sheet',
          },
          {
            id: 'b3-w2-2',
            title: 'Week 2 Discover Weather & Climate Sheet',
            subtitle: 'Seasons, weather observations, and charts',
            subject: 'Discover',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 3,
        title: 'Week 3 - Data & Graphs',
        sheets: [
          {
            id: 'b3-w3-1',
            title: 'Week 3 Math Bar Graphs & Pictographs',
            subtitle: 'Collecting data and reading visual charts',
            subject: 'Math',
            pages: '2 Pages',
            type: 'sheet',
          },
          {
            id: 'b3-w3-2',
            title: 'Week 3 Arabic Composition & Spelling',
            subtitle: 'قواعد الإملاء والتعبير الكتابي',
            subject: 'Arabic',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 4,
        title: 'Week 4 - Block 3 Synthesis',
        sheets: [
          {
            id: 'b3-w4-1',
            title: 'Week 4 Block 3 Full Review Packet',
            subtitle: 'End of Block 3 diagnostic and practice sheets',
            subject: 'All Subjects',
            pages: '4 Pages',
            type: 'pdf',
          },
        ],
      },
    ],
  },
  {
    blockNumber: 4,
    title: 'Block 4 - Final Excellence & Transitions',
    mainSheets: [
      {
        id: 'b4-ms1',
        title: 'Main Sheet 1: Block 4 Final Curriculum Overview',
        subtitle: 'Completion syllabus and transition standards for Grade 3 readiness',
        subject: 'Transition Matrix',
        pages: '6 Pages',
        type: 'pdf',
      },
      {
        id: 'b4-ms2',
        title: 'Main Sheet 2: Annual Cumulative Assessment Sheet',
        subtitle: 'Holistic portfolio guidelines and final presentations',
        subject: 'Final Matrix',
        pages: '3 Pages',
        type: 'sheet',
      },
    ],
    weeks: [
      {
        weekNumber: 1,
        title: 'Week 1 - Multiplication Foundations',
        sheets: [
          {
            id: 'b4-w1-1',
            title: 'Week 1 Math Repeated Addition & Equal Groups',
            subtitle: 'Introduction to arrays and grouping concepts',
            subject: 'Math',
            pages: '3 Pages',
            type: 'sheet',
          },
          {
            id: 'b4-w1-2',
            title: 'Week 1 English Non-Fiction Reading Sheet',
            subtitle: 'Informational texts and glossary usage',
            subject: 'English',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 2,
        title: 'Week 2 - Money & Financial Literacy',
        sheets: [
          {
            id: 'b4-w2-1',
            title: 'Week 2 Math Coins & Bills Sheet',
            subtitle: 'Counting money, making change, and shopping math',
            subject: 'Math',
            pages: '3 Pages',
            type: 'sheet',
          },
          {
            id: 'b4-w2-2',
            title: 'Week 2 Discover Forces & Motion Sheet',
            subtitle: 'Push, pull, gravity, and simple experiments',
            subject: 'Discover',
            pages: '2 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 3,
        title: 'Week 3 - Advanced Stories & Syntax',
        sheets: [
          {
            id: 'b4-w3-1',
            title: 'Week 3 English Story Writing Booklet',
            subtitle: 'Characters, setting, beginning, middle, and end',
            subject: 'English',
            pages: '3 Pages',
            type: 'pdf',
          },
          {
            id: 'b4-w3-2',
            title: 'Week 3 Arabic Comprehensive Skills Sheet',
            subtitle: 'تطبيقات نحوية وإملائية شاملة',
            subject: 'Arabic',
            pages: '3 Pages',
            type: 'pdf',
          },
        ],
      },
      {
        weekNumber: 4,
        title: 'Week 4 - Year-End Capstone Review',
        sheets: [
          {
            id: 'b4-w4-1',
            title: 'Week 4 Comprehensive Academic Review Sheet',
            subtitle: 'Final Grade 2 celebration worksheets & summer prep',
            subject: 'All Subjects',
            pages: '6 Pages',
            type: 'pdf',
          },
        ],
      },
    ],
  },
];

export const MaterialsModal: React.FC<MaterialsModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  currentBlock,
  currentWeek,
}) => {
  // Selected Block: 1, 2, 3, 4
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(() => {
    return currentBlock >= 1 && currentBlock <= 4 ? currentBlock : 1;
  });

  // Selected Section inside the Block: 'main-sheet' | 'week-1' | 'week-2' | 'week-3' | 'week-4'
  const [selectedSection, setSelectedSection] = useState<string>(() => {
    return `week-${currentWeek >= 1 && currentWeek <= 4 ? currentWeek : 1}`;
  });

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>(() => getCachedMaterials());
  const [pdfViewerTarget, setPdfViewerTarget] = useState<UploadedMaterial | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadModalTarget, setUploadModalTarget] = useState<{ blockNumber: number; section: string }>({
    blockNumber: 1,
    section: 'main-sheet',
  });

  useEffect(() => {
    if (!isOpen) return;
    fetchMaterials().then(setUploadedMaterials);
    const unsubscribe = subscribeMaterials(setUploadedMaterials);
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBlockData =
    BLOCKS_DATA.find((b) => b.blockNumber === selectedBlockNumber) || BLOCKS_DATA[0];

  // Uploaded materials for the currently active block
  const blockUploadedMaterials = uploadedMaterials.filter(
    (m) => m.blockNumber === selectedBlockNumber
  );

  const uploadedMainSheets = blockUploadedMaterials.filter((m) => m.section === 'main-sheet');

  // Custom weeks > 4 that have uploaded materials
  const customWeekNums: number[] = Array.from<number>(
    new Set(
      blockUploadedMaterials
        .filter((m) => m.section.startsWith('week-'))
        .map((m) => parseInt(m.section.replace('week-', ''), 10))
        .filter((num) => num > 4 && !isNaN(num))
    )
  ).sort((a: number, b: number) => a - b);

  const handleDownloadMock = (sheetTitle: string) => {
    setDownloadNotice(`Preparing: ${sheetTitle}`);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 2500);
  };

  const handleDeleteMaterial = async (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف ملف "${title}"؟`)) {
      await deleteMaterial(id);
      setSuccessNotice(`تم حذف ملف "${title}" بنجاح.`);
      setTimeout(() => {
        setSuccessNotice(null);
      }, 3000);
    }
  };

  const openUploadModal = (blockNum?: number, sectionKey?: string) => {
    setUploadModalTarget({
      blockNumber: blockNum ?? selectedBlockNumber,
      section: sectionKey ?? selectedSection,
    });
    setIsUploadModalOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs"
      dir="ltr"
    >
      <div
        id="materials-modal"
        className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] max-h-[760px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Materials
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {currentClass}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Official sheets, workbooks, and weekly guides for Grade 2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Upload Button directly in Materials Modal */}
            <button
              id="btn-quick-upload-material"
              onClick={() => openUploadModal(selectedBlockNumber, selectedSection)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-2xs cursor-pointer"
              title="رفع شيت PDF في مكانه المخصص"
            >
              <UploadCloud className="w-4 h-4" />
              <span>+ رفع شيت PDF</span>
            </button>

            <button
              id="close-materials-modal-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-2xs border border-slate-200 cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Level 1: Block Selection Bar (Block 1, Block 2, Block 3, Block 4) */}
        <div className="px-6 py-3 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline-block">
              Block:
            </span>
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              {[1, 2, 3, 4].map((bNum) => {
                const isSelected = selectedBlockNumber === bNum;
                return (
                  <button
                    key={bNum}
                    id={`btn-select-block-${bNum}`}
                    onClick={() => {
                      setSelectedBlockNumber(bNum);
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Block {bNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Body: Two-column layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
          {/* Left Column / Sidebar: Main sheet & Week 1, Week 2, Week 3, Week 4 */}
          <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 p-4 space-y-4 overflow-y-auto">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Block {selectedBlockNumber} Content
              </div>

              {/* Main sheet Option */}
              <button
                id="btn-nav-main-sheet"
                onClick={() => setSelectedSection('main-sheet')}
                className={`w-full text-left p-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border ${
                  selectedSection === 'main-sheet'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 border-amber-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      selectedSection === 'main-sheet'
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-amber-600 border border-amber-200 shadow-2xs'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="leading-tight flex items-center gap-1.5">
                      <span>Main sheet</span>
                      {uploadedMainSheets.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-200 text-amber-950 border border-amber-300">
                          +{uploadedMainSheets.length} PDF
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[11px] font-medium ${
                        selectedSection === 'main-sheet'
                          ? 'text-amber-100'
                          : 'text-amber-700/80'
                      }`}
                    >
                      {currentBlockData.mainSheets.length + uploadedMainSheets.length} Core Sheets
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 ${
                    selectedSection === 'main-sheet'
                      ? 'text-white'
                      : 'text-amber-400'
                  }`}
                />
              </button>
            </div>

            {/* Under Main sheet: Week 1, Week 2, Week 3, Week 4 + Custom weeks */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Weeks (under Main sheet)
              </div>
              <div className="space-y-1.5">
                {[1, 2, 3, 4, ...customWeekNums].map((wNum) => {
                  const secKey = `week-${wNum}`;
                  const isSelected = selectedSection === secKey;
                  const weekObj = currentBlockData.weeks.find((w) => w.weekNumber === wNum);
                  const uploadedCount = blockUploadedMaterials.filter(
                    (m) => m.section === secKey
                  ).length;
                  const sheetCount = (weekObj ? weekObj.sheets.length : 0) + uploadedCount;

                  return (
                    <button
                      key={wNum}
                      id={`btn-nav-week-${wNum}`}
                      onClick={() => setSelectedSection(secKey)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          W{wNum}
                        </div>
                        <span className="font-semibold truncate">Week {wNum}</span>
                        {uploadedCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            +{uploadedCount}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {sheetCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Content Viewer for Selected Sheet / Week */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
            {successNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {downloadNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{downloadNotice}</span>
              </div>
            )}

            {/* Displaying MAIN SHEET */}
            {selectedSection === 'main-sheet' && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-300 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        Block {selectedBlockNumber} • Main sheet
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Master curriculum sheets and assessment frameworks for this block
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-500 text-white rounded-xl text-xs font-extrabold shadow-2xs">
                    Main sheet
                  </span>
                </div>

                {/* Direct Inline Upload Trigger for Main Sheet */}
                <button
                  onClick={() => openUploadModal(selectedBlockNumber, 'main-sheet')}
                  className="w-full p-3.5 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h5 className="text-xs font-black text-amber-950">
                        + رفع شيت PDF جديد في Main sheet (Block {selectedBlockNumber})
                      </h5>
                      <p className="text-[11px] text-amber-700/80 font-medium">
                        اضغط هنا لاختيار ملف PDF ورفعه مباشرة في الشيت الرئيسي لهذا البلوك
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-2xs">
                    + رفع ملف هنا
                  </span>
                </button>

                <div className="grid grid-cols-1 gap-3">
                  {/* Uploaded PDF Main Sheets */}
                  {uploadedMainSheets.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 bg-white rounded-2xl border-2 border-amber-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-extrabold text-slate-900 text-sm">
                              {mat.title}
                            </h5>
                            <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              {mat.subject}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              PDF أصلي
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold">
                              • {mat.fileSize}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            {mat.subtitle || 'Uploaded PDF curriculum material'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => setPdfViewerTarget(mat)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          title="عرض ملف الـ PDF بتنسيقه الأصلي الكامل"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>عرض PDF</span>
                        </button>

                        <a
                          href={mat.fileUrl || mat.fileData}
                          download={mat.fileName || `${mat.title}.pdf`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          title="تحميل الملف"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تحميل</span>
                        </a>

                        <button
                          onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                          title="حذف هذا الملف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Default Main Sheets */}
                  {currentBlockData.mainSheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-extrabold text-slate-900 text-sm">
                              {sheet.title}
                            </h5>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600">
                              {sheet.subject}
                            </span>
                            {sheet.pages && (
                              <span className="text-[11px] text-slate-400 font-semibold">
                                • {sheet.pages}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            {sheet.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleDownloadMock(sheet.title)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-weeks quick links under Main sheet */}
                <div className="mt-6 pt-5 border-t border-slate-200">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                    Weeks Under Main sheet (Block {selectedBlockNumber})
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[1, 2, 3, 4, ...customWeekNums].map((wNum) => (
                      <button
                        key={wNum}
                        onClick={() => setSelectedSection(`week-${wNum}`)}
                        className="p-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-left transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-black text-slate-800 group-hover:text-amber-600 flex items-center justify-between">
                          <span>Week {wNum}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-1">
                          View Weekly Sheets
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Displaying WEEK (Week 1, Week 2, Week 3, Week 4, etc.) */}
            {selectedSection.startsWith('week-') && (() => {
              const weekNum = parseInt(selectedSection.replace('week-', ''), 10);
              const weekData = currentBlockData.weeks.find((w) => w.weekNumber === weekNum);
              const uploadedWeekSheets = blockUploadedMaterials.filter(
                (m) => m.section === selectedSection
              );
              const totalSheetsCount =
                (weekData ? weekData.sheets.length : 0) + uploadedWeekSheets.length;

              return (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base shadow-2xs">
                        W{weekNum}
                      </div>
                      <div>
                        <h4 className="text-base font-black">
                          Block {selectedBlockNumber} • Week {weekNum}
                        </h4>
                        <p className="text-xs text-slate-300 font-medium">
                          {weekData?.title || `Weekly material sheets for Week ${weekNum}`}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white/10 text-white rounded-xl text-xs font-bold border border-white/20">
                      Week {weekNum} ({totalSheetsCount} sheets)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Direct Inline Upload Trigger for Week X */}
                    <button
                      onClick={() => openUploadModal(selectedBlockNumber, selectedSection)}
                      className="w-full p-3.5 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h5 className="text-xs font-black text-indigo-950">
                            + رفع شيت PDF جديد لـ Week {weekNum} (Block {selectedBlockNumber})
                          </h5>
                          <p className="text-[11px] text-indigo-700/80 font-medium">
                            اضغط هنا لاختيار ملف PDF ورفعه مباشرة في تدريبات الأسبوع {weekNum}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-2xs">
                        + رفع للأسبوع
                      </span>
                    </button>

                    {/* Uploaded PDF Weekly Sheets */}
                    {uploadedWeekSheets.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-4 bg-white rounded-2xl border-2 border-indigo-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-extrabold text-slate-900 text-sm">
                                {mat.title}
                              </h5>
                              <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {mat.subject}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                PDF أصلي
                              </span>
                              <span className="text-[11px] text-slate-400 font-semibold">
                                • {mat.fileSize}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                              {mat.subtitle || 'Uploaded weekly practice sheet'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => setPdfViewerTarget(mat)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="عرض ملف الـ PDF بتنسيقه الأصلي"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>عرض PDF</span>
                          </button>

                          <a
                            href={mat.fileUrl || mat.fileData}
                            download={mat.fileName || `${mat.title}.pdf`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="تحميل الملف"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تحميل</span>
                          </a>

                          <button
                            onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                            title="حذف هذا الملف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Default Week Sheets */}
                    {weekData && weekData.sheets.length > 0 &&
                      weekData.sheets.map((sheet) => (
                        <div
                          key={sheet.id}
                          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-extrabold text-slate-900 text-sm">
                                  {sheet.title}
                                </h5>
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                                  {sheet.subject}
                                </span>
                                {sheet.pages && (
                                  <span className="text-[11px] text-slate-400 font-semibold">
                                    • {sheet.pages}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 font-medium">
                                {sheet.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => handleDownloadMock(sheet.title)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Sheet</span>
                            </button>
                          </div>
                        </div>
                      ))}

                    {totalSheetsCount === 0 && (
                      <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-600">
                          No sheets uploaded for Week {weekNum} yet
                        </p>
                        <p className="text-xs text-slate-400">
                          Check back when new materials are released or upload via Admin Panel.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>


        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Active view: <strong className="text-slate-800">Block {selectedBlockNumber}</strong> &bull;{' '}
            <strong className="text-amber-600">
              {selectedSection === 'main-sheet'
                ? 'Main sheet'
                : `Week ${selectedSection.replace('week-', '')}`}
            </strong>
          </div>
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>

      {/* PDF Full View Modal */}
      {pdfViewerTarget && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setPdfViewerTarget(null)}
          title={pdfViewerTarget.title}
          fileUrl={pdfViewerTarget.fileUrl || pdfViewerTarget.fileData || ''}
          fileName={pdfViewerTarget.fileName}
          fileSize={pdfViewerTarget.fileSize}
          subject={pdfViewerTarget.subject}
          blockNumber={pdfViewerTarget.blockNumber}
          sectionLabel={
            pdfViewerTarget.section === 'main-sheet'
              ? 'Main sheet'
              : `Week ${pdfViewerTarget.section.replace('week-', '')}`
          }
        />
      )}

      {/* Upload Material Modal */}
      {isUploadModalOpen && (
        <UploadMaterialModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          defaultBlockNumber={uploadModalTarget.blockNumber}
          defaultSection={uploadModalTarget.section}
          onSuccess={(newMat) => {
            setSelectedBlockNumber(newMat.blockNumber);
            setSelectedSection(newMat.section);
            setSuccessNotice(`تم رفع وإضافة ملف "${newMat.title}" في مكانه بنجاح!`);
            setTimeout(() => {
              setSuccessNotice(null);
            }, 4000);
          }}
        />
      )}
    </div>
  );
};
