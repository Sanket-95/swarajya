# Mission: <title> (`<mission-id>`)

| Field | Value |
|---|---|
| id | `<mission-id>` (kebab-case, e.g. `ch2-ghod-khind`) |
| chapter | `<n>` |
| type | main / side / tutorial / tribute |
| version | `1.0.0` |
| sdk range | `^1.0.0` |
| status | draft / in progress / playable / final |
| owner (laptop) | A / B |

## Summary
2–4 sentences: what happens, what the player does, why it matters.

## History vs fiction note
| Element | History (source) or fiction |
|---|---|
| … | … |
Unverified facts: `TODO(Sanket): verify`.

## Map
- Map id: `<map-id>`; size (m); terrain type (ghat / fort / village / coast / forest).
- Key locations: start marker, objectives, checkpoints.
- Time of day / weather; lighting preset.
- Streaming chunks and view distance on Low.

## Objectives
1. `<objective-id>`: text (en) / text (mr): completion condition: marker.
2. …
Optional objectives: …

## NPC roster
| Pool key | Role | Respect tag | Count | Behaviour | Tier notes |
|---|---|---|---|---|---|
| `npc.mavala` | ally squad | ally | 4 | follow | ACTIVE when near |
| `npc.enemy-soldier` | patrol | enemy | 10 | patrol → combat | ≤ 12 ACTIVE total |
| … | | | | | |

## Fail and retry
- Fail conditions: …
- Checkpoints: …
- On fail: fade → neutral text → retry from checkpoint. Never show harm to a revered figure.

## Unlock requirements
- `requires`: [ids of missions that must be completed]
- Flags set on completion: [`flag.name`, …]

## Assets
| Asset id | Shared or mission-only | Preload or streamed | Size |
|---|---|---|---|
Estimated package size: … MB (budget < 25 MB).

## Budgets (Low preset target)
| Metric | Budget | Measured |
|---|---|---|
| FPS | ≥ 30 | |
| Draw calls | < 120 | |
| Visible tris | < 200k | |
| ACTIVE / SIMPLE NPCs | ≤ 12 / ≤ 40 | |
| JS heap | < 250 MB | |

## Content checklist (must all be ✅ before "final")
- [ ] Revered figures are AI-only, untouchable (InteractionGuard), dignified, no ragdoll, no silly animation.
- [ ] No graphic death/sacrifice of revered figures; tribute scenes carry no score or reward.
- [ ] Failure never shows harm to a revered figure; neutral fade + retry.
- [ ] Conflict is political/military only; enemies are not caricatures; no religious/community hatred.
- [ ] No gore.
- [ ] Flags, temples and forts cannot be damaged or misused.
- [ ] Allies and civilians unaffected by player weapons.
- [ ] Every fact presented as history has a source listed; no `TODO(Sanket): verify` left.
- [ ] Every entity has a respect tag.
- [ ] Owner (Sanket) has reviewed all lines spoken by revered figures.

## Sources
- …
