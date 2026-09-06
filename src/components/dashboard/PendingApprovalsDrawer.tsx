import React from 'react';
import { X, CheckCircle2, Clock, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

interface PendingApprovalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const PendingApprovalsDrawer: React.FC<PendingApprovalsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProject
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const pendingItems = [
    {
      id: 'app-1',
      stage: 'SECTION_3D_DECLARATION',
      project: 'Patna Ring Road Expansion (Phase II)',
      projectId: 'PRR-PH2-2026',
      authority: 'CALA / Additional Collector, Patna',
      details: 'Declaration for 482 parcels across 6 revenue villages (Kanhauli, Naubatpur, Danapur). Section 3A period expiring in 18 days.',
      urgency: 'HIGH',
      badgeVariant: 'warning' as const
    },
    {
      id: 'app-2',
      stage: 'SECTION_3G_VALUATION_AWARD',
      project: 'Amas-Darbhanga Expressway (Corridor 3)',
      projectId: 'NH119D-EXP',
      authority: 'Competent Authority (Land Acquisition), Jehanabad',
      details: 'Valuation awards finalized for Khasra 412 & 418. Solatium (100%) and 12% additional interest calculated. Total: ₹14.50 Cr.',
      urgency: 'CRITICAL',
      badgeVariant: 'danger' as const
    },
    {
      id: 'app-3',
      stage: 'SECTION_3A_GAZETTE_INTENT',
      project: 'Varanasi-Ranchi-Kolkata Economic Corridor',
      projectId: 'VRK-EC-UP',
      authority: 'MoRTH Central Gazette Desk, New Delhi',
      details: 'Statutory intent notification for 76.0 km Greenfield alignment covering Chandauli district.',
      urgency: 'MEDIUM',
      badgeVariant: 'info' as const
    }
  ];

  const handleApprove = (id: string, stage: string) => {
    showToast({
      title: 'Statutory Approval Endorsed',
      message: `Digital signature applied for ${stage.replace(/_/g, ' ')}. Notification queued for automated Gazette publication.`,
      type: 'success'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                STATUTORY WORKFLOW PIPELINE
              </span>
              <h3 className="text-base font-bold text-white">
                Pending Regulatory Approvals ({pendingItems.length})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant={item.badgeVariant} size="sm">
                    {item.stage.replace(/_/g, ' ')}
                  </Badge>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">
                    {item.project}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Authority: <strong className="text-slate-700">{item.authority}</strong>
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {item.urgency} PRIORITY
                </span>
              </div>

              <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                {item.details}
              </p>

              <div className="flex items-center justify-between pt-1 gap-2">
                {onSelectProject && (
                  <button
                    onClick={() => {
                      onSelectProject(item.projectId);
                      onClose();
                    }}
                    className="text-xs font-bold text-gov-navy hover:text-gov-navy-light flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ArrowRight size={12} />
                  </button>
                )}
                <button
                  onClick={() => handleApprove(item.id, item.stage)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ml-auto"
                >
                  <CheckCircle2 size={13} />
                  <span>Endorse & Sign</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
