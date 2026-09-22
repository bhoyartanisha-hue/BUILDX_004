-- Seed Data for Nagar Setu (Nagpur Civic Operations Demo)
-- File: supabase/seed.sql

-- Clear existing data
TRUNCATE TABLE complaints, clusters, assets, road_segments RESTART IDENTITY CASCADE;

-- Insert Assets (Streetlights, Wires, Pipelines, Chambers) with Nagpur coordinates
-- Some assets are past due (expired before current date) to trigger overdue flags
INSERT INTO assets (id, type, install_date, expiry_date, lat, lng, geometry, color_code, cost) VALUES
('ast-001', 'streetlight', '2019-03-15', '2024-03-15', 21.1458, 79.0882, '{"type": "Point", "coordinates": [79.0882, 21.1458]}', '#eab308', 12500.00),
('ast-002', 'streetlight', '2020-06-10', '2025-06-10', 21.1462, 79.0890, '{"type": "Point", "coordinates": [79.0890, 21.1462]}', '#eab308', 12500.00),
('ast-003', 'wire', '2015-01-20', '2025-01-20', 21.1475, 79.0850, '{"type": "LineString", "coordinates": [[79.0850, 21.1475], [79.0870, 21.1480]]}', '#f97316', 45000.00),
('ast-004', 'wire', '2022-04-12', '2028-04-12', 21.1490, 79.0820, '{"type": "LineString", "coordinates": [[79.0820, 21.1490], [79.0840, 21.1495]]}', '#f97316', 38000.00),
('ast-005', 'pipeline', '2012-08-05', '2024-08-05', 21.1430, 79.0800, '{"type": "LineString", "coordinates": [[79.0800, 21.1430], [79.0830, 21.1445]]}', '#ef4444', 180000.00),
('ast-006', 'pipeline', '2021-11-30', '2031-11-30', 21.1410, 79.0850, '{"type": "LineString", "coordinates": [[79.0850, 21.1410], [79.0880, 21.1425]]}', '#ef4444', 210000.00),
('ast-007', 'chamber', '2016-05-18', '2024-05-18', 21.1442, 79.0822, '{"type": "Point", "coordinates": [79.0822, 21.1442]}', '#06b6d4', 25000.00),
('ast-008', 'chamber', '2023-02-14', '2033-02-14', 21.1468, 79.0864, '{"type": "Point", "coordinates": [79.0864, 21.1468]}', '#06b6d4', 28000.00),
('ast-009', 'streetlight', '2018-09-01', '2023-09-01', 21.1405, 79.0895, '{"type": "Point", "coordinates": [79.0895, 21.1405]}', '#eab308', 11000.00),
('ast-010', 'wire', '2014-07-22', '2024-07-22', 21.1482, 79.0872, '{"type": "LineString", "coordinates": [[79.0872, 21.1482], [79.0892, 21.1488]]}', '#f97316', 52000.00),
('ast-011', 'pipeline', '2010-03-10', '2025-03-10', 21.1390, 79.0770, '{"type": "LineString", "coordinates": [[79.0770, 21.1390], [79.0795, 21.1405]]}', '#ef4444', 195000.00),
('ast-012', 'chamber', '2022-09-15', '2032-09-15', 21.1425, 79.0845, '{"type": "Point", "coordinates": [79.0845, 21.1425]}', '#06b6d4', 26000.00);

-- Insert Road Segments for Nagpur with repairs and computed health scores
INSERT INTO road_segments (id, name, geometry, repair_history, health_score, last_prediction) VALUES
('rd-001', 'Wardha Road (Sitabuldi - Square)', 
 '{"type": "LineString", "coordinates": [[79.0820, 21.1440], [79.0860, 21.1455], [79.0890, 21.1470]]}',
 '[{"date": "2024-02-10", "type": "Pothole Patching", "cost": 45000, "contractor": "Nagpur Infra Ltd"}, {"date": "2024-11-05", "type": "Resurfacing", "cost": 320000, "contractor": "Apex Builders"}]'::jsonb,
 62.50,
 'High risk of sub-surface water seepage collapse near Sitabuldi junction. Recommend immediate drainage channel inspection within 14 days.'),

('rd-002', 'Amravati Road (Dharampeth Corridor)',
 '{"type": "LineString", "coordinates": [[79.0680, 21.1490], [79.0740, 21.1510], [79.0790, 21.1525]]}',
 '[{"date": "2024-05-18", "type": "Manhole Raising & Leveling", "cost": 28000, "contractor": "City Works Co"}]'::jsonb,
 84.00,
 'Road surface in good health. Minor edge cracking observed near Dharampeth market.'),

('rd-003', 'West High Court Road (Civil Lines)',
 '{"type": "LineString", "coordinates": [[79.0750, 21.1560], [79.0790, 21.1580], [79.0830, 21.1600]]}',
 '[{"date": "2023-10-12", "type": "Full Asphalt Overlay", "cost": 540000, "contractor": "Nagpur Infra Ltd"}]'::jsonb,
 91.00,
 'Optimal structural health. Scheduled routine maintenance due Q3 2027.'),

