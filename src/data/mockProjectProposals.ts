import { ProjectProposal, ScrutinyChecklistItem, ApprovalStageItem } from '../types/projectProposal';

export const defaultScrutinyChecklist: ScrutinyChecklistItem[] = [
  {
    id: 'chk-1',
    criterionKey: 'PROJECT_INFO',
    title: 'Project Information Complete',
    description: 'Alignment name, corridor length, implementing agency and sponsoring ministry verified against National Master Plan.',
    status: 'PASS',
    remarks: 'Alignment matches PM GatiShakti corridor grid ID #4812.',
    verifiedBy: 'Sanjay Sinha (Dir. Highways)',
    verifiedAt: '2026-08-10 11:30 AM'
  },
  {
    id: 'chk-2',
    criterionKey: 'LAND_REQUIREMENT',
    title: 'Land Requirement Valid & Justified',
    description: 'Acreage, Right-of-Way (RoW) width, and estimated cadastral parcel density conform to IRC engineering codes.',
    status: 'PASS',
    remarks: 'RoW width verified at 60m with 10m green buffer strips.',
    verifiedBy: 'Sanjay Sinha (Dir. Highways)',
    verifiedAt: '2026-08-10 11:45 AM'
  },
  {
    id: 'chk-3',
    criterionKey: 'DOCUMENTS',
    title: 'Statutory Documents Available & Compliant',
    description: 'Feasibility DPR, land requirement schedule, and revenue tehsil list duly stamped and signed.',
    status: 'PASS',
    remarks: 'All 4 statutory annexures present in PDF/A format.',
    verifiedBy: 'Sanjay Sinha (Dir. Highways)',
    verifiedAt: '2026-08-10 12:15 PM'
  },
  {
    id: 'chk-4',
    criterionKey: 'GIS_BOUNDARY',
    title: 'GIS Cadastral Boundary Geo-Referenced',
    description: 'Corridor center-line, RoW polygon and revenue village coordinates georeferenced to Survey of India datum (WGS84).',
    status: 'PASS',
    remarks: 'Shapefile polygon verified with zero self-intersection.',
    verifiedBy: 'GIS Cell, NIC MoRTH',
    verifiedAt: '2026-08-10 02:20 PM'
  },
  {
    id: 'chk-5',
    criterionKey: 'REQUIRED_FIELDS',
    title: 'Required Statutory Fields Complete',
    description: 'Act citation (NH Act 1956 / RFCTLARR 2013), CALA designation, and estimated compensation budget filled.',
    status: 'PASS',
    remarks: 'Section 3A statutory references verified.',
    verifiedBy: 'Sanjay Sinha (Dir. Highways)',
    verifiedAt: '2026-08-10 03:05 PM'
  }
];

export const createStandardApprovalStages = (
  districtOfficer: string,
  districtDesignation: string,
  stateOfficer: string,
  stateDesignation: string,
  centralOfficer: string,
  centralDesignation: string
): ApprovalStageItem[] => [
  {
    stageKey: 'SUBMISSION',
    stageTitle: 'Agency Proposal Submission',
    level: 'SUBMITTER',
    officerName: 'Er. Sunita Murthy',
    officerDesignation: 'Chief GM & Project Director, NHAI',
    jurisdiction: 'Project Division',
    date: '2026-08-01',
    status: 'APPROVED',
    remarks: 'Initial DPR and land acquisition schedule submitted to Ministry portal.'
  },
  {
    stageKey: 'DISTRICT_REVIEW',
    stageTitle: 'District Revenue Review (CALA / DM)',
    level: 'DISTRICT',
    officerName: districtOfficer,
    officerDesignation: districtDesignation,
    jurisdiction: 'Revenue District Administration',
    date: '2026-08-12',
    status: 'APPROVED',
    remarks: 'Revenue records cross-checked with District Khatian; initial village list validated.'
  },
  {
    stageKey: 'STATE_REVIEW',
    stageTitle: 'State Revenue & PWD Scrutiny',
    level: 'STATE',
    officerName: stateOfficer,
    officerDesignation: stateDesignation,
    jurisdiction: 'State Revenue Department',
    date: '2026-08-20',
    status: 'APPROVED',
    remarks: 'State alignment committee granted concurrence; no overlap with state irrigation projects.'
  },
  {
    stageKey: 'CENTRAL_AUTHORITY',
    stageTitle: 'Central Ministry / Competent Authority Sanction',
    level: 'CENTRAL',
    officerName: centralOfficer,
    officerDesignation: centralDesignation,
    jurisdiction: 'MoRTH Central Gazette Authority',
    date: '2026-08-28',
    status: 'APPROVED',
    remarks: 'Section 3A statutory approval sanctioned; Gazette release authorized.'
  },
  {
    stageKey: 'FINAL_APPROVAL',
    stageTitle: 'Gazette Release & Portal Activation',
    level: 'APPROVAL',
    officerName: 'Gazette Officer of India',
    officerDesignation: 'Directorate of Printing, New Delhi',
    jurisdiction: 'Government of India',
    date: '2026-09-02',
    status: 'APPROVED',
    remarks: 'Gazette extraordinary notification published. Corridor activated in BhuNetra.'
  }
];

