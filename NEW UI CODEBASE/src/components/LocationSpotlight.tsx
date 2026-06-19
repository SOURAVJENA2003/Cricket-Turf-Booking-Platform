import React, { useState } from 'react';
import { MapPin, ExternalLink, Clock, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PREMIUM_TURF } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface LocationSpotlightProps {
  onBookClick?: () => void;
}

export default function LocationSpotlight({ onBookClick }: LocationSpotlightProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1540747737956-37872404459a?auto=format&fit=crop&q=80&w=1200",
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

  return (
    <section id="location-specs" className="bg-white border-b border-slate-100 py-10 md:py-16 relative overflow-hidden font-sans text-left">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Playo-Style Breadcrumbs trail route prefix */}
        <div className="flex items-center space-x-1.5 text-xs text-pitch-slate-400 font-semibold mb-3">
          <span className="hover:text-pitch-charcoal transition-colors cursor-pointer">Venues</span>
          <span>&gt;</span>
          <span className="hover:text-pitch-charcoal transition-colors cursor-pointer">Odisha</span>
          <span>&gt;</span>
          <span className="text-pitch-charcoal font-bold">{PREMIUM_TURF.name}</span>
        </div>

        {/* Playo-Style Title block headers */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-pitch-charcoal tracking-tight">
            {PREMIUM_TURF.name}
          </h2>
          
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-sm">
            <span className="text-pitch-slate-650 font-medium">
              Infront of Omfed Plant, Railway Station Road, Jeypore, Odisha
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

        {/* Playo-Style 2-Column Grid of specific height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Image Slider with navigation overlay arrows */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shadow-premium-tall group">
              
              {/* Active Image element with smooth transitions */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={photoIndex}
                  src={images[photoIndex]} 
                  alt="Elite Stadium Field"
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover select-none"
                />
              </AnimatePresence>

              {/* Slider dark overlay vignette on bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

              {/* Slider overlay Left trigger arrow button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs select-none shadow-premium-soft hover:scale-105"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Slider overlay Right trigger arrow button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs select-none shadow-premium-soft hover:scale-105"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Pagination indicators bubble row in bottom-left/center */}
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

              {/* Premium play branding decal overlay */}
              <div className="absolute bottom-6 right-6 select-none font-black text-lg text-emerald-400 font-mono tracking-widest bg-black/60 px-3 py-1.5 rounded-lg border border-white/15 backdrop-blur-xs flex items-center gap-1">
                <span>RUNMAKERS</span>
                <span className="text-[10px] bg-emerald-500 text-pitch-charcoal font-sans font-extrabold px-1.5 py-0.5 rounded">CLUB</span>
              </div>

            </div>

            {/* Minor specifications pill strip */}
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

          {/* Right Column: Playo Sticky Sidebar Actions & Detail blocks */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            
            {/* TIMING details box */}
            <div className="border border-slate-200 hover:border-slate-350 rounded-xl p-5 bg-white text-left space-y-2 transition-all shadow-xs">
              <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
                <Clock className="w-4 h-4 text-emerald-650" />
                <h4 className="text-xs font-black uppercase tracking-wider text-pitch-charcoal">Timing</h4>
              </div>
              <p className="text-sm font-extrabold text-pitch-charcoal pt-1">
                6:00 AM – 11:00 PM
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
                <p className="text-xs font-black text-pitch-charcoal">Runmakers Arena Jeypore</p>
                <p className="text-xs text-pitch-slate-600 leading-relaxed mt-1 font-sans">
                  Infront of Omfed Plant, Railway Station Road, Chowk, Bankobija, Jeypore, Odisha 764002
                </p>
              </div>

              {/* Simplified micro map viewport illustration */}
              <div className="relative h-32 rounded-lg border border-slate-150 overflow-hidden bg-slate-50 flex items-center justify-center group focus-within:ring-2 focus-within:ring-emerald-500">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px] opacity-75" />
                
                {/* Simulated routes */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-200 transform -rotate-12" />
                <div className="absolute top-0 left-1/3 w-1.5 h-full bg-slate-200 transform rotate-45" />

                {/* Animated map pin */}
                <div className="absolute w-12 h-12 bg-emerald-500/25 rounded-full animate-ping pointer-events-none" />
                <div className="absolute z-10 w-4 h-4 rounded-full bg-emerald-650 border border-white flex items-center justify-center shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div className="absolute bottom-2 inset-x-2.5 flex justify-between items-center bg-white/95 backdrop-blur-xs py-1.5 px-2.5 rounded border border-slate-250 shadow-sm">
                  <span className="text-[9px] font-bold text-pitch-charcoal">Station Road Jeypore</span>
                  <a 
                    href={PREMIUM_TURF.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>Get Info</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <a 
                href={PREMIUM_TURF.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.8 border border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-pitch-charcoal rounded-lg cursor-pointer"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
