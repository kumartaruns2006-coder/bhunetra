export interface ProjectVillage {
  villageName: string;
  tehsil: string;
  totalParcels: number;
  acquiredParcels: number;
  areaHectares: number;
  disbursedAmountCr: number;
  riskStatus: 'CLEAR' | 'WATCH' | 'CRITICAL';
}

export interface ProjectMilestone {
  id: string;
  stageName: string;
  statutoryReference: string;
  targetDate: string;
  completedDate?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'DELAYED' | 'UPCOMING';
  responsibleAuthority: string;
}

export interface ProjectCorridor {
  id: string;
  code: string;
  name: string;
  state: string;
  districts: string[];
  implementingAgency: string; // e.g. "NHAI Regional Office, Patna"
  competentAuthority: string; // e.g. "CALA / SDM Patna Sadar"
  corridorLengthKm: number;
  rightOfWayWidthM: number;
  totalLandRequiredHectares: number;
  totalParcelsCount: number;
  
  // Progress metrics
  parcelsAcquiredCount: number;
  parcelsValuationCount: number;
  parcelsUnderInquiryCount: number;
  parcelsDisputedCount: number;
  possessionSecuredPercentage: number;
  
  // Financials
  totalBudgetCr: number;
  disbursedBudgetCr: number;
  escrowBalanceCr: number;
  
  // GIS & Geometry
  corridorCenter: [number, number];
  corridorBounds: [[number, number], [number, number]];
  alignmentPathCoordinates: [number, number][];
  
  // Sub-items
  villages: ProjectVillage[];
  milestones: ProjectMilestone[];
  highRiskParcelsCount: number;
  createdDate: string;
  targetCompletionDate: string;
}
