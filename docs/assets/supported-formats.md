# Supported Formats

## Runtime (gameplay): GLB only
| Format | Notes |
|---|---|
| `.glb` | glTF 2.0 binary. Geometry may use **meshopt** (preferred) or **Draco** compression. |
| Textures | **KTX2 (Basis Universal)** preferred; **WebP** fallback. ≤ 512 px for characters on Low; atlases preferred; many assets use vertex colours only. |
| Procedural | Code-built assets registered by key (`source: "procedural:<factory>"`). |

Decoders (meshopt, Draco, Basis) are served from `game/public/vendor/` (Session 2).

## Asset Lab only (lazy-loaded; must never enter the gameplay bundle)
| Format | Loader | Notes |
|---|---|---|
| `.glb` / `.gltf` (+ `.bin`, textures) | GLTFLoader | Drop all files together for `.gltf` |
| `.fbx` | FBXLoader | Mixamo animations, many store assets |
| `.obj` (+ `.mtl`) | OBJLoader + MTLLoader | Static meshes |
| `.dae` | ColladaLoader | Older assets |
| `.stl` | STLLoader | Geometry only |
| `.ply` | PLYLoader | Scans / point data |
| `.vrm` | `@pixiv/three-vrm` | Optional; only if still maintained at install time |

## Converting to runtime format
- FBX / OBJ / DAE → **Blender** (File → Export → glTF 2.0, GLB) or **FBX2glTF** → GLB.
- GLB → `gltf-transform optimize` (meshopt + KTX2/WebP) → `game/public/assets/...` → entry in `assets/catalog.json`.
- Script (Session 2): `pnpm asset:import <file> --id <assetId> --class character|prop|building|nature|horse`.

See `pipeline.md` for the full flow.
