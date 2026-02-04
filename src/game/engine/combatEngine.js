import { chance, clamp } from "../utils/random.js";

export const resolveCombat = (creatures, raceMap) => {
  const groups = new Map();
  creatures.forEach((creature) => {
    if (!creature.alive) return;
    const key = `${creature.position.x}:${creature.position.y}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(creature);
  });

  const updated = creatures.map((creature) => ({ ...creature }));
  groups.forEach((group) => {
    if (group.length < 2) return;
    group.forEach((attacker) => {
      const race = raceMap.get(attacker.raceId);
      const aggression = (race?.traits?.aggression ?? 40) / 100;
      if (!chance(aggression * 0.2)) return;
      const targets = group.filter((member) => member.id !== attacker.id);
      if (!targets.length) return;
      const target = targets[Math.floor(Math.random() * targets.length)];
      const damage = 6 + (race?.traits?.strength ?? 50) * 0.1;
      updated.forEach((creature) => {
        if (creature.id === target.id) {
          creature.stats = { ...creature.stats, health: clamp(creature.stats.health - damage, 0, 100) };
        }
      });
    });
  });

  return updated;
};
