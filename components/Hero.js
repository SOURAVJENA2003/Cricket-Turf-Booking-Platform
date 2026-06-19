'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Star, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Hero({ onBookClick, onExploreClick, turfDetails }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const slideImages = [
    {
      url: turfDetails?.bannerUrl || "https://images.unsplash.com/photo-1540747737956-37872404459a?auto=format&fit=crop&q=80&w=800",
      caption: "Cushioned AstroTurf Match Pitch"
    },
    {
      url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
      caption: "Dusk Stadium Floodlights"
    },
    {
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
      caption: "Premium Enclosed Netting Arena"
    }
  ];

  // Auto-rotating timer for the carousel images
  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slideImages.length]);

  const name = turfDetails?.name || "Runmakers Arena Box Cricket";
  const tagline = turfDetails?.description || "Built for ultimate performance, consistent bounce, and premium stadium floodlighting active daily.";
  const openTime = turfDetails?.openTime || "06:00";
  const closeTime = turfDetails?.closeTime || "23:00";

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-200/45 font-sans">
      {/* Split background: Left 50% is white, Right 50% is green. On smaller screens, top is white, bottom is green. */}
      <div className="absolute inset-0 flex flex-col lg:flex-row pointer-events-none z-0">
        <div className="w-full lg:w-1/2 h-[55%] lg:h-full bg-white" />
        <div className="w-full lg:w-1/2 h-[45%] lg:h-full bg-emerald-600" />
      </div>

      {/* Decorative premium background mesh overlay on the green side */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-[45%] lg:h-full blur-[120px] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.2) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div 
            className="flex flex-col space-y-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Top Trending Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50/70 backdrop-blur-xs border border-emerald-100/50 rounded-full shadow-xs w-fit select-none animate-bounce">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800">
                Premium Sports Venue
              </span>
            </div>

            {/* Premium display headings */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-display font-extrabold text-pitch-charcoal tracking-tight leading-[1.12]">
              Hit Runs in Style at <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                {name}
              </span>
            </h1>

            {/* Clean narrative */}
            <p className="text-sm sm:text-base text-pitch-slate-650 font-normal max-w-xl leading-relaxed">
              {tagline}
            </p>

            {/* Premium Spec Chips Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-lg pt-1 select-none">
              <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-slate-200/50 shadow-2xs hover:border-emerald-500/25 transition-all">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-sm">🏟️</span>
                <div className="text-left leading-none">
                  <span className="text-[9px] text-pitch-slate-500 block font-bold uppercase tracking-wider">Surface</span>
                  <span className="text-xs font-black text-pitch-charcoal block mt-1">Cushioned Turf</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-slate-200/50 shadow-2xs hover:border-emerald-500/25 transition-all">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-sm">💡</span>
                <div className="text-left leading-none">
                  <span className="text-[9px] text-pitch-slate-500 block font-bold uppercase tracking-wider">Lighting</span>
                  <span className="text-xs font-black text-pitch-charcoal block mt-1">Zero-Shadow LED</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-slate-200/50 shadow-2xs hover:border-emerald-500/25 transition-all">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-sm">🕒</span>
                <div className="text-left leading-none">
                  <span className="text-[9px] text-pitch-slate-500 block font-bold uppercase tracking-wider">Hours</span>
                  <span className="text-xs font-black text-pitch-charcoal block mt-1">{openTime} - {closeTime}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/60 backdrop-blur-xs border border-slate-200/50 shadow-2xs hover:border-emerald-500/25 transition-all">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 text-sm">🎟️</span>
                <div className="text-left leading-none">
                  <span className="text-[9px] text-pitch-slate-500 block font-bold uppercase tracking-wider">Passcode</span>
                  <span className="text-xs font-black text-pitch-charcoal block mt-1">Smart Gate PIN</span>
                </div>
              </div>
            </div>

            {/* Standard actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onBookClick}
                className="group inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-brand-glow cursor-pointer"
              >
                <Calendar className="w-4.5 h-4.5 mr-2 group-hover:rotate-3 transition-transform" />
                Select Playing Slot
              </button>

              <button
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-350 text-pitch-charcoal font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
              >
                Learn Features
                <ArrowRight className="w-4 h-4 ml-2 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 max-w-md flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold text-pitch-slate-500 uppercase tracking-widest">
                Automated gate pin sent immediately on confirmation
              </span>
            </div>
          </motion.div>

          {/* Slideshow Image Card */}
          <motion.div 
            className="relative w-full flex justify-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="relative w-full max-w-[430px] aspect-[4/5] rounded-3xl bg-slate-100 border border-white/10 hover:border-white/20 shadow-premium-tall hover:shadow-[0_20px_50px_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-300 group">
              
              {/* Slideshow image switcher wrapper */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={photoIndex}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img 
                    src={slideImages[photoIndex].url}
                    alt={slideImages[photoIndex].caption}
                    className="w-full h-full object-cover select-none"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Minimalist overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pitch-charcoal/90 via-pitch-charcoal/30 to-transparent p-6 text-white text-left">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  {name.split(" ")[0]} Live View
                </span>
                <h3 className="text-base font-extrabold tracking-tight mt-1 leading-tight">
                  {slideImages[photoIndex].caption}
                </h3>
                
                {/* Visual Indicators */}
                <div className="flex gap-1.5 mt-4">
                  {slideImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPhotoIndex(idx)}
                      className={`h-1 rounded-full transition-all cursor-pointer ${idx === photoIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-white/40'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
