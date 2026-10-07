'use client';

import React from 'react';
import { Receipt, TrendingUp } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import { StatsBarChart } from '@/components/dashboard/StatsChart';

// Namuna soliq ma'lumotlari
const taxData = [
  { id: 1, taxType: 'QQS', month: 'Yanvar', planned: 2500000000, actual: 2350000000, rate: 94.0 },
  { id: 2, taxType: 'Foyda solig\'i', month: 'Yanvar', planned: 1800000000, actual: 1750000000, rate: 97.2 },
  { id: 3, taxType: 'Mol-mulk solig\'i', month: 'Yanvar', planned: 800000000, actual: 720000000, rate: 90.0 },
  { id: 4, taxType: 'Yer solig\'i', month: 'Yanvar', planned: 600000000, actual: 580000000, rate: 96.7 },
  { id: 5, taxType: 'QQS', month: 'Fevral', planned: 2700000000, actual: 2680000000, rate: 99.3 },
  { id: 6, taxType: 'Foyda solig\'i', month: 'Fevral', planned: 1900000000, actual: 1820000000, rate: 95.8 },
  { id: 7, taxType: 'Mol-mulk solig\'i', month: 'Fevral', planned: 850000000, actual: 790000000, rate: 92.9 },
  { id: 8, taxType: 'Yer solig\'i', month: 'Fevral', planned: 620000000, actual: 610000000, rate: 98.4 },
  { id: 9, taxType: 'Aksiz solig\'i', month: 'Yanvar', planned: 450000000, actual: 430000000, rate: 95.6 },
  { id: 10, taxType: 'Aksiz solig\'i', month: 'Fevral', planned: 480000000, actual: 465000000, rate: 96.9 },
];

const columns = [
  { key: 'taxType', label: 'Soliq turi', sortable: true },
  { key: 'month', label: 'Oy', sortable: true },
  {
    key: 'planned',
    label: 'Reja',
    sortable: true,
    render: (val: number) => `${(val / 1000000000).toFixed(2)} mlrd`,
  },
  {
    key: 'actual',
    label: 'Haqiqiy',
    sortable: true,
    render: (val: number) => `${(val / 1000000000).toFixed(2)} mlrd`,
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
];

export default function TaxRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Soliq tushumlari</h1>
        <p className="text-sm text-gray-500 mt-1">Soliq turlarI bo&apos;yicha reja va bajarilish</p>
      </div>

      {/* KPI kartalar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami reja"
          value="45.0 mlrd"
          subtitle="2024-yil uchun"
          icon={<Receipt size={24} />}
          color="blue"
        />
        <KpiCard
          title="Jami yig'ildi"
          value="38.2 mlrd"
          subtitle="Hozirgi holatga"
          icon={<TrendingUp size={24} />}
          color="green"
          trend={{ value: 4.5, label: "o'tgan yilga nisbatan" }}
        />
        <KpiCard
          title="Bajarilish darajasi"
          value="84.9%"
          subtitle="Umumiy ko'rsatkich"
          icon={<Receipt size={24} />}
          color="orange"
        />
        <KpiCard
          title="Qoldiq"
          value="6.8 mlrd"
          subtitle="Yil oxirigacha"
          icon={<Receipt size={24} />}
          color="red"
        />
      </div>

      {/* Progress */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4">Soliq turlari bo&apos;yicha bajarilish</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="QQS" planned={5200000000} actual={5030000000} unit="so'm" />
          <ProgressBar label="Foyda solig'i" planned={3700000000} actual={3570000000} unit="so'm" />
          <ProgressBar label="Mol-mulk solig'i" planned={1650000000} actual={1510000000} unit="so'm" />
          <ProgressBar label="Yer solig'i" planned={1220000000} actual={1190000000} unit="so'm" />
        </div>
      </div>

      {/* Jadval */}
      <DataTable
        title="Soliq tushumlari jadvali"
        columns={columns}
        data={taxData}
        searchPlaceholder="Soliq turini qidirish..."
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
        onAdd={() => alert('Yangi yozuv qo\'shish')}
        addLabel="Yangi yozuv"
      />
    </div>
  );
}
