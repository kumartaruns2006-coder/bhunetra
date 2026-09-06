// Master Data Types
export type MasterDataCategory = 
  | 'STATES'
  | 'DISTRICTS'
  | 'VILLAGES'
  | 'DEPARTMENTS'
  | 'PROJECT_TYPES'
  | 'LAND_TYPES'
  | 'ACQUISITION_STAGES'
  | 'PARCEL_STATUSES'
  | 'RISK_LEVELS';

export interface MasterDataItem {
  id: string;
  code: string;
  name: string;
  category: MasterDataCategory;
  standardizedCode: string;
  description?: string;
  sourceStandard?: string;
  isActive: boolean;
}

// Data Validation Types
export type ValidationRuleId = 
  | 'REQUIRED_FIELDS'
  | 'INVALID_AREA'
  | 'DUPLICATE_PARCEL_ID'
  | 'DUPLICATE_PROJECT_ID'
  | 'INVALID_STATUS'
  | 'MISSING_PROJECT_LINKAGE'
  | 'MISSING_COORDINATES'
  | 'INVALID_DOCUMENT_LINKAGE';

export type ValidationSeverity = 'VALID' | 'WARNING' | 'ERROR';

export interface ValidationResultItem {
  id: string;
  ruleId: ValidationRuleId;
  ruleName: string;
  severity: ValidationSeverity;
  entityType: 'PARCEL' | 'PROJECT';
  entityId: string;
  entityLabel: string;
  field: string;
  message: string;
  suggestedFix?: string;
}

export interface ValidationSummary {
  totalChecked: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
  compliancePercentage: number;
}

// API Integration Center Types
export type ApiIntegrationId = 
  | 'LAND_RECORDS'
  | 'CADASTRAL_MAP'
  | 'FINANCIAL_SYSTEM'
  | 'GIS_PORTAL'
  | 'PROJECT_SYSTEM'
  | 'NOTIFICATION_GATEWAY';

export type ApiConnectionStatus = 'CONNECTED' | 'MOCK_CONNECTED' | 'UNAVAILABLE';

export interface ApiIntegrationCard {
  id: ApiIntegrationId;
  name: string;
  department: string;
  endpoint: string;
  status: ApiConnectionStatus;
  lastSync: string;
  recordsSynced: number;
  syncStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR';
  errorCount: number;
  authMethod: string;
  description: string;
  protocol: 'REST / HTTPS' | 'WFS / WMS' | 'SOAP / XML' | 'PFMS-API';
}

// Data Synchronization Telemetry
export interface DataSyncSummary {
  lastSyncTimestamp: string;
  recordsReceived: number;
  recordsUpdated: number;
  conflictsCount: number;
  syncState: 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';
}

// Data Conflict Types
export interface DataConflictSourceValue {
  value: string | number;
  unit: string;
  sourceName: string;
  sourceType: 'GIS' | 'LAND_RECORD' | 'DOCUMENT';
  lastUpdated: string;
  referenceNo?: string;
}

export interface DataConflictRecord {
  id: string;
  parcelId: string;
  khasraNo: string;
  projectId: string;
  village: string;
  conflictField: string;
  sources: {
    gis: DataConflictSourceValue;
    landRecord: DataConflictSourceValue;
    document: DataConflictSourceValue;
  };
  discrepancyDelta: string;
  status: 'DETECTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'IGNORED';
  resolvedValue?: string | number;
  resolvedSource?: 'GIS' | 'LAND_RECORD' | 'DOCUMENT' | 'MANUAL_CONCILIATION';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionRemarks?: string;
}

// RESTful Service Interfaces (Section 6)
export interface RestApiResponse<T> {
  success: boolean;
  timestamp: string;
  statusCode: number;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ILandRecordsApi {
  getRoRDetails(khasraNo: string, villageCode: string): Promise<RestApiResponse<any>>;
  verifyMutationStatus(mutationCaseNo: string): Promise<RestApiResponse<any>>;
}

export interface ICadastralMapApi {
  getParcelGeometry(khasraNo: string, villageCode: string): Promise<RestApiResponse<any>>;
  getCorridorWfsLayer(corridorId: string): Promise<RestApiResponse<any>>;
}

export interface IFinancialSystemApi {
  getEscrowBalance(projectId: string): Promise<RestApiResponse<any>>;
  submitDbtPaymentOrder(orderPayload: any): Promise<RestApiResponse<any>>;
}

export interface IGisApi {
  getSurveyOfIndiaSatelliteTiles(bbox: [number, number, number, number]): Promise<RestApiResponse<any>>;
  calculatePolygonIntersection(polygonA: any, polygonB: any): Promise<RestApiResponse<any>>;
}

export interface IProjectSystemApi {
  getGatiShaktiAlignment(projectId: string): Promise<RestApiResponse<any>>;
  pushCorridorStatusUpdate(statusPayload: any): Promise<RestApiResponse<any>>;
}

export interface INotificationApi {
  sendDltSms(mobile: string, templateId: string, params: Record<string, string>): Promise<RestApiResponse<any>>;
  sendGovMail(to: string, subject: string, bodyHtml: string): Promise<RestApiResponse<any>>;
}
