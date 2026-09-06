import React from 'react';
import { StatePerformanceRecord } from '../../types/nationalDashboard';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  TrendingUp,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

interface StateDashboardModalProps {
  stateData: StatePerformanceRecord | null;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onApplyStateFilter: (stateName: string) => void;
}

export const StateDashboardModal: React.FC<StateDashboardModalProps> = ({
  stateData,
  onClose,
  onSelectProject,
  onApplyStateFilter
}) => {
  if (!stateData) return null;

  const riskBadgeVariant = 
    stateData.riskLevel === 'CRITICAL' ? 'danger' :
    stateData.riskLevel === 'HIGH' ? 'warning' :
    stateData.riskLevel === 'MEDIUM' ? 'info' : 'success';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-6 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 font-black text-lg border border-white/20">
              {stateData.code}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                STATE LAND ACQUISITION INTELLIGENCE &bull; {stateData.state.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {stateData.state} State Operations Command
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onApplyStateFilter(stateData.state);
                onClose();
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Filter Dashboard to {stateData.state}</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Active Corridors</span>
                <Building2 size={16} className="text-gov-navy" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {stateData.projectsCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Across {stateData.districtsCount} revenue districts
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Acquired vs Proposed</span>
                <TrendingUp size={16} className="text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-700">
                {stateData.acquisitionPercent}%
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                {stateData.acquiredLandAcres.toLocaleString()} / {stateData.proposedLandAcres.toLocaleString()} Ac
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Compensation Disbursed</span>
                <IndianRupee size={16} className="text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                ₹{stateData.compensationDisbursedCr.toFixed(1)} <span className="text-sm font-medium text-slate-500">Cr</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Of ₹{stateData.compensationAssessedCr.toFixed(1)} Cr assessed ({stateData.compensationPercent}%)
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>R&R Rehabilitation</span>
                <Users size={16} className="text-indigo-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-indigo-700">
                {stateData.rrProgressPercent}%
              </div>
              <div className="mt-0.5">
                <Badge variant={riskBadgeVariant} size="sm">
                  {stateData.riskLevel} RISK LEVEL
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Bars Section */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileText size={15} className="text-gov-navy" />
              Statutory Land Delivery Progress
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Land Parcel Acquisition & Notification Clearance</span>
                  <span className="text-emerald-700 font-bold">{stateData.acquisitionPercent}%</span>
                </div>
                <Progress value={stateData.acquisitionPercent} variant="emerald" size="md" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Statutory Compensation Disbursed (PFMS Escrow)</span>
                  <span className="text-blue-700 font-bold">{stateData.compensationPercent}%</span>
                </div>
                <Progress value={stateData.compensationPercent} variant="blue" size="md" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Rehabilitation & Resettlement (RFCTLARR 2013)</span>
                  <span className="text-amber-700 font-bold">{stateData.rrProgressPercent}%</span>
                </div>
                <Progress value={stateData.rrProgressPercent} variant="amber" size="md" />
              </div>
            </div>
          </div>

          {/* Top Corridor & Districts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flagship Corridor</span>
              <p className="text-sm font-bold text-slate-900">{stateData.keyCorridor}</p>
              <p className="text-xs text-slate-600">
                Competent Authorities (CALAs) Active: <strong className="text-slate-800">{stateData.calaCount} District Officers</strong>
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectProject(stateData.state === 'Bihar' ? 'PRR-PH2-2026' : 'GNGA-EXP-UP');
                    onClose();
                  }}
                  className="text-xs font-bold text-gov-navy hover:text-gov-navy-light flex items-center gap-1 group"
                >
                  <span>Open Flagship Project Dossier</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Revenue Districts</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {stateData.topDistricts.map((d, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium border border-slate-200 flex items-center gap-1"
                  >
                    <MapPin size={11} className="text-slate-500" />
                    {d}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-600" />
                <span>Delayed Projects in State: <strong className="text-amber-700">{stateData.delayedProjectsCount}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onApplyStateFilter(stateData.state);
              onClose();
            }}
            className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Apply State Filter</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
