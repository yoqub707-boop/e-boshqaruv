'use client';

import React, { useState } from 'react';
import { GraduationCap, BookOpen, Award, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';

interface SchoolItem {
  id: number;
  name: string;
  type: string;
  capacity: number;
  students: number;
  teachers: number;
  collegeAdmissionPercent: number;
}

const initialData: SchoolItem[] = [
  { id: 1, name: "1-sonli ixtisoslashtirilgan davlat maktabi", type: "Maktab", capacity: 1200, students: 1350, teachers: 82, collegeAdmissionPercent: 92.4 },
  { id: 2, name: "20-sonli umumiy o'rta ta'lim maktabi", type: "Maktab", capacity: 960, students: 890, teachers: 54, collegeAdmissionPercent: 78.0 },
  { id: 3, name: "45-sonli ixtisoslashtirilgan maktab-internat", type: "Internat", capacity: 600, students: 580, teachers: 48, collegeAdmissionPercent: 88.5 },
  { id: 4, name: "12-sonli davlat maktabgacha ta'lim tashkiloti", type: "Bog'cha", capacity: 280, students: 310, teachers: 22, collegeAdmissionPercent: 0 },
  { id: 5, name: "Tuman pedagogika kasb-hunar maktabi", type: "Kollej", capacity: 750, students: 680, teachers: 45, collegeAdmissionPercent: 65.0 },
];

export default function EducationPage() {
  const [data, setData] = useState<SchoolItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolItem | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('Maktab');
  const [capacity, setCapacity] = useState(1000);
  const [students, setStudents] = useState(1000);
  const [teachers, setTeachers] = useState(60);
  const [collegeAdmissionPercent, setCollegeAdmissionPercent] = useState(80);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setType('Maktab');
    setCapacity(1000);
    setStudents(1000);
    setTeachers(60);
    setCollegeAdmissionPercent(80);
    setShowModal(true);
  };

  const openEdit = (item: SchoolItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setCapacity(item.capacity);
    setStudents(item.students);
    setTeachers(item.teachers);
    setCollegeAdmissionPercent(item.collegeAdmissionPercent);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu ta'lim muassasasini o'chirmoqchimisiz?")) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...d, name, type, capacity, students, teachers, collegeAdmissionPercent } : d));
    } else {
      setData([{ id: Date.now(), name, type, capacity, students, teachers, collegeAdmissionPercent }, ...data]);
    }
    setShowModal(false);
  };

  const columns = [
    { key: 'name', label: 'Muassasa nomi', sortable: true },
    { key: 'type', label: 'Turi', sortable: true },
    { key: 'capacity', label: 'Quvvati (o\'rin)', sortable: true, render: (val: number) => val.toLocaleString() },
    { key: 'students', label: 'O\'quvchilar soni', sortable: true, render: (val: number) => val.toLocaleString() },
    { key: 'teachers', label: 'O\'qituvchilar', sortable: true, render: (val: number) => val.toLocaleString() },
    {
      key: 'collegeAdmissionPercent',
      label: 'OTMga kirish %',
      sortable: true,
      render: (val: number) => val > 0 ? (
        <span className={`badge ${val >= 80 ? 'badge-success' : 'badge-info'}`}>{val}%</span>
      ) : <span className="text-gray-400 text-xs">-</span>,
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: SchoolItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Xalq ta&apos;limi va Maktabgacha ta&apos;lim</h1>
          <p className="text-sm text-gray-500 mt-1">Maktablar, bog&apos;chalar quvvati, o&apos;quvchilar va OTMga kirish ko&apos;rsatkichlari</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi muassasa qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Maktablar soni" value="47 ta" subtitle="Umumta'lim" icon={<GraduationCap size={24} />} color="blue" />
        <KpiCard title="Maktabgacha ta'lim" value="62 ta" subtitle="Qamrov 84.5%" icon={<BookOpen size={24} />} color="green" trend={{ value: 4.8, label: "qamrov o'sdi" }} />
        <KpiCard title="Jami o'quvchilar" value="48,200" subtitle="Maktablarda" icon={<BookOpen size={24} />} color="purple" />
        <KpiCard title="OTMga kirish ko'rsatkichi" value="76.8%" subtitle="Bitiruvchilar ulushi" icon={<Award size={24} />} color="teal" trend={{ value: 6.2, label: "o'sish" }} />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-4">Ta&apos;lim qamrovi va infratuzilma koeffitsiyentlari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="Maktab yoshidagi bolalar qamrovi" planned={48200} actual={48200} unit="nafar" />
          <ProgressBar label="Maktabgacha ta'lim qamrovi (3-7 yosh)" planned={24000} actual={20280} unit="nafar" />
          <ProgressBar label="Zamonaviy kompyuter sinflari" planned={47} actual={44} unit="maktabda" />
          <ProgressBar label="Oliy toifali o'qituvchilar" planned={3200} actual={2450} unit="nafar" />
        </div>
      </div>

      <DataTable
        title="Ta'lim muassasalari reyestri"
        columns={columns}
        data={data}
        searchPlaceholder="Muassasa nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi maktab/bog'cha"
        onExport={() => alert("Excel ga eksport qilinmoqda...")}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Muassasani tahrirlash" : "Yangi ta'lim muassasasi"}</h3>
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
                  <option value="Maktab">Maktab</option>
                  <option value="Bog'cha">Bog&apos;cha</option>
                  <option value="Internat">Internat</option>
                  <option value="Kollej">Kollej / Texnikum</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Quvvati (o&apos;rin)</label>
                  <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Ta&apos;lim oluvchilar</label>
                  <input type="number" value={students} onChange={e => setStudents(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">O&apos;qituvchilar</label>
                  <input type="number" value={teachers} onChange={e => setTeachers(Number(e.target.value))} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">OTMga kirish %</label>
                  <input type="number" value={collegeAdmissionPercent} onChange={e => setCollegeAdmissionPercent(Number(e.target.value))} className="form-input" />
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
