import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, Compass, ArrowRight, CheckCircle2, Bus } from 'lucide-react';
import { tamilNaduDistricts } from '../data/districts';
import { District } from '../types';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

export const DistrictsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const zones = ['all', 'North', 'South', 'West', 'Central'];

  const filteredDistricts = tamilNaduDistricts.filter((dist) => {
    const matchesSearch =
      dist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.headquarters.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.topAttractions.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesZone = selectedZone === 'all' || dist.zone === selectedZone;

    return matchesSearch && matchesZone;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <SEO
        title="All 38 Districts of Tamil Nadu — SKS Travels Service Network"
        description="Comprehensive tourist van rental and group tour coverage across all 38 districts of Tamil Nadu. From Chennai to Kanyakumari, Nilgiris to Nagapattinam."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>State-Wide Service Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight">
            All 38 Districts of Tamil Nadu
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            SKS Travels operates tourist vans throughout Tamil Nadu. Discover key attractions, headquarters, and major pickup hubs across every single district.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search district, town, or temple..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
              />
            </div>

            {/* Zone Filter Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-bold uppercase mr-1">Zone:</span>
              {zones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    selectedZone === zone
                      ? 'bg-[#102A43] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {zone === 'all' ? 'All (38)' : `${zone} TN`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Districts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDistricts.map((district) => (
            <div
              key={district.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-orange-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#F28C28] uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-full">
                    {district.zone} Zone
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    HQ: <strong className="text-slate-700">{district.headquarters}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#102A43] group-hover:text-[#F28C28] transition-colors">
                    {language === 'ta' && district.nameTa ? district.nameTa : district.name} District
                  </h3>
                </div>

                {/* Top Attractions in this district */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Top Sights & Pilgrimages:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {district.topAttractions.map((sight, sIdx) => (
                      <li key={sIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{sight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Major Pickups */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Major SKS Pickup Hubs:
                  </span>
                  <p className="text-xs text-slate-600 font-medium">
                    {district.majorPickups.join(', ')}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">17 to 22 Seaters</span>
                <button
                  type="button"
                  onClick={() => navigate(`/plan-your-trip?pickup=${encodeURIComponent(district.name)}`)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#102A43] hover:bg-[#F28C28] px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>Book from {district.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
