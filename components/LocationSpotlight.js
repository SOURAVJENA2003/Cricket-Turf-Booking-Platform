'use client';

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Star, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LocationSpotlight({ onBookClick, turfDetails }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const images = [
    "/hero_turf_pitch.jpg",
    "/hero_stadium_lights.jpg",
    "/hero_netting_arena.jpg"
  ];

  // Auto-rotating timer for the spotlight slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const name = turfDetails?.name || "Runmakers Arena Box Cricket";
  const address = turfDetails?.address || "Infront of Omfed Plant, Railway Station Road, Chowk, Bankobija, Jeypore, Odisha 764002";
  const mapsUrl = turfDetails?.googleMaps || "https://www.google.com/maps/place/Runmakers+Arena+Box+Cricket";
  const openTime = turfDetails?.openTime || "06:00";
  const closeTime = turfDetails?.closeTime || "23:00";

  return (
    <section id="location-specs" className="relative min-h-screen flex flex-row overflow-hidden border-b border-slate-200/40 font-sans text-left bg-white">
      
      {/* Left Column: Slideshow (Edge-to-Edge full-screen left-half) */}
      <div className="w-1/2 min-h-screen bg-slate-900 relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={photoIndex}
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.75 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={images[photoIndex]}
              alt="Elite Stadium Field"
              className="w-full h-full object-cover select-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pitch-charcoal/80 via-transparent to-pitch-charcoal/15 pointer-events-none" />

        {/* Slideshow controls overlaid */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-12 text-white text-left z-10 select-none">
          <span className="text-[8px] sm:text-xs uppercase font-black tracking-widest text-emerald-300">
            {name.split(" ")[0]} Stadium Details
          </span>
          <h3 className="text-[10px] sm:text-base lg:text-lg font-display font-black tracking-tight mt-1 leading-tight max-w-md">
            Elite Turf Features & Setup
          </h3>
          
          {/* Visual Indicators */}
          <div className="flex gap-1.5 mt-3 sm:mt-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPhotoIndex(idx)}
                className={`h-1 sm:h-1.5 rounded-full transition-all cursor-pointer ${idx === photoIndex ? 'w-6 sm:w-8 bg-emerald-500' : 'w-2 sm:w-2.5 bg-white/40'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Text content */}
      <div className="w-1/2 min-h-screen flex flex-col justify-center pt-24 pb-12 px-4 sm:px-12 lg:px-20 xl:px-32 z-10 bg-gradient-to-br from-white via-slate-50/70 to-white relative overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <motion.div 
          className="flex flex-col space-y-5 sm:space-y-7 text-left relative z-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-1.5 text-[8px] sm:text-xs text-pitch-slate-500 font-bold mb-1 select-none">
            <span className="hover:text-emerald-700 transition-colors cursor-pointer">Venues</span>
            <span className="text-slate-300">&gt;</span>
            <span className="hover:text-emerald-700 transition-colors cursor-pointer">Odisha</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-pitch-charcoal font-black">{name.split(" ").slice(0, 2).join(" ")}</span>
          </div>

          {/* Title Block */}
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-pitch-charcoal tracking-tight leading-tight">
              {name}
            </h2>
            <div className="flex items-start gap-1.5">
              <span className="text-[10px] sm:text-xs text-pitch-slate-550 leading-relaxed max-w-lg font-medium block">
                📍 {address}
              </span>
            </div>
          </div>

          {/* Verified Rating Badges (Enclosed in a premium glassmorphic chip) */}
          <div className="flex flex-wrap items-center gap-2 select-none">
            <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200/70 py-1 px-2.5 rounded-xl shadow-3xs">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-[9px] sm:text-xs font-black text-slate-800">5.0</span>
              <span className="text-[8px] sm:text-[10px] text-pitch-slate-500 font-medium">(280+ ratings)</span>
            </div>
            
            <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100/70 text-emerald-800 py-1 px-2.5 rounded-xl shadow-3xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[9px] sm:text-xs font-extrabold">Verified Sports Club</span>
            </div>
          </div>

          {/* Features Pill Strip */}
          <div className="flex flex-wrap items-center gap-1.5 select-none">
            <span className="text-[8px] sm:text-[11px] font-extrabold text-emerald-900 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-xl shadow-3xs hover:bg-emerald-500/15 transition-all">
              ⚽ Enclosed Netting
            </span>
            <span className="text-[8px] sm:text-[11px] font-extrabold text-emerald-900 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-xl shadow-3xs hover:bg-emerald-500/15 transition-all">
              🏏 Bowling Machine
            </span>
            <span className="text-[8px] sm:text-[11px] font-extrabold text-emerald-900 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-xl shadow-3xs hover:bg-emerald-500/15 transition-all">
              💡 Anti-Glare Lights
            </span>
            <span className="text-[8px] sm:text-[11px] font-extrabold text-emerald-900 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-xl shadow-3xs hover:bg-emerald-500/15 transition-all">
              🚗 Free Parking
            </span>
          </div>

          {/* Timing & Location Map Box Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
            {/* TIMING details box */}
            <div className="border border-slate-200/80 hover:border-emerald-500/30 rounded-2xl p-4 bg-white hover:bg-slate-50/20 text-left space-y-1.5 hover:-translate-y-0.5 transition-all duration-300 shadow-2xs hover:shadow-premium-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-650" />
                  <h4 className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-pitch-charcoal">Timing</h4>
                </div>
                <p className="text-xs sm:text-sm font-black text-pitch-charcoal pt-1.5">
                  {openTime} – {closeTime}
                </p>
                <p className="text-[8px] sm:text-[11px] text-pitch-slate-500 leading-normal font-sans font-medium mt-1">
                  Open all days including national holidays.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[8px] sm:text-[9px] text-emerald-700 font-extrabold uppercase tracking-wider flex items-center gap-1.5 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Daily
              </div>
            </div>

            {/* LOCATION Details Box */}
            <div className="border border-slate-200/80 hover:border-emerald-500/30 rounded-2xl p-4 bg-white hover:bg-slate-50/20 text-left space-y-3 hover:-translate-y-0.5 transition-all duration-300 shadow-2xs hover:shadow-premium-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-650" />
                    <h4 className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-pitch-charcoal">Location Maps</h4>
                  </div>
                  <a 
                    href={mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[8px] sm:text-[10px] text-emerald-655 hover:text-emerald-750 font-extrabold underline transition-colors"
                  >
                    Open Maps →
                  </a>
                </div>
                <p className="text-[9px] sm:text-xs font-black text-pitch-charcoal truncate mt-1.5 mb-2">{name.split(" ").slice(0, 2).join(" ")}</p>
              </div>
              <div className="w-full h-[120px] sm:h-[140px] rounded-xl overflow-hidden border border-slate-200/80 shadow-3xs relative bg-slate-100">
                <iframe
                  title="Runmakers Arena Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address || name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 rounded-xl"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          {onBookClick && (
            <div className="pt-2">
              <button
                onClick={onBookClick}
                className="w-full bg-emerald-650 hover:bg-emerald-750 text-white font-extrabold text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 py-3.5 sm:py-4 rounded-xl shadow-md hover:shadow-brand-glow hover:-translate-y-0.5 text-center cursor-pointer"
              >
                Reserve Field Slot Now
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
