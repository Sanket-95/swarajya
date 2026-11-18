# Mission SDK (`@swarajya/sdk`): draft

> Draft API (Session 0). Types live in `game/packages/sdk/src/index.ts`; the implementation is built in Session 6. Version `1.0.0` will be frozen at the end of Session 6; after that, breaking changes need a major version bump.

## Defining a mission
```ts
import { defineMission } from "@swarajya/sdk";

export default defineMission({
  id: "ch0-test-walk",
  async load(ctx) {
    // request assets via ctx.assets, build the map via ctx.world
  },
  start(ctx) {
    // spawn via ctx.npc.spawn(poolKey, opts), set objectives via ctx.objectives
  },
  update(ctx, dt) {
    // optional; prefer events
  },
  async unload(ctx) {
    // nothing to free manually: ctx tracks everything it handed out
  },
});
```

## `MissionContext`
| Member | Purpose (draft) |
|---|---|
| `assets` | `load(id)`, `get(id)`. Everything is auto-tracked and released on unload. |
| `world` | Terrain, chunks, props: `loadMap(mapId)`, `addProp(assetId, transform)`. |
| `player` | Read state (position, health, stamina), `teleport(pos)`, `giveAbility(id)`. |
| `npc` | `spawn(poolKey, { position, respectTag, variant, behaviour })`, `setBehaviour(handle, follow/guard/patrol/attack/idle)`, `despawn(handle)`. |
| `objectives` | `add(id, text)`, `complete(id)`, `fail(id, reason)`, markers on the minimap; `completeMission()`, `failMission()`. |
| `dialogue` | `say(speakerId, lines)`; awaitable. |
| `cutscene` | Later (JSON timelines). |
| `events` | Typed event bus: `on(name, handler)`, `emit(name, payload)`; auto-unsubscribed on unload. |
| `progress` | `getFlag(name)`, `setFlag(name, value)` for this session (`ProgressStore`). |
| `ui` | `toast(text)`, HUD widgets. |
| `guard` | `InteractionGuard` queries: `canHit(entity)`, `canInteract(entity, action)`. |
| `time` | `now`, `delta`, `after(seconds, fn)`, `every(seconds, fn)`; auto-cleared on unload. |
| `log` | `info/warn/error`, prefixed with the mission id. |

## Manifest (`mission.json`)
id, version, sdk range, map id, asset list (preload vs streamed), NPC roster (pool keys + respect tags + counts), objectives, unlock flags set on completion, estimated download size. Validated with zod.

## Compatibility
The Shell compares the mission's `sdk` semver range with its SDK version. If they are incompatible it shows "Update required" and skips the mission without crashing.
