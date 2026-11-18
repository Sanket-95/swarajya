# Architecture

## Big picture
```mermaid
flowchart TB
  subgraph Browser
    subgraph Shell["Shell (game/packages/shell, Vite app)"]
      Core["core/<br/>bootstrap · renderer · loop · time<br/>input · camera rig · quality governor"]
      Systems["systems/<br/>AssetRegistry · loaders · ObjectPool<br/>culling · LOD · streaming · InteractionGuard<br/>ProgressStore · workers"]
      Player["player/<br/>3rd-person controller · anim FSM"]
      NPC["npc/<br/>tiers · ally squad · enemy AI · crowd"]
      UI["ui/<br/>start screen · settings · HUD<br/>dialogue · loading · dev overlay"]
      Assets["assets/<br/>procedural factories · materials palette"]
      Lab["lab/ (lazy chunk)<br/>Asset Lab"]
      MissionsSys["missions/<br/>MissionCatalog · Loader/Unloader<br/>SDK implementation"]
    end
    SDK["@swarajya/sdk<br/>types + MissionContext"]
    M1["Mission package A<br/>mission.js + mission.json"]
    M2["Mission package B"]
    IM["Import map<br/>three · @swarajya/sdk"]
  end
  Cat[("missions/catalog.json")] -->|fetch no-store| MissionsSys
  ACat[("assets/catalog.json")] --> Systems
  MissionsSys -->|"import(entryURL)"| M1
  MissionsSys --> M2
  M1 -->|MissionContext only| SDK
  M2 --> SDK
  SDK -.implemented by.-> MissionsSys
  IM -.provides one copy.-> M1
  IM -.-> M2
  Core --> Systems
  Systems --> NPC
  Systems --> Player
  UI --> MissionsSys
  UI -.Settings → Asset Lab.-> Lab
```

## Rules (from `ai/RULES.md` §1.2)
- The Shell owns the engine, systems, UI, player, NPC pool and asset system.
- Missions talk to the Shell **only** through `@swarajya/sdk` (`MissionContext`). They never import Shell internals or each other.
- Missions are data + code packages discovered at runtime from `catalog.json`. Adding a mission = build the package + add a catalog entry. No Shell rebuild.
- `three` and `@swarajya/sdk` are externals in mission builds and come from the Shell's import map in production.
- Progress goes through the `ProgressStore` interface (`MemoryProgressStore` now).
- All player actions on entities go through `InteractionGuard` (respect tags).
- Asset factories are visual only; animations target standard bone names.
- TypeScript strict; manifests validated with `zod`; invalid missions/assets are skipped with a clear error.

## Mission lifecycle
```mermaid
sequenceDiagram
  participant S as Start screen
  participant L as MissionLoader
  participant M as Mission module
  participant R as Renderer
  S->>L: select unlocked mission
  L->>L: show loading screen
  L->>M: import(entryURL)
  L->>L: validate manifest (zod), check sdk range
  L->>M: load(ctx)
  L->>R: compileAsync(scene)
  L->>M: start(ctx)
  loop play
    L->>M: update(ctx, dt) (optional)
  end
  M-->>L: complete / fail (via ctx.objectives)
  L->>S: result screen
  L->>M: unload(ctx)
  L->>L: dispose tracked resources, leakCheck() in dev
  L->>S: back to start screen, updated unlocks
```

## Frame (target design; built in Session 1)
1. Input sample → 2. fixed-step update (60 Hz, max-delta clamp) → 3. NPC tier scheduling → 4. time-sliced tasks (≤ 4 ms) → 5. culling/LOD → 6. render → 7. overlay stats (dev) → 8. quality governor.

## Current state (Session 0)
Only `core/` (renderer + loop for an empty scene) and `ui/devOverlay` exist. The SDK package contains type stubs only.
