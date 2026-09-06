-- ====================================================================
-- BHUNETRA (BHUMI-TRACK): NATIONAL LAND ACQUISITION & GIS PLATFORM
-- Production Relational Database Schema (PostgreSQL 15+ with PostGIS)
-- Designed for Ministry of Road Transport & Highways (MoRTH) and NHAI
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Enable PostGIS for spatial geometries (uncomment in PostGIS-enabled environments)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. USER ROLES ENUM
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'CITIZEN',
    'CALA',
    'NHAI_PD',
    'STATE_OFFICER',
    'AMIN',
    'CENTRAL_AUTHORITY',
    'ADMIN',
    'BANK_OFFICER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  name VARCHAR(150) NOT NULL,
  role user_role NOT NULL DEFAULT 'CITIZEN',
  department VARCHAR(150),
  district VARCHAR(100),
  state VARCHAR(100) NOT NULL DEFAULT 'Bihar',
  assigned_parcels JSONB DEFAULT '[]'::jsonb,
  password_hash TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on user role & district
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_district ON users(district);

-- 4. PROJECT CORRIDORS TABLE
CREATE TABLE IF NOT EXISTS project_corridors (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  districts JSONB NOT NULL DEFAULT '[]'::jsonb,
  corridor_length_km NUMERIC(8, 2) NOT NULL,
  right_of_way_width_m NUMERIC(6, 2) NOT NULL,
  total_parcels_count INT NOT NULL DEFAULT 0,
  total_area_hectares NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  acquired_area_hectares NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  estimated_cost_inr_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
  disbursed_cost_inr_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
  implementing_agency VARCHAR(100) NOT NULL DEFAULT 'NHAI PIU',
  status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
  overall_progress_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CADASTRAL PARCELS TABLE
CREATE TABLE IF NOT EXISTS parcels (
  id VARCHAR(64) PRIMARY KEY,
  khasra_no VARCHAR(50) NOT NULL,
  project_id VARCHAR(64) REFERENCES project_corridors(id) ON DELETE SET NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  sub_division VARCHAR(100),
  circle VARCHAR(100),
  mauza VARCHAR(100) NOT NULL,
  survey_number VARCHAR(50),
  plot_type VARCHAR(50) DEFAULT 'AGRICULTURAL',
  area_acres NUMERIC(8, 4) NOT NULL,
  area_hectares NUMERIC(8, 4) NOT NULL,
  raiyat_name VARCHAR(150) NOT NULL,
  raiyat_father_name VARCHAR(150),
  raiyat_aadhaar_hash VARCHAR(64),
  raiyat_phone VARCHAR(20),
  co_sharers JSONB DEFAULT '[]'::jsonb,
  rfctlarr_section VARCHAR(20) NOT NULL DEFAULT 'Section 3G',
  statutory_status VARCHAR(50) NOT NULL DEFAULT 'VALUATION_IN_PROGRESS',
  map_status VARCHAR(50) NOT NULL DEFAULT 'DELINEATED',
  basic_rate_per_sqm NUMERIC(10, 2) DEFAULT 0.0,
  market_value_inr NUMERIC(14, 2) DEFAULT 0.0,
  multiplication_factor NUMERIC(3, 2) DEFAULT 1.5,
  solatium_inr NUMERIC(14, 2) DEFAULT 0.0,
  sanctioned_amount_inr NUMERIC(14, 2) DEFAULT 0.0,
  disbursed_amount_inr NUMERIC(14, 2) DEFAULT 0.0,
  ai_risk_score INT DEFAULT 20,
  ai_risk_level VARCHAR(20) DEFAULT 'LOW',
  predicted_delay_days INT DEFAULT 0,
  coordinates JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parcels_khasra ON parcels(khasra_no);
CREATE INDEX IF NOT EXISTS idx_parcels_project ON parcels(project_id);
CREATE INDEX IF NOT EXISTS idx_parcels_status ON parcels(statutory_status);

-- 6. WORKFLOW STAGES (15 STATUTORY MILESTONES)
CREATE TABLE IF NOT EXISTS workflow_stages (
  id INT PRIMARY KEY,
  stage_number INT NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  short_code VARCHAR(30) NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
  start_date DATE,
  target_date DATE NOT NULL,
  completion_date DATE,
  delay_days INT DEFAULT 0,
  responsible_authority VARCHAR(150) NOT NULL,
  remarks TEXT,
  risk VARCHAR(20) DEFAULT 'LOW',
  risk_factors JSONB DEFAULT '[]'::jsonb,
  metrics JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. WORKFLOW AUDIT LOG (IMMUTABLE STATUTORY TRAIL)
CREATE TABLE IF NOT EXISTS workflow_audit_log (
  id VARCHAR(64) PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  stage_id INT REFERENCES workflow_stages(id),
  stage_name VARCHAR(150) NOT NULL,
  action VARCHAR(50) NOT NULL,
  actor_name VARCHAR(150) NOT NULL,
  actor_role VARCHAR(50) NOT NULL,
  previous_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  remarks TEXT,
  document_title VARCHAR(255),
  clarification_query TEXT,
  digital_seal_hash VARCHAR(128) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_stage ON workflow_audit_log(stage_id);

-- 8. COMPENSATION & PFMS DISBURSEMENT
CREATE TABLE IF NOT EXISTS compensation_records (
  id VARCHAR(64) PRIMARY KEY,
  parcel_id VARCHAR(64) REFERENCES parcels(id) ON DELETE CASCADE,
  khasra_no VARCHAR(50) NOT NULL,
  raiyat_name VARCHAR(150) NOT NULL,
  bank_account_masked VARCHAR(50) NOT NULL,
  ifsc_code VARCHAR(20) NOT NULL,
  aadhaar_linked BOOLEAN DEFAULT TRUE,
  sanctioned_award_inr NUMERIC(14, 2) NOT NULL,
  disbursed_amount_inr NUMERIC(14, 2) DEFAULT 0.0,
  balance_amount_inr NUMERIC(14, 2) NOT NULL,
  pfms_batch_ref VARCHAR(100),
  payment_status VARCHAR(30) DEFAULT 'PENDING',
  disbursement_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. REHABILITATION & RESETTLEMENT (R&R) REGISTER
CREATE TABLE IF NOT EXISTS rnr_records (
  id VARCHAR(64) PRIMARY KEY,
  paf_id VARCHAR(50) UNIQUE NOT NULL,
  parcel_id VARCHAR(64) REFERENCES parcels(id),
  head_of_family VARCHAR(150) NOT NULL,
  family_members_count INT NOT NULL DEFAULT 1,
  category VARCHAR(50) NOT NULL DEFAULT 'TITLE_HOLDER',
  displacement_status VARCHAR(30) NOT NULL DEFAULT 'DISPLACED',
  rnr_status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',
  homestead_plot_no VARCHAR(50),
  resettlement_colony VARCHAR(150),
  subsistence_grant_inr NUMERIC(12, 2) DEFAULT 36000.0,
  transportation_allowance_inr NUMERIC(12, 2) DEFAULT 50000.0,
  training_allowance_inr NUMERIC(12, 2) DEFAULT 25000.0,
  total_entitlement_inr NUMERIC(12, 2) NOT NULL,
  paid_entitlement_inr NUMERIC(12, 2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. STATUTORY NOTIFICATIONS & ALERTS
CREATE TABLE IF NOT EXISTS statutory_alerts (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES project_corridors(id),
  parcel_id VARCHAR(64) REFERENCES parcels(id),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  message TEXT NOT NULL,
  recommended_action TEXT,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE compensation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rnr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_corridors ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for prototype API client
CREATE POLICY allow_all_parcels ON parcels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_stages ON workflow_stages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_users ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_corridors ON project_corridors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_audit ON workflow_audit_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_comp ON compensation_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY allow_all_rnr ON rnr_records FOR ALL USING (true) WITH CHECK (true);

