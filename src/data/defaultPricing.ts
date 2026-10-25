import { PricingRule } from '../types';

export const defaultPricingRule: PricingRule = {
  perKmRates: {
    'van-17': 23,
    'van-18': 26,
    'van-19': 25,
    'van-21': 27,
    'van-22': 29,
  },
  minKmPerDay: 250,
  driverAllowancePerDay: 500,
  nightHaltCharge: 600,
  parkingEstimationPerDay: 300,
  tollEstimationPer100Km: 150,
  interStatePermitCharge: 0, // within Tamil Nadu 38 districts
  extraKmCharge: 25,
  pricingMode: 'configured', // 'configured' | 'quote-only'
};
