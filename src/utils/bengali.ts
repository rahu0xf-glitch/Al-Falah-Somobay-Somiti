export const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const MONTH_NAMES_BN = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Converts a standard English number or numeric string to Bengali numerals
 */
export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '০';
  const str = num.toString();
  return str.replace(/[0-9]/g, (match) => BENGALI_DIGITS[parseInt(match, 10)]);
}

/**
 * Format currency with Taka symbol (৳) and comma separators (South Asian formatting)
 */
export function formatBDT(amount: number | undefined | null, useBengali: boolean = true): string {
  const safeAmount = Number(amount) || 0;
  
  // Format with standard grouping
  const formatted = new Intl.NumberFormat('en-IN').format(safeAmount);

  if (useBengali) {
    return `৳ ${toBengaliNumber(formatted)}`;
  }
  return `৳ ${formatted}`;
}

/**
 * Returns month name based on 1-12 index
 */
export function getMonthName(monthNumber: number, inBengali: boolean = true): string {
  const index = Math.max(1, Math.min(12, monthNumber)) - 1;
  return inBengali ? MONTH_NAMES_BN[index] : MONTH_NAMES_EN[index];
}

/**
 * Format date string (YYYY-MM-DD) to friendly format
 */
export function formatDate(dateStr: string | undefined | null, inBengali: boolean = true): string {
  if (!dateStr) return inBengali ? 'অনুল্লেখ্য' : 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    if (inBengali) {
      return `${toBengaliNumber(day)} ${getMonthName(month, true)}, ${toBengaliNumber(year)}`;
    }
    return `${getMonthName(month, false)} ${day}, ${year}`;
  } catch {
    return dateStr;
  }
}
