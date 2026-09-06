import { WorkflowStage } from '../types/workflow';

export const mockWorkflowStages: WorkflowStage[] = [
  // -------------------------------------------------------------
  // STAGE 1: PROPOSAL SUBMISSION
  // -------------------------------------------------------------
  {
    id: 1,
    stageNumber: 1,
    name: 'Proposal Submission',
    shortCode: 'PRP-SUB',
    category: 'PRE_ACQUISITION',
    status: 'COMPLETED',
    startDate: '2024-01-10',
    targetDate: '2024-02-15',
    completionDate: '2024-02-10',
    responsibleAuthority: 'NHAI Project Implementation Unit (PIU) Patna',
    documents: [
      {
        id: 'wfd-1-1',
        title: 'Detailed Project Report (DPR) Alignment Annexure',
        referenceNo: 'NHAI-DPR-PRR-2024-V2',
        fileType: 'PDF',
        fileSize: '14.8 MB',
        uploadedBy: 'Project Director, NHAI PIU Patna',
        uploadDate: '2024-01-15',
        verifiedStatus: 'VERIFIED'
      },
      {
        id: 'wfd-1-2',
        title: 'Corridor RoW Land Requirement Schedule',
        referenceNo: 'LRS-PATNA-RR-PH2',
        fileType: 'XLSX',
        fileSize: '3.2 MB',
        uploadedBy: 'NHAI Technical Consultant',
        uploadDate: '2024-01-20',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [],
    remarks: 'Alignment survey and 60m Right-of-Way land plan submitted with full revenue village alignment list.',
    risk: 'LOW',
    riskFactors: ['Minor alignment buffer revisions near Danapur railway flyover interface.'],
    metrics: {
      completedCount: 1,
      totalCount: 1,
      percentage: 100,
      metricLabel: 'DPR Alignment Approval'
    }
  },

  // -------------------------------------------------------------
  // STAGE 2: DIGITAL SCRUTINY
  // -------------------------------------------------------------
  {
    id: 2,
    stageNumber: 2,
    name: 'Digital Scrutiny',
    shortCode: 'DIG-SCR',
    category: 'PRE_ACQUISITION',
    status: 'COMPLETED',
    startDate: '2024-02-12',
    targetDate: '2024-03-10',
    completionDate: '2024-03-05',
    responsibleAuthority: 'State Revenue & Land Reforms Dept (Bhu-Abhilekh)',
    documents: [
      {
        id: 'wfd-2-1',
        title: 'Automated Cadastral Cross-Verification Report',
        referenceNo: 'SCRUTINY-BIH-2024-884',
        fileType: 'PDF',
        fileSize: '4.1 MB',
        uploadedBy: 'Revenue Automated Scrutiny Engine',
        uploadDate: '2024-02-28',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [],
    remarks: 'All 6 revenue villages verified against Bihar Digital Cadastre and State Revenue Khatiyan.',
    risk: 'LOW',
    riskFactors: ['Minor spelling variations in 12 Raiyat names harmonized with Aadhaar.'],
    metrics: {
      completedCount: 1250,
      totalCount: 1250,
      percentage: 100,
      metricLabel: 'Plots Digitally Scrutinized'
    }
  },

  // -------------------------------------------------------------
  // STAGE 3: APPROVAL
  // -------------------------------------------------------------
  {
    id: 3,
    stageNumber: 3,
    name: 'Approval',
    shortCode: 'INP-APP',
    category: 'PRE_ACQUISITION',
    status: 'COMPLETED',
    startDate: '2024-03-08',
    targetDate: '2024-04-05',
    completionDate: '2024-04-02',
    responsibleAuthority: 'Ministry of Road Transport & Highways (MoRTH) / Land Committee',
    documents: [
      {
        id: 'wfd-3-1',
        title: 'Administrative Sanction & Competent Authority Order',
        referenceNo: 'MORTH-SANCTION-2024-BR-09',
        fileType: 'PDF',
        fileSize: '2.8 MB',
        uploadedBy: 'Joint Secretary, MoRTH New Delhi',
        uploadDate: '2024-04-02',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [],
    remarks: 'Administrative approval granted with initial statutory acquisition budget authorization of ₹540 Cr.',
    risk: 'LOW',
    riskFactors: ['Requires timely quarterly budget tranche drawdown.'],
    metrics: {
      completedCount: 540,
      totalCount: 540,
      percentage: 100,
      metricLabel: 'Budget Sanction (₹ Cr)'
    }
  },

  // -------------------------------------------------------------
  // STAGE 4: LAND IDENTIFICATION
  // -------------------------------------------------------------
  {
    id: 4,
    stageNumber: 4,
    name: 'Land Identification',
    shortCode: 'LND-IDN',
    category: 'PRE_ACQUISITION',
    status: 'COMPLETED',
    startDate: '2024-04-05',
    targetDate: '2024-05-15',
    completionDate: '2024-05-12',
    responsibleAuthority: 'CALA / SDM Patna Sadar & Circle Officers',
    documents: [
      {
        id: 'wfd-4-1',
        title: 'Cadastral Land Schedule & Khasra Register',
        referenceNo: 'CALA-LID-2024-REG-PAT',
        fileType: 'XLSX',
        fileSize: '5.6 MB',
        uploadedBy: 'Circle Officer Bihta & Naubatpur',
        uploadDate: '2024-05-10',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [],
    remarks: 'Complete enumeration of 1,250 parcels covering 340.0 Hectares across 6 Mauzas completed.',
    risk: 'LOW',
    riskFactors: ['Identification of non-encumbered government wasteland pockets along corridor.'],
    metrics: {
      completedCount: 1250,
      totalCount: 1250,
      percentage: 100,
      metricLabel: 'Cadastral Parcels Mapped'
    }
  },

  // -------------------------------------------------------------
  // STAGE 5: GIS MAPPING
  // -------------------------------------------------------------
  {
    id: 5,
    stageNumber: 5,
    name: 'GIS Mapping',
    shortCode: 'GIS-MAP',
    category: 'PRE_ACQUISITION',
    status: 'COMPLETED',
    startDate: '2024-05-15',
    targetDate: '2024-06-30',
    completionDate: '2024-06-25',
    responsibleAuthority: 'National Informatics Centre (NIC) & ISRO Bhuvan Spatial Cell',
    documents: [
      {
        id: 'wfd-5-1',
        title: 'Geo-Referenced Corridor RoW Cadastral Vector Layer',
        referenceNo: 'GIS-GEOJSON-PRR-ROW-V3',
        fileType: 'GEOJSON',
        fileSize: '8.9 MB',
        uploadedBy: 'NIC GIS Specialist',
        uploadDate: '2024-06-22',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [],
    remarks: '60m statutory RoW buffer polygon geo-referenced to WGS84 Datum and overlaid on MapLibre cadastral tiles.',
    risk: 'LOW',
    riskFactors: ['High accuracy DGPS RTK boundary tie-ins achieved across all tri-junction pillars.'],
    metrics: {
      completedCount: 38.4,
      totalCount: 38.4,
      percentage: 100,
      metricLabel: 'Corridor Alignment Geo-Referenced (km)'
    }
  },

  // -------------------------------------------------------------
  // STAGE 6: SIA (SOCIAL IMPACT ASSESSMENT)
  // -------------------------------------------------------------
  {
    id: 6,
    stageNumber: 6,
    name: 'SIA',
    shortCode: 'SIA-STG',
    category: 'PRE_ACQUISITION',
    status: 'COMPLETED',
    startDate: '2024-07-01',
    targetDate: '2024-08-30',
    completionDate: '2024-08-28',
    responsibleAuthority: 'State SIA Unit / A.N. Sinha Institute of Social Studies',
    documents: [
      {
        id: 'wfd-6-1',
        title: 'Comprehensive Social Impact Assessment (SIA) Study',
        referenceNo: 'SIA-BIH-PATNA-2024-FIN',
        fileType: 'PDF',
        fileSize: '12.4 MB',
        uploadedBy: 'Director, State SIA Unit',
        uploadDate: '2024-08-25',
        verifiedStatus: 'VERIFIED'
      },
      {
        id: 'wfd-6-2',
        title: 'Gram Sabha Public Hearing Resolutions & Minutes',
        referenceNo: 'SIA-GS-MINUTES-2024-06',
        fileType: 'PDF',
        fileSize: '3.6 MB',
        uploadedBy: 'Panchayat Secretary Kanhauli',
        uploadDate: '2024-08-28',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [],
    remarks: 'Public hearings conducted across all 6 Panchayats. Gram Sabha endorsements secured with R&R mitigation plans.',
    risk: 'MEDIUM',
    riskFactors: ['Public demands for additional cattle underpass at Ch. 14+200 incorporated into design.'],
    metrics: {
      completedCount: 6,
      totalCount: 6,
      percentage: 100,
      metricLabel: 'Gram Sabha Clearances Secured'
    }
  },

  // -------------------------------------------------------------
  // STAGE 7: PRELIMINARY NOTIFICATION
  // -------------------------------------------------------------
  {
    id: 7,
    stageNumber: 7,
    name: 'Preliminary Notification',
    shortCode: 'NOT-3A',
    category: 'STATUTORY_NOTIFICATION',
    status: 'COMPLETED',
    startDate: '2024-09-01',
    targetDate: '2024-10-15',
    completionDate: '2024-10-10',
    responsibleAuthority: 'MoRTH / Gazette of India Directorate of Printing',
    documents: [
      {
        id: 'wfd-7-1',
        title: 'Gazette of India Extraordinary Section 3A Publication',
        referenceNo: 'S.O. 1422(E) / MoRTH-2024',
        fileType: 'PDF',
        fileSize: '2.1 MB',
        uploadedBy: 'Gazette Integration API',
        uploadDate: '2024-10-10',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [],
    remarks: 'Statutory intention to acquire published in Official Gazette and two local vernacular newspapers (Dainik Jagran & Hindustan).',
    risk: 'LOW',
    riskFactors: ['Public display on Tehsil notice boards verified.'],
    metrics: {
      completedCount: 1250,
      totalCount: 1250,
      percentage: 100,
      metricLabel: 'Plots Formally Notified'
    }
  },

  // -------------------------------------------------------------
  // STAGE 8: OBJECTION / HEARING (HIGHLIGHTED DELAYED MILESTONE)
  // -------------------------------------------------------------
  {
    id: 8,
    stageNumber: 8,
    name: 'Objection / Hearing',
    shortCode: 'OBJ-3C',
    category: 'STATUTORY_NOTIFICATION',
    status: 'DELAYED',
    startDate: '2026-01-10',
    targetDate: '2026-02-15',
    completionDate: undefined,
    delayDays: 28,
    responsibleAuthority: 'Competent Authority for Land Acquisition (CALA) Patna',
    documents: [
      {
        id: 'wfd-8-1',
        title: 'CALA Section 3C Hearing Register & Objections Record',
        referenceNo: 'CALA-3C-HEARINGS-2025',
        fileType: 'PDF',
        fileSize: '6.4 MB',
        uploadedBy: 'CALA Bench Clerk',
        uploadDate: '2025-01-20',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [
      {
        id: 'act-8-1',
        title: 'Section 3C Objections Adjudication Hearing',
        description: 'Complete hearings on 18 pending objection petitions for Naubatpur & Kanhauli.',
        assignedAuthority: 'CALA / Addl. Collector Patna',
        priority: 'URGENT',
        dueDate: '2026-03-15',
        actionKey: 'HEARING',
        status: 'OPEN',
        countMetric: '18 petitions pending'
      },
      {
        id: 'act-8-2',
        title: 'Danapur Civil Court Stay Vacation Petition',
        description: 'Advocate General filing reply on Khasra 516 title injunction writ petition.',
        assignedAuthority: 'District Legal Cell & NHAI Counsel',
        priority: 'URGENT',
        dueDate: '2026-03-20',
        actionKey: 'REVIEW',
        status: 'IN_REVIEW',
        countMetric: '1 injunction active'
      }
    ],
    remarks: 'Hearings 92% complete. 18 disputed plots pending adjudication before CALA court due to co-sharer partition disputes and court stay.',
    risk: 'HIGH',
    riskFactors: [
      'Civil Court interim injunction on Khasra 516 (Naubatpur)',
      'Boundary deviation discrepancy on Khasra 125/2 requiring re-measurement'
    ],
    metrics: {
      completedCount: 142,
      pendingCount: 18,
      totalCount: 160,
      percentage: 88.8,
      metricLabel: 'Objections Adjudicated'
    }
  },

  // -------------------------------------------------------------
  // STAGE 9: DECLARATION
  // -------------------------------------------------------------
  {
    id: 9,
    stageNumber: 9,
    name: 'Declaration',
    shortCode: 'DEC-3D',
    category: 'STATUTORY_NOTIFICATION',
    status: 'IN_PROGRESS',
    startDate: '2026-02-20',
    targetDate: '2026-10-30',
    completionDate: undefined,
    responsibleAuthority: 'Ministry of Road Transport & Highways (MoRTH)',
    documents: [
      {
        id: 'wfd-9-1',
        title: 'Draft Section 3D Vesting Declaration Schedule',
        referenceNo: 'MORTH-3D-DRAFT-2025-PAT',
        fileType: 'PDF',
        fileSize: '3.9 MB',
        uploadedBy: 'NHAI PIU Legal Officer',
        uploadDate: '2025-02-05',
        verifiedStatus: 'PENDING'
      }
    ],
    pendingActions: [
      {
        id: 'act-9-1',
        title: 'Finalize Section 3D Declaration Gazette Print Draft',
        description: 'Compile cleared plots list from Section 3C hearings for Union Government vesting.',
        assignedAuthority: 'MoRTH Gazette Cell',
        priority: 'HIGH',
        dueDate: '2026-03-25',
        actionKey: 'REVIEW',
        status: 'OPEN',
        countMetric: '1,232 cleared plots'
      }
    ],
    remarks: 'Vesting schedule prepared for 1,232 parcels; awaiting clearance of remaining 18 contested plots from CALA court.',
    risk: 'MEDIUM',
    riskFactors: ['Must exclude stayed parcels or acquire subject to Section 3H(4) Court escrow.'],
    metrics: {
      completedCount: 1232,
      pendingCount: 18,
      totalCount: 1250,
      percentage: 98.5,
      metricLabel: 'Parcels Cleared for Vesting'
    }
  },

  // -------------------------------------------------------------
  // STAGE 10: AWARD
  // -------------------------------------------------------------
  {
    id: 10,
    stageNumber: 10,
    name: 'Award',
    shortCode: 'AWD-3G',
    category: 'VALUATION_COMPENSATION',
    status: 'IN_PROGRESS',
    startDate: '2026-05-01',
    targetDate: '2026-11-30',
    completionDate: undefined,
    responsibleAuthority: 'CALA Patna & Valuation Committee',
    documents: [
      {
        id: 'wfd-10-1',
        title: 'General Award Determination Order under Section 3G',
        referenceNo: 'CALA-GEN-AWARD-2025-01',
        fileType: 'PDF',
        fileSize: '7.8 MB',
        uploadedBy: 'CALA Patna',
        uploadDate: '2025-07-15',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [
      {
        id: 'act-10-1',
        title: 'Sign Supplementary Award Schedules for Tree & Structure Assets',
        description: 'Incorporate PWD Building & Horticulture Department valuations into general award.',
        assignedAuthority: 'Additional Collector (LA) Patna',
        priority: 'HIGH',
        dueDate: '2026-03-28',
        actionKey: 'SANCTION',
        status: 'OPEN',
        countMetric: '42 supplementary awards'
      }
    ],
    remarks: 'Circle rate multipliers and 100% Solatium computed. Individual award notices issued across 5 of 6 Mauzas.',
    risk: 'MEDIUM',
    riskFactors: ['High commercial land value contestation near Danapur bypass intersection.'],
    metrics: {
      completedCount: 1180,
      pendingCount: 70,
      totalCount: 1250,
      percentage: 94.4,
      metricLabel: 'Individual Awards Determined'
    }
  },

  // -------------------------------------------------------------
  // STAGE 11: COMPENSATION ASSESSMENT (USER HIGHLIGHT: 1025 COMPLETED, 225 PENDING)
  // -------------------------------------------------------------
  {
    id: 11,
    stageNumber: 11,
    name: 'Compensation Assessment',
    shortCode: 'CMP-ASM',
    category: 'VALUATION_COMPENSATION',
    status: 'IN_PROGRESS',
    startDate: '2026-07-01',
    targetDate: '2026-12-31',
    completionDate: undefined,
    responsibleAuthority: 'CALA Revenue Assessment Team & Circle Officers',
    documents: [
      {
        id: 'wfd-11-1',
        title: 'Individual Title & Apportionment Verification Register',
        referenceNo: 'CALA-APPORT-2025-PAT',
        fileType: 'XLSX',
        fileSize: '9.2 MB',
        uploadedBy: 'Senior Revenue Officer, CALA',
        uploadDate: '2025-11-20',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [
      {
        id: 'act-11-1',
        title: 'Co-Sharer Title Apportionment Verification',
        description: 'Verify legal heir succession certificates and bank mandate forms for remaining 225 plots.',
        assignedAuthority: 'Circle Officer Bihta & Naubatpur',
        priority: 'HIGH',
        dueDate: '2026-04-10',
        actionKey: 'REVIEW',
        status: 'OPEN',
        countMetric: '225 pending'
      },
      {
        id: 'act-11-2',
        title: 'Aadhaar-Seeded Bank Account Mandate Validation',
        description: 'PFMS automated beneficiary pre-validation before DBT fund trigger.',
        assignedAuthority: 'State Bank of India Escrow Branch',
        priority: 'MEDIUM',
        dueDate: '2026-04-15',
        actionKey: 'SANCTION',
        status: 'IN_REVIEW',
        countMetric: '225 pending'
      }
    ],
    remarks: '1,025 parcels successfully verified and assessed for compensation. 225 parcels pending title clarification and co-sharer consent affidavits.',
    risk: 'MEDIUM',
    riskFactors: [
      'Ancestral joint family holdings lacking formal mutation records',
      'Absentee landowners residing outside state requiring power of attorney authentication'
    ],
    metrics: {
      completedCount: 1025,
      pendingCount: 225,
      totalCount: 1250,
      percentage: 82.0,
      metricLabel: '1,025 completed / 225 pending'
    }
  },

  // -------------------------------------------------------------
  // STAGE 12: COMPENSATION DISBURSEMENT
  // -------------------------------------------------------------
  {
    id: 12,
    stageNumber: 12,
    name: 'Compensation Disbursement',
    shortCode: 'CMP-DIS',
    category: 'VALUATION_COMPENSATION',
    status: 'IN_PROGRESS',
    startDate: '2026-08-01',
    targetDate: '2027-02-28',
    completionDate: undefined,
    responsibleAuthority: 'State Bank of India (SBI) Escrow & CALA DBT Gateway',
    documents: [
      {
        id: 'wfd-12-1',
        title: 'PFMS Direct Benefit Transfer Electronic Payment Scroll',
        referenceNo: 'PFMS-PAT-DBT-BATCH-2026',
        fileType: 'PDF',
        fileSize: '5.1 MB',
        uploadedBy: 'Accounts Officer, CALA Patna',
        uploadDate: '2026-02-15',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [
      {
        id: 'act-12-1',
        title: 'Execute Batch 14 PFMS Fund Transfer',
        description: 'Release ₹42.8 Cr DBT tranche to 180 pre-validated landowner accounts.',
        assignedAuthority: 'CALA / SBI Escrow Bank Manager',
        priority: 'URGENT',
        dueDate: '2026-03-12',
        actionKey: 'DISBURSE',
        status: 'OPEN',
        countMetric: '₹42.8 Cr pending release'
      }
    ],
    remarks: '₹380.0 Cr disbursed directly via PFMS to 980 validated bank accounts. Escrow balance of ₹90.0 Cr available for remaining tranches.',
    risk: 'LOW',
    riskFactors: ['PFMS beneficiary name mismatch rejection rate under 1.8%.'],
    metrics: {
      completedCount: 380.0,
      pendingCount: 90.0,
      totalCount: 470.0,
      percentage: 80.8,
      metricLabel: '₹380.0 Cr Disbursed / ₹90.0 Cr Pending'
    }
  },

  // -------------------------------------------------------------
  // STAGE 13: R&R (USER HIGHLIGHT: 820 COMPLETED, 160 PENDING)
  // -------------------------------------------------------------
  {
    id: 13,
    stageNumber: 13,
    name: 'R&R',
    shortCode: 'RNR-STG',
    category: 'POSSESSION_CLOSURE',
    status: 'IN_PROGRESS',
    startDate: '2026-09-01',
    targetDate: '2027-03-31',
    completionDate: undefined,
    responsibleAuthority: 'Rehabilitation & Resettlement Commissioner / District Collector',
    documents: [
      {
        id: 'wfd-13-1',
        title: 'RFCTLARR Schedule II & III Resettlement Master Register',
        referenceNo: 'RR-PATNA-SCH2-2026-REG',
        fileType: 'XLSX',
        fileSize: '4.8 MB',
        uploadedBy: 'R&R Administrator',
        uploadDate: '2026-02-01',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [
      {
        id: 'act-13-1',
        title: 'Allot Alternate Homestead Plots in Mauza Kanhauli Abadi',
        description: 'Execute lease agreements for 160 physically displaced families requiring housing relocation.',
        assignedAuthority: 'District R&R Committee',
        priority: 'HIGH',
        dueDate: '2026-04-30',
        actionKey: 'SANCTION',
        status: 'OPEN',
        countMetric: '160 pending'
      },
      {
        id: 'act-13-2',
        title: 'Disburse Monthly Subsistence Allowance Tranches',
        description: 'Credit monthly ₹3,000 allowance to 820 verified displaced families.',
        assignedAuthority: 'R&R Nodal Officer',
        priority: 'MEDIUM',
        dueDate: '2026-03-31',
        actionKey: 'DISBURSE',
        status: 'IN_REVIEW',
        countMetric: '820 active beneficiaries'
      }
    ],
    remarks: '820 affected families successfully rehabilitated with resettlement allowance and subsistence grants. 160 families pending homestead plot handover.',
    risk: 'MEDIUM',
    riskFactors: [
      'Development of basic civic amenities (water/power) at Kanhauli resettlement colony',
      'Timely handover of alternate housing before monsoon season'
    ],
    metrics: {
      completedCount: 820,
      pendingCount: 160,
      totalCount: 980,
      percentage: 83.7,
      metricLabel: '820 completed / 160 pending'
    }
  },

  // -------------------------------------------------------------
  // STAGE 14: POSSESSION (USER HIGHLIGHT: 72%)
  // -------------------------------------------------------------
  {
    id: 14,
    stageNumber: 14,
    name: 'Possession',
    shortCode: 'POS-3E',
    category: 'POSSESSION_CLOSURE',
    status: 'IN_PROGRESS',
    startDate: '2026-02-01',
    targetDate: '2026-09-30',
    completionDate: undefined,
    responsibleAuthority: 'NHAI Project Director & District Revenue Police',
    documents: [
      {
        id: 'wfd-14-1',
        title: 'Section 3E Physical Possession Certificate & Chainage Handover',
        referenceNo: 'SEC-3E-POSSESSION-PRR-2026',
        fileType: 'PDF',
        fileSize: '8.4 MB',
        uploadedBy: 'NHAI Project Director',
        uploadDate: '2026-02-28',
        verifiedStatus: 'VERIFIED'
      }
    ],
    pendingActions: [
      {
        id: 'act-14-1',
        title: 'Clear Northern RoW Margin Boundary Encroachments',
        description: 'Remove temporary boundary structures on Ch. 12+400 to Ch. 14+800 following Section 3E notice expiry.',
        assignedAuthority: 'Executive Magistrate & Revenue Police',
        priority: 'HIGH',
        dueDate: '2026-04-15',
        actionKey: 'EVICTION',
        status: 'OPEN',
        countMetric: '10.8 km pending'
      },
      {
        id: 'act-14-2',
        title: 'Erect Concrete RoW Demarcation Boundary Pillars (Burji)',
        description: 'Fix boundary stones along newly secured 27.6 km corridor stretch.',
        assignedAuthority: 'NHAI Concessionaire & Amin Survey Team',
        priority: 'MEDIUM',
        dueDate: '2026-04-20',
        actionKey: 'INSPECTION',
        status: 'OPEN',
        countMetric: '27.6 km secured'
      }
    ],
    remarks: '72.0% physical possession secured (27.6 km of 38.4 km corridor). Demarcation boundary fence handed over to civil construction contractor.',
    risk: 'HIGH',
    riskFactors: [
      'Standing rabi crops awaiting harvesting in 10.8 km stretch',
      'Removal of unauthorized commercial sheds near Ch. 12+400'
    ],
    metrics: {
      completedCount: 27.6,
      pendingCount: 10.8,
      totalCount: 38.4,
      percentage: 72.0,
      metricLabel: '72% RoW Possession Secured'
    }
  },

  // -------------------------------------------------------------
  // STAGE 15: PROJECT CLOSURE
  // -------------------------------------------------------------
  {
    id: 15,
    stageNumber: 15,
    name: 'Project Closure',
    shortCode: 'PRJ-CLS',
    category: 'POSSESSION_CLOSURE',
    status: 'NOT_STARTED',
    startDate: '2026-10-01',
    targetDate: '2026-12-31',
    completionDate: undefined,
    responsibleAuthority: 'State Revenue Dept, CALA & NHAI Central HQ',
    documents: [],
    pendingActions: [
      {
        id: 'act-15-1',
        title: 'Final Revenue Mutation in State Land Records Portal',
        description: 'Mutate title of entire 340 Hectares into Union of India (NHAI) in Bihar Revenue Portal.',
        assignedAuthority: 'Tehsildar & Circle Officers',
        priority: 'LOW',
        dueDate: '2026-11-30',
        actionKey: 'MUTATION',
        status: 'OPEN',
        countMetric: 'All 1,250 plots'
      },
      {
        id: 'act-15-2',
        title: 'Statutory Financial Audit & Escrow Account Reconciliation',
        description: 'CAG compliance audit of ₹540 Cr land acquisition fund and escrow balance.',
        assignedAuthority: 'Principal Accountant General (Audit) Bihar',
        priority: 'MEDIUM',
        dueDate: '2026-12-15',
        actionKey: 'REVIEW',
        status: 'OPEN',
        countMetric: 'Final Audit'
      }
    ],
    remarks: 'Scheduled following 100% physical possession handover and full PFMS compensation disbursement.',
    risk: 'LOW',
    riskFactors: ['Reconciliation of unclaimed compensation funds under Section 3H(4).'],
    metrics: {
      completedCount: 0,
      pendingCount: 1,
      totalCount: 1,
      percentage: 0,
      metricLabel: 'Closure Awaiting Possession'
    }
  }
];
