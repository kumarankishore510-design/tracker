import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Bus,
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Trip Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate contact enquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-16">
      <SEO
        title="Contact SKS Travels — Van Hire & Tourism Support"
        description="Contact SKS Travels for tourist van bookings, route planning, and quotations across all 38 districts of Tamil Nadu. Available via Phone and WhatsApp."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" />
            <span>Customer Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight">
            Contact SKS Travels
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Have questions about passenger capacities, hill station permits, or custom itineraries? Reach our trip coordination desk directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Info & Operations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#102A43] text-white rounded-3xl p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block mb-1">
                  Direct Coordination
                </span>
                <h3 className="text-xl font-bold">Connect with Our Team</h3>
                <p className="text-xs text-slate-300 mt-1">
                  We reply promptly on WhatsApp and direct phone calls.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-200">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#F28C28] mt-1 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-semibold">Service Headquarters:</span>
                    <strong className="text-white text-sm">
                      {language === 'ta' ? settings.addressTa : settings.address}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-semibold">Primary Booking Phone:</span>
                    <a href={`tel:${settings.phone}`} className="text-white font-bold text-sm hover:underline">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                {settings.alternatePhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block font-semibold">Alternate Line:</span>
                      <a href={`tel:${settings.alternatePhone}`} className="text-white hover:underline">
                        {settings.alternatePhone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-semibold">Email:</span>
                    <a href={`mailto:${settings.email}`} className="text-white hover:underline break-all">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-semibold">Support Hours:</span>
                    <span className="text-white">{settings.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Pill */}
              <div className="pt-4 border-t border-white/10">
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                    'Hello SKS Travels, I would like to get more information about your tourist van rental services.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow flex items-center justify-center space-x-2 text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Service Coverage Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-xs space-y-2">
              <div className="flex items-center space-x-2 text-[#102A43] font-bold">
                <Bus className="w-4 h-4 text-[#F28C28]" />
                <span>Coverage Across 38 Districts</span>
              </div>
              <p className="text-slate-500">
                Doorstep pickup from Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli, Vellore, and all towns throughout Tamil Nadu.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#102A43]">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you, {name}. Our operations team will respond to your enquiry at {phone} promptly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="text-xs font-bold text-[#F28C28] hover:underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#102A43]">Send Us a Message</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill out the form below and we will get back to you with custom details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anandha Krishnan"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 98401 23456"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. anand@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Enquiry Topic
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                    >
                      <option value="Trip Enquiry">Tourist Van Quotation</option>
                      <option value="Vehicle Capacities">Vehicle Seating Capacity</option>
                      <option value="Tour Packages">Custom Tour Package</option>
                      <option value="College/School Excursion">Institutional Tour</option>
                      <option value="Corporate Offsite">Corporate Travel</option>
                      <option value="Other">Other Enquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message / Travel Requirement *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your travel dates, pickup city, destination, and passenger count..."
                    required
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] shadow-lg text-sm flex items-center justify-center space-x-2 transition-colors disabled:opacity-75"
                >
                  <Send className="w-4 h-4 text-[#F28C28]" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
