import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { TourPackage } from '../../types';
import { PackageCard } from '../common/PackageCard';
import { useLanguage } from '../../context/LanguageContext';

interface PackagesPreviewProps {
  packages: TourPackage[];
}

export const PackagesPreview: React.FC<PackagesPreviewProps> = ({ packages }) => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Group Packages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight">
              {t('packages.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {t('packages.subtitle')}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              to="/packages"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#102A43] hover:text-white bg-white hover:bg-[#102A43] border border-slate-200 shadow-sm transition-all"
            >
              <span>{t('packages.viewAll')}</span>
              <ArrowRight className="w-4 h-4 text-[#F28C28]" />
            </Link>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.slice(0, 8).map((pkg) => (
            <PackageCard key={pkg.id} tourPackage={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};
