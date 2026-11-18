# Swarajya

A browser-based, single-player, third-person 3D action-story game set in the era of **Chhatrapati Shivaji Maharaj** (17th-century Maharashtra: the Sahyadri mountains, the Konkan coast, hill forts). You play one ordinary **Mavala**, a soldier of Swarajya.

Built with TypeScript and three.js. It must run smoothly on an i5 6th gen / 8 GB / Intel HD 520 laptop in Chrome or Edge.

## Run it (Windows, macOS, Linux)
Requirements: Node.js 24 LTS, pnpm (`npm i -g pnpm`).
```
cd game
pnpm i
pnpm dev        # http://localhost:5173 — empty scene + dev overlay (F3 toggles)
```
Other commands (in `game/`): `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm format`.

## Repo map
| Path | What |
|---|---|
| `ai/` | Instructions + shared memory for AI coding agents. **Start at `ai/README.md`.** |
| `docs/` | Game, mission, character, asset and technical documentation |
| `game/` | pnpm workspace: `packages/sdk` (Mission SDK), `packages/shell` (the game), `missions/`, `tools/`, `public/` |
| `SETUP_PROMPT.md` | Master plan: rules, system specs and the session-by-session build plan |

## Status
See `ai/STATUS.md`. Current phase: Session 0 (bootstrap) done; next is Session 1 (core engine).

## Respect
This game treats history and its revered figures with dignity. See `docs/game/respect-guidelines.md`.
