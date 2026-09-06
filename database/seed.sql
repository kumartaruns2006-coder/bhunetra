-- ====================================================================
-- BHUNETRA (BHUMI-TRACK): INITIAL SEED DATA
-- Insert demo users, West Bengal + Bihar corridors, and sample parcels
-- ====================================================================

-- 1. USERS
INSERT INTO users (id, username, name, role, department, district, state, assigned_parcels, password_hash)
VALUES 
  ('usr-nhai-pia', 'nhai_po_patna', 'Shri Rajesh Sharma', 'NHAI_PD', 'NHAI Project Implementation Unit (PIU)', 'Patna', 'Bihar', '["PRR-KAN-0125-2"]', 'pbkdf2_demo_hash_9281'),
  ('usr-cala-01', 'cala_patna', 'Dr. Alok Verma', 'CALA', 'Competent Authority for Land Acquisition', 'Patna', 'Bihar', '["PRR-KAN-0125-2"]', 'pbkdf2_demo_hash_9282'),
  ('usr-amin-01', 'amin_naubatpur', 'Rameshwar Kumar', 'AMIN', 'Revenue & Land Reforms Department', 'Patna', 'Bihar', '["PRR-KAN-0125-2"]', 'pbkdf2_demo_hash_9283'),
  ('usr-cit-wb-01', 'citizen_wb', 'Shri Soumitra Chatterjee', 'CITIZEN', 'BanglarBhumi Citizen Gateway', 'North 24 Parganas', 'West Bengal', '["K-125/2", "WB-KOL-K108/1", "WB-KOL-K108/2"]', 'pbkdf2_demo_hash_9284')
ON CONFLICT (id) DO NOTHING;

-- 2. PROJECT CORRIDOR
INSERT INTO project_corridors (id, code, name, state, districts, corridor_length_km, right_of_way_width_m, total_parcels_count, total_area_hectares, acquired_area_hectares, estimated_cost_inr_cr, disbursed_cost_inr_cr, implementing_agency, status, overall_progress_pct)
VALUES 
  ('PRR-PH2-2026', 'PRR-PH2-2026', 'Patna Ring Road Expansion (Phase II)', 'Bihar', '["Patna", "Saran", "Bhojpur"]', 38.40, 60.00, 1250, 340.00, 224.40, 540.00, 380.00, 'NHAI PIU Patna', 'IN_PROGRESS', 66.00),
  ('WB-KOL-KONA-2026', 'WB-KOL-KONA-2026', 'Kolkata Infrastructure Project (Kona Expressway)', 'West Bengal', '["North 24 Parganas", "Kolkata", "Howrah"]', 24.60, 45.00, 680, 195.00, 120.00, 780.00, 410.00, 'NHAI PIU Kolkata', 'IN_PROGRESS', 62.00)
ON CONFLICT (id) DO NOTHING;

