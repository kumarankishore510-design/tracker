import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getTodayDateString, getTomorrowDateString } from '../../utils/dateUtils';
import { tamilNaduDistricts } from '../../data/districts';

export const HeroSection: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState('Chennai');
  const [destination, setDestination] = useState('Ooty (Udhagamandalam)');
  const [departureDate, setDepartureDate] = useState(getTodayDateString());
  const [returnDate, setReturnDate] = useState(getTomorrowDateString());
  const [passengers, setPassengers] = useState(18);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      pickup,
      destination,
      departureDate,
      returnDate,
      passengers: passengers.toString(),
    });
    navigate(`/plan-your-trip?${query.toString()}`);
  };

  return (
    <div className="relative bg-[#102A43] overflow-hidden">
      {/* Background Scenic Road Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=85"
          alt="Tourist van travelling on scenic South Indian road"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102A43] via-[#102A43]/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-transparent to-black/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Headline & Brand Value */}
          <div className="lg:col-span-7 space-y-6 text-white">
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>{t('hero.tagline')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
              {t('hero.headline')}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
              {t('hero.subheading')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/plan-your-trip')}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <Compass className="w-5 h-5" />
                <span>{t('hero.planTripBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/destinations')}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center space-x-2"
              >
                <span>{t('hero.exploreBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fleet badges below CTA */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>5 Vans: 17, 18, 19, 21 & 22 Seats</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#F28C28]" />
                <span>All 38 Districts Covered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Direct WhatsApp Enquiry</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Quick Trip Enquiry Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-[#172B4D]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-[#102A43]">
                    {t('form.quickTitle')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your journey details to check available van capacities.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#F28C28]">
                  <Compass className="w-5 h-5" />
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Pickup Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('form.pickup')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#F28C28] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder={t('form.pickupPlaceholder')}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:border-transparent bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('form.destination')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#102A43] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder={t('form.destPlaceholder')}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:border-transparent bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Travel Dates: Departure and Return */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('form.departure')}
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="date"
                        min={getTodayDateString()}
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        required
                        className="w-full pl-9 pr-2 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('form.return')}
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="date"
                        min={departureDate}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                        className="w-full pl-9 pr-2 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Number of Passengers */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('form.passengers')}
                    </label>
                    <span className="text-xs font-extrabold text-[#F28C28] bg-orange-50 px-2 py-0.5 rounded">
                      {passengers} Passengers
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3" />
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                    >
                      <option value="12">10 - 12 Passengers (17-Seater Deluxe)</option>
                      <option value="16">13 - 17 Passengers (17-Seater Deluxe)</option>
                      <option value="18">18 Passengers (18-Seater Luxury Urbania)</option>
                      <option value="19">19 Passengers (19-Seater Executive)</option>
                      <option value="21">20 - 21 Passengers (21-Seater Grand Coach)</option>
                      <option value="22">22 Passengers (22-Seater Maxi Coach)</option>
                    </select>
                  </div>
                </div>

                {/* Search Available Vans Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm mt-2"
                >
                  <Search className="w-4 h-4 text-[#F28C28]" />
                  <span>{t('form.searchVans')}</span>
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center text-[11px] text-slate-500 space-x-1">
                <span>⚡ Instant availability check across our 5 fleet vans</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
