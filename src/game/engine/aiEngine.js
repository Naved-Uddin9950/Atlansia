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

export const stepCreaturesAI = (world, creatures, raceMap, playerPos) => {
  // prevent stacking: process creatures sequentially and keep an occupied set
  const occupied = new Set();
  // initialize occupied with current alive positions
  creatures.forEach((c) => {
    if (!c.alive) return;
    occupied.add(`${c.position.x},${c.position.y}`);
  });

  const results = [];

  for (const creature of creatures) {
    if (!creature.alive) {
      results.push(creature);
      continue;
    }

    // free current position so creature can move out
    occupied.delete(`${creature.position.x},${creature.position.y}`);

    const race = raceMap.get(creature.raceId);
    const tile = world.tiles[creature.position.y][creature.position.x];
    const neighbors = getNeighbors(world, creature.position);

    // compute scored candidates but prefer unoccupied tiles and avoid player tile
    const scored = neighbors
      .map((pos) => {
        const candidate = world.tiles[pos.y][pos.x];
        const score = candidate.fertility - candidate.dangerLevel + randInt(-2, 2) * 0.01;
        const key = `${pos.x},${pos.y}`;
        const occupiedScore = occupied.has(key) ? -9999 : 0;
        const playerKey = playerPos ? `${playerPos.x},${playerPos.y}` : null;
        const playerPenalty = playerKey === key ? -9999 : 0;
        return { pos, score: score + occupiedScore + playerPenalty };
      })
      .sort((a, b) => b.score - a.score);

    const chosen = scored.length ? scored[0].pos : creature.position;

    // if chosen is occupied (all neighbors occupied) then stay
    const chosenKey = `${chosen.x},${chosen.y}`;
    const nextPosition = occupied.has(chosenKey) ? creature.position : chosen;

    // mark chosen as occupied
    occupied.add(`${nextPosition.x},${nextPosition.y}`);

    const hunger = clamp(creature.stats.hunger + 0.9 - tile.fertility * 1.2, 0, 100);
    const energy = clamp(creature.stats.energy + tile.fertility * 0.6 - 0.8, 0, 100);
    const faith = clamp(creature.stats.faith + (tile.fertility - tile.dangerLevel) * 0.25, 0, 100);
    const healthPenalty = hunger > 90 || tile.dangerLevel > 0.9 ? 1 : 0;

    results.push({
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
    });
  }

  return results;
};

export const shouldSeekMate = (creature, race) => {
  if (!creature.alive) return false;
  if (creature.stats.energy < 60 || creature.stats.hunger > 40) return false;
  return chance((race?.traits?.fertility ?? 50) / 300);
};
