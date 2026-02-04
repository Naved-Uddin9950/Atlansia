import { useMemo, useCallback } from "react";
import Dexie from "dexie";

const STORAGE_KEY = "god-simulator-save";

const createDb = () => {
  const db = new Dexie("GodSimulator");
  db.version(1).stores({ save: "id" });
  return db;
};

export const usePersistence = () => {
  const db = useMemo(() => createDb(), []);

  const loadGameState = useCallback(async () => {
    try {
      const record = await db.table("save").get("main");
      if (record?.state) return record.state;
    } catch (error) {
      console.warn("IndexedDB unavailable, falling back to localStorage.", error);
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Failed to load localStorage save.", error);
      return null;
    }
  }, [db]);

  const saveGameState = useCallback(
    async (state) => {
      try {
        await db.table("save").put({ id: "main", state });
        return;
      } catch (error) {
        console.warn("IndexedDB unavailable, falling back to localStorage.", error);
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn("Failed to persist localStorage save.", error);
      }
    },
    [db]
  );

  const resetGameState = useCallback(async () => {
    try {
      await db.table("save").delete("main");
    } catch (error) {
      console.warn("Failed to delete IndexedDB save.", error);
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear localStorage save.", error);
    }
  }, [db]);

  return useMemo(() => ({ loadGameState, saveGameState, resetGameState }), [loadGameState, saveGameState, resetGameState]);
};
