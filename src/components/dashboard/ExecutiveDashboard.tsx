import React, { useState, useMemo, useEffect } from 'react';
import { ProjectCorridor } from '../../types/project';
import { Parcel } from '../../types/parcel';
import { Officer } from '../../types/officer';
import { i18n } from '../../services/i18nService';
import {
  ExecutiveMacroKpis,
  InterventionCase,
  DrilldownLevel,
  DrilldownState
} from '../../types/reports';
import { reportsService } from '../../services/reportsService';
import {
  mockNationalKpis,
  mockStatePerformances,
  mockProjectProgressRecords,
  mockTimelineCompliance
} from '../../data/mockNationalDashboard';
import { GeographicOverviewMap } from './GeographicOverviewMap';
import {
  TrendingUp,
  MapPin,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  Clock,
  ShieldAlert,
  ChevronRight,
  ArrowUpRight,
  Building,
  Layers,
  FileText,
  Users,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface ExecutiveDashboardProps {
  project?: ProjectCorridor;
  parcels: Parcel[];
  currentOfficer?: Officer;
  onNavigateTab?: (tab: 'gis' | 'parcels' | 'verification' | 'ai-risk' | 'decision') => void;
  onSelectParcel: (parcel: Parcel) => void;
  onSelectProject?: (projectId: string) => void;
  onNavigateToMap?: (parcel: Parcel) => void;
  onNavigateModule?: (module: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  project,
  parcels,
  currentOfficer: _currentOfficer,
  onNavigateTab: _onNavigateTab,
  onSelectParcel,
  onSelectProject,
  onNavigateToMap,
  onNavigateModule
}) => {
  // Macro KPIs (Section 4)
  const macroKpis: ExecutiveMacroKpis = useMemo(() => reportsService.getNationalKpis(), []);
  
  // High-Priority Intervention cases (Section 5)
  const interventionCases: InterventionCase[] = useMemo(() => reportsService.getInterventionCases(), []);

  // Section 5: 5-Tier Hierarchical Drilldown State: National -> State -> District -> Project -> Parcel
  const [, setLang] = useState(i18n.getLanguage());
  useEffect(() => {
    const unsub = i18n.subscribe(setLang);
    return unsub;
  }, []);

  const [drilldown, setDrilldown] = useState<DrilldownState>({
    currentLevel: 'national',
    selectedState: undefined,
    selectedDistrict: undefined,
    selectedProjectId: undefined,
    selectedProjectName: undefined,
    selectedParcelId: undefined
  });

  // Selected State filter for National Map
  const [mapStateFilter, setMapStateFilter] = useState<string>('All States');
  const [stateSortBy, setStateSortBy] = useState<'acquisition' | 'compensation' | 'risk'>('acquisition');

  // Drilldown data resolvers
  const drilldownStates = useMemo(() => reportsService.getDrilldownStates(), []);
  const drilldownDistricts = useMemo(() => {
    if (!drilldown.selectedState) return [];
    return reportsService.getDrilldownDistricts(drilldown.selectedState);
  }, [drilldown.selectedState]);

  const drilldownProjects = useMemo(() => {
    if (!drilldown.selectedState) return [];
    return reportsService.getDrilldownProjects(drilldown.selectedState, drilldown.selectedDistrict);
  }, [drilldown.selectedState, drilldown.selectedDistrict]);

  // Sorted State Performance Records
  const sortedStatePerformances = useMemo(() => {
    const list = [...mockStatePerformances];
    if (stateSortBy === 'acquisition') {
      return list.sort((a, b) => b.acquisitionPercent - a.acquisitionPercent);
    } else if (stateSortBy === 'compensation') {
      return list.sort((a, b) => b.compensationPercent - a.compensationPercent);
    } else {
      const riskWeights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return list.sort((a, b) => riskWeights[b.riskLevel] - riskWeights[a.riskLevel]);
    }
  }, [stateSortBy]);

  // Drilldown Action Handlers
  const handleDrilldownToState = (stateName: string) => {
    setDrilldown({
      currentLevel: 'state',
      selectedState: stateName,
      selectedDistrict: undefined,
      selectedProjectId: undefined,
      selectedProjectName: undefined,
      selectedParcelId: undefined
    });
    setMapStateFilter(stateName);
  };

  const handleDrilldownToDistrict = (districtName: string) => {
    setDrilldown(prev => ({
      ...prev,
      currentLevel: 'district',
      selectedDistrict: districtName,
      selectedProjectId: undefined,
      selectedProjectName: undefined,
      selectedParcelId: undefined
    }));
  };

  const handleDrilldownToProject = (projId: string, projName: string) => {
    setDrilldown(prev => ({
      ...prev,
      currentLevel: 'project',
      selectedProjectId: projId,
      selectedProjectName: projName,
      selectedParcelId: undefined
    }));
  };

  const handleDrilldownToParcel = (parcel: Parcel) => {
    setDrilldown(prev => ({
      ...prev,
      currentLevel: 'parcel',
      selectedParcelId: parcel.id
    }));
    onSelectParcel(parcel);
  };

  const handleResetToLevel = (level: DrilldownLevel) => {
    if (level === 'national') {
      setDrilldown({ currentLevel: 'national' });
      setMapStateFilter('All States');
    } else if (level === 'state') {
      setDrilldown(prev => ({
        currentLevel: 'state',
        selectedState: prev.selectedState,
        selectedDistrict: undefined,
        selectedProjectId: undefined,
        selectedProjectName: undefined,
        selectedParcelId: undefined
      }));
    } else if (level === 'district') {
      setDrilldown(prev => ({
        currentLevel: 'district',
        selectedState: prev.selectedState,
        selectedDistrict: prev.selectedDistrict,
        selectedProjectId: undefined,
        selectedProjectName: undefined,
        selectedParcelId: undefined
      }));
    } else if (level === 'project') {
      setDrilldown(prev => ({
        currentLevel: 'project',
        selectedState: prev.selectedState,
        selectedDistrict: prev.selectedDistrict,
        selectedProjectId: prev.selectedProjectId,
        selectedProjectName: prev.selectedProjectName,
        selectedParcelId: undefined
      }));
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* SECTION 4: HEADER - "National Land Acquisition Intelligence" */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            CABINET SECRETARIAT &bull; MINISTRY OF ROAD TRANSPORT & HIGHWAYS (MoRTH)
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            National Land Acquisition Intelligence
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
              Executive Decision Cockpit
            </span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Unified statutory monitoring across 18 States, 128 Mega Corridors, and 14,200 Revenue Villages.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateModule && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileSpreadsheet size={14} className="text-amber-600" />}
              onClick={() => onNavigateModule('reports_mis')}
              className="border-slate-300 hover:bg-slate-50 text-xs font-bold"
            >
              Open MIS Report Builder
            </Button>
          )}
          {onNavigateModule && (
            <Button
              variant="gov-navy"
              size="sm"
              leftIcon={<ShieldAlert size={14} className="text-amber-400" />}
              onClick={() => onNavigateModule('ai_intelligence')}
              className="text-xs font-bold shadow-sm"
            >
              AI Delay Predictor (42d)
            </Button>
          )}
        </div>
      </div>

      {/* SECTION 4: 7 MACRO KPIS (Requested Exact Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* KPI 1: Active Projects */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">{i18n.t('kpi.active_projects')}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{macroKpis.activeProjects}</span>
            <span className="text-[10px] text-slate-500 font-medium">Corridors</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">18 States Active</span>
          <div className="absolute top-3 right-3 text-slate-400">
            <Building size={16} />
          </div>
        </div>

        {/* KPI 2: Land Proposed */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">{i18n.t('kpi.land_proposed')}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{macroKpis.landProposedAcres.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium">Acres</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Section 3A Gazetted</span>
          <div className="absolute top-3 right-3 text-slate-400">
            <Layers size={16} />
          </div>
        </div>

        {/* KPI 3: Land Acquired */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">{i18n.t('kpi.land_acquired')}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-700">{macroKpis.landAcquiredAcres.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-600 font-bold">{macroKpis.landAcquiredPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${macroKpis.landAcquiredPercent}%` }}></div>
          </div>
          <div className="absolute top-3 right-3 text-emerald-500">
            <CheckCircle2 size={16} />
          </div>
        </div>

        {/* KPI 4: Compensation */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">{i18n.t('kpi.compensation')}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">₹{macroKpis.compensationDisbursedCr}</span>
            <span className="text-[10px] text-slate-500 font-medium">/ ₹{macroKpis.compensationAssessedCr} Cr</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">{macroKpis.compensationDisbursedPercent}% via PFMS DBT</span>
          <div className="absolute top-3 right-3 text-slate-400">
            <IndianRupee size={16} />
          </div>
        </div>

        {/* KPI 5: R&R */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">{i18n.t('kpi.rr_progress')}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-700">{macroKpis.rrCompletedPercent}%</span>
            <span className="text-[10px] text-slate-500 font-medium">Rehabilitated</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">{macroKpis.rrCompletedFamilies.toLocaleString()} / {macroKpis.rrEligibleFamilies.toLocaleString()} PAFs</span>
          <div className="absolute top-3 right-3 text-indigo-400">
            <Users size={16} />
          </div>
        </div>

        {/* KPI 6: Possession */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">{i18n.t('kpi.possession')}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{macroKpis.possessionHandedAcres.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium">Acres</span>
          </div>
          <span className="text-[10px] text-indigo-700 font-semibold block mt-1">{macroKpis.possessionHandedPercent}% Handed to EPC</span>
          <div className="absolute top-3 right-3 text-slate-400">
            <Compass size={16} />
          </div>
        </div>

        {/* KPI 7: High Risk */}
        <div className="bg-white rounded-xl p-3.5 border-2 border-red-200 shadow-sm relative overflow-hidden bg-red-50/20">
          <span className="text-[10px] text-red-700 uppercase font-bold block">{i18n.t('kpi.high_risk')}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-red-700">{macroKpis.highRiskProjectsCount}</span>
            <span className="text-[10px] text-red-600 font-semibold">Corridors</span>
          </div>
          <span className="text-[10px] text-red-600 font-medium block mt-1">Intervention Mandated</span>
          <div className="absolute top-3 right-3 text-red-500">
            <AlertTriangle size={16} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: INTERVENTION CENTER (PROMINENT CASE FROM USER PROMPT)          */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-gov-navy rounded-xl p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 rounded-lg border border-red-400/30 text-red-300">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500 text-white">
                  CRITICAL INTERVENTION MANDATED
                </span>
                <span className="text-xs text-white/70 font-mono">CALA / PMO ESCALATION QUEUE</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                Executive Intervention Center (Section 5)
              </h2>
            </div>
          </div>
          <div className="text-xs text-white/80">
            Automated bottleneck resolution & Chief Secretary coordination
          </div>
        </div>

        {/* Showcase Intervention Card: PATNA RING ROAD EXPANSION */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono">
                  PRR-PH2-2026
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Patna Ring Road Expansion (Phase II)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white uppercase tracking-wider">
                  Risk: HIGH (78/100)
                </span>
              </div>

              {/* Primary Metrics: Predicted Delay 42 Days */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/60 uppercase font-bold block">Predicted Delay</span>
                  <span className="text-xl font-black text-amber-400">42 Days</span>
                  <span className="text-[10px] text-white/70 block mt-0.5">Target: 31 Dec 2026 &rarr; Slip: 11 Feb 2027</span>
                </div>

                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/60 uppercase font-bold block">Primary Issues</span>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/30 text-red-200 border border-red-400/40">
                      Compensation
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-400/40">
                      Verification
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40">
                      Documents
                    </span>
                  </div>
                  <span className="text-[10px] text-white/70 block mt-0.5">₹24.8 Cr pending; 18 unverified plots</span>
                </div>

                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/60 uppercase font-bold block">Recommended Action</span>
                  <span className="text-xs font-bold text-white block mt-1 leading-snug">
                    Prioritize 18 high-risk parcels in Kanhauli & Bihta to unlock continuous 7.2 km Right-of-Way.
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent "VIEW PROJECT" Button */}
            <div className="flex flex-col sm:items-end gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject('PRR-PH2-2026');
                  } else if (onNavigateModule) {
                    onNavigateModule('projects');
                  }
                }}
                className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                VIEW PROJECT
                <ArrowUpRight size={16} />
              </button>

              <button
                onClick={() => handleDrilldownToProject('PRR-PH2-2026', 'Patna Ring Road Expansion')}
                className="text-xs text-amber-300 hover:text-white underline font-semibold flex items-center gap-1"
              >
                Inspect 18 High-Risk Parcels in Drilldown &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Other Intervention Cases Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {interventionCases.filter(c => c.id !== 'int-1').map(item => (
            <div key={item.id} className="bg-white/5 rounded-lg p-3.5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-300">{item.projectCode}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-500/80 text-white">
                  +{item.predictedDelayDays}d Delay
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-1 line-clamp-1">{item.projectName}</div>
              <div className="text-[10px] text-white/70 mt-1 flex items-center gap-1">
                <strong>Issues:</strong> {item.primaryIssues.join(', ')}
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/60">{item.affectedParcelsCount} Plots Affected</span>
                <button
                  onClick={() => {
                    if (onSelectProject) onSelectProject(item.projectId);
                  }}
                  className="text-[11px] text-amber-400 hover:text-white font-bold flex items-center gap-0.5"
                >
                  View Case &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5-TIER HIERARCHICAL DRILLDOWN: National -> State -> District -> Project -> Parcel */}
      {/* ========================================================================= */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-5 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
                <Compass size={14} className="text-amber-600" />
                5-TIER HIERARCHICAL DRILLDOWN ARCHITECTURE
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                National &rarr; State &rarr; District &rarr; Project &rarr; Parcel Digital Twin
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Click any node in the hierarchy below to drill down directly into granular records and CAD digital twins.
              </CardDescription>
            </div>

            {/* Interactive Breadcrumb Bar */}
            <nav className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
              <button
                onClick={() => handleResetToLevel('national')}
                className={`hover:text-gov-navy transition-colors ${
                  drilldown.currentLevel === 'national' ? 'text-gov-navy font-bold underline' : 'text-slate-500'
                }`}
              >
                National (18 States)
              </button>

              {drilldown.selectedState && (
                <>
                  <ChevronRight size={13} className="text-slate-400" />
                  <button
                    onClick={() => handleResetToLevel('state')}
                    className={`hover:text-gov-navy transition-colors ${
                      drilldown.currentLevel === 'state' ? 'text-gov-navy font-bold underline' : 'text-slate-500'
                    }`}
                  >
                    State: {drilldown.selectedState}
                  </button>
                </>
              )}

              {drilldown.selectedDistrict && (
                <>
                  <ChevronRight size={13} className="text-slate-400" />
                  <button
                    onClick={() => handleResetToLevel('district')}
                    className={`hover:text-gov-navy transition-colors ${
                      drilldown.currentLevel === 'district' ? 'text-gov-navy font-bold underline' : 'text-slate-500'
                    }`}
                  >
                    District: {drilldown.selectedDistrict}
                  </button>
                </>
              )}

              {drilldown.selectedProjectName && (
                <>
                  <ChevronRight size={13} className="text-slate-400" />
                  <button
                    onClick={() => handleResetToLevel('project')}
                    className={`hover:text-gov-navy transition-colors ${
                      drilldown.currentLevel === 'project' ? 'text-gov-navy font-bold underline' : 'text-slate-500'
                    }`}
                  >
                    Project: {drilldown.selectedProjectName}
                  </button>
                </>
              )}
            </nav>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          {/* LEVEL 1: NATIONAL VIEW (Lists States) */}
          {drilldown.currentLevel === 'national' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Step 1: Select State to Drill Down
                </span>
                <span className="text-[11px] text-slate-500">18 States Reporting</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {drilldownStates.map(st => (
                  <div
                    key={st.code}
                    onClick={() => handleDrilldownToState(st.name)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-gov-navy hover:shadow-md transition-all cursor-pointer bg-white group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-gov-navy">{st.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        st.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        st.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                        st.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {st.riskLevel}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                      <div>Active Projects: <strong className="text-slate-900">{st.projectsCount} Corridors</strong></div>
                      <div>Acquired: <strong className="text-emerald-700">{st.acquiredLandAcres} / {st.proposedLandAcres} Ac ({st.acquisitionPercent}%)</strong></div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                      <span>Explore {st.topDistricts.length} Districts</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 2: STATE VIEW (Lists Districts) */}
          {drilldown.currentLevel === 'state' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Step 2: Select District in {drilldown.selectedState}
                </span>
                <button
                  onClick={() => handleResetToLevel('national')}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft size={13} /> Back to National
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {drilldownDistricts.map(dist => (
                  <div
                    key={dist.name}
                    onClick={() => handleDrilldownToDistrict(dist.name)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-gov-navy hover:shadow-md transition-all cursor-pointer bg-white group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-gov-navy">{dist.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {dist.riskStatus}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                      <div>Corridors Crossing: <strong className="text-slate-900">{dist.projectsCount}</strong></div>
                      <div>Plots in RoW: <strong className="text-slate-900">{dist.plotsCount}</strong></div>
                      <div>Acquisition: <strong className="text-emerald-700">{dist.acquisitionPercent}%</strong></div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                      <span>View Corridors</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 3: DISTRICT VIEW (Lists Projects) */}
          {drilldown.currentLevel === 'district' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Step 3: Corridors in {drilldown.selectedDistrict}, {drilldown.selectedState}
                </span>
                <button
                  onClick={() => handleResetToLevel('state')}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft size={13} /> Back to Districts
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {drilldownProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleDrilldownToProject(p.id, p.name)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-gov-navy hover:shadow-md transition-all cursor-pointer bg-white group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-gov-navy">{p.code}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        p.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.riskLevel}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1 group-hover:text-gov-navy">{p.name}</div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
                      <div>Length: <strong>{p.corridorLengthKm} km</strong></div>
                      <div>Parcels: <strong>{p.parcelsCount}</strong></div>
                      <div>Acquired: <strong className="text-emerald-700">{p.acquisitionPercent}%</strong></div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                      <span>View Parcel Digital Twins ({p.parcelsCount} Plots)</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 4 & 5: PROJECT & PARCEL VIEW (Lists Parcels for Selected Project) */}
          {(drilldown.currentLevel === 'project' || drilldown.currentLevel === 'parcel') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Step 4 & 5: Parcel Digital Twins for {drilldown.selectedProjectName}
                  </span>
                  <p className="text-xs text-slate-500">
                    Click any parcel to open its comprehensive <strong>Parcel Digital Twin Drawer</strong> or inspect on GIS Map.
                  </p>
                </div>
                <button
                  onClick={() => handleResetToLevel('district')}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft size={13} /> Back to Projects
                </button>
              </div>

              {/* Parcels Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Parcel ID & Khasra</th>
                      <th className="py-3 px-3">Village & Tehsil</th>
                      <th className="py-3 px-3">Acquisition Area</th>
                      <th className="py-3 px-3">Statutory Stage</th>
                      <th className="py-3 px-3">Disbursement Status</th>
                      <th className="py-3 px-3">Risk Score</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parcels.slice(0, 8).map(parcel => (
                      <tr key={parcel.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{parcel.id}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Khasra {parcel.khasraNo}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          <div>{parcel.village}</div>
                          <div className="text-[10px] text-slate-500">{parcel.tehsil}, {parcel.district}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {parcel.acquisitionAreaHectares.toFixed(2)} Ha ({(parcel.acquisitionAreaHectares * 2.471).toFixed(2)} Ac)
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {parcel.currentStage}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            parcel.compensation.paymentStatus === 'DIRECT_BENEFIT_TRANSFERRED' ? 'bg-emerald-100 text-emerald-800' :
                            parcel.compensation.paymentStatus === 'ESCROW_FUNDED' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {parcel.compensation.paymentStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            parcel.aiRisk.overallRiskScore >= 75 ? 'bg-red-100 text-red-800' :
                            parcel.aiRisk.overallRiskScore >= 50 ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {parcel.aiRisk.overallRiskScore}/100
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDrilldownToParcel(parcel)}
                              className="px-2.5 py-1 bg-gov-navy hover:bg-gov-navy-light text-white text-[11px] font-bold rounded shadow-sm"
                            >
                              Digital Twin
                            </button>
                            {onNavigateToMap && (
                              <button
                                onClick={() => onNavigateToMap(parcel)}
                                className="p-1 text-slate-500 hover:text-gov-navy rounded hover:bg-slate-100"
                                title="View on GIS Map"
                              >
                                <Compass size={14} />
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
          )}
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* SECTION 4: VISUALIZATIONS (National Map, State Performance, Risk, Timeline) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* National Map & GIS Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-gov-navy" />
                <h3 className="text-sm font-bold text-slate-900">National Corridor GIS Spatial Map</h3>
              </div>
              <p className="text-[11px] text-slate-500">Interactive corridor alignments and state corridor density</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={mapStateFilter}
                onChange={e => setMapStateFilter(e.target.value)}
                className="text-xs font-medium border border-slate-300 rounded px-2 py-1 bg-white"
              >
                <option value="All States">All States (National)</option>
                <option value="Bihar">Bihar</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Odisha">Odisha</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
          </div>

          <div className="h-[420px] rounded-lg overflow-hidden border border-slate-200">
            <GeographicOverviewMap
              projects={mockProjectProgressRecords}
              onSelectProject={projectId => {
                if (onSelectProject) onSelectProject(projectId);
              }}
              selectedStateFilter={mapStateFilter}
            />
          </div>
        </div>

        {/* State Performance Matrix (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">State Performance Ranking</h3>
              <p className="text-[11px] text-slate-500">Statutory clearance rates across key highway states</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[10px] font-bold">
              <button
                onClick={() => setStateSortBy('acquisition')}
                className={`px-2 py-1 rounded ${stateSortBy === 'acquisition' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Acq %
              </button>
              <button
                onClick={() => setStateSortBy('compensation')}
                className={`px-2 py-1 rounded ${stateSortBy === 'compensation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Comp %
              </button>
              <button
                onClick={() => setStateSortBy('risk')}
                className={`px-2 py-1 rounded ${stateSortBy === 'risk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Risk
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px] divide-y divide-slate-100">
            {sortedStatePerformances.map((st, idx) => (
              <div
                key={st.id}
                onClick={() => handleDrilldownToState(st.state)}
                className="py-3 px-2 hover:bg-slate-50 rounded transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-bold text-xs text-slate-400">#{idx + 1}</span>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      {st.state}
                      <span className="text-[10px] font-mono text-slate-400">({st.code})</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{st.projectsCount} Corridors &bull; {st.calaCount} CALAs</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-xs font-bold text-emerald-700">{st.acquisitionPercent}% Acq</div>
                    <div className="text-[10px] text-slate-500">₹{st.compensationDisbursedCr} Cr Paid</div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    st.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    st.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                    st.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {st.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: TIMELINE COMPLIANCE & COMPENSATION/R&R WATERFALL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timeline Compliance Card */}
        <Card className="border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-gov-navy" />
              <CardTitle className="text-sm font-bold text-slate-900">Corridor Timeline Compliance</CardTitle>
            </div>
            <span className="text-xs font-bold text-amber-700">Average Delay: 42 Days</span>
          </div>

          <div className="space-y-3 mt-3">
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>On-Track Corridors (74 Projects)</span>
                <span className="font-bold text-emerald-700">57.8%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '57.8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Delayed Corridors (&le; 90 Days Slip - 36 Projects)</span>
                <span className="font-bold text-amber-700">28.1%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '28.1%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Critical Hold (&gt; 90 Days Slip - 18 Projects)</span>
                <span className="font-bold text-red-700">14.1%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full" style={{ width: '14.1%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Compensation & R&R Pipeline Card */}
        <Card className="border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IndianRupee size={15} className="text-emerald-700" />
              <CardTitle className="text-sm font-bold text-slate-900">Compensation & R&R Pipeline</CardTitle>
            </div>
            <span className="text-xs font-bold text-emerald-700">PFMS Gateway Active</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Assessed Compensation</span>
              <span className="text-base font-bold text-slate-900">₹1,240.00 Cr</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Across 186 Awards</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">DBT Disbursed</span>
              <span className="text-base font-bold text-emerald-800">₹842.00 Cr</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">67.9% Realization Rate</span>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <span className="text-[10px] text-indigo-800 uppercase font-bold block">R&R Eligible PAFs</span>
              <span className="text-base font-bold text-indigo-900">24,580</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Census Verified</span>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200">
              <span className="text-[10px] text-indigo-800 uppercase font-bold block">R&R Completed</span>
              <span className="text-base font-bold text-indigo-700">16,714</span>
              <span className="text-[10px] text-indigo-700 font-semibold block mt-0.5">68.0% Completion</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
