export type ProposalStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_SCRUTINY'
  | 'CLARIFICATION_REQUIRED'
  | 'APPROVED'
  | 'REJECTED';

export type ScrutinyCheckStatus = 'PASS' | 'FAIL' | 'NEEDS_CLARIFICATION' | 'PENDING';

export interface ScrutinyChecklistItem {
  id: string;
  criterionKey: 'PROJECT_INFO' | 'LAND_REQUIREMENT' | 'DOCUMENTS' | 'GIS_BOUNDARY' | 'REQUIRED_FIELDS';
  title: string;
  description: string;
  status: ScrutinyCheckStatus;
  remarks: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type RoutingStageKey = 
  | 'SUBMISSION'
  | 'DISTRICT_REVIEW'
  | 'STATE_REVIEW'
  | 'CENTRAL_AUTHORITY'
  | 'FINAL_APPROVAL';

export interface ApprovalStageItem {
  stageKey: RoutingStageKey;
  stageTitle: string;
  level: 'SUBMITTER' | 'DISTRICT' | 'STATE' | 'CENTRAL' | 'APPROVAL';
  officerName: string;
  officerDesignation: string;
  jurisdiction: string;
  date: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION';
  remarks: string;
  signedDigitalHash?: string;
}

export interface ProposalDocumentItem {
  id: string;
  type: 'PROJECT_PROPOSAL' | 'LAND_REQUIREMENT_DOC' | 'PROJECT_MAP' | 'SUPPORTING_DOC';
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  fileUrl?: string;
  verified: boolean;
}

export interface ProposalMilestoneItem {
  id: string;
  title: string;
  targetDate: string;
  stageRef: string;
}

export interface ProposalAuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  previousStatus?: ProposalStatus;
  newStatus?: ProposalStatus;
  remarks: string;
  digitalSealHash?: string;
}

export interface ProjectProposal {
  id: string; // e.g. PRJ-2026-001
  code: string; // e.g. NHAI-BR-PRR-PH2
  name: string;
  department: string;
  projectType: 'EXPRESSWAY' | 'NATIONAL_HIGHWAY' | 'FREIGHT_CORRIDOR' | 'PORT_CONNECTIVITY' | 'RING_ROAD' | 'ECONOMIC_CORRIDOR';
  state: string;
  district: string;
  subDistricts: string[];
  implementingAgency: string;
  description: string;

  // Land Requirements
  totalLandRequiredAcres: number;
  estimatedParcelsCount: number;
  landType: 'AGRICULTURAL' | 'COMMERCIAL' | 'RESIDENTIAL' | 'FOREST' | 'GOVERNMENT_REVENUE' | 'MIXED';
  projectBoundaryGeoJsonSnippet?: string;
  corridorLengthKm: number;
  rightOfWayWidthM: number;

  // Timeline
  proposalDate: string;
  targetDate: string;
  milestones: ProposalMilestoneItem[];

  // Documents
  documents: ProposalDocumentItem[];

  // Scrutiny
  scrutinyChecklist: ScrutinyChecklistItem[];
  scrutinyRemarks: string;
  scrutinyCompletedBy?: string;
  scrutinyCompletedAt?: string;

  // Approval Routing
  approvalStages: ApprovalStageItem[];
  currentApprovalStage: RoutingStageKey;

  // Lifecycle Status & Compliance
  status: ProposalStatus;
  progressPercent: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedCostCr: number;

  // Activity Log
  auditTrail: ProposalAuditLogEntry[];
}

export interface ProposalFiltersState {
  state: string;
  district: string;
  department: string;
  projectType: string;
  status: string;
  risk: string;
  searchQuery: string;
}
