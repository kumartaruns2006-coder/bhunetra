// Configuration Service for PART 15: Scalability & Configurable Data Registries

import {
  StateConfig,
  DistrictConfig,
  DepartmentConfig,
  ProjectTypeConfig,
  WorkflowStageConfig,
  StatusConfig,
  ValidationRuleConfig,
  NotificationTemplateConfig,
  SystemConfigState
} from '../types/config';
import { ALL_INDIA_STATES_AND_UTS } from '../data/allIndiaData';

const CONFIG_STORAGE_KEY = 'BHUNETRA_CONFIG_REGISTRY';

const DEFAULT_STATES: StateConfig[] = ALL_INDIA_STATES_AND_UTS.map(s => ({
  code: s.code,
  name: s.name,
  hindiName: s.hindiName,
  lgdCode: s.lgdCode,
  capital: s.capital,
  districtsCount: s.districtsCount,
  active: true,
  isPrimaryDemo: s.isPrimaryDemo,
  isDemoDataset: s.isDemoDataset
}));

const DEFAULT_DISTRICTS: DistrictConfig[] = ALL_INDIA_STATES_AND_UTS.flatMap(s =>
  s.districts.map((dist, idx) => ({
    id: `dst-${s.code.toLowerCase()}-${String(idx + 1).padStart(2, '0')}`,
    code: dist.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 10),
    name: dist,
    stateCode: s.code,
    revenueDivisions: [`${dist} Sadar`, `${dist} North`, `${dist} South`],
    active: true
  }))
);

const DEFAULT_DEPARTMENTS: DepartmentConfig[] = [
  { id: 'dept-01', code: 'MORTH', name: 'Ministry of Road Transport & Highways', ministry: 'Govt. of India', category: 'CENTRAL', active: true },
  { id: 'dept-02', code: 'NHAI', name: 'National Highways Authority of India', ministry: 'MoRTH', category: 'SPV', active: true },
  { id: 'dept-03', code: 'RAILWAYS', name: 'Ministry of Railways / DFCCIL', ministry: 'Govt. of India', category: 'CENTRAL', active: true },
  { id: 'dept-04', code: 'REVENUE_STATE', name: 'Revenue & Land Reforms Department', ministry: 'State Govt', category: 'STATE', active: true },
  { id: 'dept-05', code: 'STATE_PWD', name: 'Public Works Department (Highways)', ministry: 'State Govt', category: 'STATE', active: true },
  { id: 'dept-06', code: 'FOREST_ENV', name: 'Forest & Climate Change Department', ministry: 'State Govt', category: 'STATE', active: true }
];

const DEFAULT_PROJECT_TYPES: ProjectTypeConfig[] = [
  { id: 'pt-01', code: 'EXP-GREEN', name: 'Greenfield National Expressway', standardRowWidthM: 70, defaultSolatiumFactor: 1.0, statutoryAct: 'NH_ACT_1956', active: true },
  { id: 'pt-02', code: 'RING-ROAD', name: 'Metropolitan Ring Road Bypass', standardRowWidthM: 60, defaultSolatiumFactor: 1.25, statutoryAct: 'RFCTLARR_2013', active: true },
  { id: 'pt-03', code: 'EC-CORRIDOR', name: 'Bharatmala Economic Corridor', standardRowWidthM: 60, defaultSolatiumFactor: 1.0, statutoryAct: 'NH_ACT_1956', active: true },
  { id: 'pt-04', code: 'DFC-LINK', name: 'Dedicated Freight Corridor Rail Link', standardRowWidthM: 50, defaultSolatiumFactor: 1.0, statutoryAct: 'RAILWAYS_ACT', active: true }
];

