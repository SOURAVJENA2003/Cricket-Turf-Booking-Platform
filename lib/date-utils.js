/**
 * Utility functions for timezone-independent date and time operations,
 * standardized to Asia/Kolkata (IST).
 */

/**
 * Returns today's date in YYYY-MM-DD format in Asia/Kolkata timezone.
 * @returns {string} e.g. "2026-06-20"
 */
function getIstTodayString() {
  const d = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

/**
 * Formats a YYYY-MM-DD date string timezone-safely into a clean string (e.g. "20 Jun 2026").
 * @param {string} dateStr - Input date string, optionally as an ISO date.
 * @returns {string} Formatted display date
 */
function formatLocalDateString(dateStr) {
  if (!dateStr) return '';
  // Extract date part only (handles both "YYYY-MM-DD" and "YYYY-MM-DDT00:00:00.000Z")
  const cleanDateStr = typeof dateStr === 'string' 
    ? dateStr.split('T')[0] 
    : new Date(dateStr).toISOString().split('T')[0];
    
  const parts = cleanDateStr.split('-');
  if (parts.length !== 3) return cleanDateStr;
  
  const [year, month, day] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
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
  const cleanDateStr = dateStr.split('T')[0];
  const parts = cleanDateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const [year, month, day] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Construct the Date object locally using year/month/day parts to avoid UTC shifting
  const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekday = weekdays[d.getDay()];
  
  return `${weekday}, ${parseInt(day)} ${months[parseInt(month) - 1]}`;
}

/**
 * Generates the next 7 days in Asia/Kolkata timezone in YYYY-MM-DD format.
 * @returns {string[]} Array of date strings
 */
function getIstDateList() {
  const dates = [];
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const now = Date.now();
  for (let i = 0; i < 7; i++) {
    const timeInIst = now + i * 24 * 60 * 60 * 1000;
    dates.push(formatter.format(new Date(timeInIst)));
  }
  return dates;
}

module.exports = {
  getIstTodayString,
  formatLocalDateString,
  formatIstTimestamp,
  formatDatePickerLabel,
  getIstDateList
};
