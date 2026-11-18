# Prompt: new character from reference images

Task: build character `<character-id>` from the images in `docs/characters/references/<character-id>/`.
1. Look at every image (front/side/back). Write or extend the entry in `docs/characters/character-bible.md`: proportions, palette (hex), outfit parts, accessories, respect tag.
2. Build a procedural factory `game/packages/shell/src/assets/characters/<id>.ts`, rigid-bound to `standard-human-v1` bones, using the shared palette and the human budget (LOD0 ≤ 3k tris, LOD1 ≤ 1k). Provide variants.
3. Style: stylised low-poly with a detailed face (eyes, brows, nose, curled Maratha moustache, tilak, pagdi with gold turra).
4. Revered figure? Extra review; dignified, never cartoonish. If it isn't good enough, use silhouette, distance or painting-style frames instead.
5. Register in `game/public/assets/catalog.json`; check in the Asset Lab (budget green); export the GLB to `game/public/assets/shared/characters/`.
6. Log in `ai/HISTORY.md`; decisions in `ai/DECISIONS.md`. Commit `assets: add character <id>`.
