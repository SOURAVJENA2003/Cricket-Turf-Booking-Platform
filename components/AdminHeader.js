'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, CalendarRange, Settings, LogOut, ExternalLink, Menu, X, Shield } from 'lucide-react';

export default function AdminHeader({ activePage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [turfName, setTurfName] = useState('CreasePro');
  const router = useRouter();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (data.success && data.data?.turfDetails?.name) {
          setTurfName(data.data.turfDetails.name);
        }
      } catch (err) {
        console.error('Failed to load header brand settings:', err);
      }
    };
    fetchConfig();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.success) {
        router.push('/admin/login');
        router.refresh();
      } else {
        alert((data && data.message) || 'Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { id: 'slots', label: 'Slot Manager', href: '/admin', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', href: '/admin/bookings', icon: CalendarRange },
    { id: 'settings', label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const nameParts = turfName.split(' ');
  const mainName = nameParts.slice(0, 2).join(' ') || nameParts[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          
          {/* Logo Brand */}
          <Link href="/admin" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-emerald-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-display font-extrabold tracking-tight text-pitch-charcoal uppercase">
              {mainName}
              <span className="text-emerald-700 text-[9px] border border-emerald-250 px-1.5 py-0.5 rounded ml-1 bg-emerald-50 font-black font-sans uppercase">
                CONSOLE
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                      : 'text-pitch-slate-550 hover:text-pitch-charcoal hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="h-4 w-px bg-slate-200 mx-2" />
            
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-pitch-slate-550 hover:text-pitch-charcoal hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Site
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-red-650 hover:text-red-800 text-red-650 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-pitch-slate-550 hover:text-pitch-charcoal hover:bg-slate-50 focus:outline-none cursor-pointer transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-lg shadow-lg transition-all duration-300">
          <div className="px-4 py-4 space-y-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100/50'
                      : 'text-pitch-slate-550 hover:text-pitch-charcoal hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="h-px bg-slate-100 my-2" />
            
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-pitch-slate-550 hover:text-pitch-charcoal hover:bg-slate-50 transition-all flex items-center gap-2 border border-transparent"
            >
              <ExternalLink className="w-4 h-4" />
              View Public Site
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-650 hover:bg-red-50 transition-all flex items-center gap-2 cursor-pointer border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              Sign Out Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
