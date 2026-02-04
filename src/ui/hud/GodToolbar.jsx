import React from "react";
import { useWorld } from "../../game/hooks/useWorld.js";
import { useNavigate } from "react-router-dom";

const GodToolbar = () => {
  const {
    state: { powers, ui },
    actions,
  } = useWorld();
  const navigate = useNavigate();

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
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            actions.enterWorld(!ui.playerMode);
            if (!ui.playerMode) navigate("/world");
            else navigate("/");
          }}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase ${
            ui.playerMode ? "border-emerald-400 bg-emerald-600/10 text-emerald-200" : "border-slate-700 text-slate-200"
          }`}
        >
          {ui.playerMode ? "Exit World" : "Enter World"}
        </button>
        {ui.playerMode ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => actions.movePlayer({ x: Math.max(0, ui.playerPosition.x - 1), y: ui.playerPosition.y })}
              className="rounded border px-2 py-1 text-xs"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => actions.movePlayer({ x: Math.min(999, ui.playerPosition.x + 1), y: ui.playerPosition.y })}
              className="rounded border px-2 py-1 text-xs"
            >
              ▶
            </button>
            <button
              type="button"
              onClick={() => actions.movePlayer({ x: ui.playerPosition.x, y: Math.max(0, ui.playerPosition.y - 1) })}
              className="rounded border px-2 py-1 text-xs"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => actions.movePlayer({ x: ui.playerPosition.x, y: Math.min(999, ui.playerPosition.y + 1) })}
              className="rounded border px-2 py-1 text-xs"
            >
              ▼
            </button>
          </div>
        ) : null}
      </div>
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
