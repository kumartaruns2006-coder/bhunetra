import React, { useState } from 'react';
import { BeneficiaryRecord, CompensationWorkflowStep } from '../../types/compensationRr';
import { compensationRrService } from '../../services/compensationRrService';
import { useToast } from '../ui/Toast';
import { 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Send, 
  FileText, 
  Building2, 
  ArrowRight, 
  ExternalLink,
  Lock,
  Landmark,
  Check
} from 'lucide-react';

interface CompensationWorkflowModalProps {
  beneficiary: BeneficiaryRecord;
  onClose: () => void;
  onUpdated: () => void;
  onOpenDigitalTwin?: (parcelId: string) => void;
}

export const CompensationWorkflowModal: React.FC<CompensationWorkflowModalProps> = ({
  beneficiary,
  onClose,
  onUpdated,
  onOpenDigitalTwin
}) => {
  const { showToast } = useToast();
  const [currentBeneficiary, setCurrentBeneficiary] = useState<BeneficiaryRecord>(beneficiary);
  const [loading, setLoading] = useState(false);

  const steps: { key: CompensationWorkflowStep; title: string; subtitle: string }[] = [
    { key: 'ASSESSMENT', title: '1. Assessment', subtitle: 'Section 3G Valuation & Solatium' },
    { key: 'APPROVAL', title: '2. Approval', subtitle: 'CALA Statutory Sanction Decree' },
    { key: 'DISBURSEMENT', title: '3. Disbursement', subtitle: 'SBI Escrow PFMS DBT Transfer' },
    { key: 'CONFIRMATION', title: '4. Confirmation', subtitle: 'Bank UTR & Possession Handover' }
  ];

  const getStepIndex = (step: CompensationWorkflowStep) => {
    switch (step) {
      case 'ASSESSMENT': return 0;
      case 'APPROVAL': return 1;
      case 'DISBURSEMENT': return 2;
      case 'CONFIRMATION': return 3;
    }
  };

  const activeIndex = getStepIndex(currentBeneficiary.workflowStep);

  // Handle Workflow Transition
  const handleAdvanceStep = async (nextStep: CompensationWorkflowStep) => {
    setLoading(true);
    try {
      const updated = await compensationRrService.advanceWorkflowStep(
        currentBeneficiary.id, 
        nextStep, 
        'District Land Acquisition Officer (CALA)'
      );
      setCurrentBeneficiary(updated);
      onUpdated();

      showToast({
        title: `Workflow Advanced to ${nextStep}`,
        message: `Beneficiary ${updated.id} for Khasra ${updated.khasraNo} successfully updated.`,
        type: 'success'
      });
    } catch (err: any) {
      showToast({
        title: 'Workflow Error',
        message: err.message || 'Failed to update workflow state',
        type: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <ShieldCheck size={14} />
              Statutory 4-Step Compensation Workflow
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Khasra {currentBeneficiary.khasraNo} &bull; Beneficiary {currentBeneficiary.id}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentBeneficiary.projectName} &bull; Village {currentBeneficiary.village}, {currentBeneficiary.district}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 4-Step Stepper Bar */}
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s, idx) => {
              const isCompleted = idx < activeIndex || currentBeneficiary.workflowStep === 'CONFIRMATION';
              const isCurrent = idx === activeIndex && currentBeneficiary.workflowStep !== 'CONFIRMATION';
              return (
                <div 
                  key={s.key} 
                  className={`p-2.5 rounded-xl border transition-all ${
                    isCompleted 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : isCurrent 
                        ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-xs ring-1 ring-blue-400' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isCompleted ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                    )}
                    <span className="text-xs font-bold truncate">{s.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate hidden sm:block">
                    {s.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Step Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Financial Breakdown Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Award Valuation Matrix (RFCTLARR 2013 Section 26 to 30)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Assessed</div>
                <div className="text-sm font-extrabold text-slate-900 mt-1">
                  ₹{(currentBeneficiary.assessedAmount / 10000000).toFixed(2)} Cr
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Approved</div>
                <div className={`text-sm font-extrabold mt-1 ${currentBeneficiary.approvedAmount > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {currentBeneficiary.approvedAmount > 0 ? `₹${(currentBeneficiary.approvedAmount / 10000000).toFixed(2)} Cr` : 'Pending'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Disbursed</div>
                <div className={`text-sm font-extrabold mt-1 ${currentBeneficiary.disbursedAmount > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {currentBeneficiary.disbursedAmount > 0 ? `₹${(currentBeneficiary.disbursedAmount / 10000000).toFixed(2)} Cr` : '₹0.00'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Pending</div>
                <div className="text-sm font-extrabold text-amber-700 mt-1">
                  ₹{(currentBeneficiary.pendingAmount / 10000000).toFixed(2)} Cr
                </div>
              </div>
            </div>
          </div>

          {/* Step Detail Explanation */}
          {currentBeneficiary.workflowStep === 'ASSESSMENT' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <FileText size={15} /> Stage 1: Cadastral Valuation Assessment Complete
                </div>
                <p>
                  Joint Measurement Survey (JMS) valuation determined using circle rate multiplier, 100% statutory solatium, and 12% additional interest. Ready for CALA judicial scrutiny and sanction.
                </p>
              </div>

              <button
                onClick={() => handleAdvanceStep('APPROVAL')}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Advance & Submit for CALA Sanction Approval →'}
              </button>
            </div>
          )}

          {currentBeneficiary.workflowStep === 'APPROVAL' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <Clock size={15} /> Stage 2: Section 3G Statutory Award Awaiting Sanction
                </div>
                <p>
                  CALA (Competent Authority for Land Acquisition) must review the valuation schedule and formally grant Section 3G statutory decree sanction before SBI Escrow DBT funding can be unlocked.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="text-slate-500 font-semibold">Authorized Authority:</div>
                <div className="font-bold text-slate-900">Additional Collector (Land Acquisition) / CALA, Patna</div>
                <div className="text-slate-500">Statutory Decree: Bihar Gazette Extraordinary No. 114</div>
              </div>

              <button
                onClick={() => handleAdvanceStep('APPROVAL')}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Issuing Decree...' : 'Grant Section 3G Award Sanction (CALA Decree) →'}
              </button>
            </div>
          )}

          {currentBeneficiary.workflowStep === 'DISBURSEMENT' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-purple-950">
                  <Landmark size={15} /> Stage 3: Direct Benefit Transfer (PFMS / SBI Escrow)
                </div>
                <p>
                  Sanction approved. Escrow funding verified. Beneficiary account is validated via Aadhaar-linked NPCI gateway. Ready for electronic Direct Benefit Transfer.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500">Beneficiary Demo ID:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentBeneficiary.id}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500">Masked Account:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentBeneficiary.maskedBankAadhaar}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500">Beneficiary Bank:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentBeneficiary.bankName}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500">Award Sanction Date:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentBeneficiary.awardDate || '2026-03-01'}</div>
                </div>
              </div>

              <button
                onClick={() => handleAdvanceStep('DISBURSEMENT')}
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Disbursing via PFMS...' : `Authorize Electronic DBT of ₹${(currentBeneficiary.pendingAmount / 10000000).toFixed(2)} Cr →`}
              </button>
            </div>
          )}

          {currentBeneficiary.workflowStep === 'CONFIRMATION' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <CheckCircle2 size={16} /> Stage 4: Disbursement Confirmed & Recorded
                </div>
                <p>
                  Electronic funds disbursed successfully via PFMS gateway to beneficiary account. Digital transaction receipt generated and linked to statutory revenue records.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500">Bank UTR Reference:</div>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">{currentBeneficiary.utrReference || 'PFMS-BR-2026-9812401'}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500">Disbursement Date:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentBeneficiary.disbursementDate || new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl text-xs flex items-center gap-2 text-emerald-900">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>Physical Possession Panchnama (Section 3E) unlocked for execution.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (onOpenDigitalTwin) {
                onClose();
                onOpenDigitalTwin(currentBeneficiary.parcelId);
              }
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <ExternalLink size={13} /> View 360° Parcel Digital Twin
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
