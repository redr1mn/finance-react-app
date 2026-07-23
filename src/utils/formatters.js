/**
 * Utility functions for formatting dates and timestamps defensively.
 */

/**
 * Formats a date string (YYYY-MM-DD or ISO string) into a localized date string.
 *
 * @param {string} dateInput - Date string (e.g. "2026-07-19" or "2026-07-19T14:32:00Z").
 * @param {Object} [options] - Intl.DateTimeFormat options.
 * @returns {string} Formatted date (e.g. "Jul 19, 2026").
 */
export function formatTransactionDate(dateInput, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!dateInput) return '—';

  let dateObj;
  if (typeof dateInput === 'string' && dateInput.length === 10 && dateInput.includes('-')) {
    // Avoid UTC shift for YYYY-MM-DD strings
    const [year, month, day] = dateInput.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = new Date(dateInput);
  }

  if (isNaN(dateObj.getTime())) return dateInput;

  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Formats time from an ISO timestamp string. Defaults to '12:00 PM' if date-only.
 *
 * @param {string} dateInput - ISO Date string containing time.
 * @returns {string} Formatted time string (e.g. "2:32 PM").
 */
export function formatTransactionTime(dateInput) {
  if (!dateInput) return '12:00 PM';

  const hasTime = typeof dateInput === 'string' && (dateInput.includes('T') || dateInput.includes(':'));

  if (hasTime) {
    const dateObj = new Date(dateInput);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  }

  return '12:00 PM';
}
