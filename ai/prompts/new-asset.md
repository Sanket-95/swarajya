# Prompt: integrate an asset pack (Claude Code)

> **D-013:** assets are designed in the claude.ai browser chat and arrive as packs. Claude Code **integrates, never re-models**.

Task: integrate pack `game/assets-incoming/<pack-name>/`. Follow `docs/assets/browser-asset-handoff.md`:
1. **Validate**: required files, zod schemas, standard rig bone names (humans), budgets in `docs/assets/budgets.md`, respect tags, licences.
2. **Optimise** the GLBs with gltf-transform (meshopt + KTX2/WebP) → `game/public/assets/shared/<class>/`.
3. **Factories**: put any `.ts` factory in `game/packages/shell/src/assets/<class>/` and register it (mechanical fixes only).
4. **Catalog**: merge `catalog-entries.json` into `game/public/assets/catalog.json`; run `tools/validate-catalogs`.
5. **Asset Lab**: budget green, clips play, matches `preview.png`. Then delete the pack folder from `assets-incoming/`.
6. Third-party content → `docs/assets/LICENSES.md`. Log in `ai/HISTORY.md`; commit `assets: import pack <pack-name>`.
Something wrong? Don't fix the design. Add `- [ ] <date> console → browser-chat: <what to fix>` to `ai/HANDOFF.md` and skip that asset.
