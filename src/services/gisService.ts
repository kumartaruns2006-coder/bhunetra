import { cadastralParcelsGeoJson, corridorAlignmentGeoJson, surveyPillarsGeoJson, GisParcelFeature } from '../data/mockGeoJson';
import { mockParcels } from '../data/mockParcels';
import { parcelService } from './parcelService';
import { GisFilterState, IGisDataProvider, GisMeasurementResult, GisMeasurementMode } from '../types/gis';
import { Parcel } from '../types/parcel';

export interface GisServiceConfig {
  useRemotePostGis: boolean;
  postGisEndpointUrl?: string;
  geoServerWfsUrl?: string;
}

export class GisService implements IGisDataProvider {
  private config: GisServiceConfig = {
    useRemotePostGis: false,
    postGisEndpointUrl: '/api/v1/gis/parcels.geojson',
    geoServerWfsUrl: '/geoserver/bhunetra/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bhunetra:cadastral_parcels&outputFormat=application/json'
  };

  /**
   * Configure backend PostGIS / GeoServer endpoints
   */
  configureBackend(config: Partial<GisServiceConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Retrieves GeoJSON FeatureCollection filtered by project ID and optional filter criteria.
   * Can be easily pointed to a real backend PostGIS REST / GeoServer WFS endpoint.
   */
  async getParcelsGeoJson(projectId: string, filters?: Partial<GisFilterState>): Promise<GeoJSON.FeatureCollection<GeoJSON.Polygon, any>> {
    // If connected to remote PostGIS / GeoServer in production:
    if (this.config.useRemotePostGis && this.config.postGisEndpointUrl) {
      try {
        const queryParams = new URLSearchParams();
        if (projectId) queryParams.set('project_id', projectId);
        if (filters?.village && filters.village !== 'ALL') queryParams.set('village', filters.village);
        if (filters?.status && filters.status !== 'ALL') queryParams.set('status', filters.status);
        const response = await fetch(`${this.config.postGisEndpointUrl}?${queryParams.toString()}`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn('PostGIS connection fallback to local GeoJSON:', err);
      }
    }

    let features = cadastralParcelsGeoJson.features as GisParcelFeature[];

    // Synchronize with single source of truth in parcelService (e.g. status, mapStatus, risk)
    try {
      const liveParcels = await parcelService.getAllParcels();
      features = features.map(f => {
        const live = liveParcels.find(p => p.id === f.properties.parcel_id || p.khasraNo === f.properties.khasra_number);
        if (live) {
          return {
            ...f,
            properties: {
              ...f.properties,
              map_status: live.mapStatus || f.properties.map_status,
              status: live.status,
              risk_level: live.aiRisk?.riskLevel || f.properties.risk_level,
              risk_score: live.aiRisk?.overallRiskScore ?? f.properties.risk_score
            }
          };
        }
        return f;
      });
    } catch {
      // fallback to static
    }

    // Filter by project ID
    if (projectId && projectId !== 'ALL') {
      features = features.filter(f => f.properties.project_id === projectId);
    }

    if (!filters) {
      return {
        type: 'FeatureCollection',
        features
      };
    }

    // Apply State filter
    if (filters.state && filters.state !== 'ALL') {
      features = features.filter(f => f.properties.state.toLowerCase() === filters.state?.toLowerCase());
    }

    // Apply District filter
    if (filters.district && filters.district !== 'ALL') {
      features = features.filter(f => f.properties.district.toLowerCase() === filters.district?.toLowerCase());
    }

    // Apply Village filter
    if (filters.village && filters.village !== 'ALL') {
      features = features.filter(f => f.properties.village.toLowerCase() === filters.village?.toLowerCase());
    }

    // Apply Status filter (map_status or acquisition status)
    if (filters.status && filters.status !== 'ALL') {
      features = features.filter(f => 
        f.properties.map_status === filters.status || 
        f.properties.status === filters.status
      );
    }

    // Apply Risk filter
    if (filters.risk && filters.risk !== 'ALL') {
      features = features.filter(f => f.properties.risk_level === filters.risk);
    }

    // Apply Land Use filter
    if (filters.landUse && filters.landUse !== 'ALL') {
      features = features.filter(f => f.properties.land_use === filters.landUse);
    }

    // Apply Search Query (Khasra, Owner, Parcel ID)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      features = features.filter(f => 
        f.properties.parcel_id.toLowerCase().includes(q) ||
        f.properties.khasra_number.toLowerCase().includes(q) ||
        f.properties.owner_name.toLowerCase().includes(q) ||
        f.properties.village.toLowerCase().includes(q)
      );
    }

    return {
      type: 'FeatureCollection',
      features
    };
  }

