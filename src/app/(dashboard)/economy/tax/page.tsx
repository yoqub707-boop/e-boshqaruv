'use client';

import React, { useState } from 'react';
import {
  Receipt,
  TrendingUp,
  CreditCard,
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
import ProgressBar from '@/components/dashboard/ProgressBar';
import AttachmentUploader from '@/components/common/AttachmentUploader';
import DocumentViewerModal from '@/components/common/DocumentViewerModal';
import { useData, TaxItem, FileAttachment } from '@/context/DataContext';

export default function TaxPage() {
  const { filteredTaxes, addTax, updateTax, deleteTax, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TaxItem | null>(null);

  const [taxType, setTaxType] = useState('Qo\'shilgan qiymat solig\'i (QQS)');
  const [monthName, setMonthName] = useState('Yanvar');
  const [planned, setPlanned] = useState(2000000000);
  const [actual, setActual] = useState(2050000000);
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setTaxType('Qo\'shilgan qiymat solig\'i (QQS)');
    setMonthName('Yanvar');
    setPlanned(2000000000);
    setActual(2050000000);
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: TaxItem) => {
    setEditingItem(item);
    setTaxType(item.taxType);
    setMonthName(item.monthName || 'Yanvar');
    setPlanned(item.planned);
    setActual(item.actual);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu soliq yozuvini o'chirmoqchimisiz?")) {
      deleteTax(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!taxType.trim()) {
      setValidationError("Soliq turini tanlang yoki kiriting.");
      return;
    }
    if (planned <= 0) {
      setValidationError("Rejadagi soliq tushumi noldan katta bo'lishi kerak.");
      return;
    }
    if (actual < 0) {
      setValidationError("Haqiqiy tushum manfiy bo'lishi mumkin emas.");
      return;
    }

    const rate = Math.round((actual / planned) * 1000) / 10;
    const payload = {
      taxType,
      monthName,
      planned,
      actual,
      rate,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'tax',
        moduleTitle: "Soliq tushumlari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateTax({ ...payload, id: editingItem.id });
      } else {
        addTax(payload);
      }
    }

    setShowModal(false);
  };

  const totalPlanned = filteredTaxes.reduce((s, t) => s + t.planned, 0);
  const totalActual = filteredTaxes.reduce((s, t) => s + t.actual, 0);
  const avgRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : '0';

  const columns = [
    { key: 'taxType', label: 'Soliq turi', sortable: true },
    { key: 'monthName', label: 'Oy', sortable: true },
    {
      key: 'planned',
      label: 'Reja (so\'m)',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    {
      key: 'actual',
      label: 'Haqiqiy (so\'m)',
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">{val.toLocaleString('uz-UZ')}</span>
      ),
    },
    {
      key: 'rate',
      label: 'Bajarilishi',
      sortable: true,
      render: (val: number) => (
        <span className={`badge ${val >= 100 ? 'badge-success' : val >= 90 ? 'badge-info' : 'badge-danger'}`}>
          {val}%
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
      render: (_: any, row: TaxItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Soliq tushumlari monitoringi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Davlat byudjetiga tushumlar, rejalar va ularning amaldagi ijrosi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi soliq yozuvi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Rejalashtirilgan tushum"
          value={totalPlanned > 0 ? `${(totalPlanned / 1000000000).toFixed(2)} mlrd` : "0"}
          period="Umumiy reja"
          icon={<Receipt size={24} />}
          color="blue"
        />
        <KpiCard
          title="Amaldagi tushum"
          value={totalActual > 0 ? `${(totalActual / 1000000000).toFixed(2)} mlrd` : "0"}
          period="Haqiqatda undirilgan"
          icon={<CreditCard size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Bajarilish ko'rsatkichi"
          value={`${avgRate}%`}
          period="Rejaga nisbatan"
          icon={<TrendingUp size={24} />}
          color={Number(avgRate) >= 100 ? 'emerald' : 'amber'}
        />
        <KpiCard
          title="Soliq turlari soni"
          value={`${filteredTaxes.length} ta`}
          period="Hisobga olingan bandlar"
          icon={<Building size={24} />}
          color="indigo"
        />
      </div>

      <DataTable
        title="Soliq turlari bo'yicha tushumlar"
        columns={columns}
        data={filteredTaxes}
        searchPlaceholder="Soliq turini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi yozuv"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Soliq ma'lumotini tahrirlash" : "Yangi soliq yozuvi qo'shish"}
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
                <label className="form-label">Soliq turi</label>
                <input
                  type="text"
                  value={taxType}
                  onChange={e => setTaxType(e.target.value)}
                  placeholder="Masalan: Qo'shilgan qiymat solig'i (QQS)"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Hisobot oyi</label>
                <select
                  value={monthName}
                  onChange={e => setMonthName(e.target.value)}
                  className="form-input"
                >
                  {['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Reja (so&apos;m)</label>
                  <input
                    type="number"
                    min="1"
                    value={planned}
                    onChange={e => setPlanned(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Haqiqiy tushum (so&apos;m)</label>
                  <input
                    type="number"
                    min="0"
                    value={actual}
                    onChange={e => setActual(Number(e.target.value))}
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
                    id="draftTax"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftTax" className="cursor-pointer">
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