// All 15 statutory acquisition workflow stages stored as configurable data
const DEFAULT_WORKFLOW_STAGES: WorkflowStageConfig[] = [
  { id: 1, stageNumber: 1, name: 'Proposal Submission', statutoryAct: 'Internal DPR / Cabinet In-Principle', standardDurationDays: 30, responsibleAuthority: 'Project Implementing Agency (NHAI)', canBypass: false },
  { id: 2, stageNumber: 2, name: 'Digital Scrutiny', statutoryAct: 'LGD / Cadastral Boundary Audit', standardDurationDays: 21, responsibleAuthority: 'State Revenue / MoRTH Scrutiny Wing', canBypass: false },
  { id: 3, stageNumber: 3, name: 'Approval & Sanction', statutoryAct: 'Sanction Order / In-Principle', standardDurationDays: 30, responsibleAuthority: 'Central Ministry / State Cabinet', canBypass: false },
  { id: 4, stageNumber: 4, name: 'Land Identification', statutoryAct: 'Khatiyan / Jamabandi Register II', standardDurationDays: 45, responsibleAuthority: 'CALA / District Revenue Officers', canBypass: false },
  { id: 5, stageNumber: 5, name: 'GIS Mapping & Demarcation', statutoryAct: 'DGPS / Drone RTK Survey', standardDurationDays: 60, responsibleAuthority: 'District Amin & NHAI Tech Team', canBypass: false },
  { id: 6, stageNumber: 6, name: 'Social Impact Assessment (SIA)', statutoryAct: 'RFCTLARR Act 2013 Section 4', standardDurationDays: 90, responsibleAuthority: 'Independent SIA Agency / Collector', canBypass: true },
  { id: 7, stageNumber: 7, name: 'Preliminary Notification', statutoryAct: 'NH Act Sec 3A / RFCTLARR Sec 11', standardDurationDays: 30, responsibleAuthority: 'MoRTH / Gazette of India', canBypass: false },
  { id: 8, stageNumber: 8, name: 'Objection / Hearing', statutoryAct: 'NH Act Sec 3C / RFCTLARR Sec 15', standardDurationDays: 45, responsibleAuthority: 'Competent Authority (CALA / SDM)', canBypass: false },
  { id: 9, stageNumber: 9, name: 'Declaration Publication', statutoryAct: 'NH Act Sec 3D / RFCTLARR Sec 19', standardDurationDays: 30, responsibleAuthority: 'Gazette of India / MoRTH', canBypass: false },
  { id: 10, stageNumber: 10, name: 'Award Determination', statutoryAct: 'NH Act Sec 3G / RFCTLARR Sec 23', standardDurationDays: 60, responsibleAuthority: 'CALA / Additional Collector', canBypass: false },
  { id: 11, stageNumber: 11, name: 'Compensation Assessment', statutoryAct: 'RFCTLARR First Schedule (Solatium 100%)', standardDurationDays: 30, responsibleAuthority: 'CALA Valuation Committee', canBypass: false },
  { id: 12, stageNumber: 12, name: 'Compensation Disbursement', statutoryAct: 'NH Act Sec 3H / PFMS Escrow DBT', standardDurationDays: 60, responsibleAuthority: 'CALA & SBI Escrow Portal', canBypass: false },
  { id: 13, stageNumber: 13, name: 'Resettlement & Rehabilitation (R&R)', statutoryAct: 'RFCTLARR Second & Third Schedule', standardDurationDays: 90, responsibleAuthority: 'R&R Commissioner / District Collector', canBypass: false },
  { id: 14, stageNumber: 14, name: 'Physical Possession Handover', statutoryAct: 'NH Act Sec 3E / RFCTLARR Sec 38', standardDurationDays: 45, responsibleAuthority: 'District Police & Revenue Collector', canBypass: false },
  { id: 15, stageNumber: 15, name: 'Project Closure & Mutation', statutoryAct: 'State Land Records Register Update', standardDurationDays: 30, responsibleAuthority: 'Circle Officer & NHAI PIU', canBypass: false }
];

const DEFAULT_STATUSES: StatusConfig[] = [
  { key: 'ON_TRACK', label: 'On Track', color: 'success', category: 'PROJECT', isTerminal: false },
  { key: 'POSSESSION_IN_PROGRESS', label: 'Possession Active', color: 'info', category: 'PROJECT', isTerminal: false },
  { key: 'VALUATION_PENDING', label: 'Valuation Pending', color: 'warning', category: 'PROJECT', isTerminal: false },
  { key: 'DELAYED', label: 'Delayed', color: 'danger', category: 'PROJECT', isTerminal: false },
  { key: 'CRITICAL_HOLD', label: 'Critical Hold', color: 'danger', category: 'PROJECT', isTerminal: false },
  { key: 'COMPLETED', label: 'Completed', color: 'success', category: 'WORKFLOW', isTerminal: true },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'info', category: 'WORKFLOW', isTerminal: false },
  { key: 'BLOCKED', label: 'Blocked', color: 'danger', category: 'WORKFLOW', isTerminal: false }
];

const DEFAULT_RULES: ValidationRuleConfig[] = [
  { id: 'rule-01', code: 'REQ_FIELDS', name: 'Mandatory Cadastral Fields', description: 'Asserts state, district, village, khasraNo, and area are present', severity: 'ERROR', enabled: true },
  { id: 'rule-02', code: 'AREA_BOUNDS', name: 'Area Bounds & Discrepancies', description: 'Detects zero, negative, or excessive acquisition acreage vs plot area', severity: 'ERROR', enabled: true },
  { id: 'rule-03', code: 'DUPLICATE_PARCEL', name: 'Duplicate Parcel Identification', description: 'Flags duplicate khasra primary keys across the corridor alignment', severity: 'ERROR', enabled: true },
  { id: 'rule-04', code: 'PROJECT_LINKAGE', name: 'Project Alignment Linkage', description: 'Ensures every parcel references a valid sanctioned corridor ID', severity: 'WARNING', enabled: true },
  { id: 'rule-05', code: 'COORDINATES_CHECK', name: 'DGPS Coordinates Polygon Verification', description: 'Validates polygon array >= 3 points and coordinate boundaries', severity: 'ERROR', enabled: true },
  { id: 'rule-06', code: 'DOCUMENT_LINKAGE', name: 'Statutory Gazette Deed Linkage', description: 'Asserts Gazette 3A or 3D publication is linked to the plot record', severity: 'WARNING', enabled: true },
  { id: 'rule-07', code: 'SOLATIUM_CHECK', name: 'RFCTLARR 100% Solatium Assertion', description: 'Confirms mandatory solatium is applied on determined market value', severity: 'ERROR', enabled: true },
  { id: 'rule-08', code: 'ESCROW_FUNDING', name: 'CALA Escrow Balance Threshold', description: 'Alerts when designated escrow balance drops below 15% threshold', severity: 'WARNING', enabled: true }
];

