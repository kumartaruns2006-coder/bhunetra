export interface RiskFactorContribution {
  name: string;
  weightPercentage: number; // e.g. 30 for 30%
  rawScore: number; // 0 to 100
  weightedScore: number; // rawScore * (weightPercentage / 100)
  description: string;
  contributingBottlenecks: string[];
}

export interface ProjectAiScore {
  projectId: string;
  projectName: string;
  overallScore: number; // e.g. 78
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  predictedDelayDays: number; // e.g. 42
  factors: RiskFactorContribution[];
  formulaDescription: string;
  modelType: string;
}

export interface HighRiskParcelItem {
  parcelId: string;
  khasraNo: string;
  village: string;
  district: string;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  reasons: string[];
  status: string;
  recommendedAction: string;
}

export interface FourWayConflictItem {
  id: string;
  parcelId: string;
  khasraNo: string;
  village: string;
  attribute: string;
  gisValue: string;
  landRecordsValue: string;
  documentsValue: string;
  fieldVerificationValue: string;
  status: 'INCONSISTENCY_DETECTED' | 'CONSISTENT' | 'RESOLVED';
  varianceNote: string;
}

export interface AiRecommendationItem {
  id: string;
  title: string;
  description: string;
  impact: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: 'VERIFICATION' | 'COMPENSATION' | 'DOCUMENTS' | 'LITIGATION';
  targetModule: string;
  actionText: string;
}

export interface NlQueryResult {
  query: string;
  intent: string;
  title: string;
  summary: string;
  keyMetrics?: { label: string; value: string | number }[];
  matchingParcels?: { id: string; khasraNo: string; village: string; riskScore?: number }[];
  matchingProjects?: { id: string; name: string; status: string; delayDays?: number }[];
  actionLink?: { label: string; targetModule: string };
}

// Extensible ML Model Inference Contract (Ready for XGBoost / Scikit-learn / ONNX)
export interface IXGBoostPredictor {
  modelName: string;
  modelVersion: string;
  predictDelay(features: {
    compensationDelayRatio: number;
    disputeRate: number;
    verificationBacklogRatio: number;
    missingDocumentRatio: number;
    milestoneVarianceDays: number;
  }): Promise<{
    delayDays: number;
    confidenceInterval: [number, number];
    featureImportances: Record<string, number>;
  }>;
}
