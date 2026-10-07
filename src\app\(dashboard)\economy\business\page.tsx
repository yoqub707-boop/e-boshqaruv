'use client';

import React, { useState } from 'react';
import { Store, TrendingUp, Users, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import { StatsBarChart } from '@/components/dashboard/StatsChart';

interface BusinessItem {
  id: number;
  name: string;
  inn: string;
  entityType: string;
  sector: string;
  employees: number;
  annualRevenue: string;
  status: string;
}

const initialData: BusinessItem[] = [
  { id: 1, name: "Chilonzor Tekstil MCHJ", inn: "302456789", entityType: "MCHJ", sector: "To'qimachilik", employees: 240, annualRevenue: "14.5 mlrd so'm", status: "Faol" },
  { id: 2, name: "Orient Agro Plast XK", inn: "305123987", entityType: "XK", sector: "Qishloq xo'jaligi", employees: 85, annualRevenue: "4.8 mlrd so'm", status: "Faol" },
  { id: 3, name: "Grand Polimer Savdo AJ", inn: "201987654", entityType: "AJ", sector: "Kimyo sanoati", employees: 320, annualRevenue: "28.0 mlrd so'm", status: "Faol" },
  { id: 4, name: "YTT Karimov Dilshod", inn: "587412365", entityType: "YTT", sector: "Savdo va xizmat", employees: 12, annualRevenue: "850 mln so'm", status: "Faol" },
  { id: 5, name: "Smart Auto Servis MCHJ", inn: "308965412", entityType: "MCHJ", sector: "Avtoservis", employees: 45, annualRevenue: "2.1 mlrd so'm", status: "Faol" },
];

export default function BusinessPage() {
  const [data, setData] = useState<BusinessItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BusinessItem | null>(null);

  const [name, setName] = useState('');
  const [inn, setInn] = useState('');
  const [entityType, setEntityType] = useState('MCHJ');
  const [sector, setSector] = useState('Sanoat');
  const [employees, setEmployees] = useState(10);
  const [annualRevenue, setAnnualRevenue] = useState('1.0 mlrd so\'m');

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setInn('');
    setEntityType('MCHJ');
    setSector('Sanoat');
    setEmployees(10);
    setAnnualRevenue('1.0 mlrd so\'m');
    setShowModal(true);
  };

  const openEdit = (item: BusinessItem) => {
    setEditingItem(item);
    setName(item.name);
    setInn(item.inn);
    setEntityType(item.entityType);
    setSector(item.sector);
    setEmployees(item.employees);
    setAnnualRevenue(item.annualRevenue);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu korxonani ro'yxatdan o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, name, inn, entityType, sector, employees, annualRevenue } : d));
    } else {
      setData([{ id: Date.now(), name, inn, entityType, sector, employees, annualRevenue, status: "Faol" }, ...data]);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'name', label: 'Korxona nomi', sortable: true },
    { key: 'inn', label: 'INN', sortable: true },
    { key: 'entityType', label: 'Tashkiliy shakli', sortable: true },
    { key: 'sector', label: 'Faoliyat sohasi', sortable: true },
    { key: 'employees', label: 'Xodimlar soni', sortable: true },
    { key: 'annualRevenue', label: 'Yillik aylanma', sortable: true },
    {
      key: 'status',
      label: 'Holati',
      render: (val: string) => <span className="badge badge-success">{val}</span>,
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: BusinessItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Tadbirkorlik subyektlari</h1>
          <p className="text-sm text-gray-500 mt-1">Hududda ro&apos;yxatdan o&apos;tgan va faoliyat yuritayotgan biznes korxonalari</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi korxona qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Faol korxonalar" value={data.length + 4345} subtitle="Jami subyektlar" icon={<Store size={24} />} color="purple" trend={{ value: 6.2, label: "o'sish" }} />
        <KpiCard title="Yangi tashkil etildi" value="385 ta" subtitle="Joriy yilda" icon={<Plus size={24} />} color="green" trend={{ value: 14.5, label: "reja 108%" }} />
        <KpiCard title="Band qilinganlar" value="34,200" subtitle="Biznes sektorida" icon={<Users size={24} />} color="blue" />
        <KpiCard title="Umumiy aylanma" value="1.42 trln" subtitle="So'mda" icon={<TrendingUp size={24} />} color="orange" trend={{ value: 8.9, label: "o'sish" }} />
      </div>

      <DataTable
        title="Tadbirkorlik korxonalari reyestri"
        columns={columns}
        data={data}
        searchPlaceholder="Korxona nomi yoki INN bo'yicha qidirish..."
        onAdd={openAdd}
        addLabel="Yangi korxona"
        onExport={() => alert("Excel fayl yuklanmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Korxonani tahrirlash" : "Yangi korxona qo'shish"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Korxona / Firma nomi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">INN (Soliq to'lovchi raqami)</label>
                <input type="text" value={inn} onChange={e => setInn(e.target.value)} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Tashkiliy shakl</label>
                  <select value={entityType} onChange={e => setEntityType(e.target.value)} className="form-input">
                    <option value="MCHJ">MCHJ</option>
                    <option value="XK">XK</option>
                    <option value="AJ">AJ</option>
                    <option value="YTT">YTT</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Xodimlar soni</label>
                  <input type="number" value={employees} onChange={e => setEmployees(Number(e.target.value))} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Faoliyat sohasi</label>
                <input type="text" value={sector} onChange={e => setSector(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Yillik aylanma</label>
                <input type="text" value={annualRevenue} onChange={e => setAnnualRevenue(e.target.value)} className="form-input" required />
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
