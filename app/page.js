'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';
import SlotGrid from '@/components/SlotGrid';
import BookingModal from '@/components/BookingModal';
import SuccessModal from '@/components/SuccessModal';
import styles from './page.module.css';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedBookingId, setCompletedBookingId] = useState(null); // Replaces successMessage

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchSlots = async () => {
      try {
        const response = await fetch(`/api/slots?date=${selectedDate}`);
        const data = await response.json();
        if (active) {
          if (response.ok) {
            setSlots(data);
            if (data.length === 0) {
              setError('No slots found for this date. Please ensure the database is seeded.');
            }
          } else {
            setError(data.error || 'Failed to fetch slots');
          }
        }
      } catch (error) {
        if (active) {
          setError('Connection error: Could not reach the server.');
        }
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
  }, [selectedDate, refreshTrigger]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlots([]); // Clear selection when date changes
    setLoading(true);
    setError('');
  };

  const handleSelectSlot = (slot) => {
    const isAlreadySelected = selectedSlots.some(s => s.id === slot.id);
    
    if (isAlreadySelected) {
      // Allow deselecting only the ends of the selection to maintain consecutiveness
      // For simplicity, we'll allow deselecting any, but we'll re-validate or just clear
      setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
      return;
    }

    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    // Check if consecutive
    const sortedSelected = [...selectedSlots, slot].sort((a, b) => a.start_time.localeCompare(b.start_time));
    let isConsecutive = true;
    for (let i = 0; i < sortedSelected.length - 1; i++) {
      if (sortedSelected[i].end_time !== sortedSelected[i+1].start_time) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive) {
      setSelectedSlots(sortedSelected);
    } else {
      // If not consecutive, start a new selection with just this slot
      setSelectedSlots([slot]);
    }
  };

  const handleBookingSuccess = (bookingGroupId) => {
    setIsModalOpen(false);
    setSelectedSlots([]);
    setCompletedBookingId(bookingGroupId); // Trigger the success modal
    setLoading(true);
    setError('');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCloseSuccessModal = () => {
    setCompletedBookingId(null);
  };

  const totalPrice = selectedSlots.reduce((sum, slot) => sum + parseFloat(slot.price), 0);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Cricket Turf Booking</h1>
        <nav className={styles.nav}>
          <Link href="/cancel" className={styles.navLink}>Cancel Booking</Link>
          <Link href="/admin/login" className={styles.navLink}>Admin Login</Link>
        </nav>
      </header>

      <section className={styles.bookingSection}>
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
        
        {error && <div className={styles.error}>{error}</div>}

        {selectedSlots.length > 0 && (
          <div className={styles.cartSummary}>
            <div className={styles.cartInfo}>
              <strong>{selectedSlots.length} Slots Selected:</strong>
              <span> {selectedSlots[0].start_time} - {selectedSlots[selectedSlots.length - 1].end_time}</span>
              <span className={styles.cartPrice}>Total: ₹{totalPrice}</span>
            </div>
            <div className={styles.cartActions}>
              <button onClick={() => setSelectedSlots([])} className={styles.clearBtn}>Clear</button>
              <button onClick={() => setIsModalOpen(true)} className={styles.bookBtn}>Book Now</button>
            </div>
          </div>
        )}

        {loading ? (
          <p className={styles.loading}>Loading slots...</p>
        ) : (
          !error && <SlotGrid slots={slots} selectedSlots={selectedSlots} onSelectSlot={handleSelectSlot} />
        )}
      </section>

      {isModalOpen && (
        <BookingModal 
          slots={selectedSlots} 
          onClose={() => setIsModalOpen(false)} 
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {completedBookingId && (
        <SuccessModal 
          bookingId={completedBookingId}
          onClose={handleCloseSuccessModal}
        />
      )}
    </main>
  );
}
