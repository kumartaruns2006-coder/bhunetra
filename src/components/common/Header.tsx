import React from 'react';
import { Officer } from '../../types/officer';
import { ProjectCorridor } from '../../types/project';
import { mockOfficers } from '../../data/mockOfficers';
import { ShieldCheck, UserCheck, AlertCircle, Layers } from 'lucide-react';

interface HeaderProps {
  currentOfficer: Officer;
  onOfficerChange: (officer: Officer) => void;
  currentProject: ProjectCorridor;
  allProjects: ProjectCorridor[];
  onProjectChange: (project: ProjectCorridor) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentOfficer,
  onOfficerChange,
  currentProject,
  allProjects,
  onProjectChange
}) => {
  return (
    <header className="bg-gov-navy text-white sticky top-0 z-50 shadow-md border-b border-gov-navy-light/40">
      {/* Top Ministry Bar */}
      <div className="bg-gov-navy-dark px-4 py-1 flex items-center justify-between text-xs text-slate-300 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium tracking-wide text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            GOVERNMENT OF INDIA &bull; MINISTRY OF ROAD TRANSPORT & HIGHWAYS / NHAI
          </div>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-amber-300 font-medium">Smart India Hackathon 2026 Prototype</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400">Jurisdiction: <span className="text-white font-medium">{currentOfficer.jurisdiction}</span></span>
          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            <AlertCircle size={12} />
            <span>Synthetic Demo Data</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-amber-400/40 flex-shrink-0">
            <img src="/logo.png" alt="BhuNetra Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                BhuNetra
                <span className="text-[11px] font-normal uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  भू-नेत्र
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-300 tracking-normal">
              Real-Time Land Insights. Better Decisions.
            </p>
          </div>
        </div>

        {/* Project Selector & Quick Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded px-3 py-1.5 flex items-center gap-2">
            <Layers size={16} className="text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Active Corridor</div>
              <select
                aria-label="Active Corridor"
                value={currentProject.id}
                onChange={(e) => {
                  const found = allProjects.find(p => p.id === e.target.value);
                  if (found) onProjectChange(found);
                }}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4"
              >
                {allProjects.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} ({p.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-800/50 border border-slate-700/60 rounded px-3 py-1.5 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">RoW Length</span>
              <span className="font-semibold text-emerald-300">{currentProject.corridorLengthKm} km</span>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Possession</span>
              <span className="font-semibold text-cyan-300">{currentProject.possessionSecuredPercentage}%</span>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Disbursed</span>
              <span className="font-semibold text-amber-300">₹{currentProject.disbursedBudgetCr} Cr</span>
            </div>
          </div>
        </div>

        {/* Officer Persona Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white flex items-center justify-end gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              {currentOfficer.name}
            </div>
            <div className="text-[11px] text-slate-300">
              {currentOfficer.designation.length > 38 
                ? `${currentOfficer.designation.substring(0, 38)}...` 
                : currentOfficer.designation}
            </div>
          </div>

          {/* Role Pill Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
            <div className="px-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <UserCheck size={12} />
              Role:
            </div>
            {mockOfficers.map((officer) => {
              const isCurrent = officer.id === currentOfficer.id;
              return (
                <button
                  key={officer.id}
                  onClick={() => onOfficerChange(officer)}
                  title={`${officer.name} (${officer.role})`}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {officer.role}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
