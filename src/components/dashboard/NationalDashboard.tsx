import React, { useState, useMemo } from 'react';
import { 
  mockNationalKpis, 
  mockStatePerformances, 
  mockProjectProgressRecords, 
  mockHighRiskProjects, 
  mockTimelineCompliance, 
  mockRecentActivities, 
  mockAlertsSummary, 
  mockAlertCounts, 
  filterOptions 
} from '../../data/mockNationalDashboard';
import { 
  StatePerformanceRecord, 
  ProjectProgressRecord, 
  HighRiskProjectRecord, 
  ActivityItem, 
  AlertSummaryItem, 
  DashboardFilterState 
} from '../../types/nationalDashboard';
import { GeographicOverviewMap } from './GeographicOverviewMap';
import { StateDashboardModal } from './StateDashboardModal';
import { CreateProjectModal } from './CreateProjectModal';
import { PendingApprovalsDrawer } from './PendingApprovalsDrawer';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useToast } from '../ui/Toast';
import { 
  Building2, 
  MapPin, 
  Layers, 
  FileCheck, 
  Award, 
  IndianRupee, 
  CheckCircle2, 
  Users, 
  Home, 
  ShieldAlert, 
  TrendingUp, 
  Compass, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle, 
  ChevronRight, 
  ExternalLink, 
  RefreshCw, 
  FileSpreadsheet, 
  ShieldCheck, 
  SlidersHorizontal,
  Info,
  Calendar
} from 'lucide-react';

interface NationalDashboardProps {
  onSelectProject: (projectId: string) => void;
  onSelectParcel: (parcelId: string) => void;
  onNavigateModule: (moduleId: string) => void;
}

