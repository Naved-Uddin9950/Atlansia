import { clamp, chance, randInt } from "../utils/random.js";

const getNeighbors = (world, { x, y }) => {
  const deltas = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  return deltas
    .map((delta) => ({ x: x + delta.x, y: y + delta.y }))
    .filter((pos) => pos.x >= 0 && pos.y >= 0 && pos.x < world.width && pos.y < world.height);
};

export const stepCreaturesAI = (world, creatures, raceMap) => {
  return creatures.map((creature) => {
    if (!creature.alive) return creature;

    const race = raceMap.get(creature.raceId);
    const tile = world.tiles[creature.position.y][creature.position.x];
    const neighbors = getNeighbors(world, creature.position);
    const best = neighbors.reduce(
      (bestTile, pos) => {
        const candidate = world.tiles[pos.y][pos.x];
        const score = candidate.fertility - candidate.dangerLevel + randInt(-2, 2) * 0.01;
        if (!bestTile || score > bestTile.score) {
          return { pos, score };
        }
        return bestTile;
      },
      null
    );

    const nextPosition = best?.pos ?? creature.position;
    // Smaller per-tick changes for smoother simulation
    const hunger = clamp(creature.stats.hunger + 0.9 - tile.fertility * 1.2, 0, 100);
    const energy = clamp(creature.stats.energy + tile.fertility * 0.6 - 0.8, 0, 100);
    const faith = clamp(creature.stats.faith + (tile.fertility - tile.dangerLevel) * 0.25, 0, 100);

    const healthPenalty = hunger > 90 || tile.dangerLevel > 0.9 ? 1 : 0;

    return {
      ...creature,
      position: nextPosition,
      age: creature.age + 1,
      stats: {
        ...creature.stats,
        hunger,
        energy,
        faith,
        health: clamp(creature.stats.health - healthPenalty + (race?.traits?.adaptability ?? 50) * 0.0015, 0, 100),
      },
    };
  });
};

export const shouldSeekMate = (creature, race) => {
  if (!creature.alive) return false;
  if (creature.stats.energy < 60 || creature.stats.hunger > 40) return false;
  return chance((race?.traits?.fertility ?? 50) / 300);
};
