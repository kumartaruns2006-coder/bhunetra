// Types for PART 15: Scalability & Configurable System Architecture

export interface StateConfig {
  code: string;              // e.g. "BR", "UP", "MH", "GJ", "HR", "TN"
  name: string;              // e.g. "Bihar", "Uttar Pradesh"
  hindiName: string;         // e.g. "बिहार", "उत्तर प्रदेश"
  lgdCode: string;           // Local Government Directory code (e.g. "10", "09")
  capital: string;           // e.g. "Patna", "Lucknow"
  districtsCount: number;    // e.g. 38, 75
  active: boolean;
  isDemoDataset?: boolean;   // Bihar is marked as true; others ready for production
  isPrimaryDemo?: boolean;   // West Bengal is marked as true for Kolkata primary demo
}

export interface DistrictConfig {
  id: string;
  code: string;              // e.g. "PATNA", "SARAN", "VARANASI"
  name: string;              // e.g. "Patna", "Varanasi"
  stateCode: string;         // e.g. "BR", "UP"
  revenueDivisions: string[];// e.g. ["Patna Sadar", "Danapur", "Bihta"]
  active: boolean;
}

export interface DepartmentConfig {
  id: string;
  code: string;              // e.g. "MORTH", "NHAI", "RAILWAYS"
  name: string;              // e.g. "Ministry of Road Transport & Highways"
  ministry: string;          // e.g. "Govt of India", "State Govt"
  category: 'CENTRAL' | 'STATE' | 'SPV';
  active: boolean;
}

export interface ProjectTypeConfig {
  id: string;
  code: string;              // e.g. "EXP-GREEN", "RING-ROAD", "EC-CORRIDOR"
  name: string;              // e.g. "Greenfield National Expressway"
  standardRowWidthM: number; // e.g. 70
  defaultSolatiumFactor: number; // e.g. 1.0 or 1.25
  statutoryAct: 'NH_ACT_1956' | 'RFCTLARR_2013' | 'RAILWAYS_ACT';
  active: boolean;
}

export interface WorkflowStageConfig {
  id: number;                // 1 to 15
  stageNumber: number;
  name: string;              // e.g. "Proposal Submission", "SIA", "Declaration"
  statutoryAct: string;      // e.g. "NH Act Section 3A"
  standardDurationDays: number; // Configurable duration (e.g. 45 days)
  responsibleAuthority: string; // e.g. "CALA", "MoRTH"
  canBypass: boolean;        // e.g. false for statutory mandatory stages
}

export interface StatusConfig {
  key: string;               // e.g. "ON_TRACK", "DELAYED", "CRITICAL_HOLD"
  label: string;             // e.g. "On Track", "Delayed", "Critical Hold"
  color: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  category: 'PROJECT' | 'PARCEL' | 'COMPENSATION' | 'WORKFLOW';
  isTerminal: boolean;
}

export interface ValidationRuleConfig {
  id: string;
  code: string;              // e.g. "VAL-AREA-01"
  name: string;
  description: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  enabled: boolean;
}

export interface NotificationTemplateConfig {
  id: string;
  code: string;              // e.g. "SMS_COMPENSATION_DISBURSED"
  channel: 'SMS' | 'EMAIL' | 'IN_APP';
  title: string;
  templateText: string;      // Placeholders: {PROJECT_NAME}, {PARCEL_KHASRA}, {AMOUNT_CR}, {RECIPIENT_NAME}
  active: boolean;
}

export interface SystemConfigState {
  states: StateConfig[];
  districts: DistrictConfig[];
  departments: DepartmentConfig[];
  projectTypes: ProjectTypeConfig[];
  workflowStages: WorkflowStageConfig[];
  statuses: StatusConfig[];
  validationRules: ValidationRuleConfig[];
  notificationTemplates: NotificationTemplateConfig[];
}
