# Deploying Mission Packages

> Planned flow (documented in Session 0, implemented in Session 7). Exact commands will be confirmed in Session 7.

## Build
```
cd game
pnpm build:mission <mission-id>
```
Output: `dist/missions/<mission-id>/<version>/` containing `mission.js`, `mission.json`, `thumb.webp`, `assets/…`.
- Built as a Vite library (ES module).
- `three` and `@swarajya/sdk` are **external**: the mission does not bundle them.

## Publish
1. Upload the folder `dist/missions/<mission-id>/<version>/` to the server under `missions/<mission-id>/<version>/`.
2. Add or update the entry in `missions/catalog.json` (`version`, `entry`, `manifest`, `thumbnail`, `sdk`, `requires`).
3. Reload the game. The start screen fetches the catalog with `cache: "no-store"`, so the mission appears without rebuilding the Shell.

## Rollback
Old version folders stay on the server. To roll back, point the catalog entry back to the previous version.

## Checks
- The mission's `sdk` range matches the Shell's SDK version (otherwise it shows "Update required").
- Network panel: only one `three.module.js` is loaded (from the Shell's import map).
- Package size < 25 MB.
- Load → play → unload → `__swarajya.leakCheck()` is clean.
