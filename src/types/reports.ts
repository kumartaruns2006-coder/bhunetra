// Types for PART 13: Reports, MIS and Executive Dashboard

export type ReportType =
  | 'ACQUISITION_PROGRESS'
  | 'LAND_PROPOSED_VS_ACQUIRED'
  | 'NOTIFICATIONS'
  | 'AWARDS'
  | 'COMPENSATION'
  | 'RR'
  | 'POSSESSION'
  | 'AFFECTED_FAMILIES'
  | 'DISPLACED_FAMILIES'
  | 'TIMELINE_COMPLIANCE'
  | 'DELAYED_PROJECTS'
  | 'HIGH_RISK_PROJECTS'
  | 'FIELD_VERIFICATION';

export interface ReportTypeConfig {
  id: ReportType;
  title: string;
  category: 'STATUTORY' | 'FINANCIAL' | 'PHYSICAL' | 'RISK';
  description: string;
  badge: string;
  columns: string[];
}

export interface ReportFilterState {
  state: string;
  district: string;
  project: string;
  department: string;
  stage: string;
  status: string;
  risk: string;
  dateRange: string;
}

export interface ReportDataRow {
  id: string;
  projectCode: string;
  projectName: string;
  state: string;
  district: string;
  village?: string;
  department: string;
  stage: string;
  status: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Dynamic metric columns based on report type
  col1Label: string;
  col1Value: string | number;
  col2Label: string;
  col2Value: string | number;
  col3Label: string;
  col3Value: string | number;
  col4Label: string;
  col4Value: string | number;
  col5Label: string;
  col5Value: string | number;
  
  dateRef: string;
  remarks?: string;
}

export interface ReportSummaryStats {
  totalRecords: number;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  tertiaryMetricLabel: string;
  tertiaryMetricValue: string;
  quaternaryMetricLabel: string;
  quaternaryMetricValue: string;
}

// SECTION 2: Trend Analytics Types
export interface MonthlyTrendRecord {
  month: string;              // e.g. "Apr 2025"
  shortMonth: string;         // e.g. "Apr"
  year: number;
  projectsCompleted: number;  // Cumulative / completed in month
  landAcquiredAcres: number;  // Land acquired (Acres)
  compensationDisbursedCr: number; // Compensation disbursed (₹ Crores)
  rrCompletedFamilies: number;     // R&R completed (Families)
  possessionCompletedAcres: number;// Possession completed (Acres)
  velocityPercentMoM: number;      // Month over month growth velocity
}

// SECTION 3: Comparative Analytics Types
export interface ComparisonMetric {
  label: string;
  unit: string;
  valA: number;
  valB: number;
  diff: number;
  diffPercent: number;
  leader: 'A' | 'B' | 'TIE';
}

export interface ComparativeEntity {
  id: string;
  name: string;
  category: 'STATE' | 'DISTRICT' | 'PROJECT';
  tag: string;
  metrics: Record<string, number>;
}

// SECTION 4: Executive Dashboard KPIs
export interface ExecutiveMacroKpis {
  activeProjects: number;
  landProposedAcres: number;
  landAcquiredAcres: number;
  landAcquiredPercent: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  compensationDisbursedPercent: number;
  rrEligibleFamilies: number;
  rrCompletedFamilies: number;
  rrCompletedPercent: number;
  possessionHandedAcres: number;
  possessionHandedPercent: number;
  highRiskProjectsCount: number;
  highRiskProjectsPercent: number;
}

// SECTION 5: Intervention Center & 5-Tier Drilldown Types
export interface InterventionCase {
  id: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  state: string;
  district: string;
  riskLevel: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  riskScore: number;
  predictedDelayDays: number;
  primaryIssues: string[]; // e.g. ["Compensation", "Verification", "Documents"]
  recommendedAction: string; // e.g. "Prioritize 18 parcels."
  urgency: 'IMMEDIATE' | 'HIGH' | 'ELEVATED';
  targetDate: string;
  affectedParcelsCount: number;
  estimatedCostImpactCr?: number;
  status: 'PENDING_ACTION' | 'IN_REVIEW' | 'ESCALATED' | 'RESOLVED';
}

export type DrilldownLevel = 'national' | 'state' | 'district' | 'project' | 'parcel';

export interface DrilldownState {
  currentLevel: DrilldownLevel;
  selectedState?: string;
  selectedDistrict?: string;
  selectedProjectId?: string;
  selectedProjectName?: string;
  selectedParcelId?: string;
}
