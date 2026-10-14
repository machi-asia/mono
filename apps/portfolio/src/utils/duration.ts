export function getDurationSince(startDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    return "several years";
  }
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) {
    months--;
  }
  if (months < 1) {
    const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? "day" : "days"}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years > 0 && remainingMonths === 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"} and ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
  }
  return `${months} ${months === 1 ? "month" : "months"}`;
}

export function getYearsSince(startYear: number): number {
  return new Date().getFullYear() - startYear;
}
