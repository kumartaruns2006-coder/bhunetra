export type UserRole =
  | 'NATIONAL_ADMIN'
  | 'CENTRAL_MINISTRY'
  | 'STATE_OFFICER'
  | 'DISTRICT_COLLECTOR'
  | 'LAND_ACQUIRING_AUTHORITY'
  | 'PROJECT_IMPLEMENTING_AGENCY'
  | 'RR_OFFICER'
  | 'FIELD_OFFICER'
  | 'EXECUTIVE_VIEWER'
  | 'CITIZEN';

export type NavModuleId =
  | 'dashboard'
  | 'projects'
  | 'gis'
  | 'workflow'
  | 'documents'
  | 'field_verification'
  | 'compensation_rr'
  | 'alerts'
  | 'ai_intelligence'
  | 'reports_mis'
  | 'executive_dashboard'
  | 'administration'
  | 'citizen';

export type PermissionScope = 'NATIONAL' | 'STATE' | 'DISTRICT' | 'PROJECT' | 'FIELD';

export interface User {
  id: string;
  name: string;
  email: string;
  officerId: string;
  role: UserRole;
  roleTitle: string;
  designation: string;
  department: string;
  cadre: string;
  jurisdiction: string;
  stateScope?: string;
  districtScope?: string;
  projectScope?: string[];
  scope: PermissionScope;
  avatarInitials: string;
  badgeColor: string;
  lastLogin: {
    timestamp: string;
    ipAddress: string;
    network: string;
    authMethod: 'PASSWORD' | 'JAN_PARICHAY_SSO' | 'DEMO_TOKEN';
  };
  allowedModules: NavModuleId[];
  canWrite: boolean;
  canApproveAwards: boolean;
  canConductFieldVerification: boolean;
  citizenProfile?: {
    mobileMasked: string;
    aadhaarMasked?: string;
    epicVoterId?: string;
    linkedParcelIds: string[];
    primaryParcelId: string;
    state: string;
    district: string;
    village: string;
    khasraNo: string;
    khataNo: string;
  };
}

export interface AuthSession {
  token: string;
  user: User;
  loginTime: string;
  expiresInSeconds: number;
  encryptionStandard: string;
}
