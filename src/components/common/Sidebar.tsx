import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Compass, 
  FileSpreadsheet, 
  ClipboardCheck, 
  BrainCircuit, 
  Gavel, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Officer } from '../../types/officer';

export type ActiveTab = 'dashboard' | 'project' | 'gis' | 'parcels' | 'verification' | 'ai-risk' | 'decision';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentOfficer: Officer;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentOfficer,
  onResetData
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Executive Dashboard',
      subtext: 'Macro corridor progress & KPIs',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'project' as ActiveTab,
      label: 'Corridor Project View',
      subtext: 'Patna Ring Road (Phase II)',
      icon: MapPin,
      badge: '38.4 km'
    },
    {
      id: 'gis' as ActiveTab,
      label: 'GIS Land Map',
      subtext: 'Cadastral polygons & 60m RoW',
      icon: Compass,
      badge: 'Interactive'
    },
    {
      id: 'parcels' as ActiveTab,
      label: 'Parcel Digital Twins',
      subtext: '360° Land Dossiers & 3A-3E',
      icon: FileSpreadsheet,
      badge: '482'
    },
    {
      id: 'verification' as ActiveTab,
      label: 'Field Verification',
      subtext: 'Amin DGPS inspection & mobile mode',
      icon: ClipboardCheck,
      badge: currentOfficer.role === 'AMIN' ? 'Active' : null,
      highlight: currentOfficer.role === 'AMIN'
    },
    {
      id: 'ai-risk' as ActiveTab,
      label: 'AI Risk Radar',
      subtext: 'Litigation, encroachment & delays',
      icon: BrainCircuit,
      badge: 'AI v2.4'
    },
    {
      id: 'decision' as ActiveTab,
      label: 'Decision Cockpit',
      subtext: 'CALA awards & sanction orders',
      icon: Gavel,
      badge: currentOfficer.role === 'CALA' ? 'Action Req' : null,
      highlight: currentOfficer.role === 'CALA'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 shadow-lg select-none">
      {/* Navigation Group */}
      <div className="py-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Platform Modules
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            GovTech
          </span>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-all ${
                  isActive
                    ? 'bg-gov-navy text-white font-semibold shadow-md border-l-4 border-amber-400 pl-2.5'
                    : 'hover:bg-slate-800/80 hover:text-slate-100 text-slate-300'
                }`}
              >
                <div className={`mt-0.5 p-1 rounded ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        item.highlight 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                    {item.subtext}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* SIH 2026 Innovation Banner */}
        <div className="mt-6 mx-3 p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] mb-1">
            <Sparkles size={14} />
            SIH 2026 Differentiator
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Every parcel has a <strong className="text-white">Parcel Digital Twin</strong> synchronizing GIS + 3A-3E statutory stages + compensation + field inspections + AI risk score.
          </p>
        </div>
      </div>

      {/* Footer System Status & Reset */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Offline-Ready Prototype
          </span>
          <span className="text-slate-500 font-mono">v1.0.0</span>
        </div>

        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700"
          title="Reset sample data to initial state"
        >
          <RotateCcw size={13} />
          Reset Demo Data
        </button>
      </div>
    </aside>
  );
};
