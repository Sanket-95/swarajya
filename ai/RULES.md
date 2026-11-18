# Rules — verbatim copy of SETUP_PROMPT.md section 1

> Do not edit independently. If a rule changes, change SETUP_PROMPT.md section 1 and re-copy, and record a decision in DECISIONS.md.

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
