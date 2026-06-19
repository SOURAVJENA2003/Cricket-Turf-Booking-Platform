'use client';

import { getIstDateList, formatDatePickerLabel } from '@/lib/date-utils';

export default function DatePicker({ selectedDate, onDateChange }) {
  const dates = getIstDateList();

  return (
    <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs max-w-xs select-none">
      <label htmlFor="date-select" className="text-xs font-black uppercase text-slate-400">Play Date:</label>
      <select 
        id="date-select" 
        value={selectedDate} 
        onChange={(e) => onDateChange(e.target.value)}
        className="text-xs font-bold text-pitch-charcoal focus:outline-none bg-transparent cursor-pointer"
      >
        {dates.map((date) => (
          <option key={date} value={date}>
            {formatDatePickerLabel(date)}
          </option>
        ))}
      </select>
    </div>
  );
}
