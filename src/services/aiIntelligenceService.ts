import { 
  ProjectAiScore, 
  RiskFactorContribution, 
  HighRiskParcelItem, 
  FourWayConflictItem, 
  AiRecommendationItem, 
  NlQueryResult,
  IXGBoostPredictor
} from '../types/aiIntelligence';
import { Parcel } from '../types/parcel';
import { ProjectCorridor } from '../types/project';

class AiIntelligenceService {

  // =========================================================================
  // FEATURE 1, 2, 3: PROJECT RISK SCORE, DELAY PREDICTION & WEIGHTED FACTORS
  // =========================================================================
  // Formula:
  // Risk = 30% compensation delay + 25% dispute + 20% verification delay + 15% document issue + 10% milestone delay
  public getProjectScore(projectId: string = 'PRR-2026-001', parcels?: Parcel[]): ProjectAiScore {
    const isK125Verified = parcels?.some(p => (p.id === 'K-125/2' || p.khasraNo === '125/2') && p.mapStatus === 'VERIFIED');

    const factors: RiskFactorContribution[] = [
      {
        name: 'Compensation Backlog',
        weightPercentage: 30,
        rawScore: 85,
        weightedScore: 25.5, // 85 * 0.30
        description: '14 parcels with determined Section 3G awards awaiting CALA sanction and SBI escrow funding.',
        contributingBottlenecks: [
          'Bihta Tehsil sanction backlog: ₹25.59 Cr pending disbursement',
          'Aadhaar NPCI bank account validation lag on 6 accounts',
          'PFMS electronic scroll processing cycle time averaging 18 days'
        ]
      },
      {
        name: 'Disputed Parcels & Litigation',
        weightPercentage: 25,
        rawScore: 80,
        weightedScore: 20.0, // 80 * 0.25
        description: 'Active Civil Court partition injunctions and High Court writ contestation on RoW chainage.',
        contributingBottlenecks: [
          'Khasra 516 (Naubatpur): Coparcenary title partition stay petition in Danapur Sub-Judge Court',
          'Khasra 126/1: Landowner objection on circle rate classification pending peremptory hearing'
        ]
      },
      {
        name: 'Field Verification Backlog',
        weightPercentage: 20,
        rawScore: isK125Verified ? 35 : 75,
        weightedScore: isK125Verified ? 7.0 : 15.0,
        description: isK125Verified 
          ? 'K-125/2 ground truth verified. DGPS cadastral pegging underway on remaining corridor plots.' 
          : 'DGPS ground truth cadastral pegging pending on 14 corridor plots.',
        contributingBottlenecks: isK125Verified ? [
          'Khasra 125/2 DGPS boundary verification successfully logged & verified by Amin',
          'Additional Amin survey team deployed in Kanhauli sector'
        ] : [
          'Kanhauli sector: 1.8m boundary deviation flagged by Amin inspection',
          'Only 2 Revenue Amins deployed against required 5 survey teams'
        ]
      },
      {
        name: 'Missing Documents & Clearances',
        weightPercentage: 15,
        rawScore: 70,
        weightedScore: 10.5, // 70 * 0.15
        description: 'Missing structural valuations and tree felling permissions.',
        contributingBottlenecks: [
          'PWD Building Division structure valuation certificates overdue for 4 parcels',
          'Forest Department Stage-I utility shifting clearance in progress'
        ]
      },
      {
        name: 'Milestone Delay',
        weightPercentage: 10,
        rawScore: 70,
        weightedScore: 7.0, // 70 * 0.10
        description: 'Section 3D statutory window nearing expiry within 6 calendar days.',
        contributingBottlenecks: [
          'Section 3A Gazette published 359 days ago; 1-year statutory limitation triggers soon'
        ]
      }
    ];

    const overallScore = Math.round(factors.reduce((sum, f) => sum + f.weightedScore, 0));
    const predictedDelayDays = isK125Verified ? 28 : 42;

    return {
      projectId,
      projectName: 'Patna Ring Road Expansion (Phase II)',
      overallScore, // 78 -> 70
      riskLevel: overallScore >= 75 ? 'HIGH' : 'HIGH',
      predictedDelayDays, // 42 -> 28 days
      factors,
      formulaDescription: 'Risk = 30% compensation delay + 25% dispute + 20% verification delay + 15% document issue + 10% milestone delay',
      modelType: 'Transparent Decision-Support Model (XGBoost/ML Pipeline Ready)'
    };
  }

