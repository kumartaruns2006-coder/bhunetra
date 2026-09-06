import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  icon?: boolean;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  icon = true,
  className = ''
}) => {
  const variantStyles = {
    info: {
      container: 'bg-blue-50/80 border-blue-200 text-blue-900',
      icon: <Info size={16} className="text-blue-700 flex-shrink-0 mt-0.5" />
    },
    success: {
      container: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
    },
    warning: {
      container: 'bg-amber-50/80 border-amber-200 text-amber-900',
      icon: <AlertTriangle size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
    },
    danger: {
      container: 'bg-red-50/80 border-red-200 text-red-900',
      icon: <AlertCircle size={16} className="text-red-700 flex-shrink-0 mt-0.5" />
    }
  };

  const selected = variantStyles[variant];

  return (
    <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${selected.container} ${className}`}>
      {icon && selected.icon}
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-bold text-xs">{title}</h5>}
        <div className="text-[11px] leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};
