'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  Users,
  Target,
  Plus,
  Edit,
  Trash2,
  X,
  FileSpreadsheet,
  FileText,
  AlertCircle,
} from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, EmploymentItem, FileAttachment } from '@/context/DataContext';

export default function EmploymentPage() {
  const { filteredEmployments, addEmployment, updateEmployment, deleteEmployment, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EmploymentItem | null>(null);

  const [sector, setSector] = useState('');
  const [plannedJobs, setPlannedJobs] = useState(1000);
  const [actualJobs, setActualJobs] = useState(1050);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setSector('');
    setPlannedJobs(1000);
    setActualJobs(1050);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: EmploymentItem) => {
    setEditingItem(item);
    setSector(item.sector);
    setPlannedJobs(item.plannedJobs);
    setActualJobs(item.actualJobs);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu bandlik ma'lumotini o'chirmoqchimisiz?")) {
      deleteEmployment(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!sector.trim()) {
      setValidationError("Soha nomini kiriting.");
      return;
    }
    if (plannedJobs <= 0) {
      setValidationError("Rejadagi ish o'rinlari noldan katta bo'lishi kerak.");
      return;
    }
    if (actualJobs < 0) {
      setValidationError("Amaldagi ish o'rinlari manfiy bo'lishi mumkin emas.");
      return;
    }

    const executionRate = Math.round((actualJobs / plannedJobs) * 1000) / 10;
    const payload = {
      sector,
      plannedJobs,
      actualJobs,
      executionRate,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'employment',
        moduleTitle: "Bandlik dasturi",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateEmployment({ ...payload, id: editingItem.id });
      } else {
        addEmployment(payload);
      }
    }

    setShowModal(false);
  };

  const totalPlanned = filteredEmployments.reduce((s, e) => s + e.plannedJobs, 0);
  const totalActual = filteredEmployments.reduce((s, e) => s + e.actualJobs, 0);
  const avgRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : '0';

  const columns = [
    { key: 'sector', label: 'Iqtisodiy soha / Yo\'nalish', sortable: true },
    {
      key: 'plannedJobs',
      label: 'Reja (ish o\'rni)',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'actualJobs',
      label: 'Amalda yaratilgan',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'executionRate',
      label: 'Bajarilishi',
      sortable: true,
      render: (val: number) => (
        <span className={`badge ${val >= 100 ? 'badge-success' : val >= 90 ? 'badge-info' : 'badge-danger'}`}>
          {val}%
        </span>
      ),
    },
    {
      key: 'attachment',
      label: 'Hujjat',
      render: (att: FileAttachment | null) => (
        att ? (
          <button
            onClick={() => { setViewerAttachment(att); setViewerOpen(true); }}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 transition-colors"
            title={att.name}
          >
            {att.name.endsWith('.xlsx') || att.name.endsWith('.xls') ? (
              <FileSpreadsheet size={13} className="text-emerald-600" />
            ) : (
              <FileText size={13} className="text-blue-600" />
            )}
            <span className="max-w-[70px] truncate">{att.name}</span>
          </button>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: EmploymentItem) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit size={15} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aholi bandligi va yangi ish o&apos;rinlari</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tarmoqlar va sohalar kesimida yangi ish o&apos;rinlari yaratish dasturi monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi soha qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Yaratilgan ish o'rinlari"
          value={totalActual > 0 ? `${totalActual.toLocaleString('uz-UZ')} ta` : "0"}
          period="Amaldagi natija"
          icon={<Briefcase size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Rejalashtirilgan"
          value={totalPlanned > 0 ? `${totalPlanned.toLocaleString('uz-UZ')} ta` : "0"}
          period="Yillik dastur"
          icon={<Target size={24} />}
          color="blue"
        />
        <KpiCard
          title="Dastur bajarilishi"
          value={`${avgRate}%`}
          period="Umumiy ijro"
          icon={<TrendingUp size={24} />}
          color={Number(avgRate) >= 100 ? 'emerald' : 'amber'}
        />
        <KpiCard
          title="Qamrab olingan sohalar"
          value={`${filteredEmployments.length} ta`}
          period="Iqtisodiy tarmoqlar"
          icon={<Users size={24} />}
          color="indigo"
        />
      </div>

      <DataTable
        title="Sohalar bo'yicha yangi ish o'rinlari taqsimoti"
        columns={columns}
        data={filteredEmployments}
        searchPlaceholder="Sohani qidirish..."
        onAdd={openAdd}
        addLabel="Yangi soha"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Sohani tahrirlash" : "Yangi soha qo'shish"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {validationError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Soha / Tarmoq nomi</label>
                <input
                  type="text"
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  placeholder="Masalan: Kichik biznes va xususiy tadbirkorlik"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Rejadagi ish o&apos;rni</label>
                  <input
                    type="number"
                    min="1"
                    value={plannedJobs}
                    onChange={e => setPlannedJobs(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Amalda yaratilgan</label>
                  <input
                    type="number"
                    min="0"
                    value={actualJobs}
                    onChange={e => setActualJobs(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <AttachmentUploader
                attachment={attachment}
                onChange={setAttachment}
                label="Asoslovchi hisobot fayli (PDF/Excel)"
              />

              {!editingItem && (
                <div className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <input
                    type="checkbox"
                    id="draftEmp"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftEmp" className="cursor-pointer">
                    Qoralama sifatida yuborish (Tasdiqlash navbatiga qo&apos;shish)
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? "Yangilash" : sendToDraft ? "Qoralamaga yuborish" : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DocumentViewerModal
        attachment={viewerAttachment}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
