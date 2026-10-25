import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Bus,
  TrendingUp,
  Download,
  Calendar,
  AlertCircle,
  ArrowRight,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { Booking, Vehicle } from '../../types';
import { api } from '../../services/api';
import { SEO } from '../../components/common/SEO';
import { formatDate } from '../../utils/dateUtils';
import { useSettings } from '../../context/SettingsContext';

export const AdminDashboardPage: React.FC = () => {
  const { settings } = useSettings();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const [bList, vList] = await Promise.all([
          api.getBookings(),
          api.getVehicles(),
        ]);
        setBookings(bList);
        setVehicles(vList);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const totalEnquiries = bookings.length;
  const newEnquiries = bookings.filter((b) => b.status === 'New Enquiry').length;
  const confirmedTrips = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'In Progress').length;
  const activeFleetCount = vehicles.filter((v) => v.isAvailable).length;

  const handleExportCsv = async () => {
    const csvContent = await api.exportBookingsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SKS_Travels_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#102A43] border-t-[#F28C28] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SEO title="Overview — SKS Admin Console" />

      {/* Header and Quick CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
            Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time enquiries, vehicle scheduling, and quotation metrics across Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs text-[#102A43] bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-[#F28C28]" />
            <span>Export Bookings CSV</span>
          </button>

          <Link
            to="/admin/bookings"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#F28C28] hover:bg-[#D47112] shadow transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Booking Calendar</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Total Enquiries
            </span>
            <span className="text-3xl font-extrabold text-[#102A43] mt-1 block">
              {totalEnquiries}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">All registered trips</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#102A43] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              New Enquiries
            </span>
            <span className="text-3xl font-extrabold text-[#F28C28] mt-1 block">
              {newEnquiries}
            </span>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">Awaiting quotation review</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F28C28] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Confirmed Trips
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
              {confirmedTrips}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Vehicles reserved</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Active Van Fleet
            </span>
            <span className="text-3xl font-extrabold text-[#102A43] mt-1 block">
              {activeFleetCount} / 5
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">17 to 22 passenger vans</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#102A43] flex items-center justify-center">
            <Bus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#102A43]">Recent Trip Enquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review passenger requests and update quotation or status.
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-[#F28C28] hover:underline flex items-center space-x-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Ref & Date</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Route</th>
                <th className="px-6 py-3.5">Vehicle</th>
                <th className="px-6 py-3.5">Quotation</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">
                    <div>{b.bookingRef}</div>
                    <span className="text-[11px] text-slate-400 font-sans font-normal">
                      {formatDate(b.createdAt.slice(0, 10))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <strong className="text-slate-900 block">{b.customerName}</strong>
                    <span className="text-slate-500">{b.customerPhone}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 truncate max-w-xs">
                      {b.pickupLocation} ➔ {b.dropLocation}
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      {formatDate(b.departureDate)} ({b.totalDays} days)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 block">{b.vehicleName}</span>
                    <span className="text-slate-500">{b.passengerCount} Passengers</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {b.quotationAmount ? `₹${b.quotationAmount.toLocaleString('en-IN')}` : 'Pending'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'New Enquiry'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/admin/bookings"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#102A43] hover:text-white text-slate-700 text-xs font-bold transition-colors inline-block"
                    >
                      Manage
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
