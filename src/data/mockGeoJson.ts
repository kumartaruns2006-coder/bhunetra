import { mockParcels } from './mockParcels';
import { GisParcelFeatureProperties, MapStatusCategory } from '../types/gis';

export interface GisParcelFeature extends GeoJSON.Feature<GeoJSON.Polygon, GisParcelFeatureProperties> {}

// Convert mock parcels into GeoJSON FeatureCollection with exact required keys
export const cadastralParcelsGeoJson: GeoJSON.FeatureCollection<GeoJSON.Polygon, GisParcelFeatureProperties> = {
  type: 'FeatureCollection',
  features: mockParcels.map(p => {
    const isEncroached = p.fieldVerification.some(v => v.encroachmentDetected);
    const hasVerification = p.fieldVerification.length > 0;
    const verificationStatus = isEncroached ? 'ENCROACHED' : (hasVerification ? 'VERIFIED' : 'PENDING');
    
    let possessionStatus: 'ACQUIRED' | 'IN_PROGRESS' | 'PENDING' | 'HALTED' = 'PENDING';
    if (p.possessionPercentage >= 100) possessionStatus = 'ACQUIRED';
    else if (p.aiRisk.overallRiskScore >= 75) possessionStatus = 'HALTED';
    else if (p.possessionPercentage > 0) possessionStatus = 'IN_PROGRESS';

    const mapStatus: MapStatusCategory = p.mapStatus || 'PROPOSED';

    return {
      type: 'Feature',
      id: p.id,
      geometry: {
        type: 'Polygon',
        coordinates: [
          // Convert [lat, lng] to GeoJSON standard [lng, lat]
          p.polygonCoordinates.map(coord => [coord[1], coord[0]])
        ]
      },
      properties: {
        parcel_id: p.id,
        khasra_number: p.khasraNo,
        village: p.village,
        tehsil: p.tehsil,
        district: p.district,
        state: p.state,
        area: p.acquisitionAreaHectares,
        area_acres: Number((p.acquisitionAreaHectares * 2.47105).toFixed(2)),
        area_sqm: p.acquisitionAreaSqM,
        project_id: p.projectId,
        status: p.status,
        map_status: mapStatus,
        verification_status: verificationStatus,
        compensation_status: p.compensation.paymentStatus,
        possession_status: possessionStatus,
        risk_score: p.aiRisk.overallRiskScore,
        risk_level: p.aiRisk.riskLevel,
        land_use: p.landCategory,
        owner_name: p.primaryOwnerName,
        award_amount: p.compensation.totalAwardAmount,
        coordinates: p.coordinates
      }
    };
  })
};

