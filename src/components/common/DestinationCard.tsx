import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Destination } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { language, t } = useLanguage();

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'hill-stations':
        return 'Hill Station';
      case 'temples':
        return 'Spiritual & Temple';
      case 'beaches':
        return 'Beach & Coast';
      case 'waterfalls':
        return 'Waterfalls & Nature';
      case 'heritage':
        return 'Heritage & Culture';
      case 'historical':
        return 'Historical';
      default:
        return 'Tourism';
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Destination Image */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#102A43] px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-[#F28C28]" />
          <span>{getCategoryLabel(destination.category)}</span>
        </div>

        {/* District Badge */}
        <div className="absolute top-4 right-4 bg-[#102A43]/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-[#F28C28]" />
          <span>{destination.district} Dist.</span>
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-xl font-bold tracking-tight">
            {language === 'ta' && destination.nameTa ? destination.nameTa : destination.name}
          </h3>
          <div className="flex items-center space-x-1.5 text-xs text-amber-200 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Suggested: {destination.suggestedDuration}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {language === 'ta' && destination.shortDescriptionTa
            ? destination.shortDescriptionTa
            : destination.shortDescription}
        </p>

        {/* Highlights preview tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(language === 'ta' && destination.highlightsTa ? destination.highlightsTa : destination.highlights)
            .slice(0, 2)
            .map((hl, idx) => (
              <span
                key={idx}
                className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md truncate max-w-full"
              >
                ✓ {hl}
              </span>
            ))}
        </div>

        {/* Bottom CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Best: <span className="text-slate-800">{destination.bestTimeToVisit.split('(')[0]}</span>
          </span>

          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#F28C28] hover:text-[#D47112] group-hover:translate-x-0.5 transition-all"
          >
            <span>{t('dest.exploreTrip')}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
