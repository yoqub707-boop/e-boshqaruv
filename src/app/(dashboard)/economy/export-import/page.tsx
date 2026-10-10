'use client';

import React, { useState } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  Globe,
  DollarSign,
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
import { useData, TradeItem, FileAttachment } from '@/context/DataContext';

export default function ExportImportPage() {
  const { filteredTrades, addTrade, updateTrade, deleteTrade, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TradeItem | null>(null);

  const [country, setCountry] = useState('');
  const [type, setType] = useState<TradeItem['type']>('Eksport');
  const [productType, setProductType] = useState('');
  const [amount, setAmount] = useState(2500000);
  const [volume, setVolume] = useState('1,500 tonna');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setCountry('');
    setType('Eksport');
    setProductType('');
    setAmount(2500000);
    setVolume('1,500 tonna');
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: TradeItem) => {
    setEditingItem(item);
    setCountry(item.country);
    setType(item.type);
    setProductType(item.productType);
    setAmount(item.amount);
    setVolume(item.volume);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu savdo amaliyotini o'chirmoqchimisiz?")) {
      deleteTrade(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!country.trim()) {
      setValidationError("Hamkor davlat nomini kiriting.");
      return;
    }
    if (!productType.trim()) {
      setValidationError("Mahsulot turini kiriting.");
      return;
    }
    if (amount <= 0) {
      setValidationError("Summa ($ AQSH dollari) noldan katta bo'lishi kerak.");
      return;
    }

    const payload = {
      country,
      type,
      productType,
      amount,
      volume,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'trade',
        moduleTitle: "Tashqi savdo (Eksport/Import)",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateTrade({ ...payload, id: editingItem.id });
      } else {
        addTrade(payload);
      }
    }

    setShowModal(false);
  };

  const totalExport = filteredTrades.filter(t => t.type === 'Eksport').reduce((s, t) => s + t.amount, 0);
  const totalImport = filteredTrades.filter(t => t.type === 'Import').reduce((s, t) => s + t.amount, 0);
  const tradeBalance = totalExport - totalImport;

  const columns = [
    { key: 'country', label: 'Hamkor davlat', sortable: true },
    {
      key: 'type',
      label: 'Amaliyot turi',
      sortable: true,
      render: (val: string) => (
        <span className={`badge ${val === 'Eksport' ? 'badge-success' : 'badge-info'}`}>
          {val}
        </span>
      ),
    },
    { key: 'productType', label: 'Mahsulot turi', sortable: true },
    {
      key: 'amount',
      label: 'Qiymati ($)',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">${val.toLocaleString('uz-UZ')}</span>
      ),
    },
    { key: 'volume', label: 'Hajmi / Miqdori', sortable: true },
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
      render: (_: any, row: TradeItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Eksport va Import ko&apos;rsatkichlari</h1>
          <p className="text-sm text-gray-500 mt-1">
            Angor tumani korxonalari tomonidan amalga oshirilayotgan tashqi iqtisodiy faoliyat tahlili
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi savdo amaliyoti
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami eksport"
          value={totalExport > 0 ? `$${(totalExport / 1000000).toFixed(2)} mln` : "$0"}
          period="Mahsulotlar eksporti"
          icon={<ArrowLeftRight size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Jami import"
          value={totalImport > 0 ? `$${(totalImport / 1000000).toFixed(2)} mln` : "$0"}
          period="Texnologiya va xomashyo"
          icon={<Globe size={24} />}
          color="blue"
        />
        <KpiCard
          title="Tashqi savdo saldosi"
          value={`$${(tradeBalance / 1000000).toFixed(2)} mln`}
          period="Sof farq"
          icon={<DollarSign size={24} />}
          color={tradeBalance >= 0 ? 'emerald' : 'amber'}
        />
        <KpiCard
          title="Hamkor davlatlar"
          value={`${new Set(filteredTrades.map(t => t.country)).size} ta`}
          period="Eksport geografiyasi"
          icon={<TrendingUp size={24} />}
          color="indigo"
        />
      </div>

      <DataTable
        title="Tashqi savdo amaliyotlari reyestri"
        columns={columns}
        data={filteredTrades}
        searchPlaceholder="Davlat yoki mahsulotni qidirish..."
        onAdd={openAdd}
        addLabel="Yangi amaliyot"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Amaliyotni tahrirlash" : "Yangi savdo amaliyoti qo'shish"}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Hamkor davlat</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="Masalan: Rossiya"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Amaliyot turi</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Eksport">Eksport</option>
                    <option value="Import">Import</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Mahsulot / Xizmat turi</label>
                <input
                  type="text"
                  value={productType}
                  onChange={e => setProductType(e.target.value)}
                  placeholder="Masalan: Meva-sabzavot mahsulotlari"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Qiymati ($ AQSH dollari)</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Hajmi / Miqdori</label>
                  <input
                    type="text"
                    value={volume}
                    onChange={e => setVolume(e.target.value)}
                    placeholder="Masalan: 2,500 tonna"
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
                    id="draftTrd"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftTrd" className="cursor-pointer">
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
