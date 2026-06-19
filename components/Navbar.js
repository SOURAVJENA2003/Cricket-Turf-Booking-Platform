'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ currentView, setView, onNavigateToSection, turfDetails }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavItemClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    onNavigateToSection(sectionId);
  };

  // Dynamically structure the brand logo text using database turf settings
  const logoText = turfDetails?.name || "Runmakers Arena Box Cricket";
  const nameParts = logoText.split(" ");
  const mainName = nameParts.slice(0, 2).join(" ") || nameParts[0];
  const badgeName = nameParts.length > 2 ? nameParts.slice(2).join(" ") : "ARENA";

  const isGreenHeader = isScrolled || currentView === 'booking';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isGreenHeader
          ? 'bg-emerald-600 border-emerald-500 py-3.5 shadow-md text-white'
          : 'bg-transparent border-transparent py-5 text-pitch-slate-500'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={handleLogoClick}
          >
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
              isGreenHeader 
                ? 'bg-white/10 text-white border border-white/20' 
                : 'bg-emerald-500 text-white shadow-brand-glow'
            } group-hover:scale-105`}>
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-lg font-display font-extrabold tracking-tight flex items-center gap-1 transition-colors ${
                isGreenHeader ? 'text-white' : 'text-pitch-charcoal'
              }`}>
                {mainName.toUpperCase()}
                <span className={`text-[10px] border px-1.5 py-0.5 rounded font-sans font-bold transition-all ${
                  isGreenHeader 
                    ? 'text-emerald-100 border-emerald-500 bg-emerald-700' 
                    : 'text-emerald-700 border-emerald-300/40 bg-emerald-50'
                }`}>
                  {badgeName.toUpperCase()}
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleLogoClick()}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 cursor-pointer ${
                currentView === 'landing' 
                  ? (isGreenHeader ? 'text-white border-b-2 border-white/60' : 'text-emerald-700') 
                  : (isGreenHeader ? 'text-emerald-100 hover:text-white' : 'text-pitch-slate-500 hover:text-pitch-charcoal')
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavItemClick('location-specs')}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 cursor-pointer ${
                isGreenHeader ? 'text-emerald-100 hover:text-white' : 'text-pitch-slate-500 hover:text-pitch-charcoal'
              }`}
            >
              Location & Specs
            </button>
            <button
              onClick={() => handleNavItemClick('arena-gallery')}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 cursor-pointer ${
                isGreenHeader ? 'text-emerald-100 hover:text-white' : 'text-pitch-slate-500 hover:text-pitch-charcoal'
              }`}
            >
              Arena Gallery
            </button>
            <Link 
              href="/cancel" 
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 ${
                isGreenHeader ? 'text-emerald-100 hover:text-white' : 'text-pitch-slate-500 hover:text-pitch-charcoal'
              }`}
            >
              Cancel Booking
            </Link>
            <Link 
              href="/admin/login" 
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 ${
                isGreenHeader ? 'text-emerald-100 hover:text-white' : 'text-pitch-slate-500 hover:text-pitch-charcoal'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Call to Action button */}
          <div className="hidden md:flex items-center space-x-4">
            {currentView === 'landing' ? (
              <button
                onClick={() => setView('booking')}
                className={`group relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm cursor-pointer ${
                  isGreenHeader 
                    ? 'bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-md' 
                    : 'bg-pitch-charcoal text-white hover:bg-emerald-600 hover:shadow-brand-glow animate-pulse'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 mr-2 group-hover:rotate-12 transition-transform" />
                Book Arena
              </button>
            ) : (
              <button
                onClick={() => setView('landing')}
                className={`group relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg border text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  isGreenHeader 
                    ? 'border-white/35 bg-white/10 text-white hover:bg-white/20' 
                    : 'border-slate-300 hover:border-slate-400 bg-white text-pitch-charcoal'
                }`}
              >
                ← Back to Home
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-lg focus:outline-none cursor-pointer transition-colors ${
                isGreenHeader 
                  ? 'text-white hover:text-emerald-100' 
                  : 'text-pitch-slate-500 hover:text-pitch-charcoal'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-b shadow-lg transition-all ${
          isGreenHeader 
            ? 'bg-emerald-600/95 backdrop-blur-lg border-emerald-500' 
            : 'bg-white/90 backdrop-blur-lg border-slate-200/80 shadow-premium-tall'
        }`}>
          <div className="px-4 pt-2 pb-6 space-y-3 sm:px-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogoClick();
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isGreenHeader ? 'text-emerald-100 hover:text-white hover:bg-emerald-700/60' : 'text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavItemClick('location-specs')}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isGreenHeader ? 'text-emerald-100 hover:text-white hover:bg-emerald-700/60' : 'text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55'
              }`}
            >
              Location & Specs
            </button>
            <button
              onClick={() => handleNavItemClick('arena-gallery')}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isGreenHeader ? 'text-emerald-100 hover:text-white hover:bg-emerald-700/60' : 'text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55'
              }`}
            >
              Arena Gallery
            </button>
            <Link 
              href="/cancel" 
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isGreenHeader ? 'text-emerald-100 hover:text-white hover:bg-emerald-700/60' : 'text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55'
              }`}
            >
              Cancel Booking
            </Link>
            <Link 
              href="/admin/login" 
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isGreenHeader ? 'text-emerald-100 hover:text-white hover:bg-emerald-700/60' : 'text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55'
              }`}
            >
              Admin Portal
            </Link>
            <div className={`pt-4 border-t ${isGreenHeader ? 'border-emerald-500' : 'border-slate-100'}`}>
              {currentView === 'landing' ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setView('booking');
                  }}
                  className={`flex w-full items-center justify-center px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    isGreenHeader 
                      ? 'bg-white text-emerald-700 hover:bg-emerald-50' 
                      : 'bg-pitch-charcoal text-white hover:bg-emerald-600'
                  }`}
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
                  className={`flex w-full items-center justify-center px-4 py-3 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
                    isGreenHeader 
                      ? 'border-white/30 bg-white/10 text-white hover:bg-white/20' 
                      : 'border-slate-200 text-pitch-charcoal bg-white'
                  }`}
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
