import { chance, clamp } from "../utils/random.js";

export const evolveRaces = (races, rules) => {
  if (!chance(rules.evolutionRate)) return races;
  return races.map((race) => {
    if (!chance(0.2)) return race;
    const shift = () => clamp(Math.round((Math.random() - 0.5) * 10), -4, 4);
    return {
      ...race,
      traits: {
        ...race.traits,
        strength: clamp(race.traits.strength + shift(), 10, 100),
        intelligence: clamp(race.traits.intelligence + shift(), 10, 100),
        lifespan: clamp(race.traits.lifespan + shift(), 60, 200),
        fertility: clamp(race.traits.fertility + shift(), 10, 100),
        aggression: clamp(race.traits.aggression + shift(), 5, 100),
        adaptability: clamp(race.traits.adaptability + shift(), 10, 100),
      },
    };
  });
};
