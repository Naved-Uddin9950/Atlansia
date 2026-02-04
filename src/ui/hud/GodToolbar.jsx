import React from "react";
import { useWorld } from "../../game/hooks/useWorld.js";

const GodToolbar = () => {
  const {
    state: { powers },
    actions,
  } = useWorld();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
      <span className="text-xs uppercase tracking-widest text-slate-400">Divine Actions</span>
      {powers.map((power) => (
        <button
          key={power.id}
          type="button"
          onClick={() => actions.triggerDisaster(power.id)}
          className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-200 shadow-[0_0_12px_rgba(45,212,191,0.35)]"
        >
          {power.name}
        </button>
      ))}
      <button
        type="button"
        onClick={actions.resetSave}
        className="ml-auto rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-200"
      >
        Reset Save
      </button>
    </div>
  );
};

export default GodToolbar;
