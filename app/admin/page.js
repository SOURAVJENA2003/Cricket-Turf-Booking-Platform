'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
        if (active && response.ok) {
          setSlots(data);
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
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      } else {
        alert('Logout failed');
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

      if (response.ok) {
        setLoading(true);
        setRefreshTrigger(prev => prev + 1);
      } else {
        const data = await response.json();
        alert(data.error || 'Action failed');
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
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <nav className={styles.nav}>
          <Link href="/admin/bookings" className={styles.navLink}>Bookings List</Link>
          <Link href="/admin/settings" className={styles.navLink}>Settings</Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </nav>
      </header>

      <section className={styles.section}>
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
        
        {loading ? (
          <p>Loading slots...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>UTR</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id}>
                  <td>{slot.start_time} - {slot.end_time}</td>
                  <td>₹{slot.price}</td>
                  <td className={slot.is_booked ? (slot.status === 'pending' ? styles.pending : styles.booked) : styles.available}>
                    {slot.is_booked ? (slot.status === 'pending' ? 'Pending' : 'Booked') : 'Available'}
                  </td>
                  <td>{slot.customer_name || '-'}</td>
                  <td>{slot.phone || '-'}</td>
                  <td>{slot.transaction_id || '-'}</td>
                  <td>
                    {slot.is_booked && slot.status === 'pending' && (
                      <button 
                        onClick={() => handleAdminAction(slot.id, true, 'confirmed')}
                        className={styles.approveBtn}
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleAdminAction(slot.id, slot.is_booked)}
                      className={slot.is_booked ? styles.clearBtn : styles.bookBtn}
                    >
                      {slot.is_booked ? 'Cancel' : 'Block Slot'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      
      <Link href="/" className={styles.backLink}>Back to Site</Link>
    </main>
  );
}
