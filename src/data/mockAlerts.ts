import { AlertItem } from '../types/alertNotification';

export const mockAlerts: AlertItem[] = [
  // 1. Showcase Prompt Example: HIGH Timeline Risk for Project PRR-2026-001
  {
    id: 'ALT-PRR-001',
    title: '42-Day Predicted Corridor Delivery Delay',
    severity: 'HIGH',
    type: 'TIMELINE_RISK',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    createdAt: '2026-03-01 09:30 AM',
    dueDate: '2026-04-15',
    predictedDelayDays: 42,
    reasons: [
      'Compensation backlog in Bihta Tehsil',
      'Field verification backlog on 14 parcels',
      'Missing documents for PWD structural valuations'
    ],
    recommendedAction: 'Convene weekly District Task Force meeting chaired by DM Patna to expedite CALA awards and deployment of 3 additional revenue Amins.',
    state: 'UNREAD'
  },

  // 2. CRITICAL: High Risk Parcel & Civil Court Stay
  {
    id: 'ALT-PARCEL-516',
    title: 'High Court Injunction Stay Application on Corridor RoW',
    severity: 'CRITICAL',
    type: 'HIGH_RISK_PARCEL',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-516',
    khasraNo: '516',
    village: 'Naubatpur',
    district: 'Patna',
    createdAt: 'Today, 07:30 AM',
    dueDate: '2026-03-10',
    predictedDelayDays: 30,
    reasons: [
      'Ancestral coparcenary partition suit filed without daughter NOC',
      'Interim injunction stay petition listed before Danapur Sub-Judge Court',
      'Titleholder refusing joint measurement survey'
    ],
    recommendedAction: 'Engage Government Pleader to file Section 3H(4) Court Escrow deposit affidavit under NH Act 1956 to vacate stay on construction.',
    state: 'UNREAD'
  },

  // 3. HIGH: Compensation Pending on Flagship Parcel K-125/2
  {
    id: 'ALT-COMP-1252',
    title: 'Section 3G Award Sanction Pending: Khasra 125/2',
    severity: 'HIGH',
    type: 'COMPENSATION_PENDING',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    district: 'Patna',
    createdAt: '2026-03-02 11:15 AM',
    dueDate: '2026-03-12',
    reasons: [
      'Assessment schedule calculated (₹4.98 Cr)',
      'CALA formal decree signature pending for 14 days',
      'SBI Escrow voucher unreleased'
    ],
    recommendedAction: 'CALA to digitally sign Section 3G Statutory Decree and authorize PFMS DBT transfer.',
    state: 'UNREAD'
  },

  // 4. CRITICAL: Milestone Due - Expiry of Section 3D Declaration Window
  {
    id: 'ALT-MILESTONE-3D',
    title: 'Section 3D Statutory Declaration Expiry in 6 Days',
    severity: 'CRITICAL',
    type: 'MILESTONE_DUE',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    createdAt: '2026-03-03 08:00 AM',
    dueDate: '2026-03-11',
    reasons: [
      'Section 3A Gazette published 359 days ago',
      'Statutory 1-year lapsing provision under Section 3D(1) triggers in 6 calendar days',
      'Objection hearing summary pending final gazette upload'
    ],
    recommendedAction: 'Immediate notification upload to Bihar Gazette Extraordinary portal to prevent statutory lapsing.',
    state: 'UNREAD'
  },

  // 5. HIGH: Data Conflict / Boundary Discrepancy on Khasra 126/1
  {
    id: 'ALT-DATA-1261',
    title: 'Ground DGPS Survey Discrepancy (1.8m Deviation)',
    severity: 'HIGH',
    type: 'DATA_CONFLICT',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-126/1',
    khasraNo: '126/1',
    village: 'Kanhauli',
    district: 'Patna',
    createdAt: '2026-02-27 02:45 PM',
    dueDate: '2026-03-09',
    reasons: [
      'DGPS peg points deviate by 1.8m from digital revenue map',
      'Encroachment detected on outer RoW boundary',
      'Amin flagged re-verification required'
    ],
    recommendedAction: 'Conduct Joint Measurement Survey (JMS) with Circle Officer Bihta and Kanungo to reconcile demarcation.',
    state: 'READ'
  },

  // 6. HIGH: R&R Pending - Displaced Family Homestead Allotment
  {
    id: 'ALT-RR-8821',
    title: 'Displaced Family Alternate Homestead Allotment Pending',
    severity: 'HIGH',
    type: 'RR_PENDING',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    district: 'Patna',
    createdAt: '2026-02-25 10:20 AM',
    dueDate: '2026-03-15',
    reasons: [
      'PAF-8821-KAN (6 family members) physically displaced from dwelling unit',
      '50 Sq.m homestead plot not yet sanctioned in Kanhauli Colony',
      'Subsistence grant tranche 2 overdue'
    ],
    recommendedAction: 'Issue formal allotment letter for Plot No. H-14 at Kanhauli Model R&R Colony Site A and credit 6-month grant.',
    state: 'UNREAD'
  },

  // 7. MEDIUM: Missing Document on Khasra 415/3
  {
    id: 'ALT-DOC-4153',
    title: 'Missing PWD Structure Valuation Certificate',
    severity: 'MEDIUM',
    type: 'MISSING_DOCUMENT',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-415/3',
    khasraNo: '415/3',
    village: 'Kanhauli',
    district: 'Patna',
    createdAt: '2026-02-20 03:00 PM',
    dueDate: '2026-03-18',
    reasons: [
      'Brick masonry pump room identified on ground',
      'Executive Engineer PWD Building Division certificate pending submission',
      'Valuation schedule halted'
    ],
    recommendedAction: 'Issue requisition reminder to Executive Engineer PWD Building Division, Danapur.',
    state: 'READ'
  },

  // 8. MEDIUM: Field Verification Pending on Khasra 412/1
  {
    id: 'ALT-VER-4121',
    title: 'Amin Cadastral Ground Truth Verification In Progress',
    severity: 'MEDIUM',
    type: 'FIELD_VERIFICATION_PENDING',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-412/1',
    khasraNo: '412/1',
    village: 'Kanhauli',
    district: 'Patna',
    createdAt: '2026-03-02 04:30 PM',
    dueDate: '2026-03-08',
    reasons: [
      'Field survey report in progress by Surveyor Rajesh Kumar',
      'Geotagged photos 2 of 3 captured',
      'Panch witness signature pending'
    ],
    recommendedAction: 'Amin to complete 6-point checklist, capture final tri-junction photo, and submit audit hash.',
    state: 'UNREAD'
  },

  // 9. HIGH: High Risk Project - Forest & Environmental Clearance
  {
    id: 'ALT-PROJ-VKE',
    title: 'Stage-II Forest Clearance Pending on 22 Hectares',
    severity: 'HIGH',
    type: 'HIGH_RISK_PROJECT',
    projectId: 'NHAI-VKE-2026',
    projectName: 'Varanasi-Kolkata Expressway (Package 3)',
    district: 'Kaimur',
    createdAt: '2026-02-18 11:00 AM',
    dueDate: '2026-03-25',
    predictedDelayDays: 60,
    reasons: [
      'Compensatory Afforestation (CA) scheme payment verified',
      'MoEF&CC Regional Office final Stage-II working permission pending',
      'Right-of-Way tree felling stalled'
    ],
    recommendedAction: 'NHAI Project Director to coordinate with Principal Chief Conservator of Forests (PCCF) Bihar for Stage-II clearance.',
    state: 'READ'
  },

  // 10. MEDIUM: Delayed Case - Section 3C Hearing
  {
    id: 'ALT-DELAY-3C',
    title: 'Section 3C Landowner Objection Hearing Delayed by 22 Days',
    severity: 'MEDIUM',
    type: 'DELAYED_CASE',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-126/1',
    khasraNo: '126/1',
    village: 'Kanhauli',
    district: 'Patna',
    createdAt: '2026-02-10 09:00 AM',
    dueDate: '2026-02-28',
    reasons: [
      'Objection petition filed on circle rate calculation',
      'Competent Authority hearing adjourned twice due to assembly session duty',
      'Section 3D declaration held'
    ],
    recommendedAction: 'Fix peremptory hearing date on 10 March 2026 and issue formal hearing notices to petitioners.',
    state: 'UNREAD'
  },

  // 11. INFO: Routine System Notification
  {
    id: 'ALT-INFO-PFMS',
    title: 'PFMS Electronic Escrow Gateway Nightly Reconciliation Completed',
    severity: 'INFO',
    type: 'PENDING_APPROVAL',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    createdAt: 'Today, 05:00 AM',
    dueDate: '2026-03-31',
    reasons: [
      'Daily bank settlement log verified with SBI Escrow Branch',
      'Zero rejected DBT transactions',
      'Total ₹3.68 Cr confirmed for Khasra 130/2'
    ],
    recommendedAction: 'No action required. Routine statutory financial audit synchronized.',
    state: 'READ'
  },

  // 12. RESOLVED Example Alert
  {
    id: 'ALT-RES-1302',
    title: 'Section 3G Compensation Disbursed & Verified: Khasra 130/2',
    severity: 'INFO',
    type: 'COMPENSATION_PENDING',
    projectId: 'PRR-2026-001',
    projectName: 'Patna Ring Road Expansion (Phase II)',
    parcelId: 'K-130/2',
    khasraNo: '130/2',
    village: 'Kanhauli',
    district: 'Patna',
    createdAt: '2026-02-15 10:00 AM',
    dueDate: '2026-02-20',
    reasons: [
      'Initial bank account validation pending'
    ],
    recommendedAction: 'Verified with NPCI gateway and ₹3.68 Cr disbursed.',
    state: 'RESOLVED',
    resolvedAt: '2026-02-18 04:30 PM',
    resolvedBy: 'CALA Patna'
  }
];
