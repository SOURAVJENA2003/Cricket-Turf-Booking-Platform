import styles from './DatePicker.module.css';
import { getIstDateList, formatDatePickerLabel } from '@/lib/date-utils';

export default function DatePicker({ selectedDate, onDateChange }) {
  const dates = getIstDateList();

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
            {formatDatePickerLabel(date)}
          </option>
        ))}
      </select>
    </div>
  );
}
