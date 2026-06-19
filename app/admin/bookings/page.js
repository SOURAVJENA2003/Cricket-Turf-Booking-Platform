'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { formatLocalDateString, formatIstTimestamp } from '@/lib/date-utils';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Settings, 
  RefreshCw, 
  ChevronLeft, 
  Search, 
  Check, 
  X, 
  Undo,
  Ban,
  AlertCircle
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [processingId, setProcessingId] = useState(null); // slotId of the active action
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/admin/bookings');
        if (response.status === 401) {
          router.push('/admin/login');
          router.refresh();
          return;
        }
        const data = await response.json();
        if (active) {
          if (response.ok && data.success) {
            setBookings(data.data);
            setError('');
          } else {
            setError(data.message || 'Failed to fetch bookings list.');
          }
        }
      } catch (err) {
        if (active) {
          setError('Network error: Could not load the reservations ledger.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBookings();
    return () => {
      active = false;
    };
  }, [refreshTrigger, router]);

  const handleAdminAction = async (slotId, actionType, newStatus = null) => {
    setProcessingId(slotId);
    let method = actionType === 'delete' ? 'DELETE' : 'POST';
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
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert(data.message || 'Action failed');
        if (response.status === 401) {
          router.push('/admin/login');
          router.refresh();
        }
      }
    } catch (error) {
      alert('Something went wrong executing the ledger action.');
    } finally {
      setProcessingId(null);
    }
  };

  // Search and filter logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // 1. Filter by search query
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        (b.customer_name && b.customer_name.toLowerCase().includes(searchLower)) ||
        (b.phone && b.phone.toLowerCase().includes(searchLower)) ||
        (b.booking_group_id && b.booking_group_id.toLowerCase().includes(searchLower)) ||
        (b.transaction_id && b.transaction_id.toLowerCase().includes(searchLower));

      // 2. Filter by status
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  return (
    <main className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans pb-12">
      {/* Console Header */}
      <AdminHeader activePage="bookings" />

      {/* Main content body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-6">
        
        {/* Title Dashboard segment */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-premium-soft hover:border-emerald-500/25 transition-all duration-300 text-left">
          <div>
            <h2 className="text-lg font-display font-black text-pitch-charcoal leading-none">Reservations Ledger</h2>
            <p className="text-xs text-pitch-slate-550 mt-1 font-sans">View complete chronological history of user bookings, check UTR credentials, and verify pending transactions.</p>
          </div>
          <button 
            type="button"
            onClick={() => { setLoading(true); setRefreshTrigger(prev => prev + 1); }}
            disabled={loading}
            className="w-10 h-10 border border-slate-205 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center text-pitch-charcoal transition-colors cursor-pointer flex-shrink-0 self-end sm:self-auto"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Filter controls panel */}
        <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-slate-200/70 p-4.5 shadow-premium-soft flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, group ID, or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 pl-10 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 shadow-3xs w-full bg-white/90"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100/75 border border-slate-200/50 rounded-xl w-full md:w-auto">
            {['All', 'pending', 'confirmed', 'cancelled'].map((status) => {
              const label = status === 'All' ? 'All Bookings' : status.toUpperCase();
              return (
                <button
                  type="button"
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex-1 md:flex-none ${
                    statusFilter === status
                      ? 'bg-white text-pitch-charcoal shadow-3xs font-extrabold'
                      : 'text-pitch-slate-550 hover:text-pitch-charcoal'
                  }`}
                >
                  {status === 'pending' && '⏳ '}
                  {status === 'confirmed' && '✅ '}
                  {status === 'cancelled' && '❌ '}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ledger list card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-premium-tall overflow-hidden text-left hover:border-emerald-500/10 transition-all duration-300 min-h-[300px] flex flex-col justify-start">
          {loading && bookings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-xs text-slate-400 font-sans italic animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mb-2.5" />
              Synchronizing reservations ledger...
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-xs text-red-500 font-sans font-bold">
              <AlertCircle className="w-6 h-6 text-red-650 mb-2" />
              {error}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-20 text-center text-xs text-slate-450 font-sans italic">
              No matching reservation logs found in database ledger.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200/60 text-slate-400 font-black uppercase tracking-wider select-none">
                    <th className="p-4">Timestamp (IST)</th>
                    <th className="p-4">Play Date</th>
                    <th className="p-4">Time range</th>
                    <th className="p-4">Group ID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">UTR Reference</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans font-medium text-pitch-charcoal">
                  {filteredBookings.map((b) => {
                    const isPending = b.status === 'pending';
                    const isCancelled = b.status === 'cancelled';
                    const isConfirmed = b.status === 'confirmed';
                    const isProcessing = processingId === b.slot_id;

                    return (
                      <tr key={b.id} className={`hover:bg-slate-50/50 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                        <td className="p-4 font-mono text-slate-500">{formatIstTimestamp(b.created_at)}</td>
                        <td className="p-4 font-semibold">{formatLocalDateString(b.date)}</td>
                        <td className="p-4 font-mono font-bold">{b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}</td>
                        <td className="p-4">
                          <code className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono">
                            {b.booking_group_id || 'OFFLINE'}
                          </code>
                        </td>
                        <td className="p-4 font-semibold">{b.customer_name}</td>
                        <td className="p-4 font-mono">{b.phone}</td>
                        <td className="p-4 font-mono tracking-tight font-bold">{b.transaction_id || '-'}</td>
                        <td className="p-4">
                          {isPending && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-800 animate-pulse">
                              PENDING
                            </span>
                          )}
                          {isCancelled && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 border border-red-200 text-red-800">
                              CANCELLED
                            </span>
                          )}
                          {isConfirmed && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-800">
                              CONFIRMED
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5 min-w-[130px]">
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                            ) : (
                              <>
                                {isPending && (
                                  <>
                                    <button 
                                      type="button"
                                      onClick={() => handleAdminAction(b.slot_id, 'update', 'confirmed')}
                                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center gap-0.5 font-black text-[9px] uppercase tracking-wide transition-colors cursor-pointer shadow-3xs"
                                      title="Approve transaction & confirm slot"
                                    >
                                      <Check className="w-3 h-3 stroke-[3]" /> Approve
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleAdminAction(b.slot_id, 'delete')}
                                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-md flex items-center gap-0.5 font-black text-[9px] uppercase tracking-wide transition-colors cursor-pointer"
                                      title="Reject payment & cancel booking"
                                    >
                                      <X className="w-3 h-3 stroke-[3]" /> Reject
                                    </button>
                                  </>
                                )}
                                {isConfirmed && b.customer_name !== 'Admin (Offline)' && (
                                  <button 
                                    type="button"
                                    onClick={() => handleAdminAction(b.slot_id, 'delete')}
                                    className="px-2.5 py-1 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-700 rounded-md flex items-center gap-0.5 font-black text-[9px] uppercase tracking-wide transition-all cursor-pointer"
                                    title="Cancel booking and release slot"
                                  >
                                    <Ban className="w-3 h-3" /> Cancel
                                  </button>
                                )}
                                {isConfirmed && b.customer_name === 'Admin (Offline)' && (
                                  <button 
                                    type="button"
                                    onClick={() => handleAdminAction(b.slot_id, 'delete')}
                                    className="px-2.5 py-1 bg-red-55 border border-red-100 text-red-700 hover:bg-red-100 hover:border-red-200 rounded-md flex items-center gap-0.5 font-black text-[9px] uppercase tracking-wide transition-all cursor-pointer"
                                    title="Release offline block"
                                  >
                                    <Undo className="w-3 h-3" /> Release
                                  </button>
                                )}
                                {isCancelled && (
                                  <span className="text-[10px] text-slate-400 italic">No Actions</span>
                                )}
                              </>
                            )}
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
          <Link href="/admin" className="text-xs font-semibold text-pitch-slate-550 hover:text-pitch-charcoal transition-colors inline-flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

      </section>
    </main>
  );
}
