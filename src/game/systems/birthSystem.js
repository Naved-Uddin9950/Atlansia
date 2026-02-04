import { createCreature } from "../models/Creature.js";
import { shouldSeekMate } from "../engine/aiEngine.js";
import { findRandomSpawn } from "../engine/worldEngine.js";

export const handleBirths = (world, creatures, raceMap) => {
  const newborns = [];
  creatures.forEach((creature) => {
    const race = raceMap.get(creature.raceId);
    if (shouldSeekMate(creature, race)) {
      newborns.push(
        createCreature({
          raceId: creature.raceId,
          position: findRandomSpawn(world),
          stats: { health: 80, energy: 60, hunger: 10, faith: 30 },
        })
      );
    }
  });

  return creatures.concat(newborns);
};
