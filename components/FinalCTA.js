'use client';

import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

export default function FinalCTA({ onBookClick }) {
  return (
    <section className="bg-white py-16 md:py-24 font-sans border-b border-slate-200/40 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Modern Minimalist Light Card */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-premium-tall hover:shadow-brand-glow transition-all duration-300 flex flex-col items-center">
          {/* Subtle green mesh on the side */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-4">
            
            {/* Conversion Badge */}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-emerald-55 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-full select-none">
              <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" /> Fast Reservation
            </span>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3.5xl font-display font-black text-pitch-charcoal tracking-tight leading-tight">
              Ready to Hit the Pitch?
            </h2>

            {/* Description */}
            <p className="text-pitch-slate-500 text-xs sm:text-sm font-normal leading-relaxed">
              Book your nets instantly online. Check active slots, select timings, and receive your smart gate pass code immediately.
            </p>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={onBookClick}
                className="group inline-flex items-center justify-center px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl shadow-brand-glow transition-all duration-200 cursor-pointer"
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
