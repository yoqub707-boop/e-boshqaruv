'use client';

import React, { useState } from 'react';
import {
  HardHat,
  Clock,
  CheckCircle,
  AlertTriangle,
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
import { useData, ProjectItem, FileAttachment } from '@/context/DataContext';

export default function ProjectsPage() {
  const { filteredProjects, addProject, updateProject, deleteProject, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);

  const [name, setName] = useState('');
  const [contractor, setContractor] = useState('');
  const [startDate, setStartDate] = useState(`${selectedYear}-01-15`);
  const [budget, setBudget] = useState(3000000000);
  const [progress, setProgress] = useState(50);
  const [status, setStatus] = useState<ProjectItem['status']>('Jarayonda');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setContractor('');
    setStartDate(`${selectedYear}-01-15`);
    setBudget(3000000000);
    setProgress(50);
    setStatus('Jarayonda');
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
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
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu loyihani o'chirmoqchimisiz?")) {
      deleteProject(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError("Loyiha nomini kiriting.");
      return;
    }
    if (!contractor.trim()) {
      setValidationError("Pudratchi tashkilot nomini kiriting.");
      return;
    }
    if (budget <= 0) {
      setValidationError("Byudjet noldan katta bo'lishi kerak.");
      return;
    }
    if (progress < 0 || progress > 100) {
      setValidationError("Bajarilish foizi 0 va 100 oralig'ida bo'lishi kerak.");
      return;
    }

    const payload = {
      name,
      contractor,
      startDate,
      budget,
      progress,
      status,
      attachment,
      year: selectedYear,
      date: startDate || new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'project',
        moduleTitle: "Qurilish loyihalari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateProject({ ...payload, id: editingItem.id });
      } else {
        addProject(payload);
      }
    }

    setShowModal(false);
  };

  const totalBudget = filteredProjects.reduce((s, p) => s + p.budget, 0);
  const completedCount = filteredProjects.filter(p => p.status === 'Yakunlangan' || p.progress === 100).length;
  const inProgressCount = filteredProjects.filter(p => p.status === 'Jarayonda').length;

  const columns = [
    { key: 'name', label: 'Loyiha nomi', sortable: true },
    { key: 'contractor', label: 'Pudratchi', sortable: true },
    {
      key: 'budget',
      label: 'Byudjet (so\'m)',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'progress',
      label: 'Ijro foizi',
      sortable: true,
      render: (val: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${val}%` }} />
          </div>
          <span className="text-xs font-semibold">{val}%</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Holati',
      sortable: true,
      render: (val: string) => {
        const cls =
          val === 'Yakunlangan'
            ? 'badge-success'
            : val === 'Jarayonda'
            ? 'badge-info'
            : val === 'Rejalashtirilgan'
            ? 'badge-warning'
            : 'badge-danger';
        return <span className={`badge ${cls}`}>{val}</span>;
      },
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
      render: (_: any, row: ProjectItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Qurilish loyihalari monitoringi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hududiy investitsiya, infratuzilma va ijtimoiy soha qurilish ob&apos;ektlari
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi loyiha qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami loyihalar"
          value={`${filteredProjects.length} ta`}
          period="Davlat dasturida"
          icon={<HardHat size={24} />}
          color="blue"
        />
        <KpiCard
          title="Umumiy byudjet"
          value={totalBudget > 0 ? `${(totalBudget / 1000000000).toFixed(2)} mlrd` : "0"}
          period="Moliyalashtirish hajmi"
          icon={<Clock size={24} />}
          color="indigo"
        />
        <KpiCard
          title="Jarayondagi ob'ektlar"
          value={`${inProgressCount} ta`}
          period="Qurilish davom etmoqda"
          icon={<AlertTriangle size={24} />}
          color="amber"
        />
        <KpiCard
          title="Yakunlangan loyihalar"
          value={`${completedCount} ta`}
          period="Foydalanishga topshirildi"
          icon={<CheckCircle size={24} />}
          color="emerald"
        />
      </div>

      <DataTable
        title="Qurilish ob'ektlari ro'yxati"
        columns={columns}
        data={filteredProjects}
        searchPlaceholder="Loyiha yoki pudratchini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi loyiha"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Loyihani tahrirlash" : "Yangi loyiha qo'shish"}
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
                <label className="form-label">Loyiha nomi</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Angor tuman markaziy ko'chalarini ta'mirlash"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Pudratchi korxona</label>
                <input
                  type="text"
                  value={contractor}
                  onChange={e => setContractor(e.target.value)}
                  placeholder="Masalan: Surxon Yo'l Qurilish MCHJ"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Boshlangan sana</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Byudjet (so&apos;m)</label>
                  <input
                    type="number"
                    min="1"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Bajarilish foizi (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={e => setProgress(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Holati</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Rejalashtirilgan">Rejalashtirilgan</option>
                    <option value="Jarayonda">Jarayonda</option>
                    <option value="Yakunlangan">Yakunlangan</option>
                    <option value="To'xtatilgan">To&apos;xtatilgan</option>
                  </select>
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
                    id="draftProj"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftProj" className="cursor-pointer">
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
