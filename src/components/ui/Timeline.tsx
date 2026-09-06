import React from 'react';

export interface TimelineStep {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming' | 'delayed';
  badge?: React.ReactNode;
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, className = '' }) => {
  return (
    <div className={`relative border-l-2 border-slate-200 ml-4 space-y-6 ${className}`}>
      {steps.map((step) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isDelayed = step.status === 'delayed';

        return (
          <div key={step.id} className="relative pl-6">
            {/* Step Node Icon */}
            <span
              className={`absolute -left-2.5 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : isCurrent
                  ? 'bg-gov-navy text-white ring-4 ring-blue-100'
                  : isDelayed
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isCompleted ? '✓' : ''}
            </span>

            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                {step.subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{step.subtitle}</p>}
              </div>

              <div className="flex items-center gap-2">
                {step.date && <span className="text-[10px] text-slate-400 font-mono">{step.date}</span>}
                {step.badge}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
