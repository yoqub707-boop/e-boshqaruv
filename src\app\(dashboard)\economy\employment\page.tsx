'use client';

import React, { useState } from 'react';
import { Briefcase, UserCheck, TrendingUp, AlertCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import { StatsBarChart } from '@/components/dashboard/StatsChart';
import { useData, EmploymentItem } from '@/context/DataContext';

export default function EmploymentPage() {
  const { employments, addEmployment, updateEmployment, deleteEmployment } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EmploymentItem | null>(null);

  const [sector, setSector] = useState('');
  const [year, setYear] = useState(2024);
  const [plannedJobs, setPlannedJobs] = useState(1000);
  const [actualJobs, setActualJobs] = useState(950);

  const openAdd = () => {
    setEditingItem(null);
    setSector('');
    setYear(2024);
    setPlannedJobs(1000);
    setActualJobs(950);
    setShowModal(true);
  };

  const openEdit = (item: EmploymentItem) => {
    setEditingItem(item);
    setSector(item.sector);
    setYear(item.year);
    setPlannedJobs(item.plannedJobs);
    setActualJobs(item.actualJobs);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu bandlik ma'lumotini o'chirmoqchimisiz?")) {
      deleteEmployment(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const executionRate = plannedJobs > 0 ? Number(((actualJobs / plannedJobs) * 100).toFixed(1)) : 0;
    if (editingItem) {
      updateEmployment({ id: editingItem.id, sector, year, plannedJobs, actualJobs, executionRate });
    } else {
      addEmployment({ sector, year, plannedJobs, actualJobs, executionRate });
    }
    setShowModal(false);
  };

  const totalPlanned = employments.reduce((s, e) => s + e.plannedJobs, 0);
  const totalActual = employments.reduce((s, e) => s + e.actualJobs, 0);

  const columns = [
    { key: 'sector', label: 'Iqtisodiy soha / Sektor', sortable: true },
    { key: 'year', label: 'Yil', sortable: true },
    {
      key: 'plannedJobs',
      label: 'Reja (yangi ish o\'rni)',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'actualJobs',
      label: 'Haqiqatda yaratildi',
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
      render: (_: any, row: EmploymentItem) => (
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

  const chartData = employments.map(e => ({
    soh: e.sector.slice(0, 14),
    reja: e.plannedJobs,
    haqiqiy: e.actualJobs,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Iqtisodiyot: Bandlik va Yangi ish o&apos;rinlari</h1>
          <p className="text-sm text-gray-500 mt-1">Hududda yangi ish o&apos;rinlarini yaratish va bandlik ko&apos;rsatkichlari</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi soha qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Umumiy bandlik darajasi"
          value="93.8%"
          subtitle="Iqtisodiy faol aholi"
          icon={<UserCheck size={24} />}
          color="green"
        />
        <KpiCard
          title="Yangi ish o'rinlari"
          value={totalActual.toLocaleString()}
          subtitle="Amalda yaratilgan"
          icon={<Briefcase size={24} />}
          color="blue"
          trend={{ value: 4.2, label: "o'sish" }}
        />
        <KpiCard
          title="Yillik reja"
          value={totalPlanned.toLocaleString()}
          subtitle="Kutilayotgan maqsad"
          icon={<TrendingUp size={24} />}
          color="purple"
        />
        <KpiCard
          title="Bajarilish foizi"
          value={`${totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0}%`}
          subtitle="Umumiy samaradorlik"
          icon={<AlertCircle size={24} />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Sektorlar kesimida ish o'rinlari"
          columns={columns}
          data={employments}
          searchPlaceholder="Sohani qidirish..."
          onAdd={openAdd}
          addLabel="Yangi soha"
          onExport={() => alert('Excel ga eksport qilinmoqda...')}
        />
        <StatsBarChart
          title="Reja va haqiqiy yaratilgan ish o'rinlari"
          data={chartData}
          xAxisKey="soh"
          bars={[
            { dataKey: 'reja', name: 'Reja', color: '#1e40af' },
            { dataKey: 'haqiqiy', name: 'Haqiqiy', color: '#16a34a' },
          ]}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Sohani tahrirlash" : "Yangi bandlik sohasi"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Iqtisodiy soha / Sektor nomi</label>
                <input type="text" value={sector} onChange={e => setSector(e.target.value)} placeholder="Masalan: Raqamli texnologiyalar" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Yil</label>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Reja (ish o&apos;rni)</label>
                  <input type="number" value={plannedJobs} onChange={e => setPlannedJobs(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Haqiqatda yaratildi</label>
                  <input type="number" value={actualJobs} onChange={e => setActualJobs(Number(e.target.value))} className="form-input" required />
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
