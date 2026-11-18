# Standard Rig: `standard-human-v1`

One bone hierarchy with fixed names shared by every human. Names are **Mixamo-compatible without the `mixamorig:` prefix**, so Mixamo clips can be retargeted by stripping the prefix.

Procedural characters **rigid-bind** their parts (each mesh is parented to one bone). Later, skinned Blender/MPFB2 models use the same names, so every animation clip works on both without code changes (D-007).

## Hierarchy
```
Hips
├── Spine
│   └── Spine1
│       └── Spine2
│           ├── Neck
│           │   └── Head
│           ├── LeftShoulder
│           │   └── LeftArm
│           │       └── LeftForeArm
│           │           └── LeftHand
│           └── RightShoulder
│               └── RightArm
│                   └── RightForeArm
│                       └── RightHand
├── LeftUpLeg
│   └── LeftLeg
│       └── LeftFoot
│           └── LeftToeBase
└── RightUpLeg
    └── RightLeg
        └── RightFoot
            └── RightToeBase
```

## Conventions
- Units: metres. Up: +Y. Character faces **+Z**. Origin at the feet, between them.
- Reference height: 1.75 m (Asset Lab scale reference).
- Rest pose: T-pose or A-pose (TODO: fix one in Session 4 and record the decision).
- Hand/finger bones are not in v1. If they are added later, it becomes `standard-human-v2`.
- Optional attachment points (Session 4): `Weapon_R`, `Weapon_L`, `Shield_Back`, `Sword_Hip` as child empties.

Status: specification only. The bone factory is built in Session 4.
