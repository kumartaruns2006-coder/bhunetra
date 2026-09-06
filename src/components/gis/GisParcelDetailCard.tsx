import React from 'react';
import { 
  X, 
  ExternalLink, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  IndianRupee, 
  Layers, 
  User, 
  LandPlot,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { Parcel } from '../../types/parcel';
import { RiskBadge, StageBadge } from '../common/Badge';

interface GisParcelDetailCardProps {
  parcel: Parcel | null;
  onOpenDigitalTwin: (parcel: Parcel) => void;
  onLaunchVerification: (parcel: Parcel) => void;
  onViewDocuments: (parcel: Parcel) => void;
  onClose: () => void;
}

export const GisParcelDetailCard: React.FC<GisParcelDetailCardProps> = ({
  parcel,
  onOpenDigitalTwin,
  onLaunchVerification,
  onViewDocuments,
  onClose
}) => {
  if (!parcel) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-white">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
          <LandPlot className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
          No Parcel Selected
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Click any cadastral plot polygon on the interactive GIS map or select from the left panel filter to view its digital twin and statutory records.
        </p>
        <div className="mt-6 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-left max-w-xs text-[11px] text-blue-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Cadastral Inspection Mode
          </div>
          <p className="text-blue-800/80">
            Hover over plots to preview Khasra numbers and risk scores. Click to inspect complete ownership chain, award calculation, and field verification history.
          </p>
        </div>
      </div>
    );
  }

  // Derive verification badge status
  const isEncroached = parcel.fieldVerification.some(v => v.encroachmentDetected);
  const hasVerification = parcel.fieldVerification.length > 0;

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden shadow-2xl border-l border-slate-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-gov-navy to-slate-900 text-white flex-shrink-0 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/20 text-white uppercase tracking-wider">
                Khasra {parcel.khasraNo}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                Khata #{parcel.khataNo}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              {parcel.id}
            </h2>
            <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{parcel.village}, {parcel.tehsil}, {parcel.district}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Status Color Pill */}
        {(() => {
          const mapStatus = parcel.mapStatus || 'PROPOSED';
          const colorInfo = 
            mapStatus === 'ACQUIRED' ? { bg: 'bg-emerald-500', text: 'text-emerald-950', hex: '#16A34A', label: 'Acquired (Green)' } :
            mapStatus === 'PENDING' ? { bg: 'bg-amber-400', text: 'text-amber-950', hex: '#EAB308', label: 'Pending (Yellow)' } :
            mapStatus === 'DISPUTED' ? { bg: 'bg-red-600', text: 'text-white', hex: '#DC2626', label: 'Disputed (Red)' } :
            mapStatus === 'VERIFIED' ? { bg: 'bg-blue-600', text: 'text-white', hex: '#2563EB', label: 'Verified (Blue)' } :
            mapStatus === 'VERIFICATION_PENDING' ? { bg: 'bg-orange-500', text: 'text-white', hex: '#EA580C', label: 'Field Verification Pending (Orange)' } :
            { bg: 'bg-slate-500', text: 'text-white', hex: '#64748B', label: 'Proposed (Grey)' };

          return (
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: colorInfo.hex }} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                  GIS Layer Status:
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorInfo.bg} ${colorInfo.text} shadow-xs`}>
                {colorInfo.label}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Body / Attributes Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Risk & Acquisition Status Summary Banner */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Statutory Stage
            </span>
            <StageBadge stage={parcel.currentStage} />
            <div className="text-[10px] text-slate-500 mt-1 truncate">
              Status: <span className="font-semibold text-slate-700">{parcel.status.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              AI Risk Assessment
            </span>
            <div className="flex items-center gap-2">
              <RiskBadge level={parcel.aiRisk.riskLevel} />
              <span className="font-mono font-bold text-slate-800">
                {parcel.aiRisk.overallRiskScore}/100
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">
              {parcel.aiRisk.detectedRiskFactors?.[0] || 'Low encumbrance verified'}
            </div>
          </div>
        </div>

        {/* 11 Required Fields Table/Grid */}
        <div className="space-y-2 bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Key Parcel Attributes
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {/* 1. Parcel ID */}
            <div>
              <span className="text-[10px] text-slate-400 block">Parcel ID</span>
              <span className="font-mono font-semibold text-slate-900 truncate block">
                {parcel.id}
              </span>
            </div>

            {/* 2. Khasra Number */}
            <div>
              <span className="text-[10px] text-slate-400 block">Khasra Number</span>
              <span className="font-mono font-semibold text-slate-900 block">
                {parcel.khasraNo}
              </span>
            </div>

            {/* 3. Village */}
            <div>
              <span className="text-[10px] text-slate-400 block">Village</span>
              <span className="font-semibold text-slate-900 block truncate">
                {parcel.village} ({parcel.district})
              </span>
            </div>

            {/* 4. Area */}
            <div>
              <span className="text-[10px] text-slate-400 block">Acquisition Area</span>
              <span className="font-semibold text-slate-900 block">
                {parcel.acquisitionAreaHectares} Ha ({parcel.acquisitionAreaSqM.toLocaleString()} m²)
              </span>
            </div>

            {/* 5. Land Use */}
            <div>
              <span className="text-[10px] text-slate-400 block">Land Use</span>
              <span className="font-semibold text-slate-900 block truncate capitalize">
                {parcel.landCategory.replace(/_/g, ' ').toLowerCase()}
              </span>
            </div>

            {/* 6. Project */}
            <div>
              <span className="text-[10px] text-slate-400 block">Project Corridor</span>
              <span className="font-semibold text-slate-900 block truncate">
                {parcel.projectId}
              </span>
            </div>

            {/* 7. Acquisition Status */}
            <div>
              <span className="text-[10px] text-slate-400 block">Acquisition Status</span>
              <span className="font-semibold text-slate-900 block">
                {parcel.currentStage}
              </span>
            </div>

            {/* 8. Verification Status */}
            <div>
              <span className="text-[10px] text-slate-400 block">Verification Status</span>
              {isEncroached ? (
                <span className="inline-flex items-center gap-1 font-bold text-red-600">
                  <AlertTriangle className="w-3 h-3" /> Encroached
                </span>
              ) : hasVerification ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <Clock className="w-3 h-3" /> Pending Ground Truth
                </span>
              )}
            </div>

            {/* 9. Compensation Status */}
            <div>
              <span className="text-[10px] text-slate-400 block">Compensation Status</span>
              <span className="font-semibold text-slate-900 block">
                {parcel.compensation.paymentStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* 10. Possession Status */}
            <div>
              <span className="text-[10px] text-slate-400 block">Possession Progress</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      parcel.possessionPercentage >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${parcel.possessionPercentage}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-[11px] text-slate-800">
                  {parcel.possessionPercentage}%
                </span>
              </div>
            </div>

            {/* 11. Risk Score */}
            <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Primary Landowner</span>
                <span className="font-semibold text-slate-900">
                  {parcel.primaryOwnerName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Assessed Award</span>
                <span className="font-mono font-bold text-emerald-700">
                  {formatCurrency(parcel.compensation.totalAwardAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Co-sharers & Mutation note */}
        {parcel.coSharers && parcel.coSharers.length > 0 && (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Co-Sharers ({parcel.coSharers.length})
            </span>
            <div className="space-y-0.5 text-slate-600">
              {parcel.coSharers.slice(0, 3).map((cs, idx) => (
                <div key={idx} className="truncate">• {cs}</div>
              ))}
              {parcel.coSharers.length > 3 && (
                <div className="text-slate-400 font-medium">+ {parcel.coSharers.length - 3} more owners</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3 Action Buttons in Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2 flex-shrink-0">
        {/* 1. View Parcel Digital Twin */}
        <button
          onClick={() => onOpenDigitalTwin(parcel)}
          className="w-full py-2.5 px-4 bg-gov-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all"
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>View Parcel Digital Twin</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* 2. Field Verify */}
          <button
            onClick={() => onLaunchVerification(parcel)}
            className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Field Verify</span>
          </button>

          {/* 3. View Documents */}
          <button
            onClick={() => onViewDocuments(parcel)}
            className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Documents</span>
          </button>
        </div>
      </div>
    </div>
  );
};
