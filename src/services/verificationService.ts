import { 
  VerificationTask, 
  OfflineSyncState, 
  VerificationPhoto, 
  VerificationChecklist 
} from '../types/verification';
import { mockVerificationTasks } from '../data/mockVerificationTasks';
import { parcelService } from './parcelService';
import { FieldVerificationRecord } from '../types/parcel';

const TASKS_STORAGE_KEY = 'BHUNETRA_VERIFICATION_TASKS_CACHE';
const OFFLINE_STORAGE_KEY = 'BHUNETRA_OFFLINE_SYNC_CACHE';

class VerificationService {
  private tasks: VerificationTask[] = [];
  private offlineState: OfflineSyncState = {
    isOffline: false,
    pendingSyncCount: 0,
    syncStatus: 'IDLE'
  };
  private subscribers: ((tasks: VerificationTask[]) => void)[] = [];
  private offlineSubscribers: ((state: OfflineSyncState) => void)[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      } else {
        this.tasks = JSON.parse(JSON.stringify(mockVerificationTasks));
        this.saveData();
      }

      const storedOffline = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (storedOffline) {
        this.offlineState = JSON.parse(storedOffline);
      }
    } catch {
      this.tasks = JSON.parse(JSON.stringify(mockVerificationTasks));
    }
  }

  private saveData() {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (e) {
      console.warn('Failed to save verification tasks', e);
    }
    this.notifySubscribers();
  }

  private saveOfflineState() {
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(this.offlineState));
    } catch (e) {
      console.warn('Failed to save offline state', e);
    }
    this.notifyOfflineSubscribers();
  }

  public subscribe(callback: (tasks: VerificationTask[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  public subscribeOffline(callback: (state: OfflineSyncState) => void) {
    this.offlineSubscribers.push(callback);
    return () => {
      this.offlineSubscribers = this.offlineSubscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => cb([...this.tasks]));
  }

  private notifyOfflineSubscribers() {
    this.offlineSubscribers.forEach(cb => cb({ ...this.offlineState }));
  }

  public async getTasks(filterStatus?: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'): Promise<VerificationTask[]> {
    if (!filterStatus || filterStatus === 'ALL') {
      return [...this.tasks];
    }
    if (filterStatus === 'PENDING') {
      return this.tasks.filter(t => t.status === 'PENDING' || t.status === 'RE_VERIFICATION');
    }
    return this.tasks.filter(t => t.status === filterStatus);
  }

  public async getTaskByParcelId(parcelId: string): Promise<VerificationTask | null> {
    const found = this.tasks.find(t => t.parcelId === parcelId || t.khasraNo === parcelId);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  public getOfflineState(): OfflineSyncState {
    return { ...this.offlineState };
  }

  public toggleOfflineMode(forceState?: boolean): OfflineSyncState {
    this.offlineState.isOffline = forceState !== undefined ? forceState : !this.offlineState.isOffline;
    this.saveOfflineState();
    return { ...this.offlineState };
  }

  public async saveTaskDraft(task: VerificationTask): Promise<void> {
    const idx = this.tasks.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      this.tasks[idx] = { ...task };
      this.saveData();
    }
  }

  public async submitVerification(
    taskId: string, 
    payload: {
      checklist: VerificationChecklist;
      photos: VerificationPhoto[];
      remarks: string;
      boundaryDeviation: number;
      encroachmentDetected: boolean;
      encroachmentDetails?: string;
    }
  ): Promise<{ task: VerificationTask; offline: boolean }> {
    const idx = this.tasks.findIndex(t => t.id === taskId);
    if (idx === -1) throw new Error(`Verification Task ${taskId} not found`);

    const task = { ...this.tasks[idx] };
    const now = new Date();
    const completedTimestamp = now.toLocaleString('en-IN');
    const isOffline = this.offlineState.isOffline;

    task.checklist = { ...payload.checklist };
    task.photos = [...payload.photos];
    task.remarks = payload.remarks;
    task.boundaryDeviationMeters = payload.boundaryDeviation;
    task.encroachmentDetected = payload.encroachmentDetected;
    task.encroachmentDetails = payload.encroachmentDetails;
    task.status = 'COMPLETED';
    task.statusLabel = 'Completed';
    task.completedAt = completedTimestamp;

    if (isOffline) {
      // Offline mode: store locally with SYNC PENDING
      task.offlineStored = true;
      task.syncPending = true;
      this.offlineState.pendingSyncCount += 1;
      this.saveOfflineState();
    } else {
      // Online mode: direct sync & update live parcel state
      task.offlineStored = false;
      task.syncPending = false;
      await this.syncTaskToParcelService(task);
    }

    this.tasks[idx] = task;
    this.saveData();

    return { task, offline: isOffline };
  }

  private async syncTaskToParcelService(task: VerificationTask) {
    const record: FieldVerificationRecord = {
      id: `fv-${Date.now()}`,
      inspectionDate: new Date().toISOString().split('T')[0],
      aminName: task.assignedAmin,
      aminBadgeNo: task.assignedAminBadge,
      gpsLatitude: task.gpsCoordinates[0],
      gpsLongitude: task.gpsCoordinates[1],
      boundaryDeviationMeters: task.boundaryDeviationMeters,
      structuresFound: task.encroachmentDetected 
        ? ['Boundary structure discrepancy', 'Temporary shed margin'] 
        : ['Demarcation survey pegs verified'],
      standingCrops: ['Rabi crop verified on-site'],
      encroachmentDetected: task.encroachmentDetected,
      encroachmentDetails: task.encroachmentDetails,
      photos: task.photos.map(p => ({
        url: p.url,
        caption: p.caption,
        compassHeading: p.compassHeading,
        timestamp: p.timestamp
      })),
      officerRemarks: task.remarks,
      signatureVerified: true
    };

    try {
      await parcelService.addFieldVerification(task.parcelId, record);
    } catch (e) {
      console.warn('Sync to parcelService failed, will retry', e);
    }
  }

  public async syncOfflineQueue(): Promise<{ syncedCount: number }> {
    this.offlineState.syncStatus = 'SYNCING';
    this.saveOfflineState();

    // Artificial brief sync delay for realistic telemetry
    await new Promise(r => setTimeout(r, 800));

    let count = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].syncPending) {
        await this.syncTaskToParcelService(this.tasks[i]);
        this.tasks[i].syncPending = false;
        this.tasks[i].offlineStored = false;
        count++;
      }
    }

    this.offlineState.pendingSyncCount = 0;
    this.offlineState.lastSyncTimestamp = new Date().toLocaleTimeString('en-IN');
    this.offlineState.syncStatus = 'COMPLETED';
    this.saveOfflineState();
    this.saveData();

    setTimeout(() => {
      this.offlineState.syncStatus = 'IDLE';
      this.saveOfflineState();
    }, 3000);

    return { syncedCount: count };
  }

  public resetToDefault(): void {
    this.tasks = JSON.parse(JSON.stringify(mockVerificationTasks));
    this.offlineState = {
      isOffline: false,
      pendingSyncCount: 0,
      syncStatus: 'IDLE'
    };
    this.saveData();
    this.saveOfflineState();
  }
}

export const verificationService = new VerificationService();
