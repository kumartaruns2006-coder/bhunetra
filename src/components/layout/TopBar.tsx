import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, NavModuleId } from '../../types/auth';
import { SessionIndicator } from '../security/SessionIndicator';
import { LastLoginBadge } from '../security/LastLoginBadge';
import { notificationService } from '../../services/notificationService';
import { AlertItem } from '../../types/alertNotification';
import { i18n, SupportedLanguage } from '../../services/i18nService';
import { ALL_INDIA_STATES_AND_UTS, getDistrictsForState } from '../../data/allIndiaData';
import { 
  Search, 
  Bell, 
  LogOut, 
  Menu, 
  ChevronDown, 
  UserCheck, 
  ShieldCheck, 
  SlidersHorizontal,
  ExternalLink,
  CheckCircle2,
  Check,
  Languages,
  Users
} from 'lucide-react';
import { mockUsers } from '../../data/mockUsers';

interface TopBarProps {
  currentUser: User;
  activeModule: NavModuleId;
  pageTitle: string;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  onToggleMobileDrawer: () => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  onOpenFlagshipTwin?: () => void;
  onSearchParcel?: (query: string) => void;
  onNavigateModule?: (module: NavModuleId) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  activeModule,
  pageTitle,
  onLogout,
  onSwitchRole,
  onToggleMobileDrawer,
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  onOpenFlagshipTwin,
  onSearchParcel,
  onNavigateModule
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(i18n.getLanguage());

  const availableDistricts = useMemo(() => {
    const list = getDistrictsForState(selectedState);
    return list.length > 0 ? list : ['All Districts'];
  }, [selectedState]);

  // Live Alerts from notificationService
  const [alerts, setAlerts] = useState<AlertItem[]>(notificationService.getAllAlerts());

  useEffect(() => {
    const unsubscribeAlerts = notificationService.subscribe(() => {
      setAlerts(notificationService.getAllAlerts());
    });
    const unsubscribeLang = i18n.subscribe(setCurrentLang);
    return () => {
      unsubscribeAlerts();
      unsubscribeLang();
    };
  }, []);

