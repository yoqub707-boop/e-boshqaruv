'use client';

import React, { useState } from 'react';
import {
  Store,
  Users,
  TrendingUp,
  Building2,
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
import { useData, BusinessItem, FileAttachment } from '@/context/DataContext';

export default function BusinessPage() {
  const { filteredBusinesses, addBusiness, updateBusiness, deleteBusiness, addDraft, selectedYear } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BusinessItem | null>(null);

  const [name, setName] = useState('');
  const [inn, setInn] = useState('');
  const [entityType, setEntityType] = useState('MCHJ');
  const [sector, setSector] = useState('');
  const [employees, setEmployees] = useState(25);
  const [annualRevenue, setAnnualRevenue] = useState('2.5 mlrd so\'m');
  const [status, setStatus] = useState('Faol');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [sendToDraft, setSendToDraft] = useState(false);

  const [viewerAttachment, setViewerAttachment] = useState<FileAttachment | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openAdd = () => {
    setEditingItem(null);
    setName('');
    setInn('');
    setEntityType('MCHJ');
    setSector('');
    setEmployees(25);
    setAnnualRevenue('2.5 mlrd so\'m');
    setStatus('Faol');
    setAttachment(null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const openEdit = (item: BusinessItem) => {
    setEditingItem(item);
    setName(item.name);
    setInn(item.inn);
    setEntityType(item.entityType);
    setSector(item.sector);
    setEmployees(item.employees);
    setAnnualRevenue(item.annualRevenue);
    setStatus(item.status);
    setAttachment(item.attachment || null);
    setValidationError('');
    setSendToDraft(false);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu tadbirkorlik sub'ektini o'chirmoqchimisiz?")) {
      deleteBusiness(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError("Korxona nomini kiriting.");
      return;
    }
    if (!inn.trim()) {
      setValidationError("STIR (INN) raqamini kiriting.");
      return;
    }
    if (employees < 0) {
      setValidationError("Xodimlar soni manfiy bo'lishi mumkin emas.");
      return;
    }

    const payload = {
      name,
      inn,
      entityType,
      sector,
      employees,
      annualRevenue,
      status,
      attachment,
      year: selectedYear,
      date: new Date().toISOString().split('T')[0],
    };

    if (sendToDraft && !editingItem) {
      addDraft({
        module: 'business',
        moduleTitle: "Tadbirkorlik sub'ektlari",
        data: payload,
        source: 'MANUAL_ENTRY',
        confidence: 100,
      });
      alert("Ma'lumotlar tasdiqlash navbati (Qoralamalar)ga yuborildi.");
    } else {
      if (editingItem) {
        updateBusiness({ ...payload, id: editingItem.id });
      } else {
        addBusiness(payload);
      }
    }

    setShowModal(false);
  };

  const totalEmployees = filteredBusinesses.reduce((s, b) => s + b.employees, 0);
  const activeCount = filteredBusinesses.filter(b => b.status === 'Faol').length;

  const columns = [
    { key: 'name', label: 'Korxona nomi', sortable: true },
    { key: 'inn', label: 'STIR (INN)', sortable: true },
    { key: 'entityType', label: 'Mulk shakli', sortable: true },
    { key: 'sector', label: 'Faoliyat sohasi', sortable: true },
    {
      key: 'employees',
      label: 'Xodimlar',
      sortable: true,
      render: (val: number) => val.toLocaleString('uz-UZ'),
    },
    { key: 'annualRevenue', label: 'Yillik aylanma', sortable: true },
    {
      key: 'status',
      label: 'Holati',
      sortable: true,
      render: (val: string) => (
        <span className={`badge ${val === 'Faol' ? 'badge-success' : 'badge-danger'}`}>
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
      render: (_: any, row: BusinessItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Kichik biznes va tadbirkorlik</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tumanda faoliyat yuritayotgan yuridik va jismoniy shaxslar faoliyati monitoringi
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Yangi tadbirkor qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami korxonalar"
          value={`${filteredBusinesses.length} ta`}
          period="Ro'yxatdan o'tgan"
          icon={<Store size={24} />}
          color="blue"
        />
        <KpiCard
          title="Faol sub'ektlar"
          value={`${activeCount} ta`}
          period="Muntazam faoliyatda"
          icon={<Building2 size={24} />}
          color="emerald"
        />
        <KpiCard
          title="Band xodimlar"
          value={totalEmployees > 0 ? `${totalEmployees.toLocaleString('uz-UZ')} nafar` : "0"}
          period="Korxonalarda band"
          icon={<Users size={24} />}
          color="indigo"
        />
        <KpiCard
          title="O'sish dinamikasi"
          value="+6.4%"
          period="O'tgan davrga nisbatan"
          icon={<TrendingUp size={24} />}
          color="amber"
        />
      </div>

      <DataTable
        title="Tadbirkorlik sub'ektlari ro'yxati"
        columns={columns}
        data={filteredBusinesses}
        searchPlaceholder="Korxona yoki STIR qidirish..."
        onAdd={openAdd}
        addLabel="Yangi korxona"
        onExport={() => alert('Excel formatida yuklanmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? "Korxonani tahrirlash" : "Yangi korxona qo'shish"}
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
                <label className="form-label">Korxona nomi</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Angor Agro Klaster MCHJ"
                  className="form-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">STIR (INN)</label>
                  <input
                    type="text"
                    value={inn}
                    onChange={e => setInn(e.target.value)}
                    placeholder="Masalan: 308456123"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Mulk shakli</label>
                  <select
                    value={entityType}
                    onChange={e => setEntityType(e.target.value)}
                    className="form-input"
                  >
                    <option value="MCHJ">MCHJ</option>
                    <option value="XK">XK</option>
                    <option value="AJ">AJ</option>
                    <option value="OK">OK</option>
                    <option value="YTT">YTT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Faoliyat sohasi</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    placeholder="Masalan: Agrosanoat"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Xodimlar soni</label>
                  <input
                    type="number"
                    min="0"
                    value={employees}
                    onChange={e => setEmployees(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Yillik aylanma</label>
                  <input
                    type="text"
                    value={annualRevenue}
                    onChange={e => setAnnualRevenue(e.target.value)}
                    placeholder="Masalan: 12.5 mlrd so'm"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Holati</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="Faol">Faol</option>
                    <option value="To'xtatilgan">To&apos;xtatilgan</option>
                    <option value="Tugatish jarayonida">Tugatish jarayonida</option>
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
                    id="draftBiz"
                    checked={sendToDraft}
                    onChange={e => setSendToDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="draftBiz" className="cursor-pointer">
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
