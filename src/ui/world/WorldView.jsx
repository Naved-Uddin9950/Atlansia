import React, { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWorld } from "../../game/hooks/useWorld.js";
import playerImage from "../../assets/player.png"

const PLAYER_IMG = playerImage;

const WorldView = () => {
  const navigate = useNavigate();
  const {
    state: { world, ui },
    actions,
  } = useWorld();

  const exit = useCallback(() => {
    actions.enterWorld(false);
    navigate("/");
  }, [actions, navigate]);

  const [projectiles, setProjectiles] = useState([]);
  const [effects, setEffects] = useState([]);
  const containerRef = useRef(null);

  // Utility: cast a dark fire towards target pct (0..100)
  const castAtPercent = useCallback(
    (txPct, tyPct) => {
      const id = Math.random().toString(36).slice(2, 9);
      const start = { xPct: ((ui.playerPosition.x ?? 0) / Math.max(1, world.width - 1)) * 100, yPct: ((ui.playerPosition.y ?? 0) / Math.max(1, world.height - 1)) * 100 };
      setProjectiles((p) => p.concat({ id, ...start, txPct, tyPct, created: Date.now() }));

      // determine hit along line: find the first creature intersecting the line
      const creatures = (stateRef.current?.creatures ?? []).filter((c) => c.alive);
      let best = null;
      const sx = start.xPct,
        sy = start.yPct;
      const dx = txPct - sx,
        dy = tyPct - sy;
      creatures.forEach((c) => {
        const cx = ((c.position.x ?? 0) / Math.max(1, world.width - 1)) * 100;
        const cy = ((c.position.y ?? 0) / Math.max(1, world.height - 1)) * 100;
        // project creature onto line, find t
        const denom = dx * dx + dy * dy;
        const t = denom === 0 ? 0 : ((cx - sx) * dx + (cy - sy) * dy) / denom;
        if (t < 0 || t > 1) return; // not on segment
        const projx = sx + dx * t;
        const projy = sy + dy * t;
        const dist = Math.hypot(projx - cx, projy - cy);
        if (dist <= 6) {
          const along = t;
          if (!best || along < best.along) best = { creature: c, along };
        }
      });

      if (best) {
        // kill the target creature
        actions.killCreature(best.creature.id);
      }

      // remove projectile after animation time
      setTimeout(() => setProjectiles((p) => p.filter((pp) => pp.id !== id)), 700);
    },
    [actions, world, ui.playerPosition]
  );

  // stateRef to access latest state inside callbacks
  const { state } = useWorld();
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const onKey = (e) => {
      if (!ui.playerMode) return;
      if (e.key === "Escape") return exit();
      let { x, y } = ui.playerPosition || { x: 0, y: 0 };
      if (e.key === "ArrowLeft") x = Math.max(0, x - 1);
      if (e.key === "ArrowRight") x = Math.min(Math.max(0, world.width - 1), x + 1);
      if (e.key === "ArrowUp") y = Math.max(0, y - 1);
      if (e.key === "ArrowDown") y = Math.min(Math.max(0, world.height - 1), y + 1);
      actions.movePlayer({ x, y });
      if (e.key === "Enter") {
        // cast to nearest creature
        const creatures = stateRef.current.creatures.filter((c) => c.alive);
        if (!creatures.length) return;
        let best = null;
        creatures.forEach((c) => {
          const cx = ((c.position.x ?? 0) / Math.max(1, world.width - 1)) * 100;
          const cy = ((c.position.y ?? 0) / Math.max(1, world.height - 1)) * 100;
          const px = ((ui.playerPosition.x ?? 0) / Math.max(1, world.width - 1)) * 100;
          const py = ((ui.playerPosition.y ?? 0) / Math.max(1, world.height - 1)) * 100;
          const d = Math.hypot(cx - px, cy - py);
          if (!best || d < best.d) best = { creature: c, d, cx, cy };
        });
        if (best) castAtPercent(best.cx, best.cy);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ui.playerMode, ui.playerPosition, actions, world, exit]);

  const leftPct = ((ui.playerPosition?.x ?? 0) / Math.max(1, world.width - 1)) * 100;
  const topPct = ((ui.playerPosition?.y ?? 0) / Math.max(1, world.height - 1)) * 100;

  return (
    <div className="min-h-screen min-w-screen relative bg-sky-400 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <p className="text-sm text-slate-200">Use arrow keys to move. Esc to exit.</p>
        </div>

        <div className="relative h-[90vh] w-[95vw] rounded-xl overflow-hidden border border-slate-800 bg-green-500/90">
          <div className="absolute inset-0" ref={containerRef} onClick={(e) => {
            // click: in player mode use big AoE destruction (8x8 tiles)
            if (!ui.playerMode) return;
            const rect = containerRef.current.getBoundingClientRect();
            const txPct = ((e.clientX - rect.left) / rect.width) * 100;
            const tyPct = ((e.clientY - rect.top) / rect.height) * 100;
            // compute clicked tile
            const tileX = Math.round((txPct / 100) * (world.width - 1));
            const tileY = Math.round((tyPct / 100) * (world.height - 1));
            // 8x8 area: choose symmetric span
            const span = 8;
            const minX = Math.max(0, tileX - 3);
            const maxX = Math.min(world.width - 1, tileX + 4);
            const minY = Math.max(0, tileY - 3);
            const maxY = Math.min(world.height - 1, tileY + 4);

            const targets = (stateRef.current?.creatures ?? []).filter((c) => c.alive && c.position.x >= minX && c.position.x <= maxX && c.position.y >= minY && c.position.y <= maxY);
            if (targets.length) {
              targets.forEach((t) => actions.killCreature(t.id));
            }

            // spawn AoE visual
            const id = Math.random().toString(36).slice(2, 9);
            const centerX = ((minX + maxX) / 2) / Math.max(1, world.width - 1) * 100;
            const centerY = ((minY + maxY) / 2) / Math.max(1, world.height - 1) * 100;
            const wPct = ((maxX - minX + 1) / Math.max(1, world.width)) * 100;
            const hPct = ((maxY - minY + 1) / Math.max(1, world.height)) * 100;
            const newEff = { id, left: centerX, top: centerY, wPct, hPct, created: Date.now(), expanded: false };
            setEffects((s) => s.concat(newEff));
            // trigger expansion for transition
            setTimeout(() => setEffects((s) => s.map((e) => (e.id === id ? { ...e, expanded: true } : e))), 20);
            // remove effect after animation
            setTimeout(() => setEffects((s) => s.filter((e) => e.id !== id)), 1200);
          }}>
            {/* render creatures */}
            {stateRef.current?.creatures?.filter((c) => c.alive).map((c) => {
              const cx = ((c.position.x ?? 0) / Math.max(1, world.width - 1)) * 100;
              const cy = ((c.position.y ?? 0) / Math.max(1, world.height - 1)) * 100;
              const race = stateRef.current.races.find((r) => r.id === c.raceId) ?? {};
              return (
                <div key={c.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${cx}%`, top: `${cy}%` }}>
                  <img src={race.icon} alt={race.name} className="h-8 w-8 rounded-full object-cover border-2 border-white/20 shadow" />
                </div>
              );
            })}

            {/* render player */}
            <div className="absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2" style={{ left: `${leftPct}%`, top: `${topPct}%` }}>
              <img src={PLAYER_IMG} alt="player" className="h-36 w-36 object-cover" />
            </div>

            {/* projectiles visuals */}
            {projectiles.map((p) => (
              <div
                key={p.id}
                className="absolute h-3 w-3 rounded-full bg-purple-700 shadow-xl"
                style={{ left: `${p.txPct}%`, top: `${p.tyPct}%`, transform: `translate(-50%, -50%)`, transition: 'left 0.7s linear, top 0.7s linear, transform 0.7s linear' }}
              />
            ))}

            {/* AoE effects */}
            {effects.map((e) => (
              <div
                key={e.id}
                className="absolute rounded-[20%] pointer-events-none"
                style={{
                  left: `${e.left}%`,
                  top: `${e.top}%`,
                  width: `${e.wPct}%`,
                  height: `${e.hPct}%`,
                  transform: `translate(-50%, -50%) scale(${e.expanded ? 1.6 : 0.2})`,
                  opacity: e.expanded ? 0.15 : 0.9,
                  background: 'radial-gradient(circle at 30% 30%, rgba(160,0,200,0.6), rgba(80,0,120,0.25) 40%, rgba(0,0,0,0) 70%)',
                  transition: 'transform 900ms ease-out, opacity 900ms ease-out',
                  boxShadow: '0 0 40px 10px rgba(160,0,200,0.12) inset, 0 6px 30px rgba(160,0,200,0.18)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldView;
