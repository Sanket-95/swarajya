# Prompt: new mission

Task: create mission `<mission-id>` (chapter `<n>`).
1. Copy `docs/missions/_template.md` to `docs/missions/<mission-id>.md` and fill it in. Separate history from fiction; unknown facts = `TODO(Sanket): verify`.
2. Run the respect content checklist in the template. Revered figures: AI-only, dignified, no graphic death.
3. Create `game/missions/<mission-id>/` with `mission.json`, `src/index.ts` (`export default defineMission({...})`) and `assets/`.
4. Import only from `@swarajya/sdk` and `three`. Never import Shell internals or other missions.
5. Add the catalog entry to `game/public/missions/catalog.json` (id, title en/mr, chapter, type, version, sdk range, entry, manifest, thumbnail, requires, devOnly).
6. Build with `pnpm build:mission <mission-id>`; test load → play → unload → `__swarajya.leakCheck()` clean.
7. Commit `mission(<mission-id>): …`; log in `ai/HISTORY.md`.
