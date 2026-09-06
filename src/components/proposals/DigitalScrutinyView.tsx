import React, { useState, useEffect } from 'react';
import { ProjectProposal, ScrutinyChecklistItem, ScrutinyCheckStatus } from '../../types/projectProposal';
import { proposalService } from '../../services/proposalService';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Building2, 
  Layers, 
  FileText, 
  Compass, 
  ArrowLeft,
  Send,
  AlertTriangle
} from 'lucide-react';

interface DigitalScrutinyViewProps {
  proposal: ProjectProposal;
  onBack: () => void;
  onUpdated: (updatedProposal: ProjectProposal) => void;
  currentOfficerName?: string;
  currentOfficerRole?: string;
}

export const DigitalScrutinyView: React.FC<DigitalScrutinyViewProps> = ({
  proposal,
  onBack,
  onUpdated,
  currentOfficerName = 'Sanjay Sinha',
  currentOfficerRole = 'Director (Scrutiny & Highways)'
}) => {
  const { showToast } = useToast();
  const [checklist, setChecklist] = useState<ScrutinyChecklistItem[]>(proposal.scrutinyChecklist);
  const [generalRemarks, setGeneralRemarks] = useState(proposal.scrutinyRemarks || '');

  useEffect(() => {
    setChecklist(proposal.scrutinyChecklist);
    setGeneralRemarks(proposal.scrutinyRemarks || '');
  }, [proposal]);

  // Update item status
  const handleSetStatus = (id: string, newStatus: ScrutinyCheckStatus) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          verifiedBy: currentOfficerName,
          verifiedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
        };
      }
      return item;
    }));
  };

  // Update item remarks
  const handleItemRemarksChange = (id: string, remarks: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, remarks };
      }
      return item;
    }));
  };

  // Calculate pass score
  const passCount = checklist.filter(c => c.status === 'PASS').length;
  const failCount = checklist.filter(c => c.status === 'FAIL').length;
  const clarificationCount = checklist.filter(c => c.status === 'NEEDS_CLARIFICATION').length;

  // Submit Scrutiny
  const handleSaveScrutiny = (decision: 'PASS' | 'FAIL' | 'NEEDS_CLARIFICATION') => {
    let finalChecklist = [...checklist];
    if (decision === 'PASS') {
      finalChecklist = finalChecklist.map(c => ({
        ...c,
        status: 'PASS' as const,
        verifiedBy: currentOfficerName,
        verifiedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
      }));
    }

    try {
      const updated = proposalService.updateScrutinyChecklist(
        proposal.id,
        finalChecklist,
        generalRemarks || `Scrutiny evaluated with decision: ${decision}.`,
        currentOfficerName,
        currentOfficerRole
      );

      showToast({
        title: `Digital Scrutiny Recorded: ${decision}`,
        message: `Proposal ${proposal.name} status updated to ${updated.status.replace(/_/g, ' ')}.`,
        type: decision === 'PASS' ? 'success' : decision === 'FAIL' ? 'error' : 'warning'
      });

      onUpdated(updated);
    } catch (e: any) {
      showToast({
        title: 'Scrutiny Error',
        message: e.message || 'Failed to update scrutiny checklist',
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
                <FileCheck2 size={15} className="text-gov-navy" />
                <span>DIGITAL SCRUTINY DESK &bull; STATUTORY VERIFICATION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {proposal.name}
              </h2>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                {proposal.code} &bull; {proposal.state} ({proposal.district}) &bull; {proposal.department}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
              <Badge variant={proposal.status === 'APPROVED' ? 'success' : proposal.status === 'REJECTED' ? 'danger' : proposal.status === 'CLARIFICATION_REQUIRED' ? 'warning' : 'info'}>
                {proposal.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Scrutiny Tally Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium block">Total Criteria</span>
            <span className="text-xl font-black text-slate-900">5 Statutory Checks</span>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 font-medium block">Checks Passed</span>
            <span className="text-xl font-black text-emerald-700">{passCount} / 5 PASS</span>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <span className="text-amber-800 font-medium block">Clarifications Needed</span>
            <span className="text-xl font-black text-amber-700">{clarificationCount} PENDING</span>
          </div>
          <div className="bg-red-50/70 p-3 rounded-xl border border-red-200">
            <span className="text-red-800 font-medium block">Checks Failed</span>
            <span className="text-xl font-black text-red-700">{failCount} FAIL</span>
          </div>
        </div>
      </div>

      {/* 5-Point Statutory Scrutiny Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-gov-navy" />
            <span>5-Point Statutory Scrutiny Checklist</span>
          </h3>
          <span className="text-xs text-slate-500">
            Reviewing Officer: <strong className="text-slate-800">{currentOfficerName}</strong> ({currentOfficerRole})
          </span>
        </div>

        <div className="space-y-4">
          {checklist.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all space-y-3 ${
                item.status === 'PASS' ? 'bg-emerald-50/30 border-emerald-300' :
                item.status === 'FAIL' ? 'bg-red-50/30 border-red-300' :
                item.status === 'NEEDS_CLARIFICATION' ? 'bg-amber-50/30 border-amber-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-gov-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* 3 Status Buttons: PASS, FAIL, NEEDS CLARIFICATION */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetStatus(item.id, 'PASS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm ${
                      item.status === 'PASS'
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span>PASS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetStatus(item.id, 'NEEDS_CLARIFICATION')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm ${
                      item.status === 'NEEDS_CLARIFICATION'
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                  >
                    <HelpCircle size={13} />
                    <span>NEEDS CLARIFICATION</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetStatus(item.id, 'FAIL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm ${
                      item.status === 'FAIL'
                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-800'
                    }`}
                  >
                    <XCircle size={13} />
                    <span>FAIL</span>
                  </button>
                </div>
              </div>

              {/* Remarks Field for this check */}
              <div className="pt-2 border-t border-slate-200/60">
                <input
                  type="text"
                  placeholder="Officer verification notes / statutory findings for this criterion..."
                  value={item.remarks}
                  onChange={(e) => handleItemRemarksChange(item.id, e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
                {item.verifiedBy && (
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Last stamped by {item.verifiedBy} at {item.verifiedAt}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Command Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Scrutiny Findings & Official Administrative Order
        </h3>

        <textarea
          rows={3}
          placeholder="Enter comprehensive scrutiny summary notes, legal observations, or specific clarification instructions for the implementing agency..."
          value={generalRemarks}
          onChange={(e) => setGeneralRemarks(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
          >
            Back to Proposal Registry
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveScrutiny('FAIL')}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <XCircle size={14} />
              <span>Reject Proposal</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveScrutiny('NEEDS_CLARIFICATION')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <AlertTriangle size={14} />
              <span>Request Clarification</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveScrutiny('PASS')}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>Mark Scrutiny Complete (PASS)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
