import {
  Vehicle,
  Destination,
  TourPackage,
  Booking,
  PricingRule,
  CompanySettings,
  QuotationBreakdown,
  BookingStatus,
} from '../types';
import { initialVehicles } from '../data/vehicles';
import { initialDestinations } from '../data/destinations';
import { initialTourPackages } from '../data/packages';
import { defaultPricingRule } from '../data/defaultPricing';
import { defaultCompanySettings } from '../data/defaultSettings';
import { areDateRangesOverlapping } from '../utils/dateUtils';
import { calculateQuotation } from '../utils/pricingCalculator';

// Local storage keys for resilient persistence
const STORAGE_KEYS = {
  VEHICLES: 'sks_vehicles',
  DESTINATIONS: 'sks_destinations',
  PACKAGES: 'sks_packages',
  PRICING: 'sks_pricing',
  SETTINGS: 'sks_settings',
  BOOKINGS: 'sks_bookings',
};

// Seed initial sample bookings for realistic testing and calendar visualization
const initialSampleBookings: Booking[] = [
  {
    id: 'b-sample-1',
    bookingRef: 'SKS-202610-1014',
    customerName: 'Karthik Subramanian',
    customerPhone: '+91 98401 23456',
    customerEmail: 'karthik.subramanian@example.com',
    pickupLocation: 'Chennai Central',
    dropLocation: 'Ooty (Udhagamandalam)',
    intermediateStops: ['Salem', 'Coonoor'],
    departureDate: '2026-10-27',
    returnDate: '2026-10-29',
    totalDays: 3,
    passengerCount: 16,
    vehicleId: 'van-17',
    vehicleName: 'SKS Traveller 17 — Deluxe',
    estimatedDistanceKm: 1100,
    quotationAmount: 28500,
    quotationBreakdown: {
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
    },
    specialRequirements: 'Senior citizens onboard; request careful driving on Kallatti ghats.',
    status: 'Confirmed',
    adminNotes: 'Assigned Senior Chauffeur Murugan. Vehicle serviced on 24th Oct.',
    createdAt: '2026-10-24T10:30:00Z',
    updatedAt: '2026-10-24T14:15:00Z',
  },
  {
    id: 'b-sample-2',
    bookingRef: 'SKS-202610-2058',
    customerName: 'Anitha Raman',
    customerPhone: '+91 94432 98765',
    customerEmail: 'anitha.raman@school.edu.in',
    pickupLocation: 'Trichy Central',
    dropLocation: 'Madurai & Rameswaram',
    intermediateStops: ['Dhanushkodi'],
    departureDate: '2026-11-02',
    returnDate: '2026-11-04',
    totalDays: 3,
    passengerCount: 20,
    vehicleId: 'van-21',
    vehicleName: 'SKS Grand Tourer 21 — Long Haul Coach',
    estimatedDistanceKm: 850,
    quotationAmount: 26000,
    status: 'Awaiting Confirmation',
    specialRequirements: 'College faculty excursion. Need microphone & sound system working.',
    adminNotes: 'Quotation sent via WhatsApp and Email. Customer reviewing with college principal.',
    createdAt: '2026-10-25T09:00:00Z',
    updatedAt: '2026-10-25T11:20:00Z',
  },
  {
    id: 'b-sample-3',
    bookingRef: 'SKS-202610-3190',
    customerName: 'Dr. Venkatesh Nathan',
    customerPhone: '+91 98840 55443',
    customerEmail: 'dr.venkat@apollo.org',
    pickupLocation: 'Coimbatore Airport',
    dropLocation: 'Kodaikanal',
    intermediateStops: ['Palani Murugan Temple'],
    departureDate: '2026-11-10',
    returnDate: '2026-11-12',
    totalDays: 3,
    passengerCount: 18,
    vehicleId: 'van-18',
    vehicleName: 'SKS Urbania 18 — Premium Luxury',
    estimatedDistanceKm: 550,
    quotationAmount: 25400,
    status: 'New Enquiry',
    specialRequirements: 'Doctors weekend conference. Need luxury European captain seats.',
    createdAt: '2026-10-25T14:45:00Z',
    updatedAt: '2026-10-25T14:45:00Z',
  },
];

