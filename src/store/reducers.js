import { applyWorldAging, findRandomSpawn } from "../game/engine/worldEngine.js";
import { applyWorldRules } from "../game/engine/ruleEngine.js";
import { stepCreaturesAI } from "../game/engine/aiEngine.js";
import { resolveCombat } from "../game/engine/combatEngine.js";
import { handleBirths } from "../game/systems/birthSystem.js";
import { handleDeaths } from "../game/systems/deathSystem.js";
import { evolveRaces } from "../game/systems/evolutionSystem.js";
import { applyDisaster } from "../game/systems/disasterSystem.js";
import { createCreature } from "../game/models/Creature.js";

export const gameReducer = (state, action) => {
  console.debug('[reducer] action', action?.type, action);
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload ?? state;
    case "SET_SPEED":
      console.debug('[reducer] SET_SPEED', action.payload);
      return { ...state, settings: { ...state.settings, speed: action.payload } };
    case "TOGGLE_PAUSE":
        // Payload is timestamp from action to debounce rapid toggles
      try {
        const now = action.payload || Date.now();
        const last = state.settings?._lastToggle || 0;
        console.debug('[reducer] TOGGLE_PAUSE payload', action.payload, 'last', last, 'now', now);
        if (now - last < 300) {
          console.debug('[reducer] TOGGLE_PAUSE ignored (debounced)');
          return state; // ignore toggles within 300ms
        }
        return {
          ...state,
          settings: {
            ...state.settings,
            speed: state.settings.speed === 0 ? 1 : 0,
            _lastToggle: now,
            _toggleCount: (state.settings._toggleCount || 0) + 1,
          },
        };
      } catch (e) {
        console.error(e);
        return { ...state, settings: { ...state.settings, speed: state.settings.speed === 0 ? 1 : 0 } };
      }
    case "SELECT_CREATURE":
      return { ...state, ui: { ...state.ui, selectedCreatureId: action.payload } };
    case "SELECT_RACE":
      return { ...state, ui: { ...state.ui, selectedRaceId: action.payload } };
    case "CREATE_RACE":
      return { ...state, races: [...state.races, action.payload] };
    case "UPDATE_RACE":
      return {
        ...state,
        races: state.races.map((race) => (race.id === action.payload.id ? action.payload : race)),
      };
    case "SPAWN_CREATURE":
      return {
        ...state,
        creatures: state.creatures.concat(action.payload),
      };
    case "UPDATE_RULE":
      return {
        ...state,
        world: { ...state.world, rules: { ...state.world.rules, ...action.payload } },
      };
    case "TRIGGER_DISASTER":
      return applyDisaster(state, action.payload);
    case "RESET_WORLD":
      return { ...state, world: action.payload.world, creatures: action.payload.creatures };
    case "TICK": {
      const raceMap = new Map(state.races.map((race) => [race.id, race]));
      const world = applyWorldRules(applyWorldAging(state.world));
      const moved = stepCreaturesAI(world, state.creatures, raceMap);
      const withCombat = resolveCombat(moved, raceMap);
      const withBirths = handleBirths(world, withCombat, raceMap);
      const withDeaths = handleDeaths(withBirths, raceMap);
      const evolved = evolveRaces(state.races, world.rules);
      return {
        ...state,
        world,
        creatures: withDeaths,
        races: evolved,
        settings: { ...state.settings, _tickCount: (state.settings._tickCount || 0) + 1 },
      };
    }
    case "SPAWN_RANDOM": {
      const raceId = action.payload;
      const creature = createCreature({ raceId, position: findRandomSpawn(state.world) });
      return { ...state, creatures: state.creatures.concat(creature) };
    }
    default:
      return state;
  }
};
