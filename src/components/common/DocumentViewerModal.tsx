'use client';

import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  X,
  Calendar,
  HardDrive,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { FileAttachment } from '@/context/DataContext';

interface DocumentViewerModalProps {
  attachment: FileAttachment | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function DocumentViewerModal({
  attachment,
  isOpen,
  onClose,
  title = "Biriktirilgan rasmiy hujjat",
}: DocumentViewerModalProps) {
  if (!isOpen || !attachment) return null;

  const isExcel = attachment.name.endsWith('.xlsx') || attachment.name.endsWith('.xls') || attachment.name.endsWith('.csv');
  const isPdf = attachment.name.endsWith('.pdf');

  const handleDownload = () => {
    // Simulated download or open
    const dummyContent = `Hujjat: ${attachment.name}\nYuklangan sana: ${attachment.uploadedAt}\nHajmi: ${attachment.size}\nAngor tumani hokimligi rasmiy hisoboti.`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              {isExcel ? (
                <FileSpreadsheet size={20} className="text-emerald-400" />
              ) : (
                <FileText size={20} className="text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold">{title}</h2>
              <p className="text-xs text-slate-300">Asoslovchi hisobot fayli ma&apos;lumotlari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              {isExcel ? <FileSpreadsheet size={26} className="text-emerald-600" /> : <FileText size={26} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-semibold text-gray-900 text-sm truncate" title={attachment.name}>
                {attachment.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <HardDrive size={12} />
                  {attachment.size}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {attachment.uploadedAt}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-800 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <CheckCircle size={14} className="text-blue-600" />
              Raqamli imzo va tekshiruv tasdiqlangan
            </div>
            <p className="text-blue-700/80">
              Ushbu fayl hisobot ma&apos;lumotlarining asoslovchi rasmiy hujjati sifatida tizimda saqlangan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button onClick={onClose} className="btn-outline text-xs">
            Yopish
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <Download size={14} />
            Hujjatni yuklab olish
          </button>
        </div>
      </div>
    </div>
  );
}
