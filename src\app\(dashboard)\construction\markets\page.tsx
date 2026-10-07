'use client';

import React, { useState } from 'react';
import { ShoppingBag, Store, CheckCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';

interface MarketItem {
  id: number;
  name: string;
  marketType: string;
  totalStalls: number;
  occupiedStalls: number;
  area: number;
  address: string;
  hasParking: boolean;
}

const initialData: MarketItem[] = [
  { id: 1, name: "Chilonzor dehqon bozori", marketType: "Dehqon bozori", totalStalls: 650, occupiedStalls: 590, area: 12000, address: "Farhod ko'chasi 1", hasParking: true },
  { id: 2, name: "Qatortol savdo majmuasi", marketType: "Savdo markazi", totalStalls: 420, occupiedStalls: 395, area: 8500, address: "Qatortol ko'chasi 28", hasParking: true },
  { id: 3, name: "Buyum bozori (Eski shahar)", marketType: "Kiyim-kechak", totalStalls: 800, occupiedStalls: 710, area: 15000, address: "Navoiy 105", hasParking: true },
  { id: 4, name: "Gullar va ko'chatlar bozori", marketType: "Ixtisoslashgan", totalStalls: 150, occupiedStalls: 130, area: 3000, address: "Bodomzor 4", hasParking: false },
];

export default function MarketsPage() {
  const [data, setData] = useState<MarketItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketItem | null>(null);

  const [name, setName] = useState('');
  const [marketType, setMarketType] = useState('Dehqon bozori');
  const [totalStalls, setTotalStalls] = useState(500);
  const [occupiedStalls, setOccupiedStalls] = useState(450);
  const [area, setArea] = useState(5000);
  const [address, setAddress] = useState('');
  const [hasParking, setHasParking] = useState(true);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setMarketType('Dehqon bozori');
    setTotalStalls(500);
    setOccupiedStalls(450);
    setArea(5000);
    setAddress('');
    setHasParking(true);
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
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu bozorni o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, name, marketType, totalStalls, occupiedStalls, area, address, hasParking } : d));
    } else {
      setData([{ id: Date.now(), name, marketType, totalStalls, occupiedStalls, area, address, hasParking }, ...data]);
    }
    setShowModal(false);
  };

  const totalStallsSum = data.reduce((s, d) => s + d.totalStalls, 0);
  const occupiedStallsSum = data.reduce((s, d) => s + d.occupiedStalls, 0);

  const columns = [
    { key: 'name', label: 'Bozor / Savdo majmuasi', sortable: true },
    { key: 'marketType', label: 'Turi', sortable: true },
    { key: 'totalStalls', label: 'Jami rastalar', sortable: true, render: (val: number) => `${val.toLocaleString()} ta` },
    { key: 'occupiedStalls', label: 'Band rastalar', sortable: true, render: (val: number) => `${val.toLocaleString()} ta` },
    {
      key: 'bandlik',
      label: 'Bandlik %',
      render: (_: any, row: MarketItem) => {
        const rate = row.totalStalls > 0 ? ((row.occupiedStalls / row.totalStalls) * 100).toFixed(1) : '0';
        return <span className="badge badge-success">{rate}%</span>;
      },
    },
    { key: 'area', label: 'Maydoni', sortable: true, render: (val: number) => `${val.toLocaleString()} m²` },
    { key: 'address', label: 'Manzili', sortable: true },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: MarketItem) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bozorlar va savdo komplekslari infratuzilmasi</h1>
          <p className="text-sm text-gray-500 mt-1">Savdo rastalari, sanitariya talablari va avtoturargohlar holati</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi bozor kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Bozorlar soni" value={`${data.length} ta`} subtitle="Tuman hududida" icon={<ShoppingBag size={24} />} color="blue" />
        <KpiCard title="Jami savdo rastalari" value={totalStallsSum.toLocaleString()} subtitle="Savdo o'rinlari" icon={<Store size={24} />} color="purple" />
        <KpiCard title="Bandlik darajasi" value={`${((occupiedStallsSum / totalStallsSum) * 100).toFixed(1)}%`} subtitle="Tadbirkorlar faol" icon={<CheckCircle size={24} />} color="green" />
        <KpiCard title="Umumiy savdo maydoni" value="38,500 m²" subtitle="Bozorlar hududi" icon={<Store size={24} />} color="teal" />
      </div>

      <DataTable
        title="Bozorlar va savdo majmualari ro'yxati"
        columns={columns}
        data={data}
        searchPlaceholder="Bozor nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi bozor"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Bozorni tahrirlash" : "Yangi bozor qo'shish"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Bozor / Savdo markazi nomi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Bozor turi</label>
                <select value={marketType} onChange={e => setMarketType(e.target.value)} className="form-input">
                  <option value="Dehqon bozori">Dehqon bozori</option>
                  <option value="Savdo markazi">Savdo markazi</option>
                  <option value="Kiyim-kechak">Kiyim-kechak bozori</option>
                  <option value="Ixtisoslashgan">Ixtisoslashgan bozor</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Jami rastalar soni</label>
                  <input type="number" value={totalStalls} onChange={e => setTotalStalls(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Band rastalar</label>
                  <input type="number" value={occupiedStalls} onChange={e => setOccupiedStalls(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Maydoni (m²)</label>
                  <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="form-input" required />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={hasParking} onChange={e => setHasParking(e.target.checked)} className="rounded text-primary-600 w-4 h-4" />
                    Avtoturargoh mavjud
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label">Manzili</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="form-input" required />
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
