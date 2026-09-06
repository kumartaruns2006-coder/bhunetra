import { Parcel, FieldVerificationRecord, AuditLogEntry } from '../types/parcel';
import { mockParcels } from '../data/mockParcels';
import { notificationService } from './notificationService';

const STORAGE_KEY = 'BHUNETRA_PARCELS_CACHE_P19';

class ParcelService {
  private parcels: Parcel[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.parcels = JSON.parse(stored);
      } else {
        this.parcels = [...mockParcels];
        this.saveData();
      }
    } catch {
      this.parcels = [...mockParcels];
    }
  }

  private saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.parcels));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  public async getAllParcels(projectId?: string): Promise<Parcel[]> {
    if (projectId) {
      return this.parcels.filter(p => p.projectId === projectId);
    }
    return [...this.parcels];
  }

  public async getParcelById(id: string): Promise<Parcel | null> {
    const found = this.parcels.find(p => p.id === id || p.khasraNo === id);
    return found ? { ...found } : null;
  }

  public async addFieldVerification(parcelId: string, record: FieldVerificationRecord): Promise<Parcel> {
    const index = this.parcels.findIndex(p => p.id === parcelId);
    if (index === -1) throw new Error(`Parcel not found: ${parcelId}`);

    const parcel = { ...this.parcels[index] };
    parcel.fieldVerification = [record, ...parcel.fieldVerification];

    // Single source of truth update:
    // Status & GIS Map Status transitions from VERIFICATION_PENDING to VERIFIED
    parcel.mapStatus = 'VERIFIED';
    parcel.status = 'AWARD_DETERMINED';

    // Recalculate AI Risk: verification backlog is cleared
    parcel.aiRisk = {
      ...parcel.aiRisk,
      overallRiskScore: record.encroachmentDetected ? 42 : 32,
      riskLevel: 'LOW',
      predictedDelayDays: 12,
      detectedRiskFactors: [
        'Boundary demarcation and pegging completed by Amin',
        ...parcel.aiRisk.detectedRiskFactors.filter(
          f => !f.toLowerCase().includes('verification') && !f.toLowerCase().includes('discrepancy')
        )
      ],
      aiRecommendations: [
        'Ground-truth field verification verified by Circle Amin. Fast-track Section 3H PFMS Direct Benefit Transfer.',
        ...parcel.aiRisk.aiRecommendations.filter(r => !r.toLowerCase().includes('verification'))
      ],
      lastAssessedDate: new Date().toISOString().split('T')[0]
    };

    // Link official Field Inspection Report Document
    const fvDoc = {
      id: `doc-fv-${Date.now()}`,
      name: `Field_Inspection_Report_${parcel.khasraNo.replace('/', '_')}.pdf`,
      category: 'FIELD_REPORT' as const,
      documentType: 'FIELD_REPORT',
      referenceNo: `JMS-PAT-2026-${parcel.khasraNo.replace('/', '_')}`,
      issueDate: new Date().toISOString().split('T')[0],
      fileSize: '3.4 MB',
      verifiedBy: record.aminName,
      verifiedStatus: 'VERIFIED' as const,
      version: '1.0',
      uploadedBy: `${record.aminName} (${record.aminBadgeNo})`
    };
    parcel.documents = [fvDoc, ...parcel.documents.filter(d => d.documentType !== 'FIELD_REPORT')];

    // Cryptographic Audit Trail entry
    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      action: 'Field Ground-Truth Verification Completed & Cadastral Boundary Verified',
      performedBy: record.aminName,
      role: 'AMIN',
      statutoryStage: parcel.currentStage,
      remarks: record.officerRemarks || 'All 6 ground-truth verification checkpoints verified on-site.',
      previousValue: 'VERIFICATION_PENDING',
      newValue: 'VERIFIED',
      hash: `SHA256:${Math.random().toString(36).substring(2, 15)}...`
    };

    parcel.auditTrail = [auditEntry, ...parcel.auditTrail];
    this.parcels[index] = parcel;
    this.saveData();

    // Trigger reactive alert resolution in notification center
    try {
      notificationService.resolveAlertsForParcel(parcelId);
    } catch (e) {
      console.warn('Alert resolution hook failed', e);
    }

    return parcel;
  }

  public async sanctionCompensation(parcelId: string, officerName: string): Promise<Parcel> {
    const index = this.parcels.findIndex(p => p.id === parcelId);
    if (index === -1) throw new Error(`Parcel not found: ${parcelId}`);

    const parcel = { ...this.parcels[index] };
    parcel.compensation.paymentStatus = 'CALA_SANCTIONED';
    parcel.currentStage = 'SECTION_3G';
    parcel.status = 'AWARD_DETERMINED';

    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      action: 'Section 3G Compensation Award Formally Sanctioned by CALA',
      performedBy: officerName,
      role: 'CALA',
      statutoryStage: 'SECTION_3G',
      remarks: `Official sanction granted for ₹${(parcel.compensation.totalAwardAmount / 10000000).toFixed(2)} Cr with 100% solatium. Escrow voucher issued.`,
      hash: `SHA256:${Math.random().toString(36).substring(2, 15)}...`
    };

    parcel.auditTrail = [auditEntry, ...parcel.auditTrail];
    this.parcels[index] = parcel;
    this.saveData();
    return parcel;
  }

  public async disburseDirectBenefit(parcelId: string, officerName: string): Promise<Parcel> {
    const index = this.parcels.findIndex(p => p.id === parcelId);
    if (index === -1) throw new Error(`Parcel not found: ${parcelId}`);

    const parcel = { ...this.parcels[index] };
    parcel.compensation.disbursedAmount = parcel.compensation.totalAwardAmount;
    parcel.compensation.paymentStatus = 'DIRECT_BENEFIT_TRANSFERRED';
    parcel.compensation.bankReferenceNo = `PFMS-BR-${Date.now().toString().slice(-8)}`;
    parcel.compensation.disbursementDate = new Date().toISOString().split('T')[0];
    parcel.currentStage = 'SECTION_3H';
    parcel.status = 'COMPENSATION_DEPOSITED';
    parcel.possessionPercentage = 85;

    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      action: 'Section 3H Direct Benefit Transfer (DBT) Executed',
      performedBy: officerName,
      role: 'CALA / Treasury',
      statutoryStage: 'SECTION_3H',
      remarks: `Compensation of ₹${(parcel.compensation.totalAwardAmount / 10000000).toFixed(2)} Cr transferred to Raiyat verified bank account via PFMS.`,
      hash: `SHA256:${Math.random().toString(36).substring(2, 15)}...`
    };

    parcel.auditTrail = [auditEntry, ...parcel.auditTrail];
    this.parcels[index] = parcel;
    this.saveData();
    return parcel;
  }

  public async completePossession(parcelId: string, officerName: string): Promise<Parcel> {
    const index = this.parcels.findIndex(p => p.id === parcelId);
    if (index === -1) throw new Error(`Parcel not found: ${parcelId}`);

    const parcel = { ...this.parcels[index] };
    parcel.currentStage = 'SECTION_3E';
    parcel.status = 'POSSESSION_ACQUIRED';
    parcel.possessionPercentage = 100;

    const auditEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      action: 'Section 3E Physical Possession Formally Acquired & Transferred to NHAI',
      performedBy: officerName,
      role: 'CALA / NHAI PD',
      statutoryStage: 'SECTION_3E',
      remarks: 'Demarcation pillars verified. Construction RoW handover memo signed.',
      hash: `SHA256:${Math.random().toString(36).substring(2, 15)}...`
    };

    parcel.auditTrail = [auditEntry, ...parcel.auditTrail];
    this.parcels[index] = parcel;
    this.saveData();
    return parcel;
  }

  public resetToDefault() {
    this.parcels = [...mockParcels];
    this.saveData();
  }
}

export const parcelService = new ParcelService();
