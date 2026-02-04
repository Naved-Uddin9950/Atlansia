import React, { useMemo } from "react";
import { useWorld } from "../../game/hooks/useWorld.js";
import { biomePalette } from "../../game/engine/worldEngine.js";

const tileSize = 30;

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
              <div
                key={`${x}-${y}`}
                className="relative rounded-sm border border-slate-900 bg-slate-900/20"
                style={{ width: tileSize, height: tileSize, ...getTileStyle(tile) }}
                onClick={() => {
                  // Player mode is stored in state, not in actions; access current state via actions by calling selectCreature when not in playerMode
                  if (actions?.enterWorld) {
                    // check state via world hook - but actions doesn't expose state; use selectCreature when not in player mode
                    actions.selectCreature(creature?.id ?? null);
                  } else {
                    actions.selectCreature(creature?.id ?? null);
                  }
                }}
              >
                {race?.icon ? (
                  <img
                    src={race.icon}
                    alt={race.name}
                    className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-sm"
                  />
                ) : null}
                {entry?.count ? (
                  <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950/80 text-[10px] font-semibold text-amber-200">
                    {entry.count}
                  </span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WorldCanvas;
