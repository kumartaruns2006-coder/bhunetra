// Types for PART 14: Security and Governance

export interface AuditLogEntry {
  id: string;
  user: string;              // Officer Name (e.g. "Shri Alok Ranjan, IAS")
  officerId: string;         // e.g. "GOI-IAS-1998-042"
  role: string;              // e.g. "National Administrator", "State Officer", "Field Officer"
  action: string;            // e.g. "Officer uploaded document", "State Officer approved proposal", "Field Officer verified parcel"
  module: string;            // e.g. "Documents", "Proposal Approval", "Field Verification", "Compensation"
  record: string;            // e.g. "Award_1252.pdf", "PRR-PH2-2026", "Parcel K-125/2"
  timestamp: string;         // e.g. "05 Sep 2026, 11:42 AM IST"
  previousValue: string;     // e.g. "DRAFT_PENDING", "UNVERIFIED", "₹0.00 Cr"
  newValue: string;          // e.g. "APPROVED", "DGPS_VERIFIED", "₹4.82 Cr"
  ipSessionId: string;       // e.g. "10.144.22.45 • SES-BR-8921"
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

export interface DocumentVersionAudit {
  documentId: string;
  documentName: string;
  documentType: string;
  projectCode: string;
  parcelId?: string;
  currentVersion: string;
  versions: {
    version: string;
    date: string;
    uploadedBy: string;
    reviewer: string;
    action: string;
    status: 'APPROVED' | 'PENDING' | 'REPLACED' | 'ARCHIVED';
    hashSha256: string;
    fileSize: string;
    changeSummary: string;
  }[];
}

export interface DataAccessRule {
  id: string;
  assetName: string;
  category: 'PROJECTS' | 'PARCELS' | 'DOCUMENTS' | 'COMPENSATION' | 'RR' | 'FIELD_DATA' | 'GOVERNANCE';
  description: string;
  whoCanView: string[];
  whoCanEdit: string[];
  whoCanApprove: string[];
}

export interface SecurityStatusSummary {
  authentication: {
    status: 'Enabled';
    description: 'Two-Factor Authentication (OTP / Digital Token) with Jan Parichay SSO Integration';
    protocol: 'SAML 2.0 / OpenID Connect';
  };
  rbac: {
    status: 'Enabled';
    description: 'Strict Role-Based Access Control enforced at Gateway and Service layers';
    roleCount: number;
    moduleCount: number;
  };
  audit: {
    status: 'Enabled';
    description: 'Cryptographically linked append-only audit trail logging state mutations';
    retentionDays: number;
    immutableHash: 'SHA-256';
  };
  encryption: {
    status: 'Architecture Ready';
    description: 'AES-256-GCM data-at-rest encryption & TLS 1.3 in-transit communications pipeline';
    standards: 'NICNET / ISO-27001 Ready';
  };
  apiSecurity: {
    status: 'Architecture Ready';
    description: 'mTLS mutual authentication, rate limiting, and HMAC request signature validation';
    gateway: 'Enterprise API Gateway';
  };
}

export interface ActiveSessionDetails {
  userId: string;
  userName: string;
  roleTitle: string;
  designation: string;
  officerId: string;
  lastLogin: string;
  currentSessionId: string;
  ipAddress: string;
  sessionTokenMasked: string;
  deviceFingerprint: string;
  authMethod: string;
  expiresInMinutes: number;
}

export interface RolePermissionMatrixItem {
  roleCode: string;
  roleTitle: string;
  scope: 'NATIONAL' | 'STATE' | 'DISTRICT' | 'PROJECT' | 'FIELD';
  tier: 'TIER-1 (APEX)' | 'TIER-2 (STATE)' | 'TIER-3 (DISTRICT)' | 'TIER-4 (OPERATIONAL)';
  permissions: {
    module: string;
    canView: boolean;
    canEdit: boolean;
    canApprove: boolean;
  }[];
}
