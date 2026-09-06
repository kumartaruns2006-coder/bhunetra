import React, { useState, useMemo } from 'react';
import { ProjectProposal, ProposalStatus } from '../../types/projectProposal';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { 
  Building2, 
  MapPin, 
  Filter, 
  Search, 
  PlusCircle, 
  FileCheck2, 
  GitBranch, 
  History, 
  ChevronRight, 
  ExternalLink, 
  Layers, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface ProjectProposalListProps {
  proposals: ProjectProposal[];
  onOpenCreateWizard: () => void;
  onOpenScrutiny: (proposal: ProjectProposal) => void;
  onOpenApprovalRouting: (proposal: ProjectProposal) => void;
  onOpenDetails: (proposal: ProjectProposal) => void;
  onOpenAuditLog: (proposal: ProjectProposal) => void;
}

export const ProjectProposalList: React.FC<ProjectProposalListProps> = ({
  proposals,
  onOpenCreateWizard,
  onOpenScrutiny,
  onOpenApprovalRouting,
  onOpenDetails,
  onOpenAuditLog
}) => {
  // Filters
  const [stateFilter, setStateFilter] = useState('All States');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [projectTypeFilter, setProjectTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [riskFilter, setRiskFilter] = useState('All Risks');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique options
  const stateOptions = ['All States', ...Array.from(new Set(proposals.map(p => p.state)))];
  const departmentOptions = ['All Departments', ...Array.from(new Set(proposals.map(p => p.department)))];
  const projectTypeOptions = ['All Types', 'EXPRESSWAY', 'NATIONAL_HIGHWAY', 'FREIGHT_CORRIDOR', 'PORT_CONNECTIVITY', 'RING_ROAD', 'ECONOMIC_CORRIDOR'];
  const statusOptions = ['All Statuses', 'DRAFT', 'SUBMITTED', 'UNDER_SCRUTINY', 'CLARIFICATION_REQUIRED', 'APPROVED', 'REJECTED'];
  const riskOptions = ['All Risks', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  // Dynamic districts based on selected state
  const districtOptions = useMemo(() => {
    if (stateFilter === 'All States') {
      return ['All Districts', ...Array.from(new Set(proposals.map(p => p.district)))];
    }
    return ['All Districts', ...Array.from(new Set(proposals.filter(p => p.state === stateFilter).map(p => p.district)))];
  }, [stateFilter, proposals]);

  // Handle state change
  const handleStateChange = (st: string) => {
    setStateFilter(st);
    setDistrictFilter('All Districts');
  };

  const handleResetFilters = () => {
    setStateFilter('All States');
    setDistrictFilter('All Districts');
    setDepartmentFilter('All Departments');
    setProjectTypeFilter('All Types');
    setStatusFilter('All Statuses');
    setRiskFilter('All Risks');
    setSearchQuery('');
  };

  // Filtered proposals list
  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      if (stateFilter !== 'All States' && p.state !== stateFilter) return false;
      if (districtFilter !== 'All Districts' && p.district !== districtFilter) return false;
      if (departmentFilter !== 'All Departments' && p.department !== departmentFilter) return false;
      if (projectTypeFilter !== 'All Types' && p.projectType !== projectTypeFilter) return false;
      if (statusFilter !== 'All Statuses' && p.status !== statusFilter) return false;
      if (riskFilter !== 'All Risks' && p.riskLevel !== riskFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCode = p.code.toLowerCase().includes(q);
        const matchesId = p.id.toLowerCase().includes(q);
        const matchesDistrict = p.district.toLowerCase().includes(q);
        const matchesState = p.state.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesId && !matchesDistrict && !matchesState) {
          return false;
        }
      }
      return true;
    });
  }, [proposals, stateFilter, districtFilter, departmentFilter, projectTypeFilter, statusFilter, riskFilter, searchQuery]);

  // Counts by status
  const countsByStatus = useMemo(() => {
    return {
      total: proposals.length,
      draft: proposals.filter(p => p.status === 'DRAFT').length,
      submitted: proposals.filter(p => p.status === 'SUBMITTED').length,
      underScrutiny: proposals.filter(p => p.status === 'UNDER_SCRUTINY').length,
      clarification: proposals.filter(p => p.status === 'CLARIFICATION_REQUIRED').length,
      approved: proposals.filter(p => p.status === 'APPROVED').length,
      rejected: proposals.filter(p => p.status === 'REJECTED').length
    };
  }, [proposals]);

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success" size="sm">APPROVED</Badge>;
      case 'UNDER_SCRUTINY':
        return <Badge variant="navy" size="sm">UNDER SCRUTINY</Badge>;
      case 'SUBMITTED':
        return <Badge variant="info" size="sm">SUBMITTED</Badge>;
      case 'CLARIFICATION_REQUIRED':
        return <Badge variant="warning" size="sm">CLARIFICATION REQ.</Badge>;
      case 'REJECTED':
        return <Badge variant="danger" size="sm">REJECTED</Badge>;
      case 'DRAFT':
      default:
        return <Badge variant="default" size="sm">DRAFT</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return <Badge variant="danger" size="sm">CRITICAL</Badge>;
      case 'HIGH': return <Badge variant="warning" size="sm">HIGH</Badge>;
      case 'MEDIUM': return <Badge variant="info" size="sm">MEDIUM</Badge>;
      case 'LOW':
      default:
        return <Badge variant="success" size="sm">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Badges */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              STATUTORY PROJECT PROPOSAL & INCEPTION PORTAL
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              National Project Proposal & Approval Registry
            </h2>
            <p className="text-xs text-slate-600">
              End-to-end digital lifecycle: Proposal Submission &rarr; 5-Point Digital Scrutiny &rarr; 4-Tier Approval Routing &rarr; Gazette Sanction.
            </p>
          </div>

          <button
            onClick={onOpenCreateWizard}
            className="px-4 py-2.5 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 group"
          >
            <PlusCircle size={16} className="text-amber-400 group-hover:rotate-90 transition-transform" />
            <span>+ Create Project Proposal</span>
          </button>
        </div>

        {/* Status Category Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
          <button
            onClick={() => setStatusFilter('All Statuses')}
            className={`p-2.5 rounded-xl border text-left transition-all ${statusFilter === 'All Statuses' ? 'bg-gov-navy text-white border-gov-navy shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
          >
            <div className="text-[10px] font-bold uppercase opacity-80">All Proposals</div>
            <div className="text-lg font-black">{countsByStatus.total}</div>
          </button>

          <button
            onClick={() => setStatusFilter('SUBMITTED')}
            className={`p-2.5 rounded-xl border text-left transition-all ${statusFilter === 'SUBMITTED' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
          >
            <div className="text-[10px] font-bold uppercase text-blue-700 opacity-90">Submitted</div>
            <div className="text-lg font-black">{countsByStatus.submitted}</div>
          </button>

          <button
            onClick={() => setStatusFilter('UNDER_SCRUTINY')}
            className={`p-2.5 rounded-xl border text-left transition-all ${statusFilter === 'UNDER_SCRUTINY' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
          >
            <div className="text-[10px] font-bold uppercase text-indigo-700 opacity-90">Under Scrutiny</div>
            <div className="text-lg font-black">{countsByStatus.underScrutiny}</div>
          </button>

          <button
            onClick={() => setStatusFilter('CLARIFICATION_REQUIRED')}
            className={`p-2.5 rounded-xl border text-left transition-all ${statusFilter === 'CLARIFICATION_REQUIRED' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
          >
            <div className="text-[10px] font-bold uppercase text-amber-700 opacity-90">Clarification</div>
            <div className="text-lg font-black">{countsByStatus.clarification}</div>
          </button>

          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`p-2.5 rounded-xl border text-left transition-all ${statusFilter === 'APPROVED' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
          >
            <div className="text-[10px] font-bold uppercase text-emerald-700 opacity-90">Approved</div>
            <div className="text-lg font-black">{countsByStatus.approved}</div>
          </button>

          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`p-2.5 rounded-xl border text-left transition-all ${statusFilter === 'REJECTED' ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
          >
            <div className="text-[10px] font-bold uppercase text-red-700 opacity-90">Rejected</div>
            <div className="text-lg font-black">{countsByStatus.rejected}</div>
          </button>

          <button
            onClick={() => setStatusFilter('DRAFT')}
            className={`p-2.5 rounded-xl border text-left transition-all ${statusFilter === 'DRAFT' ? 'bg-slate-700 text-white border-slate-700 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
          >
            <div className="text-[10px] font-bold uppercase text-slate-500 opacity-90">Drafts</div>
            <div className="text-lg font-black">{countsByStatus.draft}</div>
          </button>
        </div>
      </div>

      {/* 6 Filters Ribbon */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter size={15} className="text-gov-navy" />
            <span>Proposal Directory Filters (6 Dimensions)</span>
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
          >
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">State</label>
            <select
              value={stateFilter}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
            >
              {stateOptions.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          {/* 2. District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">District</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
            >
              {districtOptions.map(dst => <option key={dst} value={dst}>{dst}</option>)}
            </select>
          </div>

          {/* 3. Department */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
            >
              {departmentOptions.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>

          {/* 4. Project Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Project Type</label>
            <select
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
            >
              {projectTypeOptions.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          {/* 5. Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          {/* 6. Risk */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Risk</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
            >
              {riskOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Search Box */}
        <div className="pt-2 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Project Name, ID, Code, State, District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            Showing {filteredProposals.length} of {proposals.length} Proposals
          </span>
        </div>
      </div>

      {/* 11 COLUMNS PROJECT TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-3">Project ID</th>
                <th className="py-3.5 px-4">Project Name</th>
                <th className="py-3.5 px-3">Department</th>
                <th className="py-3.5 px-3">State</th>
                <th className="py-3.5 px-3">District</th>
                <th className="py-3.5 px-3">Land Required</th>
                <th className="py-3.5 px-3 text-center">Parcels</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Progress</th>
                <th className="py-3.5 px-3 text-center">Risk</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 text-xs">
                    No project proposals match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    {/* 1. Project ID */}
                    <td className="py-3 px-3 font-mono font-bold text-gov-navy">
                      {p.id}
                      <div className="text-[10px] text-slate-400 font-normal">{p.code}</div>
                    </td>

                    {/* 2. Project Name */}
                    <td className="py-3 px-4 max-w-xs">
                      <button
                        onClick={() => onOpenDetails(p)}
                        className="text-left font-bold text-slate-900 hover:text-gov-navy hover:underline"
                      >
                        {p.name}
                      </button>
                      <div className="text-[10px] text-slate-500">
                        {p.corridorLengthKm} km &bull; {p.projectType.replace(/_/g, ' ')}
                      </div>
                    </td>

                    {/* 3. Department */}
                    <td className="py-3 px-3 text-slate-700 font-semibold">
                      {p.department}
                    </td>

                    {/* 4. State */}
                    <td className="py-3 px-3 text-slate-800">
                      {p.state}
                    </td>

                    {/* 5. District */}
                    <td className="py-3 px-3 text-slate-600">
                      {p.district}
                    </td>

                    {/* 6. Land Required */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {p.totalLandRequiredAcres.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">Acres</span>
                    </td>

                    {/* 7. Parcels */}
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {p.estimatedParcelsCount}
                    </td>

                    {/* 8. Status */}
                    <td className="py-3 px-3">
                      {getStatusBadge(p.status)}
                    </td>

                    {/* 9. Progress */}
                    <td className="py-3 px-3">
                      <div className="w-20 space-y-1">
                        <span className="text-[10px] font-bold text-slate-700">{p.progressPercent}%</span>
                        <Progress value={p.progressPercent} variant="emerald" size="sm" />
                      </div>
                    </td>

                    {/* 10. Risk */}
                    <td className="py-3 px-3 text-center">
                      {getRiskBadge(p.riskLevel)}
                    </td>

                    {/* 11. Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Scrutiny */}
                        <button
                          onClick={() => onOpenScrutiny(p)}
                          title="Digital Scrutiny Station"
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition-colors"
                        >
                          <FileCheck2 size={14} />
                        </button>

                        {/* Approval Routing */}
                        <button
                          onClick={() => onOpenApprovalRouting(p)}
                          title="Approval Routing Pipeline"
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                        >
                          <GitBranch size={14} />
                        </button>

                        {/* Audit Log */}
                        <button
                          onClick={() => onOpenAuditLog(p)}
                          title="Immutable Audit Log"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                        >
                          <History size={14} />
                        </button>

                        {/* View Technical Details */}
                        <button
                          onClick={() => onOpenDetails(p)}
                          title="Corridor Technical Dossier"
                          className="px-2 py-1 bg-gov-navy hover:bg-gov-navy-light text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
