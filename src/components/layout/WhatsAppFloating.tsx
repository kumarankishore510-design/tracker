import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppFloating: React.FC = () => {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `Hello SKS Travels! I'm interested in hiring a tourist van in Tamil Nadu. Could you please share quotation details?`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end space-x-2 group">
      {/* Interactive Tooltip Callout */}
      {showTooltip && (
        <div className="hidden sm:flex items-center space-x-2 bg-white text-slate-800 text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl border border-slate-100 animate-bounce duration-1000">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Quick quote on WhatsApp?</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Direct WhatsApp Enquiry"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
