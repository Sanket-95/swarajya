# History (append-only, newest on top)

## 2026-11-18 23:58 — laptop A — Claude Opus 5.5 — Session 0: Bootstrap repo, memory and docs
Did: Cloned the empty repo; added SETUP_PROMPT.md; created the §2 layout; wrote all `ai/` files (RULES = §1 verbatim, DECISIONS D-001…D-012, GLOSSARY, prompts); wrote `docs/` (overview, world-story, respect guidelines, ch2 Panhala outline marked verify, mission template, character bible, asset + tech docs); created the pnpm workspace (TS 6.0 strict, ESLint 10 + typescript-eslint, Prettier, Vitest) with an SDK types stub and a Shell rendering an empty scene + dev overlay on Low. Checked versions with `npm view`; vitest pinned to 5.1.0 because 5.1.1 was released the same day and tripped pnpm's minimum-release-age check.
Files: CLAUDE.md, AGENTS.md, README.md, .gitattributes, .gitignore, ai/*, docs/**, game/** (see commits)
Commits: 45eae2d, b22fa29, 246bece, da6481c, + this ai: commit
Decisions: D-011 (TypeScript 6.0.x for typescript-eslint compatibility), D-012 (pnpm via `npm i -g`, corepack EPERM)
Perf: HD 520, Chrome, Low: 60 FPS (vsync), 16.7 ms/frame, render 0.06 ms, 1 call, 2 tris, heap 14 MB, heap stable over 10 s (+0.5 MB, GC noise).
Next: Session 1 (core engine), see STATUS.md "Next task".
