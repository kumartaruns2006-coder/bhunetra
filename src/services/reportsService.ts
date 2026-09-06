// Service layer for PART 13: Reports, MIS, Trend Analytics, Comparative Analytics, and Executive Intervention

import {
  ReportType,
  ReportTypeConfig,
  ReportFilterState,
  ReportDataRow,
  ReportSummaryStats,
  MonthlyTrendRecord,
  ComparativeEntity,
  ComparisonMetric,
  InterventionCase,
  ExecutiveMacroKpis
} from '../types/reports';
import { ProjectCorridor } from '../types/project';
import { Parcel } from '../types/parcel';
import { mockStatePerformances, mockProjectProgressRecords } from '../data/mockNationalDashboard';

export const REPORT_TYPE_CONFIGS: Record<ReportType, ReportTypeConfig> = {
  ACQUISITION_PROGRESS: {
    id: 'ACQUISITION_PROGRESS',
    title: 'Acquisition Progress Report',
    category: 'PHYSICAL',
    badge: 'Statutory Progress',
    description: 'Comprehensive tracking of linear RoW acquisition, village progress, and notification milestones.',
    columns: ['Project / Village', 'Total Parcels', 'Acquired', 'RoW Progress %', 'Target Date']
  },
  LAND_PROPOSED_VS_ACQUIRED: {
    id: 'LAND_PROPOSED_VS_ACQUIRED',
    title: 'Land Proposed vs Acquired Matrix',
    category: 'PHYSICAL',
    badge: 'Acreage Balances',
    description: 'Statutory land area audit comparing proposed Section 3A alignment vs final Section 3E possession.',
    columns: ['Corridor Reach', 'Proposed (Acres)', 'Acquired (Acres)', 'Balance (Acres)', 'Acquisition %']
  },
  NOTIFICATIONS: {
    id: 'NOTIFICATIONS',
    title: 'Statutory Notifications Ledger',
    category: 'STATUTORY',
    badge: 'Gazette Tracking',
    description: 'Gazette tracking for Section 3A, 3C inquiry, and 3D declarations with legal limitation deadlines.',
    columns: ['Notification Ref', 'Statutory Stage', 'Gazette Date', 'Villages Covered', 'Validity / Status']
  },
  AWARDS: {
    id: 'AWARDS',
    title: 'Statutory Awards (Section 3G) Register',
    category: 'STATUTORY',
    badge: 'Award Decrees',
    description: 'Formal CALA awards declared under Section 3G of NH Act / Section 23 of RFCTLARR Act 2013.',
    columns: ['Award Number', 'Competent Authority', 'Plots Covered', 'Total Valuation (₹ Cr)', 'Status']
  },
  COMPENSATION: {
    id: 'COMPENSATION',
    title: 'Compensation Disbursement Ledger',
    category: 'FINANCIAL',
    badge: 'DBT Escrow',
    description: 'Direct Benefit Transfer tracking, CALA escrow account balances, and raiyat payment clearance rates.',
    columns: ['Beneficiary Group', 'Assessed (₹ Cr)', 'Approved (₹ Cr)', 'Disbursed (₹ Cr)', 'Pending DBT']
  },
  RR: {
    id: 'RR',
    title: 'Resettlement & Rehabilitation (R&R) Audit',
    category: 'STATUTORY',
    badge: 'RFCTLARR Schedule II',
    description: 'Entitlements tracking under Schedule II & III: subsistence grants, housing units, and cattle shed aid.',
    columns: ['Project / Sector', 'PAF Entitled', 'Grants Paid', 'Plots Allocated', 'R&R Compliance %']
  },
  POSSESSION: {
    id: 'POSSESSION',
    title: 'Physical Possession Handover Report',
    category: 'PHYSICAL',
    badge: 'Section 3E Demarcation',
    description: 'Encumbrance-free Right-of-Way handed over to civil contractors for construction commencement.',
    columns: ['Chainage Km', 'Length (Km)', 'Possession Area (Ac)', 'Contractor Handover', 'Encroachment Status']
  },
  AFFECTED_FAMILIES: {
    id: 'AFFECTED_FAMILIES',
    title: 'Project Affected Families (PAFs) Census',
    category: 'STATUTORY',
    badge: 'SIA Census',
    description: 'Demographic and socio-economic census of land titleholders, agricultural tenants, and artisans.',
    columns: ['Village / Panchayat', 'Titleholders', 'Tenants / Livelihood', 'Vulnerable Families', 'Survey Verification']
  },
  DISPLACED_FAMILIES: {
    id: 'DISPLACED_FAMILIES',
    title: 'Project Displaced Families (PDFs) Status',
    category: 'STATUTORY',
    badge: 'Physical Relocation',
    description: 'Monitoring families physically relocated from homestead land to designated resettlement colonies.',
    columns: ['Colony / Settlement', 'Displaced Count', 'Allotted Homes', 'Infrastructure Ready', 'Relocation Status']
  },
  TIMELINE_COMPLIANCE: {
    id: 'TIMELINE_COMPLIANCE',
    title: 'Milestone Timeline Compliance Audit',
    category: 'RISK',
    badge: 'SLA Monitoring',
    description: 'Evaluation of actual milestone completion vs cabinet-approved and statutory target deadlines.',
    columns: ['Milestone Name', 'Responsible Agency', 'Target Date', 'Actual Date / Slip', 'Compliance Status']
  },
  DELAYED_PROJECTS: {
    id: 'DELAYED_PROJECTS',
    title: 'Delayed Corridors & Bottleneck Register',
    category: 'RISK',
    badge: 'Slippage Tracking',
    description: 'Corridors exceeding scheduled timeline baselines with root-cause diagnostic categorization.',
    columns: ['Corridor Code', 'Current Stage', 'Days Delayed', 'Primary Bottleneck', 'Escalation Level']
  },
  HIGH_RISK_PROJECTS: {
    id: 'HIGH_RISK_PROJECTS',
    title: 'High-Risk & Litigated Projects Register',
    category: 'RISK',
    badge: 'Critical Watchlist',
    description: 'National watchlist of projects with AI Risk Score ≥ 70 requiring chief secretary intervention.',
    columns: ['Project Name', 'Risk Score', 'Litigation / Issue', 'Delay Forecast', 'Recommended Action']
  },
  FIELD_VERIFICATION: {
    id: 'FIELD_VERIFICATION',
    title: 'Amin Ground Verification Telemetry',
    category: 'PHYSICAL',
    badge: 'DGPS RTK Survey',
    description: 'Mobile DGPS survey progress, geo-tagged photograph uploads, and boundary pegging verification.',
    columns: ['Survey Circle / Amin', 'Assigned Plots', 'DGPS Verified', 'Discrepancy Found', 'Sync Status']
  }
};

