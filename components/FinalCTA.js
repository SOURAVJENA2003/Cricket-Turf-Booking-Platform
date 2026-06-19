'use client';

import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

export default function FinalCTA({ onBookClick }) {
  return (
    <section className="bg-white py-12 md:py-20 font-sans border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* High-Impact Dark Card */}
        <div className="relative overflow-hidden bg-pitch-charcoal rounded-3xl p-8 md:p-14 text-center shadow-premium-tall border border-slate-800">
          
          {/* Subtle glowing mesh overlays */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-5">
            
            {/* Conversion Badge */}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full select-none">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" /> Fast Reservation
            </span>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
              Reserve Your Arena Box in Seconds
            </h2>

            {/* Description */}
            <p className="text-pitch-slate-350 text-xs sm:text-sm font-normal leading-relaxed max-w-lg">
              Pick your playing timings, complete secure checkout, and get your automated gate pass code instantly.
            </p>

            {/* Action Button */}
            <div className="pt-4 w-full sm:w-auto">
              <button
                onClick={onBookClick}
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-pitch-charcoal font-black uppercase text-xs tracking-wider rounded-xl shadow-brand-glow transition-all duration-200 cursor-pointer"
              >
                <Calendar className="w-4.5 h-4.5 mr-2 group-hover:rotate-6 transition-transform" />
                Select Playing Slot
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
