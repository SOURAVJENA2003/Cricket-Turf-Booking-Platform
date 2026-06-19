'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X, ZoomIn, Info } from 'lucide-react';

export default function Gallery({ turfDetails }) {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const name = turfDetails?.name || "Runmakers Arena Box Cricket";

  const galleryItems = [
    {
      id: 'img-1',
      category: 'turf',
      title: "Cushioned AstroTurf Match Pitch",
      description: "Our high-density synthetic grass matting is double-cushioned to guard players against knee shocks and support true ball bounds.",
      url: "https://images.unsplash.com/photo-1540747737956-37872404459a?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-2',
      category: 'action',
      title: "Stadium Sunset Atmosphere",
      description: `Beautiful evening setting at ${name} showing premium high-mast floodlight beams ready for late-night corporate matches.`,
      url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-3',
      category: 'gear',
      title: "Grade-1 English Wood Kits",
      description: "Our rental locker includes top-of-the-line bats, genuine professional leather balls, and full premium protection pads.",
      url: "https://images.unsplash.com/photo-1624526261182-ab3dfc01a2c3?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-4',
      category: 'action',
      title: "Perfect Net Enclosure Focus",
      description: "Secure, massive steel nets enclosing the entire 120ft field to keep high fly shots within limits while maintaining excellent outside visibility.",
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-5',
      category: 'turf',
      title: "Zero-Shadow Night Floodlights",
      description: "Equipped with professional LED floodlight arrays to eliminate shadows during critical spin matches and ball releases.",
      url: "https://images.unsplash.com/photo-1593787406536-3676a152d9cb?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-6',
      category: 'action',
      title: "Dynamic Target Training Nets",
      description: "Specialized side nets and bowling machines designed for batting drills, batting angle training, and solo team practices.",
      url: "https://images.unsplash.com/photo-1510563800743-aed236490d08?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-7',
      category: 'gear',
      title: "Heavy Tennis & Leather Tournaments",
      description: "Ready for customized formats. We support both high-impact corporate tennis balls and classic leather cricket matches.",
      url: "https://images.unsplash.com/photo-1562088287-bde35a1ea917?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-8',
      category: 'action',
      title: "Team Dugouts & Refreshments",
      description: "Spacious under-canopy seating space for team members to strategize, monitor live scorecards, and rest in style.",
      url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-9',
      category: 'turf',
      title: "Overhead Canopy Rain Cover",
      description: "Our retractable all-weather sheet keeps the arena active during monsoons, facilitating true rain-or-shine cricket sessions.",
      url: "https://images.unsplash.com/photo-1594470117754-e3475ad7d2a5?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <section id="arena-gallery" className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/40 py-16 md:py-24 relative overflow-hidden font-sans">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight bg-gradient-to-r from-pitch-charcoal via-slate-800 to-slate-900 bg-clip-text text-transparent">
            {name.split(" ").slice(0, 2).join(" ")} Match Visuals
          </h2>
          <div className="w-12 h-1 bg-emerald-600 rounded-full mt-3.5 mb-2" />
          <p className="text-xs sm:text-sm text-pitch-slate-550 mt-1.5 leading-relaxed max-w-xl font-medium">
            Take a visual tour of our premier turf, custom lighting systems, top-tier match gear, and active game atmosphere.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'action', label: 'Match Action' },
            { id: 'turf', label: 'Infield & Turf' },
            { id: 'gear', label: 'Pro Equipment' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer shadow-3xs hover:-translate-y-0.5 ${
                filter === tab.id 
                  ? 'bg-emerald-650 border-emerald-600 text-white shadow-sm' 
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-350 text-pitch-slate-550 hover:text-pitch-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative h-[250px] rounded-2xl bg-white border border-slate-200/70 shadow-premium-soft hover:shadow-brand-glow overflow-hidden flex flex-col justify-end cursor-pointer transition-all duration-300"
                onClick={() => setSelectedItem(item)}
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-pitch-charcoal via-pitch-charcoal/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/95 backdrop-blur-xs flex items-center justify-center border border-slate-200 text-pitch-charcoal opacity-0 group-hover:opacity-100 transition-all translate-y-1.5 group-hover:translate-y-0 duration-200 shadow-2xs">
                  <ZoomIn className="w-4 h-4 text-emerald-700" />
                </div>

                <div className="relative p-5 text-white text-left z-10">
                  <span className="text-[8px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-lg inline-block mb-2 backdrop-blur-xs">
                    {item.category === 'action' ? 'Match Action' : item.category === 'turf' ? 'Infields' : 'Equipment'}
                  </span>
                  <h3 className="text-sm font-extrabold tracking-tight group-hover:text-emerald-300 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-350 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all duration-300 font-sans font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal Overlay for Expanded Details */}
        <AnimatePresence>
          {selectedItem && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pitch-charcoal/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div 
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden border border-slate-200/80 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:rotate-90 duration-200"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-7 h-[280px] md:h-[420px] bg-slate-900 relative">
                    <img 
                      src={selectedItem.url} 
                      alt={selectedItem.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:col-span-5 p-6 flex flex-col justify-between text-left bg-slate-50/50">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-lg inline-block mb-3">
                        {selectedItem.category === 'action' ? 'Match Action' : selectedItem.category === 'turf' ? 'Infields' : 'Equipment'}
                      </span>
                      <h3 className="text-lg font-display font-black text-pitch-charcoal leading-tight">
                        {selectedItem.title}
                      </h3>
                      <p className="text-xs text-pitch-slate-500 font-sans mt-4 leading-relaxed font-medium">
                        {selectedItem.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-200/60 flex items-center gap-2 text-[9px] text-pitch-slate-400 font-bold uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5 text-emerald-600" /> Professional Grade Verified
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
