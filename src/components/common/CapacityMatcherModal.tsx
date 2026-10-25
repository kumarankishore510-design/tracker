import React, { useState } from 'react';
import { Users, CheckCircle, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Vehicle } from '../../types';
import { useNavigate } from 'react-router-dom';

interface CapacityMatcherModalProps {
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
}

export const CapacityMatcherModal: React.FC<CapacityMatcherModalProps> = ({
  vehicles,
  isOpen,
  onClose,
}) => {
  const [passengerCount, setPassengerCount] = useState<number>(18);
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Find suitable vehicles whose capacity is >= passengerCount, sorted by capacity
  const suitableVehicles = vehicles
    .filter((v) => v.capacity >= passengerCount)
    .sort((a, b) => a.capacity - b.capacity);

  const bestMatch = suitableVehicles[0];

  const handleBookVehicle = (vehicleId: string) => {
    onClose();
    navigate(`/plan-your-trip?vehicleId=${vehicleId}&passengers=${passengerCount}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="bg-[#102A43] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-[#F28C28] text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Capacity Recommendation Engine</span>
          </div>
          <h2 className="text-xl font-bold">Find the Perfect Van for Your Group</h2>
          <p className="text-xs text-slate-300 mt-1">
            We operate 5 dedicated vans with 17, 18, 19, 21, and 22 passenger capacities across Tamil Nadu.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              How many passengers in your group?
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="25"
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value, 10))}
                className="w-full accent-[#F28C28] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="w-16 text-center font-extrabold text-xl text-[#102A43] bg-orange-50 border border-orange-200 py-1 px-2 rounded-xl">
                {passengerCount}
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 passenger</span>
              <span>17 Seater</span>
              <span>18 Seater</span>
              <span>19 Seater</span>
              <span>21 Seater</span>
              <span>22 Seater</span>
            </div>
          </div>

          {/* Recommendation Result */}
          {passengerCount > 22 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-800 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Large Group Notice:</strong>
                Our single largest fleet vehicle comfortably accommodates up to 22 passengers. For groups of {passengerCount}, we recommend booking two coordinated vans (e.g., 17 + 17 or 18 + 17).
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handleBookVehicle('van-22')}
                    className="text-xs font-bold text-[#102A43] underline"
                  >
                    Request multi-van booking quotation →
                  </button>
                </div>
              </div>
            </div>
          ) : bestMatch ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Recommended Van</span>
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {bestMatch.capacity - passengerCount === 0
                    ? 'Exact capacity match'
                    : `${bestMatch.capacity - passengerCount} spare seat(s) for luggage / comfort`}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={bestMatch.image}
                  alt={bestMatch.name}
                  className="w-20 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="text-base font-bold text-[#102A43]">{bestMatch.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{bestMatch.model}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                    Seating Capacity: {bestMatch.capacity} Passengers
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleBookVehicle(bestMatch.id)}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Proceed with {bestMatch.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Other options */}
          {suitableVehicles.length > 1 && (
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-2">
                Other suitable capacities:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {suitableVehicles.slice(1).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleBookVehicle(v.id)}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-[#F28C28] hover:bg-orange-50/50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{v.name}</div>
                      <div className="text-[11px] text-slate-500">{v.capacity} Passengers</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
