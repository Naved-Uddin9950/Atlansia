import React from "react";
import "./App.css";
import { GameProvider } from "./store/GameContext.jsx";
import { useWorld } from "./game/hooks/useWorld.js";
import WorldPanel from "./ui/panels/WorldPanel.jsx";
import CreaturePanel from "./ui/panels/CreaturePanel.jsx";
import RaceEditor from "./ui/panels/RaceEditor.jsx";
import PowerEditor from "./ui/panels/PowerEditor.jsx";
import WorldCanvas from "./ui/canvas/WorldCanvas.jsx";
import GodToolbar from "./ui/hud/GodToolbar.jsx";
import TimeControls from "./ui/hud/TimeControls.jsx";

const App = () => (
  <GameProvider>
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="grid gap-4 px-6 py-6 lg:grid-cols-[280px_1fr_320px]">
        <aside className="space-y-4">
          <WorldPanel />
          <TimeControls />
        </aside>

        <section className="space-y-4">
          <WorldCanvas />
          <GodToolbar />
        </section>

        <aside className="space-y-4">
          <CreaturePanel />
          <RaceEditor />
          <PowerEditor />
        </aside>
      </main>
    </div>
  </GameProvider>
);

export default App;

const Header = () => {
  const {
    state: { settings },
  } = useWorld();

  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">God Simulator</p>
        <h1 className="text-2xl font-semibold text-white">Divine Sandbox</h1>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span>Frontend-only • Persisted locally</span>
        <span className="text-slate-300">Ticks: {settings._tickCount ?? 0}</span>
        <span className="text-slate-300">Toggles: {settings._toggleCount ?? 0}</span>
        <span className="text-slate-300">Speed: {settings.speed}</span>
      </div>
    </header>
  );
};
