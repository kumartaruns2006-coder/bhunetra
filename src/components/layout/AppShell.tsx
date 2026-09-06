import React, { useState, useEffect } from 'react';
import { User, UserRole, NavModuleId } from '../../types/auth';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AccessDenied } from '../security/AccessDenied';
import { Drawer } from '../ui/Drawer';
import { i18n } from '../../services/i18nService';

interface AppShellProps {
  currentUser: User;
  activeModule: NavModuleId;
  onSelectModule: (module: NavModuleId) => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  onResetData?: () => void;
  onOpenFlagshipTwin?: () => void;
  onSearchParcel?: (query: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentUser,
  activeModule,
  onSelectModule,
  onLogout,
  onSwitchRole,
  onResetData,
  onOpenFlagshipTwin,
  onSearchParcel,
  children
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(currentUser.stateScope || 'Bihar');
  const [selectedDistrict, setSelectedDistrict] = useState(currentUser.districtScope || 'Patna');
  const [currentLang, setCurrentLang] = useState(i18n.getLanguage());

  useEffect(() => {
    const unsub = i18n.subscribe(setCurrentLang);
    return unsub;
  }, []);

  const moduleTitles: Record<NavModuleId, string> = {
    dashboard: currentLang === 'hi' ? 'राष्ट्रीय भूमि अधिग्रहण निगरानी (डैशबोर्ड)' : 'National Land Acquisition Monitoring',
    projects: currentLang === 'hi' ? 'परियोजना प्रस्ताव एवं अनुमोदन' : 'Project Proposals & Approvals',
    gis: currentLang === 'hi' ? 'जीआईएस भू-मानचित्र बुद्धिमत्ता' : 'GIS Cadastral Land Intelligence',
    workflow: currentLang === 'hi' ? 'वैधानिक अधिग्रहण कार्यप्रवाह (15 चरण)' : 'End-to-End Statutory Acquisition Workflow (15 Stages)',
    documents: currentLang === 'hi' ? 'डिजिटल दस्तावेज़ रिपॉजिटरी' : 'Statutory Digital Document Locker',
    field_verification: currentLang === 'hi' ? 'अमीन एवं ज़मीनी सत्यापन' : 'Amin & Field Ground-Truth Verification',
    compensation_rr: currentLang === 'hi' ? 'मुआवज़ा एवं पुनर्वास अधिनिर्णय' : 'Statutory Compensation & R&R Awards',
    alerts: currentLang === 'hi' ? 'महत्वपूर्ण बाधा एवं विवाद चेतावनी' : 'Critical Bottleneck & Litigation Alerts',
    ai_intelligence: currentLang === 'hi' ? 'पूर्वानुमानित जोखिम एवं विलंब विश्लेषण' : 'Predictive AI Risk & Delay Engine',
    reports_mis: currentLang === 'hi' ? 'प्रगति रिपोर्ट एवं एमआईएस' : 'Corridor Progress Reports & MIS',
    executive_dashboard: currentLang === 'hi' ? 'राष्ट्रीय कार्यकारी निर्णय कॉकपिट' : 'Executive Macro Decision Cockpit',
    administration: currentLang === 'hi' ? 'प्रशासन, सुरक्षा एवं स्केलेबिलिटी विन्यास' : 'National Platform Administration & RBAC',
    citizen: currentLang === 'hi' ? 'नागरिक एवं भूस्वामी पारदर्शिता पोर्टल' : 'Citizen Landowner Transparency Portal'
  };

  const isModuleAccessible = currentUser.allowedModules.includes(activeModule);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-gov-navy selection:text-white">
      {/* Top Header Bar */}
      <TopBar
        currentUser={currentUser}
        activeModule={activeModule}
        pageTitle={moduleTitles[activeModule] || 'BhuNetra'}
        onLogout={onLogout}
        onSwitchRole={onSwitchRole}
        onToggleMobileDrawer={() => setMobileDrawerOpen(!mobileDrawerOpen)}
        selectedState={selectedState}
        onStateChange={setSelectedState}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onOpenFlagshipTwin={onOpenFlagshipTwin}
        onSearchParcel={onSearchParcel}
        onNavigateModule={onSelectModule}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-[calc(100vh-85px)]">
          <Sidebar
            activeModule={activeModule}
            onSelectModule={onSelectModule}
            currentUser={currentUser}
            onResetData={onResetData}
            onOpenFlagshipTwin={onOpenFlagshipTwin}
          />
        </div>

        {/* Mobile Slide-over Drawer Sidebar */}
        <Drawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          position="left"
          title="BhuNetra Navigation"
          width="max-w-xs"
        >
          <div className="h-full">
            <Sidebar
              activeModule={activeModule}
              onSelectModule={onSelectModule}
              currentUser={currentUser}
              onResetData={onResetData}
              onOpenFlagshipTwin={onOpenFlagshipTwin}
              onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
            />
          </div>
        </Drawer>

        {/* Dynamic Center Stage Content with RBAC Guard */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-0">
          {isModuleAccessible ? (
            children
          ) : (
            <AccessDenied
              user={currentUser}
              moduleName={moduleTitles[activeModule]}
              onGoBack={() => {
                const firstAllowed = currentUser.allowedModules[0] || 'dashboard';
                onSelectModule(firstAllowed);
              }}
              onSwitchRole={() => onSwitchRole('NATIONAL_ADMIN')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
