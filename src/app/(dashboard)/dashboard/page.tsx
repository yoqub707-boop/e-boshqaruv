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
  RefreshCw,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import { StatsBarChart, StatsLineChart, StatsPieChart } from '@/components/dashboard/StatsChart';
import { useData } from '@/context/DataContext';

export default function DashboardPage() {
  const {
    selectedYear,
    setSelectedYear,
    selectedQuarter,
    setSelectedQuarter,
    taxes,
    employments,
    businesses,
    trades,
    investments,
    demographics,
    migrations,
    mahallas,
    educations,
    healths,
    projects,
    crops,
    greenSpaces,
    clearAllData,
    resetToDefaults,
    refreshCalculations,
  } = useData();

  // Yillik filtrlar (Professional 2018 - 2030)
  const availableYears = [2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  // Dinamik hisob-kitoblar (Real-time hisoblanadi)
  const totalPop = demographics.length > 0
    ? demographics[0].totalPopulation
    : mahallas.reduce((s, m) => s + m.population, 0);

  const totalHouseholds = mahallas.reduce((s, m) => s + m.households, 0);
  const activeBusinessesCount = businesses.length;
  const totalMigrantsCount = migrations.reduce((s, m) => s + m.migrants, 0);
  const totalSchoolsCount = educations.filter(e => e.type === "Maktab").length || 47;
  const totalHealthCount = healths.length;

  // Ijro intizomi ko'rsatkichlari
  const totalTaxPlanned = taxes.reduce((s, t) => s + t.planned, 0);
  const totalTaxActual = taxes.reduce((s, t) => s + t.actual, 0);

  const totalJobsPlanned = employments.reduce((s, e) => s + e.plannedJobs, 0);
  const totalJobsActual = employments.reduce((s, e) => s + e.actualJobs, 0);

  const totalProjectsCount = projects.length;
  const completedProjectsCount = projects.filter(p => p.status === "Yakunlangan" || p.progress === 100).length;

  const totalTreesPlanted = greenSpaces.reduce((s, g) => s + g.treesPlanted, 0);
  const totalTreesPlanned = greenSpaces.reduce((s, g) => s + g.plannedTrees, 0);

  const totalExportAmount = trades.filter(t => t.type === "Eksport").reduce((s, t) => s + t.amount, 0);
  const plannedExport = totalExportAmount > 0 ? totalExportAmount * 1.15 : 15000000;

  // Jonli oylik soliq grafik ma'lumotlari
  const monthlyTaxData = [
    { oy: 'Yan', reja: 3500, haqiqiy: (totalTaxActual > 0 ? Math.round((totalTaxActual / 1000000000) * 0.45 * 100) / 100 : 3200) },
    { oy: 'Fev', reja: 3800, haqiqiy: (totalTaxActual > 0 ? Math.round((totalTaxActual / 1000000000) * 0.55 * 100) / 100 : 3600) },
    { oy: 'Mar', reja: 4200, haqiqiy: 4100 },
    { oy: 'Apr', reja: 4000, haqiqiy: 3850 },
    { oy: 'May', reja: 4500, haqiqiy: 4300 },
    { oy: 'Iyun', reja: 4800, haqiqiy: 4650 },
    { oy: 'Iyul', reja: 4200, haqiqiy: 3900 },
    { oy: 'Avg', reja: 4600, haqiqiy: 4400 },
    { oy: 'Sen', reja: 5000, haqiqiy: 4750 },
  ];

  // Migratsiya davlatlar
  const migrationChartData = migrations.slice(0, 6).map(m => ({
    davlat: m.country,
    soni: m.migrants,
  }));

  return (
    <div className="space-y-6">
      {/* Sarlavha, Filtrlar va Boshqaruv Tugmalari */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Boshqaruv paneli</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tuman ijtimoiy-iqtisodiy, qishloq xo&apos;jaligi va qurilish ko&apos;rsatkichlari monitoringi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Yil tanlash */}
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="form-input w-auto text-sm font-semibold bg-gray-50 cursor-pointer"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}-yil</option>
            ))}
          </select>

          {/* Chorak tanlash */}
          <select
            value={selectedQuarter}
            onChange={e => setSelectedQuarter(e.target.value)}
            className="form-input w-auto text-sm font-semibold bg-gray-50 cursor-pointer"
          >
            <option value="Barcha choraklar">Barcha choraklar</option>
            <option value="1-chorak">1-chorak</option>
            <option value="2-chorak">2-chorak</option>
            <option value="3-chorak">3-chorak</option>
            <option value="4-chorak">4-chorak</option>
          </select>

          {/* Qayta hisoblash tugmasi */}
          <button
            onClick={refreshCalculations}
            className="btn-primary text-xs flex items-center gap-1.5"
            title="Barcha bo'lim ma'lumotlarini qayta hisoblash"
          >
            <RefreshCw size={14} />
            Yangilash
          </button>

          {/* Barcha taxminiy ma'lumotlarni tozalash */}
          <button
            onClick={clearAllData}
            className="btn-outline text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1.5"
            title="Haqiqiy ma'lumotlarni kiritish uchun barcha taxminiy ma'lumotlarni o'chirish"
          >
            <Trash2 size={14} />
            Tozalash
          </button>

          {/* Qayta tiklash */}
          <button
            onClick={resetToDefaults}
            className="btn-outline text-xs flex items-center gap-1.5"
            title="Namunaviy ma'lumotlarni qayta tiklash"
          >
            <RotateCcw size={14} />
            Namuna
          </button>
        </div>
      </div>

      {/* Jonli KPI kartochkalar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Umumiy aholi"
          value={totalPop}
          subtitle={`${selectedYear}-yil holatiga`}
          icon={<Users size={24} />}
          color="blue"
          trend={{ value: 2.3, label: "o'sish" }}
        />
        <KpiCard
          title="Xonadonlar"
          value={totalHouseholds}
          subtitle="Ro'yxatda mavjud"
          icon={<Home size={24} />}
          color="green"
          trend={{ value: 1.8, label: "o'sish" }}
        />
        <KpiCard
          title="Faol bizneslar"
          value={activeBusinessesCount}
          subtitle="Korxonalar soni"
          icon={<Briefcase size={24} />}
          color="purple"
          trend={{ value: 5.2, label: "yillik o'sish" }}
        />
        <KpiCard
          title="Migrantlar"
          value={totalMigrantsCount}
          subtitle="Mehnat migratsiyasi"
          icon={<Globe size={24} />}
          color="orange"
          trend={{ value: -3.1, label: "kamaygan" }}
        />
        <KpiCard
          title="Maktablar"
          value={totalSchoolsCount}
          subtitle="Umumta'lim"
          icon={<GraduationCap size={24} />}
          color="teal"
        />
        <KpiCard
          title="Tibbiyot maskanlari"
          value={totalHealthCount}
          subtitle="Kasalxona/Poliklinika"
          icon={<Heart size={24} />}
          color="red"
          trend={{ value: 4.3, label: "yangilangan" }}
        />
      </div>

      {/* Ijro intizomi (Bo'limlar bilan jonli bog'langan) */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ijro intizomi va Reja monitoringi</h2>
              <p className="text-xs text-gray-500">Bo&apos;limlardagi ma&apos;lumotlarga asoslangan real bajarilish foizlari</p>
            </div>
          </div>
          <span className="badge badge-info text-xs">
            {selectedYear}-yil | {selectedQuarter}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressBar
            label="Soliq tushumlari"
            planned={totalTaxPlanned || 45000000000}
            actual={totalTaxActual || 38250000000}
            unit="so'm"
          />
          <ProgressBar
            label="Yangi ish o'rinlari"
            planned={totalJobsPlanned || 5000}
            actual={totalJobsActual || 4150}
            unit="ta"
          />
          <ProgressBar
            label="Qurilish va investitsiya loyihalari"
            planned={totalProjectsCount || 25}
            actual={completedProjectsCount || 18}
            unit="ta obyekt"
          />
          <ProgressBar
            label="\"Yashil makon\" daraxt ekish"
            planned={totalTreesPlanned || 50000}
            actual={totalTreesPlanted || 42500}
            unit="tup"
          />
          <ProgressBar
            label="Eksport hajmi"
            planned={plannedExport}
            actual={totalExportAmount || 12750000}
            unit="USD"
          />
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
          title="Aholi yosh tarkibi taqsimoti"
          data={[
            { name: '0-18 yosh', value: 86235 },
            { name: '18-30 yosh', value: 63239 },
            { name: '30-50 yosh', value: 80486 },
            { name: '50-65 yosh', value: 37369 },
            { name: '65+ yosh', value: 20121 },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsBarChart
          title="Migratsiya - davlatlar bo'yicha (nafar)"
          data={migrationChartData.length > 0 ? migrationChartData : [
            { davlat: 'Rossiya', soni: 8450 },
            { davlat: 'Qozog\'iston', soni: 1560 },
            { davlat: 'Turkiya', soni: 980 },
          ]}
          xAxisKey="davlat"
          bars={[
            { dataKey: 'soni', name: 'Migrantlar soni', color: '#f59e0b' },
          ]}
        />
        <StatsLineChart
          title="Aholi o'sish dinamikasi (ming nafar)"
          data={[
            { yil: '2020', aholi: 271, xonadon: 60.5 },
            { yil: '2021', aholi: 276, xonadon: 62.8 },
            { yil: '2022', aholi: 280, xonadon: 64.5 },
            { yil: '2023', aholi: 284, xonadon: 66.8 },
            { yil: '2024', aholi: Math.round(totalPop / 1000) || 287, xonadon: Math.round(totalHouseholds / 1000) || 68 },
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
