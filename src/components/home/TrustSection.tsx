import React from 'react';
import { Users, Route, MapPin, MessageSquareText, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TrustSection: React.FC = () => {
  const { t } = useLanguage();

  const trustPillars = [
    {
      icon: Users,
      title: t('trust.capacities'),
      description: t('trust.capacitiesDesc'),
      badge: '17, 18, 19, 21 & 22 Seats',
    },
    {
      icon: Route,
      title: t('trust.custom'),
      description: t('trust.customDesc'),
      badge: 'Personalized Stops',
    },
    {
      icon: MapPin,
      title: t('trust.coverage'),
      description: t('trust.coverageDesc'),
      badge: '38 TN Districts',
    },
    {
      icon: MessageSquareText,
      title: t('trust.booking'),
      description: t('trust.bookingDesc'),
      badge: 'Transparent Estimates',
    },
    {
      icon: Shield,
      title: t('trust.solutions'),
      description: t('trust.solutionsDesc'),
      badge: 'Reliable Fleets',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-[#F28C28] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Service Features</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#102A43] tracking-tight sm:text-4xl">
            {t('trust.title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t('trust.subtitle')}
          </p>
        </div>

        {/* 5 Service Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-orange-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#102A43] group-hover:bg-[#F28C28] text-white flex items-center justify-center mb-4 transition-colors duration-200 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-extrabold text-[#F28C28] uppercase tracking-wider block mb-1">
                    {pillar.badge}
                  </span>
                  <h3 className="text-base font-bold text-[#102A43] mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
