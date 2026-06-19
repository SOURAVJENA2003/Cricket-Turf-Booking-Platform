'use client';

import { Calendar } from 'lucide-react';

export default function DatePicker({ selectedDate, onDateChange }) {
  return (
    <div className="flex items-center space-x-2.5 bg-white border border-slate-200 rounded-xl px-4.5 py-2.5 shadow-2xs max-w-sm select-none">
      <label htmlFor="date-input" className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 cursor-pointer">
        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
        Play Date:
      </label>
      <input 
        id="date-input" 
        type="date" 
        value={selectedDate} 
        onChange={(e) => onDateChange(e.target.value)}
        className="text-xs font-extrabold text-pitch-charcoal focus:outline-none bg-transparent cursor-pointer border-0 outline-none py-0 px-0.5"
      />
    </div>
  );
}
