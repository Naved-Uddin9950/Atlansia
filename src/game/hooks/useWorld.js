import { useContext } from "react";
import { GameContext } from "../../store/GameContext.jsx";

export const useWorld = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useWorld must be used within GameProvider");
  }

  const { state, dispatch, actions } = context;
  return { state, dispatch, actions };
};
