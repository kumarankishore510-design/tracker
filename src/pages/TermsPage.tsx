import React from 'react';
import { FileText } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-16">
      <SEO title={`Terms & Conditions — ${settings.companyName}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-2 text-[#F28C28] text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" />
              <span>Rental Agreement Terms</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#102A43]">Terms of Service</h1>
            <p className="text-xs text-slate-400 mt-1">Operating Standards across all 38 Tamil Nadu Districts</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">1. Enquiry vs. Confirmed Booking</h2>
            <p>
              Submission of an enquiry through our online Trip Planner or WhatsApp channel generates an initial quotation. Travel is formally confirmed only when travel dates, vehicle availability, and initial deposit terms have been mutually approved by {settings.companyName} operations.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">2. Distance & Billing Structure</h2>
            <p>
              Trip quotations are structured based on either actual distance or the standard regional minimum billable threshold of <strong>250 kilometers per calendar day</strong> (whichever is greater). Kilometers and hours are measured from the agreed garage/pickup point to final drop-off.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">3. Tolls, Parking & State Permits</h2>
            <p>
              National and state highway toll charges, temple/monument parking tickets, and local municipal entry permits are payable as incurred. Where included in a package quote, these will be clearly demarcated in your quotation summary.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">4. Driver Duty & Night-Halt Guidelines</h2>
            <p>
              For group safety, continuous driving is regulated in accordance with commercial transport safety norms. Night-halt charges apply whenever an itinerary requires overnight stay away from the departure base city.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">5. Luggage & Vehicle Capacity Compliance</h2>
            <p>
              Passenger occupancy must not exceed the vehicle’s registered seating capacity (17, 18, 19, 21, or 22 seats). Chauffeurs are authorized to decline boarding excess passengers to uphold road transport regulations and passenger insurance validity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
