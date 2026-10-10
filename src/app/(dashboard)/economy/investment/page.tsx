'use client';

import React, { useState } from 'react';
import {
  Landmark,
  Globe,
  TrendingUp,
  Building,
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
import { useData, InvestmentItem, FileAttachment } from '@/context/DataContext';

export default function InvestmentPage() {
  const { filteredInvestments, addInvestment, updateInvestment, deleteInvestment, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InvestmentItem | null>(null);

  const [country, setCountry] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [plannedAmount, setPlannedAmount] = useState(5000000);
  const [actualAmount, setActualAmount] = useState(4500000);
  const [status, setStatus] = useState('Amalda');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setCountry('');
    setCompanyName('');
    setSector('');
    setPlannedAmount(5000000);
    setActualAmount(4500000);
    setStatus('Amalda');
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: InvestmentItem) => {
    setEditingItem(item);
    setCountry(item.country);
    setCompanyName(item.companyName);
    setSector(item.sector);
    setPlannedAmount(item.plannedAmount);
    setActualAmount(item.actualAmount);
    setStatus(item.status);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu investitsiya loyihasini o'chirmoqchimisiz?")) {
      deleteInvestment(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!country.trim()) {
      setValidationError("Investor davlatini kiriting.");
      return;
    }
    if (!companyName.trim()) {
      setValidationError("Investor yoki korxona nomini kiriting.");
      return;
    }
    if (plannedAmount <= 0) {
      setValidationError("Rejadagi investitsiya summasi noldan katta bo'lishi kerak.");
      return;
    }
    if (actualAmount < 0) {
      setValidationError("O'zlashtirilgan summa manfiy bo'lishi mumkin emas.");
      return;
    }

    const payload = {
      country,
      companyName,
      sector,
      plannedAmount,
      actualAmount,
      status,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'investment',
        moduleTitle: "To'g'ridan-to'g'ri investitsiyalar",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateInvestment({ ...payload, id: editingItem.id });
      } else {
        addInvestment(payload);
      }
    }

    setShowModal(false);
  };

  const totalPlanned = filteredInvestments.reduce((s, i) => s + i.plannedAmount, 0);
  const totalActual = filteredInvestments.reduce((s, i) => s + i.actualAmount, 0);
  const absorptionRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : '0';

  const columns = [
    { key: 'country', label: 'Investor davlat', sortable: true },
    { key: 'companyName', label: 'Investor / Korxona', sortable: true },
    { key: 'sector', label: 'Tarmoq', sortable: true },
    {
      key: 'plannedAmount',
      label: 'Rejadagi ($)',
      sortable: true,
      render: (val: number) => `$${val.toLocaleString('uz-UZ')}`,
    },
    {
      key: 'actualAmount',
      label: 'O\'zlashtirilgan ($)',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">${val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'status',
      label: 'Holati',
      sortable: true,
      render: (val: string) => (
        <span className={`badge ${val === 'Amalda' ? 'badge-success' : 'badge-info'}`}>
          {val}
        </span>
      ),
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
      render: (_: any, row: InvestmentItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Investitsiyalar va loyihalar</h1>
          <p className="text-sm text-gray-500 mt-1">
            To&apos;g&apos;ridan-to&apos;g&apos;ri xorijiy va mahalliy investitsiyalar o&apos;zlashtirilishi monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi investitsiya loyihasi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="O'zlashtirilgan investitsiya"
          value={totalActual > 0 ? `$${(totalActual / 1000000).toFixed(2)} mln` : "$0"}
          period="Amalda jalb etilgan"
          icon={<Landmark size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Yillik reja"
          value={totalPlanned > 0 ? `$${(totalPlanned / 1000000).toFixed(2)} mln` : "$0"}
          period="Kutilayotgan hajm"
          icon={<Globe size={24} />}
          color="blue"
        />
        <KpiCard
          title="O'zlashtirish darajasi"
          value={`${absorptionRate}%`}
          period="Rejaga nisbatan ijro"
          icon={<TrendingUp size={24} />}
          color={Number(absorptionRate) >= 100 ? 'emerald' : 'amber'}
        />
        <KpiCard
          title="Loyihalar soni"
          value={`${filteredInvestments.length} ta`}
          period="Faol loyihalar"
          icon={<Building size={24} />}
          color="indigo"
        />
      </div>

      <DataTable
        title="Investitsiya loyihalari ro'yxati"
        columns={columns}
        data={filteredInvestments}
        searchPlaceholder="Davlat yoki korxona qidirish..."
        onAdd={openAdd}
        addLabel="Yangi loyiha"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Loyihani tahrirlash" : "Yangi investitsiya loyihasi qo'shish"}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Investor davlati</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="Masalan: Turkiya"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Kompaniya / Korxona</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Masalan: Anadolu Agro Teknoloji"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Faoliyat sohasi</label>
                <input
                  type="text"
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  placeholder="Masalan: Agrosanoat va qayta ishlash"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Reja ($ AQSH dollari)</label>
                  <input
                    type="number"
                    min="1"
                    value={plannedAmount}
                    onChange={e => setPlannedAmount(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">O&apos;zlashtirilgan ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={actualAmount}
                    onChange={e => setActualAmount(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Loyihaning holati</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="Amalda">Amalda</option>
                  <option value="Jarayonda">Jarayonda</option>
                  <option value="Muzokarada">Muzokarada</option>
                </select>
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
                    id="draftInv"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftInv" className="cursor-pointer">
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
