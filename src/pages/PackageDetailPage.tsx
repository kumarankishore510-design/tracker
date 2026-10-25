import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  ArrowRight,
  ChevronLeft,
  Bus,
  ShieldCheck,
} from 'lucide-react';
import { TourPackage, Vehicle } from '../types';
import { api } from '../services/api';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

export const PackageDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true);
        if (slug) {
          const [pkg, vList] = await Promise.all([
            api.getPackageBySlug(slug),
            api.getVehicles(),
          ]);
          if (pkg) setTourPackage(pkg);
          setVehicles(vList);
        }
      } catch (err) {
        console.error('Failed to load package details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-10 h-10 border-4 border-[#102A43] border-t-[#F28C28] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tourPackage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] px-4 text-center">
        <h2 className="text-2xl font-bold text-[#102A43]">Tour Package Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested tour package could not be located.
        </p>
        <Link
          to="/packages"
          className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] text-sm"
        >
          Back to Tour Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <SEO
        title={`${tourPackage.title} (${tourPackage.duration}) — SKS Travels`}
        description={tourPackage.description}
        image={tourPackage.image}
      />

      {/* Banner */}
      <div className="relative h-[380px] bg-slate-900 overflow-hidden">
        <img
          src={tourPackage.image}
          alt={tourPackage.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-black/40 to-transparent"></div>

        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            to="/packages"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Tour Packages</span>
          </Link>
        </div>

        <div className="absolute bottom-8 left-4 sm:left-8 right-4 max-w-7xl mx-auto text-white">
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-[#F28C28] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {tourPackage.category.replace('-', ' ')}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{tourPackage.duration}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-3xl">
            {language === 'ta' && tourPackage.titleTa ? tourPackage.titleTa : tourPackage.title}
          </h1>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary, Inclusions, Places */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview & Places Covered */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-lg font-bold text-[#102A43]">Tour Package Overview</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {language === 'ta' && tourPackage.descriptionTa
                  ? tourPackage.descriptionTa
                  : tourPackage.description}
              </p>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Destinations & Stops in this Circuit:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(language === 'ta' && tourPackage.placesCoveredTa
                    ? tourPackage.placesCoveredTa
                    : tourPackage.placesCovered
                  ).map((place, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs font-semibold"
                    >
                      <MapPin className="w-3 h-3 text-[#F28C28]" />
                      <span>{place}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <h2 className="text-lg font-bold text-[#102A43]">Day-by-Day Schedule</h2>
              <div className="space-y-6 border-l-2 border-orange-200 pl-6 ml-2">
                {tourPackage.itinerary.map((item) => (
                  <div key={item.day} className="relative space-y-2">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#102A43] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                      {item.day}
                    </div>
                    <h3 className="text-base font-bold text-[#102A43]">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <h3 className="text-sm font-bold text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Package Inclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {tourPackage.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <h3 className="text-sm font-bold text-rose-800 flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Exclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {tourPackage.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Call to Action */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block mb-1">
                  Book This Tour
                </span>
                <h3 className="text-xl font-extrabold text-[#102A43]">
                  Customize for Your Group
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We adapt this itinerary to your preferred pickup location and dates.
                </p>
              </div>

              {tourPackage.basePriceEstimate ? (
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                    Starting Estimate:
                  </span>
                  <div className="text-2xl font-extrabold text-[#102A43] mt-0.5">
                    ₹{tourPackage.basePriceEstimate.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500"> / complete trip</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  Official quotation provided based on your exact passenger count and vehicle choice.
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/plan-your-trip?destination=${encodeURIComponent(
                      tourPackage.placesCovered[tourPackage.placesCovered.length - 1] || tourPackage.title
                    )}`
                  )
                }
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-lg flex items-center justify-center space-x-2 text-sm transition-all"
              >
                <span>Book This Tour Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero cancellation fee prior to trip confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
