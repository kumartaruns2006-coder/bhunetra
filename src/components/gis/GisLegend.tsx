import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Info } from 'lucide-react';
import { MapStatusCategory } from '../../types/gis';

interface GisLegendProps {
  statusCounts?: Record<MapStatusCategory, number>;
  totalParcels?: number;
}

export const GisLegend: React.FC<GisLegendProps> = ({
  statusCounts = {
    ACQUIRED: 0,
    PENDING: 0,
    DISPUTED: 0,
    VERIFIED: 0,
    VERIFICATION_PENDING: 0,
    PROPOSED: 0
  },
  totalParcels = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const legendItems = [
    {
      label: 'Acquired',
      status: 'ACQUIRED' as MapStatusCategory,
      color: '#16A34A',
      border: '#15803D',
      desc: 'Section 3E possession & compensation disbursed',
      count: statusCounts.ACQUIRED || 0
    },
    {
      label: 'Pending',
      status: 'PENDING' as MapStatusCategory,
      color: '#EAB308',
      border: '#CA8A04',
      desc: 'Section 3D / 3G award inquiry in progress',
      count: statusCounts.PENDING || 0
    },
    {
      label: 'Disputed',
      status: 'DISPUTED' as MapStatusCategory,
      color: '#DC2626',
      border: '#B91C1C',
      desc: 'Title dispute, civil court stay, or high risk',
      count: statusCounts.DISPUTED || 0
    },
    {
      label: 'Verified',
      status: 'VERIFIED' as MapStatusCategory,
      color: '#2563EB',
      border: '#1D4ED8',
      desc: 'Cadastral boundary & DGPS coordinates certified',
      count: statusCounts.VERIFIED || 0
    },
    {
      label: 'Field Verification Pending',
      status: 'VERIFICATION_PENDING' as MapStatusCategory,
      color: '#EA580C',
      border: '#C2410C',
      desc: 'Amin ground-truth inspection requested',
      count: statusCounts.VERIFICATION_PENDING || 0
    },
    {
      label: 'Proposed',
      status: 'PROPOSED' as MapStatusCategory,
      color: '#64748B',
      border: '#475569',
      desc: 'Preliminary alignment notification (Section 3A)',
      count: statusCounts.PROPOSED || 0
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-xl overflow-hidden transition-all duration-200 max-w-xs">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/70 flex items-center justify-between transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gov-navy/10 flex items-center justify-center text-gov-navy">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">
              Cadastral Legend
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              {totalParcels} Total Tracked Parcels
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 space-y-2.5">
          <div className="space-y-1.5">
            {legendItems.map(item => (
              <div
                key={item.status}
                className="flex items-center justify-between group py-0.5 px-1 rounded hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-sm shadow-xs flex-shrink-0"
                    style={{
                      backgroundColor: item.color,
                      border: `1.5px solid ${item.border}`
                    }}
                  />
                  <div className="text-xs font-semibold text-slate-700">
                    {item.label}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Corridor Symbols */}
          <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Corridor Features
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-blue-600 rounded"></span>
                <span>Expressway Centerline</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">24.8 km</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-2 bg-blue-500/20 border border-blue-500 border-dashed rounded-xs"></span>
                <span>Right of Way (RoW)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">60m Buffer</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
