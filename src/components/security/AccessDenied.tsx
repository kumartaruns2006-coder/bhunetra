import React from 'react';
import { User, NavModuleId } from '../../types/auth';
import { ShieldAlert, ArrowLeft, UserCheck, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface AccessDeniedProps {
  user: User;
  moduleName: string;
  onGoBack: () => void;
  onSwitchRole: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  user,
  moduleName,
  onGoBack,
  onSwitchRole
}) => {
  return (
    <div className="p-8 max-w-2xl mx-auto my-12 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-200 text-red-700 flex items-center justify-center mx-auto shadow-inner">
        <ShieldAlert size={36} />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200 uppercase tracking-wider">
          <Lock size={12} /> Statutory Access Restriction (403)
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Restricted Government Module: {moduleName}
        </h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          Access to this module requires specific statutory clearance under the Land Acquisition Rules. Your current authenticated role is not authorized to access this section.
        </p>
      </div>

      {/* Officer Credential Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-md mx-auto text-left text-xs space-y-2">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Authenticated Officer:</span>
          <span className="font-bold text-slate-900">{user.name}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Current Role:</span>
          <span className="font-semibold text-gov-navy">{user.roleTitle}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Jurisdiction Scope:</span>
          <span className="font-mono text-slate-800">{user.jurisdiction}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Security Clearance Level:</span>
          <span className="font-bold text-amber-700 font-mono">Tier-{user.scope}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button variant="outline" size="sm" onClick={onGoBack} leftIcon={<ArrowLeft size={14} />}>
          Return to Permitted Modules
        </Button>
        <Button variant="gov-navy" size="sm" onClick={onSwitchRole} leftIcon={<UserCheck size={14} />}>
          Switch Demo Role
        </Button>
      </div>
    </div>
  );
};
