'use client';

import React from 'react';
import { HardHat, Building2, CheckCircle2, Clock } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Yakunlangan':
      return <span className="badge badge-success">{status}</span>;
    case 'Jarayonda':
      return <span className="badge badge-info">{status}</span>;
    case 'Kechikmoqda':
      return <span className="badge badge-danger">{status}</span>;
    default:
      return <span className="badge">{status}</span>;
  }
};

const columns = [
  { key: 'name', label: 'Obyekt nomi', sortable: true },
  { key: 'contractor', label: 'Pudratchi tashkilot', sortable: true },
  { key: 'startDate', label: 'Boshlangan sana', sortable: true },
  {
    key: 'budget',
    label: 'Byudjet',
    sortable: true,
    render: (val: number) => `${(val / 1000000000).toFixed(2)} mlrd so'm`,
  },
  {
    key: 'progress',
    label: 'Bajarilish %',
    sortable: true,
    render: (val: number) => (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold">{val}%</span>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Holati',
    sortable: true,
    render: (val: string) => getStatusBadge(val),
  },
];

const projectData = [
  { id: 1, name: "20-umumiy ta'lim maktabi binosini mukammal ta'mirlash", contractor: "Binokor MCHJ", startDate: "10.05.2023", budget: 4500000000, progress: 85, status: "Jarayonda" },
  { id: 2, name: "Yangi ko'p tarmoqli tuman poliklinikasi qurilishi", contractor: "Shahar Qurilish AJ", startDate: "15.01.2023", budget: 8200000000, progress: 100, status: "Yakunlangan" },
  { id: 3, name: "Markaziy istirohat bog'ini obodonlashtirish", contractor: "Yashil Diyor UK", startDate: "01.08.2023", budget: 2100000000, progress: 45, status: "Kechikmoqda" },
  { id: 4, name: "5-sonli maktabgacha ta'lim muassasasi filiali", contractor: "Nurli Qurilish XK", startDate: "20.02.2024", budget: 3200000000, progress: 60, status: "Jarayonda" },
  { id: 5, name: "Ichimlik suvi tarmog'ini tortish (Do'stlik MFY)", contractor: "Suv Ta'minot MCHJ", startDate: "05.03.2024", budget: 1800000000, progress: 95, status: "Jarayonda" },
];

export default function ConstructionProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Qurilish obyektlari va investitsiya loyihalari</h1>
        <p className="text-sm text-gray-500 mt-1">Davlat dasturlari doirasida amalga oshirilayotgan qurilish-ta&apos;mirlash ishlari</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami obyektlar"
          value="24 ta"
          subtitle="Manzilli dastur bo'yicha"
          icon={<HardHat size={24} />}
          color="blue"
        />
        <KpiCard
          title="Yakunlangan"
          value="8 ta"
          subtitle="Foydalanishga topshirildi"
          icon={<CheckCircle2 size={24} />}
          color="green"
        />
        <KpiCard
          title="Jami byudjet"
          value="45.6 mlrd"
          subtitle="Ajratilgan mablag'"
          icon={<Building2 size={24} />}
          color="purple"
        />
        <KpiCard
          title="Kechikayotgan"
          value="3 ta"
          subtitle="Nazoratga olingan"
          icon={<Clock size={24} />}
          color="red"
        />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-4">Asosiy yo&apos;nalishlar bo&apos;yicha reja bajarilishi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="Ta'lim muassasalari ta'miri" planned={12000000000} actual={10500000000} unit="so'm" />
          <ProgressBar label="Tibbiyot maskanlari qurilishi" planned={15000000000} actual={14200000000} unit="so'm" />
          <ProgressBar label="Yo'l va infratuzilma" planned={10000000000} actual={8800000000} unit="so'm" />
          <ProgressBar label="Ichimlik suvi tarmoqlari" planned={8600000000} actual={7400000000} unit="so'm" />
        </div>
      </div>

      <DataTable
        title="Qurilish loyihalari ro'yxati"
        columns={columns}
        data={projectData}
        searchPlaceholder="Obyekt yoki pudratchini qidirish..."
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
        onAdd={() => alert('Yangi loyiha kiritish')}
        addLabel="Yangi obyekt"
      />
    </div>
  );
}
