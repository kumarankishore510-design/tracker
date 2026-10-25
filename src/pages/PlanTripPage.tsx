import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Bus,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Phone,
  Mail,
  User,
  Info,
} from 'lucide-react';
import { Vehicle, Destination, PricingRule, QuotationBreakdown, Booking } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { tamilNaduDistricts } from '../data/districts';
import { calculateDaysBetween, getTodayDateString, getTomorrowDateString, formatDate } from '../utils/dateUtils';
import { createWhatsAppUrl } from '../utils/whatsapp';
import { SEO } from '../components/common/SEO';

export const PlanTripPage: React.FC = () => {
  const { settings } = useSettings();
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [pricingRule, setPricingRule] = useState<PricingRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields
  const [pickupLocation, setPickupLocation] = useState(searchParams.get('pickup') || 'Chennai');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    searchParams.get('destination') ? [searchParams.get('destination')!] : ['Ooty (Udhagamandalam)']
  );
  const [intermediateStops, setIntermediateStops] = useState<string[]>([]);
  const [newStopInput, setNewStopInput] = useState('');
  const [departureDate, setDepartureDate] = useState(searchParams.get('departureDate') || getTodayDateString());
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || getTomorrowDateString());
  const [passengerCount, setPassengerCount] = useState<number>(
    parseInt(searchParams.get('passengers') || '16', 10)
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(searchParams.get('vehicleId') || '');
  const [autoRecommend, setAutoRecommend] = useState(!searchParams.get('vehicleId'));

  // Customer Contact Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Availability & Calculation state
  const [isVehicleAvailable, setIsVehicleAvailable] = useState<boolean>(true);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');
  const [quotation, setQuotation] = useState<QuotationBreakdown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [vList, dList, pRule] = await Promise.all([
          api.getVehicles(),
          api.getDestinations(),
          api.getPricingRule(),
        ]);
        setVehicles(vList);
        setDestinations(dList);
        setPricingRule(pRule);

        // Auto select best vehicle if none selected
        if (!selectedVehicleId) {
          const suitable = vList.filter((v) => v.capacity >= passengerCount).sort((a, b) => a.capacity - b.capacity);
          if (suitable.length > 0) {
            setSelectedVehicleId(suitable[0]!.id);
          } else if (vList.length > 0) {
            setSelectedVehicleId(vList[vList.length - 1]!.id);
          }
        }
      } catch (err) {
        console.error('Error loading trip planner data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Update recommended vehicle whenever passenger count changes and autoRecommend is enabled
  useEffect(() => {
    if (autoRecommend && vehicles.length > 0) {
      const suitable = vehicles.filter((v) => v.capacity >= passengerCount).sort((a, b) => a.capacity - b.capacity);
      if (suitable.length > 0) {
        setSelectedVehicleId(suitable[0]!.id);
      } else {
        setSelectedVehicleId(vehicles[vehicles.length - 1]!.id);
      }
    }
  }, [passengerCount, autoRecommend, vehicles]);

  // Recalculate quotation and check availability whenever relevant fields change
  useEffect(() => {
    if (!selectedVehicleId || !departureDate || !returnDate || vehicles.length === 0) return;

    const checkAndCalculate = async () => {
      // 1. Check vehicle availability
      const avail = await api.checkVehicleAvailability(selectedVehicleId, departureDate, returnDate);
      setIsVehicleAvailable(avail.isAvailable);
      setAvailabilityMessage(avail.message);

      // 2. Estimate distance: base 180 km per day or approximate destination distance
      const totalDays = calculateDaysBetween(departureDate, returnDate);
      // Rough distance lookup
      let estimatedDistance = 350 * totalDays; // standard roundtrip tour daily distance
      const targetDest = destinations.find((d) => selectedDestinations.includes(d.name) || selectedDestinations.includes(d.slug));
      if (targetDest && targetDest.distanceFromChennai) {
        estimatedDistance = Math.max(targetDest.distanceFromChennai * 2, totalDays * 250);
      }

      // 3. Calculate estimate
      const quote = await api.calculateEstimate(selectedVehicleId, estimatedDistance, totalDays);
      setQuotation(quote);
    };

    checkAndCalculate();
  }, [selectedVehicleId, departureDate, returnDate, selectedDestinations, destinations, vehicles]);

  // Total trip days
  const totalDays = calculateDaysBetween(departureDate, returnDate);
  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Add intermediate stop
  const handleAddStop = () => {
    if (newStopInput.trim() && !intermediateStops.includes(newStopInput.trim())) {
      setIntermediateStops([...intermediateStops, newStopInput.trim()]);
      setNewStopInput('');
    }
  };

  const handleRemoveStop = (index: number) => {
    setIntermediateStops(intermediateStops.filter((_, i) => i !== index));
  };

  // Toggle multi-destination
  const handleToggleDestination = (destName: string) => {
    if (selectedDestinations.includes(destName)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter((d) => d !== destName));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, destName]);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    // Form validations
    if (!customerName.trim()) {
      setErrorNotice('Please provide your full name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorNotice('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (returnDate < departureDate) {
      setErrorNotice('Return date cannot be earlier than departure date.');
      return;
    }

    if (!activeVehicle) {
      setErrorNotice('Please select a vehicle from our fleet.');
      return;
    }

    if (passengerCount > activeVehicle.capacity) {
      setErrorNotice(
        `Selected van capacity (${activeVehicle.capacity} seats) is less than your group size (${passengerCount} passengers). Please choose a larger van.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const destinationSummary = selectedDestinations.join(' & ');
      const newBooking = await api.createBooking({
        bookingRef: '', // backend will generate unique SKS-YYYYMM-XXXX
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        pickupLocation: pickupLocation.trim(),
        dropLocation: destinationSummary,
        intermediateStops,
        departureDate,
        returnDate,
        totalDays,
        passengerCount,
        vehicleId: activeVehicle.id,
        vehicleName: activeVehicle.name,
        estimatedDistanceKm: quotation?.billedKm || totalDays * 250,
        quotationAmount: quotation?.estimatedTotal,
        quotationBreakdown: quotation || undefined,
        specialRequirements: specialRequirements.trim() || undefined,
        status: 'New Enquiry',
      });

      setSubmittedBooking(newBooking);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#102A43] border-t-[#F28C28] rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-700">Loading Smart Trip Planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <SEO
        title="Smart Trip Planner — SKS Travels Tamil Nadu"
        description="Plan your customized group road trip across Tamil Nadu. Select pickup, destinations, intermediate stops, and get instant vehicle capacity matching & transparent quotation estimates."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#F28C28] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Trip Planner & Quotation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#102A43] tracking-tight">
            Design Your Tamil Nadu Journey
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Configure your pickup location, desired destinations, stops, dates, and group size. Receive a transparent quotation breakdown and instant WhatsApp booking summary.
          </p>
        </div>

        {/* Success Modal / Confirmation View */}
        {submittedBooking ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 max-w-3xl mx-auto text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Enquiry Successfully Registered
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
                Thank You, {submittedBooking.customerName}!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your trip enquiry has been logged with reference number:
              </p>
              <div className="inline-block bg-slate-100 border border-slate-300 font-mono text-lg font-bold text-[#102A43] px-5 py-2 rounded-xl mt-1">
                {submittedBooking.bookingRef}
              </div>
            </div>

            {/* Trip Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 text-xs space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block font-semibold">Vehicle</span>
                  <strong className="text-slate-800 text-sm">{submittedBooking.vehicleName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Group Size</span>
                  <strong className="text-slate-800 text-sm">{submittedBooking.passengerCount} Passengers</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Duration</span>
                  <strong className="text-slate-800 text-sm">{submittedBooking.totalDays} Days</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Estimated Total</span>
                  <strong className="text-[#102A43] text-sm">
                    {submittedBooking.quotationAmount
                      ? `₹${submittedBooking.quotationAmount.toLocaleString('en-IN')}`
                      : 'Quotation Pending'}
                  </strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Route Planned:</span>
                <p className="font-semibold text-slate-800">
                  {submittedBooking.pickupLocation} ➔ {submittedBooking.dropLocation}
                  {submittedBooking.intermediateStops && submittedBooking.intermediateStops.length > 0
                    ? ` (via ${submittedBooking.intermediateStops.join(', ')})`
                    : ''}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Please note: This is an estimated trip quotation. Booking will be confirmed once travel arrangements are reviewed by an SKS administrator.
                </span>
              </div>
            </div>

            {/* Actions: Send WhatsApp & Track */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={createWhatsAppUrl({
                  bookingRef: submittedBooking.bookingRef,
                  customerName: submittedBooking.customerName,
                  customerPhone: submittedBooking.customerPhone,
                  pickupLocation: submittedBooking.pickupLocation,
                  dropLocation: submittedBooking.dropLocation,
                  intermediateStops: submittedBooking.intermediateStops,
                  departureDate: submittedBooking.departureDate,
                  returnDate: submittedBooking.returnDate,
                  totalDays: submittedBooking.totalDays,
                  passengerCount: submittedBooking.passengerCount,
                  vehicleName: submittedBooking.vehicleName,
                  estimatedKm: submittedBooking.estimatedDistanceKm,
                  estimatedTotal: submittedBooking.quotationAmount,
                  specialRequirements: submittedBooking.specialRequirements,
                  businessWhatsAppNumber: settings.whatsappNumber,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg flex items-center justify-center space-x-2 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Trip Summary via WhatsApp</span>
              </a>

              <Link
                to={`/booking?ref=${submittedBooking.bookingRef}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#102A43] bg-slate-100 hover:bg-slate-200 text-sm text-center"
              >
                Track Booking Status
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-step Planner Form */
          <form onSubmit={handleSubmit}>
            {errorNotice && (
              <div className="max-w-4xl mx-auto mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center space-x-3 text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Journey & Passenger Details */}
              <div className="lg:col-span-7 space-y-8">
                {/* Section 1: Pickup & Destinations */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#102A43]">Route & Destinations</h2>
                      <p className="text-xs text-slate-500">
                        Choose your pickup city anywhere in Tamil Nadu and select single or multiple stops.
                      </p>
                    </div>
                  </div>

                  {/* Pickup Dropdown / Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      1. Pickup Location in Tamil Nadu *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#F28C28] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="e.g. Chennai, Madurai, Coimbatore, Trichy..."
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Destinations selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      2. Destination(s) to Visit *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {destinations.slice(0, 12).map((dest) => {
                        const isSelected = selectedDestinations.includes(dest.name);
                        return (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => handleToggleDestination(dest.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-[#102A43] text-white border-[#102A43] shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="mr-1 text-[#F28C28]">✓</span>}
                            <span>{dest.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Tip: You can select multiple destinations to create a custom circuit (e.g. Madurai + Rameswaram + Kanyakumari).
                    </p>
                  </div>

                  {/* Intermediate Stops */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      3. Intermediate Stops (Optional)
                    </label>
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={newStopInput}
                        onChange={(e) => setNewStopInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddStop();
                          }
                        }}
                        placeholder="Add waypoints (e.g. Palani Temple, Salem bypass, Pichavaram)"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                      />
                      <button
                        type="button"
                        onClick={handleAddStop}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {intermediateStops.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {intermediateStops.map((stop, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center space-x-1.5 bg-orange-50 border border-orange-200 text-[#102A43] text-xs font-semibold px-2.5 py-1 rounded-lg"
                          >
                            <span>{stop}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveStop(i)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Dates & Group Capacity */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#102A43]">Dates & Passengers</h2>
                      <p className="text-xs text-slate-500">
                        Choose departure and return dates, and specify passenger count.
                      </p>
                    </div>
                  </div>

                  {/* Travel Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Departure Date *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="date"
                          min={getTodayDateString()}
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Return Date *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="date"
                          min={departureDate}
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Calculated Duration:</span>
                    <strong className="text-[#102A43] font-bold text-sm">
                      {totalDays} Day{totalDays > 1 ? 's' : ''} ({formatDate(departureDate)} to {formatDate(returnDate)})
                    </strong>
                  </div>

                  {/* Passenger Count Slider & Matcher */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Passenger Count:
                      </label>
                      <span className="text-base font-extrabold text-[#F28C28] bg-orange-50 px-3 py-0.5 rounded-lg border border-orange-200">
                        {passengerCount} Passengers
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="22"
                      value={passengerCount}
                      onChange={(e) => {
                        setPassengerCount(parseInt(e.target.value, 10));
                        setAutoRecommend(true);
                      }}
                      className="w-full accent-[#F28C28] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1 passenger</span>
                      <span>17-Seater</span>
                      <span>18-Seater</span>
                      <span>19-Seater</span>
                      <span>21-Seater</span>
                      <span>22-Seater</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Vehicle Selection */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#102A43]">Select Your Tourist Van</h2>
                        <p className="text-xs text-slate-500">
                          Choose from our 5 passenger capacities or let the system recommend one.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 hidden sm:inline">Fleet: 5 vans</span>
                  </div>

                  {/* Vehicle Radio Cards */}
                  <div className="space-y-3">
                    {vehicles.map((v) => {
                      const isSelected = selectedVehicleId === v.id;
                      const hasSufficientCapacity = v.capacity >= passengerCount;

                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setSelectedVehicleId(v.id);
                            setAutoRecommend(false);
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isSelected
                              ? 'border-[#F28C28] bg-orange-50/40 shadow-md ring-2 ring-[#F28C28]/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={v.image}
                              alt={v.name}
                              className="w-20 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{v.name}</h3>
                                {v.capacity >= passengerCount && (
                                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                    Fits Group
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{v.model}</p>
                              <div className="flex items-center space-x-3 text-xs text-slate-600 mt-1">
                                <span className="font-semibold text-[#102A43]">
                                  {v.capacity} Passengers
                                </span>
                                <span>•</span>
                                <span>{v.acType.split(' ')[0]} AC</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {v.pricing?.perKmRate ? (
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">Rate</span>
                                <div className="text-sm font-bold text-[#102A43]">₹{v.pricing.perKmRate} / km</div>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-[#F28C28]">Quote Only</span>
                            )}

                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-[#F28C28] bg-[#F28C28] text-white'
                                  : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Availability Notice for Selected Vehicle */}
                  {activeVehicle && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2.5 ${
                        isVehicleAvailable
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      {isVehicleAvailable ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>{activeVehicle.name}</strong> is available for your travel dates (
                            {formatDate(departureDate)} to {formatDate(returnDate)}).
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{availabilityMessage}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Section 4: Customer Contact Info */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#102A43]">Customer Contact Information</h2>
                      <p className="text-xs text-slate-500">
                        Where should we send your booking quotation reference?
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number * (for WhatsApp quote)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 98401 23456"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. ramesh.kumar@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      placeholder="e.g. Senior citizens travelling, heavy luggage bags, AC preference, music system required, or early morning start..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F28C28] bg-slate-50/50"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Trip Summary & Quotation Breakdown */}
              <div className="lg:col-span-5 sticky top-24 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-[#172B4D] space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#102A43]">Trip Summary</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Estimated breakdown before submission</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F28C28] flex items-center justify-center">
                      <Calculator className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Route Overview */}
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1"></div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Pickup:</span>
                        <strong className="text-slate-900">{pickupLocation}</strong>
                      </div>
                    </div>

                    {intermediateStops.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1"></div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Intermediate Stops:</span>
                          <span className="text-slate-700 font-medium">{intermediateStops.join(', ')}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1"></div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Destination(s):</span>
                        <strong className="text-slate-900">{selectedDestinations.join(' & ')}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-semibold">Dates:</span>
                        <span className="font-semibold text-slate-800">
                          {formatDate(departureDate)} - {formatDate(returnDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Vehicle:</span>
                        <span className="font-semibold text-slate-800">
                          {activeVehicle?.name} ({activeVehicle?.capacity} Seats)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quotation Calculator Breakdown */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                      Estimated Cost Breakdown:
                    </span>

                    {quotation ? (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>
                            Base Distance ({quotation.billedKm} km @ ₹{quotation.ratePerKm}/km):
                          </span>
                          <span className="font-semibold text-slate-900">
                            ₹{quotation.baseKmCharge.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex justify-between text-slate-600">
                          <span>Driver Allowance ({totalDays} days):</span>
                          <span className="font-semibold text-slate-900">
                            ₹{quotation.driverAllowance.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {quotation.nightHaltCharge > 0 && (
                          <div className="flex justify-between text-slate-600">
                            <span>Night Halt Charges ({totalDays - 1} nights):</span>
                            <span className="font-semibold text-slate-900">
                              ₹{quotation.nightHaltCharge.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between text-slate-600">
                          <span>Toll & Parking Estimate:</span>
                          <span className="font-semibold text-slate-900">
                            ₹{quotation.tollParkingEstimate.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                          <div>
                            <span className="text-xs text-slate-500 font-semibold uppercase">Estimated Trip Total</span>
                            <span className="block text-[10px] text-amber-600 font-bold">
                              * Transparent estimate (no double-counting)
                            </span>
                          </div>
                          <div className="text-xl font-extrabold text-[#102A43]">
                            ₹{quotation.estimatedTotal.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-2 text-center text-slate-500">
                        <p className="font-semibold text-slate-700">Official Quotation Upon Request</p>
                        <p className="text-[11px] mt-0.5">
                          Custom pricing rules apply for this itinerary. Submit below for our best group rate.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submission Notice */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                    <span>
                      Quotations are tentative estimates until reviewed by SKS Travels operations. We do not charge advance payment until travel dates and routes are verified.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-bold text-white bg-[#F28C28] hover:bg-[#D47112] shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center space-x-2 text-base disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span>Submitting Enquiry...</span>
                    ) : (
                      <>
                        <span>Submit Trip Quotation Request</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
