import db from '@/lib/db';
const { query } = db;
import Link from 'next/link';
import { formatLocalDateString, formatIstTimestamp } from '@/lib/date-utils';
import styles from './page.module.css';

// Opt out of caching so we always fetch fresh database records
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
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Admin Bookings List</h1>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>Slot Manager</Link>
          <Link href="/admin/settings" className={styles.navLink}>Settings</Link>
        </nav>
      </header>

      <section className={styles.section}>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : bookings.length === 0 ? (
          <p className={styles.noBookings}>No bookings have been made yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Created At</th>
                <th>Booking Date</th>
                <th>Time Slot</th>
                <th>Group ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>UTR</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{formatIstTimestamp(b.created_at)}</td>
                  <td>{formatLocalDateString(b.date)}</td>
                  <td>{b.start_time} - {b.end_time}</td>
                  <td><code>{b.booking_group_id || 'Admin Offline'}</code></td>
                  <td>{b.customer_name}</td>
                  <td>{b.phone}</td>
                  <td>{b.transaction_id || '-'}</td>
                  <td className={b.status === 'pending' ? styles.pending : b.status === 'cancelled' ? styles.cancelled : styles.confirmed}>
                    {b.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <Link href="/admin" className={styles.backLink}>Back to Dashboard</Link>
    </main>
  );
}
