import React, { useState, useEffect } from 'react';
import { Calculator, Save, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { PricingRule } from '../../types';
import { api } from '../../services/api';
import { SEO } from '../../components/common/SEO';

export const AdminPricingPage: React.FC = () => {
  const [pricingRule, setPricingRule] = useState<PricingRule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPricingRule();
        setPricingRule(data);
      } catch (err) {
        console.error('Failed to load pricing:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPricing();
  }, []);

  const handleRateChange = (vehicleId: string, rate: number) => {
    if (!pricingRule) return;
    setPricingRule({
      ...pricingRule,
      perKmRates: {
        ...pricingRule.perKmRates,
        [vehicleId]: rate,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricingRule) return;
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const updated = await api.updatePricingRule(pricingRule);
      setPricingRule(updated);
      setSuccessMsg('Pricing rules and quotation parameters saved successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update pricing rules');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !pricingRule) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#102A43] border-t-[#F28C28] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <SEO title="Pricing Rules & Calculator Engine — SKS Admin Console" />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
          Quotation Engine & Pricing Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Adjust distance thresholds, driver daily allowance, night-halt rates, and vehicle rates without double-counting.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Pricing Mode Toggle Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#102A43]">Live Quotation Mode</h2>
              <p className="text-xs text-slate-500">
                Choose whether the customer website displays estimated prices or "Request a Quote".
              </p>
            </div>
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPricingRule({ ...pricingRule, pricingMode: 'configured' })}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pricingRule.pricingMode === 'configured'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Configured Engine (Live Estimates)
              </button>
              <button
                type="button"
                onClick={() => setPricingRule({ ...pricingRule, pricingMode: 'quote-only' })}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  pricingRule.pricingMode === 'quote-only'
                    ? 'bg-[#F28C28] text-white shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Quote-Only Mode (Hide Numbers)
              </button>
            </div>
          </div>
        </div>

        {/* Per-Km Rates for 5 Vans */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-[#102A43]">Per-Kilometre Rates by Vehicle</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Van 1 (17 Seats)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  value={pricingRule.perKmRates['van-17'] || 23}
                  onChange={(e) => handleRateChange('van-17', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Van 2 (18 Seats)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  value={pricingRule.perKmRates['van-18'] || 26}
                  onChange={(e) => handleRateChange('van-18', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Van 3 (19 Seats)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  value={pricingRule.perKmRates['van-19'] || 25}
                  onChange={(e) => handleRateChange('van-19', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Van 4 (21 Seats)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  value={pricingRule.perKmRates['van-21'] || 27}
                  onChange={(e) => handleRateChange('van-21', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Van 5 (22 Seats)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  value={pricingRule.perKmRates['van-22'] || 29}
                  onChange={(e) => handleRateChange('van-22', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Travel Rule Parameters */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-[#102A43]">General Allowances & Fee Parameters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Min. Billable Km per Day
              </label>
              <input
                type="number"
                min="100"
                value={pricingRule.minKmPerDay}
                onChange={(e) =>
                  setPricingRule({ ...pricingRule, minKmPerDay: parseFloat(e.target.value) || 250 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Standard TN threshold: 250 km</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Driver Day Allowance (₹ / day)
              </label>
              <input
                type="number"
                min="0"
                value={pricingRule.driverAllowancePerDay}
                onChange={(e) =>
                  setPricingRule({
                    ...pricingRule,
                    driverAllowancePerDay: parseFloat(e.target.value) || 500,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Food & daily allowance</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Night-Halt Charge (₹ / night)
              </label>
              <input
                type="number"
                min="0"
                value={pricingRule.nightHaltCharge}
                onChange={(e) =>
                  setPricingRule({ ...pricingRule, nightHaltCharge: parseFloat(e.target.value) || 600 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Overnight outstation rest</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs pt-2">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Toll Estimation (₹ per 100 km)
              </label>
              <input
                type="number"
                min="0"
                value={pricingRule.tollEstimationPer100Km}
                onChange={(e) =>
                  setPricingRule({
                    ...pricingRule,
                    tollEstimationPer100Km: parseFloat(e.target.value) || 150,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">National & state highway toll formula</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Parking & Local Entry Estimate (₹ / day)
              </label>
              <input
                type="number"
                min="0"
                value={pricingRule.parkingEstimationPerDay}
                onChange={(e) =>
                  setPricingRule({
                    ...pricingRule,
                    parkingEstimationPerDay: parseFloat(e.target.value) || 300,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Temple & hill station parking</span>
            </div>
          </div>
        </div>

        {/* Calculation Formula Verification Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
          <div>
            <strong className="block font-bold">Calculation Integrity:</strong>
            Estimated Trip Total = (Max(Actual Distance, Min Km/Day x Days) x Per-Km Rate) + (Days x Driver Allowance) + ((Days - 1) x Night Halt) + Tolls & Parking. Double-counting is systematically prevented.
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3.5 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-lg flex items-center space-x-2 text-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Parameters...' : 'Save Pricing Parameters'}</span>
        </button>
      </form>
    </div>
  );
};
