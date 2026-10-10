'use client';

import React, { useState } from 'react';
import {
  Home,
  Users,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  X,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  Paperclip,
} from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, MahallaItem, FileAttachment } from '@/context/DataContext';

export default function MahallaPage() {
  const { filteredMahallas, addMahalla, updateMahalla, deleteMahalla, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MahallaItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [chairman, setChairman] = useState('');
  const [population, setPopulation] = useState(3500);
  const [households, setHouseholds] = useState(800);
  const [problemRate, setProblemRate] = useState(95);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  // Viewer state
  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setChairman('');
    setPopulation(3500);
    setHouseholds(800);
    setProblemRate(95);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: MahallaItem) => {
    setEditingItem(item);
    setName(item.name);
    setChairman(item.chairman);
    setPopulation(item.population);
    setHouseholds(item.households);
    setProblemRate(item.problemRate);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu mahallani o'chirmoqchimisiz?")) {
      deleteMahalla(id);
    }
  };

  const handleOpenDoc = (att: FileAttachment) => {
    setViewerAttachment(att);
    setViewerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Strict Validations
    if (!name.trim()) {
      setValidationError("Mahalla nomini kiriting.");
      return;
    }
    if (!chairman.trim()) {
      setValidationError("Mahalla raisi F.I.Sh. ni kiriting.");
      return;
    }
    if (population <= 0) {
      setValidationError("Aholi soni noldan katta bo'lishi shart.");
      return;
    }
    if (households <= 0) {
      setValidationError("Xonadonlar soni noldan katta bo'lishi shart.");
      return;
    }
    if (population < households) {
      setValidationError("Aholi soni xonadonlar sonidan kam bo'lishi mantiqqa to'g'ri kelmaydi (kamida 1 kishi / xonadon).");
      return;
    }
    if (population > households * 12) {
      setValidationError("Xonadondagi o'rtacha aholi soni 12 kishidan oshmasligi kerak. Ko'rsatkichlarni tekshiring.");
      return;
    }
    if (problemRate < 0 || problemRate > 100) {
      setValidationError("Murojaatlar hal etilishi foizi 0 va 100 oralig'ida bo'lishi kerak.");
      return;
    }

    const payload = {
      name,
      chairman,
      population,
      households,
      problemRate,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'mahalla',
        moduleTitle: "Mahalla ma'lumotlari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateMahalla({ ...payload, id: editingItem.id });
      } else {
        addMahalla(payload);
      }
    }

    setShowModal(false);
  };

  const totalPop = filteredMahallas.reduce((s, m) => s + m.population, 0);
  const totalHouseholds = filteredMahallas.reduce((s, m) => s + m.households, 0);

  const columns = [
    { key: 'name', label: 'Mahalla nomi (MFY)', sortable: true },
    { key: 'chairman', label: 'Mahalla raisi', sortable: true },
    {
      key: 'population',
      label: 'Aholi soni',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'households',
      label: 'Xonadonlar soni',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'problemRate',
      label: 'Murojaatlar hal etilishi',
      sortable: true,
      render: (val: number) => (
        <span className={`badge ${val >= 95 ? 'badge-success' : val >= 90 ? 'badge-info' : 'badge-warning'}`}>
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
            onClick={() => handleOpenDoc(att)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 transition-colors"
            title={att.name}
          >
            {att.name.endsWith('.xlsx') || att.name.endsWith('.xls') || att.name.endsWith('.csv') ? (
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
      render: (_: any, row: MahallaItem) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Tahrirlash"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="O'chirish"
          >
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
          <h1 className="text-2xl font-bold text-gray-900">Mahallalar kesimida ijtimoiy holat</h1>
          <p className="text-sm text-gray-500 mt-1">
            Angor tumani MFYlari, aholi, xonadonlar va murojaatlar monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi mahalla qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami mahallalar"
          value={`${filteredMahallas.length} ta`}
          period="MFYlar soni"
          icon={<Home size={24} />}
          color="blue"
        />
        <KpiCard
          title="Jami aholi"
          value={totalPop > 0 ? `${totalPop.toLocaleString('uz-UZ')} kishi` : "0 kishi"}
          period="Mahallalarda ro'yxatda"
          icon={<Users size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Jami xonadonlar"
          value={totalHouseholds > 0 ? `${totalHouseholds.toLocaleString('uz-UZ')} ta` : "0 ta"}
          period="Xonadonlar soni"
          icon={<Home size={24} />}
          color="indigo"
        />
        <KpiCard
          title="O'rtacha samaradorlik"
          value="95.2%"
          period="Muammolarni hal etish"
          icon={<CheckCircle size={24} />}
          color="teal"
        />
      </div>

      <DataTable
        title="Mahallalar ro'yxati va ko'rsatkichlari"
        columns={columns}
        data={filteredMahallas}
        searchPlaceholder="Mahalla yoki raisni qidirish..."
        onAdd={openAdd}
        addLabel="Yangi mahalla"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {/* Manual Entry & Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Mahallani tahrirlash" : "Yangi mahalla qo'shish"}
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
                <label className="form-label">Mahalla nomi (MFY)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Angor MFY"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Mahalla raisi (F.I.Sh.)</label>
                <input
                  type="text"
                  value={chairman}
                  onChange={e => setChairman(e.target.value)}
                  placeholder="Masalan: Aliyev Rustam Qodirovich"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Aholi soni</label>
                  <input
                    type="number"
                    min="1"
                    value={population}
                    onChange={e => setPopulation(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Xonadonlar soni</label>
                  <input
                    type="number"
                    min="1"
                    value={households}
                    onChange={e => setHouseholds(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Murojaatlar hal etilishi (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={problemRate}
                  onChange={e => setProblemRate(Number(e.target.value))}
                  className="form-input"
                  required
                />
              </div>

              {/* Attachment File Uploader */}
              <AttachmentUploader
                attachment={attachment}
                onChange={setAttachment}
                label="Asoslovchi hisobot fayli (PDF/Excel)"
              />

              {!editingItem && (
                <div className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <input
                    type="checkbox"
                    id="draftCheckbox"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftCheckbox" className="cursor-pointer">
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

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        attachment={viewerAttachment}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
