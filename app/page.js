'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BookingWidget from '@/components/BookingWidget';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import LocationSpotlight from '@/components/LocationSpotlight';
import ArenaSpecs from '@/components/ArenaSpecs';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [view, setView] = useState('landing'); // 'landing' | 'booking'
  const [turfDetails, setTurfDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load database dynamic configurations on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (data.success && data.data.turfDetails) {
          setTurfDetails(data.data.turfDetails);
        }
      } catch (err) {
        console.error('Failed to load turf configurations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigateToSection = (sectionId) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const changeView = (newView) => {
    setView(newView);
    window.scrollTo({ top: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch-canvas flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-xs text-pitch-slate-500 font-bold tracking-wider animate-pulse">LOADING STADIUM CONTROLS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans antialiased text-left flex flex-col justify-between">
      <div>
        {/* Navigation header */}
        <Navbar 
          currentView={view} 
          setView={changeView} 
          onNavigateToSection={handleNavigateToSection}
          turfDetails={turfDetails}
        />

        {/* Dynamic routing with Framer Motion transitions */}
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {/* Hero presentation banner */}
              <Hero 
                onBookClick={() => changeView('booking')} 
                onExploreClick={() => handleNavigateToSection('location-specs')} 
                turfDetails={turfDetails}
              />

              {/* Arena Specifications */}
              <ArenaSpecs turfDetails={turfDetails} />

              {/* Specifications spotlights */}
              <LocationSpotlight 
                onBookClick={() => changeView('booking')} 
                turfDetails={turfDetails}
              />

              {/* Image galleries */}
              <Gallery turfDetails={turfDetails} />

              {/* Booking CTA section */}
              <FinalCTA onBookClick={() => changeView('booking')} />
            </motion.div>
          ) : (
            <motion.div
              key="booking-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {/* Interactive Booking Module */}
              <div className="pt-16">
                <BookingWidget onBackToHome={() => changeView('landing')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic branding footer */}
      <Footer turfDetails={turfDetails} />
    </div>
  );
}
