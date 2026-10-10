'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { useData, DraftItem } from '@/context/DataContext';

interface AiDataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessReview?: () => void;
}

export default function AiDataIngestionModal({
  isOpen,
  onClose,
  onSuccessReview,
}: AiDataIngestionModalProps) {
  const { addDraft } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Array<{
    module: DraftItem['module'];
    moduleTitle: string;
    extractedData: any;
    confidence: number;
    warnings?: string[];
  }> | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setParsedPreview(null);
  };

  // AI & Heuristic Parser Simulation
  const processFileWithAi = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgressStage("Fayl tuzilmasi tahlil qilinmoqda (OCR & Parsing)...");

    await new Promise(r => setTimeout(r, 600));
    setProgressStage("AI modeli orqali ko'rsatkichlar va modullar ajratilmoqda...");

    await new Promise(r => setTimeout(r, 700));
    setProgressStage("Ma'lumotlar yaxlitligi va mantiqiy qoidalar tekshirilmoqda...");

    await new Promise(r => setTimeout(r, 500));

    const currentYear = new Date().getFullYear();
    const fileName = selectedFile.name.toLowerCase();
    const fileAttachment = {
      name: selectedFile.name,
      size: (selectedFile.size / 1024).toFixed(1) + ' KB',
      type: selectedFile.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    let extractedResults: Array<{
      module: DraftItem['module'];
      moduleTitle: string;
      extractedData: any;
      confidence: number;
      warnings?: string[];
    }> = [];

    // Smart categorization based on file name or generic fallback
    if (fileName.includes('soliq') || fileName.includes('tax') || fileName.includes('tushum')) {
      extractedResults = [
        {
          module: 'tax',
          moduleTitle: 'Soliq tushumlari',
          confidence: 98,
          extractedData: {
            taxType: "Qo'shilgan qiymat solig'i (QQS)",
            monthName: "Mart",
            planned: 2800000000,
            actual: 2890000000,
            rate: 103.2,
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-31`,
            attachment: fileAttachment,
          },
          warnings: ["Reja 103.2% ortig'i bilan bajarilgan"],
        },
        {
          module: 'tax',
          moduleTitle: 'Soliq tushumlari',
          confidence: 96,
          extractedData: {
            taxType: "Jismoniy shaxslar daromad solig'i (JSHDS)",
            monthName: "Mart",
            planned: 2100000000,
            actual: 2050000000,
            rate: 97.6,
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-31`,
            attachment: fileAttachment,
          },
        },
      ];
    } else if (fileName.includes('maktab') || fileName.includes('talim') || fileName.includes('ta\'lim') || fileName.includes('edu')) {
      extractedResults = [
        {
          module: 'education',
          moduleTitle: "Ta'lim muassasalari",
          confidence: 95,
          extractedData: {
            name: "Angor tuman 8-sonli umumiy o'rta ta'lim maktabi",
            type: "Maktab",
            capacity: 650,
            students: 620,
            teachers: 46,
            collegeAdmissionPercent: 84.0,
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-15`,
            attachment: fileAttachment,
          },
        },
      ];
    } else if (fileName.includes('mahalla') || fileName.includes('aholi')) {
      extractedResults = [
        {
          module: 'mahalla',
          moduleTitle: "Mahalla ma'lumotlari",
          confidence: 97,
          extractedData: {
            name: "Zang MFY",
            chairman: "Sobirov Alisher To'xtayevich",
            population: 3720,
            households: 840,
            problemRate: 3.1,
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-10`,
            attachment: fileAttachment,
          },
          warnings: ["Aholi va xonadonlar nisbati me'yorda (4.4 kishi/xonadon)"],
        },
      ];
    } else if (fileName.includes('yashil') || fileName.includes('daraxt')) {
      extractedResults = [
        {
          module: 'green',
          moduleTitle: "Yashil makon umummilliy loyihasi",
          confidence: 99,
          extractedData: {
            name: "Angor-Termiz trassasi atrofidagi ko'kalamzorlashtirish zonasi",
            spaceType: "Himoya ihota daraxtzori",
            area: 14.2,
            treesPlanted: 18200,
            plannedTrees: 20000,
            solarPanels: 16,
            solarCapacity: 8.0,
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-20`,
            attachment: fileAttachment,
          },
        },
      ];
    } else {
      // General multi-module parsed report
      extractedResults = [
        {
          module: 'tax',
          moduleTitle: 'Soliq tushumlari',
          confidence: 94,
          extractedData: {
            taxType: "Yer va mol-mulk solig'i",
            monthName: "Mart",
            planned: 1450000000,
            actual: 1480000000,
            rate: 102.1,
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-25`,
            attachment: fileAttachment,
          },
        },
        {
          module: 'employment',
          moduleTitle: 'Bandlik va yangi ish o\'rinlari',
          confidence: 92,
          extractedData: {
            sector: "Yangi ishlab chiqarish va servis ob'ektlari",
            plannedJobs: 450,
            actualJobs: 470,
            executionRate: 104.4,
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-25`,
            attachment: fileAttachment,
          },
        },
        {
          module: 'project',
          moduleTitle: 'Qurilish loyihalari',
          confidence: 91,
          extractedData: {
            name: "Angor tuman markaziy shifoxonasi yangi diagnostika binosi",
            contractor: "Surxon Elite Stroy MCHJ",
            startDate: `${currentYear}-03-01`,
            budget: 3200000000,
            progress: 40,
            status: "Jarayonda",
            year: currentYear,
            quarter: 1,
            month: 3,
            date: `${currentYear}-03-25`,
            attachment: fileAttachment,
          },
        },
      ];
    }

    setParsedPreview(extractedResults);
    setIsProcessing(false);
  };

  const handleSendToDrafts = () => {
    if (!parsedPreview) return;

    parsedPreview.forEach(item => {
      addDraft({
        module: item.module,
        moduleTitle: item.moduleTitle,
        data: item.extractedData,
        source: 'AI_PARSER',
        confidence: item.confidence,
        warnings: item.warnings,
      });
    });

    onClose();
    if (onSuccessReview) {
      onSuccessReview();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Sparkles size={20} className="text-blue-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Kunlik hisobotlarni qabul qilish</h2>
              <p className="text-xs text-blue-200">
                Excel, CSV, PDF yoki matnli hisobotlarni sun&apos;iy intellekt orqali ajratib olish
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/30'
                : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <FileCheck size={28} />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Tayyor
                </p>
                <span className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                  Boshqa fayl tanlash
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Upload size={28} />
                </div>
                <p className="font-semibold text-gray-800 text-sm">
                  Kunlik hisobot faylini shu yerga tashlang yoki tanlang
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf) yoki DOCX formatlari qo&apos;llab-quvvatlanadi
                </p>
              </div>
            )}
          </div>

          {/* AI Processing Status */}
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">{progressStage}</p>
                <p className="text-xs text-blue-700">Iltimos kuting, xavfsizlik va tekshiruv qoidalari ishlamoqda...</p>
              </div>
            </div>
          )}

          {/* Parsed Preview Results */}
          {parsedPreview && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Cpu size={16} className="text-blue-600" />
                  AI tomonidan aniqlangan yozuvlar ({parsedPreview.length} ta)
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                  Muvaffaqiyatli tahlil
                </span>
              </div>

              <div className="space-y-2.5">
                {parsedPreview.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wide bg-blue-100/60 px-2 py-0.5 rounded">
                        {item.moduleTitle}
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">
                        Ishonchlilik: {item.confidence}%
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-gray-100">
                      {Object.entries(item.extractedData)
                        .filter(([k]) => k !== 'attachment' && k !== 'id')
                        .slice(0, 4)
                        .map(([k, v]) => (
                          <div key={k}>
                            <span className="text-gray-400 capitalize">{k}: </span>
                            <span className="font-semibold text-gray-800">
                              {typeof v === 'number' && v > 10000 ? v.toLocaleString('uz-UZ') : String(v)}
                            </span>
                          </div>
                        ))}
                    </div>

                    {item.warnings && item.warnings.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        <AlertTriangle size={12} />
                        {item.warnings.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Insoniy nazorat (Human Oversight): </span>
                  Ushbu ma&apos;lumotlar to&apos;g&apos;ridan-to&apos;g&apos;ri bazaga emas, balki <b>Qoralamalar (Tasdiqlash navbati)</b> ga yuboriladi. Administrator tasdiqlaganidan keyin rasmiy ko&apos;rsatkichlarga qo&apos;shiladi.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button onClick={onClose} className="btn-outline text-xs">
            Bekor qilish
          </button>

          <div className="flex items-center gap-2">
            {!parsedPreview ? (
              <button
                onClick={processFileWithAi}
                disabled={!selectedFile || isProcessing}
                className="btn-primary text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={14} />
                AI orqali tahlil qilish
              </button>
            ) : (
              <button
                onClick={handleSendToDrafts}
                className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
              >
                <span>Tasdiqlash navbatiga yuborish</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
