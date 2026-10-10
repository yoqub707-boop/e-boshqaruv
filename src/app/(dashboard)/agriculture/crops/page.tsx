'use client';

import React, { useState } from 'react';
import {
  Sprout,
  TrendingUp,
  MapPin,
  Calendar,
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
import { useData, CropItem, FileAttachment } from '@/context/DataContext';

export default function CropsPage() {
  const { filteredCrops, addCrop, updateCrop, deleteCrop, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CropItem | null>(null);

  const [cropType, setCropType] = useState('G\'o\'za (Paxta)');
  const [plantedArea, setPlantedArea] = useState(5000);
  const [expectedYield, setExpectedYield] = useState(18000);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setCropType('G\'o\'za (Paxta)');
    setPlantedArea(5000);
    setExpectedYield(18000);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: CropItem) => {
    setEditingItem(item);
    setCropType(item.cropType);
    setPlantedArea(item.plantedArea);
    setExpectedYield(item.expectedYield);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu ekin turi ma'lumotini o'chirmoqchimisiz?")) {
      deleteCrop(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!cropType.trim()) {
      setValidationError("Ekin turini kiriting.");
      return;
    }
    if (plantedArea <= 0) {
      setValidationError("Ekilgan maydon (ga) noldan katta bo'lishi kerak.");
      return;
    }
    if (expectedYield <= 0) {
      setValidationError("Kutilayotgan hosil (tonna) noldan katta bo'lishi kerak.");
      return;
    }

    const payload = {
      cropType,
      plantedArea,
      expectedYield,
      executionRate: 100.0,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'crop',
        moduleTitle: "Qishloq xo'jaligi ekinlari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateCrop({ ...payload, id: editingItem.id });
      } else {
        addCrop(payload);
      }
    }

    setShowModal(false);
  };

  const totalArea = filteredCrops.reduce((s, c) => s + c.plantedArea, 0);
  const totalYield = filteredCrops.reduce((s, c) => s + c.expectedYield, 0);

  const columns = [
    { key: 'cropType', label: 'Ekin turi', sortable: true },
    {
      key: 'plantedArea',
      label: 'Ekilgan maydon (ga)',
      sortable: true,
      render: (val: number) => `${val.toLocaleString('uz-UZ')} ga`,
    },
    {
      key: 'expectedYield',
      label: 'Kutilayotgan hosil (tonna)',
      sortable: true,
      render: (val: number) => `${val.toLocaleString('uz-UZ')} t`,
    },
    {
      key: 'executionRate',
      label: 'Ekish rejasi',
      sortable: true,
      render: (val: number) => (
        <span className="badge badge-success">{val}%</span>
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
      render: (_: any, row: CropItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Qishloq xo&apos;jaligi ekinlari</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paxta, g&apos;alla, meva-sabzavot va boshqa qishloq xo&apos;jaligi ekin maydonlari va hosildorlik tahlili
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi ekin maydoni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami ekin maydoni"
          value={totalArea > 0 ? `${totalArea.toLocaleString('uz-UZ')} ga` : "0 ga"}
          period="Gektar hisobida"
          icon={<Sprout size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Kutilayotgan umumiy hosil"
          value={totalYield > 0 ? `${totalYield.toLocaleString('uz-UZ')} t` : "0 t"}
          period="Prognoz ko'rsatkichi"
          icon={<TrendingUp size={24} />}
          color="blue"
        />
        <KpiCard
          title="Ekin turlari"
          value={`${filteredCrops.length} ta`}
          period="Agroklaster va fermerlar"
          icon={<MapPin size={24} />}
          color="indigo"
        />
        <KpiCard
          title="Reja ijrosi"
          value="100%"
          period="Ekish mavsumi"
          icon={<Calendar size={24} />}
          color="teal"
        />
      </div>

      <DataTable
        title="Ekin turlari va maydonlari"
        columns={columns}
        data={filteredCrops}
        searchPlaceholder="Ekin turini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi ekin"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Ekin ma'lumotini tahrirlash" : "Yangi ekin qo'shish"}
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
                <label className="form-label">Ekin turi</label>
                <input
                  type="text"
                  value={cropType}
                  onChange={e => setCropType(e.target.value)}
                  placeholder="Masalan: Paxta (G'o'za)"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Ekilgan maydon (ga)</label>
                  <input
                    type="number"
                    min="1"
                    value={plantedArea}
                    onChange={e => setPlantedArea(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Kutilayotgan hosil (tonna)</label>
                  <input
                    type="number"
                    min="1"
                    value={expectedYield}
                    onChange={e => setExpectedYield(Number(e.target.value))}
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
                    id="draftCrop"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftCrop" className="cursor-pointer">
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
