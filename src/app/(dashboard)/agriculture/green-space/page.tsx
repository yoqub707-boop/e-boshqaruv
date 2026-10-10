'use client';

import React, { useState } from 'react';
import {
  Leaf,
  Sun,
  MapPin,
  Plus,
  Edit,
  Trash2,
  X,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  Zap,
} from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, GreenItem, FileAttachment } from '@/context/DataContext';

export default function GreenSpacePage() {
  const { filteredGreenSpaces, addGreenSpace, updateGreenSpace, deleteGreenSpace, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GreenItem | null>(null);

  const [name, setName] = useState('');
  const [spaceType, setSpaceType] = useState('Tuman istirohat bog\'i');
  const [area, setArea] = useState(15.0);
  const [treesPlanted, setTreesPlanted] = useState(12000);
  const [plannedTrees, setPlannedTrees] = useState(15000);
  const [solarPanels, setSolarPanels] = useState(32);
  const [solarCapacity, setSolarCapacity] = useState(15.0);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setSpaceType('Tuman istirohat bog\'i');
    setArea(15.0);
    setTreesPlanted(12000);
    setPlannedTrees(15000);
    setSolarPanels(32);
    setSolarCapacity(15.0);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: GreenItem) => {
    setEditingItem(item);
    setName(item.name);
    setSpaceType(item.spaceType);
    setArea(item.area);
    setTreesPlanted(item.treesPlanted);
    setPlannedTrees(item.plannedTrees);
    setSolarPanels(item.solarPanels);
    setSolarCapacity(item.solarCapacity);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu yashil hudud ma'lumotini o'chirmoqchimisiz?")) {
      deleteGreenSpace(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError("Hudud nomini kiriting.");
      return;
    }
    if (area <= 0) {
      setValidationError("Maydon (ga) noldan katta bo'lishi kerak.");
      return;
    }
    if (plannedTrees <= 0) {
      setValidationError("Rejadagi daraxtlar soni noldan katta bo'lishi kerak.");
      return;
    }
    if (treesPlanted < 0) {
      setValidationError("Ekilgan daraxtlar soni manfiy bo'lishi mumkin emas.");
      return;
    }
    if (solarPanels < 0 || solarCapacity < 0) {
      setValidationError("Quyosh panellari ko'rsatkichlari manfiy bo'lishi mumkin emas.");
      return;
    }

    const payload = {
      name,
      spaceType,
      area,
      treesPlanted,
      plannedTrees,
      solarPanels,
      solarCapacity,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'green',
        moduleTitle: "Yashil makon",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateGreenSpace({ ...payload, id: editingItem.id });
      } else {
        addGreenSpace(payload);
      }
    }

    setShowModal(false);
  };

  const totalTrees = filteredGreenSpaces.reduce((s, g) => s + g.treesPlanted, 0);
  const totalPlanned = filteredGreenSpaces.reduce((s, g) => s + g.plannedTrees, 0);
  const totalArea = filteredGreenSpaces.reduce((s, g) => s + g.area, 0);
  const totalSolarCap = filteredGreenSpaces.reduce((s, g) => s + g.solarCapacity, 0);

  const columns = [
    { key: 'name', label: 'Hudud nomi', sortable: true },
    { key: 'spaceType', label: 'Hudud turi', sortable: true },
    {
      key: 'area',
      label: 'Maydoni (ga)',
      sortable: true,
      render: (val: number) => `${val} ga`,
    },
    {
      key: 'treesPlanted',
      label: 'Ekilgan daraxtlar',
      sortable: true,
      render: (val: number, row: GreenItem) => (
        <div>
          <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
          <span className="text-xs text-gray-400"> / {row.plannedTrees.toLocaleString('uz-UZ')}</span>
        </div>
      ),
    },
    {
      key: 'solarPanels',
      label: 'Quyosh panellari',
      sortable: true,
      render: (val: number, row: GreenItem) => `${val} dona (${row.solarCapacity} kVt)`,
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
      render: (_: any, row: GreenItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">&quot;Yashil makon&quot; va Yashil energetika</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daraxt ekish umummilliy loyihasi va quyosh energetikasi joriy etilishi monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi yashil hudud qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Ekilgan daraxtlar"
          value={totalTrees > 0 ? `${totalTrees.toLocaleString('uz-UZ')} tup` : "0"}
          period="Amalda ekilgan"
          icon={<Leaf size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Rejalashtirilgan ko'chat"
          value={totalPlanned > 0 ? `${totalPlanned.toLocaleString('uz-UZ')} tup` : "0"}
          period="Mavsumiy reja"
          icon={<MapPin size={24} />}
          color="blue"
        />
        <KpiCard
          title="Umumiy yashil maydon"
          value={`${totalArea.toFixed(1)} ga`}
          period="Tuman bo'yicha"
          icon={<Sun size={24} />}
          color="green"
        />
        <KpiCard
          title="Quyosh energiyasi quvvati"
          value={`${totalSolarCap.toFixed(1)} kVt`}
          period="Yashil energiya manbalari"
          icon={<Zap size={24} />}
          color="amber"
        />
      </div>

      <DataTable
        title="Yashil hududlar va loyihalar ro'yxati"
        columns={columns}
        data={filteredGreenSpaces}
        searchPlaceholder="Hudud nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi hudud"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Yashil hududni tahrirlash" : "Yangi yashil hudud qo'shish"}
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
                <label className="form-label">Hudud yoki ob&apos;ekt nomi</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Angor 'Yashil makon' istirohat bog'i"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Hudud turi</label>
                  <input
                    type="text"
                    value={spaceType}
                    onChange={e => setSpaceType(e.target.value)}
                    placeholder="Masalan: Istirohat bog'i"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Maydoni (ga)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Ekilgan daraxtlar</label>
                  <input
                    type="number"
                    min="0"
                    value={treesPlanted}
                    onChange={e => setTreesPlanted(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Rejadagi daraxtlar</label>
                  <input
                    type="number"
                    min="1"
                    value={plannedTrees}
                    onChange={e => setPlannedTrees(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Quyosh panellari (dona)</label>
                  <input
                    type="number"
                    min="0"
                    value={solarPanels}
                    onChange={e => setSolarPanels(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Quyosh quvvati (kVt)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={solarCapacity}
                    onChange={e => setSolarCapacity(Number(e.target.value))}
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
                    id="draftGreen"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftGreen" className="cursor-pointer">
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
