import React, { useState, useMemo, useEffect } from 'react';
import { Parcel, StatutoryStage, DocumentItem, AuditLogEntry, ParcelTimelineEvent } from '../../types/parcel';
import { Officer } from '../../types/officer';
import { mockParcels } from '../../data/mockParcels';
import { ParcelMiniMap } from './ParcelMiniMap';
import { 
  FileText, 
  MapPin, 
  IndianRupee, 
  Users, 
  ShieldAlert, 
  ClipboardCheck, 
  History, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  ExternalLink, 
  Camera, 
  Compass, 
  Building, 
  Check, 
  ChevronRight, 
  Gavel, 
  BadgeCheck,
  Printer,
  Sparkles,
  ArrowRight,
  Eye,
  Crosshair,
  Home,
  FileSpreadsheet,
  Layers,
  Scale
} from 'lucide-react';
import { RiskBadge, StageBadge, StatusBadge } from '../common/Badge';

interface ParcelDigitalTwinProps {
  parcel: Parcel;
  currentOfficer: Officer;
  isCitizenView?: boolean;
  onClose?: () => void;
  onLaunchVerification: (parcel: Parcel) => void;
  onSanctionCompensation: (parcelId: string) => Promise<void>;
  onDisburseCompensation: (parcelId: string) => Promise<void>;
  onCompletePossession: (parcelId: string) => Promise<void>;
  onNavigateToMap: (parcel: Parcel) => void;
  onSelectParcel?: (parcel: Parcel) => void;
}

