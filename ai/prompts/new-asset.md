# Prompt: new asset

Task: add asset `<asset-id>` of class `<character|prop|building|nature|horse>`.
1. Read `docs/assets/budgets.md`, `docs/assets/pipeline.md`, and (for humans) `docs/assets/standard-rig.md`.
2. Procedural: write a factory in `game/packages/shell/src/assets/<class>/<id>.ts` using shared palette keys from `materials.ts`. No gameplay logic in the factory.
   File-based: put the raw file in `game/assets-src/` and run `pnpm asset:import <file> --id <assetId> --class <class>`.
3. Add LOD1 if LOD0 has more than 500 triangles. Prefer vertex colours / atlases.
4. Add the entry to `game/public/assets/catalog.json` (id, class, source, file, rig, lods, budgetTris, respectTag, tags, variants).
5. Open the Asset Lab: the budget must be green. Export a GLB for procedural assets.
6. Third-party? Add a row to `docs/assets/LICENSES.md`.
7. Commit `assets: add <asset-id>`; log in `ai/HISTORY.md`.