const DEFAULT_NOTIFICATION_TEMPLATES: NotificationTemplateConfig[] = [
  {
    id: 'tmpl-sms-01',
    code: 'SMS_COMP_DISBURSED',
    channel: 'SMS',
    title: 'Compensation DBT Disbursed',
    templateText: 'MoRTH BhuNetra: Dear {RECIPIENT_NAME}, compensation of Rs {AMOUNT_CR} Cr for Khasra {PARCEL_KHASRA} under project {PROJECT_NAME} has been credited to your bank account via PFMS.',
    active: true
  },
  {
    id: 'tmpl-sms-02',
    code: 'SMS_HEARING_SCHEDULED',
    channel: 'SMS',
    title: 'Section 3C Hearing Notice',
    templateText: 'CALA Notice: Objections hearing for Khasra {PARCEL_KHASRA} scheduled on {HEARING_DATE} at CALA Office {DISTRICT}. Please bring original title documents.',
    active: true
  },
  {
    id: 'tmpl-email-01',
    code: 'EMAIL_GAZETTE_PUBLISHED',
    channel: 'EMAIL',
    title: 'Statutory Gazette Published',
    templateText: 'Formal notification: Central Extraordinary Gazette for project {PROJECT_NAME} covering {VILLAGES_COUNT} villages has been published under {STATUTORY_SECTION}. Access digital copy on BhuNetra.',
    active: true
  },
  {
    id: 'tmpl-inapp-01',
    code: 'INAPP_CRITICAL_DELAY',
    channel: 'IN_APP',
    title: 'Corridor Critical Delay Alert',
    templateText: 'High Risk Alert: Project {PROJECT_NAME} is projected to suffer a delay of {DELAY_DAYS} days due to {PRIMARY_BOTTLENECK}. Executive intervention required.',
    active: true
  }
];

class ConfigService {
  private config: SystemConfigState = {
    states: DEFAULT_STATES,
    districts: DEFAULT_DISTRICTS,
    departments: DEFAULT_DEPARTMENTS,
    projectTypes: DEFAULT_PROJECT_TYPES,
    workflowStages: DEFAULT_WORKFLOW_STAGES,
    statuses: DEFAULT_STATUSES,
    validationRules: DEFAULT_RULES,
    notificationTemplates: DEFAULT_NOTIFICATION_TEMPLATES
  };

  private listeners: ((config: SystemConfigState) => void)[] = [];

  constructor() {
    this.restoreConfig();
  }

  private restoreConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        this.config = JSON.parse(stored);
      }
    } catch {
      // Use defaults
    }
  }

  private saveConfig() {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Failed to save system configuration to localStorage', e);
    }
    this.notifyListeners();
  }

  public subscribe(listener: (config: SystemConfigState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb({ ...this.config }));
  }

  public getConfig(): SystemConfigState {
    return { ...this.config };
  }

  // --- States Management ---
  public addState(state: StateConfig) {
    this.config.states.push(state);
    this.saveConfig();
  }

  public updateState(state: StateConfig) {
    const idx = this.config.states.findIndex(s => s.code === state.code);
    if (idx !== -1) {
      this.config.states[idx] = state;
      this.saveConfig();
    }
  }

  // --- Districts Management ---
  public addDistrict(district: DistrictConfig) {
    this.config.districts.push(district);
    this.saveConfig();
  }

  // --- Workflow Stages Management (Configurable as Data) ---
  public updateWorkflowStage(stage: WorkflowStageConfig) {
    const idx = this.config.workflowStages.findIndex(s => s.id === stage.id);
    if (idx !== -1) {
      this.config.workflowStages[idx] = stage;
      this.saveConfig();
    }
  }

  // --- Rules Management ---
  public toggleRule(ruleId: string) {
    const rule = this.config.validationRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      this.saveConfig();
    }
  }

  // --- Templates Management ---
  public updateTemplate(tmpl: NotificationTemplateConfig) {
    const idx = this.config.notificationTemplates.findIndex(t => t.id === tmpl.id);
    if (idx !== -1) {
      this.config.notificationTemplates[idx] = tmpl;
      this.saveConfig();
    }
  }

  // --- Reset to Statutory Defaults ---
  public resetToDefaults() {
    this.config = {
      states: DEFAULT_STATES,
      districts: DEFAULT_DISTRICTS,
      departments: DEFAULT_DEPARTMENTS,
      projectTypes: DEFAULT_PROJECT_TYPES,
      workflowStages: DEFAULT_WORKFLOW_STAGES,
      statuses: DEFAULT_STATUSES,
      validationRules: DEFAULT_RULES,
      notificationTemplates: DEFAULT_NOTIFICATION_TEMPLATES
    };
    this.saveConfig();
  }
}

export const configService = new ConfigService();
