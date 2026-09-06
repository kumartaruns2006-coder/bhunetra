// Service for PART 14: Security, RBAC, Audit Log, and Governance

import {
  AuditLogEntry,
  DocumentVersionAudit,
  DataAccessRule,
  SecurityStatusSummary,
  ActiveSessionDetails,
  RolePermissionMatrixItem
} from '../types/security';
import { User } from '../types/auth';
import { mockUsers } from '../data/mockUsers';

class SecurityService {
  // 1. Immutable Audit Log entries with 9 columns and the exact required showcase examples
  getAuditLogs(): AuditLogEntry[] {
    return [
      {
        id: 'aud-001',
        user: 'Rajeshwar K. Verma, IAS',
        officerId: 'BR-OAS-2012-441',
        role: 'Land Acquiring Authority',
        action: 'Officer uploaded document',
        module: 'Documents',
        record: 'Award_1252.pdf',
        timestamp: '05 Sep 2026, 10:45 AM IST',
        previousValue: 'DRAFT_PENDING_VALUATION',
        newValue: 'UPLOADED_AWARD_FINAL_V2',
        ipSessionId: '10.144.22.45 • SES-BR-8921',
        severity: 'SUCCESS'
      },
      {
        id: 'aud-002',
        user: 'Pradeep K. Jha, IAS',
        officerId: 'BR-IAS-2006-089',
        role: 'State Officer',
        action: 'State Officer approved proposal',
        module: 'Proposal Approval',
        record: 'PRR-PH2-2026 (Patna Ring Road)',
        timestamp: '05 Sep 2026, 09:30 AM IST',
        previousValue: 'SCRUTINY_PENDING_STATE_CLEARANCE',
        newValue: 'SANCTIONED_CABINET_APPROVED',
        ipSessionId: '10.144.12.82 • SES-BR-7714',
        severity: 'SUCCESS'
      },
      {
        id: 'aud-003',
        user: 'Amitabh Kumar',
        officerId: 'BR-AMIN-2018-8492',
        role: 'Field Officer',
        action: 'Field Officer verified parcel',
        module: 'Field Verification',
        record: 'Parcel K-125/2 (Khasra 125/2)',
        timestamp: '05 Sep 2026, 08:15 AM IST',
        previousValue: 'VERIFICATION_PENDING_GROUND_TRUTH',
        newValue: 'DGPS_VERIFIED_BOUNDARY_MATCHED',
        ipSessionId: '10.144.64.210 • SES-MOB-4190',
        severity: 'SUCCESS'
      },
      {
        id: 'aud-004',
        user: 'Alok Ranjan, IAS',
        officerId: 'GOI-IAS-1998-042',
        role: 'National Administrator',
        action: 'National Admin updated RBAC policy',
        module: 'Security & Governance',
        record: 'RolePolicy: LAND_ACQUIRING_AUTHORITY',
        timestamp: '04 Sep 2026, 05:20 PM IST',
        previousValue: 'VALUATION_SANCTION_LIMIT_25CR',
        newValue: 'VALUATION_SANCTION_LIMIT_50CR',
        ipSessionId: '10.24.112.4 • SES-NIC-0012',
        severity: 'WARNING'
      },
      {
        id: 'aud-005',
        user: 'Dr. Anand Kishore, IAS',
        officerId: 'BR-IAS-2008-014',
        role: 'District Collector/Officer',
        action: 'Disbursed compensation via PFMS',
        module: 'Compensation & Escrow',
        record: 'CALA Escrow Tranche #14',
        timestamp: '04 Sep 2026, 03:10 PM IST',
        previousValue: 'ESCROW_ALLOCATED_₹14.50_CR',
        newValue: 'DBT_DISBURSED_42_ACCOUNTS',
        ipSessionId: '10.144.20.10 • SES-BR-6623',
        severity: 'INFO'
      },
      {
        id: 'aud-006',
        user: 'Sunita Murthy',
        officerId: 'NHAI-CES-2010-092',
        role: 'Project Implementing Agency',
        action: 'Submitted alignment variation memo',
        module: 'GIS & Projects',
        record: 'PRR-BR-VARIATION-03',
        timestamp: '04 Sep 2026, 11:05 AM IST',
        previousValue: 'ROW_WIDTH_60M',
        newValue: 'ROW_WIDTH_70M_INTERCHANGE',
        ipSessionId: '10.45.18.9 • SES-NHAI-118',
        severity: 'INFO'
      },
      {
        id: 'aud-007',
        user: 'System Security Sentry',
        officerId: 'SEC-BOT-001',
        role: 'Automated Security Daemon',
        action: 'Blocked unauthorized administrative attempt',
        module: 'Administration & Security',
        record: 'AuthEndpoint: /api/v1/admin/security',
        timestamp: '04 Sep 2026, 09:40 AM IST',
        previousValue: 'FIELD_OFFICER_SESSION_ACTIVE',
        newValue: 'HTTP_403_ACCESS_RESTRICTED',
        ipSessionId: '10.144.64.210 • SES-MOB-4190',
        severity: 'CRITICAL'
      }
    ];
  }

