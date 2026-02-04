import { uuid } from "../utils/uuid.js";

export const createPower = ({
  id = uuid(),
  name = "Miracle",
  effect,
  cooldown = 3,
} = {}) => ({
  id,
  name,
  effect,
  cooldown,
});