export const NationalDashboard: React.FC<NationalDashboardProps> = ({
  onSelectProject,
  onSelectParcel,
  onNavigateModule
}) => {
  const { showToast } = useToast();

  // Filters State
  const [filters, setFilters] = useState<DashboardFilterState>({
    state: 'All States',
    district: 'All Districts',
    project: 'All Projects',
    department: 'All Departments',
    dateRange: 'All Time (Cumulative)'
  });

  // Search & Active Tabs
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [activeAlertTab, setActiveAlertTab] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'>('ALL');
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Modals & Drawers State
  const [selectedStateForModal, setSelectedStateForModal] = useState<StatePerformanceRecord | null>(null);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isPendingApprovalsOpen, setIsPendingApprovalsOpen] = useState(false);
  const [dynamicProjects, setDynamicProjects] = useState<ProjectProgressRecord[]>(mockProjectProgressRecords);

  // Dynamic districts based on selected state
  const availableDistricts = useMemo(() => {
    return filterOptions.districtsByState[filters.state] || filterOptions.districtsByState['All States'];
  }, [filters.state]);

  // Handle State Filter Change
  const handleStateChange = (newState: string) => {
    setFilters(prev => ({
      ...prev,
      state: newState,
      district: 'All Districts' // reset district when state changes
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      state: 'All States',
      district: 'All Districts',
      project: 'All Projects',
      department: 'All Departments',
      dateRange: 'All Time (Cumulative)'
    });
    setProjectSearchQuery('');
    showToast({
      title: 'Filters Cleared',
      message: 'Restored national cumulative view across all states and sectors',
      type: 'info'
    });
  };

  // Filtered Projects List
  const filteredProjects = useMemo(() => {
    return dynamicProjects.filter(p => {
      if (filters.state !== 'All States' && p.state.toLowerCase() !== filters.state.toLowerCase()) {
        return false;
      }
      if (filters.district !== 'All Districts' && p.district.toLowerCase() !== filters.district.toLowerCase()) {
        return false;
      }
      if (filters.department !== 'All Departments' && p.department !== filters.department) {
        return false;
      }
      if (projectSearchQuery) {
        const query = projectSearchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCode = p.code.toLowerCase().includes(query);
        const matchesState = p.state.toLowerCase().includes(query);
        const matchesDistrict = p.district.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesState && !matchesDistrict) {
          return false;
        }
      }
      return true;
    });
  }, [dynamicProjects, filters, projectSearchQuery]);

  // Filtered Alerts List
  const filteredAlerts = useMemo(() => {
    if (activeAlertTab === 'ALL') return mockAlertsSummary;
    return mockAlertsSummary.filter(a => a.level === activeAlertTab);
  }, [activeAlertTab]);

  // Flash highlight helper for clickable KPI cards
  const triggerSectionHighlight = (sectionId: string, toastMessage?: string) => {
    setHighlightedSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (toastMessage) {
      showToast({
        title: 'Dashboard Drilldown',
        message: toastMessage,
        type: 'info'
      });
    }
    setTimeout(() => {
      setHighlightedSection(null);
    }, 2000);
  };

  // Action escalation handler
  const handleExecuteHighRiskAction = (record: HighRiskProjectRecord) => {
    showToast({
      title: `Statutory Action Dispatched: ${record.actionType.replace(/_/g, ' ')}`,
      message: `Directive issued for ${record.projectName}: ${record.recommendedAction}`,
      type: 'success'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER & DYNAMIC FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Title Header Ribbon */}
        <div className="bg-gradient-to-r from-gov-navy via-gov-navy-light to-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                PM GATISHAKTI &bull; NATIONAL MASTER PLAN
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-200 border border-white/20">
                LIVE CADASTRAL TELEMETRY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              National Land Acquisition Monitoring
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              End-to-End Digital Monitoring & Decision Support across 128 National Infrastructure Corridors
            </p>
          </div>

          {/* Header Quick Stats / Sync indicator */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/15 text-right hidden sm:block">
              <div className="text-[10px] text-slate-300">Central Portal Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 size={12} />
                <span>NIC Bhulekh Sync: Active</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast({
                  title: 'Telemetrics Refreshed',
                  message: 'Synchronized real-time cadastral milestones across all 28 State Portals',
                  type: 'success'
                });
              }}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors shadow-sm"
              title="Refresh National Data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Filter Controls Bar */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Filter size={14} className="text-gov-navy" />
              <span>Multi-Tier Operational Filters</span>
              {(filters.state !== 'All States' || filters.department !== 'All Departments') && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gov-navy text-white">
                  Active Filter
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-gov-navy hover:text-gov-navy-light underline flex items-center gap-1"
            >
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Filter 1: State */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={filters.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
              >
                {filterOptions.states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Filter 2: District */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                District
              </label>
              <select
                value={filters.district}
                onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
              >
                {availableDistricts.map((dst) => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Project */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Project
              </label>
              <select
                value={filters.project}
                onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
              >
                <option value="All Projects">All Projects ({mockNationalKpis.totalProjects})</option>
                {mockProjectProgressRecords.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Filter 4: Department */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
              >
                {filterOptions.departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Filter 5: Date Range */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
              >
                {filterOptions.dateRanges.map((dr) => (
                  <option key={dr} value={dr}>{dr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 12 INTERACTIVE KPI CARDS (EVERY CARD CLICKABLE) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span className="uppercase tracking-wider">National Cadastral Key Performance Indicators</span>
          <span className="text-[11px] text-gov-navy font-bold">Click any card to inspect or drill-down &rarr;</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Projects */}
          <div
            onClick={() => triggerSectionHighlight('section-projects-table', 'Filtering projects list below')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Projects</span>
              <Building2 size={16} className="text-gov-navy group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {mockNationalKpis.totalProjects}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <span className="text-emerald-700 font-bold">28 States</span>
              <span>&bull; PM GatiShakti</span>
            </div>
          </div>

          {/* Card 2: Land Proposed */}
          <div
            onClick={() => triggerSectionHighlight('section-acquisition-progress', 'Highlighting Proposed vs Acquired Land')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Land Proposed</span>
              <Layers size={16} className="text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {mockNationalKpis.landProposedAcres.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">
              Acres (21,383 Hectares)
            </div>
          </div>

          {/* Card 3: Land Acquired */}
          <div
            onClick={() => triggerSectionHighlight('section-acquisition-progress', 'Inspecting Acquired Land Acreage')}
            className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm hover:shadow-md hover:border-emerald-500 cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Land Acquired</span>
              <CheckCircle2 size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 tracking-tight">
              {mockNationalKpis.landAcquiredAcres.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-800 font-bold">
              Acres (75.0% Complete)
            </div>
          </div>

          {/* Card 4: Notifications Issued */}
          <div
            onClick={() => setIsPendingApprovalsOpen(true)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Notifications Issued</span>
              <FileCheck size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {mockNationalKpis.notificationsIssued}
            </div>
            <div className="mt-1 text-[11px] text-blue-700 font-bold">
              Sec 3A & 3D Gazette
            </div>
          </div>

          {/* Card 5: Awards Declared */}
          <div
            onClick={() => setIsPendingApprovalsOpen(true)}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Awards Declared</span>
              <Award size={16} className="text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {mockNationalKpis.awardsDeclared}
            </div>
            <div className="mt-1 text-[11px] text-amber-800 font-bold">
              Sec 3G CALA Sanctions
            </div>
          </div>

          {/* Card 6: Compensation Assessed */}
          <div
            onClick={() => triggerSectionHighlight('section-state-performance', 'Inspecting Compensation Assessed vs Disbursed')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Compensation Assessed</span>
              <IndianRupee size={16} className="text-slate-700 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              ₹{mockNationalKpis.compensationAssessedCr.toLocaleString()} <span className="text-xs font-semibold text-slate-500">Cr</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">
              Statutory Value + 100% Solatium
            </div>
          </div>

          {/* Card 7: Compensation Disbursed */}
          <div
            onClick={() => triggerSectionHighlight('section-state-performance', 'Inspecting PFMS DBT Disbursement')}
            className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Compensation Disbursed</span>
              <IndianRupee size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-700 tracking-tight">
              ₹{mockNationalKpis.compensationDisbursedCr.toLocaleString()} <span className="text-xs font-semibold text-blue-900">Cr</span>
            </div>
            <div className="mt-1 text-[11px] text-blue-800 font-bold">
              67.9% Disbursed via DBT
            </div>
          </div>

          {/* Card 8: Possession Completed */}
          <div
            onClick={() => triggerSectionHighlight('section-acquisition-progress', 'Inspecting Possession Completed acreage')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Possession Completed</span>
              <ShieldCheck size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {mockNationalKpis.possessionCompletedAcres.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">
              Acres (Sec 3E Physical Handover)
            </div>
          </div>

          {/* Card 9: Affected Families */}
          <div
            onClick={() => triggerSectionHighlight('section-state-performance', 'Reviewing R&R Affected Families')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Affected Families</span>
              <Users size={16} className="text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {mockNationalKpis.affectedFamilies.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-purple-700 font-bold">
              RFCTLARR Baseline Surveyed
            </div>
          </div>

          {/* Card 10: Displaced Families */}
          <div
            onClick={() => triggerSectionHighlight('section-state-performance', 'Reviewing Displaced Families')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Displaced Families</span>
              <Home size={16} className="text-orange-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {mockNationalKpis.displacedFamilies.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-orange-700 font-bold">
              Resettlement Entitled
            </div>
          </div>

          {/* Card 11: R&R Progress */}
          <div
            onClick={() => triggerSectionHighlight('section-state-performance', 'Inspecting R&R Progress')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-navy cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>R&R Progress</span>
              <TrendingUp size={16} className="text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-indigo-700 tracking-tight">
              {mockNationalKpis.rrProgressPercent}%
            </div>
            <div className="mt-1 text-[11px] text-slate-500 font-medium">
              Allowance & Plots Allotted
            </div>
          </div>

          {/* Card 12: High Risk Projects */}
          <div
            onClick={() => triggerSectionHighlight('section-high-risk', 'Focusing on 18 High Risk Projects')}
            className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-sm hover:shadow-md hover:border-red-500 cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>High Risk Projects</span>
              <ShieldAlert size={16} className="text-red-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-red-600 tracking-tight">
              {mockNationalKpis.highRiskProjectsCount}
            </div>
            <div className="mt-1 text-[11px] text-red-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              <span>Requires Executive Intervention</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION 9: QUICK ACTIONS BAR (Moved prominently to top-middle for operational workflow) */}
      <div className="bg-gradient-to-r from-gov-navy-dark via-gov-navy to-gov-navy-light text-white rounded-2xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Operational Command
            </span>
            <span className="text-xs text-slate-300">&bull; Instant Actions</span>
          </div>
          <span className="text-[11px] text-slate-300">Logged Officer Actions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Action 1: Create Project */}
          <button
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <PlusCircle size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Create Project</div>
              <div className="text-[10px] text-slate-300">New Alignment RoW</div>
            </div>
          </button>

          {/* Action 2: Open GIS */}
          <button
            onClick={() => onNavigateModule('gis')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Compass size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Open GIS Map</div>
              <div className="text-[10px] text-slate-300">Full Cadastral Layer</div>
            </div>
          </button>

          {/* Action 3: Pending Approvals */}
          <button
            onClick={() => setIsPendingApprovalsOpen(true)}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Pending Approvals</div>
              <div className="text-[10px] text-slate-300">3A/3D/3G Pipeline</div>
            </div>
          </button>

          {/* Action 4: Field Verification */}
          <button
            onClick={() => onNavigateModule('field_verification')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Field Verification</div>
              <div className="text-[10px] text-slate-300">Amin DGPS Inspection</div>
            </div>
          </button>

          {/* Action 5: Reports */}
          <button
            onClick={() => onNavigateModule('reports_mis')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Reports & MIS</div>
              <div className="text-[10px] text-slate-300">Statutory Dossiers</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. SECTION 1: ACQUISITION PROGRESS & SECTION 5: TIMELINE COMPLIANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Acquisition Progress (Proposed vs Acquired) */}
        <div
          id="section-acquisition-progress"
          className={`lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm transition-all duration-500 ${
            highlightedSection === 'section-acquisition-progress' ? 'ring-4 ring-emerald-400 border-emerald-500' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Section 1 &bull; Statutory Delivery Tracker
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Acquisition Progress: Proposed vs Acquired
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                75.0% Acquired
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium">
                13,220 Acres Balance
              </span>
            </div>
          </div>

          {/* Visual Progress Bar Gauge */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Land Acquired: 39,620 Acres</span>
              <span>Total Proposed: 52,840 Acres</span>
            </div>
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-600 h-full rounded-l-full transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: '75.0%' }}
              >
                75.0%
              </div>
              <div
                className="bg-slate-300 h-full transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-slate-600"
                style={{ width: '25.0%' }}
              >
                25.0%
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Possession Handover: <strong>31,240 Acres (59.1%)</strong></span>
              <span>Statutory Inquiries Underway: <strong>8,380 Acres (15.9%)</strong></span>
            </div>
          </div>

          {/* Statutory Acquisition Stages Distribution */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-500">Section 3A Intent</div>
              <div className="text-base font-bold text-slate-800 mt-1">5,200 Ac</div>
              <div className="text-[10px] text-slate-500">Gazetted Survey</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-500">Section 3C/3D Inquiries</div>
              <div className="text-base font-bold text-slate-800 mt-1">8,020 Ac</div>
              <div className="text-[10px] text-slate-500">Objections Cleared</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-500">Section 3G Valuation</div>
              <div className="text-base font-bold text-slate-800 mt-1">8,380 Ac</div>
              <div className="text-[10px] text-amber-700 font-semibold">Awards Ready</div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
              <div className="text-[10px] font-bold uppercase text-emerald-800">Section 3E Possession</div>
              <div className="text-base font-bold text-emerald-700 mt-1">31,240 Ac</div>
              <div className="text-[10px] text-emerald-800 font-semibold">RoW Transferred</div>
            </div>
          </div>
        </div>

        {/* Section 5: Timeline Compliance */}
        <div
          id="section-timeline-compliance"
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Section 5
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Timeline Compliance
              </h3>
            </div>
            <Clock size={18} className="text-gov-navy" />
          </div>

          <div className="space-y-3">
            {/* On Track */}
            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <div>
                  <div className="text-xs font-bold text-slate-900">On Track</div>
                  <div className="text-[10px] text-slate-500">SLA adherence &gt; 90%</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-emerald-700">
                  {mockTimelineCompliance.onTrackCount}
                </div>
                <div className="text-[10px] text-slate-500">57.8% of projects</div>
              </div>
            </div>

            {/* Delayed */}
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Delayed</div>
                  <div className="text-[10px] text-slate-500">Delay &lt; 90 days</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-amber-700">
                  {mockTimelineCompliance.delayedCount}
                </div>
                <div className="text-[10px] text-slate-500">28.1% of projects</div>
              </div>
            </div>

            {/* Critical */}
            <div className="bg-red-50/50 p-3 rounded-xl border border-red-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                <div>
                  <div className="text-xs font-bold text-slate-900">Critical</div>
                  <div className="text-[10px] text-slate-500">Delay &gt; 90 days / Litigated</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-red-600">
                  {mockTimelineCompliance.criticalCount}
                </div>
                <div className="text-[10px] text-slate-500">14.1% of projects</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Average National Delay:</span>
            <strong className="text-slate-800">+{mockTimelineCompliance.averageDelayDays} Days</strong>
          </div>
        </div>
      </div>

      {/* 5. SECTION 2: STATE-WISE PERFORMANCE MATRIX */}
      <div
        id="section-state-performance"
        className={`bg-white rounded-2xl p-6 border shadow-sm transition-all duration-500 space-y-4 ${
          highlightedSection === 'section-state-performance' ? 'ring-4 ring-gov-navy border-gov-navy' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Section 2 &bull; Inter-State Governance
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              State-wise Acquisition & Compensation Performance
            </h3>
            <p className="text-xs text-slate-500">
              Click any state row or card below to open its dedicated <strong className="text-gov-navy">State Operations Dashboard</strong>.
            </p>
          </div>

          <span className="text-xs font-bold text-gov-navy bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            6 States Mapped
          </span>
        </div>

        {/* State Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-center">Projects</th>
                <th className="py-3 px-4">Proposed Land</th>
                <th className="py-3 px-4">Acquired Land</th>
                <th className="py-3 px-4">Acquisition %</th>
                <th className="py-3 px-4">Compensation (Disbursed / Assessed)</th>
                <th className="py-3 px-4 text-center">R&R %</th>
                <th className="py-3 px-4 text-center">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {mockStatePerformances.map((st) => (
                <tr
                  key={st.id}
                  onClick={() => setSelectedStateForModal(st)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-gov-navy text-white text-xs font-bold flex items-center justify-center">
                        {st.code}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-gov-navy">
                          {st.state}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {st.districtsCount} Districts &bull; {st.calaCount} CALAs
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {st.projectsCount}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {st.proposedLandAcres.toLocaleString()} Ac
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                    {st.acquiredLandAcres.toLocaleString()} Ac
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>{st.acquisitionPercent}%</span>
                      </div>
                      <Progress value={st.acquisitionPercent} variant="emerald" size="sm" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-900 font-bold">
                      ₹{st.compensationDisbursedCr.toFixed(1)} Cr <span className="text-[10px] font-normal text-slate-500">/ ₹{st.compensationAssessedCr.toFixed(1)} Cr</span>
                    </div>
                    <div className="text-[10px] text-blue-700 font-medium">
                      {st.compensationPercent}% Transferred
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {st.rrProgressPercent}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant={st.riskLevel === 'CRITICAL' ? 'danger' : st.riskLevel === 'HIGH' ? 'warning' : st.riskLevel === 'MEDIUM' ? 'info' : 'success'}
                      size="sm"
                    >
                      {st.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gov-navy group-hover:underline">
                      <span>Inspect</span>
                      <ChevronRight size={14} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. SECTION 4: GEOGRAPHIC OVERVIEW (INTERACTIVE MAP) */}
      <div id="section-geographic-overview" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Section 4 &bull; Spatial GIS Intelligence
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Geographic Overview: National Alignment Corridors
            </h3>
          </div>
          <button
            onClick={() => onNavigateModule('gis')}
            className="text-xs font-bold text-gov-navy hover:text-gov-navy-light flex items-center gap-1"
          >
            <span>Open Advanced GIS Cadastral Station</span>
            <ExternalLink size={13} />
          </button>
        </div>

        <GeographicOverviewMap
          projects={filteredProjects}
          onSelectProject={onSelectProject}
          selectedStateFilter={filters.state}
        />
      </div>

      {/* 7. SECTION 3: PROJECT PROGRESS TABLE */}
      <div
        id="section-projects-table"
        className={`bg-white rounded-2xl p-6 border shadow-sm transition-all duration-500 space-y-4 ${
          highlightedSection === 'section-projects-table' ? 'ring-4 ring-gov-navy border-gov-navy' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Section 3 &bull; Corridor Progress Directory
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Project Progress & Compliance Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Click any project row to open its <strong>Project Details Dossier</strong>.
            </p>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search project, state, code..."
                value={projectSearchQuery}
                onChange={(e) => setProjectSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy w-56 text-slate-900"
              />
            </div>
            <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
              {filteredProjects.length} Projects
            </span>
          </div>
        </div>

        {/* Project Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-3">State</th>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Land (Acres)</th>
                <th className="py-3 px-3 text-center">Parcels</th>
                <th className="py-3 px-3">Acquisition %</th>
                <th className="py-3 px-3">Compensation %</th>
                <th className="py-3 px-3 text-center">R&R %</th>
                <th className="py-3 px-3 text-center">Risk</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredProjects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-gov-navy">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {p.code} &bull; {p.corridorLengthKm} km
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700">
                    {p.state}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {p.district}
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    <span className="font-bold text-emerald-700">{p.landAcquiredAcres}</span> / {p.landProposedAcres}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                    {p.parcelsCount}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="w-20 space-y-1">
                      <span className="text-[10px] font-bold text-slate-700">{p.acquisitionPercent}%</span>
                      <Progress value={p.acquisitionPercent} variant="emerald" size="sm" />
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="w-20 space-y-1">
                      <span className="text-[10px] font-bold text-blue-700">{p.compensationPercent}%</span>
                      <Progress value={p.compensationPercent} variant="blue" size="sm" />
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-indigo-700">
                    {p.rrPercent}%
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <Badge
                      variant={p.riskLevel === 'CRITICAL' ? 'danger' : p.riskLevel === 'HIGH' ? 'warning' : p.riskLevel === 'MEDIUM' ? 'info' : 'success'}
                      size="sm"
                    >
                      {p.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gov-navy group-hover:underline">
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. SECTION 6: HIGH RISK PROJECTS */}
      <div
        id="section-high-risk"
        className={`bg-white rounded-2xl p-6 border shadow-sm transition-all duration-500 space-y-4 ${
          highlightedSection === 'section-high-risk' ? 'ring-4 ring-red-400 border-red-500' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-600" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Section 6 &bull; Predictive Bottleneck Engine
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              High Risk Projects Requiring Executive Intervention (18 Total)
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized by AI Delay Probability, Title Litigations & Statutory Forest/Environmental Clearances.
            </p>
          </div>

          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold">
            18 Critical Hotspots Flagged
          </span>
        </div>

        {/* High Risk Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-red-50/50 text-[11px] font-bold text-red-900 uppercase tracking-wider border-b border-red-100">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-3 text-center">Risk Score</th>
                <th className="py-3 px-3">Predicted Delay</th>
                <th className="py-3 px-4">Statutory Bottleneck / Reason</th>
                <th className="py-3 px-4 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {mockHighRiskProjects.map((hr) => (
                <tr key={hr.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectProject(hr.projectId)}
                      className="text-left group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-gov-navy">
                        {hr.projectName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {hr.state} &bull; {hr.district} &bull; <strong className="text-red-700">{hr.affectedParcelsCount} Parcels Blocked</strong>
                      </div>
                    </button>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-black text-xs">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                      <span>{hr.riskScore}/100</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-red-600">
                    +{hr.predictedDelayDays} Days
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-md">
                    <p className="line-clamp-2 text-xs">{hr.reason}</p>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleExecuteHighRiskAction(hr)}
                      className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-light text-white rounded-lg text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Action: {hr.actionType.replace(/_/g, ' ')}</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. SECTION 7: RECENT ACTIVITY & SECTION 8: ALERTS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 7: Recent Activity Feed (Clicking Parcel -> Parcel Digital Twin) */}
        <div
          id="section-recent-activity"
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Section 7 &bull; Live Audit Trail
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Activity & Milestone Events
              </h3>
              <p className="text-xs text-slate-500">
                Click any <span className="text-gov-navy font-bold">Khasra Parcel Tag</span> below to launch its 360° Parcel Digital Twin.
              </p>
            </div>
            <ActivityIconIndicator />
          </div>

          <div className="divide-y divide-slate-100 space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {mockRecentActivities.map((act) => (
              <div key={act.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      act.severity === 'SUCCESS' ? 'bg-emerald-500' :
                      act.severity === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></span>
                    {act.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600">
                  {act.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] text-slate-500">
                    By: <strong className="text-slate-700">{act.officerName}</strong>
                  </div>

                  {/* Clickable Parcel Tag for Digital Twin */}
                  {act.parcelId && (
                    <button
                      onClick={() => onSelectParcel(act.parcelId!)}
                      className="px-2.5 py-1 bg-gov-navy/10 hover:bg-gov-navy hover:text-white text-gov-navy rounded-md text-[11px] font-bold border border-gov-navy/20 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Layers size={12} />
                      <span>Parcel Digital Twin ({act.parcelKhasra}) &rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Alerts Summary */}
        <div
          id="section-alerts-summary"
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Section 8 &bull; Risk Sentinel
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Alerts & Statutory Bottlenecks
              </h3>
            </div>
            <button
              onClick={() => onNavigateModule('alerts')}
              className="text-xs font-bold text-gov-navy hover:text-gov-navy-light flex items-center gap-1"
            >
              <span>View All Alerts</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Alert Level Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveAlertTab('ALL')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${activeAlertTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({mockAlertCounts.critical + mockAlertCounts.high + mockAlertCounts.medium + mockAlertCounts.info})
            </button>
            <button
              onClick={() => setActiveAlertTab('CRITICAL')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${activeAlertTab === 'CRITICAL' ? 'bg-red-600 text-white shadow-sm' : 'text-red-700 hover:text-red-800'}`}
            >
              Critical ({mockAlertCounts.critical})
            </button>
            <button
              onClick={() => setActiveAlertTab('HIGH')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${activeAlertTab === 'HIGH' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-700 hover:text-amber-800'}`}
            >
              High ({mockAlertCounts.high})
            </button>
            <button
              onClick={() => setActiveAlertTab('MEDIUM')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${activeAlertTab === 'MEDIUM' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-700 hover:text-blue-800'}`}
            >
              Medium ({mockAlertCounts.medium})
            </button>
          </div>

          {/* Alerts List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-3.5 rounded-xl border space-y-1.5 transition-colors ${
                  alt.level === 'CRITICAL' ? 'bg-red-50/40 border-red-200' :
                  alt.level === 'HIGH' ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={alt.level === 'CRITICAL' ? 'danger' : alt.level === 'HIGH' ? 'warning' : 'info'}
                      size="sm"
                    >
                      {alt.level}
                    </Badge>
                    <span className="font-bold text-slate-900">{alt.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{alt.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600">
                  {alt.message}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500 font-medium">
                    {alt.projectName} ({alt.state})
                  </span>
                  {alt.parcelId && (
                    <button
                      onClick={() => onSelectParcel(alt.parcelId!)}
                      className="text-gov-navy hover:underline font-bold"
                    >
                      Inspect Parcel &rarr;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL 1: State Dashboard Drilldown Modal */}
      <StateDashboardModal
        stateData={selectedStateForModal}
        onClose={() => setSelectedStateForModal(null)}
        onSelectProject={onSelectProject}
        onApplyStateFilter={handleStateChange}
      />

      {/* MODAL 2: Create Corridor Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onProjectCreated={(newPrj) => {
          setDynamicProjects(prev => [newPrj, ...prev]);
        }}
      />

      {/* DRAWER 3: Pending Approvals Pipeline */}
      <PendingApprovalsDrawer
        isOpen={isPendingApprovalsOpen}
        onClose={() => setIsPendingApprovalsOpen(false)}
        onSelectProject={onSelectProject}
      />
    </div>
  );
};

const ActivityIconIndicator = () => (
  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
    <span>Live Feed</span>
  </div>
);
