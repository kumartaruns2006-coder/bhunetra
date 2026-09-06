import { DocumentEntity } from '../types/document';

export const mockDocuments: DocumentEntity[] = [
  // -------------------------------------------------------------
  // USER SHOWCASE VERSION EXAMPLE: Award_1252.pdf
  // -------------------------------------------------------------
  {
    id: 'doc-award-1252',
    name: 'Award_1252.pdf',
    category: 'AWARD',
    categoryLabel: 'Award',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    currentVersion: 'Version 3',
    uploadedBy: 'Rajeev Sinha (Circle Officer)',
    uploadedAt: '2026-03-01',
    fileSize: '3.8 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'CALA-PAT-3G-2026-A1252',
    isArchived: false,
    extractedFields: {
      documentType: { value: 'Section 3G Land Acquisition Award Decree', confidence: 98.4, verified: true },
      projectId: { value: 'PRR-PH2-2026 (Patna Ring Road Expansion)', confidence: 99.2, verified: true },
      parcelId: { value: 'K-125/2', confidence: 97.5, verified: true },
      khasra: { value: '125/2 (Mauza Kanhauli)', confidence: 98.1, verified: true },
      date: { value: '2026-03-01', confidence: 96.0, verified: true },
      area: { value: '0.48 Hectares (4,800 m²)', confidence: 95.2, verified: true },
      amount: { value: '₹4,98,39,800 (including 100% solatium)', confidence: 97.8, verified: true },
      overallConfidence: 97.4
    },
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'Rajesh Kumar (Field Officer / Amin)',
        uploadedAt: '2026-01-10',
        fileSize: '2.4 MB',
        fileName: 'Award_1252_v1_draft.pdf',
        fileHash: 'SHA-256: 0x8a91...4412',
        changeSummary: 'Initial draft valuation based on Circle Rate ₹3,200/m² without structure breakdown.'
      },
      {
        versionNumber: 'Version 2',
        uploadedBy: 'Rajeev Sinha (Circle Officer)',
        uploadedAt: '2026-02-05',
        fileSize: '3.1 MB',
        fileName: 'Award_1252_v2_reviewed.pdf',
        fileHash: 'SHA-256: 0xb4c2...99e1',
        changeSummary: 'Incorporated PWD Building structure valuation (₹8.5 Lakh) and horticulture crop survey (₹1.45 Lakh).'
      },
      {
        versionNumber: 'Version 3',
        uploadedBy: 'Additional Collector (LA) / CALA Patna',
        uploadedAt: '2026-03-01',
        fileSize: '3.8 MB',
        fileName: 'Award_1252.pdf',
        fileHash: 'SHA-256: 0xf10d...88c3',
        changeSummary: 'Final statutory award signed by CALA with 100% Solatium and 12% additional interest totaling ₹4,98,39,800.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-awd-1',
        timestamp: '2026-01-10 10:30 AM',
        action: 'UPLOADED_BY_OFFICER',
        actionLabel: 'Uploaded by Officer',
        actorName: 'Rajesh Kumar',
        actorRole: 'Field Officer (Amin)',
        version: 'Version 1',
        notes: 'Initial preliminary valuation schedule generated from cadastral measurement.',
        digitalSealHash: '0x8a91...4412'
      },
      {
        id: 'aud-awd-2',
        timestamp: '2026-01-25 03:15 PM',
        action: 'REVIEWED_BY_STATE_OFFICER',
        actionLabel: 'Reviewed by State Officer',
        actorName: 'Sanjay Sharma',
        actorRole: 'State Revenue Officer / Sub-Divisional Officer',
        version: 'Version 1',
        notes: 'Reviewed and returned for PWD structure valuation and crop assessment inclusion.',
        digitalSealHash: '0x32df...5510'
      },
      {
        id: 'aud-awd-3',
        timestamp: '2026-02-05 11:45 AM',
        action: 'VERSION_UPDATED',
        actionLabel: 'Version updated',
        actorName: 'Rajeev Sinha',
        actorRole: 'Circle Officer, Bihta',
        version: 'Version 2',
        notes: 'Updated schedule with PWD Building structure assessment added.',
        digitalSealHash: '0xb4c2...99e1'
      },
      {
        id: 'aud-awd-4',
        timestamp: '2026-03-01 02:30 PM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'Additional Collector (LA) / CALA',
        actorRole: 'Competent Authority (CALA)',
        version: 'Version 3',
        notes: 'Section 3G statutory compensation award granted official sanction with digital seal.',
        digitalSealHash: '0xf10d...88c3'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: PROJECT PROPOSAL
  // -------------------------------------------------------------
  {
    id: 'doc-prp-01',
    name: 'Detailed_Project_Report_DPR_PRR_Vol1.pdf',
    category: 'PROJECT_PROPOSAL',
    categoryLabel: 'Project Proposal',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'Corridor Alignment',
    khasraNo: 'All Khasras',
    village: 'Patna Rural & Bihta',
    currentVersion: 'Version 2',
    uploadedBy: 'NHAI PIU Technical Cell',
    uploadedAt: '2024-01-15',
    fileSize: '16.4 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'NHAI-DPR-PRR-2024-V2',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'Engineering Consultant',
        uploadedAt: '2023-12-01',
        fileSize: '14.2 MB',
        fileName: 'DPR_Draft_RevA.pdf',
        fileHash: 'SHA-256: 0x91da...2231',
        changeSummary: 'Initial alignment feasibility draft.'
      },
      {
        versionNumber: 'Version 2',
        uploadedBy: 'NHAI PIU Technical Cell',
        uploadedAt: '2024-01-15',
        fileSize: '16.4 MB',
        fileName: 'Detailed_Project_Report_DPR_PRR_Vol1.pdf',
        fileHash: 'SHA-256: 0xaa42...9901',
        changeSummary: 'Final DPR approved by MoRTH with 60m RoW corridor.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-prp-1',
        timestamp: '2024-01-15 09:00 AM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'Project Director, NHAI PIU Patna',
        actorRole: 'NHAI_PD',
        version: 'Version 2',
        notes: 'Final DPR accepted for Section 3A initiation.',
        digitalSealHash: '0xaa42...9901'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: LAND RECORDS
  // -------------------------------------------------------------
  {
    id: 'doc-lnd-01',
    name: 'Khatiyan_Extract_RoR_K125_2.pdf',
    category: 'LAND_RECORDS',
    categoryLabel: 'Land Records',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    currentVersion: 'Version 1',
    uploadedBy: 'Circle Officer Bihta',
    uploadedAt: '2024-03-10',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'ROR-BIH-2024-K125-2',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'Circle Officer Bihta',
        uploadedAt: '2024-03-10',
        fileSize: '2.4 MB',
        fileName: 'Khatiyan_Extract_RoR_K125_2.pdf',
        fileHash: 'SHA-256: 0x44c1...8819',
        changeSummary: 'Certified record of rights extracted from Bihar Bhu-Abhilekh portal.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-lnd-1',
        timestamp: '2024-03-10 11:15 AM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'Circle Officer Bihta',
        actorRole: 'ADMIN',
        version: 'Version 1',
        notes: 'Ownership and Khata #48 certified.',
        digitalSealHash: '0x44c1...8819'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: NOTIFICATIONS
  // -------------------------------------------------------------
  {
    id: 'doc-not-01',
    name: 'Gazette_Notification_Section_3A_PRR.pdf',
    category: 'NOTIFICATIONS',
    categoryLabel: 'Notifications',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'All Parcels',
    khasraNo: 'Mauzas Kanhauli, Naubatpur',
    village: 'Kanhauli & Naubatpur',
    currentVersion: 'Version 1',
    uploadedBy: 'MoRTH Gazette Directorate',
    uploadedAt: '2024-04-12',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'S.O. 1422(E) / MoRTH-BR',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'MoRTH Gazette Directorate',
        uploadedAt: '2024-04-12',
        fileSize: '2.1 MB',
        fileName: 'Gazette_Notification_Section_3A_PRR.pdf',
        fileHash: 'SHA-256: 0x77c2...e810',
        changeSummary: 'Extraordinary Gazette publication of Section 3A intention to acquire.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-not-1',
        timestamp: '2024-04-12 09:00 AM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'Gazette Directorate',
        actorRole: 'CENTRAL_AUTHORITY',
        version: 'Version 1',
        notes: 'Published in Gazette of India Extraordinary.',
        digitalSealHash: '0x77c2...e810'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: SIA (SOCIAL IMPACT ASSESSMENT)
  // -------------------------------------------------------------
  {
    id: 'doc-sia-01',
    name: 'SIA_Comprehensive_Study_Report_PRR.pdf',
    category: 'SIA',
    categoryLabel: 'SIA',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'Corridor Alignment',
    khasraNo: 'All Khasras',
    village: 'All 6 Mauzas',
    currentVersion: 'Version 1',
    uploadedBy: 'State SIA Unit (A.N. Sinha Institute)',
    uploadedAt: '2024-08-28',
    fileSize: '12.4 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'SIA-BIH-PATNA-2024-FIN',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'State SIA Unit',
        uploadedAt: '2024-08-28',
        fileSize: '12.4 MB',
        fileName: 'SIA_Comprehensive_Study_Report_PRR.pdf',
        fileHash: 'SHA-256: 0xbb81...3321',
        changeSummary: 'Final Social Impact Assessment report with Gram Sabha resolutions.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-sia-1',
        timestamp: '2024-08-28 04:00 PM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'Director, State SIA Unit',
        actorRole: 'STATE_REVIEW',
        version: 'Version 1',
        notes: 'SIA recommendations approved by Expert Group.',
        digitalSealHash: '0xbb81...3321'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: OBJECTION / HEARING
  // -------------------------------------------------------------
  {
    id: 'doc-obj-01',
    name: 'Section_3C_Hearing_Register_Orders.pdf',
    category: 'OBJECTION_HEARING',
    categoryLabel: 'Objection/Hearing',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'K-516',
    khasraNo: '516',
    village: 'Naubatpur',
    currentVersion: 'Version 2',
    uploadedBy: 'CALA Bench Clerk',
    uploadedAt: '2025-01-20',
    fileSize: '6.4 MB',
    fileType: 'PDF',
    status: 'DISCREPANCY',
    aiStatus: 'EXTRACTED',
    referenceNo: 'CALA-CASE-3C-2025-118',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'CALA Bench Clerk',
        uploadedAt: '2024-11-15',
        fileSize: '4.8 MB',
        fileName: 'Hearing_Record_Nov2024.pdf',
        fileHash: 'SHA-256: 0x1123...9902',
        changeSummary: 'Objection petitions recorded from co-sharers.'
      },
      {
        versionNumber: 'Version 2',
        uploadedBy: 'CALA Bench Clerk',
        uploadedAt: '2025-01-20',
        fileSize: '6.4 MB',
        fileName: 'Section_3C_Hearing_Register_Orders.pdf',
        fileHash: 'SHA-256: 0x3341...1189',
        changeSummary: 'Interim stay order copy from Danapur Civil Court attached.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-obj-1',
        timestamp: '2025-01-20 11:30 AM',
        action: 'REVIEWED_BY_STATE_OFFICER',
        actionLabel: 'Reviewed by State Officer',
        actorName: 'CALA Patna',
        actorRole: 'CALA',
        version: 'Version 2',
        notes: 'Dispute flagged on Khasra 516. Stay vacation reply filed.',
        digitalSealHash: '0x3341...1189'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: DECLARATION
  // -------------------------------------------------------------
  {
    id: 'doc-dec-01',
    name: 'Section_3D_Vesting_Declaration_Draft.pdf',
    category: 'DECLARATION',
    categoryLabel: 'Declaration',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'Cleared Parcels (1,232)',
    khasraNo: 'Multiple Khasras',
    village: 'All 6 Mauzas',
    currentVersion: 'Version 1',
    uploadedBy: 'NHAI PIU Legal Officer',
    uploadedAt: '2025-02-05',
    fileSize: '3.9 MB',
    fileType: 'PDF',
    status: 'PENDING_REVIEW',
    aiStatus: 'EXTRACTED',
    referenceNo: 'MORTH-3D-DRAFT-2025-PAT',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'NHAI PIU Legal Officer',
        uploadedAt: '2025-02-05',
        fileSize: '3.9 MB',
        fileName: 'Section_3D_Vesting_Declaration_Draft.pdf',
        fileHash: 'SHA-256: 0xdd41...6612',
        changeSummary: 'Draft vesting declaration for 1,232 cleared parcels.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-dec-1',
        timestamp: '2025-02-05 02:15 PM',
        action: 'UPLOADED_BY_OFFICER',
        actionLabel: 'Uploaded by Officer',
        actorName: 'NHAI PIU Legal Officer',
        actorRole: 'FIELD_OFFICER',
        version: 'Version 1',
        notes: 'Submitted for Gazette extraordinary print clearance.',
        digitalSealHash: '0xdd41...6612'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: COMPENSATION
  // -------------------------------------------------------------
  {
    id: 'doc-cmp-01',
    name: 'Compensation_Sanction_Escrow_Order.pdf',
    category: 'COMPENSATION',
    categoryLabel: 'Compensation',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    currentVersion: 'Version 1',
    uploadedBy: 'Accounts Officer, CALA Patna',
    uploadedAt: '2026-02-18',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'CALA-FIN-2026-SAN-142',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'Accounts Officer, CALA Patna',
        uploadedAt: '2026-02-18',
        fileSize: '1.2 MB',
        fileName: 'Compensation_Sanction_Escrow_Order.pdf',
        fileHash: 'SHA-256: 0xee91...3301',
        changeSummary: 'Official sanction order allocating ₹4.98 Cr to SBI Escrow Account.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-cmp-1',
        timestamp: '2026-02-18 03:45 PM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'CALA Patna',
        actorRole: 'CALA',
        version: 'Version 1',
        notes: 'Sanction voucher signed and fund allocation verified.',
        digitalSealHash: '0xee91...3301'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: R&R
  // -------------------------------------------------------------
  {
    id: 'doc-rnr-01',
    name: 'RR_Entitlement_Card_Sabha_Endorsement.pdf',
    category: 'RR',
    categoryLabel: 'R&R',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    currentVersion: 'Version 1',
    uploadedBy: 'R&R Commissioner Office',
    uploadedAt: '2026-02-25',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'RR-BR-PAT-2026-042',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'R&R Commissioner Office',
        uploadedAt: '2026-02-25',
        fileSize: '1.8 MB',
        fileName: 'RR_Entitlement_Card_Sabha_Endorsement.pdf',
        fileHash: 'SHA-256: 0x55a2...7710',
        changeSummary: 'Entitlement card confirming ₹5 Lakh relocation allowance and homestead plot.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-rnr-1',
        timestamp: '2026-02-25 10:00 AM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'Panchayat Secretary, Kanhauli',
        actorRole: 'ADMIN',
        version: 'Version 1',
        notes: 'Gram Sabha resolution endorsement verified.',
        digitalSealHash: '0x55a2...7710'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: POSSESSION
  // -------------------------------------------------------------
  {
    id: 'doc-pos-01',
    name: 'Section_3E_Possession_Certificate_Ch12.pdf',
    category: 'POSSESSION',
    categoryLabel: 'Possession',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'Ch. 0+000 to Ch. 27+600',
    khasraNo: 'Multiple Khasras',
    village: 'Kanhauli to Phulwari',
    currentVersion: 'Version 1',
    uploadedBy: 'NHAI Project Director',
    uploadedAt: '2026-02-28',
    fileSize: '8.4 MB',
    fileType: 'PDF',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'SEC-3E-POSSESSION-PRR-2026',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'NHAI Project Director',
        uploadedAt: '2026-02-28',
        fileSize: '8.4 MB',
        fileName: 'Section_3E_Possession_Certificate_Ch12.pdf',
        fileHash: 'SHA-256: 0x99f4...2211',
        changeSummary: 'Handover certificate of 27.6 km RoW corridor to civil construction contractor.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-pos-1',
        timestamp: '2026-02-28 05:00 PM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'Executive Magistrate & Revenue Police',
        actorRole: 'CALA',
        version: 'Version 1',
        notes: 'Demarcation pillars verified and physical handover completed.',
        digitalSealHash: '0x99f4...2211'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: MAPS
  // -------------------------------------------------------------
  {
    id: 'doc-map-01',
    name: 'Patna_Ring_Road_RoW_60m_Cadastral_Mosaic.geojson',
    category: 'MAPS',
    categoryLabel: 'Maps',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'Corridor RoW',
    khasraNo: 'All Khasras',
    village: 'All 6 Villages',
    currentVersion: 'Version 3',
    uploadedBy: 'NIC GIS Specialist',
    uploadedAt: '2024-06-25',
    fileSize: '8.9 MB',
    fileType: 'GEOJSON',
    status: 'VERIFIED',
    aiStatus: 'EXTRACTED',
    referenceNo: 'GIS-GEOJSON-PRR-ROW-V3',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'Survey Consultant',
        uploadedAt: '2024-04-10',
        fileSize: '6.2 MB',
        fileName: 'RoW_Buffer_Draft.geojson',
        fileHash: 'SHA-256: 0x11c2...4419',
        changeSummary: 'Initial alignment centerline buffer.'
      },
      {
        versionNumber: 'Version 2',
        uploadedBy: 'State Remote Sensing Centre',
        uploadedAt: '2024-05-20',
        fileSize: '7.8 MB',
        fileName: 'Cadastral_Overlay_RevB.geojson',
        fileHash: 'SHA-256: 0x22d4...5521',
        changeSummary: 'Revenue boundary overlay added.'
      },
      {
        versionNumber: 'Version 3',
        uploadedBy: 'NIC GIS Specialist',
        uploadedAt: '2024-06-25',
        fileSize: '8.9 MB',
        fileName: 'Patna_Ring_Road_RoW_60m_Cadastral_Mosaic.geojson',
        fileHash: 'SHA-256: 0x33e5...6632',
        changeSummary: 'Geo-referenced vector polygon layer with DGPS RTK boundary tie-ins.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-map-1',
        timestamp: '2024-06-25 02:00 PM',
        action: 'APPROVED',
        actionLabel: 'Approved',
        actorName: 'NIC Lead GIS Analyst',
        actorRole: 'ADMIN',
        version: 'Version 3',
        notes: 'WGS84 projection certified for MapLibre map tiles.',
        digitalSealHash: '0x33e5...6632'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: FIELD REPORTS
  // -------------------------------------------------------------
  {
    id: 'doc-fld-01',
    name: 'Amin_DGPS_Inspection_Report_K125_2.pdf',
    category: 'FIELD_REPORTS',
    categoryLabel: 'Field Reports',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    currentVersion: 'Version 1',
    uploadedBy: 'Rajesh Kumar (Amin Badge AMIN-PAT-402)',
    uploadedAt: '2026-03-02',
    fileSize: '4.5 MB',
    fileType: 'PDF',
    status: 'DISCREPANCY',
    aiStatus: 'EXTRACTED',
    referenceNo: 'JMS-PAT-2026-K125-2',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'Rajesh Kumar (Amin)',
        uploadedAt: '2026-03-02',
        fileSize: '4.5 MB',
        fileName: 'Amin_DGPS_Inspection_Report_K125_2.pdf',
        fileHash: 'SHA-256: 0x8892...1109',
        changeSummary: 'Ground-truth inspection flagging 1.4m northern boundary deviation and rabi crop.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-fld-1',
        timestamp: '2026-03-02 11:30 AM',
        action: 'UPLOADED_BY_OFFICER',
        actionLabel: 'Uploaded by Officer',
        actorName: 'Rajesh Kumar (Amin)',
        actorRole: 'FIELD_OFFICER',
        version: 'Version 1',
        notes: 'Encroachment flagged: 1.4m deviation on Northern buffer boundary. Photos uploaded.',
        digitalSealHash: '0x8892...1109'
      }
    ]
  },

  // -------------------------------------------------------------
  // CATEGORY: OTHER
  // -------------------------------------------------------------
  {
    id: 'doc-oth-01',
    name: 'High_Court_Writ_Injunction_Affidavit_K516.pdf',
    category: 'OTHER',
    categoryLabel: 'Other',
    projectId: 'PRR-PH2-2026',
    projectName: 'Patna Ring Road Expansion',
    parcelId: 'K-516',
    khasraNo: '516',
    village: 'Naubatpur',
    currentVersion: 'Version 1',
    uploadedBy: 'State Standing Counsel',
    uploadedAt: '2026-02-14',
    fileSize: '1.9 MB',
    fileType: 'PDF',
    status: 'PENDING_REVIEW',
    aiStatus: 'EXTRACTED',
    referenceNo: 'HC-PAT-CWJC-2026-981',
    isArchived: false,
    versionHistory: [
      {
        versionNumber: 'Version 1',
        uploadedBy: 'State Standing Counsel',
        uploadedAt: '2026-02-14',
        fileSize: '1.9 MB',
        fileName: 'High_Court_Writ_Injunction_Affidavit_K516.pdf',
        fileHash: 'SHA-256: 0x9912...4419',
        changeSummary: 'Counter affidavit drafted for High Court writ petition.'
      }
    ],
    auditTrail: [
      {
        id: 'aud-oth-1',
        timestamp: '2026-02-14 01:15 PM',
        action: 'UPLOADED_BY_OFFICER',
        actionLabel: 'Uploaded by Officer',
        actorName: 'State Standing Counsel',
        actorRole: 'STATE_REVIEW',
        version: 'Version 1',
        notes: 'Urgent stay vacation petition submitted before CALA Bench.',
        digitalSealHash: '0x9912...4419'
      }
    ]
  }
];