// Helper to get or initialize local storage data
function getLocalItem<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function setLocalItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Failed to write to localStorage for key ${key}:`, err);
  }
}

function clearStoredAdminSession(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('sks_admin_token');
    localStorage.removeItem('sks_admin_user');
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sks:admin-session-expired'));
  }
}

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('sks_admin_token') : null;
  if (token) headers.set('Authorization', 'Bearer ' + token);

  const response = await fetch(input, { ...init, headers, cache: 'no-store' });
  if (response.status === 401) clearStoredAdminSession();
  return response;
}

export function requireAdminSuccess(response: Response): void {
  if (!response.ok) {
    const message = response.status === 401
      ? 'Administrator session expired. Please sign in again.'
      : 'Administrator request failed (' + response.status + ').';
    throw new Error(message);
  }
}

export const api = {
  // VEHICLES
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await fetch('/api/vehicles');
      if (res.ok) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.VEHICLES, data);
        return data;
      }
    } catch {
      // API unavailable, fallback
    }
    return getLocalItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, initialVehicles);
  },

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    const vehicles = await this.getVehicles();
    return vehicles.find((v) => v.id === id);
  },

  // Check vehicle availability for date range against confirmed/in-progress trips
  async checkVehicleAvailability(
    vehicleId: string,
    departureDate: string,
    returnDate: string,
    excludeBookingId?: string
  ): Promise<{ isAvailable: boolean; conflictingBooking?: Booking; message: string }> {
    try {
      const params = new URLSearchParams({
        vehicleId,
        departureDate,
        returnDate,
      });
      if (excludeBookingId) params.append('excludeBookingId', excludeBookingId);

      const res = await fetch(`/api/vehicles/check-availability?${params}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local evaluation
    }

    const bookings = await this.getBookings();
    // Conflicting booking is any trip that is 'Confirmed' or 'In Progress' for the same vehicle
    const conflict = bookings.find((b) => {
      if (b.id === excludeBookingId) return false;
      if (b.vehicleId !== vehicleId) return false;
      if (b.status !== 'Confirmed' && b.status !== 'In Progress') return false;
      return areDateRangesOverlapping(departureDate, returnDate, b.departureDate, b.returnDate);
    });

    if (conflict) {
      return {
        isAvailable: false,
        conflictingBooking: conflict,
        message: `Vehicle is booked for confirmed travel between ${conflict.departureDate} and ${conflict.returnDate}.`,
      };
    }

    return {
      isAvailable: true,
      message: 'Vehicle is currently available for selected travel dates.',
    };
  },

  // DESTINATIONS
  async getDestinations(): Promise<Destination[]> {
    try {
      const res = await fetch('/api/destinations');
      if (res.ok) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.DESTINATIONS, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<Destination[]>(STORAGE_KEYS.DESTINATIONS, initialDestinations);
  },

  async getDestinationBySlug(slug: string): Promise<Destination | undefined> {
    const destinations = await this.getDestinations();
    return destinations.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
  },

  // PACKAGES
  async getPackages(): Promise<TourPackage[]> {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.PACKAGES, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<TourPackage[]>(STORAGE_KEYS.PACKAGES, initialTourPackages);
  },

  async getPackageBySlug(slug: string): Promise<TourPackage | undefined> {
    const pkgs = await this.getPackages();
    return pkgs.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  },

  // PRICING RULES
  async getPricingRule(): Promise<PricingRule> {
    try {
      const res = await fetch('/api/pricing');
      if (res.ok) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.PRICING, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<PricingRule>(STORAGE_KEYS.PRICING, defaultPricingRule);
  },

  async updatePricingRule(rule: PricingRule): Promise<PricingRule> {
    const res = await adminFetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    requireAdminSuccess(res);
    const saved = await res.json();
    setLocalItem(STORAGE_KEYS.PRICING, saved);
    return saved;
  },

  // CALCULATE PRICING
  async calculateEstimate(
    vehicleId: string,
    distanceKm: number,
    totalDays: number
  ): Promise<QuotationBreakdown | null> {
    const pricingRule = await this.getPricingRule();
    return calculateQuotation({
      vehicleId,
      distanceKm,
      totalDays,
      pricingRule,
    });
  },

  // BOOKINGS & ENQUIRIES
  async getBookings(): Promise<Booking[]> {
    const res = await adminFetch('/api/admin/bookings');
    requireAdminSuccess(res);
    const data = await res.json();
    setLocalItem(STORAGE_KEYS.BOOKINGS, data);
    return data;
  },

  async getBookingByRef(ref: string): Promise<Booking | undefined> {
    const res = await fetch('/api/bookings/track/' + encodeURIComponent(ref.trim()), { cache: 'no-store' });
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error('Booking lookup failed (' + res.status + ').');
    return await res.json();
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    // 1. Validate dates
    if (booking.returnDate < booking.departureDate) {
      throw new Error('Return date cannot be earlier than departure date.');
    }

    // 2. Server-side / local double booking check for confirmed trips
    if (booking.status === 'Confirmed') {
      const availability = await this.checkVehicleAvailability(
        booking.vehicleId,
        booking.departureDate,
        booking.returnDate
      );
      if (!availability.isAvailable) {
        throw new Error(availability.message);
      }
    }

    const newBooking: Booking = {
      ...booking,
      id: 'b-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialSampleBookings);
        setLocalItem(STORAGE_KEYS.BOOKINGS, [saved, ...current]);
        return saved;
      }
    } catch {
      // fallback
    }

    const current = getLocalItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialSampleBookings);
    const updated = [newBooking, ...current];
    setLocalItem(STORAGE_KEYS.BOOKINGS, updated);
    return newBooking;
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    // Check if status is transitioning to Confirmed, verify no collision.
    if (updates.status === 'Confirmed') {
      const current = await this.getBookings();
      const existing = current.find((b) => b.id === id);
      if (existing) {
        const vehicleId = updates.vehicleId || existing.vehicleId;
        const departureDate = updates.departureDate || existing.departureDate;
        const returnDate = updates.returnDate || existing.returnDate;
        const check = await this.checkVehicleAvailability(vehicleId, departureDate, returnDate, id);
        if (!check.isAvailable) {
          throw new Error('Cannot confirm booking: ' + check.message);
        }
      }
    }

    const res = await adminFetch('/api/admin/bookings/' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    requireAdminSuccess(res);
    await res.json();
    const bookings = await this.getBookings();
    const updated = bookings.find((b) => b.id === id);
    if (!updated) throw new Error('Booking not found after update.');
    setLocalItem(STORAGE_KEYS.BOOKINGS, bookings);
    return updated;
  },

  async updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
    const res = await adminFetch('/api/admin/vehicles/' + encodeURIComponent(vehicle.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    requireAdminSuccess(res);
    const saved = await res.json();
    const vehicles = await this.getVehicles();
    setLocalItem(
      STORAGE_KEYS.VEHICLES,
      vehicles.map((item) => (item.id === vehicle.id ? saved : item))
    );
    return saved;
  },

  // Export Bookings CSV
  async exportBookingsCsv(): Promise<string> {
    const bookings = await this.getBookings();
    const headers = [
      'Booking Reference',
      'Customer Name',
      'Mobile Phone',
      'Email',
      'Pickup Location',
      'Destination',
      'Intermediate Stops',
      'Departure Date',
      'Return Date',
      'Total Days',
      'Passengers',
      'Vehicle ID',
      'Vehicle Name',
      'Est Km',
      'Quotation Amount',
      'Status',
      'Admin Notes',
      'Created At',
    ];

    const rows = bookings.map((b) => [
      `"${b.bookingRef}"`,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.customerEmail || ''}"`,
      `"${b.pickupLocation}"`,
      `"${b.dropLocation}"`,
      `"${(b.intermediateStops || []).join(', ')}"`,
      `"${b.departureDate}"`,
      `"${b.returnDate}"`,
      b.totalDays,
      b.passengerCount,
      `"${b.vehicleId}"`,
      `"${b.vehicleName}"`,
      b.estimatedDistanceKm,
      b.quotationAmount || 'Quote Requested',
      `"${b.status}"`,
      `"${(b.adminNotes || '').replace(/"/g, '""')}"`,
      `"${b.createdAt}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
