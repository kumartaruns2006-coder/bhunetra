import React, { useState, useEffect } from 'react';
import { User, UserRole, NavModuleId } from './types/auth';
import { authService } from './services/authService';
import { parcelService } from './services/parcelService';
import { projectService } from './services/projectService';
import { mockProjects } from './data/mockProjects';
import { ProjectCorridor } from './types/project';
import { Parcel, FieldVerificationRecord } from './types/parcel';

// Layout & Security Components
import { AppShell } from './components/layout/AppShell';
import { LoginScreen } from './components/auth/LoginScreen';
import { ToastProvider, useToast } from './components/ui/Toast';

// Module Views
import { NationalDashboard } from './components/dashboard/NationalDashboard';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ProjectProposalModule } from './components/proposals/ProjectProposalModule';
import { ProjectView } from './components/project/ProjectView';
import { GisMap } from './components/gis/GisMap';
import { ParcelTable } from './components/project/ParcelTable';
import { EndToEndWorkflowView } from './components/workflow/EndToEndWorkflowView';
import { ParcelDigitalTwin } from './components/twin/ParcelDigitalTwin';
import { FieldVerificationModal } from './components/verification/FieldVerificationModal';
import { FieldOfficerHomeView } from './components/verification/FieldOfficerHomeView';
import { AiRiskRadarView } from './components/ai/AiRiskRadarView';
import { ExecutiveDecisionCockpit } from './components/decision/ExecutiveDecisionCockpit';
import { CompensationAndRrView } from './components/compensation/CompensationAndRrView';
import { AdministrationView } from './components/admin/AdministrationView';
import { ReportsView } from './components/reports/ReportsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { AlertsView } from './components/alerts/AlertsView';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { CitizenPortalShell, CitizenTabId } from './components/citizen/CitizenPortalShell';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [activeModule, setActiveModule] = useState<NavModuleId>('dashboard');
  const [citizenTab, setCitizenTab] = useState<CitizenTabId>('dashboard');
  const [projects, setProjects] = useState<ProjectCorridor[]>(mockProjects);
  const [currentProject, setCurrentProject] = useState<ProjectCorridor>(mockProjects[0]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const { showToast } = useToast();

  // Selected Parcel for map inspection / detail drawer
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  // Digital Twin view modal
  const [digitalTwinParcel, setDigitalTwinParcel] = useState<Parcel | null>(null);

  // Field Verification modal
  const [verificationParcel, setVerificationParcel] = useState<Parcel | null>(null);

  // Field Verification target parcel for Amin mobile station
  const [targetVerificationParcelId, setTargetVerificationParcelId] = useState<string | undefined>(undefined);

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
      if (user) {
        // Set default landing module based on role permissions
        if (!user.allowedModules.includes(activeModule)) {
          setActiveModule(user.allowedModules[0] || 'dashboard');
        }
      }
    });
    return unsubscribe;
  }, [activeModule]);

  // Load parcels
  useEffect(() => {
    loadParcels();
  }, [currentProject]);

  const loadParcels = async () => {
    const list = await parcelService.getAllParcels(currentProject.id);
    setParcels(list);
    if (list.length > 0 && !selectedParcel) {
      setSelectedParcel(list[0]);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'CITIZEN') {
      setCitizenTab('dashboard');
    }
    setActiveModule(user.allowedModules[0] || 'dashboard');
    showToast({
      title: `Welcome, ${user.name}`,
      message: `Authenticated as ${user.roleTitle} (${user.jurisdiction})`,
      type: 'success'
    });
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setSelectedParcel(null);
    setDigitalTwinParcel(null);
    setVerificationParcel(null);
    setTargetVerificationParcelId(undefined);
    showToast({
      title: 'Session Ended',
      message: 'Logged out securely from NIC Government Gateway',
      type: 'info'
    });
  };

  const handleSwitchRole = async (role: UserRole) => {
    const user = await authService.loginWithDemoRole(role);
    setCurrentUser(user);
    if (user.role === 'CITIZEN') {
      setCitizenTab('dashboard');
    }
    if (!user.allowedModules.includes(activeModule)) {
      setActiveModule(user.allowedModules[0] || 'dashboard');
    }
    showToast({
      title: `Role Switched: ${user.roleTitle}`,
      message: `Permissions updated to ${user.scope} scope (${user.allowedModules.length} modules)`,
      type: 'info'
    });
  };

  const handleSelectParcel = (parcel: Parcel) => {
    setSelectedParcel(parcel);
  };

  const handleOpenDigitalTwin = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setDigitalTwinParcel(parcel);
  };

  const handleLaunchVerification = (parcel: Parcel) => {
    setVerificationParcel(parcel);
    setTargetVerificationParcelId(parcel.id);
    setActiveModule('field_verification');
    showToast({
      title: 'Field Verification Station',
      message: `Opening Cadastral Verification for Khasra ${parcel.khasraNo} (${parcel.id})`,
      type: 'info'
    });
  };

  const handleNavigateToMap = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setDigitalTwinParcel(null);
    setActiveModule('gis');
  };

  const handleOpenProjectDetails = (projectId: string) => {
    const existing = projects.find(p => p.id === projectId);
    if (existing) {
      setCurrentProject(existing);
    } else {
      const newProj: ProjectCorridor = {
        id: projectId,
        code: `NHAI-${projectId}`,
        name: projectId.replace(/-/g, ' '),
        state: 'Uttar Pradesh',
        districts: ['Varanasi', 'Chandauli'],
        implementingAgency: 'NHAI Regional Office',
        competentAuthority: 'CALA / Additional Collector',
        corridorLengthKm: 76.0,
        rightOfWayWidthM: 60,
        totalLandRequiredHectares: 340.0,
        totalParcelsCount: 520,
        parcelsAcquiredCount: 380,
        parcelsValuationCount: 80,
        parcelsUnderInquiryCount: 35,
        parcelsDisputedCount: 25,
        possessionSecuredPercentage: 73.0,
        totalBudgetCr: 540.0,
        disbursedBudgetCr: 380.0,
        escrowBalanceCr: 90.0,
        corridorCenter: [25.3176, 82.9739],
        corridorBounds: [[25.2, 82.8], [25.5, 83.2]],
        alignmentPathCoordinates: [[25.2, 82.8], [25.4, 83.1]],
        villages: [],
        milestones: [],
        highRiskParcelsCount: 15,
        createdDate: '2024-01-01',
        targetCompletionDate: '2026-12-31'
      };
      setProjects(prev => [...prev, newProj]);
      setCurrentProject(newProj);
    }
    setActiveModule('projects');
  };

  const handleOpenParcelById = async (parcelId: string) => {
    let p = parcels.find(x => x.id === parcelId || x.khasraNo.includes(parcelId));
    if (!p) {
      const fetched = await parcelService.getParcelById(parcelId);
      if (fetched) p = fetched;
    }
    if (!p && parcels.length > 0) {
      p = parcels[0];
    }
    if (p) {
      handleOpenDigitalTwin(p);
    }
  };

  const handleSaveVerification = async (parcelId: string, record: FieldVerificationRecord) => {
    const updated = await parcelService.addFieldVerification(parcelId, record);
    await loadParcels();
    if (digitalTwinParcel && digitalTwinParcel.id === parcelId) {
      setDigitalTwinParcel(updated);
    }
    if (selectedParcel && selectedParcel.id === parcelId) {
      setSelectedParcel(updated);
    }
    showToast({
      title: 'Field Verification Saved',
      message: `Inspection report logged by ${record.aminName} (${record.encroachmentDetected ? 'Encroachment Flagged' : 'Clear'})`,
      type: record.encroachmentDetected ? 'warning' : 'success'
    });
  };

  const handleSanctionCompensation = async (parcelId: string) => {
    const updated = await parcelService.sanctionCompensation(parcelId, currentUser?.name || 'CALA');
    await loadParcels();
    if (digitalTwinParcel && digitalTwinParcel.id === parcelId) {
      setDigitalTwinParcel(updated);
    }
    if (selectedParcel && selectedParcel.id === parcelId) {
      setSelectedParcel(updated);
    }
    showToast({
      title: 'Section 3G Award Sanctioned',
      message: `Statutory sanction granted for ₹${(updated.compensation.totalAwardAmount / 10000000).toFixed(2)} Cr`,
      type: 'success'
    });
  };

  const handleDisburseCompensation = async (parcelId: string) => {
    const updated = await parcelService.disburseDirectBenefit(parcelId, currentUser?.name || 'CALA');
    await loadParcels();
    if (digitalTwinParcel && digitalTwinParcel.id === parcelId) {
      setDigitalTwinParcel(updated);
    }
    if (selectedParcel && selectedParcel.id === parcelId) {
      setSelectedParcel(updated);
    }
    showToast({
      title: 'Section 3H DBT Disbursed',
      message: `PFMS Fund Transfer executed for ₹${(updated.compensation.totalAwardAmount / 10000000).toFixed(2)} Cr`,
      type: 'success'
    });
  };

  const handleCompletePossession = async (parcelId: string) => {
    const updated = await parcelService.completePossession(parcelId, currentUser?.name || 'CALA');
    await loadParcels();
    if (digitalTwinParcel && digitalTwinParcel.id === parcelId) {
      setDigitalTwinParcel(updated);
    }
    if (selectedParcel && selectedParcel.id === parcelId) {
      setSelectedParcel(updated);
    }
    showToast({
      title: 'Section 3E Possession Acquired',
      message: 'Demarcation pillars verified. Construction RoW transferred to NHAI.',
      type: 'success'
    });
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data and field verification updates to default?')) {
      parcelService.resetToDefault();
      await loadParcels();
      setDigitalTwinParcel(null);
      setVerificationParcel(null);
      showToast({
        title: 'Demo Data Reset',
        message: 'All cadastral parcels and compensation awards restored to initial state',
        type: 'info'
      });
    }
  };

  // 1. If not logged in, render the Login Screen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Helper officer adapter for older components expecting Officer
  const officerAdapter = {
    id: currentUser.id,
    name: currentUser.name,
    designation: currentUser.designation,
    cadre: currentUser.cadre,
    department: currentUser.department,
    jurisdiction: currentUser.jurisdiction,
    role: currentUser.role === 'FIELD_OFFICER' ? 'AMIN' : currentUser.role === 'LAND_ACQUIRING_AUTHORITY' ? 'CALA' : currentUser.role === 'PROJECT_IMPLEMENTING_AGENCY' ? 'NHAI_PD' : 'DM' as any,
    avatarInitials: currentUser.avatarInitials,
    badgeColor: currentUser.badgeColor,
    activeProjectIds: ['PRR-PH2-2026']
  };

  // 2. If logged in as Citizen, render the dedicated Citizen Portal Shell
  if (currentUser.role === 'CITIZEN') {
    return (
      <CitizenPortalShell
        currentUser={currentUser}
        activeTab={citizenTab}
        onSelectTab={(tab) => setCitizenTab(tab)}
        onLogout={handleLogout}
      >
        <CitizenDashboard
          currentUser={currentUser}
          parcels={parcels}
          activeTab={citizenTab}
          onSelectTab={(tab) => setCitizenTab(tab)}
          onOpenDigitalTwin={handleOpenDigitalTwin}
        />

        {/* 360° Parcel Digital Twin Dossier Modal (Citizen View) */}
        {digitalTwinParcel && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDigitalTwinParcel(null);
            }}
          >
            <div className="w-full max-w-6xl my-4 sm:my-6 animate-in zoom-in-95 duration-200">
              <ParcelDigitalTwin
                parcel={digitalTwinParcel}
                currentOfficer={officerAdapter}
                isCitizenView={true}
                onClose={() => setDigitalTwinParcel(null)}
                onLaunchVerification={() => {}}
                onSanctionCompensation={async () => {}}
                onDisburseCompensation={async () => {}}
                onCompletePossession={async () => {}}
                onNavigateToMap={() => {
                  setDigitalTwinParcel(null);
                  setCitizenTab('gis');
                }}
                onSelectParcel={(p) => setDigitalTwinParcel(p)}
              />
            </div>
          </div>
        )}
      </CitizenPortalShell>
    );
  }

  // 3. If logged in as Government Official, render the National Government AppShell
  return (
    <AppShell
      currentUser={currentUser}
      activeModule={activeModule}
      onSelectModule={(mod) => setActiveModule(mod)}
      onLogout={handleLogout}
      onSwitchRole={handleSwitchRole}
      onResetData={handleResetData}
      onOpenFlagshipTwin={() => handleOpenParcelById(currentProject.id === 'WB-KOL-KONA-2026' ? 'WB-KOL-K108/1' : 'K-125/2')}
      onSearchParcel={handleOpenParcelById}
    >
      {/* 12 Administrative Module Views */}
      {activeModule === 'dashboard' && (
        <NationalDashboard
          onSelectProject={handleOpenProjectDetails}
          onSelectParcel={handleOpenParcelById}
          onNavigateModule={(mod) => setActiveModule(mod as NavModuleId)}
        />
      )}

      {activeModule === 'projects' && (
        <ProjectProposalModule
          currentProject={currentProject}
          currentOfficer={officerAdapter}
          onNavigateTab={(tab) => {
            const tabMap: Record<string, NavModuleId> = {
              gis: 'gis',
              parcels: 'workflow',
              decision: 'compensation_rr'
            };
            setActiveModule(tabMap[tab] || 'projects');
          }}
        />
      )}

      {activeModule === 'gis' && (
        <GisMap
          project={currentProject}
          parcels={parcels}
          selectedParcel={selectedParcel}
          onSelectParcel={handleSelectParcel}
          onOpenDigitalTwin={handleOpenDigitalTwin}
          onLaunchVerification={handleLaunchVerification}
          onViewDocuments={(p) => {
            handleSelectParcel(p);
            setActiveModule('documents');
          }}
        />
      )}

      {activeModule === 'workflow' && (
        <EndToEndWorkflowView
          project={currentProject}
          parcels={parcels}
          currentOfficer={officerAdapter}
          onSelectParcel={handleSelectParcel}
          onOpenDigitalTwin={handleOpenDigitalTwin}
          onLaunchVerification={handleLaunchVerification}
          onNavigateToMap={handleNavigateToMap}
          onNavigateModule={(mod) => setActiveModule(mod as NavModuleId)}
        />
      )}

      {activeModule === 'documents' && (
        <DocumentsView 
          parcels={parcels} 
          onOpenParcelDigitalTwin={handleOpenParcelById}
        />
      )}

      {activeModule === 'field_verification' && (
        <FieldOfficerHomeView
          parcels={parcels}
          currentOfficer={officerAdapter}
          onOpenDigitalTwin={handleOpenDigitalTwin}
          onNavigateToMap={handleNavigateToMap}
          initialParcelId={targetVerificationParcelId}
          onVerificationCompleted={loadParcels}
        />
      )}

      {activeModule === 'compensation_rr' && (
        <CompensationAndRrView
          project={currentProject}
          parcels={parcels}
          currentOfficer={officerAdapter}
          onOpenDigitalTwin={handleOpenDigitalTwin}
          onNavigateToMap={handleNavigateToMap}
        />
      )}

      {activeModule === 'alerts' && (
        <AlertsView
          parcels={parcels}
          onSelectParcel={handleOpenDigitalTwin}
          onNavigateToMap={handleNavigateToMap}
          onNavigateToProject={handleOpenProjectDetails}
        />
      )}

      {activeModule === 'ai_intelligence' && (
        <AiRiskRadarView
          project={currentProject}
          parcels={parcels}
          onSelectParcel={handleSelectParcel}
          onOpenDigitalTwin={handleOpenDigitalTwin}
          onNavigateToMap={handleNavigateToMap}
          onNavigateModule={(mod) => setActiveModule(mod as NavModuleId)}
        />
      )}

      {activeModule === 'reports_mis' && (
        <ReportsView
          project={currentProject}
          parcels={parcels}
          onSelectParcel={handleOpenDigitalTwin}
          onSelectProject={handleOpenProjectDetails}
          onNavigateToMap={handleNavigateToMap}
        />
      )}

      {activeModule === 'executive_dashboard' && (
        <ExecutiveDashboard
          project={currentProject}
          parcels={parcels}
          currentOfficer={officerAdapter}
          onNavigateTab={(tab) => {
            const tabMap: Record<string, NavModuleId> = {
              gis: 'gis',
              parcels: 'workflow',
              verification: 'field_verification',
              'ai-risk': 'ai_intelligence',
              decision: 'compensation_rr'
            };
            setActiveModule(tabMap[tab] || 'dashboard');
          }}
          onSelectParcel={handleOpenDigitalTwin}
          onSelectProject={handleOpenProjectDetails}
          onNavigateToMap={handleNavigateToMap}
          onNavigateModule={(mod) => setActiveModule(mod as NavModuleId)}
        />
      )}

      {activeModule === 'administration' && (
        <AdministrationView 
          currentUser={currentUser} 
          parcels={parcels}
          projects={projects}
          onOpenDigitalTwin={handleOpenDigitalTwin}
          onSwitchRole={(u) => handleSwitchRole(u.role)}
          onNavigateModule={(mod) => setActiveModule(mod as NavModuleId)}
        />
      )}

      {/* 360° Parcel Digital Twin Dossier Modal */}
      {digitalTwinParcel && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDigitalTwinParcel(null);
          }}
        >
          <div className="w-full max-w-6xl my-4 sm:my-6 animate-in zoom-in-95 duration-200">
            <ParcelDigitalTwin
              parcel={digitalTwinParcel}
              currentOfficer={officerAdapter}
              onClose={() => setDigitalTwinParcel(null)}
              onLaunchVerification={(p) => {
                setDigitalTwinParcel(null);
                handleLaunchVerification(p);
              }}
              onSanctionCompensation={handleSanctionCompensation}
              onDisburseCompensation={handleDisburseCompensation}
              onCompletePossession={handleCompletePossession}
              onNavigateToMap={handleNavigateToMap}
              onSelectParcel={(p) => setDigitalTwinParcel(p)}
            />
          </div>
        </div>
      )}

      {/* Amin Field Verification Modal */}
      {verificationParcel && (
        <FieldVerificationModal
          parcel={verificationParcel}
          currentOfficer={officerAdapter}
          onClose={() => setVerificationParcel(null)}
          onSaveVerification={handleSaveVerification}
        />
      )}
    </AppShell>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
