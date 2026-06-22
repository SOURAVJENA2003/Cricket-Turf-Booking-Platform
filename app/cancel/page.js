'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatLocalDateString, isCancellable } from '@/lib/date-utils';
import { Trash2, ShieldAlert, ArrowLeft, Search, CheckCircle, X } from 'lucide-react';

export default function CancelPage() {
  const [groupId, setGroupId] = useState('');
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Search, 2: Select slots to cancel

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/bookings?groupId=${groupId}&phone=${phone}`);
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.data.length === 0) {
          setError('No bookings found with these details.');
        } else {
          setBookings(data.data);
          setStep(2);
        }
      } else {
        setError(data.message || 'Failed to find bookings');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSelected = async () => {
    if (selectedBookings.length === 0) {
      alert('Please select at least one slot to cancel.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingIds: selectedBookings, phone }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Selected slots cancelled successfully!');
        setBookings(bookings.filter(b => !selectedBookings.includes(b.booking_id)));
        setSelectedBookings([]);
        if (bookings.length === selectedBookings.length) {
          setStep(1);
          setGroupId('');
          setPhone('');
        }
      } else {
        setError(data.message || 'Failed to cancel');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    if (selectedBookings.includes(id)) {
      setSelectedBookings(selectedBookings.filter(b => b !== id));
    } else {
      setSelectedBookings([...selectedBookings, id]);
    }
  };

  return (
    <main className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans py-12 md:py-20 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-premium-tall p-6 md:p-8 relative overflow-hidden text-left hover:border-emerald-500/20 transition-all duration-300">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-amber-500" />
        
        {/* Breadcrumb Header */}
        <div className="flex items-center space-x-2 text-xs text-pitch-slate-450 font-bold uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-pitch-charcoal transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl font-display font-black text-pitch-charcoal mt-1 tracking-tight leading-none">
          Manage Reservations
        </h1>
        
        {step === 1 ? (
          <div className="mt-4 space-y-5">
            <p className="text-xs text-pitch-slate-500 leading-relaxed font-sans">
              Enter your Booking Group ID (e.g., <code>BK-XXXXXX</code>) and mobile number registered during play reservation to view and request cancellations.
            </p>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Booking Group ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. BK-F18A"
                  value={groupId} 
                  onChange={(e) => setGroupId(e.target.value)} 
                  required 
                  className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Mobile Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  className="p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
              {message && <p className="text-xs text-emerald-600 font-bold text-center">{message}</p>}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3.5 rounded-xl bg-pitch-charcoal hover:bg-emerald-600 text-white font-extrabold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Find Reservations'}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            <p className="text-xs text-pitch-slate-500 leading-relaxed font-sans">
              Select one or more active timeline slot blocks you wish to request cancellation for:
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {bookings.map((booking) => {
                const isSelected = selectedBookings.includes(booking.booking_id);
                const cancellable = isCancellable(booking.date, booking.start_time);
                return (
                  <div 
                    key={booking.booking_id} 
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between shadow-2xs select-none ${
                      !cancellable
                        ? 'border-slate-200/40 bg-slate-100/40 opacity-60 cursor-not-allowed'
                        : isSelected
                          ? 'border-emerald-500 bg-emerald-50/20 cursor-pointer'
                          : 'border-slate-200/60 bg-white/60 hover:bg-white/90 backdrop-blur-xs hover:border-slate-350 cursor-pointer'
                    }`}
                    onClick={() => cancellable && toggleSelection(booking.booking_id)}
                  >
                    <div className="flex items-center space-x-3 text-left">
                      {cancellable ? (
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 select-none">
                          <X className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      )}
                      <div className="text-xs">
                        <strong className={`block ${!cancellable ? 'text-slate-400 line-through' : 'text-pitch-charcoal'}`}>
                          {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono">{formatLocalDateString(booking.date)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`text-xs font-mono font-black ${!cancellable ? 'text-slate-400' : 'text-pitch-charcoal'}`}>
                        ₹{parseFloat(booking.price)}
                      </div>
                      {!cancellable && (
                        <span className="text-[8px] font-black uppercase bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100 leading-none">
                          Within 6hrs limit
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}
            {message && <p className="text-xs text-emerald-600 font-bold text-center">{message}</p>}

            <div className="p-3 bg-amber-50/50 border border-amber-150 rounded-xl text-[10px] text-amber-900 flex items-start gap-2 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Cancellation Policy:</strong> Bookings can only be cancelled/refunded at least <strong>6 hours</strong> prior to the slot&apos;s scheduled start time. Cancellations release slots immediately. Refunds are processed manually after admin validation.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setStep(1)} 
                className="py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-pitch-charcoal font-bold text-xs cursor-pointer text-center"
              >
                Back
              </button>
              <button 
                onClick={handleCancelSelected} 
                disabled={loading || selectedBookings.length === 0} 
                className={`py-3 rounded-xl font-extrabold uppercase tracking-wider text-xs cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs ${
                  selectedBookings.length > 0 
                    ? 'bg-red-550 bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-slate-200 text-slate-400 pointer-events-none'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {loading ? 'Cancelling...' : `Cancel Selected`}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
