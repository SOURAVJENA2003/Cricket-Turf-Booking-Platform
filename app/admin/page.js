'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from '@/components/DatePicker';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const pwd = localStorage.getItem('admin_password');
    if (!pwd) {
      router.push('/admin/login');
    } else {
      setAdminPassword(pwd);
    }
  }, []);

  useEffect(() => {
    if (adminPassword) {
      fetchSlots();
    }
  }, [selectedDate, adminPassword]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/slots?date=${selectedDate}&adminPassword=${adminPassword}`);
      const data = await response.json();
      if (response.ok) {
        setSlots(data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAction = async (slotId, isBooked, newStatus = null) => {
    let method = isBooked ? 'DELETE' : 'POST';
    let url = '/api/admin/bookings';
    let body = { slotId, adminPassword };

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
        fetchSlots();
      } else {
        const data = await response.json();
        alert(data.error || 'Action failed');
        if (response.status === 401) {
          router.push('/admin/login');
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
        <button onClick={() => { localStorage.removeItem('admin_password'); router.push('/admin/login'); }} className={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <section className={styles.section}>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        
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
      
      <a href="/" className={styles.backLink}>Back to Site</a>
    </main>
  );
}
