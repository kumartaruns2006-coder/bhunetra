import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Parcel } from '../../types/parcel';
import { MapPin, Eye, Layers, ZoomIn, ZoomOut, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface CitizenGisMapProps {
  parcels: Parcel[];
  selectedParcel?: Parcel | null;
  onOpenDigitalTwin: (parcel: Parcel) => void;
}

export const CitizenGisMap: React.FC<CitizenGisMapProps> = ({
  parcels,
  selectedParcel: initialSelectedParcel,
  onOpenDigitalTwin
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(
    initialSelectedParcel || (parcels.length > 0 ? parcels[0] : null)
  );
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');

  useEffect(() => {
    if (initialSelectedParcel) {
      setSelectedParcel(initialSelectedParcel);
    }
  }, [initialSelectedParcel]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter: [number, number] = selectedParcel
      ? [selectedParcel.coordinates[1], selectedParcel.coordinates[0]]
      : [88.4695, 22.5872]; // North 24 Parganas / Rajarhat

    const tilesUrl = mapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = mapStyle === 'satellite'
      ? 'Tiles &copy; Esri &bull; OpenStreetMap'
      : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [tilesUrl],
            tileSize: 256,
            attribution
          }
        },
        layers: [
          {
            id: 'osm-raster-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: initialCenter,
      zoom: 15.5,
      pitch: 0
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    mapInstanceRef.current = map;

    map.on('load', () => {
      // Build GeoJSON FeatureCollection containing ONLY the citizen's authorized parcels
      const features: GeoJSON.Feature<GeoJSON.Polygon>[] = parcels.map(p => ({
        type: 'Feature',
        properties: {
          id: p.id,
          khasraNo: p.khasraNo,
          village: p.village,
          district: p.district,
          projectId: p.projectId,
          status: p.status,
          currentStage: p.currentStage,
          ownerName: p.primaryOwnerName,
          awardAmount: p.compensation.totalAwardAmount
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            p.polygonCoordinates.map(c => [c[1], c[0]])
          ]
        }
      }));

      map.addSource('citizen-parcels', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        }
      });

      // Polygon Fill
      map.addLayer({
        id: 'citizen-parcels-fill',
        type: 'fill',
        source: 'citizen-parcels',
        paint: {
          'fill-color': [
            'match',
            ['get', 'status'],
            'POSSESSION_ACQUIRED', '#10b981',
            'VALUATION_IN_PROGRESS', '#f59e0b',
            'AWARD_DETERMINED', '#3b82f6',
            '#f59e0b'
          ],
          'fill-opacity': 0.45
        }
      });

      // Polygon Outline
      map.addLayer({
        id: 'citizen-parcels-outline',
        type: 'line',
        source: 'citizen-parcels',
        paint: {
          'line-color': '#1e3a8a',
          'line-width': 3.5,
          'line-dasharray': [1, 0]
        }
      });

      // Hover / Click handler
      map.on('click', 'citizen-parcels-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const clickedId = feat.properties?.id;
        const found = parcels.find(p => p.id === clickedId);
        if (found) {
          setSelectedParcel(found);
          map.flyTo({
            center: [found.coordinates[1], found.coordinates[0]],
            zoom: 16.5,
            duration: 1000
          });
        }
      });

      // Cursor styling
      map.on('mouseenter', 'citizen-parcels-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'citizen-parcels-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      // Fit bounds to citizen parcels
      if (parcels.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        parcels.forEach(p => {
          p.polygonCoordinates.forEach(coord => {
            bounds.extend([coord[1], coord[0]]);
          });
        });
        map.fitBounds(bounds, { padding: 80, maxZoom: 16.5 });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapStyle, parcels]);

  const handleFlyToParcel = (p: Parcel) => {
    setSelectedParcel(p);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [p.coordinates[1], p.coordinates[0]],
        zoom: 16.5,
        duration: 900
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Layer Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Compass className="text-gov-navy" size={20} />
            Cadastral GIS: Authorized Land Demarcation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            OpenStreetMap geospatial layer displaying strictly your verified ownership parcels. Neighboring plots are isolated for citizen privacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMapStyle('streets')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapStyle === 'streets' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mapStyle === 'satellite' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-slate-200 relative h-[480px]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Floating Legend */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-[11px] font-semibold flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600" />
              <span>Compensation In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600" />
              <span>Award Determined</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
              <span>Possession Handed</span>
            </div>
          </div>
        </div>

        {/* Selected Parcel Card / Parcel List */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Selected Parcel Dossier
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {selectedParcel?.id || 'K-125/2'}
              </span>
            </div>

            {selectedParcel ? (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Plot / Khasra {selectedParcel.khasraNo}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {selectedParcel.village}, {selectedParcel.district}, {selectedParcel.state}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Acquisition Area</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                      {selectedParcel.acquisitionAreaHectares} Ha ({Math.round(selectedParcel.acquisitionAreaHectares * 2.471 * 100) / 100} Acre)
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Stage</span>
                    <span className="font-bold text-amber-800 text-sm mt-0.5 block">
                      {selectedParcel.currentStage.replace('SECTION_', 'Section ')}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Associated Project</span>
                  <span className="font-semibold text-slate-800 block">
                    {selectedParcel.projectId === 'WB-KOL-KONA-2026'
                      ? 'Kolkata Elevated Corridor & Kona Expressway Expansion'
                      : selectedParcel.projectId}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    {selectedParcel.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => onOpenDigitalTwin(selectedParcel)}
                  leftIcon={<Eye size={15} />}
                  className="w-full font-bold shadow-md mt-2"
                >
                  View Full Parcel Details
                </Button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                Select a parcel on the map or from the list below.
              </p>
            )}
          </div>

          {/* Quick Parcel Switcher List */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Your Registered Parcels ({parcels.length})
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {parcels.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleFlyToParcel(p)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    selectedParcel?.id === p.id
                      ? 'border-gov-navy bg-blue-50/60 font-bold text-gov-navy'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold">Khasra {p.khasraNo}</span>
                    <span className="text-[11px] text-slate-500 ml-2">({p.id})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.acquisitionAreaHectares} Ha
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
