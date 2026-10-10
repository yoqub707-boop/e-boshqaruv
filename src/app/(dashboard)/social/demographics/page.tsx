'use client';

import React, { useState } from 'react';
import {
  Users,
  Baby,
  HeartCrack,
  Heart,
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
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, DemographicsItem, FileAttachment } from '@/context/DataContext';

export default function DemographicsPage() {
  const { filteredDemographics, addDemographics, updateDemographics, deleteDemographics, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DemographicsItem | null>(null);

  const [totalPopulation, setTotalPopulation] = useState(35000);
  const [maleCount, setMaleCount] = useState(17300);
  const [femaleCount, setFemaleCount] = useState(17700);
  const [birthRate, setBirthRate] = useState(18.5);
  const [deathRate, setDeathRate] = useState(4.2);
  const [marriages, setMarriages] = useState(250);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setTotalPopulation(35000);
    setMaleCount(17300);
    setFemaleCount(17700);
    setBirthRate(18.5);
    setDeathRate(4.2);
    setMarriages(250);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: DemographicsItem) => {
    setEditingItem(item);
    setTotalPopulation(item.totalPopulation);
    setMaleCount(item.maleCount);
    setFemaleCount(item.femaleCount);
    setBirthRate(item.birthRate);
    setDeathRate(item.deathRate);
    setMarriages(item.marriages);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu demografik hisobotni o'chirmoqchimisiz?")) {
      deleteDemographics(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (totalPopulation <= 0) {
      setValidationError("Jami aholi soni noldan katta bo'lishi kerak.");
      return;
    }
    if (maleCount < 0 || femaleCount < 0) {
      setValidationError("Erkaklar va ayollar soni manfiy bo'lishi mumkin emas.");
      return;
    }
    if (maleCount + femaleCount !== totalPopulation) {
      setValidationError("Erkaklar va ayollar soni yig'indisi jami aholiga teng bo'lishi kerak.");
      return;
    }

    const payload = {
      totalPopulation,
      maleCount,
      femaleCount,
      birthRate,
      deathRate,
      marriages,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'demographics',
        moduleTitle: "Demografik ko'rsatkichlar",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateDemographics({ ...payload, id: editingItem.id });
      } else {
        addDemographics(payload);
      }
    }

    setShowModal(false);
  };

  const currentPop = filteredDemographics.length > 0 ? filteredDemographics[0].totalPopulation : 0;
  const currentMales = filteredDemographics.length > 0 ? filteredDemographics[0].maleCount : 0;
  const currentFemales = filteredDemographics.length > 0 ? filteredDemographics[0].femaleCount : 0;

  const columns = [
    { key: 'year', label: 'Yil', sortable: true },
    {
      key: 'totalPopulation',
      label: 'Jami aholi',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'maleCount',
      label: 'Erkaklar',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'femaleCount',
      label: 'Ayollar',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'birthRate',
      label: 'Tug\'ilish (promille)',
      sortable: true,
      render: (val: number) => `${val}‰`,
    },
    {
      key: 'deathRate',
      label: 'O\'lim (promille)',
      sortable: true,
      render: (val: number) => `${val}‰`,
    },
    {
      key: 'marriages',
      label: 'Nikohlar',
      sortable: true,
      render: (val: number) => `${val} ta`,
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
      render: (_: any, row: DemographicsItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Demografiya va Aholi statistikasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aholi soni, jins va yosh tarkibi, tug&apos;ilish, o&apos;lim va nikohlar dinamikasi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi demografik hisobot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami aholi soni"
          value={currentPop > 0 ? `${currentPop.toLocaleString('uz-UZ')} kishi` : "0"}
          period="Doimiy aholi"
          icon={<Users size={24} />}
          color="blue"
        />
        <KpiCard
          title="Erkaklar salmog'i"
          value={currentMales > 0 ? `${currentMales.toLocaleString('uz-UZ')} (${Math.round((currentMales / (currentPop || 1)) * 100)}%)` : "0"}
          period="Erkaklar soni"
          icon={<Users size={24} />}
          color="indigo"
        />
        <KpiCard
          title="Ayollar salmog'i"
          value={currentFemales > 0 ? `${currentFemales.toLocaleString('uz-UZ')} (${Math.round((currentFemales / (currentPop || 1)) * 100)}%)` : "0"}
          period="Ayollar soni"
          icon={<HeartCrack size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Tabiiy o'sish"
          value="+14.3‰"
          period="Har 1000 kishiga"
          icon={<Baby size={24} />}
          color="teal"
        />
      </div>

      <DataTable
        title="Demografik ko'rsatkichlar dinamikasi"
        columns={columns}
        data={filteredDemographics}
        searchPlaceholder="Yil bo'yicha qidirish..."
        onAdd={openAdd}
        addLabel="Yangi hisobot"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Demografiyani tahrirlash" : "Yangi demografik hisobot qo'shish"}
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
                <label className="form-label">Jami aholi soni</label>
                <input
                  type="number"
                  min="1"
                  value={totalPopulation}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setTotalPopulation(val);
                    setMaleCount(Math.round(val * 0.495));
                    setFemaleCount(Math.round(val * 0.505));
                  }}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Erkaklar soni</label>
                  <input
                    type="number"
                    min="0"
                    value={maleCount}
                    onChange={e => setMaleCount(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Ayollar soni</label>
                  <input
                    type="number"
                    min="0"
                    value={femaleCount}
                    onChange={e => setFemaleCount(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="form-label text-[11px]">Tug&apos;ilish (‰)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={birthRate}
                    onChange={e => setBirthRate(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label text-[11px]">O&apos;lim (‰)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={deathRate}
                    onChange={e => setDeathRate(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label text-[11px]">Nikohlar soni</label>
                  <input
                    type="number"
                    value={marriages}
                    onChange={e => setMarriages(Number(e.target.value))}
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
                    id="draftDemo"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftDemo" className="cursor-pointer">
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
