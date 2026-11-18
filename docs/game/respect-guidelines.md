# Respect Guidelines

These rules come from `ai/RULES.md` §1.3 and **override any gameplay idea**. Every mission doc must pass the content checklist in `docs/missions/_template.md`.

## 1. Revered figures
Chhatrapati Shivaji Maharaj, Rajmata Jijabai, Baji Prabhu Deshpande, Tanaji Malusare, and anyone added to this list later (add them to `docs/characters/character-bible.md` with respect tag `revered`).

- Always **computer-controlled**, never playable.
- The player **cannot attack, push, block, ride into, or interact disrespectfully** with them. Weapon hits are disabled, collision is soft (the player slides around them).
- **No ragdoll**, and no comedic, glitchy or silly animation. If an animation looks wrong, hide the character rather than ship it.
- **Dignified look only.** If a good model is not ready, show them in silhouette, at a distance, or in painting-style frames.
- Dialogue: short, respectful, consistent with history. TODO(Sanket): approve every line spoken by a revered figure.

**Examples**
| ✅ Allowed | ❌ Not allowed |
|---|---|
| Shivaji Maharaj gives the squad orders in a cutscene framed like a painting | Player can walk through or bump Shivaji Maharaj and make him stumble |
| Player kneels / bows near a revered figure (interaction "Pay respects") | Player can swing a sword at a revered figure, even with no effect shown |
| Revered figure walks with the group at a steady, upright pace | Revered figure T-poses, clips through a wall, or slides in a funny way |
| Low-detail silhouette on a ridge in the distance | A cartoonish or exaggerated face |

## 2. Death and sacrifice of revered figures
- **Never shown graphically.** Told through narration, painting-style stills, music and tribute screens.
- These scenes carry **no score, no reward, no achievement pop-up**.
- Mission failure **never shows harm** to a revered figure: fade out, neutral text ("The mission could not be completed. Try again."), retry.

**Example:** the stand at Ghod Khind ends with the player hearing the signal from Vishalgad, then a fade to a painting-style tribute with narration. No death animation is shown.

## 3. Nature of the conflict
- **Political/military only.** Never religious or community hatred.
- Enemies are "soldiers of the opposing army": no caricatured faces, accents, clothing or names. No slurs.
- Places of worship of every faith are respected: never targets, never damaged.

**Examples:** ✅ "Adilshahi soldiers guard the pass." ❌ Any dialogue that insults a religion or community.

## 4. Violence
- **No gore.** Minimal stylised hit feedback (flash, sound, stagger).
- Defeated enemies fall and fade; no dismemberment, no blood pools.
- No harm to animals as gameplay (horses can be startled, not killed by the player).

## 5. Sacred and symbolic things
- **The Bhagwa Dhwaj (flag), temples and forts cannot be damaged or misused.** Weapons do not affect them; they cannot be climbed disrespectfully (e.g. standing on a temple shikhara).
- Fort walls can be part of gameplay (climbing to infiltrate is historical), but cannot be destroyed.

## 6. Allies and civilians
- Player weapons do not affect allies or civilians (blocked by `InteractionGuard`).
- Civilians flee from danger; they are never mission targets.

## 7. History accuracy
- Facts presented as history are checked against reliable sources and the sources are listed in the chapter/mission doc.
- Unverified facts are marked `TODO(Sanket): verify` and must not ship.
- Creative content belongs to the fictional Mavala's story.

## 8. Respect tags (engine side)
Every entity has one tag: `revered | ally | civilian | enemy | animal | prop`. `InteractionGuard` decides what the player may do:

| Tag | Weapon hit | Push/collide | Talk | Special |
|---|---|---|---|---|
| revered | ❌ | soft (no push) | ✅ respectful only | Pay respects; no ragdoll |
| ally | ❌ | soft | ✅ | Squad orders |
| civilian | ❌ | soft | ✅ | Flee from danger |
| enemy | ✅ | ✅ | limited | Stylised hit feedback |
| animal | ❌ (player) | soft | — | Mount (horse, later) |
| prop | depends on prop; flags/temples/forts ❌ | ✅ | — | |
