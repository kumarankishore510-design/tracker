import { Database } from 'bun:sqlite';
import { initialVehicles } from '../src/data/vehicles';
import { initialDestinations } from '../src/data/destinations';
import { initialTourPackages } from '../src/data/packages';
import { defaultPricingRule } from '../src/data/defaultPricing';
import { defaultCompanySettings } from '../src/data/defaultSettings';

// Initialize SQLite database
const dbPath = './sks_travels.sqlite';
export const db = new Database(dbPath, { create: true });

// Enable WAL mode for high concurrent read/write performance
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
export function initDatabase() {
  db.exec(`
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
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
      amenities TEXT,
      amenities_ta TEXT,
      per_km_rate REAL NOT NULL,
      min_km_per_day REAL DEFAULT 250,
      driver_allowance_per_day REAL DEFAULT 500,
      daily_rent REAL,
      is_available INTEGER DEFAULT 1,
      description TEXT,
      description_ta TEXT,
      luggage_capacity TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      name_ta TEXT,
      district TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      gallery TEXT,
      short_description TEXT,
      short_description_ta TEXT,
      overview TEXT,
      overview_ta TEXT,
      highlights TEXT,
      highlights_ta TEXT,
      suggested_attractions TEXT,
      suggested_attractions_ta TEXT,
      suggested_duration TEXT,
      suggested_itinerary TEXT,
      distance_from_chennai INTEGER,
      distance_from_madurai INTEGER,
      distance_from_coimbatore INTEGER,
      best_time_to_visit TEXT,
      is_popular INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tour_packages (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      title_ta TEXT,
      category TEXT NOT NULL,
      duration TEXT,
      duration_days INTEGER DEFAULT 1,
      places_covered TEXT,
      places_covered_ta TEXT,
      image TEXT,
      description TEXT,
      description_ta TEXT,
      inclusions TEXT,
      exclusions TEXT,
      itinerary TEXT,
      suitable_vehicles TEXT,
      base_price_estimate REAL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pricing_rules (
      id TEXT PRIMARY KEY DEFAULT 'default',
      per_km_rates TEXT NOT NULL,
      min_km_per_day REAL DEFAULT 250,
      driver_allowance_per_day REAL DEFAULT 500,
      night_halt_charge REAL DEFAULT 600,
      parking_estimation_per_day REAL DEFAULT 300,
      toll_estimation_per_100km REAL DEFAULT 150,
      inter_state_permit_charge REAL DEFAULT 0,
      extra_km_charge REAL DEFAULT 25,
      pricing_mode TEXT DEFAULT 'configured',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      booking_ref TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      pickup_location TEXT NOT NULL,
      drop_location TEXT NOT NULL,
      intermediate_stops TEXT,
      departure_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      total_days INTEGER NOT NULL DEFAULT 1,
      passenger_count INTEGER NOT NULL,
      vehicle_id TEXT NOT NULL,
      vehicle_name TEXT NOT NULL,
      estimated_distance_km REAL,
      quotation_amount REAL,
      quotation_breakdown TEXT,
      special_requirements TEXT,
      status TEXT NOT NULL DEFAULT 'New Enquiry',
      admin_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default settings if not exists
  const settingsCount = db.query('SELECT COUNT(*) as count FROM company_settings').get() as { count: number };
  if (settingsCount.count === 0) {
    const insertSettings = db.prepare(`
      INSERT INTO company_settings (
        id, company_name, tagline, tagline_ta, phone, alternate_phone,
        whatsapp_number, email, address, address_ta, operating_districts_count,
        gst_number, registration_number, upi_id, working_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertSettings.run(
      'default',
      defaultCompanySettings.companyName,
      defaultCompanySettings.tagline,
      defaultCompanySettings.taglineTa,
      defaultCompanySettings.phone,
      defaultCompanySettings.alternatePhone,
      defaultCompanySettings.whatsappNumber,
      defaultCompanySettings.email,
      defaultCompanySettings.address,
      defaultCompanySettings.addressTa,
      defaultCompanySettings.operatingDistrictsCount,
      defaultCompanySettings.gstNumber,
      defaultCompanySettings.registrationNumber,
      defaultCompanySettings.upiId,
      defaultCompanySettings.workingHours
    );
  }

  // Seed default vehicles if not exists
  const vehicleCount = db.query('SELECT COUNT(*) as count FROM vehicles').get() as { count: number };
  if (vehicleCount.count === 0) {
    const insertVehicle = db.prepare(`
      INSERT INTO vehicles (
        id, name, tamil_name, model, capacity, suitable_group_min,
        suitable_group_max, image, ac_type, seating_type, amenities,
        amenities_ta, per_km_rate, min_km_per_day, driver_allowance_per_day,
        daily_rent, is_available, description, description_ta, luggage_capacity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const v of initialVehicles) {
      insertVehicle.run(
        v.id,
        v.name,
        v.tamilName,
        v.model,
        v.capacity,
        v.suitableGroupMin,
        v.suitableGroupMax,
        v.image,
        v.acType,
        v.seatingType,
        JSON.stringify(v.amenities),
        JSON.stringify(v.amenitiesTa),
        v.pricing.perKmRate,
        v.pricing.minKmPerDay,
        v.pricing.driverAllowancePerDay,
        v.pricing.dailyRent || null,
        v.isAvailable ? 1 : 0,
        v.description,
        v.descriptionTa,
        v.luggageCapacity
      );
    }
  }

  // Seed default destinations if not exists
  const destCount = db.query('SELECT COUNT(*) as count FROM destinations').get() as { count: number };
  if (destCount.count === 0) {
    const insertDest = db.prepare(`
      INSERT INTO destinations (
        id, slug, name, name_ta, district, category, image, gallery,
        short_description, short_description_ta, overview, overview_ta,
        highlights, highlights_ta, suggested_attractions, suggested_attractions_ta,
        suggested_duration, suggested_itinerary, distance_from_chennai,
        distance_from_madurai, distance_from_coimbatore, best_time_to_visit, is_popular
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of initialDestinations) {
      insertDest.run(
        d.id,
        d.slug,
        d.name,
        d.nameTa,
        d.district,
        d.category,
        d.image,
        JSON.stringify(d.gallery),
        d.shortDescription,
        d.shortDescriptionTa,
        d.overview,
        d.overviewTa,
        JSON.stringify(d.highlights),
        JSON.stringify(d.highlightsTa),
        JSON.stringify(d.suggestedAttractions),
        JSON.stringify(d.suggestedAttractionsTa),
        d.suggestedDuration,
        JSON.stringify(d.suggestedItinerary),
        d.distanceFromChennai,
        d.distanceFromMadurai,
        d.distanceFromCoimbatore,
        d.bestTimeToVisit,
        d.isPopular ? 1 : 0
      );
    }
  }

  // Seed default tour packages if not exists
  const pkgCount = db.query('SELECT COUNT(*) as count FROM tour_packages').get() as { count: number };
  if (pkgCount.count === 0) {
    const insertPkg = db.prepare(`
      INSERT INTO tour_packages (
        id, slug, title, title_ta, category, duration, duration_days,
        places_covered, places_covered_ta, image, description, description_ta,
        inclusions, exclusions, itinerary, suitable_vehicles, base_price_estimate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of initialTourPackages) {
      insertPkg.run(
        p.id,
        p.slug,
        p.title,
        p.titleTa,
        p.category,
        p.duration,
        p.durationDays,
        JSON.stringify(p.placesCovered),
        JSON.stringify(p.placesCoveredTa),
        p.image,
        p.description,
        p.descriptionTa,
        JSON.stringify(p.inclusions),
        JSON.stringify(p.exclusions),
        JSON.stringify(p.itinerary),
        JSON.stringify(p.suitableVehicles),
        p.basePriceEstimate || null
      );
    }
  }

  // Seed pricing rules
  const pricingCount = db.query('SELECT COUNT(*) as count FROM pricing_rules').get() as { count: number };
  if (pricingCount.count === 0) {
    const insertPricing = db.prepare(`
      INSERT INTO pricing_rules (
        id, per_km_rates, min_km_per_day, driver_allowance_per_day,
        night_halt_charge, parking_estimation_per_day, toll_estimation_per_100km,
        inter_state_permit_charge, extra_km_charge, pricing_mode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertPricing.run(
      'default',
      JSON.stringify(defaultPricingRule.perKmRates),
      defaultPricingRule.minKmPerDay,
      defaultPricingRule.driverAllowancePerDay,
      defaultPricingRule.nightHaltCharge,
      defaultPricingRule.parkingEstimationPerDay,
      defaultPricingRule.tollEstimationPer100Km,
      defaultPricingRule.interStatePermitCharge,
      defaultPricingRule.extraKmCharge,
      defaultPricingRule.pricingMode
    );
  }

  // Seed sample initial bookings if empty
  const bookingsCount = db.query('SELECT COUNT(*) as count FROM bookings').get() as { count: number };
  if (bookingsCount.count === 0) {
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        id, booking_ref, customer_name, customer_phone, customer_email,
        pickup_location, drop_location, intermediate_stops, departure_date,
        return_date, total_days, passenger_count, vehicle_id, vehicle_name,
        estimated_distance_km, quotation_amount, quotation_breakdown,
        special_requirements, status, admin_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBooking.run(
      'b-sample-1',
      'SKS-202610-1014',
      'Karthik Subramanian',
      '+91 98401 23456',
      'karthik.subramanian@example.com',
      'Chennai Central',
      'Ooty (Udhagamandalam)',
      JSON.stringify(['Salem', 'Coonoor']),
      '2026-10-27',
      '2026-10-29',
      3,
      16,
      'van-17',
      'SKS Traveller 17 — Deluxe',
      1100,
      30550,
      JSON.stringify({
        totalKm: 1100,
        billedKm: 1100,
        ratePerKm: 23,
        baseKmCharge: 25300,
        driverAllowance: 1500,
        nightHaltCharge: 1200,
        tollParkingEstimate: 2550,
        otherCharges: 0,
        estimatedTotal: 30550,
        isConfirmedPrice: true,
        notes: 'Confirmed booking for family vacation.',
      }),
      'Senior citizens onboard; request careful driving on Kallatti ghats.',
      'Confirmed',
      'Assigned Senior Chauffeur Murugan. Vehicle inspected.'
    );

    insertBooking.run(
      'b-sample-2',
      'SKS-202610-2058',
      'Anitha Raman',
      '+91 94432 98765',
      'anitha.raman@school.edu.in',
      'Trichy Central',
      'Madurai & Rameswaram',
      JSON.stringify(['Dhanushkodi']),
      '2026-11-02',
      '2026-11-04',
      3,
      20,
      'van-21',
      'SKS Grand Tourer 21 — Long Haul Coach',
      850,
      26000,
      JSON.stringify({
        totalKm: 850,
        billedKm: 850,
        ratePerKm: 27,
        baseKmCharge: 22950,
        driverAllowance: 1800,
        nightHaltCharge: 1200,
        tollParkingEstimate: 2175,
        otherCharges: 0,
        estimatedTotal: 28125,
        isConfirmedPrice: false,
        notes: 'College faculty tour quotation.',
      }),
      'College faculty excursion. Need microphone & sound system working.',
      'Awaiting Confirmation',
      'Quotation sent via WhatsApp and Email. Customer reviewing with college principal.'
    );

    insertBooking.run(
      'b-sample-3',
      'SKS-202610-3190',
      'Dr. Venkatesh Nathan',
      '+91 98840 55443',
      'dr.venkat@apollo.org',
      'Coimbatore Airport',
      'Kodaikanal',
      JSON.stringify(['Palani Murugan Temple']),
      '2026-11-10',
      '2026-11-12',
      3,
      18,
      'van-18',
      'SKS Urbania 18 — Premium Luxury',
      550,
      25400,
      null,
      'Doctors weekend conference. Need luxury European captain seats.',
      'New Enquiry',
      'Initial enquiry received via website trip planner.'
    );
  }

  // Seed default admin user (username: admin, password: password123 or configurable)
  const adminCount = db.query('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminCount.count === 0) {
    const insertAdmin = db.prepare(`
      INSERT INTO admin_users (id, username, password_hash, name, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    // Simple SHA-256 or bcrypt hash simulation for demo, customizable
    insertAdmin.run(
      'admin-1',
      'admin',
      'admin123', // Initial credential
      'SKS Operations Lead',
      'superadmin'
    );
  }
}
