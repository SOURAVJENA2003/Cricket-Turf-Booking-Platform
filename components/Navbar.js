'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ currentView, setView, onNavigateToSection, turfDetails }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer to highlight current active section on scroll
    const sections = ['home', 'location-specs', 'arena-gallery'];
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleLogoClick = () => {
    setView('landing');
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavItemClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    setActiveSection(sectionId);
    onNavigateToSection(sectionId);
  };

  // Dynamically structure the brand logo text using database turf settings
  const logoText = turfDetails?.name || "Runmakers Arena Box Cricket";
  const nameParts = logoText.split(" ");
  const mainName = nameParts.slice(0, 2).join(" ") || nameParts[0];
  const badgeName = nameParts.length > 2 ? nameParts.slice(2).join(" ") : "ARENA";

  const isGreenHeader = true;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white/80 backdrop-blur-md border-slate-200/50 py-3 shadow-premium-soft text-pitch-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={handleLogoClick}
          >
            <span className="text-lg font-display font-extrabold tracking-tight text-pitch-charcoal hover:text-emerald-700 transition-colors">
              {mainName.toUpperCase()}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleLogoClick()}
              className={`text-xs font-bold uppercase tracking-wider transition-all py-1 cursor-pointer ${
                currentView === 'landing' && activeSection === 'home'
                  ? 'text-emerald-650 font-extrabold' 
                  : 'text-pitch-slate-550 hover:text-pitch-charcoal'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavItemClick('location-specs')}
              className={`text-xs font-bold uppercase tracking-wider transition-all py-1 cursor-pointer ${
                currentView === 'landing' && activeSection === 'location-specs'
                  ? 'text-emerald-650 font-extrabold' 
                  : 'text-pitch-slate-550 hover:text-pitch-charcoal'
              }`}
            >
              Location & Specs
            </button>
            <button
              onClick={() => handleNavItemClick('arena-gallery')}
              className={`text-xs font-bold uppercase tracking-wider transition-all py-1 cursor-pointer ${
                currentView === 'landing' && activeSection === 'arena-gallery'
                  ? 'text-emerald-650 font-extrabold' 
                  : 'text-pitch-slate-550 hover:text-pitch-charcoal'
              }`}
            >
              Arena Gallery
            </button>
            <Link 
              href="/cancel" 
              className="text-xs font-bold uppercase tracking-wider transition-all py-1 text-pitch-slate-550 hover:text-pitch-charcoal"
            >
              Cancel Booking
            </Link>
            <Link 
              href="/admin/login" 
              className="text-xs font-bold uppercase tracking-wider transition-all py-1 text-pitch-slate-550 hover:text-pitch-charcoal"
            >
              Admin
            </Link>
          </nav>

          {/* Call to Action button */}
          <div className="hidden md:flex items-center space-x-4">
            {currentView === 'landing' ? (
              <button
                onClick={() => setView('booking')}
                className="group relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm cursor-pointer bg-emerald-650 hover:bg-emerald-750 text-white hover:shadow-brand-glow"
              >
                <Calendar className="w-3.5 h-3.5 mr-2 group-hover:rotate-12 transition-transform" />
                Book Arena
              </button>
            ) : (
              <button
                onClick={() => setView('landing')}
                className="group relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg border text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border-slate-250 hover:border-slate-350 bg-white text-pitch-charcoal"
              >
                ← Back to Home
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg focus:outline-none cursor-pointer transition-colors text-pitch-slate-550 hover:text-pitch-charcoal"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b shadow-lg transition-all bg-white/95 backdrop-blur-lg border-slate-200/80 shadow-premium-tall text-pitch-charcoal">
          <div className="px-4 pt-2 pb-6 space-y-3 sm:px-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogoClick();
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-pitch-slate-550 hover:text-emerald-700 hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => handleNavItemClick('location-specs')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-pitch-slate-550 hover:text-emerald-700 hover:bg-slate-50"
            >
              Location & Specs
            </button>
            <button
              onClick={() => handleNavItemClick('arena-gallery')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-pitch-slate-550 hover:text-emerald-700 hover:bg-slate-50"
            >
              Arena Gallery
            </button>
            <Link 
              href="/cancel" 
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-pitch-slate-550 hover:text-emerald-700 hover:bg-slate-50"
            >
              Cancel Booking
            </Link>
            <Link 
              href="/admin/login" 
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-pitch-slate-550 hover:text-emerald-700 hover:bg-slate-50"
            >
              Admin Portal
            </Link>
            <div className="pt-4 border-t border-slate-100">
              {currentView === 'landing' ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setView('booking');
                  }}
                  className="flex w-full items-center justify-center px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-emerald-650 hover:bg-emerald-750 text-white shadow-2xs"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Arena
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setView('landing');
                  }}
                  className="flex w-full items-center justify-center px-4 py-3 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all border-slate-200 text-pitch-charcoal bg-white hover:bg-slate-50"
                >
                  Home View
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
