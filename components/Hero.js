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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-transparent border-b border-slate-200/40 font-sans">
      {/* Decorative premium background meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-50/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            className="lg:col-span-7 flex flex-col space-y-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Premium display headings */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-display font-extrabold text-pitch-charcoal tracking-tight leading-[1.12]">
              Hit Runs in Style at <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                {name}
              </span>
            </h1>

            {/* Clean narrative */}
            <p className="text-sm sm:text-base text-pitch-slate-600 font-normal max-w-xl leading-relaxed">
              {tagline}
            </p>

            {/* Specs list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg pt-1">
              <div className="flex items-center space-x-2.5 text-xs font-bold text-pitch-charcoal">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 border border-emerald-250 flex items-center justify-center text-emerald-800 text-[10px]">✓</span>
                <span>Double-Cushioned Shock Grass</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-bold text-pitch-charcoal">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 border border-emerald-250 flex items-center justify-center text-emerald-800 text-[10px]">✓</span>
                <span>Active {openTime} – {closeTime} Daily</span>
              </div>
            </div>

            {/* Standard actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onBookClick}
                className="group inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-pitch-charcoal hover:bg-emerald-600 hover:scale-[1.02] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-brand-glow cursor-pointer"
              >
                <Calendar className="w-4.5 h-4.5 mr-2 group-hover:rotate-3 transition-transform" />
                Select Playing Slot
              </button>

              <button
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/60 hover:bg-white/90 backdrop-blur-xs border border-slate-200/80 hover:border-slate-350 text-pitch-charcoal font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
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
            className="lg:col-span-5 relative w-full flex justify-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="relative w-full max-w-[430px] aspect-[4/5] rounded-3xl bg-slate-100 border border-slate-200/60 hover:border-emerald-500/35 shadow-premium-tall overflow-hidden transition-all duration-300 group">
              
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
