import { 
  MasterDataItem, 
  MasterDataCategory, 
  ValidationResultItem, 
  ValidationSummary, 
  ValidationRuleId,
  ApiIntegrationCard, 
  ApiIntegrationId, 
  DataSyncSummary, 
  DataConflictRecord,
  RestApiResponse,
  ILandRecordsApi,
  ICadastralMapApi,
  IFinancialSystemApi,
  IGisApi,
  IProjectSystemApi,
  INotificationApi
} from '../types/dataIntegration';
import { 
  mockMasterData, 
  mockApiIntegrations, 
  mockSyncSummary, 
  mockDataConflicts 
} from '../data/mockMasterData';
import { Parcel } from '../types/parcel';
import { ProjectCorridor } from '../types/project';

class DataIntegrationService {
  private masterData: MasterDataItem[] = [...mockMasterData];
  private apiIntegrations: ApiIntegrationCard[] = [...mockApiIntegrations];
  private syncSummary: DataSyncSummary = { ...mockSyncSummary };
  private conflicts: DataConflictRecord[] = [...mockDataConflicts];
  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  // ==========================================
  // SECTION 1: MASTER DATA
  // ==========================================
  public getMasterData(category?: MasterDataCategory): MasterDataItem[] {
    if (!category) return [...this.masterData];
    return this.masterData.filter(m => m.category === category);
  }

  public addMasterDataItem(item: Omit<MasterDataItem, 'id'>): MasterDataItem {
    const newItem: MasterDataItem = {
      ...item,
      id: `md-custom-${Date.now()}`
    };
    this.masterData.push(newItem);
    this.notify();
    return newItem;
  }

