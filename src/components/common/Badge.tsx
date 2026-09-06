import React from 'react';
import { StatutoryStage, ParcelStatus } from '../../types/parcel';

interface StageBadgeProps {
  stage: StatutoryStage;
  className?: string;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ stage, className = '' }) => {
  const stageConfig: Record<StatutoryStage, { label: string; color: string; code: string }> = {
    SECTION_3A: { label: 'Sec 3A Intent', color: 'bg-slate-100 text-slate-700 border-slate-300', code: '3A' },
    SECTION_3C: { label: 'Sec 3C Objections', color: 'bg-amber-50 text-amber-800 border-amber-300', code: '3C' },
    SECTION_3D: { label: 'Sec 3D Declaration', color: 'bg-indigo-50 text-indigo-700 border-indigo-300', code: '3D' },
    SECTION_3G: { label: 'Sec 3G Award Valuation', color: 'bg-blue-50 text-blue-700 border-blue-300', code: '3G' },
    SECTION_3H: { label: 'Sec 3H Compensation', color: 'bg-purple-50 text-purple-700 border-purple-300', code: '3H' },
    SECTION_3E: { label: 'Sec 3E Possession Handed', color: 'bg-emerald-50 text-emerald-700 border-emerald-300', code: '3E' },
  };

  const current = stageConfig[stage] || stageConfig.SECTION_3A;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold border ${current.color} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {current.label}
    </span>
  );
};

interface StatusBadgeProps {
  status: ParcelStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusMap: Record<ParcelStatus, { label: string; style: string }> = {
    NOTIFICATION_PENDING: { label: 'Notification Pending', style: 'bg-slate-100 text-slate-700 border-slate-200' },
    UNDER_INQUIRY: { label: 'Under Inquiry / Objections', style: 'bg-amber-50 text-amber-700 border-amber-200' },
    VALUATION_IN_PROGRESS: { label: 'Valuation In Progress', style: 'bg-blue-50 text-blue-700 border-blue-200' },
    AWARD_DETERMINED: { label: 'Award Passed (Sec 3G)', style: 'bg-cyan-50 text-cyan-800 border-cyan-300' },
    COMPENSATION_DEPOSITED: { label: 'Compensation Deposited', style: 'bg-purple-50 text-purple-700 border-purple-200' },
    POSSESSION_ACQUIRED: { label: 'Possession Acquired', style: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    LITIGATION_HALTED: { label: 'Dispute / Court Stay', style: 'bg-rose-50 text-rose-700 border-rose-300' }
  };

  const item = statusMap[status] || statusMap.NOTIFICATION_PENDING;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${item.style} ${className}`}>
      {item.label}
    </span>
  );
};

interface RiskBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score?: number;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, className = '' }) => {
  const riskMap = {
    LOW: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200',
    HIGH: 'bg-orange-50 text-orange-800 border-orange-300',
    CRITICAL: 'bg-red-50 text-red-800 border-red-300'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${riskMap[level]} ${className}`}>
      <span>Risk: {level}</span>
      {score !== undefined && (
        <span className="bg-white/70 px-1 py-0.2 rounded text-[10px] ml-0.5">
          {score}/100
        </span>
      )}
    </span>
  );
};
