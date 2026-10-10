import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  period?: string;
  change?: string | number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal' | 'emerald' | 'indigo' | 'amber';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-600',
    text: 'text-blue-600',
    trend: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-600',
    text: 'text-green-600',
    trend: 'text-green-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-600',
    text: 'text-emerald-600',
    trend: 'text-emerald-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-600',
    text: 'text-indigo-600',
    trend: 'text-indigo-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-600',
    text: 'text-amber-600',
    trend: 'text-amber-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-600',
    text: 'text-orange-600',
    trend: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-600',
    text: 'text-red-600',
    trend: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-600',
    text: 'text-purple-600',
    trend: 'text-purple-600',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-600',
    text: 'text-teal-600',
    trend: 'text-teal-600',
  },
};

export default function KpiCard({
  title,
  value,
  subtitle,
  period,
  change,
  changeType = 'neutral',
  icon,
  trend,
  color = 'blue',
}: KpiCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="kpi-card bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-semibold mb-1">{title}</p>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString('uz-UZ') : value}
          </h3>
          {(period || subtitle) && (
            <p className="text-[11px] text-gray-400 mt-1 font-medium">{period || subtitle}</p>
          )}
        </div>
        <div
          className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md',
            colors.icon
          )}
        >
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
          {changeType === 'increase' ? (
            <TrendingUp size={13} className="text-emerald-600" />
          ) : changeType === 'decrease' ? (
            <TrendingDown size={13} className="text-red-600" />
          ) : (
            <Minus size={13} className="text-gray-400" />
          )}
          <span
            className={clsx(
              'text-xs font-bold',
              changeType === 'increase'
                ? 'text-emerald-600'
                : changeType === 'decrease'
                ? 'text-red-600'
                : 'text-blue-600'
            )}
          >
            {change}
          </span>
          {period && <span className="text-[11px] text-gray-400 font-normal">• {period}</span>}
        </div>
      )}

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
          {trend.value > 0 ? (
            <TrendingUp size={13} className="text-emerald-600" />
          ) : trend.value < 0 ? (
            <TrendingDown size={13} className="text-red-600" />
          ) : (
            <Minus size={13} className="text-gray-400" />
          )}
          <span
            className={clsx(
              'text-xs font-bold',
              trend.value > 0
                ? 'text-emerald-600'
                : trend.value < 0
                ? 'text-red-600'
                : 'text-gray-500'
            )}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-[11px] text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
