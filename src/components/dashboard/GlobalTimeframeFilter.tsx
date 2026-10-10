'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  Trash2,
  CalendarDays,
  CheckCircle,
} from 'lucide-react';
import { useData, TimeframeMode } from '@/context/DataContext';

export default function GlobalTimeframeFilter() {
  const {
    timeframe,
    setTimeframe,
    selectedYear,
    setSelectedYear,
    selectedQuarter,
    setSelectedQuarter,
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate,
    refreshCalculations,
    clearAllData,
  } = useData();

  const availableYears = [2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  const months = [
    { value: 1, label: 'Yanvar' },
    { value: 2, label: 'Fevral' },
    { value: 3, label: 'Mart' },
    { value: 4, label: 'Aprel' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Iyun' },
    { value: 7, label: 'Iyul' },
    { value: 8, label: 'Avgust' },
    { value: 9, label: 'Sentyabr' },
    { value: 10, label: 'Oktyabr' },
    { value: 11, label: 'Noyabr' },
    { value: 12, label: 'Dekabr' },
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
      {/* Top Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Vaqt kesimida tahlil (Global Filtr)</h3>
            <p className="text-[11px] text-gray-500">Barcha ko&apos;rsatkichlar tanlangan vaqt oralig&apos;iga mos tarzda qayta hisoblanadi</p>
          </div>
        </div>

        {/* Timeframe Mode Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start md:self-auto overflow-x-auto">
          {(
            [
              { id: 'all', label: 'Barchasi' },
              { id: 'year', label: 'Yillik' },
              { id: 'quarter', label: 'Choraklik' },
              { id: 'month', label: 'Oylik' },
              { id: 'day', label: 'Kunlik' },
            ] as Array<{ id: TimeframeMode; label: string }>
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                timeframe === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Year Selector */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
          <Calendar size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500 font-medium">Yil:</span>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="bg-transparent border-none outline-none text-xs font-bold text-gray-800 cursor-pointer"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}-yil</option>
            ))}
          </select>
        </div>

        {/* Quarter Selector */}
        {(timeframe === 'quarter' || timeframe === 'all' || timeframe === 'year') && (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-gray-500 font-medium">Chorak:</span>
            <select
              value={selectedQuarter}
              onChange={e => setSelectedQuarter(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-800 cursor-pointer"
            >
              <option value="all">Barcha choraklar</option>
              <option value="1">1-chorak</option>
              <option value="2">2-chorak</option>
              <option value="3">3-chorak</option>
              <option value="4">4-chorak</option>
            </select>
          </div>
        )}

        {/* Month Selector */}
        {(timeframe === 'month' || timeframe === 'all') && (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-gray-500 font-medium">Oy:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-800 cursor-pointer"
            >
              <option value="all">Barcha oylar</option>
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Day Selector */}
        {timeframe === 'day' && (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
            <CalendarDays size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">Sana:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-800 cursor-pointer"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={refreshCalculations}
            className="btn-primary text-xs flex items-center gap-1.5"
            title="Ko'rsatkichlarni qayta hisoblash"
          >
            <RefreshCw size={13} />
            Yangilash
          </button>

          <button
            onClick={clearAllData}
            className="btn-outline text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1.5"
            title="Barcha ma'lumotlarni tozalash"
          >
            <Trash2 size={13} />
            Tozalash
          </button>
        </div>
      </div>
    </div>
  );
}