  // ==========================================
  // SECTION 2: DATA VALIDATION ENGINE
  // ==========================================
  public validateCadastralDataset(parcels: Parcel[], projects: ProjectCorridor[]): {
    summary: ValidationSummary;
    results: ValidationResultItem[];
  } {
    const results: ValidationResultItem[] = [];
    const parcelIdSet = new Set<string>();
    const projectIdSet = new Set<string>();

    // 1. Rule: DUPLICATE_PROJECT_ID
    projects.forEach(p => {
      if (projectIdSet.has(p.id)) {
        results.push({
          id: `val-dup-prj-${p.id}`,
          ruleId: 'DUPLICATE_PROJECT_ID',
          ruleName: 'Duplicate Project Identifier',
          severity: 'ERROR',
          entityType: 'PROJECT',
          entityId: p.id,
          entityLabel: p.name,
          field: 'id',
          message: `Project code '${p.id}' is registered more than once in the central corridor registry.`,
          suggestedFix: 'Re-assign unique NHAI/MoRTH corridor sanction code.'
        });
      } else {
        projectIdSet.add(p.id);
      }
    });

    // 2. Validate Each Parcel across the 8 statutory rules
    parcels.forEach((parcel) => {
      // Rule: DUPLICATE_PARCEL_ID
      if (parcelIdSet.has(parcel.id)) {
        results.push({
          id: `val-dup-pcl-${parcel.id}`,
          ruleId: 'DUPLICATE_PARCEL_ID',
          ruleName: 'Duplicate Parcel Identifier',
          severity: 'ERROR',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Khasra ${parcel.khasraNo}`,
          field: 'id',
          message: `Parcel ID '${parcel.id}' already exists in cadastral database.`,
          suggestedFix: 'Append unique sub-division suffix (e.g. /1, /2) matching RoR partition parwancha.'
        });
      } else {
        parcelIdSet.add(parcel.id);
      }

      // Rule: REQUIRED_FIELDS
      if (!parcel.khasraNo || !parcel.village || !parcel.district || !parcel.state) {
        results.push({
          id: `val-req-${parcel.id}`,
          ruleId: 'REQUIRED_FIELDS',
          ruleName: 'Mandatory Cadastral Fields',
          severity: 'ERROR',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Plot ${parcel.id}`,
          field: 'khasraNo | village | district | state',
          message: 'Plot record missing statutory administrative jurisdiction metadata.',
          suggestedFix: 'Populate mandatory revenue circle, village, and LGD codes from State Master.'
        });
      }

      // Rule: INVALID_AREA
      if (parcel.totalParcelAreaHectares <= 0 || parcel.acquisitionAreaHectares <= 0) {
        results.push({
          id: `val-area-zero-${parcel.id}`,
          ruleId: 'INVALID_AREA',
          ruleName: 'Invalid Area Specification',
          severity: 'ERROR',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Khasra ${parcel.khasraNo}`,
          field: 'totalParcelAreaHectares',
          message: `Calculated area cannot be zero or negative (${parcel.totalParcelAreaHectares} Ha).`,
          suggestedFix: 'Compute area from DGPS polygon geometry.'
        });
      } else if (parcel.acquisitionAreaHectares > parcel.totalParcelAreaHectares) {
        results.push({
          id: `val-area-overflow-${parcel.id}`,
          ruleId: 'INVALID_AREA',
          ruleName: 'Acquisition Exceeds Total Plot',
          severity: 'WARNING',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Khasra ${parcel.khasraNo}`,
          field: 'acquisitionAreaHectares',
          message: `Acquisition area (${parcel.acquisitionAreaHectares} Ha) is greater than total RoR plot area (${parcel.totalParcelAreaHectares} Ha).`,
          suggestedFix: 'Review 60m highway centerline intersection and clip to cadastral parcel boundary.'
        });
      }

      // Rule: MISSING_PROJECT_LINKAGE
      const linkedProject = projects.find(p => p.id === parcel.projectId);
      if (!linkedProject) {
        results.push({
          id: `val-prj-link-${parcel.id}`,
          ruleId: 'MISSING_PROJECT_LINKAGE',
          ruleName: 'Missing Project Linkage',
          severity: 'ERROR',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Khasra ${parcel.khasraNo}`,
          field: 'projectId',
          message: `Parcel references project '${parcel.projectId}', which is not found in registered corridor list.`,
          suggestedFix: 'Link to active corridor alignment.'
        });
      }

      // Rule: MISSING_COORDINATES
      if (!parcel.coordinates || parcel.coordinates[0] === 0 || !parcel.polygonCoordinates || parcel.polygonCoordinates.length < 3) {
        results.push({
          id: `val-geo-missing-${parcel.id}`,
          ruleId: 'MISSING_COORDINATES',
          ruleName: 'Missing Spatial Boundary Coordinates',
          severity: 'ERROR',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Khasra ${parcel.khasraNo}`,
          field: 'polygonCoordinates',
          message: 'Parcel is missing closed polygon boundary coordinates.',
          suggestedFix: 'Upload GeoJSON boundary polygon from BhuNaksha WFS spatial service.'
        });
      }

      // Rule: INVALID_STATUS
      const validStatuses = ['NOTIFICATION_PENDING', 'UNDER_INQUIRY', 'VALUATION_IN_PROGRESS', 'AWARD_DETERMINED', 'COMPENSATION_DEPOSITED', 'POSSESSION_ACQUIRED', 'LITIGATION_HALTED'];
      if (!validStatuses.includes(parcel.status)) {
        results.push({
          id: `val-stat-${parcel.id}`,
          ruleId: 'INVALID_STATUS',
          ruleName: 'Unrecognized Statutory Stage Status',
          severity: 'WARNING',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Khasra ${parcel.khasraNo}`,
          field: 'status',
          message: `Status '${parcel.status}' does not conform to standardized RFCTLARR workflow stages.`,
          suggestedFix: 'Standardize to standard NH Act / RFCTLARR acquisition stage.'
        });
      }

      // Rule: INVALID_DOCUMENT_LINKAGE
      if (!parcel.documents || parcel.documents.length === 0) {
        results.push({
          id: `val-doc-${parcel.id}`,
          ruleId: 'INVALID_DOCUMENT_LINKAGE',
          ruleName: 'Missing Statutory Document Dossier',
          severity: 'WARNING',
          entityType: 'PARCEL',
          entityId: parcel.id,
          entityLabel: `Khasra ${parcel.khasraNo}`,
          field: 'documents',
          message: 'No official Gazette 3A notification or RoR extract uploaded for plot.',
          suggestedFix: 'Attach digital Jamabandi and Gazette extract in Document Management repository.'
        });
      }
    });

    const errorCount = results.filter(r => r.severity === 'ERROR').length;
    const warningCount = results.filter(r => r.severity === 'WARNING').length;
    const totalChecked = parcels.length;
    const validCount = Math.max(0, totalChecked - errorCount);
    const compliancePercentage = totalChecked > 0 ? Math.round((validCount / totalChecked) * 100) : 100;

    return {
      summary: {
        totalChecked,
        validCount,
        warningCount,
        errorCount,
        compliancePercentage
      },
      results
    };
  }

  // ==========================================
  // SECTION 3: API INTEGRATION CENTER
  // ==========================================
  public getApiIntegrations(): ApiIntegrationCard[] {
    return [...this.apiIntegrations];
  }

  public async testApiEndpoint(id: ApiIntegrationId): Promise<{
    latencyMs: number;
    status: string;
    protocol: string;
    samplePayload: any;
  }> {
    const card = this.apiIntegrations.find(a => a.id === id);
    if (!card) throw new Error(`API ${id} not found`);

    // Simulated network ping
    await new Promise(r => setTimeout(r, 600));

    card.lastSync = 'Just now';
    this.notify();

    return {
      latencyMs: Math.floor(Math.random() * 80) + 45,
      status: 'HTTP/2 200 OK (MOCK CONNECTED)',
      protocol: card.protocol,
      samplePayload: {
        apiId: id,
        endpoint: card.endpoint,
        authentication: card.authMethod,
        mockResponseTimestamp: new Date().toISOString(),
        disclaimer: 'MOCK CONNECTED PROTOTYPE — Clean interface contract ready for authorized NIC gateway.'
      }
    };
  }

  // ==========================================
  // SECTION 4: DATA SYNCHRONIZATION
  // ==========================================
  public getSyncSummary(): DataSyncSummary {
    return { ...this.syncSummary };
  }

  public async triggerFullSync(): Promise<DataSyncSummary> {
    this.syncSummary.syncState = 'IN_PROGRESS';
    this.notify();

    await new Promise(r => setTimeout(r, 1200));

    this.syncSummary = {
      lastSyncTimestamp: 'Just now',
      recordsReceived: this.syncSummary.recordsReceived + Math.floor(Math.random() * 40) + 10,
      recordsUpdated: this.syncSummary.recordsUpdated + Math.floor(Math.random() * 20) + 5,
      conflictsCount: this.conflicts.filter(c => c.status === 'DETECTED').length,
      syncState: 'COMPLETED'
    };

    // Update lastSync on all cards
    this.apiIntegrations = this.apiIntegrations.map(a => ({
      ...a,
      lastSync: 'Just now',
      recordsSynced: a.recordsSynced + Math.floor(Math.random() * 15)
    }));

    this.notify();
    return { ...this.syncSummary };
  }

  // ==========================================
  // SECTION 5: DATA CONFLICT RESOLUTION
  // ==========================================
  public getDataConflicts(): DataConflictRecord[] {
    return [...this.conflicts];
  }

  public reviewConflict(id: string): DataConflictRecord {
    const index = this.conflicts.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Conflict ${id} not found`);

    const conflict = { ...this.conflicts[index], status: 'UNDER_REVIEW' as const };
    this.conflicts[index] = conflict;
    this.notify();
    return conflict;
  }

  public resolveConflict(
    id: string, 
    resolvedValue: string | number, 
    source: 'GIS' | 'LAND_RECORD' | 'DOCUMENT' | 'MANUAL_CONCILIATION',
    notes: string,
    officerName: string = 'Competent Authority (CALA)'
  ): DataConflictRecord {
    const index = this.conflicts.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Conflict ${id} not found`);

    const conflict = {
      ...this.conflicts[index],
      status: 'RESOLVED' as const,
      resolvedValue,
      resolvedSource: source,
      resolvedBy: officerName,
      resolvedAt: new Date().toLocaleString('en-IN'),
      resolutionRemarks: notes
    };

    this.conflicts[index] = conflict;
    this.syncSummary.conflictsCount = Math.max(0, this.conflicts.filter(c => c.status === 'DETECTED').length);
    this.notify();
    return conflict;
  }

  public ignoreConflict(id: string, reason: string, officerName: string = 'Authorized Officer'): DataConflictRecord {
    const index = this.conflicts.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Conflict ${id} not found`);

    const conflict = {
      ...this.conflicts[index],
      status: 'IGNORED' as const,
      resolvedBy: officerName,
      resolvedAt: new Date().toLocaleString('en-IN'),
      resolutionRemarks: `Ignored: ${reason}`
    };

    this.conflicts[index] = conflict;
    this.syncSummary.conflictsCount = Math.max(0, this.conflicts.filter(c => c.status === 'DETECTED').length);
    this.notify();
    return conflict;
  }

  // ==========================================
  // SECTION 6: RESTful API MOCK CLIENTS
  // ==========================================
  public landRecordsApi: ILandRecordsApi = {
    async getRoRDetails(khasraNo, villageCode) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: {
          khasraNo,
          villageCode,
          khatiyanNo: '78',
          jamabandiRegister2: 'Jamabandi No. 114/A',
          owners: ['Ramdhari Singh (50%)', 'Shyamdhari Singh (50%)'],
          totalAreaBigha: '3 Bigha 14 Katha (2.40 Acres)',
          landClassification: 'Dofasli Irrigated Agriculture'
        }
      };
    },
    async verifyMutationStatus(mutationCaseNo) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { mutationCaseNo, status: 'PARWANCHA_ISSUED', date: '2024-06-18' }
      };
    }
  };

  public cadastralMapApi: ICadastralMapApi = {
    async getParcelGeometry(khasraNo, villageCode) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: {
          type: 'Feature',
          properties: { khasraNo, villageCode },
          geometry: {
            type: 'Polygon',
            coordinates: [[[85.0355, 25.5692], [85.0361, 25.5694], [85.0359, 25.5698], [85.0353, 25.5696], [85.0355, 25.5692]]]
          }
        }
      };
    },
    async getCorridorWfsLayer(corridorId) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { corridorId, layer: 'wfs:morth_corridor_row_60m', srs: 'EPSG:4326' }
      };
    }
  };

  public financialSystemApi: IFinancialSystemApi = {
    async getEscrowBalance(projectId) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { projectId, bank: 'State Bank of India - Escrow Treasury', availableBalanceCr: 125.40, currency: 'INR' }
      };
    },
    async submitDbtPaymentOrder(orderPayload) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { utrNo: `PFMS-BR-${Date.now()}`, status: 'SETTLED', timestamp: new Date().toISOString() }
      };
    }
  };

  public gisApi: IGisApi = {
    async getSurveyOfIndiaSatelliteTiles(bbox) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { bbox, tileMatrix: 'EPSG:3857', format: 'image/png', resolutionM: 0.5 }
      };
    },
    async calculatePolygonIntersection(polygonA, polygonB) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { intersectedAreaSqM: 4800, acquisitionPercentage: 100 }
      };
    }
  };

  public projectSystemApi: IProjectSystemApi = {
    async getGatiShaktiAlignment(projectId) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { projectId, alignmentId: 'NMP-HW-PRR-2026', totalKm: 76.0, rightOfWayM: 60 }
      };
    },
    async pushCorridorStatusUpdate(statusPayload) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { acknowledged: true, receiptId: `NMP-ACK-${Date.now()}` }
      };
    }
  };

  public notificationApi: INotificationApi = {
    async sendDltSms(mobile, templateId, params) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { messageId: `DLT-SMS-${Date.now()}`, sender: 'VK-BHUNTR', status: 'DELIVERED_SIMULATED' }
      };
    },
    async sendGovMail(to, subject, bodyHtml) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
        data: { messageId: `NIC-MAIL-${Date.now()}`, status: 'QUEUED_SIMULATED' }
      };
    }
  };
}

export const dataIntegrationService = new DataIntegrationService();
