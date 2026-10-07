import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    trend: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
    trend: 'text-green-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
    trend: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-500',
    text: 'text-red-600',
    trend: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
    trend: 'text-purple-600',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-500',
    text: 'text-teal-600',
    trend: 'text-teal-600',
  },
};

export default function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}: KpiCardProps) {
  const colors = colorMap[color];

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString('uz-UZ') : value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center text-white',
            colors.icon
          )}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
          {trend.value > 0 ? (
            <TrendingUp size={14} className="text-green-500" />
          ) : trend.value < 0 ? (
            <TrendingDown size={14} className="text-red-500" />
          ) : (
            <Minus size={14} className="text-gray-400" />
          )}
          <span
            className={clsx(
              'text-xs font-semibold',
              trend.value > 0
                ? 'text-green-600'
                : trend.value < 0
                ? 'text-red-600'
                : 'text-gray-500'
            )}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
