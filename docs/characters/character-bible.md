# Character Bible

Every character: role, respect tag, look, palette, rig, status. Reference images go in `references/<character-id>/` (see `ai/prompts/new-character-from-images.md`).
Style: **stylised low-poly with a detailed face** (eyes, brows, nose, curled Maratha moustache, tilak, pagdi with gold turra). Budgets: LOD0 ≤ 3k tris, LOD1 ≤ 1k (humans); horse LOD0 ≤ 2.5k. All humans use rig `standard-human-v1`.

Palette hex values below are **starting proposals** and will move into the shared `materials.ts` palette in Session 2. TODO(Sanket): confirm or replace from reference images.

| Palette key | Hex | Use |
|---|---|---|
| cloth.cream | `#EDE3CC` | angarkha, dhoti |
| cloth.saffron | `#E8781E` | pagdi, flags |
| cloth.red-sash | `#A8232B` | kamarbandh (waist sash) |
| metal.gold | `#C9A13B` | turra, trims |
| metal.steel | `#8C9297` | blades, shield bosses |
| leather.brown | `#6B4426` | belts, shield, footwear |
| skin.medium | `#A86B48` | skin (variant) |
| skin.dark | `#7A4A30` | skin (variant) |
| skin.light | `#C58A62` | skin (variant) |
| hair.black | `#1E1A18` | hair, moustache |
| cloth.enemy-green | `#3E5B45` | opposing army (proposal; neutral, no religious symbolism) |
| cloth.enemy-white | `#DCD8CF` | opposing army |

---

## mavala (player): `char.mavala.base`
- **Role:** the player; an ordinary fictional Mavala soldier. **Respect tag:** `ally` (player entity).
- **Look:** lean, strong hill farmer-soldier; ~1.70 m. Saffron or cream pagdi with gold turra, cream angarkha / short tunic, red waist sash, knee-length dhoti or tight trousers, leather footwear. Curled moustache, tilak. Sword (talwar) at the waist, round leather shield (dhal) on the back; later bow, spear.
- **Variants:** `mavala.default`, `mavala.red-sash`, `mavala.elder`.
- **Rig:** standard-human-v1. **Status:** not started (Session 4). TODO(Sanket): reference images.

## ally soldier: `char.ally-soldier`
- **Role:** members of the player's squad and other Mavale. **Respect tag:** `ally`.
- **Look:** variants of the Mavala body: different pagdi colours, beards/moustaches, weapons (spear, bow, sword).
- **Status:** not started (Session 5).

## enemy soldier: `char.enemy-soldier`
- **Role:** soldiers of the opposing army. **Respect tag:** `enemy`.
- **Look:** period-plausible armour/clothing of the opposing army (e.g. quilted coat, helmet or turban, shield, sword or matchlock). **No caricature:** normal faces, dignified clothing, no religious symbols used as "enemy markers".
- **Status:** not started (Session 5). TODO(Sanket): reference images / research.

## villager (male): `char.villager-m`
- **Role:** civilian. **Respect tag:** `civilian`.
- **Look:** farmer: dhoti, simple shirt or bare-chested with a cloth, pheta/topi, sometimes a stick or tool.
- **Status:** not started (Session 5).

## villager (female): `char.villager-f`
- **Role:** civilian. **Respect tag:** `civilian`.
- **Look:** nauvari (nine-yard) saree, simple jewellery, hair in a bun; carries a pot or basket in some variants.
- **Status:** not started (Session 5).

## horse: `char.horse`
- **Role:** animal; rideable later. **Respect tag:** `animal`.
- **Look:** local horse breed proportions (TODO(Sanket): verify, e.g. Deccani/Bhimthadi), brown/black/white variants, simple saddle and bridle.
- **Rig:** horse rig (to be defined). **Budget:** LOD0 ≤ 2.5k. Clips: idle, walk (Session 5).
- **Status:** not started (Session 5).

---

## Revered figures (presentation rules only)
These characters are **not designed yet**. Rules from `docs/game/respect-guidelines.md` apply:
- Respect tag `revered`; always AI-controlled, never playable; untouchable (weapons disabled, soft collision); no ragdoll; no comedic or glitchy animation.
- Dignified look only. Until a model passes review, show them in **silhouette, at a distance, or in painting-style frames**.
- Every design and every spoken line needs the owner's review.

| Id | Name | Notes |
|---|---|---|
| `char.revered.shivaji-maharaj` | Chhatrapati Shivaji Maharaj | TODO(Sanket): reference portraits, approved look |
| `char.revered.jijabai` | Rajmata Jijabai | TODO(Sanket) |
| `char.revered.baji-prabhu` | Baji Prabhu Deshpande | TODO(Sanket) |
| `char.revered.tanaji` | Tanaji Malusare | TODO(Sanket) |
| `char.revered.shiva-kashid` | Shiva Kashid (proposed for the list) | TODO(Sanket): confirm adding him as revered |
