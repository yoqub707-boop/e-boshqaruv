'use client';

import React, { useState } from 'react';
import { Heart, Activity, UserPlus, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';

interface HospitalItem {
  id: number;
  name: string;
  type: string;
  beds: number;
  doctors: number;
  dailyPatients: number;
  ambulanceCars: number;
}

const initialData: HospitalItem[] = [
  { id: 1, name: "Tuman markaziy shifoxonasi", type: "Shifoxona", beds: 420, doctors: 95, dailyPatients: 380, ambulanceCars: 14 },
  { id: 2, name: "1-sonli tuman oilaviy poliklinikasi", type: "Poliklinika", beds: 0, doctors: 42, dailyPatients: 520, ambulanceCars: 4 },
  { id: 3, name: "2-sonli tuman oilaviy poliklinikasi", type: "Poliklinika", beds: 0, doctors: 38, dailyPatients: 460, ambulanceCars: 3 },
  { id: 4, name: "Tug'uruq kompleksi", type: "Tug'uruqxona", beds: 150, doctors: 32, dailyPatients: 110, ambulanceCars: 2 },
  { id: 5, name: "Shoshilinch tibbiy yordam ilmiy markazi filiali", type: "Shoshilinch", beds: 120, doctors: 45, dailyPatients: 190, ambulanceCars: 8 },
];

export default function HealthPage() {
  const [data, setData] = useState<HospitalItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HospitalItem | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('Poliklinika');
  const [beds, setBeds] = useState(0);
  const [doctors, setDoctors] = useState(30);
  const [dailyPatients, setDailyPatients] = useState(200);
  const [ambulanceCars, setAmbulanceCars] = useState(3);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setType('Poliklinika');
    setBeds(0);
    setDoctors(30);
    setDailyPatients(200);
    setAmbulanceCars(3);
    setShowModal(true);
  };

  const openEdit = (item: HospitalItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setBeds(item.beds);
    setDoctors(item.doctors);
    setDailyPatients(item.dailyPatients);
    setAmbulanceCars(item.ambulanceCars);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu tibbiyot muassasasini o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, name, type, beds, doctors, dailyPatients, ambulanceCars } : d));
    } else {
      setData([{ id: Date.now(), name, type, beds, doctors, dailyPatients, ambulanceCars }, ...data]);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'name', label: 'Tibbiyot muassasasi', sortable: true },
    { key: 'type', label: 'Turi', sortable: true },
    { key: 'beds', label: 'O\'rinlar soni (Koyka)', sortable: true, render: (val: number) => val > 0 ? `${val} ta` : 'Ambulator' },
    { key: 'doctors', label: 'Shifokorlar', sortable: true, render: (val: number) => val.toLocaleString() },
    { key: 'dailyPatients', label: 'Kunlik qatnov', sortable: true, render: (val: number) => val.toLocaleString() },
    { key: 'ambulanceCars', label: 'Tez yordam mashinalari', sortable: true, render: (val: number) => `${val} ta` },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: HospitalItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Sog&apos;liqni saqlash tizimi</h1>
          <p className="text-sm text-gray-500 mt-1">Shifoxonalar, poliklinikalar, koyka fondi va tibbiy xizmat sifati monitoringi</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi tibbiyot maskani
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Muassasalar soni" value="23 ta" subtitle="Kasalxona va poliklinikalar" icon={<Heart size={24} />} color="red" />
        <KpiCard title="Shifokorlar" value="1,120 nafar" subtitle="Oliy toifali" icon={<UserPlus size={24} />} color="blue" />
        <KpiCard title="Koyka fondi" value="840 ta" subtitle="Statsionar o'rinlar" icon={<Activity size={24} />} color="green" />
        <KpiCard title="Tez yordam brigadalari" value="31 ta" subtitle="Doimiy navbatchilik" icon={<Activity size={24} />} color="purple" />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-4">Aholi salomatligi va skrining ko&apos;rsatkichlari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="Aholining yillik tibbiy ko'rigi" planned={287450} actual={241000} unit="nafar" />
          <ProgressBar label="Bolalarni emlash (Vaksina)" planned={18500} actual={18150} unit="nafar" />
          <ProgressBar label="Onkologik va kardiologik skrining" planned={45000} actual={42300} unit="nafar" />
          <ProgressBar label="Tez yordam yetib borish vaqti (< 15 daqiqa)" planned={100} actual={94} unit="%" />
        </div>
      </div>

      <DataTable
        title="Tuman tibbiyot muassasalari reyestri"
        columns={columns}
        data={data}
        searchPlaceholder="Shifoxona nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi muassasa"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Muassasani tahrirlash" : "Yangi tibbiyot maskani"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Muassasa nomi</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Muassasa turi</label>
                <select value={type} onChange={e => setType(e.target.value)} className="form-input">
                  <option value="Poliklinika">Poliklinika</option>
                  <option value="Shifoxona">Shifoxona</option>
                  <option value="Tug'uruqxona">Tug&apos;uruqxona</option>
                  <option value="Shoshilinch">Shoshilinch markaz</option>
                  <option value="QVP">Qishloq vrachlik punkti</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Koyka o&apos;rinlari</label>
                  <input type="number" value={beds} onChange={e => setBeds(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Shifokorlar soni</label>
                  <input type="number" value={doctors} onChange={e => setDoctors(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Kunlik qatnov</label>
                  <input type="number" value={dailyPatients} onChange={e => setDailyPatients(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Tez yordam mashinalari</label>
                  <input type="number" value={ambulanceCars} onChange={e => setAmbulanceCars(Number(e.target.value))} className="form-input" required />
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
