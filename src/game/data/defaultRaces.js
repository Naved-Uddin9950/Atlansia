import humans from "../../assets/races/humans.png";
import atlasians from "../../assets/races/atlasians.png";
import demons from "../../assets/races/demons.png";

export const defaultRaces = [
  {
    name: "Atlasians",
    icon: atlasians,
    traits: {
      strength: 900,
      intelligence: 450,
      lifespan: 3000,
      fertility: 4,
      aggression: 2,
      adaptability: 84,
    },
    passiveAbilities: ["Starlight Memory", "Dream Weaving"],
  },
  {
    name: "Humans",
    icon: humans,
    traits: {
      strength: 80,
      intelligence: 40,
      lifespan: 160,
      fertility: 35,
      aggression: 60,
      adaptability: 40,
    },
    passiveAbilities: ["Granite Hide", "Enduring Will"],
  },
  {
    name: "Demons",
    icon: demons,
    traits: {
      strength: 520,
      intelligence: 220,
      lifespan: 980,
      fertility: 12,
      aggression: 72,
      adaptability: 62,
    },
    passiveAbilities: ["Hellfire Affinity", "Corrupting Presence"],
  },
];
