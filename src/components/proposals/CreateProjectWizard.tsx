import React, { useState } from 'react';
import { ProjectProposal, ProposalDocumentItem, ProposalMilestoneItem } from '../../types/projectProposal';
import { proposalService } from '../../services/proposalService';
import { useToast } from '../ui/Toast';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Plus, 
  FileCheck, 
  ShieldCheck,
  Compass
} from 'lucide-react';

interface CreateProjectWizardProps {
  onCancel: () => void;
  onSuccess: (createdProposal: ProjectProposal) => void;
  currentOfficerName?: string;
  currentOfficerRole?: string;
}

export const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({
  onCancel,
  onSuccess,
  currentOfficerName = 'Er. Sunita Murthy',
  currentOfficerRole = 'Chief GM & Project Director, NHAI'
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // STEP 1: Project Information
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('MoRTH / NHAI');
  const [projectType, setProjectType] = useState<'EXPRESSWAY' | 'NATIONAL_HIGHWAY' | 'FREIGHT_CORRIDOR' | 'PORT_CONNECTIVITY' | 'RING_ROAD' | 'ECONOMIC_CORRIDOR'>('NATIONAL_HIGHWAY');
  const [state, setState] = useState('Bihar');
  const [district, setDistrict] = useState('Patna');
  const [implementingAgency, setImplementingAgency] = useState('NHAI Regional Office, Patna');
  const [description, setDescription] = useState('');

  // STEP 2: Land Requirement
  const [totalLandRequiredAcres, setTotalLandRequiredAcres] = useState('520');
  const [estimatedParcelsCount, setEstimatedParcelsCount] = useState('410');
  const [landType, setLandType] = useState<'AGRICULTURAL' | 'COMMERCIAL' | 'RESIDENTIAL' | 'FOREST' | 'GOVERNMENT_REVENUE' | 'MIXED'>('AGRICULTURAL');
  const [projectBoundary, setProjectBoundary] = useState('LINESTRING(85.0845 25.5941, 85.1200 25.6100, 85.1750 25.6480)');
  const [corridorLengthKm, setCorridorLengthKm] = useState('48.5');
  const [rightOfWayWidthM, setRightOfWayWidthM] = useState('60');

  // STEP 3: Timeline
  const [proposalDate, setProposalDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('2027-06-30');
  const [milestones, setMilestones] = useState<ProposalMilestoneItem[]>([
    { id: 'ms-1', title: 'Section 3A Gazette Notification of Intent', targetDate: '2026-10-15', stageRef: 'NH Act Sec 3A' },
    { id: 'ms-2', title: 'Joint Measurement Survey (JMS) & Pegging', targetDate: '2026-12-31', stageRef: 'RFCTLARR Sec 12' },
    { id: 'ms-3', title: 'Section 3D Declaration Publication', targetDate: '2027-02-28', stageRef: 'NH Act Sec 3D' },
    { id: 'ms-4', title: 'Section 3G Statutory Valuation Awards', targetDate: '2027-04-30', stageRef: 'NH Act Sec 3G' },
    { id: 'ms-5', title: 'Section 3E Physical Possession Handover', targetDate: '2027-06-30', stageRef: 'NH Act Sec 3E' }
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  // STEP 4: Documents (Demo upload list)
  const [documents, setDocuments] = useState<ProposalDocumentItem[]>([
    {
      id: 'doc-prop',
      type: 'PROJECT_PROPOSAL',
      title: 'Detailed Project Report (DPR) & Alignment Study',
      fileName: 'Corridor_DPR_Feasibility_2026.pdf',
      fileSize: '16.4 MB',
      uploadedAt: 'Today, Just now',
      verified: true
    },
    {
      id: 'doc-land',
      type: 'LAND_REQUIREMENT_DOC',
      title: 'Land Requirement Justification & Village List',
      fileName: 'Statutory_Land_Schedule_Annexure.pdf',
      fileSize: '4.8 MB',
      uploadedAt: 'Today, Just now',
      verified: true
    },
    {
      id: 'doc-map',
      type: 'PROJECT_MAP',
      title: 'GIS Alignment Shapefile & Survey of India Strip Plan',
      fileName: 'Corridor_GIS_WGS84.kml',
      fileSize: '3.2 MB',
      uploadedAt: 'Today, Just now',
      verified: true
    }
  ]);
  const [uploadDocType, setUploadDocType] = useState<ProposalDocumentItem['type']>('SUPPORTING_DOC');
  const [uploadDocTitle, setUploadDocTitle] = useState('');

  // Validation
  const validateStep1 = () => {
    if (!name.trim()) {
      alert('Please enter Project Name');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!totalLandRequiredAcres || parseFloat(totalLandRequiredAcres) <= 0) {
      alert('Please enter valid Total Land Required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(5, prev + 1) as any);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as any);
  };

  // Milestone handlers
  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim() || !newMilestoneDate) return;
    setMilestones(prev => [
      ...prev,
      {
        id: `ms-${Date.now()}`,
        title: newMilestoneTitle,
        targetDate: newMilestoneDate,
        stageRef: 'Statutory Milestone'
      }
    ]);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  // Document upload simulator
  const handleAddDemoDocument = () => {
    if (!uploadDocTitle.trim()) return;
    const newDoc: ProposalDocumentItem = {
      id: `doc-${Date.now()}`,
      type: uploadDocType,
      title: uploadDocTitle,
      fileName: `${uploadDocTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      uploadedAt: 'Just now',
      verified: true
    };
    setDocuments(prev => [...prev, newDoc]);
    setUploadDocTitle('');
    showToast({
      title: 'Statutory Document Attached',
      message: `Uploaded ${newDoc.fileName} to proposal dossier`,
      type: 'success'
    });
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Submit Handler
  const handleSubmitProposal = () => {
    const created = proposalService.createProposal({
      name,
      code: code || `NHAI-${state.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      department,
      projectType,
      state,
      district,
      subDistricts: [district + ' Sadar'],
      implementingAgency,
      description,
      totalLandRequiredAcres: parseFloat(totalLandRequiredAcres) || 500,
      estimatedParcelsCount: parseInt(estimatedParcelsCount) || 400,
      landType,
      corridorLengthKm: parseFloat(corridorLengthKm) || 45.0,
      rightOfWayWidthM: parseFloat(rightOfWayWidthM) || 60,
      proposalDate,
      targetDate,
      milestones,
      documents,
      estimatedCostCr: Math.round((parseFloat(totalLandRequiredAcres) || 500) * 0.75)
    }, currentOfficerName, currentOfficerRole);

    showToast({
      title: 'Proposal Officially Submitted',
      message: `Project ${created.name} registered under ID ${created.id}. Forwarded to Digital Scrutiny Station.`,
      type: 'success'
    });

    onSuccess(created);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Wizard Header Ribbon */}
      <div className="bg-gradient-to-r from-gov-navy via-gov-navy-light to-slate-900 text-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <span>MULTI-STEP STATUTORY PROPOSAL WIZARD</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Create New Infrastructure Project Proposal
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Propose linear alignment or area development corridor for statutory scrutiny and 4-tier approval routing.
            </p>
          </div>

          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Cancel & Return to Registry
          </button>
        </div>

        {/* 5-Step Progress Indicators */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {[
            { step: 1, title: 'Project Info' },
            { step: 2, title: 'Land Requirement' },
            { step: 3, title: 'Timeline & Milestones' },
            { step: 4, title: 'Statutory Documents' },
            { step: 5, title: 'Review & Submit' }
          ].map((s) => (
            <div
              key={s.step}
              onClick={() => {
                // allow clicking previously passed steps
                if (s.step < currentStep) setCurrentStep(s.step as any);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                currentStep === s.step
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-md'
                  : currentStep > s.step
                  ? 'bg-emerald-600/30 border-emerald-400/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider">Step {s.step}</div>
              <div className="text-xs font-bold truncate">{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* STEP 1: Project Information */}
        {currentStep === 1 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Building2 size={18} className="text-gov-navy" />
              <span>Step 1: Project Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Patna Outer Ring Road Northern Alignment (Package 3)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project ID / Corridor Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. NHAI-BR-PORR-PKG3"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sponsoring Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
                >
                  <option value="MoRTH / NHAI">MoRTH / NHAI</option>
                  <option value="Ministry of Railways / DFCCIL">Ministry of Railways / DFCCIL</option>
                  <option value="Ministry of Ports & Shipping">Ministry of Ports & Shipping</option>
                  <option value="Ministry of Civil Aviation">Ministry of Civil Aviation</option>
                  <option value="State PWD / Highway Authority">State PWD / Highway Authority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Type *
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
                >
                  <option value="EXPRESSWAY">Access-Controlled Expressway</option>
                  <option value="NATIONAL_HIGHWAY">National Highway Corridor</option>
                  <option value="FREIGHT_CORRIDOR">Dedicated Freight Corridor (DFCCIL)</option>
                  <option value="PORT_CONNECTIVITY">Port Maritime Link</option>
                  <option value="RING_ROAD">Peripheral Ring Road</option>
                  <option value="ECONOMIC_CORRIDOR">Economic Trade Corridor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
                >
                  <option value="Bihar">Bihar</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Revenue District *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Patna / Varanasi / Nagpur"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Implementing Agency *
                </label>
                <input
                  type="text"
                  placeholder="e.g. NHAI PIU Patna"
                  value={implementingAgency}
                  onChange={(e) => setImplementingAgency(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Description & Alignment Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide alignment connectivity rationale, junctions, bypass targets, and strategic importance under PM GatiShakti."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Land Requirement */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers size={18} className="text-gov-navy" />
              <span>Step 2: Land Requirement & Cadastral Scope</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Land Required (Acres) *
                </label>
                <input
                  type="number"
                  value={totalLandRequiredAcres}
                  onChange={(e) => setTotalLandRequiredAcres(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Estimated Parcels Count *
                </label>
                <input
                  type="number"
                  value={estimatedParcelsCount}
                  onChange={(e) => setEstimatedParcelsCount(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Land Classification *
                </label>
                <select
                  value={landType}
                  onChange={(e) => setLandType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900 font-medium"
                >
                  <option value="AGRICULTURAL">Agricultural Irrigated / Non-Irrigated</option>
                  <option value="COMMERCIAL">Commercial / Industrial Road Facing</option>
                  <option value="RESIDENTIAL">Residential Abadi / Village Abadi</option>
                  <option value="FOREST">Forest Land (Protected / Eco-Sensitive)</option>
                  <option value="GOVERNMENT_REVENUE">Government Revenue / Gram Sabha Land</option>
                  <option value="MIXED">Mixed Multiple Classifications</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Corridor Length (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={corridorLengthKm}
                  onChange={(e) => setCorridorLengthKm(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Right of Way (RoW) Width (Meters)
                </label>
                <input
                  type="number"
                  value={rightOfWayWidthM}
                  onChange={(e) => setRightOfWayWidthM(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  GIS Boundary String (WKT / GeoJSON)
                </label>
                <input
                  type="text"
                  value={projectBoundary}
                  onChange={(e) => setProjectBoundary(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>
                Calculated Land Requirement Density: <strong>{(parseFloat(totalLandRequiredAcres) / parseFloat(corridorLengthKm)).toFixed(2)} Acres/km</strong> (conforming to MoRTH guidelines).
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Timeline & Milestones */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Calendar size={18} className="text-gov-navy" />
              <span>Step 3: Statutory Acquisition Timeline & Milestones</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proposal Submission Date *
                </label>
                <input
                  type="date"
                  value={proposalDate}
                  onChange={(e) => setProposalDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Land Possession Date (Section 3E) *
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
                />
              </div>
            </div>

            {/* Milestones List */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Statutory Milestone SLA Schedule
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {milestones.length} Milestones Configured
                </span>
              </div>

              <div className="space-y-2">
                {milestones.map((m, idx) => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gov-navy text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{m.title}</div>
                        <div className="text-[10px] text-slate-500">{m.stageRef}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-700 font-bold">{m.targetDate}</span>
                      <button
                        onClick={() => handleRemoveMilestone(m.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Milestone"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Milestone Inline */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                <input
                  type="text"
                  placeholder="New Milestone Title (e.g. Forest Clearance Stage 1)"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
                <input
                  type="date"
                  value={newMilestoneDate}
                  onChange={(e) => setNewMilestoneDate(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-1.5 bg-gov-navy text-white text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Documents (Demo upload) */}
        {currentStep === 4 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText size={18} className="text-gov-navy" />
              <span>Step 4: Statutory Document Uploads</span>
            </h3>

            <p className="text-xs text-slate-600">
              Attach mandatory regulatory documents. These will be vetted during <strong>Digital Scrutiny</strong>.
            </p>

            {/* Uploaded Documents List */}
            <div className="space-y-2.5">
              {documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <FileCheck size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{d.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {d.fileName} &bull; {d.fileSize} &bull; Uploaded {d.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Dossier Attached
                    </span>
                    <button
                      onClick={() => handleRemoveDocument(d.id)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Upload Form */}
            <div className="bg-slate-100 rounded-xl p-4 border border-dashed border-slate-300 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                + Attach Additional Supporting Document
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="PROJECT_PROPOSAL">Project Proposal Report</option>
                  <option value="LAND_REQUIREMENT_DOC">Land Requirement Schedule</option>
                  <option value="PROJECT_MAP">Project Map / Shapefile</option>
                  <option value="SUPPORTING_DOC">Supporting Environmental / Admin Sanction</option>
                </select>

                <input
                  type="text"
                  placeholder="Document Title (e.g. Village Gram Sabha Resolution)"
                  value={uploadDocTitle}
                  onChange={(e) => setUploadDocTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddDemoDocument}
                  className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Upload size={14} />
                  <span>Upload Document</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck size={18} className="text-gov-navy" />
              <span>Step 5: Review Complete Proposal & Submit for Statutory Scrutiny</span>
            </h3>

            {/* Proposal Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-navy bg-white px-2 py-0.5 rounded border border-slate-200">
                    {code || 'NHAI-CORR-2026'} &bull; {department}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-1">
                    {name || 'New Corridor Proposal'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {state} &bull; District: <strong className="text-slate-800">{district}</strong> &bull; Agency: <strong className="text-slate-800">{implementingAgency}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase">Estimated Budget</span>
                  <div className="text-xl font-black text-slate-900">
                    ₹{Math.round((parseFloat(totalLandRequiredAcres) || 500) * 0.75)} Cr
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Land Required</span>
                  <span className="text-base font-black text-emerald-700">{totalLandRequiredAcres} Acres</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Estimated Parcels</span>
                  <span className="text-base font-black text-slate-900">{estimatedParcelsCount} Plots</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Corridor Length</span>
                  <span className="text-base font-black text-slate-900">{corridorLengthKm} km</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Right of Way</span>
                  <span className="text-base font-black text-slate-900">{rightOfWayWidthM} meters</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Project Scope:</span>
                {description || 'Standard alignment connectivity under PM GatiShakti National Master Plan.'}
              </div>

              {/* Attached Docs & Milestones Tally */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Attached Documents ({documents.length})</span>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {documents.map(d => (
                      <li key={d.id} className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{d.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Milestone Targets ({milestones.length})</span>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {milestones.slice(0, 3).map(m => (
                      <li key={m.id} className="flex items-center justify-between">
                        <span className="truncate">{m.title}</span>
                        <strong className="text-slate-800 ml-2">{m.targetDate}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Officer Declaration */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-amber-700" />
                <span>Statutory Authority Declaration & Digital Endorsement</span>
              </div>
              <p>
                By submitting this proposal, implementing officer <strong className="text-slate-900">{currentOfficerName}</strong> ({currentOfficerRole}) certifies that the proposed RoW minimizes displacement and adheres to statutory provisions under Section 3A of the National Highways Act, 1956 and RFCTLARR Act, 2013.
              </p>
            </div>

            {/* Big Submit Button */}
            <div className="pt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSubmitProposal}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black rounded-xl shadow-lg transition-all flex items-center gap-2.5 transform hover:scale-105"
              >
                <CheckCircle2 size={18} className="text-white" />
                <span>SUBMIT PROPOSAL</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={handleBack}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft size={14} />
            <span>Previous Step</span>
          </button>

          {currentStep < 5 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Next Step</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
