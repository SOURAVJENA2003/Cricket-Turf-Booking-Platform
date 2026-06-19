import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styles from './BookingModal.module.css';
import { formatLocalDateString } from '@/lib/date-utils';

export default function BookingModal({ slots, onClose, onBookingSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const [upiDetails, setUpiDetails] = useState({ id: '', name: '' });

  useEffect(() => {
    // We'll fetch UPI details from a simple internal config or assume they are passed/known
    // For now, let's just use hardcoded placeholders or try to fetch from env via a small api
    const fetchUpi = async () => {
       try {
         const res = await fetch('/api/config');
         const data = await res.json();
         setUpiDetails(data.success ? data.data : { id: 'owner@upi', name: 'Turf Owner' });
       } catch(e) {
         setUpiDetails({ id: 'owner@upi', name: 'Turf Owner' });
       }
    };
    fetchUpi();
  }, []);

  const totalPrice = slots.reduce((sum, slot) => sum + parseFloat(slot.price), 0);
  
  // Construct UPI URL for QR Code
  const upiUrl = `upi://pay?pa=${upiDetails.id}&pn=${encodeURIComponent(upiDetails.name)}&am=${totalPrice}&cu=INR&tn=Booking for ${slots[0].date}`;

  const handleNext = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Please fill in your name and phone number');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId) {
      setError('Please enter the Transaction ID / UTR number');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotIds: slots.map(s => s.id),
          customerName: name,
          phone: phone,
          transactionId: transactionId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onBookingSuccess(data.data.bookingGroupId);
      } else {
        setError(data.message || 'Failed to submit booking');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{step === 1 ? 'Confirm Details' : 'Payment (Scan & Pay)'}</h2>
        
        <div className={styles.slotInfo}>
          <p><strong>Slots:</strong> {slots[0].start_time} - {slots[slots.length-1].end_time}</p>
          <p><strong>Date:</strong> {formatLocalDateString(slots[0].date)}</p>
          <p><strong>Total Price:</strong> ₹{totalPrice}</p>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleNext} className={styles.form}>
            <div className={styles.field}>
              <label>Your Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Phone Number:</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
              <button type="submit" className={styles.confirmBtn}>Proceed to Payment</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.paymentLayout}>
              <div className={styles.qrSection}>
                <QRCodeSVG value={upiUrl} size={140} />
                <p className={styles.upiId}>{upiDetails.id}</p>
              </div>
              
              <div className={styles.inputSection}>
                <p className={styles.instruction}>Pay <strong>₹{totalPrice}</strong> and enter UTR below.</p>
                <div className={styles.field}>
                  <label>12-Digit UTR Number:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 312345678901" 
                    value={transactionId} 
                    onChange={(e) => setTransactionId(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            
            <div className={styles.actions}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
              <button type="submit" disabled={loading} className={styles.confirmBtn}>
                {loading ? 'Submitting...' : 'Submit Payment'}
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
                ← Edit booking details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
