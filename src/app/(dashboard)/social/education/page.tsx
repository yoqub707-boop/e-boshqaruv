'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  FileSpreadsheet,
  FileText,
  AlertCircle,
} from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, EducationItem, FileAttachment } from '@/context/DataContext';

export default function EducationPage() {
  const { filteredEducations, addEducation, updateEducation, deleteEducation, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<EducationItem['type']>('Maktab');
  const [capacity, setCapacity] = useState(700);
  const [students, setStudents] = useState(650);
  const [teachers, setTeachers] = useState(50);
  const [collegeAdmissionPercent, setCollegeAdmissionPercent] = useState(80);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setType('Maktab');
    setCapacity(700);
    setStudents(650);
    setTeachers(50);
    setCollegeAdmissionPercent(80);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: EducationItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setCapacity(item.capacity);
    setStudents(item.students);
    setTeachers(item.teachers);
    setCollegeAdmissionPercent(item.collegeAdmissionPercent);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu ta'lim muassasasini o'chirmoqchimisiz?")) {
      deleteEducation(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError("Muassasa nomini kiriting.");
      return;
    }
    if (capacity <= 0) {
      setValidationError("Quvvat (o'rinlar soni) noldan katta bo'lishi kerak.");
      return;
    }
    if (students <= 0) {
      setValidationError("O'quvchilar soni noldan katta bo'lishi kerak.");
      return;
    }
    if (teachers <= 0) {
      setValidationError("O'qituvchilar soni noldan katta bo'lishi kerak.");
      return;
    }
    if (collegeAdmissionPercent < 0 || collegeAdmissionPercent > 100) {
      setValidationError("OTMga kirish ko'rsatkichi 0 va 100 oralig'ida bo'lishi kerak.");
      return;
    }

    const payload = {
      name,
      type,
      capacity,
      students,
      teachers,
      collegeAdmissionPercent,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'education',
        moduleTitle: "Ta'lim muassasalari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateEducation({ ...payload, id: editingItem.id });
      } else {
        addEducation(payload);
      }
    }

    setShowModal(false);
  };

  const totalStudents = filteredEducations.reduce((s, e) => s + e.students, 0);
  const totalTeachers = filteredEducations.reduce((s, e) => s + e.teachers, 0);
  const schoolsCount = filteredEducations.filter(e => e.type === 'Maktab').length;

  const columns = [
    { key: 'name', label: 'Muassasa nomi', sortable: true },
    {
      key: 'type',
      label: 'Turi',
      sortable: true,
      render: (val: string) => (
        <span className="badge badge-info">{val}</span>
      ),
    },
    {
      key: 'capacity',
      label: 'Quvvati',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'students',
      label: "O'quvchilar soni",
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'teachers',
      label: "O'qituvchilar",
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'collegeAdmissionPercent',
      label: 'OTMga kirish',
      sortable: true,
      render: (val: number) => `${val}%`,
    },
    {
      key: 'attachment',
      label: 'Hujjat',
      render: (att: FileAttachment | null) => (
        att ? (
          <button
            onClick={() => { setViewerAttachment(att); setViewerOpen(true); }}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 transition-colors"
            title={att.name}
          >
            {att.name.endsWith('.xlsx') || att.name.endsWith('.xls') ? (
              <FileSpreadsheet size={13} className="text-emerald-600" />
            ) : (
              <FileText size={13} className="text-blue-600" />
            )}
            <span className="max-w-[70px] truncate">{att.name}</span>
          </button>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: EducationItem) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => openEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit size={15} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ta&apos;lim sohasi monitoringi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Maktablar, maktabgacha ta&apos;lim va kasb-hunar maskanlari statistikasi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi muassasa qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami muassasalar"
          value={`${filteredEducations.length} ta`}
          period={`${schoolsCount} ta maktab`}
          icon={<GraduationCap size={24} />}
          color="blue"
        />
        <KpiCard
          title="O'quvchilar soni"
          value={totalStudents > 0 ? `${totalStudents.toLocaleString('uz-UZ')} nafar` : "0"}
          period="Barcha bosqichlarda"
          icon={<Users size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Pedagoglar soni"
          value={totalTeachers > 0 ? `${totalTeachers.toLocaleString('uz-UZ')} nafar` : "0"}
          period="Malakali o'qituvchilar"
          icon={<BookOpen size={24} />}
          color="indigo"
        />
        <KpiCard
          title="O'rtacha OTMga kirish"
          value="82.4%"
          period="Bitiruvchilar qamrovi"
          icon={<Award size={24} />}
          color="amber"
        />
      </div>

      <DataTable
        title="Ta'lim muassasalari ro'yxati"
        columns={columns}
        data={filteredEducations}
        searchPlaceholder="Muassasa nomini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi muassasa"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Muassasani tahrirlash" : "Yangi muassasa qo'shish"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {validationError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Muassasa nomi</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Angor tuman 1-sonli maktab"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Muassasa turi</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="form-input"
                >
                  <option value="Maktab">Maktab</option>
                  <option value="Bog'cha">Bog&apos;cha</option>
                  <option value="Kollej / Texnikum">Kollej / Texnikum</option>
                  <option value="Maktab-internat">Maktab-internat</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Quvvati (o&apos;rinlar)</label>
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">O&apos;quvchilar soni</label>
                  <input
                    type="number"
                    min="1"
                    value={students}
                    onChange={e => setStudents(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">O&apos;qituvchilar soni</label>
                  <input
                    type="number"
                    min="1"
                    value={teachers}
                    onChange={e => setTeachers(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">OTMga kirish ko&apos;rsatkichi (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={collegeAdmissionPercent}
                    onChange={e => setCollegeAdmissionPercent(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <AttachmentUploader
                attachment={attachment}
                onChange={setAttachment}
                label="Asoslovchi hisobot fayli (PDF/Excel)"
              />

              {!editingItem && (
                <div className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <input
                    type="checkbox"
                    id="draftEdu"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftEdu" className="cursor-pointer">
                    Qoralama sifatida yuborish (Tasdiqlash navbatiga qo&apos;shish)
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? "Yangilash" : sendToDraft ? "Qoralamaga yuborish" : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DocumentViewerModal
        attachment={viewerAttachment}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
