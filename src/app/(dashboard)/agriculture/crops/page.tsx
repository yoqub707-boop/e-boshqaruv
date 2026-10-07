"use client";

import React from 'react';
import { DataTable } from '@/components/DataTable';
import { KpiCard } from '@/components/KpiCard';
import { StatsPieChart } from '@/components/StatsPieChart';

const columns = [
  { header: 'Ekin turi', accessor: 'type' },
  { header: 'Ekilgan maydon (gektar)', accessor: 'area' },
  { header: 'Kutilayotgan hosil (tonna)', accessor: 'expectedYield' },
  { header: 'Bajarilish darajasi (%)', accessor: 'progress' },
];

const data = [
  { type: 'Paxta', area: '1,000,000', expectedYield: '3,000,000', progress: '95%' },
  { type: 'G\'alla', area: '1,200,000', expectedYield: '8,000,000', progress: '98%' },
  { type: 'Sabzavot', area: '300,000', expectedYield: '10,000,000', progress: '102%' },
  { type: 'Meva', area: '250,000', expectedYield: '2,500,000', progress: '100%' },
];

const pieData = [
  { name: 'Paxta', value: 36 },
  { name: 'G\'alla', value: 44 },
  { name: 'Sabzavot', value: 11 },
  { name: 'Meva', value: 9 },
];

export default function CropsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Qishloq xo'jaligi: Ekinlar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Umumiy ekin maydoni" value="2,750,000 ga" trend="+2.5%" />
        <KpiCard title="Kutilayotgan hosil" value="23.5 mln tonna" trend="+5.0%" />
        <KpiCard title="O'rtacha bajarilish" value="98.7%" trend="+1.2%" />
        <KpiCard title="Band qilingan texnikalar" value="45,000" trend="0%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ekinlar bo'yicha batafsil ma'lumot</h2>
          <DataTable columns={columns} data={data} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ekilgan maydon taqsimoti</h2>
          <StatsPieChart data={pieData} />
        </div>
      </div>
    </div>
  );
}
