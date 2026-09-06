import React, { useState } from 'react';
import { User } from '../../types/auth';
import { mockUsers } from '../../data/mockUsers';
import { Parcel } from '../../types/parcel';
import { ProjectCorridor } from '../../types/project';
import { DataIntegrationModule } from './DataIntegrationModule';
import { SecurityGovernanceView } from './SecurityGovernanceView';
import { PlatformConfigurationView } from './PlatformConfigurationView';
import { 
  Settings, 
  Users, 
  ShieldCheck, 
  Database, 
  Lock,
  CheckCircle2,
  Sliders,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AdministrationViewProps {
  currentUser: User;
  parcels?: Parcel[];
  projects?: ProjectCorridor[];
  onOpenDigitalTwin?: (parcel: Parcel) => void;
  onSwitchRole?: (user: User) => void;
  onNavigateModule?: (module: string) => void;
}

export const AdministrationView: React.FC<AdministrationViewProps> = ({ 
  currentUser,
  parcels = [],
  projects = [],
  onOpenDigitalTwin,
  onSwitchRole,
  onNavigateModule
}) => {
  const [adminSection, setAdminSection] = useState<'CONFIG_SCALABILITY' | 'SECURITY_GOVERNANCE' | 'DATA_INTEGRATION'>('CONFIG_SCALABILITY');

  // =========================================================================
  // FEATURE 7: ACCESS DENIED IF FIELD OFFICER ATTEMPTS ADMINISTRATION PAGE
  // =========================================================================
  if (currentUser.role === 'FIELD_OFFICER') {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl border-2 border-red-300 p-8 shadow-xl text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 border-4 border-red-200 flex items-center justify-center text-red-600 shadow-inner">
            <Lock size={36} className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider">
              HTTP 403 &bull; STATUTORY SECURITY GATEWAY
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Access Restricted
            </h1>
            <p className="text-lg font-bold text-red-700">
              You do not have permission.
            </p>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
              Your active credential role is <strong>{currentUser.roleTitle}</strong> ({currentUser.name}).
              Administration, statutory data integration, and platform security controls require State or National Administrative clearance.
            </p>
          </div>

          {/* Permitted Modules Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-lg mx-auto text-left space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase block">
              Permitted Modules For Field Officers:
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> Field Verification Station
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> GIS Cadastral Map
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1">
                <CheckCircle2 size={12} /> Document Locker
              </span>
            </div>
          </div>

          {/* Navigation & Role Restoration Actions */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            {onNavigateModule && (
              <Button
                variant="gov-navy"
                size="md"
                onClick={() => onNavigateModule('field_verification')}
                className="font-bold shadow-md"
              >
                Return to Field Verification Station
              </Button>
            )}

            {onSwitchRole && (
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  const adminUser = mockUsers.find(u => u.role === 'NATIONAL_ADMIN') || mockUsers[0];
                  onSwitchRole(adminUser);
                }}
                className="border-slate-300 hover:bg-slate-100 font-bold"
              >
                Switch to National Administrator
              </Button>
            )}
          </div>

          {/* Feature 8 Note */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            <strong>Security Notice:</strong> Prototype security controls demonstrate architecture and workflow; production deployment would require government-approved infrastructure and security controls.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Administration Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <Settings size={16} className="text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Administration & Governance Gateway</h3>
            <p className="text-[11px] text-slate-500">Governing Officer: <strong>{currentUser.name}</strong> ({currentUser.designation})</p>
          </div>
        </div>

        {/* Section Toggle Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs">
          <button
            onClick={() => setAdminSection('CONFIG_SCALABILITY')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              adminSection === 'CONFIG_SCALABILITY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe size={13} className={adminSection === 'CONFIG_SCALABILITY' ? 'text-indigo-600' : 'text-slate-400'} />
            <span>Part 15: Scalability & Config</span>
          </button>

          <button
            onClick={() => setAdminSection('SECURITY_GOVERNANCE')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              adminSection === 'SECURITY_GOVERNANCE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={13} className={adminSection === 'SECURITY_GOVERNANCE' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Part 14: Security & Governance</span>
          </button>

          <button
            onClick={() => setAdminSection('DATA_INTEGRATION')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              adminSection === 'DATA_INTEGRATION'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database size={13} className={adminSection === 'DATA_INTEGRATION' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Part 11: APIs & Master Data</span>
          </button>
        </div>
      </div>

      {/* RENDER SECTION: CONFIGURATION & SCALABILITY (PART 15) */}
      {adminSection === 'CONFIG_SCALABILITY' && (
        <PlatformConfigurationView />
      )}

      {/* RENDER SECTION: SECURITY & GOVERNANCE (PART 14) */}
      {adminSection === 'SECURITY_GOVERNANCE' && (
        <SecurityGovernanceView
          currentUser={currentUser}
          onSwitchRole={onSwitchRole}
          onNavigateModule={onNavigateModule}
        />
      )}

      {/* RENDER SECTION: DATA INTEGRATION (PART 11) */}
      {adminSection === 'DATA_INTEGRATION' && (
        <DataIntegrationModule
          parcels={parcels}
          projects={projects}
          onOpenDigitalTwin={onOpenDigitalTwin}
        />
      )}
    </div>
  );
};
