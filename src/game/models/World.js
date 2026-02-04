import { uuid } from "../utils/uuid.js";
import { createTile } from "../engine/worldEngine.js";

export const createWorld = ({
  id = uuid(),
  name = "Atlansia",
  width = 24,
  height = 18,
  rules,
} = {}) => {
  const tiles = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => createTile(x, y))
  );

  return {
    id,
    name,
    width,
    height,
    tiles,
    rules,
    age: 0,
  };
};
