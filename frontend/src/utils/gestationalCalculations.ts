/**
 * Gestational calculation utilities for pregnant women tracking.
 */

/**
 * Calculates gestational age in weeks from LMP date to today.
 * @param lmpDate - Last Menstrual Period date
 * @returns Gestational age in weeks (integer)
 */
export function calculateGestationalAge(lmpDate: Date): number {
  const today = new Date();
  const diffMs = today.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

/**
 * Determines trimester based on gestational age in weeks.
 * 1st trimester: 1–13 weeks
 * 2nd trimester: 14–26 weeks
 * 3rd trimester: 27+ weeks
 * @param gestationalAge - Gestational age in weeks
 * @returns Trimester number (1, 2, or 3)
 */
export function determineTrimester(gestationalAge: number): 1 | 2 | 3 {
  if (gestationalAge <= 13) return 1;
  if (gestationalAge <= 26) return 2;
  return 3;
}

/**
 * Calculates Expected Delivery Date (EDD) as LMP + 280 days (Naegele's rule).
 * @param lmpDate - Last Menstrual Period date
 * @returns Expected Delivery Date
 */
export function calculateEDD(lmpDate: Date): Date {
  const edd = new Date(lmpDate.getTime());
  edd.setDate(edd.getDate() + 280);
  return edd;
}

/**
 * Formats a date as a readable string (DD MMM YYYY).
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Converts a date to a nanosecond timestamp (for ICP backend).
 */
export function dateToNanoTimestamp(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

/**
 * Converts a nanosecond timestamp (from ICP backend) to a Date.
 */
export function nanoTimestampToDate(nanos: bigint): Date {
  return new Date(Number(nanos / BigInt(1_000_000)));
}
