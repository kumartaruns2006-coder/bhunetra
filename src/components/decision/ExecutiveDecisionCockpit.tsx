import React, { useState } from 'react';
import { Parcel } from '../../types/parcel';
import { Officer } from '../../types/officer';
import { ProjectCorridor } from '../../types/project';
import { SanctionOrderModal } from './SanctionOrderModal';
import { 
  Gavel, 
  IndianRupee, 
  CheckCircle2, 
  FileCheck, 
  Clock, 
  Printer, 
  ShieldCheck, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { RiskBadge, StageBadge } from '../common/Badge';

interface ExecutiveDecisionCockpitProps {
  project: ProjectCorridor;
  parcels: Parcel[];
  currentOfficer: Officer;
  onSanctionCompensation: (parcelId: string) => Promise<void>;
  onDisburseCompensation: (parcelId: string) => Promise<void>;
  onOpenDigitalTwin: (parcel: Parcel) => void;
}

export const ExecutiveDecisionCockpit: React.FC<ExecutiveDecisionCockpitProps> = ({
  project,
  parcels,
  currentOfficer,
  onSanctionCompensation,
  onDisburseCompensation,
  onOpenDigitalTwin
}) => {
  const [selectedForSanctionOrder, setSelectedForSanctionOrder] = useState<Parcel | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Parcels requiring CALA decision
  const pendingSanctions = parcels.filter(
    p => p.compensation.paymentStatus === 'NOT_INITIATED' && p.currentStage !== 'SECTION_3A'
  );

  const sanctionedAwaitingDisbursement = parcels.filter(
    p => p.compensation.paymentStatus === 'CALA_SANCTIONED'
  );

  const handleSanctionAction = async (parcel: Parcel) => {
    setProcessingId(parcel.id);
    try {
      await onSanctionCompensation(parcel.id);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDisburseAction = async (parcel: Parcel) => {
    setProcessingId(parcel.id);
    try {
      await onDisburseCompensation(parcel.id);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <Gavel size={16} className="text-amber-600" />
            COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA) EXECUTIVE COCKPIT
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Statutory Sanction & Award Authorization
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Signed by: <strong className="text-slate-900">{currentOfficer.name}</strong> ({currentOfficer.designation})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
            <span className="text-emerald-800 text-[10px] uppercase font-bold block">Escrow Allocation</span>
            <span className="text-lg font-bold text-emerald-900 font-mono">₹{project.escrowBalanceCr} Cr</span>
          </div>
        </div>
      </div>

      {/* Two Workflows: Pending Section 3G Awards & Pending Section 3H Disbursements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue 1: Pending Section 3G Sanction Awards */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck size={16} className="text-gov-navy" />
                Section 3G Award Sanction Queue ({pendingSanctions.length})
              </h3>
              <p className="text-xs text-slate-500">
                Inquiries completed under Section 3C. Ready for formal statutory award.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {pendingSanctions.map((parcel) => (
              <div key={parcel.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900">Khasra {parcel.khasraNo}</span>
                    <span className="text-xs text-slate-500 ml-2">Village {parcel.village}</span>
                  </div>
                  <RiskBadge level={parcel.aiRisk.riskLevel} score={parcel.aiRisk.overallRiskScore} />
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Raiyat: <strong className="text-slate-800">{parcel.primaryOwnerName}</strong></span>
                  <span className="font-mono font-bold text-emerald-700">
                    ₹{(parcel.compensation.totalAwardAmount / 10000000).toFixed(2)} Cr
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onOpenDigitalTwin(parcel)}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-medium"
                  >
                    View Twin
                  </button>
                  <button
                    onClick={() => setSelectedForSanctionOrder(parcel)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium flex items-center gap-1 border border-slate-300"
                  >
                    <Printer size={12} /> Preview Order
                  </button>
                  <button
                    onClick={() => handleSanctionAction(parcel)}
                    disabled={processingId === parcel.id}
                    className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-light text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Gavel size={12} className="text-amber-400" />
                    {processingId === parcel.id ? 'Sanctioning...' : 'Sanction Section 3G Award'}
                  </button>
                </div>
              </div>
            ))}

            {pendingSanctions.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-600" />
                All pending awards in this reach have been sanctioned!
              </div>
            )}
          </div>
        </div>

        {/* Queue 2: Sanctioned Awards Awaiting Section 3H DBT Disbursement */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee size={16} className="text-emerald-700" />
                Section 3H Compensation Disbursement ({sanctionedAwaitingDisbursement.length})
              </h3>
              <p className="text-xs text-slate-500">
                Awards decreed. Authorize fund transfer via SBI Treasury Escrow.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Escrow Funded
            </span>
          </div>

          <div className="space-y-3">
            {sanctionedAwaitingDisbursement.map((parcel) => (
              <div key={parcel.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900">Khasra {parcel.khasraNo}</span>
                    <span className="text-xs text-slate-500 ml-2">Village {parcel.village}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    CALA Award Approved
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Raiyat: <strong className="text-slate-800">{parcel.primaryOwnerName}</strong></span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    ₹{(parcel.compensation.totalAwardAmount / 10000000).toFixed(2)} Cr
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedForSanctionOrder(parcel)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium flex items-center gap-1 border border-slate-300"
                  >
                    <Printer size={12} /> View Sanction Decree
                  </button>
                  <button
                    onClick={() => handleDisburseAction(parcel)}
                    disabled={processingId === parcel.id}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <IndianRupee size={12} />
                    {processingId === parcel.id ? 'Transferring via PFMS...' : 'Execute DBT to Raiyat Account'}
                  </button>
                </div>
              </div>
            ))}

            {sanctionedAwaitingDisbursement.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-600" />
                No awards currently awaiting direct benefit transfer!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sanction Order Official Printable Modal */}
      {selectedForSanctionOrder && (
        <SanctionOrderModal
          parcel={selectedForSanctionOrder}
          project={project}
          officer={currentOfficer}
          onClose={() => setSelectedForSanctionOrder(null)}
        />
      )}
    </div>
  );
};
