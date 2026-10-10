import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  label: string;
  planned?: number;
  actual?: number;
  current?: number;
  target?: number;
  unit?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function ProgressBar({
  label,
  planned,
  actual,
  current,
  target,
  unit = '',
  showPercentage = true,
  size = 'md',
  color,
}: ProgressBarProps) {
  const finalPlanned = planned !== undefined ? planned : target !== undefined ? target : 100;
  const finalActual = actual !== undefined ? actual : current !== undefined ? current : 0;
  const percentage = finalPlanned > 0 ? Math.min((finalActual / finalPlanned) * 100, 100) : 0;

  const getColor = () => {
    if (color === 'blue') return 'bg-blue-600';
    if (color === 'green' || color === 'emerald') return 'bg-emerald-600';
    if (color === 'indigo') return 'bg-indigo-600';
    if (color === 'amber' || color === 'yellow') return 'bg-amber-500';
    if (color === 'red') return 'bg-red-600';

    if (percentage >= 90) return 'bg-emerald-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (percentage >= 100) return "Bajarildi";
    if (percentage >= 90) return "A'lo";
    if (percentage >= 70) return 'Yaxshi';
    if (percentage >= 50) return "O'rtacha";
    return 'Past';
  };

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
    if (percentage >= 70) return 'text-blue-700 bg-blue-50 border border-blue-200';
    if (percentage >= 50) return 'text-amber-700 bg-amber-50 border border-amber-200';
    return 'text-red-700 bg-red-50 border border-red-200';
  };

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-gray-800">{label}</span>
        <div className="flex items-center gap-2">
          {showPercentage && (
            <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded-full', getStatusColor())}>
              {percentage.toFixed(1)}% - {getStatusText()}
            </span>
          )}
        </div>
      </div>

      <div className={clsx('progress-bar bg-gray-100 rounded-full overflow-hidden', heightClass)}>
        <div
          className={clsx('progress-bar-fill h-full rounded-full transition-all duration-500', getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-gray-500 font-medium">
        <span>Reja: {finalPlanned.toLocaleString('uz-UZ')} {unit}</span>
        <span>Haqiqiy: {finalActual.toLocaleString('uz-UZ')} {unit}</span>
      </div>
    </div>
  );
}
