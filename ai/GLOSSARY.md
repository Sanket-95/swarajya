# Glossary

| Term | Meaning |
|---|---|
| **Swarajya** | "Self-rule"; the state founded by Chhatrapati Shivaji Maharaj. Also the name of this game. |
| **Mavala** (pl. Mavale) | Soldier from the Maval region of the Sahyadri, the backbone of Shivaji Maharaj's infantry. The player is one ordinary, fictional Mavala. |
| **Sahyadri** | The Western Ghats mountain range; setting for most missions. |
| **Konkan** | The coastal strip between the Sahyadri and the Arabian Sea. |
| **Gad / Killa** | Fort (e.g. Panhalgad, Vishalgad). **Buruj** = bastion. **Darwaja** = gate. |
| **Bhagwa Dhwaj** | The saffron flag of Swarajya. Cannot be damaged or misused in the game. |
| **Pagdi / Pheta** | Turban. **Turra** = decorative crest/plume on the turban. |
| **Tilak** | Forehead mark. |
| **Shell** | The game container app: engine, systems, UI, player, NPC pool, asset system. Lives in `game/packages/shell`. |
| **Mission package** | An independently built mission (`mission.json` + `mission.js` + assets) discovered via `missions/catalog.json`. |
| **Mission SDK** | `@swarajya/sdk`: the typed `MissionContext` API, the only way a mission talks to the Shell. |
| **Catalog** | `public/missions/catalog.json` (missions) or `public/assets/catalog.json` (assets). |
| **Asset Lab** | Dev screen (Settings → Asset Lab) to inspect assets in 360° with stats and budget validation. |
| **Procedural asset** | An asset built in code by a factory, registered by key (`procedural:<factory>`). |
| **standard-human-v1** | The shared bone hierarchy all humans use (Mixamo-compatible names, no prefix). |
| **Respect tag** | One of `revered`, `ally`, `civilian`, `enemy`, `animal`, `prop`, on every entity; drives `InteractionGuard`. |
| **InteractionGuard** | System that decides whether a player action on an entity is allowed. |
| **Revered figure** | Historical personality (e.g. Shivaji Maharaj) shown only as dignified, AI-controlled, untouchable. |
| **ACTIVE / SIMPLE / DORMANT** | NPC update tiers: full AI + animation every frame / ~5 Hz AI with reduced animation / position + timer only, no mesh. |
| **ObjectPool** | Pre-allocated reusable instances; no `new` during gameplay. |
| **Quality Governor** | Steps quality down when frame time is over budget for 2 s; steps back up after 10 s of headroom. |
| **Low / Medium / High** | Quality presets. Low is the default in development. |
| **ProgressStore** | Interface for progress; `MemoryProgressStore` now (session only). |
| **leakCheck()** | Dev command `__swarajya.leakCheck()` comparing resource counts before/after a mission. |
| **Laptop A / Laptop B** | The owner's two machines. A = assets + Asset Lab; B = shell, SDK, missions, gameplay. |
| **Baseline machine** | i5 6th gen, 8 GB RAM, Intel HD 520, 128 GB SSD, Windows. |
