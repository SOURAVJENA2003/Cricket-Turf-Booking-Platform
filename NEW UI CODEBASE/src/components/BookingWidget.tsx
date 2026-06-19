import React, { useState, useMemo } from 'react';
import { PREMIUM_TURF } from '../data';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Star, 
  Check, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Smartphone,
  Lock,
  Sun,
  Sunset,
  CloudSun,
  Compass,
  Zap,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingWidgetProps {
  onBackToHome: () => void;
}

type CategoryType = 'All' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export default function BookingWidget({ onBackToHome }: BookingWidgetProps) {
  // Helper to construct dates dynamically starting today
  const calendarDates = useMemo(() => {
    const dates = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        isoString: d.toISOString().split('T')[0],
        dayOfWeek: daysOfWeek[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()]
      });
    }
    return dates;
  }, []);

  // Standard preset slots template containing peak hour mappings
  const rawSlotsTemplate = [
    { time: "06:00 - 07:00", isPeak: false, category: "Morning" },
    { time: "08:00 - 09:00", isPeak: false, category: "Morning" },
    { time: "10:00 - 11:00", isPeak: false, category: "Morning" },
    { time: "12:00 - 13:00", isPeak: false, category: "Afternoon" },
    { time: "14:00 - 15:00", isPeak: false, category: "Afternoon" },
    { time: "16:00 - 17:00", isPeak: true, category: "Afternoon" },
    { time: "17:00 - 18:00", isPeak: true, category: "Evening" },
    { time: "18:00 - 19:00", isPeak: true, category: "Evening" },
    { time: "19:00 - 20:00", isPeak: true, category: "Evening" },
    { time: "20:00 - 21:00", isPeak: true, category: "Evening" },
    { time: "21:00 - 22:00", isPeak: true, category: "Evening" },
    { time: "22:00 - 23:00", isPeak: false, category: "Night" }
  ];

  // System states
  const [selectedDateIso, setSelectedDateIso] = useState<string>(calendarDates[0].isoString);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(['18:00 - 19:00']); 
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [processingStep, setProcessingStep] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);

  // Generate dynamic mocked booked slots based on Date to simulate real scheduler activity
  const simulatedTimeSlots = useMemo(() => {
    return rawSlotsTemplate.map((slot, index) => {
      // Create a deterministic hash based on date day and index to make bookings feel dynamic
      const isBooked = (PREMIUM_TURF.name.length + selectedDateIso.charCodeAt(9) + index) % 4 === 1;
      
      let status: 'available' | 'booked' | 'selected' = 'available';
      if (isBooked) {
        status = 'booked';
      } else if (selectedSlots.includes(slot.time)) {
        status = 'selected';
      }

      return {
        id: slot.time,
        time: slot.time,
        isPeak: slot.isPeak,
        category: slot.category as CategoryType,
        status
      };
    });
  }, [selectedDateIso, selectedSlots]);

  // Handle slot click
  const handleSlotClick = (slot: any) => {
    if (slot.status === 'booked') return;

    if (selectedSlots.includes(slot.time)) {
      setSelectedSlots(prev => prev.filter(s => s !== slot.time));
    } else {
      setSelectedSlots(prev => [...prev, slot.time]);
    }
  };

  // Filter slots based on state tab selection
  const filteredSlots = useMemo(() => {
    if (selectedCategory === 'All') return simulatedTimeSlots;
    return simulatedTimeSlots.filter(s => s.category === selectedCategory);
  }, [simulatedTimeSlots, selectedCategory]);

  // Pricing calculations
  const priceCalculation = useMemo(() => {
    const baseHourPrice = PREMIUM_TURF.basePricePerHour;
    let baseTotal = 0;
    let peakPremiumTotal = 0;
    
    selectedSlots.forEach(time => {
      baseTotal += baseHourPrice;
      const isPeakHour = rawSlotsTemplate.find(s => s.time === time)?.isPeak;
      if (isPeakHour) {
        peakPremiumTotal += 200; // ₹200 peak lighting surcharge
      }
    });

    const subtotal = baseTotal + peakPremiumTotal;
    const gstTotal = Math.round(subtotal * 0.18); // 18% standard sports GST
    const finalTotal = subtotal + gstTotal;

    return {
      baseTotal,
      peakPremiumTotal,
      subtotal,
      gstTotal,
      finalTotal,
      hourCount: selectedSlots.length
    };
  }, [selectedSlots]);

  // Trigger booking checkout sequence
  const startCheckout = () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one available timing block to complete your reservation.");
      return;
    }

    setBookingStatus('processing');
    
    const steps = [
      "Securing field lock...",
      "Reserving timeline bracket...",
      "Generating unique venue access PIN..."
    ];

    let currentStep = 0;
    setProcessingStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        
        const accessPin = `${Math.floor(1000 + Math.random() * 9000)}`;
        const dateObj = calendarDates.find(c => c.isoString === selectedDateIso) || calendarDates[0];
        
        setGeneratedTicket({
          turf: PREMIUM_TURF,
          date: `${dateObj.dayOfWeek}, ${dateObj.month} ${dateObj.dayNum}, 2026`,
          slots: selectedSlots,
          accessPin,
          price: priceCalculation.finalTotal,
          invoiceNo: `CP-${Math.floor(100000 + Math.random() * 900000)}`,
        });

        setBookingStatus('done');
      }
    }, 800);
  };

  const resetBooking = () => {
    setSelectedSlots([]);
    setBookingStatus('idle');
    setGeneratedTicket(null);
  };

  return (
    <div className="py-6 md:py-12 bg-[#fafafa] min-h-screen text-pitch-slate-800 font-sans text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Modern Athletic Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHome}
              className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-250 hover:border-slate-400 text-pitch-charcoal hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
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
                {PREMIUM_TURF.name}
              </h1>
            </div>
          </div>

          <div className="flex gap-2 text-xs font-semibold">
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-850 px-3 py-1.5 rounded-lg flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Realtime Active
            </span>
            <span className="bg-slate-100 border border-slate-200 text-pitch-slate-700 px-3 py-1.5 rounded-lg flex items-center">
              Flat ₹{PREMIUM_TURF.basePricePerHour}/hr
            </span>
          </div>
        </div>

        {bookingStatus === 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 8 COLUMNS: The Playful Booking Canvas */}
            <div className="lg:col-span-8 space-y-5">

              {/* DATE PICKER */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase text-pitch-slate-400 tracking-wider">Select Play Date</h3>
                  <span className="text-[10px] bg-slate-100 text-pitch-slate-600 px-2 py-0.5 rounded font-bold">5 Days Open</span>
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
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md transform scale-102'
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

              {/* SLOTS MODULE: Visual filtration & Slot Blocks */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase text-pitch-slate-400 tracking-wider">Select Play Timings</h3>
                  
                  {/* PLAYFUL SLOT CATEGORY FILTER TABS */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                    {(['All', 'Morning', 'Afternoon', 'Evening', 'Night'] as CategoryType[]).map((cat) => (
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

                {/* THE FLUID GRID OF CHIPS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredSlots.map((slot) => {
                      const isBooked = slot.status === 'booked';
                      const isSelected = slot.status === 'selected';

                      return (
                        <motion.button
                          layout
                          key={slot.time}
                          disabled={isBooked}
                          onClick={() => handleSlotClick(slot)}
                          className={`relative p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between items-center cursor-pointer min-h-[72px] select-none ${
                            isBooked
                              ? 'bg-slate-50/75 border-slate-200 text-slate-300 pointer-events-none'
                              : isSelected
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/50 scale-102 font-bold'
                                : 'bg-white border-slate-200 hover:border-slate-350 text-pitch-charcoal hover:bg-slate-55'
                          }`}
                        >
                          <span className="text-xs font-black tracking-tight">{slot.time}</span>

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
                                Peak (LED)
                              </span>
                            )}
                          </div>

                          {isBooked && (
                            <div className="absolute inset-0 bg-slate-50/65 flex items-center justify-center rounded-xl text-[9px] text-slate-400/80 font-black tracking-widest bg-center">
                              🔒 BOOKED
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {filteredSlots.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400 font-sans italic">
                    No timeline matches for the "{selectedCategory}" filter.
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT 4 COLUMNS: Minimal Interactive Checkout Stub */}
            <div className="lg:col-span-4 lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400" />
                
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4 pb-2 border-b border-slate-100">
                  Reserving Stub
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center space-x-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-pitch-charcoal font-bold truncate max-w-[200px]" title={PREMIUM_TURF.name}>{PREMIUM_TURF.name}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-pitch-charcoal font-bold">
                      {calendarDates.find(c => c.isoString === selectedDateIso)?.dayNum} {calendarDates.find(c => c.isoString === selectedDateIso)?.month}, 2026
                    </span>
                  </div>
                </div>

                {selectedSlots.length > 0 ? (
                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-4 text-xs">
                    
                    {/* Compact layout representing selected hours simply */}
                    <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex flex-col space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Selected slots</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSlots.map(time => (
                          <span key={time} className="px-1.5 py-0.5 bg-white border border-slate-200 text-pitch-charcoal font-mono italic text-[9px] rounded font-bold">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px] pt-2 text-slate-500">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span className="font-bold text-pitch-charcoal">₹{priceCalculation.baseTotal}</span>
                      </div>
                      {priceCalculation.peakPremiumTotal > 0 && (
                        <div className="flex justify-between text-amber-800">
                          <span>Peak LED Premium:</span>
                          <span className="font-bold">+₹{priceCalculation.peakPremiumTotal}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>GST & Tax (18%):</span>
                        <span>₹{priceCalculation.gstTotal}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-black uppercase text-pitch-slate-500">Total Price</span>
                      <span className="text-xl font-black text-pitch-charcoal">
                        ₹{priceCalculation.finalTotal}
                      </span>
                    </div>

                    <button
                      onClick={startCheckout}
                      className="w-full bg-pitch-charcoal hover:bg-emerald-500 text-white transition-all duration-200 py-3.5 rounded-xl font-extrabold uppercase text-xs tracking-wider flex items-center justify-center cursor-pointer shadow-md transform active:scale-98 mt-4"
                    >
                      <span>Reserve Instantly</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                    
                    <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 text-center mt-2.5">
                      <Lock className="w-3 h-3 text-slate-350" /> Secure checkout & access pin delivery
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-slate-450 italic border-2 border-dashed border-slate-150 rounded-xl bg-slate-50/50">
                    💡 Select timings to automatically calculate price.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* PROCESSING ACCESS PIN */}
        {bookingStatus === 'processing' && (
          <div className="min-h-[320px] flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl py-10 px-6 max-w-sm mx-auto shadow-sm relative overflow-hidden my-12 text-center">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
            
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-slate-100 bg-slate-50 mb-4">
              <div className="absolute inset-1 rounded-full border-3 border-slate-200 border-t-emerald-500 animate-spin" />
            </div>

            <h3 className="text-base font-black text-pitch-charcoal">
              Processing Instant Pass
            </h3>
            
            <p className="text-xs font-mono text-emerald-700 mt-2.5 animate-pulse font-bold">
              {processingStep}
            </p>
          </div>
        )}

        {/* COMPACT CONFIRMED STRENGTH SPORT TICKET */}
        {bookingStatus === 'done' && generatedTicket && (
          <div className="max-w-md mx-auto bg-white border border-slate-250 rounded-2xl shadow-lg relative overflow-hidden my-6 animate-fade-in text-left">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />

            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-black text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>PIN ACTIVE</span>
                  </span>
                  <h3 className="text-lg font-black text-pitch-charcoal mt-3 leading-none">
                    {PREMIUM_TURF.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">ID SUITE</span>
                  <p className="text-xs font-mono font-black text-pitch-charcoal mt-0.5 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded">{generatedTicket.invoiceNo}</p>
                </div>
              </div>
            </div>

            {/* Curved split hole visual divider */}
            <div className="relative flex items-center my-1">
              <div className="w-3.5 h-3.5 rounded-full bg-[#fafafa] absolute -left-2 border-r border-slate-250" />
              <div className="w-full border-b border-dashed border-slate-200" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#fafafa] absolute -right-2 border-l border-slate-250" />
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">Play Date</span>
                  <span className="text-xs font-extrabold text-pitch-charcoal mt-1 block">
                    {generatedTicket.date}
                  </span>
                </div>
                
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-150 text-center">
                  <span className="text-[8px] font-black text-emerald-800 block uppercase tracking-wider">GATE ACCESS PIN</span>
                  <span className="text-sm font-mono font-black text-emerald-900 mt-1 block tracking-widest bg-white py-0.5 px-2 rounded-lg border border-emerald-200/50 shadow-xs">
                    🔒 {generatedTicket.accessPin} #
                  </span>
                </div>
              </div>

              {/* Booked Timings list */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider mb-2">Booked Timeline</span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedTicket.slots.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-white border border-slate-200 text-pitch-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-650" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Smart Keypad Note */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-pitch-slate-600 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-pitch-charcoal block">Keypad activation</strong>
                  Your unique gate PIN authorizes entrance commencing 10 minutes prior to reservation. Normal sneakers or turf flats permitted.
                </div>
              </div>
            </div>

            {/* Curvaceous base receipt */}
            <div className="p-5 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl flex flex-col items-center space-y-3">
              <div className="w-full flex justify-between items-baseline text-xs">
                <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">Invoice state (paid)</span>
                <strong className="text-base font-black text-pitch-charcoal">₹{generatedTicket.price}</strong>
              </div>

              {/* Visual simulated modern barcode strip */}
              <div className="w-full bg-white p-2.5 rounded-lg flex flex-col items-center space-y-1 border border-slate-150">
                <div className="h-5 flex space-x-[1px] items-stretch opacity-60 w-full max-w-[180px]">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const isWhite = i % 5 === 1 || i % 11 === 0;
                    const widthStyle = i % 4 === 0 ? 'w-[3px]' : 'w-[1px]';
                    return <div key={i} className={`h-full ${widthStyle} ${isWhite ? 'bg-transparent' : 'bg-slate-800'}`} />;
                  })}
                </div>
                <span className="text-[8px] font-mono tracking-widest text-slate-400">CP-LOCK-2026-VAL</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => alert("Digital pass receipt is downloaded offline.")}
                  className="py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-pitch-charcoal font-bold text-[10px] transition-colors cursor-pointer text-center"
                >
                  Download Stub
                </button>
                <button
                  onClick={resetBooking}
                  className="py-2 rounded-lg bg-pitch-charcoal hover:bg-emerald-505 text-white font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  Configure New
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
