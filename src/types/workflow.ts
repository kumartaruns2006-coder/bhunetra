// Types for PART 6: END-TO-END ACQUISITION WORKFLOW

export type WorkflowStageStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DELAYED'
  | 'BLOCKED';

export type WorkflowStageRisk = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface WorkflowDocument {
  id: string;
  title: string;
  referenceNo: string;
  fileType: 'PDF' | 'GEOJSON' | 'XLSX' | 'IMAGE';
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  verifiedStatus: 'VERIFIED' | 'PENDING' | 'DISCREPANCY';
  downloadUrl?: string;
}

export interface WorkflowPendingAction {
  id: string;
  title: string;
  description: string;
  assignedAuthority: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  actionKey: 'REVIEW' | 'INSPECTION' | 'HEARING' | 'SANCTION' | 'DISBURSE' | 'EVICTION' | 'MUTATION';
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  countMetric?: string; // e.g. "225 pending"
}

export interface WorkflowStage {
  id: number; // 1 to 15
  stageNumber: number; // 1 to 15
  name: string; // e.g. "Proposal Submission", "Digital Scrutiny", etc.
  shortCode: string;
  category: 'PRE_ACQUISITION' | 'STATUTORY_NOTIFICATION' | 'VALUATION_COMPENSATION' | 'POSSESSION_CLOSURE';
  status: WorkflowStageStatus;
  startDate: string; // Synthetic demo date (e.g. "2024-01-15")
  targetDate: string; // Synthetic demo date (e.g. "2024-03-31")
  completionDate?: string; // Synthetic demo date if completed
  delayDays?: number; // Days delayed if status is DELAYED
  responsibleAuthority: string; // e.g. "NHAI PIU Patna", "CALA / District Collector"
  documents: WorkflowDocument[];
  pendingActions: WorkflowPendingAction[];
  remarks: string;
  risk: WorkflowStageRisk;
  riskFactors: string[];
  metrics?: {
    completedCount?: number;
    pendingCount?: number;
    totalCount?: number;
    percentage?: number;
    metricLabel?: string;
  };
}

export type WorkflowActionType = 
  | 'SUBMIT'
  | 'APPROVE'
  | 'REJECT'
  | 'REQUEST_CLARIFICATION'
  | 'MARK_COMPLETE'
  | 'UPLOAD_EVIDENCE';

export interface WorkflowActionPayload {
  actionType: WorkflowActionType;
  actorName: string;
  actorRole: string;
  remarks: string;
  newStatus?: WorkflowStageStatus;
  documentTitle?: string;
  fileReference?: string;
  clarificationQuery?: string;
}

export interface WorkflowAuditEvent {
  id: string;
  timestamp: string;
  stageId: number;
  stageName: string;
  action: WorkflowActionType;
  actorName: string;
  actorRole: string;
  previousStatus: WorkflowStageStatus;
  newStatus: WorkflowStageStatus;
  remarks: string;
  digitalSealHash: string;
}

export interface WorkflowProjectSummary {
  projectId: string;
  totalStages: number;
  completedStages: number;
  overallPercentage: number;
  delayedStagesCount: number;
  blockedStagesCount: number;
  
  // High-level milestone metrics requested by user
  compensationCompletedCount: number;
  compensationPendingCount: number;
  rrCompletedCount: number;
  rrPendingCount: number;
  possessionSecuredPercentage: number;
}