-- 3. FLAGSHIP PARCEL (WEST BENGAL SHOWCASE K-125/2)
INSERT INTO parcels (id, khasra_no, project_id, state, district, sub_division, circle, mauza, survey_number, area_acres, area_hectares, raiyat_name, rfctlarr_section, statutory_status, map_status, basic_rate_per_sqm, market_value_inr, solatium_inr, sanctioned_amount_inr, disbursed_amount_inr, ai_risk_score, ai_risk_level, predicted_delay_days, coordinates)
VALUES 
  ('K-125/2', '125/2', 'WB-KOL-KONA-2026', 'West Bengal', 'North 24 Parganas', 'Barasat Sadar', 'Rajarhat', 'Rajarhat Mauza', 'CS-8812', 0.4200, 0.1700, 'Shri Soumitra Chatterjee', 'Section 3G', 'VALUATION_IN_PROGRESS', 'VERIFIED', 22300.00, 3792100.00, 3792100.00, 7584200.00, 0.00, 18, 'LOW', 12, '[[88.4312, 22.5726], [88.4325, 22.5728], [88.4328, 22.5715], [88.4315, 22.5713], [88.4312, 22.5726]]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. WORKFLOW STAGES (15 STATUTORY MILESTONES)
INSERT INTO workflow_stages (id, stage_number, name, short_code, category, status, start_date, target_date, responsible_authority, remarks, delay_days, risk)
VALUES 
  (1, 1, 'Proposal Submission', 'PROP-SUB', 'PRE_ACQUISITION', 'COMPLETED', '2024-01-15', '2024-02-15', 'NHAI Project Director', 'Proposal validated with DPR alignment', 0, 'LOW'),
  (2, 2, 'Digital Scrutiny', 'SCRUT-DIG', 'PRE_ACQUISITION', 'COMPLETED', '2024-02-16', '2024-03-10', 'State Revenue Automated System', 'Cadastral validation complete', 0, 'LOW'),
  (3, 3, 'Approval', 'APP-SANCT', 'PRE_ACQUISITION', 'COMPLETED', '2024-03-15', '2024-04-05', 'MoRTH Central Authority', 'Sanction granted', 0, 'LOW'),
  (4, 4, 'Cadastral Survey', 'CAD-SURV', 'PRE_ACQUISITION', 'COMPLETED', '2024-04-10', '2024-05-15', 'Directorate of Land Records & Survey', 'DGPS enumeration complete', 0, 'LOW'),
  (5, 5, 'GIS Mapping', 'GIS-MAP', 'PRE_ACQUISITION', 'COMPLETED', '2024-05-15', '2024-06-30', 'NIC & ISRO Bhuvan Spatial Cell', 'Vector layer geo-referenced', 0, 'LOW'),
  (6, 6, 'SIA', 'SIA-STG', 'PRE_ACQUISITION', 'COMPLETED', '2024-07-01', '2024-08-30', 'State SIA Unit', 'Public hearings endorsed', 0, 'LOW'),
  (7, 7, 'Preliminary Notification', 'NOT-3A', 'STATUTORY_NOTIFICATION', 'COMPLETED', '2024-09-01', '2024-10-15', 'Gazette of India Directorate', 'Section 3A published in Gazette', 0, 'LOW'),
  (8, 8, 'Objection / Hearing', 'OBJ-3C', 'STATUTORY_NOTIFICATION', 'DELAYED', '2026-01-10', '2026-02-15', 'CALA Patna', 'Hearings 92% complete; 18 disputed plots pending before CALA court', 28, 'HIGH'),
  (9, 9, 'Declaration', 'DEC-3D', 'STATUTORY_NOTIFICATION', 'IN_PROGRESS', '2026-02-20', '2026-10-30', 'MoRTH Gazette Cell', 'Vesting schedule prepared for 1,232 parcels', 0, 'MEDIUM'),
  (10, 10, 'Award', 'AWD-3G', 'VALUATION_COMPENSATION', 'IN_PROGRESS', '2026-05-01', '2026-11-30', 'CALA Valuation Committee', 'Circle rate multipliers and 100% Solatium computed', 0, 'MEDIUM'),
  (11, 11, 'Compensation Assessment', 'CMP-ASM', 'VALUATION_COMPENSATION', 'IN_PROGRESS', '2026-07-01', '2026-12-31', 'CALA Revenue Assessment Team', '1,025 parcels verified / 225 pending', 0, 'MEDIUM'),
  (12, 12, 'Compensation Disbursement', 'CMP-DIS', 'VALUATION_COMPENSATION', 'IN_PROGRESS', '2026-08-01', '2027-02-28', 'State Bank of India Escrow & CALA PFMS', '₹380.0 Cr disbursed via PFMS / ₹90.0 Cr balance', 0, 'LOW'),
  (13, 13, 'R&R', 'RNR-STG', 'POSSESSION_CLOSURE', 'IN_PROGRESS', '2026-09-01', '2027-03-31', 'R&R Commissioner', '820 PAFs rehabilitated / 160 pending', 0, 'LOW'),
  (14, 14, 'Possession', 'POS-STG', 'POSSESSION_CLOSURE', 'IN_PROGRESS', '2026-10-01', '2027-04-30', 'District Collector & Executive Magistrate', '72% corridor possession secured', 0, 'LOW'),
  (15, 15, 'Land Handover', 'HND-STG', 'POSSESSION_CLOSURE', 'NOT_STARTED', '2027-01-01', '2027-06-30', 'NHAI Highway Concessionaire', 'Scheduled post-possession certificate', 0, 'LOW')
ON CONFLICT (id) DO UPDATE 
SET status = EXCLUDED.status, target_date = EXCLUDED.target_date, delay_days = EXCLUDED.delay_days;
