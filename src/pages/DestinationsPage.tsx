import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  Layers,
} from 'lucide-react';
import { Destination, DestinationCategory } from '../types';
import { api } from '../services/api';
import { DestinationCard } from '../components/common/DestinationCard';
import { SEO } from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';
import { tamilNaduDistricts } from '../data/districts';

export const DestinationsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedItineraryItems, setSelectedItineraryItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const categories: { key: string; label: string; labelTa: string }[] = [
    { key: 'all', label: 'All Destinations', labelTa: 'அனைத்து தலங்கள்' },
    { key: 'hill-stations', label: 'Hill Stations', labelTa: 'மலை வாசஸ்தலங்கள்' },
    { key: 'temples', label: 'Temples & Pilgrimages', labelTa: 'கோயில்கள் & ஆன்மீகம்' },
    { key: 'beaches', label: 'Beaches & Coastal', labelTa: 'கடற்கரைகள்' },
    { key: 'waterfalls', label: 'Waterfalls & Nature', labelTa: 'அருவிகள் & இயற்கை' },
    { key: 'heritage', label: 'Heritage & Culture', labelTa: 'பாரம்பரியம் & பண்பாடு' },
    { key: 'historical', label: 'Historical Places', labelTa: 'வரலாற்று தலங்கள்' },
  ];

  // Filtering logic
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || dest.category === selectedCategory;

    const matchesDistrict =
      selectedDistrict === 'all' ||
      dest.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  // Toggle item in custom multi-itinerary planner
  const toggleItineraryItem = (name: string) => {
    if (selectedItineraryItems.includes(name)) {
      setSelectedItineraryItems(selectedItineraryItems.filter((i) => i !== name));
    } else {
      setSelectedItineraryItems([...selectedItineraryItems, name]);
    }
  };

  const handleLaunchCustomItinerary = () => {
    if (selectedItineraryItems.length === 0) return;
    const destParam = encodeURIComponent(selectedItineraryItems.join(' & '));
    navigate(`/plan-your-trip?destination=${destParam}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <SEO
        title="Tamil Nadu Destinations Explorer — SKS Travels"
        description="Explore popular tourist destinations across all 38 districts of Tamil Nadu. Hill stations like Ooty & Kodaikanal, UNESCO heritage sites, temple circuits, waterfalls, and coastal retreats."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Tamil Nadu Tourism Explorer</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight">
            Discover Tamil Nadu’s Wonders
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Search across our curated collection of hill retreats, ancient Dravidian temples, pristine beaches, and waterfalls. Select destinations to craft your custom tour route.
          </p>
        </div>

        {/* Multi-Destination Custom Itinerary Bar (Sticky if items selected) */}
        {selectedItineraryItems.length > 0 && (
          <div className="mb-8 bg-[#102A43] text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#F28C28] flex items-center justify-center font-bold text-white shrink-0">
                {selectedItineraryItems.length}
              </div>
              <div>
                <strong className="block text-sm font-bold">Custom Multi-Destination Itinerary:</strong>
                <span className="text-xs text-slate-300">
                  {selectedItineraryItems.join(' ➔ ')}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedItineraryItems([])}
                className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleLaunchCustomItinerary}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow text-xs flex items-center space-x-1"
              >
                <span>Plan Route for Selected ({selectedItineraryItems.length})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by destination name, district or attraction..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
              />
            </div>

            {/* District Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
              >
                <option value="all">All 38 Districts</option>
                {tamilNaduDistricts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} District
                  </option>
                ))}
              </select>
            </div>

            {/* Total Results Count */}
            <div className="md:col-span-3 text-right text-xs text-slate-500 font-medium">
              Showing <strong className="text-[#102A43]">{filteredDestinations.length}</strong> destinations
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {language === 'ta' ? cat.labelTa : cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No destinations found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or reset the district / category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDistrict('all');
              }}
              className="text-xs font-bold text-[#F28C28] hover:underline pt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => {
              const isSelected = selectedItineraryItems.includes(dest.name);
              return (
                <div key={dest.id} className="relative group">
                  <DestinationCard destination={dest} />

                  {/* Add to multi-destination builder button overlay */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItineraryItem(dest.name);
                      }}
                      className={`p-1.5 rounded-xl shadow-md text-xs font-bold flex items-center space-x-1 transition-all ${
                        isSelected
                          ? 'bg-[#F28C28] text-white ring-2 ring-white'
                          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-[#102A43]'
                      }`}
                      title={isSelected ? 'Remove from custom route' : 'Add to custom multi-stop route'}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isSelected ? 'Added' : '+ Add'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
