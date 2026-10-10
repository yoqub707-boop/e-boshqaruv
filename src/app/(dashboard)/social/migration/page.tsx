'use client';

import React, { useState } from 'react';
import {
  Globe,
  UserCheck,
  PlaneTakeoff,
  PlaneLanding,
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
import { useData, MigrationItem, FileAttachment } from '@/context/DataContext';

export default function MigrationPage() {
  const { filteredMigrations, addMigration, updateMigration, deleteMigration, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MigrationItem | null>(null);

  const [country, setCountry] = useState('');
  const [code, setCode] = useState('RU');
  const [migrants, setMigrants] = useState(1000);
  const [returned, setReturned] = useState(150);
  const [type, setType] = useState('Mavsumiy mehnat');
  const [flag, setFlag] = useState('🇷🇺');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setCountry('');
    setCode('RU');
    setMigrants(1000);
    setReturned(150);
    setType('Mavsumiy mehnat');
    setFlag('🇷🇺');
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: MigrationItem) => {
    setEditingItem(item);
    setCountry(item.country);
    setCode(item.code);
    setMigrants(item.migrants);
    setReturned(item.returned);
    setType(item.type);
    setFlag(item.flag);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu migratsiya ma'lumotini o'chirmoqchimisiz?")) {
      deleteMigration(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!country.trim()) {
      setValidationError("Davlat nomini kiriting.");
      return;
    }
    if (migrants < 0) {
      setValidationError("Migrantlar soni manfiy bo'lishi mumkin emas.");
      return;
    }
    if (returned < 0) {
      setValidationError("Qaytganlar soni manfiy bo'lishi mumkin emas.");
      return;
    }

    const payload = {
      country,
      code,
      migrants,
      returned,
      type,
      flag,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'migration',
        moduleTitle: "Tashqi mehnat migratsiyasi",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateMigration({ ...payload, id: editingItem.id });
      } else {
        addMigration(payload);
      }
    }

    setShowModal(false);
  };

  const totalMigrants = filteredMigrations.reduce((s, m) => s + m.migrants, 0);
  const totalReturned = filteredMigrations.reduce((s, m) => s + m.returned, 0);

  const columns = [
    {
      key: 'country',
      label: 'Davlat',
      sortable: true,
      render: (_: any, row: MigrationItem) => (
        <div className="flex items-center gap-2">
          <span className="text-xl">{row.flag}</span>
          <span className="font-semibold text-gray-900">{row.country}</span>
        </div>
      ),
    },
    {
      key: 'migrants',
      label: 'Migrantlar soni',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'returned',
      label: 'Qaytganlar',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    { key: 'type', label: 'Migratsiya turi', sortable: true },
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
      render: (_: any, row: MigrationItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Tashqi mehnat migratsiyasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Xorijda vaqtinchalik mehnat faoliyatini olib borayotgan va qaytib kelgan fuqarolar monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi ma&apos;lumot qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Xorijdagi fuqarolar"
          value={totalMigrants > 0 ? `${totalMigrants.toLocaleString('uz-UZ')} nafar` : "0"}
          period="Amalda xorijda"
          icon={<PlaneTakeoff size={24} />}
          color="blue"
        />
        <KpiCard
          title="Qaytib kelganlar"
          value={totalReturned > 0 ? `${totalReturned.toLocaleString('uz-UZ')} nafar` : "0"}
          period="Bandligi ta'minlangan"
          icon={<PlaneLanding size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Asosiy yo'nalishlar"
          value={`${filteredMigrations.length} ta davlat`}
          period="Hamkor davlatlar"
          icon={<Globe size={24} />}
          color="indigo"
        />
        <KpiCard
          title="Qaytish ko'rsatkichi"
          value={`${totalMigrants > 0 ? ((totalReturned / totalMigrants) * 100).toFixed(1) : 0}%`}
          period="Reintegratsiya darajasi"
          icon={<UserCheck size={24} />}
          color="amber"
        />
      </div>

      <DataTable
        title="Davlatlar bo'yicha mehnat migratsiyasi"
        columns={columns}
        data={filteredMigrations}
        searchPlaceholder="Davlatni qidirish..."
        onAdd={openAdd}
        addLabel="Yangi yozuv"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Ma'lumotni tahrirlash" : "Yangi ma'lumot qo'shish"}
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
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="form-label">Davlat nomi</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="Masalan: Rossiya"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Bayroq (Emoji)</label>
                  <input
                    type="text"
                    value={flag}
                    onChange={e => setFlag(e.target.value)}
                    placeholder="🇷🇺"
                    className="form-input text-center text-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Migrantlar soni</label>
                  <input
                    type="number"
                    min="0"
                    value={migrants}
                    onChange={e => setMigrants(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Qaytib kelganlar</label>
                  <input
                    type="number"
                    min="0"
                    value={returned}
                    onChange={e => setReturned(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Faoliyat turi / Sohasi</label>
                <input
                  type="text"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  placeholder="Masalan: Mavsumiy qurilish va xizmat"
                  className="form-input"
                  required
                />
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
                    id="draftMig"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftMig" className="cursor-pointer">
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
