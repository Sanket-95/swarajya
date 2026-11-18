/**
 * Temporary third-person controller for the Mavala (pack char-mavala v1.0.0).
 * Lets the owner walk the character around before the real player system (Session 8):
 * no camera collision, no physics, flat ground only. Visual asset is used as-is (D-013).
 *
 * Controls: click to capture mouse · W A S D move · Shift run · mouse look · wheel zoom · Esc release.
 */
import {
  AnimationMixer,
  type AnimationAction,
  type AnimationClip,
  type Object3D,
  type PerspectiveCamera,
  Vector3,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Input } from "../core/input";
import { moveFromInput, turnToward, type MoveResult } from "./motion";

export const MAVALA_URL = `${import.meta.env.BASE_URL}assets/shared/characters/mavala.glb`;

const WALK_SPEED = 1.4; // m/s, matches the pack's walk clip
const RUN_SPEED = 4.5; // m/s, matches the pack's run clip
const TURN_RATE = 10; // rad/s
const FADE = 0.2; // s, animation cross-fade
const MOUSE_SENS = 0.0025; // rad per px
const PITCH_MIN = -0.25;
const PITCH_MAX = 1.1;
const DIST_MIN = 1.6;
const DIST_MAX = 8;
const LOOK_HEIGHT = 1.45; // m, camera looks at the shoulders/head

type ClipName = "idle" | "walk" | "run";

export class DevPlayer {
  private readonly mixer: AnimationMixer;
  private readonly actions: Record<ClipName, AnimationAction>;
  private current: ClipName = "idle";

  private heading = 0;
  private yaw = Math.PI; // camera starts behind the character (character faces +Z)
  private pitch = 0.25;
  private distance = 3.6;

  // Reused every frame (no per-frame allocations).
  private readonly move: MoveResult = { x: 0, z: 0, heading: 0, moving: false };
  private readonly mouse = { dx: 0, dy: 0, wheel: 0 };
  private readonly lookAt = new Vector3();

  private constructor(
    readonly root: Object3D,
    clips: Map<string, AnimationClip>,
    private readonly camera: PerspectiveCamera,
    private readonly input: Input,
  ) {
    this.mixer = new AnimationMixer(root);
    const action = (name: ClipName): AnimationAction => {
      const clip = clips.get(name);
      if (!clip) throw new Error(`Mavala GLB is missing clip "${name}"`);
      return this.mixer.clipAction(clip);
    };
    this.actions = { idle: action("idle"), walk: action("walk"), run: action("run") };
    this.actions.idle.play();
  }

  static async load(camera: PerspectiveCamera, input: Input): Promise<DevPlayer> {
    const gltf = await new GLTFLoader().loadAsync(MAVALA_URL);
    const root = gltf.scene;
    // Pack contract: show LOD0 body only; LOD1 and the elder beard are hidden by default.
    root.traverse((o) => {
      if (o.name.includes("_LOD1") || o.name.includes("Beard")) o.visible = false;
    });
    const clips = new Map(gltf.animations.map((c) => [c.name, c] as const));
    return new DevPlayer(root, clips, camera, input);
  }

  update(dt: number): void {
    const { input, move, mouse } = this;

    // Camera orbit from mouse (only while the pointer is captured) and zoom from the wheel.
    input.consumeMouse(mouse);
    this.yaw -= mouse.dx * MOUSE_SENS;
    this.pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, this.pitch + mouse.dy * MOUSE_SENS));
    this.distance = Math.min(DIST_MAX, Math.max(DIST_MIN, this.distance + mouse.wheel * 0.4));

    // Movement relative to the camera.
    const forward = input.axis("KeyS", "KeyW") || input.axis("ArrowDown", "ArrowUp");
    const right = input.axis("KeyA", "KeyD") || input.axis("ArrowLeft", "ArrowRight");
    moveFromInput(forward, right, this.yaw, move);
    const running = input.isDown("ShiftLeft") || input.isDown("ShiftRight");

    if (move.moving) {
      const speed = running ? RUN_SPEED : WALK_SPEED;
      this.root.position.x += move.x * speed * dt;
      this.root.position.z += move.z * speed * dt;
      this.heading = turnToward(this.heading, move.heading, TURN_RATE * dt);
      this.root.rotation.y = this.heading;
    }
    this.play(move.moving ? (running ? "run" : "walk") : "idle");
    this.mixer.update(dt);

    // Third-person camera.
    const p = this.root.position;
    this.lookAt.set(p.x, p.y + LOOK_HEIGHT, p.z);
    const cp = Math.cos(this.pitch);
    this.camera.position.set(
      this.lookAt.x + Math.sin(this.yaw) * cp * this.distance,
      Math.max(0.3, this.lookAt.y + Math.sin(this.pitch) * this.distance),
      this.lookAt.z + Math.cos(this.yaw) * cp * this.distance,
    );
    this.camera.lookAt(this.lookAt);
  }

  private play(next: ClipName): void {
    if (next === this.current) return;
    const from = this.actions[this.current];
    const to = this.actions[next];
    to.reset().setEffectiveWeight(1).fadeIn(FADE).play();
    from.fadeOut(FADE);
    this.current = next;
  }
}