  /**
   * Retrieves GeoJSON FeatureCollection for the corridor alignment centerline, chainage stations, and RoW buffer.
   */
  async getProjectBoundaryGeoJson(projectId?: string): Promise<GeoJSON.FeatureCollection> {
    if (!projectId || projectId === 'ALL') {
      return corridorAlignmentGeoJson;
    }
    const filtered = corridorAlignmentGeoJson.features.filter(
      (f: any) => !f.properties?.project_id || f.properties?.project_id === projectId
    );
    return {
      type: 'FeatureCollection',
      features: filtered.length > 0 ? filtered : corridorAlignmentGeoJson.features
    };
  }

  /**
   * Retrieves Cadastral Demarcation Stones / Boundary Pillars (Seemana / Burji) GeoJSON.
   */
  async getSurveyPillarsGeoJson(): Promise<GeoJSON.FeatureCollection> {
    return surveyPillarsGeoJson;
  }

  /**
   * Returns full Parcel digital twin model matching the clicked map parcel.
   * Preserves single source of truth across GIS, Digital Twin, and Field Verification.
   */
  async getParcelById(parcelId: string): Promise<Parcel | null> {
    const parcel = mockParcels.find(p => p.id === parcelId);
    return parcel || null;
  }

  /**
   * Helper to retrieve unique villages for filter dropdowns.
   */
  getUniqueVillages(projectId?: string): string[] {
    const parcels = projectId && projectId !== 'ALL' 
      ? mockParcels.filter(p => p.projectId === projectId)
      : mockParcels;
    return Array.from(new Set(parcels.map(p => p.village))).sort();
  }

  /**
   * Helper to retrieve unique districts for filter dropdowns.
   */
  getUniqueDistricts(projectId?: string): string[] {
    const parcels = projectId && projectId !== 'ALL' 
      ? mockParcels.filter(p => p.projectId === projectId)
      : mockParcels;
    return Array.from(new Set(parcels.map(p => p.district))).sort();
  }

  /**
   * Helper to retrieve unique states for filter dropdowns.
   */
  getUniqueStates(): string[] {
    return Array.from(new Set(mockParcels.map(p => p.state))).sort();
  }

  // =========================================================================
  // Spatial Measurement Calculators (Haversine Distance & Spherical Polygon Area)
  // =========================================================================

  /**
   * Calculates distance between two [lng, lat] coordinates in meters using Haversine formula
   */
  calculateDistance(p1: [number, number], p2: [number, number]): number {
    const R = 6371000; // Earth radius in meters
    const rad = Math.PI / 180;
    const lat1 = p1[1] * rad;
    const lat2 = p2[1] * rad;
    const dLat = (p2[1] - p1[1]) * rad;
    const dLng = (p2[0] - p1[0]) * rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculates total cumulative path distance in meters for an array of [lng, lat] points
   */
  calculatePathDistance(points: [number, number][]): number {
    if (points.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      total += this.calculateDistance(points[i], points[i + 1]);
    }
    return total;
  }

  /**
   * Calculates spherical polygon area in square meters for closed or open polygon vertices
   */
  calculatePolygonArea(coords: [number, number][]): number {
    if (coords.length < 3) return 0;
    const rad = Math.PI / 180;
    const R = 6371000; // Earth radius in meters
    let total = 0;

    const n = coords.length;
    for (let i = 0; i < n; i++) {
      const p1 = coords[i];
      const p2 = coords[(i + 1) % n];
      const p1Lng = p1[0] * rad;
      const p1Lat = p1[1] * rad;
      const p2Lng = p2[0] * rad;
      const p2Lat = p2[1] * rad;
      total += (p2Lng - p1Lng) * (2 + Math.sin(p1Lat) + Math.sin(p2Lat));
    }
    const area = Math.abs(total * R * R / 2.0);
    return area;
  }

  /**
   * Formats lat/lng into Degrees Minutes Seconds (DMS) format
   */
  formatDMS(degrees: number, isLat: boolean): string {
    const direction = isLat ? (degrees >= 0 ? 'N' : 'S') : (degrees >= 0 ? 'E' : 'W');
    const absolute = Math.abs(degrees);
    const deg = Math.floor(absolute);
    const minNotTruncated = (absolute - deg) * 60;
    const min = Math.floor(minNotTruncated);
    const sec = Math.round((minNotTruncated - min) * 60 * 10) / 10;
    return `${deg}°${min.toString().padStart(2, '0')}'${sec.toFixed(1).padStart(4, '0')}" ${direction}`;
  }
}

export const gisService = new GisService();
