import React, { useState } from 'react';
import { 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square, 
  Map, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  FileCheck2, 
  Milestone
} from 'lucide-react';
import { GisLayerVisibility, BasemapStyle } from '../../types/gis';

interface GisLayerControlsProps {
  layers: GisLayerVisibility;
  onToggleLayer: (key: keyof GisLayerVisibility) => void;
  basemap: BasemapStyle;
  onChangeBasemap: (style: BasemapStyle) => void;
  opacity: number;
  onChangeOpacity: (opacity: number) => void;
}

export const GisLayerControls: React.FC<GisLayerControlsProps> = ({
  layers,
  onToggleLayer,
  basemap,
  onChangeBasemap,
  opacity,
  onChangeOpacity
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const layerItems: {
    key: keyof GisLayerVisibility;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }[] = [
    {
      key: 'projectBoundary',
      label: 'Project Boundary & RoW',
      icon: <Milestone className="w-3.5 h-3.5 text-blue-600" />,
      color: '#2563EB',
      description: '60m statutory buffer & centerline alignment'
    },
    {
      key: 'landParcels',
      label: 'All Land Parcels',
      icon: <Layers className="w-3.5 h-3.5 text-slate-600" />,
      color: '#64748B',
      description: 'Complete cadastral plot geometry & outlines'
    },
    {
      key: 'acquiredParcels',
      label: 'Acquired Parcels',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      color: '#16A34A',
      description: 'Section 3E possession & award settled'
    },
    {
      key: 'pendingParcels',
      label: 'Pending Parcels',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
      color: '#EAB308',
      description: 'Section 3D hearing / 3G award calculation'
    },
    {
      key: 'disputedParcels',
      label: 'Disputed Parcels',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-red-600" />,
      color: '#DC2626',
      description: 'Litigation, title dispute, stay orders'
    },
    {
      key: 'fieldVerification',
      label: 'Field Verification Flagged',
      icon: <FileCheck2 className="w-3.5 h-3.5 text-blue-500" />,
      color: '#2563EB',
      description: 'Amin ground-truth DGPS & inspection markers'
    },
    {
      key: 'highRiskParcels',
      label: 'High Risk Parcels (AI)',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />,
      color: '#EA580C',
      description: 'Parcels with AI Risk Score >= 65'
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-xl overflow-hidden transition-all duration-200 w-72">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/70 flex items-center justify-between transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600/10 flex items-center justify-center text-blue-600">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">
              Layer Controls
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              {Object.values(layers).filter(Boolean).length} Active Layers
            </div>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="p-3 space-y-3.5 max-h-[420px] overflow-y-auto">
          {/* Basemap Selection */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Map className="w-3 h-3 text-slate-500" />
              Basemap Style
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['streets', 'satellite', 'dark', 'terrain'] as BasemapStyle[]).map(style => (
                <button
                  key={style}
                  onClick={() => onChangeBasemap(style)}
                  className={`px-1.5 py-1.5 text-[10px] font-semibold rounded-lg capitalize border transition-all text-center truncate ${
                    basemap === style
                      ? 'bg-gov-navy text-white border-gov-navy shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {style === 'streets' ? 'Street' : style === 'satellite' ? 'Satellite' : style === 'dark' ? 'Dark GIS' : 'Topo'}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-slate-500" />
                Fill Opacity
              </span>
              <span className="text-slate-700 font-mono text-[11px]">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Cadastral & Thematic Layers */}
          <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Thematic Layers
            </div>
            {layerItems.map(item => {
              const active = layers[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => onToggleLayer(item.key)}
                  className={`w-full flex items-start gap-2.5 p-1.5 rounded-lg text-left transition-colors ${
                    active ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="mt-0.5">
                    {active ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {item.icon}
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
