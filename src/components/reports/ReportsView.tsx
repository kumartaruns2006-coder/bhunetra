import React, { useState, useMemo } from 'react';
import { ProjectCorridor } from '../../types/project';
import { Parcel } from '../../types/parcel';
import {
  ReportType,
  ReportFilterState,
  MonthlyTrendRecord,
  ComparativeEntity
} from '../../types/reports';
import { reportsService, REPORT_TYPE_CONFIGS } from '../../services/reportsService';
import {
  FileSpreadsheet,
  Download,
  Printer,
  BarChart3,
  TrendingUp,
  Scale,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Building,
  MapPin,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface ReportsViewProps {
  project?: ProjectCorridor;
  parcels: Parcel[];
  onSelectParcel?: (parcel: Parcel) => void;
  onSelectProject?: (projectId: string) => void;
  onNavigateToMap?: (parcel: Parcel) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  project,
  parcels,
  onSelectParcel: _onSelectParcel,
  onSelectProject: _onSelectProject,
  onNavigateToMap: _onNavigateToMap
}) => {
  // Main Tab State
  const [activeTab, setActiveTab] = useState<'BUILDER' | 'TRENDS' | 'COMPARATIVE'>('BUILDER');

  // SECTION 1: Filter States (8 Filters)
  const [filters, setFilters] = useState<ReportFilterState>({
    state: 'All States',
    district: 'All Districts',
    project: 'All Projects',
    department: 'All Departments',
    stage: 'All Stages',
    status: 'All Statuses',
    risk: 'All Risks',
    dateRange: 'Current FY (2025-26)'
  });

  // Selected Report Type (13 Report Types)
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('ACQUISITION_PROGRESS');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedTime, setLastGeneratedTime] = useState<string>(new Date().toLocaleTimeString());

  // SECTION 2: Trend Analytics metric filter
  const [trendMetric, setTrendMetric] = useState<
    'all' | 'landAcquiredAcres' | 'compensationDisbursedCr' | 'rrCompletedFamilies' | 'possessionCompletedAcres' | 'projectsCompleted'
  >('all');

  // SECTION 3: Comparative Analytics selections
  const [compCategory, setCompCategory] = useState<'STATE' | 'DISTRICT' | 'PROJECT'>('STATE');
  const comparativeEntities = useMemo(() => reportsService.getComparativeEntities(compCategory), [compCategory]);
  const [entityAId, setEntityAId] = useState<string>(comparativeEntities[0]?.id || 'BR');
  const [entityBId, setEntityBId] = useState<string>(comparativeEntities[1]?.id || 'UP');

  // Keep entity selection updated when category changes
  const entityA = useMemo(() => comparativeEntities.find(e => e.id === entityAId) || comparativeEntities[0], [comparativeEntities, entityAId]);
  const entityB = useMemo(() => comparativeEntities.find(e => e.id === entityBId) || comparativeEntities[1] || comparativeEntities[0], [comparativeEntities, entityBId]);
  const comparisonResults = useMemo(() => {
    if (!entityA || !entityB) return [];
    return reportsService.compareEntities(entityA, entityB);
  }, [entityA, entityB]);

  // Generate Report Data based on active filters and report type
  const { rows, summary } = useMemo(() => {
    return reportsService.generateReportData(selectedReportType, filters, project, parcels);
  }, [selectedReportType, filters, project, parcels]);

  // Monthly trends data
  const monthlyTrends = useMemo(() => reportsService.getMonthlyTrends(), []);

  // Handler for "Generate Report" button
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setLastGeneratedTime(new Date().toLocaleTimeString());
    }, 400);
  };

  // Handler for "Export CSV" button
  const handleExportCsv = () => {
    const config = REPORT_TYPE_CONFIGS[selectedReportType];
    const headers = [
      'Record ID',
      'Corridor Code',
      'Corridor Name',
      'State',
      'District',
      'Department',
      'Stage',
      'Status',
      'Risk Rating',
      config.columns[0] || 'Metric 1',
      config.columns[1] || 'Metric 2',
      config.columns[2] || 'Metric 3',
      config.columns[3] || 'Metric 4',
      config.columns[4] || 'Metric 5',
      'Reference Date',
      'Remarks'
    ];

    const dataRows = rows.map(r => [
      r.id,
      r.projectCode,
      r.projectName,
      r.state,
      r.district,
      r.department,
      r.stage,
      r.status,
      r.risk,
      r.col1Value,
      r.col2Value,
      r.col3Value,
      r.col4Value,
      r.col5Value,
      r.dateRef,
      r.remarks || ''
    ]);

    reportsService.exportToCsv(`BhuNetra_${selectedReportType}`, headers, dataRows);
  };

  // Handler for Print
  const handlePrint = () => {
    window.print();
  };

  // List of all 13 report types categorized
  const allReportTypes = Object.values(REPORT_TYPE_CONFIGS);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto print:p-0 print:m-0">
      {/* Institutional Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 print:border-none print:shadow-none">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <FileSpreadsheet size={16} className="text-amber-600" />
            NATIONAL LAND ACQUISITION MIS & STATUTORY REPORTING SYSTEM
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reports, MIS & Comparative Intelligence
          </h1>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
            <span>Conforming to <strong>RFCTLARR Act 2013</strong> &bull; <strong>NH Act 1956</strong></span>
            <span className="text-slate-300">|</span>
            <span>Active Corridor: <strong className="text-slate-900">{project?.name || 'Patna Ring Road Expansion (Phase II)'}</strong></span>
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap print:hidden">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer size={14} className="text-slate-600" />}
            onClick={handlePrint}
            className="border-slate-300 hover:bg-slate-50"
          >
            Print MIS Report
          </Button>
          <Button
            variant="gov-navy"
            size="sm"
            leftIcon={<Download size={14} className="text-amber-400" />}
            onClick={handleExportCsv}
            className="shadow-sm"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Navigation Tabs (Sections 1, 2, 3) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('BUILDER')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'BUILDER'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Filter size={14} />
          SECTION 1: Statutory Report Builder
          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-200 font-semibold">
            13 Types
          </span>
        </button>

        <button
          onClick={() => setActiveTab('TRENDS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'TRENDS'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <TrendingUp size={14} />
          SECTION 2: Monthly Trend Analytics
          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-400/20 text-emerald-200 font-semibold">
            12 Months
          </span>
        </button>

        <button
          onClick={() => setActiveTab('COMPARATIVE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'COMPARATIVE'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Scale size={14} />
          SECTION 3: Comparative Benchmarking
          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-indigo-400/20 text-indigo-200 font-semibold">
            State / District / Project
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: REPORT BUILDER                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'BUILDER' && (
        <div className="space-y-6">
          {/* 1.1 Filter Bar (8 Filters) */}
          <Card className="border-slate-200 shadow-sm print:hidden">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={15} className="text-gov-navy" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Statutory Filters (8 Parameters)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    Last Generated: <strong>{lastGeneratedTime}</strong>
                  </span>
                  <button
                    onClick={() => setFilters({
                      state: 'All States',
                      district: 'All Districts',
                      project: 'All Projects',
                      department: 'All Departments',
                      stage: 'All Stages',
                      status: 'All Statuses',
                      risk: 'All Risks',
                      dateRange: 'Current FY (2025-26)'
                    })}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {/* 1. State */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">State</label>
                  <select
                    value={filters.state}
                    onChange={e => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="All States">All States</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </div>

                {/* 2. District */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">District</label>
                  <select
                    value={filters.district}
                    onChange={e => setFilters(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="All Districts">All Districts</option>
                    <option value="Patna">Patna</option>
                    <option value="Jehanabad">Jehanabad</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Chandauli">Chandauli</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Puri">Puri</option>
                  </select>
                </div>

                {/* 3. Project */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Project</label>
                  <select
                    value={filters.project}
                    onChange={e => setFilters(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="All Projects">All Projects</option>
                    <option value="Patna Ring Road">Patna Ring Road</option>
                    <option value="Amas-Darbhanga">Amas-Darbhanga</option>
                    <option value="Ganga Expressway">Ganga Expressway</option>
                    <option value="Varanasi-Ranchi">Varanasi-Ranchi</option>
                    <option value="Samruddhi Mahamarg">Samruddhi Mahamarg</option>
                    <option value="Delhi-Mumbai">Delhi-Mumbai</option>
                  </select>
                </div>

                {/* 4. Department */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={e => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="All Departments">All Depts</option>
                    <option value="MoRTH / NHAI">MoRTH / NHAI</option>
                    <option value="Railways / DFCCIL">Railways / DFCCIL</option>
                    <option value="State Highway">State Highway</option>
                  </select>
                </div>

                {/* 5. Stage */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Stage</label>
                  <select
                    value={filters.stage}
                    onChange={e => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="All Stages">All Stages</option>
                    <option value="Section 3A">Section 3A</option>
                    <option value="Section 3C">Section 3C</option>
                    <option value="Section 3D">Section 3D</option>
                    <option value="Section 3G">Section 3G</option>
                    <option value="Section 3H">Section 3H</option>
                    <option value="Section 3E">Section 3E</option>
                  </select>
                </div>

                {/* 6. Status */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="ON_TRACK">On Track</option>
                    <option value="POSSESSION_IN_PROGRESS">Possession Active</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="CRITICAL_HOLD">Critical Hold</option>
                  </select>
                </div>

                {/* 7. Risk */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Risk</label>
                  <select
                    value={filters.risk}
                    onChange={e => setFilters(prev => ({ ...prev, risk: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="All Risks">All Risks</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                {/* 8. Date Range */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={e => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  >
                    <option value="Current FY (2025-26)">Current FY (2025-26)</option>
                    <option value="Previous FY (2024-25)">Previous FY (2024-25)</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Last Quarter (Q3)">Last Quarter (Q3)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Generate Report, Export CSV, Print */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Showing filtered parameters for <strong>{filters.state}</strong> &bull; <strong>{filters.district}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="gov-navy"
                    size="sm"
                    leftIcon={<RefreshCw size={13} className={isGenerating ? 'animate-spin text-amber-300' : 'text-amber-300'} />}
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="px-4 shadow-sm"
                  >
                    {isGenerating ? 'Querying Registry...' : 'Generate Report'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download size={13} className="text-emerald-700" />}
                    onClick={handleExportCsv}
                    className="border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800"
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Printer size={13} className="text-slate-700" />}
                    onClick={handlePrint}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    Print
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1.2 Report Type Selector (13 Statutory Report Types) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm print:hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} className="text-gov-navy" />
                Select Statutory Report Type (13 Standards)
              </span>
              <span className="text-[11px] text-slate-500">
                Active: <strong className="text-slate-900">{REPORT_TYPE_CONFIGS[selectedReportType].title}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {allReportTypes.map(rt => {
                const isSelected = selectedReportType === rt.id;
                return (
                  <button
                    key={rt.id}
                    onClick={() => setSelectedReportType(rt.id)}
                    className={`p-2.5 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-gov-navy text-white border-gov-navy shadow-sm ring-1 ring-gov-navy'
                        : 'bg-slate-50/70 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {rt.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold leading-tight line-clamp-1">
                      {rt.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1.3 Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{summary.primaryMetricLabel}</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">{summary.primaryMetricValue}</span>
              <span className="text-[10px] text-emerald-700 font-medium">Under active tracking</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{summary.secondaryMetricLabel}</span>
              <span className="text-lg font-bold text-indigo-700 mt-1 block">{summary.secondaryMetricValue}</span>
              <span className="text-[10px] text-slate-500 font-medium">Statutory threshold met</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{summary.tertiaryMetricLabel}</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">{summary.tertiaryMetricValue}</span>
              <span className="text-[10px] text-slate-500 font-medium">Approved via Escrow DBT</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{summary.quaternaryMetricLabel}</span>
              <span className="text-lg font-bold text-amber-700 mt-1 block">{summary.quaternaryMetricValue}</span>
              <span className="text-[10px] text-amber-600 font-medium">Requires CALA conciliation</span>
            </div>
          </div>

          {/* 1.4 Active Report Ledger Table */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-3.5 px-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                    {REPORT_TYPE_CONFIGS[selectedReportType].title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                    {rows.length} Records Found
                  </span>
                </div>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  {REPORT_TYPE_CONFIGS[selectedReportType].description}
                </CardDescription>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>Filter: <strong>{filters.state}</strong> / <strong>{filters.district}</strong></span>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {rows.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <AlertTriangle className="mx-auto text-amber-500 mb-2" size={28} />
                  <p className="text-sm font-semibold text-slate-700">No records found matching the active filter criteria.</p>
                  <p className="text-xs text-slate-500 mt-1">Try selecting "All States" or resetting the risk and stage filters.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Corridor & Agency</th>
                      <th className="py-3 px-3">State & District</th>
                      <th className="py-3 px-3">Stage / Status</th>
                      <th className="py-3 px-3">{REPORT_TYPE_CONFIGS[selectedReportType].columns[0] || 'Metric 1'}</th>
                      <th className="py-3 px-3">{REPORT_TYPE_CONFIGS[selectedReportType].columns[1] || 'Metric 2'}</th>
                      <th className="py-3 px-3">{REPORT_TYPE_CONFIGS[selectedReportType].columns[2] || 'Metric 3'}</th>
                      <th className="py-3 px-3">{REPORT_TYPE_CONFIGS[selectedReportType].columns[3] || 'Metric 4'}</th>
                      <th className="py-3 px-3">{REPORT_TYPE_CONFIGS[selectedReportType].columns[4] || 'Target / Status'}</th>
                      <th className="py-3 px-3 text-right">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <div>{row.projectName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{row.projectCode} &bull; {row.department}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          <div>{row.state}</div>
                          <div className="text-[10px] text-slate-500">{row.district} {row.village ? `(${row.village})` : ''}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-block font-semibold text-[10px] text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {row.stage}
                          </span>
                          <div className="text-[10px] font-medium text-slate-500 mt-0.5">{row.status.replace(/_/g, ' ')}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{row.col1Value}</td>
                        <td className="py-3 px-3 text-slate-700">{row.col2Value}</td>
                        <td className="py-3 px-3 text-slate-700">{row.col3Value}</td>
                        <td className="py-3 px-3 font-semibold text-emerald-700">{row.col4Value}</td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{row.col5Value}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.risk === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                            row.risk === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            row.risk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {row.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: TREND ANALYTICS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'TRENDS' && (
        <div className="space-y-6">
          {/* Header & Metric Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                <TrendingUp size={15} className="text-emerald-600" />
                MONTHLY STATUTORY PROGRESS & DISBURSEMENT VELOCITY
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                12-Month Longitudinal Progression (Apr 2025 &ndash; Mar 2026)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Tracking physical acreage acquisition, PFMS compensation disbursement, and R&R family rehabilitation.
              </p>
            </div>

            {/* Metric Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setTrendMetric('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  trendMetric === 'all' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Metrics
              </button>
              <button
                onClick={() => setTrendMetric('landAcquiredAcres')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  trendMetric === 'landAcquiredAcres' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Land Acquired (Ac)
              </button>
              <button
                onClick={() => setTrendMetric('compensationDisbursedCr')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  trendMetric === 'compensationDisbursedCr' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Compensation (₹ Cr)
              </button>
              <button
                onClick={() => setTrendMetric('rrCompletedFamilies')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  trendMetric === 'rrCompletedFamilies' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                R&R Completed
              </button>
              <button
                onClick={() => setTrendMetric('possessionCompletedAcres')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  trendMetric === 'possessionCompletedAcres' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Possession (Ac)
              </button>
            </div>
          </div>

          {/* Visual Trend Chart (CSS / SVG Bar Grid) */}
          <Card className="border-slate-200 shadow-sm p-5">
            <CardHeader className="p-0 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Monthly Trajectory & Month-Over-Month (MoM) Growth Velocity
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Bars represent cumulative physical/financial clearance; badges show percentage velocity change
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-gov-navy"></span>
                  <span className="text-slate-600 font-medium">Land Acquired (Acres)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                  <span className="text-slate-600 font-medium">Compensation (₹ Cr)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-indigo-500"></span>
                  <span className="text-slate-600 font-medium">Possession (Acres)</span>
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              <div className="grid grid-cols-12 gap-2 h-64 items-end border-b border-slate-200 pb-2">
                {monthlyTrends.map(m => {
                  const maxLand = 6000;
                  const landHeight = Math.round((m.landAcquiredAcres / maxLand) * 100);
                  const compHeight = Math.round((m.compensationDisbursedCr / 150) * 100);
                  const possHeight = Math.round((m.possessionCompletedAcres / maxLand) * 100);

                  return (
                    <div key={m.month} className="flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-20 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg z-20 pointer-events-none whitespace-nowrap">
                        <strong className="text-amber-400 font-bold">{m.month}</strong>
                        <span>Land: {m.landAcquiredAcres} Ac</span>
                        <span>Comp: ₹{m.compensationDisbursedCr} Cr</span>
                        <span>R&R: {m.rrCompletedFamilies} PAF</span>
                        <span>Possession: {m.possessionCompletedAcres} Ac</span>
                      </div>

                      {/* Stacked / Grouped Bars */}
                      <div className="w-full flex items-end justify-center gap-1 h-48">
                        {(trendMetric === 'all' || trendMetric === 'landAcquiredAcres') && (
                          <div
                            style={{ height: `${landHeight}%` }}
                            className="w-2.5 bg-gov-navy hover:bg-gov-navy-light rounded-t transition-all"
                            title={`Land: ${m.landAcquiredAcres} Ac`}
                          ></div>
                        )}
                        {(trendMetric === 'all' || trendMetric === 'compensationDisbursedCr') && (
                          <div
                            style={{ height: `${compHeight}%` }}
                            className="w-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all"
                            title={`Compensation: ₹${m.compensationDisbursedCr} Cr`}
                          ></div>
                        )}
                        {(trendMetric === 'all' || trendMetric === 'possessionCompletedAcres') && (
                          <div
                            style={{ height: `${possHeight}%` }}
                            className="w-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-t transition-all"
                            title={`Possession: ${m.possessionCompletedAcres} Ac`}
                          ></div>
                        )}
                      </div>

                      {/* Month Label */}
                      <span className="text-[10px] font-semibold text-slate-600 mt-2">{m.shortMonth}</span>
                      <span className={`text-[9px] font-bold ${
                        m.velocityPercentMoM >= 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {m.velocityPercentMoM >= 0 ? `+${m.velocityPercentMoM}%` : `${m.velocityPercentMoM}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tabular Monthly Ledger */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/70">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Monthly Breakdown Ledger (The 5 Required Metrics)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-3">Projects Completed</th>
                    <th className="py-3 px-3">Land Acquired (Acres)</th>
                    <th className="py-3 px-3">Compensation Disbursed (₹ Cr)</th>
                    <th className="py-3 px-3">R&R Completed (Families)</th>
                    <th className="py-3 px-3">Possession Completed (Acres)</th>
                    <th className="py-3 px-4 text-right">MoM Velocity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyTrends.map(row => (
                    <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.month}</td>
                      <td className="py-3 px-3 text-slate-700 font-semibold">{row.projectsCompleted} Projects</td>
                      <td className="py-3 px-3 font-semibold text-gov-navy">{row.landAcquiredAcres.toLocaleString()} Ac</td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">₹{row.compensationDisbursedCr.toFixed(1)} Cr</td>
                      <td className="py-3 px-3 text-slate-700">{row.rrCompletedFamilies.toLocaleString()} Families</td>
                      <td className="py-3 px-3 font-semibold text-indigo-700">{row.possessionCompletedAcres.toLocaleString()} Ac</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          row.velocityPercentMoM >= 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {row.velocityPercentMoM >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {row.velocityPercentMoM >= 0 ? `+${row.velocityPercentMoM}%` : `${row.velocityPercentMoM}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: COMPARATIVE ANALYTICS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'COMPARATIVE' && (
        <div className="space-y-6">
          {/* Header & Category Mode */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                <Scale size={15} className="text-indigo-600" />
                STATUTORY BENCHMARKING & VARIANCE ANALYSIS
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Comparative Analytics Engine
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Side-by-side performance audit across states, revenue districts, and corridor projects.
              </p>
            </div>

            {/* Category Mode Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setCompCategory('STATE');
                  const entities = reportsService.getComparativeEntities('STATE');
                  setEntityAId(entities[0].id);
                  setEntityBId(entities[1].id);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  compCategory === 'STATE' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                State vs State
              </button>
              <button
                onClick={() => {
                  setCompCategory('DISTRICT');
                  const entities = reportsService.getComparativeEntities('DISTRICT');
                  setEntityAId(entities[0].id);
                  setEntityBId(entities[1].id);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  compCategory === 'DISTRICT' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                District vs District
              </button>
              <button
                onClick={() => {
                  setCompCategory('PROJECT');
                  const entities = reportsService.getComparativeEntities('PROJECT');
                  setEntityAId(entities[0].id);
                  setEntityBId(entities[1].id);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  compCategory === 'PROJECT' ? 'bg-gov-navy text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Project vs Project
              </button>
            </div>
          </div>

          {/* Entity A vs Entity B Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entity A Card */}
            <div className="bg-white rounded-xl border-2 border-gov-navy/40 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gov-navy uppercase tracking-wider px-2 py-0.5 rounded bg-gov-navy/10">
                  Entity A (Benchmark)
                </span>
                <span className="text-xs text-slate-500 font-medium">{entityA?.tag}</span>
              </div>
              <div className="mt-1">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select First {compCategory}:</label>
                <select
                  value={entityAId}
                  onChange={e => setEntityAId(e.target.value)}
                  className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                >
                  {comparativeEntities.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.tag})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Entity B Card */}
            <div className="bg-white rounded-xl border-2 border-indigo-300 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50">
                  Entity B (Comparison Target)
                </span>
                <span className="text-xs text-slate-500 font-medium">{entityB?.tag}</span>
              </div>
              <div className="mt-1">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Second {compCategory}:</label>
                <select
                  value={entityBId}
                  onChange={e => setEntityBId(e.target.value)}
                  className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {comparativeEntities.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.tag})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Differential Comparison Matrix */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-3.5 px-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{entityA?.name}</span>
                  <span className="text-slate-400 font-normal">vs</span>
                  <span>{entityB?.name}</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Differential variance calculated as (Entity A &minus; Entity B). Positive values favor Entity A.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Metric Dimension</th>
                    <th className="py-3 px-4 text-gov-navy font-extrabold">{entityA?.name}</th>
                    <th className="py-3 px-4 text-indigo-700 font-extrabold">{entityB?.name}</th>
                    <th className="py-3 px-4">Differential Gap</th>
                    <th className="py-3 px-4 text-right">Performance Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonResults.map(m => (
                    <tr key={m.label} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-800">{m.label}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {m.valA.toLocaleString()} {m.unit}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {m.valB.toLocaleString()} {m.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          m.diff > 0 ? 'text-emerald-700' : m.diff < 0 ? 'text-red-600' : 'text-slate-500'
                        }`}>
                          {m.diff > 0 ? `+${m.diff}` : m.diff} {m.unit} ({m.diffPercent > 0 ? `+${m.diffPercent}%` : `${m.diffPercent}%`})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {m.leader === 'A' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gov-navy text-white">
                            {entityA?.name} Leads
                          </span>
                        ) : m.leader === 'B' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {entityB?.name} Leads
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            Parity
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
