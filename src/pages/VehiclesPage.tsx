import React, { useState, useEffect } from 'react';
import { Bus, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';
import { api } from '../services/api';
import { VehicleCard } from '../components/common/VehicleCard';
import { CapacityMatcherModal } from '../components/common/CapacityMatcherModal';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

export const VehiclesPage: React.FC = () => {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [passengerFilter, setPassengerFilter] = useState<number>(0);
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const data = await api.getVehicles();
        setVehicles(data);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = passengerFilter > 0
    ? vehicles.filter((v) => v.capacity >= passengerFilter)
    : vehicles;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <SEO
        title="Our Fleet of 5 Tourist Vans (17, 18, 19, 21, 22 Seats) — SKS Travels"
        description="Inspect our luxury tourist vans. Force Tempo Traveller 17-seater, Force Urbania 18-seater luxury, 19-seater executive, 21-seater coach, and 22-seater maxi coach for group travel in Tamil Nadu."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Bus className="w-3.5 h-3.5" />
            <span>Dedicated 5-Van Tourist Fleet</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight">
            Our Tourist Vans & Passenger Capacities
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            All 5 vans are equipped with high-performance air conditioning, reclining push-back seating, USB mobile charging, and ample luggage space for seamless group tours across Tamil Nadu.
          </p>
        </div>

        {/* Quick Capacity Filter Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
              Filter by group size:
            </span>
            <select
              value={passengerFilter}
              onChange={(e) => setPassengerFilter(parseInt(e.target.value, 10))}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
            >
              <option value="0">Show All 5 Fleet Vans</option>
              <option value="17">Up to 17 Passengers</option>
              <option value="18">Up to 18 Passengers</option>
              <option value="19">Up to 19 Passengers</option>
              <option value="21">Up to 21 Passengers</option>
              <option value="22">Up to 22 Passengers</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setMatcherOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] text-xs shadow flex items-center justify-center space-x-2 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Recommend Ideal Capacity for My Group</span>
          </button>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Standard Fleet Amenities Guarantee */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-[#102A43] mb-6 text-center">
            Standard Amenities across Every SKS Fleet Vehicle
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F28C28] mx-auto flex items-center justify-center font-bold mb-2">
                AC
              </div>
              <strong className="block text-slate-800 font-bold mb-1">Chilled Air Conditioning</strong>
              <span className="text-slate-500">Individual airflow vents above each row</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#102A43] mx-auto flex items-center justify-center font-bold mb-2">
                2x1
              </div>
              <strong className="block text-slate-800 font-bold mb-1">Push-Back Recliners</strong>
              <span className="text-slate-500">Ergonomic seats for comfortable overnight sleep</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold mb-2">
                USB
              </div>
              <strong className="block text-slate-800 font-bold mb-1">Fast Mobile Charging</strong>
              <span className="text-slate-500">Dedicated charging points on every row</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center font-bold mb-2">
                SOS
              </div>
              <strong className="block text-slate-800 font-bold mb-1">Safety & First-Aid</strong>
              <span className="text-slate-500">Emergency kit, fire safety & GPS tracking</span>
            </div>
          </div>
        </div>

        {/* Capacity Matcher Modal */}
        <CapacityMatcherModal
          vehicles={vehicles}
          isOpen={matcherOpen}
          onClose={() => setMatcherOpen(false)}
        />
      </div>
    </div>
  );
};
