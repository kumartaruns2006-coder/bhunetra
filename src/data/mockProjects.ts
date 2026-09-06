import { ProjectCorridor } from '../types/project';

export const mockProjects: ProjectCorridor[] = [
  // -------------------------------------------------------------
  // PRIMARY DEMO SHOWCASE CORRIDOR: WEST BENGAL / KOLKATA
  // -------------------------------------------------------------
  {
    id: 'WB-KOL-KONA-2026',
    code: 'NHAI-WB-KOL-KONA',
    name: 'Kolkata Elevated Corridor & Kona Expressway Expansion',
    state: 'West Bengal',
    districts: ['Kolkata', 'Howrah', 'North 24 Parganas'],
    implementingAgency: 'NHAI Regional Office, Kolkata (PIU Kolkata)',
    competentAuthority: 'CALA / Additional District Magistrate (Land Acquisition), Kolkata & Howrah',
    corridorLengthKm: 28.6,
    rightOfWayWidthM: 60,
    totalLandRequiredHectares: 198.4,
    totalParcelsCount: 384,
    parcelsAcquiredCount: 242,
    parcelsValuationCount: 82,
    parcelsUnderInquiryCount: 38,
    parcelsDisputedCount: 22,
    possessionSecuredPercentage: 63.0,
    totalBudgetCr: 620.50,
    disbursedBudgetCr: 412.80,
    escrowBalanceCr: 125.40,
    corridorCenter: [22.5726, 88.3639],
    corridorBounds: [
      [22.4800, 88.2200],
      [22.6800, 88.4800]
    ],
    alignmentPathCoordinates: [
      [22.6100, 88.2600], // Nibra Howrah junction
      [22.5900, 88.2900], // Kona Expressway Toll interface
      [22.5650, 88.3280], // Vidyasagar Setu approach
      [22.5450, 88.3600], // Alipore / Park Circus connector
      [22.5580, 88.4050], // EM Bypass junction
      [22.5850, 88.4650]  // Rajarhat New Town terminal
    ],
    villages: [
      { villageName: 'Rajarhat Bishnupur', tehsil: 'Rajarhat', totalParcels: 76, acquiredParcels: 52, areaHectares: 38.4, disbursedAmountCr: 88.5, riskStatus: 'WATCH' },
      { villageName: 'New Town Action Area II', tehsil: 'Rajarhat', totalParcels: 64, acquiredParcels: 48, areaHectares: 32.1, disbursedAmountCr: 74.2, riskStatus: 'CLEAR' },
      { villageName: 'Kona Crossing', tehsil: 'Howrah Sadar', totalParcels: 84, acquiredParcels: 46, areaHectares: 44.5, disbursedAmountCr: 92.4, riskStatus: 'CRITICAL' },
      { villageName: 'Nibra Industrial Buffer', tehsil: 'Howrah Sadar', totalParcels: 68, acquiredParcels: 42, areaHectares: 36.2, disbursedAmountCr: 68.0, riskStatus: 'WATCH' },
      { villageName: 'Alipore Canal Link', tehsil: 'Kolkata Urban', totalParcels: 52, acquiredParcels: 34, areaHectares: 26.8, disbursedAmountCr: 54.2, riskStatus: 'CLEAR' },
      { villageName: 'Mahisbathan Sector V', tehsil: 'Salt Lake', totalParcels: 40, acquiredParcels: 20, areaHectares: 20.4, disbursedAmountCr: 35.5, riskStatus: 'CLEAR' }
    ],
    milestones: [
      { id: 'wb-m-1', stageName: 'Section 3A Gazette Notification', statutoryReference: 'NH Act 1956 Sec 3A', targetDate: '2024-03-15', completedDate: '2024-03-10', status: 'COMPLETED', responsibleAuthority: 'MoRTH / Gazette of India' },
      { id: 'wb-m-2', stageName: 'Joint Measurement Survey (JMS)', statutoryReference: 'RFCTLARR Act Sec 12', targetDate: '2024-07-20', completedDate: '2024-07-15', status: 'COMPLETED', responsibleAuthority: 'District Amin & NHAI Kolkata' },
      { id: 'wb-m-3', stageName: 'Section 3D Declaration Publication', statutoryReference: 'NH Act 1956 Sec 3D', targetDate: '2024-11-30', completedDate: '2024-11-25', status: 'COMPLETED', responsibleAuthority: 'MoRTH / CALA Kolkata' },
      { id: 'wb-m-4', stageName: 'Section 3G Compensation Award Determination', statutoryReference: 'NH Act 1956 Sec 3G', targetDate: '2025-05-30', completedDate: '2025-06-12', status: 'COMPLETED', responsibleAuthority: 'CALA / ADM (LA) Kolkata' },
      { id: 'wb-m-5', stageName: 'Section 3H Direct Benefit Transfer Disbursal', statutoryReference: 'NH Act 1956 Sec 3H', targetDate: '2026-03-31', status: 'IN_PROGRESS', responsibleAuthority: 'CALA & SBI Escrow Portal' },
      { id: 'wb-m-6', stageName: 'Section 3E Physical Possession Handover', statutoryReference: 'NH Act 1956 Sec 3E', targetDate: '2026-09-15', status: 'IN_PROGRESS', responsibleAuthority: 'District Police & Revenue Police' }
    ],
    highRiskParcelsCount: 22,
    createdDate: '2024-01-05',
    targetCompletionDate: '2026-12-31'
  },
  // -------------------------------------------------------------
  // CORRIDOR REFERENCE: BIHAR / PATNA
  // -------------------------------------------------------------
  {
    id: 'PRR-PH2-2026',
    code: 'NHAI-BR-PRR-PH2',
    name: 'Patna Ring Road Expansion (Phase II)',
    state: 'Bihar',
    districts: ['Patna', 'Saran Buffer'],
    implementingAgency: 'NHAI Regional Office, Patna (PIU Patna)',
    competentAuthority: 'CALA / Additional Collector (Land Acquisition), Patna',
    corridorLengthKm: 38.4,
    rightOfWayWidthM: 60,
    totalLandRequiredHectares: 248.5,
    totalParcelsCount: 482,
    parcelsAcquiredCount: 318,
    parcelsValuationCount: 94,
    parcelsUnderInquiryCount: 42,
    parcelsDisputedCount: 28,
    possessionSecuredPercentage: 66.0,
    totalBudgetCr: 482.60,
    disbursedBudgetCr: 328.14,
    escrowBalanceCr: 84.50,
    corridorCenter: [25.5941, 85.0845],
    corridorBounds: [
      [25.5300, 84.9800],
      [25.6600, 85.1800]
    ],
    alignmentPathCoordinates: [
      [25.5520, 84.9980], // Kanhauli junction
      [25.5680, 85.0320], // Bihta link
      [25.5840, 85.0680], // Naubatpur crossing
      [25.6020, 85.1050], // Phulwari Sharif peripheral
      [25.6250, 85.1420], // Danapur Cantonment bypass
      [25.6480, 85.1750]  // Digha bridge approach
    ],
    villages: [
      { villageName: 'Kanhauli', tehsil: 'Bihta', totalParcels: 86, acquiredParcels: 54, areaHectares: 44.2, disbursedAmountCr: 58.4, riskStatus: 'WATCH' },
      { villageName: 'Danapur Nizamat', tehsil: 'Danapur', totalParcels: 72, acquiredParcels: 60, areaHectares: 36.8, disbursedAmountCr: 72.1, riskStatus: 'CLEAR' },
      { villageName: 'Naubatpur', tehsil: 'Naubatpur', totalParcels: 98, acquiredParcels: 62, areaHectares: 52.4, disbursedAmountCr: 64.8, riskStatus: 'CRITICAL' },
      { villageName: 'Phulwari Sharif', tehsil: 'Phulwari', totalParcels: 114, acquiredParcels: 88, areaHectares: 61.1, disbursedAmountCr: 84.2, riskStatus: 'WATCH' },
      { villageName: 'Dumra', tehsil: 'Patna Sadar', totalParcels: 64, acquiredParcels: 32, areaHectares: 31.5, disbursedAmountCr: 28.5, riskStatus: 'CLEAR' },
      { villageName: 'Khagaul Rural', tehsil: 'Danapur', totalParcels: 48, acquiredParcels: 22, areaHectares: 22.5, disbursedAmountCr: 20.14, riskStatus: 'CLEAR' }
    ],
    milestones: [
      { id: 'm-1', stageName: 'Section 3A Gazette Notification', statutoryReference: 'NH Act 1956 Sec 3A', targetDate: '2024-04-15', completedDate: '2024-04-12', status: 'COMPLETED', responsibleAuthority: 'MoRTH / Gazette of India' },
      { id: 'm-2', stageName: 'Joint Measurement Survey (JMS)', statutoryReference: 'RFCTLARR Act Sec 12', targetDate: '2024-08-30', completedDate: '2024-08-25', status: 'COMPLETED', responsibleAuthority: 'District Amin & NHAI Tech Team' },
      { id: 'm-3', stageName: 'Section 3D Declaration Publication', statutoryReference: 'NH Act 1956 Sec 3D', targetDate: '2024-12-15', completedDate: '2024-12-10', status: 'COMPLETED', responsibleAuthority: 'MoRTH / CALA Patna' },
      { id: 'm-4', stageName: 'Section 3G Compensation Determination', statutoryReference: 'NH Act 1956 Sec 3G', targetDate: '2025-06-30', completedDate: '2025-07-14', status: 'COMPLETED', responsibleAuthority: 'CALA / Additional Collector' },
      { id: 'm-5', stageName: 'Section 3H Compensation Disbursement (80% Target)', statutoryReference: 'NH Act 1956 Sec 3H', targetDate: '2026-03-31', status: 'IN_PROGRESS', responsibleAuthority: 'CALA & SBI Escrow Portal' },
      { id: 'm-6', stageName: 'Section 3E Physical Possession Handover', statutoryReference: 'NH Act 1956 Sec 3E', targetDate: '2026-08-15', status: 'IN_PROGRESS', responsibleAuthority: 'District Police & Revenue Officers' }
    ],
    highRiskParcelsCount: 28,
    createdDate: '2024-01-10',
    targetCompletionDate: '2026-12-31'
  },
  {
    id: 'NH119D-EXP',
    code: 'NHAI-BR-NH119D',
    name: 'Amas-Darbhanga Expressway (Corridor 3)',
    state: 'Bihar',
    districts: ['Patna', 'Jehanabad', 'Vaishali'],
    implementingAgency: 'NHAI PIU Gaya & Patna',
    competentAuthority: 'CALA Jehanabad & Patna',
    corridorLengthKm: 64.2,
    rightOfWayWidthM: 70,
    totalLandRequiredHectares: 390.0,
    totalParcelsCount: 620,
    parcelsAcquiredCount: 450,
    parcelsValuationCount: 110,
    parcelsUnderInquiryCount: 40,
    parcelsDisputedCount: 20,
    possessionSecuredPercentage: 72.5,
    totalBudgetCr: 710.0,
    disbursedBudgetCr: 512.4,
    escrowBalanceCr: 120.0,
    corridorCenter: [25.4800, 85.0200],
    corridorBounds: [
      [25.3000, 84.9000],
      [25.6500, 85.2000]
    ],
    alignmentPathCoordinates: [
      [25.3200, 84.9500],
      [25.4500, 85.0100],
      [25.5600, 85.0800],
      [25.6800, 85.1900]
    ],
    villages: [
      { villageName: 'Masaudhi North', tehsil: 'Masaudhi', totalParcels: 140, acquiredParcels: 110, areaHectares: 85.0, disbursedAmountCr: 98.0, riskStatus: 'CLEAR' },
      { villageName: 'Dhanarua', tehsil: 'Dhanarua', totalParcels: 160, acquiredParcels: 120, areaHectares: 102.0, disbursedAmountCr: 130.5, riskStatus: 'WATCH' }
    ],
    milestones: [],
    highRiskParcelsCount: 20,
    createdDate: '2023-11-01',
    targetCompletionDate: '2026-10-31'
  }
];
