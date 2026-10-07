"use client";

import React from 'react';
import { DataTable } from '@/components/DataTable';
import { KpiCard } from '@/components/KpiCard';
import { StatsBarChart } from '@/components/StatsBarChart';

const columns = [
  { header: 'Sektor', accessor: 'sector' },
  { header: 'Reja (yangi ish o\'rinlari)', accessor: 'plan' },
  { header: 'Haqiqiy', accessor: 'actual' },
  { header: 'Bajarilish (%)', accessor: 'progress' },
];

const data = [
  { sector: 'Kichik biznes', plan: '150,000', actual: '145,000', progress: '96.6%' },
  { sector: 'Xizmat ko\'rsatish', plan: '200,000', actual: '210,000', progress: '105%' },
  { sector: 'Qishloq xo\'jaligi', plan: '100,000', actual: '98,000', progress: '98%' },
  { sector: 'Sanoat', plan: '80,000', actual: '82,000', progress: '102.5%' },
];

const barData = [
  { name: 'Kichik biznes', plan: 150000, actual: 145000 },
  { name: 'Xizmat ko\'rsatish', plan: 200000, actual: 210000 },
  { name: 'Qishloq xo\'jaligi', plan: 100000, actual: 98000 },
  { name: 'Sanoat', plan: 80000, actual: 82000 },
];

export default function EmploymentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Iqtisodiyot: Bandlik</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Umumiy bandlik darajasi" value="92.5%" trend="+1.5%" />
        <KpiCard title="Yangi ish o'rinlari (Jami)" value="535,000" trend="+4.2%" />
        <KpiCard title="Ishsizlar soni" value="1,200,000" trend="-2.1%" />
        <KpiCard title="O'rtacha oylik maosh" value="3.5 mln so'm" trend="+8.5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sektorlar kesimida yangi ish o'rinlari</h2>
          <DataTable columns={columns} data={data} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Reja va haqiqiy ko'rsatkichlar</h2>
          <StatsBarChart data={barData} />
        </div>
      </div>
    </div>
  );
}
