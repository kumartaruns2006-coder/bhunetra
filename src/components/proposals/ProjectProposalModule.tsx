import React, { useState, useEffect } from 'react';
import { ProjectProposal } from '../../types/projectProposal';
import { ProjectCorridor } from '../../types/project';
import { Officer } from '../../types/officer';
import { proposalService } from '../../services/proposalService';
import { ProjectProposalList } from './ProjectProposalList';
import { CreateProjectWizard } from './CreateProjectWizard';
import { DigitalScrutinyView } from './DigitalScrutinyView';
import { ApprovalRoutingView } from './ApprovalRoutingView';
import { ProposalAuditLogModal } from './ProposalAuditLogModal';
import { ProjectView } from '../project/ProjectView';
import { 
  Building2, 
  PlusCircle, 
  FileCheck2, 
  GitBranch, 
  Layers, 
  ListOrdered,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface ProjectProposalModuleProps {
  currentProject: ProjectCorridor;
  currentOfficer: Officer;
  onNavigateTab: (tab: 'gis' | 'parcels' | 'decision') => void;
}

export const ProjectProposalModule: React.FC<ProjectProposalModuleProps> = ({
  currentProject,
  currentOfficer,
  onNavigateTab
}) => {
  const { showToast } = useToast();
  const [proposals, setProposals] = useState<ProjectProposal[]>(proposalService.getAllProposals());
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'scrutiny' | 'routing' | 'details'>('list');
  const [selectedProposal, setSelectedProposal] = useState<ProjectProposal>(proposals[0] || null);
  const [auditLogProposal, setAuditLogProposal] = useState<ProjectProposal | null>(null);

  // Subscribe to proposal service state updates
  useEffect(() => {
    const unsubscribe = proposalService.subscribe((updatedList) => {
      setProposals(updatedList);
      if (selectedProposal) {
        const refreshed = updatedList.find(p => p.id === selectedProposal.id);
        if (refreshed) setSelectedProposal(refreshed);
      }
    });
    return unsubscribe;
  }, [selectedProposal]);

  // When project is opened from dashboard or selector, focus on details
  useEffect(() => {
    if (currentProject?.id) {
      setActiveTab('details');
    }
  }, [currentProject?.id]);

  const handleOpenScrutiny = (proposal: ProjectProposal) => {
    setSelectedProposal(proposal);
    setActiveTab('scrutiny');
  };

  const handleOpenApprovalRouting = (proposal: ProjectProposal) => {
    setSelectedProposal(proposal);
    setActiveTab('routing');
  };

  const handleOpenDetails = (proposal: ProjectProposal) => {
    setSelectedProposal(proposal);
    setActiveTab('details');
  };

  const handleOpenAuditLog = (proposal: ProjectProposal) => {
    setAuditLogProposal(proposal);
  };

  const handleProposalCreated = (created: ProjectProposal) => {
    setSelectedProposal(created);
    setActiveTab('list');
  };

  const handleResetProposals = () => {
    if (window.confirm('Reset all project proposals and approval stages to synthetic defaults?')) {
      proposalService.resetToDefault();
      showToast({
        title: 'Proposals Restored',
        message: 'All 7 corridor proposals and approvals reset to default baseline',
        type: 'info'
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Module Sub-Navigation */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'list'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ListOrdered size={15} />
            <span>Proposal Directory ({proposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'create'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle size={15} className="text-amber-400" />
            <span>Create Proposal</span>
          </button>

          {selectedProposal && (
            <>
              <button
                onClick={() => setActiveTab('scrutiny')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'scrutiny'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCheck2 size={15} />
                <span>Digital Scrutiny: {selectedProposal.id}</span>
              </button>

              <button
                onClick={() => setActiveTab('routing')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'routing'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GitBranch size={15} />
                <span>Approval Routing</span>
              </button>

              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === 'details'
                    ? 'bg-gov-navy text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers size={15} />
                <span>Technical Dossier</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetProposals}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Reset Proposals to Default"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Main Tab Content Stage */}
      {activeTab === 'list' && (
        <ProjectProposalList
          proposals={proposals}
          onOpenCreateWizard={() => setActiveTab('create')}
          onOpenScrutiny={handleOpenScrutiny}
          onOpenApprovalRouting={handleOpenApprovalRouting}
          onOpenDetails={handleOpenDetails}
          onOpenAuditLog={handleOpenAuditLog}
        />
      )}

      {activeTab === 'create' && (
        <CreateProjectWizard
          onCancel={() => setActiveTab('list')}
          onSuccess={handleProposalCreated}
          currentOfficerName={currentOfficer.name}
          currentOfficerRole={currentOfficer.designation}
        />
      )}

      {activeTab === 'scrutiny' && selectedProposal && (
        <DigitalScrutinyView
          proposal={selectedProposal}
          onBack={() => setActiveTab('list')}
          onUpdated={(updated) => setSelectedProposal(updated)}
          currentOfficerName={currentOfficer.name}
          currentOfficerRole={currentOfficer.designation}
        />
      )}

      {activeTab === 'routing' && selectedProposal && (
        <ApprovalRoutingView
          proposal={selectedProposal}
          onBack={() => setActiveTab('list')}
          onUpdated={(updated) => setSelectedProposal(updated)}
          currentOfficerName={currentOfficer.name}
          currentOfficerRole={currentOfficer.designation}
        />
      )}

      {activeTab === 'details' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                Technical Corridor Engineering Dossier
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {selectedProposal ? selectedProposal.name : currentProject.name}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('list')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
            >
              &larr; Back to Proposal Directory
            </button>
          </div>

          <ProjectView
            project={currentProject}
            currentOfficer={currentOfficer}
            onNavigateTab={onNavigateTab}
          />
        </div>
      )}

      {/* Audit Log Modal */}
      <ProposalAuditLogModal
        proposal={auditLogProposal}
        onClose={() => setAuditLogProposal(null)}
      />
    </div>
  );
};
