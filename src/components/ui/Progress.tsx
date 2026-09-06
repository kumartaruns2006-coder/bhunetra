import React from 'react';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'emerald' | 'blue' | 'amber' | 'red' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'emerald',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variantStyles = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600',
    navy: 'bg-gov-navy'
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          {label && <span>{label}</span>}
          {showValue && <span className="font-mono">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
