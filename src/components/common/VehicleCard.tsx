import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Wind, ShieldCheck, ArrowRight, CheckCircle2, Luggage } from 'lucide-react';
import { Vehicle } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
  showPricing?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  showPricing = true,
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Vehicle Image Header with Capacity Badge */}
      <div className="relative h-56 overflow-hidden bg-slate-900">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Prominent Passenger Capacity Badge */}
        <div className="absolute top-4 left-4 bg-[#102A43] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold tracking-wide shadow-lg border border-white/20 flex items-center space-x-1.5">
          <Users className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>{vehicle.capacity} Passengers</span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {vehicle.isAvailable ? (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>Available</span>
            </span>
          ) : (
            <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
              Reserved
            </span>
          )}
        </div>

        {/* Vehicle Name Overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-xl font-bold tracking-tight leading-snug">
            {language === 'ta' && vehicle.tamilName ? vehicle.tamilName : vehicle.name}
          </h3>
          <p className="text-xs text-slate-300 font-medium">{vehicle.model}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Key Features row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-[#F28C28] shrink-0" />
            <span className="truncate">{vehicle.acType.split(' ')[0]} AC Vents</span>
          </div>
          <div className="flex items-center space-x-2">
            <Luggage className="w-4 h-4 text-[#102A43] shrink-0" />
            <span className="truncate">{vehicle.luggageCapacity.split('+')[0]}</span>
          </div>
        </div>

        {/* Amenities Highlights (First 3) */}
        <div className="space-y-1.5 text-xs text-slate-700">
          {(language === 'ta' && vehicle.amenitiesTa ? vehicle.amenitiesTa : vehicle.amenities)
            .slice(0, 3)
            .map((amenity, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{amenity}</span>
              </div>
            ))}
        </div>

        {/* Pricing & Call to Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {showPricing && vehicle.pricing?.perKmRate ? (
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Rental Rate</span>
                <div className="text-lg font-extrabold text-[#102A43]">
                  ₹{vehicle.pricing.perKmRate}
                  <span className="text-xs font-normal text-slate-500"> / km</span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-xs text-slate-500 font-medium">Pricing upon request</span>
                <div className="text-sm font-bold text-[#F28C28]">Request a Quote</div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/vehicles/${vehicle.id}`}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#102A43] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Details
            </Link>

            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(vehicle)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D47112] rounded-lg shadow transition-colors flex items-center space-x-1"
              >
                <span>Select Van</span>
              </button>
            ) : (
              <Link
                to={`/plan-your-trip?vehicleId=${vehicle.id}`}
                className="px-4 py-2 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D47112] rounded-lg shadow transition-colors flex items-center space-x-1"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