  // =========================================================================
  // FEATURE 4: HIGH-RISK PARCELS
  // =========================================================================
  public getHighRiskParcels(parcels: Parcel[]): HighRiskParcelItem[] {
    const k125Live = parcels.find(p => p.id === 'K-125/2' || p.khasraNo === '125/2');
    const isK125Verified = k125Live?.mapStatus === 'VERIFIED';

    const predefined: HighRiskParcelItem[] = [
      {
        parcelId: 'K-516',
        khasraNo: '516',
        village: 'Naubatpur',
        district: 'Patna',
        riskScore: 85,
        riskLevel: 'CRITICAL',
        reasons: [
          'Ancestral partition suit filed in Civil Court Danapur',
          'Interim stay application pending without daughter NOC'
        ],
        status: 'SECTION_3C (Inquiry Halted)',
        recommendedAction: 'Engage Government Pleader to file Section 3H(4) Court Escrow deposit affidavit under NH Act 1956 to vacate stay.'
      },
      {
        parcelId: 'K-125/2',
        khasraNo: '125/2',
        village: 'Kanhauli',
        district: 'Patna',
        riskScore: isK125Verified ? 38 : 72,
        riskLevel: isK125Verified ? 'HIGH' : 'HIGH',
        reasons: isK125Verified ? [
          'Field verification completed on ground by Circle Amin',
          'Boundary pegged; CALA formal award decree sanction in progress'
        ] : [
          'Compensation valuation approved (₹4.98 Cr) but CALA decree pending 14 days',
          'Physical possession notice pending Section 3E issuance'
        ],
        status: isK125Verified ? 'VERIFIED (Award Determination)' : 'SECTION_3G (Award Sanction)',
        recommendedAction: isK125Verified 
          ? 'Ground-truth verification complete. CALA to sign Section 3G Statutory Decree and disburse via PFMS DBT.' 
          : 'CALA to digitally sign Section 3G Statutory Decree and authorize PFMS DBT transfer.'
      },
      {
        parcelId: 'K-126/1',
        khasraNo: '126/1',
        village: 'Kanhauli',
        district: 'Patna',
        riskScore: 68,
        riskLevel: 'HIGH',
        reasons: [
          '1.8m boundary deviation flagged by Amin DGPS ground survey',
          'Landowner objection on circle rate multiplier pending 22 days'
        ],
        status: 'SECTION_3C (Hearing Delayed)',
        recommendedAction: 'Convene Joint Measurement Survey (JMS) with Circle Officer Bihta to reconcile demarcation pegs.'
      },
      {
        parcelId: 'K-412/1',
        khasraNo: '412/1',
        village: 'Kanhauli',
        district: 'Patna',
        riskScore: 64,
        riskLevel: 'HIGH',
        reasons: [
          'Post-3A commercial shed erected along outer RoW margin',
          'Unauthorized commercial claim filed by tenant'
        ],
        status: 'SECTION_3A (Encroachment Flagged)',
        recommendedAction: 'Issue Section 3E 60-day eviction notice and Amin re-demarcation.'
      },
      {
        parcelId: 'K-415/3',
        khasraNo: '415/3',
        village: 'Kanhauli',
        district: 'Patna',
        riskScore: 52,
        riskLevel: 'HIGH',
        reasons: [
          'Missing PWD Building Division structural valuation certificate for tube-well masonry',
          'Valuation schedule incomplete'
        ],
        status: 'SECTION_3G (Valuation Halted)',
        recommendedAction: 'Issue requisition reminder to Executive Engineer PWD Building Division, Danapur.'
      }
    ];

    // Combine with any dynamically loaded parcels with riskScore >= 50
    const dynamicItems = parcels
      .filter(p => p.aiRisk && p.aiRisk.overallRiskScore >= 50 && !predefined.some(x => x.parcelId === p.id))
      .map(p => ({
        parcelId: p.id,
        khasraNo: p.khasraNo,
        village: p.village,
        district: p.district,
        riskScore: p.aiRisk.overallRiskScore,
        riskLevel: (p.aiRisk.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH') as 'CRITICAL' | 'HIGH',
        reasons: p.aiRisk.detectedRiskFactors || ['Statutory inquiry backlog'],
        status: p.currentStage,
        recommendedAction: p.aiRisk.aiRecommendations?.[0] || 'Prioritize joint ground verification.'
      }));

    return [...predefined, ...dynamicItems];
  }

  // =========================================================================
  // FEATURE 5: 4-WAY DATA CONFLICT DETECTION (GIS vs Land Records vs Docs vs Verification)
  // =========================================================================
  public getFourWayConflicts(): FourWayConflictItem[] {
    return [
      {
        id: '4WAY-CONF-001',
        parcelId: 'K-125/2',
        khasraNo: '125/2',
        village: 'Kanhauli',
        attribute: 'Acquisition Land Area',
        gisValue: '2.40 Acres (0.97 Ha)',
        landRecordsValue: '2.15 Acres (0.87 Ha)',
        documentsValue: '2.45 Acres (Gazette 3A)',
        fieldVerificationValue: '2.40 Acres (DGPS Pegs)',
        status: 'INCONSISTENCY_DETECTED',
        varianceNote: '0.30 Acres discrepancy between State Bhulekh RoR (2.15 ac) and Gazette Schedule (2.45 ac).'
      },
      {
        id: '4WAY-CONF-002',
        parcelId: 'K-126/1',
        khasraNo: '126/1',
        village: 'Kanhauli',
        attribute: 'Boundary Demarcation Offset',
        gisValue: 'Zero Offset (RoW Align)',
        landRecordsValue: 'Cadastral Naksha 1965',
        documentsValue: '60m Right of Way Schedule',
        fieldVerificationValue: '1.8m North-East Deviation',
        status: 'INCONSISTENCY_DETECTED',
        varianceNote: 'Physical fence pegs deviate by 1.8m from digitized cadastre Naksha sheet.'
      },
      {
        id: '4WAY-CONF-003',
        parcelId: 'K-412/1',
        khasraNo: '412/1',
        village: 'Kanhauli',
        attribute: 'Land Classification & Rate',
        gisValue: 'Commercial (Frontage 50m)',
        landRecordsValue: 'Dofasli Irrigated (Agri)',
        documentsValue: 'Commercial ₹4,800/m²',
        fieldVerificationValue: 'Active GI Sheet Workshop',
        status: 'INCONSISTENCY_DETECTED',
        varianceNote: 'Ground reality shows commercial workshop while revenue Khatiyan records agricultural.'
      },
      {
        id: '4WAY-CONF-004',
        parcelId: 'K-130/2',
        khasraNo: '130/2',
        village: 'Kanhauli',
        attribute: 'Titleholder & Aadhaar Link',
        gisValue: 'Savitri Devi (Verified)',
        landRecordsValue: 'Savitri Devi W/o K. Singh',
        documentsValue: 'Aadhaar Seeded Verified',
        fieldVerificationValue: 'Occupant Verified On Site',
        status: 'CONSISTENT',
        varianceNote: '100% multi-source alignment verified across all 4 registries.'
      }
    ];
  }

  // =========================================================================
  // FEATURE 6: AI PROACTIVE RECOMMENDATIONS
  // =========================================================================
  public getRecommendations(): AiRecommendationItem[] {
    return [
      {
        id: 'REC-001',
        title: 'Prioritize verification of 18 high-risk parcels.',
        description: 'Deploy 3 additional mobile Amin survey teams with RTK DGPS kits to Bihta and Kanhauli sectors to clear the 18 pending high-risk inspection dossiers within 7 days.',
        impact: 'Reduces projected corridor timeline delay by 14 days and resolves 1.8m boundary disputes.',
        urgency: 'CRITICAL',
        category: 'VERIFICATION',
        targetModule: 'field_verification',
        actionText: 'Launch Surveyor Inspection Queue →'
      },
      {
        id: 'REC-002',
        title: 'Resolve compensation backlog.',
        description: 'CALA Patna to convene special award sanction session to execute Section 3G decrees for ₹25.59 Cr across 14 sanctioned plots and release SBI escrow PFMS transfers.',
        impact: 'Prevents 12% statutory additional interest accumulation and fulfills Section 3H disbursement milestone.',
        urgency: 'HIGH',
        category: 'COMPENSATION',
        targetModule: 'compensation_rr',
        actionText: 'Open Compensation & R&R Cockpit →'
      },
      {
        id: 'REC-003',
        title: 'Review missing documentation.',
        description: 'Issue urgent digital requisition to PWD Building Division Danapur for pending tube-well & shed valuation certificates on K-415/3 to complete award schedules.',
        impact: 'Eliminates legal valuation ambiguity and unblocks final 3G award gazette notification.',
        urgency: 'HIGH',
        category: 'DOCUMENTS',
        targetModule: 'documents',
        actionText: 'Open Document Management →'
      }
    ];
  }

  // =========================================================================
  // FEATURE 7: NATURAL LANGUAGE QUERY ("Ask BHUMI-TRACK" / "Ask BhuNetra")
  // =========================================================================
  public queryNaturalLanguage(queryText: string): NlQueryResult {
    const q = queryText.toLowerCase().trim();

    // Query 1: "Show delayed projects in Bihar."
    if (q.includes('delayed project') || (q.includes('delay') && q.includes('bihar'))) {
      return {
        query: queryText,
        intent: 'PROJECT_DELAY_ANALYSIS',
        title: 'Corridor Delay Analysis in Bihar',
        summary: 'Identified 2 strategic corridors in Bihar with projected timeline variances exceeding 30 calendar days due to compensation and forest clearance bottlenecks.',
        keyMetrics: [
          { label: 'Max Projected Delay', value: '42 Days (PRR-PH2-2026)' },
          { label: 'Total Projects Monitored', value: '3 Corridors in Bihar' },
          { label: 'Critical Bottleneck', value: 'Bihta Compensation Backlog' }
        ],
        matchingProjects: [
          { id: 'PRR-PH2-2026', name: 'Patna Ring Road Expansion (Phase II)', status: 'HIGH RISK (+42 Days Delay)', delayDays: 42 },
          { id: 'NHAI-VKE-2026', name: 'Varanasi-Kolkata Expressway (Package 3 - Kaimur)', status: 'STAGE-II FOREST DELAY (+60 Days)', delayDays: 60 }
        ],
        actionLink: { label: 'View Patna Ring Road Project Dossier', targetModule: 'projects' }
      };
    }

    // Query 2: "Which parcels are high risk?"
    if (q.includes('high risk') || q.includes('parcels are high') || q.includes('risk parcel')) {
      return {
        query: queryText,
        intent: 'HIGH_RISK_PARCEL_LOOKUP',
        title: 'High-Risk Cadastral Parcels (Risk Score ≥ 50/100)',
        summary: '5 corridor parcels flagged with elevated risk scores driven by active civil court litigation, RoW boundary deviations, and unpartitioned co-sharer objections.',
        keyMetrics: [
          { label: 'Critical Risk Parcels', value: '1 (Khasra 516 Naubatpur)' },
          { label: 'High Risk Parcels', value: '4 Plots in Kanhauli' },
          { label: 'Average Risk Score', value: '68.2 / 100' }
        ],
        matchingParcels: [
          { id: 'K-516', khasraNo: '516', village: 'Naubatpur', riskScore: 85 },
          { id: 'K-125/2', khasraNo: '125/2', village: 'Kanhauli', riskScore: 72 },
          { id: 'K-126/1', khasraNo: '126/1', village: 'Kanhauli', riskScore: 68 },
          { id: 'K-412/1', khasraNo: '412/1', village: 'Kanhauli', riskScore: 64 },
          { id: 'K-415/3', khasraNo: '415/3', village: 'Kanhauli', riskScore: 52 }
        ],
        actionLink: { label: 'Inspect High-Risk Parcels on GIS Map', targetModule: 'gis' }
      };
    }

    // Query 3: "Show pending compensation."
    if (q.includes('pending compensation') || q.includes('compensation pending') || (q.includes('compensation') && q.includes('pending'))) {
      return {
        query: queryText,
        intent: 'COMPENSATION_BACKLOG_AUDIT',
        title: 'Statutory Compensation Backlog Audit',
        summary: 'Total ₹25.59 Cr assessed compensation across 14 parcels is awaiting CALA Section 3G decree sanction or electronic PFMS Direct Benefit Transfer.',
        keyMetrics: [
          { label: 'Total Assessed', value: '₹38.97 Cr' },
          { label: 'Total Disbursed', value: '₹24.53 Cr (62.9%)' },
          { label: 'Total Pending', value: '₹14.44 Cr' },
          { label: 'Beneficiaries Pending', value: '3 Titleholders' }
        ],
        matchingParcels: [
          { id: 'K-125/2', khasraNo: '125/2', village: 'Kanhauli', riskScore: 72 },
          { id: 'K-126/1', khasraNo: '126/1', village: 'Kanhauli', riskScore: 68 },
          { id: 'K-412/1', khasraNo: '412/1', village: 'Kanhauli', riskScore: 64 }
        ],
        actionLink: { label: 'Open Compensation & R&R Command Center', targetModule: 'compensation_rr' }
      };
    }

    // Query 4: "Which projects may miss target timelines?"
    if (q.includes('miss target') || q.includes('timeline') || q.includes('target timeline') || q.includes('miss timeline')) {
      return {
        query: queryText,
        intent: 'PROJECT_TIMELINE_VULNERABILITY',
        title: 'Project Timeline Vulnerability Forecast',
        summary: 'Patna Ring Road Expansion (Phase II) has a predicted delay of 42 days beyond its statutory target completion date (Q4 2026) due to Bihta Tehsil acquisition bottlenecks.',
        keyMetrics: [
          { label: 'Target Completion', value: '31 Dec 2026' },
          { label: 'Forecasted Completion', value: '11 Feb 2027 (+42 Days)' },
          { label: 'Critical Path Item', value: 'Section 3D Window (6 Days Left)' }
        ],
        matchingProjects: [
          { id: 'PRR-2026-001', name: 'Patna Ring Road Expansion (Phase II)', status: '42-Day Delay Predicted', delayDays: 42 }
        ],
        actionLink: { label: 'View End-to-End Acquisition Workflow', targetModule: 'workflow' }
      };
    }

    // Default Fallback Query Answer
    return {
      query: queryText,
      intent: 'GENERAL_INTELLIGENCE_SEARCH',
      title: `Search Results for "${queryText}"`,
      summary: `Analyzed corridor intelligence database across 520 cadastral parcels and 3 active national projects matching "${queryText}".`,
      keyMetrics: [
        { label: 'Monitored Corridors', value: '3 Projects' },
        { label: 'Parcels Analyzed', value: '520 Plots' },
        { label: 'Average Risk', value: '44 / 100' }
      ],
      matchingParcels: [
        { id: 'K-125/2', khasraNo: '125/2', village: 'Kanhauli', riskScore: 72 },
        { id: 'K-412/1', khasraNo: '412/1', village: 'Kanhauli', riskScore: 64 }
      ],
      actionLink: { label: 'Open High-Risk Parcels Dossier', targetModule: 'ai_intelligence' }
    };
  }

  // =========================================================================
  // FEATURE 7: EXTENSIBLE XGBOOST / ML ARCHITECTURE CONTRACT
  // =========================================================================
  public mlPredictor: IXGBoostPredictor = {
    modelName: 'XGBoost-Cadastral-Delay-Forecaster',
    modelVersion: 'v2.4.0-weights-202603',
    async predictDelay(features) {
      // Deterministic evaluation simulating a trained gradient boosted regression tree
      const delay = Math.round(
        features.compensationDelayRatio * 40 +
        features.disputeRate * 35 +
        features.verificationBacklogRatio * 25 +
        features.missingDocumentRatio * 15 +
        features.milestoneVarianceDays * 0.5
      );

      return {
        delayDays: delay || 42,
        confidenceInterval: [38, 46],
        featureImportances: {
          compensationDelayRatio: 0.32,
          disputeRate: 0.27,
          verificationBacklogRatio: 0.21,
          missingDocumentRatio: 0.12,
          milestoneVarianceDays: 0.08
        }
      };
    }
  };
}

export const aiIntelligenceService = new AiIntelligenceService();
