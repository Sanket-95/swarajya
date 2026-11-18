# Tools

Third-party tools, versions and Windows install steps. Assets go in `docs/assets/LICENSES.md` instead.

## Installed in the workspace (versions checked 2026-11-18)
| Tool | Version | Licence | Purpose |
|---|---|---|---|
| Node.js | 24.14.0 (LTS) | MIT | Runtime |
| pnpm | 12.21.0 | MIT | Package manager (shared store saves disk) |
| three | 0.187.0 | MIT | Engine |
| vite | 8.3.8 | MIT | Dev server / bundler |
| typescript | 6.0.3 | Apache-2.0 | Types (6.0.x pinned, see D-011) |
| vitest | 5.1.0 | MIT | Tests |
| eslint | 10.15.0 | MIT | Lint |
| typescript-eslint | 8.73.0 | MIT | TS lint rules |
| prettier | 3.10.1 | MIT | Formatting |
| zod | 4.6.7 | MIT | Manifest validation (added to the shell now, used from Session 2) |

Planned (added in the session that needs them, version checked then): `three-mesh-bvh`, `lil-gui`, `@gltf-transform/*`, `meshoptimizer`, `@dimforge/rapier3d-compat`, `recast-navigation`, `howler`, `@pixiv/three-vrm` (optional).

## Windows setup (new laptop)
1. Install **Node.js LTS** from https://nodejs.org (MSI).
2. Install pnpm: `npm i -g pnpm` (or `corepack enable` from an **admin** terminal; see D-012).
3. Install **Git for Windows**.
4. `git clone https://github.com/Sanket-95/swarajya.git` into a path **without spaces**.
5. `cd swarajya/game && pnpm i && pnpm dev`.
6. Monthly: `pnpm store prune`.

## Desktop tools (free; install when needed)
| Tool | Purpose | Install (Windows) | Licence |
|---|---|---|---|
| Blender 4.2 LTS or newer | Modelling, conversion to GLB | blender.org → Windows installer or Microsoft Store | GPL |
| MPFB2 (Blender extension) | CC0 human base meshes | Blender → Edit → Preferences → Get Extensions → "MPFB" | GPL (tool) / CC0 (output) |
| FBX2glTF (Godot fork) | FBX → GLB | github.com/godotengine/FBX2glTF releases → put the `.exe` on PATH | BSD |
| KTX-Software (`toktx`) | KTX2 textures | github.com/KhronosGroup/KTX-Software releases → Windows installer | Apache-2.0 |
| Mixamo | Free animations (Adobe ID) | mixamo.com | Adobe terms (check per use) |

Free CC0 asset sources: Quaternius, Kenney, Poly Haven, ambientCG. Record every asset used in `LICENSES.md`.
