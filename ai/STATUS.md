# Status — updated 2026-11-19 by laptop A / Claude Opus 5.5
Phase: Bootstrap (Session 0 of SETUP_PROMPT.md) — complete
Works now:
- Repo layout from SETUP_PROMPT.md §2; `ai/` memory; `docs/` skeleton (story/history parts marked `TODO(Sanket)`).
- pnpm workspace in `game/`: `@swarajya/sdk` (draft MissionContext types + `defineMission`), `@swarajya/shell` (Vite 8 + three 0.187).
- Shell renders an empty scene (sky colour, ground plane, one hemisphere light, no shadows) on the Low preset, with a dev overlay (F3): FPS, frame ms (+worst), draw calls, triangles, geometries, textures, JS heap, preset.
- Dev console handle `window.__swarajya` = { renderer, scene, camera, pause(), resume() } (dev builds only).
- The Mavala walks: temporary third-person dev controller (`player/devPlayer.ts`, replaced in Session 8): click to capture mouse, WASD/arrows move, Shift run, mouse look, wheel zoom; idle/walk/run cross-fade; 1 m grid + sun on the test ground.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (17 tests), `pnpm build` (638 kB JS, 161 kB gzip) all pass.
In progress:
- Pack char-mavala v1.0.0 partly integrated: GLB at `game/public/assets/shared/characters/mavala.glb` (unchanged; KHR_mesh_quantization, 2,930/964 tris, 22 bones, 6 clips) and catalog entry merged. Pending: register `mavala.ts` factory (Session 2 registry), Asset Lab check (Session 3), then delete the pack from `game/assets-incoming/`.
Next task: SESSION 1 of SETUP_PROMPT.md — core engine: fixed-step 60 Hz loop with max-delta clamp, input (keyboard/mouse, pointer lock), quality presets Low/Medium/High (already in `shell/src/core/quality.ts`) + Adaptive Quality Governor, time-sliced scheduler (≤ 4 ms/frame), long-task PerformanceObserver, `Disposables` + `AssetRegistry` with `__swarajya.leakCheck()`, unit tests for scheduler/registry/governor, 2,000-cube stress toggle.
Workflow: 3D assets are designed in the claude.ai browser chat and delivered as packs into `game/assets-incoming/`; Claude Code integrates them per `docs/assets/browser-asset-handoff.md` and never re-models them (D-013). Sessions 4–5 are now import/integrate sessions.
Known issues:
- Chrome throttles requestAnimationFrame (2–13 FPS) when its window is unfocused/occluded; the overlay then shows low FPS that is NOT render cost. Measure with the window focused and in front.
- `docs/game/mavala-game-project-summary.md` was not provided in Session 0 (missing from the hand-off folder).
Ownership: Laptop A = assets + Asset Lab | Laptop B = shell, SDK, missions, gameplay   (edit if changed)
Perf on baseline machine (Low): FPS 60 (vsync-capped, 16.7 ms, render 0.06 ms) | draw calls 1 | tris 2 | heap 14 MB — measured 2026-11-18 on Intel HD 520 (ANGLE D3D11), Chrome, 1536×682 canvas, pixelRatio 1.0
