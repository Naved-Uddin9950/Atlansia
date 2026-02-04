export const handleDeaths = (creatures, raceMap) =>
  creatures.map((creature) => {
    if (!creature.alive) return creature;
    const race = raceMap.get(creature.raceId);
    const lifespan = race?.traits?.lifespan ?? 100;
    const maxAge = lifespan + 20;
    const shouldDie = creature.stats.health <= 0 || creature.age > maxAge;
    return shouldDie ? { ...creature, alive: false } : creature;
  });
