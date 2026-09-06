import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Parcel } from '../../types/parcel';
import { Compass, Maximize2, MapPin, Layers, AlertTriangle, Crosshair } from 'lucide-react';

interface ParcelMiniMapProps {
  parcel: Parcel;
  onNavigateToMap: (parcel: Parcel) => void;
}

export const ParcelMiniMap: React.FC<ParcelMiniMapProps> = ({ parcel, onNavigateToMap }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets'>('satellite');

  // Compute bounding box around polygon
  const coords = parcel.polygonCoordinates; // [lat, lng]
  const lats = coords.map(c => c[0]);
  const lngs = coords.map(c => c[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Convert to GeoJSON [lng, lat]
  const geoJsonPolygon: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: 'Feature',
    properties: {
      id: parcel.id,
      khasra: parcel.khasraNo,
      village: parcel.village,
      status: parcel.mapStatus || 'PROPOSED'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        coords.map(c => [c[1], c[0]])
      ]
    }
  };

  const getStyleUrl = (style: 'satellite' | 'streets'): maplibregl.StyleSpecification => {
    const tilesUrl = style === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = style === 'satellite'
      ? 'Tiles &copy; Esri'
      : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

    return {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {
        'mini-basemap': {
          type: 'raster',
          tiles: [tilesUrl],
          tileSize: 256,
          attribution
        }
      },
      layers: [
        {
          id: 'mini-basemap-layer',
          type: 'raster',
          source: 'mini-basemap',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStyleUrl(mapStyle),
      center: [parcel.coordinates[1], parcel.coordinates[0]],
      zoom: 16.2,
      attributionControl: false
    });

    map.on('load', () => {
      // Add parcel source
      map.addSource('parcel-boundary-source', {
        type: 'geojson',
        data: geoJsonPolygon
      });

      // Status color
      const statusColor = 
        parcel.mapStatus === 'ACQUIRED' ? '#16A34A' :
        parcel.mapStatus === 'PENDING' ? '#EAB308' :
        parcel.mapStatus === 'DISPUTED' ? '#DC2626' :
        parcel.mapStatus === 'VERIFIED' ? '#2563EB' :
        parcel.mapStatus === 'VERIFICATION_PENDING' ? '#EA580C' : '#64748B';

      // Fill layer
      map.addLayer({
        id: 'parcel-mini-fill',
        type: 'fill',
        source: 'parcel-boundary-source',
        paint: {
          'fill-color': statusColor,
          'fill-opacity': 0.45
        }
      });

      // Outer golden glow
      map.addLayer({
        id: 'parcel-mini-glow',
        type: 'line',
        source: 'parcel-boundary-source',
        paint: {
          'line-color': '#F59E0B',
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': 0.8
        }
      });

      // Sharp boundary line
      map.addLayer({
        id: 'parcel-mini-line',
        type: 'line',
        source: 'parcel-boundary-source',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 2.5
        }
      });

      // Centroid marker point
      map.addSource('centroid-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parcel.coordinates[1], parcel.coordinates[0]]
          },
          properties: {}
        }
      });

      map.addLayer({
        id: 'centroid-point',
        type: 'circle',
        source: 'centroid-source',
        paint: {
          'circle-radius': 6,
          'circle-color': '#F59E0B',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });

      // Fit bounds to polygon
      map.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 40, maxZoom: 17, duration: 0 }
      );
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [parcel, mapStyle]);

  const hasEncroachment = parcel.fieldVerification.some(v => v.encroachmentDetected);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-md flex flex-col">
      {/* Top Mini Map Bar */}
      <div className="px-3.5 py-2 bg-slate-950 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
        <div className="flex items-center gap-2 font-semibold">
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <span>Cadastral Boundary Visualization</span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({parcel.coordinates[0].toFixed(4)}° N, {parcel.coordinates[1].toFixed(4)}° E)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Basemap switch */}
          <div className="bg-slate-800 p-0.5 rounded-lg flex text-[10px]">
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                mapStyle === 'satellite' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapStyle('streets')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                mapStyle === 'streets' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Street
            </button>
          </div>

          <button
            onClick={() => onNavigateToMap(parcel)}
            className="px-2.5 py-1 bg-gov-navy hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all"
            title="Open in full GIS Intelligence module"
          >
            <Compass className="w-3 h-3 text-amber-400" />
            <span>Full GIS Map</span>
            <Maximize2 className="w-2.5 h-2.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* MapLibre Canvas Container */}
      <div className="relative w-full h-64 md:h-72 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Boundary Info Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/80 text-[11px] font-mono text-white shadow-lg space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <strong>Plot: Khasra {parcel.khasraNo}</strong>
          </div>
          <div className="text-slate-300 text-[10px]">
            Area: {parcel.acquisitionAreaHectares} Ha ({parcel.acquisitionAreaSqM.toLocaleString()} m²)
          </div>
        </div>

        {/* Boundary Deviation Alert if encroached */}
        {hasEncroachment && (
          <div className="absolute bottom-3 left-3 right-3 bg-red-950/90 backdrop-blur-md border border-red-600/80 text-red-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-xl">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="truncate">
              <strong>Boundary Discrepancy:</strong> {parcel.fieldVerification[0]?.encroachmentDetails || 'Encroachment flagged in DGPS survey'}
            </span>
          </div>
        )}
      </div>

      {/* Vertex Coordinates Footer */}
      <div className="px-3.5 py-2 bg-slate-950/70 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
        <div>
          <span>Demarcation Vertices: </span>
          <strong className="text-slate-200">{coords.length - 1} Boundary Pins (Burji)</strong>
        </div>
        <div className="flex items-center gap-3">
          <span>Projection: <strong className="text-slate-200">UTM Zone 45N / WGS 84</strong></span>
          <span>Survey: <strong className="text-emerald-400">DGPS Certified</strong></span>
        </div>
      </div>
    </div>
  );
};
