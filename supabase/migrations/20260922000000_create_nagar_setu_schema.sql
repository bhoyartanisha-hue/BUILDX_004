-- Migration: Create Nagar Setu Database Schema
-- File: 20260922000000_create_nagar_setu_schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role type definition for access control
CREATE TYPE user_role AS ENUM ('citizen', 'official', 'contractor');

-- Table: clusters
CREATE TABLE IF NOT EXISTS clusters (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    complaint_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    centroid_lat DOUBLE PRECISION NOT NULL,
    centroid_lng DOUBLE PRECISION NOT NULL,
    category TEXT NOT NULL,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    occurrence_count INT NOT NULL DEFAULT 1,
    is_hotspot BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table: complaints
CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    description TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    category TEXT NOT NULL,
    department TEXT NOT NULL,
    zone TEXT NOT NULL DEFAULT 'Wardha Road Zone',
    severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5),
    source TEXT NOT NULL CHECK (source IN ('web', 'whatsapp', 'ivr')),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'pending_verification', 'verified', 'resolved')),
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    cluster_id TEXT REFERENCES clusters(id) ON DELETE SET NULL,
    acknowledgment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: assets
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    type TEXT NOT NULL CHECK (type IN ('streetlight', 'wire', 'pipeline', 'chamber')),
    install_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    geometry JSONB,
    color_code TEXT NOT NULL DEFAULT '#3b82f6',
    cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- Table: road_segments
CREATE TABLE IF NOT EXISTS road_segments (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    geometry JSONB NOT NULL,
    repair_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    health_score NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    last_prediction TEXT
);

-- Indexes for performance & spatial queries
CREATE INDEX IF NOT EXISTS idx_complaints_lat_lng ON complaints(lat, lng);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_clusters_hotspot ON clusters(is_hotspot);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_expiry ON assets(expiry_date);
