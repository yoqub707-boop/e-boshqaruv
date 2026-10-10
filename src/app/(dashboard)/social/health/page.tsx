'use client';

import React, { useState } from 'react';
import {
  Heart,
  Users,
  Activity,
  Ambulance,
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
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, HealthItem, FileAttachment } from '@/context/DataContext';

export default function HealthPage() {
  const { filteredHealths, addHealth, updateHealth, deleteHealth, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HealthItem | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<HealthItem['type']>('Markaziy shifoxona');
  const [beds, setBeds] = useState(150);
  const [doctors, setDoctors] = useState(45);
  const [dailyPatients, setDailyPatients] = useState(300);
  const [ambulanceCars, setAmbulanceCars] = useState(5);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setType('Markaziy shifoxona');
    setBeds(150);
    setDoctors(45);
    setDailyPatients(300);
    setAmbulanceCars(5);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: HealthItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setBeds(item.beds);
    setDoctors(item.doctors);
    setDailyPatients(item.dailyPatients);
    setAmbulanceCars(item.ambulanceCars);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu tibbiyot muassasasini o'chirmoqchimisiz?")) {
      deleteHealth(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError("Muassasa nomini kiriting.");
      return;
    }
    if (beds < 0) {
      setValidationError("O'rinlar soni manfiy bo'lishi mumkin emas.");
      return;
    }
    if (doctors <= 0) {
      setValidationError("Shifokorlar soni noldan katta bo'lishi kerak.");
      return;
    }
    if (dailyPatients <= 0) {
      setValidationError("Kunlik murojaatlar soni noldan katta bo'lishi kerak.");
      return;
    }
    if (ambulanceCars < 0) {
      setValidationError("Tez yordam mashinalari soni manfiy bo'lishi mumkin emas.");
      return;
    }

    const payload = {
      name,
      type,
      beds,
      doctors,
      dailyPatients,
      ambulanceCars,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'health',
        moduleTitle: "Sog'liqni saqlash muassasalari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateHealth({ ...payload, id: editingItem.id });
      } else {
        addHealth(payload);
      }
    }

    setShowModal(false);
  };

  const totalBeds = filteredHealths.reduce((s, h) => s + h.beds, 0);
  const totalDoctors = filteredHealths.reduce((s, h) => s + h.doctors, 0);
  const totalDailyPatients = filteredHealths.reduce((s, h) => s + h.dailyPatients, 0);

  const columns = [
    { key: 'name', label: 'Muassasa nomi', sortable: true },
    {
      key: 'type',
      label: 'Turi',
      sortable: true,
      render: (val: string) => <span className="badge badge-info">{val}</span>,
    },
    {
      key: 'beds',
      label: "O'rinlar soni",
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'doctors',
      label: 'Shifokorlar',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'dailyPatients',
      label: 'Kunlik murojaat',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'ambulanceCars',
      label: 'Tez yordam',
      sortable: true,
      render: (val: number) => `${val} ta`,
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
      render: (_: any, row: HealthItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Sog&apos;liqni saqlash tizimi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tuman shifoxonalari, poliklinikalar va tez tibbiy yordam ko&apos;rsatkichlari
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi muassasa qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Tibbiyot muassasalari"
          value={`${filteredHealths.length} ta`}
          period="Amaldagi ob'ektlar"
          icon={<Heart size={24} />}
          color="red"
        />
        <KpiCard
          title="Shifoxona o'rinlari"
          value={totalBeds > 0 ? `${totalBeds.toLocaleString('uz-UZ')} ta` : "0"}
          period="Statsionar quvvat"
          icon={<Activity size={24} />}
          color="blue"
        />
        <KpiCard
          title="Shifokorlar soni"
          value={totalDoctors > 0 ? `${totalDoctors.toLocaleString('uz-UZ')} nafar` : "0"}
          period="Oliy toifali mutaxassislar"
          icon={<Users size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Kunlik qabul"
          value={totalDailyPatients > 0 ? `${totalDailyPatients.toLocaleString('uz-UZ')} kishi` : "0"}
          period="Ambulator murojaatlar"
          icon={<Ambulance size={24} />}
          color="amber"
        />
      </div>

      <DataTable
        title="Tibbiyot muassasalari ro'yxati"
        columns={columns}
        data={filteredHealths}
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
                {editingItem ? "Tibbiyot muassasasini tahrirlash" : "Yangi muassasa qo'shish"}
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
                  placeholder="Masalan: Angor tuman markaziy shifoxonasi"
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
                  <option value="Markaziy shifoxona">Markaziy shifoxona</option>
                  <option value="Oilaviy poliklinika">Oilaviy poliklinika</option>
                  <option value="Shoshilinch tibbiy yordam">Shoshilinch tibbiy yordam</option>
                  <option value="Qishloq vrachlik punkti">Qishloq vrachlik punkti</option>
                  <option value="Xususiy klinika">Xususiy klinika</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">O&apos;rinlar soni</label>
                  <input
                    type="number"
                    min="0"
                    value={beds}
                    onChange={e => setBeds(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Shifokorlar soni</label>
                  <input
                    type="number"
                    min="1"
                    value={doctors}
                    onChange={e => setDoctors(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Kunlik murojaatlar</label>
                  <input
                    type="number"
                    min="1"
                    value={dailyPatients}
                    onChange={e => setDailyPatients(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Tez yordam mashinalari</label>
                  <input
                    type="number"
                    min="0"
                    value={ambulanceCars}
                    onChange={e => setAmbulanceCars(Number(e.target.value))}
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
                    id="draftHealth"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftHealth" className="cursor-pointer">
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
