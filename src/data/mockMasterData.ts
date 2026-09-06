import { 
  MasterDataItem, 
  ApiIntegrationCard, 
  DataConflictRecord, 
  DataSyncSummary 
} from '../types/dataIntegration';

export const mockMasterData: MasterDataItem[] = [
  // STATES
  { id: 'md-st-1', code: 'BR', name: 'Bihar', category: 'STATES', standardizedCode: 'ISO:IN-BR', description: 'State of Bihar (LGD Code: 10)', isActive: true },
  { id: 'md-st-2', code: 'UP', name: 'Uttar Pradesh', category: 'STATES', standardizedCode: 'ISO:IN-UP', description: 'State of Uttar Pradesh (LGD Code: 09)', isActive: true },
  { id: 'md-st-3', code: 'MH', name: 'Maharashtra', category: 'STATES', standardizedCode: 'ISO:IN-MH', description: 'State of Maharashtra (LGD Code: 27)', isActive: true },
  { id: 'md-st-4', code: 'GJ', name: 'Gujarat', category: 'STATES', standardizedCode: 'ISO:IN-GJ', description: 'State of Gujarat (LGD Code: 24)', isActive: true },

  // DISTRICTS
  { id: 'md-dt-1', code: 'PAT', name: 'Patna', category: 'DISTRICTS', standardizedCode: 'LGD:216', description: 'Patna District, Bihar', isActive: true },
  { id: 'md-dt-2', code: 'SAR', name: 'Saran', category: 'DISTRICTS', standardizedCode: 'LGD:219', description: 'Saran (Chhapra) District, Bihar', isActive: true },
  { id: 'md-dt-3', code: 'BHO', name: 'Bhojpur', category: 'DISTRICTS', standardizedCode: 'LGD:217', description: 'Bhojpur (Ara) District, Bihar', isActive: true },
  { id: 'md-dt-4', code: 'VAI', name: 'Vaishali', category: 'DISTRICTS', standardizedCode: 'LGD:218', description: 'Vaishali (Hajipur) District, Bihar', isActive: true },

  // VILLAGES
  { id: 'md-vg-1', code: 'KAN', name: 'Kanhauli', category: 'VILLAGES', standardizedCode: 'LGD:234810', description: 'Mauza Kanhauli, Bihta Tehsil', isActive: true },
  { id: 'md-vg-2', code: 'BIH', name: 'Bihta Urban', category: 'VILLAGES', standardizedCode: 'LGD:234812', description: 'Bihta Revenue Circle, Patna', isActive: true },
  { id: 'md-vg-3', code: 'KOI', name: 'Koilwar', category: 'VILLAGES', standardizedCode: 'LGD:235104', description: 'Koilwar Nagar Panchayat, Bhojpur', isActive: true },
  { id: 'md-vg-4', code: 'DIG', name: 'Dighwara', category: 'VILLAGES', standardizedCode: 'LGD:235220', description: 'Dighwara Block, Saran', isActive: true },

  // DEPARTMENTS
  { id: 'md-dp-1', code: 'MORTH', name: 'Ministry of Road Transport & Highways', category: 'DEPARTMENTS', standardizedCode: 'GOI-MORTH', description: 'Apex Central Ministry', isActive: true },
  { id: 'md-dp-2', code: 'NHAI', name: 'National Highways Authority of India', category: 'DEPARTMENTS', standardizedCode: 'GOI-NHAI', description: 'Central Project Implementing Agency', isActive: true },
  { id: 'md-dp-3', code: 'REVENUE_BR', name: 'Revenue & Land Reforms Dept (Bihar)', category: 'DEPARTMENTS', standardizedCode: 'GOB-REV', description: 'State Revenue & Khatiyan Cadastral Authority', isActive: true },
  { id: 'md-dp-4', code: 'PWD_BLDG', name: 'Public Works Department (Buildings)', category: 'DEPARTMENTS', standardizedCode: 'GOB-PWD', description: 'Structure Valuation & Civil Survey', isActive: true },
  { id: 'md-dp-5', code: 'FOREST_DEPT', name: 'Department of Environment, Forest & Climate Change', category: 'DEPARTMENTS', standardizedCode: 'GOB-FOREST', description: 'Forest Stage I & II Clearance Authority', isActive: true },

  // PROJECT TYPES
  { id: 'md-pt-1', code: 'EXP', name: 'National Expressway (Access Controlled)', category: 'PROJECT_TYPES', standardizedCode: 'IRC-SP-99', description: 'High-speed greenfield expressway corridor', isActive: true },
  { id: 'md-pt-2', code: 'RING', name: 'Ring Road & Urban Bypass', category: 'PROJECT_TYPES', standardizedCode: 'IRC-SP-87', description: 'Multi-lane urban circumferential corridor', isActive: true },
  { id: 'md-pt-3', code: 'ECON', name: 'Bharatmala Economic Corridor', category: 'PROJECT_TYPES', standardizedCode: 'GOI-BM-01', description: 'National freight and logistics corridor', isActive: true },

  // LAND TYPES
  { id: 'md-lt-1', code: 'AGR_IRR', name: 'Agricultural (Irrigated Double Crop)', category: 'LAND_TYPES', standardizedCode: 'REV-LND-01', description: 'Two or more crops per year with assured irrigation', isActive: true },
  { id: 'md-lt-2', code: 'AGR_NIR', name: 'Agricultural (Non-Irrigated / Single Crop)', category: 'LAND_TYPES', standardizedCode: 'REV-LND-02', description: 'Rain-fed agricultural land', isActive: true },
  { id: 'md-lt-3', code: 'COM_ROD', name: 'Commercial (Road-Facing Margin)', category: 'LAND_TYPES', standardizedCode: 'REV-LND-03', description: 'High commercial value road-frontage land', isActive: true },
  { id: 'md-lt-4', code: 'RES_ABD', name: 'Residential Abadi / Homestead', category: 'LAND_TYPES', standardizedCode: 'REV-LND-04', description: 'Settled village inhabited dwelling abadi', isActive: true },
  { id: 'md-lt-5', code: 'PUB_GRM', name: 'Gram Sabha / Public Common Utility', category: 'LAND_TYPES', standardizedCode: 'REV-LND-05', description: 'Community pasture, aahar, pyne, village road', isActive: true },

  // ACQUISITION STAGES
  { id: 'md-as-1', code: 'SEC_3A', name: 'Section 3A: Gazette Notification of Intent', category: 'ACQUISITION_STAGES', standardizedCode: 'NH-ACT-3A', description: 'Preliminary statutory publication in Gazette of India', isActive: true },
  { id: 'md-as-2', code: 'SEC_3C', name: 'Section 3C: Landowner Objection & Hearing', category: 'ACQUISITION_STAGES', standardizedCode: 'NH-ACT-3C', description: '21-day statutory inquiry by Competent Authority', isActive: true },
  { id: 'md-as-3', code: 'SEC_3D', name: 'Section 3D: Declaration of Acquisition', category: 'ACQUISITION_STAGES', standardizedCode: 'NH-ACT-3D', description: 'Title permanently vests in Union of India free of encumbrance', isActive: true },
  { id: 'md-as-4', code: 'SEC_3G', name: 'Section 3G: Determination of Compensation Award', category: 'ACQUISITION_STAGES', standardizedCode: 'NH-ACT-3G', description: 'Valuation award including 100% Solatium and interest', isActive: true },
  { id: 'md-as-5', code: 'SEC_3H', name: 'Section 3H: Deposit & Disbursement of Compensation', category: 'ACQUISITION_STAGES', standardizedCode: 'NH-ACT-3H', description: 'SBI Escrow / PFMS Direct Benefit Transfer to landholder', isActive: true },
  { id: 'md-as-6', code: 'SEC_3E', name: 'Section 3E: Physical Possession of Land', category: 'ACQUISITION_STAGES', standardizedCode: 'NH-ACT-3E', description: '60-day notice, chainage panchnama, contractor handover', isActive: true },

  // STATUSES
  { id: 'md-ps-1', code: 'NOTIF_PENDING', name: 'Notification Pending', category: 'PARCEL_STATUSES', standardizedCode: 'STAT-01', description: 'Under initial cadastral identification', isActive: true },
  { id: 'md-ps-2', code: 'INQUIRY', name: 'Under Inquiry / Objections', category: 'PARCEL_STATUSES', standardizedCode: 'STAT-02', description: 'Section 3C hearings underway', isActive: true },
  { id: 'md-ps-3', code: 'VALUATION', name: 'Valuation In Progress', category: 'PARCEL_STATUSES', standardizedCode: 'STAT-03', description: 'JMS survey and circle rate computation', isActive: true },
  { id: 'md-ps-4', code: 'AWARDED', name: 'Award Determined', category: 'PARCEL_STATUSES', standardizedCode: 'STAT-04', description: 'CALA Section 3G decree sanctioned', isActive: true },
  { id: 'md-ps-5', code: 'DISBURSED', name: 'Compensation Deposited', category: 'PARCEL_STATUSES', standardizedCode: 'STAT-05', description: 'PFMS DBT transferred to bank', isActive: true },
  { id: 'md-ps-6', code: 'POSSESSION', name: 'Possession Acquired', category: 'PARCEL_STATUSES', standardizedCode: 'STAT-06', description: 'Chainage cleared and handed over to NHAI', isActive: true },
  { id: 'md-ps-7', code: 'LITIGATION', name: 'Litigation Halted', category: 'PARCEL_STATUSES', standardizedCode: 'STAT-07', description: 'Civil Court or High Court injunction active', isActive: true },

  // RISK LEVELS
  { id: 'md-rk-1', code: 'CRITICAL', name: 'Critical Risk (75 - 100)', category: 'RISK_LEVELS', standardizedCode: 'RISK-CRIT', description: 'Imminent litigation stay or major physical block', isActive: true },
  { id: 'md-rk-2', code: 'HIGH', name: 'High Risk (50 - 74)', category: 'RISK_LEVELS', standardizedCode: 'RISK-HIGH', description: 'Backlog in verification or pending objections', isActive: true },
  { id: 'md-rk-3', code: 'MEDIUM', name: 'Medium Risk (25 - 49)', category: 'RISK_LEVELS', standardizedCode: 'RISK-MED', description: 'Minor structural claims or document delays', isActive: true },
  { id: 'md-rk-4', code: 'LOW', name: 'Low Risk (0 - 24)', category: 'RISK_LEVELS', standardizedCode: 'RISK-LOW', description: 'Clean title, clear boundaries, verified occupants', isActive: true }
];

