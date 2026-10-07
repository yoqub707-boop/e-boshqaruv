'use client';

import React from 'react';
import { Briefcase, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import KpiCard from '@/components/dashboard/KpiCard';
import { StatsBarChart } from '@/components/dashboard/StatsChart';

const columns = [
  { key: 'sector', label: 'Iqtisodiy soha / Sektor', sortable: true },
  {
    key: 'plannedJobs',
    label: 'Reja (yangi ish o\'rni)',
    sortable: true,
    render: (val: number) => val.toLocaleString('uz-UZ'),
  },
  {
    key: 'actualJobs',
    label: 'Haqiqatda yaratildi',
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

const employmentData = [
  { id: 1, sector: "Kichik biznes va tadbirkorlik", plannedJobs: 1500, actualJobs: 1450, executionRate: 96.6 },
  { id: 2, sector: "Xizmat ko'rsatish va servis", plannedJobs: 2000, actualJobs: 2100, executionRate: 105.0 },
  { id: 3, sector: "Qishloq xo'jaligi va agrosanoat", plannedJobs: 1000, actualJobs: 980, executionRate: 98.0 },
  { id: 4, sector: "Sanoat va ishlab chiqarish", plannedJobs: 800, actualJobs: 820, executionRate: 102.5 },
  { id: 5, sector: "Qurilish va infratuzilma", plannedJobs: 600, actualJobs: 570, executionRate: 95.0 },
];

const chartData = [
  { soh: "Kichik biznes", reja: 1500, haqiqiy: 1450 },
  { soh: "Xizmat", reja: 2000, haqiqiy: 2100 },
  { soh: "Qishloq xo'j.", reja: 1000, haqiqiy: 980 },
  { soh: "Sanoat", reja: 800, haqiqiy: 820 },
  { soh: "Qurilish", reja: 600, haqiqiy: 570 },
];

export default function EmploymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Iqtisodiyot: Bandlik va Yangi ish o&apos;rinlari</h1>
        <p className="text-sm text-gray-500 mt-1">Hududda yangi ish o&apos;rinlarini yaratish va bandlik ko&apos;rsatkichlari</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Umumiy bandlik darajasi"
          value="93.8%"
          subtitle="Iqtisodiy faol aholi"
          icon={<UserCheck size={24} />}
          color="green"
          trend={{ value: 1.5, label: "o'tgan chorakka nisbatan" }}
        />
        <KpiCard
          title="Yangi ish o'rinlari"
          value="5,920 ta"
          subtitle="Yillik jamg'arilgan"
          icon={<Briefcase size={24} />}
          color="blue"
          trend={{ value: 4.2, label: "o'sish" }}
        />
        <KpiCard
          title="O'rtacha oylik maosh"
          value="3.8 mln so'm"
          subtitle="Rasmiy sektor"
          icon={<TrendingUp size={24} />}
          color="purple"
          trend={{ value: 8.5, label: "inflyatsiyadan yuqori" }}
        />
        <KpiCard
          title="Ish izlayotganlar"
          value="1,420 kishi"
          subtitle="Bandlik markazida"
          icon={<AlertCircle size={24} />}
          color="orange"
          trend={{ value: -3.1, label: "kamayish" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Sektorlar kesimida ish o'rinlari"
          columns={columns}
          data={employmentData}
          searchPlaceholder="Sohani qidirish..."
          onExport={() => alert('Excel ga eksport qilinmoqda...')}
        />
        <StatsBarChart
          title="Reja va haqiqiy yaratilgan ish o'rinlari"
          data={chartData}
          xAxisKey="soh"
          bars={[
            { dataKey: 'reja', name: 'Reja', color: '#1e40af' },
            { dataKey: 'haqiqiy', name: 'Haqiqiy', color: '#16a34a' },
          ]}
        />
      </div>
    </div>
  );
}