class ReportsService {
  // 1. Generate dynamic structured data rows based on ReportType and 8 Filters
  generateReportData(
    type: ReportType,
    filters: ReportFilterState,
    _activeProject?: ProjectCorridor,
    _parcels?: Parcel[]
  ): { rows: ReportDataRow[]; summary: ReportSummaryStats } {
    const isStateMatch = (s: string) => !filters.state || filters.state === 'All States' || s === filters.state;
    const isRiskMatch = (r: string) => !filters.risk || filters.risk === 'All Risks' || r === filters.risk;
    const isDeptMatch = (d: string) => !filters.department || filters.department === 'All Departments' || d.includes(filters.department) || filters.department.includes(d);

    const baseRows: ReportDataRow[] = [];

    switch (type) {
      case 'ACQUISITION_PROGRESS':
        baseRows.push(
          {
            id: 'apr-1',
            projectCode: 'NHAI-BR-PRR-PH2',
            projectName: 'Patna Ring Road Expansion (Phase II)',
            state: 'Bihar',
            district: 'Patna',
            village: 'Kanhauli',
            department: 'MoRTH / NHAI',
            stage: 'Section 3H',
            status: 'POSSESSION_IN_PROGRESS',
            risk: 'HIGH',
            col1Label: 'Village / Reach',
            col1Value: 'Kanhauli Reach (Bihta)',
            col2Label: 'Total Parcels',
            col2Value: '86 Plots',
            col3Label: 'Acquired Plots',
            col3Value: '54 Plots',
            col4Label: 'Progress %',
            col4Value: '62.8%',
            col5Label: 'Target Date',
            col5Value: '31 Aug 2026',
            dateRef: '2026-03-01',
            remarks: 'Escrow DBT in progress; 18 plots pending Amin survey'
          },
          {
            id: 'apr-2',
            projectCode: 'NHAI-BR-PRR-PH2',
            projectName: 'Patna Ring Road Expansion (Phase II)',
            state: 'Bihar',
            district: 'Patna',
            village: 'Danapur Nizamat',
            department: 'MoRTH / NHAI',
            stage: 'Section 3E',
            status: 'ON_TRACK',
            risk: 'LOW',
            col1Label: 'Village / Reach',
            col1Value: 'Danapur Cantonment Bypass',
            col2Label: 'Total Parcels',
            col2Value: '72 Plots',
            col3Label: 'Acquired Plots',
            col3Value: '60 Plots',
            col4Label: 'Progress %',
            col4Value: '83.3%',
            col5Label: 'Target Date',
            col5Value: '30 Jun 2026',
            dateRef: '2026-02-15',
            remarks: 'Physical possession handed over to EPC contractor'
          },
          {
            id: 'apr-3',
            projectCode: 'NHAI-BR-NH119D',
            projectName: 'Amas-Darbhanga Expressway (Corridor 3)',
            state: 'Bihar',
            district: 'Jehanabad',
            village: 'Masaudhi North',
            department: 'MoRTH / NHAI',
            stage: 'Section 3G',
            status: 'ON_TRACK',
            risk: 'MEDIUM',
            col1Label: 'Village / Reach',
            col1Value: 'Masaudhi North Stretch',
            col2Label: 'Total Parcels',
            col2Value: '140 Plots',
            col3Label: 'Acquired Plots',
            col3Value: '110 Plots',
            col4Label: 'Progress %',
            col4Value: '78.5%',
            col5Label: 'Target Date',
            col5Value: '31 Oct 2026',
            dateRef: '2026-02-28',
            remarks: 'Valuation awards published; DBT mandate creation active'
          },
          {
            id: 'apr-4',
            projectCode: 'UPEIDA-UP-GNG-P1',
            projectName: 'Ganga Expressway Mega Corridor (Package 1)',
            state: 'Uttar Pradesh',
            district: 'Varanasi',
            village: 'Chandauli Border',
            department: 'MoRTH / NHAI',
            stage: 'Section 3E',
            status: 'ON_TRACK',
            risk: 'LOW',
            col1Label: 'Village / Reach',
            col1Value: 'Varanasi Rural Section',
            col2Label: 'Total Parcels',
            col2Value: '380 Plots',
            col3Label: 'Acquired Plots',
            col3Value: '323 Plots',
            col4Label: 'Progress %',
            col4Value: '85.0%',
            col5Label: 'Target Date',
            col5Value: '15 Jul 2026',
            dateRef: '2026-03-02',
            remarks: 'Civil work started on cleared RoW stretch'
          },
          {
            id: 'apr-5',
            projectCode: 'MSRDC-MH-SMR-PH2',
            projectName: 'Samruddhi Mahamarg Phase-II Extension',
            state: 'Maharashtra',
            district: 'Nagpur',
            village: 'Hingna Rural',
            department: 'MoRTH / NHAI',
            stage: 'Section 3G',
            status: 'DELAYED',
            risk: 'CRITICAL',
            col1Label: 'Village / Reach',
            col1Value: 'Hingna Industrial Buffer',
            col2Label: 'Total Parcels',
            col2Value: '210 Plots',
            col3Label: 'Acquired Plots',
            col3Value: '118 Plots',
            col4Label: 'Progress %',
            col4Value: '56.2%',
            col5Label: 'Target Date',
            col5Value: '30 Nov 2026',
            dateRef: '2026-02-20',
            remarks: 'Commercial circle rate agitation; CALA meeting scheduled'
          }
        );
        break;

      case 'LAND_PROPOSED_VS_ACQUIRED':
        baseRows.push(
          {
            id: 'lp-1',
            projectCode: 'NHAI-BR-PRR-PH2',
            projectName: 'Patna Ring Road Expansion (Phase II)',
            state: 'Bihar',
            district: 'Patna',
            department: 'MoRTH / NHAI',
            stage: 'Section 3H',
            status: 'POSSESSION_IN_PROGRESS',
            risk: 'HIGH',
            col1Label: 'Corridor Reach',
            col1Value: 'Kanhauli - Digha (38.4 km)',
            col2Label: 'Proposed (Acres)',
            col2Value: 614.0,
            col3Label: 'Acquired (Acres)',
            col3Value: 405.2,
            col4Label: 'Balance (Acres)',
            col4Value: 208.8,
            col5Label: 'Acquisition %',
            col5Value: '66.0%',
            dateRef: '2026-03-01'
          },
          {
            id: 'lp-2',
            projectCode: 'NHAI-BR-NH119D',
            projectName: 'Amas-Darbhanga Expressway (Corridor 3)',
            state: 'Bihar',
            district: 'Jehanabad',
            department: 'MoRTH / NHAI',
            stage: 'Section 3G',
            status: 'ON_TRACK',
            risk: 'MEDIUM',
            col1Label: 'Corridor Reach',
            col1Value: 'Amas-Jehanabad Stretch (64.2 km)',
            col2Label: 'Proposed (Acres)',
            col2Value: 964.0,
            col3Label: 'Acquired (Acres)',
            col3Value: 698.9,
            col4Label: 'Balance (Acres)',
            col4Value: 265.1,
            col5Label: 'Acquisition %',
            col5Value: '72.5%',
            dateRef: '2026-03-01'
          },
          {
            id: 'lp-3',
            projectCode: 'UPEIDA-UP-GNG-P1',
            projectName: 'Ganga Expressway Mega Corridor (Package 1)',
            state: 'Uttar Pradesh',
            district: 'Varanasi',
            department: 'MoRTH / NHAI',
            stage: 'Section 3E',
            status: 'ON_TRACK',
            risk: 'LOW',
            col1Label: 'Corridor Reach',
            col1Value: 'Varanasi-Prayagraj Link (92.5 km)',
            col2Label: 'Proposed (Acres)',
            col2Value: 1420.0,
            col3Label: 'Acquired (Acres)',
            col3Value: 1207.0,
            col4Label: 'Balance (Acres)',
            col4Value: 213.0,
            col5Label: 'Acquisition %',
            col5Value: '85.0%',
            dateRef: '2026-03-01'
          },
          {
            id: 'lp-4',
            projectCode: 'NHAI-UP-VRK-2025',
            projectName: 'Varanasi-Ranchi-Kolkata Economic Corridor',
            state: 'Uttar Pradesh',
            district: 'Chandauli',
            department: 'MoRTH / NHAI',
            stage: 'Section 3D',
            status: 'DELAYED',
            risk: 'HIGH',
            col1Label: 'Corridor Reach',
            col1Value: 'Chandauli Border Reach (76.0 km)',
            col2Label: 'Proposed (Acres)',
            col2Value: 1150.0,
            col3Label: 'Acquired (Acres)',
            col3Value: 782.0,
            col4Label: 'Balance (Acres)',
            col4Value: 368.0,
            col5Label: 'Acquisition %',
            col5Value: '68.0%',
            dateRef: '2026-02-28'
          },
          {
            id: 'lp-5',
            projectCode: 'NHAI-GJ-DME-04',
            projectName: 'Delhi-Mumbai Expressway (Vadodara-Kim)',
            state: 'Gujarat',
            district: 'Vadodara',
            department: 'MoRTH / NHAI',
            stage: 'Section 3E',
            status: 'ON_TRACK',
            risk: 'LOW',
            col1Label: 'Corridor Reach',
            col1Value: 'Vadodara Industrial Corridor (112.0 km)',
            col2Label: 'Proposed (Acres)',
            col2Value: 1680.0,
            col3Label: 'Acquired (Acres)',
            col3Value: 1545.6,
            col4Label: 'Balance (Acres)',
            col4Value: 134.4,
            col5Label: 'Acquisition %',
            col5Value: '92.0%',
            dateRef: '2026-03-02'
          }
        );
        break;

      case 'COMPENSATION':
        baseRows.push(
          {
            id: 'comp-1',
            projectCode: 'NHAI-BR-PRR-PH2',
            projectName: 'Patna Ring Road Expansion (Phase II)',
            state: 'Bihar',
            district: 'Patna',
            department: 'MoRTH / NHAI',
            stage: 'Section 3H',
            status: 'POSSESSION_IN_PROGRESS',
            risk: 'HIGH',
            col1Label: 'CALA Jurisdiction',
            col1Value: 'CALA Patna Sadar & Bihta',
            col2Label: 'Assessed (₹ Cr)',
            col2Value: '₹482.60 Cr',
            col3Label: 'Approved (₹ Cr)',
            col3Value: '₹440.00 Cr',
            col4Label: 'Disbursed (₹ Cr)',
            col4Value: '₹328.14 Cr',
            col5Label: 'Pending DBT',
            col5Value: '₹111.86 Cr',
            dateRef: '2026-03-01',
            remarks: 'Disbursed to 318 raiyats via PFMS; 110 cases in bank validation'
          },
          {
            id: 'comp-2',
            projectCode: 'NHAI-BR-NH119D',
            projectName: 'Amas-Darbhanga Expressway (Corridor 3)',
            state: 'Bihar',
            district: 'Jehanabad',
            department: 'MoRTH / NHAI',
            stage: 'Section 3H',
            status: 'ON_TRACK',
            risk: 'MEDIUM',
            col1Label: 'CALA Jurisdiction',
            col1Value: 'CALA Jehanabad & Gaya',
            col2Label: 'Assessed (₹ Cr)',
            col2Value: '₹710.00 Cr',
            col3Label: 'Approved (₹ Cr)',
            col3Value: '₹680.00 Cr',
            col4Label: 'Disbursed (₹ Cr)',
            col4Value: '₹512.40 Cr',
            col5Label: 'Pending DBT',
            col5Value: '₹167.60 Cr',
            dateRef: '2026-02-28',
            remarks: 'Escrow account active; 72.2% cleared'
          },
          {
            id: 'comp-3',
            projectCode: 'UPEIDA-UP-GNG-P1',
            projectName: 'Ganga Expressway Mega Corridor (Package 1)',
            state: 'Uttar Pradesh',
            district: 'Varanasi',
            department: 'MoRTH / NHAI',
            stage: 'Section 3E',
            status: 'ON_TRACK',
            risk: 'LOW',
            col1Label: 'CALA Jurisdiction',
            col1Value: 'CALA Varanasi & Prayagraj',
            col2Label: 'Assessed (₹ Cr)',
            col2Value: '₹890.00 Cr',
            col3Label: 'Approved (₹ Cr)',
            col3Value: '₹890.00 Cr',
            col4Label: 'Disbursed (₹ Cr)',
            col4Value: '₹786.76 Cr',
            col5Label: 'Pending DBT',
            col5Value: '₹103.24 Cr',
            dateRef: '2026-03-02',
            remarks: 'High disbursement rate with automated e-mandate clearance'
          },
          {
            id: 'comp-4',
            projectCode: 'MSRDC-MH-SMR-PH2',
            projectName: 'Samruddhi Mahamarg Phase-II Extension',
            state: 'Maharashtra',
            district: 'Nagpur',
            department: 'MoRTH / NHAI',
            stage: 'Section 3G',
            status: 'CRITICAL_HOLD',
            risk: 'CRITICAL',
            col1Label: 'CALA Jurisdiction',
            col1Value: 'CALA Nagpur & Wardha',
            col2Label: 'Assessed (₹ Cr)',
            col2Value: '₹620.00 Cr',
            col3Label: 'Approved (₹ Cr)',
            col3Value: '₹510.00 Cr',
            col4Label: 'Disbursed (₹ Cr)',
            col4Value: '₹326.40 Cr',
            col5Label: 'Pending DBT',
            col5Value: '₹183.60 Cr',
            dateRef: '2026-02-18',
            remarks: 'Escrow replenishment requested; 35 raiyats under court stay'
          }
        );
        break;

      case 'DELAYED_PROJECTS':
      case 'HIGH_RISK_PROJECTS':
        baseRows.push(
          {
            id: 'hr-rep-1',
            projectCode: 'NHAI-BR-PRR-PH2',
            projectName: 'Patna Ring Road Expansion (Phase II)',
            state: 'Bihar',
            district: 'Patna',
            department: 'MoRTH / NHAI',
            stage: 'Section 3H',
            status: 'DELAYED',
            risk: 'HIGH',
            col1Label: 'Risk Score / Level',
            col1Value: '78 / 100 (HIGH)',
            col2Label: 'Predicted Delay',
            col2Value: '42 Days',
            col3Label: 'Primary Bottleneck',
            col3Value: 'Compensation backlog & 18 unverified plots',
            col4Label: 'Legal Injunctions',
            col4Value: '3 Stay Petitions',
            col5Label: 'Recommended Action',
            col5Value: 'Prioritize 18 high-risk parcels in Kanhauli',
            dateRef: '2026-03-01',
            remarks: 'Escalate to CALA Patna for Lok Adalat hearing'
          },
          {
            id: 'hr-rep-2',
            projectCode: 'NHAI-OD-OCH-01',
            projectName: 'Odisha Coastal Highway (Digha-Rameswaram)',
            state: 'Odisha',
            district: 'Puri',
            department: 'MoRTH / NHAI',
            stage: 'Section 3D',
            status: 'CRITICAL_HOLD',
            risk: 'CRITICAL',
            col1Label: 'Risk Score / Level',
            col1Value: '86 / 100 (CRITICAL)',
            col2Label: 'Predicted Delay',
            col2Value: '210 Days',
            col3Label: 'Primary Bottleneck',
            col3Value: 'Stage-II Forest clearance & Eco-zone overlap',
            col4Label: 'Legal Injunctions',
            col4Value: 'NGT Stay Notice',
            col5Label: 'Recommended Action',
            col5Value: 'Compensatory afforestation land mutation',
            dateRef: '2026-02-25',
            remarks: 'Cabinet note prepared for Chief Secretary review'
          },
          {
            id: 'hr-rep-3',
            projectCode: 'MSRDC-MH-SMR-PH2',
            projectName: 'Samruddhi Mahamarg Phase-II Extension',
            state: 'Maharashtra',
            district: 'Nagpur',
            department: 'MoRTH / NHAI',
            stage: 'Section 3G',
            status: 'DELAYED',
            risk: 'CRITICAL',
            col1Label: 'Risk Score / Level',
            col1Value: '82 / 100 (CRITICAL)',
            col2Label: 'Predicted Delay',
            col2Value: '120 Days',
            col3Label: 'Primary Bottleneck',
            col3Value: 'Farmer Sangathan circle rate litigation',
            col4Label: 'Legal Injunctions',
            col4Value: '5 Writ Petitions',
            col5Label: 'Recommended Action',
            col5Value: 'Convene Special CALA Conciliation Lok Adalat',
            dateRef: '2026-02-20',
            remarks: 'High commercial solatium demanded'
          },
          {
            id: 'hr-rep-4',
            projectCode: 'NHAI-UP-VRK-2025',
            projectName: 'Varanasi-Ranchi-Kolkata Economic Corridor',
            state: 'Uttar Pradesh',
            district: 'Chandauli',
            department: 'MoRTH / NHAI',
            stage: 'Section 3D',
            status: 'DELAYED',
            risk: 'HIGH',
            col1Label: 'Risk Score / Level',
            col1Value: '74 / 100 (HIGH)',
            col2Label: 'Predicted Delay',
            col2Value: '95 Days',
            col3Label: 'Primary Bottleneck',
            col3Value: 'Legacy Khatiyan 1962 RoR vs GIS discrepancy',
            col4Label: 'Legal Injunctions',
            col4Value: '2 Gram Sabha suits',
            col5Label: 'Recommended Action',
            col5Value: 'Order joint revenue DGPS re-measurement',
            dateRef: '2026-02-28',
            remarks: '19 parcels recorded as Gram Sabha public land'
          }
        );
        break;

      default:
        // Generic fallback for other report types: NOTIFICATIONS, AWARDS, RR, POSSESSION, AFFECTED_FAMILIES, DISPLACED_FAMILIES, TIMELINE_COMPLIANCE, FIELD_VERIFICATION
        baseRows.push(
          {
            id: `gen-1-${type}`,
            projectCode: 'NHAI-BR-PRR-PH2',
            projectName: 'Patna Ring Road Expansion (Phase II)',
            state: 'Bihar',
            district: 'Patna',
            village: 'Kanhauli',
            department: 'MoRTH / NHAI',
            stage: 'Section 3H',
            status: 'POSSESSION_IN_PROGRESS',
            risk: 'HIGH',
            col1Label: REPORT_TYPE_CONFIGS[type].columns[0],
            col1Value: 'PRR-BR-2026-SEC-01',
            col2Label: REPORT_TYPE_CONFIGS[type].columns[1],
            col2Value: 'Section 3H Disbursement',
            col3Label: REPORT_TYPE_CONFIGS[type].columns[2],
            col3Value: '12 Feb 2026',
            col4Label: REPORT_TYPE_CONFIGS[type].columns[3],
            col4Value: '6 Revenue Villages',
            col5Label: REPORT_TYPE_CONFIGS[type].columns[4],
            col5Value: 'Valid (42 Days to 3E)',
            dateRef: '2026-02-12',
            remarks: 'Statutory compliance tracked under RFCTLARR 2013'
          },
          {
            id: `gen-2-${type}`,
            projectCode: 'NHAI-BR-NH119D',
            projectName: 'Amas-Darbhanga Expressway (Corridor 3)',
            state: 'Bihar',
            district: 'Jehanabad',
            village: 'Masaudhi North',
            department: 'MoRTH / NHAI',
            stage: 'Section 3G',
            status: 'ON_TRACK',
            risk: 'MEDIUM',
            col1Label: REPORT_TYPE_CONFIGS[type].columns[0],
            col1Value: 'AD-EXP-BR-03',
            col2Label: REPORT_TYPE_CONFIGS[type].columns[1],
            col2Value: 'Section 3G Award',
            col3Label: REPORT_TYPE_CONFIGS[type].columns[2],
            col3Value: '08 Jan 2026',
            col4Label: REPORT_TYPE_CONFIGS[type].columns[3],
            col4Value: '4 Revenue Villages',
            col5Label: REPORT_TYPE_CONFIGS[type].columns[4],
            col5Value: 'Compliant & Verified',
            dateRef: '2026-01-08',
            remarks: 'Joint survey completed with district revenue officer'
          },
          {
            id: `gen-3-${type}`,
            projectCode: 'UPEIDA-UP-GNG-P1',
            projectName: 'Ganga Expressway Mega Corridor (Package 1)',
            state: 'Uttar Pradesh',
            district: 'Varanasi',
            department: 'MoRTH / NHAI',
            stage: 'Section 3E',
            status: 'ON_TRACK',
            risk: 'LOW',
            col1Label: REPORT_TYPE_CONFIGS[type].columns[0],
            col1Value: 'GNG-UP-PKG-01',
            col2Label: REPORT_TYPE_CONFIGS[type].columns[1],
            col2Value: 'Section 3E Possession',
            col3Label: REPORT_TYPE_CONFIGS[type].columns[2],
            col3Value: '18 Dec 2025',
            col4Label: REPORT_TYPE_CONFIGS[type].columns[3],
            col4Value: '12 Revenue Villages',
            col5Label: REPORT_TYPE_CONFIGS[type].columns[4],
            col5Value: 'Handover Completed',
            dateRef: '2025-12-18',
            remarks: '100% encumbrance free RoW secured'
          },
          {
            id: `gen-4-${type}`,
            projectCode: 'NHAI-GJ-DME-04',
            projectName: 'Delhi-Mumbai Expressway (Vadodara-Kim)',
            state: 'Gujarat',
            district: 'Vadodara',
            department: 'MoRTH / NHAI',
            stage: 'Section 3E',
            status: 'ON_TRACK',
            risk: 'LOW',
            col1Label: REPORT_TYPE_CONFIGS[type].columns[0],
            col1Value: 'DME-GJ-SEC-04',
            col2Label: REPORT_TYPE_CONFIGS[type].columns[1],
            col2Value: 'Commercial RoW Handover',
            col3Label: REPORT_TYPE_CONFIGS[type].columns[2],
            col3Value: '25 Nov 2025',
            col4Label: REPORT_TYPE_CONFIGS[type].columns[3],
            col4Value: '8 Revenue Villages',
            col5Label: REPORT_TYPE_CONFIGS[type].columns[4],
            col5Value: 'Operational',
            dateRef: '2025-11-25',
            remarks: 'High speed logistics lane completed'
          }
        );
        break;
    }

    // Apply active 8 filters
    const filteredRows = baseRows.filter(r => {
      if (!isStateMatch(r.state)) return false;
      if (filters.district && filters.district !== 'All Districts' && r.district !== filters.district) return false;
      if (filters.project && filters.project !== 'All Projects' && !r.projectName.includes(filters.project) && !r.projectCode.includes(filters.project)) return false;
      if (!isDeptMatch(r.department)) return false;
      if (filters.stage && filters.stage !== 'All Stages' && !r.stage.includes(filters.stage)) return false;
      if (filters.status && filters.status !== 'All Statuses' && r.status !== filters.status) return false;
      if (!isRiskMatch(r.risk)) return false;
      return true;
    });

    const summary: ReportSummaryStats = {
      totalRecords: filteredRows.length,
      primaryMetricLabel: 'Corridors Evaluated',
      primaryMetricValue: `${filteredRows.length} Projects`,
      secondaryMetricLabel: 'Filter Compliance Rate',
      secondaryMetricValue: '94.8%',
      tertiaryMetricLabel: 'Total Financial Allocation',
      tertiaryMetricValue: '₹2,702.60 Cr',
      quaternaryMetricLabel: 'Average Risk Rating',
      quaternaryMetricValue: filteredRows.some(r => r.risk === 'CRITICAL' || r.risk === 'HIGH') ? 'HIGH (68/100)' : 'MODERATE (42/100)'
    };

    return { rows: filteredRows, summary };
  }

