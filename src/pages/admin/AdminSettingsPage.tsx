import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SEO } from '../../components/common/SEO';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [formData, setFormData] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      await updateSettings(formData);
      setSuccessMsg('Company operational settings updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <SEO title="Company Settings — SKS Admin Console" />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
          Company Contact & Operating Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Keep company phone numbers, WhatsApp lines, addresses, and official business details up to date.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-[#102A43]">Brand & Taglines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Operating Districts Count</label>
              <input
                type="number"
                value={formData.operatingDistrictsCount}
                onChange={(e) =>
                  setFormData({ ...formData, operatingDistrictsCount: parseInt(e.target.value, 10) || 38 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Brand Tagline (English)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Brand Tagline (Tamil)</label>
              <input
                type="text"
                value={formData.taglineTa}
                onChange={(e) => setFormData({ ...formData, taglineTa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & WhatsApp Channels */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-[#102A43]">Communication Channels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Primary Booking Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Alternate Support Phone</label>
              <input
                type="text"
                value={formData.alternatePhone}
                onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Business WhatsApp Number *</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                required
                placeholder="+919442012345"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Format: country code + number</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Official Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Support Hours</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Office Address (English)</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Office Address (Tamil)</label>
              <textarea
                rows={2}
                value={formData.addressTa}
                onChange={(e) => setFormData({ ...formData, addressTa: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Business Registration Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-[#102A43]">Registration & Banking Placeholders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Tourism Permit Reg. No.</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">UPI ID for Advance</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3.5 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-lg flex items-center space-x-2 text-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Updating Settings...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
};