export const mockProjectProposals: ProjectProposal[] = [
  {
    id: 'PRJ-2026-001',
    code: 'NHAI-BR-PRR-PH2',
    name: 'Patna Ring Road Expansion (Phase II)',
    department: 'MoRTH / NHAI',
    projectType: 'RING_ROAD',
    state: 'Bihar',
    district: 'Patna',
    subDistricts: ['Bihta', 'Danapur', 'Naubatpur', 'Phulwari'],
    implementingAgency: 'NHAI Regional Office, Patna (PIU Patna)',
    description: 'Construction of 6-lane peripheral expressway ring connecting Kanhauli junction with Digha bridge approach to bypass congested urban traffic.',
    totalLandRequiredAcres: 614,
    estimatedParcelsCount: 482,
    landType: 'MIXED',
    corridorLengthKm: 38.4,
    rightOfWayWidthM: 60,
    proposalDate: '2026-08-01',
    targetDate: '2026-12-31',
    milestones: [
      { id: 'ms-1', title: 'Section 3A Gazette Notification', targetDate: '2026-08-15', stageRef: 'Sec 3A' },
      { id: 'ms-2', title: 'Joint Measurement Survey (JMS)', targetDate: '2026-09-30', stageRef: 'RFCTLARR Sec 12' },
      { id: 'ms-3', title: 'Section 3D Declaration Publication', targetDate: '2026-11-15', stageRef: 'Sec 3D' },
      { id: 'ms-4', title: 'Section 3G Compensation Award', targetDate: '2026-12-31', stageRef: 'Sec 3G' }
    ],
    documents: [
      { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'Detailed Project Report (DPR)', fileName: 'Patna_Ring_Road_Ph2_DPR.pdf', fileSize: '14.2 MB', uploadedAt: '2026-08-01', verified: true },
      { id: 'doc-2', type: 'LAND_REQUIREMENT_DOC', title: 'Land Schedule & Village Khatian', fileName: 'Land_Schedule_6_Villages.pdf', fileSize: '6.8 MB', uploadedAt: '2026-08-01', verified: true },
      { id: 'doc-3', type: 'PROJECT_MAP', title: 'GIS Alignment Shapefile & KMZ', fileName: 'PRR_Ph2_WGS84_Corridor.kml', fileSize: '3.4 MB', uploadedAt: '2026-08-01', verified: true },
      { id: 'doc-4', type: 'SUPPORTING_DOC', title: 'Environmental Clearance In-Principle', fileName: 'EC_Stage1_MoEFCC.pdf', fileSize: '2.1 MB', uploadedAt: '2026-08-02', verified: true }
    ],
    scrutinyChecklist: defaultScrutinyChecklist,
    scrutinyRemarks: 'All 5 statutory scrutiny parameters verified. Project approved for full acquisition workflow.',
    scrutinyCompletedBy: 'Sanjay Sinha (Dir. Highways)',
    scrutinyCompletedAt: '2026-08-10 03:05 PM',
    approvalStages: createStandardApprovalStages(
      'Dr. Anand Kishore, IAS', 'District Collector, Patna',
      'Shri Pradeep K. Jha, IAS', 'Principal Secretary (Revenue), Bihar',
      'Shri Alok Ranjan, IAS', 'Joint Secretary (Land & Highways), MoRTH'
    ),
    currentApprovalStage: 'FINAL_APPROVAL',
    status: 'APPROVED',
    progressPercent: 100,
    riskLevel: 'HIGH',
    estimatedCostCr: 482.60,
    auditTrail: [
      { id: 'aud-1', timestamp: '2026-08-01 10:00 AM', action: 'PROPOSAL_SUBMITTED', actor: 'Er. Sunita Murthy', role: 'Project Director', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Corridor proposal registered on portal' },
      { id: 'aud-2', timestamp: '2026-08-10 03:15 PM', action: 'SCRUTINY_PASSED', actor: 'Sanjay Sinha', role: 'Scrutiny Officer', previousStatus: 'SUBMITTED', newStatus: 'UNDER_SCRUTINY', remarks: 'Digital checklist marked 5/5 PASS' },
      { id: 'aud-3', timestamp: '2026-08-20 04:00 PM', action: 'STATE_REVIEW_APPROVED', actor: 'Pradeep Jha', role: 'Principal Secy', remarks: 'State Revenue Department gave administrative concurrence' },
      { id: 'aud-4', timestamp: '2026-08-28 05:30 PM', action: 'CENTRAL_SANCTION_ISSUED', actor: 'Alok Ranjan', role: 'Joint Secretary', previousStatus: 'UNDER_SCRUTINY', newStatus: 'APPROVED', remarks: 'Section 3A statutory approval signed' }
    ]
  },
  {
    id: 'PRJ-2026-002',
    code: 'NHAI-BR-NH119D',
    name: 'Amas-Darbhanga Expressway (Corridor 3)',
    department: 'MoRTH / NHAI',
    projectType: 'EXPRESSWAY',
    state: 'Bihar',
    district: 'Jehanabad',
    subDistricts: ['Masaudhi', 'Dhanarua', 'Jehanabad Sadar'],
    implementingAgency: 'NHAI PIU Gaya & Patna',
    description: 'Four-lane access-controlled greenfield expressway connecting South Bihar with North Bihar via amity corridors.',
    totalLandRequiredAcres: 964,
    estimatedParcelsCount: 620,
    landType: 'AGRICULTURAL',
    corridorLengthKm: 64.2,
    rightOfWayWidthM: 70,
    proposalDate: '2026-08-14',
    targetDate: '2026-10-31',
    milestones: [
      { id: 'ms-1', title: 'Joint Measurement Survey (JMS)', targetDate: '2026-09-15', stageRef: 'RFCTLARR Sec 12' },
      { id: 'ms-2', title: 'Section 3D Declaration', targetDate: '2026-10-15', stageRef: 'Sec 3D' }
    ],
    documents: [
      { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'Amas Darbhanga DPR Feasibility', fileName: 'NH119D_Expressway_DPR.pdf', fileSize: '18.4 MB', uploadedAt: '2026-08-14', verified: true },
      { id: 'doc-2', type: 'PROJECT_MAP', title: 'Survey of India Alignment Map', fileName: 'SOI_NH119D_Map.pdf', fileSize: '5.2 MB', uploadedAt: '2026-08-14', verified: true }
    ],
    scrutinyChecklist: [
      { id: 'chk-1', criterionKey: 'PROJECT_INFO', title: 'Project Information Complete', description: 'Alignment coordinates verified.', status: 'PASS', remarks: 'Verified against Bharatmala corridor specs.' },
      { id: 'chk-2', criterionKey: 'LAND_REQUIREMENT', title: 'Land Requirement Valid & Justified', description: 'Acreage calculation verified.', status: 'PASS', remarks: 'Agricultural parcel schedule checks out.' },
      { id: 'chk-3', criterionKey: 'DOCUMENTS', title: 'Statutory Documents Available & Compliant', description: 'DPR and Soil report checked.', status: 'PASS', remarks: 'Complete.' },
      { id: 'chk-4', criterionKey: 'GIS_BOUNDARY', title: 'GIS Cadastral Boundary Geo-Referenced', description: 'Boundary overlay on Bhunaksha.', status: 'NEEDS_CLARIFICATION', remarks: 'Masaudhi bypass curvature requires 20m buffer validation.' },
      { id: 'chk-5', criterionKey: 'REQUIRED_FIELDS', title: 'Required Statutory Fields Complete', description: 'Statutory forms verified.', status: 'PASS', remarks: 'Valid.' }
    ],
    scrutinyRemarks: 'Digital scrutiny underway. Pending clarification on Masaudhi bypass GIS curvature.',
    approvalStages: [
      { stageKey: 'SUBMISSION', stageTitle: 'Agency Proposal Submission', level: 'SUBMITTER', officerName: 'NHAI PIU Gaya Team', officerDesignation: 'Executive Engineer', jurisdiction: 'Gaya PIU', date: '2026-08-14', status: 'APPROVED', remarks: 'Submitted.' },
      { stageKey: 'DISTRICT_REVIEW', stageTitle: 'District Revenue Review (CALA / DM)', level: 'DISTRICT', officerName: 'District Collector, Jehanabad', officerDesignation: 'DM', jurisdiction: 'Jehanabad', date: '2026-08-22', status: 'UNDER_REVIEW', remarks: 'Under scrutiny by District Revenue Officer.' },
      { stageKey: 'STATE_REVIEW', stageTitle: 'State Revenue & PWD Scrutiny', level: 'STATE', officerName: 'Revenue Principal Secretary', officerDesignation: 'IAS', jurisdiction: 'Bihar', date: '-', status: 'PENDING', remarks: 'Awaiting District clearance.' },
      { stageKey: 'CENTRAL_AUTHORITY', stageTitle: 'Central Ministry Sanction', level: 'CENTRAL', officerName: 'MoRTH Joint Secretary', officerDesignation: 'IAS', jurisdiction: 'New Delhi', date: '-', status: 'PENDING', remarks: 'Pending.' },
      { stageKey: 'FINAL_APPROVAL', stageTitle: 'Gazette Release & Portal Activation', level: 'APPROVAL', officerName: 'Gazette Officer', officerDesignation: 'Director', jurisdiction: 'Central', date: '-', status: 'PENDING', remarks: 'Pending.' }
    ],
    currentApprovalStage: 'DISTRICT_REVIEW',
    status: 'UNDER_SCRUTINY',
    progressPercent: 45,
    riskLevel: 'MEDIUM',
    estimatedCostCr: 710.0,
    auditTrail: [
      { id: 'aud-1', timestamp: '2026-08-14 11:00 AM', action: 'PROPOSAL_SUBMITTED', actor: 'NHAI PIU Team', role: 'Implementing Agency', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Proposal submitted.' },
      { id: 'aud-2', timestamp: '2026-08-20 02:30 PM', action: 'SCRUTINY_INITIATED', actor: 'Review Officer', role: 'Scrutinizer', previousStatus: 'SUBMITTED', newStatus: 'UNDER_SCRUTINY', remarks: 'Digital checklist initiated.' }
    ]
  },
  {
    id: 'PRJ-2026-003',
    code: 'UPEIDA-UP-GNG-P1',
    name: 'Ganga Expressway Mega Corridor (Package 1)',
    department: 'MoRTH / NHAI',
    projectType: 'EXPRESSWAY',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    subDistricts: ['Varanasi Sadar', 'Pindra'],
    implementingAgency: 'UPEIDA / NHAI Joint SPV',
    description: 'High speed 6-lane access-controlled greenfield expressway connecting Meerut to Prayagraj and Varanasi.',
    totalLandRequiredAcres: 1420,
    estimatedParcelsCount: 1140,
    landType: 'AGRICULTURAL',
    corridorLengthKm: 92.5,
    rightOfWayWidthM: 75,
    proposalDate: '2026-08-18',
    targetDate: '2027-03-31',
    milestones: [
      { id: 'ms-1', title: 'Section 3A Gazette Intent', targetDate: '2026-09-10', stageRef: 'Sec 3A' }
    ],
    documents: [
      { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'Ganga Expressway Package 1 DPR', fileName: 'GangaExp_Pkg1_DPR.pdf', fileSize: '22.1 MB', uploadedAt: '2026-08-18', verified: true }
    ],
    scrutinyChecklist: defaultScrutinyChecklist.map(c => ({ ...c, status: 'PASS' as const })),
    scrutinyRemarks: 'Full scrutiny cleared with zero discrepancies.',
    approvalStages: createStandardApprovalStages(
      'S. Rajalingam, IAS', 'District Magistrate, Varanasi',
      'Manoj Kumar Singh, IAS', 'Chief Secretary & Infrastructure Comm., UP',
      'Anurag Jain, IAS', 'Secretary MoRTH, New Delhi'
    ),
    currentApprovalStage: 'FINAL_APPROVAL',
    status: 'APPROVED',
    progressPercent: 95,
    riskLevel: 'LOW',
    estimatedCostCr: 1250.0,
    auditTrail: [
      { id: 'aud-1', timestamp: '2026-08-18 10:15 AM', action: 'PROPOSAL_SUBMITTED', actor: 'UPEIDA SPV', role: 'SPV Team', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Submission complete.' },
      { id: 'aud-2', timestamp: '2026-08-25 04:00 PM', action: 'DISTRICT_APPROVED', actor: 'DM Varanasi', role: 'Collector', remarks: 'District review signed.' },
      { id: 'aud-3', timestamp: '2026-09-01 02:00 PM', action: 'CENTRAL_APPROVED', actor: 'MoRTH Desk', role: 'Central Officer', previousStatus: 'UNDER_SCRUTINY', newStatus: 'APPROVED', remarks: 'Final approval issued.' }
    ]
  },
  {
    id: 'PRJ-2026-004',
    code: 'NHAI-OD-OCH-01',
    name: 'Odisha Coastal Highway (Digha-Rameswaram)',
    department: 'MoRTH / NHAI',
    projectType: 'PORT_CONNECTIVITY',
    state: 'Odisha',
    district: 'Puri',
    subDistricts: ['Puri Sadar', 'Brahmagiri', 'Krushnaprasad'],
    implementingAgency: 'NHAI PIU Bhubaneswar',
    description: 'Coastal economic highway linking tourist and maritime hubs with stringent CRZ compliance.',
    totalLandRequiredAcres: 920,
    estimatedParcelsCount: 760,
    landType: 'FOREST',
    corridorLengthKm: 68.4,
    rightOfWayWidthM: 60,
    proposalDate: '2026-08-05',
    targetDate: '2027-06-30',
    milestones: [
      { id: 'ms-1', title: 'CRZ Stage-II Clearance', targetDate: '2026-09-30', stageRef: 'CRZ 2019' }
    ],
    documents: [
      { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'Coastal Highway Feasibility Report', fileName: 'OCH_Feasibility.pdf', fileSize: '16.0 MB', uploadedAt: '2026-08-05', verified: true }
    ],
    scrutinyChecklist: [
      { id: 'chk-1', criterionKey: 'PROJECT_INFO', title: 'Project Information Complete', description: 'Alignment specs.', status: 'PASS', remarks: 'OK.' },
      { id: 'chk-2', criterionKey: 'LAND_REQUIREMENT', title: 'Land Requirement Valid & Justified', description: 'CRZ overlap check.', status: 'FAIL', remarks: '42 acres in Brahmagiri block fall within CRZ-I sensitive mangroves without Stage-II MoEFCC certificate.' },
      { id: 'chk-3', criterionKey: 'DOCUMENTS', title: 'Statutory Documents Available & Compliant', description: 'DPR checked.', status: 'PASS', remarks: 'OK.' },
      { id: 'chk-4', criterionKey: 'GIS_BOUNDARY', title: 'GIS Cadastral Boundary Geo-Referenced', description: 'Boundary overlay.', status: 'NEEDS_CLARIFICATION', remarks: 'Tidal high-water line boundary not demarcated.' },
      { id: 'chk-5', criterionKey: 'REQUIRED_FIELDS', title: 'Required Statutory Fields Complete', description: 'Form verification.', status: 'PASS', remarks: 'OK.' }
    ],
    scrutinyRemarks: 'CRZ-I mangrove boundary overlap requires MoEFCC mitigation plan and alignment variation note.',
    approvalStages: [
      { stageKey: 'SUBMISSION', stageTitle: 'Agency Proposal Submission', level: 'SUBMITTER', officerName: 'NHAI PIU Bhubaneswar', officerDesignation: 'Project Director', jurisdiction: 'Odisha PIU', date: '2026-08-05', status: 'APPROVED', remarks: 'Submitted.' },
      { stageKey: 'DISTRICT_REVIEW', stageTitle: 'District Revenue Review (CALA / DM)', level: 'DISTRICT', officerName: 'Collector & DM Puri', officerDesignation: 'IAS', jurisdiction: 'Puri District', date: '2026-08-16', status: 'CLARIFICATION', remarks: 'Clarification sought regarding CRZ-I mangrove boundary alignment.' },
      { stageKey: 'STATE_REVIEW', stageTitle: 'State Revenue & PWD Scrutiny', level: 'STATE', officerName: 'Principal Secretary Revenue', officerDesignation: 'IAS', jurisdiction: 'Bhubaneswar', date: '-', status: 'PENDING', remarks: 'Pending clarification.' },
      { stageKey: 'CENTRAL_AUTHORITY', stageTitle: 'Central Ministry Sanction', level: 'CENTRAL', officerName: 'MoRTH Desk', officerDesignation: 'Director', jurisdiction: 'New Delhi', date: '-', status: 'PENDING', remarks: 'Pending.' },
      { stageKey: 'FINAL_APPROVAL', stageTitle: 'Gazette Release', level: 'APPROVAL', officerName: 'Gazette Officer', officerDesignation: 'Director', jurisdiction: 'Central', date: '-', status: 'PENDING', remarks: 'Pending.' }
    ],
    currentApprovalStage: 'DISTRICT_REVIEW',
    status: 'CLARIFICATION_REQUIRED',
    progressPercent: 30,
    riskLevel: 'CRITICAL',
    estimatedCostCr: 680.0,
    auditTrail: [
      { id: 'aud-1', timestamp: '2026-08-05 09:30 AM', action: 'PROPOSAL_SUBMITTED', actor: 'NHAI PIU', role: 'Agency', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Submitted.' },
      { id: 'aud-2', timestamp: '2026-08-16 03:45 PM', action: 'CLARIFICATION_REQUESTED', actor: 'Collector Puri', role: 'District Magistrate', previousStatus: 'SUBMITTED', newStatus: 'CLARIFICATION_REQUIRED', remarks: 'Clarification sought on mangrove overlap in Brahmagiri.' }
    ]
  },
  {
    id: 'PRJ-2026-005',
    code: 'DFCCIL-MH-JNPT-01',
    name: 'Western Dedicated Freight Corridor (JNPT Link)',
    department: 'Ministry of Railways / DFCCIL',
    projectType: 'FREIGHT_CORRIDOR',
    state: 'Maharashtra',
    district: 'Thane',
    subDistricts: ['Thane', 'Kalyan', 'Bhiwandi'],
    implementingAgency: 'Dedicated Freight Corridor Corp (DFCCIL)',
    description: 'Electrified dual-track heavy haul railway freight corridor connecting northern freight terminals with Jawaharlal Nehru Port.',
    totalLandRequiredAcres: 840,
    estimatedParcelsCount: 680,
    landType: 'MIXED',
    corridorLengthKm: 46.2,
    rightOfWayWidthM: 55,
    proposalDate: '2026-08-10',
    targetDate: '2026-11-30',
    milestones: [
      { id: 'ms-1', title: 'Railways Act Sec 20A Notification', targetDate: '2026-09-05', stageRef: 'Railways Act 1989' }
    ],
    documents: [
      { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'DFCCIL Western Corridor DPR', fileName: 'WDFC_JNPT_DPR.pdf', fileSize: '19.5 MB', uploadedAt: '2026-08-10', verified: true }
    ],
    scrutinyChecklist: defaultScrutinyChecklist,
    scrutinyRemarks: 'Scrutiny cleared. Central Railway Board inter-ministerial sanction in progress.',
    approvalStages: [
      { stageKey: 'SUBMISSION', stageTitle: 'Agency Proposal Submission', level: 'SUBMITTER', officerName: 'DFCCIL GM', officerDesignation: 'General Manager', jurisdiction: 'Mumbai Unit', date: '2026-08-10', status: 'APPROVED', remarks: 'Submitted.' },
      { stageKey: 'DISTRICT_REVIEW', stageTitle: 'District Revenue Review (CALA / DM)', level: 'DISTRICT', officerName: 'Collector Thane', officerDesignation: 'DM', jurisdiction: 'Thane District', date: '2026-08-18', status: 'APPROVED', remarks: 'District revenue records vetted.' },
      { stageKey: 'STATE_REVIEW', stageTitle: 'State Revenue & PWD Scrutiny', level: 'STATE', officerName: 'Chief Secretary Maharashtra', officerDesignation: 'CS', jurisdiction: 'Mantralaya Mumbai', date: '2026-08-25', status: 'APPROVED', remarks: 'State Cabinet infra committee cleared proposal.' },
      { stageKey: 'CENTRAL_AUTHORITY', stageTitle: 'Central Ministry / Railway Board Sanction', level: 'CENTRAL', officerName: 'Railway Board Member (Infra)', officerDesignation: 'Secretary Rank', jurisdiction: 'Rail Bhavan New Delhi', date: '2026-09-02', status: 'UNDER_REVIEW', remarks: 'Inter-ministerial sanction note under review.' },
      { stageKey: 'FINAL_APPROVAL', stageTitle: 'Gazette Release', level: 'APPROVAL', officerName: 'Gazette Officer', officerDesignation: 'Director', jurisdiction: 'Central', date: '-', status: 'PENDING', remarks: 'Pending central sign-off.' }
    ],
    currentApprovalStage: 'CENTRAL_AUTHORITY',
    status: 'UNDER_SCRUTINY',
    progressPercent: 75,
    riskLevel: 'HIGH',
    estimatedCostCr: 840.0,
    auditTrail: [
      { id: 'aud-1', timestamp: '2026-08-10 11:20 AM', action: 'PROPOSAL_SUBMITTED', actor: 'DFCCIL Team', role: 'Implementing Agency', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Submitted.' },
      { id: 'aud-2', timestamp: '2026-08-18 04:30 PM', action: 'DISTRICT_APPROVED', actor: 'Collector Thane', role: 'District Collector', remarks: 'Vetted.' },
      { id: 'aud-3', timestamp: '2026-08-25 05:00 PM', action: 'STATE_APPROVED', actor: 'CS Maharashtra', role: 'State Govt', remarks: 'Cleared by state.' }
    ]
  },
  {
    id: 'PRJ-2026-006',
    code: 'NHAI-RJ-AJEC-02',
    name: 'Amritsar-Jamnagar Economic Corridor (Rajasthan Pkg)',
    department: 'MoRTH / NHAI',
    projectType: 'ECONOMIC_CORRIDOR',
    state: 'Rajasthan',
    district: 'Alwar',
    subDistricts: ['Alwar Sadar', 'Behror', 'Kishangarh Bas'],
    implementingAgency: 'NHAI PIU Alwar',
    description: 'Trans-Rajasthan trade corridor facilitating freight transit between industrial hubs of Punjab, Haryana and Gujarat ports.',
    totalLandRequiredAcres: 1120,
    estimatedParcelsCount: 810,
    landType: 'AGRICULTURAL',
    corridorLengthKm: 89.0,
    rightOfWayWidthM: 65,
    proposalDate: '2026-08-22',
    targetDate: '2027-01-31',
    milestones: [
      { id: 'ms-1', title: 'Section 3A Gazette Release', targetDate: '2026-09-20', stageRef: 'Sec 3A' }
    ],
    documents: [
      { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'AJEC Rajasthan Segment DPR', fileName: 'AJEC_DPR_Alwar.pdf', fileSize: '15.6 MB', uploadedAt: '2026-08-22', verified: true }
    ],
    scrutinyChecklist: defaultScrutinyChecklist.map(c => ({ ...c, status: 'PENDING' as const })),
    scrutinyRemarks: 'Proposal submitted by PIU Alwar. Assigned to Scrutiny Desk for preliminary document verification.',
    approvalStages: [
      { stageKey: 'SUBMISSION', stageTitle: 'Agency Proposal Submission', level: 'SUBMITTER', officerName: 'NHAI PIU Alwar', officerDesignation: 'Project Director', jurisdiction: 'Alwar', date: '2026-08-22', status: 'APPROVED', remarks: 'Submitted.' },
      { stageKey: 'DISTRICT_REVIEW', stageTitle: 'District Revenue Review (CALA / DM)', level: 'DISTRICT', officerName: 'Collector Alwar', officerDesignation: 'DM', jurisdiction: 'Alwar District', date: '-', status: 'UNDER_REVIEW', remarks: 'Awaiting digital scrutiny completion.' },
      { stageKey: 'STATE_REVIEW', stageTitle: 'State Revenue & PWD Scrutiny', level: 'STATE', officerName: 'Revenue Secy Rajasthan', officerDesignation: 'IAS', jurisdiction: 'Jaipur', date: '-', status: 'PENDING', remarks: 'Pending.' },
      { stageKey: 'CENTRAL_AUTHORITY', stageTitle: 'Central Ministry Sanction', level: 'CENTRAL', officerName: 'MoRTH Desk', officerDesignation: 'Director', jurisdiction: 'New Delhi', date: '-', status: 'PENDING', remarks: 'Pending.' },
      { stageKey: 'FINAL_APPROVAL', stageTitle: 'Gazette Release', level: 'APPROVAL', officerName: 'Gazette Officer', officerDesignation: 'Director', jurisdiction: 'Central', date: '-', status: 'PENDING', remarks: 'Pending.' }
    ],
    currentApprovalStage: 'DISTRICT_REVIEW',
    status: 'SUBMITTED',
    progressPercent: 20,
    riskLevel: 'MEDIUM',
    estimatedCostCr: 940.0,
    auditTrail: [
      { id: 'aud-1', timestamp: '2026-08-22 10:45 AM', action: 'PROPOSAL_SUBMITTED', actor: 'NHAI PIU Alwar', role: 'Agency', previousStatus: 'DRAFT', newStatus: 'SUBMITTED', remarks: 'Proposal uploaded to portal.' }
    ]
  },
  {
    id: 'PRJ-2026-007',
    code: 'AYD-BYP-2026',
    name: 'Ayodhya Bypass Logistics Ring',
    department: 'MoRTH / NHAI',
    projectType: 'RING_ROAD',
    state: 'Uttar Pradesh',
    district: 'Ayodhya',
    subDistricts: ['Ayodhya Sadar', 'Sohawal'],
    implementingAgency: 'UP State Highway Authority (UPSHA)',
    description: 'Peripheral bypass road for commercial cargo and pilgrim bus traffic surrounding Ayodhya religious heritage zone.',
    totalLandRequiredAcres: 340,
    estimatedParcelsCount: 290,
    landType: 'MIXED',
    corridorLengthKm: 28.5,
    rightOfWayWidthM: 50,
    proposalDate: '2026-08-29',
    targetDate: '2027-04-30',
    milestones: [
      { id: 'ms-1', title: 'DPR Finalization', targetDate: '2026-09-15', stageRef: 'Draft Stage' }
    ],
    documents: [
      { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'Preliminary Concept Note', fileName: 'Ayodhya_Ring_Concept.pdf', fileSize: '4.8 MB', uploadedAt: '2026-08-29', verified: false }
    ],
    scrutinyChecklist: defaultScrutinyChecklist.map(c => ({ ...c, status: 'PENDING' as const })),
    scrutinyRemarks: 'Draft proposal saved in work-in-progress state. Documents pending final technical sign-off.',
    approvalStages: [
      { stageKey: 'SUBMISSION', stageTitle: 'Agency Proposal Submission', level: 'SUBMITTER', officerName: 'UPSHA Engineer', officerDesignation: 'Superintending Engineer', jurisdiction: 'Ayodhya Division', date: '-', status: 'PENDING', remarks: 'Work in progress.' },
      { stageKey: 'DISTRICT_REVIEW', stageTitle: 'District Revenue Review (CALA / DM)', level: 'DISTRICT', officerName: 'DM Ayodhya', officerDesignation: 'IAS', jurisdiction: 'Ayodhya', date: '-', status: 'PENDING', remarks: 'Pending submission.' },
      { stageKey: 'STATE_REVIEW', stageTitle: 'State Revenue Scrutiny', level: 'STATE', officerName: 'PWD Principal Secy', officerDesignation: 'IAS', jurisdiction: 'Lucknow', date: '-', status: 'PENDING', remarks: 'Pending.' },
      { stageKey: 'CENTRAL_AUTHORITY', stageTitle: 'Central Sanction', level: 'CENTRAL', officerName: 'MoRTH Desk', officerDesignation: 'Director', jurisdiction: 'New Delhi', date: '-', status: 'PENDING', remarks: 'Pending.' },
      { stageKey: 'FINAL_APPROVAL', stageTitle: 'Gazette Release', level: 'APPROVAL', officerName: 'Gazette Officer', officerDesignation: 'Director', jurisdiction: 'Central', date: '-', status: 'PENDING', remarks: 'Pending.' }
    ],
    currentApprovalStage: 'SUBMISSION',
    status: 'DRAFT',
    progressPercent: 10,
    riskLevel: 'LOW',
    estimatedCostCr: 280.0,
    auditTrail: [
      { id: 'aud-1', timestamp: '2026-08-29 03:10 PM', action: 'DRAFT_CREATED', actor: 'UPSHA Engineer', role: 'Field Officer', newStatus: 'DRAFT', remarks: 'Initial draft template created.' }
    ]
  }
];
