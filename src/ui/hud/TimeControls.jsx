import React from "react";
import { useWorld } from "../../game/hooks/useWorld.js";
import { SPEEDS } from "../../game/engine/timeEngine.js";

const TimeControls = () => {
  const {
    state: { settings },
    actions,
  } = useWorld();

  return (
    <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Time</p>
          <h3 className="text-lg font-semibold text-white">Chronos</h3>
        </div>
        <button
          type="button"
          onClick={actions.togglePause}
          className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-200"
        >
          {settings.speed === 0 ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="flex gap-2">
        {SPEEDS.filter((speed) => speed !== 0).map((speed) => (
          <button
            key={speed}
            type="button"
            onClick={() => actions.setSpeed(speed)}
            className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-widest ${
              settings.speed === speed
                ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-200"
                : "border-slate-800 bg-slate-900/50 text-slate-200"
            }`}
          >
            x{speed}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TimeControls;
