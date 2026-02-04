import React, { useMemo, useState } from "react";
import { useWorld } from "../../game/hooks/useWorld.js";
import { createRace } from "../../game/models/Race.js";
import humanImg from "../../assets/races/humans.png";
import demonImg from "../../assets/races/demons.png";
import atlasiansImg from "../../assets/races/atlasians.png";

const ICONS = [humanImg, demonImg, atlasiansImg];

const RaceEditor = () => {
  const {
    state: { races, ui },
    actions,
  } = useWorld();
  const selectedRace = races.find((race) => race.id === ui.selectedRaceId) ?? races[0];
  const [draft, setDraft] = useState({ name: "", strength: 50, intelligence: 50, lifespan: 100, fertility: 50, aggression: 40, adaptability: 50 });
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const traitList = useMemo(
    () =>
      selectedRace
        ? Object.entries(selectedRace.traits).map(([key, value]) => ({ key, value }))
        : [],
    [selectedRace]
  );

  const handleCreate = () => {
    const race = createRace({
      name: draft.name || `Race ${races.length + 1}`,
      icon: selectedIcon,
      traits: {
        strength: draft.strength,
        intelligence: draft.intelligence,
        lifespan: draft.lifespan,
        fertility: draft.fertility,
        aggression: draft.aggression,
        adaptability: draft.adaptability,
      },
      passiveAbilities: [],
    });
    actions.createRace(race);
    actions.selectRace(race.id);
  };

  const handleTraitChange = (key, value) => {
    if (!selectedRace) return;
    actions.updateRace({
      ...selectedRace,
      traits: { ...selectedRace.traits, [key]: Number(value) },
    });
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Races</p>
          <h3 className="text-lg font-semibold text-white">Genesis Forge</h3>
        </div>
        <select
          value={selectedRace?.id ?? ""}
          onChange={(event) => actions.selectRace(event.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-200"
        >
          {races.map((race) => (
            <option key={race.id} value={race.id}>
              {race.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRace ? (
        <div className="space-y-2">
          {traitList.map((trait) => (
            <div key={trait.key} className="flex items-center justify-between text-xs text-slate-300">
              <span>{trait.key}</span>
              <input
                type="range"
                min="10"
                max="200"
                value={trait.value}
                onChange={(event) => handleTraitChange(trait.key, event.target.value)}
                className="h-1 w-24 accent-purple-400"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
        <p className="text-xs uppercase tracking-widest text-slate-400">Create Race</p>
        <input
          type="text"
          value={draft.name}
          onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Race name"
          className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-2 py-1 text-xs text-slate-200"
        />
        <div className="mt-2">
          <p className="text-xs text-slate-400">Choose Icon</p>
          <div className="mt-1 flex gap-2">
            {ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setSelectedIcon(ic)}
                className={`rounded-lg border p-1 ${selectedIcon === ic ? "border-purple-400" : "border-slate-800"}`}
              >
                <img src={ic} alt="icon" className="h-8 w-8 rounded-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="w-full rounded-lg border border-purple-400/40 bg-purple-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.35)]"
        >
          Manifest Race
        </button>
      </div>
      <div className="mt-3">
        <p className="text-xs text-slate-400">Change Selected Race Icon</p>
        <div className="mt-1 flex gap-2">
          {ICONS.map((ic) => (
            <button
              key={`chg-${ic}`}
              type="button"
              onClick={() => {
                if (!selectedRace) return;
                actions.updateRace({ ...selectedRace, icon: ic });
              }}
              className="rounded-lg border border-slate-800 p-1"
            >
              <img src={ic} alt="icon" className="h-8 w-8 rounded-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RaceEditor;
