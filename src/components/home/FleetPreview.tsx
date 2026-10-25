import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Vehicle } from '../../types';
import { VehicleCard } from '../common/VehicleCard';
import { CapacityMatcherModal } from '../common/CapacityMatcherModal';
import { useLanguage } from '../../context/LanguageContext';

interface FleetPreviewProps {
  vehicles: Vehicle[];
}

export const FleetPreview: React.FC<FleetPreviewProps> = ({ vehicles }) => {
  const { t } = useLanguage();
  const [matcherOpen, setMatcherOpen] = useState(false);

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Bus className="w-3.5 h-3.5" />
              <span>Dedicated Tourist Fleet</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight">
              {t('fleet.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {t('fleet.subtitle')}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMatcherOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] shadow transition-all"
            >
              <Users className="w-4 h-4 text-[#F28C28]" />
              <span>Suggest Van by Capacity</span>
            </button>

            <Link
              to="/vehicles"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <span>{t('fleet.viewAll')}</span>
              <ArrowRight className="w-4 h-4 text-[#F28C28]" />
            </Link>
          </div>
        </div>

        {/* 5 Van Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Capacity Matcher Modal */}
        <CapacityMatcherModal
          vehicles={vehicles}
          isOpen={matcherOpen}
          onClose={() => setMatcherOpen(false)}
        />
      </div>
    </section>
  );
};
