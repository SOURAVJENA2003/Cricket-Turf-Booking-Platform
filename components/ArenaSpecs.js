'use client';

import React from 'react';
import { Trophy, Zap, Maximize, ShieldCheck, Star, Clock, Key } from 'lucide-react';

export default function ArenaSpecs({ turfDetails }) {
  const openTime = turfDetails?.openTime || "06:00";
  const closeTime = turfDetails?.closeTime || "23:00";

  const tickerItems = [
    { text: "PREMIUM DOUBLE-CUSHIONED ASTROTURF", icon: <Trophy className="w-4 h-4 text-emerald-200" /> },
    { text: "PROFESSIONAL ZERO-SHADOW LED LIGHTS", icon: <Zap className="w-4 h-4 text-emerald-250" /> },
    { text: "TOURNAMENT STANDARD 120FT X 70FT BOX", icon: <Maximize className="w-4 h-4 text-emerald-200" /> },
    { text: "INSTANT SMART GATE PASS PIN SENT ON CONFIRMATION", icon: <Key className="w-4 h-4 text-emerald-250" /> },
    { text: "4.8★ AVERAGE PLAYER RATING (350+ REVIEWS)", icon: <Star className="w-4 h-4 text-amber-300 fill-amber-300" /> },
    { text: "ADVANCED PRACTICE NETS 1-4 AVAILABLE", icon: <ShieldCheck className="w-4 h-4 text-emerald-200" /> },
    { text: `OPERATING DAILY: ${openTime} TO ${closeTime}`, icon: <Clock className="w-4 h-4 text-emerald-250" /> },
  ];

  // Duplicate items to ensure a seamless looping visual scroll on wide screens
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-emerald-600 border-y border-emerald-500/60 py-3 relative overflow-hidden select-none whitespace-nowrap animate-marquee-hover-pause flex items-center">
      <div className="animate-marquee flex items-center shrink-0">
        {doubledItems.map((item, idx) => (
          <div key={`m1-${idx}`} className="flex items-center space-x-3 mx-8">
            {item.icon}
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-white uppercase">
              {item.text}
            </span>
            <span className="text-emerald-400 font-bold ml-6">•</span>
          </div>
        ))}
      </div>
      <div className="animate-marquee flex items-center shrink-0" aria-hidden="true">
        {doubledItems.map((item, idx) => (
          <div key={`m2-${idx}`} className="flex items-center space-x-3 mx-8">
            {item.icon}
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-white uppercase">
              {item.text}
            </span>
            <span className="text-emerald-400 font-bold ml-6">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
