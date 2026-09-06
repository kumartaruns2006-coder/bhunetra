import React, { useState, useMemo } from 'react';
import { User } from '../../types/auth';
import { mockUsers } from '../../data/mockUsers';
import { securityService } from '../../services/securityService';
import {
  AuditLogEntry,
  DocumentVersionAudit,
  DataAccessRule
} from '../../types/security';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  FileText,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  History,
  Eye,
  Edit3,
  CheckSquare,
  LogOut,
  Clock,
  Laptop,
  Network,
  ShieldAlert,
  Server,
  FileCheck,
  ArrowRight,
  Info,
  RefreshCw,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface SecurityGovernanceViewProps {
  currentUser: User;
  onSwitchRole?: (user: User) => void;
  onNavigateModule?: (module: string) => void;
}

export const SecurityGovernanceView: React.FC<SecurityGovernanceViewProps> = ({
  currentUser,
  onSwitchRole,
  onNavigateModule
}) => {
  // Sub-tabs in Security module
  const [activeSecurityTab, setActiveSecurityTab] = useState<'RBAC' | 'AUDIT_LOG' | 'DOC_AUDIT' | 'DATA_ACCESS' | 'SESSION'>('AUDIT_LOG');

  // Interactive filter for Audit Log
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('ALL');

  // Interactive toggle for testing Field Officer Access Denied restriction
  const [simulateFieldOfficer, setSimulateFieldOfficer] = useState(currentUser.role === 'FIELD_OFFICER');

  // Fetch security data from service
  const securityStatus = useMemo(() => securityService.getSecurityStatus(), []);
  const allAuditLogs = useMemo(() => securityService.getAuditLogs(), []);
  const documentAudits = useMemo(() => securityService.getDocumentAudits(), []);
  const dataAccessRules = useMemo(() => securityService.getDataAccessRules(), []);
  const rolePermissions = useMemo(() => securityService.getRolePermissionMatrix(), []);
  const sessionInfo = useMemo(() => securityService.getActiveSession(currentUser), [currentUser]);

  // Selected document for Version History Audit
  const [selectedDocAuditId, setSelectedDocAuditId] = useState(documentAudits[0]?.documentId);
  const activeDocAudit = useMemo(() => {
    return documentAudits.find(d => d.documentId === selectedDocAuditId) || documentAudits[0];
  }, [documentAudits, selectedDocAuditId]);

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return allAuditLogs.filter(log => {
      const matchSearch = !auditSearchQuery ||
        log.user.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        log.record.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(auditSearchQuery.toLowerCase());
      const matchModule = selectedModuleFilter === 'ALL' || log.module === selectedModuleFilter;
      return matchSearch && matchModule;
    });
  }, [allAuditLogs, auditSearchQuery, selectedModuleFilter]);

  // =========================================================================
  // FEATURE 7: ACCESS DENIED (If Field Officer attempts administration page)
  // =========================================================================
  if (currentUser.role === 'FIELD_OFFICER' || simulateFieldOfficer) {
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
              Your logged-in role is <strong>{currentUser.roleTitle}</strong> ({currentUser.name}).
              Administration, RBAC policies, and master security configurations are restricted to apex statutory authorities.
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

          {/* Interactive Navigation & Role Restoration Actions */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            {onNavigateModule && (
              <Button
                variant="gov-navy"
                size="md"
                onClick={() => onNavigateModule('field_verification')}
                className="font-bold shadow-md"
              >
                Go to Field Verification Station
              </Button>
            )}

            {/* Test Toggle to Restore Administrator */}
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSimulateFieldOfficer(false);
                if (onSwitchRole) {
                  const adminUser = mockUsers.find(u => u.role === 'NATIONAL_ADMIN') || mockUsers[0];
                  onSwitchRole(adminUser);
                }
              }}
              className="border-slate-300 hover:bg-slate-100 font-bold"
            >
              Switch Back to National Administrator
            </Button>
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
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* FEATURE 5: SECURITY STATUS (5 EXACT STATUSES FROM PROMPT)                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Authentication */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Authentication</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              {securityStatus.authentication.status}
            </span>
          </div>
          <div className="mt-2 text-sm font-black text-slate-900">2FA / Jan Parichay</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">{securityStatus.authentication.protocol}</span>
          <div className="absolute -bottom-2 -right-2 text-emerald-500/10">
            <KeyRound size={48} />
          </div>
        </div>

        {/* 2. RBAC */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>RBAC</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              {securityStatus.rbac.status}
            </span>
          </div>
          <div className="mt-2 text-sm font-black text-slate-900">{securityStatus.rbac.roleCount} Roles &bull; {securityStatus.rbac.moduleCount} Modules</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Strict Spatial & Module Scopes</span>
          <div className="absolute -bottom-2 -right-2 text-blue-500/10">
            <Users size={48} />
          </div>
        </div>

        {/* 3. Audit */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Audit Trail</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              {securityStatus.audit.status}
            </span>
          </div>
          <div className="mt-2 text-sm font-black text-slate-900">Cryptographic Logging</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Immutable SHA-256 Hashes</span>
          <div className="absolute -bottom-2 -right-2 text-purple-500/10">
            <History size={48} />
          </div>
        </div>

        {/* 4. Encryption */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Encryption</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-300">
              {securityStatus.encryption.status}
            </span>
          </div>
          <div className="mt-2 text-sm font-black text-slate-900">AES-256 / TLS 1.3</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">NICNET Gov Cloud Spec</span>
          <div className="absolute -bottom-2 -right-2 text-indigo-500/10">
            <ShieldCheck size={48} />
          </div>
        </div>

        {/* 5. API Security */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>API Security</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-300">
              {securityStatus.apiSecurity.status}
            </span>
          </div>
          <div className="mt-2 text-sm font-black text-slate-900">mTLS & HMAC Signatures</div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Rate Limited & Tokenized</span>
          <div className="absolute -bottom-2 -right-2 text-slate-500/10">
            <Server size={48} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 8: MANDATORY SECURITY NOTE (REQUIRED DISCLAIMER)                  */}
      {/* ========================================================================= */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-amber-900 shadow-xs">
        <ShieldAlert size={18} className="text-amber-700 mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <span className="font-bold uppercase tracking-wider block text-amber-950">
            Statutory Security & Compliance Governance Note
          </span>
          <p className="leading-relaxed">
            <strong>Prototype security controls demonstrate architecture and workflow; production deployment would require government-approved infrastructure and security controls.</strong>
            &nbsp;No cybersecurity certification is claimed for this prototype environment. All statutory workflows comply with preliminary STQC and MeitY e-Governance architectural guidelines.
          </p>
        </div>
      </div>

      {/* Security Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveSecurityTab('AUDIT_LOG')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSecurityTab === 'AUDIT_LOG'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History size={14} />
            Feature 2: Audit Log (9 Columns)
          </button>

          <button
            onClick={() => setActiveSecurityTab('RBAC')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSecurityTab === 'RBAC'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users size={14} />
            Feature 1: RBAC (Users & Roles)
          </button>

          <button
            onClick={() => setActiveSecurityTab('DOC_AUDIT')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSecurityTab === 'DOC_AUDIT'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck size={14} />
            Feature 3: Document Audit (Version History)
          </button>

          <button
            onClick={() => setActiveSecurityTab('DATA_ACCESS')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSecurityTab === 'DATA_ACCESS'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck size={14} />
            Feature 4: Data Access Matrix
          </button>

          <button
            onClick={() => setActiveSecurityTab('SESSION')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSecurityTab === 'SESSION'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Laptop size={14} />
            Feature 6: Active Session
          </button>
        </div>

        {/* Interactive Simulator Toggle for Feature 7 */}
        <button
          onClick={() => setSimulateFieldOfficer(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-1.5 transition-colors"
          title="Test Feature 7: Access Denied view when a Field Officer attempts administration page"
        >
          <Lock size={13} />
          <span>Test Feature 7: Access Restricted</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 2: AUDIT LOG (ALL 9 SPECIFIED COLUMNS WITH SHOWCASE ACTIONS)       */}
      {/* ========================================================================= */}
      {activeSecurityTab === 'AUDIT_LOG' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="py-4 px-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Cryptographic Statutory Audit Log</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                  9 Statutory Telemetry Columns
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Immutable chronological ledger recording all state mutations, statutory approvals, and field verifications.
              </CardDescription>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user, action, or record..."
                  value={auditSearchQuery}
                  onChange={e => setAuditSearchQuery(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gov-navy w-56"
                />
              </div>

              <select
                value={selectedModuleFilter}
                onChange={e => setSelectedModuleFilter(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
              >
                <option value="ALL">All Modules</option>
                <option value="Documents">Documents</option>
                <option value="Proposal Approval">Proposal Approval</option>
                <option value="Field Verification">Field Verification</option>
                <option value="Compensation & Escrow">Compensation & Escrow</option>
                <option value="Security & Governance">Security & Governance</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">1. User</th>
                  <th className="py-3 px-2">2. Role</th>
                  <th className="py-3 px-3">3. Action</th>
                  <th className="py-3 px-2">4. Module</th>
                  <th className="py-3 px-3">5. Record</th>
                  <th className="py-3 px-2">6. Timestamp</th>
                  <th className="py-3 px-3">7. Previous Value</th>
                  <th className="py-3 px-3">8. New Value</th>
                  <th className="py-3 px-3 text-right">9. IP / Session Demo ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    {/* 1. User */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{entry.user}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{entry.officerId}</div>
                    </td>

                    {/* 2. Role */}
                    <td className="py-3 px-2">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {entry.role}
                      </span>
                    </td>

                    {/* 3. Action */}
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <span className={`inline-flex items-center gap-1 ${
                        entry.action.includes('approved') ? 'text-emerald-700' :
                        entry.action.includes('uploaded') ? 'text-indigo-700' :
                        entry.action.includes('verified') ? 'text-blue-700' :
                        entry.action.includes('Blocked') ? 'text-red-700' : 'text-slate-800'
                      }`}>
                        {entry.action}
                      </span>
                    </td>

                    {/* 4. Module */}
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-600">
                      {entry.module}
                    </td>

                    {/* 5. Record */}
                    <td className="py-3 px-3 font-mono text-xs font-bold text-slate-900">
                      {entry.record}
                    </td>

                    {/* 6. Timestamp */}
                    <td className="py-3 px-2 text-slate-500 text-[11px] whitespace-nowrap">
                      {entry.timestamp}
                    </td>

                    {/* 7. Previous Value */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] text-slate-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded line-through">
                        {entry.previousValue}
                      </span>
                    </td>

                    {/* 8. New Value */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                        {entry.newValue}
                      </span>
                    </td>

                    {/* 9. IP / Session Demo ID */}
                    <td className="py-3 px-3 text-right font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {entry.ipSessionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 1: ROLE-BASED ACCESS CONTROL (USERS, ROLES, PERMISSIONS)          */}
      {/* ========================================================================= */}
      {activeSecurityTab === 'RBAC' && (
        <div className="space-y-6">
          {/* Registered Users Directory */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-3 px-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Registered Administrative Users & Personas ({mockUsers.length} Officers)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Statutory officers mapped to national e-governance administrative tiers
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Officer Name & Cadre</th>
                    <th className="py-3 px-3">Role Title</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Jurisdiction Scope</th>
                    <th className="py-3 px-3 text-center">Modules Allowed</th>
                    <th className="py-3 px-4 text-right">Switch / Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.officerId} &bull; {u.cadre}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gov-navy text-white">
                          {u.roleTitle}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{u.department}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{u.jurisdiction}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-gov-navy bg-slate-100 px-2 py-0.5 rounded">
                          {u.allowedModules.length} / 12 Modules
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onSwitchRole && (
                          <button
                            onClick={() => onSwitchRole(u)}
                            className="px-2.5 py-1 rounded text-[11px] font-bold border border-slate-300 hover:bg-gov-navy hover:text-white transition-colors"
                          >
                            {u.id === currentUser.id ? 'Current User' : 'Switch Role'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Role Permissions Matrix */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-3 px-5 bg-slate-50/80 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-900">
                Statutory Permissions Matrix (Role vs Module Access)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Role Title</th>
                    <th className="py-3 px-3">Security Tier</th>
                    <th className="py-3 px-2 text-center">Projects</th>
                    <th className="py-3 px-2 text-center">GIS Map</th>
                    <th className="py-3 px-2 text-center">Workflow</th>
                    <th className="py-3 px-2 text-center">Documents</th>
                    <th className="py-3 px-2 text-center">Field Verif</th>
                    <th className="py-3 px-2 text-center">Compensation</th>
                    <th className="py-3 px-2 text-center">AI Risk</th>
                    <th className="py-3 px-3 text-center">Admin & Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rolePermissions.map(rp => (
                    <tr key={rp.roleCode} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{rp.roleTitle}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {rp.tier}
                        </span>
                      </td>
                      {rp.permissions.slice(1).map(p => (
                        <td key={p.module} className="py-3 px-2 text-center">
                          {p.canApprove ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800" title="Can Approve">
                              APPROVE
                            </span>
                          ) : p.canEdit ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800" title="Can Edit">
                              EDIT
                            </span>
                          ) : p.canView ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800" title="View Only">
                              VIEW
                            </span>
                          ) : (
                            <span className="text-slate-300 font-bold text-sm">&minus;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 3: DOCUMENT AUDIT (VERSION HISTORY & SHA-256 HASHES)              */}
      {/* ========================================================================= */}
      {activeSecurityTab === 'DOC_AUDIT' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Statutory Document for Version History Audit
              </span>
              <span className="text-xs text-slate-500">Immutable document hashes and revision timestamps</span>
            </div>
            <div className="flex items-center gap-2">
              {documentAudits.map(d => (
                <button
                  key={d.documentId}
                  onClick={() => setSelectedDocAuditId(d.documentId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDocAuditId === d.documentId
                      ? 'bg-gov-navy text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {d.documentName} ({d.currentVersion})
                </button>
              ))}
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-4 px-5 bg-slate-50/80 border-b border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gov-navy" />
                    <CardTitle className="text-base font-bold text-slate-900">{activeDocAudit.documentName}</CardTitle>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                      Current Version: {activeDocAudit.currentVersion}
                    </span>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    {activeDocAudit.documentType} &bull; Project: <strong>{activeDocAudit.projectCode}</strong> {activeDocAudit.parcelId ? `• Parcel: ${activeDocAudit.parcelId}` : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeDocAudit.versions.map((ver, idx) => (
                  <div key={ver.version} className="relative group">
                    {/* Node Dot */}
                    <div className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                      idx === 0 ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-400'
                    }`}>
                      {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </div>

                    <div className="bg-slate-50/80 hover:bg-slate-100/60 transition-colors border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-gov-navy px-2 py-0.5 rounded bg-white border border-slate-300">
                            {ver.version}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{ver.action}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ver.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            ver.status === 'REPLACED' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {ver.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{ver.date}</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {ver.changeSummary}
                      </p>

                      <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                        <div>
                          <span>Uploaded By: <strong>{ver.uploadedBy}</strong></span>
                        </div>
                        <div>
                          <span>Reviewer / Approved By: <strong>{ver.reviewer}</strong></span>
                        </div>
                        <div className="sm:col-span-2 font-mono text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200 break-all">
                          <strong>SHA-256 Digest:</strong> {ver.hashSha256}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 4: DATA ACCESS MATRIX (WHO CAN VIEW, EDIT, APPROVE)               */}
      {/* ========================================================================= */}
      {activeSecurityTab === 'DATA_ACCESS' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="py-4 px-5 bg-slate-50/80 border-b border-slate-200">
            <CardTitle className="text-sm font-bold text-slate-900">
              Statutory Data Access & Modification Matrix
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Explicit jurisdictional demarcation of viewing, editorial, and statutory decree approval authorizations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Statutory Data Asset</th>
                  <th className="py-3 px-3">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Eye size={12} /> Who Can View
                    </span>
                  </th>
                  <th className="py-3 px-3">
                    <span className="flex items-center gap-1 text-blue-800">
                      <Edit3 size={12} /> Who Can Edit
                    </span>
                  </th>
                  <th className="py-3 px-4">
                    <span className="flex items-center gap-1 text-purple-800">
                      <CheckSquare size={12} /> Who Can Approve
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataAccessRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rule.assetName}</div>
                      <div className="text-[10px] text-slate-500">{rule.description}</div>
                    </td>

                    {/* Who Can View */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {rule.whoCanView.map((v, i) => (
                          <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Who Can Edit */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {rule.whoCanEdit.map((e, i) => (
                          <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            {e}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Who Can Approve */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rule.whoCanApprove.map((a, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* FEATURE 6: ACTIVE SESSION MANAGEMENT                                      */}
      {/* ========================================================================= */}
      {activeSecurityTab === 'SESSION' && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="py-4 px-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Laptop size={15} className="text-gov-navy" />
                Active Administrative Console Session
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Active security context, authentication telemetry, and token lifecycle
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-700">SESSION VALIDATED</span>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Logged In Officer</span>
                <span className="text-sm font-black text-slate-900 block mt-1">{sessionInfo.userName}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{sessionInfo.officerId}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Last Login Timestamp</span>
                <span className="text-sm font-bold text-slate-900 block mt-1">{sessionInfo.lastLogin}</span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Biometric 2FA Verified</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Session Demo ID</span>
                <span className="text-sm font-black text-gov-navy font-mono block mt-1">{sessionInfo.currentSessionId}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">IP: {sessionInfo.ipAddress}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Session Expiry</span>
                <span className="text-sm font-black text-amber-700 block mt-1">{sessionInfo.expiresInMinutes} Minutes Left</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Auto-renewal enabled</span>
              </div>
            </div>

            {/* Cryptographic Session Token & Action Buttons */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Cryptographic Session Bearer Token
                </span>
                <div className="font-mono text-xs text-slate-300">
                  {sessionInfo.sessionTokenMasked} &bull; Device: {sessionInfo.deviceFingerprint}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCw size={12} className="text-amber-300" />}
                  onClick={() => alert('Session token re-issued successfully with new HMAC nonce.')}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
                >
                  Rotate Token
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LogOut size={12} className="text-red-400" />}
                  onClick={() => alert('Administrative session terminated. Redirecting to Jan Parichay SSO Login...')}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-400/30 text-xs font-bold"
                >
                  Logout Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
