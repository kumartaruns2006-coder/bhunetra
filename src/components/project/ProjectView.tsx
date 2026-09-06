import React from 'react';
import { ProjectCorridor } from '../../types/project';
import { Officer } from '../../types/officer';
import { 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Compass, 
  TrendingUp,
  FileCheck,
  Building2,
  Share2,
  IndianRupee,
  AlertTriangle,
  Users,
  Layers,
  ShieldAlert
} from 'lucide-react';

interface ProjectViewProps {
  project: ProjectCorridor;
  currentOfficer: Officer;
  onNavigateTab: (tab: 'gis' | 'parcels' | 'decision') => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  currentOfficer,
  onNavigateTab
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Project Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {project.code}
              </span>
              <span>National Highways Authority of India &bull; PIU Patna</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {project.name}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              State: <strong className="text-slate-800">{project.state}</strong> &bull; Districts: <strong className="text-slate-800">{project.districts.join(', ')}</strong> &bull; Target Commissioning: <strong className="text-slate-800">{project.targetCompletionDate}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('gis')}
              className="flex items-center gap-2 px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Compass size={15} className="text-amber-400" />
              View Alignment on GIS Map
            </button>
            <button
              onClick={() => onNavigateTab('parcels')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            >
              Open Parcel Directory
            </button>
          </div>
        </div>

        {/* 6 Key Statutory Metric Cards (Section 4 Requirements) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          {/* 1. Project Progress */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 uppercase">
              <span>Project Progress</span>
              <TrendingUp size={14} className="text-blue-600" />
            </div>
            <div className="text-xl font-black text-blue-950 mt-1">66.0%</div>
            <div className="text-[10px] text-blue-700 font-medium mt-0.5">4 of 6 Milestones Done</div>
          </div>

          {/* 2. Land Acquired */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 uppercase">
              <span>Land Acquired</span>
              <Layers size={14} className="text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-800 mt-1">164.0 Ha</div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">of {project.totalLandRequiredHectares} Ha Total (66%)</div>
          </div>

          {/* 3. Compensation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase">
              <span>Compensation</span>
              <IndianRupee size={14} className="text-slate-600" />
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">₹{project.disbursedBudgetCr.toFixed(1)} Cr</div>
            <div className="text-[10px] text-slate-600 font-medium mt-0.5">of ₹{project.totalBudgetCr.toFixed(1)} Cr (68% Disbursed)</div>
          </div>

          {/* 4. R&R */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 uppercase">
              <span>R&R Progress</span>
              <Users size={14} className="text-indigo-600" />
            </div>
            <div className="text-xl font-black text-indigo-900 mt-1">65.0%</div>
            <div className="text-[10px] text-indigo-700 font-medium mt-0.5">56 / 86 Displaced Families</div>
          </div>

          {/* 5. Possession */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase">
              <span>Possession</span>
              <ShieldCheck size={14} className="text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-900 mt-1">{project.possessionSecuredPercentage}%</div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">Handed to EPC Contractor</div>
          </div>

          {/* 6. Risk */}
          <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-red-900 uppercase">
              <span>Corridor Risk</span>
              <AlertTriangle size={14} className="text-red-600" />
            </div>
            <div className="text-xl font-black text-red-700 mt-1">72 / 100</div>
            <div className="text-[10px] text-red-700 font-bold mt-0.5">HIGH &bull; 28 Disputed Plots</div>
          </div>
        </div>

        {/* Corridor Technical Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 mt-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block uppercase font-medium">Corridor Length</span>
            <span className="text-xl font-bold text-slate-900">{project.corridorLengthKm} km</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Dual 3-lane configuration</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block uppercase font-medium">Right-of-Way (RoW)</span>
            <span className="text-xl font-bold text-slate-900">{project.rightOfWayWidthM} meters</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Demarcated buffer zone</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block uppercase font-medium">Total Land Required</span>
            <span className="text-xl font-bold text-slate-900">{project.totalLandRequiredHectares} Ha</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Across 14 Revenue Villages</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block uppercase font-medium">Physical Possession</span>
            <span className="text-xl font-bold text-emerald-700">{project.possessionSecuredPercentage}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Civil work ongoing in clear stretches</span>
          </div>
        </div>
      </div>

      {/* Corridor Alignment Milestones Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={16} className="text-gov-navy" />
              Statutory Project Milestones & Acquisition Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Legally bound timelines under the National Highways Act, 1956 and RFCTLARR Act, 2013
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
            4 Milestones Completed
          </span>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
          {project.milestones.map((m, idx) => {
            const isDone = m.status === 'COMPLETED';
            const isInProgress = m.status === 'IN_PROGRESS';
            return (
              <div key={m.id} className="relative pl-6">
                {/* Node Icon */}
                <span className={`absolute -left-2.5 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  isDone 
                    ? 'bg-emerald-600 text-white' 
                    : isInProgress 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse' 
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  {isDone ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                </span>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.stageName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Statutory Clause: <span className="font-semibold text-slate-700">{m.statutoryReference}</span> &bull; Responsible: <span className="text-slate-700">{m.responsibleAuthority}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-600">
                      Target: {m.targetDate}
                    </span>
                    {m.completedDate && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        Achieved on {m.completedDate}
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                        Under Active Execution
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Villages Catalog */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={16} className="text-gov-navy" />
              Revenue Villages Along Corridor Alignment
            </h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown of land acquisition status, parcels, and financial disbursements
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Revenue Village</th>
                <th className="py-2.5 px-3">Tehsil / Circle</th>
                <th className="py-2.5 px-3">Total Parcels</th>
                <th className="py-2.5 px-3">Acquired Parcels</th>
                <th className="py-2.5 px-3">Area (Hectares)</th>
                <th className="py-2.5 px-3">Disbursed (₹ Cr)</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.villages.map((v) => {
                const pct = Math.round((v.acquiredParcels / v.totalParcels) * 100);
                return (
                  <tr key={v.villageName} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{v.villageName}</td>
                    <td className="py-3 px-3 text-slate-600">{v.tehsil}</td>
                    <td className="py-3 px-3 font-mono">{v.totalParcels}</td>
                    <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">{v.acquiredParcels}</td>
                    <td className="py-3 px-3 font-mono">{v.areaHectares} Ha</td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800">₹{v.disbursedAmountCr} Cr</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.riskStatus === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                        v.riskStatus === 'WATCH' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {v.riskStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-semibold text-slate-700 font-mono">{pct}%</span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${pct > 70 ? 'bg-emerald-600' : 'bg-amber-500'}`} 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
