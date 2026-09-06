import { Parcel, LandCategory, StatutoryStage } from './parcel';

export type MapStatusCategory = 
  | 'ACQUIRED'                  // Green #16A34A
  | 'PENDING'                   // Yellow #EAB308
  | 'DISPUTED'                  // Red #DC2626
  | 'VERIFIED'                  // Blue #2563EB
  | 'VERIFICATION_PENDING'      // Orange #EA580C
  | 'PROPOSED';                 // Grey #64748B

export interface GisParcelFeatureProperties {
  parcel_id: string;
  khasra_number: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  area: number; // area in hectares
  area_acres: number;
  area_sqm: number;
  project_id: string;
  status: string;
  map_status: MapStatusCategory;
  verification_status: 'VERIFIED' | 'PENDING' | 'ENCROACHED';
  compensation_status: 'NOT_INITIATED' | 'CALA_SANCTIONED' | 'ESCROW_FUNDED' | 'DIRECT_BENEFIT_TRANSFERRED' | 'DISPUTE_HELD' | 'DISBURSED' | 'SANCTIONED' | string;
  possession_status: 'ACQUIRED' | 'IN_PROGRESS' | 'PENDING' | 'HALTED';
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  land_use: LandCategory;
  owner_name: string;
  award_amount: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface GisLayerVisibility {
  projectBoundary: boolean;
  landParcels: boolean;
  acquiredParcels: boolean;
  pendingParcels: boolean;
  disputedParcels: boolean;
  fieldVerification: boolean;
  highRiskParcels: boolean;
}

export interface GisFilterState {
  projectId: string;
  state: string;
  district: string;
  village: string;
  searchQuery: string;
  status: string;
  risk: string;
  landUse: string;
}

export type BasemapStyle = 'streets' | 'satellite' | 'terrain' | 'dark';

export type GisMeasurementMode = 'none' | 'distance' | 'area';

export interface GisMeasurementResult {
  mode: GisMeasurementMode;
  distanceMeters?: number;
  areaSquareMeters?: number;
  areaAcres?: number;
  areaHectares?: number;
  points: [number, number][]; // [lng, lat]
}

/**
 * Standard GIS Data Provider interface.
 * Implemented currently by client-side GeoJSON, designed to easily point to
 * GeoServer WFS or PostGIS REST endpoints (`/api/v1/gis/parcels.geojson`) in production.
 */
export interface IGisDataProvider {
  getParcelsGeoJson(projectId: string, filters?: Partial<GisFilterState>): Promise<GeoJSON.FeatureCollection>;
  getProjectBoundaryGeoJson(projectId: string): Promise<GeoJSON.FeatureCollection>;
  getParcelById(parcelId: string): Promise<Parcel | null>;
}
