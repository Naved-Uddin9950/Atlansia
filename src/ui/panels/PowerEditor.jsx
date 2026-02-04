import React from "react";
import { useWorld } from "../../game/hooks/useWorld.js";

const PowerEditor = () => {
  const {
    state: { powers, races },
    actions,
  } = useWorld();

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div>
        <p className="text-xs text-slate-400">Divine Powers</p>
        <h3 className="text-lg font-semibold text-white">Pantheon</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {powers.map((power) => (
          <button
            key={power.id}
            type="button"
            onClick={() => actions.triggerDisaster(power.id)}
            className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-200"
          >
            {power.name}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Spawn</p>
        {races.map((race) => (
          <div key={race.id} className="flex gap-2">
            <button
              type="button"
              onClick={() => actions.spawnCreature(race.id)}
              className="flex-1 items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-2 text-xs text-slate-200"
            >
              <span>{race.name}</span>
              <span className="text-emerald-200">+1</span>
            </button>
            <button
              type="button"
              onClick={() => actions.spawnMany(race.id, 5)}
              className="w-16 rounded-lg border border-slate-800 bg-slate-900/40 px-2 py-2 text-xs text-slate-200"
            >
              x5
            </button>
            <button
              type="button"
              onClick={() => actions.killRace(race.id)}
              className="w-16 rounded-lg border border-rose-600 bg-rose-900/10 px-2 py-2 text-xs text-rose-200"
            >
              Kill
            </button>
            <button
              type="button"
              onClick={() => actions.blessRace(race.id)}
              className="w-16 rounded-lg border border-emerald-600 bg-emerald-900/10 px-2 py-2 text-xs text-emerald-200"
            >
              Bless
            </button>
            <button
              type="button"
              onClick={() => actions.curseRace(race.id)}
              className="w-16 rounded-lg border border-amber-600 bg-amber-900/10 px-2 py-2 text-xs text-amber-200"
            >
              Curse
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PowerEditor;
