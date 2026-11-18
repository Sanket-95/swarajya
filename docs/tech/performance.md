# Performance Guide

Baseline machine: **i5 6th gen, 8 GB RAM, Intel HD 520, 128 GB SSD, Windows**. Default preset: **Low**. Budgets: `docs/assets/budgets.md` and `ai/RULES.md` §1.1.

## Before measuring
1. Close Blender and other heavy apps (8 GB RAM).
2. Use Chrome or Edge with hardware acceleration ON. Open `chrome://gpu` and confirm "WebGL2: Hardware accelerated".
3. Plug in the charger and set the Windows power mode to "Best performance" (laptops throttle on battery).
4. Run `pnpm dev` in `game/` and open http://localhost:5173.

## Dev overlay (top-left)
| Field | Meaning | Low budget |
|---|---|---|
| FPS | Frames per second (1 s average) | ≥ 30 (empty scene ≥ 55) |
| ms | Average frame time | ≤ 33 ms |
| calls | Draw calls in the last frame | < 120 |
| tris | Triangles rendered in the last frame | < 200k |
| geo / tex | Geometries / textures alive on the GPU | Must return to baseline after a mission unloads |
| heap | JS heap used (Chrome only) | < 250 MB in a mission |
| preset | Active quality preset | Low |

Toggle the overlay with the **F3** key.

## Profiling
- **Chrome DevTools → Performance:** record 10 s; look for long tasks (red corners, > 50 ms) and GC spikes.
- **Memory → Heap snapshot:** take one before and after a mission; compare counts (also `__swarajya.leakCheck()` from Session 1).
- **Rendering → Frame rendering stats:** GPU usage.
- Heap stable over 30 s of idle play = no per-frame allocations.

## Recording results
Write the numbers in `ai/STATUS.md` (Perf line) and in the HISTORY entry for the session.