// Proposed Road Alignment Centerline, Chainage Stations, and Right of Way (60m RoW corridor)
export const corridorAlignmentGeoJson: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Kolkata Elevated Corridor & Kona Expressway Alignment (Primary Showcase)
    {
      type: 'Feature',
      id: 'centerline-kol-kona',
      properties: {
        id: 'centerline-kol-kona',
        project_id: 'WB-KOL-KONA-2026',
        name: 'Kolkata Elevated Corridor & Kona Expressway Alignment',
        width: 60,
        type: 'Elevated Expressway',
        length_km: 28.6,
        status: 'UNDER_ACQUISITION'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [88.4680, 22.5920],
          [88.4520, 22.5850],
          [88.4320, 22.5780],
          [88.4050, 22.5650],
          [88.3580, 22.5480],
          [88.3310, 22.5320],
          [88.3280, 22.5560],
          [88.2850, 22.5700],
          [88.2420, 22.6020]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'row-buffer-kol-kona',
      properties: {
        id: 'row-buffer-kol-kona',
        project_id: 'WB-KOL-KONA-2026',
        name: 'Right of Way (RoW) 60m Statutory Elevated Corridor Buffer',
        type: 'Buffer',
        buffer_width_meters: 60
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.4675, 22.5925],
            [88.4515, 22.5855],
            [88.4315, 22.5785],
            [88.4045, 22.5655],
            [88.3575, 22.5485],
            [88.3305, 22.5325],
            [88.3275, 22.5565],
            [88.2845, 22.5705],
            [88.2415, 22.6025],
            [88.2425, 22.6015],
            [88.2855, 22.5695],
            [88.3285, 22.5555],
            [88.3315, 22.5315],
            [88.3585, 22.5475],
            [88.4055, 22.5645],
            [88.4325, 22.5775],
            [88.4525, 22.5845],
            [88.4685, 22.5915],
            [88.4675, 22.5925]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'chainage-kol-ch-0-000',
      properties: {
        type: 'Chainage',
        project_id: 'WB-KOL-KONA-2026',
        label: 'Ch. 0+000',
        station: 'New Town Action Area II Junction',
        elevation: '11.2m'
      },
      geometry: { type: 'Point', coordinates: [88.4680, 22.5920] }
    },
    {
      type: 'Feature',
      id: 'chainage-kol-ch-7-500',
      properties: {
        type: 'Chainage',
        project_id: 'WB-KOL-KONA-2026',
        label: 'Ch. 7+500',
        station: 'Rajarhat Expressway Interchange',
        elevation: '10.8m'
      },
      geometry: { type: 'Point', coordinates: [88.4520, 22.5850] }
    },
    {
      type: 'Feature',
      id: 'chainage-kol-ch-15-200',
      properties: {
        type: 'Chainage',
        project_id: 'WB-KOL-KONA-2026',
        label: 'Ch. 15+200',
        station: 'Vidyasagar Setu Toll Plaza Approach',
        elevation: '14.5m'
      },
      geometry: { type: 'Point', coordinates: [88.3280, 22.5560] }
    },
    {
      type: 'Feature',
      id: 'chainage-kol-ch-28-600',
      properties: {
        type: 'Chainage',
        project_id: 'WB-KOL-KONA-2026',
        label: 'Ch. 28+600',
        station: 'Nibra Terminal (NH-16 & Kona Junction)',
        elevation: '12.1m'
      },
      geometry: { type: 'Point', coordinates: [88.2420, 22.6020] }
    },
    // Patna Ring Road Phase II Alignment
    {
      type: 'Feature',
      id: 'centerline-prr-ph2',
      properties: {
        id: 'centerline-prr-ph2',
        project_id: 'PRR-EXP-2025',
        name: 'Patna Ring Road Phase II Expressway Alignment',
        width: 60,
        type: 'Expressway',
        length_km: 24.8,
        status: 'UNDER_ACQUISITION'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [85.0200, 25.5580],
          [85.0350, 25.5680],
          [85.0560, 25.5780],
          [85.0880, 25.5920],
          [85.1240, 25.6120],
          [85.1490, 25.6280],
          [85.1720, 25.6410],
          [85.1900, 25.6520]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'row-buffer-prr-ph2',
      properties: {
        id: 'row-buffer-prr-ph2',
        name: 'Right of Way (RoW) 60m Statutory Corridor Buffer',
        type: 'Buffer',
        buffer_width_meters: 60
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.0195, 25.5590],
            [85.0345, 25.5690],
            [85.0555, 25.5790],
            [85.0875, 25.5930],
            [85.1235, 25.6130],
            [85.1485, 25.6290],
            [85.1715, 25.6420],
            [85.1895, 25.6530],
            [85.1905, 25.6510],
            [85.1725, 25.6400],
            [85.1495, 25.6270],
            [85.1245, 25.6110],
            [85.0885, 25.5910],
            [85.0565, 25.5770],
            [85.0355, 25.5670],
            [85.0205, 25.5570],
            [85.0195, 25.5590]
          ]
        ]
      }
    },
    // Chainage Milestone Points along the alignment
    {
      type: 'Feature',
      id: 'chainage-ch-0-000',
      properties: {
        type: 'Chainage',
        label: 'Ch. 0+000',
        station: 'Kanhauli Junction (NH-30)',
        elevation: '53.4m'
      },
      geometry: { type: 'Point', coordinates: [85.0200, 25.5580] }
    },
    {
      type: 'Feature',
      id: 'chainage-ch-5-000',
      properties: {
        type: 'Chainage',
        label: 'Ch. 5+000',
        station: 'Naubatpur Bypass Intersection',
        elevation: '54.2m'
      },
      geometry: { type: 'Point', coordinates: [85.0560, 25.5780] }
    },
    {
      type: 'Feature',
      id: 'chainage-ch-12-000',
      properties: {
        type: 'Chainage',
        label: 'Ch. 12+000',
        station: 'Phulwari Sharif Radial Link',
        elevation: '52.8m'
      },
      geometry: { type: 'Point', coordinates: [85.0880, 25.5920] }
    },
    {
      type: 'Feature',
      id: 'chainage-ch-18-000',
      properties: {
        type: 'Chainage',
        label: 'Ch. 18+000',
        station: 'Danapur Cantonment Peripheral Flyover',
        elevation: '51.9m'
      },
      geometry: { type: 'Point', coordinates: [85.1490, 25.6280] }
    },
    {
      type: 'Feature',
      id: 'chainage-ch-24-800',
      properties: {
        type: 'Chainage',
        label: 'Ch. 24+800',
        station: 'Digha-Danapur Riverfront Terminal',
        elevation: '50.6m'
      },
      geometry: { type: 'Point', coordinates: [85.1900, 25.6520] }
    }
  ]
};

// Cadastral Survey Demarcation Stones / Boundary Pillars (Seemana / Burji) GeoJSON
export const surveyPillarsGeoJson: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: mockParcels.flatMap((p, idx) => {
    // Generate boundary pillar points at polygon corners
    return p.polygonCoordinates.slice(0, 3).map((coord, cIdx) => ({
      type: 'Feature' as const,
      id: `pillar-${p.id}-${cIdx}`,
      properties: {
        pillar_id: `CP-${p.village.substring(0, 3).toUpperCase()}-${p.khasraNo.replace('/', '_')}-P${cIdx + 1}`,
        parcel_id: p.id,
        khasra: p.khasraNo,
        type: 'Cadastral_Demarcation_Stone',
        survey_authority: 'Amin Cadastral Survey / DGPS RTK',
        status: p.fieldVerification.length > 0 ? 'GROUND_VERIFIED' : 'PROPOSED_DEMARCATION',
        coordinates: coord
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [coord[1], coord[0]] // [lng, lat]
      }
    }));
  })
};
