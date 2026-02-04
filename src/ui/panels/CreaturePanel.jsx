import React from "react";
import { useWorld } from "../../game/hooks/useWorld.js";

const CreaturePanel = () => {
  const {
    state: { creatures, races, ui },
    actions,
  } = useWorld();

  const selected = creatures.find((creature) => creature.id === ui.selectedCreatureId);
  const raceMap = new Map(races.map((race) => [race.id, race]));

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Creatures</p>
          <h3 className="text-lg font-semibold text-white">Census</h3>
        </div>
        <span className="text-xs text-emerald-200">{creatures.filter((c) => c.alive).length} alive</span>
      </div>

      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {creatures.slice(0, 30).map((creature) => (
          <button
            key={creature.id}
            type="button"
            onClick={() => actions.selectCreature(creature.id)}
            className={`flex w-full items-center justify-between rounded-lg border px-2 py-1 text-left text-xs ${
              creature.id === ui.selectedCreatureId
                ? "border-emerald-400/60 bg-emerald-500/10"
                : "border-slate-800 bg-slate-900/40"
            }`}
          >
            <span className="flex items-center gap-2 text-slate-200">
              {raceMap.get(creature.raceId)?.icon ? (
                <img
                  src={raceMap.get(creature.raceId)?.icon}
                  alt={raceMap.get(creature.raceId)?.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : null}
              {raceMap.get(creature.raceId)?.name ?? "Unknown"}
            </span>
            <span className="text-slate-400">Age {creature.age}</span>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
          <p className="text-slate-300">Selected Creature</p>
          <p className="font-semibold text-emerald-200">{raceMap.get(selected.raceId)?.name}</p>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <span>Health: {Math.round(selected.stats.health)}</span>
            <span>Energy: {Math.round(selected.stats.energy)}</span>
            <span>Hunger: {Math.round(selected.stats.hunger)}</span>
            <span>Faith: {Math.round(selected.stats.faith)}</span>
          </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => actions.killCreature(selected.id)}
                  className="flex-1 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-rose-200"
                >
                  Kill
                </button>
                <button
                  type="button"
                  onClick={() => actions.blessCreature(selected.id)}
                  className="flex-1 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-200"
                >
                  Bless
                </button>
                <button
                  type="button"
                  onClick={() => actions.curseCreature(selected.id)}
                  className="flex-1 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-amber-200"
                >
                  Curse
                </button>
              </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">Select a creature to inspect its soul.</p>
      )}
    </section>
  );
};

export default CreaturePanel;
