import { PricingRule, QuotationBreakdown } from '../types';

export interface PricingParams {
  vehicleId: string;
  distanceKm: number;
  totalDays: number;
  pricingRule: PricingRule;
}

export function calculateQuotation(params: PricingParams): QuotationBreakdown | null {
  const { vehicleId, distanceKm, totalDays, pricingRule } = params;

  // If pricing is in quote-only mode or rate not set, return null or quote-only breakdown
  const ratePerKm = pricingRule.perKmRates[vehicleId];
  if (!ratePerKm || pricingRule.pricingMode === 'quote-only') {
    return null;
  }

  const days = Math.max(1, totalDays);
  // Calculate minimum billable kilometres for the number of days
  const minBillableKm = days * (pricingRule.minKmPerDay || 250);
  const billedKm = Math.max(distanceKm, minBillableKm);

  // Distance / Base KM charge
  const baseKmCharge = Math.round(billedKm * ratePerKm);

  // Driver beta / day allowance
  const driverAllowance = Math.round(days * (pricingRule.driverAllowancePerDay || 500));

  // Night halt charges (applies for multi-day trips overnight, i.e., days - 1 nights)
  const nightHaltNights = Math.max(0, days - 1);
  const nightHaltCharge = Math.round(nightHaltNights * (pricingRule.nightHaltCharge || 600));

  // Estimated tolls and parking (no double counting)
  const estimatedToll = Math.round((billedKm / 100) * (pricingRule.tollEstimationPer100Km || 150));
  const estimatedParking = Math.round(days * (pricingRule.parkingEstimationPerDay || 300));
  const tollParkingEstimate = estimatedToll + estimatedParking;

  // Permits or other applicable charges
  const otherCharges = pricingRule.interStatePermitCharge || 0;

  // Total estimate
  const estimatedTotal = baseKmCharge + driverAllowance + nightHaltCharge + tollParkingEstimate + otherCharges;

  return {
    totalKm: distanceKm,
    billedKm,
    ratePerKm,
    baseKmCharge,
    driverAllowance,
    nightHaltCharge,
    tollParkingEstimate,
    otherCharges,
    estimatedTotal,
    isConfirmedPrice: false, // Initial calculation is always an estimate until an admin confirms
    notes: billedKm > distanceKm
      ? `Applied minimum billable distance of ${minBillableKm} km (${pricingRule.minKmPerDay} km/day x ${days} days).`
      : `Calculated on actual route distance of ${distanceKm} km.`,
  };
}
