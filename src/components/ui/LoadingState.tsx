import React from 'react';

export interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton';
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading official data records...',
  variant = 'spinner',
  rows = 3
}) => {
  if (variant === 'skeleton') {
    return (
      <div className="w-full space-y-3 p-4 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-200 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 rounded-full border-3 border-gov-navy border-t-transparent animate-spin"></div>
      <span className="text-xs font-semibold text-slate-600">{message}</span>
    </div>
  );
};
