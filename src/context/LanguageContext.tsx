import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', ta: 'முகப்பு' },
  'nav.destinations': { en: 'Destinations', ta: 'சுற்றுலாத் தலங்கள்' },
  'nav.districts': { en: '38 Districts', ta: '38 மாவட்டங்கள்' },
  'nav.vehicles': { en: 'Our Vehicles', ta: 'எங்கள் வாகனங்கள்' },
  'nav.packages': { en: 'Tour Packages', ta: 'சுற்றுலாத் தொகுப்புகள்' },
  'nav.about': { en: 'About Us', ta: 'எங்களைப் பற்றி' },
  'nav.contact': { en: 'Contact', ta: 'தொடர்புக்கு' },
  'nav.bookNow': { en: 'Book Now', ta: 'முன்பதிவு செய்ய' },
  'nav.planTrip': { en: 'Plan Your Trip', ta: 'பயணத்தைத் திட்டமிடுங்கள்' },
  'nav.admin': { en: 'Admin Portal', ta: 'நிர்வாக தளம்' },

  // Hero Section
  'hero.tagline': { en: 'Explore Tamil Nadu. Travel Together.', ta: 'தமிழ்நாட்டை அறிவோம். ஒன்றாகப் பயணிப்போம்.' },
  'hero.headline': { en: 'Discover Tamil Nadu with SKS Travels', ta: 'எஸ்.கே.எஸ் டிராவல்ஸ் உடன் தமிழ்நாட்டை வலம் வாருங்கள்' },
  'hero.subheading': {
    en: 'Comfortable group travel, personalised tour packages, and reliable van rentals across Tamil Nadu.',
    ta: 'தமிழ்நாடு முழுவதும் சௌகரியமான குழுப் பயணம், தனிப்பயனாக்கப்பட்ட சுற்றுலாத் தொகுப்புகள் மற்றும் நம்பகமான வேன் வாடகை.',
  },
  'hero.planTripBtn': { en: 'Plan Your Trip', ta: 'பயணத்தைத் திட்டமிடுங்கள்' },
  'hero.exploreBtn': { en: 'Explore Destinations', ta: 'சுற்றுலாத் தலங்களை காண' },

  // Quick Enquiry Form
  'form.quickTitle': { en: 'Quick Trip Enquiry', ta: 'விரைவு பயண விசாரணை' },
  'form.pickup': { en: 'Pickup Location', ta: 'புறப்படும் இடம்' },
  'form.destination': { en: 'Destination', ta: 'செல்லும் இடம்' },
  'form.departure': { en: 'Departure Date', ta: 'புறப்படும் தேதி' },
  'form.return': { en: 'Return Date', ta: 'திரும்பும் தேதி' },
  'form.passengers': { en: 'Number of Passengers', ta: 'பயணிகளின் எண்ணிக்கை' },
  'form.searchVans': { en: 'Search Available Vans', ta: 'கிடைக்கும் வேன்களைத் தேடுங்கள்' },
  'form.pickupPlaceholder': { en: 'e.g. Chennai, Madurai, Coimbatore', ta: 'எ.கா. சென்னை, மதுரை, கோயம்புத்தூர்' },
  'form.destPlaceholder': { en: 'e.g. Ooty, Kodaikanal, Rameswaram', ta: 'எ.கா. ஊட்டி, கொடைக்கானல், ராமேஸ்வரம்' },

  // Trust Section
  'trust.title': { en: 'Why Travellers Across Tamil Nadu Choose SKS', ta: 'தமிழ்நாடு பயணிகள் எஸ்.கே.எஸ்ஸை தேர்ந்தெடுப்பது ஏன்?' },
  'trust.subtitle': { en: 'Dedicated to comfortable, safe, and transparent group transportation.', ta: 'சௌகரியமான, பாதுகாப்பான மற்றும் வெளிப்படையான குழுப் பயண சேவை.' },
  'trust.capacities': { en: 'Multiple Passenger Capacities', ta: 'பல்வேறு பயணிகள் இருக்கை வசதிகள்' },
  'trust.capacitiesDesc': { en: 'Choice of 17, 18, 19, 21, and 22-seater tourist vans tailored to your group size.', ta: 'உங்கள் குழுவிற்கு ஏற்ற 17, 18, 19, 21 மற்றும் 22 இருக்கைகள் கொண்ட வேன்கள்.' },
  'trust.custom': { en: 'Customised Travel Itineraries', ta: 'தனிப்பயன் பயணத் திட்டங்கள்' },
  'trust.customDesc': { en: 'Flexible schedules and personalized routes crafted for family, pilgrimage, or corporate trips.', ta: 'குடும்பம், ஆன்மீகம் அல்லது கார்ப்பரேட் பயணங்களுக்கான நெகிழ்வான திட்டங்கள்.' },
  'trust.coverage': { en: 'Tamil Nadu-Wide Service Coverage', ta: 'தமிழ்நாடு முழுவதுமான சேவை' },
  'trust.coverageDesc': { en: 'Comprehensive pickup, drops, and sightseeing across all 38 districts of Tamil Nadu.', ta: 'தமிழ்நாட்டின் 38 மாவட்டங்களிலும் பிக்கப், டிராப் மற்றும் சுற்றுலா சேவை.' },
  'trust.booking': { en: 'Convenient Booking Enquiries', ta: 'எளிதான முன்பதிவு விசாரணைகள்' },
  'trust.bookingDesc': { en: 'Instant online quotations and direct WhatsApp coordination with our trip specialists.', ta: 'உடனடி ஆன்லைன் மதிப்பீடு மற்றும் நேரடி வாட்ஸ்அப் உதவி.' },
  'trust.solutions': { en: 'Group Travel Solutions', ta: 'முழுமையான குழுப் பயணத் தீர்வுகள்' },
  'trust.solutionsDesc': { en: 'Dedicated solutions for families, colleges, weddings, temple yatras, and business teams.', ta: 'குடும்பங்கள், கல்லூரிகள், திருமணங்கள் மற்றும் ஆன்மீக குழுக்களுக்கான தீர்வுகள்.' },

  // Fleet Section
  'fleet.title': { en: 'Our Fleet of 5 Tourist Vans', ta: 'எங்கள் 5 சொகுசு வேன்கள்' },
  'fleet.subtitle': { en: 'Choose from 17, 18, 19, 21, and 22-passenger capacities designed for comfortable long-distance travel.', ta: 'நீண்ட தூர பயணங்களுக்கு ஏற்ற 17, 18, 19, 21 மற்றும் 22 பயணிகள் கொண்ட வேன்கள்.' },
  'fleet.capacity': { en: 'Passenger Capacity', ta: 'பயணிகள் கொள்ளளவு' },
  'fleet.passengers': { en: 'Passengers', ta: 'பயணிகள்' },
  'fleet.viewAll': { en: 'View All Vehicles', ta: 'அனைத்து வாகனங்களையும் காண்க' },
  'fleet.requestBooking': { en: 'Request Booking', ta: 'முன்பதிவு கோர' },
  'fleet.details': { en: 'View Vehicle Details', ta: 'வாகன விவரங்கள்' },

  // Destinations Section
  'dest.title': { en: 'Popular Destinations in Tamil Nadu', ta: 'தமிழ்நாட்டின் புகழ்பெற்ற சுற்றுலாத் தலங்கள்' },
  'dest.subtitle': { en: 'From misty hill stations to sacred temples and tranquil coastlines, discover the jewel of South India.', ta: 'பனிமூட்ட மலைகள் முதல் புண்ணிய கோயில்கள் மற்றும் கடற்கரைகள் வரை கண்டு மகிழுங்கள்.' },
  'dest.exploreTrip': { en: 'Explore Trip', ta: 'சுற்றுலாவை ஆராயுங்கள்' },
  'dest.viewAll': { en: 'Explore All Destinations', ta: 'அனைத்து தலங்களையும் காண்க' },

  // Packages Section
  'packages.title': { en: 'Curated Tour Packages', ta: 'சிறப்பு சுற்றுலாத் தொகுப்புகள்' },
  'packages.subtitle': { en: 'Handpicked routes and itineraries designed for unforgettable family holidays and group expeditions.', ta: 'குடும்ப விடுமுறைகள் மற்றும் குழுப் பயணங்களுக்கான சிறப்பு திட்டங்கள்.' },
  'packages.viewAll': { en: 'View All Tour Packages', ta: 'அனைத்து தொகுப்புகளையும் காண்க' },
  'packages.explore': { en: 'View Package Details', ta: 'விவரங்களை காண்க' },

  // Common UI
  'common.learnMore': { en: 'Learn More', ta: 'மேலும் அறிய' },
  'common.contactUs': { en: 'Contact Us', ta: 'தொடர்புகொள்ள' },
  'common.whatsappUs': { en: 'Chat on WhatsApp', ta: 'வாட்ஸ்அப்பில் பேச' },
  'common.callUs': { en: 'Call for Enquiry', ta: 'அழைத்து விசாரிக்க' },
  'common.perKm': { en: 'per km', ta: 'ஒரு கி.மீ-க்கு' },
  'common.startingFrom': { en: 'Starting from', ta: 'தொடக்க விலை' },
  'common.requestQuote': { en: 'Request a Quote', ta: 'விலை மதிப்பீடு கோர' },
  'common.verifiedVehicle': { en: 'Clean & Sanitized Fleet', ta: 'சுத்தமான சொகுசு வாகனம்' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sks_lang');
    return (saved === 'ta' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sks_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // Fallback to English or key itself
    return translations[key]?.en || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
