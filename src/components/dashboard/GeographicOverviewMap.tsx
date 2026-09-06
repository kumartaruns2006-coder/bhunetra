import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ProjectProgressRecord } from '../../types/nationalDashboard';
import { Layers, MapPin, Maximize2, Minimize2, ZoomIn, ZoomOut, AlertCircle, Compass } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface GeographicOverviewMapProps {
  projects: ProjectProgressRecord[];
  onSelectProject: (projectId: string) => void;
  selectedStateFilter?: string;
}

export const GeographicOverviewMap: React.FC<GeographicOverviewMapProps> = ({
  projects,
  onSelectProject,
  selectedStateFilter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedMapProject, setSelectedMapProject] = useState<ProjectProgressRecord | null>(null);
  const [activeLayer, setActiveLayer] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on India
    const map = L.map(mapContainerRef.current, {
      center: [22.8, 80.0],
      zoom: 5,
      zoomControl: false,
      attributionControl: false
    });

    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      }
    ).addTo(map);

    baseTileLayerRef.current = tileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;

    baseTileLayerRef.current.remove();

    let newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
    if (activeLayer === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    } else if (activeLayer === 'terrain') {
      newUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, SRTM | Map style: &copy; OpenTopoMap';
    }

    const newTileLayer = L.tileLayer(newUrl, {
      maxZoom: 19,
      attribution
    }).addTo(mapInstanceRef.current);

    baseTileLayerRef.current = newTileLayer;
  }, [activeLayer]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = selectedStateFilter && selectedStateFilter !== 'All States'
      ? projects.filter(p => p.state.toLowerCase() === selectedStateFilter.toLowerCase())
      : projects;

    filtered.forEach((p) => {
      const isCritical = p.riskLevel === 'CRITICAL';
      const isHigh = p.riskLevel === 'HIGH';
      const isMedium = p.riskLevel === 'MEDIUM';

      const color = isCritical ? '#DC2626' : isHigh ? '#EA580C' : isMedium ? '#2563EB' : '#16A34A';
      const pulseColor = isCritical ? 'rgba(220, 38, 38, 0.4)' : isHigh ? 'rgba(234, 88, 12, 0.4)' : 'rgba(22, 163, 74, 0.2)';

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 32px; height: 32px;">
          <div class="absolute inset-0 rounded-full animate-ping" style="background-color: ${pulseColor};"></div>
          <div class="w-7 h-7 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white font-bold text-[10px]" style="background-color: ${color};">
            ${p.state.slice(0, 2).toUpperCase()}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(p.coordinates, { icon: customIcon });

      const popupContent = `
        <div class="p-2 min-w-[210px] font-sans text-slate-900">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${p.state} &bull; ${p.district}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${
              isCritical ? 'bg-red-100 text-red-700' : isHigh ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }">${p.riskLevel} RISK</span>
          </div>
          <h4 class="font-bold text-xs text-slate-900 mb-1 leading-tight">${p.name}</h4>
          <div class="text-[11px] text-slate-600 mb-2">
            <div>Length: <strong>${p.corridorLengthKm} km</strong></div>
            <div>Acquired: <strong>${p.landAcquiredAcres} / ${p.landProposedAcres} Acres (${p.acquisitionPercent}%)</strong></div>
          </div>
          <button id="marker-btn-${p.id}" class="w-full py-1 px-2 bg-[#0B2545] hover:bg-[#133E6D] text-white text-[11px] font-bold rounded shadow-sm transition-all flex items-center justify-center gap-1">
            Open Project Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`marker-btn-${p.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectProject(p.id);
          };
        }
      });

      marker.on('click', () => {
        setSelectedMapProject(p);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Auto fit if specific state
    if (filtered.length > 0 && selectedStateFilter && selectedStateFilter !== 'All States') {
      const bounds = L.latLngBounds(filtered.map(p => p.coordinates));
      mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  }, [projects, selectedStateFilter]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapInstanceRef.current) return;
    if (direction === 'in') mapInstanceRef.current.zoomIn();
    else mapInstanceRef.current.zoomOut();
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([22.8, 80.0], 5);
  };

  return (
    <div className={`relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[440px]'}`}>
      {/* Map Control Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-bold tracking-wide">
            Interactive National Corridor GIS Map
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {projects.length} Major Projects Mapped
          </span>
        </div>

        {/* Layer & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Base Layer Switcher */}
          <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-[11px]">
            <button
              onClick={() => setActiveLayer('streets')}
              className={`px-2 py-1 rounded font-medium transition-all ${activeLayer === 'streets' ? 'bg-gov-navy text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Voyager
            </button>
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-2 py-1 rounded font-medium transition-all ${activeLayer === 'satellite' ? 'bg-gov-navy text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveLayer('terrain')}
              className={`px-2 py-1 rounded font-medium transition-all ${activeLayer === 'terrain' ? 'bg-gov-navy text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Topo
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700"
            title="Center National View"
          >
            <Compass size={14} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Zoom Controls */}
        <div className="absolute right-4 top-4 z-[400] flex flex-col gap-1.5 bg-white rounded-lg shadow-md border border-slate-200 p-1">
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
        </div>

        {/* Floating Quick Legend */}
        <div className="absolute left-4 bottom-4 z-[400] bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 text-xs space-y-1.5">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
            Corridor Risk Legend
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
            <span>Low Risk / On Track (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span>Medium Risk / Survey Underway</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="w-3 h-3 rounded-full bg-amber-600"></span>
            <span>High Risk / Demarcation Issues</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-700">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
            <span>Critical Hold / Court Stay</span>
          </div>
        </div>

        {/* Selected Project Card Overlay (if clicked) */}
        {selectedMapProject && (
          <div className="absolute right-4 bottom-4 z-[400] bg-white rounded-xl p-4 shadow-xl border border-slate-200 max-w-xs space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <Badge variant={selectedMapProject.riskLevel === 'CRITICAL' ? 'danger' : selectedMapProject.riskLevel === 'HIGH' ? 'warning' : 'success'} size="sm">
                {selectedMapProject.riskLevel} RISK
              </Badge>
              <button
                onClick={() => setSelectedMapProject(null)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>
            <h4 className="font-bold text-xs text-slate-900">
              {selectedMapProject.name}
            </h4>
            <div className="text-[11px] text-slate-600 space-y-0.5">
              <div>State: <strong className="text-slate-800">{selectedMapProject.state}</strong> ({selectedMapProject.district})</div>
              <div>Acquired: <strong className="text-emerald-700">{selectedMapProject.landAcquiredAcres} Ac</strong> of {selectedMapProject.landProposedAcres} Ac ({selectedMapProject.acquisitionPercent}%)</div>
              <div>Agency: <strong className="text-slate-800">{selectedMapProject.implementingAgency}</strong></div>
            </div>
            <button
              onClick={() => onSelectProject(selectedMapProject.id)}
              className="w-full mt-2 py-1.5 px-3 bg-gov-navy hover:bg-gov-navy-light text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              Open Project Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
