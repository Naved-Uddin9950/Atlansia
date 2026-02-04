import { useEffect, useRef } from "react";
import { getTickInterval } from "../engine/timeEngine.js";

export const useGameLoop = ({ speed, onTick }) => {
  const savedCallback = useRef(onTick);

  useEffect(() => {
    savedCallback.current = onTick;
  }, [onTick]);

  useEffect(() => {
    console.debug('[useGameLoop] speed changed', speed);
    const interval = getTickInterval(speed);
    if (!interval) return undefined;
    console.debug('[useGameLoop] starting interval', interval);
    const id = setInterval(() => {
      console.debug('[useGameLoop] tick');
      savedCallback.current?.();
    }, interval);
    return () => clearInterval(id);
  }, [speed]);
};
