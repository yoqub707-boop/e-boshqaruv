'use client';

import React from 'react';
import { Home, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';

const columns = [
  { key: 'name', label: 'Mahalla nomi', sortable: true },
  { key: 'chairman', label: 'Mahalla raisi', sortable: true },
  {
    key: 'population',
    label: 'Aholi soni',
    sortable: true,
    render: (val: number) => val.toLocaleString('uz-UZ'),
  },
  {
    key: 'households',
    label: 'Xonadonlar soni',
    sortable: true,
    render: (val: number) => val.toLocaleString('uz-UZ'),
  },
  {
    key: 'problemRate',
    label: 'Murojaatlar hal etilishi',
    sortable: true,
    render: (val: number) => (
      <span className={`badge ${val >= 95 ? 'badge-success' : val >= 90 ? 'badge-info' : 'badge-warning'}`}>
        {val}%
      </span>
    ),
  },
];

const mahallaData = [
  { id: 1, name: "Navbahor", chairman: "Azizov Alisher", population: 5420, households: 1250, problemRate: 94.5 },
  { id: 2, name: "Gulshan", chairman: "Karimova Dildora", population: 4800, households: 1100, problemRate: 98.0 },
  { id: 3, name: "Do'stlik", chairman: "Toshmatov Vali", population: 6200, households: 1420, problemRate: 91.2 },
  { id: 4, name: "Alisher Navoiy", chairman: "Nazarov Bobur", population: 7100, households: 1650, problemRate: 96.0 },
  { id: 5, name: "O'zbekiston", chairman: "Eshmurodov Jasur", population: 5900, households: 1380, problemRate: 89.5 },
];

export default function MahallaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mahallalar kesimida ijtimoiy holat</h1>
        <p className="text-sm text-gray-500 mt-1">Mahalla fuqarolar yig&apos;inlari, aholi va xonadonlar monitoringi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami mahallalar"
          value="45 ta"
          subtitle="Tuman bo'yicha"
          icon={<Home size={24} />}
          color="blue"
        />
        <KpiCard
          title="Jami aholi"
          value="287,450"
          subtitle="Ro'yxatda mavjud"
          icon={<Users size={24} />}
          color="green"
          trend={{ value: 2.3, label: "o'sish" }}
        />
        <KpiCard
          title="Hal etilgan masalalar"
          value="94.2%"
          subtitle="Fuqarolar murojaatlari"
          icon={<CheckCircle size={24} />}
          color="teal"
          trend={{ value: 5.0, label: "ijobiy natija" }}
        />
        <KpiCard
          title="E'tiborga muhtoj"
          value="182 ta"
          subtitle="Ijtimoiy daftarlarda"
          icon={<AlertTriangle size={24} />}
          color="orange"
          trend={{ value: -12.0, label: "kamaygan" }}
        />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-4">Mahalla xonadonlari bo&apos;yicha ijtimoiy ko&apos;mak choralari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar label="Ijtimoiy reyestr yordamlari" planned={1200} actual={1140} unit="ta" />
          <ProgressBar label="Bandlik ta'minlangan oilalar" planned={850} actual={810} unit="ta" />
          <ProgressBar label="Kredit va subsidiya ajratilgan" planned={450} actual={435} unit="ta" />
          <ProgressBar label="Tibbiy ko'rikdan o'tganlar" planned={6500} actual={6380} unit="nafar" />
        </div>
      </div>

      <DataTable
        title="Mahallalar ro'yxati va ko'rsatkichlari"
        columns={columns}
        data={mahallaData}
        searchPlaceholder="Mahalla yoki raisni qidirish..."
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
      />
    </div>
  );
}