  // 2. DOCUMENT AUDIT with Version History
  getDocumentAudits(): DocumentVersionAudit[] {
    return [
      {
        documentId: 'doc-award-1252',
        documentName: 'Award_1252.pdf',
        documentType: 'Statutory Valuation Award (Section 3G)',
        projectCode: 'NHAI-BR-PRR-PH2',
        parcelId: 'K-125/2',
        currentVersion: 'v3.0',
        versions: [
          {
            version: 'v3.0',
            date: '05 Sep 2026, 10:45 AM',
            uploadedBy: 'Rajeshwar K. Verma, IAS (CALA)',
            reviewer: 'Alok Ranjan, IAS (MoRTH Director)',
            action: 'Version updated with court conciliation decree',
            status: 'APPROVED',
            hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            fileSize: '4.2 MB',
            changeSummary: 'Updated solatium factor from 1.0x to 1.25x following Gram Sabha conciliation'
          },
          {
            version: 'v2.0',
            date: '28 Aug 2026, 04:15 PM',
            uploadedBy: 'Rajeshwar K. Verma, IAS (CALA)',
            reviewer: 'Pradeep K. Jha, IAS (State Secretary)',
            action: 'Reviewed by State Officer and approved',
            status: 'REPLACED',
            hashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
            fileSize: '3.8 MB',
            changeSummary: 'Incorporated tree and standing crop valuation certificate from District Horticulture Officer'
          },
          {
            version: 'v1.0',
            date: '15 Aug 2026, 11:20 AM',
            uploadedBy: 'Amin Rajesh Kumar (Surveyor)',
            reviewer: 'Rajeshwar K. Verma, IAS (CALA)',
            action: 'Uploaded by Officer / Initial valuation draft',
            status: 'ARCHIVED',
            hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
            fileSize: '3.1 MB',
            changeSummary: 'Initial baseline land valuation assessment based on Circle Rate 2025-26'
          }
        ]
      },
      {
        documentId: 'doc-sec3a-gazette',
        documentName: 'Section_3A_Gazette_PRR.pdf',
        documentType: 'Central Gazette Notification (Section 3A)',
        projectCode: 'NHAI-BR-PRR-PH2',
        currentVersion: 'v2.0',
        versions: [
          {
            version: 'v2.0',
            date: '14 Apr 2026, 02:00 PM',
            uploadedBy: 'Sanjay K. Sinha (Joint Secretary)',
            reviewer: 'MoRTH Legal Cell',
            action: 'Corrigendum gazetted for Khasra 125/2 boundary',
            status: 'APPROVED',
            hashSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
            fileSize: '2.4 MB',
            changeSummary: 'Rectified boundary alignment description for Bihta urban reach'
          },
          {
            version: 'v1.0',
            date: '02 Apr 2026, 09:30 AM',
            uploadedBy: 'Sanjay K. Sinha (Joint Secretary)',
            reviewer: 'Gazette of India Secretariat',
            action: 'Statutory Extraordinary Gazette published',
            status: 'ARCHIVED',
            hashSha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
            fileSize: '2.1 MB',
            changeSummary: 'Official Section 3A Gazette publication across 14 revenue villages'
          }
        ]
      }
    ];
  }

