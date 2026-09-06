import React from 'react';
import { ProjectProposal } from '../../types/projectProposal';
import { X, ShieldCheck, Clock, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ProposalAuditLogModalProps {
  proposal: ProjectProposal | null;
  onClose: () => void;
}

export const ProposalAuditLogModal: React.FC<ProposalAuditLogModalProps> = ({
  proposal,
  onClose
}) => {
  if (!proposal) return null;

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'UNDER_SCRUTINY': return 'navy';
      case 'SUBMITTED': return 'info';
      case 'CLARIFICATION_REQUIRED': return 'warning';
      case 'REJECTED': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                IMMUTABLE STATUTORY AUDIT TRAIL
              </div>
              <h3 className="text-base font-bold text-white">
                Lifecycle Activity Log: {proposal.name}
              </h3>
              <div className="text-[11px] text-slate-300 font-mono">
                Project Code: {proposal.code} &bull; ID: {proposal.id}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Current Status:</span>{' '}
              <Badge variant={getStatusBadgeVariant(proposal.status)} size="sm">
                {proposal.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div className="text-slate-500 font-mono text-[11px]">
              Total Audit Entries: <strong>{proposal.auditTrail.length}</strong>
            </div>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 my-4 pl-6">
            {proposal.auditTrail.map((entry, idx) => (
              <div key={entry.id} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gov-navy flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-navy"></span>
                </span>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 group-hover:border-slate-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {entry.action.replace(/_/g, ' ')}
                      </span>
                      {entry.newStatus && (
                        <div className="flex items-center gap-1 text-[10px]">
                          {entry.previousStatus && (
                            <span className="text-slate-400 line-through">
                              {entry.previousStatus}
                            </span>
                          )}
                          <ArrowRight size={10} className="text-slate-400" />
                          <Badge variant={getStatusBadgeVariant(entry.newStatus)} size="sm">
                            {entry.newStatus}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock size={11} />
                      {entry.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {entry.remarks}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                    <div>
                      Actor: <strong className="text-slate-800">{entry.actor}</strong> ({entry.role})
                    </div>
                    {entry.digitalSealHash && (
                      <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                        <span>Digital Seal:</span>
                        <code className="text-gov-navy font-bold">{entry.digitalSealHash}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-lg transition-colors"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
