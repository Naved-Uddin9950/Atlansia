export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const randFloat = (min = 0, max = 1) => Math.random() * (max - min) + min;

export const randInt = (min, max) => Math.floor(randFloat(min, max + 1));

export const chance = (probability) => Math.random() < probability;

export const choice = (items) => items[randInt(0, items.length - 1)];
