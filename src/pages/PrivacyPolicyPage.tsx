import React from 'react';
import { Shield } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-16">
      <SEO title={`Privacy Policy — ${settings.companyName}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-2 text-[#F28C28] text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              <span>Customer Privacy Commitment</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#102A43]">Privacy Policy</h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">1. Information We Collect</h2>
            <p>
              When you submit a quotation enquiry or use the Smart Trip Planner on the {settings.companyName} website, we collect your name, mobile phone number, optional email address, pickup location, travel destinations, passenger count, and travel dates.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">2. How We Use Your Information</h2>
            <p>
              The information you provide is strictly used for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Calculating and preparing your vehicle rental quotation.</li>
              <li>Coordinating with you via phone, SMS, and WhatsApp regarding vehicle availability and travel routes.</li>
              <li>Assigning the appropriate tourist van and verified chauffeur for your confirmed trip.</li>
              <li>Generating travel permits and toll passes as required by regional transport authorities in Tamil Nadu.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">3. Third-Party Sharing & Marketing</h2>
            <p>
              We do not sell, rent, or trade your contact information to external advertisers or telemarketers. Your details are accessible only by authorized {settings.companyName} administrators and designated chauffeurs for trip execution.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#102A43]">4. Contact & Inquiries</h2>
            <p>
              For any questions regarding your data privacy, please contact our privacy desk at{' '}
              <a href={`mailto:${settings.email}`} className="text-[#F28C28] font-semibold underline">
                {settings.email}
              </a>{' '}
              or call {settings.phone}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
