import React, { useState, useEffect } from 'react';
import { Package, Search, Clock, ExternalLink } from 'lucide-react';
import { TourPackage } from '../../types';
import { api } from '../../services/api';
import { SEO } from '../../components/common/SEO';
import { Link } from 'react-router-dom';

export const AdminPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPkgs = async () => {
      try {
        setIsLoading(true);
        const data = await api.getPackages();
        setPackages(data);
      } catch (err) {
        console.error('Failed to load tour packages:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPkgs();
  }, []);

  const filtered = packages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SEO title="Tour Package Management — SKS Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
            Tour Packages Management (8 Configured Types)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain itineraries, package categories, and base pricing estimates.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search package..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Package Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Places Covered</th>
                <th className="px-6 py-4">Base Estimate</th>
                <th className="px-6 py-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold">{p.title}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">/packages/{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2.5 py-1 rounded-full bg-orange-50 text-[#F28C28] font-bold text-[10px]">
                      {p.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {p.duration}
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {p.placesCovered.join(', ')}
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">
                    {p.basePriceEstimate ? `₹${p.basePriceEstimate.toLocaleString('en-IN')}` : 'Quote Only'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/packages/${p.slug}`}
                      target="_blank"
                      className="text-[#F28C28] hover:text-[#D47112] font-bold inline-flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