  // 3. DATA ACCESS MATRIX: Who can view, Who can edit, Who can approve
  getDataAccessRules(): DataAccessRule[] {
    return [
      {
        id: 'da-1',
        assetName: 'Project Proposals & Corridor Alignments',
        category: 'PROJECTS',
        description: 'Corridor master alignment, feasibility studies, and preliminary budget requests.',
        whoCanView: ['All 9 Authorized Roles', 'Executive Viewer', 'Public Portal (Sanitized)'],
        whoCanEdit: ['National Administrator', 'Central Ministry', 'Project Implementing Agency (NHAI)'],
        whoCanApprove: ['National Administrator', 'Central Ministry Officer', 'State Officer']
      },
      {
        id: 'da-2',
        assetName: 'Cadastral Parcel Records (Digital Twin)',
        category: 'PARCELS',
        description: 'Khasra-level ownership data, GIS boundaries, land use classification, and Jamabandi extracts.',
        whoCanView: ['National Admin', 'State Officer', 'District Collector', 'CALA', 'PIA', 'Field Officer'],
        whoCanEdit: ['District Collector', 'CALA / Additional Collector', 'Field Officer (Survey Findings)'],
        whoCanApprove: ['CALA / Additional Collector', 'District Collector']
      },
      {
        id: 'da-3',
        assetName: 'Statutory Gazette & Legal Deeds',
        category: 'DOCUMENTS',
        description: 'Section 3A, 3D, and 3G notifications, title affidavits, and judicial stay decrees.',
        whoCanView: ['All 9 Authorized Roles'],
        whoCanEdit: ['Central Ministry', 'State Officer', 'CALA', 'Project Implementing Agency'],
        whoCanApprove: ['Central Ministry (3A/3D)', 'CALA / Additional Collector (3G Awards)']
      },
      {
        id: 'da-4',
        assetName: 'Valuation Awards & Escrow Disbursements',
        category: 'COMPENSATION',
        description: 'Section 3G awards, 100% solatium calculations, PFMS DBT bank accounts, and treasury orders.',
        whoCanView: ['National Admin', 'Central Ministry', 'State Officer', 'District Collector', 'CALA', 'R&R Officer'],
        whoCanEdit: ['CALA Office', 'District Treasury Officer'],
        whoCanApprove: ['Competent Authority (CALA)', 'District Collector (Expenditures > ₹25 Cr)']
      },
      {
        id: 'da-5',
        assetName: 'R&R Census, Entitlements & Relocation',
        category: 'RR',
        description: 'Project Affected Family (PAF) census, housing allotment deeds, and subsistence annuity registers.',
        whoCanView: ['National Admin', 'State Officer', 'District Collector', 'CALA', 'R&R Officer', 'Executive Viewer'],
        whoCanEdit: ['Rehabilitation & Resettlement Officer', 'CALA Office'],
        whoCanApprove: ['State R&R Commissioner', 'District Collector']
      },
      {
        id: 'da-6',
        assetName: 'Amin Ground Surveys & DGPS Coordinates',
        category: 'FIELD_DATA',
        description: 'Real-time DGPS mobile survey logs, boundary pegging photos, and physical encroachment notices.',
        whoCanView: ['Field Officer', 'CALA', 'Project Implementing Agency', 'District Collector', 'National Admin'],
        whoCanEdit: ['Field Officer / Circle Amin (During Active Survey)'],
        whoCanApprove: ['Circle Officer (CO)', 'Competent Authority (CALA)']
      },
      {
        id: 'da-7',
        assetName: 'Administration, RBAC & Cryptographic Logs',
        category: 'GOVERNANCE',
        description: 'Master RBAC permissions, audit trace logs, API key issuance, and system security telemetry.',
        whoCanView: ['National Administrator ONLY'],
        whoCanEdit: ['National Administrator ONLY'],
        whoCanApprove: ['National Administrator ONLY (Dual-Key Cabinet Directive)']
      }
    ];
  }

