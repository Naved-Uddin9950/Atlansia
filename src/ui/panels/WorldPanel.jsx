import React from "react";
import { useWorld } from "../../game/hooks/useWorld.js";

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-xs text-slate-300">
    <span className="uppercase tracking-widest">{label}</span>
    <span className="font-semibold text-emerald-200">{value}</span>
  </div>
);

const WorldPanel = () => {
  const {
    state: { world, creatures },
    actions,
  } = useWorld();

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="space-y-1">
        <p className="text-xs text-slate-400">World</p>
        <h2 className="text-lg font-semibold text-white">{world.name}</h2>
        <p className="text-xs text-slate-500">Age {world.age} cycles</p>
      </div>

      <div className="space-y-2">
        <StatRow label="Population" value={creatures.filter((c) => c.alive).length} />
        <StatRow label="Races" value={new Set(creatures.map((c) => c.raceId)).size} />
        <StatRow label="Tiles" value={`${world.width} x ${world.height}`} />
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-slate-400">World Rules</p>
        {Object.entries(world.rules).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-xs text-slate-300">
            <span>{key.replace(/([A-Z])/g, " $1")}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value}
              onChange={(event) => actions.updateRule({ [key]: Number(event.target.value) })}
              className="h-1 w-24 accent-emerald-400"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={actions.resetWorld}
        className="w-full rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.35)]"
      >
        Rewrite World
      </button>
    </section>
  );
};

export default WorldPanel;
