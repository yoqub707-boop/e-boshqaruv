'use client';

import React, { useState } from 'react';
import { Users, UserCheck, Heart, UserPlus, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import { StatsBarChart, StatsPieChart, StatsLineChart } from '@/components/dashboard/StatsChart';

interface DemographicsItem {
  id: number;
  year: number;
  quarter: number;
  totalPopulation: number;
  maleCount: number;
  femaleCount: number;
  birthRate: number;
  deathRate: number;
  marriages: number;
}

const initialData: DemographicsItem[] = [
  { id: 1, year: 2024, quarter: 1, totalPopulation: 287450, maleCount: 142100, femaleCount: 145350, birthRate: 21.4, deathRate: 4.8, marriages: 1450 },
  { id: 2, year: 2023, quarter: 4, totalPopulation: 284200, maleCount: 140500, femaleCount: 143700, birthRate: 20.8, deathRate: 4.9, marriages: 1820 },
  { id: 3, year: 2023, quarter: 3, totalPopulation: 281800, maleCount: 139200, femaleCount: 142600, birthRate: 22.1, deathRate: 4.7, marriages: 1640 },
  { id: 4, year: 2023, quarter: 2, totalPopulation: 279500, maleCount: 138100, femaleCount: 141400, birthRate: 19.8, deathRate: 5.0, marriages: 1310 },
];

export default function DemographicsPage() {
  const [data, setData] = useState<DemographicsItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DemographicsItem | null>(null);

  const [year, setYear] = useState(2024);
  const [quarter, setQuarter] = useState(2);
  const [totalPopulation, setTotalPopulation] = useState(289000);
  const [maleCount, setMaleCount] = useState(143000);
  const [femaleCount, setFemaleCount] = useState(146000);
  const [birthRate, setBirthRate] = useState(21.5);
  const [deathRate, setDeathRate] = useState(4.8);
  const [marriages, setMarriages] = useState(1500);

  const openAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEdit = (item: DemographicsItem) => {
    setEditingItem(item);
    setYear(item.year);
    setQuarter(item.quarter);
    setTotalPopulation(item.totalPopulation);
    setMaleCount(item.maleCount);
    setFemaleCount(item.femaleCount);
    setBirthRate(item.birthRate);
    setDeathRate(item.deathRate);
    setMarriages(item.marriages);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu statistikani o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, year, quarter, totalPopulation, maleCount, femaleCount, birthRate, deathRate, marriages } : d));
    } else {
      setData([{ id: Date.now(), year, quarter, totalPopulation, maleCount, femaleCount, birthRate, deathRate, marriages }, ...data]);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'year', label: 'Yil', sortable: true },
    { key: 'quarter', label: 'Chorak', sortable: true, render: (val: number) => `${val}-chorak` },
    { key: 'totalPopulation', label: 'Jami aholi', sortable: true, render: (val: number) => val.toLocaleString() },
    { key: 'maleCount', label: 'Erkaklar', sortable: true, render: (val: number) => val.toLocaleString() },
    { key: 'femaleCount', label: 'Ayollar', sortable: true, render: (val: number) => val.toLocaleString() },
    { key: 'birthRate', label: 'Tug\'ilish (har 1000 kishiga)', sortable: true, render: (val: number) => `${val} ‰` },
    { key: 'marriages', label: 'Nikohlar', sortable: true, render: (val: number) => val.toLocaleString() },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: DemographicsItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Demografik ko&apos;rsatkichlar</h1>
          <p className="text-sm text-gray-500 mt-1">Aholi soni, jins va yosh tarkibi hamda tabiiy o&apos;sish tahlili</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi davr ma&apos;lumotini kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Umumiy aholi soni" value="287,450" subtitle="Tuman bo'yicha" icon={<Users size={24} />} color="blue" trend={{ value: 2.3, label: "yillik o'sish" }} />
        <KpiCard title="Erkaklar ulushi" value="49.4%" subtitle="142,100 nafar" icon={<UserCheck size={24} />} color="purple" />
        <KpiCard title="Ayollar ulushi" value="50.6%" subtitle="145,350 nafar" icon={<Heart size={24} />} color="teal" />
        <KpiCard title="Tug'ilish darajasi" value="21.4 ‰" subtitle="Tabiiy ko'payish" icon={<UserPlus size={24} />} color="green" trend={{ value: 1.2, label: "ijobiy dinamika" }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsPieChart
          title="Aholi yosh guruhlari taqsimoti"
          data={[
            { name: "0-18 yosh", value: 86235 },
            { name: "18-30 yosh", value: 63239 },
            { name: "30-50 yosh", value: 80486 },
            { name: "50-65 yosh", value: 37369 },
            { name: "65+ yosh", value: 20121 },
          ]}
        />
        <StatsLineChart
          title="Aholi soni o'sish dinamikasi (ming kishi)"
          data={[
            { yil: '2020', aholi: 271, tugilish: 5.6 },
            { yil: '2021', aholi: 276, tugilish: 5.9 },
            { yil: '2022', aholi: 280, tugilish: 6.1 },
            { yil: '2023', aholi: 284, tugilish: 6.2 },
            { yil: '2024', aholi: 287, tugilish: 6.4 },
          ]}
          xAxisKey="yil"
          lines={[
            { dataKey: 'aholi', name: 'Jami aholi', color: '#1e40af' },
            { dataKey: 'tugilish', name: 'Tug\'ilish', color: '#16a34a' },
          ]}
        />
      </div>

      <DataTable
        title="Choraklar kesimida demografik ko'rsatkichlar jadvali"
        columns={columns}
        data={data}
        searchPlaceholder="Yil yoki ko'rsatkichni qidirish..."
        onAdd={openAdd}
        addLabel="Yangi yozuv"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Demografiyani tahrirlash" : "Yangi demografik davr"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Yil</label>
                  <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Chorak</label>
                  <input type="number" min="1" max="4" value={quarter} onChange={e => setQuarter(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Jami aholi soni</label>
                <input type="number" value={totalPopulation} onChange={e => setTotalPopulation(Number(e.target.value))} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Erkaklar</label>
                  <input type="number" value={maleCount} onChange={e => setMaleCount(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Ayollar</label>
                  <input type="number" value={femaleCount} onChange={e => setFemaleCount(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Tug&apos;ilish koeffitsiyenti</label>
                  <input type="number" step="0.1" value={birthRate} onChange={e => setBirthRate(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Nikohlar soni</label>
                  <input type="number" value={marriages} onChange={e => setMarriages(Number(e.target.value))} className="form-input" required />
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
