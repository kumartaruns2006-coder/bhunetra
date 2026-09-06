import React, { useState, useEffect, useMemo } from 'react';
import { 
  WorkflowStage, 
  WorkflowActionType, 
  WorkflowAuditEvent, 
  WorkflowProjectSummary,
  WorkflowStageStatus
} from '../../types/workflow';
import { workflowService } from '../../services/workflowService';
import { ProjectCorridor } from '../../types/project';
import { Parcel } from '../../types/parcel';
import { Officer } from '../../types/officer';
import { ParcelTable } from '../project/ParcelTable';
import { useToast } from '../ui/Toast';
import { 
  GitFork, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Send, 
  Check, 
  X, 
  HelpCircle, 
  Upload, 
  Calendar, 
  Building2, 
  IndianRupee, 
  Users, 
  Flag, 
  Scale, 
  Compass, 
  History, 
  FileSpreadsheet, 
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
  Lock,
  Layers,
  Printer
} from 'lucide-react';

interface EndToEndWorkflowViewProps {
  project: ProjectCorridor;
  parcels: Parcel[];
  currentOfficer: Officer;
  onSelectParcel: (parcel: Parcel) => void;
  onOpenDigitalTwin: (parcel: Parcel) => void;
  onLaunchVerification: (parcel: Parcel) => void;
  onNavigateToMap: (parcel: Parcel) => void;
  onNavigateModule?: (moduleId: string) => void;
}

