export function isFullMoon(): boolean {
  const today = new Date().getDate();
  return today === 18;
}

export function daysUntilFullMoon(): number {
  const today = new Date().getDate();
  if (today < 18) return 18 - today;
  if (today === 18) return 0;
  return (30 - today) + 18;
}

export function getFullMoonDate(): Date {
  const now = new Date();
  if (now.getDate() > 18) {
    return new Date(now.getFullYear(), now.getMonth() + 1, 18);
  }
  return new Date(now.getFullYear(), now.getMonth(), 18);
}
