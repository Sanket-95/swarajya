# SWARAJYA — Project Setup Prompt (for Claude Code or any AI coding agent)

> **For Sanket (human):** Put this file in the repo root as `SETUP_PROMPT.md`, commit it, then start Claude Code in the repo and type:
> `Read SETUP_PROMPT.md fully. Execute SESSION 0 only. Stop when its "Done when" checks pass.`
> For every later session: `Read CLAUDE.md, then execute SESSION <N> from SETUP_PROMPT.md.`
> One session = one Claude Code conversation. Run `/clear` between sessions.

---

## 0. WHO YOU ARE AND WHAT YOU ARE BUILDING (AI: read this first)

You are the lead engineer of **Swarajya**, a browser-based, single-player, third-person 3D action-story game set in the era of **Chhatrapati Shivaji Maharaj** (17th-century Maharashtra, Sahyadri mountains, Konkan coast, hill forts).

- Repo: `https://github.com/Sanket-95/swarajya.git`
- Owner: Sanket Sathe (full-stack dev: TypeScript/React/Node, Python/FastAPI, MySQL).
- Work style: solo, free time, two laptops, multiple AI accounts/models. **Every session must leave the repo in a state where a different AI model can continue with zero verbal explanation.** The `ai/` folder is the shared memory. Keep it accurate.

