'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Check,
  User,
  Phone,
  ShieldCheck,
  Info,
  Printer,
  CalendarDays,
  Copy,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatLocalDateString } from '@/lib/date-utils';

export default function BookingWidget({ onBackToHome }) {
  // Calendar Dates: 30 days starting today
  const calendarDates = useMemo(() => {
    const dates = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const now = Date.now();
    for (let i = 0; i < 30; i++) {
      const timeInIst = now + i * 24 * 60 * 60 * 1000;
      const d = new Date(timeInIst);
      
      const parts = formatter.formatToParts(d);
      const yearStr = parts.find(p => p.type === 'year').value;
      const monthStr = parts.find(p => p.type === 'month').value;
      const dayStr = parts.find(p => p.type === 'day').value;
      
      const isoString = `${yearStr}-${monthStr}-${dayStr}`;
      const parsedDayNum = parseInt(dayStr, 10);
      const parsedMonthIdx = parseInt(monthStr, 10) - 1;
      
      const tempDate = new Date(parseInt(yearStr, 10), parsedMonthIdx, parsedDayNum);

      dates.push({
        isoString,
        dayOfWeek: daysOfWeek[tempDate.getDay()],
        dayNum: parsedDayNum,
        month: months[parsedMonthIdx]
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
  const [copySuccess, setCopySuccess] = useState(false);

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
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
      return;
    }

    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

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
          color: '#0b573a',
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // UPI URL for QR code generation
  const upiId = config?.upiDetails?.id || config?.id || "owner@upi";
  const upiName = config?.upiDetails?.name || config?.name || "Turf Owner";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${priceCalculation.finalTotal}&cu=INR&tn=Booking for ${selectedDateIso}`;
  const turfName = turfDetails?.name || "Runmakers Arena Box Cricket";

  const steps = [
    { number: 1, label: 'Select Slots' },
    { number: 2, label: 'Player Details' },
    { number: 3, label: 'Verify & Pay' }
  ];

  return (
    <div className="py-8 md:py-16 bg-transparent min-h-screen text-pitch-slate-800 font-sans text-left relative overflow-hidden">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Navigation & Standard Back Button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/50 select-none">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-wider text-pitch-charcoal hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-0.5 transition-transform" />
            Exit Booking
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-550/10 border border-emerald-500/20 text-emerald-800 px-3 py-1 rounded-full font-extrabold shadow-3xs">
              Stadium Price: ₹{turfDetails?.defaultSlotPrice || 1000}/hr
            </span>
          </div>
        </div>

        {/* Master Steps Timeline Progress Indicator */}
        {checkoutStatus !== 'done' && checkoutStatus !== 'processing' && (
          <div className="max-w-md mx-auto mb-12 select-none px-4">
            <div className="flex items-center justify-between relative">
              {/* Timeline Connector Tracks */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-emerald-600 transition-all duration-500 z-0" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
              
              {steps.map((s) => {
                const isCompleted = step > s.number;
                const isActive = step === s.number;
                return (
                  <div key={s.number} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-650 text-white ring-4 ring-emerald-100' 
                        : isActive 
                          ? 'bg-emerald-650 text-white ring-4 ring-emerald-100 font-extrabold scale-110' 
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.number}
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold mt-2.5 transition-colors ${
                      isActive ? 'text-emerald-800 font-black' : isCompleted ? 'text-slate-650' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Wizard Steps Switcher */}
        <div>
          {/* PROCESSING STATE SCREEN */}
          {checkoutStatus === 'processing' && (
            <div className="w-full p-6 sm:p-12 flex flex-col items-center justify-center min-h-[350px]">
              <div className="min-h-[220px] flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-3xl py-8 px-6 max-w-sm w-full shadow-premium-tall relative overflow-hidden text-center animate-fade-in">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
                
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-slate-150 bg-slate-50 mb-4 animate-spin">
                  <div className="absolute inset-1 rounded-full border-[3px] border-slate-200 border-t-emerald-600" />
                </div>

                <h3 className="text-sm font-black text-pitch-charcoal">
                  Processing Reservation
                </h3>
                
                <p className="text-[10px] font-mono text-emerald-700 mt-2.5 animate-pulse font-bold">
                  {processingStep}
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN: TICKET ISSUANCE */}
          {checkoutStatus === 'done' && generatedTicket && (
            <div className="max-w-md mx-auto py-2">
              <div className="bg-white border border-slate-200/80 shadow-premium-tall relative overflow-hidden rounded-[2.5rem] text-left transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-500" />
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>PIN ACTIVE</span>
                      </span>
                      <h3 className="text-lg font-display font-black text-pitch-charcoal mt-3.5 leading-none truncate max-w-[200px]" title={turfName}>
                        {turfName}
                      </h3>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Stadium Arena Access Code</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Group ID</span>
                      <p className="text-xs font-mono font-black text-pitch-charcoal mt-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        {generatedTicket.bookingGroupId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated ticket side punch holes and rip line */}
                <div className="relative flex items-center my-1 select-none">
                  <div className="w-5 h-5 rounded-full bg-[#fafbfd] absolute -left-2.5 border-r border-slate-200" />
                  <div className="w-full border-b-2 border-dashed border-slate-200" />
                  <div className="w-5 h-5 rounded-full bg-[#fafbfd] absolute -right-2.5 border-l border-slate-200" />
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-left flex flex-col justify-center">
                      <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Play Date</span>
                      <span className="text-xs font-display font-extrabold text-pitch-charcoal mt-1 block leading-tight">
                        {generatedTicket.date}
                      </span>
                    </div>
                    
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-150 text-center flex flex-col justify-center">
                      <span className="text-[9px] font-black text-emerald-800 block uppercase tracking-wider">GATE ACCESS PIN</span>
                      <span className="text-base font-mono font-black text-emerald-950 mt-1 block tracking-widest bg-white py-1 px-3 rounded-xl border border-emerald-200/50 shadow-2xs">
                        🔒 {generatedTicket.accessPin} #
                      </span>
                    </div>
                  </div>

                  {/* Booked Timings list */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-left">
                    <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-2.5">Booked Timings</span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedTicket.slots.map((s, idx) => (
                        <span key={idx} className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-white border border-slate-200 text-pitch-slate-800 flex items-center gap-1.5 shadow-3xs">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lock guidance instructions */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[10px] text-slate-655 flex items-start gap-2.5 text-left">
                    <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-pitch-charcoal block">Keypad activation</strong>
                      Enter the PIN code followed by the hash `#` key at the door keypad. Your unique gate PIN authorizes entrance commencing 10 minutes prior to reservation. Normal sneakers or turf flats permitted.
                    </div>
                  </div>
                </div>

                {/* Receipt invoice footer section */}
                <div className="p-6 border-t border-slate-200 bg-slate-50/50 rounded-b-[2.5rem] flex flex-col items-center space-y-4">
                  <div className="w-full flex justify-between items-baseline text-xs">
                    <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">
                      UTR Status: {config?.paymentMode === 'razorpay' ? 'PAID' : 'PENDING VERIFICATION'}
                    </span>
                    <strong className="text-lg font-display font-black text-pitch-charcoal">₹{generatedTicket.price}</strong>
                  </div>

                  {/* SVG Check-in QR code */}
                  <div className="w-full bg-white p-4 rounded-xl flex flex-col items-center space-y-2 border border-slate-150 select-none">
                    <QRCodeSVG value={`https://cricket-turf-booking.com/ticket/${generatedTicket.bookingGroupId}`} size={110} />
                    <span className="text-[8px] font-mono tracking-widest text-slate-400">TICKET-LOCK-{generatedTicket.bookingGroupId}</span>
                  </div>

                  <div className="w-full flex gap-2.5 pt-1">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 rounded-xl border border-slate-200 hover:border-slate-350 bg-white text-pitch-charcoal font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print Pass
                    </button>
                    <button
                      onClick={resetBooking}
                      className="flex-1 py-3 rounded-xl bg-pitch-charcoal hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      New Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: SCHEDULING (DATES & SLOTS SELECTOR) */}
          {step === 1 && checkoutStatus === 'idle' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Date selection row */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-premium-soft">
                <div className="flex items-center justify-between mb-4 select-none">
                  <div>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Play Date</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Pick a day to view available bookings.</p>
                  </div>
                  <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-black uppercase">30 Days Open</span>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
                  {calendarDates.map((date) => {
                    const isSelected = selectedDateIso === date.isoString;
                    return (
                      <button
                        type="button"
                        key={date.isoString}
                        onClick={() => {
                          setSelectedDateIso(date.isoString);
                          setSelectedSlots([]); 
                        }}
                        className={`flex-shrink-0 snap-center w-[84px] py-4 px-2.5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-650 border-emerald-600 text-white shadow-brand-glow scale-[1.04]'
                            : 'bg-white border-slate-100 hover:border-slate-350 hover:bg-slate-50 text-pitch-slate-700 shadow-3xs'
                        }`}
                      >
                        <span className={`text-[9px] uppercase font-black tracking-widest ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {date.dayOfWeek}
                        </span>
                        <span className="text-2xl font-display font-extrabold my-1 leading-none">
                          {date.dayNum}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {date.month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots controller category tags and grids */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-premium-soft space-y-6">
                
                {/* Categorization controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 select-none">
                  <div>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Timing Slots</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Filter and tap to lock consecutive slots.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 p-1 bg-slate-100/70 border border-slate-200/60 rounded-xl w-fit">
                    {['All', 'Morning', 'Afternoon', 'Evening', 'Night'].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-white text-pitch-charcoal shadow-3xs font-extrabold'
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

                {/* Online bookings warning lock */}
                {!bookingEnabled && (
                  <div className="bg-red-50 text-red-800 border border-red-150 p-4 rounded-2xl font-bold text-center text-xs flex items-center justify-center gap-2 select-none">
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
                    Online bookings are temporarily closed. Please try again later.
                  </div>
                )}

                {/* Timing slot cards grid */}
                <div className="min-h-[280px] flex flex-col justify-start relative">
                  {loading && slots.length === 0 ? (
                    <div className="flex-1 py-16 flex items-center justify-center text-xs text-slate-450 font-bold tracking-wider italic animate-pulse">
                      🏟️ Fetching available play arena slots...
                    </div>
                  ) : error ? (
                    <div className="flex-1 py-16 flex items-center justify-center text-xs text-red-500 font-bold bg-red-50/50 border border-red-100/50 rounded-2xl">
                      ⚠️ {error}
                    </div>
                  ) : filteredSlots.length === 0 && !loading ? (
                    <div className="flex-1 py-16 flex items-center justify-center text-xs text-slate-455 font-bold">
                      No matches available in the "{selectedCategory}" time slot. Try another category filter.
                    </div>
                  ) : (
                    <div className="relative w-full">
                      {loading && slots.length > 0 && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] flex items-center justify-center z-20 rounded-3xl">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                            <span className="text-[10px] text-emerald-700 font-black tracking-widest uppercase animate-pulse">Refreshing Arena...</span>
                          </div>
                        </div>
                      )}
                      
                      <div className={`grid grid-cols-2 md:grid-cols-3 gap-3.5 transition-all duration-300 ${
                        loading ? 'opacity-40 blur-[1px] pointer-events-none select-none' : ''
                      }`}>
                        {filteredSlots.map((slot) => {
                          const isBooked = slot.is_booked;
                          const isSelected = selectedSlots.some(s => s.id === slot.id);

                          return (
                            <button
                              type="button"
                              key={slot.id}
                              disabled={isBooked}
                              onClick={() => handleSlotClick(slot)}
                              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between items-start cursor-pointer min-h-[90px] overflow-hidden ${
                                isBooked
                                  ? 'bg-slate-50 border-slate-200 text-slate-350 pointer-events-none'
                                  : isSelected
                                    ? 'bg-emerald-650 border-emerald-600 text-white shadow-brand-glow scale-[1.02]'
                                    : 'bg-white border-slate-200 hover:border-emerald-500/30 text-pitch-charcoal hover:shadow-premium-soft'
                              }`}
                            >
                              {/* Selection state badge */}
                              <div className="absolute top-3.5 right-3.5">
                                {isBooked ? (
                                  <span className="text-[7px] font-black tracking-widest text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded uppercase">Locked</span>
                                ) : isSelected ? (
                                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-3xs">
                                    <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3.5]" />
                                  </div>
                                ) : (
                                  <span className="text-[7px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded uppercase">Open</span>
                                )}
                              </div>

                              <span className="text-sm sm:text-base font-display font-extrabold tracking-tight mt-1">
                                {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                              </span>
                              
                              <div className="w-full flex items-center justify-between text-[9px] font-bold uppercase tracking-wider mt-3">
                                <span className={isSelected ? 'text-emerald-100' : 'text-slate-400'}>
                                  {slot.category === 'Morning' && '🌅 '}
                                  {slot.category === 'Afternoon' && '☀️ '}
                                  {slot.category === 'Evening' && '🌇 '}
                                  {slot.category === 'Night' && '🌃 '}
                                  {slot.category}
                                </span>
                                <span className={isSelected ? 'text-white' : 'text-slate-655 font-extrabold'}>
                                  ₹{slot.price}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Bottom Booking Summary Action Bar */}
              <AnimatePresence>
                {selectedSlots.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200/80 shadow-[0_-15px_40px_-15px_rgba(15,23,42,0.15)] z-50 py-4 px-6 md:py-6 md:px-12 backdrop-blur-md bg-white/95"
                  >
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Your Selection</span>
                          <h4 className="text-sm font-extrabold text-pitch-charcoal mt-0.5">
                            {formatLocalDateString(selectedDateIso)} • {selectedSlots.length} hours selected
                          </h4>
                          <div className="flex flex-wrap gap-1 justify-center md:justify-start mt-2">
                            {selectedSlots.map(s => (
                              <span key={s.id} className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-pitch-charcoal font-mono italic text-[9px] rounded font-bold">
                                {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <span className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Total Amount</span>
                          <p className="text-xl sm:text-2xl font-display font-black text-pitch-charcoal leading-none mt-0.5">
                            ₹{priceCalculation.finalTotal}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => setStep(2)}
                          className="px-8 py-3.5 rounded-xl bg-emerald-650 hover:bg-emerald-700 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 shadow-brand-glow hover:-translate-y-0.5"
                        >
                          Proceed to Details
                          <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

          {/* STEP 2: PLAYER INFORMATION DETAILS */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-premium-tall overflow-hidden p-6 sm:p-10 animate-fade-in">
              <div className="mb-6 select-none">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-550/10 border border-emerald-550/20 px-3 py-1 rounded-md">
                  Step 2 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-pitch-charcoal mt-3.5 leading-none">Player Information</h2>
                <p className="text-xs text-slate-500 mt-1.5">Enter the reservation host details below.</p>
              </div>

              <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col text-left space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="e.g. Sourav Jena"
                        required
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-205 text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 shadow-3xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col text-left space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Indian Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="e.g. 9876543210"
                        required
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-205 text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 shadow-3xs transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary panel visual card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-3.5 select-none">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/50 pb-2">
                    Arena Booking Details
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Venue</span>
                      <span className="text-xs font-extrabold text-pitch-charcoal mt-0.5 block truncate" title={turfName}>{turfName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Date</span>
                      <span className="text-xs font-extrabold text-pitch-charcoal mt-0.5 block">{formatLocalDateString(selectedDateIso)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Duration</span>
                      <span className="text-xs font-extrabold text-pitch-charcoal mt-0.5 block">{selectedSlots.length} Hour(s)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/40">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Selected Timings</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSlots.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-3xs">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-200/45 flex justify-between items-baseline">
                    <span className="text-xs font-extrabold text-slate-550">Total Amount Due</span>
                    <span className="text-xl font-display font-black text-pitch-charcoal">₹{priceCalculation.finalTotal}</span>
                  </div>
                </div>

                {error && <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl p-3 text-center">{error}</p>}
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 hover:border-slate-350 bg-white text-pitch-charcoal font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center hover:bg-slate-55"
                  >
                    ← Back to Slots
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center shadow-brand-glow hover:-translate-y-0.5"
                  >
                    Proceed to Payment →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PAYMENT INTERACTION GATEWAY */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-premium-tall overflow-hidden p-6 sm:p-10 animate-fade-in">
              <div className="mb-6 select-none">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-550/10 border border-emerald-550/20 px-3 py-1 rounded-md">
                  Step 3 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-pitch-charcoal mt-3.5 leading-none">
                  {config?.paymentMode === 'razorpay' ? 'Secure Payment Checkout' : 'Scan & Pay UPI'}
                </h2>
                <p className="text-xs text-slate-500 mt-1.5">Complete payment to get your stadium gate access PIN.</p>
              </div>

              {config?.paymentMode === 'razorpay' ? (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-4 select-none">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Player</span>
                      <span className="text-xs font-extrabold text-pitch-charcoal">{name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Contact</span>
                      <span className="text-xs font-extrabold text-pitch-charcoal">{phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Selected Slots</span>
                      <span className="text-xs font-extrabold text-pitch-charcoal">{selectedSlots.length} Hour(s)</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200/40 flex justify-between items-baseline">
                      <span className="text-xs font-extrabold text-slate-550">Total Payable</span>
                      <span className="text-xl font-display font-black text-pitch-charcoal">₹{priceCalculation.finalTotal}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 p-3 bg-emerald-550/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-800 font-bold select-none">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                    Secure transactions verified via encrypted gateway
                  </div>

                  {error && <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl p-3 text-center">{error}</p>}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 hover:border-slate-350 bg-white text-pitch-charcoal font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center hover:bg-slate-50"
                    >
                      ← Back to Details
                    </button>
                    <button
                      onClick={handleRazorpayPayment}
                      className="flex-1 py-3.5 rounded-xl bg-emerald-650 hover:bg-emerald-700 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center shadow-brand-glow hover:-translate-y-0.5"
                    >
                      Pay with Razorpay
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpiSubmit} className="space-y-6">
                  {/* Scan code panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl">
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-3xs relative group flex-shrink-0">
                      <QRCodeSVG value={upiUrl} size={140} />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-3.5">Scan to Pay UPI</span>
                    </div>
                    
                    <div className="space-y-4 text-left select-none">
                      <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded">UPI Merchant Details</span>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Merchant Name</span>
                        <span className="text-xs font-extrabold text-pitch-charcoal block truncate">{upiName}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">VPA Address</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-extrabold text-slate-650 block truncate">{upiId}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(upiId)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors p-1 bg-white border border-slate-200 rounded shadow-3xs cursor-pointer"
                            title="Copy VPA"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Amount Due</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-display font-black text-emerald-800 block">₹{priceCalculation.finalTotal}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(priceCalculation.finalTotal.toString())}
                            className="text-slate-400 hover:text-emerald-600 transition-colors p-1 bg-white border border-slate-200 rounded shadow-3xs cursor-pointer"
                            title="Copy Amount"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      {copySuccess && (
                        <p className="text-[8px] text-emerald-600 font-extrabold uppercase animate-pulse">Copied details to clipboard!</p>
                      )}
                    </div>
                  </div>

                  {/* Transaction ID input */}
                  <div className="flex flex-col text-left space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">12-Digit Transaction UTR Code</label>
                    <input 
                      type="text" 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 312345678901"
                      required
                      className="w-full p-3.5 rounded-xl border border-slate-205 text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 shadow-3xs transition-all font-mono"
                    />
                    <div className="flex gap-2.5 p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-[9px] text-amber-800 font-bold leading-normal">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      Paste the exact 12-digit reference UTR number from your payment application receipt stub. Failure to enter the correct UTR details will cancel verification.
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 rounded-xl p-3 text-center">{error}</p>}
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 hover:border-slate-350 bg-white text-pitch-charcoal font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center hover:bg-slate-50"
                    >
                      ← Back to Details
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center shadow-brand-glow hover:-translate-y-0.5"
                    >
                      Verify & Confirm Ticket
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
