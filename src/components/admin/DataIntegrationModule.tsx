import React, { useState, useMemo, useEffect } from 'react';
import { 
  MasterDataItem, 
  MasterDataCategory, 
  ValidationResultItem, 
  ValidationSummary, 
  ApiIntegrationCard, 
  ApiIntegrationId, 
  DataSyncSummary, 
  DataConflictRecord 
} from '../../types/dataIntegration';
import { dataIntegrationService } from '../../services/dataIntegrationService';
import { Parcel } from '../../types/parcel';
import { ProjectCorridor } from '../../types/project';
import { useToast } from '../ui/Toast';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  RefreshCw, 
  Layers, 
  Server, 
  Code2, 
  Search, 
  Filter, 
  ShieldCheck, 
  ExternalLink, 
  Send, 
  Lock, 
  SlidersHorizontal, 
  FileText, 
  MapPin, 
  Compass, 
  IndianRupee, 
  Smartphone,
  ChevronRight,
  Eye,
  Check,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface DataIntegrationModuleProps {
  parcels: Parcel[];
  projects: ProjectCorridor[];
  onOpenDigitalTwin?: (parcel: Parcel) => void;
}

export const DataIntegrationModule: React.FC<DataIntegrationModuleProps> = ({
  parcels,
  projects,
  onOpenDigitalTwin
}) => {
  const { showToast } = useToast();

  // Active Sub-Section Tab (6 Sections)
  const [activeTab, setActiveTab] = useState<'MASTER_DATA' | 'VALIDATION' | 'API_CENTER' | 'SYNC' | 'CONFLICTS' | 'ARCHITECTURE'>('MASTER_DATA');

  // Master Data State & Filter
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<MasterDataCategory>('STATES');
  const [masterSearch, setMasterSearch] = useState<string>('');

  // Validation State
  const [validationReport, setValidationReport] = useState(() => 
    dataIntegrationService.validateCadastralDataset(parcels, projects)
  );
  const [validationSeverityFilter, setValidationSeverityFilter] = useState<'ALL' | 'ERROR' | 'WARNING' | 'VALID'>('ALL');

  // API Center State
  const [apiCards, setApiCards] = useState<ApiIntegrationCard[]>(dataIntegrationService.getApiIntegrations());
  const [testingApiId, setTestingApiId] = useState<ApiIntegrationId | null>(null);
  const [apiTestResult, setApiTestResult] = useState<any | null>(null);

  // Sync State
  const [syncSummary, setSyncSummary] = useState<DataSyncSummary>(dataIntegrationService.getSyncSummary());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Conflict State
  const [conflicts, setConflicts] = useState<DataConflictRecord[]>(dataIntegrationService.getDataConflicts());
  const [activeConflictForModal, setActiveConflictForModal] = useState<DataConflictRecord | null>(null);
  const [selectedSourceToResolve, setSelectedSourceToResolve] = useState<'GIS' | 'LAND_RECORD' | 'DOCUMENT' | 'MANUAL_CONCILIATION'>('GIS');
  const [resolutionRemarks, setResolutionRemarks] = useState<string>('Discrepancy reconciled following joint DGPS boundary survey by Circle Officer.');

  // Subscribe to service updates
  useEffect(() => {
    const unsub = dataIntegrationService.subscribe(() => {
      setApiCards(dataIntegrationService.getApiIntegrations());
      setSyncSummary(dataIntegrationService.getSyncSummary());
      setConflicts(dataIntegrationService.getDataConflicts());
    });
    return unsub;
  }, []);

  // Re-run validation on dataset change
  useEffect(() => {
    setValidationReport(dataIntegrationService.validateCadastralDataset(parcels, projects));
  }, [parcels, projects]);

  // Master Data Categories List
  const masterCategories: { key: MasterDataCategory; label: string }[] = [
    { key: 'STATES', label: 'State' },
    { key: 'DISTRICTS', label: 'District' },
    { key: 'VILLAGES', label: 'Village' },
    { key: 'DEPARTMENTS', label: 'Department' },
    { key: 'PROJECT_TYPES', label: 'Project Type' },
    { key: 'LAND_TYPES', label: 'Land Type' },
    { key: 'ACQUISITION_STAGES', label: 'Acquisition Stage' },
    { key: 'PARCEL_STATUSES', label: 'Status' },
    { key: 'RISK_LEVELS', label: 'Risk Level' }
  ];

  const currentMasterItems = useMemo(() => {
    const list = dataIntegrationService.getMasterData(selectedMasterCategory);
    if (!masterSearch.trim()) return list;
    return list.filter(item => 
      item.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
      item.code.toLowerCase().includes(masterSearch.toLowerCase()) ||
      item.standardizedCode.toLowerCase().includes(masterSearch.toLowerCase())
    );
  }, [selectedMasterCategory, masterSearch]);

  // Filtered Validation Issues
  const filteredValidationResults = useMemo(() => {
    if (validationSeverityFilter === 'ALL') return validationReport.results;
    return validationReport.results.filter(r => r.severity === validationSeverityFilter);
  }, [validationReport, validationSeverityFilter]);

  // Handle API Test Ping
  const handleTestApi = async (id: ApiIntegrationId) => {
    setTestingApiId(id);
    setApiTestResult(null);
    try {
      const res = await dataIntegrationService.testApiEndpoint(id);
      setApiTestResult(res);
      showToast({
        title: 'Endpoint Responded (Mock Connected)',
        message: `${res.status} in ${res.latencyMs}ms. Standard contract verified.`,
        type: 'success'
      });
    } catch (err: any) {
      showToast({
        title: 'Connection Error',
        message: err.message || 'API endpoint unreachable',
        type: 'warning'
      });
    } finally {
      setTestingApiId(null);
    }
  };

  // Handle Trigger Full Sync
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const updated = await dataIntegrationService.triggerFullSync();
      setSyncSummary(updated);
      showToast({
        title: 'National Cadastral Sync Complete',
        message: `Synchronized ${updated.recordsReceived} records (${updated.recordsUpdated} updated, ${updated.conflictsCount} conflicts detected).`,
        type: 'success'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Conflict Actions
  const handleReviewConflict = (conflict: DataConflictRecord) => {
    dataIntegrationService.reviewConflict(conflict.id);
    setActiveConflictForModal(conflict);
  };

  const handleExecuteResolve = () => {
    if (!activeConflictForModal) return;
    const resolvedValue = 
      selectedSourceToResolve === 'GIS' ? activeConflictForModal.sources.gis.value :
      selectedSourceToResolve === 'LAND_RECORD' ? activeConflictForModal.sources.landRecord.value :
      activeConflictForModal.sources.document.value;

    dataIntegrationService.resolveConflict(
      activeConflictForModal.id,
      resolvedValue,
      selectedSourceToResolve,
      resolutionRemarks,
      'Additional Collector (CALA) Patna'
    );

    setActiveConflictForModal(null);
    showToast({
      title: 'Conflict Resolved Successfully',
      message: `Adopted ${selectedSourceToResolve} value (${resolvedValue} ${activeConflictForModal.sources.gis.unit}) as authoritative.`,
      type: 'success'
    });
  };

  const handleIgnoreConflict = (conflict: DataConflictRecord) => {
    dataIntegrationService.ignoreConflict(conflict.id, 'Minor boundary rounding within survey tolerance limit (1%).');
    showToast({
      title: 'Discrepancy Ignored',
      message: 'Logged under allowable surveyor tolerance margin.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Module Title Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            PART 11 &bull; DATA STANDARDIZATION & API INTEGRATION
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Data Governance & Interoperability Center
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Standardized master dictionaries, automated cadastral validation, mock-connected statutory APIs, and multi-source conflict reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-indigo-600" />
            LGD & IRC Cadastral Standardized
          </span>
        </div>
      </div>

      {/* 6-Section Navigation Pills */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-xs gap-1.5 overflow-x-auto">
        {[
          { id: 'MASTER_DATA', label: '1. Master Data', icon: Database },
          { id: 'VALIDATION', label: '2. Data Validation', icon: CheckCircle2 },
          { id: 'API_CENTER', label: '3. API Integration Center', icon: Server },
          { id: 'SYNC', label: '4. Data Synchronization', icon: RefreshCw },
          { id: 'CONFLICTS', label: '5. Data Conflicts', icon: AlertOctagon },
          { id: 'ARCHITECTURE', label: '6. API Architecture', icon: Code2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[170px] py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MASTER DATA                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'MASTER_DATA' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">National & State Cadastral Master Dictionaries</h3>
            <p className="text-xs text-slate-500">Standardized classification codes matching Local Government Directory (LGD) and MoRTH taxonomies</p>
          </div>

          {/* Master Category Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
            {masterCategories.map((c) => (
              <button
                key={c.key}
                onClick={() => { setSelectedMasterCategory(c.key); setMasterSearch(''); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMasterCategory === c.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs w-full sm:w-80">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${masterCategories.find(c => c.key === selectedMasterCategory)?.label}...`}
                value={masterSearch}
                onChange={(e) => setMasterSearch(e.target.value)}
                className="bg-transparent text-slate-900 font-medium outline-none w-full placeholder:text-slate-400"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Showing {currentMasterItems.length} standardized records
            </div>
          </div>

          {/* Master Data Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="p-3">Standard Code</th>
                  <th className="p-3">Name / Label</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Standard Classification</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {currentMasterItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {item.code}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="p-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-indigo-700 font-semibold">
                      {item.standardizedCode}
                    </td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">
                      {item.description || 'Standardized entry'}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: DATA VALIDATION                                                */}
      {/* ========================================================================= */}
      {activeTab === 'VALIDATION' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Summary KPIs: VALID, WARNING, ERROR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Compliance Index</div>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {validationReport.summary.compliancePercentage}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Overall data integrity</div>
            </div>

            <button
              onClick={() => setValidationSeverityFilter('VALID')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                validationSeverityFilter === 'VALID' ? 'ring-2 ring-emerald-600 bg-white' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-emerald-700 uppercase flex items-center justify-between">
                <span>VALID</span>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {validationReport.summary.validCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Parcels fully compliant</div>
            </button>

            <button
              onClick={() => setValidationSeverityFilter('WARNING')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                validationSeverityFilter === 'WARNING' ? 'ring-2 ring-amber-600 bg-white' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-amber-700 uppercase flex items-center justify-between">
                <span>WARNING</span>
                <AlertTriangle size={16} className="text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-700 mt-1">
                {validationReport.summary.warningCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Non-blocking warnings</div>
            </button>

            <button
              onClick={() => setValidationSeverityFilter('ERROR')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                validationSeverityFilter === 'ERROR' ? 'ring-2 ring-rose-600 bg-white' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-rose-700 uppercase flex items-center justify-between">
                <span>ERROR</span>
                <AlertOctagon size={16} className="text-rose-600" />
              </div>
              <div className="text-3xl font-black text-rose-700 mt-1">
                {validationReport.summary.errorCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Blocking validation errors</div>
            </button>
          </div>

          {/* 8 Rules Checklist Matrix */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Statutory Cadastral Validation Rules Enforced:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { name: 'Required fields', desc: 'Mandatory jurisdiction & Khasra' },
                { name: 'Invalid area', desc: 'Zero/negative area or overflow' },
                { name: 'Duplicate parcel ID', desc: 'Unique cadastral key guarantee' },
                { name: 'Duplicate project ID', desc: 'Central corridor code uniqueness' },
                { name: 'Invalid status', desc: 'RFCTLARR standard stage check' },
                { name: 'Missing project linkage', desc: 'Corridor integrity check' },
                { name: 'Missing coordinates', desc: 'Valid polygon boundary & centroid' },
                { name: 'Invalid document linkage', desc: 'Statutory Gazette & RoR files' }
              ].map((rule, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {rule.name}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Issues Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Cadastral Validation Log & Remediation Actions
                </h4>
                <p className="text-xs text-slate-500">
                  Showing {filteredValidationResults.length} itemized validation checks across corridor plots
                </p>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs">
                {['ALL', 'ERROR', 'WARNING'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setValidationSeverityFilter(sev as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      validationSeverityFilter === sev
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredValidationResults.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.severity === 'ERROR'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        item.severity === 'ERROR' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                      }`}>
                        {item.severity}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{item.ruleName}</span>
                      <span className="text-[11px] text-slate-500">&bull; {item.entityLabel} ({item.entityId})</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">{item.message}</p>
                    {item.suggestedFix && (
                      <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                        <Sparkles size={12} className="text-emerald-600" />
                        <span>Suggested Fix: {item.suggestedFix}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const p = parcels.find(x => x.id === item.entityId);
                        if (p && onOpenDigitalTwin) onOpenDigitalTwin(p);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 shadow-xs transition-colors flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Inspect Parcel
                    </button>
                  </div>
                </div>
              ))}

              {filteredValidationResults.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                  No validation issues found for the selected filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: API INTEGRATION CENTER                                         */}
      {/* ========================================================================= */}
      {activeTab === 'API_CENTER' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
            <Lock size={16} className="text-amber-700 mt-0.5 shrink-0" />
            <div>
              <strong className="font-bold block text-amber-950">Statutory API Sandbox Disclaimer:</strong>
              All government connectors below are marked <strong>MOCK CONNECTED</strong> for evaluation and prototype testing. They adhere strictly to national data schema specifications (LGD, IRC, PFMS, MeitY DLT). No live government production connectivity is claimed.
            </div>
          </div>

          {/* 6 API Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiCards.map((card) => (
              <div key={card.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      MOCK CONNECTED
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{card.protocol}</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {card.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{card.department}</p>
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-700 break-all">
                    {card.endpoint}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="grid grid-cols-3 gap-1 text-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Last Sync</div>
                      <div className="font-bold text-slate-800 text-[11px] mt-0.5">{card.lastSync}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Synced</div>
                      <div className="font-bold text-emerald-700 text-[11px] mt-0.5">{card.recordsSynced}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Errors</div>
                      <div className="font-bold text-slate-600 text-[11px] mt-0.5">{card.errorCount}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestApi(card.id)}
                    disabled={testingApiId === card.id}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send size={12} />
                    {testingApiId === card.id ? 'Pinging Endpoint...' : 'Test Connection Ping'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Test Ping Output Drawer */}
          {apiTestResult && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Mock API Response Payload Received
                </span>
                <span className="font-mono text-slate-400 text-[10px]">
                  Latency: {apiTestResult.latencyMs}ms &bull; Protocol: {apiTestResult.protocol}
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded-xl">
                {JSON.stringify(apiTestResult.samplePayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: DATA SYNCHRONIZATION                                           */}
      {/* ========================================================================= */}
      {activeTab === 'SYNC' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Telemetry Strip: Last Sync, Received, Updated, Conflicts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                Last Sync
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">{syncSummary.lastSyncTimestamp}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Automated cron interval</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Database size={14} className="text-blue-500" />
                Records Received
              </div>
              <div className="text-2xl font-black text-blue-700 mt-2">{syncSummary.recordsReceived}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">RoR, WFS & PFMS feeds</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <RefreshCw size={14} className="text-emerald-500" />
                Records Updated
              </div>
              <div className="text-2xl font-black text-emerald-700 mt-2">{syncSummary.recordsUpdated}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Mutations & award decrees</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <AlertOctagon size={14} className="text-rose-500" />
                Active Conflicts
              </div>
              <div className="text-2xl font-black text-rose-700 mt-2">{syncSummary.conflictsCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Awaiting CALA conciliation</div>
            </div>
          </div>

          {/* Sync Trigger Card */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw size={18} className={isSyncing ? 'animate-spin text-amber-400' : 'text-emerald-400'} />
                Scheduled National Cadastral Sync Engine
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Initiates automated federated synchronization with State Bhulekh (RoR), BhuNaksha (WFS), PFMS DBT escrow, and PM GatiShakti NMP portals.
              </p>
            </div>

            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Synchronizing Feeds...' : 'Trigger Full Cadastral Sync Now'}
            </button>
          </div>

          {/* Sync Flow Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Federated Synchronization Cycles:
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { time: 'Today, 06:15 PM', source: 'State Bhulekh RoR', count: 1420, status: '284 records updated, 0 schema failures' },
                { time: 'Today, 05:45 PM', source: 'BhuNaksha GeoServer WFS', count: 890, status: '890 polygons reconciled with RoW alignment' },
                { time: 'Today, 04:30 PM', source: 'PFMS Electronic Escrow', count: 640, status: '12 new DBT settlement UTRs logged' }
              ].map((log, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>{log.source}</span>
                    <span className="text-[11px] text-slate-500 font-normal">&bull; {log.status}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: DATA CONFLICT RESOLUTION                                       */}
      {/* ========================================================================= */}
      {activeTab === 'CONFLICTS' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Multi-Source Cadastral Conflict Reconciliation</h3>
            <p className="text-xs text-slate-500">
              Cross-compares GIS polygons, State Bhulekh RoRs, and Gazette legal documents to detect and resolve discrepancies
            </p>
          </div>

          {/* Conflicts Feed */}
          <div className="space-y-4">
            {conflicts.map((conflict) => (
              <div 
                key={conflict.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      conflict.status === 'DETECTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      conflict.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      conflict.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {conflict.status === 'DETECTED' ? 'DATA CONFLICT DETECTED' : conflict.status}
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      Discrepancy: {conflict.conflictField}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-600">
                    Parcel: <strong className="text-indigo-700">{conflict.parcelId}</strong> (Khasra {conflict.khasraNo}), Village {conflict.village}
                  </div>
                </div>

                {/* The 3 Conflicting Sources: GIS vs Land Record vs Document */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* GIS Source */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900 uppercase">
                      <span>GIS</span>
                      <Compass size={14} className="text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-blue-950 mt-1">
                      {conflict.sources.gis.value} {conflict.sources.gis.unit}
                    </div>
                    <p className="text-[11px] text-blue-700 leading-snug">{conflict.sources.gis.sourceName}</p>
                    <div className="text-[10px] text-slate-400 pt-1 font-mono">{conflict.sources.gis.lastUpdated}</div>
                  </div>

                  {/* Land Record Source */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 uppercase">
                      <span>Land Record</span>
                      <Database size={14} className="text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-950 mt-1">
                      {conflict.sources.landRecord.value} {conflict.sources.landRecord.unit}
                    </div>
                    <p className="text-[11px] text-amber-700 leading-snug">{conflict.sources.landRecord.sourceName}</p>
                    <div className="text-[10px] text-slate-400 pt-1 font-mono">{conflict.sources.landRecord.lastUpdated}</div>
                  </div>

                  {/* Document Source */}
                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900 uppercase">
                      <span>Document</span>
                      <FileText size={14} className="text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-purple-950 mt-1">
                      {conflict.sources.document.value} {conflict.sources.document.unit}
                    </div>
                    <p className="text-[11px] text-purple-700 leading-snug">{conflict.sources.document.sourceName}</p>
                    <div className="text-[10px] text-slate-400 pt-1 font-mono">{conflict.sources.document.lastUpdated}</div>
                  </div>
                </div>

                {/* Delta notice */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                  <strong>Variance Analysis:</strong> {conflict.discrepancyDelta}
                </div>

                {/* Resolved Info if applicable */}
                {conflict.status === 'RESOLVED' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      Reconciled Value: {conflict.resolvedValue} (Adopted from {conflict.resolvedSource})
                    </div>
                    <p className="text-emerald-800">{conflict.resolutionRemarks}</p>
                    <div className="text-[10px] text-emerald-700 font-mono">
                      Resolved on {conflict.resolvedAt} by {conflict.resolvedBy}
                    </div>
                  </div>
                )}

                {/* Actions: Review, Resolve, Ignore */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="text-xs text-slate-400 font-mono">Ref: {conflict.id}</div>

                  <div className="flex items-center gap-2">
                    {conflict.status !== 'RESOLVED' && conflict.status !== 'IGNORED' && (
                      <>
                        <button
                          onClick={() => handleReviewConflict(conflict)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                        >
                          Review
                        </button>

                        <button
                          onClick={() => setActiveConflictForModal(conflict)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={13} /> Resolve
                        </button>

                        <button
                          onClick={() => handleIgnoreConflict(conflict)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs transition-colors"
                        >
                          Ignore
                        </button>
                      </>
                    )}

                    {conflict.status === 'RESOLVED' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check size={14} /> Reconciled
                      </span>
                    )}

                    {conflict.status === 'IGNORED' && (
                      <span className="text-xs font-bold text-slate-400">
                        Ignored under tolerance
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conflict Resolution Modal */}
          {activeConflictForModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden p-6 space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Reconcile Cadastral Discrepancy</h3>
                    <p className="text-xs text-slate-500">Select authoritative source for Khasra {activeConflictForModal.khasraNo}</p>
                  </div>
                  <button
                    onClick={() => setActiveConflictForModal(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="font-bold text-slate-700">Choose Authoritative Ground Truth:</div>
                  
                  {[
                    { key: 'GIS', label: `GIS Map: ${activeConflictForModal.sources.gis.value} ${activeConflictForModal.sources.gis.unit}`, desc: activeConflictForModal.sources.gis.sourceName },
                    { key: 'LAND_RECORD', label: `Land Record RoR: ${activeConflictForModal.sources.landRecord.value} ${activeConflictForModal.sources.landRecord.unit}`, desc: activeConflictForModal.sources.landRecord.sourceName },
                    { key: 'DOCUMENT', label: `Gazette Doc: ${activeConflictForModal.sources.document.value} ${activeConflictForModal.sources.document.unit}`, desc: activeConflictForModal.sources.document.sourceName }
                  ].map(opt => (
                    <label 
                      key={opt.key}
                      className={`p-3 rounded-xl border block cursor-pointer transition-all ${
                        selectedSourceToResolve === opt.key 
                          ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-400' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="source_opt"
                          checked={selectedSourceToResolve === opt.key}
                          onChange={() => setSelectedSourceToResolve(opt.key as any)}
                          className="text-emerald-600"
                        />
                        <span className="font-bold text-slate-900">{opt.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-5 mt-0.5">{opt.desc}</p>
                    </label>
                  ))}

                  <div className="space-y-1 pt-2">
                    <span className="font-bold text-slate-700">CALA Resolution Remarks:</span>
                    <textarea
                      rows={3}
                      value={resolutionRemarks}
                      onChange={(e) => setResolutionRemarks(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveConflictForModal(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleExecuteResolve}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Confirm Reconciled Value
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: API ARCHITECTURE & SPECIFICATIONS                              */}
      {/* ========================================================================= */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900">RESTful Service Architecture & Security Contract</h3>
            <p className="text-xs text-slate-500">Enterprise service interfaces and zero frontend credential exposure model</p>
          </div>

          {/* Security Architecture Principle */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={16} /> Backend Proxy Security Architecture (Zero Secret Exposure)
            </div>
            <p className="text-slate-300 leading-relaxed">
              No private API keys, client secrets, or PKI private certificates are bundled in the client browser. All external integrations route through authenticated backend microservice gateways with mTLS and token rotation.
            </p>
          </div>

          {/* Service Interfaces Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Standardized RESTful Service Interfaces:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-mono font-bold text-indigo-700">ILandRecordsApi</div>
                <div className="text-[11px] text-slate-600">Method: <code>GET /v2/ror?khasra={'{khasraNo}'}&village={'{villageCode}'}</code></div>
                <div className="text-[10px] text-slate-500">Returns digital Khatiyan, Jamabandi Reg-II, and verified mutation history.</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-mono font-bold text-indigo-700">ICadastralMapApi</div>
                <div className="text-[11px] text-slate-600">Method: <code>GET /geoserver/wfs?request=GetFeature&typeName=parcel_boundary</code></div>
                <div className="text-[10px] text-slate-500">GeoJSON stream of survey boundaries, benchmark pegs, and alignment overlays.</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-mono font-bold text-indigo-700">IFinancialSystemApi</div>
                <div className="text-[11px] text-slate-600">Method: <code>POST /api/v1/dbt-escrow/disbursement</code></div>
                <div className="text-[10px] text-slate-500">PFMS electronic voucher, bank UTR verification, and direct treasury reconciliation.</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-mono font-bold text-indigo-700">INotificationApi</div>
                <div className="text-[11px] text-slate-600">Method: <code>POST /dlt/api/v3/sms-dispatch</code></div>
                <div className="text-[10px] text-slate-500">DLT registered bilingual SMS alerts and automated Section 3A/3E statutory notices.</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
