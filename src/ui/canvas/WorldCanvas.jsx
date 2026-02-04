import React, { useMemo } from "react";
import { useWorld } from "../../game/hooks/useWorld.js";
import { biomePalette } from "../../game/engine/worldEngine.js";

const tileSize = 22;

const getTileStyle = (tile) => ({
  backgroundColor: biomePalette[tile.biome] ?? "#0f172a",
});

const WorldCanvas = () => {
  const {
    state: { world, creatures, races },
    actions,
  } = useWorld();

  const raceMap = useMemo(() => new Map(races.map((race) => [race.id, race])), [races]);

  const creatureMap = useMemo(() => {
    const map = new Map();
    creatures.forEach((creature) => {
      if (!creature.alive) return;
      const key = `${creature.position.x}:${creature.position.y}`;
      const entry = map.get(key) ?? { count: 0, creatures: [] };
      entry.count += 1;
      entry.creatures.push(creature);
      map.set(key, entry);
    });
    return map;
  }, [creatures]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-[0_0_30px_rgba(45,212,191,0.12)]">
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${world.width}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${world.height}, ${tileSize}px)`,
        }}
      >
        {world.tiles.flatMap((row, y) =>
          row.map((tile, x) => {
            const entry = creatureMap.get(`${x}:${y}`);
            const creature = entry?.creatures?.[0];
            const race = creature ? raceMap.get(creature.raceId) : null;
            return (
              <button
                key={`${x}-${y}`}
                type="button"
                onClick={() => actions.selectCreature(creature?.id ?? null)}
                className="relative rounded-sm border border-slate-900"
                style={{ width: tileSize, height: tileSize, ...getTileStyle(tile) }}
              >
                {race?.icon ? (
                  <img
                    src={race.icon}
                    alt={race.name}
                    className="absolute inset-0 h-full w-full rounded-sm object-cover opacity-90"
                  />
                ) : null}
                {entry?.count ? (
                  <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950/80 text-[9px] font-semibold text-amber-200">
                    {entry.count}
                  </span>
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WorldCanvas;