### Game in one paragraph
The player controls one ordinary **Mavala** (a soldier of Swarajya) in **third-person view**, with **GTA-style freedom** inside each mission map: walk, run, explore, talk to people, follow mission markers, fight, ride horses (later). **Allies (the player's group), enemies, civilians and animals are all computer-controlled NPCs.** Revered historical figures appear only as respectful, computer-controlled characters or in narrated scenes. The game is a **container (the "Shell")** that discovers and runs **independent mission packages**. New missions can be built and deployed separately and appear automatically on the start screen, without rebuilding the Shell.

### Current scope (very important)
- **No database, no backend, no save system right now.** Progress lives in memory for the current browser session only, behind an interface so a backend can replace it later.
- **First milestone = assets and characters**, built and inspected in a built-in **Asset Lab** (Settings → Asset Lab), then the Shell + mission system, then gameplay.

---

## 1. NON-NEGOTIABLE RULES (copy into `ai/RULES.md` in Session 0)

### 1.1 Performance — the game must never lag or hang
The development and baseline target machine is **Intel i5 6th gen, 8 GB RAM, integrated graphics (Intel HD 520 class), 128 GB SSD, Windows**. If it runs smoothly there, it runs everywhere.

1. **Render only what is visible:** frustum culling ON for everything, distance culling (view-distance per quality preset), chunked map streaming, LOD for every model above 500 triangles, instancing for repeated objects (trees, rocks, wall pieces, distant soldiers).
2. **Update only what matters:** NPCs have tiers by distance and visibility:
   - `ACTIVE` (near, visible): full AI + animation every frame
   - `SIMPLE` (mid or not visible): AI at ~5 Hz, animation at reduced rate or frozen pose
   - `DORMANT` (far): position + timer only, no mesh in scene
3. **Reuse, never churn:** NPC and character instances come from an **ObjectPool**. Never `new` an NPC, mesh or material during gameplay. **Never allocate** in the per-frame update path; reuse vectors and quaternions.
4. **No frame spikes:**
   - Loading happens behind a loading screen.
   - GPU uploads are time-sliced (≤ 4 ms per frame budget).
   - Shaders are pre-compiled during loading (`renderer.compileAsync`).
   - No network calls during gameplay.
5. **No long tasks:** any main-thread task > 50 ms is a bug. A dev-mode `PerformanceObserver` logs long tasks to the console and the overlay. Heavy work (pathfinding, terrain chunk prep, model parsing where possible) goes to Web Workers.
6. **Adaptive Quality Governor:** if average frame time stays above budget for 2 s, step quality down automatically. Steps, in order: shadows → render scale → view distance → NPC active cap → effects. Step back up after 10 s of headroom. **30 FPS is the hard floor on Low.**
7. **Renderer defaults:**
   - `THREE.WebGLRenderer` (WebGL2) is the default; WebGPU is an optional future flag.
   - `pixelRatio` is capped at 1.0 on Low and 1.5 on Medium/High.
   - Use 1 shadow-casting light (sun) at most, with a short shadow distance. Low preset: shadows off or 512 px.
   - Prefer baked or vertex-colour lighting.
8. **Budgets (Low preset, the HD 520 class machine):**

| Metric | Budget |
|---|---|
| FPS | ≥ 30 stable (target 60 on Medium hardware) |
| Draw calls | < 120 |
| Visible triangles | < 200k |
| GPU texture memory | < 128 MB |
| JS heap in a mission | < 250 MB |
| ACTIVE NPCs | ≤ 12 |
| SIMPLE NPCs | ≤ 40 |
| Shell initial download | < 10 MB |
| Each mission package | < 25 MB (assets streamed) |

9. **Memory returns to baseline** after a mission unloads. Every geometry, material, texture, skeleton, mixer, physics body, listener and worker created by a mission is tracked by `AssetRegistry`/`Disposables` and released. A dev command `__swarajya.leakCheck()` compares counts before and after.

### 1.2 Architecture
1. **Shell vs Missions:**
   - The Shell owns the engine, systems, UI, player, NPC pool and asset system.
   - Missions only talk to the Shell through the **Mission SDK** (`@swarajya/sdk`, a typed `MissionContext`).
   - Missions never import Shell internals, and missions never import each other.
2. **Missions are data + code packages** discovered at runtime from `catalog.json`. Adding a mission = build the package + add a catalog entry. No Shell rebuild.
3. **One copy of shared libraries:**
   - `three` and `@swarajya/sdk` are externals in mission builds.
   - In production they are provided by the Shell through an **import map**, so missions never bundle their own three.js.
4. **Progress is an interface:**
   - `ProgressStore` with `MemoryProgressStore` now (session-only).
   - `LocalProgressStore` and `RemoteProgressStore` come later. Nothing else in the code may know which store is used.
5. **All player actions on any entity go through `InteractionGuard`**, using respect tags (see 1.3).
6. **Assets are visual only:** no gameplay logic inside asset factories. Animations are clips or pose functions targeting **standard bone names**.
7. **Everything is typed (TypeScript strict).** Manifests are validated at runtime with `zod`. Invalid missions or assets are skipped with a clear error, never a crash.

### 1.3 Respect and content rules (override any gameplay idea)
1. **Revered figures** (Chhatrapati Shivaji Maharaj, Rajmata Jijabai, Baji Prabhu Deshpande, Tanaji Malusare, and any added later):
   - They are always computer-controlled and never playable.
   - The player cannot attack, push, block, ride into or interact disrespectfully with them. Weapon hits are disabled and collision is soft.
   - No ragdoll and no comedic, glitchy or silly animation.
   - Dignified look only. If a good model is not ready, show them in silhouette, at a distance, or in painting-style frames.
2. **Their death or sacrifice** is never shown graphically. It is told through narration, painting-style stills, music and tribute screens. These scenes carry no score or reward. Mission failure never shows harm to them; it fades out and retries with neutral text.
3. **Conflict is political/military only.** It is never religious or community hatred. Enemies are "soldiers of the opposing army", never caricatures.
4. **No gore,** only minimal stylised hit feedback.
5. **Flags (Bhagwa Dhwaj), temples and forts** cannot be damaged or misused.
6. **Allies and civilians:** player weapons do not affect them (blocked by `InteractionGuard`).
7. **Facts presented as history are checked.** Creative content belongs to the fictional Mavala's story.
8. **Respect tags** on every entity: `revered | ally | civilian | enemy | animal | prop`.

### 1.4 Code and repo rules
1. Use **current stable versions only** and check them at install time (`pnpm view <pkg> version`). No deprecated APIs, no copying from old tutorials.
2. **One session = one module/task.** Don't scan the whole repo; read only the files the task needs, plus `ai/` memory files.
3. **Small commits** with prefixes `shell:`, `sdk:`, `mission(<id>):`, `assets:`, `lab:`, `tools:`, `docs:`, `ai:`. Commit after every finished sub-task.
4. **Cross-platform scripts:** Node scripts only, no bash-only scripts, because the owner uses Windows. Paths without spaces.
5. **Third-party free tools are encouraged** (see section 6). Record each tool, version and licence in `docs/assets/LICENSES.md` (for assets) or `docs/tech/tools.md` (for tools).
6. **Never commit** large raw source files (> 20 MB). Raw source art goes in `game/assets-src/` (git-ignored except small files); compressed outputs are committed.

---

## 2. REPOSITORY LAYOUT (create in Session 0)

```
swarajya/
├── CLAUDE.md                  ← auto-read by Claude Code: tiny pointer to ai/README.md + top rules
├── AGENTS.md                  ← same content, for other AI agents/models
├── SETUP_PROMPT.md            ← this file
├── README.md                  ← human overview + how to run
├── .gitattributes             ← * text=auto eol=lf ; *.glb *.ktx2 *.png *.jpg binary
├── .gitignore
│
├── ai/                        ← AI INSTRUCTIONS + SHARED MEMORY (any model starts here)
│   ├── README.md              ← "start here": reading order, how to work, session ritual
│   ├── RULES.md               ← section 1 of this file, verbatim
│   ├── STATUS.md              ← current phase, what works, what's next, per-laptop ownership
│   ├── HISTORY.md             ← append-only session log (newest on top)
│   ├── DECISIONS.md           ← numbered decision log (D-001…), never deleted, only superseded
│   ├── HANDOFF.md             ← open requests between Laptop A and Laptop B (and chat planner)
│   ├── GLOSSARY.md            ← Mavala, Shell, Mission package, ACTIVE/SIMPLE/DORMANT, etc.
│   └── prompts/               ← reusable task prompts
│       ├── session-start.md
│       ├── session-end.md
│       ├── new-asset.md
│       ├── new-character-from-images.md
│       └── new-mission.md
│
├── docs/                      ← GAME DOCUMENTATION (human-first, AI-readable)
│   ├── game/
│   │   ├── overview.md        ← vision, pillars, controls, GTA-style rules adapted to the era
│   │   ├── world-story.md     ← historical frame, tone, what is history vs fiction
│   │   ├── chapters/          ← ch1-becoming-a-mavala.md, ch2-siege-of-panhala.md …
│   │   └── respect-guidelines.md
│   ├── missions/
│   │   ├── _template.md       ← mission design doc template
│   │   └── <mission-id>.md    ← one design doc per mission (story, objectives, NPCs, map, fail/retry)
│   ├── characters/
│   │   ├── character-bible.md ← every character: role, respect tag, look, palette, rig, status
│   │   └── references/<character-id>/  ← Sanket's low-poly reference images go here
│   ├── assets/
│   │   ├── supported-formats.md   ← what formats load where, conversion steps
│   │   ├── pipeline.md            ← image → model → GLB → compress → catalog
│   │   ├── budgets.md             ← triangle/texture budgets per asset class
│   │   ├── standard-rig.md        ← bone names and hierarchy all humans share
│   │   └── LICENSES.md            ← every third-party asset: source, licence, author
│   └── tech/
│       ├── architecture.md        ← Shell, SDK, missions, systems diagram
│       ├── mission-sdk.md         ← MissionContext API reference
│       ├── deploy-missions.md     ← how to build and publish a mission package
│       ├── performance.md         ← how to profile on the HD 520 machine
│       └── tools.md               ← third-party tools, versions, install steps on Windows
│
└── game/                      ← THE ACTUAL PROJECT (pnpm workspace)
    ├── package.json           ← workspace root scripts
    ├── pnpm-workspace.yaml
    ├── tsconfig.base.json
    ├── packages/
    │   ├── sdk/               ← @swarajya/sdk: types + MissionContext interfaces (no runtime deps on shell)
    │   └── shell/             ← the game container (Vite app)
    │       ├── index.html     ← import map for three + sdk in production
    │       └── src/
    │           ├── core/      ← bootstrap, renderer, loop, time, input, camera rig, quality governor
    │           ├── systems/   ← AssetRegistry, loaders, ObjectPool, culling, LOD, streaming,
    │           │                InteractionGuard, ProgressStore, audio (later), workers
    │           ├── player/    ← third-person controller, animation state machine
    │           ├── npc/       ← NPC base, tiers, ally squad, enemy AI, crowd manager
    │           ├── ui/        ← start screen (mission list), settings, HUD, dialogue, loading, overlay
    │           ├── assets/    ← procedural asset factories (code-built characters/props) + shared materials
    │           ├── lab/       ← Asset Lab (lazy-loaded chunk, never loaded during gameplay)
    │           └── missions/  ← MissionCatalog, MissionLoader/Unloader, SDK implementation
    ├── missions/              ← each mission is its own package, built separately
    │   └── ch0-test-walk/     ← sample mission (Session 6)
    │       ├── mission.json   ← manifest
    │       ├── src/index.ts   ← export default defineMission({...})
    │       └── assets/        ← mission-only assets
    ├── assets-src/            ← raw source art (git-ignored except small files)
    ├── public/
    │   ├── assets/shared/     ← shared GLB/KTX2/audio used by Shell and many missions
    │   ├── assets/catalog.json← asset catalog (Asset Lab + loaders read this)
    │   ├── missions/catalog.json ← mission catalog (start screen reads this)
    │   └── vendor/            ← three.module.js, decoders (draco, basis, meshopt) for import map
    └── tools/                 ← Node scripts: convert-model, optimize-glb, build-mission,
                                 validate-catalogs, export-procedural, perf-report
```

---

## 3. KEY SYSTEM SPECIFICATIONS

### 3.1 Mission system (container + dynamic missions)

**`missions/catalog.json`** is fetched at startup with `cache: "no-store"`:
```json
{
  "catalogVersion": 1,
  "missions": [
    {
      "id": "ch0-test-walk",
      "title": { "en": "First Steps", "mr": "पहिली पावले" },
      "chapter": 0,
      "type": "main",
      "version": "1.0.0",
      "sdk": "^1.0.0",
      "entry": "missions/ch0-test-walk/1.0.0/mission.js",
      "manifest": "missions/ch0-test-walk/1.0.0/mission.json",
      "thumbnail": "missions/ch0-test-walk/1.0.0/thumb.webp",
      "requires": [],
      "devOnly": false
    }
  ]
}
```

**`mission.json`** (per package) contains: id, version, sdk range, map id, asset list (preload vs. streamed), NPC roster (pool keys + respect tags + counts), objectives, unlock flags it sets on completion, estimated download size.

**Mission module contract (SDK):**
```ts
export default defineMission({
  id: "ch0-test-walk",
  async load(ctx: MissionContext) { /* request assets via ctx.assets, build map via ctx.world */ },
  start(ctx) { /* spawn via ctx.npc.spawn(poolKey, opts), set objectives via ctx.objectives */ },
  update(ctx, dt) { /* optional; prefer events */ },
  async unload(ctx) { /* nothing to free manually: ctx tracks everything it handed out */ },
});
```

**`MissionContext`** exposes only:
- `assets` (load/get, auto-tracked)
- `world` (terrain/chunks/props)
- `player` (read state, teleport, give ability)
- `npc` (spawn from pool, set behaviour: follow/guard/patrol/attack/idle, despawn)
- `objectives` (add/complete/fail, markers on minimap)
- `dialogue`
- `cutscene` (later)
- `events` (typed event bus)
- `progress` (get/set mission flags)
- `ui` (toasts, HUD widgets)
- `guard` (InteractionGuard queries)
- `time`
- `log`

**Lifecycle:** Start screen → select an unlocked mission → loading screen → `import(entryURL)` → validate manifest → `load` → `compileAsync` → `start` → play → complete/fail → result screen → `unload` → **leak check in dev** → back to the start screen with an updated unlock list.

**Unlocking (no saves yet):**
- `MemoryProgressStore` holds completed missions and flags for the session.
- A mission is unlocked when every `requires` id is completed.
- Settings → Developer has an "Unlock all missions" toggle (dev builds only).

**SDK versioning:** the Shell refuses a mission whose `sdk` range is incompatible, shows "Update required", and skips it without crashing.

**Deploy (later, documented now):**
- `pnpm build:mission <id>` produces `dist/missions/<id>/<version>/`.
- Upload that folder, then update `catalog.json`. Old versions stay in place for rollback.

### 3.2 Asset system and supported formats

**Runtime (gameplay):** `.glb` only. It may use **meshopt or Draco** compression, **KTX2 (Basis)** textures (WebP fallback), and **procedural** (code-built) assets registered by key.

**Asset Lab only** (formats lazy-loaded so they never enter the gameplay bundle): `.glb`, `.gltf` (+ .bin, textures), `.fbx`, `.obj` (+ `.mtl`), `.dae`, `.stl`, `.ply`, `.vrm` (optional, via `@pixiv/three-vrm` if still maintained at install time).

**Conversion path** to the runtime format:
- FBX/OBJ/DAE → Blender or FBX2glTF → GLB → `gltf-transform optimize` (meshopt + KTX2/WebP) → `public/assets/...` → entry in `assets/catalog.json`.
- Script: `pnpm asset:import <file> --id <assetId> --class character|prop|building|nature|horse`.

**`assets/catalog.json` entry:**
```json
{
  "id": "char.mavala.base",
  "class": "character",
  "source": "procedural:mavala",
  "file": null,
  "rig": "standard-human-v1",
  "lods": [0, 1],
  "budgetTris": 3000,
  "respectTag": "ally",
  "tags": ["human", "soldier"],
  "variants": ["mavala.default", "mavala.red-sash", "mavala.elder"]
}
```
(`file` is set for imported GLBs; `source` is `"file"` or `"procedural:<factory>"`.)

**Standard rig `standard-human-v1`:**
- One bone hierarchy with fixed names (Hips, Spine, Spine1, Spine2, Neck, Head, Left/Right Shoulder, Arm, ForeArm, Hand, UpLeg, Leg, Foot, ToeBase), Mixamo-compatible naming without prefix.
- Procedural characters **rigid-bind their parts to these bones** now. Later, skinned Blender/MPFB2 models use the same names, so every animation clip works on both without code changes.

**Shared materials:** one `materials.ts` palette (cream cloth, saffron, red sash, gold, skin tones, laterite, stone, wood, terracotta tile, foliage). Assets reference palette keys, which cuts materials and draw calls.

**Budgets** (`docs/assets/budgets.md`):

| Asset | Triangle budget |
|---|---|
| Human LOD0 | ≤ 3k |
| Human LOD1 | ≤ 1k |
| Horse LOD0 | ≤ 2.5k |
| House | ≤ 2k |
| Fort kit piece | ≤ 600 |
| Tree | ≤ 400 (instanced) |
| Rock | ≤ 150 (instanced) |

Texture: ≤ 512 px for characters on Low, atlases preferred, many assets use vertex colours only.

### 3.3 Asset Lab (Settings → Asset Lab)
A lazy-loaded screen for **360° inspection of every character and asset during development**.

Layout:
- Left: catalog list with search and filters by class/tag.
- Centre: viewport.
- Right: info and stats panel.

Viewport features:
- Orbit, zoom and pan; auto-rotate toggle; reset view.
- Turntable: front, side and back snaps.
- Ground grid; a 1.75 m scale reference.
- Lighting presets: Day, Sunset, Overcast, Torch-night. Backgrounds: neutral, sky.

Inspection features:
- Wireframe, normals, bounding box and skeleton/bones view.
- LOD switch; variant switch (outfits/colours).
- Animation clip list with play, pause, speed and loop.

Stats and validation:
- Stats: triangles, draw calls, materials, textures (count and estimated GPU MB), bones, clips, file size.
- **Budget validator:** green/amber/red against `budgets.md`, plus respect-tag display.

Import and export:
- **Drag-and-drop import** of any supported format for a quick look, which is not added to the catalog automatically. A button generates the `asset:import` command.
- **Export GLB** of any procedural asset (GLTFExporter, binary) so code-built assets become files.
- Screenshot to PNG.

Rules:
- The Lab must itself respect the performance rules: one asset in the scene at a time, disposed on switch.
- The Lab is shown in dev builds, and in production only when `?lab=1` or the dev flag is set.

### 3.4 Player, NPCs, camera (GTA-style, adapted to the era)

**Player:** third-person over-the-shoulder camera with collision (`three-mesh-bvh` raycasts). Movement: walk, run, sprint (stamina), crouch/sneak, jump, climb ledges (later). Interact key; minimap with objective markers. Later: horse mount, sword/shield/bow combat with lock-on.

**Allies (player's group):** squad of up to 4–6.
- Orders: Follow / Hold / Attack target / Regroup.
- Formation follow; they stay ACTIVE only when near and visible.

**Enemies:**
- States: Patrol → Suspicious → Alert → Combat → Search → Return.
- Vision cones; group alert radius.

**Civilians:** daily routines (walk, work, idle), react to danger by fleeing. They are untouchable by player weapons.

**Pooling:** pools per body type with outfit/colour variants. Spawning applies a variant, a respect tag and a behaviour.

**Visible-only control:** tier rules from 1.1, and animation mixers update only for ACTIVE (throttled for SIMPLE).

**Mission flow like GTA:**
- Walk into a glowing marker to start.
- Objectives appear in the HUD.
- Failure → fade → checkpoint retry.
- Completion → result screen.

### 3.5 Characters from Sanket's reference images
Sanket will place low-poly reference images (front/side/back if possible) in `docs/characters/references/<character-id>/`. Workflow:
1. Read the images and write or extend the entry in `docs/characters/character-bible.md`: proportions, palette (hex), outfit parts, accessories, respect tag.
2. Build a **procedural factory** `game/packages/shell/src/assets/characters/<id>.ts` using standard-rig bones, the shared palette and the triangle budget. Provide variants.
3. Register it in `assets/catalog.json`, check it in the Asset Lab (budget green), export a GLB to `public/assets/shared/characters/` from the Lab or `tools/export-procedural`.
4. Log the work in `ai/HISTORY.md`, with any decisions in `DECISIONS.md`.

The style goal is **stylised low-poly with a detailed face**: eyes, brows, nose, curled Maratha moustache, tilak, pagdi with gold turra. Revered figures get extra review and never a cartoonish look.

---

## 4. THIRD-PARTY FREE TOOLS AND LIBRARIES (verify versions at install)

**Runtime libraries:**

| Library | Purpose |
|---|---|
| `three` | Engine |
| `three-mesh-bvh` | Fast raycasts and collision |
| `zod` | Manifest validation |
| `lil-gui` | Dev panels, dev only |
| `@dimforge/rapier3d-compat` | Physics; add only when needed (combat or horse phase) |
| `recast-navigation` | Navmesh; add in the NPC phase |
| `howler` | Audio; add in the audio phase |

**Dev:** `vite`, `typescript`, `vitest`, `eslint` + `typescript-eslint`, `prettier`, `@gltf-transform/core` + `@gltf-transform/extensions` + `@gltf-transform/functions` + `@gltf-transform/cli`, `meshoptimizer`.

**Desktop tools** (free, documented in `docs/tech/tools.md` with Windows install steps):
- Blender 4.2 LTS or newer, with the **MPFB2** extension (CC0 humans)
- FBX2glTF (Godot fork)
- KTX-Software (`toktx`) for KTX2
- Mixamo (free animations, Adobe ID)

**Free asset sources (CC0):** Quaternius, Kenney, Poly Haven, ambientCG. Record each in `LICENSES.md`.

**Package manager:** **pnpm**. Its shared store saves disk space on a 128 GB SSD.

---

## 5. DEV MACHINE CONSTRAINTS (i5 6th gen, 8 GB RAM, 128 GB SSD, Windows)
- **Node:** current LTS. **pnpm** via corepack.
- **Close Blender while the dev server and Chrome are open** (8 GB RAM).
- **Use Chrome or Edge** with hardware acceleration ON. Check `chrome://gpu` shows WebGL2 hardware accelerated.
- **Vite dev server:** no heavy plugins; `server.warmup` off; source maps `cheap` in dev.
- **Disk hygiene:** `pnpm store prune` monthly; raw art outside git; no Docker for now.
- **Tests and builds** must finish in under ~60 s on this machine. If not, optimise the tooling, not the hardware.
- **Default quality preset** on this machine: **Low**. Development happens on Low so performance problems surface early.

---

## 6. AI MEMORY FILES — EXACT FORMATS

### `CLAUDE.md` and `AGENTS.md` (root, identical, ≤ 40 lines)
```
# Swarajya — read me first
1. Read ai/README.md, ai/RULES.md, ai/STATUS.md, top 3 entries of ai/HISTORY.md, open items in ai/HANDOFF.md.
2. Run `git log --oneline -15`.
3. Work on ONE task. Read only files that task needs.
4. Before ending: run session-end ritual (ai/prompts/session-end.md).
Top rules: no lag (visible-only rendering, pooling, no per-frame allocations, time-sliced loading),
Shell/Mission isolation via SDK, all interactions through InteractionGuard, revered figures AI-only & dignified,
no DB/saves yet (MemoryProgressStore), TypeScript strict, current stable libs, small prefixed commits.
```

### `ai/STATUS.md`
```
# Status — updated <YYYY-MM-DD> by <laptop A|B> / <model>
Phase: <name> (Session <N> of SETUP_PROMPT.md)
Works now: - …
In progress: - …
Next task: <exactly one task, specific enough to start without questions>
Known issues: - …
Ownership: Laptop A = assets + Asset Lab | Laptop B = shell, SDK, missions, gameplay   (edit if changed)
Perf on baseline machine (Low): FPS <x> | draw calls <x> | tris <x> | heap <x> MB
```

### `ai/HISTORY.md` (append-only, newest on top)
```
## <YYYY-MM-DD HH:MM> — <laptop> — <model> — Session <N>: <title>
Did: …
Files: …
Commits: <short hashes>
Decisions: D-0xx (if any)
Perf: <numbers if measured>
Next: …
```

### `ai/DECISIONS.md`
```
## D-001 — <title> (<date>) — status: active|superseded by D-0xx
Context: … Decision: … Consequences: …
```

Seed these decisions:
- **D-001:** Single-player, no multiplayer.
- **D-002:** No DB/backend/saves in current scope; `ProgressStore` interface with `MemoryProgressStore`.
- **D-003:** Shell + dynamic mission packages via `catalog.json` + SDK; three via import map.
- **D-004:** WebGLRenderer (WebGL2) default; WebGPU later as an optional flag.
- **D-005:** Baseline machine = i5 6th gen / 8 GB / HD 520; Low preset is the default in development.
- **D-006:** Assets first (Asset Lab), then Shell/missions, then gameplay.
- **D-007:** Procedural low-poly characters rigid-bound to `standard-human-v1` bones; real skinned models later with the same bone names.
- **D-008:** Runtime format GLB only; other formats only in the Asset Lab and import tools.
- **D-009:** Allies and civilians are untouchable by player weapons (InteractionGuard).
- **D-010:** pnpm workspace monorepo: `ai/`, `docs/`, `game/`.

### `ai/HANDOFF.md`
```
## Open
- [ ] <date> <from>→<to>: <request> (refs: file/section)
## Done
- [x] <date> <from>→<to>: <what was delivered> (commit)
```

### `ai/prompts/session-start.md`
"`git pull` → read CLAUDE.md order → state in 3 lines what you understood and the single task → do it."

### `ai/prompts/session-end.md`
"Run lint, typecheck and tests → update STATUS.md → prepend a HISTORY.md entry → add any DECISIONS → update HANDOFF → commit with prefix → `git push` → print a 5-line summary for the human."

---

## 7. SESSION PLAN (each session fits one Claude Code conversation)

Every session ends with the session-end ritual. **Done when** checks are mandatory.

### SESSION 0 — Bootstrap repo, memory and docs
1. Clone or confirm `https://github.com/Sanket-95/swarajya.git`. Create the full layout from section 2.
2. Write all `ai/` files (section 6 formats; RULES.md = section 1 verbatim; DECISIONS seeded; GLOSSARY).
3. Write `docs/`. **Fill what is known; mark the rest `TODO(Sanket)` instead of inventing story.**
   - `game/overview.md`: vision, pillars, GTA-style rules adapted to the era, controls draft.
   - `game/world-story.md`: historical frame; clearly separates history from fiction.
   - `game/respect-guidelines.md`: section 1.3, expanded with examples.
   - `chapters/ch2-siege-of-panhala.md`: historical outline of the 1660 escape from Panhala to Vishalgad and the stand at Ghod Khind (Pavan Khind) led by Baji Prabhu Deshpande, with a note that facts must be verified from reliable sources before content is final.
   - `missions/_template.md`: id, chapter, summary, history-vs-fiction note, map, objectives, NPC roster with respect tags, fail/retry, unlock requirements, assets, budgets, content checklist.
   - `characters/character-bible.md`: Mavala (player), ally soldier, enemy soldier, villager male/female, horse; revered figures listed with presentation rules only.
   - `assets/*.md`: supported formats, pipeline, budgets, standard rig, LICENSES (empty table).
   - `tech/*.md`: architecture diagram (Mermaid), mission SDK draft, deploy-missions, performance guide, tools.
4. Create the pnpm workspace in `game/` (`packages/sdk`, `packages/shell`, `missions/`, `tools/`). TypeScript strict, ESLint, Prettier, Vitest, `.gitattributes` (LF), `.gitignore` (node_modules, dist, assets-src large files).
5. The Shell renders an empty scene (sky colour, ground plane) with a **dev overlay**: FPS, frame ms, draw calls, triangles, geometries, textures, JS heap. Low preset active.
6. Commit in logical steps and push.

**Done when:** `pnpm i && pnpm dev` opens the empty scene at ≥ 55 FPS on the baseline machine; `pnpm lint`, `pnpm typecheck` and `pnpm test` pass; all `ai/` and `docs/` files exist; HISTORY has its first entry.

### SESSION 1 — Core engine
Game loop (fixed-step update at 60 Hz + render, max-delta clamp), input (keyboard/mouse, pointer lock), quality presets (Low/Medium/High) + **Adaptive Quality Governor**, time-sliced task scheduler (≤ 4 ms/frame), long-task observer, `Disposables` and `AssetRegistry` with `leakCheck()`. Unit tests for scheduler, registry and governor.
**Done when:** a stress toggle spawns 2,000 cubes; the governor holds ≥ 30 FPS on Low; disposing returns counts to baseline.

### SESSION 2 — Asset system
- Loaders: GLTFLoader with meshopt, Draco and KTX2; decoders served from `public/vendor`.
- `assets/catalog.json` + zod schema; procedural asset registry; shared materials palette; LOD helper; instancing helper.
- `tools/optimize-glb`, `tools/asset-import`, `tools/validate-catalogs`.

**Done when:** a sample CC0 GLB and a procedural cube asset both load via catalog id; validation script passes.

### SESSION 3 — Asset Lab
Everything in section 3.3: lazy-loaded chunk, Settings menu entry, drag-and-drop import for all listed formats, budget validator, GLB export, screenshot.
**Done when:** every catalog asset can be viewed in 360°; dropping an `.fbx` and an `.obj` shows them; the gameplay bundle does not contain FBX/OBJ loader code (check the build report).

### SESSION 4 — Standard rig + Mavala
- `standard-human-v1` bone factory + `docs/assets/standard-rig.md`.
- Mavala procedural factory from the reference images (or from the bible if no images yet), with a detailed face.
- 3 variants.
- Clips: idle, walk, run, as `AnimationClip`s on bone names.
- LOD1.

**Done when:** budget green in the Lab, clips play, GLB exported to `public/assets/shared/characters/mavala.glb` and reloads correctly in the Lab.

### SESSION 5 — Era asset set
Ally soldier and enemy soldier (variants of the base body), villager male/female, horse (+ idle/walk), Konkan house, fort modular kit (wall, corner, bastion/buruj, gate, steps, tower, crenellation, flag), trees/palms/rocks (instanced), props (cart, barrel, crate, haystack, tulsi vrindavan, tent, fence).
**Done when:** all budgets green, GLBs exported, catalog updated, LICENSES updated for anything third-party.

### SESSION 6 — Shell + Mission SDK + start screen
- `@swarajya/sdk` types.
- MissionCatalog (fetch + validate), MissionLoader/Unloader, `MemoryProgressStore`.
- Start screen with unlocked missions (locked ones greyed out, with requirements shown); Settings (quality, dev toggles, Asset Lab).
- Sample mission `ch0-test-walk`: Mavala walks to a marker; completing it unlocks `ch0-test-2`.

**Done when:** completing mission 1 unlocks mission 2 in the same session; unload passes `leakCheck()`; an invalid catalog entry is skipped with a visible error, not a crash.

### SESSION 7 — Independent mission build and deploy
- `tools/build-mission <id>`: Vite library build, `three` and `@swarajya/sdk` external, output `dist/missions/<id>/<version>/`.
- Import map in the Shell `index.html`. Semver check.
- `docs/tech/deploy-missions.md` with exact steps.

**Done when:** a mission built separately and copied into the deployed folder + catalog appears and runs **without rebuilding the Shell**, and only one three.js copy is loaded (check the Network panel).

### SESSION 8 — Third-person player
Controller (walk/run/sprint/crouch/jump), camera rig with collision (three-mesh-bvh), animation state machine with blending, minimap, interaction prompts via InteractionGuard.
**Done when:** smooth control on a test map at ≥ 30 FPS on Low; the camera never clips through walls.

### SESSION 9 — NPC system
ObjectPool per body type, tiers ACTIVE/SIMPLE/DORMANT, distance + visibility scheduler, ally squad (follow/hold/attack/regroup), enemy states (patrol → combat), civilian routines, InteractionGuard enforcement with tests.
**Done when:** 12 ACTIVE + 40 SIMPLE NPCs on the baseline machine stay ≥ 30 FPS; revered/ally/civilian cannot be harmed (tests pass).

### SESSION 10 — World streaming
Chunked terrain (64 m chunks) prepared in a Web Worker, instanced vegetation, distance culling per preset, a Sahyadri-style test map (real heightmap optional).
**Done when:** walking across the map shows no frame spikes > 50 ms; memory stays flat.

### LATER (not now)
Combat, horse riding, cutscene player (in-engine, JSON timelines; tribute scenes as painting-style stills + narration), audio, localisation (Marathi/Hindi/English), Chapter 1 and 2 missions, and then backend + saves (FastAPI + MySQL) replacing `MemoryProgressStore`.

---

## 8. QUALITY GATES (every session)
- [ ] `pnpm lint`, `pnpm typecheck` and `pnpm test` are green
- [ ] No new per-frame allocations (dev check: heap stable over 30 s of idle play)
- [ ] Overlay numbers within Low budgets on the baseline machine
- [ ] `leakCheck()` clean after any load/unload path touched
- [ ] Respect rules are not violated (content checklist in `docs/missions/_template.md`)
- [ ] `ai/STATUS.md`, `ai/HISTORY.md`, `ai/HANDOFF.md` and `ai/DECISIONS.md` updated
- [ ] Commits are small and prefixed; pushed

## 9. IF UNSURE
- If something is ambiguous, prefer the **simpler, faster** option and record it as a decision.
- Never invent historical facts; leave `TODO(Sanket): verify`.
- Never weaken a rule in section 1 to finish a task. Stop and write the blocker in HANDOFF instead.
