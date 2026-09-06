import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Search, 
  Filter, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Navigation, 
  RotateCcw, 
  Compass, 
  LandPlot, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  RefreshCw,
  Ruler,
  Crosshair,
  Trash2,
  Milestone,
  Check
} from 'lucide-react';
import { Parcel } from '../../types/parcel';
import { ProjectCorridor } from '../../types/project';
import { 
  GisFilterState, 
  GisLayerVisibility, 
  BasemapStyle, 
  MapStatusCategory,
  GisMeasurementMode,
  GisMeasurementResult
} from '../../types/gis';
import { gisService } from '../../services/gisService';
import { GisLegend } from './GisLegend';
import { GisLayerControls } from './GisLayerControls';
import { GisParcelDetailCard } from './GisParcelDetailCard';
import { RiskBadge } from '../common/Badge';

interface GisMapProps {
  project: ProjectCorridor;
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel) => void;
  onOpenDigitalTwin: (parcel: Parcel) => void;
  onLaunchVerification?: (parcel: Parcel) => void;
  onViewDocuments?: (parcel: Parcel) => void;
}

// Bounding box for Kolkata Elevated Corridor & Kona Expressway (Primary Showcase)
const CORRIDOR_BBOX: [[number, number], [number, number]] = [
  [88.220, 22.480], // SW [lng, lat]
  [88.480, 22.680]  // NE [lng, lat]
];

// Village Centers for quick jump navigation
const VILLAGE_COORDINATES: Record<string, [number, number]> = {
  // Kolkata / West Bengal Primary Showcase
  'Rajarhat': [88.4520, 22.5850],
  'New Town Action Area II': [88.4680, 22.5920],
  'Kona Crossing': [88.2850, 22.5700],
  'Nibra': [88.2420, 22.6020],
  'Alipore': [88.3310, 22.5320],
  'Mahisbathan': [88.4320, 22.5780],
  // Bihar Demo Corridor
  'Kanhauli': [85.0345, 25.5684],
  'Naubatpur': [85.0680, 25.5840],
  'Phulwari Sharif': [85.1050, 25.6020],
  'Danapur Nizamat': [85.1420, 25.6250],
  'Dumra': [85.1650, 25.6380],
  'Khagaul Rural': [85.0500, 25.5800]
};

