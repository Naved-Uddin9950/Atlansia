export const SPEEDS = [0, 1, 5, 20];

export const getTickInterval = (speed) => {
  if (!speed) return null;
  if (speed === 1) return 1200; // ~1.2s per tick
  if (speed === 5) return 450; // slower but noticeably faster than x1
  if (speed === 20) return 180; // faster but not instant
  return Math.max(60, 1000 / speed);
};