('rd-004', 'Seminary Hills Bypass Road',
 '{"type": "LineString", "coordinates": [[79.0550, 21.1650], [79.0620, 21.1680], [79.0690, 21.1710]]}',
 '[{"date": "2023-08-20", "type": "Gutter Clearance", "cost": 15000, "contractor": "CleanCity Infra"}]'::jsonb,
 54.00,
 'Severe monsoon runoff damage detected. High probability of recurring potholes near curve km 1.2.');

-- Insert Hotspot Clusters
INSERT INTO clusters (id, complaint_ids, centroid_lat, centroid_lng, category, first_seen_at, occurrence_count, is_hotspot) VALUES
('cls-001', '["cmp-001", "cmp-002", "cmp-003"]'::jsonb, 21.1445, 79.0825, 'sewer', '2026-03-01 10:00:00+05:30', 3, TRUE),
('cls-002', '["cmp-004", "cmp-005"]'::jsonb, 21.1462, 79.0890, 'electricity', '2026-03-10 14:30:00+05:30', 2, FALSE);

-- Insert Demo Complaints across Web, WhatsApp, IVR channels
-- Includes the complete "hotspot -> prediction -> contractor verification" story arc
INSERT INTO complaints (id, description, language, category, department, zone, severity, source, lat, lng, status, timeline, cluster_id, acknowledgment, created_at) VALUES
('cmp-001', 'Major sewage overflow near Wardha Road market square. Water entering nearby shops.', 'en', 'sewer', 'Water & Sanitation', 'Wardha Road Zone', 5, 'web', 21.1444, 79.0824, 'in_progress', 
 '[{"step": "Filed via Web Portal", "timestamp": "2026-03-01T10:00:00Z"}, {"step": "AI Classified & Routed to Water & Sanitation", "timestamp": "2026-03-01T10:02:00Z"}, {"step": "Inspection Team Dispatched", "timestamp": "2026-03-01T11:15:00Z"}]'::jsonb,
 'cls-001', 'Thank you for reporting. Our sanitation emergency team has been alerted and dispatched.', '2026-03-01 10:00:00+05:30'),

('cmp-002', 'गटर का पानी सड़क पर बह रहा है वर्धा रोड पर, बदबू आ रही है।', 'hi', 'sewer', 'Water & Sanitation', 'Wardha Road Zone', 4, 'whatsapp', 21.1446, 79.0826, 'in_progress',
 '[{"step": "Filed via WhatsApp Bot", "timestamp": "2026-03-03T14:20:00Z"}, {"step": "Grouped into Hotspot Cluster #cls-001", "timestamp": "2026-03-03T14:21:00Z"}]'::jsonb,
 'cls-001', 'आपकी शिकायत दर्ज कर ली गई है। सफाई टीम मौके पर भेजी जा रही है।', '2026-03-03 14:20:00+05:30'),

('cmp-003', 'वर्धा रोड चौकजवळ ड्रेनेज लाईन फुटली आहे, त्वरित दुरुस्ती करा.', 'mr', 'sewer', 'Water & Sanitation', 'Wardha Road Zone', 5, 'ivr', 21.1445, 79.0825, 'pending_verification',
 '[{"step": "Filed via IVR Helpline Call", "timestamp": "2026-03-05T09:10:00Z"}, {"step": "Contractor Repair Work Completed", "timestamp": "2026-03-06T16:00:00Z"}, {"step": "Awaiting Official Verification", "timestamp": "2026-03-06T16:30:00Z"}]'::jsonb,
 'cls-001', 'आपली तक्रार नोंदवण्यात आली आहे. आमचे अधिकारी त्वरित कारवाई करत आहेत.', '2026-03-05 09:10:00+05:30'),

('cmp-004', 'Streetlight flickering and sparked near Dharampeth bus stop.', 'en', 'electricity', 'Electrical Services', 'Dharampeth Zone', 3, 'web', 21.1462, 79.0890, 'pending',
 '[{"step": "Filed via Web Portal", "timestamp": "2026-03-10T14:30:00Z"}]'::jsonb,
 'cls-002', 'Thank you for raising this issue. Electrical services division will inspect the pole within 24 hours.', '2026-03-10 14:30:00+05:30'),

('cmp-005', 'Open electrical junction box wire hanging low on street pole.', 'en', 'electricity', 'Electrical Services', 'Dharampeth Zone', 4, 'whatsapp', 21.1463, 79.0891, 'pending',
 '[{"step": "Filed via WhatsApp Bot", "timestamp": "2026-03-11T11:00:00Z"}]'::jsonb,
 'cls-002', 'High priority safety alert received. Maintenance team alerted.', '2026-03-11 11:00:00+05:30'),

('cmp-006', 'Water supply pipe leaking continuously on WHC Road near Civil Lines.', 'en', 'water', 'Water Supply', 'Civil Lines Zone', 3, 'web', 21.1565, 79.0760, 'resolved',
 '[{"step": "Filed via Web Portal", "timestamp": "2026-02-15T08:00:00Z"}, {"step": "Pipe Seal Applied", "timestamp": "2026-02-15T15:00:00Z"}, {"step": "Verified & Resolved", "timestamp": "2026-02-16T10:00:00Z"}]'::jsonb,
 NULL, 'Issue resolved and verified by field engineer.', '2026-02-15 08:00:00+05:30');
