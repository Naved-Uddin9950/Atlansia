import { uuid } from "../utils/uuid.js";

export const createCreature = ({
  id = uuid(),
  raceId,
  position,
  stats = {},
  powers = [],
  age = 0,
  alive = true,
} = {}) => ({
  id,
  raceId,
  position,
  stats: {
    health: 100,
    energy: 100,
    hunger: 0,
    faith: 20,
    ...stats,
  },
  powers,
  age,
  alive,
});