  // 2. Real CSV file generation and browser download
  exportToCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
    const escapeCsv = (val: string | number) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(row => row.map(escapeCsv).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 3. SECTION 2: Monthly Trend Analytics (12 Months Historical & Projected)
  getMonthlyTrends(): MonthlyTrendRecord[] {
    return [
      { month: 'Apr 2025', shortMonth: 'Apr', year: 2025, projectsCompleted: 4, landAcquiredAcres: 2480, compensationDisbursedCr: 48.5, rrCompletedFamilies: 980, possessionCompletedAcres: 1940, velocityPercentMoM: 5.2 },
      { month: 'May 2025', shortMonth: 'May', year: 2025, projectsCompleted: 5, landAcquiredAcres: 2790, compensationDisbursedCr: 54.2, rrCompletedFamilies: 1120, possessionCompletedAcres: 2180, velocityPercentMoM: 8.4 },
      { month: 'Jun 2025', shortMonth: 'Jun', year: 2025, projectsCompleted: 7, landAcquiredAcres: 3120, compensationDisbursedCr: 62.8, rrCompletedFamilies: 1250, possessionCompletedAcres: 2450, velocityPercentMoM: 11.2 },
      { month: 'Jul 2025', shortMonth: 'Jul', year: 2025, projectsCompleted: 6, landAcquiredAcres: 2850, compensationDisbursedCr: 58.0, rrCompletedFamilies: 1140, possessionCompletedAcres: 2240, velocityPercentMoM: -4.8 },
      { month: 'Aug 2025', shortMonth: 'Aug', year: 2025, projectsCompleted: 8, landAcquiredAcres: 3410, compensationDisbursedCr: 68.4, rrCompletedFamilies: 1390, possessionCompletedAcres: 2680, velocityPercentMoM: 14.2 },
      { month: 'Sep 2025', shortMonth: 'Sep', year: 2025, projectsCompleted: 9, landAcquiredAcres: 3680, compensationDisbursedCr: 74.5, rrCompletedFamilies: 1520, possessionCompletedAcres: 2890, velocityPercentMoM: 9.8 },
      { month: 'Oct 2025', shortMonth: 'Oct', year: 2025, projectsCompleted: 11, landAcquiredAcres: 4120, compensationDisbursedCr: 86.2, rrCompletedFamilies: 1740, possessionCompletedAcres: 3260, velocityPercentMoM: 16.5 },
      { month: 'Nov 2025', shortMonth: 'Nov', year: 2025, projectsCompleted: 12, landAcquiredAcres: 4350, compensationDisbursedCr: 92.4, rrCompletedFamilies: 1880, possessionCompletedAcres: 3440, velocityPercentMoM: 7.1 },
      { month: 'Dec 2025', shortMonth: 'Dec', year: 2025, projectsCompleted: 14, landAcquiredAcres: 4790, compensationDisbursedCr: 104.8, rrCompletedFamilies: 2040, possessionCompletedAcres: 3820, velocityPercentMoM: 12.8 },
      { month: 'Jan 2026', shortMonth: 'Jan', year: 2026, projectsCompleted: 15, landAcquiredAcres: 4980, compensationDisbursedCr: 112.6, rrCompletedFamilies: 2180, possessionCompletedAcres: 3950, velocityPercentMoM: 6.4 },
      { month: 'Feb 2026', shortMonth: 'Feb', year: 2026, projectsCompleted: 17, landAcquiredAcres: 5340, compensationDisbursedCr: 122.4, rrCompletedFamilies: 2350, possessionCompletedAcres: 4210, velocityPercentMoM: 9.2 },
      { month: 'Mar 2026', shortMonth: 'Mar', year: 2026, projectsCompleted: 20, landAcquiredAcres: 5890, compensationDisbursedCr: 138.5, rrCompletedFamilies: 2640, possessionCompletedAcres: 4680, velocityPercentMoM: 13.5 }
    ];
  }

  // 4. SECTION 3: Comparative Analytics (State vs State, District vs District, Project vs Project)
  getComparativeEntities(category: 'STATE' | 'DISTRICT' | 'PROJECT'): ComparativeEntity[] {
    if (category === 'STATE') {
      return [
        {
          id: 'BR',
          name: 'Bihar',
          category: 'STATE',
          tag: 'Eastern Corridor Zone',
          metrics: {
            'Active Projects': 22,
            'Proposed Land (Acres)': 8940,
            'Acquired Land (Acres)': 6480,
            'Acquisition Rate (%)': 72.5,
            'Compensation Disbursed (₹ Cr)': 158.2,
            'Disbursement Rate (%)': 73.4,
            'R&R Progress (%)': 64.0,
            'Possession Handover (%)': 66.0,
            'High Risk Projects': 5,
            'Average Delay (Days)': 42
          }
        },
        {
          id: 'UP',
          name: 'Uttar Pradesh',
          category: 'STATE',
          tag: 'Northern Expressway Hub',
          metrics: {
            'Active Projects': 34,
            'Proposed Land (Acres)': 14250,
            'Acquired Land (Acres)': 11400,
            'Acquisition Rate (%)': 80.0,
            'Compensation Disbursed (₹ Cr)': 262.5,
            'Disbursement Rate (%)': 75.9,
            'R&R Progress (%)': 74.0,
            'Possession Handover (%)': 78.5,
            'High Risk Projects': 4,
            'Average Delay (Days)': 31
          }
        },
        {
          id: 'MH',
          name: 'Maharashtra',
          category: 'STATE',
          tag: 'Western Freight Hub',
          metrics: {
            'Active Projects': 26,
            'Proposed Land (Acres)': 10860,
            'Acquired Land (Acres)': 8145,
            'Acquisition Rate (%)': 75.0,
            'Compensation Disbursed (₹ Cr)': 185.6,
            'Disbursement Rate (%)': 66.3,
            'R&R Progress (%)': 69.0,
            'Possession Handover (%)': 68.2,
            'High Risk Projects': 4,
            'Average Delay (Days)': 56
          }
        },
        {
          id: 'GJ',
          name: 'Gujarat',
          category: 'STATE',
          tag: 'Industrial Logistics Belt',
          metrics: {
            'Active Projects': 18,
            'Proposed Land (Acres)': 7420,
            'Acquired Land (Acres)': 6307,
            'Acquisition Rate (%)': 85.0,
            'Compensation Disbursed (₹ Cr)': 122.3,
            'Disbursement Rate (%)': 74.0,
            'R&R Progress (%)': 82.0,
            'Possession Handover (%)': 88.0,
            'High Risk Projects': 1,
            'Average Delay (Days)': 18
          }
        }
      ];
    } else if (category === 'DISTRICT') {
      return [
        {
          id: 'PATNA',
          name: 'Patna District',
          category: 'DISTRICT',
          tag: 'Bihar State Capital',
          metrics: {
            'Active Corridors': 4,
            'Revenue Villages': 48,
            'Proposed Plots': 1180,
            'Acquired Plots': 812,
            'Acquisition %': 68.8,
            'Disbursed (₹ Cr)': 342.5,
            'PFMS Success %': 91.2,
            'High Risk Plots': 28,
            'Average Slip (Days)': 38
          }
        },
        {
          id: 'SARAN',
          name: 'Saran District',
          category: 'DISTRICT',
          tag: 'North Ganga Belt',
          metrics: {
            'Active Corridors': 2,
            'Revenue Villages': 24,
            'Proposed Plots': 640,
            'Acquired Plots': 468,
            'Acquisition %': 73.1,
            'Disbursed (₹ Cr)': 174.0,
            'PFMS Success %': 88.4,
            'High Risk Plots': 12,
            'Average Slip (Days)': 24
          }
        },
        {
          id: 'VARANASI',
          name: 'Varanasi District',
          category: 'DISTRICT',
          tag: 'Eastern UP Hub',
          metrics: {
            'Active Corridors': 5,
            'Revenue Villages': 62,
            'Proposed Plots': 1520,
            'Acquired Plots': 1292,
            'Acquisition %': 85.0,
            'Disbursed (₹ Cr)': 480.2,
            'PFMS Success %': 95.4,
            'High Risk Plots': 14,
            'Average Slip (Days)': 19
          }
        },
        {
          id: 'CHANDAULI',
          name: 'Chandauli District',
          category: 'DISTRICT',
          tag: 'Border Corridor',
          metrics: {
            'Active Corridors': 3,
            'Revenue Villages': 36,
            'Proposed Plots': 890,
            'Acquired Plots': 605,
            'Acquisition %': 68.0,
            'Disbursed (₹ Cr)': 215.8,
            'PFMS Success %': 84.6,
            'High Risk Plots': 22,
            'Average Slip (Days)': 45
          }
        }
      ];
    } else {
      // PROJECT vs PROJECT
      return [
        {
          id: 'PRR',
          name: 'Patna Ring Road Expansion (Phase II)',
          category: 'PROJECT',
          tag: 'NHAI-BR-PRR-PH2',
          metrics: {
            'Corridor Length (Km)': 38.4,
            'Total Budget (₹ Cr)': 482.6,
            'Disbursed (₹ Cr)': 328.1,
            'Possession Secured (%)': 66.0,
            'Total Parcels': 482,
            'High Risk Parcels': 28,
            'Predicted Delay (Days)': 42,
            'R&R Compliance (%)': 65.0
          }
        },
        {
          id: 'AMAS',
          name: 'Amas-Darbhanga Expressway (Corridor 3)',
          category: 'PROJECT',
          tag: 'NHAI-BR-NH119D',
          metrics: {
            'Corridor Length (Km)': 64.2,
            'Total Budget (₹ Cr)': 710.0,
            'Disbursed (₹ Cr)': 512.4,
            'Possession Secured (%)': 72.5,
            'Total Parcels': 620,
            'High Risk Parcels': 20,
            'Predicted Delay (Days)': 28,
            'R&R Compliance (%)': 70.0
          }
        },
        {
          id: 'GANGA',
          name: 'Ganga Expressway Mega Corridor (Pkg 1)',
          category: 'PROJECT',
          tag: 'UPEIDA-UP-GNG-P1',
          metrics: {
            'Corridor Length (Km)': 92.5,
            'Total Budget (₹ Cr)': 890.0,
            'Disbursed (₹ Cr)': 786.8,
            'Possession Secured (%)': 85.0,
            'Total Parcels': 1140,
            'High Risk Parcels': 15,
            'Predicted Delay (Days)': 14,
            'R&R Compliance (%)': 82.0
          }
        }
      ];
    }
  }

  compareEntities(a: ComparativeEntity, b: ComparativeEntity): ComparisonMetric[] {
    const keys = Object.keys(a.metrics);
    return keys.map(key => {
      const valA = a.metrics[key] ?? 0;
      const valB = b.metrics[key] ?? 0;
      const diff = Math.round((valA - valB) * 10) / 10;
      const base = valB === 0 ? 1 : Math.abs(valB);
      const diffPercent = Math.round(((valA - valB) / base) * 1000) / 10;
      
      // Determine leader (for "Days" and "High Risk", lower is better; else higher is better)
      const isInverse = key.includes('Delay') || key.includes('Slip') || key.includes('Risk');
      let leader: 'A' | 'B' | 'TIE' = 'TIE';
      if (valA !== valB) {
        if (isInverse) {
          leader = valA < valB ? 'A' : 'B';
        } else {
          leader = valA > valB ? 'A' : 'B';
        }
      }

      return {
        label: key,
        unit: key.includes('%') ? '%' : key.includes('Cr') ? '₹ Cr' : key.includes('Km') ? 'Km' : key.includes('Days') ? 'Days' : '',
        valA,
        valB,
        diff,
        diffPercent,
        leader
      };
    });
  }

  // 5. SECTION 4: Executive Dashboard Macro KPIs
  getNationalKpis(): ExecutiveMacroKpis {
    return {
      activeProjects: 128,
      landProposedAcres: 52840,
      landAcquiredAcres: 39620,
      landAcquiredPercent: 75.0,
      compensationAssessedCr: 1240.0,
      compensationDisbursedCr: 842.0,
      compensationDisbursedPercent: 67.9,
      rrEligibleFamilies: 24580,
      rrCompletedFamilies: 16714,
      rrCompletedPercent: 68.0,
      possessionHandedAcres: 31240,
      possessionHandedPercent: 59.1,
      highRiskProjectsCount: 18,
      highRiskProjectsPercent: 14.1
    };
  }

  // 6. SECTION 5: Intervention Center Cases
  getInterventionCases(): InterventionCase[] {
    return [
      {
        id: 'int-1',
        projectId: 'PRR-PH2-2026',
        projectName: 'Patna Ring Road Expansion (Phase II)',
        projectCode: 'NHAI-BR-PRR-PH2',
        state: 'Bihar',
        district: 'Patna',
        riskLevel: 'HIGH',
        riskScore: 78,
        predictedDelayDays: 42,
        primaryIssues: ['Compensation', 'Verification', 'Documents'],
        recommendedAction: 'Prioritize 18 high-risk parcels in Kanhauli to unlock continuous 7.2 km Right-of-Way.',
        urgency: 'IMMEDIATE',
        targetDate: '2026-03-31',
        affectedParcelsCount: 18,
        estimatedCostImpactCr: 24.8,
        status: 'PENDING_ACTION'
      },
      {
        id: 'int-2',
        projectId: 'OCH-OD-PKG1',
        projectName: 'Odisha Coastal Highway (Digha-Rameswaram)',
        projectCode: 'NHAI-OD-OCH-01',
        state: 'Odisha',
        district: 'Puri',
        riskLevel: 'CRITICAL',
        riskScore: 86,
        predictedDelayDays: 210,
        primaryIssues: ['Forest Clearance', 'Eco-Zone', 'NGT Stay'],
        recommendedAction: 'Submit compensatory afforestation mutation certificate; convene Ministry Task Force.',
        urgency: 'IMMEDIATE',
        targetDate: '2026-04-15',
        affectedParcelsCount: 42,
        estimatedCostImpactCr: 45.0,
        status: 'ESCALATED'
      },
      {
        id: 'int-3',
        projectId: 'SMR-PH2-MH',
        projectName: 'Samruddhi Mahamarg Phase-II Extension',
        projectCode: 'MSRDC-MH-SMR-PH2',
        state: 'Maharashtra',
        district: 'Nagpur',
        riskLevel: 'CRITICAL',
        riskScore: 82,
        predictedDelayDays: 120,
        primaryIssues: ['Circle Rate Dispute', 'Farmer Agitation', 'Escrow Balance'],
        recommendedAction: 'Convene Special CALA Conciliation Lok Adalat; notify updated multiplication factor.',
        urgency: 'HIGH',
        targetDate: '2026-04-30',
        affectedParcelsCount: 35,
        estimatedCostImpactCr: 38.5,
        status: 'PENDING_ACTION'
      },
      {
        id: 'int-4',
        projectId: 'VRK-EC-UP',
        projectName: 'Varanasi-Ranchi-Kolkata Economic Corridor',
        projectCode: 'NHAI-UP-VRK-2025',
        state: 'Uttar Pradesh',
        district: 'Chandauli',
        riskLevel: 'HIGH',
        riskScore: 74,
        predictedDelayDays: 95,
        primaryIssues: ['Khatiyan Mismatch', 'Gram Sabha Land', 'Section 3D Lapse'],
        recommendedAction: 'Order joint revenue DGPS re-measurement under Sec 12; update digital Bhulekh record.',
        urgency: 'HIGH',
        targetDate: '2026-04-10',
        affectedParcelsCount: 19,
        estimatedCostImpactCr: 18.2,
        status: 'IN_REVIEW'
      }
    ];
  }

  // 7. 5-Tier Hierarchical Drilldown Resolvers: National -> State -> District -> Project -> Parcel
  getDrilldownStates() {
    return mockStatePerformances.map(s => ({
      code: s.code,
      name: s.state,
      projectsCount: s.projectsCount,
      proposedLandAcres: s.proposedLandAcres,
      acquiredLandAcres: s.acquiredLandAcres,
      acquisitionPercent: s.acquisitionPercent,
      riskLevel: s.riskLevel,
      topDistricts: s.topDistricts
    }));
  }

  getDrilldownDistricts(stateName: string) {
    const st = mockStatePerformances.find(s => s.state.toLowerCase() === stateName.toLowerCase());
    const districts = st ? st.topDistricts : ['Patna Sadar', 'Bihta', 'Danapur', 'Naubatpur'];
    return districts.map(d => ({
      name: d,
      state: stateName,
      projectsCount: d === 'Patna' ? 4 : 2,
      plotsCount: d === 'Patna' ? 482 : 240,
      acquisitionPercent: d === 'Patna' ? 68.4 : 74.2,
      riskStatus: d === 'Patna' ? 'HIGH' : 'MEDIUM'
    }));
  }

  getDrilldownProjects(stateName: string, districtName?: string) {
    const all = mockProjectProgressRecords;
    return all.filter(p => {
      const matchState = !stateName || stateName === 'All States' || p.state.toLowerCase() === stateName.toLowerCase();
      const matchDist = !districtName || districtName === 'All Districts' || p.district.toLowerCase() === districtName.toLowerCase();
      return matchState && matchDist;
    });
  }
}

export const reportsService = new ReportsService();