  // 4. SECURITY STATUS: The exact statuses requested in user prompt
  getSecurityStatus(): SecurityStatusSummary {
    return {
      authentication: {
        status: 'Enabled',
        description: 'Two-Factor Authentication (OTP / Digital Token) with Jan Parichay SSO Integration',
        protocol: 'SAML 2.0 / OpenID Connect'
      },
      rbac: {
        status: 'Enabled',
        description: 'Strict Role-Based Access Control enforced at Gateway and Service layers',
        roleCount: 9,
        moduleCount: 12
      },
      audit: {
        status: 'Enabled',
        description: 'Cryptographically linked append-only audit trail logging state mutations',
        retentionDays: 2555, // 7 years statutory requirement
        immutableHash: 'SHA-256'
      },
      encryption: {
        status: 'Architecture Ready',
        description: 'AES-256-GCM data-at-rest encryption & TLS 1.3 in-transit communications pipeline',
        standards: 'NICNET / ISO-27001 Ready'
      },
      apiSecurity: {
        status: 'Architecture Ready',
        description: 'mTLS mutual authentication, rate limiting, and HMAC request signature validation',
        gateway: 'Enterprise API Gateway'
      }
    };
  }

  // 5. Active Session Management
  getActiveSession(user: User): ActiveSessionDetails {
    return {
      userId: user.id,
      userName: user.name,
      roleTitle: user.roleTitle,
      designation: user.designation,
      officerId: user.officerId,
      lastLogin: user.lastLogin?.timestamp || 'Today, 09:15 AM IST',
      currentSessionId: `SES-GOV-${Math.abs(user.id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString().slice(0, 6)}`,
      ipAddress: user.lastLogin?.ipAddress || '10.24.112.4',
      sessionTokenMasked: 'jwt-sha256-••••••••••••••••7c4a',
      deviceFingerprint: 'GovSecure-Edge-Win64-NIC-2026',
      authMethod: 'DEMO_TOKEN / Jan Parichay SSO',
      expiresInMinutes: 48
    };
  }

  // 6. Role Permission Matrix across the 9 system roles
  getRolePermissionMatrix(): RolePermissionMatrixItem[] {
    return mockUsers.map(u => ({
      roleCode: u.role,
      roleTitle: u.roleTitle,
      scope: u.scope,
      tier: u.scope === 'NATIONAL' ? 'TIER-1 (APEX)' : u.scope === 'STATE' ? 'TIER-2 (STATE)' : u.scope === 'DISTRICT' ? 'TIER-3 (DISTRICT)' : 'TIER-4 (OPERATIONAL)',
      permissions: [
        { module: 'National Dashboard', canView: u.allowedModules.includes('dashboard'), canEdit: false, canApprove: false },
        { module: 'Projects & Proposals', canView: u.allowedModules.includes('projects'), canEdit: u.canWrite && u.scope !== 'FIELD', canApprove: u.canApproveAwards },
        { module: 'GIS Cadastral Map', canView: u.allowedModules.includes('gis'), canEdit: u.canWrite, canApprove: false },
        { module: 'Statutory Workflow', canView: u.allowedModules.includes('workflow'), canEdit: u.canWrite, canApprove: u.canApproveAwards },
        { module: 'Document Locker', canView: u.allowedModules.includes('documents'), canEdit: u.canWrite, canApprove: u.canApproveAwards },
        { module: 'Field Verification', canView: u.allowedModules.includes('field_verification'), canEdit: u.canConductFieldVerification, canApprove: u.canApproveAwards },
        { module: 'Compensation & Awards', canView: u.allowedModules.includes('compensation_rr'), canEdit: u.canWrite && u.scope !== 'FIELD', canApprove: u.canApproveAwards },
        { module: 'AI Risk Radar', canView: u.allowedModules.includes('ai_intelligence'), canEdit: false, canApprove: false },
        { module: 'MIS & Reports', canView: u.allowedModules.includes('reports_mis'), canEdit: false, canApprove: false },
        { module: 'Administration & Security', canView: u.allowedModules.includes('administration'), canEdit: u.role === 'NATIONAL_ADMIN', canApprove: u.role === 'NATIONAL_ADMIN' }
      ]
    }));
  }
}

export const securityService = new SecurityService();
