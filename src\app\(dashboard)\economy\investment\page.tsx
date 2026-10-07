'use client';

import React, { useState } from 'react';
import { Landmark, TrendingUp, Globe, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';

interface InvestmentItem {
  id: number;
  country: string;
  companyName: string;
  sector: string;
  plannedAmount: number;
  actualAmount: number;
  status: string;
}

const initialData: InvestmentItem[] = [
  { id: 1, country: "Germaniya", companyName: "Knauf Gips Toshkent", sector: "Qurilish materiallari", plannedAmount: 15000000, actualAmount: 14200000, status: "Jarayonda" },
  { id: 2, country: "Turkiya", companyName: "Beko Textile Invest", sector: "To'qimachilik", plannedAmount: 8500000, actualAmount: 8500000, status: "Yakunlangan" },
  { id: 3, country: "Xitoy", companyName: "Silk Road Solar Energy", sector: "Yashil energetika", plannedAmount: 22000000, actualAmount: 18000000, status: "Jarayonda" },
  { id: 4, country: "Janubiy Koreya", companyName: "Hansol Medical Tech", sector: "Tibbiy texnika", plannedAmount: 6000000, actualAmount: 4800000, status: "Jarayonda" },
  { id: 5, country: "BAA", companyName: "Emirates Agro Logistics", sector: "Agrologistika", plannedAmount: 12000000, actualAmount: 5000000, status: "Kechikmoqda" },
];

export default function InvestmentPage() {
  const [data, setData] = useState<InvestmentItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InvestmentItem | null>(null);

  const [country, setCountry] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [plannedAmount, setPlannedAmount] = useState(5000000);
  const [actualAmount, setActualAmount] = useState(4000000);
  const [status, setStatus] = useState('Jarayonda');

  const openAdd = () => {
    setEditingItem(null);
    setCountry('');
    setCompanyName('');
    setSector('');
    setPlannedAmount(5000000);
    setActualAmount(4000000);
    setStatus('Jarayonda');
    setShowModal(true);
  };

  const openEdit = (item: InvestmentItem) => {
    setEditingItem(item);
    setCountry(item.country);
    setCompanyName(item.companyName);
    setSector(item.sector);
    setPlannedAmount(item.plannedAmount);
    setActualAmount(item.actualAmount);
    setStatus(item.status);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu investitsiya loyihasini o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, country, companyName, sector, plannedAmount, actualAmount, status } : d));
    } else {
      setData([{ id: Date.now(), country, companyName, sector, plannedAmount, actualAmount, status }, ...data]);
    }
    setShowModal(false);
  };

  const totalPlanned = data.reduce((s, d) => s + d.plannedAmount, 0);
  const totalActual = data.reduce((s, d) => s + d.actualAmount, 0);

  const columns = [
    { key: 'country', label: 'Investor davlat', sortable: true },
    { key: 'companyName', label: 'Loyiha / Korxona nomi', sortable: true },
    { key: 'sector', label: 'Sanoat sohasi', sortable: true },
    {
      key: 'plannedAmount',
      label: 'Reja ($ USD)',
      sortable: true,
      render: (val: number) => `$${(val / 1000000).toFixed(1)} mln`,
    },
    {
      key: 'actualAmount',
      label: 'O\'zlashtirildi ($ USD)',
      sortable: true,
      render: (val: number) => `$${(val / 1000000).toFixed(1)} mln`,
    },
    {
      key: 'status',
      label: 'Holati',
      sortable: true,
      render: (val: string) => (
        <span className={`badge ${val === 'Yakunlangan' ? 'badge-success' : val === 'Kechikmoqda' ? 'badge-danger' : 'badge-info'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: InvestmentItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">To&apos;g&apos;ridan-to&apos;g&apos;ri xorijiy investitsiyalar</h1>
          <p className="text-sm text-gray-500 mt-1">Xorijiy investorlar ishtirokidagi loyihalar va kapital kiritish dinamikasi</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi investitsiya loyihasi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Rejalashtirilgan" value={`$${(totalPlanned / 1000000).toFixed(1)} mln`} subtitle="Yillik portfel" icon={<Landmark size={24} />} color="blue" />
        <KpiCard title="O'zlashtirildi" value={`$${(totalActual / 1000000).toFixed(1)} mln`} subtitle="Amalda jalb etilgan" icon={<TrendingUp size={24} />} color="green" trend={{ value: 16.8, label: "o'sish" }} />
        <KpiCard title="O'zlashtirish foizi" value={`${((totalActual / totalPlanned) * 100).toFixed(1)}%`} subtitle="Umumiy samaradorlik" icon={<Landmark size={24} />} color="purple" />
        <KpiCard title="Faol loyihalar" value={`${data.length} ta`} subtitle="Investorlar soni" icon={<Globe size={24} />} color="teal" />
      </div>

      <DataTable
        title="Xorijiy investitsiya loyihalari ro'yxati"
        columns={columns}
        data={data}
        searchPlaceholder="Davlat yoki korxona nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi loyiha"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Loyihani tahrirlash" : "Yangi investitsiya loyihasi"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Investor davlat</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Korxona / Loyiha nomi</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Sanoat sohasi</label>
                <input type="text" value={sector} onChange={e => setSector(e.target.value)} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Reja ($ USD)</label>
                  <input type="number" value={plannedAmount} onChange={e => setPlannedAmount(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Amalda ($ USD)</label>
                  <input type="number" value={actualAmount} onChange={e => setActualAmount(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Holati</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="form-input">
                  <option value="Jarayonda">Jarayonda</option>
                  <option value="Yakunlangan">Yakunlangan</option>
                  <option value="Kechikmoqda">Kechikmoqda</option>
                </select>
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
