import React, { useState, useEffect } from 'react';
import { User, NavModuleId } from '../../types/auth';
import { i18n } from '../../services/i18nService';
import { 
  LayoutDashboard, 
  MapPin, 
  Compass, 
  GitFork, 
  FolderArchive, 
  ClipboardCheck, 
  IndianRupee, 
  Bell, 
  BrainCircuit, 
  FileSpreadsheet, 
  BarChart3, 
  Settings, 
  Lock,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SidebarProps {
  activeModule: NavModuleId;
  onSelectModule: (module: NavModuleId) => void;
  currentUser: User;
  onResetData?: () => void;
  onCloseMobileDrawer?: () => void;
  onOpenFlagshipTwin?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  currentUser,
  onResetData,
  onCloseMobileDrawer,
  onOpenFlagshipTwin
}) => {
  const [, setLang] = useState(i18n.getLanguage());

  useEffect(() => {
    const unsub = i18n.subscribe(() => setLang(i18n.getLanguage()));
    return unsub;
  }, []);

  const navItems: { id: NavModuleId; label: string; icon: any; requiredScope?: string }[] = [
    { id: 'citizen', label: 'Citizen Landowner Portal', icon: Sparkles },
    { id: 'dashboard', label: i18n.t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'projects', label: i18n.t('nav.projects'), icon: MapPin },
    { id: 'gis', label: i18n.t('nav.gis'), icon: Compass },
    { id: 'workflow', label: i18n.t('nav.workflow'), icon: GitFork },
    { id: 'documents', label: i18n.t('nav.documents'), icon: FolderArchive },
    { id: 'field_verification', label: i18n.t('nav.field_verification'), icon: ClipboardCheck },
    { id: 'compensation_rr', label: i18n.t('nav.compensation_rr'), icon: IndianRupee },
    { id: 'alerts', label: i18n.t('nav.alerts'), icon: Bell },
    { id: 'ai_intelligence', label: i18n.t('nav.ai_intelligence'), icon: BrainCircuit },
    { id: 'reports_mis', label: i18n.t('nav.reports_mis'), icon: FileSpreadsheet },
    { id: 'executive_dashboard', label: i18n.t('nav.executive_dashboard'), icon: BarChart3 },
    { id: 'administration', label: i18n.t('nav.administration'), icon: Settings, requiredScope: 'National Admin' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 shadow-xl select-none h-full">
      {/* Platform Branding Snippet */}
      <div>
        <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-amber-400/40 flex-shrink-0">
              <img src="/logo.png" alt="BhuNetra Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-black text-white tracking-tight block truncate">BhuNetra</span>
              <span className="text-[10px] text-amber-300 font-semibold block truncate">Land Intelligence Platform</span>
            </div>
          </div>
        </div>

        {/* Central Innovation: Parcel Digital Twin Feature Card */}
        <div className="mx-2 mt-2 mb-1 p-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-gov-navy border border-amber-400/40 rounded-xl shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              CENTRAL INNOVATION
            </span>
            <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
              K-125/2
            </span>
          </div>
          <div className="text-xs font-black text-white mt-1">Parcel Digital Twin</div>
          <div className="text-[10px] text-slate-300 leading-tight mt-0.5">
            One parcel = one complete record
          </div>
          <button
            onClick={() => {
              if (onOpenFlagshipTwin) onOpenFlagshipTwin();
              if (onCloseMobileDrawer) onCloseMobileDrawer();
            }}
            className="mt-2 w-full py-1.5 px-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <span>Open K-125/2 Twin</span>
            <span className="text-[10px]">&rarr;</span>
          </button>
        </div>

        {/* 12 Module Navigation List */}
        <div className="py-2 px-2 overflow-y-auto max-h-[calc(100vh-320px)] space-y-0.5">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Platform Modules (12)</span>
            <span className="text-slate-500 font-mono">RBAC</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isAccessible = currentUser.allowedModules.includes(item.id);
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-2.5 transition-all text-xs ${
                  isActive
                    ? 'bg-gov-navy text-white font-bold shadow-sm border-l-4 border-amber-400 pl-2'
                    : isAccessible
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-500 hover:bg-slate-800/40 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1 rounded ${isActive ? 'text-amber-400' : isAccessible ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Icon size={16} />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {!isAccessible && (
                  <span title="Access restricted by role" className="text-slate-600 flex-shrink-0">
                    <Lock size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Indicator Capsule & Demo Reset */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-xs space-y-2">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Session Role
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="font-bold text-white truncate">{currentUser.roleTitle}</div>
          <div className="text-[10px] text-slate-400 truncate">{currentUser.jurisdiction}</div>
        </div>

        {onResetData && (
          <button
            onClick={onResetData}
            className="w-full py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <RotateCcw size={12} />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>
    </aside>
  );
};
