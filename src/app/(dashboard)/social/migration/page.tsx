'use client';

import React, { useState } from 'react';
import { Globe, ArrowUpRight, ArrowDownRight, MapPin, Plus, Edit, Trash2, X } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import DataTable from '@/components/common/DataTable';
import { StatsBarChart, StatsPieChart } from '@/components/dashboard/StatsChart';
import { useData, MigrationItem } from '@/context/DataContext';

export default function MigrationPage() {
  const { migrations, addMigration, updateMigration, deleteMigration } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MigrationItem | null>(null);

  const [country, setCountry] = useState('');
  const [code, setCode] = useState('RU');
  const [migrants, setMigrants] = useState(1000);
  const [returned, setReturned] = useState(200);
  const [type, setType] = useState('Mehnat');
  const [flag, setFlag] = useState('🌐');
  const [year, setYear] = useState(2024);

  const openAdd = () => {
    setEditingItem(null);
    setCountry('');
    setCode('UZ');
    setMigrants(1000);
    setReturned(200);
    setType('Mehnat');
    setFlag('🌐');
    setYear(2024);
    setShowModal(true);
  };

  const openEdit = (item: MigrationItem) => {
    setEditingItem(item);
    setCountry(item.country);
    setCode(item.code);
    setMigrants(item.migrants);
    setReturned(item.returned);
    setType(item.type);
    setFlag(item.flag);
    setYear(item.year);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu migratsiya ma'lumotini o'chirmoqchimisiz?")) {
      deleteMigration(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMigration({ id: editingItem.id, country, code, migrants, returned, type, flag, year });
    } else {
      addMigration({ country, code, migrants, returned, type, flag, year });
    }
    setShowModal(false);
  };

  const totalMigrants = migrations.reduce((sum, m) => sum + m.migrants, 0);
  const totalReturned = migrations.reduce((sum, m) => sum + m.returned, 0);

  const columns = [
    {
      key: 'country',
      label: 'Davlat',
      sortable: true,
      render: (val: string, row: MigrationItem) => (
        <div className="flex items-center gap-2">
          <span className="text-xl">{row.flag}</span>
          <span className="font-medium">{val}</span>
        </div>
      ),
    },
    { key: 'code', label: 'Kod', sortable: true },
    { key: 'year', label: 'Yil', sortable: true },
    {
      key: 'migrants',
      label: 'Migrantlar soni',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-orange-600">{val.toLocaleString()}</span>
      ),
    },
    {
      key: 'returned',
      label: 'Qaytganlar',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-green-600">{val.toLocaleString()}</span>
      ),
    },
    {
      key: 'type',
      label: 'Migratsiya turi',
      sortable: true,
      render: (val: string) => (
        <span className={`badge ${val === 'Mehnat' ? 'badge-info' : val === "Ta'lim" ? 'badge-success' : 'badge-warning'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: MigrationItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Tashqi mehnat migratsiyasi monitoringi</h1>
          <p className="text-sm text-gray-500 mt-1">Mehnat migratsiyasi, qaytgan fuqarolar va davlatlar bo&apos;yicha taqsimot</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi davlat / ma&apos;lumot qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami migrantlar"
          value={totalMigrants}
          subtitle="Barcha davlatlarda"
          icon={<Globe size={24} />}
          color="orange"
        />
        <KpiCard
          title="Qaytganlar"
          value={totalReturned}
          subtitle="Joriy yilda"
          icon={<ArrowDownRight size={24} />}
          color="green"
          trend={{ value: 12.5, label: "o'tgan davrga nisbatan" }}
        />
        <KpiCard
          title="Hozirda chet elda"
          value={totalMigrants - totalReturned}
          subtitle="Faol migrantlar"
          icon={<ArrowUpRight size={24} />}
          color="red"
        />
        <KpiCard
          title="Davlatlar soni"
          value={migrations.length}
          subtitle="Monitoringdagi davlatlar"
          icon={<MapPin size={24} />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsBarChart
          title="Davlatlar bo'yicha migrantlar soni"
          data={migrations.slice(0, 6)}
          xAxisKey="country"
          bars={[
            { dataKey: 'migrants', name: 'Migrantlar', color: '#f59e0b' },
            { dataKey: 'returned', name: 'Qaytganlar', color: '#16a34a' },
          ]}
        />
        <StatsPieChart
          title="Migratsiya turi bo'yicha taqsimot"
          data={[
            { name: 'Mehnat', value: Math.round(totalMigrants * 0.88) || 10 },
            { name: "Ta'lim", value: Math.round(totalMigrants * 0.05) || 2 },
            { name: 'Doimiy', value: Math.round(totalMigrants * 0.07) || 1 },
          ]}
        />
      </div>

      <DataTable
        title="Davlatlar kesimida migratsiya hisoboti"
        columns={columns}
        data={migrations}
        searchPlaceholder="Davlat nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi davlat"
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Migratsiya ma'lumotini tahrirlash" : "Yangi migratsiya yozuvi"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Davlat nomi</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Masalan: Polsha" className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">ISO Kodi</label>
                  <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="PL" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Bayroq belgisi (Emoji)</label>
                  <input type="text" value={flag} onChange={e => setFlag(e.target.value)} placeholder="🇵🇱" className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Migrantlar soni</label>
                  <input type="number" value={migrants} onChange={e => setMigrants(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Qaytganlar soni</label>
                  <input type="number" value={returned} onChange={e => setReturned(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Migratsiya turi</label>
                <select value={type} onChange={e => setType(e.target.value)} className="form-input">
                  <option value="Mehnat">Mehnat migratsiyasi</option>
                  <option value="Ta'lim">Ta&apos;lim olish</option>
                  <option value="Doimiy">Doimiy yashash</option>
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
