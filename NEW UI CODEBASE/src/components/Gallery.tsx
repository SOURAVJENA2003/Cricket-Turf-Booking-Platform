import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X, Image as ImageIcon, ZoomIn, Info } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'action' | 'turf' | 'gear';
  title: string;
  description: string;
  url: string;
}

export default function Gallery() {
  const [filter, setFilter] = useState<'all' | 'action' | 'turf' | 'gear'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
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
      description: "Beautiful evening setting at Runmakers Arena showing premium high-mast floodlight beams ready for late-night corporate matches.",
      url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'img-3',
      category: 'gear',
      title: "Grade-1 English Wood Kits",
      description: "Our rental locker includes top-of-the-line SS and SG bats, genuine professional leather balls, and full premium protection pads.",
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
      description: "Equipped with professional Level-3 LED floodlight arrays to eliminate shadows during critical spin matches and ball releases.",
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
      description: "Our retractable all-weather sheet keeps the arena active during Odisha monsoons, facilitating true rain-or-shine cricket sessions.",
      url: "https://images.unsplash.com/photo-1594470117754-e3475ad7d2a5?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <section id="arena-gallery" className="bg-slate-50 border-b border-slate-200 py-16 md:py-24 relative overflow-hidden font-sans">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-100/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-amber-50/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
          <span className="text-xs font-semibold text-emerald-755 uppercase tracking-wider px-3 py-1 bg-emerald-50 border border-emerald-150 rounded-full mb-3 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Arena Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-pitch-charcoal tracking-tight">
            Runmakers Match Visuals
          </h2>
          <p className="text-sm text-pitch-slate-500 mt-3 leading-relaxed max-w-xl">
            Take a visual tour Jeypore's premier turf, custom lighting systems, top-tier match gear, and active game atmosphere.
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
              onClick={() => setFilter(tab.id as any)}
              className={`px-4.5 py-1.8 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                filter === tab.id 
                  ? 'bg-pitch-charcoal border-pitch-charcoal text-white shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-slate-350 text-pitch-slate-650 hover:text-pitch-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Image Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -6, transition: { duration: 0.18 } }}
                className="group relative h-[250px] rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-end cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <img 
                  src={item.url} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pitch-charcoal via-pitch-charcoal/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

                {/* Subtle actions hover icon indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center border border-slate-200 text-pitch-charcoal opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                  <ZoomIn className="w-4 h-4 text-pitch-charcoal" />
                </div>

                {/* Information text */}
                <div className="relative p-5 text-white text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800/85 px-2 py-0.5 rounded-full inline-block mb-2">
                    {item.category === 'action' ? 'Match Action' : item.category === 'turf' ? 'Infields' : 'Equipment'}
                  </span>
                  <h3 className="text-sm font-extrabold tracking-tight group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-300 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all duration-200 font-sans">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Minimal Bottom Prompt */}
        <div className="text-center mt-12">
          <p className="text-xs text-pitch-slate-500 flex items-center justify-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            Click on any photo to open high-definition full view with complete specifications.
          </p>
        </div>

        {/* Custom Lightbox Details Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-pitch-charcoal/95 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full border border-slate-200 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-pitch-charcoal text-white hover:bg-emerald-600 flex items-center justify-center transition-all cursor-pointer shadow-md"
                  title="Close slide"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image half */}
                  <div className="aspect-[4/3] md:aspect-auto md:h-[450px] bg-slate-900 relative">
                    <img 
                      src={selectedItem.url} 
                      alt={selectedItem.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Description half */}
                  <div className="p-6 md:p-8 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded">
                          {selectedItem.category.toUpperCase()} SPEC
                        </span>
                        <span className="text-[10px] font-medium text-pitch-slate-500">Runmakers Arena Jeypore</span>
                      </div>
                      
                      <h3 className="text-xl font-extrabold text-pitch-charcoal tracking-tight mt-3">
                        {selectedItem.title}
                      </h3>
                      
                      <p className="text-xs text-pitch-slate-600 leading-relaxed font-sans mt-4">
                        {selectedItem.description}
                      </p>

                      {/* Additional specification details based on category to make it extremely premium */}
                      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-3">
                        <div className="flex items-start gap-2.5 text-xs text-pitch-charcoal">
                          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">Arena Certification</span>
                            <span className="text-[11px] text-pitch-slate-500">Runmakers Quality Assured turf index certification #RPX-22.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                      <span className="text-[10px] font-mono text-pitch-slate-400 font-semibold">Slide ID: {selectedItem.id}</span>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="px-5 py-2 rounded-lg bg-pitch-charcoal hover:bg-emerald-600 transition-colors text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Keep Exploring
                      </button>
                    </div>

                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
