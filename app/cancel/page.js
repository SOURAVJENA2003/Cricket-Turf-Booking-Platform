'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

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

      if (response.ok) {
        if (data.length === 0) {
          setError('No bookings found with these details.');
        } else {
          setBookings(data);
          setStep(2);
        }
      } else {
        setError(data.error || 'Failed to find bookings');
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

      if (response.ok) {
        setMessage('Selected slots cancelled successfully!');
        setBookings(bookings.filter(b => !selectedBookings.includes(b.booking_id)));
        setSelectedBookings([]);
        if (bookings.length === selectedBookings.length) {
          setStep(1);
          setGroupId('');
          setPhone('');
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to cancel');
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
    <main className={styles.main}>
      <h1>Cancel Your Booking</h1>
      
      {step === 1 ? (
        <>
          <p>Enter your Booking Group ID and Phone Number to manage your slots.</p>
          <form onSubmit={handleSearch} className={styles.form}>
            <div className={styles.field}>
              <label>Booking Group ID:</label>
              <input 
                type="text" 
                placeholder="e.g. BK-XXXXXX"
                value={groupId} 
                onChange={(e) => setGroupId(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.field}>
              <label>Phone Number:</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button type="submit" disabled={loading} className={styles.searchBtn}>
              {loading ? 'Searching...' : 'Find Bookings'}
            </button>
          </form>
        </>
      ) : (
        <div className={styles.selectionArea}>
          <p>Select the slots you wish to cancel:</p>
          <div className={styles.bookingList}>
            {bookings.map((booking) => (
              <div 
                key={booking.booking_id} 
                className={`${styles.bookingItem} ${selectedBookings.includes(booking.booking_id) ? styles.selected : ''}`}
                onClick={() => toggleSelection(booking.booking_id)}
              >
                <div className={styles.check}>
                  <input 
                    type="checkbox" 
                    checked={selectedBookings.includes(booking.booking_id)} 
                    readOnly 
                  />
                </div>
                <div className={styles.info}>
                  <strong>{booking.start_time} - {booking.end_time}</strong>
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.price}>₹{booking.price}</div>
              </div>
            ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <div className={styles.actions}>
            <button onClick={() => setStep(1)} className={styles.backBtn}>Back</button>
            <button 
              onClick={handleCancelSelected} 
              disabled={loading || selectedBookings.length === 0} 
              className={styles.cancelBtn}
            >
              {loading ? 'Cancelling...' : `Cancel ${selectedBookings.length} Selected`}
            </button>
          </div>
        </div>
      )}

      <Link href="/" className={styles.homeLink}>Back to Home</Link>
    </main>
  );
}
