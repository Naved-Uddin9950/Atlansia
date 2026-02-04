import { clamp } from "../utils/random.js";

export const applyWorldRules = (world) => {
  const { rules } = world;
  const tiles = world.tiles.map((row) =>
    row.map((tile) => ({
      ...tile,
      fertility: clamp(tile.fertility + (rules.fertilityBaseline - 0.5) * 0.01, 0, 1),
      dangerLevel: clamp(tile.dangerLevel + (rules.dangerBaseline - 0.5) * 0.01, 0, 1),
      temperature: clamp(tile.temperature + (rules.temperatureBaseline - 0.5) * 0.01, 0, 1),
    }))
  );

  return { ...world, tiles };
};
