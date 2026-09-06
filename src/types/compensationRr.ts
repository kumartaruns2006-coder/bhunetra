export type CompensationStatus = 'PAID' | 'PENDING' | 'DELAYED' | 'ASSESSED';

export type CompensationWorkflowStep = 
  | 'ASSESSMENT' 
  | 'APPROVAL' 
  | 'DISBURSEMENT' 
  | 'CONFIRMATION';

export interface BeneficiaryRecord {
  id: string; // Synthetic Demo ID e.g. "BEN-8492-PAT"
  parcelId: string;
  khasraNo: string;
  projectId: string;
  projectName: string;
  district: string;
  village: string;
  beneficiaryName: string;
  maskedBankAadhaar: string; // e.g. "SBIN-XXXX-4819"
  
  // Financial Breakdown
  assessedAmount: number;
  approvedAmount: number;
  disbursedAmount: number;
  pendingAmount: number;
  
  status: CompensationStatus;
  workflowStep: CompensationWorkflowStep;
  
  delayDays?: number;
  utrReference?: string;
  bankName?: string;
  awardDate?: string;
  disbursementDate?: string;
}

export type RrProgressStatus = 
  | 'NOT_APPLICABLE' 
  | 'IDENTIFIED' 
  | 'ELIGIBLE' 
  | 'IN_PROGRESS' 
  | 'COMPLETED';

export type RrVerificationStatus = 
  | 'VERIFIED' 
  | 'PENDING_HEARING' 
  | 'REJECTED';

export interface FamilyRrRecord {
  id: string; // Synthetic Demo ID e.g. "PAF-8821-KAN"
  parcelId: string;
  khasraNo: string;
  projectId: string;
  projectName: string;
  district: string;
  village: string;
  headOfFamily: string;
  affectedPersonsCount: number;
  isAffected: boolean;
  isDisplaced: boolean;
  
  rrStatus: RrProgressStatus;
  verification: RrVerificationStatus;
  pendingAction: string;
  
  // Entitlements
  homesteadPlotAllotted: boolean;
  homesteadPlotNo?: string;
  subsistencePaidMonths: number; // 0 to 12 months
  subsistenceTotalGrant: number;
  resettlementColony?: string;
  skillTrainingCompleted?: boolean;
}

export interface DistrictRrAnalytics {
  district: string;
  totalAffectedFamilies: number;
  totalDisplacedFamilies: number;
  rrEligible: number;
  rrCompleted: number;
  rrPending: number;
  homesteadAllotted: number;
  subsistenceDisbursedInr: number;
  progressPercentage: number;
}

export interface ProjectRrAnalytics {
  projectId: string;
  projectName: string;
  totalAffectedFamilies: number;
  totalDisplacedFamilies: number;
  rrEligible: number;
  rrCompleted: number;
  rrPending: number;
  totalCompensationAssessed: number;
  totalCompensationDisbursed: number;
  progressPercentage: number;
}

export type AlertType = 
  | 'COMPENSATION_PENDING' 
  | 'COMPENSATION_DELAYED' 
  | 'RR_PENDING' 
  | 'VERIFICATION_PENDING';

export interface CompensationRrAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  parcelId: string;
  khasraNo: string;
  projectId: string;
  projectName: string;
  district: string;
  amount?: number;
  daysOverdue?: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timestamp: string;
  suggestedAction: string;
}

export interface CompensationKpis {
  totalAssessed: number;
  totalApproved: number;
  totalDisbursed: number;
  totalPending: number;
  
  totalBeneficiaries: number;
  paidBeneficiaries: number;
  pendingBeneficiaries: number;
  delayedBeneficiaries: number;
}

export interface RrKpis {
  affectedFamilies: number;
  displacedFamilies: number;
  rrEligible: number;
  rrCompleted: number;
  rrPending: number;
  progressPercentage: number;
}
