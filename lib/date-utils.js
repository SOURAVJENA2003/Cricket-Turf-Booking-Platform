/**
 * Utility functions for timezone-independent date and time operations,
 * standardized to Asia/Kolkata (IST).
 */

const IST_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function formatDateParts(parts) {
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return '';
  }

  return `${year}-${month}-${day}`;
}

/**
 * Normalizes a date-like input into a YYYY-MM-DD string in Asia/Kolkata.
 * @param {string|Date} value
 * @returns {string}
 */
function getIstDateString(value) {
  if (!value) return '';

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
      return trimmedValue;
    }

    const parsed = new Date(trimmedValue);
    if (Number.isNaN(parsed.getTime())) {
      return trimmedValue.split('T')[0];
    }

    return formatDateParts(IST_DATE_FORMATTER.formatToParts(parsed));
  }

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return formatDateParts(IST_DATE_FORMATTER.formatToParts(parsed));
}

/**
 * Returns today's date in YYYY-MM-DD format in Asia/Kolkata timezone.
 * @returns {string} e.g. "2026-06-20"
 */
function getIstTodayString() {
  return getIstDateString(new Date());
}

/**
 * Formats a YYYY-MM-DD date string timezone-safely into a clean string (e.g. "20 Jun 2026").
 * @param {string} dateStr - Input date string, optionally as an ISO date.
 * @returns {string} Formatted display date
 */
function formatLocalDateString(dateStr) {
  if (!dateStr) return '';
  const cleanDateStr = getIstDateString(dateStr);
  const parts = cleanDateStr.split('-');
  if (parts.length !== 3) return cleanDateStr;
  
  const [year, month, day] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
}

/**
 * Formats a PostgreSQL created_at timestamp in local India format (Asia/Kolkata).
 * @param {string|Date} timestamp - Input timestamp.
 * @returns {string} Formatted local timestamp
 */
function formatIstTimestamp(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

/**
 * Formats a YYYY-MM-DD date string timezone-safely into a DatePicker label format (e.g. "Saturday, 20 Jun").
 * @param {string} dateStr 
 * @returns {string} Formatted label
 */
function formatDatePickerLabel(dateStr) {
  if (!dateStr) return '';
  const cleanDateStr = getIstDateString(dateStr);
  const parts = cleanDateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const [year, month, day] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Construct the Date object locally using year/month/day parts to avoid UTC shifting
  const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekday = weekdays[d.getDay()];
  
  return `${weekday}, ${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]}`;
}

/**
 * Generates the next 7 days in Asia/Kolkata timezone in YYYY-MM-DD format.
 * @returns {string[]} Array of date strings
 */
function getIstDateList() {
  const dates = [];
  
  const now = Date.now();
  for (let i = 0; i < 7; i++) {
    const timeInIst = now + i * 24 * 60 * 60 * 1000;
    dates.push(getIstDateString(new Date(timeInIst)));
  }
  return dates;
}

module.exports = {
  getIstDateString,
  getIstTodayString,
  formatLocalDateString,
  formatIstTimestamp,
  formatDatePickerLabel,
  getIstDateList
};
