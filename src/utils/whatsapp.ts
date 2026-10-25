export interface WhatsAppTripParams {
  bookingRef?: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  intermediateStops?: string[];
  departureDate: string;
  returnDate: string;
  totalDays: number;
  passengerCount: number;
  vehicleName: string;
  estimatedKm?: number;
  estimatedTotal?: number;
  specialRequirements?: string;
  businessWhatsAppNumber: string;
}

export function createWhatsAppUrl(params: WhatsAppTripParams): string {
  // Clean phone number (remove spaces, plus, hyphens for wa.me)
  const cleanNumber = params.businessWhatsAppNumber.replace(/[^0-9]/g, '');

  const stopsText = params.intermediateStops && params.intermediateStops.length > 0
    ? `\n*Intermediate Stops:* ${params.intermediateStops.join(' ➔ ')}`
    : '';

  const priceText = params.estimatedTotal
    ? `₹${params.estimatedTotal.toLocaleString('en-IN')} (Estimated)`
    : 'Requesting Official Quotation';

  const refText = params.bookingRef ? `\n*Reference:* ${params.bookingRef}` : '';

  const message = `*Trip Enquiry — SKS Travels*${refText}
━━━━━━━━━━━━━━━━━━━
*Name:* ${params.customerName}
*Phone:* ${params.customerPhone}
*Pickup:* ${params.pickupLocation}
*Destination:* ${params.dropLocation}${stopsText}
*Departure:* ${params.departureDate}
*Return:* ${params.returnDate} (${params.totalDays} Day${params.totalDays > 1 ? 's' : ''})
*Passengers:* ${params.passengerCount} passengers
*Vehicle:* ${params.vehicleName}
${params.estimatedKm ? `*Est. Distance:* ~${params.estimatedKm} km\n` : ''}*Quotation:* ${priceText}
${params.specialRequirements ? `*Special Notes:* ${params.specialRequirements}\n` : ''}━━━━━━━━━━━━━━━━━━━
_Sent via SKS Travels Website Trip Planner_`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
