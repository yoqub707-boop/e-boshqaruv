'use client';

import React, { useState } from 'react';
import { Sun, Leaf, CheckCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';

interface GreenItem {
  id: number;
  name: string;
  spaceType: string;
  area: number;
  treesPlanted: number;
  plannedTrees: number;
  solarPanels: number;
  solarCapacity: number;
}

const initialData: GreenItem[] = [
  { id: 1, name: "Yangi O'zbekiston bog'i tumani qismi", spaceType: "Bog'", area: 45.0, treesPlanted: 18500, plannedTrees: 20000, solarPanels: 120, solarCapacity: 48.0 },
  { id: 2, name: "Chilonzor yashil belbog'i", spaceType: "Ko'kalamzor", area: 28.5, treesPlanted: 12400, plannedTrees: 15000, solarPanels: 45, solarCapacity: 18.0 },
  { id: 3, name: "Bunyodkor shoh ko'chasi xiyoboni", spaceType: "Xiyobon", area: 12.0, treesPlanted: 6200, plannedTrees: 6500, solarPanels: 80, solarCapacity: 32.0 },
  { id: 4, name: "Do'stlik istirohat parki", spaceType: "Park", area: 18.0, treesPlanted: 8900, plannedTrees: 9000, solarPanels: 60, solarCapacity: 24.0 },
];

export default function GreenSpacePage() {
  const [data, setData] = useState<GreenItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GreenItem | null>(null);

  const [name, setName] = useState('');
  const [spaceType, setSpaceType] = useState('Bog\'');
  const [area, setArea] = useState(10.0);
  const [treesPlanted, setTreesPlanted] = useState(5000);
  const [plannedTrees, setPlannedTrees] = useState(6000);
  const [solarPanels, setSolarPanels] = useState(50);
  const [solarCapacity, setSolarCapacity] = useState(20.0);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setSpaceType('Bog\'');
    setArea(10.0);
    setTreesPlanted(5000);
    setPlannedTrees(6000);
    setSolarPanels(50);
    setSolarCapacity(20.0);
    setShowModal(true);
  };

  const openEdit = (item: GreenItem) => {
    setEditingItem(item);
    setName(item.name);
    setSpaceType(item.spaceType);
    setArea(item.area);
    setTreesPlanted(item.treesPlanted);
    setPlannedTrees(item.plannedTrees);
    setSolarPanels(item.solarPanels);
    setSolarCapacity(item.solarCapacity);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu yashil hududni o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, name, spaceType, area, treesPlanted, plannedTrees, solarPanels, solarCapacity } : d));
    } else {
      setData([{ id: Date.now(), name, spaceType, area, treesPlanted, plannedTrees, solarPanels, solarCapacity }, ...data]);
    }
    setShowModal(false);
  };

  const totalTrees = data.reduce((s, d) => s + d.treesPlanted, 0);
  const totalPlannedTrees = data.reduce((s, d) => s + d.plannedTrees, 0);
  const totalSolar = data.reduce((s, d) => s + d.solarCapacity, 0);

  const columns = [
    { key: 'name', label: 'Hudud / Obyekt nomi', sortable: true },
    { key: 'spaceType', label: 'Turi', sortable: true },
    { key: 'area', label: 'Maydoni (ga)', sortable: true, render: (val: number) => `${val} gektar` },
    { key: 'treesPlanted', label: 'Ekilgan daraxtlar', sortable: true, render: (val: number) => `${val.toLocaleString()} tup` },
    {
      key: 'bajarilish',
      label: 'Reja bajarilishi',
      render: (_: any, row: GreenItem) => {
        const rate = row.plannedTrees > 0 ? ((row.treesPlanted / row.plannedTrees) * 100).toFixed(1) : '0';
        return <span className="badge badge-success">{rate}%</span>;
      },
    },
    { key: 'solarPanels', label: 'Quyosh panellari', sortable: true, render: (val: number) => `${val} dona` },
    { key: 'solarCapacity', label: 'Quvvati (kVt)', sortable: true, render: (val: number) => `${val} kVt` },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: GreenItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">&quot;Yashil makon&quot; umummilliy loyihasi va Yashil energiya</h1>
          <p className="text-sm text-gray-500 mt-1">Daraxt ekish, ko&apos;kalamzorlashtirish maydonlari va quyosh panellari monitoringi</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi yashil hudud qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Ekilgan daraxtlar" value={`${totalTrees.toLocaleString()} tup`} subtitle="Yashil makon doirasida" icon={<Leaf size={24} />} color="green" trend={{ value: 8.5, label: "o'sish" }} />
        <KpiCard title="Reja bajarilishi" value={`${((totalTrees / totalPlannedTrees) * 100).toFixed(1)}%`} subtitle="Umumiy maqsad" icon={<CheckCircle size={24} />} color="teal" />
        <KpiCard title="Yashil hududlar" value="103.5 ga" subtitle="Bog' va parklar" icon={<Leaf size={24} />} color="blue" />
        <KpiCard title="Quyosh energiyasi" value={`${totalSolar.toFixed(0)} kVt`} subtitle="O'rnatilgan quvvat" icon={<Sun size={24} />} color="orange" />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-4">&quot;Yashil makon&quot; mavsumiy rejasi ko&apos;rsatkichlari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="Bahorgi daraxt ekish mavsumi" planned={30000} actual={28500} unit="tup" />
          <ProgressBar label="Kuzgi daraxt ekish mavsumi" planned={25000} actual={17500} unit="tup" />
          <ProgressBar label="Ijtimoiy ob'ektlarda quyosh panellari" planned={50} actual={46} unit="ta" />
          <ProgressBar label="Tomchilatib sug'orish tizimi joriy etildi" planned={40} actual={35} unit="gektar" />
        </div>
      </div>

      <DataTable
        title="Yashil hududlar va quyosh panellari ro'yxati"
        columns={columns}
        data={data}
        searchPlaceholder="Hudud nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi hudud"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Hududni tahrirlash" : "Yangi yashil hudud"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Hudud / Bog&apos; nomi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Hudud turi</label>
                <select value={spaceType} onChange={e => setSpaceType(e.target.value)} className="form-input">
                  <option value="Bog'">Bog&apos;</option>
                  <option value="Park">Park / Istirohat bog&apos;i</option>
                  <option value="Xiyobon">Xiyobon</option>
                  <option value="Ko'kalamzor">Yashil belbog&apos;</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Maydoni (gektar)</label>
                  <input type="number" step="0.1" value={area} onChange={e => setArea(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Ekilgan daraxtlar</label>
                  <input type="number" value={treesPlanted} onChange={e => setTreesPlanted(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Rejadagi daraxtlar</label>
                  <input type="number" value={plannedTrees} onChange={e => setPlannedTrees(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Quyosh panellari (dona)</label>
                  <input type="number" value={solarPanels} onChange={e => setSolarPanels(Number(e.target.value))} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Quyosh energiyasi quvvati (kVt)</label>
                <input type="number" step="0.1" value={solarCapacity} onChange={e => setSolarCapacity(Number(e.target.value))} className="form-input" />
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
