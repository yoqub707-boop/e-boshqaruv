'use client';

import React from 'react';
import { Sprout, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import { StatsPieChart, StatsBarChart } from '@/components/dashboard/StatsChart';

const columns = [
  { key: 'cropType', label: 'Ekin turi', sortable: true },
  {
    key: 'plantedArea',
    label: 'Ekilgan maydon (ga)',
    sortable: true,
    render: (val: number) => val.toLocaleString('uz-UZ'),
  },
  {
    key: 'expectedYield',
    label: 'Kutilayotgan hosil (tonna)',
    sortable: true,
    render: (val: number) => val.toLocaleString('uz-UZ'),
  },
  {
    key: 'executionRate',
    label: 'Bajarilish %',
    sortable: true,
    render: (val: number) => (
      <span className={`badge ${val >= 100 ? 'badge-success' : val >= 90 ? 'badge-info' : 'badge-warning'}`}>
        {val}%
      </span>
    ),
  },
];

const cropData = [
  { id: 1, cropType: "Paxta", plantedArea: 12500, expectedYield: 45000, executionRate: 98.2 },
  { id: 2, cropType: "G'alla", plantedArea: 18200, expectedYield: 72000, executionRate: 104.5 },
  { id: 3, cropType: "Sabzavotlar", plantedArea: 6400, expectedYield: 38000, executionRate: 95.0 },
  { id: 4, cropType: "Poliz ekinlari", plantedArea: 3100, expectedYield: 22000, executionRate: 101.0 },
  { id: 5, cropType: "Meva va uzum", plantedArea: 4800, expectedYield: 29000, executionRate: 97.4 },
];

const pieData = [
  { name: "G'alla", value: 18200 },
  { name: "Paxta", value: 12500 },
  { name: "Sabzavot", value: 6400 },
  { name: "Meva", value: 4800 },
  { name: "Poliz", value: 3100 },
];

export default function CropsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Qishloq xo&apos;jaligi: Ekinlar</h1>
        <p className="text-sm text-gray-500 mt-1">Ekin maydonlari va kutilayotgan hosildorlik tahlili</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Umumiy ekin maydoni"
          value="45,000 ga"
          subtitle="Joriy mavsum"
          icon={<Sprout size={24} />}
          color="green"
          trend={{ value: 2.5, label: "o'tgan yilga nisbatan" }}
        />
        <KpiCard
          title="Kutilayotgan hosil"
          value="206,000 t"
          subtitle="Jami prognoz"
          icon={<TrendingUp size={24} />}
          color="blue"
          trend={{ value: 4.8, label: "o'sish" }}
        />
        <KpiCard
          title="O'rtacha bajarilish"
          value="99.2%"
          subtitle="Rejaga nisbatan"
          icon={<CheckCircle size={24} />}
          color="teal"
        />
        <KpiCard
          title="Mavsumiy texnikalar"
          value="1,450 ta"
          subtitle="Dala ishlarida"
          icon={<Clock size={24} />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable
            title="Ekinlar bo'yicha batafsil ma'lumot"
            columns={columns}
            data={cropData}
            searchPlaceholder="Ekin turini qidirish..."
            onExport={() => alert('Excel ga eksport qilinmoqda...')}
          />
        </div>
        <div className="space-y-6">
          <StatsPieChart
            title="Ekin maydonlari taqsimoti (ga)"
            data={pieData}
          />
        </div>
      </div>
    </div>
  );
}
