import { CorridorAiSummary } from '../types/ai';

export const mockAiSummary: CorridorAiSummary = {
  projectId: 'PRR-PH2-2026',
  totalParcelsAnalyzed: 482,
  highRiskCount: 28,
  mediumRiskCount: 66,
  lowRiskCount: 388,
  criticalLitigationParcels: ['PRR-PARCEL-516 (Khasra 516)', 'PRR-PARCEL-412-1 (Khasra 412/1)'],
  encroachmentHotspotsCount: 7,
  averageTimelineDelayDays: 38,
  topRiskVillages: [
    { village: 'Naubatpur', riskScore: 78, primaryDriver: 'Unpartitioned Joint Ancestral Disputes (Civil Suits)' },
    { village: 'Kanhauli', riskScore: 68, primaryDriver: 'Post-3A Commercial Structures & Encroachments' },
    { village: 'Phulwari Sharif', riskScore: 42, primaryDriver: 'High Circle Rate vs Local Demand Variance' }
  ],
  recommendedInterventions: [
    {
      action: 'Convene Special Lok Adalat Bench for Naubatpur & Kanhauli Joint Heirs',
      impact: 'Mitigates 45 days of court delays across 18 disputed parcels',
      authority: 'District Legal Services Authority (DLSA) & CALA Patna',
      urgency: 'HIGH'
    },
    {
      action: 'Issue Summary Notices under NH Act Section 3E for Unauthorised Post-3A Sheds',
      impact: 'Secures 1.8 km critical corridor RoW before civil tender mobilization',
      authority: 'Sub-Divisional Magistrate (SDM) Danapur & Circle Officer Bihta',
      urgency: 'HIGH'
    },
    {
      action: 'Trigger Fast-Track Tree & Tube-well Appraisals with State Horticulture Dept',
      impact: 'Unblocks ₹14.8 Cr Section 3G awards in Bihta & Dumra reach',
      authority: 'District Horticulture Officer & CALA Valuer',
      urgency: 'MEDIUM'
    }
  ]
};

class AiService {
  public async getCorridorSummary(projectId: string): Promise<CorridorAiSummary> {
    return { ...mockAiSummary, projectId };
  }
}

export const aiService = new AiService();
