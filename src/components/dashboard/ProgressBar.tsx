import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  label: string;
  planned: number;
  actual: number;
  unit?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({
  label,
  planned,
  actual,
  unit = '',
  showPercentage = true,
  size = 'md',
}: ProgressBarProps) {
  const percentage = planned > 0 ? Math.min((actual / planned) * 100, 100) : 0;

  const getColor = () => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (percentage >= 90) return "A'lo";
    if (percentage >= 70) return 'Yaxshi';
    if (percentage >= 50) return "O'rtacha";
    return 'Past';
  };

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          {showPercentage && (
            <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', getStatusColor())}>
              {percentage.toFixed(1)}% - {getStatusText()}
            </span>
          )}
        </div>
      </div>

      <div className={clsx('progress-bar', heightClass)}>
        <div
          className={clsx('progress-bar-fill', getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Reja: {planned.toLocaleString('uz-UZ')} {unit}</span>
        <span>Haqiqiy: {actual.toLocaleString('uz-UZ')} {unit}</span>
      </div>
    </div>
  );
}
