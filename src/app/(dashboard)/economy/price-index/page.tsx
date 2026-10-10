'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
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
import { useData, PriceItem, FileAttachment } from '@/context/DataContext';

export default function PriceIndexPage() {
  const { filteredPrices, addPrice, updatePrice, deletePrice, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Oziq-ovqat');
  const [currentPrice, setCurrentPrice] = useState(15000);
  const [prevPrice, setPrevPrice] = useState(14500);
  const [unit, setUnit] = useState('kg');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setProductName('');
    setCategory('Oziq-ovqat');
    setCurrentPrice(15000);
    setPrevPrice(14500);
    setUnit('kg');
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: PriceItem) => {
    setEditingItem(item);
    setProductName(item.productName);
    setCategory(item.category);
    setCurrentPrice(item.currentPrice);
    setPrevPrice(item.prevPrice);
    setUnit(item.unit);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu narx ma'lumotini o'chirmoqchimisiz?")) {
      deletePrice(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!productName.trim()) {
      setValidationError("Mahsulot nomini kiriting.");
      return;
    }
    if (currentPrice <= 0) {
      setValidationError("Joriy narx noldan katta bo'lishi kerak.");
      return;
    }
    if (prevPrice <= 0) {
      setValidationError("Oldingi narx noldan katta bo'lishi kerak.");
      return;
    }

    const changePercent = Math.round(((currentPrice - prevPrice) / prevPrice) * 1000) / 10;
    const payload = {
      productName,
      category,
      currentPrice,
      prevPrice,
      changePercent,
      unit,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'price',
        moduleTitle: "Iste'mol narxlari indeksi",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updatePrice({ ...payload, id: editingItem.id });
      } else {
        addPrice(payload);
      }
    }

    setShowModal(false);
  };

  const avgChange = filteredPrices.length > 0
    ? (filteredPrices.reduce((s, p) => s + p.changePercent, 0) / filteredPrices.length).toFixed(1)
    : '0';

  const columns = [
    { key: 'productName', label: 'Mahsulot nomi', sortable: true },
    { key: 'category', label: 'Kategoriya', sortable: true },
    {
      key: 'currentPrice',
      label: 'Joriy narx (so\'m)',
      sortable: true,
      render: (val: number, row: PriceItem) => (
        <span className="font-semibold text-gray-900">
          {val.toLocaleString('uz-UZ')} so&apos;m / {row.unit}
        </span>
      ),
    },
    {
      key: 'prevPrice',
      label: 'Oldingi davr',
      sortable: true,
      render: (val: number, row: PriceItem) => `${val.toLocaleString('uz-UZ')} so'm / ${row.unit}`,
    },
    {
      key: 'changePercent',
      label: 'O\'zgarish',
      sortable: true,
      render: (val: number) => {
        const isUp = val > 0;
        const isZero = val === 0;
        return (
          <span
            className={`badge flex items-center gap-1 ${
              isZero ? 'badge-info' : isUp ? 'badge-danger' : 'badge-success'
            }`}
          >
            {isZero ? '' : isUp ? '+' : ''}
            {val}%
          </span>
        );
      },
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
      render: (_: any, row: PriceItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Iste&apos;mol narxlari va narx-navo indeksi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Asosiy turdagi oziq-ovqat va nooziq-ovqat mahsulotlari narxlari monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi mahsulot narxi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Kuzatilayotgan tovarlar"
          value={`${filteredPrices.length} turdagi`}
          period="Iste'mol savatchasi"
          icon={<ShoppingCart size={24} />}
          color="blue"
        />
        <KpiCard
          title="O'rtacha narx o'zgarishi"
          value={`${Number(avgChange) > 0 ? '+' : ''}${avgChange}%`}
          period="Oylik dinamika"
          icon={<BarChart3 size={24} />}
          color={Number(avgChange) <= 2 ? 'emerald' : 'amber'}
        />
        <KpiCard
          title="Narxi barqaror mahsulotlar"
          value={`${filteredPrices.filter(p => p.changePercent === 0).length} ta`}
          period="O'zgarishsiz"
          icon={<TrendingDown size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Narxi oshgan mahsulotlar"
          value={`${filteredPrices.filter(p => p.changePercent > 0).length} ta`}
          period="Nazoratda"
          icon={<TrendingUp size={24} />}
          color="red"
        />
      </div>

      <DataTable
        title="Ijtimoiy ahamiyatga ega mahsulotlar narxlari"
        columns={columns}
        data={filteredPrices}
        searchPlaceholder="Mahsulot nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi mahsulot"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Mahsulot narxini tahrirlash" : "Yangi mahsulot narxi qo'shish"}
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
                <label className="form-label">Mahsulot nomi</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="Masalan: Qolipli non (1-nav)"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Kategoriya</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="Oziq-ovqat">Oziq-ovqat</option>
                    <option value="Qishloq xo'jaligi">Qishloq xo&apos;jaligi</option>
                    <option value="Dori vositalari">Dori vositalari</option>
                    <option value="Yoqilg'i-energetika">Yoqilg&apos;i-energetika</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">O&apos;lchov birligi</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="Masalan: kg, litr, dona"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Joriy narx (so&apos;m)</label>
                  <input
                    type="number"
                    min="1"
                    value={currentPrice}
                    onChange={e => setCurrentPrice(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Oldingi narx (so&apos;m)</label>
                  <input
                    type="number"
                    min="1"
                    value={prevPrice}
                    onChange={e => setPrevPrice(Number(e.target.value))}
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
                    id="draftPrc"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftPrc" className="cursor-pointer">
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
