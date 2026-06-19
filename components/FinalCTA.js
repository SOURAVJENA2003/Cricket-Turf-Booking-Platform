'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export default function FinalCTA({ onBookClick }) {
  return (
    <section id="pricing" className="bg-white border-b border-slate-100 py-20 md:py-28 relative overflow-hidden text-center font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Simple conversion tag */}
        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider px-3.5 py-1 bg-emerald-100/40 border border-emerald-200/50 rounded-full mb-6 animate-pulse">
          Fast Reservation
        </span>

        {/* Strong headline */}
        <h2 className="text-3xl sm:text-4.5xl font-display font-extrabold text-pitch-charcoal tracking-tight leading-tight max-w-3xl">
          Reserve Your Nets in Seconds.
        </h2>

        {/* Clear conversion message */}
        <p className="text-pitch-slate-500 text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
          Pick your timing, add standard upgrades, and receive your arena smart gate pass code instantly.
        </p>

        {/* Conversion CTA */}
        <div className="mt-8">
          <button
            onClick={onBookClick}
            className="group inline-flex items-center justify-center px-8 py-4.5 rounded-lg bg-pitch-charcoal hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow-brand-glow cursor-pointer"
          >
            <Calendar className="w-4 h-4 mr-2 group-hover:rotate-6 transition-transform" />
            Select Available Slot
          </button>
        </div>

      </div>
    </section>
  );
}
