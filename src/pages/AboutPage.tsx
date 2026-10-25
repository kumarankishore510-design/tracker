import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Users, MapPin, ShieldCheck, Check, Compass, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-16">
      <SEO
        title="About SKS Travels — Tamil Nadu Group Travel & Van Hire"
        description="Learn about SKS Travels. Operating a dedicated 5-van tourist fleet (17, 18, 19, 21, 22 seats) serving all 38 districts of Tamil Nadu for family vacations, pilgrimages, and corporate journeys."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Bus className="w-3.5 h-3.5" />
            <span>Tamil Nadu Van Rental Specialist</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight">
            About SKS Travels
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            “Explore Tamil Nadu. Travel Together.”
          </p>
        </div>

        {/* Brand Mission Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-6">
          <h2 className="text-2xl font-bold text-[#102A43]">Who We Are</h2>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>{settings.companyName}</strong> is a dedicated tourist van rental and group transportation service provider operating throughout all <strong>38 districts of Tamil Nadu</strong>. We specialize in group transit, offering tailored travel solutions for families, pilgrim yatras, schools, colleges, corporate offsites, and wedding parties.
            </p>
            <p>
              We believe that the best journeys in Tamil Nadu are the ones shared together. Whether navigating the misty hairpin bends of the Nilgiris (Ooty & Coonoor), embarking on multi-temple pilgrimage circuits across Thanjavur and Kumbakonam, or travelling to the southernmost shore of Kanyakumari, our vehicles provide spacious, safe, and comfortable passage.
            </p>
          </div>

          {/* Core Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-3xl font-extrabold text-[#102A43]">5</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">Dedicated Vans</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-3xl font-extrabold text-[#F28C28]">38</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">TN Districts</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-3xl font-extrabold text-[#102A43]">17-22</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">Seating Range</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-3xl font-extrabold text-emerald-600">100%</span>
              <p className="text-xs text-slate-500 font-semibold mt-1">Direct Quotes</p>
            </div>
          </div>
        </div>

        {/* Our Approach to Group Travel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#102A43]">Our Customers & Trips</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Multi-generation families:</strong> Ample legroom, child safety, and elder-friendly push-back seating.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Pilgrims & Temple Groups:</strong> Organized yatras to Navagraha, Divya Desam, and Murugan Arupadai Veedu.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Schools & Colleges:</strong> Punctual drivers, verified commercial permits, speed governors, and first-aid kits.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Corporate Teams:</strong> Executive AC interiors, mobile charging matrix, and audio PA systems.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#102A43] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#102A43]">Transparency & Pricing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We operate an open, formula-driven pricing model without hidden brokerage fees. When you request a quotation through our platform, you receive a full breakdown of kilometers, driver allowance, and toll estimations.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never fabricate unverified safety ratings or commercial awards. Instead, we let our clean fleet, experienced local drivers, and clear communication speak for themselves.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/plan-your-trip"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] text-sm shadow-xl transition-all"
          >
            <Compass className="w-5 h-5" />
            <span>Plan Your Trip with SKS Travels</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
