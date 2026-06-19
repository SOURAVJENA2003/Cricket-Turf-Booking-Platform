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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled || currentView === 'booking'
          ? 'bg-white/80 backdrop-blur-md border-slate-200 py-3.5 shadow-sm'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={handleLogoClick}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 text-white shadow-brand-glow transition-transform group-hover:scale-105">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-display font-extrabold tracking-tight text-pitch-charcoal flex items-center gap-1">
                {mainName.toUpperCase()}
                <span className="text-emerald-700 text-[10px] border border-emerald-300/40 px-1.5 py-0.5 rounded font-sans font-bold bg-emerald-50">
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
                currentView === 'landing' ? 'text-emerald-700' : 'text-pitch-slate-500 hover:text-pitch-charcoal'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavItemClick('location-specs')}
              className="text-xs font-semibold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors py-1 cursor-pointer"
            >
              Location & Specs
            </button>
            <button
              onClick={() => handleNavItemClick('arena-gallery')}
              className="text-xs font-semibold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors py-1 cursor-pointer"
            >
              Arena Gallery
            </button>
            <Link 
              href="/cancel" 
              className="text-xs font-semibold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors py-1"
            >
              Cancel Booking
            </Link>
            <Link 
              href="/admin/login" 
              className="text-xs font-semibold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors py-1"
            >
              Admin
            </Link>
          </nav>

          {/* Call to Action button */}
          <div className="hidden md:flex items-center space-x-4">
            {currentView === 'landing' ? (
              <button
                onClick={() => setView('booking')}
                className="group relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-pitch-charcoal hover:bg-emerald-600 text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow-brand-glow cursor-pointer animate-pulse"
              >
                <Calendar className="w-3.5 h-3.5 mr-2 group-hover:rotate-12 transition-transform" />
                Book Arena
              </button>
            ) : (
              <button
                onClick={() => setView('landing')}
                className="group relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-pitch-charcoal text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer"
              >
                ← Back to Home
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-pitch-slate-500 hover:text-pitch-charcoal focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-3 sm:px-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogoClick();
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55"
            >
              Home
            </button>
            <button
              onClick={() => handleNavItemClick('location-specs')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55"
            >
              Location & Specs
            </button>
            <button
              onClick={() => handleNavItemClick('arena-gallery')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55"
            >
              Arena Gallery
            </button>
            <Link 
              href="/cancel" 
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55"
            >
              Cancel Booking
            </Link>
            <Link 
              href="/admin/login" 
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-pitch-slate-500 hover:text-pitch-charcoal hover:bg-slate-55"
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
                  className="flex w-full items-center justify-center px-4 py-3 rounded-lg bg-pitch-charcoal hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider"
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
                  className="flex w-full items-center justify-center px-4 py-3 rounded-lg border border-slate-200 text-pitch-charcoal bg-white font-bold text-xs uppercase tracking-wider"
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
