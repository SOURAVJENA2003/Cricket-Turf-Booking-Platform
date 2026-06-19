'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

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

  return (
    <footer className="bg-slate-50 text-pitch-slate-500 py-12 md:py-16 border-t border-slate-200 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Arena Specifications Block */}
        <div className="border-b border-slate-200 pb-10 mb-10 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xs font-black text-pitch-charcoal uppercase tracking-widest">
                Arena Specifications
              </h3>
              <p className="text-xs text-pitch-slate-650 mt-1.5 max-w-3xl leading-relaxed">
                {description} Operating daily from <strong>{openTime} to {closeTime}</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs text-left">
              <span className="text-[9px] font-black text-pitch-slate-400 uppercase tracking-wider block">Turf Surface</span>
              <span className="text-xs font-extrabold text-pitch-charcoal mt-1.5 block leading-normal">
                Premium Cushioned Synthetic AstroTurf Matting
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs text-left">
              <span className="text-[9px] font-black text-pitch-slate-400 uppercase tracking-wider block">Dimensions</span>
              <span className="text-xs font-extrabold text-pitch-charcoal mt-1.5 block leading-normal">
                120ft x 70ft (Standard Championship Box)
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs text-left">
              <span className="text-[9px] font-black text-pitch-slate-400 uppercase tracking-wider block">Capacity Limit</span>
              <span className="text-xs font-extrabold text-pitch-charcoal mt-1.5 block leading-normal">
                Up to 14 players (6v6 / 7v7 matches)
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-xs text-left">
              <span className="text-[9px] font-black text-pitch-slate-400 uppercase tracking-wider block">Lighting System</span>
              <span className="text-xs font-extrabold text-pitch-charcoal mt-1.5 block leading-normal">
                Professional Zero-Shadow High-Lux LED Rig
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column 1 - Brand Summary */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-pitch-charcoal flex items-center gap-1.5">
                {mainName.toUpperCase()}
                <span className="text-emerald-700 text-[9px] font-bold border border-emerald-250 px-1 rounded bg-emerald-50">
                  {badgeName.toUpperCase()}
                </span>
              </span>
            </div>
            
            <p className="text-xs text-pitch-slate-500 leading-relaxed max-w-sm font-sans">
              {description} Equipped with night floodlight illumination, automated gate PIN passcodes, and elite box cricket specifications.
            </p>

            {/* Dynamic Social & WhatsApp Contacts */}
            <div className="flex space-x-2.5 pt-1">
              {turfDetails?.instagramUrl && (
                <a 
                  href={turfDetails.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-450 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer"
                  title="Instagram Page"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {turfDetails?.whatsappNumber && (
                <a 
                  href={`https://wa.me/${turfDetails.whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-450 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer"
                  title="WhatsApp Contact"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2 - Nets Specifications */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-pitch-charcoal">Arena Nets</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-600 transition-colors">🏏 Net #1: Pro Swing AstroTurf</li>
              <li className="hover:text-emerald-600 transition-colors">🏏 Net #2: Spin Master Hybrid</li>
              <li className="hover:text-emerald-600 transition-colors">🏏 Net #3: Auto Bowling Machine</li>
              <li className="hover:text-emerald-600 transition-colors">🏏 Net #4: High-Lux Match Net</li>
            </ul>
          </div>

          {/* Column 3 - Features Platform */}
          <div className="md:col-span-2 space-y-3 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-pitch-charcoal">Offerings</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li className="hover:text-emerald-650 transition-colors">Online Booking</li>
              <li className="hover:text-emerald-650 transition-colors">Floodlight Access</li>
              <li className="hover:text-emerald-650 transition-colors">Ground Addons</li>
              <li className="hover:text-emerald-650 transition-colors">PIN Passcodes</li>
            </ul>
          </div>

          {/* Column 4 - Standards */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-pitch-charcoal">Quality Assurance</h4>
            <p className="text-xs text-pitch-slate-500 leading-relaxed font-sans">
              Our turfs are designed to international box cricket standards. We use certified sub-base foam layers to absorb shock and protect your knees from intensive play.
            </p>
          </div>

        </div>

        {/* Closing Row */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:justify-between items-center text-[11px] text-pitch-slate-500 gap-4">
          <div>
            © {currentYear} {name}. Powered by CreasePro. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-pitch-charcoal transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-pitch-charcoal transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-pitch-charcoal transition-colors cursor-pointer">Refund Rules</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
