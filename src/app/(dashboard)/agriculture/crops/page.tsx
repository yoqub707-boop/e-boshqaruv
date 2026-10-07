'use client';

import React, { useState } from 'react';
import { Sprout, TrendingUp, CheckCircle, Clock, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import { StatsPieChart } from '@/components/dashboard/StatsChart';
import { useData, CropItem } from '@/context/DataContext';

export default function CropsPage() {
  const { crops, addCrop, updateCrop, deleteCrop } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CropItem | null>(null);

  const [cropType, setCropType] = useState('');
  const [plantedArea, setPlantedArea] = useState(5000);
  const [expectedYield, setExpectedYield] = useState(15000);
  const [executionRate, setExecutionRate] = useState(100);
  const [year, setYear] = useState(2024);

  const openAdd = () => {
    setEditingItem(null);
    setCropType('');
    setPlantedArea(5000);
    setExpectedYield(15000);
    setExecutionRate(100);
    setYear(2024);
    setShowModal(true);
  };

  const openEdit = (item: CropItem) => {
    setEditingItem(item);
    setCropType(item.cropType);
    setPlantedArea(item.plantedArea);
    setExpectedYield(item.expectedYield);
    setExecutionRate(item.executionRate);
    setYear(item.year);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu ekin turini o'chirmoqchimisiz?")) {
      deleteCrop(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateCrop({ id: editingItem.id, cropType, plantedArea, expectedYield, executionRate, year });
    } else {
      addCrop({ cropType, plantedArea, expectedYield, executionRate, year });
    }
    setShowModal(false);
  };

  const totalArea = crops.reduce((s, c) => s + c.plantedArea, 0);
  const totalYield = crops.reduce((s, c) => s + c.expectedYield, 0);

  const columns = [
    { key: 'cropType', label: 'Ekin turi', sortable: true },
    { key: 'year', label: 'Yil', sortable: true },
    {
      key: 'plantedArea',
      label: 'Ekilgan maydon (ga)',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'expectedYield',
      label: 'Kutilayotgan hosil (tonna)',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'executionRate',
      label: 'Bajarilish %',
      sortable: true,
      render: (val: number) => (
        <span className={`badge ${val >= 100 ? 'badge-success' : val >= 90 ? 'badge-info' : 'badge-warning'}`}>
          {val}%
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: CropItem) => (
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

  const pieData = crops.map(c => ({
    name: c.cropType,
    value: c.plantedArea,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Qishloq xo&apos;jaligi: Ekinlar</h1>
          <p className="text-sm text-gray-500 mt-1">Ekin maydonlari va kutilayotgan hosildorlik tahlili</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi ekin turi kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Umumiy ekin maydoni"
          value={`${totalArea.toLocaleString()} ga`}
          subtitle="Joriy mavsum"
          icon={<Sprout size={24} />}
          color="green"
          trend={{ value: 2.5, label: "o'tgan yilga nisbatan" }}
        />
        <KpiCard
          title="Kutilayotgan hosil"
          value={`${totalYield.toLocaleString()} t`}
          subtitle="Jami prognoz"
          icon={<TrendingUp size={24} />}
          color="blue"
          trend={{ value: 4.8, label: "o'sish" }}
        />
        <KpiCard
          title="Ekin turlari"
          value={`${crops.length} tur`}
          subtitle="Agrosanoat xaritasi"
          icon={<CheckCircle size={24} />}
          color="teal"
        />
        <KpiCard
          title="Mavsumiy texnikalar"
          value="1,450 ta"
          subtitle="Dala ishlarida"
          icon={<Clock size={24} />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable
            title="Ekinlar bo'yicha batafsil ma'lumot"
            columns={columns}
            data={crops}
            searchPlaceholder="Ekin turini qidirish..."
            onAdd={openAdd}
            addLabel="Yangi ekin"
            onExport={() => alert('Excel ga eksport qilinmoqda...')}
          />
        </div>
        <div>
          <StatsPieChart
            title="Ekin maydonlari taqsimoti (ga)"
            data={pieData.length > 0 ? pieData : [{ name: "Bo'sh", value: 1 }]}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Ekinni tahrirlash" : "Yangi ekin turi"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Ekin turi nomi</label>
                <input type="text" value={cropType} onChange={e => setCropType(e.target.value)} placeholder="Masalan: Mosh va loviya" className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Maydoni (gektar)</label>
                  <input type="number" value={plantedArea} onChange={e => setPlantedArea(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Kutilayotgan hosil (tonna)</label>
                  <input type="number" value={expectedYield} onChange={e => setExpectedYield(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Bajarilish foizi (%)</label>
                  <input type="number" step="0.1" value={executionRate} onChange={e => setExecutionRate(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Yil</label>
                  <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="form-input" required />
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
