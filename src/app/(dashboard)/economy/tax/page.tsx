'use client';

import React, { useState } from 'react';
import { Receipt, TrendingUp, Plus, Edit, Trash2, X } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import { useData, TaxItem } from '@/context/DataContext';

export default function TaxRevenuePage() {
  const { taxes, addTax, updateTax, deleteTax } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TaxItem | null>(null);

  const [taxType, setTaxType] = useState('QQS');
  const [month, setMonth] = useState('Yanvar');
  const [year, setYear] = useState(2024);
  const [planned, setPlanned] = useState(2000000000);
  const [actual, setActual] = useState(1900000000);

  const openAdd = () => {
    setEditingItem(null);
    setTaxType('QQS');
    setMonth('Yanvar');
    setYear(2024);
    setPlanned(2000000000);
    setActual(1900000000);
    setShowModal(true);
  };

  const openEdit = (item: TaxItem) => {
    setEditingItem(item);
    setTaxType(item.taxType);
    setMonth(item.month);
    setYear(item.year);
    setPlanned(item.planned);
    setActual(item.actual);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Ushbu soliq tushumi ma'lumotini o'chirmoqchimisiz?")) {
      deleteTax(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = planned > 0 ? Number(((actual / planned) * 100).toFixed(1)) : 0;
    if (editingItem) {
      updateTax({ id: editingItem.id, taxType, month, year, planned, actual, rate });
    } else {
      addTax({ taxType, month, year, planned, actual, rate });
    }
    setShowModal(false);
  };

  const totalPlanned = taxes.reduce((s, t) => s + t.planned, 0);
  const totalActual = taxes.reduce((s, t) => s + t.actual, 0);
  const overallRate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : '0';

  const columns = [
    { key: 'taxType', label: 'Soliq turi', sortable: true },
    { key: 'month', label: 'Oy', sortable: true },
    { key: 'year', label: 'Yil', sortable: true },
    {
      key: 'planned',
      label: 'Reja',
      sortable: true,
      render: (val: number) => `${(val / 1000000000).toFixed(2)} mlrd so'm`,
    },
    {
      key: 'actual',
      label: 'Haqiqiy',
      sortable: true,
      render: (val: number) => `${(val / 1000000000).toFixed(2)} mlrd so'm`,
    },
    {
      key: 'rate',
      label: 'Bajarilish %',
      sortable: true,
      render: (val: number) => (
        <span
          className={`badge ${
            val >= 95 ? 'badge-success' : val >= 85 ? 'badge-warning' : 'badge-danger'
          }`}
        >
          {val}%
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Amallar',
      render: (_: any, row: TaxItem) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Soliq tushumlari tahlili</h1>
          <p className="text-sm text-gray-500 mt-1">Soliq turlari bo&apos;yicha reja va amaldagi tushumlar</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Yangi soliq tushumi kiritish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami reja"
          value={`${(totalPlanned / 1000000000).toFixed(1)} mlrd`}
          subtitle="Yillik reja"
          icon={<Receipt size={24} />}
          color="blue"
        />
        <KpiCard
          title="Jami tushum"
          value={`${(totalActual / 1000000000).toFixed(1)} mlrd`}
          subtitle="Amalda undirilgan"
          icon={<TrendingUp size={24} />}
          color="green"
          trend={{ value: 4.5, label: "o'tgan davrga nisbatan" }}
        />
        <KpiCard
          title="Bajarilish darajasi"
          value={`${overallRate}%`}
          subtitle="Umumiy samaradorlik"
          icon={<Receipt size={24} />}
          color="orange"
        />
        <KpiCard
          title="Qoldiq / Farq"
          value={`${((totalPlanned - totalActual) / 1000000000).toFixed(1)} mlrd`}
          subtitle="Yil oxirigacha reja"
          icon={<Receipt size={24} />}
          color="red"
        />
      </div>

      <DataTable
        title="Soliq tushumlari batafsil jadvali"
        columns={columns}
        data={taxes}
        searchPlaceholder="Soliq turini qidirish..."
        onAdd={openAdd}
        addLabel="Yangi tushum"
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">{editingItem ? "Soliq tushumini tahrirlash" : "Yangi soliq tushumi"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Soliq turi</label>
                <select value={taxType} onChange={e => setTaxType(e.target.value)} className="form-input">
                  <option value="QQS">QQS (Qo'shilgan qiymat solig'i)</option>
                  <option value="Foyda solig'i">Foyda solig&apos;i</option>
                  <option value="Mol-mulk solig'i">Mol-mulk solig&apos;i</option>
                  <option value="Yer solig'i">Yer solig&apos;i</option>
                  <option value="Aksiz solig'i">Aksiz solig&apos;i</option>
                  <option value="JSHDS (Daromad solig'i)">JSHDS (Daromad solig&apos;i)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Oy</label>
                  <select value={month} onChange={e => setMonth(e.target.value)} className="form-input">
                    <option value="Yanvar">Yanvar</option>
                    <option value="Fevral">Fevral</option>
                    <option value="Mart">Mart</option>
                    <option value="Aprel">Aprel</option>
                    <option value="May">May</option>
                    <option value="Iyun">Iyun</option>
                    <option value="Iyul">Iyul</option>
                    <option value="Avgust">Avgust</option>
                    <option value="Sentabr">Sentabr</option>
                    <option value="Oktabr">Oktabr</option>
                    <option value="Noyabr">Noyabr</option>
                    <option value="Dekabr">Dekabr</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Yil</label>
                  <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Reja miqdori (so&apos;mda)</label>
                <input type="number" value={planned} onChange={e => setPlanned(Number(e.target.value))} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Haqiqatda undirildi (so&apos;mda)</label>
                <input type="number" value={actual} onChange={e => setActual(Number(e.target.value))} className="form-input" required />
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
