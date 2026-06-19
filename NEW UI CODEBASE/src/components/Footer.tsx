import React from 'react';
import { Trophy, Github, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-pitch-slate-500 py-12 md:py-16 border-t border-slate-200 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Arena Specifications Block */}
        <div className="border-b border-slate-200 pb-10 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xs font-black text-pitch-charcoal uppercase tracking-widest">
                Arena Specifications
              </h3>
              <p className="text-xs text-pitch-slate-650 mt-1.5 max-w-3xl leading-relaxed">
                Sports club in Jeypore, Odisha. Built for ultimate performance, consistent bounce, and premium stadium floodlighting active daily from <strong>6:00 AM to 11:00 PM</strong>.
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
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-pitch-charcoal flex items-center gap-1.5">
                RUNMAKERS<span className="text-emerald-700 text-[9px] font-bold border border-emerald-250 px-1 rounded bg-emerald-50">ARENA</span>
              </span>
            </div>
            
            <p className="text-xs text-pitch-slate-500 leading-relaxed max-w-sm">
              Runmakers Arena is Jeypore's high-grade cushioned AstroTurf Box slot. Guided by professional flight illumination, secure gate passcode automation, and elite cricket accessories.
            </p>

            {/* Social media icons */}
            <div className="flex space-x-2.5 pt-1">
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-450 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer">
                <Twitter className="w-3.5 h-3.5" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-450 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer">
                <Github className="w-3.5 h-3.5" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-450 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer">
                <Facebook className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Column 2 - Operational Networks */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-pitch-charcoal">Arena Nets</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-650 transition-colors">🏏 Net #1: Pro Swing AstroTurf</li>
              <li className="hover:text-emerald-650 transition-colors">🏏 Net #2: Spin Master Hybrid</li>
              <li className="hover:text-emerald-650 transition-colors">🏏 Net #3: Auto Bowling Machine</li>
              <li className="hover:text-emerald-650 transition-colors">🏏 Net #4: High-Lux Match Net</li>
            </ul>
          </div>

          {/* Column 3 - Features Platform */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-pitch-charcoal">Offerings</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-650 transition-colors">Online Booking</li>
              <li className="hover:text-emerald-650 transition-colors">Floodlight Access</li>
              <li className="hover:text-emerald-650 transition-colors">Ground Addons</li>
              <li className="hover:text-emerald-650 transition-colors">PIN Passcodes</li>
            </ul>
          </div>

          {/* Column 4 - Standards & Safety */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-pitch-charcoal">Quality Assurance</h4>
            <p className="text-xs text-pitch-slate-500 leading-relaxed">
              Our turfs are designed to international box cricket standards. We use certified sub-base foam layers to absorb shock and protect your knees from intensive play.
            </p>
          </div>

        </div>

        {/* Closing Row */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:justify-between items-center text-[11px] text-pitch-slate-500 gap-4">
          <div>
            © {currentYear} Runmakers Arena Box Cricket. Powered by CreasePro. All rights reserved.
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
