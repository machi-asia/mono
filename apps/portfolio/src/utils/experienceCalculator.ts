export interface PeriodHolder {
  period: string;
}

export interface Interval {
  start: Date;
  end: Date;
}

/**
 * Parses a date string into a Date object.
 * Supports years (e.g. "2023"), months + years (e.g. "May 2021"),
 * and full dates (e.g. "May 18, 2026").
 */
export function parseDateString(dateStr: string, isEnd: boolean): Date {
  const clean = dateStr.trim();
  if (/^present$/i.test(clean)) {
    return new Date();
  }

  // Check for 4-digit year (e.g., "2023")
  if (/^\d{4}$/.test(clean)) {
    const year = parseInt(clean, 10);
    if (isEnd) {
      // End of that year
      return new Date(year, 11, 31, 23, 59, 59, 999);
    } else {
      // Start of that year
      return new Date(year, 0, 1, 0, 0, 0, 0);
    }
  }

  // Parse generic date string
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    if (isEnd) {
      // If it's a month and year without a specific day (e.g. "May 2021" or "05/2021"),
      // set to the last day of that month.
      if (/^[a-zA-Z]+\s+\d{4}$/.test(clean) || /^\d{1,2}\/\d{4}$/.test(clean)) {
        const year = parsed.getFullYear();
        const month = parsed.getMonth();
        return new Date(year, month + 1, 0, 23, 59, 59, 999);
      }
    }
    return parsed;
  }

  throw new Error(`Invalid date format: "${dateStr}"`);
}

/**
 * Calculates total experience in years and months from a list of period strings.
 * Merges concurrent/overlapping work and handles break times/gaps.
 */
export function calculateTotalExperience(periods: string[]): { years: number; months: number } {
  const intervals: Interval[] = [];

  for (const period of periods) {
    if (!period) continue;
    const parts = period.split(/[-–—]| to /i).map(s => s.trim());
    if (parts.length === 0 || !parts[0]) continue;

    try {
      const start = parseDateString(parts[0], false);
      const end = parseDateString(parts[1] || "Present", true);

      if (start <= end) {
        intervals.push({ start, end });
      }
    } catch (e) {
      console.warn(`Skipping invalid period: ${period}`, e);
    }
  }

  if (intervals.length === 0) {
    return { years: 0, months: 0 };
  }

  // Sort intervals by start date
  intervals.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Merge overlapping and contiguous intervals (with 1-day contiguous buffer)
  const merged: Interval[] = [];
  let current = intervals[0];
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (next.start.getTime() <= current.end.getTime() + oneDayMs) {
      current.end = new Date(Math.max(current.end.getTime(), next.end.getTime()));
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  // Sum total days
  let totalDays = 0;
  for (const interval of merged) {
    const diffMs = interval.end.getTime() - interval.start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    totalDays += diffDays;
  }

  const daysPerYear = 365.25;
  const daysPerMonth = 30.4375;

  let years = Math.floor(totalDays / daysPerYear);
  const remainingDays = totalDays % daysPerYear;
  let months = Math.round(remainingDays / daysPerMonth);

  if (months >= 12) {
    years += 1;
    months = 0;
  }

  return { years, months };
}

/**
 * Formats the experience duration as a short string (e.g. "7 yrs 6 mos", "2 mos").
 */
export function formatExperience(years: number, months: number): string {
  const parts = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  }
  if (months > 0 || years === 0) {
    parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  }
  return parts.join(" ");
}

/**
 * Formats the experience duration as a long sentence fragment (e.g. "7 years and 6 months").
 */
export function formatExperienceLong(years: number, months: number): string {
  const parts = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  }
  if (parts.length === 0) return "0 months";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} and ${parts[1]}`;
}
