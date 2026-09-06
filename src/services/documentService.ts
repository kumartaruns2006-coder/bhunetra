import { 
  DocumentEntity, 
  DocumentFilterState, 
  DocumentVersionItem, 
  DocumentAuditEntry 
} from '../types/document';
import { mockDocuments } from '../data/mockDocuments';

const STORAGE_KEY = 'BHUNETRA_DOCUMENTS_CACHE';

class DocumentService {
  private documents: DocumentEntity[] = [];
  private subscribers: ((docs: DocumentEntity[]) => void)[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.documents = JSON.parse(stored);
      } else {
        this.documents = JSON.parse(JSON.stringify(mockDocuments));
        this.saveData();
      }
    } catch {
      this.documents = JSON.parse(JSON.stringify(mockDocuments));
    }
  }

  private saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.documents));
    } catch (e) {
      console.warn('Failed to save documents to localStorage', e);
    }
    this.notifySubscribers();
  }

  public subscribe(callback: (docs: DocumentEntity[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => cb([...this.documents]));
  }

  public async getDocuments(filter?: Partial<DocumentFilterState>): Promise<DocumentEntity[]> {
    let result = [...this.documents];

    if (!filter) return result;

    if (filter.showArchivedOnly !== undefined) {
      result = result.filter(d => Boolean(d.isArchived) === filter.showArchivedOnly);
    }

    if (filter.category && filter.category !== 'ALL') {
      result = result.filter(d => d.category === filter.category);
    }

    if (filter.status && filter.status !== 'ALL') {
      result = result.filter(d => d.status === filter.status);
    }

    if (filter.aiStatus && filter.aiStatus !== 'ALL') {
      result = result.filter(d => d.aiStatus === filter.aiStatus);
    }

    if (filter.searchQuery && filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.referenceNo.toLowerCase().includes(q) ||
        d.khasraNo.toLowerCase().includes(q) ||
        d.village.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q) ||
        d.categoryLabel.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async getDocumentById(id: string): Promise<DocumentEntity | null> {
    const found = this.documents.find(d => d.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  public async uploadDocument(docPayload: Partial<DocumentEntity>): Promise<DocumentEntity> {
    const today = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toLocaleString('en-IN');

    const newVersion: DocumentVersionItem = {
      versionNumber: 'Version 1',
      uploadedBy: docPayload.uploadedBy || 'Authenticated Officer',
      uploadedAt: today,
      fileSize: docPayload.fileSize || '3.2 MB',
      fileName: docPayload.name || 'Uploaded_Document.pdf',
      fileHash: `SHA-256: 0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      changeSummary: 'Initial document upload into central repository.'
    };

    const initialAudit: DocumentAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: timestampStr,
      action: 'UPLOADED_BY_OFFICER',
      actionLabel: 'Uploaded by Officer',
      actorName: docPayload.uploadedBy || 'Authenticated Officer',
      actorRole: 'FIELD_OFFICER',
      version: 'Version 1',
      notes: 'Initial document uploaded and passed to Document AI pipeline.',
      digitalSealHash: newVersion.fileHash.replace('SHA-256: ', '')
    };

    const newDoc: DocumentEntity = {
      id: `doc-${Date.now()}`,
      name: docPayload.name || 'Document.pdf',
      category: docPayload.category || 'OTHER',
      categoryLabel: docPayload.categoryLabel || 'Other',
      projectId: docPayload.projectId || 'PRR-PH2-2026',
      projectName: docPayload.projectName || 'Patna Ring Road Expansion',
      parcelId: docPayload.parcelId || 'K-125/2',
      khasraNo: docPayload.khasraNo || '125/2',
      village: docPayload.village || 'Kanhauli',
      currentVersion: 'Version 1',
      uploadedBy: docPayload.uploadedBy || 'Authenticated Officer',
      uploadedAt: today,
      fileSize: docPayload.fileSize || '3.2 MB',
      fileType: docPayload.fileType || 'PDF',
      status: docPayload.status || 'PENDING_REVIEW',
      aiStatus: docPayload.aiStatus || 'EXTRACTED',
      referenceNo: docPayload.referenceNo || `DOC-REF-${Math.floor(1000 + Math.random() * 9000)}`,
      isArchived: false,
      extractedFields: docPayload.extractedFields,
      versionHistory: [newVersion],
      auditTrail: [initialAudit]
    };

    this.documents.unshift(newDoc);
    this.saveData();
    return newDoc;
  }

  public async replaceVersion(
    docId: string, 
    newFileName: string, 
    changeSummary: string, 
    officerName: string, 
    officerRole: string
  ): Promise<DocumentEntity> {
    const index = this.documents.findIndex(d => d.id === docId);
    if (index === -1) throw new Error(`Document ${docId} not found`);

    const doc = { ...this.documents[index] };
    const currentVersionNum = doc.versionHistory.length + 1;
    const newVersionLabel = `Version ${currentVersionNum}`;
    const today = new Date().toISOString().split('T')[0];
    const timestampStr = new Date().toLocaleString('en-IN');
    const sealHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;

    const newVersionItem: DocumentVersionItem = {
      versionNumber: newVersionLabel,
      uploadedBy: `${officerName} (${officerRole})`,
      uploadedAt: today,
      fileSize: `${(2.5 + Math.random() * 2).toFixed(1)} MB`,
      fileName: newFileName,
      fileHash: `SHA-256: ${sealHash}`,
      changeSummary: changeSummary || `Revision ${newVersionLabel} uploaded with verified corrections.`
    };

    const newAuditEntry: DocumentAuditEntry = {
      id: `aud-rep-${Date.now()}`,
      timestamp: timestampStr,
      action: 'VERSION_UPDATED',
      actionLabel: 'Version updated',
      actorName: officerName,
      actorRole: officerRole,
      version: newVersionLabel,
      notes: changeSummary || `Replacement version ${newVersionLabel} registered.`,
      digitalSealHash: sealHash
    };

    doc.currentVersion = newVersionLabel;
    doc.name = newFileName;
    doc.versionHistory = [...doc.versionHistory, newVersionItem];
    doc.auditTrail = [...doc.auditTrail, newAuditEntry];

    this.documents[index] = doc;
    this.saveData();
    return doc;
  }

  public async archiveDocument(docId: string, officerName: string): Promise<DocumentEntity> {
    const index = this.documents.findIndex(d => d.id === docId);
    if (index === -1) throw new Error(`Document ${docId} not found`);

    const doc = { ...this.documents[index] };
    doc.isArchived = true;
    doc.status = 'ARCHIVED';

    const auditEntry: DocumentAuditEntry = {
      id: `aud-arc-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      action: 'ARCHIVED',
      actionLabel: 'Archived',
      actorName: officerName,
      actorRole: 'OFFICER',
      version: doc.currentVersion,
      notes: 'Document moved to archive repository.',
      digitalSealHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    };

    doc.auditTrail = [...doc.auditTrail, auditEntry];
    this.documents[index] = doc;
    this.saveData();
    return doc;
  }

  public async restoreDocument(docId: string, officerName: string): Promise<DocumentEntity> {
    const index = this.documents.findIndex(d => d.id === docId);
    if (index === -1) throw new Error(`Document ${docId} not found`);

    const doc = { ...this.documents[index] };
    doc.isArchived = false;
    doc.status = 'VERIFIED';

    const auditEntry: DocumentAuditEntry = {
      id: `aud-rst-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      action: 'APPROVED',
      actionLabel: 'Approved',
      actorName: officerName,
      actorRole: 'OFFICER',
      version: doc.currentVersion,
      notes: 'Document restored from archive to active status.',
      digitalSealHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    };

    doc.auditTrail = [...doc.auditTrail, auditEntry];
    this.documents[index] = doc;
    this.saveData();
    return doc;
  }

  public simulateDownload(doc: DocumentEntity): { success: boolean; filename: string } {
    return {
      success: true,
      filename: doc.name
    };
  }

  public resetToDefault(): void {
    this.documents = JSON.parse(JSON.stringify(mockDocuments));
    this.saveData();
  }
}

export const documentService = new DocumentService();
