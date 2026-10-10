'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  MapPin,
  Car,
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
import { useData, MarketItem, FileAttachment } from '@/context/DataContext';

export default function MarketsPage() {
  const { filteredMarkets, addMarket, updateMarket, deleteMarket, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketItem | null>(null);

  const [name, setName] = useState('');
  const [marketType, setMarketType] = useState('Oziq-ovqat va qishloq xo\'jaligi');
  const [totalStalls, setTotalStalls] = useState(300);
  const [occupiedStalls, setOccupiedStalls] = useState(270);
  const [area, setArea] = useState(8000);
  const [address, setAddress] = useState('');
  const [hasParking, setHasParking] = useState(true);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setMarketType('Oziq-ovqat va qishloq xo\'jaligi');
    setTotalStalls(300);
    setOccupiedStalls(270);
    setArea(8000);
    setAddress('');
    setHasParking(true);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: MarketItem) => {
    setEditingItem(item);
    setName(item.name);
    setMarketType(item.marketType);
    setTotalStalls(item.totalStalls);
    setOccupiedStalls(item.occupiedStalls);
    setArea(item.area);
    setAddress(item.address);
    setHasParking(item.hasParking);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu bozor ma'lumotini o'chirmoqchimisiz?")) {
      deleteMarket(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError("Bozor nomini kiriting.");
      return;
    }
    if (totalStalls <= 0) {
      setValidationError("Jami savdo o'rinlari soni noldan katta bo'lishi kerak.");
      return;
    }
    if (occupiedStalls < 0) {
      setValidationError("Band savdo o'rinlari manfiy bo'lishi mumkin emas.");
      return;
    }
    if (occupiedStalls > totalStalls) {
      setValidationError("Band o'rinlar jami o'rinlardan ko'p bo'lishi mumkin emas.");
      return;
    }
    if (area <= 0) {
      setValidationError("Maydon noldan katta bo'lishi kerak.");
      return;
    }

    const payload = {
      name,
      marketType,
      totalStalls,
      occupiedStalls,
      area,
      address,
      hasParking,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'market',
        moduleTitle: "Bozorlar va savdo majmualari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateMarket({ ...payload, id: editingItem.id });
      } else {
        addMarket(payload);
      }
    }

    setShowModal(false);
  };

  const totalStallsCount = filteredMarkets.reduce((s, m) => s + m.totalStalls, 0);
  const occupiedStallsCount = filteredMarkets.reduce((s, m) => s + m.occupiedStalls, 0);
  const occupancyRate = totalStallsCount > 0 ? ((occupiedStallsCount / totalStallsCount) * 100).toFixed(1) : '0';

  const columns = [
    { key: 'name', label: 'Bozor / Majmua nomi', sortable: true },
    { key: 'marketType', label: 'Turi', sortable: true },
    {
      key: 'totalStalls',
      label: 'Jami o\'rinlar',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'occupiedStalls',
      label: 'Band o\'rinlar',
      sortable: true,
      render: (val: number, row: MarketItem) => (
        <div>
          <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
          <span className="text-xs text-gray-400"> ({Math.round((val / row.totalStalls) * 100)}%)</span>
        </div>
      ),
    },
    {
      key: 'area',
      label: 'Maydoni (kv.m)',
      sortable: true,
      render: (val: number) => `${val.toLocaleString('uz-UZ')} m²`,
    },
    {
      key: 'hasParking',
      label: 'Avtoturargoh',
      sortable: true,
      render: (val: boolean) => (
        <span className={`badge ${val ? 'badge-success' : 'badge-danger'}`}>
          {val ? 'Mavjud' : 'Mavjud emas'}
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
      render: (_: any, row: MarketItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Bozorlar va savdo majmualari</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dehqon, buyum va ixtisoslashgan savdo komplekslari sig&apos;imi va bandlik monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi bozor qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami bozorlar"
          value={`${filteredMarkets.length} ta`}
          period="Savdo majmualari"
          icon={<ShoppingBag size={24} />}
          color="blue"
        />
        <KpiCard
          title="Savdo o'rinlari"
          value={totalStallsCount > 0 ? `${totalStallsCount.toLocaleString('uz-UZ')} ta` : "0"}
          period="Jami rastalar"
          icon={<Store size={24} />}
          color="indigo"
        />
        <KpiCard
          title="O'rinlar bandligi"
          value={`${occupancyRate}%`}
          period="Band savdo o'rinlari"
          icon={<MapPin size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Avtoturargoh qamrovi"
          value="100%"
          period="Transport qulayligi"
          icon={<Car size={24} />}
          color="teal"
        />
      </div>

      <DataTable
        title="Bozorlar va savdo komplekslari ro'yxati"
        columns={columns}
        data={filteredMarkets}
        searchPlaceholder="Bozor nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi bozor"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Bozorni tahrirlash" : "Yangi bozor qo'shish"}
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
                <label className="form-label">Bozor nomi</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Angor markaziy dehqon bozori"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Bozor turi</label>
                <input
                  type="text"
                  value={marketType}
                  onChange={e => setMarketType(e.target.value)}
                  placeholder="Masalan: Oziq-ovqat va dehqon bozori"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Jami savdo o&apos;rinlari</label>
                  <input
                    type="number"
                    min="1"
                    value={totalStalls}
                    onChange={e => setTotalStalls(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Band o&apos;rinlar</label>
                  <input
                    type="number"
                    min="0"
                    value={occupiedStalls}
                    onChange={e => setOccupiedStalls(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="form-label">Manzili</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Masalan: Angor shaharchasi"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-xs">
                <input
                  type="checkbox"
                  id="parkingCheck"
                  checked={hasParking}
                  onChange={e => setHasParking(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="parkingCheck" className="cursor-pointer font-medium text-gray-700">
                  Avtoturargoh mavjud
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
                    id="draftMkt"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftMkt" className="cursor-pointer">
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