export const EndToEndWorkflowView: React.FC<EndToEndWorkflowViewProps> = ({
  project,
  parcels,
  currentOfficer,
  onSelectParcel,
  onOpenDigitalTwin,
  onLaunchVerification,
  onNavigateToMap,
  onNavigateModule
}) => {
  const { showToast } = useToast();

  // Workflow stages & summary state
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [summary, setSummary] = useState<WorkflowProjectSummary | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number>(8); // Default to Stage 8 (Objection / Hearing) or Stage 11
  const [auditLog, setAuditLog] = useState<WorkflowAuditEvent[]>([]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // View mode switcher: 15-Stage Workflow vs. Cadastral Parcel Table
  const [viewMode, setViewMode] = useState<'WORKFLOW' | 'PARCELS'>('WORKFLOW');

  // Action Modal State
  const [activeActionModal, setActiveActionModal] = useState<{
    stage: WorkflowStage;
    actionType: WorkflowActionType;
  } | null>(null);

  const [modalRemarks, setModalRemarks] = useState<string>('');
  const [modalDocTitle, setModalDocTitle] = useState<string>('');
  const [modalClarification, setModalClarification] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  // Search & Filter
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Load stages & subscribe to updates
  useEffect(() => {
    loadWorkflowData();
    const unsubscribe = workflowService.subscribe((updatedStages) => {
      setStages(updatedStages);
      workflowService.getSummary().then(setSummary);
      workflowService.getAuditHistory().then(setAuditLog);
    });
    return unsubscribe;
  }, []);

  const loadWorkflowData = async () => {
    const list = await workflowService.getStages();
    const sum = await workflowService.getSummary();
    const log = await workflowService.getAuditHistory();
    setStages(list);
    setSummary(sum);
    setAuditLog(log);
  };

  // Currently selected stage object
  const selectedStage = useMemo(() => {
    return stages.find(s => s.id === selectedStageId) || stages[0];
  }, [stages, selectedStageId]);

  // Delayed and blocked stages list for prominent alert banner
  const delayedStages = useMemo(() => {
    return stages.filter(s => s.status === 'DELAYED' || s.status === 'BLOCKED');
  }, [stages]);

  // Filtered stages for milestone tracker
  const filteredStages = useMemo(() => {
    if (categoryFilter === 'ALL') return stages;
    return stages.filter(s => s.category === categoryFilter);
  }, [stages, categoryFilter]);

  // Status visual configurations
  const getStatusBadge = (status: WorkflowStageStatus) => {
    switch (status) {
      case 'COMPLETED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Completed',
          icon: CheckCircle2
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-500 animate-pulse',
          label: 'In Progress',
          icon: Clock
        };
      case 'DELAYED':
        return {
          bg: 'bg-red-50 text-red-900 border-red-300',
          dot: 'bg-red-500 animate-ping',
          label: 'Delayed',
          icon: AlertTriangle
        };
      case 'BLOCKED':
        return {
          bg: 'bg-purple-50 text-purple-900 border-purple-300',
          dot: 'bg-purple-600',
          label: 'Blocked',
          icon: ShieldAlert
        };
      case 'NOT_STARTED':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Not Started',
          icon: Calendar
        };
    }
  };

  // Currency formatter
  const formatINR = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Open action dialog
  const handleOpenAction = (stage: WorkflowStage, actionType: WorkflowActionType) => {
    setActiveActionModal({ stage, actionType });
    setModalRemarks('');
    setModalDocTitle('');
    setModalClarification('');
  };

  // Execute workflow action
  const handleConfirmAction = async () => {
    if (!activeActionModal) return;
    setIsSubmittingAction(true);

    try {
      const { updatedStage, auditEvent } = await workflowService.performWorkflowAction(
        activeActionModal.stage.id,
        {
          actionType: activeActionModal.actionType,
          actorName: currentOfficer.name,
          actorRole: currentOfficer.role,
          remarks: modalRemarks || `Executed ${activeActionModal.actionType} on Stage ${activeActionModal.stage.stageNumber}: ${activeActionModal.stage.name}`,
          documentTitle: modalDocTitle || undefined,
          clarificationQuery: modalClarification || undefined
        }
      );

      showToast({
        title: `Workflow Action: ${activeActionModal.actionType.replace(/_/g, ' ')}`,
        message: `Stage ${updatedStage.stageNumber} updated to ${updatedStage.status.replace(/_/g, ' ')}. Audit seal ${auditEvent.digitalSealHash} generated.`,
        type: updatedStage.status === 'COMPLETED' ? 'success' : updatedStage.status === 'BLOCKED' ? 'warning' : 'info'
      });

      setActiveActionModal(null);
      await loadWorkflowData();
    } catch (err: any) {
      showToast({
        title: 'Action Error',
        message: err.message || 'Failed to update workflow stage',
        type: 'warning'
      });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Quick resolve pending action
  const handleResolveAction = async (actionId: string) => {
    if (!selectedStage) return;
    await workflowService.resolvePendingAction(selectedStage.id, actionId);
    showToast({
      title: 'Action Item Resolved',
      message: 'Pending statutory milestone item marked as completed.',
      type: 'success'
    });
    await loadWorkflowData();
  };

  // Reset workflow data
  const handleResetWorkflow = () => {
    if (window.confirm('Reset all 15 workflow stages and demo state to defaults?')) {
      workflowService.resetToDefault();
      loadWorkflowData();
      showToast({
        title: 'Workflow Demo State Reset',
        message: 'All 15 statutory acquisition stages restored to default milestone states.',
        type: 'info'
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* ============================================================ */}
      {/* 1. MASTER HEADER & VIEW MODE CONTROLS */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-gov-navy uppercase tracking-wider mb-1">
            <GitFork className="w-4 h-4 text-amber-500" />
            <span>PART 6: END-TO-END STATUTORY ACQUISITION WORKFLOW</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
              15 STAGES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {project.name}
          </h1>
          <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
            <span>Corridor Code: <strong className="text-slate-900 font-mono">{project.code}</strong></span>
            <span>&bull;</span>
            <span>Length: <strong className="text-slate-900">{project.corridorLengthKm} km</strong></span>
            <span>&bull;</span>
            <span>RoW: <strong className="text-slate-900">{project.rightOfWayWidthM}m buffer</strong></span>
            <span>&bull;</span>
            <span>Agency: <strong className="text-slate-900">{project.implementingAgency}</strong></span>
          </p>
        </div>

        {/* Top Controls: Switch View, Reset, Audit */}
        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs font-bold">
            <button
              onClick={() => setViewMode('WORKFLOW')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'WORKFLOW'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>15-Stage Workflow</span>
            </button>
            <button
              onClick={() => setViewMode('PARCELS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'PARCELS'
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cadastral Parcels ({parcels.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="View Immutable Workflow Audit Log"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Audit Trail</span>
          </button>

          <button
            onClick={handleResetWorkflow}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
            title="Reset Workflow Demo State"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* If User Selected Cadastral Parcel View, render ParcelTable */}
      {viewMode === 'PARCELS' ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div>
              <strong>Cadastral Parcel Register: </strong>
              Showing all individual revenue plots pegged within the 60m RoW corridor of {project.name}.
            </div>
            <button
              onClick={() => setViewMode('WORKFLOW')}
              className="px-3 py-1 bg-gov-navy text-white rounded-lg font-bold hover:bg-slate-800"
            >
              Back to 15-Stage Workflow
            </button>
          </div>
          <ParcelTable
            parcels={parcels}
            onSelectParcel={onSelectParcel}
            onOpenDigitalTwin={onOpenDigitalTwin}
            onLaunchVerification={onLaunchVerification}
            onNavigateToMap={onNavigateToMap}
          />
        </div>
      ) : (
        <>
          {/* ============================================================ */}
          {/* 2. KEY METRICS HERO RIBBON (USER HIGHLIGHTS) */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Compensation (1,025 completed / 225 pending) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  Compensation
                </span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {summary ? ((summary.compensationCompletedCount / (summary.compensationCompletedCount + summary.compensationPendingCount)) * 100).toFixed(1) : '82.0'}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {summary?.compensationCompletedCount.toLocaleString() || '1,025'}
                </span>
                <span className="text-xs font-semibold text-emerald-700 uppercase">completed</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span>Pending Verification:</span>
                <strong className="text-amber-700 font-mono font-bold">
                  {summary?.compensationPendingCount.toLocaleString() || '225'} pending
                </strong>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary ? (summary.compensationCompletedCount / (summary.compensationCompletedCount + summary.compensationPendingCount)) * 100 : 82}%` }}
                />
              </div>
            </div>

            {/* Metric 2: R&R (820 completed / 160 pending) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Users className="w-4 h-4 text-purple-600" />
                  Rehabilitation & Resettlement
                </span>
                <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {summary ? ((summary.rrCompletedCount / (summary.rrCompletedCount + summary.rrPendingCount)) * 100).toFixed(1) : '83.7'}%
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {summary?.rrCompletedCount.toLocaleString() || '820'}
                </span>
                <span className="text-xs font-semibold text-purple-700 uppercase">completed</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span>Homestead / Allowance:</span>
                <strong className="text-amber-700 font-mono font-bold">
                  {summary?.rrPendingCount.toLocaleString() || '160'} pending
                </strong>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary ? (summary.rrCompletedCount / (summary.rrCompletedCount + summary.rrPendingCount)) * 100 : 83.7}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Possession (72% secured) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Flag className="w-4 h-4 text-blue-600" />
                  Physical Possession
                </span>
                <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {summary?.possessionSecuredPercentage || 72}% Secured
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {summary?.possessionSecuredPercentage || 72}%
                </span>
                <span className="text-xs font-semibold text-blue-700 uppercase">27.6 km RoW</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span>Total Corridor:</span>
                <strong className="text-slate-800 font-mono">
                  38.4 km (10.8 km pending)
                </strong>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary?.possessionSecuredPercentage || 72}%` }}
                />
              </div>
            </div>

            {/* Metric 4: Total Corridor Progress (15 Stages) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <GitFork className="w-4 h-4 text-amber-600" />
                  Overall 15-Stage Progress
                </span>
                <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {summary?.completedStages || 7}/15 Stages
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-gov-navy font-mono">
                  {summary?.overallPercentage || 47}%
                </span>
                <span className="text-xs font-semibold text-gov-navy uppercase">Weighted Readiness</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span>Active Milestones:</span>
                <strong className="text-slate-800 font-mono">
                  {stages.filter(s => s.status === 'IN_PROGRESS').length} In Progress
                </strong>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-gov-navy h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary?.overallPercentage || 47}%` }}
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. DELAYED MILESTONE INDICATOR (PROMINENT WARNING ALERT) */}
          {/* ============================================================ */}
          {delayedStages.length > 0 && (
            <div className="bg-red-50/70 border-l-4 border-red-600 bg-white p-4 rounded-xl shadow-xs border border-red-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 text-red-700 rounded-xl flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-red-800">
                      DELAYED MILESTONE ALERT ({delayedStages.length})
                    </span>
                    <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Critical Path
                    </span>
                  </div>
                  <div className="space-y-1">
                    {delayedStages.map(s => (
                      <div key={s.id} className="text-xs text-slate-800 leading-relaxed">
                        <strong className="text-red-950 font-bold">Stage {s.stageNumber} ({s.name})</strong>: 
                        <span className="px-1.5 py-0.2 mx-1.5 rounded bg-red-100 text-red-800 font-mono font-bold text-[10px]">
                          Delayed by +{s.delayDays || 28} days
                        </span>
                        <span className="text-slate-700">{s.remarks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStageId(delayedStages[0].id)}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap self-start md:self-center flex-shrink-0"
              >
                <span>Inspect Delayed Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. PROGRESS BAR (SEGMENTED BY STATUS) */}
          {/* ============================================================ */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span>Statutory Lifecycle Completion Bar</span>
                <span className="text-slate-400 font-normal">({stages.length} stages)</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Completed ({stages.filter(s => s.status === 'COMPLETED').length})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>In Progress ({stages.filter(s => s.status === 'IN_PROGRESS').length})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Delayed ({stages.filter(s => s.status === 'DELAYED').length})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span>Not Started ({stages.filter(s => s.status === 'NOT_STARTED').length})</span>
                </span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              {stages.map((stg) => {
                const widthPercent = (1 / stages.length) * 100;
                const color = 
                  stg.status === 'COMPLETED' ? 'bg-emerald-500' :
                  stg.status === 'IN_PROGRESS' ? 'bg-amber-400' :
                  stg.status === 'DELAYED' ? 'bg-red-500' :
                  stg.status === 'BLOCKED' ? 'bg-purple-600' : 'bg-slate-200';

                return (
                  <div
                    key={stg.id}
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`${color} h-full border-r border-white/40 cursor-pointer hover:opacity-80 transition-opacity`}
                    style={{ width: `${widthPercent}%` }}
                    title={`Stage ${stg.stageNumber}: ${stg.name} (${stg.status})`}
                  />
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 5. MILESTONE TRACKER (HORIZONTAL STEPPER) */}
          {/* ============================================================ */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Milestone Stepper (Click Stage to Inspect & Act)</span>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 text-[11px] font-bold">
                {[
                  { id: 'ALL', label: 'All 15' },
                  { id: 'PRE_ACQUISITION', label: 'Pre-Acquisition (1-6)' },
                  { id: 'STATUTORY_NOTIFICATION', label: 'Statutory (7-9)' },
                  { id: 'VALUATION_COMPENSATION', label: 'Valuation & Award (10-12)' },
                  { id: 'POSSESSION_CLOSURE', label: 'Possession & R&R (13-15)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      categoryFilter === cat.id
                        ? 'bg-gov-navy text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper Cards Slider */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2.5">
              {filteredStages.map((stg) => {
                const badge = getStatusBadge(stg.status);
                const isSelected = stg.id === selectedStageId;
                const Icon = badge.icon;

                return (
                  <div
                    key={stg.id}
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-400/30'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-gov-navy text-white text-[10px] font-bold flex items-center justify-center font-mono">
                          {stg.stageNumber}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {stg.name}
                      </h4>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-200/70 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Target:</span>
                      <span className="font-mono font-semibold text-slate-700">{stg.targetDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 6. DETAILED STAGE INSPECTOR & ACTION BOARD */}
          {/* ============================================================ */}
          {selectedStage && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Stage Top Bar */}
              <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy text-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <span>STAGE {selectedStage.stageNumber} OF 15 &bull; {selectedStage.category.replace(/_/g, ' ')}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {selectedStage.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Responsible Authority: <strong className="text-white">{selectedStage.responsibleAuthority}</strong></span>
                  </p>
                </div>

                {/* Status & Risk Indicators */}
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Current Status</div>
                    <div className="flex items-center gap-1.5 mt-0.5 font-black text-xs text-white uppercase">
                      <span className={`w-2.5 h-2.5 rounded-full ${getStatusBadge(selectedStage.status).dot}`} />
                      <span>{selectedStage.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Stage Risk</div>
                    <div className="mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        selectedStage.risk === 'CRITICAL' ? 'bg-rose-600 text-white' :
                        selectedStage.risk === 'HIGH' ? 'bg-red-500 text-white' :
                        selectedStage.risk === 'MEDIUM' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                      }`}>
                        {selectedStage.risk} RISK
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar: 6 Mandatory Workflow Actions */}
              <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Workflow Actions for Stage {selectedStage.stageNumber}:</span>
                </div>

                {/* 6 Actions Requested: Submit, Approve, Reject, Request Clarification, Mark Complete, Upload Evidence */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenAction(selectedStage, 'SUBMIT')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </button>

                  <button
                    onClick={() => handleOpenAction(selectedStage, 'APPROVE')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleOpenAction(selectedStage, 'REJECT')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleOpenAction(selectedStage, 'REQUEST_CLARIFICATION')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Request Clarification</span>
                  </button>

                  <button
                    onClick={() => handleOpenAction(selectedStage, 'MARK_COMPLETE')}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Complete</span>
                  </button>

                  <button
                    onClick={() => handleOpenAction(selectedStage, 'UPLOAD_EVIDENCE')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Evidence</span>
                  </button>
                </div>
              </div>

              {/* Stage Body Grid */}
              <div className="p-5 space-y-6">
                {/* Dates & Authority Schedule Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Start Date</span>
                    <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
                      {selectedStage.startDate}
                    </span>
                    <span className="text-[10px] text-slate-500">Milestone initiation</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Date</span>
                    <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
                      {selectedStage.targetDate}
                    </span>
                    <span className="text-[10px] text-slate-500">Corridor schedule</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completion Date</span>
                    <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
                      {selectedStage.completionDate || 'Pending'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {selectedStage.completionDate ? 'Formally recorded' : 'Awaiting fulfillment'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delay Days</span>
                    <span className={`text-sm font-black font-mono block mt-0.5 ${selectedStage.delayDays ? 'text-red-600' : 'text-emerald-700'}`}>
                      {selectedStage.delayDays ? `+${selectedStage.delayDays} Days` : '0 Days (On Track)'}
                    </span>
                    <span className="text-[10px] text-slate-500">Timeline variance</span>
                  </div>
                </div>

                {/* Remarks & Risk Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Stage Remarks & Current Field Progress:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {selectedStage.remarks}
                    </p>
                    {selectedStage.metrics && (
                      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between font-mono">
                        <span className="text-slate-600 font-semibold">{selectedStage.metrics.metricLabel || 'Progress Metric'}:</span>
                        <strong className="text-gov-navy text-sm">{selectedStage.metrics.completedCount} / {selectedStage.metrics.totalCount} ({selectedStage.metrics.percentage}%)</strong>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
                    <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      Detected Risk Factors & Bottlenecks:
                    </span>
                    <ul className="space-y-1.5 text-rose-950">
                      {selectedStage.riskFactors.map((rf, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">&bull;</span>
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pending Actions (Action Board) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Pending Actions for Stage {selectedStage.stageNumber} ({selectedStage.pendingActions.length})</span>
                    </div>
                  </div>

                  {selectedStage.pendingActions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No pending statutory actions. All milestone conditions satisfied.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedStage.pendingActions.map((act) => (
                        <div
                          key={act.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                            act.status === 'RESOLVED'
                              ? 'bg-slate-50 border-slate-200 opacity-60'
                              : act.priority === 'URGENT'
                              ? 'bg-red-50/70 border-red-200 shadow-xs'
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-xs text-slate-900">{act.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                act.priority === 'URGENT' ? 'bg-red-600 text-white' :
                                act.priority === 'HIGH' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-800'
                              }`}>
                                {act.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{act.description}</p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500">
                              Assigned: <strong className="text-slate-700">{act.assignedAuthority}</strong>
                            </span>
                            {act.status !== 'RESOLVED' ? (
                              <button
                                onClick={() => handleResolveAction(act.id)}
                                className="px-2.5 py-1 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold transition-colors"
                              >
                                Mark Resolved
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Resolved
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents Locker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Stage Certified Documents ({selectedStage.documents.length})</span>
                    </div>

                    <button
                      onClick={() => handleOpenAction(selectedStage, 'UPLOAD_EVIDENCE')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Document</span>
                    </button>
                  </div>

                  {selectedStage.documents.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No documents attached to this stage yet. Click "Upload Evidence" to certify official orders.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="px-4 py-2.5">Document Title</th>
                            <th className="px-3 py-2.5">Reference #</th>
                            <th className="px-3 py-2.5">Format / Size</th>
                            <th className="px-3 py-2.5">Date</th>
                            <th className="px-4 py-2.5">Certified By</th>
                            <th className="px-3 py-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedStage.documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50/70">
                              <td className="px-4 py-2.5 font-bold text-slate-900">{doc.title}</td>
                              <td className="px-3 py-2.5 font-mono text-slate-600">{doc.referenceNo}</td>
                              <td className="px-3 py-2.5 text-slate-500">{doc.fileType} ({doc.fileSize})</td>
                              <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{doc.uploadDate}</td>
                              <td className="px-4 py-2.5 text-slate-700">{doc.uploadedBy}</td>
                              <td className="px-3 py-2.5 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  doc.verifiedStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {doc.verifiedStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* ACTION DIALOG MODAL (CONFIRMING WORKFLOW ACTIONS) */}
      {/* ============================================================ */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-sm uppercase tracking-wide">
                  Execute: {activeActionModal.actionType.replace(/_/g, ' ')}
                </h3>
              </div>
              <button
                onClick={() => setActiveActionModal(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Target Stage</div>
                <div className="font-black text-sm text-slate-900 mt-0.5">
                  Stage {activeActionModal.stage.stageNumber}: {activeActionModal.stage.name}
                </div>
                <div className="text-slate-600 mt-1">
                  Executing Officer: <strong className="text-slate-900">{currentOfficer.name}</strong> ({currentOfficer.role})
                </div>
              </div>

              {activeActionModal.actionType === 'UPLOAD_EVIDENCE' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Evidence Title & Order Name</label>
                  <input
                    type="text"
                    value={modalDocTitle}
                    onChange={(e) => setModalDocTitle(e.target.value)}
                    placeholder="e.g. Section 3G Award Valuation Schedule Annexure-IV"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              )}

              {activeActionModal.actionType === 'REQUEST_CLARIFICATION' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Clarification Subject / Inquiry Point</label>
                  <input
                    type="text"
                    value={modalClarification}
                    onChange={(e) => setModalClarification(e.target.value)}
                    placeholder="e.g. Co-sharer legal heir succession certificate missing for Khasra 516"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Remarks & Authority Order Notes</label>
                <textarea
                  rows={3}
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                  placeholder="Enter statutory justifications, file reference, and decisions..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  This action will update live demo state and append an immutable entry to the SHA-256 government audit ledger.
                </span>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
                disabled={isSubmittingAction}
                className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                {isSubmittingAction ? (
                  <span>Signing & Updating...</span>
                ) : (
                  <span>Confirm & Execute {activeActionModal.actionType.replace(/_/g, ' ')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* AUDIT LOG MODAL (IMMUTABLE WORKFLOW AUDIT TRAIL) */}
      {/* ============================================================ */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Statutory Acquisition Workflow Audit Ledger</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Immutable SHA-256 Hashed Record of All Stage Transitions</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Date & Time</th>
                      <th className="px-4 py-2.5">Stage</th>
                      <th className="px-3 py-2.5">Action</th>
                      <th className="px-4 py-2.5">Officer (Role)</th>
                      <th className="px-3 py-2.5">Transition</th>
                      <th className="px-4 py-2.5">Remarks</th>
                      <th className="px-3 py-2.5 text-right font-mono">Seal Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-2.5 whitespace-nowrap font-mono text-[11px] text-slate-600">{log.timestamp}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900">Stage {log.stageId}: {log.stageName}</td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 font-mono">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-700">
                          <div>{log.actorName}</div>
                          <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-[10px]">
                          <span className="text-slate-400">{log.previousStatus}</span>
                          <span className="mx-1">&rarr;</span>
                          <span className="font-bold text-emerald-700">{log.newStatus}</span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 text-[11px] max-w-xs truncate" title={log.remarks}>
                          {log.remarks}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-[10px] text-slate-400">
                          <code>{log.digitalSealHash}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">{auditLog.length} compliance entries recorded</span>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-1.5 bg-gov-navy text-white rounded-lg font-bold"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
