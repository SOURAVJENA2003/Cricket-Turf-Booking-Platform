import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import BookingWidget from './components/BookingWidget';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import LocationSpotlight from './components/LocationSpotlight';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'booking'>('landing');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // offset for the sticky navbar
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

  const handleNavigateToSection = (sectionId: string) => {
    if (view !== 'landing') {
      setView('landing');
      // Buffer slightly to allow mounting of components, then scroll smoothly
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const changeView = (newView: 'landing' | 'booking') => {
    setView(newView);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans antialiased text-left flex flex-col justify-between">
      <div>
        {/* Sticky Top Navigation */}
        <Navbar 
          currentView={view} 
          setView={changeView} 
          onNavigateToSection={handleNavigateToSection} 
        />

        {/* Immersive Dual-Page Dynamic Router with Framer Motion transitions */}
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {/* Hero Presentation */}
              <Hero 
                onBookClick={() => changeView('booking')} 
                onExploreClick={() => handleNavigateToSection('location-specs')} 
              />

              {/* Active Location spotlight and Arena Specification Blueprints */}
              <LocationSpotlight onBookClick={() => changeView('booking')} />

              {/* Premium Athletic Live Metrics Grid */}
              <Stats />

              {/* Verified High Contrast Visual Gallery */}
              <Gallery />

              {/* Solitary High Impact booking action Call To Action */}
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
              {/* Interactive Live Booking Sandbox Space */}
              <div className="pt-16">
                <BookingWidget onBackToHome={() => changeView('landing')} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Multi-column Branding Footer */}
      <Footer />
    </div>
  );
}
