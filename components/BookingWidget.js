'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Check, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getIstTodayString, formatLocalDateString } from '@/lib/date-utils';

export default function BookingWidget({ onBackToHome }) {
  // Calendar Dates: 5 days starting today
  const calendarDates = useMemo(() => {
    const dates = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      // Format to local date string matching database format YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const isoString = `${year}-${month}-${day}`;

      dates.push({
        isoString,
        dayOfWeek: daysOfWeek[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()]
      });
    }
    return dates;
  }, []);

  // System states
  const [selectedDateIso, setSelectedDateIso] = useState(calendarDates[0].isoString);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [loading, setLoading] = useState(true);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [turfDetails, setTurfDetails] = useState(null);
  const [config, setConfig] = useState(null);
  
  // Checkout flow states
  const [step, setStep] = useState(1); // 1: Schedule, 2: Customer Details, 3: Payment Screen
  const [checkoutStatus, setCheckoutStatus] = useState('idle'); // 'idle' | 'processing' | 'done'
  const [processingStep, setProcessingStep] = useState('');
  
  // Form input fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // Error/Success and ticket records
  const [error, setError] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // 1. Fetch Dynamic Configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (data.success) {
          setConfig(data.data);
          if (data.data.turfDetails) {
            setTurfDetails(data.data.turfDetails);
            setBookingEnabled(data.data.bookingEnabled !== false);
          }
        }
      } catch (err) {
        console.error('Failed to load turf configuration:', err);
      }
    };
    fetchConfig();
  }, []);

  // 2. Load Razorpay script dynamically if checkout mode is active
  useEffect(() => {
    if (config?.paymentMode === 'razorpay') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [config]);

  // 3. Fetch Database Slots for Selected Date
  useEffect(() => {
    let active = true;
    const fetchSlots = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/slots?date=${selectedDateIso}`);
        const data = await response.json();
        if (active) {
          if (response.ok && data.success) {
            setSlots(data.data);
            if (data.data.length === 0) {
              setError('No slots generated for this date in the database.');
            }
          } else {
            setError(data.message || 'Failed to fetch slots.');
          }
        }
      } catch (err) {
        if (active) {
          setError('Network connection error: Could not reach the slot manager.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSlots();
    return () => {
      active = false;
    };
  }, [selectedDateIso]);

  // 4. Consecutive Slot Selector Logic
  const handleSlotClick = (slot) => {
    if (slot.is_booked || !bookingEnabled) return;
    const isAlreadySelected = selectedSlots.some(s => s.id === slot.id);
    
    if (isAlreadySelected) {
      // Allow deselecting slot
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
      return;
    }

    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    // Enforce consecutive bookings
    const sortedSelected = [...selectedSlots, slot].sort((a, b) => a.start_time.localeCompare(b.start_time));
    let isConsecutive = true;
    for (let i = 0; i < sortedSelected.length - 1; i++) {
      if (sortedSelected[i].end_time !== sortedSelected[i+1].start_time) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive) {
      setSelectedSlots(sortedSelected);
    } else {
      // Start a new selection if not consecutive
      setSelectedSlots([slot]);
    }
  };

  // 5. Categorize slots dynamically based on start hour
  const categorizedSlots = useMemo(() => {
    return slots.map(slot => {
      const startHour = parseInt(slot.start_time.split(':')[0]);
      let category = 'Morning';
      if (startHour >= 12 && startHour < 16) {
        category = 'Afternoon';
      } else if (startHour >= 16 && startHour < 21) {
        category = 'Evening';
      } else if (startHour >= 21 || startHour < 6) {
        category = 'Night';
      }

      // Pro LED lights premium check for evening/night sessions
      const isPeak = startHour >= 16 && startHour < 22;

      return {
        ...slot,
        category,
        isPeak
      };
    });
  }, [slots]);

  // 6. Filter categories
  const filteredSlots = useMemo(() => {
    if (selectedCategory === 'All') return categorizedSlots;
    return categorizedSlots.filter(s => s.category === selectedCategory);
  }, [categorizedSlots, selectedCategory]);

  // 7. Pricing Summary calculations
  const priceCalculation = useMemo(() => {
    const totalAmount = selectedSlots.reduce((sum, slot) => sum + parseFloat(slot.price), 0);
    return {
      finalTotal: totalAmount,
      hourCount: selectedSlots.length
    };
  }, [selectedSlots]);

  // 8. Details form submission validation
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || name.trim().length < 2) {
      setError('Please enter a valid Customer Name (minimum 2 characters).');
      return;
    }
    
    const cleanedPhone = phone.trim().replace(/\s+/g, '').replace(/[-()]/g, '');
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setStep(3);
  };

  // 9. UPI UTR payment submission logic
  const handleUpiSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanedUTR = transactionId.trim();
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(cleanedUTR)) {
      setError('Invalid UTR number. UPI Transaction ID must be exactly 12 digits.');
      return;
    }

    setCheckoutStatus('processing');
    setProcessingStep('Locking selected slot timings...');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotIds: selectedSlots.map(s => s.id),
          customerName: name,
          phone: phone,
          transactionId: cleanedUTR,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProcessingStep('Generating gate passcode stub...');
        setTimeout(() => {
          // Generate ticket object
          const dateObj = calendarDates.find(c => c.isoString === selectedDateIso) || calendarDates[0];
          const randomPin = `${Math.floor(1000 + Math.random() * 9000)}`;
          
          setGeneratedTicket({
            bookingGroupId: data.data.bookingGroupId,
            date: `${dateObj.dayOfWeek}, ${dateObj.month} ${dateObj.dayNum}, 2026`,
            slots: selectedSlots.map(s => `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`),
            accessPin: randomPin,
            price: priceCalculation.finalTotal,
          });
          setCheckoutStatus('done');
        }, 1200);
      } else {
        setError(data.message || 'Failed to submit booking request.');
        setCheckoutStatus('idle');
      }
    } catch (err) {
      setError('Server connection error. Failed to record UPI booking.');
      setCheckoutStatus('idle');
    }
  };

  // 10. Razorpay Gateway payment execution
  const handleRazorpayPayment = async () => {
    setError('');
    setCheckoutStatus('processing');
    setProcessingStep('Creating Razorpay order...');

    try {
      const orderRes = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-order',
          slotIds: selectedSlots.map(s => s.id),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize payment.');
      }

      setProcessingStep('Awaiting gateway verification...');
      const { orderId, amount: orderAmount } = orderData.data;

      const options = {
        key: config.razorpayKeyId,
        amount: orderAmount,
        currency: 'INR',
        name: turfDetails?.name || 'Runmakers Arena Box Cricket',
        description: `Booking for ${selectedDateIso}`,
        order_id: orderId,
        handler: async function (response) {
          setProcessingStep('Verifying digital signature...');
          try {
            const verifyRes = await fetch('/api/payments/razorpay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify-payment',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                slotIds: selectedSlots.map(s => s.id),
                customerName: name,
                phone: phone,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setProcessingStep('Finalizing ticket access...');
              
              const dateObj = calendarDates.find(c => c.isoString === selectedDateIso) || calendarDates[0];
              const randomPin = `${Math.floor(1000 + Math.random() * 9000)}`;

              setGeneratedTicket({
                bookingGroupId: verifyData.data.bookingGroupId,
                date: `${dateObj.dayOfWeek}, ${dateObj.month} ${dateObj.dayNum}, 2026`,
                slots: selectedSlots.map(s => `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`),
                accessPin: randomPin,
                price: priceCalculation.finalTotal,
              });
              setCheckoutStatus('done');
            } else {
              setError(verifyData.message || 'Payment signature verification failed.');
              setCheckoutStatus('idle');
            }
          } catch (err) {
            setError('Verification endpoint connection failure.');
            setCheckoutStatus('idle');
          }
        },
        prefill: {
          name: name,
          contact: phone,
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setCheckoutStatus('idle');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || 'An error occurred during order creation.');
      setCheckoutStatus('idle');
    }
  };

  const resetBooking = () => {
    setSelectedSlots([]);
    setStep(1);
    setCheckoutStatus('idle');
    setGeneratedTicket(null);
    setName('');
    setPhone('');
    setTransactionId('');
  };

  // UPI URL for QR code generation
  const upiId = config?.upiDetails?.id || config?.id || "owner@upi";
  const upiName = config?.upiDetails?.name || config?.name || "Turf Owner";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${priceCalculation.finalTotal}&cu=INR&tn=Booking for ${selectedDateIso}`;

  const turfName = turfDetails?.name || "Runmakers Arena Box Cricket";

  return (
    <div className="py-6 md:py-12 bg-transparent min-h-screen text-pitch-slate-800 font-sans text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHome}
              className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-pitch-charcoal hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
              title="Return to home page"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-150 px-2 py-0.5 rounded-md font-bold tracking-wide uppercase">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Slot Scheduler
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5">
                  5.0 ★
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-pitch-charcoal mt-1 tracking-tight">
                {turfName}
              </h1>
            </div>
          </div>

          <div className="flex gap-2 text-xs font-semibold">
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Realtime Active
            </span>
            <span className="bg-slate-100 border border-slate-200 text-pitch-slate-700 px-3 py-1.5 rounded-lg flex items-center">
              Base: ₹{turfDetails?.defaultSlotPrice || 1000}/hr
            </span>
          </div>
        </div>

        {/* STEP 1: Slot Grid Schedule Picker */}
        {step === 1 && checkoutStatus === 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
            
            {/* Left Column: Date & Slot Timings */}
            <div className="lg:col-span-8 space-y-5">

              {/* DATE PICKER */}
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 shadow-premium-soft hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase text-pitch-slate-400 tracking-wider">Select Play Date</h3>
                  <span className="text-[10px] bg-slate-100 text-pitch-slate-650 px-2 py-0.5 rounded font-bold">5 Days Open</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {calendarDates.map((date) => {
                    const isSelected = selectedDateIso === date.isoString;
                    return (
                      <button
                        key={date.isoString}
                        onClick={() => {
                          setSelectedDateIso(date.isoString);
                          setSelectedSlots([]); 
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-550 bg-emerald-500 text-white border-emerald-500 shadow-md transform scale-102 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-350 text-pitch-slate-700'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-black tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                          {date.dayOfWeek}
                        </span>
                        <span className="text-lg font-black my-0.5 leading-none">
                          {date.dayNum}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                          {date.month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SLOTS GRID */}
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 shadow-premium-soft hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase text-pitch-slate-400 tracking-wider">Select Play Timings</h3>
                  
                  {/* CATEGORY FILTER TABS */}
                  <div className="flex items-center space-x-1 bg-slate-100/50 backdrop-blur-xs p-1 rounded-lg border border-slate-200/40">
                    {['All', 'Morning', 'Afternoon', 'Evening', 'Night'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-white text-pitch-charcoal shadow-xs'
                            : 'text-pitch-slate-500 hover:text-pitch-charcoal'
                        }`}
                      >
                        {cat === 'Morning' && '🌅 '}
                        {cat === 'Afternoon' && '☀️ '}
                        {cat === 'Evening' && '🌇 '}
                        {cat === 'Night' && '🌃 '}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {!bookingEnabled && (
                  <div className="bg-red-50 text-red-800 border border-red-100 p-4 rounded-xl font-bold text-center text-xs mb-4 flex items-center justify-center gap-2">
                    ⚠️ Online checkout is temporarily disabled. You can view slot states but reservations are locked.
                  </div>
                )}

                {/* THE FLUID GRID */}
                {loading ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-sans italic animate-pulse">
                    Retrieving active slots schedule...
                  </div>
                ) : error ? (
                  <div className="py-12 text-center text-xs text-red-500 font-sans font-bold">
                    {error}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <AnimatePresence mode="popLayout">
                      {filteredSlots.map((slot) => {
                        const isBooked = slot.is_booked;
                        const isSelected = selectedSlots.some(s => s.id === slot.id);

                        return (
                          <motion.button
                            layout
                            key={slot.id}
                            disabled={isBooked}
                            onClick={() => handleSlotClick(slot)}
                            className={`relative p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between items-center cursor-pointer min-h-[72px] select-none ${
                              isBooked
                                ? 'bg-slate-50 border-slate-200 text-slate-300 pointer-events-none'
                                : isSelected
                                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/50 scale-102 font-bold'
                                  : 'bg-white/60 backdrop-blur-xs border-slate-200 hover:border-emerald-500/35 text-pitch-charcoal hover:bg-white/95 shadow-2xs'
                            }`}
                          >
                            <span className="text-xs font-black tracking-tight">{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</span>

                            <div className="mt-2 w-full flex items-center justify-between text-[8px] font-bold uppercase tracking-wider">
                              <span className={isBooked ? 'text-slate-300' : isSelected ? 'text-white/80' : 'text-slate-400'}>
                                {slot.category === 'Morning' && '🌅'}
                                {slot.category === 'Afternoon' && '☀️'}
                                {slot.category === 'Evening' && '🌇'}
                                {slot.category === 'Night' && '🌃'} {slot.category}
                              </span>
                              
                              {slot.isPeak && (
                                <span className={`px-1.5 py-0.5 rounded font-black text-[7px] ${
                                  isSelected ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  Peak
                                </span>
                              )}
                            </div>

                            {isBooked && (
                              <div className="absolute inset-0 bg-slate-50/70 flex items-center justify-center rounded-xl text-[9px] text-slate-400 font-black tracking-widest">
                                🔒 BOOKED
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}

                {filteredSlots.length === 0 && !loading && !error && (
                  <div className="py-8 text-center text-xs text-slate-400 font-sans italic">
                    No time slots match the &quot;{selectedCategory}&quot; filter.
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Checkout Summary Box */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-premium-tall p-5 relative overflow-hidden hover:border-emerald-500/20 transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400" />
                
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4 pb-2 border-b border-slate-100">
                  Reserving Stub
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center space-x-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-pitch-charcoal font-bold truncate max-w-[200px]" title={turfName}>{turfName}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-pitch-charcoal font-bold">
                      {formatLocalDateString(selectedDateIso)}
                    </span>
                  </div>
                </div>

                {selectedSlots.length > 0 ? (
                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-4 text-xs">
                    
                    <div className="p-2.5 bg-slate-100/60 border border-slate-200/60 rounded-lg flex flex-col space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Selected slots</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSlots.map(s => (
                          <span key={s.id} className="px-1.5 py-0.5 bg-white border border-slate-200 text-pitch-charcoal font-mono italic text-[9px] rounded font-bold">
                            {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-black uppercase text-pitch-slate-500">Total Price</span>
                      <span className="text-xl font-black text-pitch-charcoal">
                        ₹{priceCalculation.finalTotal}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (bookingEnabled) setStep(2);
                      }}
                      disabled={!bookingEnabled}
                      className={`w-full text-white transition-all duration-200 py-3.5 rounded-xl font-extrabold uppercase text-xs tracking-wider flex items-center justify-center cursor-pointer shadow-md mt-4 ${
                        bookingEnabled ? 'bg-pitch-charcoal hover:bg-emerald-500 active:scale-98' : 'bg-slate-300 pointer-events-none shadow-none'
                      }`}
                    >
                      <span>Proceed checkout</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    
                    <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 text-center mt-2.5">
                      <Lock className="w-3 h-3 text-slate-350" /> Secure reservation gateway
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-slate-400 italic border border-dashed border-slate-200 rounded-xl bg-white/40 backdrop-blur-xs shadow-2xs">
                    💡 Select timing blocks to calculate prices.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: Input Customer Form Details */}
        {step === 2 && checkoutStatus === 'idle' && (
          <div className="max-w-md mx-auto bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-premium-tall p-6 relative overflow-hidden my-8 animate-fade-in hover:border-emerald-500/20 transition-all duration-300">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
            <h2 className="text-lg font-black text-pitch-charcoal border-b border-slate-100 pb-3 mb-5">
              Confirm Player Details
            </h2>

            <div className="p-3 bg-slate-100/65 rounded-xl border border-slate-200/60 mb-5 text-xs text-pitch-slate-700 space-y-1.5 font-mono">
              <p><strong>Selected Date:</strong> {formatLocalDateString(selectedDateIso)}</p>
              <p><strong>Timings:</strong> {selectedSlots[0].start_time.slice(0, 5)} - {selectedSlots[selectedSlots.length - 1].end_time.slice(0, 5)}</p>
              <p><strong>Total Due:</strong> ₹{priceCalculation.finalTotal}</p>
            </div>

            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="flex flex-col text-left space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Sourav Jena"
                  required
                  className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              <div className="flex flex-col text-left space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Indian Mobile Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. 9876543210"
                  required
                  className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {error && <p className="text-xs text-red-500 font-bold text-center mt-2">{error}</p>}

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 rounded-xl border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-pitch-charcoal font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl bg-pitch-charcoal hover:bg-emerald-555 bg-pitch-charcoal hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider text-xs transition-colors cursor-pointer text-center"
                >
                  Pay ₹{priceCalculation.finalTotal}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Payment Modes Verification */}
        {step === 3 && checkoutStatus === 'idle' && (
          <div className="max-w-md mx-auto bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-premium-tall p-6 relative overflow-hidden my-8 animate-fade-in hover:border-emerald-500/20 transition-all duration-300">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
            <h2 className="text-lg font-black text-pitch-charcoal border-b border-slate-100 pb-3 mb-5 text-left">
              {config?.paymentMode === 'razorpay' ? 'Secure Checkout Gateway' : 'Manual Scan & Pay'}
            </h2>

            {config?.paymentMode === 'razorpay' ? (
              // RAZORPAY GATEWAY VIEW
              <div className="space-y-4 text-center">
                <p className="text-xs text-pitch-slate-600 leading-relaxed text-left">
                  You are completing a direct online reservation for <strong>{selectedSlots.length} slot(s)</strong> totaling <strong>₹{priceCalculation.finalTotal}</strong>. Click below to initiate the secure payment popup.
                </p>
                
                {error && <p className="text-xs text-red-500 font-bold mt-2">{error}</p>}

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-pitch-charcoal font-bold text-xs cursor-pointer"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={handleRazorpayPayment}
                    className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-650 text-white font-extrabold uppercase tracking-wider text-xs cursor-pointer shadow-sm"
                  >
                    Launch Checkout
                  </button>
                </div>
              </div>
            ) : (
              // UPI MANUAL VIEW
              <form onSubmit={handleUpiSubmit} className="space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-100/60 border border-slate-200/60 p-4 rounded-xl">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                    <QRCodeSVG value={upiUrl} size={110} />
                  </div>
                  <div className="text-xs text-left space-y-1.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">UPI Account</p>
                    <p className="font-bold text-pitch-charcoal leading-none truncate max-w-[200px]">{upiName}</p>
                    <p className="font-mono text-[10px] text-pitch-slate-500">{upiId}</p>
                    <p className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-150 px-2 py-0.5 rounded font-bold inline-block">
                      Amount: ₹{priceCalculation.finalTotal}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col text-left space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">12-Digit Transaction UTR Code</label>
                  <input 
                    type="text" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 312345678901"
                    required
                    className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
                  />
                  <span className="text-[9px] text-slate-400 leading-normal">
                    Enter the numeric reference ID from your UPI app receipt to complete the submission.
                  </span>
                </div>

                {error && <p className="text-xs text-red-500 font-bold text-center mt-2">{error}</p>}

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-pitch-charcoal font-bold text-xs cursor-pointer text-center"
                  >
                    Edit Details
                  </button>
                  <button
                    type="submit"
                    className="py-3 rounded-xl bg-pitch-charcoal hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider text-xs cursor-pointer text-center shadow-sm"
                  >
                    Submit Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* LOADING PROCESSING OVERLAY */}
        {checkoutStatus === 'processing' && (
          <div className="min-h-[320px] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl py-10 px-6 max-w-sm mx-auto shadow-premium-tall relative overflow-hidden my-12 text-center animate-fade-in">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
            
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-slate-100 bg-slate-50 mb-4 animate-spin">
              <div className="absolute inset-1 rounded-full border-3 border-slate-200 border-t-emerald-500" />
            </div>

            <h3 className="text-base font-black text-pitch-charcoal">
              Processing Reservation
            </h3>
            
            <p className="text-xs font-mono text-emerald-700 mt-2.5 animate-pulse font-bold">
              {processingStep}
            </p>
          </div>
        )}

        {/* TICKET STUB SUCCESS CONFIRMATION */}
        {checkoutStatus === 'done' && generatedTicket && (
          <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md border border-slate-250/70 rounded-2xl shadow-premium-tall relative overflow-hidden my-6 animate-fade-in text-left hover:border-emerald-500/20 transition-all duration-300">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />

            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-250 text-[10px] font-black text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>PIN ACTIVE</span>
                  </span>
                  <h3 className="text-lg font-black text-pitch-charcoal mt-3 leading-none truncate max-w-[200px]" title={turfName}>
                    {turfName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Group ID</span>
                  <p className="text-xs font-mono font-black text-pitch-charcoal mt-0.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {generatedTicket.bookingGroupId}
                  </p>
                </div>
              </div>
            </div>

            {/* Split ticket overlay holes */}
            <div className="relative flex items-center my-1 select-none">
              <div className="w-3.5 h-3.5 rounded-full bg-[#fafafa] absolute -left-2 border-r border-slate-200" />
              <div className="w-full border-b border-dashed border-slate-200" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#fafafa] absolute -right-2 border-l border-slate-200" />
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-left">
                  <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">Play Date</span>
                  <span className="text-xs font-extrabold text-pitch-charcoal mt-1 block">
                    {generatedTicket.date}
                  </span>
                </div>
                
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-150 text-center">
                  <span className="text-[8px] font-black text-emerald-850 block uppercase tracking-wider">GATE ACCESS PIN</span>
                  <span className="text-sm font-mono font-black text-emerald-900 mt-1 block tracking-widest bg-white py-0.5 px-2 rounded-lg border border-emerald-200/50 shadow-2xs">
                    🔒 {generatedTicket.accessPin} #
                  </span>
                </div>
              </div>

              {/* Booked Timings */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-left">
                <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider mb-2">Booked Timings</span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedTicket.slots.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-white border border-slate-200 text-pitch-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-pitch-slate-600 flex items-start gap-2 text-left">
                <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-pitch-charcoal block">Keypad activation</strong>
                  Your unique gate PIN authorizes entrance commencing 10 minutes prior to reservation. Normal sneakers or turf flats permitted.
                </div>
              </div>
            </div>

            {/* Receipt invoice footer */}
            <div className="p-5 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl flex flex-col items-center space-y-3">
              <div className="w-full flex justify-between items-baseline text-xs">
                <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">
                  UTR Status: {config?.paymentMode === 'razorpay' ? 'PAID' : 'PENDING APPROVAL'}
                </span>
                <strong className="text-base font-black text-pitch-charcoal">₹{generatedTicket.price}</strong>
              </div>

              {/* Barcode visual */}
              <div className="w-full bg-white p-2.5 rounded-lg flex flex-col items-center space-y-1 border border-slate-150 select-none">
                <div className="h-5 flex space-x-[1px] items-stretch opacity-60 w-full max-w-[180px]">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const isWhite = i % 5 === 1 || i % 11 === 0;
                    const widthStyle = i % 4 === 0 ? 'w-[3px]' : 'w-[1px]';
                    return <div key={i} className={`h-full ${widthStyle} ${isWhite ? 'bg-transparent' : 'bg-slate-800'}`} />;
                  })}
                </div>
                <span className="text-[8px] font-mono tracking-widest text-slate-400">LOCK-{generatedTicket.bookingGroupId}</span>
              </div>

              <div className="w-full pt-1">
                <button
                  onClick={resetBooking}
                  className="w-full py-2.5 rounded-lg bg-pitch-charcoal hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  Configure New Booking
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
