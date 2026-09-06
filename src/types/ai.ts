export interface AiRiskFactor {
  factor: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  impactDescription: string;
  recommendation: string;
}

export interface CorridorAiSummary {
  projectId: string;
  totalParcelsAnalyzed: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  criticalLitigationParcels: string[];
  encroachmentHotspotsCount: number;
  averageTimelineDelayDays: number;
  topRiskVillages: {
    village: string;
    riskScore: number;
    primaryDriver: string;
  }[];
  recommendedInterventions: {
    action: string;
    impact: string;
    authority: string;
    urgency: 'HIGH' | 'MEDIUM';
  }[];
}
