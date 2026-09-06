import React, { useState } from 'react';
import { User } from '../../types/auth';
import { Parcel } from '../../types/parcel';
import { CitizenTabId } from './CitizenPortalShell';
import { CitizenGisMap } from './CitizenGisMap';
import { 
  MapPin, 
  Eye, 
  Clock, 
  IndianRupee, 
  Home, 
  FileText, 
  Bell, 
  Compass, 
  HelpCircle, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Upload, 
  Send, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  Info,
  Layers,
  Edit3
} from 'lucide-react';
import { Button } from '../ui/Button';

interface CitizenDashboardProps {
  currentUser: User;
  parcels: Parcel[];
  activeTab: CitizenTabId;
  onSelectTab: (tab: CitizenTabId) => void;
  onOpenDigitalTwin: (parcel: Parcel) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  currentUser,
  parcels: allParcels,
  activeTab,
  onSelectTab,
  onOpenDigitalTwin
}) => {
  const profile = currentUser.citizenProfile;
  const linkedIds = profile?.linkedParcelIds || ['K-125/2', 'WB-KOL-K108/1', 'WB-KOL-K108/2'];

  // Filter parcels linked to this citizen
  const citizenParcels = allParcels.filter(p => 
    linkedIds.includes(p.id) || 
    p.primaryOwnerName.toLowerCase().includes('soumitra') ||
    (profile?.khasraNo && p.khasraNo === profile.khasraNo)
  );

  // Fallback to primary showcase parcel K-125/2 if empty
  const parcels = citizenParcels.length > 0 ? citizenParcels : allParcels.slice(0, 3);
  const primaryParcel = parcels.find(p => p.id === (profile?.primaryParcelId || 'K-125/2')) || parcels[0];

  // Selected parcel state for detailed tabs
  const [selectedParcel, setSelectedParcel] = useState<Parcel>(primaryParcel);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      date: '02 Mar 2026',
      type: 'COMPENSATION',
      title: 'Compensation Verification Completed',
      message: 'CALA Kolkata Revenue Cell has finalized and verified the 100% solatium valuation for Khasra 125/2.',
      priority: 'HIGH',
      read: false
    },
    {
      id: 'notif-2',
      date: '28 Feb 2026',
      type: 'AWARD',
      title: 'Your Acquisition Award Has Been Issued',
      message: 'Section 3G award decree issued under reference CALA-KOL-3G-2026-012. Ready for disbursement scheduling.',
      priority: 'NORMAL',
      read: false
    },
    {
      id: 'notif-3',
      date: '15 Feb 2026',
      type: 'HEARING',
      title: 'Hearing Date Updated',
      message: 'Objection hearing under Section 3C concluded. Collectorate records updated successfully.',
      priority: 'NORMAL',
      read: true
    },
    {
      id: 'notif-4',
      date: '10 Feb 2026',
      type: 'RNR',
      title: 'R&R Application Moved to Next Stage',
      message: 'Joint family rehabilitation scheme verified by Gram Panchayat & BL&LRO Rajarhat.',
      priority: 'NORMAL',
      read: true
    },
    {
      id: 'notif-5',
      date: '01 Feb 2026',
      type: 'DOCUMENT',
      title: 'Additional Document Required',
      message: 'Bank mandate form validated. No further physical documents required from raiyat.',
      priority: 'HIGH',
      read: true
    }
  ]);

  // Grievance state
  const [grievanceCategory, setGrievanceCategory] = useState('Valuation & Solatium');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [grievanceFileAttached, setGrievanceFileAttached] = useState(false);
  const [grievancesList, setGrievancesList] = useState([
    {
      id: 'GRV-WB-2026-081',
      category: 'Valuation & Solatium',
      description: 'Requesting clarification regarding 100% solatium calculation on commercial road frontage.',
      date: '24 Feb 2026',
      status: 'Under Review',
      officerResponse: 'CALA Kolkata has received the query. Valuation verified against circle rate multiplier.'
    },
    {
      id: 'GRV-WB-2026-034',
      category: 'Demarcation Survey',
      description: 'Request for re-peg verification on southern boundary wall.',
      date: '15 Jan 2026',
      status: 'Resolved',
      officerResponse: 'Amin survey completed on 20 Jan 2026. Demarcation stone pillars pegged.'
    }
  ]);

  // Profile editable preferences state
  const [contactEmail, setContactEmail] = useState(currentUser.email || 'soumitra.chatterjee88@gmail.com');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [profileSaveMessage, setProfileSaveMessage] = useState('');

  // Currency Formatter
  const formatINR = (amt: number) => `₹ ${amt.toLocaleString('en-IN')}`;

  // 8 Statutory Stages for Acquisition Tracker (Prompt Requirement 6)
  const timelineStages = [
    { name: 'PROJECT PROPOSAL', status: 'COMPLETED', label: 'Completed', date: 'Jan 2024' },
    { name: 'LAND IDENTIFICATION', status: 'COMPLETED', label: 'Completed', date: 'Mar 2024' },
    { name: 'SURVEY & VERIFICATION', status: 'COMPLETED', label: 'Completed', date: 'Aug 2024' },
    { name: 'NOTIFICATION', status: 'COMPLETED', label: 'Completed', date: 'Apr 2025' },
    { name: 'OBJECTION / HEARING', status: 'COMPLETED', label: 'Completed', date: 'Nov 2025' },
    { name: 'AWARD', status: 'COMPLETED', label: 'Completed', date: 'Jan 2026' },
    { name: 'COMPENSATION', status: 'CURRENT', label: 'Current Stage', date: 'In Progress' },
    { name: 'R&R', status: 'PENDING', label: 'Pending', date: 'Upcoming (Apr 2026)' },
    { name: 'POSSESSION', status: 'PENDING', label: 'Pending', date: 'Upcoming (Jun 2026)' }
  ];

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDesc.trim()) return;
    const newGrievance = {
      id: `GRV-WB-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: grievanceCategory,
      description: grievanceDesc,
      date: 'Today',
      status: 'Submitted',
      officerResponse: 'Transmitted to Competent Authority (CALA) for priority review.'
    };
    setGrievancesList([newGrievance, ...grievancesList]);
    setGrievanceDesc('');
    setGrievanceFileAttached(false);
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveMessage('Contact preferences updated successfully.');
    setTimeout(() => setProfileSaveMessage(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ============================================================ */}
      {/* VIEW 1: MAIN DASHBOARD OVERVIEW */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Direct Civilian Access &bull; Verified Citizen Portal
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome, {currentUser.name}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Track your land acquisition status, compensation and rehabilitation progress in one place.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin size={14} className="text-gov-navy" />
                    {profile?.district || 'North 24 Parganas'}, {profile?.state || 'West Bengal'}
                  </span>
                  <span>&bull;</span>
                  <span>Citizen Ref: <strong className="font-mono text-slate-800">{currentUser.officerId || 'CIT-WB-2026-89412'}</strong></span>
                  <span>&bull;</span>
                  <span>Aadhaar: <strong className="font-mono text-slate-800">{profile?.aadhaarMasked || '•••• •••• 6419'}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => onOpenDigitalTwin(primaryParcel)}
                  leftIcon={<Eye size={16} />}
                  className="font-bold shadow-sm"
                >
                  View Parcel Digital Twin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => onSelectTab('gis')}
                  leftIcon={<Compass size={16} className="text-gov-navy" />}
                  className="font-bold"
                >
                  View My Land on Map
                </Button>
              </div>
            </div>
          </div>

          {/* 4 Summary Cards (Prompt Requirement 4) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: MY LAND */}
            <div 
              onClick={() => onSelectTab('myland')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>MY LAND</span>
                <span className="text-gov-navy group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
                3
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                Parcels Registered
              </div>
            </div>

            {/* Card 2: UNDER ACQUISITION */}
            <div 
              onClick={() => onSelectTab('acquisition')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>UNDER ACQUISITION</span>
                <span className="text-amber-600 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <div className="text-3xl font-black text-amber-600 mt-2 font-mono">
                2
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                Parcels in Statutory Process
              </div>
            </div>

            {/* Card 3: COMPENSATION */}
            <div 
              onClick={() => onSelectTab('compensation')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>COMPENSATION</span>
                <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <div className="text-3xl font-black text-blue-700 mt-2 font-mono">
                1
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                Pending Final Disbursement
              </div>
            </div>

            {/* Card 4: R&R STATUS */}
            <div 
              onClick={() => onSelectTab('rnr')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>R&R STATUS</span>
                <span className="text-emerald-600 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-2 font-mono">
                1
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                In Progress (Homestead Allotted)
              </div>
            </div>
          </div>

          {/* Delay Information Banner (Prompt Requirement 13) */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-800 flex-shrink-0 mt-0.5">
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-950 text-sm">
                    Your acquisition process is currently delayed.
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300">
                    Delay: 12 days
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  <strong>Current Stage:</strong> Compensation &bull; <strong>Expected Date:</strong> 15 Aug 2026 &bull; <strong>Current Status:</strong> Under Administrative Review
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('acquisition')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto flex-shrink-0"
            >
              Track Stage Details &rarr;
            </button>
          </div>

          {/* Featured Primary Parcel Quick Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-gov-navy" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Flagship Parcel: Khasra {primaryParcel.khasraNo} ({primaryParcel.id})
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                Stage: Compensation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Project</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  Kolkata Infrastructure Project
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Acquired Area</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  0.42 Acre ({primaryParcel.acquisitionAreaHectares} Ha)
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Sanctioned Award</span>
                <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                  {formatINR(primaryParcel.compensation.totalAwardAmount || 7584200)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Action</span>
                <button
                  type="button"
                  onClick={() => onOpenDigitalTwin(primaryParcel)}
                  className="mt-0.5 text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: MY LAND / PARCELS SECTION (Prompt Requirement 5) */}
      {/* ============================================================ */}
      {activeTab === 'myland' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                MY LAND
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All land records and cadastral parcels registered under your title ownership in West Bengal
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelectTab('gis')}
              leftIcon={<Compass size={14} className="text-gov-navy" />}
              className="font-bold text-xs"
            >
              View on Map
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {parcels.map((parcel, idx) => {
              const isFlagship = parcel.id === 'K-125/2';
              return (
                <div 
                  key={parcel.id} 
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs border border-slate-200">
                        Parcel ID: {parcel.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        parcel.status === 'POSSESSION_ACQUIRED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {parcel.status === 'POSSESSION_ACQUIRED' ? 'Possession Handed' : 'In Progress'}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-black text-slate-900 flex items-center gap-1.5">
                        <span>Plot / Khasra No. {parcel.khasraNo}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {parcel.village}, {parcel.district}, {parcel.state}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Area</span>
                        <span className="font-bold text-slate-800 block">
                          {isFlagship ? '0.42 Acre' : `${Math.round(parcel.acquisitionAreaHectares * 2.471 * 100) / 100} Acre`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Stage</span>
                        <span className="font-bold text-blue-700 block">
                          {parcel.status === 'POSSESSION_ACQUIRED' ? 'Possession Handed' : 'Compensation'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Associated Project</span>
                      <span className="font-semibold text-slate-700 block mt-0.5 line-clamp-1">
                        {parcel.projectId === 'WB-KOL-KONA-2026'
                          ? 'Kolkata Infrastructure Project'
                          : parcel.projectId}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenDigitalTwin(parcel)}
                      leftIcon={<Eye size={14} />}
                      className="w-full font-bold shadow-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 3: ACQUISITION STATUS TRACKER (Prompt Requirement 6) */}
      {/* ============================================================ */}
      {activeTab === 'acquisition' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="text-gov-navy" size={22} />
                  Acquisition Status Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  End-to-end statutory milestones for Khasra {primaryParcel.khasraNo} ({primaryParcel.id}) &bull; Kolkata Infrastructure Project
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Current Stage: Compensation (Section 3G)
              </span>
            </div>

            {/* Delay Notice Banner (Prompt Requirement 13) */}
            <div className="my-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-950 text-sm">
                  Your acquisition process is currently delayed.
                </div>
                <p className="text-amber-900 leading-relaxed">
                  <strong>Current Stage:</strong> Compensation &bull; <strong>Expected Date:</strong> 15 Aug 2026 &bull; <strong>Delay:</strong> 12 days &bull; <strong>Current Status:</strong> Under Administrative Review
                </p>
              </div>
            </div>

            {/* Visual Timeline (Prompt Requirement 6) */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {timelineStages.map((st, idx) => {
                const isCompleted = st.status === 'COMPLETED';
                const isCurrent = st.status === 'CURRENT';

                return (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted 
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-amber-500 border-amber-600 text-white shadow-md ring-4 ring-amber-100 animate-pulse'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={15} /> : isCurrent ? '●' : '○'}
                    </div>

                    {/* Stage Card */}
                    <div className={`p-4 rounded-xl border transition-all ${
                      isCurrent 
                        ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                        : isCompleted
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50/40 border-slate-100 opacity-60'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {st.name}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white">
                              CURRENT
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          {st.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {isCompleted 
                          ? 'Statutory compliance satisfied and certified by Competent Authority.'
                          : isCurrent
                          ? 'Final valuation decree formulated. Direct benefit electronic fund transfer schedule awaiting treasury sign-off.'
                          : 'Upcoming stage to be initiated sequentially after compensation completion.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 4: COMPENSATION TRACKING (Prompt Requirement 7) */}
      {/* ============================================================ */}
      {activeTab === 'compensation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <IndianRupee className="text-gov-navy" size={22} />
                  Compensation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authorized financial award tracking under RFCTLARR Act 2013 &bull; Khasra {primaryParcel.khasraNo}
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onOpenDigitalTwin(primaryParcel)}
                leftIcon={<Eye size={14} />}
                className="font-bold text-xs"
              >
                View Compensation Details
              </Button>
            </div>

            {/* Key Authorized Figures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                  Award Amount
                </span>
                <span className="text-2xl sm:text-3xl font-black text-blue-950 font-mono mt-1 block">
                  ₹ 75,84,200
                </span>
                <span className="text-[11px] text-blue-800 mt-1 block">
                  Includes 100% Solatium & Asset Valuations
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Amount Disbursed
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-700 font-mono mt-1 block">
                  ₹ 0
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pending Direct DBT Transfer
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                  Pending Amount
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-950 font-mono mt-1 block">
                  ₹ 75,84,200
                </span>
                <span className="text-[11px] text-amber-800 mt-1 block">
                  Escrow Allocated &bull; Awaiting Sign-off
                </span>
              </div>
            </div>

            {/* Status & Action Required Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Compensation Status</span>
                  <span className="text-base font-bold text-amber-700 mt-0.5 block flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    IN PROCESS
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Payment Status</span>
                  <span className="text-base font-bold text-slate-800 mt-0.5 block">
                    Processing / Awaiting CALA Decree Signature
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Expected Action</span>
                <p className="text-slate-800 font-semibold leading-relaxed">
                  &ldquo;Awaiting verification&rdquo; &mdash; Bank account mandate verified via DigiLocker. No action required from landowner at this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 5: R&R — REHABILITATION & RESETTLEMENT (Prompt Requirement 8) */}
      {/* ============================================================ */}
      {activeTab === 'rnr' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Home className="text-gov-navy" size={22} />
                Rehabilitation & Resettlement (R&R)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Entitlements and benefits under the RFCTLARR Second Schedule &bull; North 24 Parganas Corridor
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">R&R Status</span>
                <span className="text-base font-bold text-amber-700 mt-1 block">In Progress</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Eligibility</span>
                <span className="text-base font-bold text-emerald-700 mt-1 block">Eligible Titleholder Family</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Verification Status</span>
                <span className="text-base font-bold text-emerald-700 mt-1 block">Completed by Gram Panchayat & Amin</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Benefit Processing</span>
                <span className="text-base font-bold text-blue-700 mt-1 block">Under Processing</span>
              </div>
            </div>

            {/* Entitlements Details */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                Approved Benefits / Entitlements
              </h3>
              <ul className="space-y-2 text-xs text-slate-800">
                <li className="flex items-center justify-between py-1 border-b border-blue-100">
                  <span>Resettlement Allowance</span>
                  <strong className="font-mono text-gov-navy">₹ 5,00,000 (One-time grant)</strong>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-blue-100">
                  <span>Subsistence Grant</span>
                  <strong className="font-mono text-gov-navy">₹ 3,000 / month (12 months)</strong>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-blue-100">
                  <span>Alternate Homestead Plot</span>
                  <strong className="text-emerald-700 font-bold">Allotted in Rajarhat Sector IV</strong>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Skill Training Grant</span>
                  <strong className="font-mono text-gov-navy">₹ 50,000</strong>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Action Required</span>
                <span className="font-bold text-slate-800 mt-0.5 block">No action currently required</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Expected Completion</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">30 June 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 6: NOTIFICATIONS CENTER (Prompt Requirement 9) */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Bell className="text-gov-navy" size={22} />
                  Notifications Center
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official statutory communications and milestone updates regarding your land
                </p>
              </div>
              <button
                type="button"
                onClick={handleMarkAllNotifsRead}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    !n.read 
                      ? 'bg-blue-50/50 border-blue-200' 
                      : 'bg-white border-slate-200 opacity-80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                      <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        n.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {n.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{n.message}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 self-start sm:self-center flex-shrink-0">
                    {n.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 7: DOCUMENTS (Prompt Requirement 10) */}
      {/* ============================================================ */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileText className="text-gov-navy" size={22} />
                My Documents
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized government gazettes, notices, and awards available for download
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { name: 'Cadastral Porcha & RoR Extract Khasra 125/2.pdf', type: 'Land Record', date: '15 Feb 2024', status: 'Verified' },
                { name: 'Section 3A Extraordinary Gazette S.O. 982(E).pdf', type: 'Official Gazette', date: '10 Mar 2024', status: 'Verified' },
                { name: 'Section 3G Statutory Award Schedule.pdf', type: 'Award Document', date: '28 Jan 2026', status: 'Verified' },
                { name: 'Rehabilitation & Resettlement Scheme Card.pdf', type: 'R&R Document', date: '10 Feb 2026', status: 'Verified' }
              ].map((doc, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                      <div className="text-slate-400 mt-0.5 flex items-center gap-2 text-[11px]">
                        <span>{doc.type}</span>
                        <span>&bull;</span>
                        <span>Date: {doc.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {doc.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading official verified document: ${doc.name}`)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 8: GIS MAP (Prompt Requirement 11) */}
      {/* ============================================================ */}
      {activeTab === 'gis' && (
        <CitizenGisMap
          parcels={parcels}
          selectedParcel={selectedParcel}
          onOpenDigitalTwin={onOpenDigitalTwin}
        />
      )}

      {/* ============================================================ */}
      {/* VIEW 9: HELP & GRIEVANCE (Prompt Requirement 14) */}
      {/* ============================================================ */}
      {activeTab === 'grievance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-gov-navy" size={22} />
                Help & Grievance Redressal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit queries directly to the Competent Authority Land Acquisition (CALA) and track resolution in real time
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleGrievanceSubmit} className="space-y-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Raise New Grievance / Query
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Category</label>
                  <select
                    value={grievanceCategory}
                    onChange={(e) => setGrievanceCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="Valuation & Solatium">Valuation & Solatium (First Schedule)</option>
                    <option value="Demarcation Survey">Boundary & Demarcation Verification</option>
                    <option value="R&R Benefits">Rehabilitation & Resettlement Entitlements</option>
                    <option value="Bank Account & DBT">Bank Mandate & DBT Electronic Transfer</option>
                    <option value="General Query">General Procedural Query</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Affected Parcel</label>
                  <input
                    type="text"
                    disabled
                    value={`Khasra ${primaryParcel.khasraNo} (${primaryParcel.id}) - North 24 Parganas`}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={grievanceDesc}
                  onChange={(e) => setGrievanceDesc(e.target.value)}
                  placeholder="Describe your query or specific concern clearly for the CALA officer..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGrievanceFileAttached(!grievanceFileAttached)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    grievanceFileAttached 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Upload size={14} />
                  <span>{grievanceFileAttached ? 'Document Attached (Porcha_Copy.pdf)' : 'Attach Supporting Document'}</span>
                </button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Send size={14} />}
                  className="font-bold text-xs"
                >
                  Submit Grievance
                </Button>
              </div>
            </form>

            {/* Tracked Grievances */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Tracked Grievance History ({grievancesList.length})
              </h3>
              {grievancesList.map(g => (
                <div key={g.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{g.id}</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {g.category}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      g.status === 'Resolved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : g.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                  <p className="text-slate-700">{g.description}</p>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <strong>Official Response:</strong> {g.officerResponse}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 10: CITIZEN PROFILE (Prompt Requirement 15) */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <UserIcon className="text-gov-navy" size={22} />
                  My Profile
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified titleholder identity details and notification communication preferences
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                Aadhaar Authenticated
              </span>
            </div>

            {/* Read-Only Verified Landowner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Citizen Full Name</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentUser.name}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Citizen Reference ID</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{currentUser.officerId || 'CIT-WB-2026-89412'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Aadhaar Number</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{profile?.aadhaarMasked || '•••• •••• 6419'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">State</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{profile?.state || 'West Bengal'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">District</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{profile?.district || 'North 24 Parganas'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Registered Mobile</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{profile?.mobileMasked || '+91 98301 ••••72'}</span>
              </div>
            </div>

            {/* Linked Parcels List */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Linked Cadastral Parcels ({parcels.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {parcels.map(p => (
                  <div key={p.id} className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900">{p.id}</div>
                    <div className="text-[11px] text-slate-500">Khasra {p.khasraNo} &bull; {p.village}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 italic mt-1">
                * Government land records are verified by District Collectorate and cannot be modified by the landowner.
              </p>
            </div>

            {/* Editable Contact Preferences */}
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Editable Communication Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-gov-navy focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={smsAlertsEnabled}
                      onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                      className="w-4 h-4 text-gov-navy rounded border-slate-300"
                    />
                    <span>Receive Instant SMS & WhatsApp Statutory Alerts</span>
                  </label>
                </div>
              </div>

              {profileSaveMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={15} />
                  <span>{profileSaveMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                leftIcon={<Edit3 size={14} />}
                className="font-bold text-xs"
              >
                Save Preferences
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
