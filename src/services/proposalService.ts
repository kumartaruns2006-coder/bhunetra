import { 
  ProjectProposal, 
  ProposalStatus, 
  ScrutinyChecklistItem, 
  RoutingStageKey, 
  ProposalAuditLogEntry 
} from '../types/projectProposal';
import { mockProjectProposals, createStandardApprovalStages, defaultScrutinyChecklist } from '../data/mockProjectProposals';

const STORAGE_KEY = 'bhunetra_project_proposals_v1';

class ProposalService {
  private proposals: ProjectProposal[] = [];
  private listeners: ((proposals: ProjectProposal[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.proposals = JSON.parse(saved);
      } else {
        this.proposals = [...mockProjectProposals];
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Failed to load proposals from storage:', e);
      this.proposals = [...mockProjectProposals];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.proposals));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save proposals to storage:', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.proposals));
  }

  public subscribe(listener: (proposals: ProjectProposal[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.proposals);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== listener);
    };
  }

  public getAllProposals(): ProjectProposal[] {
    return [...this.proposals];
  }

  public getProposalById(id: string): ProjectProposal | null {
    return this.proposals.find(p => p.id === id || p.code === id) || null;
  }

  public createProposal(
    proposalData: Partial<ProjectProposal>, 
    officerName = 'Authorized Implementing Officer', 
    officerRole = 'Project Director'
  ): ProjectProposal {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const newId = `PRJ-2026-${String(this.proposals.length + 1).padStart(3, '0')}`;
    const newCode = proposalData.code || `NHAI-${proposalData.state?.slice(0, 2).toUpperCase() || 'IN'}-${newId}`;

    const newAuditEntry: ProposalAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      action: 'PROPOSAL_SUBMITTED',
      actor: officerName,
      role: officerRole,
      previousStatus: 'DRAFT',
      newStatus: 'SUBMITTED',
      remarks: `New infrastructure corridor proposal officially submitted for statutory scrutiny.`,
      digitalSealHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`
    };

    const newProposal: ProjectProposal = {
      id: newId,
      code: newCode,
      name: proposalData.name || 'New Highway Corridor Project',
      department: proposalData.department || 'MoRTH / NHAI',
      projectType: proposalData.projectType || 'NATIONAL_HIGHWAY',
      state: proposalData.state || 'Bihar',
      district: proposalData.district || 'Patna',
      subDistricts: proposalData.subDistricts || ['Patna Sadar'],
      implementingAgency: proposalData.implementingAgency || 'NHAI Regional Office',
      description: proposalData.description || 'Statutory alignment proposed under PM GatiShakti National Master Plan.',
      totalLandRequiredAcres: Number(proposalData.totalLandRequiredAcres) || 450,
      estimatedParcelsCount: Number(proposalData.estimatedParcelsCount) || 360,
      landType: proposalData.landType || 'AGRICULTURAL',
      corridorLengthKm: Number(proposalData.corridorLengthKm) || 42.0,
      rightOfWayWidthM: Number(proposalData.rightOfWayWidthM) || 60,
      proposalDate: proposalData.proposalDate || new Date().toISOString().split('T')[0],
      targetDate: proposalData.targetDate || '2027-06-30',
      milestones: proposalData.milestones && proposalData.milestones.length > 0 ? proposalData.milestones : [
        { id: 'ms-1', title: 'Section 3A Gazette Notification', targetDate: '2026-10-15', stageRef: 'Sec 3A' },
        { id: 'ms-2', title: 'Joint Measurement Survey (JMS)', targetDate: '2026-12-01', stageRef: 'RFCTLARR Sec 12' },
        { id: 'ms-3', title: 'Section 3D Declaration Publication', targetDate: '2027-02-15', stageRef: 'Sec 3D' },
        { id: 'ms-4', title: 'Section 3G Compensation Award', targetDate: '2027-04-30', stageRef: 'Sec 3G' }
      ],
      documents: proposalData.documents && proposalData.documents.length > 0 ? proposalData.documents : [
        { id: 'doc-1', type: 'PROJECT_PROPOSAL', title: 'Detailed Project Report (DPR)', fileName: `${newId}_DPR_Final.pdf`, fileSize: '12.4 MB', uploadedAt: timestamp, verified: true },
        { id: 'doc-2', type: 'LAND_REQUIREMENT_DOC', title: 'Land Requirement Justification Schedule', fileName: `${newId}_Land_Schedule.pdf`, fileSize: '5.2 MB', uploadedAt: timestamp, verified: true },
        { id: 'doc-3', type: 'PROJECT_MAP', title: 'Corridor Alignment Map (KML/GIS)', fileName: `${newId}_Alignment.kml`, fileSize: '3.1 MB', uploadedAt: timestamp, verified: true }
      ],
      scrutinyChecklist: defaultScrutinyChecklist.map(c => ({
        ...c,
        status: 'PENDING' as const,
        remarks: 'Awaiting preliminary officer scrutiny check.'
      })),
      scrutinyRemarks: 'Proposal submitted to Ministry portal. Queued for digital scrutiny.',
      approvalStages: createStandardApprovalStages(
        `District Collector, ${proposalData.district || 'Patna'}`, 'DM',
        `Principal Secretary (Revenue), ${proposalData.state || 'Bihar'}`, 'IAS',
        'Joint Secretary (Highways), MoRTH', 'Central Authority'
      ),
      currentApprovalStage: 'DISTRICT_REVIEW',
      status: 'SUBMITTED',
      progressPercent: 20,
      riskLevel: 'LOW',
      estimatedCostCr: Number(proposalData.estimatedCostCr) || 350.0,
      auditTrail: [newAuditEntry]
    };

    this.proposals = [newProposal, ...this.proposals];
    this.saveToStorage();
    return newProposal;
  }

  public updateScrutinyChecklist(
    proposalId: string, 
    checklist: ScrutinyChecklistItem[], 
    remarks: string,
    officerName = 'Reviewing Scrutiny Officer',
    officerRole = 'Director (Scrutiny)'
  ): ProjectProposal {
    const proposal = this.getProposalById(proposalId);
    if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const hasFail = checklist.some(c => c.status === 'FAIL');
    const hasClarification = checklist.some(c => c.status === 'NEEDS_CLARIFICATION');
    const allPass = checklist.every(c => c.status === 'PASS');

    let newStatus: ProposalStatus = proposal.status;
    let action = 'SCRUTINY_PROGRESS_UPDATED';

    if (hasFail) {
      newStatus = 'REJECTED';
      action = 'SCRUTINY_FAILED';
    } else if (hasClarification) {
      newStatus = 'CLARIFICATION_REQUIRED';
      action = 'SCRUTINY_CLARIFICATION_REQUESTED';
    } else if (allPass) {
      newStatus = 'UNDER_SCRUTINY';
      action = 'SCRUTINY_ALL_PASSED';
    }

    const auditEntry: ProposalAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      action,
      actor: officerName,
      role: officerRole,
      previousStatus: proposal.status,
      newStatus,
      remarks: remarks || `Digital scrutiny checklist assessed: ${allPass ? 'All 5 checks passed' : hasFail ? 'Checks failed' : 'Clarifications requested'}.`,
      digitalSealHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`
    };

    proposal.scrutinyChecklist = checklist;
    proposal.scrutinyRemarks = remarks;
    proposal.scrutinyCompletedBy = officerName;
    proposal.scrutinyCompletedAt = timestamp;
    proposal.status = newStatus;
    proposal.progressPercent = allPass ? Math.max(proposal.progressPercent, 45) : proposal.progressPercent;
    proposal.auditTrail.unshift(auditEntry);

    this.saveToStorage();
    return proposal;
  }

  public advanceApprovalStage(
    proposalId: string,
    stageKey: RoutingStageKey,
    remarks: string,
    officerName = 'Approving Authority',
    officerRole = 'Competent Authority'
  ): ProjectProposal {
    const proposal = this.getProposalById(proposalId);
    if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const stageIndex = proposal.approvalStages.findIndex(s => s.stageKey === stageKey);
    if (stageIndex === -1) throw new Error(`Stage ${stageKey} not found in approval stages`);

    // Mark current stage approved
    proposal.approvalStages[stageIndex].status = 'APPROVED';
    proposal.approvalStages[stageIndex].date = new Date().toISOString().split('T')[0];
    proposal.approvalStages[stageIndex].officerName = officerName;
    proposal.approvalStages[stageIndex].officerDesignation = officerRole;
    proposal.approvalStages[stageIndex].remarks = remarks || 'Endorsed and approved in accordance with statutory rules.';
    proposal.approvalStages[stageIndex].signedDigitalHash = `0x${Math.random().toString(16).slice(2, 14)}`;

    let newStatus: ProposalStatus = proposal.status;
    let nextStageKey: RoutingStageKey = proposal.currentApprovalStage;
    let newProgress = proposal.progressPercent;

    // Check next stage
    if (stageIndex + 1 < proposal.approvalStages.length) {
      const nextStage = proposal.approvalStages[stageIndex + 1];
      nextStage.status = 'UNDER_REVIEW';
      nextStageKey = nextStage.stageKey;
      newProgress = Math.min(90, Math.round(((stageIndex + 2) / proposal.approvalStages.length) * 100));
      newStatus = 'UNDER_SCRUTINY';
    } else {
      // Final stage approved
      newStatus = 'APPROVED';
      newProgress = 100;
    }

    const auditEntry: ProposalAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      action: `STAGE_${stageKey}_APPROVED`,
      actor: officerName,
      role: officerRole,
      previousStatus: proposal.status,
      newStatus,
      remarks: remarks || `Approved stage: ${proposal.approvalStages[stageIndex].stageTitle}`,
      digitalSealHash: proposal.approvalStages[stageIndex].signedDigitalHash
    };

    proposal.currentApprovalStage = nextStageKey;
    proposal.status = newStatus;
    proposal.progressPercent = newProgress;
    proposal.auditTrail.unshift(auditEntry);

    this.saveToStorage();
    return proposal;
  }

  public requestClarification(
    proposalId: string,
    remarks: string,
    officerName = 'Review Officer',
    officerRole = 'Collector'
  ): ProjectProposal {
    const proposal = this.getProposalById(proposalId);
    if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const auditEntry: ProposalAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      action: 'CLARIFICATION_REQUIRED',
      actor: officerName,
      role: officerRole,
      previousStatus: proposal.status,
      newStatus: 'CLARIFICATION_REQUIRED',
      remarks: remarks || 'Official clarification requested on land acquisition schedules or revenue boundaries.',
      digitalSealHash: `0x${Math.random().toString(16).slice(2, 10)}`
    };

    proposal.status = 'CLARIFICATION_REQUIRED';
    proposal.scrutinyRemarks = remarks;
    proposal.auditTrail.unshift(auditEntry);

    this.saveToStorage();
    return proposal;
  }

  public rejectProposal(
    proposalId: string,
    remarks: string,
    officerName = 'Competent Authority',
    officerRole = 'Joint Secretary'
  ): ProjectProposal {
    const proposal = this.getProposalById(proposalId);
    if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const auditEntry: ProposalAuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp,
      action: 'PROPOSAL_REJECTED',
      actor: officerName,
      role: officerRole,
      previousStatus: proposal.status,
      newStatus: 'REJECTED',
      remarks: remarks || 'Proposal rejected due to irreconcilable statutory non-compliance.',
      digitalSealHash: `0x${Math.random().toString(16).slice(2, 10)}`
    };

    proposal.status = 'REJECTED';
    proposal.auditTrail.unshift(auditEntry);

    this.saveToStorage();
    return proposal;
  }

  public resetToDefault() {
    this.proposals = [...mockProjectProposals];
    this.saveToStorage();
  }
}

export const proposalService = new ProposalService();
