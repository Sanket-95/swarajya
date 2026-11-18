# Swarajya: Game Overview

> Status: draft (Session 0). Items marked `TODO(Sanket)` need the owner's input. Do not invent story to fill them.

## Vision
A browser-based, single-player, third-person 3D action-story game set in the era of **Chhatrapati Shivaji Maharaj** (17th-century Maharashtra: the Sahyadri mountains, the Konkan coast, hill forts).
The player is **one ordinary Mavala**, a soldier of Swarajya. Through his eyes the player sees the courage, discipline and sacrifice of the people who built Swarajya.

## Pillars
1. **Respect first.** History and its revered figures are presented with dignity (see `respect-guidelines.md`). These rules override every gameplay idea.
2. **Freedom within a mission.** GTA-style open movement inside each mission map: walk, run, explore, talk, follow markers, fight, and later ride horses.
3. **The land is a character.** Sahyadri ridges, monsoon clouds, laterite forts, Konkan villages.
4. **Runs everywhere.** It must be smooth on an i5 6th gen / 8 GB / Intel HD 520 laptop in a browser (see `ai/RULES.md` §1.1).
5. **Grows mission by mission.** The game is a Shell that discovers mission packages; new missions ship without rebuilding the game.
6. TODO(Sanket): any further pillar (e.g. "learn real history", "Marathi first").

## Player and world
- **Player:** a fictional Mavala. TODO(Sanket): name, home village, backstory, personal arc.
- **Allies:** the player's group of 4–6 Mavale, AI-controlled, given simple orders (Follow / Hold / Attack target / Regroup).
- **Enemies:** soldiers of the opposing army; never caricatures (political/military conflict only).
- **Civilians:** villagers with daily routines; they flee from danger and cannot be harmed by the player.
- **Animals:** horses (rideable later), cattle, birds.
- **Revered figures:** appear only as computer-controlled, dignified characters or in narrated, painting-style scenes.

## GTA-style rules, adapted to the era
| GTA idea | Swarajya version |
|---|---|
| Open movement inside a map | Same, inside each mission map (forts, ghats, villages) |
| Mission markers to start | A glowing marker (e.g. saffron light / diya) on the ground; walk in to start |
| Objectives in the HUD | Same; short, clear text, Marathi and English later |
| Minimap with markers | Same, styled as a period map |
| Vehicles | Horses only (later); no cars, no anachronisms |
| Free violence against anyone | **Not allowed.** Player weapons only affect enemies (InteractionGuard). Civilians, allies, revered figures, flags, temples and forts are untouchable. |
| Wanted level | No police. Enemy alert states instead (Patrol → Suspicious → Alert → Combat → Search → Return). |
| Failure | Fade out, neutral text, retry from checkpoint |
| Completion | Result screen; unlocks the next missions (session only, no saves yet) |

## Controls (draft)
| Action | Keyboard / mouse |
|---|---|
| Move | W A S D |
| Look / camera | Mouse (pointer lock) |
| Run (toggle) / Sprint (hold, uses stamina) | Caps Lock / Shift |
| Crouch / sneak | C or Ctrl |
| Jump | Space |
| Interact / talk | E |
| Squad orders | 1 Follow, 2 Hold, 3 Attack target, 4 Regroup |
| Attack / block (later) | Left mouse / Right mouse |
| Lock-on (later) | Middle mouse or Q |
| Mount / dismount horse (later) | F |
| Map / objectives | M / Tab |
| Pause / settings | Esc |

Gamepad support: TODO(Sanket): decide whether and when.

## Structure
- **Chapters** contain **missions**. See `chapters/` and `../missions/`.
- Chapter 0: tutorial/test missions (`ch0-test-walk`, `ch0-test-2`).
- Chapter 1: "Becoming a Mavala". TODO(Sanket): outline.
- Chapter 2: "Siege of Panhala". Historical outline in `chapters/ch2-siege-of-panhala.md`.
- Later chapters: TODO(Sanket).

## Out of scope for now
Multiplayer, database/backend, save games, monetisation. (See `ai/DECISIONS.md` D-001, D-002.)
