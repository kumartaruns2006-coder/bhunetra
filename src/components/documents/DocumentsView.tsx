import React, { useState, useEffect, useMemo } from 'react';
import { 
  DocumentEntity, 
  DocumentCategory, 
  DocumentStatus, 
  DocumentAiStatus, 
  DocumentFilterState, 
  AiProcessingStep, 
  ExtractedDocumentFields 
} from '../../types/document';
import { documentService } from '../../services/documentService';
import { documentAiService, DOCUMENT_AI_DISCLAIMER } from '../../services/documentAiService';
import { Parcel } from '../../types/parcel';
import { useToast } from '../ui/Toast';
import { 
  FolderArchive, 
  FileText, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  History, 
  RefreshCw, 
  Archive, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  BrainCircuit, 
  Check, 
  X, 
  ExternalLink, 
  Layers, 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  FileCheck, 
  RotateCcw,
  Plus,
  ArrowRight,
  Info,
  Calendar,
  Compass
} from 'lucide-react';

interface DocumentsViewProps {
  parcels?: Parcel[];
  onOpenParcelDigitalTwin?: (parcelId: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ 
  parcels = [], 
  onOpenParcelDigitalTwin 
}) => {
  const { showToast } = useToast();

  // Documents list state
  const [documents, setDocuments] = useState<DocumentEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [filters, setFilters] = useState<DocumentFilterState>({
    searchQuery: '',
    category: 'ALL',
    status: 'ALL',
    aiStatus: 'ALL',
    showArchivedOnly: false
  });

  // Modal / Drawer States
  const [previewDoc, setPreviewDoc] = useState<DocumentEntity | null>(null);
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<DocumentEntity | null>(null);
  const [replaceVersionDoc, setReplaceVersionDoc] = useState<DocumentEntity | null>(null);
  const [newVersionFileName, setNewVersionFileName] = useState<string>('');
  const [newVersionSummary, setNewVersionSummary] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // AI Pipeline Simulation State
  const [aiProcessingFile, setAiProcessingFile] = useState<string>('Award_1252.pdf');
  const [aiStep, setAiStep] = useState<AiProcessingStep>('UPLOAD');
  const [aiProgressPercent, setAiProgressPercent] = useState<number>(0);
  const [aiProgressMessage, setAiProgressMessage] = useState<string>('');
  const [isAiRunning, setIsAiRunning] = useState<boolean>(false);
  const [aiExtractedResult, setAiExtractedResult] = useState<ExtractedDocumentFields | null>(null);

  // Load documents
  useEffect(() => {
    loadDocuments();
    const unsubscribe = documentService.subscribe((updatedDocs) => {
      setDocuments(updatedDocs);
    });
    return unsubscribe;
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    const docs = await documentService.getDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  // 13 Document Categories from specification
  const categoriesList: { id: DocumentCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Categories (13)' },
    { id: 'PROJECT_PROPOSAL', label: '1. Project Proposal' },
    { id: 'LAND_RECORDS', label: '2. Land Records' },
    { id: 'NOTIFICATIONS', label: '3. Notifications' },
    { id: 'SIA', label: '4. SIA' },
    { id: 'OBJECTION_HEARING', label: '5. Objection/Hearing' },
    { id: 'DECLARATION', label: '6. Declaration' },
    { id: 'AWARD', label: '7. Award' },
    { id: 'COMPENSATION', label: '8. Compensation' },
    { id: 'RR', label: '9. R&R' },
    { id: 'POSSESSION', label: '10. Possession' },
    { id: 'MAPS', label: '11. Maps' },
    { id: 'FIELD_REPORTS', label: '12. Field Reports' },
    { id: 'OTHER', label: '13. Other' }
  ];

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    let result = documents.filter(d => Boolean(d.isArchived) === filters.showArchivedOnly);

    if (filters.category !== 'ALL') {
      result = result.filter(d => d.category === filters.category);
    }

    if (filters.status !== 'ALL') {
      result = result.filter(d => d.status === filters.status);
    }

    if (filters.aiStatus !== 'ALL') {
      result = result.filter(d => d.aiStatus === filters.aiStatus);
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.referenceNo.toLowerCase().includes(q) ||
        d.khasraNo.toLowerCase().includes(q) ||
        d.village.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q) ||
        d.categoryLabel.toLowerCase().includes(q) ||
        d.projectName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [documents, filters]);

  // Demo download action
  const handleDownloadDemo = (doc: DocumentEntity) => {
    const res = documentService.simulateDownload(doc);
    showToast({
      title: 'Demo Document Downloaded',
      message: `Downloaded [${res.filename}] &bull; Checksum verified via NIC DigiLocker`,
      type: 'success'
    });
  };

  // Archive / Restore action
  const handleToggleArchive = async (doc: DocumentEntity) => {
    if (doc.isArchived) {
      await documentService.restoreDocument(doc.id, 'Authenticated Officer');
      showToast({
        title: 'Document Restored',
        message: `[${doc.name}] restored to active repository.`,
        type: 'info'
      });
    } else {
      await documentService.archiveDocument(doc.id, 'Authenticated Officer');
      showToast({
        title: 'Document Archived',
        message: `[${doc.name}] moved to secure archive storage.`,
        type: 'warning'
      });
    }
  };

  // Replace version submission
  const handleConfirmReplaceVersion = async () => {
    if (!replaceVersionDoc || !newVersionFileName.trim()) return;

    try {
      const updated = await documentService.replaceVersion(
        replaceVersionDoc.id,
        newVersionFileName.trim(),
        newVersionSummary.trim(),
        'Additional Collector (LA) Patna',
        'CALA'
      );

      showToast({
        title: 'Version Updated Successfully',
        message: `[${updated.name}] incremented to ${updated.currentVersion}. Audit entry logged.`,
        type: 'success'
      });

      setReplaceVersionDoc(null);
      setNewVersionFileName('');
      setNewVersionSummary('');
    } catch (err: any) {
      showToast({
        title: 'Update Failed',
        message: err.message || 'Could not replace version',
        type: 'warning'
      });
    }
  };

  // Run Simulated Document AI Pipeline
  const handleRunDocumentAi = async (customFileName?: string) => {
    setIsAiRunning(true);
    setAiExtractedResult(null);
    setAiProgressPercent(0);

    const targetFileName = customFileName || aiProcessingFile;

    try {
      const result = await documentAiService.processDocument(
        { name: targetFileName },
        (step, percentage, message) => {
          setAiStep(step);
          setAiProgressPercent(percentage);
          setAiProgressMessage(message);
        }
      );

      setAiExtractedResult(result);
      showToast({
        title: 'Document AI Extraction Complete',
        message: `Entity confidence ${result.overallConfidence}% &bull; 7 fields extracted`,
        type: 'success'
      });
    } finally {
      setIsAiRunning(false);
    }
  };

  // Link Extracted AI Record into Repository
  const handleLinkAiResultToRepository = async () => {
    if (!aiExtractedResult) return;

    const newDoc = await documentService.uploadDocument({
      name: aiProcessingFile,
      category: 'AWARD',
      categoryLabel: 'Award',
      projectId: 'PRR-PH2-2026',
      projectName: 'Patna Ring Road Expansion',
      parcelId: aiExtractedResult.parcelId.value.split(' ')[0],
      khasraNo: aiExtractedResult.khasra.value.split(' ')[0],
      village: 'Kanhauli',
      fileSize: '3.8 MB',
      fileType: 'PDF',
      status: 'VERIFIED',
      aiStatus: 'EXTRACTED',
      referenceNo: `CALA-AI-${Date.now().toString().slice(-4)}`,
      uploadedBy: 'Document AI Optical Pipeline',
      extractedFields: aiExtractedResult
    });

    showToast({
      title: 'Linked to Repository & Digital Twin',
      message: `[${newDoc.name}] registered under Khasra ${newDoc.khasraNo} (${newDoc.projectName})`,
      type: 'success'
    });

    setIsAiModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* ============================================================ */}
      {/* 1. MASTER REPOSITORY HEADER */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-gov-navy uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4 text-amber-500" />
            <span>CENTRAL DIGITAL RECORD ROOM &bull; PART 7: DOCUMENT MANAGEMENT</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
              13 CATEGORIES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Secure Statutory Document Repository
          </h1>
          <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
            <span>Project: <strong className="text-slate-900">Patna Ring Road Expansion (PRR-PH2-2026)</strong></span>
            <span>&bull;</span>
            <span>Storage: <strong className="text-slate-900">NIC DigiLocker Cloud & Gazette Vault</strong></span>
            <span>&bull;</span>
            <span>Integrity: <strong className="text-emerald-700 font-mono">SHA-256 Checksums Certified</strong></span>
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsAiModalOpen(true);
              setAiExtractedResult(null);
              setAiProgressPercent(0);
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-gov-navy hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Run Document AI</span>
          </button>

          <button
            onClick={() => {
              setReplaceVersionDoc(documents[0] || null);
              setNewVersionFileName('Award_1252_v4_amended.pdf');
              setNewVersionSummary('Supplementary court solatium escalation revision');
            }}
            className="px-3.5 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Version</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. DOCUMENT AI PROMINENT DEMO DISCLAIMER BANNER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-indigo-500/10 border-l-4 border-amber-500 bg-white p-4 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0 mt-0.5">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-amber-900">
                Document AI Optical Recognition & Entity Extraction
              </span>
              <span className="bg-amber-400/30 text-amber-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                Tesseract Ready
              </span>
            </div>
            <p className="text-slate-700 mt-0.5 font-medium leading-relaxed">
              <strong>Disclaimer: </strong>{DOCUMENT_AI_DISCLAIMER}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsAiModalOpen(true);
            handleRunDocumentAi('Award_1252.pdf');
          }}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold transition-all shadow-xs flex items-center gap-1 whitespace-nowrap"
        >
          <span>Try AI on Award_1252.pdf</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. SEARCH & 13-CATEGORY FILTER BAR */}
      {/* ============================================================ */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        {/* Search Bar & Status Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by Document Name, Reference, Khasra, Village, Uploader..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="DISCREPANCY">Discrepancy</option>
            </select>

            {/* AI Status Filter */}
            <select
              value={filters.aiStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, aiStatus: e.target.value as any }))}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="ALL">All AI States</option>
              <option value="EXTRACTED">AI Extracted</option>
              <option value="PROCESSING">Processing</option>
              <option value="NOT_PROCESSED">Unprocessed</option>
            </select>

            {/* Active vs. Archived Switcher */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, showArchivedOnly: !prev.showArchivedOnly }))}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border ${
                filters.showArchivedOnly
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{filters.showArchivedOnly ? 'Viewing Archived' : 'Show Archived'}</span>
            </button>
          </div>
        </div>

        {/* 13 Categories Chips Ribbon */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all ${
                filters.category === cat.id
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MASTER DOCUMENT REPOSITORY TABLE */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-2">
            <span>Documents Repository Table</span>
            <span className="font-mono text-slate-500">({filteredDocuments.length} Records)</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Click <strong>Version</strong> to inspect full multi-version audit history.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Project</th>
                <th className="px-3 py-3">Parcel</th>
                <th className="px-3 py-3 text-center">Version</th>
                <th className="px-3 py-3">Uploaded By</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-center">AI Processing</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 text-xs">
                    No documents found matching the selected category and search query.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Document Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg flex-shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-snug">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {doc.referenceNo} &bull; {doc.fileSize}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Type (Category) */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {doc.categoryLabel}
                      </span>
                    </td>

                    {/* Project */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{doc.projectName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{doc.projectId}</div>
                    </td>

                    {/* Parcel */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      {onOpenParcelDigitalTwin ? (
                        <button
                          onClick={() => onOpenParcelDigitalTwin(doc.parcelId)}
                          className="font-mono font-bold text-gov-navy hover:underline text-left block cursor-pointer"
                          title="Open Parcel Digital Twin"
                        >
                          Khasra {doc.khasraNo}
                        </button>
                      ) : (
                        <div className="font-mono font-bold text-gov-navy">
                          Khasra {doc.khasraNo}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500">
                        {doc.village} ({doc.parcelId})
                      </div>
                    </td>

                    {/* Version (Clickable to view history) */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setVersionHistoryDoc(doc)}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Click to view full version history and audit log"
                      >
                        <History className="w-3 h-3" />
                        <span>{doc.currentVersion}</span>
                      </button>
                    </td>

                    {/* Uploaded By */}
                    <td className="px-3 py-3 text-slate-700 whitespace-nowrap">
                      {doc.uploadedBy}
                    </td>

                    {/* Date */}
                    <td className="px-3 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {doc.uploadedAt}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        doc.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        doc.status === 'ARCHIVED' ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {doc.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* AI Processing */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      {doc.aiStatus === 'EXTRACTED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          <span>{doc.extractedFields?.overallConfidence || 97}% Conf.</span>
                        </span>
                      ) : doc.aiStatus === 'PROCESSING' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 animate-pulse">
                          Processing...
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Unprocessed</span>
                      )}
                    </td>

                    {/* Actions: Preview, Download, Version History, Replace Version, Archive */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-gov-navy hover:text-white text-slate-700 transition-colors"
                          title="Preview Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDownloadDemo(doc)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-colors"
                          title="Download Demo File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setVersionHistoryDoc(doc)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition-colors"
                          title="Version History & Audit Log"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setReplaceVersionDoc(doc);
                            setNewVersionFileName(`${doc.name.replace('.pdf', '')}_v${doc.versionHistory.length + 1}.pdf`);
                            setNewVersionSummary('');
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 transition-colors"
                          title="Replace Version"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleArchive(doc)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 transition-colors"
                          title={doc.isArchived ? "Restore to Active" : "Archive"}
                        >
                          <Archive className="w-3.5 h-3.5" />
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

      {/* ============================================================ */}
      {/* 5. PREVIEW MODAL */}
      {/* ============================================================ */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">{previewDoc.name}</h3>
                  <p className="text-[10px] text-slate-300 font-mono">
                    Ref: {previewDoc.referenceNo} &bull; {previewDoc.currentVersion} &bull; {previewDoc.categoryLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Official Document Simulation Paper */}
              <div className="bg-amber-50/30 p-6 rounded-xl border border-amber-200 shadow-inner relative space-y-4">
                <div className="text-center border-b border-slate-200 pb-4">
                  <div className="font-black text-sm uppercase tracking-widest text-slate-900">
                    GOVERNMENT OF INDIA / GOVERNMENT OF BIHAR
                  </div>
                  <div className="text-[11px] text-slate-600 font-serif mt-0.5">
                    Competent Authority for Land Acquisition &bull; District Collectorate, Patna
                  </div>
                  <div className="text-xs font-mono font-bold text-gov-navy mt-2">
                    {previewDoc.referenceNo}
                  </div>
                </div>

                <div className="space-y-2 text-slate-800 leading-relaxed font-serif text-[13px]">
                  <p>
                    <strong>Subject: </strong>Formal statutory certification of <em>{previewDoc.name}</em> under the National Highways Act 1956 and Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act 2013.
                  </p>
                  <p>
                    <strong>Project: </strong>{previewDoc.projectName} ({previewDoc.projectId}) &bull; Mauza: {previewDoc.village} &bull; Cadastral Plot: Khasra {previewDoc.khasraNo}.
                  </p>
                  <p>
                    <strong>Certified Version: </strong>{previewDoc.currentVersion}, uploaded and digitally signed by {previewDoc.uploadedBy} on {previewDoc.uploadedAt}.
                  </p>
                </div>

                {previewDoc.extractedFields && (
                  <div className="mt-4 p-3.5 bg-white rounded-lg border border-slate-200 font-sans text-xs space-y-1">
                    <span className="font-bold text-[10px] text-blue-900 uppercase tracking-wider block">
                      AI Optical Entity Extraction Snapshot:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>Type: <strong>{previewDoc.extractedFields.documentType.value}</strong></div>
                      <div>Date: <strong>{previewDoc.extractedFields.date.value}</strong></div>
                      <div>Area: <strong>{previewDoc.extractedFields.area.value}</strong></div>
                      <div>Amount: <strong className="text-emerald-700">{previewDoc.extractedFields.amount.value}</strong></div>
                    </div>
                  </div>
                )}

                {/* Digital Watermark & Cryptographic Seal */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>NIC DigiLocker Authenticated</span>
                  <span>SHA-256 Seal: 0x8a91...4412</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Format: {previewDoc.fileType} ({previewDoc.fileSize})</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDemo(previewDoc)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Demo</span>
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. VERSION HISTORY & AUDIT MODAL (USER EXAMPLE: Award_1252.pdf) */}
      {/* ============================================================ */}
      {versionHistoryDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Version History & Audit Log: {versionHistoryDoc.name}</h3>
                  <p className="text-[10px] text-slate-300 font-mono">
                    Showing all versions ({versionHistoryDoc.versionHistory.length}) and compliance audit steps
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVersionHistoryDoc(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Versions Stepper (Version 1, Version 2, Version 3) */}
              <div>
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider mb-3">
                  Document Version Releases ({versionHistoryDoc.versionHistory.length})
                </h4>
                <div className="space-y-3">
                  {versionHistoryDoc.versionHistory.map((ver, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                        ver.versionNumber === versionHistoryDoc.currentVersion
                          ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-gov-navy text-white">
                            {ver.versionNumber}
                          </span>
                          <span className="font-bold text-slate-900">{ver.fileName}</span>
                          {ver.versionNumber === versionHistoryDoc.currentVersion && (
                            <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                              Current Active
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700">{ver.changeSummary}</p>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-3 pt-1">
                          <span>Uploaded: {ver.uploadedAt} by <strong>{ver.uploadedBy}</strong></span>
                          <span>&bull;</span>
                          <span>Size: {ver.fileSize}</span>
                          <span>&bull;</span>
                          <span>{ver.fileHash}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadDemo(versionHistoryDoc)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded font-bold text-[10px] flex items-center gap-1 shadow-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Trail: Uploaded by Officer -> Reviewed by State Officer -> Version updated -> Approved */}
              <div>
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Compliance Audit Log (Chronological)</span>
                </h4>
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-4 text-xs">
                  {versionHistoryDoc.auditTrail.map((audit) => (
                    <div key={audit.id} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white bg-gov-navy ring-2 ring-amber-300" />
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{audit.actionLabel}</span>
                            <span className="text-[10px] font-mono font-normal text-slate-500">
                              ({audit.version})
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{audit.timestamp}</span>
                        </div>
                        <p className="text-slate-700 mt-1 text-[11px]">{audit.notes}</p>
                        <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Officer: <strong className="text-slate-800">{audit.actorName}</strong> ({audit.actorRole})</span>
                          <span>Seal: <code>{audit.digitalSealHash}</code></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setVersionHistoryDoc(null)}
                className="px-4 py-1.5 bg-gov-navy text-white rounded-lg font-bold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. REPLACE VERSION MODAL */}
      {/* ============================================================ */}
      {replaceVersionDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <h3 className="font-black text-sm">Replace Document Version: {replaceVersionDoc.name}</h3>
              </div>
              <button
                onClick={() => setReplaceVersionDoc(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Current State</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  Current: {replaceVersionDoc.currentVersion} ({replaceVersionDoc.name})
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  New version will be recorded as: <strong className="text-emerald-700">Version {replaceVersionDoc.versionHistory.length + 1}</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">New Revision File Name</label>
                <input
                  type="text"
                  value={newVersionFileName}
                  onChange={(e) => setNewVersionFileName(e.target.value)}
                  placeholder="e.g. Award_1252_v4_amended.pdf"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Change Summary / Revision Remarks</label>
                <textarea
                  rows={3}
                  value={newVersionSummary}
                  onChange={(e) => setNewVersionSummary(e.target.value)}
                  placeholder="State the reason for this replacement, e.g. PWD valuation schedule amendment..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900">
                Replacing version preserves all previous historical revisions and appends an immutable compliance audit record.
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setReplaceVersionDoc(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReplaceVersion}
                className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs"
              >
                Confirm & Upload Version {replaceVersionDoc.versionHistory.length + 1}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. DOCUMENT AI SIMULATOR MODAL (6-STEP PIPELINE) */}
      {/* ============================================================ */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <h3 className="font-bold text-sm">Document AI Processing Pipeline Simulator</h3>
                  <p className="text-[10px] text-slate-300 font-mono">
                    Upload &rarr; OCR &rarr; Classification &rarr; Field Extraction &rarr; Validation &rarr; Link
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Target File Input Selector */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">
                  Select Document to Run AI Extraction:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={aiProcessingFile}
                    onChange={(e) => setAiProcessingFile(e.target.value)}
                    disabled={isAiRunning}
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="Award_1252.pdf">Award_1252.pdf (Section 3G Award Decree - K-125/2)</option>
                    <option value="Gazette_Notification_Section_3A_PRR.pdf">Gazette_Notification_Section_3A_PRR.pdf (Extraordinary Gazette)</option>
                    <option value="Khatiyan_Extract_RoR_K412_1.pdf">Khatiyan_Extract_RoR_K412_1.pdf (Cadastral Land Record)</option>
                  </select>

                  <button
                    onClick={() => handleRunDocumentAi()}
                    disabled={isAiRunning}
                    className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    {isAiRunning ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{isAiRunning ? 'Processing...' : 'Run Pipeline'}</span>
                  </button>
                </div>
              </div>

              {/* 6-Step Visual Workflow Stepper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>6-Stage Document AI Pipeline</span>
                  <span className="font-mono text-gov-navy">{aiProgressPercent}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${aiProgressPercent}%` }}
                  />
                </div>

                {/* Stepper Node Icons */}
                <div className="grid grid-cols-6 gap-1 pt-2 text-center text-[10px] font-bold">
                  {[
                    { key: 'UPLOAD', label: '1. Upload' },
                    { key: 'OCR', label: '2. OCR' },
                    { key: 'CLASSIFICATION', label: '3. Classify' },
                    { key: 'FIELD_EXTRACTION', label: '4. Extract' },
                    { key: 'VALIDATION', label: '5. Validate' },
                    { key: 'LINK_PARCEL', label: '6. Link' }
                  ].map((s, idx) => (
                    <div 
                      key={idx}
                      className={`p-1.5 rounded-lg border transition-all ${
                        aiStep === s.key && isAiRunning
                          ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-400/30 font-black'
                          : aiProgressPercent >= ((idx + 1) * 16.6)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>

                {aiProgressMessage && (
                  <p className="text-[11px] text-slate-600 font-mono text-center pt-1 animate-pulse">
                    {aiProgressMessage}
                  </p>
                )}
              </div>

              {/* Extracted 7 Fields Display with Confidence */}
              {aiExtractedResult && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>7 Extracted Fields & Confidence Ratings</span>
                    </div>
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Overall: {aiExtractedResult.overallConfidence}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* 1. Document Type */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>1. Document Type</span>
                        <span className="text-emerald-700 font-mono">{aiExtractedResult.documentType.confidence}%</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{aiExtractedResult.documentType.value}</div>
                    </div>

                    {/* 2. Project ID */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>2. Project ID</span>
                        <span className="text-emerald-700 font-mono">{aiExtractedResult.projectId.confidence}%</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{aiExtractedResult.projectId.value}</div>
                    </div>

                    {/* 3. Parcel ID */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>3. Parcel ID</span>
                        <span className="text-emerald-700 font-mono">{aiExtractedResult.parcelId.confidence}%</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{aiExtractedResult.parcelId.value}</div>
                    </div>

                    {/* 4. Khasra */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>4. Khasra Number</span>
                        <span className="text-emerald-700 font-mono">{aiExtractedResult.khasra.confidence}%</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{aiExtractedResult.khasra.value}</div>
                    </div>

                    {/* 5. Date */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>5. Statutory Date</span>
                        <span className="text-emerald-700 font-mono">{aiExtractedResult.date.confidence}%</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{aiExtractedResult.date.value}</div>
                    </div>

                    {/* 6. Area */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>6. Acquisition Area</span>
                        <span className="text-emerald-700 font-mono">{aiExtractedResult.area.confidence}%</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{aiExtractedResult.area.value}</div>
                    </div>

                    {/* 7. Amount */}
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 sm:col-span-2">
                      <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold uppercase">
                        <span>7. Compensation Award Amount</span>
                        <span className="text-emerald-700 font-mono font-bold">{aiExtractedResult.amount.confidence}% Confidence</span>
                      </div>
                      <div className="font-black text-emerald-900 text-sm font-mono mt-0.5">{aiExtractedResult.amount.value}</div>
                    </div>
                  </div>

                  {/* Mandatory Disclaimer Tag */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Important Notice: </strong>{DOCUMENT_AI_DISCLAIMER}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Pipeline Status: {aiExtractedResult ? 'Completed' : isAiRunning ? 'In Progress' : 'Ready'}</span>
              <div className="flex items-center gap-2">
                {aiExtractedResult && (
                  <button
                    onClick={handleLinkAiResultToRepository}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Record to Repository</span>
                  </button>
                )}
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
