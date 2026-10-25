import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Share2,
} from 'lucide-react';
import { Destination, Vehicle } from '../types';
import { api } from '../services/api';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        if (slug) {
          const [dest, vList] = await Promise.all([
            api.getDestinationBySlug(slug),
            api.getVehicles(),
          ]);
          if (dest) {
            setDestination(dest);
            setActiveImage(dest.image);
          }
          setVehicles(vList);
        }
      } catch (err) {
        console.error('Failed to load destination details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-10 h-10 border-4 border-[#102A43] border-t-[#F28C28] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] px-4 text-center">
        <h2 className="text-2xl font-bold text-[#102A43]">Destination Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested Tamil Nadu destination page could not be located.
        </p>
        <Link
          to="/destinations"
          className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] text-sm"
        >
          Back to Destinations Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <SEO
        title={`${destination.name} Group Tour & Van Rental — SKS Travels`}
        description={destination.shortDescription}
        image={destination.image}
      />

      {/* Hero Visual Banner */}
      <div className="relative h-[420px] bg-slate-900 overflow-hidden">
        <img
          src={activeImage || destination.image}
          alt={destination.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-black/40 to-transparent"></div>

        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            to="/destinations"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Destinations</span>
          </Link>
        </div>

        <div className="absolute bottom-10 left-4 sm:left-8 right-4 max-w-7xl mx-auto text-white">
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-[#F28C28] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {destination.category.replace('-', ' ')}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>{destination.district} District</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'ta' && destination.nameTa ? destination.nameTa : destination.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl">
            {language === 'ta' && destination.shortDescriptionTa
              ? destination.shortDescriptionTa
              : destination.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details, Highlights, Itinerary */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Thumbnails */}
            {destination.gallery && destination.gallery.length > 1 && (
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex items-center space-x-3 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveImage(destination.image)}
                  className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === destination.image ? 'border-[#F28C28]' : 'border-transparent'
                  }`}
                >
                  <img src={destination.image} alt="Main" className="w-full h-full object-cover" />
                </button>
                {destination.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-[#F28C28]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Overview Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-xl font-bold text-[#102A43]">Overview & Travel Guide</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {language === 'ta' && destination.overviewTa
                  ? destination.overviewTa
                  : destination.overview}
              </p>

              {/* Distance from Major Tamil Nadu Cities */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold">From Chennai</span>
                  <strong className="text-[#102A43] text-sm font-extrabold">{destination.distanceFromChennai} km</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold">From Madurai</span>
                  <strong className="text-[#102A43] text-sm font-extrabold">{destination.distanceFromMadurai} km</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold">From Coimbatore</span>
                  <strong className="text-[#102A43] text-sm font-extrabold">{destination.distanceFromCoimbatore} km</strong>
                </div>
              </div>
            </div>

            {/* Highlights Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-xl font-bold text-[#102A43]">Key Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(language === 'ta' && destination.highlightsTa ? destination.highlightsTa : destination.highlights).map(
                  (hl, i) => (
                    <div key={i} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Suggested Attractions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-xl font-bold text-[#102A43]">Must-Visit Attractions</h2>
              <div className="flex flex-wrap gap-2">
                {(language === 'ta' && destination.suggestedAttractionsTa ? destination.suggestedAttractionsTa : destination.suggestedAttractions).map(
                  (attr, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-50/80 border border-orange-200/80 text-orange-950 text-xs font-semibold"
                    >
                      <MapPin className="w-3 h-3 text-[#F28C28]" />
                      <span>{attr}</span>
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Suggested Day-by-Day Itinerary */}
            {destination.suggestedItinerary && destination.suggestedItinerary.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Suggested Trip Duration: {destination.suggestedDuration}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#102A43]">Recommended Travel Itinerary</h2>
                </div>

                <div className="space-y-6 border-l-2 border-orange-200 pl-6 ml-2">
                  {destination.suggestedItinerary.map((day) => (
                    <div key={day.day} className="relative space-y-2">
                      <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-[#102A43] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
                        {day.day}
                      </div>
                      <h3 className="text-base font-bold text-[#102A43]">{day.title}</h3>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {day.activities.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start space-x-2">
                            <span className="text-[#F28C28] font-bold">›</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Quotation Request Box */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block mb-1">
                  Ready to visit {destination.name}?
                </span>
                <h3 className="text-xl font-extrabold text-[#102A43]">
                  Book a Tourist Van
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Travel together in comfortable 17, 18, 19, 21, or 22-seater AC vans with verified drivers.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <strong className="text-slate-900">{destination.name}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Suggested Duration:</span>
                  <strong className="text-slate-900">{destination.suggestedDuration}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Best Season:</span>
                  <strong className="text-slate-900">{destination.bestTimeToVisit}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/plan-your-trip?destination=${encodeURIComponent(destination.name)}`)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-lg flex items-center justify-center space-x-2 text-sm transition-all"
              >
                <span>Request a Quotation for {destination.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-slate-400 text-center">
                Doorstep pickup from any location in Tamil Nadu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
