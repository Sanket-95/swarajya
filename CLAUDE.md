# Swarajya — read me first
1. Read ai/README.md, ai/RULES.md, ai/STATUS.md, top 3 entries of ai/HISTORY.md, open items in ai/HANDOFF.md.
2. Run `git log --oneline -15`.
3. Work on ONE task. Read only files that task needs.
4. Before ending: run session-end ritual (ai/prompts/session-end.md).
Top rules: no lag (visible-only rendering, pooling, no per-frame allocations, time-sliced loading),
Shell/Mission isolation via SDK, all interactions through InteractionGuard, revered figures AI-only & dignified,
no DB/saves yet (MemoryProgressStore), TypeScript strict, current stable libs, small prefixed commits.
3D assets come from browser-chat packs (docs/assets/browser-asset-handoff.md) — integrate, don't re-model.
