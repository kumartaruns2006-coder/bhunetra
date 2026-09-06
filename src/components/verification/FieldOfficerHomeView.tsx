import React, { useState, useEffect, useMemo } from 'react';
import { 
  VerificationTask, 
  TaskStatus, 
  VerificationPhoto, 
  OfflineSyncState 
} from '../../types/verification';
import { verificationService } from '../../services/verificationService';
import { Parcel } from '../../types/parcel';
import { Officer } from '../../types/officer';
import { ParcelMiniMap } from '../twin/ParcelMiniMap';
import { useToast } from '../ui/Toast';
import { 
  ClipboardCheck, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Crosshair, 
  Check, 
  Upload, 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck, 
  Compass, 
  Building2, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Trash2,
  Plus
} from 'lucide-react';

interface FieldOfficerHomeViewProps {
  parcels: Parcel[];
  currentOfficer: Officer;
  onOpenDigitalTwin: (parcel: Parcel) => void;
  onNavigateToMap: (parcel: Parcel) => void;
  initialParcelId?: string;
  onVerificationCompleted?: () => void;
}

export const FieldOfficerHomeView: React.FC<FieldOfficerHomeViewProps> = ({
  parcels,
  currentOfficer,
  onOpenDigitalTwin,
  onNavigateToMap,
  initialParcelId,
  onVerificationCompleted
}) => {
  const { showToast } = useToast();

  // Tasks & Offline State
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [offlineState, setOfflineState] = useState<OfflineSyncState>(verificationService.getOfflineState());
  const [activeTab, setActiveTab] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Responsive device view mode toggle: Mobile Phone Viewport vs Tablet/Full Width
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Form State for Open Task
  const [checklist, setChecklist] = useState({
    gpsCaptured: true,
    boundaryVerified: true,
    landUseVerified: true,
    occupancyVerified: false,
    structureVerified: false,
    supportingEvidence: false
  });
  const [photos, setPhotos] = useState<VerificationPhoto[]>([]);
  const [remarks, setRemarks] = useState<string>('');
  const [boundaryDeviation, setBoundaryDeviation] = useState<number>(1.4);
  const [encroachmentDetected, setEncroachmentDetected] = useState<boolean>(true);
  const [encroachmentDetails, setEncroachmentDetails] = useState<string>('Northern hedge encroaches 1.4m into proposed RoW buffer.');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionSuccessModal, setSubmissionSuccessModal] = useState<boolean>(false);

  // Load tasks & subscribe
  useEffect(() => {
    loadTasks();
    const unsubTasks = verificationService.subscribe((updatedTasks) => {
      setTasks(updatedTasks);
    });
    const unsubOffline = verificationService.subscribeOffline((updatedOffline) => {
      setOfflineState(updatedOffline);
    });
    return () => {
      unsubTasks();
      unsubOffline();
    };
  }, []);

  const loadTasks = async () => {
    const list = await verificationService.getTasks();
    setTasks(list);

    if (initialParcelId) {
      const match = list.find(t => t.parcelId === initialParcelId || t.khasraNo === initialParcelId);
      if (match) {
        handleOpenTask(match);
      }
    }
  };

  // Selected Task
  const selectedTask = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // Selected Parcel corresponding to the selected task for MiniMap
  const selectedParcel = useMemo(() => {
    if (!selectedTask) return null;
    return parcels.find(p => p.id === selectedTask.parcelId || p.khasraNo === selectedTask.khasraNo) || parcels[0] || null;
  }, [selectedTask, parcels]);

  // Handle opening a task
  const handleOpenTask = (task: VerificationTask) => {
    setSelectedTaskId(task.id);
    setChecklist({ ...task.checklist });
    setPhotos([...task.photos]);
    setRemarks(task.remarks);
    setBoundaryDeviation(task.boundaryDeviationMeters);
    setEncroachmentDetected(task.encroachmentDetected);
    setEncroachmentDetails(task.encroachmentDetails || '');
  };

  // Toggle checklist item
  const handleToggleChecklist = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Checklist completion count
  const checklistCount = Object.values(checklist).filter(Boolean).length;
  const checklistPercentage = Math.round((checklistCount / 6) * 100);

  // Toggle Offline Mode
  const handleToggleOffline = () => {
    const next = verificationService.toggleOfflineMode();
    showToast({
      title: next.isOffline ? 'Offline Field Mode Enabled' : 'Online Mode Restored',
      message: next.isOffline 
        ? 'Inspections will be stored locally in SQLite/IndexedDB cache.'
        : 'Network re-established. Cloud synchronization available.',
      type: next.isOffline ? 'warning' : 'info'
    });
  };

  // Cloud Sync
  const handleSyncNow = async () => {
    if (offlineState.isOffline) {
      showToast({
        title: 'Cannot Sync Offline',
        message: 'Switch to Online mode before synchronizing local queue.',
        type: 'warning'
      });
      return;
    }

    const res = await verificationService.syncOfflineQueue();
    showToast({
      title: 'Cloud Synchronization Complete',
      message: `Synchronized ${res.syncedCount} inspection record(s) to National Land Database.`,
      type: 'success'
    });
    await loadTasks();
    onVerificationCompleted?.();
  };

  // Add Simulated Photo
  const handleAddPhoto = () => {
    const dummyImages = [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', caption: 'Pegging point & ground boundary check', heading: 'N 14° E' },
      { url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80', caption: 'Standing Rabi mustard & wheat crop inspection', heading: 'E 88°' },
      { url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80', caption: 'Temporary tube-well pump room and brick wall inspection', heading: 'S 172° W' },
      { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', caption: 'Demarcation tri-junction survey pillar verify', heading: 'NW 315°' }
    ];

    const nextIndex = photos.length % dummyImages.length;
    const item = dummyImages[nextIndex];

    const newPhoto: VerificationPhoto = {
      id: `photo-${Date.now()}`,
      label: `Photo ${photos.length + 1}`,
      url: item.url,
      caption: item.caption,
      compassHeading: item.heading,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPhotos([...photos, newPhoto]);
    showToast({
      title: 'Photo Captured',
      message: `${newPhoto.label} geotagged with compass heading [${newPhoto.compassHeading}]`,
      type: 'info'
    });
  };

  // Delete Photo
  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Submit Verification
  const handleSubmitVerification = async () => {
    if (!selectedTask) return;
    setSubmitting(true);

    try {
      const { task, offline } = await verificationService.submitVerification(selectedTask.id, {
        checklist,
        photos,
        remarks: remarks || 'DGPS survey inspection completed on ground. Boundary pegs verified.',
        boundaryDeviation,
        encroachmentDetected,
        encroachmentDetails: encroachmentDetected ? encroachmentDetails : undefined
      });

      setSubmissionSuccessModal(true);

      if (offline) {
        showToast({
          title: 'Stored Locally & Sync Pending',
          message: `Inspection for Khasra ${task.khasraNo} saved offline. Will sync when back online.`,
          type: 'warning'
        });
      } else {
        showToast({
          title: 'Verification Completed & Synchronized',
          message: `Khasra ${task.khasraNo} status updated to VERIFIED. Audit hash generated.`,
          type: 'success'
        });
      }

      await loadTasks();
      onVerificationCompleted?.();
    } catch (err: any) {
      showToast({
        title: 'Submission Error',
        message: err.message || 'Failed to submit verification',
        type: 'warning'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter tasks by active tab
  const filteredTasks = useMemo(() => {
    if (activeTab === 'PENDING') {
      return tasks.filter(t => t.status === 'PENDING' || t.status === 'RE_VERIFICATION');
    }
    return tasks.filter(t => t.status === activeTab);
  }, [tasks, activeTab]);

  return (
    <div className="p-2 sm:p-6 max-w-7xl mx-auto font-sans flex flex-col items-center">
      {/* Top Controls: Frame Toggle (Mobile Phone vs Full Screen) */}
      <div className="w-full mb-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 hidden sm:inline">Mobile-First Surveyor Experience:</span>
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-800 flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Smartphone className="w-4 h-4 text-gov-navy" />
            <span>{isPhoneFrame ? 'Expand to Full Width' : 'Simulate Mobile Phone Frame'}</span>
          </button>
        </div>

        {/* Global Network / Offline Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleOffline}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border ${
              offlineState.isOffline
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            {offlineState.isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{offlineState.isOffline ? 'OFFLINE MODE' : 'ONLINE MODE'}</span>
          </button>

          {offlineState.pendingSyncCount > 0 && (
            <button
              onClick={handleSyncNow}
              disabled={offlineState.isOffline || offlineState.syncStatus === 'SYNCING'}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${offlineState.syncStatus === 'SYNCING' ? 'animate-spin' : ''}`} />
              <span>
                {offlineState.syncStatus === 'SYNCING' 
                  ? 'Syncing...' 
                  : `Sync (${offlineState.pendingSyncCount} Pending)`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container: conditionally wrapped in phone frame */}
      <div 
        className={`w-full transition-all duration-200 ${
          isPhoneFrame 
            ? 'max-w-md border-8 border-slate-900 rounded-[42px] shadow-2xl bg-white overflow-hidden p-0 ring-1 ring-slate-800/10' 
            : 'max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'
        }`}
      >
        {/* ============================================================ */}
        {/* FIELD OFFICER HEADER */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy text-white p-4 sm:p-5 border-b border-white/10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                AMIN & SURVEYOR CADASTRAL GROUND-TRUTH
              </span>
            </div>

            {/* Offline Sync State Pill */}
            <div>
              {offlineState.isOffline ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  <span>OFFLINE &bull; Stored Locally</span>
                </span>
              ) : offlineState.pendingSyncCount > 0 ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-500 text-white animate-pulse">
                  SYNC PENDING ({offlineState.pendingSyncCount})
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-white flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>SYNC COMPLETE</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {currentOfficer.name || 'Rajesh Kumar (Senior Amin)'}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 font-mono">
                <span>Badge: <strong>#REV-AMIN-8492</strong></span>
                <span>&bull;</span>
                <span>Jurisdiction: <strong>Bihta / Patna</strong></span>
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">GPS Rover Fix</div>
              <div className="font-mono text-xs font-bold text-emerald-300 flex items-center gap-1 justify-end">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>RTK ± 12mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CONDITIONAL CONTENT: MY TASKS (VIEW 1) vs OPEN TASK (VIEW 2) */}
        {/* ============================================================ */}
        {!selectedTask ? (
          /* ---------------------------------------------------------- */
          /* VIEW 1: FIELD OFFICER HOME — MY TASKS                      */
          /* ---------------------------------------------------------- */
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  My Tasks
                </h3>
                <p className="text-xs text-slate-500">
                  Assigned cadastral plots for on-site boundary DGPS verification
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-gov-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                {tasks.length} Assigned Plots
              </span>
            </div>

            {/* Task Tabs: Pending, In Progress, Completed */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveTab('PENDING')}
                className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'PENDING'
                    ? 'bg-gov-navy text-white shadow-xs font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>Pending</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeTab === 'PENDING' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200'}`}>
                  {tasks.filter(t => t.status === 'PENDING' || t.status === 'RE_VERIFICATION').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('IN_PROGRESS')}
                className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'IN_PROGRESS'
                    ? 'bg-gov-navy text-white shadow-xs font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>In Progress</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeTab === 'IN_PROGRESS' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200'}`}>
                  {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('COMPLETED')}
                className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === 'COMPLETED'
                    ? 'bg-gov-navy text-white shadow-xs font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>Completed</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeTab === 'COMPLETED' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200'}`}>
                  {tasks.filter(t => t.status === 'COMPLETED').length}
                </span>
              </button>
            </div>

            {/* Task Cards List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'COMPLETED';
                const isReVerification = task.status === 'RE_VERIFICATION';

                return (
                  <div
                    key={task.id}
                    onClick={() => handleOpenTask(task)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer shadow-xs space-y-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-900 group-hover:text-gov-navy transition-colors">
                            Parcel {task.parcelId}
                          </h4>
                          <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Khasra {task.khasraNo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {task.projectName} &bull; Mauza <strong>{task.village}</strong>
                        </p>
                      </div>

                      {/* Status Tag: Verification Pending, Re-verification, Completed */}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        isReVerification ? 'bg-red-100 text-red-800 border border-red-300' :
                        'bg-orange-100 text-orange-900 border border-orange-300'
                      }`}>
                        {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isReVerification && <AlertTriangle className="w-3 h-3 text-red-600" />}
                        {!isCompleted && !isReVerification && <Clock className="w-3 h-3 text-orange-600 animate-pulse" />}
                        <span>{task.statusLabel}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      <span>Area: <strong className="text-slate-800">{task.areaHectares} Ha ({task.areaSqM} m²)</strong></span>
                      <span>Raiyat: <strong className="text-slate-800 font-sans">{task.primaryOwnerName}</strong></span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        GPS: {task.gpsCoordinates[0].toFixed(4)}°N, {task.gpsCoordinates[1].toFixed(4)}°E
                      </span>
                      <button className="text-xs font-bold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                        <span>{isCompleted ? 'View Report' : 'Open Task'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------------- */
          /* VIEW 2: OPEN TASK SCREEN (e.g. Parcel K-125/2)             */
          /* ---------------------------------------------------------- */
          <div className="p-4 sm:p-6 space-y-5 text-xs">
            {/* Top Navigation Bar inside Task */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <button
                onClick={() => setSelectedTaskId(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to My Tasks</span>
              </button>

              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                selectedTask.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                selectedTask.status === 'RE_VERIFICATION' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-900'
              }`}>
                {selectedTask.statusLabel}
              </span>
            </div>

            {/* Task Header: Parcel K-125/2 & Project Patna Ring Road Expansion */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    TARGET PARCEL GROUND TRUTH
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    Parcel {selectedTask.parcelId}
                  </h3>
                </div>
                <span className="text-base font-black text-amber-700 font-mono bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                  Khasra {selectedTask.khasraNo}
                </span>
              </div>

              <div className="text-slate-700 font-medium pt-1">
                Project: <strong className="text-slate-900">{selectedTask.projectName}</strong>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-600 border-t border-slate-200">
                <div>Area: <strong className="text-slate-900 font-bold">{selectedTask.areaHectares} Ha ({selectedTask.areaSqM} m²)</strong></div>
                <div>Raiyat: <strong className="text-slate-900 font-sans">{selectedTask.primaryOwnerName}</strong></div>
              </div>
            </div>

            {/* GPS Location & Boundary Match Box */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Crosshair className="w-4 h-4 text-blue-700" />
                  Live Synthetic GPS Location
                </span>
                <span className="font-mono text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  Accuracy: ± 12mm
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2 bg-white rounded-lg border border-blue-100">
                  <span className="text-[10px] text-slate-400 block">Latitude</span>
                  <strong className="text-slate-900">{selectedTask.gpsCoordinates[0].toFixed(5)}° N</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-100">
                  <span className="text-[10px] text-slate-400 block">Longitude</span>
                  <strong className="text-slate-900">{selectedTask.gpsCoordinates[1].toFixed(5)}° E</strong>
                </div>
              </div>

              {/* GPS Match Status (User Requirement: GPS Match: ✓ Within expected parcel boundary) */}
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>GPS Match: ✓ Within expected parcel boundary</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700">
                  Dev: {boundaryDeviation}m
                </span>
              </div>
            </div>

            {/* Parcel Boundary Mini-Map */}
            {selectedParcel && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="uppercase tracking-wider">Parcel Boundary & Demarcation Footprint</span>
                  <span className="text-[11px] text-blue-600 hover:underline cursor-pointer" onClick={() => onNavigateToMap(selectedParcel)}>
                    Full GIS Map &rarr;
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <ParcelMiniMap parcel={selectedParcel} onNavigateToMap={onNavigateToMap} />
                </div>
              </div>
            )}

            {/* 6-Point Verification Checklist */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-amber-600" />
                  <span>Cadastral Verification Checklist ({checklistCount}/6)</span>
                </div>
                <span className="font-mono text-xs font-bold text-gov-navy">
                  {checklistPercentage}% Complete
                </span>
              </div>

              {/* Checklist Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${checklistPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {[
                  { key: 'gpsCaptured', label: '1. GPS Captured (RTK Rover Fixed)' },
                  { key: 'boundaryVerified', label: '2. Boundary Verified (Seemana Pegs)' },
                  { key: 'landUseVerified', label: '3. Land Use Verified (Standing Crop)' },
                  { key: 'occupancyVerified', label: '4. Occupancy Verified (Raiyat On-Site)' },
                  { key: 'structureVerified', label: '5. Structure Verified (Assets & Walls)' },
                  { key: 'supportingEvidence', label: '6. Supporting Evidence (Panchnama Signed)' }
                ].map((item) => {
                  const isChecked = (checklist as any)[item.key];

                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleChecklist(item.key as any)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs">{item.label}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photo Capture Section (Photo 1, Photo 2, Photo 3) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-gov-navy" />
                  <span>Geotagged Photographic Ground Evidence ({photos.length})</span>
                </div>
                <button
                  onClick={handleAddPhoto}
                  className="px-3 py-1 bg-gov-navy hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Capture Photo</span>
                </button>
              </div>

              {photos.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No photos captured yet. Click "Capture Photo" to simulate taking an on-site picture.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="bg-slate-900 rounded-xl overflow-hidden text-white border border-slate-800 shadow-sm relative group">
                      <div className="h-32 overflow-hidden relative">
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono">
                          {photo.label}
                        </div>
                        <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-amber-300">
                          {photo.compassHeading}
                        </div>
                      </div>
                      <div className="p-2 text-xs">
                        <p className="font-semibold text-slate-200 truncate">{photo.caption}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{photo.timestamp}</span>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Remarks Text Field & Quick Chips */}
            <div className="space-y-2">
              <label className="block font-black text-xs text-slate-900 uppercase tracking-wider">
                Officer Field Remarks & Ground Findings:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter field observations, demarcation findings, crop stages, and Raiyat statements..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />

              {/* Quick Observation Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'DGPS pegs fixed along 60m RoW',
                  'Northern hedge encroaches 1.4m into RoW',
                  'Raiyat present on-site during measurement',
                  'Boundary stone verified with Zero Discrepancy'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRemarks(prev => prev ? `${prev} ${chip}.` : `${chip}.`)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-semibold transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Encroachment Alert Toggle */}
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Boundary Encroachment Detected?
                </span>
                <input
                  type="checkbox"
                  checked={encroachmentDetected}
                  onChange={(e) => setEncroachmentDetected(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-400 cursor-pointer"
                />
              </div>

              {encroachmentDetected && (
                <div className="pt-2 border-t border-amber-200/60 space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-600">Deviation Distance:</span>
                    <strong className="text-red-700">{boundaryDeviation} meters</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={boundaryDeviation}
                    onChange={(e) => setBoundaryDeviation(parseFloat(e.target.value))}
                    className="w-full cursor-pointer accent-red-600"
                  />
                  <input
                    type="text"
                    value={encroachmentDetails}
                    onChange={(e) => setEncroachmentDetails(e.target.value)}
                    placeholder="Specific structure, hedge, or crop detail..."
                    className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs"
                  />
                </div>
              )}
            </div>

            {/* Offline Submission Banner */}
            {offlineState.isOffline && (
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-400" />
                  <span>Submission will be <strong>Stored Locally</strong> (Sync Pending).</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">IndexedDB Encrypted</span>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmitVerification}
                disabled={submitting}
                className={`w-full py-3 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 ${
                  offlineState.isOffline
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing DGPS Verification Certificate...</span>
                  </>
                ) : offlineState.isOffline ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Complete & Store Locally (Sync Pending)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Synchronize to National Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SUBMISSION SUCCESS CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {submissionSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Verification Completed
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Cadastral ground-truth inspection report filed for <strong>Parcel {selectedTask?.parcelId}</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Parcel Status:</span>
                <strong className="text-emerald-700">VERIFIED</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GIS Status:</span>
                <strong className="text-blue-700">UPDATED (BLUE)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sync Lifecycle:</span>
                <strong className={offlineState.isOffline ? 'text-amber-700' : 'text-emerald-700'}>
                  {offlineState.isOffline ? 'STORED LOCALLY (SYNC PENDING)' : 'SYNC COMPLETE (CLOUD CERTIFIED)'}
                </strong>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmissionSuccessModal(false);
                setSelectedTaskId(null);
              }}
              className="w-full py-2.5 bg-gov-navy hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider"
            >
              Return to My Tasks
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
