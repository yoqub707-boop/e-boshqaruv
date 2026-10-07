'use client';

import React, { useState } from 'react';
import { HardHat, Building2, CheckCircle2, Clock, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import { useData, ProjectItem } from '@/context/DataContext';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Yakunlangan':
      return <span className="badge badge-success">{status}</span>;
    case 'Jarayonda':
      return <span className="badge badge-info">{status}</span>;
    case 'Kechikmoqda':
      return <span className="badge badge-danger">{status}</span>;
    default:
      return <span className="badge">{status}</span>;
  }
};

export default function ConstructionProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);

  const [name, setName] = useState('');
  const [contractor, setContractor] = useState('');
  const [startDate, setStartDate] = useState('01.01.2024');
  const [budget, setBudget] = useState(3000000000);
  const [progress, setProgress] = useState(50);
  const [status, setStatus] = useState('Jarayonda');

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setContractor('');
    setStartDate('01.01.2024');
    setBudget(3000000000);
    setProgress(50);
    setStatus('Jarayonda');
    setShowModal(true);
  };

  const openEdit = (item: ProjectItem) => {
    setEditingItem(item);
    setName(item.name);
    setContractor(item.contractor);
    setStartDate(item.startDate);
    setBudget(item.budget);
    setProgress(item.progress);
    setStatus(item.status);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu qurilish loyihasini o'chirmoqchimisiz?")) {
      deleteProject(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateProject({ id: editingItem.id, name, contractor, startDate, budget, progress, status });
    } else {
      addProject({ name, contractor, startDate, budget, progress, status });
    }
    setShowModal(false);
  };

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const completedCount = projects.filter(p => p.status === 'Yakunlangan' || p.progress === 100).length;
  const delayedCount = projects.filter(p => p.status === 'Kechikmoqda').length;

  const columns = [
    { key: 'name', label: 'Obyekt nomi', sortable: true },
    { key: 'contractor', label: 'Pudratchi tashkilot', sortable: true },
    { key: 'startDate', label: 'Boshlangan sana', sortable: true },
    {
      key: 'budget',
      label: 'Byudjet',
      sortable: true,
      render: (val: number) => `${(val / 1000000000).toFixed(2)} mlrd so'm`,
    },
    {
      key: 'progress',
      label: 'Bajarilish %',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-xs">{val}%</span>
      ),
    },
    {
      key: 'status',
      label: 'Holati',
      sortable: true,
      render: (val: string) => getStatusBadge(val),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: ProjectItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Qurilish obyektlari va investitsiya loyihalari</h1>
          <p className="text-sm text-gray-500 mt-1">Davlat dasturlari doirasida amalga oshirilayotgan qurilish-ta&apos;mirlash ishlari</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi obyekt kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami obyektlar"
          value={`${projects.length} ta`}
          subtitle="Manzilli dastur"
          icon={<HardHat size={24} />}
          color="blue"
        />
        <KpiCard
          title="Yakunlangan"
          value={`${completedCount} ta`}
          subtitle="Foydalanishga topshirildi"
          icon={<CheckCircle2 size={24} />}
          color="green"
        />
        <KpiCard
          title="Jami byudjet"
          value={`${(totalBudget / 1000000000).toFixed(1)} mlrd`}
          subtitle="Ajratilgan mablag'"
          icon={<Building2 size={24} />}
          color="purple"
        />
        <KpiCard
          title="Kechikayotgan"
          value={`${delayedCount} ta`}
          subtitle="Nazoratda"
          icon={<Clock size={24} />}
          color="red"
        />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-4">Asosiy yo&apos;nalishlar bo&apos;yicha reja bajarilishi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="Ta'lim muassasalari ta'miri" planned={12000000000} actual={10500000000} unit="so'm" />
          <ProgressBar label="Tibbiyot maskanlari qurilishi" planned={15000000000} actual={14200000000} unit="so'm" />
          <ProgressBar label="Yo'l va infratuzilma" planned={10000000000} actual={8800000000} unit="so'm" />
          <ProgressBar label="Ichimlik suvi tarmoqlari" planned={8600000000} actual={7400000000} unit="so'm" />
        </div>
      </div>

      <DataTable
        title="Qurilish loyihalari ro'yxati"
        columns={columns}
        data={projects}
        searchPlaceholder="Obyekt yoki pudratchini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi obyekt"
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Obyektni tahrirlash" : "Yangi qurilish obyekti"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Obyekt nomi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Masalan: 32-maktab ta'miri" className="form-input" required />
              </div>
              <div>
                <label className="form-label">Pudratchi tashkilot</label>
                <input type="text" value={contractor} onChange={e => setContractor(e.target.value)} placeholder="Binokor MCHJ" className="form-input" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Boshlangan sana</label>
                  <input type="text" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="01.05.2024" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Byudjet (so&apos;mda)</label>
                  <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Bajarilish foizi (%)</label>
                  <input type="number" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Holati</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="form-input">
                    <option value="Jarayonda">Jarayonda</option>
                    <option value="Yakunlangan">Yakunlangan</option>
                    <option value="Kechikmoqda">Kechikmoqda</option>
                  </select>
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
