import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { TourPackage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PackageCardProps {
  tourPackage: TourPackage;
}

export const PackageCard: React.FC<PackageCardProps> = ({ tourPackage }) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Package Image */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={tourPackage.image}
          alt={tourPackage.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Duration Pill */}
        <div className="absolute top-4 left-4 bg-[#102A43] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow flex items-center space-x-1 border border-white/20">
          <Clock className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>{tourPackage.duration}</span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-lg font-bold tracking-tight leading-snug line-clamp-2">
            {language === 'ta' && tourPackage.titleTa ? tourPackage.titleTa : tourPackage.title}
          </h3>
        </div>
      </div>

      {/* Package Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {language === 'ta' && tourPackage.descriptionTa
            ? tourPackage.descriptionTa
            : tourPackage.description}
        </p>

        {/* Places Covered List */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Key Stops Covered:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(language === 'ta' && tourPackage.placesCoveredTa
              ? tourPackage.placesCoveredTa
              : tourPackage.placesCovered
            )
              .slice(0, 4)
              .map((stop, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 bg-orange-50/80 text-orange-900 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                >
                  <MapPin className="w-2.5 h-2.5 text-[#F28C28]" />
                  <span>{stop}</span>
                </span>
              ))}
          </div>
        </div>

        {/* Inclusions highlights */}
        <div className="space-y-1 text-xs text-slate-600">
          {tourPackage.inclusions.slice(0, 2).map((inc, idx) => (
            <div key={idx} className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="line-clamp-1">{inc}</span>
            </div>
          ))}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {tourPackage.basePriceEstimate ? (
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Starting from</span>
                <div className="text-base font-extrabold text-[#102A43]">
                  ₹{tourPackage.basePriceEstimate.toLocaleString('en-IN')}
                  <span className="text-[11px] font-normal text-slate-500"> / trip</span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Quotation</span>
                <div className="text-sm font-bold text-[#F28C28]">Request a Quote</div>
              </div>
            )}
          </div>

          <Link
            to={`/packages/${tourPackage.slug}`}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D47112] rounded-lg shadow transition-colors flex items-center space-x-1"
          >
            <span>{t('packages.explore')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
