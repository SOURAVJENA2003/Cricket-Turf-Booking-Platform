import styles from './SlotGrid.module.css';

export default function SlotGrid({ slots, selectedSlots, onSelectSlot }) {
  if (slots.length === 0) {
    return <p>No slots available for this date.</p>;
  }

  const isSelected = (id) => selectedSlots.some(s => s.id === id);

  return (
    <div className={styles.grid}>
      {slots.map((slot) => (
        <div 
          key={slot.id} 
          className={`${styles.slot} ${slot.is_booked ? styles.booked : styles.available} ${isSelected(slot.id) ? styles.selected : ''}`}
          onClick={() => !slot.is_booked && onSelectSlot(slot)}
        >
          <div className={styles.time}>{slot.start_time} - {slot.end_time}</div>
          <div className={styles.price}>₹{slot.price}</div>
          <div className={styles.status}>
            {slot.is_booked ? 'Booked' : 'Available'}
          </div>
        </div>
      ))}
    </div>
  );
}
