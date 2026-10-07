'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';

interface PriceItem {
  id: number;
  productName: string;
  category: string;
  currentPrice: number;
  prevPrice: number;
  changePercent: number;
  unit: string;
}

const initialData: PriceItem[] = [
  { id: 1, productName: "Mol go'shti (lahm)", category: "Oziq-ovqat", currentPrice: 85000, prevPrice: 82000, changePercent: 3.6, unit: "kg" },
  { id: 2, productName: "O'simlik yog'i", category: "Oziq-ovqat", currentPrice: 16500, prevPrice: 17200, changePercent: -4.0, unit: "litr" },
  { id: 3, productName: "Shakar", category: "Oziq-ovqat", currentPrice: 13000, prevPrice: 13000, changePercent: 0.0, unit: "kg" },
  { id: 4, productName: "Kartoshka", category: "Qishloq xo'jaligi", currentPrice: 4500, prevPrice: 5000, changePercent: -10.0, unit: "kg" },
  { id: 5, productName: "Un (1-nav)", category: "Oziq-ovqat", currentPrice: 6200, prevPrice: 6000, changePercent: 3.3, unit: "kg" },
  { id: 6, productName: "Benzin AI-92", category: "Yoqilg'i", currentPrice: 10200, prevPrice: 9800, changePercent: 4.1, unit: "litr" },
];

export default function PriceIndexPage() {
  const [data, setData] = useState<PriceItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Oziq-ovqat');
  const [currentPrice, setCurrentPrice] = useState(10000);
  const [prevPrice, setPrevPrice] = useState(10000);
  const [unit, setUnit] = useState('kg');

  const openAdd = () => {
    setEditingItem(null);
    setProductName('');
    setCategory('Oziq-ovqat');
    setCurrentPrice(10000);
    setPrevPrice(10000);
    setUnit('kg');
    setShowModal(true);
  };

  const openEdit = (item: PriceItem) => {
    setEditingItem(item);
    setProductName(item.productName);
    setCategory(item.category);
    setCurrentPrice(item.currentPrice);
    setPrevPrice(item.prevPrice);
    setUnit(item.unit);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu mahsulot narxini o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const change = prevPrice > 0 ? Number((((currentPrice - prevPrice) / prevPrice) * 100).toFixed(1)) : 0;
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, productName, category, currentPrice, prevPrice, changePercent: change, unit } : d));
    } else {
      setData([{ id: Date.now(), productName, category, currentPrice, prevPrice, changePercent: change, unit }, ...data]);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'productName', label: 'Mahsulot / Xizmat nomi', sortable: true },
    { key: 'category', label: 'Kategoriya', sortable: true },
    {
      key: 'currentPrice',
      label: 'Joriy narx',
      sortable: true,
      render: (val: number, row: PriceItem) => `${val.toLocaleString()} so'm / ${row.unit}`,
    },
    {
      key: 'prevPrice',
      label: 'Oldingi narx',
      sortable: true,
      render: (val: number, row: PriceItem) => `${val.toLocaleString()} so'm / ${row.unit}`,
    },
    {
      key: 'changePercent',
      label: 'O\'zgarish %',
      sortable: true,
      render: (val: number) => (
        <span className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full ${val > 0 ? 'bg-red-50 text-red-600' : val < 0 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
          {val > 0 ? <TrendingUp size={12} /> : val < 0 ? <TrendingDown size={12} /> : null}
          {val > 0 ? `+${val}%` : `${val}%`}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: PriceItem) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Iste&apos;mol narxlari indeksi monitoringi</h1>
          <p className="text-sm text-gray-500 mt-1">Muhim ijtimoiy mahsulotlar va xizmatlar narxi dinamikasi</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi mahsulot kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="O'rtacha oylik inflyatsiya" value="0.6%" subtitle="Iste'mol savati" icon={<BarChart3 size={24} />} color="blue" />
        <KpiCard title="Arzonlashgan mahsulotlar" value="12 ta" subtitle="Mavsumiy pasayish" icon={<TrendingDown size={24} />} color="green" />
        <KpiCard title="Qimmatlashgan mahsulotlar" value="8 ta" subtitle="Monitoring doirasida" icon={<TrendingUp size={24} />} color="red" />
        <KpiCard title="Kuzatilayotgan tovarlar" value="48 tur" subtitle="Dehqon bozorlarida" icon={<BarChart3 size={24} />} color="purple" />
      </div>

      <DataTable
        title="Ijtimoiy ahamiyatga ega mahsulotlar narxlari jadvali"
        columns={columns}
        data={data}
        searchPlaceholder="Mahsulot nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi mahsulot"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Narxni tahrirlash" : "Yangi mahsulot qo'shish"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Mahsulot / Xizmat nomi</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Kategoriya</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="form-input">
                  <option value="Oziq-ovqat">Oziq-ovqat</option>
                  <option value="Qishloq xo'jaligi">Qishloq xo&apos;jaligi</option>
                  <option value="Yoqilg'i">Yoqilg&apos;i</option>
                  <option value="Kiyim-kechak">Kiyim-kechak</option>
                  <option value="Xizmatlar">Xizmatlar</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Joriy narx (so&apos;m)</label>
                  <input type="number" value={currentPrice} onChange={e => setCurrentPrice(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Oldingi narx (so&apos;m)</label>
                  <input type="number" value={prevPrice} onChange={e => setPrevPrice(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">O&apos;lchov birligi</label>
                <input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="form-input" placeholder="kg, litr, dona" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Bekor qilish</button>
                <button type="submit" className="btn-primary flex-1">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
