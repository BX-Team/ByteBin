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
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  return 'just now';
}
