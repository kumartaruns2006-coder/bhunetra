import { 
  WorkflowStage, 
  WorkflowActionPayload, 
  WorkflowAuditEvent, 
  WorkflowProjectSummary,
  WorkflowDocument,
  WorkflowStageStatus
} from '../types/workflow';
import { mockWorkflowStages } from '../data/mockWorkflowStages';

const STORAGE_KEY = 'BHUNETRA_WORKFLOW_CACHE_V6';
const AUDIT_STORAGE_KEY = 'BHUNETRA_WORKFLOW_AUDIT_CACHE_V6';

class WorkflowService {
  private stages: WorkflowStage[] = [];
  private auditLog: WorkflowAuditEvent[] = [];
  private subscribers: ((stages: WorkflowStage[]) => void)[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      // Proactively purge obsolete cache keys from previous runs
      const legacyKeys = [
        'BHUNETRA_WORKFLOW_CACHE',
        'BHUNETRA_WORKFLOW_CACHE_V1',
        'BHUNETRA_WORKFLOW_CACHE_V2',
        'BHUNETRA_WORKFLOW_CACHE_V3',
        'BHUNETRA_WORKFLOW_CACHE_V4',
        'BHUNETRA_WORKFLOW_CACHE_V5',
        'BHUNETRA_WORKFLOW_AUDIT_CACHE_V4',
        'BHUNETRA_WORKFLOW_AUDIT_CACHE_V5'
      ];
      legacyKeys.forEach(k => {
        try { localStorage.removeItem(k); } catch (_) {}
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.stages = parsed;
        } else {
          this.stages = JSON.parse(JSON.stringify(mockWorkflowStages));
          this.saveData();
        }
      } else {
        this.stages = JSON.parse(JSON.stringify(mockWorkflowStages));
        this.saveData();
      }

      const storedAudit = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (storedAudit) {
        this.auditLog = JSON.parse(storedAudit);
      } else {
        this.initDefaultAuditLog();
      }
    } catch {
      this.stages = JSON.parse(JSON.stringify(mockWorkflowStages));
      this.initDefaultAuditLog();
    }
  }

  private initDefaultAuditLog() {
    this.auditLog = [
      {
        id: 'wfa-1',
        timestamp: '2024-02-10 11:30 AM',
        stageId: 1,
        stageName: 'Proposal Submission',
        action: 'APPROVE',
        actorName: 'Project Director (NHAI PIU Patna)',
        actorRole: 'NHAI_PD',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'COMPLETED',
        remarks: 'DPR Alignment and 60m RoW schedule formally verified and approved.',
        digitalSealHash: '0x4f8a...92b1'
      },
      {
        id: 'wfa-2',
        timestamp: '2024-03-05 04:15 PM',
        stageId: 2,
        stageName: 'Digital Scrutiny',
        action: 'MARK_COMPLETE',
        actorName: 'State Revenue Automated System',
        actorRole: 'ADMIN',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'COMPLETED',
        remarks: 'Automated cadastral validation completed across all 1,250 plots.',
        digitalSealHash: '0x9a12...33cd'
      },
      {
        id: 'wfa-3',
        timestamp: '2024-04-02 02:00 PM',
        stageId: 3,
        stageName: 'Approval',
        action: 'APPROVE',
        actorName: 'Joint Secretary (MoRTH New Delhi)',
        actorRole: 'CENTRAL_AUTHORITY',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'COMPLETED',
        remarks: 'Administrative sanction granted for ₹540 Cr statutory budget.',
        digitalSealHash: '0x66de...77fa'
      },
      {
        id: 'wfa-4',
        timestamp: '2024-10-10 09:00 AM',
        stageId: 7,
        stageName: 'Preliminary Notification',
        action: 'UPLOAD_EVIDENCE',
        actorName: 'MoRTH Gazette System',
        actorRole: 'CENTRAL_AUTHORITY',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'COMPLETED',
        remarks: 'Section 3A Gazette Extraordinary S.O. 1422(E) certified and uploaded.',
        digitalSealHash: '0x1b44...ee89'
      },
      {
        id: 'wfa-5',
        timestamp: '2025-01-20 12:45 PM',
        stageId: 8,
        stageName: 'Objection / Hearing',
        action: 'REQUEST_CLARIFICATION',
        actorName: 'CALA Patna',
        actorRole: 'CALA',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'DELAYED',
        remarks: 'Civil Court interim injunction on Khasra 516 flagged. Stay vacation reply requested.',
        digitalSealHash: '0x7c99...22ea'
      }
    ];
    this.saveAuditData();
  }

  private saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stages));
    } catch (e) {
      console.warn('Failed to save workflow stages to localStorage', e);
    }
    this.notifySubscribers();
  }

  private saveAuditData() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.auditLog));
    } catch (e) {
      console.warn('Failed to save workflow audit log to localStorage', e);
    }
  }

  public subscribe(callback: (stages: WorkflowStage[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => cb([...this.stages]));
  }

  /**
   * Root-cause automated delayed stage calculation engine
   * Checks targetDate against referenceDate and updates status, delayDays, risk, and escalation
   */
  public static computeStageWithDelay(stage: WorkflowStage, referenceDateStr?: string): WorkflowStage {
    if (stage.status === 'COMPLETED' || stage.status === 'NOT_STARTED') {
      return stage;
    }

    // If stage is already explicitly marked DELAYED or BLOCKED in curated data (e.g. Stage 8)
    if (stage.status === 'DELAYED' || stage.status === 'BLOCKED') {
      const delayDays = stage.delayDays || 28;
      const isCritical = delayDays > 30 || stage.risk === 'CRITICAL';
      const updatedRisk = isCritical ? 'CRITICAL' : 'HIGH';
      return {
        ...stage,
        delayDays,
        risk: updatedRisk
      };
    }

    // Downstream milestones (Stages 9 to 15) are planned forward in 2026/2027 and should not be marked DELAYED
    if (stage.id > 8) {
      return stage;
    }

    const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
    const target = new Date(stage.targetDate);

    // If target date is past and stage is still in progress
    if (!isNaN(target.getTime()) && target.getTime() < refDate.getTime()) {
      const diffTime = Math.abs(refDate.getTime() - target.getTime());
      const rawDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const diffDays = stage.delayDays ? stage.delayDays : Math.min(rawDays, 28);

      const isCritical = diffDays > 30 || stage.risk === 'CRITICAL';
      const updatedRisk = isCritical ? 'CRITICAL' : 'HIGH';

      const delayNotice = `Statutory SLA breached by ${diffDays} days beyond target date (${stage.targetDate}). Escalated to ${stage.responsibleAuthority}.`;
      const riskFactors = stage.riskFactors.includes(delayNotice)
        ? stage.riskFactors
        : [delayNotice, ...stage.riskFactors.filter(rf => !rf.startsWith('Statutory SLA breached'))];

      return {
        ...stage,
        status: 'DELAYED',
        delayDays: diffDays,
        risk: updatedRisk,
        riskFactors
      };
    }

    return stage;
  }

  public async getStages(): Promise<WorkflowStage[]> {
    return this.stages.map(s => WorkflowService.computeStageWithDelay(JSON.parse(JSON.stringify(s))));
  }

  public async getStageById(stageId: number): Promise<WorkflowStage | null> {
    const found = this.stages.find(s => s.id === stageId);
    return found ? WorkflowService.computeStageWithDelay(JSON.parse(JSON.stringify(found))) : null;
  }

  public async getSummary(projectId?: string): Promise<WorkflowProjectSummary> {
    const computedStages = this.stages.map(s => WorkflowService.computeStageWithDelay(s));
    const totalStages = computedStages.length;
    const completedStages = computedStages.filter(s => s.status === 'COMPLETED').length;
    const delayedStagesCount = computedStages.filter(s => s.status === 'DELAYED').length;
    const blockedStagesCount = computedStages.filter(s => s.status === 'BLOCKED').length;

    // Weighted percentage
    const overallPercentage = Math.round((completedStages / totalStages) * 100);

    // Retrieve metrics from designated stages (Stage 11: Compensation, Stage 13: R&R, Stage 14: Possession)
    const compStage = computedStages.find(s => s.id === 11);
    const rrStage = computedStages.find(s => s.id === 13);
    const posStage = computedStages.find(s => s.id === 14);

    return {
      projectId: projectId || 'WB-KOL-KONA-2026',
      totalStages,
      completedStages,
      overallPercentage,
      delayedStagesCount,
      blockedStagesCount,
      compensationCompletedCount: compStage?.metrics?.completedCount || 1025,
      compensationPendingCount: compStage?.metrics?.pendingCount || 225,
      rrCompletedCount: rrStage?.metrics?.completedCount || 820,
      rrPendingCount: rrStage?.metrics?.pendingCount || 160,
      possessionSecuredPercentage: posStage?.metrics?.percentage || 72
    };
  }

  public async getAuditHistory(): Promise<WorkflowAuditEvent[]> {
    return [...this.auditLog];
  }

  // -------------------------------------------------------------
  // CORE WORKFLOW ACTIONS (SUBMIT, APPROVE, REJECT, REQUEST CLARIFICATION, MARK COMPLETE, UPLOAD EVIDENCE)
  // -------------------------------------------------------------
  public async performWorkflowAction(
    stageId: number, 
    payload: WorkflowActionPayload
  ): Promise<{ updatedStage: WorkflowStage; auditEvent: WorkflowAuditEvent }> {
    const index = this.stages.findIndex(s => s.id === stageId);
    if (index === -1) throw new Error(`Stage ${stageId} not found`);

    const stage = { ...this.stages[index] };
    const previousStatus = stage.status;
    let newStatus: WorkflowStageStatus = stage.status;

    const todayDate = new Date().toISOString().split('T')[0];

    switch (payload.actionType) {
      case 'SUBMIT': {
        newStatus = 'IN_PROGRESS';
        stage.status = newStatus;
        stage.remarks = payload.remarks || `Stage submittal logged by ${payload.actorName} (${payload.actorRole}).`;
        break;
      }

      case 'APPROVE': {
        newStatus = 'COMPLETED';
        stage.status = newStatus;
        stage.completionDate = todayDate;
        stage.remarks = payload.remarks || `Statutory approval granted by ${payload.actorName} (${payload.actorRole}).`;
        // Unlock next stage if it was NOT_STARTED
        const nextIndex = this.stages.findIndex(s => s.id === stageId + 1);
        if (nextIndex !== -1 && this.stages[nextIndex].status === 'NOT_STARTED') {
          this.stages[nextIndex] = {
            ...this.stages[nextIndex],
            status: 'IN_PROGRESS',
            startDate: todayDate
          };
        }
        break;
      }

      case 'REJECT': {
        newStatus = 'BLOCKED';
        stage.status = newStatus;
        stage.risk = 'CRITICAL';
        stage.remarks = payload.remarks || `Stage submittal rejected by ${payload.actorName}. Rectification required.`;
        if (!stage.riskFactors.includes(payload.remarks)) {
          stage.riskFactors.unshift(payload.remarks);
        }
        break;
      }

      case 'REQUEST_CLARIFICATION': {
        newStatus = stage.status === 'COMPLETED' ? 'IN_PROGRESS' : stage.status;
        stage.status = newStatus;
        stage.remarks = `Clarification requested: ${payload.clarificationQuery || payload.remarks}`;
        // Append a pending action for clarification
        const newAction = {
          id: `act-clar-${Date.now()}`,
          title: `Clarification Required: ${payload.clarificationQuery || 'Additional Documentation Required'}`,
          description: payload.remarks,
          assignedAuthority: payload.actorName,
          priority: 'URGENT' as const,
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          actionKey: 'REVIEW' as const,
          status: 'OPEN' as const,
          countMetric: '1 clarification active'
        };
        stage.pendingActions = [newAction, ...stage.pendingActions];
        break;
      }

      case 'MARK_COMPLETE': {
        newStatus = 'COMPLETED';
        stage.status = newStatus;
        stage.completionDate = todayDate;
        stage.remarks = payload.remarks || `Stage marked complete by ${payload.actorName}. Milestones satisfied.`;
        // Unlock next stage if it was NOT_STARTED
        const nextIndex = this.stages.findIndex(s => s.id === stageId + 1);
        if (nextIndex !== -1 && this.stages[nextIndex].status === 'NOT_STARTED') {
          this.stages[nextIndex] = {
            ...this.stages[nextIndex],
            status: 'IN_PROGRESS',
            startDate: todayDate
          };
        }
        break;
      }

      case 'UPLOAD_EVIDENCE': {
        const newDoc: WorkflowDocument = {
          id: `wfd-${stageId}-${Date.now()}`,
          title: payload.documentTitle || 'Statutory Compliance Evidence',
          referenceNo: payload.fileReference || `EVD-2026-STG${stageId}-${Math.floor(100 + Math.random() * 900)}`,
          fileType: 'PDF',
          fileSize: '3.4 MB',
          uploadedBy: `${payload.actorName} (${payload.actorRole})`,
          uploadDate: todayDate,
          verifiedStatus: 'VERIFIED'
        };
        stage.documents = [newDoc, ...stage.documents];
        stage.remarks = `New verified evidence uploaded: "${newDoc.title}" (${newDoc.referenceNo}).`;
        break;
      }
    }

    if (payload.newStatus) {
      newStatus = payload.newStatus;
      stage.status = newStatus;
    }

    this.stages[index] = stage;

    // Create immutable audit log entry
    const auditEvent: WorkflowAuditEvent = {
      id: `wfa-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      stageId: stage.id,
      stageName: stage.name,
      action: payload.actionType,
      actorName: payload.actorName,
      actorRole: payload.actorRole,
      previousStatus,
      newStatus,
      remarks: payload.remarks || `Workflow action [${payload.actionType}] performed on stage ${stage.name}.`,
      digitalSealHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    };

    this.auditLog.unshift(auditEvent);

    this.saveData();
    this.saveAuditData();

    return { updatedStage: stage, auditEvent };
  }

  public async resolvePendingAction(stageId: number, actionId: string): Promise<WorkflowStage> {
    const index = this.stages.findIndex(s => s.id === stageId);
    if (index === -1) throw new Error(`Stage ${stageId} not found`);

    const stage = { ...this.stages[index] };
    stage.pendingActions = stage.pendingActions.map(act => {
      if (act.id === actionId) {
        return { ...act, status: 'RESOLVED' as const };
      }
      return act;
    });

    this.stages[index] = stage;
    this.saveData();
    return stage;
  }

  public resetToDefault(): void {
    this.stages = JSON.parse(JSON.stringify(mockWorkflowStages));
    this.initDefaultAuditLog();
    this.saveData();
  }
}

export const workflowService = new WorkflowService();
