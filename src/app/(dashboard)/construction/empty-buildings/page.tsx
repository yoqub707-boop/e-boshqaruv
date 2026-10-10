'use client';

import React, { useState } from 'react';
import {
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  X,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, EmptyBuildingItem, FileAttachment } from '@/context/DataContext';

export default function EmptyBuildingsPage() {
  const { filteredBuildings, addBuilding, updateBuilding, deleteBuilding, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EmptyBuildingItem | null>(null);

  const [name, setName] = useState('');
  const [buildingType, setBuildingType] = useState('Ishlab chiqarish maydoni');
  const [area, setArea] = useState(1200);
  const [address, setAddress] = useState('');
  const [ownerType, setOwnerType] = useState('Davlat mulki');
  const [condition, setCondition] = useState('O\'rtacha ta\'mirtalab');
  const [proposedUse, setProposedUse] = useState('Kichik sanoat zonasi');
  const [isOccupied, setIsOccupied] = useState(false);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setBuildingType('Ishlab chiqarish maydoni');
    setArea(1200);
    setAddress('');
    setOwnerType('Davlat mulki');
    setCondition('O\'rtacha ta\'mirtalab');
    setProposedUse('Kichik sanoat zonasi');
    setIsOccupied(false);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: EmptyBuildingItem) => {
    setEditingItem(item);
    setName(item.name);
    setBuildingType(item.buildingType);
    setArea(item.area);
    setAddress(item.address);
    setOwnerType(item.ownerType);
    setCondition(item.condition);
    setProposedUse(item.proposedUse);
    setIsOccupied(item.isOccupied);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu bo'sh bino yozuvini o'chirmoqchimisiz?")) {
      deleteBuilding(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError("Bino nomini kiriting.");
      return;
    }
    if (area <= 0) {
      setValidationError("Maydon (kv.m) noldan katta bo'lishi kerak.");
      return;
    }
    if (!address.trim()) {
      setValidationError("Manzilni kiriting.");
      return;
    }

    const payload = {
      name,
      buildingType,
      area,
      address,
      ownerType,
      condition,
      proposedUse,
      isOccupied,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'building',
        moduleTitle: "Bo'sh binolar va inshootlar",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateBuilding({ ...payload, id: editingItem.id });
      } else {
        addBuilding(payload);
      }
    }

    setShowModal(false);
  };

  const totalArea = filteredBuildings.reduce((s, b) => s + b.area, 0);
  const emptyCount = filteredBuildings.filter(b => !b.isOccupied).length;

  const columns = [
    { key: 'name', label: 'Bino / Ob\'ekt nomi', sortable: true },
    { key: 'buildingType', label: 'Turi', sortable: true },
    {
      key: 'area',
      label: 'Maydoni (kv.m)',
      sortable: true,
      render: (val: number) => `${val.toLocaleString('uz-UZ')} m²`,
    },
    { key: 'address', label: 'Manzili', sortable: true },
    { key: 'ownerType', label: 'Mulk shakli', sortable: true },
    {
      key: 'isOccupied',
      label: 'Bandlik holati',
      sortable: true,
      render: (val: boolean) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Foydalanilmoqda' : 'Bo\'sh turibdi'}
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
      render: (_: any, row: EmptyBuildingItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Bo&apos;sh turgan bino va inshootlar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Davlat va xususiy mulkdagi foydalanilmayotgan ob&apos;ektlar xatlovi va investitsiyaga takliflar
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi ob&apos;ekt qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami ob'ektlar"
          value={`${filteredBuildings.length} ta`}
          period="Xatlovdagi binolar"
          icon={<Building size={24} />}
          color="blue"
        />
        <KpiCard
          title="Bo'sh turganlar"
          value={`${emptyCount} ta`}
          period="Investitsiyaga tayyor"
          icon={<AlertCircle size={24} />}
          color="amber"
        />
        <KpiCard
          title="Umumiy maydon"
          value={`${totalArea.toLocaleString('uz-UZ')} m²`}
          period="Bino va inshootlar maydoni"
          icon={<MapPin size={24} />}
          color="indigo"
        />
        <KpiCard
          title="Foydalanishga kiritilgan"
          value={`${filteredBuildings.length - emptyCount} ta`}
          period="Tadbirkorlikka berilgan"
          icon={<CheckCircle2 size={24} />}
          color="emerald"
        />
      </div>

      <DataTable
        title="Bo'sh binolar va inshootlar reyestri"
        columns={columns}
        data={filteredBuildings}
        searchPlaceholder="Bino yoki manzilni qidirish..."
        onAdd={openAdd}
        addLabel="Yangi ob'ekt"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Ob'ektni tahrirlash" : "Yangi ob'ekt qo'shish"}
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
                <label className="form-label">Ob&apos;ekt nomi</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Sobiq ma'muriy idora binosi"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Bino turi</label>
                  <input
                    type="text"
                    value={buildingType}
                    onChange={e => setBuildingType(e.target.value)}
                    placeholder="Masalan: Ma'muriy bino"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Maydoni (kv.m)</label>
                  <input
                    type="number"
                    min="1"
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Manzili</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Masalan: Angor tumani, Tallimaron MFY"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Mulk shakli</label>
                  <select
                    value={ownerType}
                    onChange={e => setOwnerType(e.target.value)}
                    className="form-input"
                  >
                    <option value="Davlat mulki">Davlat mulki</option>
                    <option value="Munitsipal">Munitsipal</option>
                    <option value="Xususiy">Xususiy</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Holati</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    className="form-input"
                  >
                    <option value="Yaxshi">Yaxshi</option>
                    <option value="O'rtacha ta'mirtalab">O&apos;rtacha ta&apos;mirtalab</option>
                    <option value="Mukammal ta'mirtalab">Mukammal ta&apos;mirtalab</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Tavsiya etiladigan yo&apos;nalish</label>
                <input
                  type="text"
                  value={proposedUse}
                  onChange={e => setProposedUse(e.target.value)}
                  placeholder="Masalan: Kichik sanoat zonasi va tikuvchilik sexi"
                  className="form-input"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-xs">
                <input
                  type="checkbox"
                  id="occupiedCheck"
                  checked={isOccupied}
                  onChange={e => setIsOccupied(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="occupiedCheck" className="cursor-pointer font-medium text-gray-700">
                  Hozirda foydalanishga topshirilgan
                </label>
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
                    id="draftBld"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftBld" className="cursor-pointer">
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
