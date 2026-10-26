-- SKS Travels Database Schema
-- Compatible with PostgreSQL (Supabase) and SQLite

CREATE TABLE IF NOT EXISTS company_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT NOT NULL,
  tagline TEXT,
  tagline_ta TEXT,
  phone TEXT,
  alternate_phone TEXT,
  whatsapp_number TEXT,
  email TEXT,
  address TEXT,
  address_ta TEXT,
  operating_districts_count INTEGER DEFAULT 38,
  gst_number TEXT,
  registration_number TEXT,
  upi_id TEXT,
  working_hours TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tamil_name TEXT,
  model TEXT,
  capacity INTEGER NOT NULL,
  suitable_group_min INTEGER,
  suitable_group_max INTEGER,
  image TEXT,
  ac_type TEXT,
  seating_type TEXT,
  amenities TEXT, -- JSON array of strings
  amenities_ta TEXT, -- JSON array of strings
  per_km_rate REAL NOT NULL,
  min_km_per_day REAL DEFAULT 250,
  driver_allowance_per_day REAL DEFAULT 500,
  daily_rent REAL,
  is_available BOOLEAN DEFAULT 1,
  description TEXT,
  description_ta TEXT,
  luggage_capacity TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destinations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ta TEXT,
  district TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  gallery TEXT, -- JSON array
  short_description TEXT,
  short_description_ta TEXT,
  overview TEXT,
  overview_ta TEXT,
  highlights TEXT, -- JSON array
  highlights_ta TEXT, -- JSON array
  suggested_attractions TEXT, -- JSON array
  suggested_attractions_ta TEXT, -- JSON array
  suggested_duration TEXT,
  suggested_itinerary TEXT, -- JSON array of day objects
  distance_from_chennai INTEGER,
  distance_from_madurai INTEGER,
  distance_from_coimbatore INTEGER,
  best_time_to_visit TEXT,
  is_popular BOOLEAN DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tour_packages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ta TEXT,
  category TEXT NOT NULL,
  duration TEXT,
  duration_days INTEGER DEFAULT 1,
  places_covered TEXT, -- JSON array
  places_covered_ta TEXT, -- JSON array
  image TEXT,
  description TEXT,
  description_ta TEXT,
  inclusions TEXT, -- JSON array
  exclusions TEXT, -- JSON array
  itinerary TEXT, -- JSON array
  suitable_vehicles TEXT, -- JSON array
  base_price_estimate REAL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing_rules (
  id TEXT PRIMARY KEY DEFAULT 'default',
  per_km_rates TEXT NOT NULL, -- JSON mapping vehicle_id -> rate
  min_km_per_day REAL DEFAULT 250,
  driver_allowance_per_day REAL DEFAULT 500,
  night_halt_charge REAL DEFAULT 600,
  parking_estimation_per_day REAL DEFAULT 300,
  toll_estimation_per_100km REAL DEFAULT 150,
  inter_state_permit_charge REAL DEFAULT 0,
  extra_km_charge REAL DEFAULT 25,
  pricing_mode TEXT DEFAULT 'configured', -- 'configured' | 'quote-only'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_ref TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  pickup_location TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  intermediate_stops TEXT, -- JSON array
  departure_date TEXT NOT NULL, -- YYYY-MM-DD
  return_date TEXT NOT NULL, -- YYYY-MM-DD
  total_days INTEGER NOT NULL DEFAULT 1,
  passenger_count INTEGER NOT NULL,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  vehicle_name TEXT NOT NULL,
  estimated_distance_km REAL,
  quotation_amount REAL,
  quotation_breakdown TEXT, -- JSON
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'New Enquiry',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL
);

-- Indexes for performance & quick lookups
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings (departure_date, return_date);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON bookings (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings (booking_ref);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations (slug);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations (category);
CREATE INDEX IF NOT EXISTS idx_packages_slug ON tour_packages (slug);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions (expires_at);