  const unreadAlerts = alerts.filter(a => a.state === 'UNREAD');
  const unreadCount = unreadAlerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && a.state !== 'RESOLVED').length;

  return (
    <header className="bg-gov-navy text-white sticky top-0 z-40 shadow-md border-b border-gov-navy-light/40">
      {/* Top Security & Ministry Identity Ribbon */}
      <div className="bg-gov-navy-dark px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-300 border-b border-slate-700/50 gap-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMobileDrawer}
            className="md:hidden text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-1.5 font-medium tracking-wide text-slate-200 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            GOVERNMENT OF INDIA &bull; MoRTH &bull; PM GATISHAKTI
          </div>
        </div>

        {/* Security & Last Login Badges */}
        <div className="flex items-center gap-4 text-[11px]">
          <LastLoginBadge user={currentUser} className="hidden lg:flex" />
          <SessionIndicator />
        </div>
      </div>

      {/* Main Top Navigation Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Active Page Title & Jurisdiction */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {pageTitle}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Tier-{currentUser.scope}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5">
              Scope: <strong className="text-white">{currentUser.jurisdiction}</strong>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-xs md:max-w-sm mx-2">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim() && onSearchParcel) {
                  onSearchParcel(searchQuery.trim());
                }
              }}
              placeholder={i18n.t('header.search_placeholder')}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/90 text-xs rounded-lg border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Right Tools: Language Toggle, Digital Twin K-125/2, State/District Selector, Notifications, Role, Profile */}
        <div className="flex items-center gap-2">
          {/* Language Selector (EN | हिन्दी) */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs shadow-inner">
            <button
              type="button"
              onClick={() => i18n.setLanguage('en')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                currentLang === 'en'
                  ? 'bg-gov-navy-light text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              <Languages size={11} />
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => i18n.setLanguage('hi')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                currentLang === 'hi'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="हिन्दी में बदलें (Switch to Hindi)"
            >
              <span>हिन्दी</span>
            </button>
          </div>

          {/* Flagship Digital Twin Quick Launcher */}
          {onOpenFlagshipTwin && (
            <button
              onClick={onOpenFlagshipTwin}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-gov-navy hover:from-blue-600 hover:to-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border border-blue-400/40"
              title="Open Part 5 Flagship Parcel Digital Twin (K-125/2)"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{i18n.t('header.digital_twin_quick')}</span>
            </button>
          )}

          {/* State / District Selector (All 28 States & 8 UTs Dynamic Cascading) */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
            <select
              aria-label="Filter State"
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                onStateChange(newState);
                const dists = getDistrictsForState(newState);
                if (dists.length > 0) {
                  onDistrictChange(dists[0]);
                }
              }}
              className="bg-transparent text-white font-medium text-[11px] focus:outline-none cursor-pointer pr-1 max-w-[125px] truncate"
            >
              {ALL_INDIA_STATES_AND_UTS.map((st) => (
                <option key={st.code} value={st.name} className="bg-slate-900 text-white">
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
            <span className="text-slate-600">/</span>
            <select
              aria-label="Filter District"
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-transparent text-white font-medium text-[11px] focus:outline-none cursor-pointer pr-1 max-w-[115px] truncate"
            >
              {availableDistricts.map((d: string) => (
                <option key={d} value={d} className="bg-slate-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Role Quick Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleSwitcher(!showRoleSwitcher);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
              title="Switch demo role"
            >
              <UserCheck size={14} />
              <span className="hidden xl:inline">Role: {currentUser.roleTitle.split(' ')[0]}</span>
              <ChevronDown size={12} />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Officer Persona (9 Roles)
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 text-xs">
                  {mockUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchRole(u.role);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                        u.role === currentUser.role ? 'bg-blue-50/80 font-bold text-gov-navy' : ''
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 flex-shrink-0 mt-0.5">
                        {u.avatarInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{u.roleTitle}</span>
                          {u.role === currentUser.role && (
                            <CheckCircle2 size={13} className="text-emerald-600" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{u.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Center Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleSwitcher(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative"
              title="Official alerts & statutory notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center text-white ${
                  criticalCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in zoom-in-95 duration-150 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Bell size={13} className="text-amber-500" />
                    <span>Statutory Alerts & Notifications</span>
                  </div>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {unreadCount} Unread
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      All Clear
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto text-xs">
                  {unreadAlerts.slice(0, 5).map((a) => (
                    <div 
                      key={a.id} 
                      className={`p-2.5 rounded-xl transition-all border ${
                        a.severity === 'CRITICAL' ? 'bg-rose-50/70 border-rose-200' :
                        a.severity === 'HIGH' ? 'bg-amber-50/70 border-amber-200' :
                        'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-0.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          a.severity === 'CRITICAL' ? 'bg-rose-200 text-rose-900' :
                          a.severity === 'HIGH' ? 'bg-amber-200 text-amber-900' :
                          'bg-blue-100 text-blue-900'
                        }`}>
                          {a.severity}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">{a.createdAt}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{a.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{a.projectId} {a.parcelId ? `• Khasra ${a.khasraNo}` : ''}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                        <button
                          onClick={() => {
                            notificationService.markAsRead(a.id);
                          }}
                          className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <Check size={11} /> Mark Read
                        </button>
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            if (onNavigateModule) onNavigateModule('alerts');
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}

                  {unreadAlerts.length === 0 && (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No unread statutory notifications.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      if (onNavigateModule) onNavigateModule('alerts');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    Open Full Notification Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Logout Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowRoleSwitcher(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left transition-colors border border-slate-700"
            >
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-amber-300">
                {currentUser.avatarInitials}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.name.split(' ')[0]}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{currentUser.roleTitle.split(' ')[0]}</div>
              </div>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-3 z-50 animate-in zoom-in-95 duration-150 text-xs">
                <div className="px-4 pb-2.5 border-b border-slate-100 space-y-0.5">
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-gov-navy font-semibold">{currentUser.roleTitle}</div>
                  <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {currentUser.officerId}</div>
                </div>

                <div className="py-2 px-3 text-[11px] text-slate-500 space-y-1">
                  <div>Department: <strong className="text-slate-700">{currentUser.department}</strong></div>
                  <div>Cadre: <strong className="text-slate-700">{currentUser.cadre}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-100 px-2">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 flex items-center gap-2 font-bold transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Logout (End Gov Session)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
