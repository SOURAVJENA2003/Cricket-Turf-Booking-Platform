'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Hero({ onBookClick, onExploreClick, turfDetails }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const slideImages = [
    {
      url: turfDetails?.bannerUrl || "/hero_turf_pitch.jpg",
      caption: "Cushioned AstroTurf Match Pitch"
    },
    {
      url: "/hero_stadium_lights.jpg",
      caption: "Dusk Stadium Floodlights"
    },
    {
      url: "/hero_netting_arena.jpg",
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

  return (
    <section id="home" className="relative min-h-screen flex flex-col md:flex-row overflow-hidden border-b border-slate-200/45 font-sans bg-white text-left">
      
      {/* Left Column: Text content */}
      <div className="w-full md:w-1/2 min-h-fit md:min-h-screen flex flex-col justify-center pt-28 pb-16 md:pt-24 md:pb-12 px-6 sm:px-12 lg:px-20 xl:px-32 z-10 bg-gradient-to-br from-white via-slate-50/70 to-white relative overflow-hidden">
        {/* Subtle radial ambient light */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
        
        <motion.div 
          className="flex flex-col space-y-5 sm:space-y-7 max-w-xl relative z-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Premium display headings */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-display font-extrabold text-pitch-charcoal tracking-tight leading-[1.12]">
            Hit Runs in Style at <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              {name}
            </span>
          </h1>

          {/* Clean narrative with dynamic side-accent line */}
          <div className="pl-4 border-l-2 border-emerald-550/40 py-0.5">
            <p className="text-[10px] sm:text-sm lg:text-base text-pitch-slate-550 font-medium leading-relaxed">
              {tagline}
            </p>
          </div>

          {/* Standard actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
            <button
              onClick={onBookClick}
              className="group inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-650 hover:bg-emerald-750 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-brand-glow hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
              Select Slot
            </button>

            <button
              onClick={onExploreClick}
              className="group inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-350 text-pitch-charcoal hover:text-emerald-750 font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
            >
              Learn Features
            </button>
          </div>

          <div className="pt-5 border-t border-slate-200/60 flex items-center select-none">
            <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-100/80 border border-slate-200/60 backdrop-blur-xs shadow-3xs">
              <span className="text-[8px] sm:text-[10px] font-bold text-pitch-slate-500 uppercase tracking-widest leading-none flex items-center">
                ⚡ Automated gate pin sent immediately on confirmation
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Slideshow (Edge-to-Edge full-screen right-half) */}
      <div className="w-full md:w-1/2 h-[380px] sm:h-[480px] md:h-auto md:min-h-screen bg-emerald-950 relative z-0">
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
              src={slideImages[photoIndex].url}
              alt={slideImages[photoIndex].caption}
              className="w-full h-full object-cover select-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pitch-charcoal/80 via-transparent to-pitch-charcoal/15 pointer-events-none" />

        {/* Slide details overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-12 text-white text-left z-10 select-none">
          <span className="text-[8px] sm:text-xs uppercase font-black tracking-widest text-emerald-300">
            {name.split(" ")[0]} Arena Live View
          </span>
          <h3 className="text-[10px] sm:text-base lg:text-lg font-display font-black tracking-tight mt-1 leading-tight max-w-md">
            {slideImages[photoIndex].caption}
          </h3>
          
          {/* Visual Indicators */}
          <div className="flex gap-1.5 mt-3 sm:mt-4">
            {slideImages.map((_, idx) => (
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
    </section>
  );
}
