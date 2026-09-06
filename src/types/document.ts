// Types for PART 7: DOCUMENT MANAGEMENT & DOCUMENT AI

export type DocumentCategory = 
  | 'PROJECT_PROPOSAL'
  | 'LAND_RECORDS'
  | 'NOTIFICATIONS'
  | 'SIA'
  | 'OBJECTION_HEARING'
  | 'DECLARATION'
  | 'AWARD'
  | 'COMPENSATION'
  | 'RR'
  | 'POSSESSION'
  | 'MAPS'
  | 'FIELD_REPORTS'
  | 'OTHER';

export type DocumentStatus = 
  | 'VERIFIED'
  | 'PENDING_REVIEW'
  | 'DISCREPANCY'
  | 'ARCHIVED';

export type DocumentAiStatus = 
  | 'NOT_PROCESSED'
  | 'PROCESSING'
  | 'EXTRACTED'
  | 'FAILED';

export interface DocumentVersionItem {
  versionNumber: string; // e.g. "Version 1", "Version 2", "Version 3"
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  fileName: string;
  fileHash: string; // SHA-256
  changeSummary: string;
}

export type DocumentAuditAction = 
  | 'UPLOADED_BY_OFFICER'
  | 'REVIEWED_BY_STATE_OFFICER'
  | 'VERSION_UPDATED'
  | 'APPROVED'
  | 'ARCHIVED';

export interface DocumentAuditEntry {
  id: string;
  timestamp: string;
  action: DocumentAuditAction;
  actionLabel: string;
  actorName: string;
  actorRole: string;
  version: string;
  notes: string;
  digitalSealHash: string;
}

export interface ExtractedFieldItem {
  value: string;
  confidence: number; // 0 to 100 percentage
  verified: boolean;
}

export interface ExtractedDocumentFields {
  documentType: ExtractedFieldItem;
  projectId: ExtractedFieldItem;
  parcelId: ExtractedFieldItem;
  khasra: ExtractedFieldItem;
  date: ExtractedFieldItem;
  area: ExtractedFieldItem;
  amount: ExtractedFieldItem;
  overallConfidence: number;
}

export type AiProcessingStep = 
  | 'UPLOAD'
  | 'OCR'
  | 'CLASSIFICATION'
  | 'FIELD_EXTRACTION'
  | 'VALIDATION'
  | 'LINK_PARCEL';

export interface DocumentEntity {
  id: string;
  name: string; // e.g. "Award_1252.pdf"
  category: DocumentCategory;
  categoryLabel: string;
  projectId: string;
  projectName: string;
  parcelId: string;
  khasraNo: string;
  village: string;
  currentVersion: string; // e.g. "Version 3"
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  fileType: 'PDF' | 'IMAGE' | 'GEOJSON' | 'XLSX';
  status: DocumentStatus;
  aiStatus: DocumentAiStatus;
  extractedFields?: ExtractedDocumentFields;
  versionHistory: DocumentVersionItem[];
  auditTrail: DocumentAuditEntry[];
  isArchived: boolean;
  referenceNo: string;
  downloadUrl?: string;
}

export interface DocumentFilterState {
  searchQuery: string;
  category: DocumentCategory | 'ALL';
  status: DocumentStatus | 'ALL';
  aiStatus: DocumentAiStatus | 'ALL';
  showArchivedOnly: boolean;
}
