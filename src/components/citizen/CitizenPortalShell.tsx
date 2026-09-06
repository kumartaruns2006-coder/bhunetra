import React, { useState, useEffect } from 'react';
import { User } from '../../types/auth';
import { 
  LayoutDashboard, 
  Map, 
  Clock, 
  IndianRupee, 
  Home, 
  FileText, 
  Bell, 
  Compass, 
  HelpCircle, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Globe, 
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { i18n, SupportedLanguage } from '../../services/i18nService';

export type CitizenTabId = 
  | 'dashboard'
  | 'myland'
  | 'acquisition'
  | 'compensation'
  | 'rnr'
  | 'documents'
  | 'notifications'
  | 'gis'
  | 'grievance'
  | 'profile';

interface CitizenPortalShellProps {
  currentUser: User;
  activeTab: CitizenTabId;
  onSelectTab: (tab: CitizenTabId) => void;
  onLogout: () => void;
  unreadNotificationsCount?: number;
  children: React.ReactNode;
}

export const CitizenPortalShell: React.FC<CitizenPortalShellProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  unreadNotificationsCount = 2,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(i18n.getLanguage());

  useEffect(() => {
    const unsub = i18n.subscribe(setCurrentLang);
    return unsub;
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.setLanguage(lang);
    setCurrentLang(lang);
  };

  const navItems: { id: CitizenTabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: currentLang === 'bn' ? 'ড্যাশবোর্ড' : currentLang === 'hi' ? 'डैशबोर्ड' : 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'myland', label: currentLang === 'bn' ? 'আমার জমি' : currentLang === 'hi' ? 'मेरी भूमि' : 'My Land', icon: <Map size={18} /> },
    { id: 'acquisition', label: currentLang === 'bn' ? 'অধিগ্রহণ স্থিতি' : currentLang === 'hi' ? 'अधिग्रहण स्थिति' : 'Acquisition Status', icon: <Clock size={18} /> },
    { id: 'compensation', label: currentLang === 'bn' ? 'ক্ষতিপূরণ' : currentLang === 'hi' ? 'मुआवजा' : 'Compensation', icon: <IndianRupee size={18} /> },
    { id: 'rnr', label: currentLang === 'bn' ? 'পুনর্বাসন (R&R)' : currentLang === 'hi' ? 'पुनर्वास (R&R)' : 'Rehabilitation & Resettlement', icon: <Home size={18} /> },
    { id: 'documents', label: currentLang === 'bn' ? 'নথিপত্র' : currentLang === 'hi' ? 'दस्तावेज़' : 'Documents', icon: <FileText size={18} /> },
    { id: 'notifications', label: currentLang === 'bn' ? 'বিজ্ঞপ্তি' : currentLang === 'hi' ? 'सूचनाएं' : 'Notifications', icon: <Bell size={18} />, badge: unreadNotificationsCount },
    { id: 'gis', label: currentLang === 'bn' ? 'মানচিত্রে জমি' : currentLang === 'hi' ? 'जीआईएस मानचित्र' : 'GIS Map', icon: <Compass size={18} /> },
    { id: 'grievance', label: currentLang === 'bn' ? 'সাহায্য ও অভিযোগ' : currentLang === 'hi' ? 'सहायता एवं शिकायत' : 'Help & Grievance', icon: <HelpCircle size={18} /> },
    { id: 'profile', label: currentLang === 'bn' ? 'আমার প্রোফাইল' : currentLang === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile', icon: <UserIcon size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-gov-navy selection:text-white">
      {/* ============================================================ */}
      {/* 1. CITIZEN HEADER BAR */}
      {/* ============================================================ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* National Identity Top Strip */}
        <div className="bg-gov-navy text-white px-4 sm:px-6 py-1 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide uppercase">
              Government of India &bull; Ministry of Road Transport & Highways
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
              Synthetic Demo Mode
            </span>
          </div>
        </div>

        {/* Main Citizen Header Body */}
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center border border-amber-400/40 flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="BhuNetra Emblem Logo" 
                  className="w-full h-full object-contain rounded-lg" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-gov-navy tracking-tight">
                    BhuNetra
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-gov-navy border border-blue-200">
                    Citizen / Landowner Portal
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-500" />
                  <span>
                    Location: <strong>West Bengal &rarr; North 24 Parganas / Kolkata</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Language Options, Notifications, Profile, Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold border border-slate-200">
              <Globe size={13} className="text-slate-400 ml-1 mr-1.5" />
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  currentLang === 'en' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  currentLang === 'hi' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('bn')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  currentLang === 'bn' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => onSelectTab('notifications')}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="View Citizen Notifications"
            >
              <Bell size={19} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={() => onSelectTab('profile')}
              className="hidden md:flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser.avatarInitials || 'SC'}
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <CheckCircle2 size={12} className="text-emerald-500" />
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Recorded Raiyat / Titleholder
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all text-xs font-bold flex items-center gap-1.5 shadow-xs"
              title="Secure Logout"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. BODY WORKSPACE WITH DEDICATED CITIZEN SIDEBAR */}
      {/* ============================================================ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Citizen Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 flex-shrink-0 p-3 justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Landowner Navigation
            </div>
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gov-navy text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Citizen Helpdesk Info Card */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs space-y-1.5 mt-4">
            <div className="flex items-center gap-1.5 font-bold text-gov-navy">
              <ShieldCheck size={16} className="text-blue-700" />
              <span>Direct CALA Helpline</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Need assistance with your compensation claim or land records?
            </p>
            <div className="font-mono text-xs font-black text-gov-navy">
              Toll-Free: 1800-11-2026
            </div>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-sm flex items-center justify-center border border-amber-400/40 flex-shrink-0">
                      <img 
                        src="/logo.png" 
                        alt="BhuNetra Logo" 
                        className="w-full h-full object-contain rounded-lg" 
                      />
                    </div>
                    <span className="font-black text-gov-navy text-sm">Citizen Portal</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Language Selector */}
                <div className="flex items-center justify-around bg-slate-100 rounded-xl p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded-lg ${currentLang === 'en' ? 'bg-gov-navy text-white' : 'text-slate-600'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('hi')}
                    className={`px-3 py-1 rounded-lg ${currentLang === 'hi' ? 'bg-gov-navy text-white' : 'text-slate-600'}`}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('bn')}
                    className={`px-3 py-1 rounded-lg ${currentLang === 'bn' ? 'bg-gov-navy text-white' : 'text-slate-600'}`}
                  >
                    বাংলা
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                          isActive
                            ? 'bg-gov-navy text-white shadow-sm'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout from Citizen Portal</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Center Stage Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
