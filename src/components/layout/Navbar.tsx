import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Globe,
  Compass,
  Bus,
  Calendar,
  ShieldCheck,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.destinations'), path: '/destinations' },
    { name: t('nav.districts'), path: '/districts' },
    { name: t('nav.vehicles'), path: '/vehicles' },
    { name: t('nav.packages'), path: '/packages' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Notification Bar for Quick Phone Assistance */}
      <div className="bg-[#102A43] text-white/90 text-xs py-2 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Tamil Nadu All 38 Districts Tourist Van Services</span>
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/80">Fleet: 17, 18, 19, 21 & 22 Passenger Capacities</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center space-x-1.5 text-white/90 hover:text-[#F28C28] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F28C28]" />
              <span className="font-semibold">{settings.phone}</span>
            </a>
            <span className="text-white/40">|</span>
            <Link
              to="/booking"
              className="text-white/80 hover:text-white transition-colors"
            >
              Track Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
            : 'bg-white py-4 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#102A43] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <Bus className="w-6 h-6 text-[#F28C28]" />
                <span className="absolute -bottom-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-[#102A43]">
                  SKS
                </span>
                <span className="text-2xl font-bold tracking-tight text-[#F28C28]">
                  TRAVELS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                {language === 'ta'
                  ? 'தமிழ்நாடு சுற்றுலா & வேன் வாடகை'
                  : 'Tamil Nadu Van Rental & Tours'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-[#F28C28] bg-orange-50 font-bold'
                    : 'text-[#172B4D] hover:text-[#102A43] hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Selector Toggle */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'ta'
                    ? 'bg-[#102A43] text-white shadow-sm font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="தமிழுக்கு மாற்றுக"
              >
                தமிழ்
              </button>
            </div>

            {/* Admin Link */}
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              className="p-2 text-slate-500 hover:text-[#102A43] rounded-lg hover:bg-slate-100 transition-colors"
              title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            >
              <UserCheck className="w-5 h-5" />
            </Link>

            {/* Book Now Primary Button */}
            <Link
              to="/plan-your-trip"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 mr-2" />
              <span>{t('nav.bookNow')}</span>
            </Link>
          </div>

          {/* Mobile Menu Button & Language Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="px-2.5 py-1 rounded border border-slate-200 text-xs font-bold text-[#102A43] bg-slate-50"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#102A43] hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl px-4 pt-3 pb-6 animate-fadeIn">
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold ${
                    isActive(link.path)
                      ? 'text-[#F28C28] bg-orange-50'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <Link
                to="/plan-your-trip"
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-base font-bold text-white bg-[#F28C28] shadow-md"
              >
                <Compass className="w-5 h-5 mr-2" />
                <span>{t('nav.planTrip')}</span>
              </Link>
              <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-500">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center space-x-1.5 font-semibold text-[#102A43]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>{settings.phone}</span>
                </a>
                <Link
                  to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                  className="text-slate-600 hover:underline flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('nav.admin')}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
