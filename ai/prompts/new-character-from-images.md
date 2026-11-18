# Prompt: new character from reference images

> **D-013:** characters are designed in the **claude.ai browser chat** (Swarajya project), not in Claude Code. This prompt is for the **browser chat**. Claude Code integrates the resulting pack with `ai/prompts/new-asset.md`.

Task (browser chat): design character `<character-id>` from the images in `docs/characters/references/<character-id>/` and deliver a pack per `docs/assets/browser-asset-handoff.md`.
1. Look at every image (front/side/back). Write or extend the entry in `docs/characters/character-bible.md`: proportions, palette (hex), outfit parts, accessories, respect tag.
2. Model it on `standard-human-v1` bones (`docs/assets/standard-rig.md`), using the shared palette and the human budget (LOD0 ≤ 3k tris, LOD1 ≤ 1k). Provide variants.
3. Style: stylised low-poly with a detailed face (eyes, brows, nose, curled Maratha moustache, tilak, pagdi with gold turra).
4. Revered figure? Extra review; dignified, never cartoonish. If it isn't good enough, use silhouette, distance or painting-style frames instead.
5. Export the pack: `*.glb`, optional `*.ts` factory, `assets.config.json`, `catalog-entries.json`, `preview.png`, `README.md`.
