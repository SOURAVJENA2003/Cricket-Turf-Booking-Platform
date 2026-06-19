'use client';

import React, { useState } from 'react';
import { MapPin, ExternalLink, Clock, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LocationSpotlight({ onBookClick, turfDetails }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const images = [
    turfDetails?.bannerUrl || "https://images.unsplash.com/photo-1540747737956-37872404459a?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1593787406536-3676a152d9cb?auto=format&fit=crop&q=80&w=1200"
  ];

  const nextImage = () => {
    setPhotoIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setPhotoIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const name = turfDetails?.name || "Runmakers Arena Box Cricket";
  const address = turfDetails?.address || "Infront of Omfed Plant, Railway Station Road, Chowk, Bankobija, Jeypore, Odisha 764002";
  const mapsUrl = turfDetails?.googleMaps || "https://www.google.com/maps/place/Runmakers+Arena+Box+Cricket";
  const openTime = turfDetails?.openTime || "06:00";
  const closeTime = turfDetails?.closeTime || "23:00";

  return (
    <section id="location-specs" className="bg-white border-b border-slate-100 py-10 md:py-16 relative overflow-hidden font-sans text-left">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-1.5 text-xs text-pitch-slate-400 font-semibold mb-3">
          <span className="hover:text-pitch-charcoal transition-colors cursor-pointer">Venues</span>
          <span>&gt;</span>
          <span className="hover:text-pitch-charcoal transition-colors cursor-pointer">Odisha</span>
          <span>&gt;</span>
          <span className="text-pitch-charcoal font-bold">{name}</span>
        </div>

        {/* Title block */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-pitch-charcoal tracking-tight">
            {name}
          </h2>
          
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-sm">
            <span className="text-pitch-slate-650 font-medium truncate max-w-[500px]">
              {address}
            </span>
            
            <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 py-0.5 px-2 rounded text-xs font-bold text-amber-900 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>5.0 (280+ ratings)</span>
            </div>

            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Sports Club
            </span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Slider */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shadow-premium-tall group">
              
              <AnimatePresence mode="wait">
                <motion.img 
                  key={photoIndex}
                  src={images[photoIndex]} 
                  alt="Elite Stadium Field"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover select-none"
                />
              </AnimatePresence>

              {/* Slider overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

              {/* Slider Navigation arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs select-none shadow-premium-soft hover:scale-105"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs select-none shadow-premium-soft hover:scale-105"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Pagination indicators */}
              <div className="absolute bottom-6 left-6 flex items-center space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPhotoIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === photoIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/55'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Branding badge */}
              <div className="absolute bottom-6 right-6 select-none font-black text-sm text-emerald-400 font-mono tracking-widest bg-black/60 px-3 py-1.5 rounded-lg border border-white/15 backdrop-blur-xs flex items-center gap-1">
                <span>{name.split(" ")[0].toUpperCase()}</span>
                <span className="text-[9px] bg-emerald-500 text-pitch-charcoal font-sans font-extrabold px-1 py-0.5 rounded">CLUB</span>
              </div>

            </div>

            {/* Pill strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-xs font-semibold text-pitch-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                ⚽ Enclosed Safety Netting
              </span>
              <span className="text-xs font-semibold text-pitch-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                🏏 Bowling Machine Provision
              </span>
              <span className="text-xs font-semibold text-pitch-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                💡 Anti-Glare Floodlights
              </span>
              <span className="text-xs font-semibold text-pitch-slate-650 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                🚗 Free Parking Area
              </span>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar Actions */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            
            {/* TIMING details box */}
            <div className="border border-slate-200 hover:border-slate-350 rounded-xl p-5 bg-white text-left space-y-2 transition-all shadow-xs">
              <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
                <Clock className="w-4 h-4 text-emerald-650" />
                <h4 className="text-xs font-black uppercase tracking-wider text-pitch-charcoal">Timing</h4>
              </div>
              <p className="text-sm font-extrabold text-pitch-charcoal pt-1">
                {openTime} – {closeTime}
              </p>
              <p className="text-xs text-pitch-slate-500 leading-relaxed font-sans">
                Open all days including national holidays. Custom corporate tournament blocks can be arranged offline.
              </p>
            </div>

            {/* LOCATION details box */}
            <div className="border border-slate-200 hover:border-slate-350 rounded-xl p-5 bg-white text-left space-y-4 transition-all shadow-xs">
              <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-650" />
                <h4 className="text-xs font-black uppercase tracking-wider text-pitch-charcoal">Location</h4>
              </div>
              
              <div>
                <p className="text-xs font-black text-pitch-charcoal">{name}</p>
                <p className="text-xs text-pitch-slate-600 leading-relaxed mt-1 font-sans">
                  {address}
                </p>
              </div>

              {/* micro map illustration linking to dynamic maps url */}
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative h-32 rounded-lg border border-slate-150 overflow-hidden bg-slate-50 flex items-center justify-center group focus-within:ring-2 focus-within:ring-emerald-500"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px] opacity-75" />
                <div className="absolute inset-0 bg-slate-100/10 hover:bg-slate-100/0 transition-colors" />
                <div className="z-10 bg-white border border-slate-200 shadow-sm rounded-lg p-2.5 flex items-center space-x-2 group-hover:scale-103 transition-all cursor-pointer">
                  <MapPin className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <div className="text-[10px] text-left">
                    <span className="font-bold text-pitch-charcoal block">View Interactive Map</span>
                    <span className="text-slate-400 block mt-0.5">Opens in Google Maps</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </a>
            </div>

            {/* Primary select action */}
            {onBookClick && (
              <button
                onClick={onBookClick}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-200 py-4 rounded-xl shadow-md cursor-pointer hover:scale-[1.01]"
              >
                Reserve Field Slot Now
              </button>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
