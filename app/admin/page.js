'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';
import { getIstTodayString } from '@/lib/date-utils';
import { LayoutDashboard, CalendarRange, Settings, LogOut, Check, Ban, RefreshCw, Undo } from 'lucide-react';

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(getIstTodayString());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const fetchSlots = async () => {
      try {
        const response = await fetch(`/api/slots?date=${selectedDate}`);
        if (response.status === 401) {
          router.push('/admin/login');
          router.refresh();
          return;
        }
        const data = await response.json();
        if (active && response.ok && data.success) {
          setSlots(data.data);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSlots();
    return () => {
      active = false;
    };
  }, [selectedDate, refreshTrigger, router]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setLoading(true);
  };

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

  const handleAdminAction = async (slotId, isBooked, newStatus = null) => {
    let method = isBooked ? 'DELETE' : 'POST';
    let url = '/api/admin/bookings';
    let body = { slotId };

    if (newStatus) {
      method = 'PATCH';
      body.status = newStatus;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setLoading(true);
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert(data.message || 'Action failed');
        if (response.status === 401) {
          router.push('/admin/login');
          router.refresh();
        }
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  return (
    <main className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans pb-12">
      {/* Admin Sticky Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white">
              <LayoutDashboard className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-display font-extrabold tracking-tight text-pitch-charcoal">
              CREASEPRO<span className="text-emerald-700 text-[9px] border border-emerald-300 px-1 py-0.5 rounded ml-1 bg-emerald-50">CONSOLE</span>
            </span>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/admin/bookings" className="text-xs font-bold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors flex items-center gap-1.5">
              <CalendarRange className="w-4 h-4" /> Bookings
            </Link>
            <Link href="/admin/settings" className="text-xs font-bold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors flex items-center gap-1.5">
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-xs font-bold uppercase tracking-wider text-red-650 hover:text-red-800 text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </nav>

        </div>
      </header>

      {/* Main Admin dashboard content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h2 className="text-lg font-display font-black text-pitch-charcoal leading-none">Slot Operations</h2>
            <p className="text-xs text-pitch-slate-550 mt-1 font-sans">Manage daily time schedule availability, block slot matrices, or confirm pending customer checkouts.</p>
          </div>
          <div className="flex items-center gap-3">
            <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
            <button 
              onClick={() => { setLoading(true); setRefreshTrigger(prev => prev + 1); }}
              className="w-10 h-10 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center text-pitch-charcoal transition-colors cursor-pointer"
              title="Refresh Slots Table"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Slots Table card container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 font-sans italic animate-pulse">
              Synchronizing slot details with database...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider">
                    <th className="p-4">Time Interval</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">UTR Reference</th>
                    <th className="p-4 text-center">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans font-medium text-pitch-charcoal">
                  {slots.map((slot) => {
                    const isBooked = slot.is_booked;
                    const isPending = slot.status === 'pending';
                    const isConfirmed = slot.status === 'confirmed';

                    return (
                      <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold">{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</td>
                        <td className="p-4 font-mono">₹{parseFloat(slot.price)}</td>
                        <td className="p-4">
                          {isBooked ? (
                            isPending ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-800">
                                Pending Verification
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-800">
                                Confirmed Booked
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-800">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="p-4 truncate max-w-[130px] font-semibold">{slot.customer_name || '-'}</td>
                        <td className="p-4 font-mono">{slot.phone || '-'}</td>
                        <td className="p-4 font-mono tracking-tight">{slot.transaction_id || '-'}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            {isBooked && isPending && (
                              <button 
                                onClick={() => handleAdminAction(slot.id, true, 'confirmed')}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1 font-bold transition-colors cursor-pointer"
                                title="Approve UTR & Confirm booking"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleAdminAction(slot.id, isBooked)}
                              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer ${
                                isBooked 
                                  ? 'bg-red-50 hover:bg-red-100 border border-red-200 text-red-700' 
                                  : 'bg-pitch-charcoal hover:bg-emerald-600 text-white shadow-2xs'
                              }`}
                              title={isBooked ? "Release slot to available pool" : "Block slot for offline reservations"}
                            >
                              {isBooked ? (
                                <>
                                  <Undo className="w-3.5 h-3.5" /> Release
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3.5 h-3.5" /> Block Slot
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs font-semibold text-pitch-slate-500 hover:text-pitch-charcoal underline transition-colors">
            ← Return to public website
          </Link>
        </div>

      </section>
    </main>
  );
}
