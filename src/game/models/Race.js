import { uuid } from "../utils/uuid.js";

export const createRace = ({
  id = uuid(),
  name = "New Race",
  icon,
  traits = {},
  passiveAbilities = [],
} = {}) => ({
  id,
  name,
  icon,
  traits: {
    strength: 50,
    intelligence: 50,
    lifespan: 100,
    fertility: 50,
    aggression: 40,
    adaptability: 50,
    ...traits,
  },
  passiveAbilities,
});