export const mockApiIntegrations: ApiIntegrationCard[] = [
  {
    id: 'LAND_RECORDS',
    name: 'Land Records API (State RoR / Bhulekh)',
    department: 'Revenue & Land Reforms Department, Govt of Bihar',
    endpoint: 'https://api.bhulekh.bihar.gov.in/v2/cadastral/ror',
    status: 'MOCK_CONNECTED',
    lastSync: '12 mins ago',
    recordsSynced: 1420,
    syncStatus: 'SUCCESS',
    errorCount: 0,
    authMethod: 'OAuth 2.0 (mTLS & Bearer Token)',
    protocol: 'REST / HTTPS',
    description: 'Fetches digital Jamabandi Register-II extracts, Khatiyan owner lineage, and mutation case status.'
  },
  {
    id: 'CADASTRAL_MAP',
    name: 'Cadastral Map API (BhuNaksha Spatial Service)',
    department: 'Survey & Settlement Directorate / NIC',
    endpoint: 'https://bhunaksha.bihar.gov.in/geoserver/wfs',
    status: 'MOCK_CONNECTED',
    lastSync: '25 mins ago',
    recordsSynced: 890,
    syncStatus: 'SUCCESS',
    errorCount: 1,
    authMethod: 'API Key (Encrypted Backend Secret)',
    protocol: 'WFS / WMS',
    description: 'Streams standardized GeoJSON parcel boundary geometries, tri-junction survey marks, and village map sheets.'
  },
  {
    id: 'FINANCIAL_SYSTEM',
    name: 'Financial System API (PFMS / Treasury Escrow)',
    department: 'Ministry of Finance / Public Financial Management System',
    endpoint: 'https://pfms.nic.in/api/v1/dbt-escrow/disbursement',
    status: 'MOCK_CONNECTED',
    lastSync: '5 mins ago',
    recordsSynced: 640,
    syncStatus: 'SUCCESS',
    errorCount: 0,
    authMethod: 'PKI Digital Certificate (X.509 RSA-4096)',
    protocol: 'PFMS-API',
    description: 'Handles electronic sanction orders, SBI escrow funding validations, and Direct Benefit Transfer (DBT) UTR settlements.'
  },
  {
    id: 'GIS_PORTAL',
    name: 'GIS API (Bharat Maps & Survey of India)',
    department: 'Survey of India / Ministry of Science & Technology',
    endpoint: 'https://bharatmaps.gov.in/geoserver/wms/soi-ortho',
    status: 'MOCK_CONNECTED',
    lastSync: '1 hour ago',
    recordsSynced: 128,
    syncStatus: 'SUCCESS',
    errorCount: 0,
    authMethod: 'HMAC-SHA256 Token Header',
    protocol: 'WFS / WMS',
    description: 'Delivers 0.5m resolution high-altitude orthorectified satellite imagery, DEM contours, and national geodetic grid benchmarks.'
  },
  {
    id: 'PROJECT_SYSTEM',
    name: 'Project System API (PM GatiShakti NMP Portal)',
    department: 'DPIIT & MoRTH GatiShakti National Master Plan',
    endpoint: 'https://gatishakti.gov.in/nmp/api/v2/corridor/alignment',
    status: 'MOCK_CONNECTED',
    lastSync: '40 mins ago',
    recordsSynced: 34,
    syncStatus: 'SUCCESS',
    errorCount: 0,
    authMethod: 'OAuth 2.0 Client Credentials',
    protocol: 'REST / HTTPS',
    description: 'Synchronizes 60m Right-of-Way alignment centerlines, multi-modal utility intersections, and national infrastructure tracking.'
  },
  {
    id: 'NOTIFICATION_GATEWAY',
    name: 'Notification API (C-DAC Mobile Seva / NIC SMS)',
    department: 'Ministry of Electronics and Information Technology (MeitY)',
    endpoint: 'https://mobileseva.gov.in/dlt/api/v3/sms-dispatch',
    status: 'MOCK_CONNECTED',
    lastSync: '2 mins ago',
    recordsSynced: 512,
    syncStatus: 'SUCCESS',
    errorCount: 0,
    authMethod: 'TRAI DLT Template Hash & Token',
    protocol: 'REST / HTTPS',
    description: 'Transmits TRAI DLT approved statutory bilingual alerts, hearing summons, and DBT credit notifications to landholders.'
  }
];

