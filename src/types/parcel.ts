export type StatutoryStage = 
  | 'SECTION_3A' // Notification of Intent
  | 'SECTION_3C' // Hearing of Objections
  | 'SECTION_3D' // Declaration of Acquisition
  | 'SECTION_3G' // Determination of Compensation
  | 'SECTION_3H' // Deposit of Compensation
  | 'SECTION_3E'; // Physical Possession

export type ParcelStatus = 
  | 'NOTIFICATION_PENDING'
  | 'UNDER_INQUIRY'
  | 'VALUATION_IN_PROGRESS'
  | 'AWARD_DETERMINED'
  | 'COMPENSATION_DEPOSITED'
  | 'POSSESSION_ACQUIRED'
  | 'LITIGATION_HALTED';

export type LandCategory = 
  | 'AGRICULTURAL_IRRIGATED'
  | 'AGRICULTURAL_NON_IRRIGATED'
  | 'COMMERCIAL_ROAD_FACING'
  | 'RESIDENTIAL_ABADI'
  | 'GRAM_SABHA_PUBLIC'
  | 'GOVERNMENT_REVENUE';

export interface DocumentItem {
  id: string;
  name: string;
  category?: 'LAND_RECORD' | 'NOTIFICATION' | 'AWARD' | 'COMPENSATION' | 'RR' | 'FIELD_REPORT';
  documentType: 'GAZETTE_3A' | 'JMS_SHEET' | 'KHATIYAN_EXTRACT' | 'FIELD_GEO_REPORT' | 'VALUATION_AWARD' | 'POSSESSION_MEMO' | string;
  referenceNo: string;
  issueDate: string;
  fileSize: string;
  verifiedBy: string;
  verifiedStatus: 'VERIFIED' | 'PENDING' | 'DISCREPANCY';
  version?: string;
  uploadedBy?: string;
  downloadUrl?: string;
}

export interface CompensationStructure {
  circleRatePerSqM: number;
  marketMultiplier: number;
  baseLandValue: number;
  solatium100Percent: number;
  additionalInterest12Percent: number;
  structureValuation: number;
  treesAndCropValuation: number;
  totalAwardAmount: number;
  disbursedAmount: number;
  paymentStatus: 'NOT_INITIATED' | 'CALA_SANCTIONED' | 'ESCROW_FUNDED' | 'DIRECT_BENEFIT_TRANSFERRED' | 'DISPUTE_HELD';
  bankReferenceNo?: string;
  disbursementDate?: string;
}

export interface RehabilitationResettlement {
  isDisplacedFamily: boolean;
  affectedPersonsCount: number;
  resettlementAllowance: number;
  subsistenceGrantPerMonth: number;
  homesteadPlotAllotted: boolean;
  trainingAndSkillGrant: number;
  rrStatus: 'NOT_APPLICABLE' | 'PLAN_SUBMITTED' | 'APPROVED' | 'DISBURSED';
  panchayatVerification?: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export interface FieldVerificationRecord {
  id: string;
  inspectionDate: string;
  aminName: string;
  aminBadgeNo: string;
  gpsLatitude: number;
  gpsLongitude: number;
  boundaryDeviationMeters: number;
  structuresFound: string[];
  standingCrops: string[];
  encroachmentDetected: boolean;
  encroachmentDetails?: string;
  photos: {
    url: string;
    caption: string;
    compassHeading: string;
    timestamp: string;
  }[];
  officerRemarks: string;
  signatureVerified: boolean;
}

export interface AiRiskAssessment {
  overallRiskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  litigationProbability: number; // percentage 0 - 100
  encroachmentRiskScore: number; // 0 - 100
  compensationDisputeRisk: number; // 0 - 100
  predictedDelayDays: number;
  projectedCostImpactInr: number;
  detectedRiskFactors: string[];
  aiRecommendations: string[];
  lastAssessedDate: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  statutoryStage: StatutoryStage;
  remarks: string;
  previousValue?: string;
  newValue?: string;
  hash: string;
}

export interface ParcelTimelineEvent {
  id: string;
  stageName: string;
  date: string;
  title: string;
  description: string;
  performedBy: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  referenceNo?: string;
}

export interface Parcel {
  id: string;
  projectId: string;
  khasraNo: string; // Survey / Plot No e.g. "412/1"
  khataNo: string;  // Khata No e.g. "78"
  jamabandiNo: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  
  // Cadastral Geometry & Area
  coordinates: [number, number]; // [lat, lng] center
  polygonCoordinates: [number, number][]; // boundary coordinates
  totalParcelAreaHectares: number;
  acquisitionAreaHectares: number;
  acquisitionAreaSqM: number;
  landCategory: LandCategory;
  
  // Ownership
  primaryOwnerName: string;
  coSharers: string[];
  ownershipType: 'PRIVATE_INDIVIDUAL' | 'JOINT_FAMILY' | 'COMMUNITY' | 'GOVERNMENT';
  mutationCompleted: boolean;
  encumbranceFree: boolean;
  
  // Status & Workflow
  currentStage: StatutoryStage;
  status: ParcelStatus;
  mapStatus?: 'ACQUIRED' | 'PENDING' | 'DISPUTED' | 'VERIFIED' | 'VERIFICATION_PENDING' | 'PROPOSED';
  possessionPercentage: number; // 0 to 100
  
  // Sub-modules
  compensation: CompensationStructure;
  rehabilitation: RehabilitationResettlement;
  fieldVerification: FieldVerificationRecord[];
  aiRisk: AiRiskAssessment;
  documents: DocumentItem[];
  auditTrail: AuditLogEntry[];
}
