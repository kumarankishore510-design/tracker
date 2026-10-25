import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Destination } from '../../types';
import { DestinationCard } from '../common/DestinationCard';
import { useLanguage } from '../../context/LanguageContext';

interface PopularDestinationsProps {
  destinations: Destination[];
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ destinations }) => {
  const { t } = useLanguage();

  // Filter or prioritize the 12 key destinations required
  const prioritySlugs = [
    'ooty',
    'kodaikanal',
    'madurai',
    'rameswaram',
    'kanyakumari',
    'chennai',
    'mahabalipuram',
    'thanjavur',
    'yercaud',
    'kumbakonam',
    'tiruvannamalai',
    'courtallam',
  ];

  const popularTwelve = prioritySlugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is Destination => Boolean(d));

  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Tamil Nadu Travel Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight">
              {t('dest.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {t('dest.subtitle')}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              to="/destinations"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#102A43] hover:text-white bg-white hover:bg-[#102A43] border border-slate-200 shadow-sm transition-all"
            >
              <span>{t('dest.viewAll')}</span>
              <ArrowRight className="w-4 h-4 text-[#F28C28]" />
            </Link>
          </div>
        </div>

        {/* 12 Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularTwelve.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#102A43] to-[#1B3F63] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="mb-6 md:mb-0 space-y-1">
            <h3 className="text-xl font-bold">Planning a Custom Multi-Destination Tour?</h3>
            <p className="text-xs text-slate-300">
              Combine multiple hill stations, temple circuits, and coastal stops into a seamless custom itinerary.
            </p>
          </div>
          <Link
            to="/plan-your-trip"
            className="px-6 py-3 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] text-sm shadow-md transition-all shrink-0"
          >
            Open Smart Trip Planner →
          </Link>
        </div>
      </div>
    </section>
  );
};
