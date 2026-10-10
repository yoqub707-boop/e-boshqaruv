'use client';

import React, { useRef } from 'react';
import { Paperclip, FileCheck, X, FileSpreadsheet, FileText } from 'lucide-react';
import { FileAttachment } from '@/context/DataContext';

interface AttachmentUploaderProps {
  attachment: FileAttachment | null;
  onChange: (attachment: FileAttachment | null) => void;
  label?: string;
}

export default function AttachmentUploader({
  attachment,
  onChange,
  label = "Asoslovchi hisobot fayli (PDF/Excel)",
}: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAttachment: FileAttachment = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      onChange(newAttachment);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {attachment ? (
        <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            {attachment.name.endsWith('.xlsx') || attachment.name.endsWith('.xls') || attachment.name.endsWith('.csv') ? (
              <FileSpreadsheet size={16} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <FileText size={16} className="text-blue-600 flex-shrink-0" />
            )}
            <span className="font-semibold text-gray-800 truncate" title={attachment.name}>
              {attachment.name}
            </span>
            <span className="text-gray-500 text-[11px] flex-shrink-0">({attachment.size})</span>
          </div>

          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-white/80 transition-colors ml-2"
            title="Faylni o'chirish"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50/30 transition-all"
        >
          <Paperclip size={14} />
          <span>Fayl biriktirish (PDF, Excel, Word)</span>
        </button>
      )}
    </div>
  );
}
