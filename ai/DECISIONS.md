# Decisions: numbered, never deleted, only superseded

## D-001 — Single-player only (2026-11-18) — status: active
Context: Solo developer, browser game, limited time. Decision: Single-player, no multiplayer. Consequences: No networking code, no server authority; all NPCs are local AI.

## D-002 — No DB/backend/saves in current scope (2026-11-18) — status: active
Context: Focus on assets and gameplay first. Decision: Progress lives in memory for the browser session via a `ProgressStore` interface implemented by `MemoryProgressStore`. Consequences: Reloading the page resets progress; `LocalProgressStore`/`RemoteProgressStore` can replace it later without touching callers.

## D-003 — Shell + dynamic mission packages (2026-11-18) — status: active
Context: Missions must be deployable without rebuilding the game. Decision: The Shell discovers missions from `missions/catalog.json`; missions talk to it only through `@swarajya/sdk` (`MissionContext`); `three` and the SDK are provided by the Shell via an import map. Consequences: Missions are built as libraries with `three` and `@swarajya/sdk` external; only one three.js copy at runtime.

## D-004 — WebGL2 renderer by default (2026-11-18) — status: active
Context: Baseline machine is an Intel HD 520 class iGPU. Decision: `THREE.WebGLRenderer` (WebGL2) is the default; WebGPU only later, as an optional flag. Consequences: Use WebGL-compatible materials and features.

## D-005 — Baseline machine and Low preset (2026-11-18) — status: active
Context: Owner's dev machine is i5 6th gen / 8 GB / HD 520. Decision: That is the baseline; Low is the default preset in development. Consequences: Performance problems surface early; budgets in RULES.md are for Low on this machine.

## D-006 — Order of work (2026-11-18) — status: active
Context: Characters and assets are the riskiest creative part. Decision: Assets first (Asset Lab), then Shell/missions, then gameplay. Consequences: Sessions 2–5 build assets and the Lab before missions (Session 6+).

## D-007 — Procedural rigid-bound characters on a standard rig (2026-11-18) — status: active
Context: No artist; need characters quickly that can be upgraded later. Decision: Procedural low-poly characters rigid-bind their parts to `standard-human-v1` bones; real skinned models later use the same bone names. Consequences: Animation clips work for both without code changes.

## D-008 — GLB-only runtime format (2026-11-18) — status: active
Context: Keep the gameplay bundle small and the loaders few. Decision: Runtime uses `.glb` only (meshopt/Draco, KTX2/WebP) plus procedural assets; other formats only in the Asset Lab and import tools. Consequences: FBX/OBJ/etc. loaders must never enter the gameplay bundle.

## D-009 — Allies and civilians untouchable (2026-11-18) — status: active
Context: Respect and content rules. Decision: Player weapons do not affect allies, civilians or revered figures; enforced by `InteractionGuard` using respect tags. Consequences: Every player action on an entity must go through `InteractionGuard`.

## D-010 — pnpm workspace monorepo (2026-11-18) — status: active
Context: One repo for AI memory, docs and code. Decision: Top level `ai/`, `docs/`, `game/`; `game/` is a pnpm workspace (`packages/*`, `missions/*`, `tools`). Consequences: Run all game commands from `game/`.

## D-011 — TypeScript pinned to 6.0.x (2026-11-18) — status: active
Context: Latest TypeScript is 7.0.2, but typescript-eslint 8.73.0 (latest) supports only `typescript >=4.8.4 <6.1.0`. Decision: Use TypeScript 6.0.3, the newest version the lint stack supports. Consequences: Revisit when typescript-eslint supports TS 7, and supersede this decision then.

## D-012 — pnpm installed globally via npm (2026-11-18) — status: active
Context: `corepack enable` failed with EPERM writing to `C:\Program Files\nodejs` (no admin rights). Decision: Install pnpm with `npm i -g pnpm`; pin the version via `packageManager` in `game/package.json`. Consequences: On a new laptop run `npm i -g pnpm` (or `corepack enable` from an admin shell).

## D-013 — Assets designed in the browser chat, integrated by Claude Code (2026-11-18) — status: active
Context: The claude.ai browser chat (Swarajya project) has 3D preview and export tools, and designing there saves Claude Code tokens. Decision: Characters and 3D assets are designed in the claude.ai browser chat (Swarajya project), not in Claude Code. The browser chat delivers ready asset packs; Claude Code only integrates them (validate, optimise, register, catalog), per `docs/assets/browser-asset-handoff.md`. Consequences: Claude Code must not redesign or re-model pack assets; problems go to `ai/HANDOFF.md` as "console → browser-chat: <what to fix>". SETUP_PROMPT.md Sessions 4–5 become import/integrate sessions; the standard rig, budgets and Asset Lab requirements are unchanged. (Requested as "D-011", but that number was already used for the TypeScript pin, so it was recorded as D-013.)
