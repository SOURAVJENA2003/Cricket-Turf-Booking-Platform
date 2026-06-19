import styles from './SuccessModal.module.css';

export default function SuccessModal({ bookingId, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.headerArea}>
          <div className={styles.iconContainer}>✓</div>
          <div>
            <h2>Booking Submitted!</h2>
            <p className={styles.instruction}>Waiting for admin verification.</p>
          </div>
        </div>
        
        <div className={styles.receiptBox}>
          <span className={styles.label}>Your Booking Group ID</span>
          <span className={styles.bookingId}>{bookingId}</span>
        </div>

        <div className={styles.warningBox}>
          <strong>⚠️ IMPORTANT:</strong> Take a screenshot! You need this ID to cancel or modify your booking later.
        </div>
        
        <button onClick={onClose} className={styles.closeBtn}>
          I have saved my ID
        </button>
      </div>
    </div>
  );
}