export const ParcelDigitalTwin: React.FC<ParcelDigitalTwinProps> = ({
  parcel: initialParcel,
  currentOfficer,
  isCitizenView = false,
  onClose,
  onLaunchVerification,
  onSanctionCompensation,
  onDisburseCompensation,
  onCompletePossession,
  onNavigateToMap,
  onSelectParcel
}) => {
  // Current active parcel state (allows quick switching between K-125/2, 412/1, etc.)
  const [selectedParcelId, setSelectedParcelId] = useState<string>(initialParcel.id);

  useEffect(() => {
    if (initialParcel?.id) {
      setSelectedParcelId(initialParcel.id);
    }
  }, [initialParcel]);

  const parcel = useMemo(() => {
    if (initialParcel && initialParcel.id === selectedParcelId) {
      return initialParcel;
    }
    return mockParcels.find(p => p.id === selectedParcelId) || initialParcel;
  }, [selectedParcelId, initialParcel]);

  // Active section filter ('ALL' for continuous scrolling dossier or specific section)
  const [activeSection, setActiveSection] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);

  // Currency Formatter
  const formatINR = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // 9 Statutory Timeline Stages
  const timelineStages: {
    key: string;
    label: string;
    statutoryRef: string;
    stageIndex: number;
    description: string;
    authority: string;
  }[] = [
    { key: 'IDENTIFIED', label: '1. Identified', statutoryRef: 'Corridor Survey', stageIndex: 0, description: 'Alignment RoW centerline flagged in Cadastral GIS', authority: 'NHAI PIU Patna' },
    { key: 'VERIFIED', label: '2. Verified', statutoryRef: 'JMS Survey / DGPS', stageIndex: 1, description: 'Cadastral boundary ground truth pegged by Amin', authority: 'Revenue Amin' },
    { key: 'NOTIFICATION', label: '3. Notification', statutoryRef: 'NH Act Sec 3A', stageIndex: 2, description: 'Gazette of India extraordinary publication of intent', authority: 'MoRTH / GOI' },
    { key: 'OBJECTION', label: '4. Objection', statutoryRef: 'NH Act Sec 3C', stageIndex: 3, description: 'CALA hearing of landowner objections & title claims', authority: 'CALA / Addl. Collector' },
    { key: 'DECLARATION', label: '5. Declaration', statutoryRef: 'NH Act Sec 3D', stageIndex: 4, description: 'Vesting of land free from all encumbrances in Union', authority: 'Central Government' },
    { key: 'AWARD', label: '6. Award', statutoryRef: 'NH Act Sec 3G', stageIndex: 5, description: 'Circle rate + 100% Solatium + Assets valuation', authority: 'CALA Patna' },
    { key: 'COMPENSATION', label: '7. Compensation', statutoryRef: 'NH Act Sec 3H', stageIndex: 6, description: 'Escrow funding & PFMS Direct Benefit Transfer', authority: 'CALA & SBI Escrow' },
    { key: 'RR', label: '8. R&R', statutoryRef: 'RFCTLARR Act Sch II', stageIndex: 7, description: 'Resettlement allowance, subsistence & homestead', authority: 'R&R Commissioner' },
    { key: 'POSSESSION', label: '9. Possession', statutoryRef: 'NH Act Sec 3E', stageIndex: 8, description: 'Demarcation pillars handover & RoW construction clearance', authority: 'NHAI / Revenue Police' }
  ];

  // Map statutory stage to index
  const getStageStep = (stage: StatutoryStage): number => {
    switch (stage) {
      case 'SECTION_3A': return 2;
      case 'SECTION_3C': return 3;
      case 'SECTION_3D': return 4;
      case 'SECTION_3G': return 5;
      case 'SECTION_3H': return 6;
      case 'SECTION_3E': return 8;
      default: return 1;
    }
  };

  const currentStep = getStageStep(parcel.currentStage);

  // Statutory Compensation Breakdown Calculations
  const eligibleAmount = parcel.compensation.totalAwardAmount;
  const assessedAmount = parcel.compensation.totalAwardAmount;
  const approvedAmount = parcel.compensation.paymentStatus !== 'NOT_INITIATED' ? parcel.compensation.totalAwardAmount : 0;
  const disbursedAmount = parcel.compensation.disbursedAmount;
  const pendingAmount = eligibleAmount - disbursedAmount;

  // Actions
  const handleSanction = async () => {
    setActionLoading(true);
    try {
      await onSanctionCompensation(parcel.id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisburse = async () => {
    setActionLoading(true);
    try {
      await onDisburseCompensation(parcel.id);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePossession = async () => {
    setActionLoading(true);
    try {
      await onCompletePossession(parcel.id);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Human-readable status mapping
  const statusLabel = parcel.mapStatus
    ? parcel.mapStatus.replace(/_/g, ' ')
    : parcel.status.replace(/_/g, ' ');

  const statusColorInfo = 
    parcel.mapStatus === 'ACQUIRED' ? { bg: 'bg-emerald-500', text: 'text-white', label: 'Acquired' } :
    parcel.mapStatus === 'PENDING' ? { bg: 'bg-amber-400', text: 'text-amber-950', label: 'Pending Inquiry' } :
    parcel.mapStatus === 'DISPUTED' ? { bg: 'bg-red-600', text: 'text-white', label: 'Disputed' } :
    parcel.mapStatus === 'VERIFIED' ? { bg: 'bg-blue-600', text: 'text-white', label: 'Verified' } :
    parcel.mapStatus === 'VERIFICATION_PENDING' ? { bg: 'bg-orange-500', text: 'text-white', label: 'Verification Pending' } :
    { bg: 'bg-slate-500', text: 'text-white', label: 'Proposed' };

  // Chronological timeline events generated from audit trail and stage records
  const timelineEvents: ParcelTimelineEvent[] = useMemo(() => {
    const events: ParcelTimelineEvent[] = [
      {
        id: 'tle-1',
        stageName: 'IDENTIFIED',
        date: '2024-03-10',
        title: 'Alignment Corridor Survey Pegged',
        description: `Plot Khasra ${parcel.khasraNo} identified inside 60m RoW buffer of ${parcel.projectId}.`,
        performedBy: 'NHAI Project Implementation Unit',
        status: 'COMPLETED',
        referenceNo: 'NHAI-CORR-2024-PRR'
      },
      {
        id: 'tle-2',
        stageName: 'NOTIFICATION',
        date: '2024-04-12',
        title: 'Section 3A Gazette Notification Published',
        description: 'Statutory intention to acquire published in Gazette of India Extraordinary.',
        performedBy: 'Ministry of Road Transport & Highways',
        status: 'COMPLETED',
        referenceNo: 'S.O. 1422(E)'
      },
      {
        id: 'tle-3',
        stageName: 'VERIFIED',
        date: '2024-08-25',
        title: 'Joint Measurement Survey (JMS) Executed',
        description: `Cadastral plot area verified: ${parcel.acquisitionAreaHectares} Ha. Demarcation pegs fixed.`,
        performedBy: 'Revenue Amin & Circle Officer',
        status: 'COMPLETED',
        referenceNo: 'JMS-PAT-2024-REV'
      },
      {
        id: 'tle-4',
        stageName: 'OBJECTION',
        date: '2026-02-14',
        title: 'Section 3C Hearing & Dispute Injunction',
        description: `Objection petition filed before CALA Patna. Field verification scheduled for ground truth.`,
        performedBy: 'CALA Court, Collectorate Patna',
        status: currentStep >= 4 ? 'COMPLETED' : 'IN_PROGRESS',
        referenceNo: 'CALA-CASE-3C-2026-118'
      },
      {
        id: 'tle-5',
        stageName: 'DECLARATION',
        date: currentStep >= 4 ? '2026-02-28' : 'Scheduled',
        title: 'Section 3D Declaration of Acquisition',
        description: 'Final vesting declaration transferring title ownership to the Union Government.',
        performedBy: 'MoRTH / Gazette Directorate',
        status: currentStep >= 4 ? 'COMPLETED' : 'PENDING',
        referenceNo: 'SEC-3D-DECL-2026'
      },
      {
        id: 'tle-6',
        stageName: 'AWARD',
        date: currentStep >= 5 ? '2026-03-01' : 'Scheduled',
        title: 'Section 3G Compensation Award Determined',
        description: `Statutory compensation award determined at ${formatINR(parcel.compensation.totalAwardAmount)} (including 100% solatium).`,
        performedBy: 'CALA Patna',
        status: currentStep >= 5 ? 'COMPLETED' : 'PENDING',
        referenceNo: 'CALA-AWARD-3G-PAT'
      },
      {
        id: 'tle-7',
        stageName: 'COMPENSATION',
        date: parcel.compensation.paymentStatus === 'DIRECT_BENEFIT_TRANSFERRED' ? (parcel.compensation.disbursementDate || '2026-03-04') : 'Pending Disbursement',
        title: 'Section 3H Compensation Disbursement',
        description: parcel.compensation.paymentStatus === 'DIRECT_BENEFIT_TRANSFERRED' 
          ? `PFMS Fund Transfer DBT executed. Bank Ref: ${parcel.compensation.bankReferenceNo || 'PFMS-2026-BR-99412'}` 
          : 'Pending fund allocation in SBI Escrow Account.',
        performedBy: 'State Bank of India & CALA Escrow',
        status: parcel.compensation.paymentStatus === 'DIRECT_BENEFIT_TRANSFERRED' ? 'COMPLETED' : currentStep >= 6 ? 'IN_PROGRESS' : 'PENDING'
      },
      {
        id: 'tle-8',
        stageName: 'POSSESSION',
        date: parcel.possessionPercentage >= 100 ? '2026-03-05' : 'Target: 2026-08-15',
        title: 'Section 3E Physical Possession Handover',
        description: parcel.possessionPercentage >= 100 
          ? 'Physical possession secured. Demarcation boundary fence handed to NHAI contractor.' 
          : `Possession progress: ${parcel.possessionPercentage}%. Notice served under Section 3E.`,
        performedBy: 'District Revenue Police & NHAI',
        status: parcel.possessionPercentage >= 100 ? 'COMPLETED' : currentStep >= 8 ? 'IN_PROGRESS' : 'PENDING'
      }
    ];
    return events;
  }, [parcel, currentStep]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans max-h-[92vh]">
      {/* ============================================================ */}
      {/* HEADER: STRICT CONFORMANCE TO USER SPECIFICATION */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy text-white p-5 border-b border-white/10 flex-shrink-0 relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Central Innovation Banner */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-extrabold tracking-wider text-amber-300 uppercase text-[11px]">
              {isCitizenView 
                ? 'CITIZEN LANDOWNER DOSSIER • STATUTORY LAND ACQUISITION & COMPENSATION RECORD'
                : 'CENTRAL INNOVATION: ONE PARCEL = ONE COMPLETE DIGITAL ACQUISITION RECORD'}
            </span>
          </div>

          {/* Quick Parcel Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-300 hidden sm:inline">Switch Parcel:</span>
            <select
              value={selectedParcelId}
              onChange={(e) => {
                const targetId = e.target.value;
                setSelectedParcelId(targetId);
                const found = mockParcels.find(p => p.id === targetId);
                if (found && onSelectParcel) onSelectParcel(found);
              }}
              className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="K-125/2">K-125/2 (Flagship Demo - North 24 Parganas)</option>
              {mockParcels.filter(p => p.id !== 'K-125/2').map(p => (
                <option key={p.id} value={p.id}>
                  {p.id} — Khasra {p.khasraNo} ({p.village}, {p.district})
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Print / Save PDF Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors ml-1"
                title="Close Dossier"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Header Content Requested */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Parcel {parcel.id}
              </h1>
              <span className="text-base sm:text-lg font-bold text-amber-300 font-mono bg-white/10 px-3 py-0.5 rounded-lg border border-amber-400/30">
                Khasra {parcel.khasraNo}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Project: <strong className="text-white">{parcel.projectId}</strong> &bull; Mauza: <strong className="text-white">{parcel.village}</strong>, {parcel.district}, {parcel.state}
              </span>
            </p>
          </div>

          {/* Status & Risk Badges */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Acquisition Status</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${statusColorInfo.bg}`} />
                <span className="font-extrabold text-xs text-white uppercase">
                  {statusColorInfo.label}
                </span>
              </div>
            </div>

            {/* AI Risk Pill */}
            {!isCitizenView && (
              <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">AI Risk Assessment</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-black text-sm text-amber-400">
                    {parcel.aiRisk.overallRiskScore}/100
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    parcel.aiRisk.riskLevel === 'CRITICAL' ? 'bg-rose-600 text-white' :
                    parcel.aiRisk.riskLevel === 'HIGH' ? 'bg-red-500 text-white' :
                    parcel.aiRisk.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                  }`}>
                    {parcel.aiRisk.riskLevel}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToMap(parcel)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>View on GIS Map</span>
            </button>
            {!isCitizenView && (
              <>
                {parcel.mapStatus === 'VERIFIED' ? (
                  <button
                    onClick={() => onLaunchVerification(parcel)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    title="Ground truth verified. Click to inspect or re-verify"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Verified (Inspect)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onLaunchVerification(parcel)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Field Verify</span>
                  </button>
                )}
                {parcel.compensation.paymentStatus === 'NOT_INITIATED' && (
                  <button
                    onClick={handleSanction}
                    disabled={actionLoading}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Sanction 3G Award</span>
                  </button>
                )}
                {parcel.compensation.paymentStatus === 'CALA_SANCTIONED' && (
                  <button
                    onClick={handleDisburse}
                    disabled={actionLoading}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Disburse 3H DBT</span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-300 flex items-center gap-3">
            <span>Area: <strong className="text-white">{parcel.acquisitionAreaHectares} Ha ({parcel.acquisitionAreaSqM.toLocaleString()} m²)</strong></span>
            <span>&bull;</span>
            <span>Award: <strong className="text-emerald-300">{formatINR(parcel.compensation.totalAwardAmount)}</strong></span>
            <span>&bull;</span>
            <span>Possession: <strong className="text-cyan-300">{parcel.possessionPercentage}%</strong></span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION JUMP TABS BAR (10 SECTIONS) */}
      {/* ============================================================ */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs font-bold text-slate-600 flex-shrink-0">
        <button
          onClick={() => setActiveSection('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'ALL'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          Complete Dossier (All 10 Sections)
        </button>

        {[
          { id: 'sec-1', label: '1. Profile' },
          { id: 'sec-2', label: '2. GIS Map' },
          { id: 'sec-3', label: '3. Status Timeline' },
          { id: 'sec-4', label: '4. Compensation' },
          { id: 'sec-5', label: '5. R&R' },
          { id: 'sec-6', label: '6. Documents' },
          { id: 'sec-7', label: '7. Field Verify' },
          { id: 'sec-8', label: '8. AI Risk' },
          { id: 'sec-9', label: '9. Timeline' },
          { id: 'sec-10', label: '10. Audit History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeSection === tab.id
                ? 'bg-gov-navy text-white shadow-xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* BODY CONTAINER: SCROLLABLE DOSSIER CONTAINING ALL 10 SECTIONS */}
      {/* ============================================================ */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">

        {/* ------------------------------------------------------------ */}
        {/* SECTION 1 — PARCEL PROFILE */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-1') && (
          <section id="sec-1" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  S1
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 1 — PARCEL PROFILE
                  </h2>
                  <p className="text-[11px] text-slate-500">Cadastral identity, administrative jurisdiction & ownership registry</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">RFCTLARR & Bihar Revenue Cadastre</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{parcel.state}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{parcel.district}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Village / Mauza</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{parcel.village} (Tehsil {parcel.tehsil})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Khasra / Survey No</span>
                <span className="text-sm font-black text-gov-navy font-mono block mt-0.5">{parcel.khasraNo}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Acquisition Area</span>
                <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
                  {parcel.acquisitionAreaHectares} Ha ({parcel.acquisitionAreaSqM.toLocaleString()} m²)
                </span>
                <span className="text-[10px] text-slate-500">Total Plot: {parcel.totalParcelAreaHectares} Ha</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Land Use</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5 capitalize">
                  {parcel.landCategory.replace(/_/g, ' ').toLowerCase()}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GPS Coordinates (WGS84)</span>
                <span className="text-xs font-mono font-bold text-slate-900 block mt-0.5">
                  {parcel.coordinates[0].toFixed(5)}° N, {parcel.coordinates[1].toFixed(5)}° E
                </span>
                <span className="text-[10px] text-slate-500">UTM Zone 45N</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Corridor</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5 truncate" title={parcel.projectId}>
                  Patna Ring Road Expansion
                </span>
                <span className="text-[10px] text-slate-500">{parcel.projectId}</span>
              </div>
            </div>

            {/* Ownership and Revenue Registration Details */}
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-blue-900/70 uppercase tracking-wider block">Primary Landowner (Raiyat)</span>
                <span className="text-sm font-bold text-blue-950 block mt-0.5">{parcel.primaryOwnerName}</span>
                <span className="text-[10px] text-blue-800">Ownership: {parcel.ownershipType.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-900/70 uppercase tracking-wider block">Khata & Jamabandi Registry</span>
                <span className="text-xs font-semibold text-blue-950 block mt-0.5">
                  Khata #{parcel.khataNo} &bull; Jamabandi: {parcel.jamabandiNo}
                </span>
                <span className="text-[10px] text-blue-800">
                  Co-Sharers: {parcel.coSharers?.join(', ') || 'Sole Proprietor'}
                </span>
              </div>
              <div className="flex flex-col justify-center space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mutation: {parcel.mutationCompleted ? 'Updated in Bihar Revenue Portal' : 'Pending Partition'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Encumbrance: {parcel.encumbranceFree ? 'Non-Encumbered' : 'Active Encumbrance / Contest Notice'}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 2 — GIS (MINI MAP WITH BOUNDARY HIGHLIGHTED) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-2') && (
          <section id="sec-2" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  S2
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 2 — GIS CADASTRAL MAP
                  </h2>
                  <p className="text-[11px] text-slate-500">Interactive cadastral parcel footprint with highlighted boundary and survey pins</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToMap(parcel)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <span>Launch Full GIS</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <ParcelMiniMap parcel={parcel} onNavigateToMap={onNavigateToMap} />
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 3 — ACQUISITION STATUS (9 STAGES TIMELINE) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-3') && (
          <section id="sec-3" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  S3
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 3 — ACQUISITION STATUS TIMELINE
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Statutory stage progression under NH Act 1956 & RFCTLARR Act 2013 (Identified &rarr; Possession)
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-gov-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                Stage: {parcel.currentStage}
              </span>
            </div>

            {/* Horizontal 9-Stage Progress Pipeline */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {timelineStages.map((stg) => {
                const isCompleted = stg.stageIndex < currentStep;
                const isCurrent = stg.stageIndex === currentStep;
                const isPending = stg.stageIndex > currentStep;

                return (
                  <div
                    key={stg.key}
                    className={`p-2.5 rounded-xl border text-center flex flex-col justify-between transition-all ${
                      isCompleted 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                        : isCurrent
                        ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-400/30'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {isCurrent && <Clock className="w-4 h-4 text-amber-600 animate-pulse" />}
                        {isPending && <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                      </div>
                      <div className="font-bold text-[11px] tracking-tight">{stg.label}</div>
                      <div className="text-[9px] font-semibold text-slate-500 mt-0.5">{stg.statutoryRef}</div>
                    </div>
                    <div className="mt-2 pt-1 border-t border-slate-200/60 text-[9px] font-bold uppercase">
                      {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Stage Description Strip */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <strong>Current Stage Details: </strong>
                <span>{timelineStages[Math.min(currentStep, timelineStages.length - 1)]?.description}</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                Competent Authority: <strong>{timelineStages[Math.min(currentStep, timelineStages.length - 1)]?.authority}</strong>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 4 — COMPENSATION (ELIGIBLE, ASSESSED, APPROVED, DISBURSED, PENDING) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-4') && (
          <section id="sec-4" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                  S4
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 4 — COMPENSATION VALUATION & DISBURSEMENT
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    RFCTLARR First Schedule award determination, solatium multipliers & direct benefit transfer
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Payment: {parcel.compensation.paymentStatus.replace(/_/g, ' ')}
              </span>
            </div>

            {/* 5 Required Cards: Eligible, Assessed, Approved, Disbursed, Pending */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Eligible</span>
                <span className="text-base font-black text-slate-900 font-mono block mt-1">
                  {formatINR(eligibleAmount)}
                </span>
                <span className="text-[10px] text-slate-500">Statutory Entitlement</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Assessed</span>
                <span className="text-base font-black text-slate-900 font-mono block mt-1">
                  {formatINR(assessedAmount)}
                </span>
                <span className="text-[10px] text-slate-500">Section 3G Valuation</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Approved</span>
                <span className="text-base font-black text-gov-navy font-mono block mt-1">
                  {formatINR(approvedAmount)}
                </span>
                <span className="text-[10px] text-slate-500">CALA Sanction Order</span>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">4. Disbursed</span>
                <span className="text-base font-black text-emerald-700 font-mono block mt-1">
                  {formatINR(disbursedAmount)}
                </span>
                <span className="text-[10px] text-emerald-600">PFMS Account Credit</span>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">5. Pending</span>
                <span className="text-base font-black text-amber-700 font-mono block mt-1">
                  {formatINR(pendingAmount)}
                </span>
                <span className="text-[10px] text-amber-600">Escrow Balance Due</span>
              </div>
            </div>

            {/* Valuation Schedule Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                Statutory Compensation Components (Section 3G Award Schedule)
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-600">Base Land Value (Circle Rate ₹{parcel.compensation.circleRatePerSqM}/m² × 1.5 multiplier)</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold">{formatINR(parcel.compensation.baseLandValue)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-600">100% Solatium (RFCTLARR Act Section 30(1))</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold">{formatINR(parcel.compensation.solatium100Percent)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-600">12% Additional Interest from 3A to 3D (Section 30(3))</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold">{formatINR(parcel.compensation.additionalInterest12Percent)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-600">Immovable Structure Valuation (PWD Building Division)</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold">{formatINR(parcel.compensation.structureValuation)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-600">Standing Trees & Crop Valuation (Horticulture / Agriculture)</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold">{formatINR(parcel.compensation.treesAndCropValuation)}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="px-4 py-2.5 text-slate-900">Total Statutory Award (Section 3G Total)</td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-700 text-sm">{formatINR(parcel.compensation.totalAwardAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 5 — R&R (REHABILITATION & RESETTLEMENT) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-5') && (
          <section id="sec-5" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  S5
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 5 — REHABILITATION & RESETTLEMENT (R&R)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Affected family resettlement benefits under RFCTLARR Act 2013 (Second & Third Schedules)
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                Status: {parcel.rehabilitation.rrStatus.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Affected Family</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{parcel.primaryOwnerName}</span>
                <span className="text-[10px] text-slate-500">{parcel.rehabilitation.affectedPersonsCount} Family Members</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Displaced Status</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {parcel.rehabilitation.isDisplacedFamily ? 'Physically Displaced' : 'Non-Displaced (Land Only)'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {parcel.rehabilitation.isDisplacedFamily ? 'Requires Homestead Plot' : 'No Housing Impact'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">R&R Status</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {parcel.rehabilitation.rrStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-500">Gram Sabha Endorsed</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Panchayat Verification</span>
                <span className="text-sm font-bold text-emerald-700 block mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {parcel.rehabilitation.panchayatVerification || 'VERIFIED'}
                </span>
                <span className="text-[10px] text-slate-500">Mauza {parcel.village} Sabha</span>
              </div>
            </div>

            {/* Pending Benefit Details Grid */}
            <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-200/70 space-y-2 text-xs">
              <div className="font-bold text-purple-900 text-[11px] uppercase tracking-wider">
                Scheduled Statutory Benefits & Grants
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                  <span className="text-[10px] text-slate-400 block">Resettlement Allowance</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(parcel.rehabilitation.resettlementAllowance)}</span>
                  <span className="text-[9px] text-slate-500 block">One-time relocation grant</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                  <span className="text-[10px] text-slate-400 block">Subsistence Grant (12 Months)</span>
                  <span className="font-mono font-bold text-slate-900">₹{parcel.rehabilitation.subsistenceGrantPerMonth}/month</span>
                  <span className="text-[9px] text-slate-500 block">Annual total: ₹36,000</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                  <span className="text-[10px] text-slate-400 block">Homestead Plot Allotment</span>
                  <span className="font-bold text-slate-900">
                    {parcel.rehabilitation.homesteadPlotAllotted ? 'Allotted (50 sq.m Abadi)' : 'Not Applicable'}
                  </span>
                  <span className="text-[9px] text-slate-500 block">Mauza Kanhauli Abadi site</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 6 — DOCUMENTS (LAND RECORD, NOTIFICATION, AWARD, COMPENSATION, R&R, FIELD REPORT) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-6') && (
          <section id="sec-6" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  S6
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 6 — STATUTORY DOCUMENT LOCKER
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Versioned digital repository (Land Record, Notification, Award, Compensation, R&R, Field Report)
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">{parcel.documents.length} Certified Records</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Document Title & Reference</th>
                    <th className="px-3 py-2.5">Version</th>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Uploaded By</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parcel.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {doc.category || doc.documentType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{doc.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{doc.referenceNo} ({doc.fileSize})</div>
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-600">{doc.version || 'v1.0'}</td>
                      <td className="px-3 py-3 text-slate-600 whitespace-nowrap">{doc.issueDate}</td>
                      <td className="px-4 py-3 text-slate-700">{doc.uploadedBy || doc.verifiedBy}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.verifiedStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                          doc.verifiedStatus === 'DISCREPANCY' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {doc.verifiedStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDocPreview(doc)}
                          className="px-2 py-1 bg-gov-navy hover:bg-slate-800 text-white rounded text-[10px] font-bold inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Document Preview Modal */}
            {selectedDocPreview && (
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs border border-slate-700 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <strong>Digital Document View: {selectedDocPreview.name}</strong>
                  </div>
                  <button onClick={() => setSelectedDocPreview(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Ref No: <code>{selectedDocPreview.referenceNo}</code> &bull; Version: <code>{selectedDocPreview.version || 'v1.0'}</code> &bull; Uploaded: {selectedDocPreview.issueDate} by {selectedDocPreview.uploadedBy || selectedDocPreview.verifiedBy}
                </p>
                <div className="p-3 bg-slate-800 rounded-lg text-slate-400 font-mono text-[10px]">
                  [NIC DigiLocker & Gazette Archive Authenticated: SHA-256 Checksum: 0x8a7f4e912c...]
                </div>
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 7 — FIELD VERIFICATION (GPS, BOUNDARY, LAND USE, OCCUPANCY, PHOTOS, REMARKS, DATE) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-7') && (
          <section id="sec-7" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                  S7
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 7 — AMIN DGPS FIELD VERIFICATION & GROUND TRUTH
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    On-site cadastral inspection, boundary deviation check & geotagged photographic evidence
                  </p>
                </div>
              </div>
              <button
                onClick={() => onLaunchVerification(parcel)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Launch New Inspection</span>
              </button>
            </div>

            {parcel.fieldVerification.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                No field inspection report logged yet. Click "Launch New Inspection" to dispatch the revenue Amin.
              </div>
            ) : (
              parcel.fieldVerification.map((ver) => (
                <div key={ver.id} className="space-y-4">
                  {/* Field Report Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification Date</span>
                      <span className="text-sm font-bold text-slate-900 block mt-0.5">{ver.inspectionDate}</span>
                      <span className="text-[10px] text-slate-500">Surveyor: {ver.aminName}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GPS Coordinates (DGPS)</span>
                      <span className="text-xs font-mono font-bold text-slate-900 block mt-0.5">
                        {ver.gpsLatitude.toFixed(5)}° N, {ver.gpsLongitude.toFixed(5)}° E
                      </span>
                      <span className="text-[10px] text-slate-500">Badge: {ver.aminBadgeNo}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Boundary Deviation</span>
                      <span className={`text-sm font-bold block mt-0.5 ${ver.boundaryDeviationMeters > 0.5 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {ver.boundaryDeviationMeters} meters
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {ver.encroachmentDetected ? 'Encroachment Flagged' : 'Within Statutory Tolerances'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Land Use & Standing Crops</span>
                      <span className="text-xs font-bold text-slate-900 block mt-0.5">
                        {ver.standingCrops?.[0] || 'Irrigated agricultural'}
                      </span>
                      <span className="text-[10px] text-slate-500">Ground truth certified</span>
                    </div>
                  </div>

                  {/* Structures & Occupancy */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Occupancy & Structures Found On-Site:
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ver.structuresFound.map((struct, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold text-slate-800">
                          &bull; {struct}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Officer Remarks */}
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                      <ClipboardCheck className="w-3.5 h-3.5 text-amber-700" />
                      Revenue Officer & Amin Remarks:
                    </div>
                    <p className="text-slate-800 leading-relaxed">{ver.officerRemarks}</p>
                    {ver.encroachmentDetails && (
                      <p className="text-red-700 font-semibold mt-1">
                        <strong>Encroachment Note:</strong> {ver.encroachmentDetails}
                      </p>
                    )}
                  </div>

                  {/* Photos */}
                  {ver.photos && ver.photos.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Geotagged Photographic Ground Evidence ({ver.photos.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ver.photos.map((photo, pIdx) => (
                          <div key={pIdx} className="bg-slate-900 rounded-xl overflow-hidden text-white border border-slate-800 shadow-sm">
                            <div className="h-40 overflow-hidden relative">
                              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono">
                                Heading: {photo.compassHeading}
                              </div>
                            </div>
                            <div className="p-2.5 text-xs">
                              <div className="font-semibold text-slate-200">{photo.caption}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{photo.timestamp}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 8 — AI RISK (SCORE, LEVEL, FACTORS, RECOMMENDATIONS) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-8') && (
          <section id="sec-8" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  S8
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 8 — PREDICTIVE AI RISK RADAR
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Multi-variate litigation prediction, encroachment probability & delay risk modeling
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-900">Score: {parcel.aiRisk.overallRiskScore}/100</span>
                <RiskBadge level={parcel.aiRisk.riskLevel} />
              </div>
            </div>

            {/* Risk Probability Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Litigation Probability</span>
                <span className="text-lg font-black text-slate-900 font-mono block mt-1">{parcel.aiRisk.litigationProbability}%</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${parcel.aiRisk.litigationProbability}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Encroachment Risk</span>
                <span className="text-lg font-black text-slate-900 font-mono block mt-1">{parcel.aiRisk.encroachmentRiskScore}%</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${parcel.aiRisk.encroachmentRiskScore}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Predicted Project Delay</span>
                <span className="text-lg font-black text-amber-700 font-mono block mt-1">+{parcel.aiRisk.predictedDelayDays} Days</span>
                <span className="text-[10px] text-slate-500">Corridor Critical Path</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected Cost Overrun</span>
                <span className="text-lg font-black text-rose-700 font-mono block mt-1">{formatINR(parcel.aiRisk.projectedCostImpactInr)}</span>
                <span className="text-[10px] text-slate-500">Legal & Demarcation buffer</span>
              </div>
            </div>

            {/* Risk Factors & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
                <div className="font-bold text-rose-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Detected Risk Factors ({parcel.aiRisk.detectedRiskFactors.length})
                </div>
                <ul className="space-y-1.5 text-rose-950">
                  {parcel.aiRisk.detectedRiskFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">&bull;</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                <div className="font-bold text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  AI Recommended Pre-Emptive Actions
                </div>
                <ul className="space-y-1.5 text-blue-950">
                  {parcel.aiRisk.aiRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">&rarr;</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 9 — TIMELINE (CHRONOLOGICAL PARCEL ACTIVITIES) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-9') && (
          <section id="sec-9" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                  S9
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 9 — PARCEL ACTIVITY TIMELINE
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Chronological milestone ledger of all statutory and field actions for Khasra {parcel.khasraNo}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">{timelineEvents.length} Events Tracked</span>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 my-2 text-xs">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="relative group">
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                    evt.status === 'COMPLETED' ? 'bg-emerald-600 ring-2 ring-emerald-200' :
                    evt.status === 'IN_PROGRESS' ? 'bg-amber-500 ring-2 ring-amber-200 animate-pulse' : 'bg-slate-300'
                  }`} />
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 group-hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span>{evt.title}</span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                          {evt.stageName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{evt.date}</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px]">{evt.description}</p>
                    <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Action by: <strong className="text-slate-700">{evt.performedBy}</strong></span>
                      {evt.referenceNo && <span>Ref: <code>{evt.referenceNo}</code></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SECTION 10 — AUDIT HISTORY (WHO, ACTION, DATE, PREVIOUS, NEW) */}
        {/* ------------------------------------------------------------ */}
        {(activeSection === 'ALL' || activeSection === 'sec-10') && (
          <section id="sec-10" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                  S10
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    SECTION 10 — IMMUTABLE AUDIT TRAIL
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Cryptographically hashed government compliance log (Who, Action, Date, Previous Value, New Value)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                SHA-256 Ledger
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Who (Officer / System)</th>
                    <th className="px-4 py-2.5">Action</th>
                    <th className="px-3 py-2.5">Date & Time</th>
                    <th className="px-4 py-2.5">Previous Value</th>
                    <th className="px-4 py-2.5">New Value</th>
                    <th className="px-3 py-2.5 text-right font-mono">Audit Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parcel.auditTrail.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{log.performedBy}</div>
                        <div className="text-[10px] text-slate-500">{log.role}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-semibold text-slate-800 font-mono text-[11px]">{log.action}</span>
                        {log.remarks && <p className="text-[10px] text-slate-500 truncate max-w-xs">{log.remarks}</p>}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap font-mono text-[11px]">{log.timestamp}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">
                        {log.previousValue || '—'}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-emerald-700 font-semibold">
                        {log.newValue || 'Updated'}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-[10px] text-slate-400">
                        <code>{log.hash}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
