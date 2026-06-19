'use client';

import React from 'react';
import { ShieldCheck, Trophy, Maximize, Zap, Star, Users, Flame, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function ArenaSpecs({ turfDetails }) {
  const openTime = turfDetails?.openTime || "06:00";
  const closeTime = turfDetails?.closeTime || "23:00";

  const statsList = [
    {
      id: 'stat-1',
      icon: <Star className="w-5 h-5 text-amber-300 fill-amber-300" />,
      value: "4.8 ★",
      label: "User Rating",
      description: "Based on 350+ reviews"
    },
    {
      id: 'stat-2',
      icon: <Users className="w-5 h-5 text-emerald-200" />,
      value: "15,000+",
      label: "Active Players",
      description: "Booked this year"
    },
    {
      id: 'stat-3',
      icon: <Flame className="w-5 h-5 text-emerald-250" />,
      value: "100%",
      label: "Uptime",
      description: "Floodlights & Amenities"
    },
    {
      id: 'stat-4',
      icon: <Clock className="w-5 h-5 text-emerald-200" />,
      value: "Instant",
      label: "Smart Gate Pass",
      description: "PIN code sent on booking"
    }
  ];

  const specsList = [
    {
      id: 'spec-1',
      icon: <Trophy className="w-5 h-5 text-emerald-100" />,
      badge: "🏟️ SURFACE",
      title: "Premium AstroTurf",
      description: "Certified double-cushioned synthetic grass with premium sub-base foam layers to absorb knee shocks."
    },
    {
      id: 'spec-2',
      icon: <Maximize className="w-5 h-5 text-emerald-100" />,
      badge: "📐 DIMENSIONS",
      title: "120ft x 70ft Box",
      description: "Standard tournament-size championship box cricket field optimized for action-packed 6v6 or 7v7 matches."
    },
    {
      id: 'spec-3',
      icon: <Zap className="w-5 h-5 text-emerald-100" />,
      badge: "💡 ILLUMINATION",
      title: "Zero-Shadow LEDs",
      description: `Professional high-lux stadium light rigs active daily from ${openTime} to ${closeTime} to ensure perfect visibility.`
    },
    {
      id: 'spec-4',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-100" />,
      badge: "🏏 PRACTICE NETS",
      title: "Custom Nets 1–4",
      description: "Equipped with Pro Swing AstroTurf, Spin Master Hybrid, and automated bowling machine nets."
    }
  ];

  return (
    <section className="bg-emerald-600 text-white py-14 md:py-20 border-b border-emerald-500 font-sans relative overflow-hidden text-left">
      {/* Dynamic background accents */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-teal-500/15 rounded-full blur-[90px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[10px] font-black tracking-widest text-emerald-250 uppercase bg-emerald-700/50 border border-emerald-400 px-3 py-1 rounded-full">
            Elite Ground Layout
          </span>
          <h2 className="text-2xl sm:text-3.5xl font-display font-black text-white mt-3 tracking-tight">
            Arena Specs & Fast Facts
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed font-normal max-w-2xl font-sans">
            Designed to international standards with top-of-the-line specifications, netting structures, and professional lighting arrays.
          </p>
        </div>

        {/* Section 1: "Some Data" (Live statistics row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 md:p-8 bg-emerald-900/20 backdrop-blur-xs border border-emerald-400/20 rounded-2xl mb-12">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="text-left space-y-2 md:border-r border-emerald-500/20 pr-4 last:border-r-0 last:pr-0"
            >
              <div className="flex items-center space-x-2">
                {stat.icon}
                <span className="text-[9px] font-bold text-emerald-200 tracking-wider uppercase font-mono">{stat.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stat.value}
              </div>
              <p className="text-[10px] text-emerald-100 font-normal leading-tight">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section 2: "Small Sections" (Arena specifications breakdown) */}
        <div className="space-y-6">
          <div className="border-t border-emerald-500/20 pt-6 mb-2">
            <h3 className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest font-mono">
              Detailed Specifications Breakdowns
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specsList.map((spec, idx) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-emerald-200 tracking-wider font-mono">
                      {spec.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                      {spec.icon}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-extrabold text-white tracking-tight leading-tight">
                      {spec.title}
                    </h4>
                    <p className="text-[11px] text-emerald-100 font-normal leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
