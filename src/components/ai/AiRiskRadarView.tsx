import React, { useState, useMemo } from 'react';
import { Parcel } from '../../types/parcel';
import { ProjectCorridor } from '../../types/project';
import { 
  ProjectAiScore, 
  HighRiskParcelItem, 
  FourWayConflictItem, 
  AiRecommendationItem, 
  NlQueryResult 
} from '../../types/aiIntelligence';
import { aiIntelligenceService } from '../../services/aiIntelligenceService';
import { 
  BrainCircuit, 
  Sparkles, 
  Search, 
  TrendingUp, 
  Clock, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink, 
  Database, 
  Layers, 
  Compass, 
  Info,
  Check,
  ChevronRight,
  AlertOctagon,
  Lock,
  RotateCcw
} from 'lucide-react';

interface AiRiskRadarViewProps {
  project?: ProjectCorridor;
  parcels: Parcel[];
  onSelectParcel: (parcel: Parcel) => void;
  onOpenDigitalTwin: (parcel: Parcel) => void;
  onNavigateToMap?: (parcel: Parcel) => void;
  onNavigateModule?: (module: string) => void;
}

export const AiRiskRadarView: React.FC<AiRiskRadarViewProps> = ({
  project,
  parcels,
  onSelectParcel,
  onOpenDigitalTwin,
  onNavigateToMap,
  onNavigateModule
}) => {
  // Natural Language Search State
  const [nlQueryInput, setNlQueryInput] = useState<string>('');
  const [nlActiveResult, setNlActiveResult] = useState<NlQueryResult | null>(null);

  // Filter State for High-Risk Parcels Table
  const [parcelFilterSearch, setParcelFilterSearch] = useState<string>('');
  const [parcelRiskFilter, setParcelRiskFilter] = useState<string>('ALL');

  // AI Intelligence Data
  const projectScore: ProjectAiScore = useMemo(() => {
    return aiIntelligenceService.getProjectScore(project?.id, parcels);
  }, [project, parcels]);

  const highRiskParcels: HighRiskParcelItem[] = useMemo(() => {
    return aiIntelligenceService.getHighRiskParcels(parcels);
  }, [parcels]);

  const fourWayConflicts: FourWayConflictItem[] = useMemo(() => {
    return aiIntelligenceService.getFourWayConflicts();
  }, []);

  const recommendations: AiRecommendationItem[] = useMemo(() => {
    return aiIntelligenceService.getRecommendations();
  }, []);

  // Filtered High-Risk Parcels
  const filteredHighRiskParcels = useMemo(() => {
    return highRiskParcels.filter(p => {
      const matchSearch = 
        p.khasraNo.toLowerCase().includes(parcelFilterSearch.toLowerCase()) ||
        p.parcelId.toLowerCase().includes(parcelFilterSearch.toLowerCase()) ||
        p.village.toLowerCase().includes(parcelFilterSearch.toLowerCase()) ||
        p.reasons.some(r => r.toLowerCase().includes(parcelFilterSearch.toLowerCase()));
      const matchRisk = parcelRiskFilter === 'ALL' || p.riskLevel === parcelRiskFilter;
      return matchSearch && matchRisk;
    });
  }, [highRiskParcels, parcelFilterSearch, parcelRiskFilter]);

  // Execute Natural Language Query
  const handleExecuteNlQuery = (text: string) => {
    if (!text.trim()) return;
    setNlQueryInput(text);
    const result = aiIntelligenceService.queryNaturalLanguage(text);
    setNlActiveResult(result);
  };

  // Helper to open Digital Twin by ID
  const handleInspectById = (parcelId: string) => {
    const target = parcels.find(p => p.id === parcelId || p.khasraNo === parcelId);
    if (target) {
      onOpenDigitalTwin(target);
    } else if (parcels.length > 0) {
      onOpenDigitalTwin(parcels[0]);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Banner: Transparent Decision-Support Layer */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles size={15} />
              PART 12 &bull; PROTOTYPE AI / DECISION-SUPPORT SCORE
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <BrainCircuit size={26} className="text-amber-400" />
              AI Intelligence & Statutory Risk Radar
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Transparent multi-variate decision-support engine combining compensation velocity, court litigation probability, DGPS boundary reconciliation, and timeline forecasting.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-slate-200">
            <Lock size={13} className="text-amber-400" />
            <span>XGBoost ML Pipeline Ready</span>
          </div>
        </div>

        {/* Feature 7: Natural Language Query Search Box ("Ask BHUMI-TRACK") */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-inner space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 bg-slate-900/90 border border-slate-600 rounded-xl px-3.5 py-2.5 shadow-xs">
              <Search size={16} className="text-amber-400 shrink-0" />
              <input
                type="text"
                placeholder="Ask BHUMI-TRACK (e.g. 'Which parcels are high risk?', 'Show pending compensation')..."
                value={nlQueryInput}
                onChange={(e) => setNlQueryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleExecuteNlQuery(nlQueryInput);
                }}
                className="bg-transparent text-white font-medium text-xs sm:text-sm outline-none w-full placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => handleExecuteNlQuery(nlQueryInput)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              Ask AI
            </button>
          </div>

          {/* Preset Example Query Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
            <span className="font-semibold text-slate-400 text-[11px] mr-1">Quick Prompts:</span>
            {[
              'Show delayed projects in Bihar.',
              'Which parcels are high risk?',
              'Show pending compensation.',
              'Which projects may miss target timelines?'
            ].map((queryText, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteNlQuery(queryText)}
                className="px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold transition-colors border border-slate-600/70"
              >
                &ldquo;{queryText}&rdquo;
              </button>
            ))}
          </div>

          {/* Active NL Query Result Card */}
          {nlActiveResult && (
            <div className="bg-slate-900 text-white rounded-xl p-4 border border-amber-400/40 space-y-3 animate-in zoom-in-95 mt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">{nlActiveResult.title}</span>
                </div>
                <button
                  onClick={() => setNlActiveResult(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {nlActiveResult.summary}
              </p>

              {nlActiveResult.keyMetrics && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {nlActiveResult.keyMetrics.map((m, i) => (
                    <div key={i} className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{m.label}</div>
                      <div className="text-xs font-extrabold text-white mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {nlActiveResult.matchingParcels && (
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] font-bold text-slate-400">Relevant Plots:</div>
                  <div className="flex flex-wrap gap-2">
                    {nlActiveResult.matchingParcels.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleInspectById(p.id)}
                        className="px-2.5 py-1 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1 border border-indigo-700/60"
                      >
                        <span>Khasra {p.khasraNo} ({p.id})</span>
                        {p.riskScore && <span className="text-rose-400 font-black">[{p.riskScore}]</span>}
                        <ArrowUpRight size={11} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {nlActiveResult.actionLink && onNavigateModule && (
                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => onNavigateModule(nlActiveResult.actionLink!.targetModule)}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {nlActiveResult.actionLink.label} →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feature 1 & 2: Project Risk Score & Delay Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Risk Score Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>FEATURE 1: Project Risk Score</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                {projectScore.riskLevel}
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 mt-1">
              {projectScore.projectName}
            </h3>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl font-black text-rose-600">
                {projectScore.overallScore}
              </span>
              <span className="text-slate-400 font-bold text-lg">/ 100</span>
              <span className="text-xs font-black text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded ml-2 border border-rose-200">
                HIGH RISK
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono">
            <strong>Formula:</strong> 30% Comp + 25% Disp + 20% Verif + 15% Docs + 10% Milestone
          </div>
        </div>

        {/* Feature 2: Delay Prediction Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>FEATURE 2: Delay Prediction</span>
              <Clock size={16} className="text-amber-500" />
            </div>
            <h3 className="text-sm font-black text-slate-900 mt-1">
              Statutory Completion Impact
            </h3>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl font-black text-amber-600">
                +{projectScore.predictedDelayDays}
              </span>
              <span className="text-slate-600 font-bold text-sm">days delay forecast</span>
            </div>
          </div>

          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
            <strong>Critical Driver:</strong> Section 3D statutory 1-year window triggers in 6 calendar days.
          </div>
        </div>

        {/* Prototype AI Disclaimer Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Info size={15} className="text-blue-600" />
            <span>Prototype Model Transparency</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Scored using a transparent, explainable rule-based linear combination. Predictions are for prototype evaluation and decision-support only. Architecture ready for XGBoost / ML inference.
          </p>
          <div className="text-[10px] text-slate-400 font-mono">
            Model: Rule-Engine v2.4.0 (MoRTH Protocol)
          </div>
        </div>
      </div>

      {/* Feature 3: 5 Weighted Risk Factors Breakdown */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" />
              FEATURE 3: Risk Factors & Weighted Scoring Attribution
            </h3>
            <p className="text-xs text-slate-500">
              Contribution breakdown totaling {projectScore.overallScore} points based on corridor backlog velocity
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            Total Weighted Risk: {projectScore.overallScore} / 100
          </span>
        </div>

        <div className="space-y-3.5">
          {projectScore.factors.map((factor, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="text-slate-900">{factor.name}</span>
                  <span className="text-slate-400 font-normal">({factor.weightPercentage}% Weight)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">Raw: {factor.rawScore}/100</span>
                  <span className="text-indigo-800 font-mono font-black">+{factor.weightedScore.toFixed(1)} pts</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    factor.rawScore >= 80 ? 'bg-rose-500' :
                    factor.rawScore >= 70 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${factor.rawScore}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 4: High-Risk Parcels Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <AlertOctagon size={16} className="text-rose-600" />
              FEATURE 4: High-Risk Cadastral Parcels Register
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredHighRiskParcels.length} priority plots with elevated litigation, boundary, or compensation risks
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
              <Search size={13} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search Khasra or reason..."
                value={parcelFilterSearch}
                onChange={(e) => setParcelFilterSearch(e.target.value)}
                className="bg-transparent text-slate-900 font-medium outline-none w-36 sm:w-48 placeholder:text-slate-400"
              />
            </div>

            <select
              value={parcelRiskFilter}
              onChange={(e) => setParcelRiskFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
            </select>
          </div>
        </div>

        {/* High Risk Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="p-3">Parcel</th>
                <th className="p-3 text-center">Risk</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Recommended Action</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredHighRiskParcels.map((p) => (
                <tr key={p.parcelId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <button
                      onClick={() => handleInspectById(p.parcelId)}
                      className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
                    >
                      {p.parcelId}
                      <span className="text-[10px] text-slate-500 font-normal">({p.khasraNo})</span>
                    </button>
                    <div className="text-[10px] text-slate-500">Village {p.village}, {p.district}</div>
                  </td>

                  <td className="p-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono font-black text-sm text-rose-700">{p.riskScore}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        p.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.riskLevel}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 max-w-xs">
                    <ul className="space-y-0.5 text-[11px] text-slate-700 list-disc list-inside">
                      {p.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-semibold">
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3 max-w-sm text-slate-800 text-[11px]">
                    {p.recommendedAction}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleInspectById(p.parcelId)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1 mx-auto"
                    >
                      <ExternalLink size={11} /> Inspect Twin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature 5: 4-Way Data Conflict Detection Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Scale size={16} className="text-blue-600" />
            FEATURE 5: Multi-Source Data Conflict Detection (GIS vs RoR vs Docs vs Verification)
          </h3>
          <p className="text-xs text-slate-500">
            Automated cross-comparison engine detecting variances across spatial and revenue registries
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fourWayConflicts.map((conf) => (
            <div key={conf.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    conf.status === 'INCONSISTENCY_DETECTED'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {conf.status === 'INCONSISTENCY_DETECTED' ? 'INCONSISTENCY FLAGGED' : 'CONSISTENT'}
                  </span>
                  <span className="font-bold text-xs text-slate-900">{conf.attribute}</span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Parcel: <strong className="text-indigo-700">{conf.parcelId}</strong> (Khasra {conf.khasraNo}, Village {conf.village})
                </span>
              </div>

              {/* 4 Pillars Comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
                    <Compass size={11} /> 1. GIS Layer
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs truncate">{conf.gisValue}</div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                    <Database size={11} /> 2. Land Records (RoR)
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs truncate">{conf.landRecordsValue}</div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                    <FileText size={11} /> 3. Gazette Document
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs truncate">{conf.documentsValue}</div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                    <CheckCircle2 size={11} /> 4. Field Verification
                  </div>
                  <div className="font-bold text-slate-900 mt-1 text-xs truncate">{conf.fieldVerificationValue}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600">
                <strong>Variance Note:</strong> {conf.varianceNote}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 6: Proactive AI Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600" />
            FEATURE 6: Proactive Statutory AI Recommendations
          </h3>
          <p className="text-xs text-slate-500">
            Automated recommendations generated from corridor bottlenecks and backlog velocity analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    rec.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rec.urgency} PRIORITY
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{rec.category}</span>
                </div>

                <h4 className="text-sm font-black text-slate-900 leading-snug">
                  &ldquo;{rec.title}&rdquo;
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rec.description}
                </p>

                <div className="p-2 bg-emerald-50 rounded-lg text-[11px] text-emerald-900 font-semibold border border-emerald-200">
                  Impact: {rec.impact}
                </div>
              </div>

              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule(rec.targetModule)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1"
                >
                  <span>{rec.actionText}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