export const GisMap: React.FC<GisMapProps> = ({
  project,
  parcels,
  selectedParcel,
  onSelectParcel,
  onOpenDigitalTwin,
  onLaunchVerification = onOpenDigitalTwin,
  onViewDocuments = onOpenDigitalTwin
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);

  // UI state
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Basemap & visual styling
  const [basemap, setBasemap] = useState<BasemapStyle>('streets');
  const [fillOpacity, setFillOpacity] = useState<number>(0.75);

  // Live Telemetry & Coordinates HUD state
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>({ lat: 25.5941, lng: 85.0845 });
  const [currentZoom, setCurrentZoom] = useState<number>(12.8);

  // Interactive Measurement Tool State
  const [measurementMode, setMeasurementMode] = useState<GisMeasurementMode>('none');
  const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);
  const measurementModeRef = useRef<GisMeasurementMode>('none');
  measurementModeRef.current = measurementMode;

  // Layer visibility
  const [layers, setLayers] = useState<GisLayerVisibility>({
    projectBoundary: true,
    landParcels: true,
    acquiredParcels: true,
    pendingParcels: true,
    disputedParcels: true,
    fieldVerification: true,
    highRiskParcels: true
  });

  // Filters
  const [filters, setFilters] = useState<GisFilterState>({
    projectId: project?.id || 'WB-KOL-KONA-2026',
    state: project?.state || 'West Bengal',
    district: project?.districts?.[0] || 'ALL',
    village: 'ALL',
    searchQuery: '',
    status: 'ALL',
    risk: 'ALL',
    landUse: 'ALL'
  });

  // Unique options for filters
  const uniqueVillages = useMemo(() => gisService.getUniqueVillages(filters.projectId), [filters.projectId]);
  const uniqueDistricts = useMemo(() => gisService.getUniqueDistricts(filters.projectId), [filters.projectId]);
  const uniqueStates = useMemo(() => gisService.getUniqueStates(), []);

  // Status counts for legend
  const statusCounts = useMemo(() => {
    const counts: Record<MapStatusCategory, number> = {
      ACQUIRED: 0,
      PENDING: 0,
      DISPUTED: 0,
      VERIFIED: 0,
      VERIFICATION_PENDING: 0,
      PROPOSED: 0
    };
    parcels.forEach(p => {
      const ms = p.mapStatus || 'PROPOSED';
      if (counts[ms] !== undefined) counts[ms]++;
    });
    return counts;
  }, [parcels]);

  // Filtered parcels list for the left panel search list
  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      if (filters.village !== 'ALL' && p.village.toLowerCase() !== filters.village.toLowerCase()) return false;
      if (filters.district !== 'ALL' && p.district.toLowerCase() !== filters.district.toLowerCase()) return false;
      if (filters.status !== 'ALL' && p.mapStatus !== filters.status && p.status !== filters.status) return false;
      if (filters.risk !== 'ALL' && p.aiRisk.riskLevel !== filters.risk) return false;
      if (filters.landUse !== 'ALL' && p.landCategory !== filters.landUse) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchKhasra = p.khasraNo.toLowerCase().includes(q);
        const matchId = p.id.toLowerCase().includes(q);
        const matchOwner = p.primaryOwnerName.toLowerCase().includes(q);
        const matchVillage = p.village.toLowerCase().includes(q);
        if (!matchKhasra && !matchId && !matchOwner && !matchVillage) return false;
      }
      return true;
    });
  }, [parcels, filters]);

  // Handle ResizeObserver / smooth map resizing on panel open/collapse
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [leftPanelCollapsed, rightPanelOpen]);

  // Helper to construct MapLibre Style for the selected basemap (Standard OpenStreetMap with full attribution)
  const getBasemapStyle = useCallback((style: BasemapStyle): maplibregl.StyleSpecification => {
    let tilesUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

    if (style === 'satellite') {
      tilesUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (style === 'dark') {
      tilesUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
    } else if (style === 'terrain') {
      tilesUrl = 'https://tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a> (CC-BY-SA)';
    }

    return {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {
        'basemap-tiles': {
          type: 'raster',
          tiles: [tilesUrl],
          tileSize: 256,
          attribution
        }
      },
      layers: [
        {
          id: 'basemap-layer',
          type: 'raster',
          source: 'basemap-tiles',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };
  }, []);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center coordinates: Kolkata by default, or project's center coordinates [lng, lat]
    const kolkataCenter: [number, number] = [88.3639, 22.5726];
    const initialCenter: [number, number] = project?.corridorCenter
      ? [project.corridorCenter[1], project.corridorCenter[0]]
      : kolkataCenter;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getBasemapStyle(basemap),
      center: initialCenter,
      zoom: 12.8,
      bearing: 0,
      pitch: 0,
      attributionControl: { compact: true }
    });

    // Add navigation controls (zoom, compass, pitch)
    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showCompass: true,
        showZoom: true
      }),
      'top-right'
    );

    // Scale control
    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 140,
        unit: 'metric'
      }),
      'bottom-left'
    );

    // Hover popup instance
    const hoverPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 15,
      className: 'gis-hover-popup'
    });
    hoverPopupRef.current = hoverPopup;

    map.on('load', async () => {
      setMapLoaded(true);

      // 1. Load Corridor Centerline and RoW Buffer
      const boundaryGeoJson = await gisService.getProjectBoundaryGeoJson(filters.projectId);
      map.addSource('corridor-source', {
        type: 'geojson',
        data: boundaryGeoJson
      });

      // Corridor RoW Buffer Fill
      map.addLayer({
        id: 'corridor-row-buffer-fill',
        type: 'fill',
        source: 'corridor-source',
        filter: ['==', ['get', 'type'], 'Buffer'],
        paint: {
          'fill-color': '#3B82F6',
          'fill-opacity': 0.12
        }
      });

      // Corridor RoW Buffer Boundary Line
      map.addLayer({
        id: 'corridor-row-buffer-line',
        type: 'line',
        source: 'corridor-source',
        filter: ['==', ['get', 'type'], 'Buffer'],
        paint: {
          'line-color': '#2563EB',
          'line-width': 2,
          'line-dasharray': [3, 2]
        }
      });

      // Corridor Centerline
      map.addLayer({
        id: 'corridor-centerline',
        type: 'line',
        source: 'corridor-source',
        filter: ['==', ['get', 'type'], 'Expressway'],
        paint: {
          'line-color': '#1D4ED8',
          'line-width': 3.5
        }
      });

      // Chainage Milestone Points
      map.addLayer({
        id: 'chainage-points',
        type: 'circle',
        source: 'corridor-source',
        filter: ['==', ['get', 'type'], 'Chainage'],
        paint: {
          'circle-radius': 4.5,
          'circle-color': '#1E3A8A',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });

      // Chainage Milestone Labels
      map.addLayer({
        id: 'chainage-labels',
        type: 'symbol',
        source: 'corridor-source',
        filter: ['==', ['get', 'type'], 'Chainage'],
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 10,
          'text-offset': [0, 1.3],
          'text-anchor': 'top',
          'text-allow-overlap': false
        },
        paint: {
          'text-color': '#1E3A8A',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2
        }
      });

      // 2. Load Cadastral Boundary Stones / Survey Pillars (Seemana / Burji)
      const pillarsGeoJson = await gisService.getSurveyPillarsGeoJson();
      map.addSource('pillars-source', {
        type: 'geojson',
        data: pillarsGeoJson
      });

      map.addLayer({
        id: 'survey-pillars',
        type: 'circle',
        source: 'pillars-source',
        minzoom: 13.2,
        paint: {
          'circle-radius': 3,
          'circle-color': '#DC2626',
          'circle-stroke-width': 1.2,
          'circle-stroke-color': '#FFFFFF'
        }
      });

      // 3. Load Parcels GeoJSON
      const parcelsGeoJson = await gisService.getParcelsGeoJson(filters.projectId, filters);
      map.addSource('parcels-source', {
        type: 'geojson',
        data: parcelsGeoJson,
        generateId: true
      });

      // Cadastral Parcels Fill Layer (Strict adherence to 6 Status Colors)
      // Green = Acquired (#16A34A)
      // Yellow = Pending (#EAB308)
      // Red = Disputed (#DC2626)
      // Blue = Verified (#2563EB)
      // Orange = Field Verification Pending (#EA580C)
      // Grey = Proposed (#64748B)
      map.addLayer({
        id: 'parcels-fill',
        type: 'fill',
        source: 'parcels-source',
        paint: {
          'fill-color': [
            'match',
            ['get', 'map_status'],
            'ACQUIRED', '#16A34A',
            'PENDING', '#EAB308',
            'DISPUTED', '#DC2626',
            'VERIFIED', '#2563EB',
            'VERIFICATION_PENDING', '#EA580C',
            'PROPOSED', '#64748B',
            '#64748B' // fallback
          ],
          'fill-opacity': fillOpacity
        }
      });

      // Cadastral Parcel Outline
      map.addLayer({
        id: 'parcels-line',
        type: 'line',
        source: 'parcels-source',
        paint: {
          'line-color': '#0F172A',
          'line-width': 1.2,
          'line-opacity': 0.85
        }
      });

      // Outer Golden Glow for Selected Parcel
      map.addLayer({
        id: 'parcels-highlight-glow',
        type: 'line',
        source: 'parcels-source',
        paint: {
          'line-color': '#F59E0B',
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': [
            'case',
            ['==', ['get', 'parcel_id'], selectedParcel ? selectedParcel.id : ''],
            0.85,
            0.0
          ]
        }
      });

      // Highlight line for currently selected parcel
      map.addLayer({
        id: 'parcels-highlight-line',
        type: 'line',
        source: 'parcels-source',
        paint: {
          'line-color': '#F59E0B',
          'line-width': 3.5,
          'line-opacity': [
            'case',
            ['==', ['get', 'parcel_id'], selectedParcel ? selectedParcel.id : ''],
            1.0,
            0.0
          ]
        }
      });

      // Parcel Labels (Khasra Number)
      map.addLayer({
        id: 'parcels-label',
        type: 'symbol',
        source: 'parcels-source',
        minzoom: 13,
        layout: {
          'text-field': ['get', 'khasra_number'],
          'text-size': 11,
          'text-variable-anchor': ['center', 'top', 'bottom'],
          'text-justify': 'auto',
          'text-allow-overlap': false
        },
        paint: {
          'text-color': '#0F172A',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2
        }
      });

      // 4. Interactive Measurement Layer
      map.addSource('measurement-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'measurement-fill',
        type: 'fill',
        source: 'measurement-source',
        paint: {
          'fill-color': '#F59E0B',
          'fill-opacity': 0.25
        }
      });

      map.addLayer({
        id: 'measurement-line',
        type: 'line',
        source: 'measurement-source',
        paint: {
          'line-color': '#D97706',
          'line-width': 2.5,
          'line-dasharray': [2, 2]
        }
      });

      map.addLayer({
        id: 'measurement-points',
        type: 'circle',
        source: 'measurement-source',
        paint: {
          'circle-radius': 5,
          'circle-color': '#F59E0B',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });

      // --- Map Event Listeners ---

      // Global Mouse Move for HUD Coordinates
      map.on('mousemove', (e: any) => {
        setMouseCoords({
          lat: Number(e.lngLat.lat.toFixed(5)),
          lng: Number(e.lngLat.lng.toFixed(5))
        });
      });

      // Zoom listener
      map.on('zoom', () => {
        setCurrentZoom(Number(map.getZoom().toFixed(1)));
      });

      // Hover on Parcels
      map.on('mousemove', 'parcels-fill', (e: any) => {
        if (measurementModeRef.current !== 'none') return; // Don't pop up during measurement
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';

        const feature = e.features[0];
        const props = feature.properties;
        const coordinates = e.lngLat;

        const statusColor = 
          props.map_status === 'ACQUIRED' ? '#16A34A' :
          props.map_status === 'PENDING' ? '#EAB308' :
          props.map_status === 'DISPUTED' ? '#DC2626' :
          props.map_status === 'VERIFIED' ? '#2563EB' :
          props.map_status === 'VERIFICATION_PENDING' ? '#EA580C' : '#64748B';

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 6px 10px; font-size: 11px; color: #0f172a; line-height: 1.4;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <strong style="font-size: 12px; font-weight: 700;">Khasra ${props.khasra_number}</strong>
              <span style="background-color: ${statusColor}; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase;">
                ${props.map_status ? props.map_status.replace(/_/g, ' ') : 'PROPOSED'}
              </span>
            </div>
            <div style="color: #475569; font-size: 10px;">Village: <strong>${props.village}</strong></div>
            <div style="color: #475569; font-size: 10px;">Area: <strong>${props.area} Ha</strong> (${props.area_acres || (props.area * 2.47).toFixed(2)} Ac)</div>
            <div style="color: #475569; font-size: 10px;">Owner: <strong>${props.owner_name}</strong></div>
            <div style="margin-top: 4px; padding-top: 3px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-weight: 600;">
              <span>AI Risk:</span>
              <span style="color: ${props.risk_score >= 65 ? '#dc2626' : props.risk_score >= 40 ? '#d97706' : '#16a34a'};">
                ${props.risk_score}/100 (${props.risk_level})
              </span>
            </div>
          </div>
        `;

        hoverPopup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
      });

      // Mouse leave parcel
      map.on('mouseleave', 'parcels-fill', () => {
        map.getCanvas().style.cursor = '';
        hoverPopup.remove();
      });

      // Click on Map
      map.on('click', async (e: any) => {
        // 1. If in Measurement Mode, add measurement point
        if (measurementModeRef.current !== 'none') {
          const pt: [number, number] = [e.lngLat.lng, e.lngLat.lat];
          setMeasurementPoints(prev => [...prev, pt]);
          return;
        }

        // 2. Otherwise check if parcel was clicked
        const features = map.queryRenderedFeatures(e.point, { layers: ['parcels-fill'] });
        if (features && features.length > 0) {
          const clickedParcelId = features[0].properties.parcel_id;
          const fullParcel = await gisService.getParcelById(clickedParcelId);
          if (fullParcel) {
            onSelectParcel(fullParcel);
            setRightPanelOpen(true);
          }
        }
      });
    });

    mapInstanceRef.current = map;

    return () => {
      hoverPopup.remove();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update dynamic measurement layer
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;
    const source = map.getSource('measurement-source') as maplibregl.GeoJSONSource;
    if (!source || typeof source.setData !== 'function') return;

    if (measurementPoints.length === 0) {
      source.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    const features: any[] = [];

    // Points
    measurementPoints.forEach((pt, i) => {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: pt },
        properties: { index: i + 1 }
      });
    });

    // Line
    if (measurementPoints.length >= 2) {
      features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: measurementPoints },
        properties: {}
      });
    }

    // Polygon if area mode and at least 3 points
    if (measurementMode === 'area' && measurementPoints.length >= 3) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...measurementPoints, measurementPoints[0]]]
        },
        properties: {}
      });
    }

    source.setData({ type: 'FeatureCollection', features });
  }, [measurementPoints, measurementMode, mapLoaded]);

  // Compute live measurement result
  const measurementResult = useMemo((): GisMeasurementResult | null => {
    if (measurementMode === 'none' || measurementPoints.length === 0) return null;
    if (measurementMode === 'distance') {
      const dist = gisService.calculatePathDistance(measurementPoints);
      return {
        mode: 'distance',
        distanceMeters: dist,
        points: measurementPoints
      };
    } else if (measurementMode === 'area') {
      const area = gisService.calculatePolygonArea(measurementPoints);
      return {
        mode: 'area',
        areaSquareMeters: area,
        areaAcres: Number((area / 4046.86).toFixed(2)),
        areaHectares: Number((area / 10000).toFixed(3)),
        points: measurementPoints
      };
    }
    return null;
  }, [measurementMode, measurementPoints]);

  // Update basemap style dynamically without losing custom layers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    let tilesUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (basemap === 'satellite') {
      tilesUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (basemap === 'dark') {
      tilesUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else if (basemap === 'terrain') {
      tilesUrl = 'https://tile.opentopomap.org/{z}/{x}/{y}.png';
    }

    const source = map.getSource('basemap-tiles') as maplibregl.RasterTileSource;
    if (source && typeof source.setTiles === 'function') {
      source.setTiles([tilesUrl]);
    }
  }, [basemap, mapLoaded]);

  // Update polygon fill opacity
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;
    if (map.getLayer('parcels-fill')) {
      map.setPaintProperty('parcels-fill', 'fill-opacity', fillOpacity);
    }
  }, [fillOpacity, mapLoaded]);

  // Update highlighted parcel when selectedParcel changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    const parcelId = selectedParcel ? selectedParcel.id : '';

    if (map.getLayer('parcels-highlight-line')) {
      map.setPaintProperty('parcels-highlight-line', 'line-opacity', [
        'case',
        ['==', ['get', 'parcel_id'], parcelId],
        1.0,
        0.0
      ]);
    }

    if (map.getLayer('parcels-highlight-glow')) {
      map.setPaintProperty('parcels-highlight-glow', 'line-opacity', [
        'case',
        ['==', ['get', 'parcel_id'], parcelId],
        0.85,
        0.0
      ]);
    }

    if (selectedParcel) {
      setRightPanelOpen(true);
    }
  }, [selectedParcel, mapLoaded]);

  // Update GeoJSON data when filters or live parcels change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    gisService.getParcelsGeoJson(filters.projectId, filters).then((data) => {
      const source = map.getSource('parcels-source') as maplibregl.GeoJSONSource;
      if (source && typeof source.setData === 'function') {
        source.setData(data);
      }
    });
  }, [filters, mapLoaded, parcels]);

  // Update layer visibility
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    // 1. Project Boundary layers
    const boundaryVisibility = layers.projectBoundary ? 'visible' : 'none';
    ['corridor-row-buffer-fill', 'corridor-row-buffer-line', 'corridor-centerline', 'chainage-points', 'chainage-labels'].forEach(id => {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', boundaryVisibility);
    });

    // 2. Parcels layer visibility
    const parcelsVisibility = layers.landParcels ? 'visible' : 'none';
    ['parcels-fill', 'parcels-line', 'parcels-label', 'parcels-highlight-line', 'parcels-highlight-glow'].forEach(id => {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', parcelsVisibility);
    });

    // 3. Survey Pillars layer
    if (map.getLayer('survey-pillars')) {
      map.setLayoutProperty('survey-pillars', 'visibility', layers.fieldVerification ? 'visible' : 'none');
    }

    // 4. Filter expressions for the 6 specific status layers
    if (map.getLayer('parcels-fill')) {
      const statusConditions: any[] = [];
      if (layers.acquiredParcels) statusConditions.push('ACQUIRED');
      if (layers.pendingParcels) statusConditions.push('PENDING');
      if (layers.disputedParcels) statusConditions.push('DISPUTED');
      if (layers.fieldVerification) statusConditions.push('VERIFIED', 'VERIFICATION_PENDING');
      statusConditions.push('PROPOSED');

      if (layers.highRiskParcels) {
        map.setFilter('parcels-fill', ['in', ['get', 'map_status'], ['literal', statusConditions]]);
      } else {
        map.setFilter('parcels-fill', [
          'all',
          ['in', ['get', 'map_status'], ['literal', statusConditions]],
          ['<', ['get', 'risk_score'], 65]
        ]);
      }
    }
  }, [layers, mapLoaded]);

  // Actions
  const handleFitCorridor = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.fitBounds(CORRIDOR_BBOX, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 14.5,
      duration: 1200
    });
  };

  const handleToggle3D = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (is3DMode) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      setIs3DMode(false);
    } else {
      map.easeTo({ pitch: 50, bearing: -20, duration: 800 });
      setIs3DMode(true);
    }
  };

  const handleFlyToParcel = (parcel: Parcel) => {
    onSelectParcel(parcel);
    setRightPanelOpen(true);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [parcel.coordinates[1], parcel.coordinates[0]], // [lng, lat]
      zoom: 15.5,
      duration: 1000,
      essential: true
    });
  };

  // Sync map center and filters when active project changes
  useEffect(() => {
    if (!mapInstanceRef.current || !project) return;
    const center: [number, number] = project.corridorCenter
      ? [project.corridorCenter[1], project.corridorCenter[0]]
      : [88.3639, 22.5726];
    mapInstanceRef.current.flyTo({
      center,
      zoom: 12.8,
      duration: 1000
    });
    setFilters(prev => ({
      ...prev,
      projectId: project.id,
      state: project.state || 'ALL',
      district: 'ALL',
      village: 'ALL'
    }));
  }, [project?.id]);

  const handleJumpToVillage = (villageName: string) => {
    const coords = VILLAGE_COORDINATES[villageName];
    if (coords && mapInstanceRef.current) {
      setFilters(prev => ({ ...prev, village: villageName }));
      mapInstanceRef.current.flyTo({
        center: coords,
        zoom: 14.6,
        duration: 1100,
        essential: true
      });
    }
  };

  const handleToggleFullscreen = () => {
    const el = document.getElementById('gis-map-root');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      projectId: project?.id || 'PRR-PH2-2026',
      state: 'ALL',
      district: 'ALL',
      village: 'ALL',
      searchQuery: '',
      status: 'ALL',
      risk: 'ALL',
      landUse: 'ALL'
    });
  };

  return (
    <div 
      id="gis-map-root" 
      className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-950 select-none font-sans"
    >
      {/* ============================================================ */}
      {/* 1. LEFT PANEL: FILTERS & PARCEL LIST */}
      {/* ============================================================ */}
      <div
        className={`h-full bg-white border-r border-slate-200 z-20 flex flex-col transition-all duration-300 shadow-xl ${
          leftPanelCollapsed ? 'w-12' : 'w-80 sm:w-96'
        }`}
      >
        {/* Left Panel Header */}
        <div className="p-3 bg-gov-navy text-white flex items-center justify-between flex-shrink-0">
          {!leftPanelCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <LandPlot className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xs font-bold uppercase tracking-wider text-white">
                  Cadastral GIS Intelligence
                </h1>
                <div className="text-[10px] text-slate-300 font-medium">
                  {project?.name || 'Patna Ring Road Phase II'}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-200 transition-colors mx-auto"
            title={leftPanelCollapsed ? 'Expand Filter Panel' : 'Collapse Panel'}
          >
            {leftPanelCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsed State Icon Bar */}
        {leftPanelCollapsed && (
          <div className="flex-1 flex flex-col items-center py-4 space-y-4 text-slate-400">
            <button 
              onClick={() => setLeftPanelCollapsed(false)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              title="Search Parcels"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setLeftPanelCollapsed(false)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              title="Filter Layers"
            >
              <Filter className="w-4 h-4" />
            </button>
            <div className="w-6 h-px bg-slate-200" />
            <div className="text-[10px] font-bold text-slate-400 [writing-mode:vertical-lr] tracking-wider uppercase">
              {filteredParcels.length} Parcels
            </div>
          </div>
        )}

        {/* Expanded Content: Filters & List */}
        {!leftPanelCollapsed && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Filter Form Controls */}
            <div className="p-3.5 space-y-3 overflow-y-auto border-b border-slate-200 bg-slate-50/70 max-h-[46%]">
              {/* Project Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Project Corridor
                </label>
                <select
                  value={filters.projectId}
                  onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                  className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="PRR-PH2-2026">Patna Ring Road Phase II (SH-84)</option>
                  <option value="DEL-VNS-HSR-2026">Delhi-Varanasi High Speed Rail</option>
                  <option value="GKP-SLP-EXP-2026">Gorakhpur-Siliguri Expressway</option>
                </select>
              </div>

              {/* State & District Row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    State
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All States</option>
                    {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    District
                  </label>
                  <select
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Districts</option>
                    {uniqueDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Village Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Village / Revenue Mauza
                </label>
                <select
                  value={filters.village}
                  onChange={(e) => setFilters({ ...filters, village: e.target.value })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Villages ({uniqueVillages.length})</option>
                  {uniqueVillages.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Parcel Search Box */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Parcel / Khasra / Owner Search
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Khasra (e.g. 412/1) or Owner..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters({ ...filters, searchQuery: '' })}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Status / Risk / Land Use Filters */}
              <div className="grid grid-cols-3 gap-1.5">
                {/* Status Filter */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full text-[11px] bg-white border border-slate-300 rounded-md p-1 truncate"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACQUIRED">Acquired (Green)</option>
                    <option value="PENDING">Pending (Yellow)</option>
                    <option value="DISPUTED">Disputed (Red)</option>
                    <option value="VERIFIED">Verified (Blue)</option>
                    <option value="VERIFICATION_PENDING">Pending Insp (Org)</option>
                    <option value="PROPOSED">Proposed (Grey)</option>
                  </select>
                </div>

                {/* Risk Filter */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    AI Risk
                  </label>
                  <select
                    value={filters.risk}
                    onChange={(e) => setFilters({ ...filters, risk: e.target.value })}
                    className="w-full text-[11px] bg-white border border-slate-300 rounded-md p-1 truncate"
                  >
                    <option value="ALL">All Risk</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                {/* Land Use Filter */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Land Use
                  </label>
                  <select
                    value={filters.landUse}
                    onChange={(e) => setFilters({ ...filters, landUse: e.target.value })}
                    className="w-full text-[11px] bg-white border border-slate-300 rounded-md p-1 truncate"
                  >
                    <option value="ALL">All Types</option>
                    <option value="AGRICULTURAL_IRRIGATED">Irrigated</option>
                    <option value="AGRICULTURAL_UNIRRIGATED">Unirrigated</option>
                    <option value="COMMERCIAL_HIGHWAY">Commercial</option>
                    <option value="RESIDENTIAL_RURAL">Residential</option>
                    <option value="GOVERNMENT_PUBLIC">Government</option>
                  </select>
                </div>
              </div>

              {/* Reset Filters Link */}
              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-slate-500">
                  Showing <strong className="text-slate-800">{filteredParcels.length}</strong> of {parcels.length} plots
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Matching Parcels List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Cadastral Plot</span>
                <span>Area / Risk</span>
              </div>

              {filteredParcels.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No parcels match the current filter criteria.
                </div>
              ) : (
                filteredParcels.map(p => {
                  const isSelected = selectedParcel?.id === p.id;
                  const statusColor = 
                    p.mapStatus === 'ACQUIRED' ? '#16A34A' :
                    p.mapStatus === 'PENDING' ? '#EAB308' :
                    p.mapStatus === 'DISPUTED' ? '#DC2626' :
                    p.mapStatus === 'VERIFIED' ? '#2563EB' :
                    p.mapStatus === 'VERIFICATION_PENDING' ? '#EA580C' : '#64748B';

                  return (
                    <button
                      key={p.id}
                      onClick={() => handleFlyToParcel(p)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between gap-2 border ${
                        isSelected 
                          ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500/20' 
                          : 'bg-white hover:bg-slate-50 border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusColor }}
                          title={`Status: ${p.mapStatus}`}
                        />
                        <div className="truncate">
                          <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                            <span>Khasra {p.khasraNo}</span>
                            {isSelected && <span className="text-[9px] bg-blue-600 text-white px-1 rounded font-normal">Active</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {p.village} • {p.primaryOwnerName}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-[11px] font-mono font-semibold text-slate-700">
                          {p.acquisitionAreaHectares} Ha
                        </div>
                        <div className="flex justify-end mt-0.5">
                          <RiskBadge level={p.aiRisk.riskLevel} />
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. CENTER: MAPLIBRE GL JS INTERACTIVE MAP CANVAS */}
      {/* ============================================================ */}
      <div className="flex-1 h-full relative overflow-hidden bg-slate-950 flex flex-col">
        {/* MapLibre DOM Node */}
        <div ref={mapContainerRef} className="w-full flex-1" />

        {/* Top Floating Action Toolbar */}
        <div className="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-2">
          {/* Fit Corridor Button */}
          <button
            onClick={handleFitCorridor}
            className="px-3 py-2 bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 rounded-xl border border-slate-200/80 shadow-lg text-xs font-bold flex items-center gap-1.5 transition-all hover:shadow-xl"
            title="Fit to Patna Ring Road corridor bounds"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Fit Project</span>
          </button>

          {/* 2D / 3D Perspective Toggle */}
          <button
            onClick={handleToggle3D}
            className={`px-3 py-2 rounded-xl border shadow-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              is3DMode 
                ? 'bg-gov-navy text-white border-gov-navy shadow-blue-900/30' 
                : 'bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 border-slate-200/80'
            }`}
            title="Toggle 3D Terrain Perspective Tilt"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>{is3DMode ? '3D View' : '2D Map'}</span>
          </button>

          {/* Measurement Tool Button */}
          <div className="flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-lg p-0.5 text-xs">
            <button
              onClick={() => {
                if (measurementMode === 'distance') {
                  setMeasurementMode('none');
                  setMeasurementPoints([]);
                } else {
                  setMeasurementMode('distance');
                  setMeasurementPoints([]);
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                measurementMode === 'distance'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Measure distance between cadastral boundary points"
            >
              <Ruler className="w-3.5 h-3.5 text-amber-600" />
              <span>Measure Distance</span>
            </button>

            <button
              onClick={() => {
                if (measurementMode === 'area') {
                  setMeasurementMode('none');
                  setMeasurementPoints([]);
                } else {
                  setMeasurementMode('area');
                  setMeasurementPoints([]);
                }
              }}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                measurementMode === 'area'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Measure polygon area of plot"
            >
              <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
              <span>Measure Area</span>
            </button>

            {measurementMode !== 'none' && (
              <button
                onClick={() => {
                  setMeasurementMode('none');
                  setMeasurementPoints([]);
                }}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg ml-0.5"
                title="Exit Measurement Mode"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Village Jump Chips */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> Village:
            </span>
            {['Kanhauli', 'Naubatpur', 'Phulwari Sharif', 'Danapur Nizamat'].map(v => (
              <button
                key={v}
                onClick={() => handleJumpToVillage(v)}
                className="px-2 py-0.5 rounded-md hover:bg-white/20 text-slate-200 hover:text-white transition-all truncate"
              >
                {v}
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 rounded-xl border border-slate-200/80 shadow-lg transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Measurement Result Live Overlay Card */}
        {measurementMode !== 'none' && (
          <div className="absolute top-16 left-4 z-10 bg-slate-900/95 backdrop-blur-md text-white rounded-xl p-3 border border-amber-500/40 shadow-2xl max-w-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5" />
                {measurementMode === 'distance' ? 'Cadastral Line Ruler' : 'Cadastral Area Demarcation'}
              </span>
              <span className="text-[10px] text-slate-400">{measurementPoints.length} Vertices</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              Click anywhere on the map to add demarcation points.
            </p>

            {measurementResult && (
              <div className="p-2.5 bg-slate-800/90 rounded-lg border border-slate-700 font-mono text-xs space-y-1">
                {measurementResult.mode === 'distance' && measurementResult.distanceMeters !== undefined && (
                  <div>
                    <div className="text-slate-400 text-[10px]">Total Demarcation Distance:</div>
                    <div className="text-sm font-bold text-amber-400">
                      {measurementResult.distanceMeters >= 1000 
                        ? `${(measurementResult.distanceMeters / 1000).toFixed(3)} km` 
                        : `${measurementResult.distanceMeters.toFixed(1)} meters`}
                    </div>
                  </div>
                )}
                {measurementResult.mode === 'area' && measurementResult.areaSquareMeters !== undefined && (
                  <div>
                    <div className="text-slate-400 text-[10px]">Enclosed Polygon Area:</div>
                    <div className="text-sm font-bold text-emerald-400">
                      {measurementResult.areaHectares} Ha ({measurementResult.areaAcres} Acres)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {Math.round(measurementResult.areaSquareMeters).toLocaleString()} m²
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setMeasurementPoints([])}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold"
              >
                Reset Points
              </button>
              <button
                onClick={() => {
                  setMeasurementMode('none');
                  setMeasurementPoints([]);
                }}
                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[11px] font-bold ml-auto"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Top-Right Floating Layer Controls */}
        <div className="absolute top-3 right-14 z-10">
          <GisLayerControls
            layers={layers}
            onToggleLayer={(key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }))}
            basemap={basemap}
            onChangeBasemap={setBasemap}
            opacity={fillOpacity}
            onChangeOpacity={setFillOpacity}
          />
        </div>

        {/* Bottom-Left Floating Legend */}
        <div className="absolute bottom-10 left-4 z-10">
          <GisLegend
            statusCounts={statusCounts}
            totalParcels={parcels.length}
          />
        </div>

        {/* Toggle Right Panel Drawer button if closed & parcel selected */}
        {selectedParcel && !rightPanelOpen && (
          <button
            onClick={() => setRightPanelOpen(true)}
            className="absolute top-20 right-4 z-10 px-3.5 py-2 bg-gov-navy text-white rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce border border-slate-700 hover:bg-slate-800 transition-all"
          >
            <LandPlot className="w-4 h-4 text-amber-400" />
            <span>Open Khasra {selectedParcel.khasraNo}</span>
          </button>
        )}

        {/* ============================================================ */}
        {/* GEOSPATIAL TELEMETRY & COORDINATES HUD (Bottom Status Bar) */}
        {/* ============================================================ */}
        <div className="h-7 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 text-slate-400 px-3 flex items-center justify-between text-[11px] font-mono z-10 flex-shrink-0">
          {/* Coordinates readout */}
          <div className="flex items-center gap-4 truncate">
            <div className="flex items-center gap-1.5 text-slate-200">
              <Crosshair className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>
                {mouseCoords ? `${mouseCoords.lat.toFixed(5)}° N, ${mouseCoords.lng.toFixed(5)}° E` : 'Hover map...'}
              </span>
            </div>
            {mouseCoords && (
              <span className="hidden md:inline text-slate-500 text-[10px]">
                {gisService.formatDMS(mouseCoords.lat, true)}, {gisService.formatDMS(mouseCoords.lng, false)}
              </span>
            )}
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-slate-400">
              Datum: <strong className="text-slate-200 font-medium">WGS 84 (EPSG:4326)</strong>
            </span>
            <span className="hidden xl:inline text-slate-400">
              UTM: <strong className="text-slate-200 font-medium">Zone 45N</strong>
            </span>
          </div>

          {/* Zoom and Corridor Telemetry */}
          <div className="flex items-center gap-3 flex-shrink-0 text-[10px]">
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 font-semibold">
              Zoom: Z {currentZoom}
            </span>
            <span className="hidden sm:inline text-slate-400">
              Corridor: <strong className="text-slate-200">PRR-PH2 (38.4 km)</strong>
            </span>
            <span className="hidden md:inline text-slate-400">
              Parcels: <strong className="text-emerald-400">{statusCounts.ACQUIRED}/{parcels.length} Acquired</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RIGHT PANEL: PARCEL DIGITAL TWIN DETAILS & ACTIONS */}
      {/* ============================================================ */}
      <div
        className={`h-full bg-white z-20 transition-all duration-300 shadow-2xl flex-shrink-0 ${
          rightPanelOpen ? 'w-80 sm:w-96' : 'w-0 overflow-hidden'
        }`}
      >
        <GisParcelDetailCard
          parcel={selectedParcel}
          onOpenDigitalTwin={onOpenDigitalTwin}
          onLaunchVerification={onLaunchVerification}
          onViewDocuments={onViewDocuments}
          onClose={() => setRightPanelOpen(false)}
        />
      </div>
    </div>
  );
};
