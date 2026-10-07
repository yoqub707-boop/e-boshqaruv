'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp, Globe, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import { StatsBarChart } from '@/components/dashboard/StatsChart';

interface TradeItem {
  id: number;
  country: string;
  type: string;
  productType: string;
  amount: number;
  volume: string;
}

const initialData: TradeItem[] = [
  { id: 1, country: "Rossiya", type: "Eksport", productType: "To'qimachilik va ip-kalava", amount: 4800000, volume: "1,200 t" },
  { id: 2, country: "Xitoy", type: "Import", productType: "Asbob-uskunalar va texnika", amount: 8200000, volume: "650 t" },
  { id: 3, country: "Qozog'iston", type: "Eksport", productType: "Qurilish materiallari", amount: 3100000, volume: "4,500 t" },
  { id: 4, country: "Turkiya", type: "Eksport", productType: "Quritilgan mevalar", amount: 2200000, volume: "800 t" },
  { id: 5, country: "Germaniya", type: "Import", productType: "Tibbiyot va farmatsevtika", amount: 1900000, volume: "45 t" },
];

export default function ExportImportPage() {
  const [data, setData] = useState<TradeItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TradeItem | null>(null);

  const [country, setCountry] = useState('');
  const [type, setType] = useState('Eksport');
  const [productType, setProductType] = useState('');
  const [amount, setAmount] = useState(1000000);
  const [volume, setVolume] = useState('100 t');

  const openAdd = () => {
    setEditingItem(null);
    setCountry('');
    setType('Eksport');
    setProductType('');
    setAmount(1000000);
    setVolume('100 t');
    setShowModal(true);
  };

  const openEdit = (item: TradeItem) => {
    setEditingItem(item);
    setCountry(item.country);
    setType(item.type);
    setProductType(item.productType);
    setAmount(item.amount);
    setVolume(item.volume);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu ma'lumotni o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, country, type, productType, amount, volume } : d));
    } else {
      setData([{ id: Date.now(), country, type, productType, amount, volume }, ...data]);
    }
    setShowModal(false);
  };

  const totalExport = data.filter(d => d.type === "Eksport").reduce((s, d) => s + d.amount, 0);
  const totalImport = data.filter(d => d.type === "Import").reduce((s, d) => s + d.amount, 0);

  const columns = [
    { key: 'country', label: 'Davlat', sortable: true },
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
      label: 'Qiymati (USD)',
      sortable: true,
      render: (val: number) => `$${val.toLocaleString()}`,
    },
    { key: 'volume', label: 'Hajmi', sortable: true },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: TradeItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Eksport va Import statistikasi</h1>
          <p className="text-sm text-gray-500 mt-1">Tashqi savdo aylanmasi, davlatlar va mahsulotlar kesimida tahlil</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi ma&apos;lumot kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Umumiy eksport" value={`$${(totalExport / 1000000).toFixed(1)} mln`} subtitle="Yillik ko'rsatkich" icon={<ArrowLeftRight size={24} />} color="green" trend={{ value: 12.4, label: "o'sish" }} />
        <KpiCard title="Umumiy import" value={`$${(totalImport / 1000000).toFixed(1)} mln`} subtitle="Xomashyo va uskunalar" icon={<Globe size={24} />} color="blue" />
        <KpiCard title="Savdo saldosi" value={`+$${((totalExport - totalImport) / 1000000).toFixed(1)} mln`} subtitle="Ijobiy farq" icon={<TrendingUp size={24} />} color="purple" />
        <KpiCard title="Hamkor davlatlar" value="28 ta" subtitle="Eksport geografiyasi" icon={<Globe size={24} />} color="teal" />
      </div>

      <DataTable
        title="Tashqi savdo aylanmasi ro'yxati"
        columns={columns}
        data={data}
        searchPlaceholder="Davlat yoki mahsulot nomi bo'yicha qidirish..."
        onAdd={openAdd}
        addLabel="Yangi yozuv"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Ma'lumotni tahrirlash" : "Yangi tashqi savdo yozuvi"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Davlat nomi</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Amaliyot turi</label>
                <select value={type} onChange={e => setType(e.target.value)} className="form-input">
                  <option value="Eksport">Eksport</option>
                  <option value="Import">Import</option>
                </select>
              </div>
              <div>
                <label className="form-label">Mahsulot guruhi</label>
                <input type="text" value={productType} onChange={e => setProductType(e.target.value)} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Qiymati ($ USD)</label>
                  <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Hajmi (tonna)</label>
                  <input type="text" value={volume} onChange={e => setVolume(e.target.value)} className="form-input" required />
                </div>
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
