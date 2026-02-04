# 🕹️ God Simulator – ReactJS (Frontend-Only)  
### Codex / AI Code Generation Prompt

---

## 🔥 PROJECT OVERVIEW

Create a **2D God Simulator game** using **ReactJS only** (no backend).

The player acts as a **God** who can:
- Create worlds
- Define rules of reality
- Create races, creatures, and monsters
- Assign stats, traits, and divine powers
- Observe autonomous simulation
- Intervene freely and rewrite the world

The entire game must persist data **locally** using frontend-only storage.

---

## 🧱 TECH STACK & CONSTRAINTS

- **Framework:** React (functional components only, use javascript and not typescript)
- **Styling:** Tailwind CSS v4 (already installed)
- **Rendering:** 2D (Canvas or div-based grid, avoid canvas if possible)
- **State Management:** React Context + custom hooks
- **Persistence:**  
  - Primary: IndexedDB (via `dexie` or `idb`)
  - Fallback: localStorage
- **No backend**
- **No Redux**
- **No external game engines**
- **No class components**

---

## 📁 PROJECT STRUCTURE

Generate the following structure:

```js
src/
├─ game/
│ ├─ engine/
│ │ ├─ timeEngine.js
│ │ ├─ ruleEngine.js
│ │ ├─ aiEngine.js
│ │ ├─ worldEngine.js
│ │ └─ combatEngine.js
│ ├─ data/
│ │ ├─ defaultRaces.js
│ │ ├─ defaultCreatures.js
│ │ └─ defaultWorldRules.js
│ ├─ hooks/
│ │ ├─ useGameLoop.js
│ │ ├─ useWorld.js
│ │ └─ usePersistence.js
│ ├─ models/
│ │ ├─ World.js
│ │ ├─ Creature.js
│ │ ├─ Race.js
│ │ └─ Power.js
│ ├─ systems/
│ │ ├─ birthSystem.js
│ │ ├─ deathSystem.js
│ │ ├─ evolutionSystem.js
│ │ └─ disasterSystem.js
│ └─ utils/
│ ├─ random.js
│ ├─ uuid.js
│ └─ math.js
│
├─ ui/
│ ├─ panels/
│ │ ├─ WorldPanel.jsx
│ │ ├─ CreaturePanel.jsx
│ │ ├─ RaceEditor.jsx
│ │ └─ PowerEditor.jsx
│ ├─ canvas/
│ │ └─ WorldCanvas.jsx
│ └─ hud/
│ ├─ GodToolbar.jsx
│ └─ TimeControls.jsx
│
├─ store/
│ ├─ GameContext.jsx
│ └─ reducers.js
│
├─ App.jsx
└─ main.jsx
```
---

## 🌍 WORLD SYSTEM

Implement a **2D grid-based world**.

```ts
World {
  id
  name
  width
  height
  tiles: Tile[][]
  rules: WorldRules
  age
}
```

Each Tile contains:
- biome (water, land, forest, lava, void, etc.)
- fertility
- dangerLevel
- temperature

## 👥 RACE & CREATURE SYSTEM
### Race Model
```js
Race {
  id
  name
  traits: {
    strength
    intelligence
    lifespan
    fertility
    aggression
    adaptability
  }
  passiveAbilities[]
}
```

### Creature Model
```js
Creature {
  id
  raceId
  position { x, y }
  stats {
    health
    energy
    hunger
    faith
  }
  powers[]
  age
  alive
}
```
Creatures must:
- Move autonomously
- Age and die
- Reproduce
- Fight enemies
- Worship the player (God)

## ⚡ GOD POWERS & DIVINE ABILITIES
God can:
- Spawn creatures
- Create and edit races
- Modify stats live
- Trigger disasters (meteor, plague, flood)
- Pause / speed time
- Rewrite world rules

### Power Model
```js
Power {
  id
  name
  effect(world, creature)
  cooldown
}
```

## ⏱️ TIME & SIMULATION ENGINE
- Tick-based simulation loop
- Adjustable speed: paused / x1 / x5 / x20
- Each tick handles:
    - AI decisions
    - Movement
    - Birth & death
    - Resource changes
    - Evolution chance

## 🧠 AI SYSTEM
Creatures should:
- Seek food
- Avoid dangerous tiles
- Attack hostile creatures
- Form groups
- Worship the god based on interactions

Use rule-based AI, not machine learning.

## 💾 DATA PERSISTENCE
Implement usePersistence() hook:
- Automatically saves:
    - World state
    - Creatures
    - Races
    - God powers
    - Game settings
- Load on page refresh
- Manual reset option

Use IndexedDB first, localStorage fallback.

## 🎨 UI & UX REQUIREMENTS
Layout:
- Left panel: World info + time controls
- Center: 2D world canvas
- Right panel: Creature/Race editor
- Bottom HUD: God power toolbar

Styling:
- Tailwind CSS v4
- Dark god-theme
- Glowing buttons
- Minimal / pixel-inspired aesthetic

## 🧪 OPTIONAL ADVANCED FEATURES
(Implement if possible)
- Evolution mutations
- Religions & belief systems
- Civilizations
- World-ending events
- Multiple save slots
- Replay / timeline view

## 🚀 OUTPUT EXPECTATIONS
- Full React implementation
- Clean folder structure
- Modular, scalable logic
- Comment complex systems (jsDoc)
- No placeholders
- Production-quality code

## ⚠️ HARD RULES
- Frontend only
- No backend
- No Redux
- No class components
- No external game engines
- No Typescript

## 🧠 GOAL
Create a true sandbox god simulator where systems interact organically and the player shapes reality itself.