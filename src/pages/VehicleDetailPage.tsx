import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Luggage,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { Vehicle } from '../types';
import { api } from '../services/api';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { getTodayDateString, getTomorrowDateString, formatDate } from '../utils/dateUtils';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [checkDepDate, setCheckDepDate] = useState(getTodayDateString());
  const [checkRetDate, setCheckRetDate] = useState(getTomorrowDateString());
  const [availabilityResult, setAvailabilityResult] = useState<{
    checked: boolean;
    isAvailable: boolean;
    message: string;
  }>({ checked: false, isAvailable: true, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const v = await api.getVehicleById(id);
          if (v) setVehicle(v);
        }
      } catch (err) {
        console.error('Failed to load vehicle details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    const res = await api.checkVehicleAvailability(vehicle.id, checkDepDate, checkRetDate);
    setAvailabilityResult({
      checked: true,
      isAvailable: res.isAvailable,
      message: res.message,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-10 h-10 border-4 border-[#102A43] border-t-[#F28C28] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] px-4 text-center">
        <h2 className="text-2xl font-bold text-[#102A43]">Vehicle Listing Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested vehicle does not exist in our current fleet.
        </p>
        <Link
          to="/vehicles"
          className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] text-sm"
        >
          Back to Vehicles Fleet
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <SEO
        title={`${vehicle.name} (${vehicle.capacity} Passengers) — SKS Travels`}
        description={`${vehicle.name}: ${vehicle.description} Configured with ${vehicle.acType} and ${vehicle.seatingType}.`}
        image={vehicle.image}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            to="/vehicles"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#102A43] hover:text-[#F28C28]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Fleet Vehicles</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Photos & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Photograph with Capacity Overlay */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
              <div className="relative h-80 sm:h-96 bg-slate-900">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Capacity Badge */}
                <div className="absolute top-6 left-6 bg-[#102A43] text-white px-4 py-2 rounded-2xl text-sm font-extrabold shadow-lg border border-white/20 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#F28C28]" />
                  <span>{vehicle.capacity} Passenger Capacity</span>
                </div>

                {/* Overlaid Title */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    {language === 'ta' && vehicle.tamilName ? vehicle.tamilName : vehicle.name}
                  </h1>
                  <p className="text-sm text-slate-300 font-medium mt-1">{vehicle.model}</p>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-100 bg-slate-50/50">
                <div>
                  <span className="text-slate-400 block font-semibold">Seating Style</span>
                  <strong className="text-slate-800 text-sm">{vehicle.seatingType.split(' ')[0]} Luxury</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">AC Configuration</span>
                  <strong className="text-slate-800 text-sm">{vehicle.acType.split(' ')[0]} Chilled</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Suitable Group</span>
                  <strong className="text-slate-800 text-sm">
                    {vehicle.suitableGroupMin} - {vehicle.suitableGroupMax} Guests
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Luggage Boot</span>
                  <strong className="text-slate-800 text-sm">{vehicle.luggageCapacity.split('+')[0]}</strong>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#102A43]">Vehicle Overview</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === 'ta' && vehicle.descriptionTa
                    ? vehicle.descriptionTa
                    : vehicle.description}
                </p>
              </div>
            </div>

            {/* Amenities & Interior Features */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-lg font-bold text-[#102A43]">Equipped Amenities & Safety Package</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(language === 'ta' && vehicle.amenitiesTa ? vehicle.amenitiesTa : vehicle.amenities).map(
                  (amenity, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Pricing Structure Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-lg font-bold text-[#102A43]">Rental Pricing Rules (Transparent Engine)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                  <span className="text-slate-500 font-semibold block">Per-Kilometre Rate:</span>
                  <div className="text-xl font-extrabold text-[#102A43] mt-1">
                    ₹{vehicle.pricing.perKmRate} <span className="text-xs font-normal text-slate-500">/ km</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block">Min. Billable Distance:</span>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {vehicle.pricing.minKmPerDay} km / day
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block">Driver Day Allowance:</span>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    ₹{vehicle.pricing.driverAllowancePerDay} / day
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                * Trip cost is calculated using actual or minimum billable kilometres (whichever is higher), plus driver allowance, night halt (if applicable), and tolls/parking. No double-counting.
              </p>
            </div>
          </div>

          {/* Right Column: Live Date Availability Checker & Booking Action */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Live Availability Checker Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block mb-1">
                  Availability Check
                </span>
                <h3 className="text-xl font-extrabold text-[#102A43]">
                  Check Travel Dates
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Our system validates against existing confirmed bookings in real time.
                </p>
              </div>

              <form onSubmit={handleCheckAvailability} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={checkDepDate}
                    onChange={(e) => setCheckDepDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    min={checkDepDate}
                    value={checkRetDate}
                    onChange={(e) => setCheckRetDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-[#102A43] bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Verify Date Availability
                </button>
              </form>

              {/* Result Notice */}
              {availabilityResult.checked && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start space-x-2.5 ${
                    availabilityResult.isAvailable
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {availabilityResult.isAvailable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  )}
                  <span>{availabilityResult.message}</span>
                </div>
              )}

              {/* Book Now Primary Button */}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/plan-your-trip?vehicleId=${vehicle.id}&departureDate=${checkDepDate}&returnDate=${checkRetDate}&passengers=${vehicle.capacity}`
                  )
                }
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-lg flex items-center justify-center space-x-2 text-sm transition-all"
              >
                <span>Request Booking for {vehicle.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-slate-100 text-center">
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello SKS Travels, I would like to check availability and quotation for ${vehicle.name} (${vehicle.capacity} passengers).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
