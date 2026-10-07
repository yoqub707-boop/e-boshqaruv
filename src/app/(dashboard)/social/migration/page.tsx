'use client';

import React from 'react';
import { Globe, Users, ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import DataTable from '@/components/common/DataTable';
import { StatsBarChart, StatsPieChart } from '@/components/dashboard/StatsChart';

// Davlatlar bo'yicha migratsiya
const migrationByCountry = [
  { id: 1, country: 'Rossiya', code: 'RU', migrants: 8450, returned: 2100, type: 'Mehnat', flag: '🇷🇺' },
  { id: 2, country: 'Qozog\'iston', code: 'KZ', migrants: 1560, returned: 890, type: 'Mehnat', flag: '🇰🇿' },
  { id: 3, country: 'Turkiya', code: 'TR', migrants: 980, returned: 320, type: 'Mehnat', flag: '🇹🇷' },
  { id: 4, country: 'Janubiy Koreya', code: 'KR', migrants: 750, returned: 180, type: 'Mehnat', flag: '🇰🇷' },
  { id: 5, country: 'AQSh', code: 'US', migrants: 320, returned: 45, type: 'Doimiy', flag: '🇺🇸' },
  { id: 6, country: 'Germaniya', code: 'DE', migrants: 180, returned: 30, type: "Ta'lim", flag: '🇩🇪' },
  { id: 7, country: 'BAA', code: 'AE', migrants: 290, returned: 150, type: 'Mehnat', flag: '🇦🇪' },
  { id: 8, country: 'Yaponiya', code: 'JP', migrants: 120, returned: 25, type: "Ta'lim", flag: '🇯🇵' },
  { id: 9, country: 'Buyuk Britaniya', code: 'GB', migrants: 95, returned: 15, type: "Ta'lim", flag: '🇬🇧' },
  { id: 10, country: 'Polsha', code: 'PL', migrants: 145, returned: 40, type: 'Mehnat', flag: '🇵🇱' },
];

const columns = [
  {
    key: 'country',
    label: 'Davlat',
    sortable: true,
    render: (val: string, row: any) => (
      <div className="flex items-center gap-2">
        <span className="text-xl">{row.flag}</span>
        <span className="font-medium">{val}</span>
      </div>
    ),
  },
  { key: 'code', label: 'Kod', sortable: true },
  {
    key: 'migrants',
    label: 'Migrantlar',
    sortable: true,
    render: (val: number) => (
      <span className="font-semibold text-orange-600">{val.toLocaleString()}</span>
    ),
  },
  {
    key: 'returned',
    label: 'Qaytganlar',
    sortable: true,
    render: (val: number) => (
      <span className="font-semibold text-green-600">{val.toLocaleString()}</span>
    ),
  },
  {
    key: 'type',
    label: 'Migratsiya turi',
    sortable: true,
    render: (val: string) => (
      <span className={`badge ${val === 'Mehnat' ? 'badge-info' : val === "Ta'lim" ? 'badge-success' : 'badge-warning'}`}>
        {val}
      </span>
    ),
  },
];

export default function MigrationPage() {
  const totalMigrants = migrationByCountry.reduce((sum, m) => sum + m.migrants, 0);
  const totalReturned = migrationByCountry.reduce((sum, m) => sum + m.returned, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Migratsiya</h1>
        <p className="text-sm text-gray-500 mt-1">Mehnat migratsiyasi va davlatlar bo&apos;yicha taqsimot</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami migrantlar"
          value={totalMigrants}
          subtitle="Barcha davlatlarda"
          icon={<Globe size={24} />}
          color="orange"
          trend={{ value: -3.1, label: "o'tgan yilga nisbatan" }}
        />
        <KpiCard
          title="Qaytganlar"
          value={totalReturned}
          subtitle="Joriy yilda"
          icon={<ArrowDownRight size={24} />}
          color="green"
          trend={{ value: 12.5, label: "o'tgan yilga nisbatan" }}
        />
        <KpiCard
          title="Ketganlar"
          value={totalMigrants - totalReturned}
          subtitle="Hozirda chet elda"
          icon={<ArrowUpRight size={24} />}
          color="red"
        />
        <KpiCard
          title="Davlatlar soni"
          value={migrationByCountry.length}
          subtitle="Migrantlar mavjud"
          icon={<MapPin size={24} />}
          color="blue"
        />
      </div>

      {/* Grafiklar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsBarChart
          title="Davlatlar bo'yicha migrantlar soni"
          data={migrationByCountry.slice(0, 6)}
          xAxisKey="country"
          bars={[
            { dataKey: 'migrants', name: 'Migrantlar', color: '#f59e0b' },
            { dataKey: 'returned', name: 'Qaytganlar', color: '#16a34a' },
          ]}
        />
        <StatsPieChart
          title="Migratsiya turi bo'yicha taqsimot"
          data={[
            { name: 'Mehnat', value: 11655 },
            { name: "Ta'lim", value: 395 },
            { name: 'Doimiy', value: 840 },
          ]}
        />
      </div>

      {/* Jadval */}
      <DataTable
        title="Davlatlar bo'yicha migratsiya"
        columns={columns}
        data={migrationByCountry}
        searchPlaceholder="Davlat nomini qidirish..."
        onExport={() => alert('Excel ga eksport qilinmoqda...')}
      />
    </div>
  );
}
