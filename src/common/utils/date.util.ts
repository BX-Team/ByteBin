/**
 * Gets the relative time between now and the given date.
 *
 * @param date The date to get the relative time for.
 * @returns The relative time.
 */
export function getRelativeTime(date: Date): string {
  if (!date || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `in ${days} day${days === 1 ? '' : 's'}`;
  }
  if (hours > 0) {
    return `in ${hours} hour${hours === 1 ? '' : 's'}`;
  }
  if (minutes > 0) {
    return `in ${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  if (seconds > 0) {
    return `in ${seconds} second${seconds === 1 ? '' : 's'}`;
  }
  return 'expired';
}
