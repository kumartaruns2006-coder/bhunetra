// Types for PART 8: FIELD VERIFICATION & MOBILE AMIN STATION

export type TaskStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RE_VERIFICATION';

export interface VerificationChecklist {
  gpsCaptured: boolean;
  boundaryVerified: boolean;
  landUseVerified: boolean;
  occupancyVerified: boolean;
  structureVerified: boolean;
  supportingEvidence: boolean;
}

export interface VerificationPhoto {
  id: string;
  label: string; // "Photo 1", "Photo 2", "Photo 3"
  url: string;
  caption: string;
  compassHeading: string; // e.g. "N 14° E"
  timestamp: string;
}

export interface VerificationTask {
  id: string;
  parcelId: string; // e.g. "K-125/2"
  khasraNo: string; // e.g. "125/2"
  village: string; // e.g. "Kanhauli"
  tehsil: string;
  district: string;
  state: string;
  projectName: string;
  projectId: string;
  areaHectares: number;
  areaSqM: number;
  primaryOwnerName: string;
  khataNo: string;
  status: TaskStatus;
  statusLabel: string; // e.g. "Verification Pending", "Re-verification", "Completed"
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  dueDate: string;
  assignedAmin: string;
  assignedAminBadge: string;
  gpsCoordinates: [number, number];
  gpsAccuracyMeters: number;
  gpsMatchWithinBoundary: boolean;
  boundaryDeviationMeters: number;
  checklist: VerificationChecklist;
  photos: VerificationPhoto[];
  remarks: string;
  completedAt?: string;
  encroachmentDetected: boolean;
  encroachmentDetails?: string;
  offlineStored?: boolean;
  syncPending?: boolean;
}

export interface InspectionFormData {
  parcelId: string;
  aminName: string;
  aminBadgeNo: string;
  inspectionDate: string;
  gpsLatitude: number;
  gpsLongitude: number;
  structuresFound: string[];
  standingCrops: string[];
  encroachmentDetected: boolean;
  encroachmentType?: 'TEMPORARY_SHED' | 'BOUNDARY_WALL' | 'COMMERCIAL_SHOP' | 'RELIGIOUS_STRUCTURE' | 'AGRICULTURAL_FARMING';
  encroachmentRemarks?: string;
  photos: {
    url: string;
    caption: string;
    compassHeading: string;
    timestamp: string;
  }[];
  officerRemarks: string;
  signatureConfirmed: boolean;
}

export interface OfflineSyncState {
  isOffline: boolean;
  pendingSyncCount: number;
  lastSyncTimestamp?: string;
  syncStatus: 'IDLE' | 'SYNCING' | 'COMPLETED' | 'ERROR';
}
