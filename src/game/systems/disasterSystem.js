import { clamp } from "../utils/random.js";

export const applyDisaster = (state, type) => {
  if (type === "meteor") {
    const creatures = state.creatures.map((creature) =>
      creature.alive
        ? {
            ...creature,
            stats: {
              ...creature.stats,
              health: clamp(creature.stats.health - 30, 0, 100),
              faith: clamp(creature.stats.faith + 10, 0, 100),
            },
          }
        : creature
    );
    return { ...state, creatures };
  }

  if (type === "plague") {
    const creatures = state.creatures.map((creature) =>
      creature.alive
        ? {
            ...creature,
            stats: {
              ...creature.stats,
              health: clamp(creature.stats.health - 18, 0, 100),
              energy: clamp(creature.stats.energy - 12, 0, 100),
            },
          }
        : creature
    );
    return { ...state, creatures };
  }

  if (type === "flood") {
    const tiles = state.world.tiles.map((row) =>
      row.map((tile) =>
        tile.biome === "land" || tile.biome === "forest"
          ? { ...tile, biome: "water", dangerLevel: clamp(tile.dangerLevel + 0.2, 0, 1) }
          : tile
      )
    );
    return { ...state, world: { ...state.world, tiles } };
  }

  if (type === "world-reset") {
    return { ...state, world: { ...state.world, age: 0 } };
  }

  return state;
};
