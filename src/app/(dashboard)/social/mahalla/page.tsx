'use client';

import React, { useState } from 'react';
import { Home, Users, CheckCircle, AlertTriangle, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import { useData, MahallaItem } from '@/context/DataContext';

export default function MahallaPage() {
  const { mahallas, addMahalla, updateMahalla, deleteMahalla } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MahallaItem | null>(null);

  const [name, setName] = useState('');
  const [chairman, setChairman] = useState('');
  const [population, setPopulation] = useState(4000);
  const [households, setHouseholds] = useState(1000);
  const [problemRate, setProblemRate] = useState(95);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setChairman('');
    setPopulation(4000);
    setHouseholds(1000);
    setProblemRate(95);
    setShowModal(true);
  };

  const openEdit = (item: MahallaItem) => {
    setEditingItem(item);
    setName(item.name);
    setChairman(item.chairman);
    setPopulation(item.population);
    setHouseholds(item.households);
    setProblemRate(item.problemRate);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu mahallani o'chirmoqchimisiz?")) {
      deleteMahalla(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMahalla({ id: editingItem.id, name, chairman, population, households, problemRate });
    } else {
      addMahalla({ name, chairman, population, households, problemRate });
    }
    setShowModal(false);
  };

  const totalPop = mahallas.reduce((s, m) => s + m.population, 0);
  const totalHouseholds = mahallas.reduce((s, m) => s + m.households, 0);

  const columns = [
    { key: 'name', label: 'Mahalla nomi (MFY)', sortable: true },
    { key: 'chairman', label: 'Mahalla raisi', sortable: true },
    {
      key: 'population',
      label: 'Aholi soni',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'households',
      label: 'Xonadonlar soni',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'problemRate',
      label: 'Murojaatlar hal etilishi',
      sortable: true,
      render: (val: number) => (
        <span className={`badge ${val >= 95 ? 'badge-success' : val >= 90 ? 'badge-info' : 'badge-warning'}`}>
          {val}%
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: MahallaItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Mahallalar kesimida ijtimoiy holat</h1>
          <p className="text-sm text-gray-500 mt-1">Mahalla fuqarolar yig&apos;inlari, aholi va xonadonlar monitoringi</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi mahalla qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami mahallalar"
          value={`${mahallas.length} ta`}
          subtitle="MFYlar soni"
          icon={<Home size={24} />}
          color="blue"
        />
        <KpiCard
          title="Jami aholi"
          value={totalPop.toLocaleString()}
          subtitle="Mahallalarda ro'yxatda"
          icon={<Users size={24} />}
          color="green"
          trend={{ value: 2.3, label: "o'sish" }}
        />
        <KpiCard
          title="Jami xonadonlar"
          value={totalHouseholds.toLocaleString()}
          subtitle="Xonadonlar soni"
          icon={<Home size={24} />}
          color="purple"
        />
        <KpiCard
          title="O'rtacha samaradorlik"
          value="94.8%"
          subtitle="Muammolarni hal etish"
          icon={<CheckCircle size={24} />}
          color="teal"
        />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-4">Mahalla xonadonlari bo&apos;yicha ijtimoiy ko&apos;mak choralari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="Ijtimoiy reyestr yordamlari" planned={1200} actual={1140} unit="ta" />
          <ProgressBar label="Bandlik ta'minlangan oilalar" planned={850} actual={810} unit="ta" />
          <ProgressBar label="Kredit va subsidiya ajratilgan" planned={450} actual={435} unit="ta" />
          <ProgressBar label="Tibbiy ko'rikdan o'tganlar" planned={6500} actual={6380} unit="nafar" />
        </div>
      </div>

      <DataTable
        title="Mahallalar ro'yxati va ko'rsatkichlari"
        columns={columns}
        data={mahallas}
        searchPlaceholder="Mahalla yoki raisni qidirish..."
        onAdd={openAdd}
        addLabel="Yangi mahalla"
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Mahallani tahrirlash" : "Yangi mahalla qo'shish"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Mahalla nomi (MFY)</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Masalan: Yangi Hayot" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Mahalla raisi (F.I.Sh.)</label>
                <input type="text" value={chairman} onChange={e => setChairman(e.target.value)} placeholder="Masalan: O. Sobirov" className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Aholi soni</label>
                  <input type="number" value={population} onChange={e => setPopulation(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Xonadonlar soni</label>
                  <input type="number" value={households} onChange={e => setHouseholds(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Murojaatlar hal etilishi (%)</label>
                <input type="number" step="0.1" value={problemRate} onChange={e => setProblemRate(Number(e.target.value))} className="form-input" required />
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
