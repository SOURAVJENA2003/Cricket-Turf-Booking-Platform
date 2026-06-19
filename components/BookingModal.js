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
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
       try {
         const res = await fetch('/api/config');
         const data = await res.json();
         if (data.success) {
           setConfig(data.data);
           if (data.data.paymentMode === 'upi') {
             setUpiDetails(data.data.upiDetails || data.data);
           }
         } else {
           setConfig({ paymentMode: 'upi' });
           setUpiDetails({ id: 'owner@upi', name: 'Turf Owner' });
         }
       } catch(e) {
         setConfig({ paymentMode: 'upi' });
         setUpiDetails({ id: 'owner@upi', name: 'Turf Owner' });
       }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config?.paymentMode === 'razorpay') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [config]);

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

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setError('');

      const orderRes = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-order',
          slotIds: slots.map(s => s.id),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initiate payment order.');
      }

      const { orderId, amount: orderAmount } = orderData.data;

      const options = {
        key: config.razorpayKeyId,
        amount: orderAmount,
        currency: 'INR',
        name: config.turfDetails?.name || 'Runmakers Arena Box Cricket',
        description: `Booking for ${slots[0].date}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/payments/razorpay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify-payment',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                slotIds: slots.map(s => s.id),
                customerName: name,
                phone: phone,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onBookingSuccess(verifyData.data.bookingGroupId);
            } else {
              setError(verifyData.message || 'Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: name,
          contact: phone,
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{step === 1 ? 'Confirm Details' : (config?.paymentMode === 'razorpay' ? 'Payment (Razorpay)' : 'Payment (Scan & Pay)')}</h2>
        
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
          config?.paymentMode === 'razorpay' ? (
            <div className={styles.form}>
              <div className={styles.paymentLayout} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <p className={styles.instruction} style={{ fontSize: '1rem', marginBottom: '10px' }}>
                  You are booking <strong>{slots.length} slot(s)</strong>.
                </p>
                <p className={styles.instruction} style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Click below to open the secure Razorpay Checkout popup in Test Mode.
                </p>
              </div>

              {error && <p className={styles.error}>{error}</p>}
              
              <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                <button type="button" onClick={handleRazorpayPayment} disabled={loading} className={styles.confirmBtn}>
                  {loading ? 'Processing...' : 'Pay with Razorpay'}
                </button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  ← Edit booking details
                </button>
              </div>
            </div>
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
          )
        )}
      </div>
    </div>
  );
}
