import React, { useState, useEffect } from 'react';
import {
  StateConfig,
  DistrictConfig,
  DepartmentConfig,
  ProjectTypeConfig,
  WorkflowStageConfig,
  ValidationRuleConfig,
  NotificationTemplateConfig
} from '../../types/config';
import { configService } from '../../services/configService';
import { i18n } from '../../services/i18nService';
import {
  Settings,
  MapPin,
  Building,
  GitFork,
  CheckCircle2,
  Bell,
  Plus,
  RotateCcw,
  Save,
  Globe,
  Sliders,
  ShieldCheck,
  FileText,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Check,
  Edit2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const PlatformConfigurationView: React.FC = () => {
  const [config, setConfig] = useState(configService.getConfig());
  const [activeTab, setActiveTab] = useState<'STATES' | 'WORKFLOW' | 'AGENCIES' | 'RULES' | 'NOTIFICATIONS'>('STATES');

  // Selected state for district inspection
  const [selectedStateCode, setSelectedStateCode] = useState<string>('BR');

  // State for adding a new state
  const [showAddStateModal, setShowAddStateModal] = useState(false);
  const [newState, setNewState] = useState<Partial<StateConfig>>({
    code: '',
    name: '',
    hindiName: '',
    lgdCode: '',
    capital: '',
    districtsCount: 20,
    active: true
  });

  // State for editing a workflow stage duration
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [editDuration, setEditDuration] = useState<number>(30);
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);

  // Subscribe to config changes
  useEffect(() => {
    return configService.subscribe(newConfig => {
      setConfig(newConfig);
    });
  }, []);

  const triggerSaveNotification = (msg: string) => {
    setSaveSuccessToast(msg);
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  const handleAddState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newState.code || !newState.name) return;

    const createdState: StateConfig = {
      code: newState.code.toUpperCase(),
      name: newState.name,
      hindiName: newState.hindiName || newState.name,
      lgdCode: newState.lgdCode || '99',
      capital: newState.capital || 'Capital City',
      districtsCount: Number(newState.districtsCount) || 10,
      active: true,
      isDemoDataset: false
    };

    configService.addState(createdState);
    setShowAddStateModal(false);
    setNewState({ code: '', name: '', hindiName: '', lgdCode: '', capital: '', districtsCount: 20, active: true });
    setSelectedStateCode(createdState.code);
    triggerSaveNotification(`State '${createdState.name}' added successfully to pan-India registry.`);
  };

  const handleSaveStageDuration = (stage: WorkflowStageConfig) => {
    configService.updateWorkflowStage({
      ...stage,
      standardDurationDays: editDuration
    });
    setEditingStageId(null);
    triggerSaveNotification(`Stage #${stage.stageNumber} target duration updated to ${editDuration} days.`);
  };

  const handleToggleRule = (ruleId: string, ruleName: string) => {
    configService.toggleRule(ruleId);
    triggerSaveNotification(`Rule '${ruleName}' status toggled.`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all platform configuration registries and workflow stages to statutory defaults?')) {
      configService.resetToDefaults();
      triggerSaveNotification('System configuration restored to statutory national defaults.');
    }
  };

  const filteredDistricts = config.districts.filter(d => d.stateCode === selectedStateCode);
  const selectedStateObj = config.states.find(s => s.code === selectedStateCode) || config.states[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Save Success Banner */}
      {saveSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{saveSuccessToast}</span>
          </div>
          <span className="text-[10px] text-emerald-700 uppercase font-bold">SAVED TO REGISTRY</span>
        </div>
      )}

      {/* Top Banner & Decoupled State Architecture Note */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <Globe size={15} className="text-indigo-600" />
            PAN-INDIA SCALABILITY & LEGISLATIVE CONFIGURATION ENGINE
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {i18n.t('admin.config_title', 'Platform Configuration & Scalability')}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            <strong>Architecture Note:</strong> The core platform is fully decoupled from any single jurisdiction.
            <strong> Bihar is the active demonstration dataset</strong>, while the underlying schemas, workflow stages, and agency registries are dynamically configurable across all 28 States and 8 Union Territories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw size={13} className="text-slate-600" />}
            onClick={handleResetDefaults}
            className="border-slate-300 hover:bg-slate-50 text-xs font-semibold"
          >
            Reset Defaults
          </Button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('STATES')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'STATES'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <MapPin size={14} />
          States & Districts ({config.states.length})
        </button>

        <button
          onClick={() => setActiveTab('WORKFLOW')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'WORKFLOW'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <GitFork size={14} />
          Workflow Stages as Data (15 Stages)
        </button>

        <button
          onClick={() => setActiveTab('AGENCIES')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'AGENCIES'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building size={14} />
          Departments & Project Types
        </button>

        <button
          onClick={() => setActiveTab('RULES')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'RULES'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShieldCheck size={14} />
          Cadastral Rules & Statuses
        </button>

        <button
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'NOTIFICATIONS'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Bell size={14} />
          Notification Templates ({config.notificationTemplates.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: STATES & DISTRICTS REGISTRY                                    */}
      {/* ========================================================================= */}
      {activeTab === 'STATES' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">National State & Union Territory Registry</h3>
              <p className="text-xs text-slate-500">Configure jurisdictions dynamically without recompiling application code</p>
            </div>
            <Button
              variant="gov-navy"
              size="sm"
              leftIcon={<Plus size={14} className="text-amber-300" />}
              onClick={() => setShowAddStateModal(true)}
              className="text-xs font-bold shadow-sm"
            >
              Add New State / UT
            </Button>
          </div>

          {/* Modal to Add New State */}
          {showAddStateModal && (
            <Card className="border-2 border-indigo-200 shadow-lg animate-in zoom-in-95 duration-150">
              <CardHeader className="py-3 px-5 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-indigo-950">Add New State to National Registry</CardTitle>
                <button
                  onClick={() => setShowAddStateModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={handleAddState} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">State Code (2 Letters)</label>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder="e.g. PB"
                      value={newState.code}
                      onChange={e => setNewState(prev => ({ ...prev, code: e.target.value }))}
                      required
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 uppercase font-mono font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">State Name (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Punjab"
                      value={newState.name}
                      onChange={e => setNewState(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">State Name (Hindi)</label>
                    <input
                      type="text"
                      placeholder="e.g. पंजाब"
                      value={newState.hindiName}
                      onChange={e => setNewState(prev => ({ ...prev, hindiName: e.target.value }))}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">LGD Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 03"
                      value={newState.lgdCode}
                      onChange={e => setNewState(prev => ({ ...prev, lgdCode: e.target.value }))}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Capital City</label>
                    <input
                      type="text"
                      placeholder="e.g. Chandigarh"
                      value={newState.capital}
                      onChange={e => setNewState(prev => ({ ...prev, capital: e.target.value }))}
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="sm:col-span-3 lg:col-span-6 flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAddStateModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="gov-navy" size="sm">
                      Save State to Registry
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* States Table */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">State Code</th>
                    <th className="py-3 px-3">State Name (EN)</th>
                    <th className="py-3 px-3">State Name (HI)</th>
                    <th className="py-3 px-3">LGD Code</th>
                    <th className="py-3 px-3">Capital</th>
                    <th className="py-3 px-3">Districts</th>
                    <th className="py-3 px-3">Dataset Status</th>
                    <th className="py-3 px-4 text-right">Inspect Districts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {config.states.map(s => (
                    <tr
                      key={s.code}
                      className={`hover:bg-slate-50 transition-colors ${selectedStateCode === s.code ? 'bg-indigo-50/40' : ''}`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-gov-navy">{s.code}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{s.hindiName}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{s.lgdCode}</td>
                      <td className="py-3 px-3 text-slate-700">{s.capital}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{s.districtsCount} Districts</td>
                      <td className="py-3 px-3">
                        {s.isDemoDataset ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Active Demo Dataset
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Registry Connected
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStateCode(s.code)}
                          className="px-2.5 py-1 rounded text-[11px] font-bold border border-slate-300 hover:bg-gov-navy hover:text-white transition-colors"
                        >
                          {selectedStateCode === s.code ? 'Selected' : 'View Districts'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Configured Districts for Selected State */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Configured Revenue Districts for {selectedStateObj.name} ({selectedStateObj.code})
                </h4>
                <p className="text-[11px] text-slate-500">Revenue divisions and sub-divisional offices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredDistricts.length === 0 ? (
                <div className="col-span-4 p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-lg">
                  No explicit revenue sub-divisions configured for {selectedStateObj.name} yet. Default statewide LGD directory active.
                </div>
              ) : (
                filteredDistricts.map(dist => (
                  <div key={dist.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{dist.name}</span>
                      <span className="text-[10px] font-mono font-bold text-gov-navy">{dist.code}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-600">
                      <span className="font-semibold block text-[10px] text-slate-500 uppercase">Sub-Divisions / Tehsils:</span>
                      <span className="line-clamp-2">{dist.revenueDivisions.join(', ')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: WORKFLOW STAGES (DATA-DRIVEN POLICY ENGINE)                     */}
      {/* ========================================================================= */}
      {activeTab === 'WORKFLOW' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-950 flex items-start gap-3">
            <GitFork size={18} className="text-indigo-700 mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider block">
                Legislative Workflow Configuration (Stages Stored as Configurable Data)
              </span>
              <p className="leading-relaxed">
                All 15 statutory land acquisition stages are maintained as configurable records rather than compiled code.
                This enables adapting standard SLAs, statutory act references, and responsible authorities in response to future parliamentary amendments or state rules without software redeployment.
              </p>
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">15 Statutory Acquisition Stages</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Standard baseline durations and governing statutory acts
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Stage #</th>
                    <th className="py-3 px-3">Stage Name</th>
                    <th className="py-3 px-3">Statutory Reference</th>
                    <th className="py-3 px-3">Responsible Authority</th>
                    <th className="py-3 px-3">Standard Duration</th>
                    <th className="py-3 px-4 text-right">Configure SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {config.workflowStages.map(stg => {
                    const isEditing = editingStageId === stg.id;
                    return (
                      <tr key={stg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-gov-navy text-sm">
                          #{stg.stageNumber}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {stg.name}
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">
                          {stg.statutoryAct}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {stg.responsibleAuthority}
                        </td>
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={5}
                                max={365}
                                value={editDuration}
                                onChange={e => setEditDuration(Number(e.target.value))}
                                className="w-16 px-2 py-1 text-xs border border-indigo-400 rounded font-bold"
                              />
                              <span className="text-xs text-slate-500">Days</span>
                            </div>
                          ) : (
                            <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {stg.standardDurationDays} Days
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveStageDuration(stg)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingStageId(null)}
                                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingStageId(stg.id);
                                setEditDuration(stg.standardDurationDays);
                              }}
                              className="px-2.5 py-1 rounded text-[11px] font-bold border border-slate-300 hover:bg-gov-navy hover:text-white transition-colors"
                            >
                              Edit SLA
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: DEPARTMENTS & PROJECT TYPES                                    */}
      {/* ========================================================================= */}
      {activeTab === 'AGENCIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departments */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-3 px-5 bg-slate-50/80 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-900">Implementing Agencies & Departments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Code</th>
                    <th className="py-2.5 px-3">Agency Name</th>
                    <th className="py-2.5 px-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {config.departments.map(dept => (
                    <tr key={dept.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-gov-navy">{dept.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{dept.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {dept.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Project Types */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="py-3 px-5 bg-slate-50/80 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-900">Project Corridor Types</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-3">Std RoW</th>
                    <th className="py-2.5 px-3">Solatium</th>
                    <th className="py-2.5 px-3">Statutory Act</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {config.projectTypes.map(pt => (
                    <tr key={pt.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900">{pt.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{pt.code}</div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{pt.standardRowWidthM}m</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{pt.defaultSolatiumFactor * 100}%</td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600">{pt.statutoryAct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: RULES & STATUSES                                               */}
      {/* ========================================================================= */}
      {activeTab === 'RULES' && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="py-3 px-5 bg-slate-50/80 border-b border-slate-200">
            <CardTitle className="text-sm font-bold text-slate-900">Statutory Cadastral Validation Rules</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Enable or disable automated validation rules enforced during cadastral ingestion
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Rule Code</th>
                  <th className="py-3 px-3">Rule Name & Specification</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-4 text-right">Status / Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {config.validationRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-gov-navy">{rule.code}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{rule.name}</div>
                      <div className="text-[11px] text-slate-500">{rule.description}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.severity === 'ERROR' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleRule(rule.id, rule.name)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          rule.enabled
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-200 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {rule.enabled ? <ToggleRight size={16} className="text-emerald-700" /> : <ToggleLeft size={16} />}
                        <span>{rule.enabled ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: NOTIFICATION TEMPLATES                                         */}
      {/* ========================================================================= */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Statutory Notification & Citizen Alert Templates
            </h3>
            <p className="text-[11px] text-slate-500">
              Supported dynamic variables: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">{"{PROJECT_NAME}"}</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">{"{PARCEL_KHASRA}"}</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">{"{AMOUNT_CR}"}</code>, <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">{"{RECIPIENT_NAME}"}</code>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.notificationTemplates.map(tmpl => (
              <Card key={tmpl.id} className="border-slate-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gov-navy text-white font-mono">
                      {tmpl.channel}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{tmpl.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{tmpl.code}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
                  {tmpl.templateText}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check size={12} /> Active in Dispatch Pipeline
                  </span>
                  <button
                    onClick={() => {
                      const updated = prompt('Edit Notification Template:', tmpl.templateText);
                      if (updated && updated.trim()) {
                        configService.updateTemplate({ ...tmpl, templateText: updated.trim() });
                        triggerSaveNotification(`Template '${tmpl.title}' updated.`);
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-900 font-bold flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Edit Template
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
