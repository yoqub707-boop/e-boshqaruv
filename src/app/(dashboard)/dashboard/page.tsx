'use client';

import React from 'react';
import {
  Users,
  Home,
  Briefcase,
  Globe,
  GraduationCap,
  Heart,
  TrendingUp,
  Building2,
  Leaf,
  Receipt,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import { StatsBarChart, StatsLineChart, StatsPieChart } from '@/components/dashboard/StatsChart';

// Namuna ma'lumotlar
const kpiData = [
  {
    title: 'Umumiy aholi',
    value: 287450,
    subtitle: '2024-yil holatiga',
    icon: <Users size={24} />,
    color: 'blue' as const,
    trend: { value: 2.3, label: "o'tgan yilga nisbatan" },
  },
  {
    title: 'Xonadonlar soni',
    value: 68200,
    subtitle: 'Jami ro\'yxatdan o\'tgan',
    icon: <Home size={24} />,
    color: 'green' as const,
    trend: { value: 1.8, label: "o'tgan yilga nisbatan" },
  },
  {
    title: 'Faol tadbirkorlar',
    value: 4350,
    subtitle: 'YTT va MCHJ',
    icon: <Briefcase size={24} />,
    color: 'purple' as const,
    trend: { value: 5.2, label: "o'tgan yilga nisbatan" },
  },
  {
    title: 'Migrantlar soni',
    value: 12890,
    subtitle: 'Mehnat migratsiyasi',
    icon: <Globe size={24} />,
    color: 'orange' as const,
    trend: { value: -3.1, label: "o'tgan yilga nisbatan" },
  },
  {
    title: 'Maktablar',
    value: 47,
    subtitle: "Umumta'lim maktablari",
    icon: <GraduationCap size={24} />,
    color: 'teal' as const,
    trend: { value: 0, label: "o'zgarmagan" },
  },
  {
    title: 'Tibbiyot muassasalari',
    value: 23,
    subtitle: 'Kasalxona va poliklinikalar',
    icon: <Heart size={24} />,
    color: 'red' as const,
    trend: { value: 4.3, label: "o'tgan yilga nisbatan" },
  },
];

// Ijro intizomi ma'lumotlari
const executionData = [
  { label: 'Soliq tushumlari', planned: 45000000000, actual: 38250000000, unit: "so'm" },
  { label: 'Yangi ish o\'rinlari', planned: 5000, actual: 4150, unit: 'ta' },
  { label: 'Qurilish loyihalari', planned: 25, actual: 18, unit: 'ta' },
  { label: 'Daraxt ekish', planned: 50000, actual: 42500, unit: 'tup' },
  { label: 'Eksport hajmi', planned: 15000000, actual: 12750000, unit: 'USD' },
];

// Oylik soliq tushumlari
const monthlyTaxData = [
  { oy: 'Yan', reja: 3500, haqiqiy: 3200 },
  { oy: 'Fev', reja: 3800, haqiqiy: 3600 },
  { oy: 'Mar', reja: 4200, haqiqiy: 4100 },
  { oy: 'Apr', reja: 4000, haqiqiy: 3850 },
  { oy: 'May', reja: 4500, haqiqiy: 4300 },
  { oy: 'Iyun', reja: 4800, haqiqiy: 4650 },
  { oy: 'Iyul', reja: 4200, haqiqiy: 3900 },
  { oy: 'Avg', reja: 4600, haqiqiy: 4400 },
  { oy: 'Sen', reja: 5000, haqiqiy: 4750 },
  { oy: 'Okt', reja: 4800, haqiqiy: 0 },
  { oy: 'Noy', reja: 5200, haqiqiy: 0 },
  { oy: 'Dek', reja: 5400, haqiqiy: 0 },
];

// Aholi tarkibi
const populationData = [
  { name: '0-18 yosh', value: 86235 },
  { name: '18-30 yosh', value: 63239 },
  { name: '30-50 yosh', value: 80486 },
  { name: '50-65 yosh', value: 37369 },
  { name: '65+ yosh', value: 20121 },
];

// Migratsiya ma'lumotlari
const migrationData = [
  { davlat: 'Rossiya', soni: 8450 },
  { davlat: 'Qozog\'iston', soni: 1560 },
  { davlat: 'Turkiya', soni: 980 },
  { davlat: 'AQSH', soni: 320 },
  { davlat: 'Janubiy Koreya', soni: 750 },
  { davlat: 'Boshqalar', soni: 830 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Boshqaruv paneli</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tuman ijtimoiy-iqtisodiy ko&apos;rsatkichlari umumiy ko&apos;rinishi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="form-input w-auto text-sm">
            <option>2024-yil</option>
            <option>2023-yil</option>
            <option>2022-yil</option>
          </select>
          <select className="form-input w-auto text-sm">
            <option>Barcha choraklar</option>
            <option>1-chorak</option>
            <option>2-chorak</option>
            <option>3-chorak</option>
            <option>4-chorak</option>
          </select>
        </div>
      </div>

      {/* KPI kartalar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Ijro intizomi */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ijro intizomi</h2>
              <p className="text-xs text-gray-500">Reja va haqiqiy bajarilish</p>
            </div>
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
            Batafsil <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {executionData.map((item, index) => (
            <ProgressBar key={index} {...item} />
          ))}
        </div>
      </div>

      {/* Grafiklar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsBarChart
          title="Oylik soliq tushumlari (mlrd so'm)"
          data={monthlyTaxData}
          xAxisKey="oy"
          bars={[
            { dataKey: 'reja', name: 'Reja', color: '#1e40af' },
            { dataKey: 'haqiqiy', name: 'Haqiqiy', color: '#16a34a' },
          ]}
        />
        <StatsPieChart
          title="Aholi yosh tarkibi"
          data={populationData}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsBarChart
          title="Migratsiya - davlatlar bo'yicha"
          data={migrationData}
          xAxisKey="davlat"
          bars={[
            { dataKey: 'soni', name: 'Migrantlar soni', color: '#f59e0b' },
          ]}
        />
        <StatsLineChart
          title="Aholi o'sish dinamikasi"
          data={[
            { yil: '2019', aholi: 265000, xonadon: 58000 },
            { yil: '2020', aholi: 271000, xonadon: 60500 },
            { yil: '2021', aholi: 276000, xonadon: 62800 },
            { yil: '2022', aholi: 280000, xonadon: 64500 },
            { yil: '2023', aholi: 284000, xonadon: 66800 },
            { yil: '2024', aholi: 287450, xonadon: 68200 },
          ]}
          xAxisKey="yil"
          lines={[
            { dataKey: 'aholi', name: 'Aholi soni', color: '#1e40af' },
            { dataKey: 'xonadon', name: 'Xonadonlar', color: '#16a34a' },
          ]}
        />
      </div>
    </div>
  );
}
