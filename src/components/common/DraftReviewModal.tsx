'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  CheckCheck,
  X,
  Trash2,
  Edit2,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { useData, DraftItem } from '@/context/DataContext';

interface DraftReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DraftReviewModal({ isOpen, onClose }: DraftReviewModalProps) {
  const { drafts, approveDraft, approveAllDrafts, rejectDraft, clearDrafts } = useData();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  if (!isOpen) return null;

  const filteredDrafts = drafts.filter(d => {
    if (selectedFilter === 'ALL') return true;
    return d.status === selectedFilter;
  });

  const pendingCount = drafts.filter(d => d.status === 'PENDING').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <ShieldCheck size={22} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Qoralamalar va Tasdiqlash Navbati
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {pendingCount} ta kutilmoqda
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-300">
                AI orqali yuklangan yoki qo&apos;lda kiritilgan ma&apos;lumotlarni tekshirish va rasmiy bazaga kiritish
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

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'PENDING'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Tasdiqlash kutilmoqda ({drafts.filter(d => d.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setSelectedFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'APPROVED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Tasdiqlangan ({drafts.filter(d => d.status === 'APPROVED').length})
            </button>
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'ALL'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Barchasi ({drafts.length})
            </button>
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={approveAllDrafts}
                className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <CheckCheck size={14} />
                Barchasini tasdiqlash
              </button>
            </div>
          )}
        </div>

        {/* Drafts List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredDrafts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShieldCheck size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">
                {selectedFilter === 'PENDING'
                  ? "Tasdiqlashni kutayotgan qoralamalar mavjud emas."
                  : "Ma'lumotlar topilmadi."}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                AI fayl yuklash yoki qo&apos;lda kiritish orqali yangi hisobotlarni qo&apos;shishingiz mumkin.
              </p>
            </div>
          ) : (
            filteredDrafts.map(draft => (
              <div
                key={draft.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded">
                      {draft.moduleTitle}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(draft.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        draft.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : draft.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {draft.status === 'PENDING'
                        ? 'Kutilmoqda'
                        : draft.status === 'APPROVED'
                        ? 'Tasdiqlangan'
                        : 'Rad etilgan'}
                    </span>
                    <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Manba: {draft.source === 'AI_PARSER' ? 'AI Tahlil' : 'Qo\'lda kiritish'}
                    </span>
                  </div>

                  {/* Field details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg">
                    {Object.entries(draft.data)
                      .filter(([k]) => k !== 'attachment' && k !== 'id')
                      .slice(0, 6)
                      .map(([key, val]) => (
                        <div key={key} className="overflow-hidden text-ellipsis">
                          <span className="text-gray-400 capitalize">{key}: </span>
                          <span className="font-semibold text-gray-800">
                            {typeof val === 'number' && val > 10000 ? val.toLocaleString('uz-UZ') : String(val)}
                          </span>
                        </div>
                      ))}
                  </div>

                  {draft.data?.attachment && (
                    <div className="text-xs text-blue-600 flex items-center gap-1">
                      <FileSpreadsheet size={13} />
                      Biriktirilgan fayl: <span className="font-medium">{draft.data.attachment.name}</span> ({draft.data.attachment.size})
                    </div>
                  )}

                  {draft.warnings && draft.warnings.length > 0 && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
                      <AlertCircle size={12} />
                      {draft.warnings.join(', ')}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  {draft.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => approveDraft(draft.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                        title="Tasdiqlash va rasmiy bazaga kiritish"
                      >
                        <Check size={14} />
                        Tasdiqlash
                      </button>
                      <button
                        onClick={() => rejectDraft(draft.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 border border-red-200"
                        title="Rad etish"
                      >
                        <X size={14} />
                        Rad etish
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button onClick={clearDrafts} className="text-xs text-gray-400 hover:text-red-600">
            Qoralamalar tarixini tozalash
          </button>
          <button onClick={onClose} className="btn-primary text-xs">
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
