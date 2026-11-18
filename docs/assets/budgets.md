# Asset Budgets

The Asset Lab budget validator reads these numbers: **green** ≤ budget, **amber** ≤ 120 % of budget, **red** > 120 %.

## Triangles
| Asset | Triangle budget |
|---|---|
| Human LOD0 | ≤ 3k |
| Human LOD1 | ≤ 1k |
| Horse LOD0 | ≤ 2.5k |
| House | ≤ 2k |
| Fort kit piece | ≤ 600 |
| Tree | ≤ 400 (instanced) |
| Rock | ≤ 150 (instanced) |

Any model above 500 triangles needs a LOD.

## Textures
- ≤ 512 px for characters on Low; atlases preferred; many assets use vertex colours only.
- KTX2 (Basis) preferred, WebP fallback.
- Total GPU texture memory in a scene on Low: < 128 MB.

## Materials
- Reference shared palette keys (`materials.ts`); avoid unique materials per asset.
- Target ≤ 3 materials per character, ≤ 2 per prop.

## Scene budgets (Low preset, baseline machine)
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
