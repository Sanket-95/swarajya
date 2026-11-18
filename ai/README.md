# ai/ — start here (any AI model, any laptop)

This folder is the **shared memory** of the Swarajya project. Two laptops and several AI models work on this repo.
Every session must leave this folder accurate, so the next model can continue with zero verbal explanation.

## Reading order (every session)
1. `ai/README.md` (this file)
2. `ai/RULES.md`: the non-negotiable rules (performance, architecture, respect, repo). Never weaken them.
3. `ai/STATUS.md`: current phase, what works, the single next task.
4. `ai/HISTORY.md`: read the top 3 entries only (newest on top).
5. `ai/HANDOFF.md`: open requests between Laptop A, Laptop B and the chat planner.
6. `git log --oneline -15`
7. `SETUP_PROMPT.md`: only the section for the session you are executing (section 7 lists the sessions).

Look things up in `ai/GLOSSARY.md` and `ai/DECISIONS.md` when needed; don't read them end-to-end every time.

## How to work
- **One session = one module/task.** Read only the files that task needs.
- Use the prompts in `ai/prompts/` (`session-start.md`, `session-end.md`, `new-asset.md`, `new-character-from-images.md`, `new-mission.md`).
- If something is ambiguous, pick the **simpler, faster** option and record it in `DECISIONS.md`.
- Never invent historical facts: write `TODO(Sanket): verify`.
- If a rule blocks you, stop and write the blocker in `HANDOFF.md`. Do not bend the rule.
- Commits are small and prefixed: `shell:`, `sdk:`, `mission(<id>):`, `assets:`, `lab:`, `tools:`, `docs:`, `ai:`.

## Session ritual
- **Start:** `ai/prompts/session-start.md`
- **End:** `ai/prompts/session-end.md` (lint/typecheck/test → STATUS → HISTORY → DECISIONS → HANDOFF → commit → push → 5-line summary).

## Where things are
| Path | What |
|---|---|
| `ai/` | AI instructions + shared memory |
| `docs/` | Game, mission, character, asset and tech documentation |
| `game/` | pnpm workspace: `packages/sdk`, `packages/shell`, `missions/`, `tools/`, `public/` |
| `SETUP_PROMPT.md` | Master plan: rules, specs, session plan |

## Commands (run inside `game/`)
| Command | What |
|---|---|
| `pnpm i` | Install |
| `pnpm dev` | Shell dev server (http://localhost:5173) |
| `pnpm build` | Production build of the Shell |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | Quality gates |
| `pnpm format` | Prettier write |
