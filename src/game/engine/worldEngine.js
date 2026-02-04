import { randFloat, randInt, clamp } from "../utils/random.js";

const BIOMES = ["water", "land", "forest", "lava", "void", "tundra"];

export const createTile = (x, y) => {
  const roll = Math.random();
  const biome = roll < 0.12 ? "water" : roll < 0.32 ? "forest" : roll < 0.82 ? "land" : roll < 0.92 ? "tundra" : roll < 0.98 ? "lava" : "void";

  return {
    x,
    y,
    biome,
    fertility: clamp(randFloat(0.2, 0.9) + (biome === "forest" ? 0.15 : 0) - (biome === "lava" ? 0.3 : 0), 0, 1),
    dangerLevel: clamp(randFloat(0.1, 0.7) + (biome === "lava" ? 0.3 : 0) + (biome === "void" ? 0.4 : 0), 0, 1),
    temperature: clamp(randFloat(0.2, 0.8) + (biome === "tundra" ? -0.3 : 0) + (biome === "lava" ? 0.4 : 0), 0, 1),
  };
};

export const regenerateWorld = (world) => {
  const tiles = Array.from({ length: world.height }, (_, y) =>
    Array.from({ length: world.width }, (_, x) => createTile(x, y))
  );
  return { ...world, tiles, age: 0 };
};

export const findRandomSpawn = (world) => ({
  x: randInt(0, world.width - 1),
  y: randInt(0, world.height - 1),
});

export const applyWorldAging = (world) => ({
  ...world,
  age: world.age + 1,
});

export const biomePalette = {
  water: "#1e3a8a",
  land: "#334155",
  forest: "#14532d",
  lava: "#7f1d1d",
  void: "#020617",
  tundra: "#1e293b",
};

export const nextBiomeShift = (world, rules) => {
  if (Math.random() > 0.02) return world;
  const tiles = world.tiles.map((row) =>
    row.map((tile) => {
      if (Math.random() < 0.015) {
        return { ...tile, biome: BIOMES[randInt(0, BIOMES.length - 1)] };
      }
      return tile;
    })
  );
  return { ...world, tiles, age: world.age + 1, rules };
};
