import { VerificationTask } from '../types/verification';

export const mockVerificationTasks: VerificationTask[] = [
  // -------------------------------------------------------------
  // USER SHOWCASE TASK 1: K-125/2 (Verification Pending)
  // -------------------------------------------------------------
  {
    id: 'task-125-2',
    parcelId: 'K-125/2',
    khasraNo: '125/2',
    village: 'Kanhauli',
    tehsil: 'Bihta',
    district: 'Patna',
    state: 'Bihar',
    projectName: 'Patna Ring Road Expansion',
    projectId: 'PRR-PH2-2026',
    areaHectares: 0.48,
    areaSqM: 4800,
    primaryOwnerName: 'Mukesh Narayan Singh',
    khataNo: '48',
    status: 'PENDING',
    statusLabel: 'Verification Pending',
    priority: 'URGENT',
    dueDate: '2026-03-15',
    assignedAmin: 'Rajesh Kumar',
    assignedAminBadge: 'REV-AMIN-8492',
    gpsCoordinates: [25.56950, 85.03580],
    gpsAccuracyMeters: 0.012, // 12mm DGPS RTK
    gpsMatchWithinBoundary: true,
    boundaryDeviationMeters: 1.4,
    checklist: {
      gpsCaptured: true,
      boundaryVerified: true,
      landUseVerified: true,
      occupancyVerified: false,
      structureVerified: false,
      supportingEvidence: false
    },
    photos: [
      {
        id: 'photo-125-1',
        label: 'Photo 1',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        caption: 'Northern boundary peg check along 60m RoW corridor margin',
        compassHeading: 'N 14° E',
        timestamp: '10:15 AM'
      },
      {
        id: 'photo-125-2',
        label: 'Photo 2',
        url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
        caption: 'Standing Rabi mustard & wheat crop inspection',
        compassHeading: 'E 88°',
        timestamp: '10:35 AM'
      },
      {
        id: 'photo-125-3',
        label: 'Photo 3',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
        caption: 'Temporary tube-well pump room and brick wall inspection',
        compassHeading: 'S 172° W',
        timestamp: '10:50 AM'
      }
    ],
    remarks: 'Boundary demarcated with DGPS. Northern hedge encroaches 1.4m into proposed RoW buffer. Re-measurement scheduled with Circle Officer.',
    encroachmentDetected: true,
    encroachmentDetails: 'Northern boundary hedge encroaches 1.4m into proposed RoW buffer.',
    offlineStored: false,
    syncPending: false
  },

  // -------------------------------------------------------------
  // USER SHOWCASE TASK 2: K-126/1 (Re-verification)
  // -------------------------------------------------------------
  {
    id: 'task-126-1',
    parcelId: 'K-126/1',
    khasraNo: '126/1',
    village: 'Kanhauli',
    tehsil: 'Bihta',
    district: 'Patna',
    state: 'Bihar',
    projectName: 'Patna Ring Road Expansion',
    projectId: 'PRR-PH2-2026',
    areaHectares: 0.62,
    areaSqM: 6200,
    primaryOwnerName: 'Ram Sevak Yadav',
    khataNo: '52',
    status: 'RE_VERIFICATION',
    statusLabel: 'Re-verification',
    priority: 'HIGH',
    dueDate: '2026-03-18',
    assignedAmin: 'Rajesh Kumar',
    assignedAminBadge: 'REV-AMIN-8492',
    gpsCoordinates: [25.57120, 85.03810],
    gpsAccuracyMeters: 0.015,
    gpsMatchWithinBoundary: true,
    boundaryDeviationMeters: 2.1,
    checklist: {
      gpsCaptured: true,
      boundaryVerified: false,
      landUseVerified: true,
      occupancyVerified: false,
      structureVerified: false,
      supportingEvidence: false
    },
    photos: [
      {
        id: 'photo-126-1',
        label: 'Photo 1',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        caption: 'Re-pegging boundary after disputed survey stone displaced',
        compassHeading: 'NW 320°',
        timestamp: '11:20 AM'
      }
    ],
    remarks: 'Boundary stone #B-42 was reported displaced during road grading. Joint re-measurement required in presence of co-sharers.',
    encroachmentDetected: true,
    encroachmentDetails: 'Survey stone shifted 2.1m westward.',
    offlineStored: false,
    syncPending: false
  },

  // -------------------------------------------------------------
  // USER SHOWCASE TASK 3: K-130/2 (Completed)
  // -------------------------------------------------------------
  {
    id: 'task-130-2',
    parcelId: 'K-130/2',
    khasraNo: '130/2',
    village: 'Naubatpur',
    tehsil: 'Naubatpur',
    district: 'Patna',
    state: 'Bihar',
    projectName: 'Patna Ring Road Expansion',
    projectId: 'PRR-PH2-2026',
    areaHectares: 0.35,
    areaSqM: 3500,
    primaryOwnerName: 'Shambhu Nath Jha',
    khataNo: '19',
    status: 'COMPLETED',
    statusLabel: 'Completed',
    priority: 'NORMAL',
    dueDate: '2026-02-28',
    completedAt: '2026-02-28 04:30 PM',
    assignedAmin: 'Rajesh Kumar',
    assignedAminBadge: 'REV-AMIN-8492',
    gpsCoordinates: [25.55810, 85.02100],
    gpsAccuracyMeters: 0.011,
    gpsMatchWithinBoundary: true,
    boundaryDeviationMeters: 0.2,
    checklist: {
      gpsCaptured: true,
      boundaryVerified: true,
      landUseVerified: true,
      occupancyVerified: true,
      structureVerified: true,
      supportingEvidence: true
    },
    photos: [
      {
        id: 'photo-130-1',
        label: 'Photo 1',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        caption: 'Demarcation concrete pillars fixed and sealed',
        compassHeading: 'N 02° E',
        timestamp: '03:15 PM'
      },
      {
        id: 'photo-130-2',
        label: 'Photo 2',
        url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
        caption: 'Signatures on Panchnama verified with Raiyat',
        compassHeading: 'SE 140°',
        timestamp: '04:00 PM'
      }
    ],
    remarks: 'Ground verification fully completed. Demarcation pillars fixed with zero encroachment. Handover cleared for Section 3E.',
    encroachmentDetected: false,
    offlineStored: false,
    syncPending: false
  },

  // -------------------------------------------------------------
  // ADDITIONAL TASK: K-412/1 (In Progress)
  // -------------------------------------------------------------
  {
    id: 'task-412-1',
    parcelId: 'K-412/1',
    khasraNo: '412/1',
    village: 'Kanhauli',
    tehsil: 'Bihta',
    district: 'Patna',
    state: 'Bihar',
    projectName: 'Patna Ring Road Expansion',
    projectId: 'PRR-PH2-2026',
    areaHectares: 0.62,
    areaSqM: 6200,
    primaryOwnerName: 'Birendra Prasad Verma',
    khataNo: '88',
    status: 'IN_PROGRESS',
    statusLabel: 'In Progress',
    priority: 'HIGH',
    dueDate: '2026-03-20',
    assignedAmin: 'Rajesh Kumar',
    assignedAminBadge: 'REV-AMIN-8492',
    gpsCoordinates: [25.56840, 85.03450],
    gpsAccuracyMeters: 0.014,
    gpsMatchWithinBoundary: true,
    boundaryDeviationMeters: 0.9,
    checklist: {
      gpsCaptured: true,
      boundaryVerified: true,
      landUseVerified: true,
      occupancyVerified: false,
      structureVerified: false,
      supportingEvidence: false
    },
    photos: [
      {
        id: 'photo-412-1',
        label: 'Photo 1',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        caption: 'RoW boundary peg check',
        compassHeading: 'N 20° E',
        timestamp: '09:40 AM'
      }
    ],
    remarks: 'Survey in progress. Commercial shed inspection pending along road frontage.',
    encroachmentDetected: false,
    offlineStored: false,
    syncPending: false
  }
];
