'use client';

import React from 'react';
import { Trophy, Star, Clock, MapPin, Phone, Mail, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Footer({ turfDetails }) {
  const currentYear = new Date().getFullYear();

  const name = turfDetails?.name || "Runmakers Arena Box Cricket";
  const address = turfDetails?.address || "Infront of Omfed Plant, Railway Station Road, Chowk, Bankobija, Jeypore, Odisha 764002";
  const openTime = turfDetails?.openTime || "06:00";
  const closeTime = turfDetails?.closeTime || "23:00";
  const description = turfDetails?.description || "Built for ultimate performance, consistent bounce, and premium stadium floodlighting active daily.";
  
  const logoText = name;
  const nameParts = logoText.split(" ");
  const mainName = nameParts.slice(0, 2).join(" ") || nameParts[0];
  const badgeName = nameParts.length > 2 ? nameParts.slice(2).join(" ") : "ARENA";

  const locationText = address.includes("Jeypore") ? "Jeypore, OD" : "Odisha, IN";

  return (
    <footer className="bg-emerald-50/50 text-slate-600 py-12 border-t border-emerald-100/60 font-sans text-left relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-teal-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center">
              <span className="text-lg font-display font-extrabold tracking-tight text-pitch-charcoal">
                {mainName.toUpperCase()}
              </span>
            </div>
            
            <p className="text-sm text-pitch-slate-550 max-w-md leading-relaxed">
              {description} Equipped with professional zero-shadow floodlights and automated gate passcode system.
            </p>

            {/* Social Links */}
            <div className="flex space-x-2 pt-1">
              {turfDetails?.instagramUrl && (
                <a 
                  href={turfDetails.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-500/30 flex items-center justify-center transition-all cursor-pointer hover:bg-slate-100/50"
                  title="Instagram"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {turfDetails?.whatsappNumber && (
                <a 
                  href={`https://wa.me/${turfDetails.whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-500/30 flex items-center justify-center transition-all cursor-pointer hover:bg-slate-100/50"
                  title="WhatsApp"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-6 grid grid-cols-2 gap-4 w-full pt-1">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Portal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/cancel" className="text-pitch-slate-550 hover:text-emerald-700 font-medium transition-colors">Cancel Booking</Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-pitch-slate-550 hover:text-emerald-700 font-medium transition-colors">Admin Portal</Link>
                </li>
                {turfDetails?.googleMaps && (
                  <li>
                    <a href={turfDetails.googleMaps} target="_blank" rel="noopener noreferrer" className="text-pitch-slate-550 hover:text-emerald-700 font-medium transition-colors">Google Maps Location</a>
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Contact Support</h4>
              <ul className="space-y-2 text-sm text-pitch-slate-550">
                {turfDetails?.phone && (
                  <li className="flex items-center space-x-1.5 hover:text-pitch-charcoal transition-colors cursor-default">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{turfDetails.phone}</span>
                  </li>
                )}
                {turfDetails?.email && (
                  <li className="flex items-center space-x-1.5 hover:text-pitch-charcoal transition-colors cursor-default" title={turfDetails.email}>
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 truncate max-w-[140px] block">{turfDetails.email}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer copyright */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:justify-between items-center text-xs text-slate-500 gap-2.5">
          <p>© {currentYear} {name}. All rights reserved.</p>
          <div className="flex space-x-4 text-slate-500 font-medium">
            <span className="hover:text-emerald-700 transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-emerald-700 transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-emerald-700 transition-colors cursor-pointer">Refund Rules</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
