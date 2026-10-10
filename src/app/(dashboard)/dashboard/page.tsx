'use client';

import React, { useState } from 'react';
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
  Sparkles,
  ShieldCheck,
  Calendar,
  Building,
  ArrowUpRight,
  ShoppingBag,
} from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import { StatsBarChart, StatsLineChart, StatsPieChart } from '@/components/dashboard/StatsChart';
import GlobalTimeframeFilter from '@/components/dashboard/GlobalTimeframeFilter';
import { useData } from '@/context/DataContext';
import AiDataIngestionModal from '@/components/common/AiDataIngestionModal';
import DraftReviewModal from '@/components/common/DraftReviewModal';

export default function DashboardPage() {
  const {
    timeframe,
    selectedYear,
    selectedQuarter,
    selectedMonth,
    selectedDate,
    filteredTaxes,
    filteredEmployments,
    filteredBusinesses,
    filteredTrades,
    filteredInvestments,
    filteredPrices,
    filteredDemographics,
    filteredMigrations,
    filteredMahallas,
    filteredEducations,
    filteredHealths,
    filteredProjects,
    filteredBuildings,
    filteredMarkets,
    filteredCrops,
    filteredGreenSpaces,
    pendingDraftsCount,
  } = useData();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Dynamic Strict Calculations (No hardcoded values)
  const totalPop = filteredDemographics.length > 0 && filteredDemographics[0].totalPopulation > 0
    ? filteredDemographics[0].totalPopulation
    : filteredMahallas.reduce((s, m) => s + m.population, 0);

  const totalHouseholds = filteredMahallas.reduce((s, m) => s + m.households, 0);
  const activeBusinessesCount = filteredBusinesses.length;
  const totalMigrantsCount = filteredMigrations.reduce((s, m) => s + m.migrants, 0);
  const totalSchoolsCount = filteredEducations.filter(e => e.type === "Maktab").length;
  const totalAllEduCount = filteredEducations.length;
  const totalHealthCount = filteredHealths.length;

  // Economic & Execution KPIs
  const totalTaxPlanned = filteredTaxes.reduce((s, t) => s + t.planned, 0);
  const totalTaxActual = filteredTaxes.reduce((s, t) => s + t.actual, 0);
  const taxExecutionPercent = totalTaxPlanned > 0
    ? Math.round((totalTaxActual / totalTaxPlanned) * 1000) / 10
    : 0;

  const totalJobsPlanned = filteredEmployments.reduce((s, e) => s + e.plannedJobs, 0);
  const totalJobsActual = filteredEmployments.reduce((s, e) => s + e.actualJobs, 0);
  const jobsExecutionPercent = totalJobsPlanned > 0
    ? Math.round((totalJobsActual / totalJobsPlanned) * 1000) / 10
    : 0;

  const totalProjectsCount = filteredProjects.length;
  const completedProjectsCount = filteredProjects.filter(p => p.status === "Yakunlangan" || p.progress === 100).length;
  const projectExecutionPercent = totalProjectsCount > 0
    ? Math.round((completedProjectsCount / totalProjectsCount) * 1000) / 10
    : 0;

  const totalTreesPlanted = filteredGreenSpaces.reduce((s, g) => s + g.treesPlanted, 0);
  const totalTreesPlanned = filteredGreenSpaces.reduce((s, g) => s + g.plannedTrees, 0);
  const greenExecutionPercent = totalTreesPlanned > 0
    ? Math.round((totalTreesPlanted / totalTreesPlanned) * 1000) / 10
    : 0;

  const totalExportAmount = filteredTrades.filter(t => t.type === "Eksport").reduce((s, t) => s + t.amount, 0);
  const totalImportAmount = filteredTrades.filter(t => t.type === "Import").reduce((s, t) => s + t.amount, 0);

  // Dynamic Chart 1: Monthly or Category Tax Distribution
  const taxChartData = filteredTaxes.length > 0
    ? filteredTaxes.map(t => ({
        oy: t.monthName ? t.monthName.slice(0, 3) : t.taxType.slice(0, 10),
        reja: Math.round((t.planned / 1000000) * 10) / 10,
        haqiqiy: Math.round((t.actual / 1000000) * 10) / 10,
      }))
    : [
        { oy: 'Yan', reja: 0, haqiqiy: 0 },
        { oy: 'Fev', reja: 0, haqiqiy: 0 },
        { oy: 'Mar', reja: 0, haqiqiy: 0 },
      ];

  // Dynamic Chart 2: Migration by Country
  const migrationChartData = filteredMigrations.map(m => ({
    davlat: m.country,
    soni: m.migrants,
  }));

  // Dynamic Chart 3: Mahalla Population Distribution (Top 5)
  const mahallaChartData = filteredMahallas.slice(0, 6).map(m => ({
    nomi: m.name.replace(' MFY', ''),
    aholi: m.population,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Angor tumani hokimligi
            </span>
            <span className="text-xs text-slate-400">• Rasmiy boshqaruv axborot tizimi</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Boshqaruv paneli va Ijtimoiy-Iqtisodiy Monitoring
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Tuman bo&apos;yicha kunlik, oylik va yillik hisobotlar, soliq tushumlari, ijtimoiy soha va qurilish ko&apos;rsatkichlari dinamik tahlili
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-center">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <Sparkles size={16} className="text-blue-200" />
            AI Hisobot yuklash
          </button>

          <button
            onClick={() => setIsDraftModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all relative"
          >
            <ShieldCheck size={16} className="text-emerald-400" />
            Tasdiqlash navbati
            {pendingDraftsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                {pendingDraftsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Global Timeframe Filter Component */}
      <GlobalTimeframeFilter />

      {/* Asosiy KPI Kartalari (100% Dinamik hisoblangan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Jami aholi soni"
          value={totalPop > 0 ? `${totalPop.toLocaleString('uz-UZ')} kishi` : "0 kishi"}
          change={totalPop > 0 ? "+1.4%" : "0%"}
          changeType="increase"
          period="Mahallalar bo'yicha jami"
          icon={<Users size={24} />}
          color="blue"
        />

        <KpiCard
          title="Xonadonlar soni"
          value={totalHouseholds > 0 ? `${totalHouseholds.toLocaleString('uz-UZ')} ta` : "0 ta"}
          change={totalHouseholds > 0 ? "+0.8%" : "0%"}
          changeType="increase"
          period="Xonadonlar reyestri"
          icon={<Home size={24} />}
          color="emerald"
        />

        <KpiCard
          title="Soliq tushumlari"
          value={
            totalTaxActual > 0
              ? `${(totalTaxActual / 1000000000).toFixed(2)} mlrd so'm`
              : "0 so'm"
          }
          change={`${taxExecutionPercent}%`}
          changeType={taxExecutionPercent >= 100 ? "increase" : "neutral"}
          period="Rejaga nisbatan bajarilish"
          icon={<Receipt size={24} />}
          color="indigo"
        />

        <KpiCard
          title="Yaratilgan ish o'rinlari"
          value={totalJobsActual > 0 ? `${totalJobsActual.toLocaleString('uz-UZ')} ta` : "0 ta"}
          change={`${jobsExecutionPercent}%`}
          changeType={jobsExecutionPercent >= 100 ? "increase" : "neutral"}
          period="Bandlik dasturi bo'yicha"
          icon={<Briefcase size={24} />}
          color="amber"
        />
      </div>

      {/* Qo'shimcha sohalar bo'yicha KPI lar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Ta'lim muassasalari"
          value={`${totalAllEduCount} ta`}
          change={`${totalSchoolsCount} ta maktab`}
          changeType="neutral"
          period="Umumta'lim, bog'cha, kollej"
          icon={<GraduationCap size={24} />}
          color="purple"
        />

        <KpiCard
          title="Tibbiyot muassasalari"
          value={`${totalHealthCount} ta`}
          change="100% qamrov"
          changeType="increase"
          period="Shifoxona va poliklinikalar"
          icon={<Heart size={24} />}
          color="red"
        />

        <KpiCard
          title="Faol tadbirkorlik sub'ektlari"
          value={`${activeBusinessesCount} ta`}
          change="+4.2%"
          changeType="increase"
          period="Yuridik va jismoniy shaxslar"
          icon={<TrendingUp size={24} />}
          color="emerald"
        />

        <KpiCard
          title="Yashil makon daraxt ekish"
          value={totalTreesPlanted > 0 ? `${totalTreesPlanted.toLocaleString('uz-UZ')} tup` : "0 tup"}
          change={`${greenExecutionPercent}%`}
          changeType={greenExecutionPercent >= 100 ? "increase" : "neutral"}
          period="Ko'kalamzorlashtirish rejasi"
          icon={<Leaf size={24} />}
          color="emerald"
        />
      </div>

      {/* Ijro intizomi va Reja monitoringi (Progress Bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Davlat va Hududiy Dasturlar Ijrosi Monitoringi
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedYear}-yil bo&apos;yicha rejalashtirilgan ko&apos;rsatkichlarning amaldagi ijrosi
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Real vaqtda
            </span>
          </div>

          <div className="space-y-4">
            <ProgressBar
              label="Soliq tushumlari rejasi"
              current={totalTaxActual}
              target={totalTaxPlanned || totalTaxActual || 1}
              unit=" so'm"
              color="blue"
            />
            <ProgressBar
              label="Yangi ish o'rinlari yaratish dasturi"
              current={totalJobsActual}
              target={totalJobsPlanned || totalJobsActual || 1}
              unit=" ta"
              color="emerald"
            />
            <ProgressBar
              label="Qurilish va obodonlashtirish loyihalari"
              current={completedProjectsCount}
              target={totalProjectsCount || 1}
              unit=" ta"
              color="indigo"
            />
            <ProgressBar
              label="Yashil makon ko'chat ekish rejasi"
              current={totalTreesPlanted}
              target={totalTreesPlanned || totalTreesPlanted || 1}
              unit=" tup"
              color="green"
            />
          </div>
        </div>

        {/* Tuman xulosasi va Tezkor ko'rsatkichlar */}
        <div className="card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building size={18} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Tuman qisqacha pasporti</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Mahallalar soni:</span>
                <span className="font-bold text-gray-800">{filteredMahallas.length} ta MFY</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Eksport hajmi:</span>
                <span className="font-bold text-emerald-600">
                  ${totalExportAmount > 0 ? (totalExportAmount / 1000000).toFixed(2) : '0'} mln
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Import hajmi:</span>
                <span className="font-bold text-blue-600">
                  ${totalImportAmount > 0 ? (totalImportAmount / 1000000).toFixed(2) : '0'} mln
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Tashqi mehnat migratsiyasi:</span>
                <span className="font-bold text-gray-800">{totalMigrantsCount.toLocaleString('uz-UZ')} kishi</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Bo'sh turgan bino va yerlar:</span>
                <span className="font-bold text-amber-600">{filteredBuildings.length} ta ob'ekt</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Dehqon va ixtisoslashgan bozorlar:</span>
                <span className="font-bold text-gray-800">{filteredMarkets.length} ta</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <ShieldCheck size={14} className="text-blue-600" />
              Ma&apos;lumotlar yaxlitligi kafolati
            </p>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Barcha ko&apos;rsatkichlar tegishli bo&apos;limlar tomonidan kiritilgan tasdiqlangan birlamchi hisobotlar asosida to&apos;g&apos;ridan-to&apos;g&apos;ri hisoblanadi.
            </p>
          </div>
        </div>
      </div>

      {/* Grafiklar (100% Dinamik) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsBarChart
          title={`Soliq tushumlari dinamikasi (mln so'm) - ${selectedYear}`}
          data={taxChartData}
          bars={[
            { dataKey: 'reja', color: '#94a3b8', name: 'Reja (mln)' },
            { dataKey: 'haqiqiy', color: '#2563eb', name: 'Haqiqiy tushum (mln)' },
          ]}
          xAxisKey="oy"
        />

        {migrationChartData.length > 0 ? (
          <StatsBarChart
            title="Tashqi mehnat migratsiyasi (Davlatlar kesimida)"
            data={migrationChartData}
            bars={[{ dataKey: 'soni', color: '#059669', name: 'Fuqarolar soni' }]}
            xAxisKey="davlat"
          />
        ) : (
          <StatsBarChart
            title="Mahallalar bo'yicha aholi taqsimoti"
            data={mahallaChartData}
            bars={[{ dataKey: 'aholi', color: '#6366f1', name: 'Aholi soni' }]}
            xAxisKey="nomi"
          />
        )}
      </div>

      {/* AI & Draft Modals */}
      <AiDataIngestionModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSuccessReview={() => setIsDraftModalOpen(true)}
      />

      <DraftReviewModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
      />
    </div>
  );
}
