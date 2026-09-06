import React, { useState } from 'react';
import { Parcel } from '../../types/parcel';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ClipboardCheck, 
  Compass, 
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { RiskBadge, StageBadge, StatusBadge } from '../common/Badge';

interface ParcelTableProps {
  parcels: Parcel[];
  onSelectParcel: (parcel: Parcel) => void;
  onOpenDigitalTwin: (parcel: Parcel) => void;
  onLaunchVerification: (parcel: Parcel) => void;
  onNavigateToMap: (parcel: Parcel) => void;
}

export const ParcelTable: React.FC<ParcelTableProps> = ({
  parcels,
  onSelectParcel,
  onOpenDigitalTwin,
  onLaunchVerification,
  onNavigateToMap
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [villageFilter, setVillageFilter] = useState('ALL');

  const villages = Array.from(new Set(parcels.map(p => p.village)));

  const filtered = parcels.filter(p => {
    if (stageFilter !== 'ALL' && p.currentStage !== stageFilter) return false;
    if (riskFilter !== 'ALL' && p.aiRisk.riskLevel !== riskFilter) return false;
    if (villageFilter !== 'ALL' && p.village !== villageFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesKhasra = p.khasraNo.toLowerCase().includes(term);
      const matchesKhata = p.khataNo.toLowerCase().includes(term);
      const matchesOwner = p.primaryOwnerName.toLowerCase().includes(term);
      const matchesVillage = p.village.toLowerCase().includes(term);
      return matchesKhasra || matchesKhata || matchesOwner || matchesVillage;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header & Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-gov-navy" />
              Corridor Cadastral Parcels Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive registry of all 482 Khasras under Patna Ring Road (Phase II) acquisition
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-200">
            Displaying {filtered.length} of {parcels.length} Active Records
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Khasra, Khata, Raiyat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-gov-navy"
            />
          </div>

          {/* Village Filter */}
          <select
            aria-label="Filter Village"
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Revenue Villages</option>
            {villages.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            aria-label="Filter Statutory Stage"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Statutory Stages</option>
            <option value="SECTION_3A">Section 3A (Intent)</option>
            <option value="SECTION_3C">Section 3C (Objections)</option>
            <option value="SECTION_3D">Section 3D (Declaration)</option>
            <option value="SECTION_3G">Section 3G (Award Valuation)</option>
            <option value="SECTION_3H">Section 3H (Compensation)</option>
            <option value="SECTION_3E">Section 3E (Possession)</option>
          </select>

          {/* Risk Filter */}
          <select
            aria-label="Filter Risk Level"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk (Clean)</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Litigation</option>
          </select>
        </div>
      </div>

      {/* Parcels Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Cadastral Plot</th>
                <th className="py-3 px-4">Village / Tehsil</th>
                <th className="py-3 px-4">Recorded Raiyat</th>
                <th className="py-3 px-4">Acq Area</th>
                <th className="py-3 px-4">Statutory Stage</th>
                <th className="py-3 px-4">AI Risk Score</th>
                <th className="py-3 px-4 font-mono">Award Amount</th>
                <th className="py-3 px-4 text-right">Digital Twin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((parcel) => (
                <tr 
                  key={parcel.id} 
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  onClick={() => onOpenDigitalTwin(parcel)}
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block text-sm">
                      Khasra {parcel.khasraNo}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Khata {parcel.khataNo} &bull; Jamabandi {parcel.jamabandiNo}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{parcel.village}</span>
                    <span className="text-[10px] text-slate-500">{parcel.tehsil}, Patna</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">{parcel.primaryOwnerName}</span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                      {parcel.coSharers.length > 0 ? `${parcel.coSharers.length} Co-Sharers` : 'Sole Owner'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-800 block">{parcel.acquisitionAreaHectares} Ha</span>
                    <span className="text-[10px] text-slate-500">{parcel.acquisitionAreaSqM.toLocaleString()} sq.m</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <StageBadge stage={parcel.currentStage} />
                    <div className="mt-1">
                      <StatusBadge status={parcel.status} />
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <RiskBadge level={parcel.aiRisk.riskLevel} score={parcel.aiRisk.overallRiskScore} />
                    {parcel.fieldVerification.some(v => v.encroachmentDetected) && (
                      <span className="block text-[10px] text-red-600 font-semibold mt-1">
                        Encroachment Flagged
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                    ₹{(parcel.compensation.totalAwardAmount / 10000000).toFixed(2)} Cr
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onNavigateToMap(parcel)}
                        title="Locate on GIS Map"
                        className="p-1.5 rounded text-slate-500 hover:text-gov-navy hover:bg-slate-100"
                      >
                        <Compass size={15} />
                      </button>
                      <button
                        onClick={() => onLaunchVerification(parcel)}
                        title="Amin Field Verification"
                        className="p-1.5 rounded text-slate-500 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <ClipboardCheck size={15} />
                      </button>
                      <button
                        onClick={() => onOpenDigitalTwin(parcel)}
                        className="px-2.5 py-1 bg-gov-navy hover:bg-gov-navy-light text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                      >
                        Dossier <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
