import React, { useState } from 'react';
import { X, Building2, MapPin, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (newProject: any) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    state: 'Bihar',
    district: 'Patna',
    department: 'MoRTH / NHAI',
    implementingAgency: 'NHAI Regional Office',
    corridorLengthKm: '45.0',
    proposedLandAcres: '520',
    budgetCr: '380.0',
    statutoryAct: 'NH_ACT_1956'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a project name');
      return;
    }

    showToast({
      title: 'Infrastructure Corridor Registered',
      message: `Project ${formData.name} successfully registered in National PM GatiShakti Portal with Code ${formData.code || 'NHAI-REG-2026'}`,
      type: 'success'
    });

    if (onProjectCreated) {
      onProjectCreated({
        id: `PRJ-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        code: formData.code || 'NHAI-2026-CORR',
        state: formData.state,
        district: formData.district,
        implementingAgency: formData.implementingAgency,
        department: formData.department,
        landProposedAcres: parseFloat(formData.proposedLandAcres) || 500,
        landAcquiredAcres: 0,
        parcelsCount: Math.round((parseFloat(formData.proposedLandAcres) || 500) * 0.8),
        acquisitionPercent: 0,
        compensationPercent: 0,
        rrPercent: 0,
        riskLevel: 'LOW',
        status: 'SURVEY_UNDERWAY',
        corridorLengthKm: parseFloat(formData.corridorLengthKm) || 40,
        coordinates: [25.5941, 85.0845]
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Building2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                PM GATISHAKTI &bull; NATIONAL MASTER PLAN
              </span>
              <h3 className="text-lg font-bold text-white">
                Register New Land Acquisition Corridor
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Patna Outer Ring Road Northern Alignment (Package 3)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Code / MoRTH ID
              </label>
              <input
                type="text"
                placeholder="e.g. NHAI-BR-PORR-PKG3"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sponsoring Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
              >
                <option value="MoRTH / NHAI">MoRTH / NHAI</option>
                <option value="Ministry of Railways / DFCCIL">Ministry of Railways / DFCCIL</option>
                <option value="Ministry of Ports & Shipping">Ministry of Ports & Shipping</option>
                <option value="Ministry of Civil Aviation">Ministry of Civil Aviation</option>
                <option value="State Highway Authority">State Highway Authority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
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
                Primary Revenue District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Corridor Length (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.corridorLengthKm}
                onChange={(e) => setFormData({ ...formData, corridorLengthKm: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Proposed Land Required (Acres)
              </label>
              <input
                type="number"
                value={formData.proposedLandAcres}
                onChange={(e) => setFormData({ ...formData, proposedLandAcres: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Land Compensation (₹ Cr)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.budgetCr}
                onChange={(e) => setFormData({ ...formData, budgetCr: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Governing Land Acquisition Act
              </label>
              <select
                value={formData.statutoryAct}
                onChange={(e) => setFormData({ ...formData, statutoryAct: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy text-slate-900"
              >
                <option value="NH_ACT_1956">National Highways Act, 1956 (Section 3A-3E)</option>
                <option value="RFCTLARR_2013">RFCTLARR Act, 2013 (Right to Fair Compensation)</option>
                <option value="RAILWAYS_ACT">Railways Act, 1989 (Special Railway Projects)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mt-2">
            <ShieldCheck size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              Registration initiates automated geofencing on the Survey of India Cadastral layer and activates statutory milestone SLA trackers for Section 3A Gazette publication.
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Register Corridor Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