export const mockSyncSummary: DataSyncSummary = {
  lastSyncTimestamp: 'Today, 06:15 PM',
  recordsReceived: 1420,
  recordsUpdated: 284,
  conflictsCount: 3,
  syncState: 'COMPLETED'
};

// Showcase Data Conflict as requested in prompt:
// GIS: 2.40 acres, Land Record: 2.15 acres, Document: 2.45 acres
export const mockDataConflicts: DataConflictRecord[] = [
  {
    id: 'CONF-AREA-001',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    projectId: 'PRR-2026-001',
    village: 'Kanhauli',
    conflictField: 'Acquisition Land Area',
    sources: {
      gis: {
        value: '2.40',
        unit: 'Acres (0.97 Ha)',
        sourceName: 'MapLibre DGPS RTK Polygon Area Calculation',
        sourceType: 'GIS',
        lastUpdated: '2026-03-02 10:30 AM',
        referenceNo: 'GIS-POLY-1252'
      },
      landRecord: {
        value: '2.15',
        unit: 'Acres (0.87 Ha)',
        sourceName: 'State Bhulekh RoR Khatiyan Jamabandi Register-II',
        sourceType: 'LAND_RECORD',
        lastUpdated: '2025-11-14 02:15 PM',
        referenceNo: 'ROR-BR-PAT-8812'
      },
      document: {
        value: '2.45',
        unit: 'Acres (0.99 Ha)',
        sourceName: 'Section 3A Gazette Extraordinary No. 114 Schedule',
        sourceType: 'DOCUMENT',
        lastUpdated: '2026-01-10 11:00 AM',
        referenceNo: 'GAZ-3A-2026-114'
      }
    },
    discrepancyDelta: '0.30 Acres (12.5% variation between RoR and Gazette)',
    status: 'DETECTED'
  },
  {
    id: 'CONF-OWNER-002',
    parcelId: 'K-126/1',
    khasraNo: '126/1',
    projectId: 'PRR-2026-001',
    village: 'Kanhauli',
    conflictField: 'Titleholder Name Spelling & Aadhaar Seed',
    sources: {
      gis: {
        value: 'Mahendra Yadav',
        unit: 'Ground Peg Tag',
        sourceName: 'Field Surveyor Joint Survey Marking',
        sourceType: 'GIS',
        lastUpdated: '2026-02-28 03:20 PM'
      },
      landRecord: {
        value: 'Mahender Rai alias Mahendra Yadav',
        unit: 'Khatiyan Entry',
        sourceName: 'Cadastral Khatiyan 1965 Revision Extraction',
        sourceType: 'LAND_RECORD',
        lastUpdated: '2025-10-05 09:00 AM',
        referenceNo: 'KHAT-126-BR'
      },
      document: {
        value: 'Mahendra Yadav (S/o Late Ram Prasad Yadav)',
        unit: 'Registered Deed',
        sourceName: 'Sale Deed 4401/2014 & Family Genealogic Tree',
        sourceType: 'DOCUMENT',
        lastUpdated: '2026-02-12 11:30 AM',
        referenceNo: 'DEED-4401-2014'
      }
    },
    discrepancyDelta: 'Alias alias mismatch in Khatiyan requires Circle Officer verification',
    status: 'UNDER_REVIEW'
  },
  {
    id: 'CONF-RATE-003',
    parcelId: 'K-412/1',
    khasraNo: '412/1',
    projectId: 'PRR-2026-001',
    village: 'Kanhauli',
    conflictField: 'Circle Rate Base Classification',
    sources: {
      gis: {
        value: '₹4,800/Sq.m',
        unit: 'INR / Sq.m',
        sourceName: 'GIS Spatial Proximity within 50m of NH frontage',
        sourceType: 'GIS',
        lastUpdated: '2026-03-01 04:00 PM'
      },
      landRecord: {
        value: '₹3,200/Sq.m',
        unit: 'INR / Sq.m',
        sourceName: 'Rural Agriculture Rate Table (Bihta Sub-Registry)',
        sourceType: 'LAND_RECORD',
        lastUpdated: '2025-08-01 10:00 AM'
      },
      document: {
        value: '₹4,800/Sq.m',
        unit: 'INR / Sq.m',
        sourceName: 'Sub-Registrar Danapur Commercial Classification Certificate',
        sourceType: 'DOCUMENT',
        lastUpdated: '2026-02-18 01:15 PM',
        referenceNo: 'SRO-DNP-RATE-2026'
      }
    },
    discrepancyDelta: '₹1,600/Sq.m differential (Commercial road frontage vs Rural Agriculture)',
    status: 'RESOLVED',
    resolvedValue: '₹4,800/Sq.m',
    resolvedSource: 'DOCUMENT',
    resolvedBy: 'CALA / Additional Collector Patna',
    resolvedAt: '2026-03-04 12:00 PM',
    resolutionRemarks: 'Verified road frontage under 50m commercial corridor multiplier rule.'
  }
];
