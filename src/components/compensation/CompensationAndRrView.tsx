import React, { useState, useMemo } from 'react';
import { 
  BeneficiaryRecord, 
  FamilyRrRecord, 
  CompensationKpis, 
  RrKpis, 
  CompensationRrAlert,
  AlertType,
  CompensationWorkflowStep
} from '../../types/compensationRr';
import { compensationRrService } from '../../services/compensationRrService';
import { CompensationWorkflowModal } from './CompensationWorkflowModal';
import { Parcel } from '../../types/parcel';
import { ProjectCorridor } from '../../types/project';
import { useToast } from '../ui/Toast';
import { 
  IndianRupee, 
  Users, 
  Home, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Filter, 
  Search, 
  ExternalLink, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Layers, 
  ArrowUpRight, 
  BarChart3, 
  PieChart, 
  Check, 
  AlertOctagon,
  FileCheck
} from 'lucide-react';

interface CompensationAndRrViewProps {
  project?: ProjectCorridor;
  parcels: Parcel[];
  currentOfficer?: any;
  onOpenDigitalTwin: (parcel: Parcel) => void;
  onNavigateToMap: (parcel: Parcel) => void;
}

export const CompensationAndRrView: React.FC<CompensationAndRrViewProps> = ({
  project,
  parcels,
  currentOfficer,
  onOpenDigitalTwin,
  onNavigateToMap
}) => {
  const { showToast } = useToast();

  // Active Main Section Tab
  const [activeSection, setActiveSection] = useState<'COMPENSATION' | 'RR' | 'ANALYTICS' | 'ALERTS'>('COMPENSATION');

  // Filters
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [alertTypeFilter, setAlertTypeFilter] = useState<string>('ALL');

  // Selected beneficiary for 4-step workflow modal
  const [activeBeneficiaryForWorkflow, setActiveBeneficiaryForWorkflow] = useState<BeneficiaryRecord | null>(null);

  // Reload trigger for reactive state
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // Live Data & KPIs
  const beneficiaries = useMemo(() => {
    return compensationRrService.getBeneficiaries(project?.id, districtFilter);
  }, [project, districtFilter, refreshTick]);

  const families = useMemo(() => {
    return compensationRrService.getFamilies(project?.id, districtFilter);
  }, [project, districtFilter, refreshTick]);

  const compKpis = useMemo(() => {
    return compensationRrService.getCompensationKpis(project?.id, districtFilter);
  }, [project, districtFilter, refreshTick]);

  const rrKpis = useMemo(() => {
    return compensationRrService.getRrKpis(project?.id, districtFilter);
  }, [project, districtFilter, refreshTick]);

  const alerts = useMemo(() => {
    return compensationRrService.getAlerts(project?.id, districtFilter);
  }, [project, districtFilter, refreshTick]);

  const districtAnalytics = useMemo(() => {
    return compensationRrService.getDistrictAnalytics();
  }, [refreshTick]);

  const projectAnalytics = useMemo(() => {
    return compensationRrService.getProjectAnalytics();
  }, [refreshTick]);

  // Analytics view mode toggle
  const [analyticsMode, setAnalyticsMode] = useState<'DISTRICT' | 'PROJECT'>('DISTRICT');

  // Filtered Beneficiaries
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      const matchSearch = 
        b.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [beneficiaries, searchQuery, statusFilter]);

  // Filtered Families
  const filteredFamilies = useMemo(() => {
    return families.filter(f => {
      const matchSearch = 
        f.khasraNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.headOfFamily.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || f.rrStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [families, searchQuery, statusFilter]);

  // Filtered Alerts
  const filteredAlerts = useMemo(() => {
    if (alertTypeFilter === 'ALL') return alerts;
    return alerts.filter(a => a.type === alertTypeFilter);
  }, [alerts, alertTypeFilter]);

  // Helper to resolve parcel from parcelId
  const findParcel = (parcelId: string): Parcel | undefined => {
    return parcels.find(p => p.id === parcelId || p.khasraNo === parcelId);
  };

  const handleOpenParcelTwinById = (parcelId: string) => {
    const found = findParcel(parcelId);
    if (found) {
      onOpenDigitalTwin(found);
    } else if (parcels.length > 0) {
      onOpenDigitalTwin(parcels[0]);
    }
  };

  const handleNavigateToMapById = (parcelId: string) => {
    const found = findParcel(parcelId);
    if (found) {
      onNavigateToMap(found);
    } else if (parcels.length > 0) {
      onNavigateToMap(parcels[0]);
    }
  };

  // Quick R&R Actions
  const handleAllotPlot = (family: FamilyRrRecord) => {
    const plotNo = `Plot No. H-${Math.floor(Math.random() * 80) + 10} (50 Sq.m)`;
    compensationRrService.allotHomesteadPlot(family.id, plotNo, 'Kanhauli Model R&R Colony Site A');
    setRefreshTick(t => t + 1);
    showToast({
      title: 'Homestead Plot Sanctioned',
      message: `${plotNo} allotted to ${family.headOfFamily} (${family.id})`,
      type: 'success'
    });
  };

  const handleDisburseSubsistence = (family: FamilyRrRecord) => {
    compensationRrService.disburseSubsistence(family.id, 6);
    setRefreshTick(t => t + 1);
    showToast({
      title: 'Subsistence Allowance Disbursed',
      message: `6-month tranche credited for family ${family.id} (${family.headOfFamily})`,
      type: 'success'
    });
  };

  const handleVerifyClaim = (family: FamilyRrRecord) => {
    compensationRrService.verifyFamilyStatus(family.id, 'VERIFIED');
    setRefreshTick(t => t + 1);
    showToast({
      title: 'Gram Sabha Verification Certified',
      message: `Family ${family.id} status marked VERIFIED under RFCTLARR Act Schedule II`,
      type: 'success'
    });
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            STATUTORY COMPENSATION & R&R EXECUTIVE COMMAND
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Part 9: Compensation & Rehabilitation (RFCTLARR 2013)
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Corridor: <strong className="text-slate-900">{project?.name || 'Patna Ring Road Expansion (Phase II)'}</strong> &bull; Code: {project?.code || 'PRR-PH2-2026'}
          </p>
        </div>

        {/* Global Controls & District Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
            <Filter size={14} className="text-slate-500" />
            <span className="font-bold text-slate-600">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value="ALL">All Corridor Districts</option>
              <option value="Patna">Patna</option>
              <option value="Saran">Saran</option>
              <option value="Bhojpur">Bhojpur</option>
              <option value="Vaishali">Vaishali</option>
            </select>
          </div>

          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            PFMS / SBI Escrow DBT Active
          </div>
        </div>
      </div>

      {/* Main Section Navigation Bar */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-xs gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveSection('COMPENSATION')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeSection === 'COMPENSATION'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <IndianRupee size={15} className={activeSection === 'COMPENSATION' ? 'text-amber-400' : 'text-slate-400'} />
          <span>Section A: Compensation</span>
        </button>

        <button
          onClick={() => setActiveSection('RR')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeSection === 'RR'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Home size={15} className={activeSection === 'RR' ? 'text-emerald-400' : 'text-slate-400'} />
          <span>Section B: R&R Dashboard</span>
        </button>

        <button
          onClick={() => setActiveSection('ANALYTICS')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeSection === 'ANALYTICS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 size={15} className={activeSection === 'ANALYTICS' ? 'text-blue-400' : 'text-slate-400'} />
          <span>Section C: R&R Analytics</span>
        </button>

        <button
          onClick={() => setActiveSection('ALERTS')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all relative ${
            activeSection === 'ALERTS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertOctagon size={15} className={activeSection === 'ALERTS' ? 'text-rose-400' : 'text-slate-400'} />
          <span>Section D: Statutory Alerts</span>
          {alerts.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: COMPENSATION DASHBOARD                                         */}
      {/* ========================================================================= */}
      {activeSection === 'COMPENSATION' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Financial KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Assessed</span>
                <IndianRupee size={16} className="text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                ₹{(compKpis.totalAssessed / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Circle rate + 100% solatium + interest
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Approved</span>
                <ShieldCheck size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-black text-blue-700 mt-2">
                ₹{(compKpis.totalApproved / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                CALA Section 3G decrees signed
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Disbursed</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-2">
                ₹{(compKpis.totalDisbursed / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Disbursed via PFMS DBT to Aadhaar seed
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Pending</span>
                <Clock size={16} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 mt-2">
                ₹{(compKpis.totalPending / 10000000).toFixed(2)} Cr
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Awaiting CALA approval or PFMS queue
              </div>
            </div>
          </div>

          {/* Beneficiaries Status Counter Grid */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>Beneficiary Disbursement Breakdown</span>
              <span className="text-[11px] text-emerald-400 font-bold">100% Synthetic Demo Records Only</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Total Beneficiaries</div>
                <div className="text-2xl font-black text-white mt-1">{compKpis.totalBeneficiaries}</div>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="text-xs text-emerald-400 font-semibold">Paid (DBT Confirmed)</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{compKpis.paidBeneficiaries}</div>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="text-xs text-amber-400 font-semibold">Pending (In Workflow)</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{compKpis.pendingBeneficiaries}</div>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="text-xs text-rose-400 font-semibold">Delayed (&gt;30 Days)</div>
                <div className="text-2xl font-black text-rose-400 mt-1">{compKpis.delayedBeneficiaries}</div>
              </div>
            </div>
          </div>

          {/* Assessed vs Disbursed Visual Comparison Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  Assessed vs Disbursed Financial Progress
                </h3>
                <p className="text-xs text-slate-500">
                  Village-level comparison of statutory Section 3G assessment versus actual electronic PFMS disbursement
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-300"></span>
                  <span className="text-slate-600">Assessed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
                  <span className="text-emerald-800">Disbursed</span>
                </div>
              </div>
            </div>

            {/* Simulated Chart Bars across Villages */}
            <div className="space-y-4 pt-2">
              {[
                { village: 'Kanhauli (Patna)', assessed: 25.59, disbursed: 6.51, ratio: 25.4 },
                { village: 'Bihta Urban (Patna)', assessed: 18.40, disbursed: 11.20, ratio: 60.8 },
                { village: 'Dighwara (Saran)', assessed: 5.12, disbursed: 0.00, ratio: 0 },
                { village: 'Koilwar (Bhojpur)', assessed: 4.35, disbursed: 4.35, ratio: 100.0 },
                { village: 'Hajipur Rural (Vaishali)', assessed: 3.90, disbursed: 0.00, ratio: 0 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{item.village}</span>
                    <span className="text-slate-500">
                      Disbursed: <strong className="text-emerald-700">₹{item.disbursed.toFixed(2)} Cr</strong> / ₹{item.assessed.toFixed(2)} Cr ({item.ratio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex relative">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] text-white font-bold"
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beneficiary Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Beneficiary Compensation Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredBeneficiaries.length} synthetic beneficiary records linked to corridor plots
                </p>
              </div>

              {/* Table Search & Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
                  <Search size={13} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Khasra or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-slate-900 font-medium outline-none w-36 sm:w-48 placeholder:text-slate-400"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="DELAYED">Delayed</option>
                </select>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3">Parcel</th>
                    <th className="p-3">Beneficiary Demo ID</th>
                    <th className="p-3 text-right">Assessed</th>
                    <th className="p-3 text-right">Approved</th>
                    <th className="p-3 text-right">Disbursed</th>
                    <th className="p-3 text-right">Pending</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Workflow Stage</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBeneficiaries.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleOpenParcelTwinById(b.parcelId)}
                            className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            {b.parcelId}
                            <span className="text-[10px] text-slate-500 font-normal">({b.khasraNo})</span>
                          </button>
                          {findParcel(b.parcelId)?.mapStatus === 'VERIFIED' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{b.village}, {b.district}</div>
                      </td>

                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-800">{b.id}</span>
                        <div className="text-[10px] text-slate-500">{b.beneficiaryName}</div>
                      </td>

                      <td className="p-3 text-right font-bold text-slate-900">
                        ₹{(b.assessedAmount / 100000).toFixed(2)} L
                      </td>

                      <td className="p-3 text-right font-semibold text-blue-700">
                        {b.approvedAmount > 0 ? `₹${(b.approvedAmount / 100000).toFixed(2)} L` : '—'}
                      </td>

                      <td className="p-3 text-right font-bold text-emerald-700">
                        {b.disbursedAmount > 0 ? `₹${(b.disbursedAmount / 100000).toFixed(2)} L` : '₹0.00'}
                      </td>

                      <td className="p-3 text-right font-bold text-amber-700">
                        {b.pendingAmount > 0 ? `₹${(b.pendingAmount / 100000).toFixed(2)} L` : '—'}
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'DELAYED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                          {b.workflowStep}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() => setActiveBeneficiaryForWorkflow(b)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 mx-auto"
                        >
                          Advance Workflow →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: R&R DASHBOARD                                                  */}
      {/* ========================================================================= */}
      {activeSection === 'RR' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* R&R KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Affected Families</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{rrKpis.affectedFamilies}</div>
              <div className="text-[10px] text-slate-500">Total Project Affected (PAF)</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-[11px] font-bold text-purple-700 uppercase">Displaced Families</div>
              <div className="text-2xl font-black text-purple-800 mt-1">{rrKpis.displacedFamilies}</div>
              <div className="text-[10px] text-purple-600">Physical homestead required</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-[11px] font-bold text-blue-700 uppercase">R&R Eligible</div>
              <div className="text-2xl font-black text-blue-800 mt-1">{rrKpis.rrEligible}</div>
              <div className="text-[10px] text-blue-600">Schedule II & III entitlement</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-[11px] font-bold text-emerald-700 uppercase">R&R Completed</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{rrKpis.rrCompleted}</div>
              <div className="text-[10px] text-emerald-600">Plots & grants fulfilled</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div className="text-[11px] font-bold text-amber-700 uppercase">R&R Pending</div>
              <div className="text-2xl font-black text-amber-700 mt-1">{rrKpis.rrPending}</div>
              <div className="text-[10px] text-amber-600">In verification or allotment</div>
            </div>
          </div>

          {/* R&R Progress Bar Meter */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp size={15} className="text-emerald-600" />
                Overall Corridor R&R Completion Progress:
              </div>
              <span className="font-extrabold text-sm text-emerald-700">{rrKpis.progressPercentage}% Completed</span>
            </div>

            <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden p-0.5 flex">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold shadow-xs"
                style={{ width: `${rrKpis.progressPercentage}%` }}
              >
                {rrKpis.progressPercentage}%
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>{rrKpis.rrCompleted} Completed</span>
              <span>{rrKpis.rrPending} Pending Allotment / Verification</span>
              <span>Total Eligible: {rrKpis.rrEligible} Families</span>
            </div>
          </div>

          {/* Families Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Project Affected Families (PAF) Register
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredFamilies.length} synthetic family records under RFCTLARR Act 2013 Schedules II & III
                </p>
              </div>

              {/* Table Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
                  <Search size={13} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search PAF ID or Head..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-slate-900 font-medium outline-none w-36 sm:w-48 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="p-3">Family Demo ID</th>
                    <th className="p-3">Parcel</th>
                    <th className="p-3 text-center">Affected</th>
                    <th className="p-3 text-center">Displaced</th>
                    <th className="p-3 text-center">R&R Status</th>
                    <th className="p-3 text-center">Verification</th>
                    <th className="p-3">Pending Action</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredFamilies.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-800">{f.id}</span>
                        <div className="text-[10px] text-slate-500 font-semibold">{f.headOfFamily}</div>
                        <div className="text-[10px] text-slate-400">{f.affectedPersonsCount} Family Members</div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleOpenParcelTwinById(f.parcelId)}
                            className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            {f.parcelId}
                            <span className="text-[10px] text-slate-500 font-normal">({f.khasraNo})</span>
                          </button>
                          {findParcel(f.parcelId)?.mapStatus === 'VERIFIED' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">{f.village}, {f.district}</div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          YES ({f.affectedPersonsCount})
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.isDisplaced ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {f.isDisplaced ? 'DISPLACED' : 'LAND ONLY'}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.rrStatus === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.rrStatus === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.rrStatus}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.verification === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.verification === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.verification}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="text-slate-800 font-semibold max-w-xs">{f.pendingAction}</div>
                        {f.homesteadPlotNo && (
                          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            ✓ {f.homesteadPlotNo}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex flex-col gap-1 items-center">
                          {f.isDisplaced && !f.homesteadPlotAllotted && (
                            <button
                              onClick={() => handleAllotPlot(f)}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold shadow-xs whitespace-nowrap"
                            >
                              Allot Homestead
                            </button>
                          )}
                          {f.subsistencePaidMonths < 12 && (
                            <button
                              onClick={() => handleDisburseSubsistence(f)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-xs whitespace-nowrap"
                            >
                              Pay Subsistence
                            </button>
                          )}
                          {f.verification === 'PENDING_HEARING' && (
                            <button
                              onClick={() => handleVerifyClaim(f)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold shadow-xs whitespace-nowrap"
                            >
                              Certify Claim
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: PROJECT-WISE AND DISTRICT-WISE R&R ANALYTICS                   */}
      {/* ========================================================================= */}
      {activeSection === 'ANALYTICS' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Toggle between District-wise and Project-wise */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="text-xs font-bold text-slate-800">
              Comparative Statutory Analytics View:
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setAnalyticsMode('DISTRICT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  analyticsMode === 'DISTRICT'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                District-Wise Analysis
              </button>
              <button
                onClick={() => setAnalyticsMode('PROJECT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  analyticsMode === 'PROJECT'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Project-Wise Analysis
              </button>
            </div>
          </div>

          {/* District Breakdown Mode */}
          {analyticsMode === 'DISTRICT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {districtAnalytics.map((d) => (
                  <div key={d.district} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        <MapPin size={15} className="text-amber-500" />
                        {d.district} District
                      </h4>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {d.progressPercentage}%
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Affected Families:</span>
                        <strong className="text-slate-900">{d.totalAffectedFamilies}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Displaced Families:</span>
                        <strong className="text-purple-700">{d.totalDisplacedFamilies}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Homestead Allotted:</span>
                        <strong className="text-emerald-700">{d.homesteadAllotted} / {d.totalDisplacedFamilies}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Subsistence Disbursed:</span>
                        <strong className="text-slate-900">₹{(d.subsistenceDisbursedInr / 10000000).toFixed(2)} Cr</strong>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${d.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resettlement Colonies Infrastructure Status */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={16} className="text-indigo-600" />
                  Model Resettlement Colonies Development Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900">Kanhauli Model R&R Colony (Site A)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">85% Ready</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Capacity: 120 Plots (50 Sq.m each) &bull; Internal concrete roads, electricity feeders, and community hall completed. Water overhead tank under testing.
                    </p>
                    <div className="text-[11px] font-semibold text-emerald-700">
                      Allotted: 48 Plots &bull; Available: 72 Plots
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900">Bihta Urban Extension R&R Center (Site B)</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">62% Ready</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Capacity: 90 Plots &bull; Land leveling and boundary perimeter wall completed. Power transformer installation in progress by NBPDCL.
                    </p>
                    <div className="text-[11px] font-semibold text-blue-700">
                      Allotted: 24 Plots &bull; Available: 66 Plots
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Breakdown Mode */}
          {analyticsMode === 'PROJECT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projectAnalytics.map((p) => (
                  <div key={p.projectId} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">{p.projectName}</h4>
                      <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {p.progressPercentage}%
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Affected Families:</span>
                        <strong className="text-slate-900">{p.totalAffectedFamilies}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Displaced Families:</span>
                        <strong className="text-purple-700">{p.totalDisplacedFamilies}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Compensation Disbursed:</span>
                        <strong className="text-emerald-700">₹{(p.totalCompensationDisbursed / 10000000).toFixed(2)} Cr</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Assessed Total:</span>
                        <strong className="text-slate-900">₹{(p.totalCompensationAssessed / 10000000).toFixed(2)} Cr</strong>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${p.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION D: STATUTORY ALERTS COCKPIT                                       */}
      {/* ========================================================================= */}
      {activeSection === 'ALERTS' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Alerts Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              {[
                { id: 'ALL', label: 'All Alerts' },
                { id: 'COMPENSATION_PENDING', label: 'Compensation Pending' },
                { id: 'COMPENSATION_DELAYED', label: 'Compensation Delayed' },
                { id: 'RR_PENDING', label: 'R&R Pending' },
                { id: 'VERIFICATION_PENDING', label: 'Verification Pending' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAlertTypeFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    alertTypeFilter === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-semibold px-2">
              Showing {filteredAlerts.length} actionable alerts linked to corridor plots
            </div>
          </div>

          {/* Alert Cards List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-5 rounded-2xl border shadow-xs transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.severity === 'CRITICAL' 
                    ? 'border-l-4 border-l-rose-500 border-slate-200' 
                    : alert.severity === 'HIGH' 
                      ? 'border-l-4 border-l-amber-500 border-slate-200' 
                      : 'border-l-4 border-l-blue-500 border-slate-200'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      alert.severity === 'CRITICAL' 
                        ? 'bg-rose-100 text-rose-800' 
                        : alert.severity === 'HIGH' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{alert.timestamp}</span>
                    <span className="text-[11px] text-slate-500 font-bold">&bull; {alert.district} District</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-slate-600 max-w-2xl">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="text-slate-500 font-semibold">Corridor: {alert.projectName}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-bold text-slate-800">Plot: Khasra {alert.khasraNo} ({alert.parcelId})</span>
                  </div>
                </div>

                {/* Direct Parcel & Project Action Links */}
                <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenParcelTwinById(alert.parcelId)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink size={13} />
                    Open Parcel Digital Twin
                  </button>

                  <button
                    onClick={() => handleNavigateToMapById(alert.parcelId)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin size={13} />
                    Locate on GIS Map
                  </button>

                  {alert.type.includes('COMPENSATION') && (
                    <button
                      onClick={() => {
                        const b = beneficiaries.find(x => x.parcelId === alert.parcelId);
                        if (b) setActiveBeneficiaryForWorkflow(b);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <ArrowUpRight size={13} />
                      {alert.suggestedAction}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
                <div className="font-bold text-slate-900 text-sm">All Statutory Matters Clear</div>
                <p className="text-xs text-slate-500">No pending alerts under the selected filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4-Step Compensation Workflow Modal */}
      {activeBeneficiaryForWorkflow && (
        <CompensationWorkflowModal
          beneficiary={activeBeneficiaryForWorkflow}
          onClose={() => setActiveBeneficiaryForWorkflow(null)}
          onUpdated={() => setRefreshTick(t => t + 1)}
          onOpenDigitalTwin={(parcelId) => handleOpenParcelTwinById(parcelId)}
        />
      )}

    </div>
  );
};
