import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Shield,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useSettings();

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#102A43] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F28C28]">
                <Bus className="w-6 h-6" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-extrabold text-white">SKS</span>
                <span className="text-2xl font-bold text-[#F28C28]">TRAVELS</span>
              </div>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed">
              {language === 'ta'
                ? settings.taglineTa
                : settings.tagline}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Specialized tourist van rentals (17, 18, 19, 21, and 22 passengers) and customized tour packages operating across all 38 districts of Tamil Nadu.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hello SKS Travels, I would like to enquire about tourist van rental.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase text-xs text-[#F28C28]">
              {language === 'ta' ? 'முக்கிய இணைப்புகள்' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span className="text-xs text-orange-400">›</span>
                  <span>{t('nav.home')}</span>
                </Link>
              </li>
              <li>
                <Link to="/plan-your-trip" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span className="text-xs text-orange-400">›</span>
                  <span className="text-amber-300 font-semibold">{t('nav.planTrip')}</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span className="text-xs text-orange-400">›</span>
                  <span>{t('nav.vehicles')} (17 - 22 Seater)</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span className="text-xs text-orange-400">›</span>
                  <span>{t('nav.destinations')}</span>
                </Link>
              </li>
              <li>
                <Link to="/districts" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span className="text-xs text-orange-400">›</span>
                  <span>All 38 Tamil Nadu Districts</span>
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span className="text-xs text-orange-400">›</span>
                  <span>{t('nav.packages')}</span>
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <span className="text-xs text-orange-400">›</span>
                  <span>Track Booking Enquiry</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Destination Trips */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase text-xs text-[#F28C28]">
              {language === 'ta' ? 'பிரபல சுற்றுலா தலங்கள்' : 'Popular Destinations'}
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/destinations/ooty" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Ooty & Nilgiris</span>
                  <span className="text-[11px] text-slate-400">Hill Station</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations/kodaikanal" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Kodaikanal</span>
                  <span className="text-[11px] text-slate-400">Hill Station</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations/madurai" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Madurai Meenakshi</span>
                  <span className="text-[11px] text-slate-400">Temple</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations/rameswaram" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Rameswaram & Dhanushkodi</span>
                  <span className="text-[11px] text-slate-400">Pilgrimage</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations/kanyakumari" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Kanyakumari</span>
                  <span className="text-[11px] text-slate-400">Triveni Sangam</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations/thanjavur" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Thanjavur Big Temple</span>
                  <span className="text-[11px] text-slate-400">UNESCO Heritage</span>
                </Link>
              </li>
              <li>
                <Link to="/destinations/tiruvannamalai" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Tiruvannamalai Girivalam</span>
                  <span className="text-[11px] text-slate-400">Agni Sthalam</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase text-xs text-[#F28C28]">
              {language === 'ta' ? 'தொடர்பு விவரங்கள்' : 'Contact & Support'}
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#F28C28] mt-1 shrink-0" />
                <span className="leading-snug">{language === 'ta' ? settings.addressTa : settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#F28C28] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-semibold text-white">
                  {settings.phone}
                </a>
              </li>
              {settings.alternatePhone && (
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`tel:${settings.alternatePhone}`} className="hover:text-white">
                    {settings.alternatePhone}
                  </a>
                </li>
              )}
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#F28C28] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white break-all">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-[#F28C28] shrink-0" />
                <span>{settings.workingHours}</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400">
              <span>Service Area: </span>
              <strong className="text-white">All 38 Districts of Tamil Nadu</strong>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
            <span className="block sm:inline sm:ml-2 text-slate-500">
              “Explore Tamil Nadu. Travel Together.”
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/admin/login" className="hover:text-[#F28C28] transition-colors flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
