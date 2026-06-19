import db from '@/lib/db';
const { query } = db;
import Link from 'next/link';
import { formatLocalDateString, formatIstTimestamp } from '@/lib/date-utils';
import { LayoutDashboard, CalendarRange, Settings, RefreshCw, ChevronLeft } from 'lucide-react';

// Opt out of caching
export const revalidate = 0;

export default async function AdminBookingsPage() {
  let bookings = [];
  let error = '';

  try {
    const result = await query(
      `SELECT b.id, b.customer_name, b.phone, b.booking_group_id, b.transaction_id, b.status, b.created_at,
              s.date, s.start_time, s.end_time, s.price
       FROM bookings b
       JOIN slots s ON b.slot_id = s.id
       ORDER BY s.date DESC, s.start_time DESC`
    );
    bookings = result.rows;
  } catch (err) {
    console.error('Error fetching bookings list:', err);
    error = 'Failed to load bookings from database.';
  }

  return (
    <main className="min-h-screen bg-pitch-canvas text-pitch-slate-800 font-sans pb-12">
      {/* Console sticky header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white">
              <CalendarRange className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-display font-extrabold tracking-tight text-pitch-charcoal">
              CREASEPRO<span className="text-emerald-700 text-[9px] border border-emerald-300 px-1 py-0.5 rounded ml-1 bg-emerald-50">CONSOLE</span>
            </span>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/admin" className="text-xs font-bold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" /> Slot Manager
            </Link>
            <Link href="/admin/settings" className="text-xs font-bold uppercase tracking-wider text-pitch-slate-500 hover:text-pitch-charcoal transition-colors flex items-center gap-1.5">
              <Settings className="w-4 h-4" /> Settings
            </Link>
          </nav>

        </div>
      </header>

      {/* Main content body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 space-y-6">
        
        {/* Title Dashboard segment */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-premium-soft hover:border-emerald-500/25 transition-all duration-300 text-left">
          <div>
            <h2 className="text-lg font-display font-black text-pitch-charcoal leading-none">Reservations Ledger</h2>
            <p className="text-xs text-pitch-slate-550 mt-1 font-sans">View complete chronological history of user bookings, registration credentials, and gateway UTR codes.</p>
          </div>
        </div>

        {/* ledger list card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-premium-tall overflow-hidden text-left hover:border-emerald-500/10 transition-all duration-300">
          {error ? (
            <div className="py-20 text-center text-xs text-red-500 font-sans font-bold">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-400 font-sans italic">
              No reservation logs found in database ledger.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200/60 text-slate-400 font-black uppercase tracking-wider">
                    <th className="p-4">Timestamp (IST)</th>
                    <th className="p-4">Play Date</th>
                    <th className="p-4">Time range</th>
                    <th className="p-4">Group ID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">UTR Reference</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans font-medium text-pitch-charcoal">
                  {bookings.map((b) => {
                    const isPending = b.status === 'pending';
                    const isCancelled = b.status === 'cancelled';
                    const isConfirmed = b.status === 'confirmed';

                    return (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono text-slate-500">{formatIstTimestamp(b.created_at)}</td>
                        <td className="p-4 font-semibold">{formatLocalDateString(b.date)}</td>
                        <td className="p-4 font-mono font-bold">{b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}</td>
                        <td className="p-4"><code className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px]">{b.booking_group_id || 'Admin blocked'}</code></td>
                        <td className="p-4 font-semibold">{b.customer_name}</td>
                        <td className="p-4 font-mono">{b.phone}</td>
                        <td className="p-4 font-mono tracking-tight">{b.transaction_id || '-'}</td>
                        <td className="p-4">
                          {isPending && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-800">
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <Link href="/admin" className="text-xs font-semibold text-pitch-slate-500 hover:text-pitch-charcoal transition-colors inline-flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

      </section>
    </main>
  );
}
