import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Users,
  Bus,
  AlertCircle,
  FileText,
  MessageCircle,
  Phone,
  Compass,
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { api } from '../services/api';
import { SEO } from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';
import { formatDate } from '../utils/dateUtils';
import { createWhatsAppUrl } from '../utils/whatsapp';

export const BookingPage: React.FC = () => {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();

  const [bookingRefInput, setBookingRefInput] = useState(searchParams.get('ref') || '');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const initialRef = searchParams.get('ref');
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [searchParams]);

  const handleSearch = async (ref: string) => {
    if (!ref.trim()) return;
    setIsSearching(true);
    setNotFound(false);
    setHasSearched(true);

    try {
      const result = await api.getBookingByRef(ref.trim());
      if (result) {
        setBooking(result);
        setNotFound(false);
      } else {
        setBooking(null);
        setNotFound(true);
      }
    } catch {
      setBooking(null);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Completed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Quotation Sent':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Awaiting Confirmation':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'New Enquiry':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <SEO
        title="Track Booking & Trip Enquiry — SKS Travels"
        description="Check your trip quotation and reservation status with SKS Travels. Track confirmed bookings, quotations, and vehicle assignments."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Booking & Enquiry Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight">
            Track Your Trip Enquiry Status
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Enter your SKS Travels enquiry reference (e.g., SKS-202610-1014) to view quotation updates and vehicle scheduling.
          </p>
        </div>

        {/* Search Bar Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(bookingRefInput);
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={bookingRefInput}
                onChange={(e) => setBookingRefInput(e.target.value)}
                placeholder="Enter Booking Reference (e.g. SKS-202610-1014)"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50 uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-white bg-[#102A43] hover:bg-[#0A1C2E] text-sm shadow transition-colors shrink-0"
            >
              {isSearching ? 'Searching...' : 'Track Enquiry'}
            </button>
          </form>

          {/* Sample quick test pill */}
          <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
            <span>Sample reference to test:</span>
            <button
              type="button"
              onClick={() => {
                setBookingRefInput('SKS-202610-1014');
                handleSearch('SKS-202610-1014');
              }}
              className="font-mono font-bold text-[#F28C28] hover:underline"
            >
              SKS-202610-1014
            </button>
          </div>
        </div>

        {/* Search Results */}
        {notFound && hasSearched && (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Booking Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We could not find an enquiry matching “{bookingRefInput}”. Please double check the code or contact support.
            </p>
          </div>
        )}

        {booking && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6 animate-fadeIn">
            {/* Top Status & Ref */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Reference Number</span>
                <span className="text-xl font-mono font-extrabold text-[#102A43]">{booking.bookingRef}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-semibold">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Travel Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-slate-400 font-semibold uppercase block">Journey Information</span>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-[#F28C28] mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-800">{booking.pickupLocation}</strong>
                    <span className="text-slate-400 mx-1.5">➔</span>
                    <strong className="text-slate-800">{booking.dropLocation}</strong>
                  </div>
                </div>
                {booking.intermediateStops && booking.intermediateStops.length > 0 && (
                  <p className="text-slate-500 pl-6">
                    Via: {booking.intermediateStops.join(', ')}
                  </p>
                )}
                <div className="flex items-center space-x-2 pt-1 pl-6 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {formatDate(booking.departureDate)} to {formatDate(booking.returnDate)} ({booking.totalDays} Days)
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-slate-400 font-semibold uppercase block">Vehicle & Party</span>
                <div className="flex items-center space-x-2 text-slate-800">
                  <Bus className="w-4 h-4 text-[#102A43]" />
                  <strong className="text-sm">{booking.vehicleName}</strong>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.passengerCount} Passengers</span>
                </div>
                <div className="pt-1 text-slate-500">
                  Customer: <strong className="text-slate-800">{booking.customerName}</strong> ({booking.customerPhone})
                </div>
              </div>
            </div>

            {/* Quotation & Notes */}
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase block">
                  {booking.status === 'Confirmed' ? 'Confirmed Trip Cost' : 'Estimated Quotation Total'}
                </span>
                <div className="text-2xl font-extrabold text-[#102A43] mt-0.5">
                  {booking.quotationAmount
                    ? `₹${booking.quotationAmount.toLocaleString('en-IN')}`
                    : 'Quotation Pending Admin Review'}
                </div>
                {booking.adminNotes && (
                  <p className="text-xs text-slate-600 mt-1 italic">
                    Note: “{booking.adminNotes}”
                  </p>
                )}
              </div>

              {/* WhatsApp Action */}
              <a
                href={createWhatsAppUrl({
                  bookingRef: booking.bookingRef,
                  customerName: booking.customerName,
                  customerPhone: booking.customerPhone,
                  pickupLocation: booking.pickupLocation,
                  dropLocation: booking.dropLocation,
                  departureDate: booking.departureDate,
                  returnDate: booking.returnDate,
                  totalDays: booking.totalDays,
                  passengerCount: booking.passengerCount,
                  vehicleName: booking.vehicleName,
                  estimatedTotal: booking.quotationAmount,
                  businessWhatsAppNumber: settings.whatsappNumber,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Operations Lead</span>
              </a>
            </div>
          </div>
        )}

        {/* CTA to plan a new trip */}
        <div className="text-center pt-6">
          <p className="text-xs text-slate-500 mb-3">Want to request a quotation for a different trip?</p>
          <Link
            to="/plan-your-trip"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] text-sm shadow transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Smart Trip Planner</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
