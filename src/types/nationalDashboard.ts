export interface NationalKpis {
  totalProjects: number;
  landProposedAcres: number;
  landAcquiredAcres: number;
  notificationsIssued: number;
  awardsDeclared: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  possessionCompletedAcres: number;
  affectedFamilies: number;
  displacedFamilies: number;
  rrProgressPercent: number;
  highRiskProjectsCount: number;
}

export interface StatePerformanceRecord {
  id: string;
  state: string;
  code: string;
  projectsCount: number;
  proposedLandAcres: number;
  acquiredLandAcres: number;
  acquisitionPercent: number;
  compensationAssessedCr: number;
  compensationDisbursedCr: number;
  compensationPercent: number;
  rrProgressPercent: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  districtsCount: number;
  topDistricts: string[];
  keyCorridor: string;
  calaCount: number;
  delayedProjectsCount: number;
}

export interface ProjectProgressRecord {
  id: string;
  code: string;
  name: string;
  state: string;
  district: string;
  implementingAgency: string;
  department: string;
  landProposedAcres: number;
  landAcquiredAcres: number;
  parcelsCount: number;
  acquisitionPercent: number;
  compensationPercent: number;
  rrPercent: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ON_TRACK' | 'POSSESSION_IN_PROGRESS' | 'VALUATION_PENDING' | 'SURVEY_UNDERWAY' | 'DELAYED' | 'CRITICAL_HOLD';
  corridorLengthKm: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface HighRiskProjectRecord {
  id: string;
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  riskScore: number;
  riskCategory: 'LEGAL_DISPUTE' | 'FOREST_CLEARANCE' | 'FARMER_AGITATION' | 'TITLE_MUTATION' | 'VALUATION_PROTEST';
  predictedDelayDays: number;
  reason: string;
  recommendedAction: string;
  actionType: 'ESCALATE_CS' | 'CONVENE_CALA' | 'DEPLOY_COUNSEL' | 'ORDER_RESURVEY' | 'CABINET_NOTE';
  affectedParcelsCount: number;
}

export interface ActivityItem {
  id: string;
  type: 'PARCEL_VERIFIED' | 'AWARD_UPLOADED' | 'COMPENSATION_UPDATED' | 'APPROVAL_COMPLETED' | 'MILESTONE_DELAYED';
  title: string;
  description: string;
  timestamp: string;
  officerName: string;
  officerRole: string;
  projectId: string;
  projectName: string;
  parcelId?: string;
  parcelKhasra?: string;
  villageName?: string;
  amountCr?: number;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

export interface AlertSummaryItem {
  id: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  state: string;
  category: 'LITIGATION' | 'STATUTORY_LAPSE' | 'ENCROACHMENT' | 'ESCROW_FUNDING' | 'SURVEY';
  parcelId?: string;
}

export interface TimelineComplianceStats {
  onTrackCount: number;
  delayedCount: number;
  criticalCount: number;
  totalCount: number;
  averageDelayDays: number;
  statutoryLapseRiskParcels: number;
  completedMilestonesRatio: string;
}

export interface DashboardFilterState {
  state: string;
  district: string;
  project: string;
  department: string;
  dateRange: string;
}
