export type Language = 'en' | 'ta';

export interface Vehicle {
  id: string;
  name: string;
  tamilName: string;
  model: string;
  capacity: number; // 17, 18, 19, 21, 22
  suitableGroupMin: number;
  suitableGroupMax: number;
  image: string;
  acType: string;
  seatingType: string;
  amenities: string[];
  amenitiesTa: string[];
  pricing: {
    perKmRate: number;
    minKmPerDay: number;
    driverAllowancePerDay: number;
    dailyRent?: number;
  };
  isAvailable: boolean;
  description: string;
  descriptionTa: string;
  luggageCapacity: string;
}

export type DestinationCategory =
  | 'hill-stations'
  | 'temples'
  | 'beaches'
  | 'waterfalls'
  | 'historical'
  | 'family'
  | 'weekend'
  | 'heritage';

export interface DestinationItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  nameTa: string;
  district: string;
  category: DestinationCategory;
  image: string;
  gallery: string[];
  shortDescription: string;
  shortDescriptionTa: string;
  overview: string;
  overviewTa: string;
  highlights: string[];
  highlightsTa: string[];
  suggestedAttractions: string[];
  suggestedAttractionsTa: string[];
  suggestedDuration: string;
  suggestedItinerary: DestinationItineraryDay[];
  distanceFromChennai: number;
  distanceFromMadurai: number;
  distanceFromCoimbatore: number;
  bestTimeToVisit: string;
  isPopular: boolean;
}

export interface District {
  id: string;
  name: string;
  nameTa: string;
  headquarters: string;
  zone: 'North' | 'South' | 'West' | 'Central';
  topAttractions: string[];
  majorPickups: string[];
}

export type PackageCategory =
  | 'one-day'
  | 'weekend'
  | 'hill-station'
  | 'pilgrimage'
  | 'family'
  | 'multi-day'
  | 'corporate'
  | 'college';

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  titleTa: string;
  category: PackageCategory;
  duration: string;
  durationDays: number;
  placesCovered: string[];
  placesCoveredTa: string[];
  image: string;
  description: string;
  descriptionTa: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; details: string }[];
  suitableVehicles: string[];
  basePriceEstimate?: number;
}

export interface PricingRule {
  perKmRates: Record<string, number>; // vehicleId -> rate in INR
  minKmPerDay: number; // e.g. 250
  driverAllowancePerDay: number; // e.g. 500
  nightHaltCharge: number; // e.g. 600
  parkingEstimationPerDay: number; // e.g. 300
  tollEstimationPer100Km: number; // e.g. 150
  interStatePermitCharge: number; // e.g. 1500
  extraKmCharge: number;
  pricingMode: 'configured' | 'quote-only'; // if quote-only, hide estimates and display "Request a Quote"
}

export type BookingStatus =
  | 'New Enquiry'
  | 'Quotation Sent'
  | 'Awaiting Confirmation'
  | 'Confirmed'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface QuotationBreakdown {
  totalKm: number;
  billedKm: number;
  ratePerKm: number;
  baseKmCharge: number;
  driverAllowance: number;
  nightHaltCharge: number;
  tollParkingEstimate: number;
  otherCharges: number;
  estimatedTotal: number;
  isConfirmedPrice: boolean;
  notes: string;
}

export interface Booking {
  id: string;
  bookingRef: string; // SKS-202610-XXXX
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: string;
  dropLocation: string;
  intermediateStops?: string[];
  departureDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  totalDays: number;
  passengerCount: number;
  vehicleId: string;
  vehicleName: string;
  estimatedDistanceKm: number;
  quotationAmount?: number;
  quotationBreakdown?: QuotationBreakdown;
  specialRequirements?: string;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  taglineTa: string;
  phone: string;
  alternatePhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  addressTa: string;
  operatingDistrictsCount: number;
  gstNumber: string;
  registrationNumber: string;
  upiId: string;
  workingHours: string;
}
