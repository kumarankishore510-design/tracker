import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Edit,
  Printer,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  Phone,
  Bus,
} from 'lucide-react';
import { Booking, BookingStatus, Vehicle } from '../../types';
import { api } from '../../services/api';
import { SEO } from '../../components/common/SEO';
import { formatDate } from '../../utils/dateUtils';
import { useSettings } from '../../context/SettingsContext';
import { createWhatsAppUrl } from '../../utils/whatsapp';

export const AdminBookingsPage: React.FC = () => {
  const { settings } = useSettings();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<BookingStatus>('New Enquiry');
  const [modalPrice, setModalPrice] = useState<number>(0);
  const [modalNotes, setModalNotes] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calendar month state
  const [calendarDate, setCalendarDate] = useState(new Date());

  const statuses: BookingStatus[] = [
    'New Enquiry',
    'Quotation Sent',
    'Awaiting Confirmation',
    'Confirmed',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const [bList, vList] = await Promise.all([api.getBookings(), api.getVehicles()]);
      setBookings(bList);
      setVehicles(vList);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenEdit = (b: Booking) => {
    setSelectedBooking(b);
    setModalStatus(b.status);
    setModalPrice(b.quotationAmount || 0);
    setModalNotes(b.adminNotes || '');
    setModalError(null);
    setEditModalOpen(true);
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setIsUpdating(true);
    setModalError(null);

    try {
      const updated = await api.updateBooking(selectedBooking.id, {
        status: modalStatus,
        quotationAmount: modalPrice || undefined,
        adminNotes: modalNotes.trim() || undefined,
      });

      setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
      setEditModalOpen(false);
    } catch (err: any) {
      setModalError(err.message || 'Failed to update booking status.');
    } finally {
      setIsUpdating(false);
    }
  };

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

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.dropLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calendar logic
  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(currentYear, currentMonth + 1, 1));

  return (
    <div className="space-y-8">
      <SEO title="Bookings & Calendar — SKS Admin Console" />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
            Bookings & Availability Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, quote, and prevent overlapping confirmed trips across all 5 fleet vans.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle: List vs Calendar */}
          <div className="inline-flex rounded-xl p-1 bg-white border border-slate-200 shadow-sm text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#102A43] shadow-sm"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search booking ref, customer, route..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-[#102A43] text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({bookings.length})
          </button>
          {statuses.map((st) => {
            const count = bookings.filter((b) => b.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-[#F28C28] text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode 1: List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Route & Dates</th>
                  <th className="px-6 py-4">Vehicle Assigned</th>
                  <th className="px-6 py-4">Quotation Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No bookings matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-900 block">{b.bookingRef}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(b.createdAt.slice(0, 10))}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <strong className="text-slate-900 block font-bold">{b.customerName}</strong>
                        <span className="text-slate-500 text-[11px] block">{b.customerPhone}</span>
                        {b.customerEmail && (
                          <span className="text-slate-400 text-[10px] block truncate max-w-[140px]">
                            {b.customerEmail}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">
                          {b.pickupLocation} ➔ {b.dropLocation}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {formatDate(b.departureDate)} to {formatDate(b.returnDate)} ({b.totalDays} days)
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900 block">{b.vehicleName}</span>
                        <span className="text-[11px] text-slate-500">{b.passengerCount} Passengers</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {b.quotationAmount ? `₹${b.quotationAmount.toLocaleString('en-IN')}` : 'Quote Needed'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : b.status === 'New Enquiry'
                              ? 'bg-amber-100 text-amber-800'
                              : b.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="px-3 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold transition-colors inline-flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#102A43]">
              {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCalendarDate(new Date())}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-700"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for first week offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] p-2 bg-slate-50/50 rounded-2xl border border-slate-100 opacity-40"></div>
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              // Find bookings that cover this day
              const dayBookings = bookings.filter((b) => b.departureDate <= dayString && b.returnDate >= dayString);

              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

              return (
                <div
                  key={day}
                  className={`min-h-[100px] p-2.5 rounded-2xl border flex flex-col justify-between transition-colors ${
                    isToday ? 'border-[#F28C28] bg-orange-50/20' : 'border-slate-200/80 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-extrabold ${isToday ? 'text-[#F28C28]' : 'text-slate-800'}`}>
                      {day}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayBookings.length} trip{dayBookings.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-16 scrollbar-none">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => handleOpenEdit(b)}
                        className={`p-1 rounded text-[10px] font-bold truncate cursor-pointer ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                        title={`${b.bookingRef}: ${b.customerName} - ${b.vehicleName} (${b.pickupLocation} to ${b.dropLocation})`}
                      >
                        {b.vehicleName.split(' ')[1]}: {b.customerName.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Booking & Update Status Modal */}
      {editModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="bg-[#102A43] text-white p-6 relative">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block mb-1">
                Booking Management
              </span>
              <h2 className="text-xl font-bold font-mono">{selectedBooking.bookingRef}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Customer: {selectedBooking.customerName} ({selectedBooking.customerPhone})
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBooking} className="p-6 space-y-5">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Trip Details Info Block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <strong className="text-slate-800">
                    {selectedBooking.pickupLocation} ➔ {selectedBooking.dropLocation}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Travel Dates:</span>
                  <span className="text-slate-800 font-semibold">
                    {formatDate(selectedBooking.departureDate)} to {formatDate(selectedBooking.returnDate)} ({selectedBooking.totalDays} Days)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <strong className="text-slate-800">{selectedBooking.vehicleName}</strong>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Update Booking Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as BookingStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {modalStatus === 'Confirmed' && (
                  <p className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      Setting to 'Confirmed' validates that no overlapping trip exists for {selectedBooking.vehicleName}.
                    </span>
                  </p>
                )}
              </div>

              {/* Price Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quotation Amount (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={modalPrice}
                  onChange={(e) => setModalPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrator Notes & Chauffeur Assignment
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Assigned Senior Driver Murugan, advance payment verified, vehicle sanitized..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow"
                  >
                    {isUpdating ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
