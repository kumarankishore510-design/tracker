import React, { useState, useEffect } from 'react';
import { MapPin, Search, Star, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Destination } from '../../types';
import { api } from '../../services/api';
import { SEO } from '../../components/common/SEO';
import { Link } from 'react-router-dom';

export const AdminDestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDests = async () => {
      try {
        setIsLoading(true);
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDests();
  }, []);

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SEO title="Destination Directory Management — SKS Admin Console" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
            Destination Explorer Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain curated destinations across all 38 Tamil Nadu districts.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search destination or district..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">District</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Suggested Duration</th>
                <th className="px-6 py-4">Popular Showcase</th>
                <th className="px-6 py-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold">{d.name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">/destinations/{d.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {d.district} District
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {d.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {d.suggestedDuration}
                  </td>
                  <td className="px-6 py-4">
                    {d.isPopular ? (
                      <span className="inline-flex items-center space-x-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>Homepage Showcase</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Directory</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/destinations/${d.slug}`}
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
