# missions/

Each mission is its own package (`missions/<mission-id>/` with `mission.json`, `src/index.ts`, `assets/`), built separately and discovered at runtime via `public/missions/catalog.json`.
Missions import only `three` and `@swarajya/sdk`. See `ai/prompts/new-mission.md` and `docs/tech/mission-sdk.md`. The first sample, `ch0-test-walk`, comes in Session 6.
