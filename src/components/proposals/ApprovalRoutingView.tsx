import React, { useState } from 'react';
import { ProjectProposal, ApprovalStageItem, RoutingStageKey } from '../../types/projectProposal';
import { proposalService } from '../../services/proposalService';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  FileCheck, 
  ShieldCheck, 
  XCircle, 
  AlertTriangle,
  Send,
  Building2
} from 'lucide-react';

interface ApprovalRoutingViewProps {
  proposal: ProjectProposal;
  onBack: () => void;
  onUpdated: (updatedProposal: ProjectProposal) => void;
  currentOfficerName?: string;
  currentOfficerRole?: string;
}

export const ApprovalRoutingView: React.FC<ApprovalRoutingViewProps> = ({
  proposal,
  onBack,
  onUpdated,
  currentOfficerName = 'Shri Alok Ranjan, IAS',
  currentOfficerRole = 'Joint Secretary (Land & Highways)'
}) => {
  const { showToast } = useToast();
  const [remarks, setRemarks] = useState('');

  // Identify active stage
  const currentStageIndex = proposal.approvalStages.findIndex(s => s.stageKey === proposal.currentApprovalStage);
  const activeStage = proposal.approvalStages[currentStageIndex >= 0 ? currentStageIndex : 0];

  // Stage status badge helper
  const getStageBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success" size="sm">APPROVED</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="info" size="sm">UNDER REVIEW</Badge>;
      case 'CLARIFICATION':
        return <Badge variant="warning" size="sm">CLARIFICATION</Badge>;
      case 'REJECTED':
        return <Badge variant="danger" size="sm">REJECTED</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="default" size="sm">PENDING</Badge>;
    }
  };

  // Advance approval stage
  const handleApproveStage = () => {
    try {
      const updated = proposalService.advanceApprovalStage(
        proposal.id,
        activeStage.stageKey,
        remarks || `Stage approved by ${currentOfficerName} (${currentOfficerRole}). Forwarded to next statutory authority.`,
        currentOfficerName,
        currentOfficerRole
      );

      showToast({
        title: 'Statutory Endorsement Recorded',
        message: `Stage '${activeStage.stageTitle}' approved. Proposal advanced in pipeline.`,
        type: 'success'
      });

      setRemarks('');
      onUpdated(updated);
    } catch (e: any) {
      showToast({
        title: 'Approval Error',
        message: e.message || 'Failed to approve stage',
        type: 'error'
      });
    }
  };

  // Request clarification
  const handleRequestClarification = () => {
    try {
      const updated = proposalService.requestClarification(
        proposal.id,
        remarks || 'Clarification requested on corridor boundary details or valuation schedule.',
        currentOfficerName,
        currentOfficerRole
      );

      showToast({
        title: 'Clarification Notice Issued',
        message: `Proposal status set to Clarification Required. Sent to implementing agency.`,
        type: 'warning'
      });

      setRemarks('');
      onUpdated(updated);
    } catch (e: any) {
      showToast({
        title: 'Action Error',
        message: e.message || 'Failed to issue clarification',
        type: 'error'
      });
    }
  };

  // Reject proposal
  const handleRejectProposal = () => {
    try {
      const updated = proposalService.rejectProposal(
        proposal.id,
        remarks || 'Proposal rejected by competent authority.',
        currentOfficerName,
        currentOfficerRole
      );

      showToast({
        title: 'Proposal Rejected',
        message: `Proposal ${proposal.name} has been rejected with administrative order.`,
        type: 'error'
      });

      setRemarks('');
      onUpdated(updated);
    } catch (e: any) {
      showToast({
        title: 'Action Error',
        message: e.message || 'Failed to reject proposal',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Return to Proposal Directory"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-0.5">
                <GitBranch size={15} className="text-gov-navy" />
                <span>4-TIER STATUTORY APPROVAL PIPELINE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {proposal.name}
              </h2>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                {proposal.code} &bull; {proposal.state} &bull; {proposal.department} &bull; Estimated: ₹{proposal.estimatedCostCr} Cr
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Status</span>
            <Badge variant={proposal.status === 'APPROVED' ? 'success' : proposal.status === 'REJECTED' ? 'danger' : proposal.status === 'CLARIFICATION_REQUIRED' ? 'warning' : 'info'}>
              {proposal.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>

        {/* Visual Pipeline Flow Stepper */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
            <span>Statutory Routing Sequence</span>
            <span className="text-gov-navy font-bold">
              Current Active Stage: {activeStage.stageTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
            {proposal.approvalStages.map((stage, idx) => {
              const isPassed = stage.status === 'APPROVED';
              const isCurrent = stage.stageKey === proposal.currentApprovalStage && proposal.status !== 'APPROVED';
              const isFinalApproved = proposal.status === 'APPROVED' && stage.stageKey === 'FINAL_APPROVAL';

              return (
                <div
                  key={stage.stageKey}
                  className={`p-3 rounded-xl border text-center relative transition-all ${
                    isPassed || isFinalApproved
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                      : isCurrent
                      ? 'bg-gov-navy text-white border-gov-navy shadow-md ring-2 ring-gov-navy/30'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase mb-1">
                    {isPassed || isFinalApproved ? (
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    )}
                    <span>Stage {idx + 1}</span>
                  </div>
                  <div className="text-xs font-bold leading-tight line-clamp-2">
                    {stage.stageTitle}
                  </div>
                  <div className="mt-2 text-[10px] opacity-80">
                    {stage.date !== '-' ? stage.date : 'Awaiting'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Detail Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck size={18} className="text-gov-navy" />
          <span>Stage-by-Stage Endorsement Dossier</span>
        </h3>

        <div className="space-y-4">
          {proposal.approvalStages.map((stage, idx) => {
            const isApproved = stage.status === 'APPROVED';
            const isUnderReview = stage.status === 'UNDER_REVIEW';

            return (
              <div
                key={stage.stageKey}
                className={`p-5 rounded-xl border transition-all space-y-3 ${
                  isApproved ? 'bg-emerald-50/30 border-emerald-200' :
                  isUnderReview ? 'bg-blue-50/40 border-blue-300 shadow-sm ring-1 ring-blue-200' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-gov-navy text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {stage.stageTitle}
                      </h4>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        Authority Level: {stage.level} &bull; Jurisdiction: {stage.jurisdiction}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500">
                      {stage.date !== '-' ? `Date: ${stage.date}` : 'Pending Turn'}
                    </span>
                    {getStageBadge(stage.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block font-medium">Designated Officer:</span>
                    <strong className="text-slate-900">{stage.officerName}</strong>
                    <div className="text-[11px] text-slate-600">{stage.officerDesignation}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-medium">Official Remarks & Record:</span>
                    <p className="text-slate-800 italic bg-white p-2 rounded-lg border border-slate-200 mt-0.5">
                      "{stage.remarks || 'No remarks recorded yet.'}"
                    </p>
                    {stage.signedDigitalHash && (
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        DSC Sign Hash: <code className="text-gov-navy font-bold">{stage.signedDigitalHash}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Officer Approval Action Console */}
      {proposal.status !== 'APPROVED' && proposal.status !== 'REJECTED' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-gov-navy" />
              <span>Officer Approval Action Console: {activeStage.stageTitle}</span>
            </h3>
            <span className="text-xs text-slate-500">
              Logged in as: <strong className="text-slate-900">{currentOfficerName}</strong> ({currentOfficerRole})
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Endorsement Remarks / Statutory Directions *
            </label>
            <textarea
              rows={3}
              placeholder={`Enter formal endorsement remarks for ${activeStage.stageTitle} stage...`}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
            >
              Back to Registry
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRejectProposal}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <XCircle size={14} />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={handleRequestClarification}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <AlertTriangle size={14} />
                <span>Request Clarification</span>
              </button>

              <button
                type="button"
                onClick={handleApproveStage}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Approve Current Stage & Forward &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
