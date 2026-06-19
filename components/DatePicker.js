import styles from './DatePicker.module.css';

export default function DatePicker({ selectedDate, onDateChange }) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toLocaleDateString('en-CA'));
  }

  return (
    <div className={styles.container}>
      <label htmlFor="date-select">Select Date: </label>
      <select 
        id="date-select" 
        value={selectedDate} 
        onChange={(e) => onDateChange(e.target.value)}
        className={styles.select}
      >
        {dates.map((date) => (
          <option key={date} value={date}>
            {new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
          </option>
        ))}
      </select>
    </div>
  );
}
