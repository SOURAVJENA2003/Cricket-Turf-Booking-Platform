'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
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
    <footer className="bg-emerald-600 text-emerald-100 py-10 border-t border-emerald-500 font-sans text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Minimalist Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-emerald-500 pb-8 mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">Google Rating</span>
            <span className="text-sm font-extrabold text-white block">5.0 / 5.0 ★</span>
            <span className="text-[10px] text-emerald-200/80 block font-sans">280+ Verified Ratings</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">Operating Hours</span>
            <span className="text-sm font-extrabold text-white block">{openTime} – {closeTime}</span>
            <span className="text-[10px] text-emerald-200/80 block font-sans">Open Daily for Matches</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">All-Weather Ready</span>
            <span className="text-sm font-extrabold text-white block">100% Protection</span>
            <span className="text-[10px] text-emerald-200/80 block font-sans">Retractable Overhead Cover</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">Arena Location</span>
            <span className="text-sm font-extrabold text-white block">{locationText}</span>
            <span className="text-[10px] text-emerald-200/80 block font-sans">Convenient Road Access</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {mainName.toUpperCase()}
                <span className="text-emerald-100 text-[9px] font-bold border border-emerald-500 px-1 rounded bg-emerald-750 bg-emerald-700">
                  {badgeName.toUpperCase()}
                </span>
              </span>
            </div>
            
            <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
              {description} Fully equipped with zero-shadow night illumination and automated gate passcodes.
            </p>

            <div className="text-[11px] text-emerald-200 space-y-1">
              <p><strong>Hours:</strong> {openTime} – {closeTime} (Open Daily)</p>
              <p className="truncate max-w-md"><strong>Address:</strong> {address}</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2 pt-1">
              {turfDetails?.instagramUrl && (
                <a 
                  href={turfDetails.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:text-emerald-600 hover:bg-white transition-all cursor-pointer"
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
                  className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:text-emerald-600 hover:bg-white transition-all cursor-pointer"
                  title="WhatsApp"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-5 grid grid-cols-2 gap-6 w-full">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-white mb-2">Portal</h4>
              <ul className="space-y-1.5 text-[11px] font-bold">
                <li>
                  <Link href="/cancel" className="text-emerald-100 hover:text-white transition-colors">Cancel Booking</Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-emerald-100 hover:text-white transition-colors">Admin Login</Link>
                </li>
                {turfDetails?.googleMaps && (
                  <li>
                    <a href={turfDetails.googleMaps} target="_blank" rel="noopener noreferrer" className="text-emerald-100 hover:text-white transition-colors">Interactive Map</a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-white mb-2">Contact Support</h4>
              <ul className="space-y-1 text-[11px] font-mono text-emerald-100">
                {turfDetails?.phone && <li>Phone: {turfDetails.phone}</li>}
                {turfDetails?.email && <li className="truncate max-w-[150px]" title={turfDetails.email}>Email: {turfDetails.email}</li>}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer copyright */}
        <div className="mt-8 pt-5 border-t border-emerald-500 flex flex-col sm:flex-row sm:justify-between items-center text-[10px] text-emerald-255 text-emerald-100/70 gap-3">
          <p>© {currentYear} {name}. All rights reserved.</p>
          <div className="flex space-x-3.5 text-emerald-100">
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Refund Rules</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
