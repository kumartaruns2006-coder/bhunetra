# BhuNetra (BHUMI-TRACK) — Prompt 18 Implementation Walkthrough

## Overview
Prompt 18 successfully introduces **Civilian / Citizen Landowner Tracking**, **All-India 36 States & UTs Coverage**, **West Bengal + Kolkata Primary Showcase Corridor**, **OpenStreetMap & Interactive GIS Measurement Tool**, and a **Root-Cause Fix for Acquisition Workflow Delayed Stages**, while strictly preserving all previously implemented functionality from Prompts 1–17.

---

## 1. Civilian / Citizen Landowner Tracking Portal

### Architecture & RBAC Isolation
- **Role**: Added `CITIZEN` to [UserRole](file:///c:/Users/kumar/Downloads/bhunetra/src/types/auth.ts) and `citizen` module to navigation.
- **Dedicated Public Gateway**: Added tabbed login on [LoginScreen.tsx](file:///c:/Users/kumar/Downloads/bhunetra/src/components/auth/LoginScreen.tsx) separating **Officer Authentication (9 Roles)** from **Citizen Landowner Portal (Public)**.
- **Demonstration Personas**:
  - **Shri Soumitra Chatterjee (West Bengal)**: Plot No. `108/1`, Mouza Rajarhat, North 24 Parganas, Kolkata Elevated Corridor.
  - **Shri Mukesh Narayan Singh (Bihar)**: Plot No. `125/2`, Village Danapur, Patna, Patna Ring Road.
- **Citizen Portal Component** ([CitizenDashboard.tsx](file:///c:/Users/kumar/Downloads/bhunetra/src/components/citizen/CitizenDashboard.tsx)):
  - **My Land Summary**: Verified Titleholder / Raiyat banner, masked Aadhaar (`•••• •••• 6419`), Khasra Plot `108/1`, area `0.52 Ha` (`1.28 Acres`), LGD code.
  - **8-Stage Statutory Lifecycle Tracker**: Stage 1 to 8 (Alignment, JMS, Section 3A, Section 3C, Section 3D, Section 3G, Section 3H, Section 3E) with dates, status badges, legal citations, and hearing notifications.
  - **Transparent RFCTLARR Compensation Statement**: Complete itemized breakdown conforming to First Schedule of RFCTLARR Act 2013 (Base Market Value + 1.25x Multiplier + 100% Solatium under Sec 30(1) + 12% p.a. Additional Interest under Sec 30(3) + Asset valuation = **₹61.16 Lakhs** award).
  - **Direct DBT / PFMS Integration**: Bank account reference (`SBIN0001832`, A/C: `••••••••4501`) and PFMS voucher tracking (`PFMS-NHAI-WB26-098231`).
  - **Gazette & Document Locker**: Download center for 3A Notification, 3D Vesting Declaration, JMS Cadastral Overlay, and 3G Award Schedule.
  - **CALA Grievance / Hearing Request**: Built-in petition form with 7-day SLA resolution guarantee.
  - **Digital Twin Integration**: One-click launcher to open the 360° Parcel Digital Twin for `WB-KOL-K108/1`.

---

## 2. All-India Administrative Coverage (28 States & 8 UTs)

- **Master Registry** ([allIndiaData.ts](file:///c:/Users/kumar/Downloads/bhunetra/src/data/allIndiaData.ts)):
  - Complete list of all 28 States and 8 Union Territories with official 2-letter codes, official LGD codes, capital cities, Hindi names, and complete district arrays (all 23 districts of West Bengal, all 38 districts of Bihar, plus all other states/UTs).
  - Helper functions `allIndiaAdminService` and `getDistrictsForState`.
- **Dynamic Cascading Selectors**:
  - Connected [TopBar.tsx](file:///c:/Users/kumar/Downloads/bhunetra/src/components/layout/TopBar.tsx) and [NationalDashboard.tsx](file:///c:/Users/kumar/Downloads/bhunetra/src/components/dashboard/NationalDashboard.tsx) to dynamically populate state and district dropdowns across all 36 administrative units.
  - Selecting any state automatically populates its genuine districts.

---

## 3. West Bengal + Kolkata Showcase Corridor (Primary Default)

- **Primary Corridor** ([mockProjects.ts](file:///c:/Users/kumar/Downloads/bhunetra/src/data/mockProjects.ts)):
  - `WB-KOL-KONA-2026`: *Kolkata Elevated Corridor & Kona Expressway Expansion*
  - Length: `28.6 km`, Budget: `₹620.50 Cr`, Center: `[22.5726, 88.3639]`.
  - Villages: Rajarhat, New Town Action Area II, Kona Crossing, Nibra, Alipore, Mahisbathan.
- **Top Showcase Parcels** ([mockParcels.ts](file:///c:/Users/kumar/Downloads/bhunetra/src/data/mockParcels.ts)):
  - `WB-KOL-K108/1`: Flagship Kolkata parcel (Soumitra Chatterjee, Khasra 108/1, 0.52 Ha, Section 3G Pending - Yellow).
  - `WB-KOL-K108/2`: Verified parcel (Anirban Banerjee, 0.38 Ha, Section 3D - Blue).
  - `WB-KOL-K214/3`: Delayed hearing parcel (Debashis Mukherjee, 0.65 Ha, Section 3C - Orange).
  - `WB-KOL-K215/1`: Disputed court injunction parcel (Sunil Baran Roy, 0.42 Ha, Section 3C - Red).
  - `WB-KOL-K302/1`: Acquired logistics hub (Port Trust, 1.80 Ha, Section 3E - Green).
  - `WB-KOL-K305/2`: Acquired commercial parcel (Sector V Salt Lake, 0.95 Ha, Section 3E - Green).
- **Existing Bihar Corridors**: Fully preserved (`PRR-EXP-2025`, `NH119D-EXP`, `BSH-EXP-2025`) and accessible seamlessly.

---

## 4. GIS Map Upgrade (OpenStreetMap, 3D Tilt & Measurement)

- **Standard OpenStreetMap Basemap** ([GisMap.tsx](file:///c:/Users/kumar/Downloads/bhunetra/src/components/gis/GisMap.tsx)):
  - Replaced Carto basemap with standard OpenStreetMap raster tiles `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
  - Embedded required attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`.
  - Maintained Satellite view (Esri World Imagery) and Terrain view (OpenTopoMap) switchers.
- **2D / 3D Tilt Toggle**:
  - Interactive toolbar toggle switching pitch between `0°` (2D flat map) and `50°` (3D perspective tilt) with animated transitions.
- **Interactive 2-Point Distance Measurement Tool**:
  - Measurement mode with geodesic distance calculation (Haversine formula).
  - Real-time line drawing GeoJSON on the map with floating HUD card reporting distance in meters and kilometers.
- **Corridor Centering**:
  - Map dynamically defaults to Kolkata `[88.3639, 22.5726]`, while smoothly flying to the active corridor when project changes.

---

## 5. Root-Cause Fix for Acquisition Workflow "Delayed Stage" Calculation

- **Dynamic Delay Engine** ([workflowService.ts](file:///c:/Users/kumar/Downloads/bhunetra/src/services/workflowService.ts)):
  - Implemented `WorkflowService.computeStageWithDelay(stage, referenceDateStr)`.
  - Evaluates `targetDate < currentDate` for uncompleted stages, automatically transitions status to `'DELAYED'`, computes exact `delayDays`, elevates risk, and appends statutory breach warnings.
  - Fully wired into `getStages()`, `getStageById()`, and `getSummary()`.
- **Workflow UI Alert** ([EndToEndWorkflowView.tsx](file:///c:/Users/kumar/Downloads/bhunetra/src/components/workflow/EndToEndWorkflowView.tsx)):
  - Prominent red warning banner displaying delay duration (e.g. `+38 days`), responsible authority (e.g. `CALA Patna`), and direct "Inspect Delayed Stage" navigation.

---

## 6. Build Verification

- **Command**: `npm run build` (`tsc && vite build`)
- **Status**: Exit Code **0**
- **Artifacts**: 1,915 modules transformed, production assets generated in `dist/`.
- **Server**: Dev server responding with `HTTP 200 OK` on `http://localhost:3000/`.
