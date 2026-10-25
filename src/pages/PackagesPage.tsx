import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Clock, ArrowRight } from 'lucide-react';
import { TourPackage } from '../types';
import { api } from '../services/api';
import { PackageCard } from '../components/common/PackageCard';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

export const PackagesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPackages();
        setPackages(data);
      } catch (err) {
        console.error('Failed to load packages:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const categories = [
    { key: 'all', label: 'All Packages', labelTa: 'அனைத்து தொகுப்புகள்' },
    { key: 'one-day', label: 'One-Day Sightseeing', labelTa: 'ஒரு நாள் சுற்றுலா' },
    { key: 'weekend', label: '2-Day Weekend Trips', labelTa: 'வார இறுதி பயணம்' },
    { key: 'hill-station', label: '3-Day Hill Station', labelTa: 'மலை வாசஸ்தலம்' },
    { key: 'pilgrimage', label: 'Temple Pilgrimage', labelTa: 'ஆன்மீக யாத்திரை' },
    { key: 'family', label: 'Family Holidays', labelTa: 'குடும்ப சுற்றுலா' },
    { key: 'multi-day', label: 'Multi-Day TN Circuit', labelTa: 'மகா சுற்றுப்பயணம்' },
    { key: 'corporate', label: 'Corporate Outings', labelTa: 'கார்ப்பரேட் சுற்றுலா' },
    { key: 'college', label: 'School & College Excursions', labelTa: 'கல்விச் சுற்றுலா' },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.placesCovered.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || pkg.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <SEO
        title="Curated Tamil Nadu Tour Packages — SKS Travels"
        description="Handcrafted tour packages for temple pilgrimages, hill station escapes, family vacations, corporate retreats, and student educational excursions across Tamil Nadu in our tourist vans."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Group Tour Packages</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight">
            Popular Tour Packages in Tamil Nadu
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Choose from ready-made itineraries with door-to-door transit, or customize any package to your preferred pickup district and schedule.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-10 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by package name or cities covered..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'ta' ? cat.labelTa : cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} tourPackage={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
};
