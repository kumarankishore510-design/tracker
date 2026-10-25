import React from 'react';
import { Users, Bus, Route, MessageSquare, Check, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { language } = useLanguage();

  const reasons = [
    {
      icon: Users,
      title: 'The Joy & Economy of Travelling Together',
      titleTa: 'ஒன்றாகப் பயணிப்பதன் மகிழ்ச்சியும் சிக்கனமும்',
      description:
        'Group transportation in a single spacious tourist van keeps families, pilgrims, and colleagues together throughout the journey, significantly reducing per-passenger travel costs and eliminating multiple-car coordination hassles.',
      descriptionTa:
        'குடும்பங்கள் மற்றும் குழுக்கள் தனித்தனி கார்களில் செல்வதை விட ஒரே சொகுசு வேனில் ஒன்றாக பயணிப்பது செலவைக் குறைப்பதுடன் பயணத்தை மகிழ்ச்சியானதாக மாற்றுகிறது.',
    },
    {
      icon: Bus,
      title: 'Dedicated Fleet of 5 Capacities (17 to 22 Seats)',
      titleTa: '17 முதல் 22 இருக்கைகள் கொண்ட 5 வகையான வேன்கள்',
      description:
        'Rather than paying for an oversized coach or cramming into small cabs, choose exactly the vehicle matching your passenger count: 17, 18, 19, 21, or 22 seats, with ample luggage accommodation.',
      descriptionTa:
        'உங்கள் குழுவின் சரியான எண்ணிக்கைக்கு ஏற்ப 17, 18, 19, 21 அல்லது 22 இருக்கைகள் கொண்ட வேன்களை தேர்வு செய்து வசதியாக பயணிக்கலாம்.',
    },
    {
      icon: Route,
      title: 'Customised Routes Across All 38 Districts',
      titleTa: '38 மாவட்டங்களிலும் தனிப்பயன் பயண வழிகள்',
      description:
        'You decide the pickup time, intermediate stops, meal breaks, and sightseeing duration. We accommodate your preferred pace across hill stations, coastal circuits, and temple towns.',
      descriptionTa:
        'பிக்கப் நேரம், வழியில் நிற்கும் இடங்கள் மற்றும் பார்வையிடும் நேரத்தை நீங்களே தீர்மானிக்கலாம். உங்கள் விருப்பப்படி பயணம் அமையும்.',
    },
    {
      icon: MessageSquare,
      title: 'Transparent Online Enquiries & WhatsApp Booking',
      titleTa: 'வெளிப்படையான ஆன்லைன் மற்றும் வாட்ஸ்அப் முன்பதிவு',
      description:
        'Get clear, structured trip estimates with transparent breakdown of kilometers, driver allowance, and toll estimations. Coordinate directly via WhatsApp with zero hidden brokerage.',
      descriptionTa:
        'மறைமுக கட்டணங்கள் இன்றி தூரம், ஓட்டுநர் படி மற்றும் டோல் கட்டணங்களுடன் கூடிய தெளிவான மதிப்பீட்டை வாட்ஸ்அப் மூலம் உடனடியாக பெறலாம்.',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-orange-50 text-[#F28C28] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reliable Group Transit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight leading-tight">
              Why Choose SKS Travels for Group Journeys?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We focus on what matters most for group travel across Tamil Nadu: right-sized vehicles, clean interiors, knowledgeable road navigation, and direct communication without bureaucratic red tape.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-sm font-semibold text-[#102A43]">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span>All 38 Tamil Nadu districts covered</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-semibold text-[#102A43]">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span>Hill-driving certified drivers for Ooty, Kodai & Yercaud</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-semibold text-[#102A43]">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span>Direct WhatsApp booking summary & clear quotations</span>
              </div>
            </div>
          </div>

          {/* Right 4 Pillars Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#102A43] text-[#F28C28] flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#102A43] mb-2 leading-snug">
                    {language === 'ta' ? r.titleTa : r.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'ta' ? r.descriptionTa : r.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
