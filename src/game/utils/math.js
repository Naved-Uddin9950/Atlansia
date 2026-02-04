export const lerp = (a, b, t) => a + (b - a) * t;

export const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
