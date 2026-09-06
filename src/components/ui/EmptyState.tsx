import React from 'react';
import { FolderSearch } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`p-8 text-center flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        {icon || <FolderSearch size={24} />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        {description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
      </div>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
