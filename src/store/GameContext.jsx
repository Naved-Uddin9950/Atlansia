import React, { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { gameReducer } from "./reducers.js";
import { createWorld } from "../game/models/World.js";
import { createRace } from "../game/models/Race.js";
import { createCreature } from "../game/models/Creature.js";
import { defaultRaces } from "../game/data/defaultRaces.js";
import { defaultCreatures } from "../game/data/defaultCreatures.js";
import { defaultWorldRules } from "../game/data/defaultWorldRules.js";
import { findRandomSpawn, regenerateWorld } from "../game/engine/worldEngine.js";
import { useGameLoop } from "../game/hooks/useGameLoop.js";
import { usePersistence } from "../game/hooks/usePersistence.js";

export const GameContext = createContext(null);

const createInitialState = () => {
  const races = defaultRaces.map((race) => createRace(race));
  const world = createWorld({ rules: { ...defaultWorldRules } });
  const raceMap = new Map(races.map((race) => [race.name, race.id]));

  const creatures = defaultCreatures.flatMap((entry) => {
    const raceId = raceMap.get(entry.raceName) ?? races[0]?.id;
    return Array.from({ length: entry.count }, () =>
      createCreature({ raceId, position: findRandomSpawn(world) })
    );
  });

  return {
    world,
    creatures,
    races,
    powers: [
      { id: "meteor", name: "Meteor" },
      { id: "plague", name: "Plague" },
      { id: "flood", name: "Flood" },
    ],
    settings: {
      speed: 1,
      _lastToggle: 0,
      _tickCount: 0,
      _toggleCount: 0,
    },
    ui: {
      selectedCreatureId: null,
      selectedRaceId: races[0]?.id ?? null,
      playerMode: false,
      playerPosition: { x: Math.floor(world.width / 2), y: Math.floor(world.height / 2) },
      notification: null,
    },
  };
};

export const GameProvider = ({ children }) => {
  const persistence = usePersistence();
  const [hydrated, setHydrated] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      const loaded = await persistence.loadGameState();
      if (!active) return;
      if (loaded) {
        dispatch({ type: "LOAD_STATE", payload: loaded });
      }
      setHydrated(true);
    };
    hydrate();
    return () => {
      active = false;
    };
  }, [persistence]);

  useEffect(() => {
    if (!hydrated) return;
    persistence.saveGameState(state);
  }, [hydrated, state, persistence]);

  useGameLoop({
    speed: state.settings.speed,
    onTick: () => {
      console.debug('[GameProvider] dispatch TICK');
      dispatch({ type: "TICK" });
    },
  });

  const actions = useMemo(
    () => ({
      setSpeed: (speed) => dispatch({ type: "SET_SPEED", payload: speed }),
      togglePause: () => dispatch({ type: "TOGGLE_PAUSE", payload: Date.now() }),
      selectCreature: (id) => dispatch({ type: "SELECT_CREATURE", payload: id }),
      selectRace: (id) => dispatch({ type: "SELECT_RACE", payload: id }),
      createRace: (race) => dispatch({ type: "CREATE_RACE", payload: race }),
      updateRace: (race) => dispatch({ type: "UPDATE_RACE", payload: race }),
      spawnCreature: (raceId) => dispatch({ type: "SPAWN_RANDOM", payload: raceId }),
      killCreature: (id) => dispatch({ type: "KILL_CREATURE", payload: id }),
      killRace: (raceId) => dispatch({ type: "KILL_RACE", payload: raceId }),
      blessCreature: (id) => dispatch({ type: "APPLY_EFFECT", payload: { scope: "creature", id, effect: { health: 30, energy: 20, faith: 10 } } }),
      curseCreature: (id) => dispatch({ type: "APPLY_EFFECT", payload: { scope: "creature", id, effect: { health: -30, energy: -15 } } }),
      blessRace: (raceId) => dispatch({ type: "APPLY_EFFECT", payload: { scope: "race", id: raceId, effect: { health: 20, energy: 15, faith: 10 } } }),
      curseRace: (raceId) => dispatch({ type: "APPLY_EFFECT", payload: { scope: "race", id: raceId, effect: { health: -25, energy: -10 } } }),
      triggerDisaster: (type) => {
        dispatch({ type: "TRIGGER_DISASTER", payload: type });
        dispatch({ type: "SHOW_NOTIFICATION", payload: `Triggered ${type}` });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 2200);
      },
      enterWorld: (enable) => dispatch({ type: "SET_PLAYER_MODE", payload: enable }),
      movePlayer: (pos) => dispatch({ type: "MOVE_PLAYER", payload: pos }),
      updateRule: (payload) => dispatch({ type: "UPDATE_RULE", payload }),
      resetWorld: () => {
        const world = regenerateWorld(state.world);
        // Repopulate creatures using defaultCreatures mapping and current races
        const raceMapByName = new Map(state.races.map((r) => [r.name, r.id]));
        const creatures = defaultCreatures.flatMap((entry) => {
          const raceId = raceMapByName.get(entry.raceName) ?? state.races[0]?.id;
          return Array.from({ length: entry.count }, () =>
            createCreature({ raceId, position: findRandomSpawn(world) })
          );
        });
        dispatch({ type: "RESET_WORLD", payload: { world, creatures } });
      },
      spawnMany: (raceId, count = 5) => {
        for (let i = 0; i < count; i++) {
          dispatch({ type: "SPAWN_RANDOM", payload: raceId });
        }
      },
      resetSave: async () => {
        await persistence.resetGameState();
        dispatch({ type: "LOAD_STATE", payload: createInitialState() });
      },
    }),
    [persistence, state.settings, state.world]
  );

  return (
    <GameContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </GameContext.Provider>
  );
};
