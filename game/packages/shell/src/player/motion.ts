/** Pure movement helpers for the third-person controller (unit-tested). */

const TWO_PI = Math.PI * 2;

/** Wrap an angle to (-PI, PI]. */
export function wrapAngle(a: number): number {
  let r = a % TWO_PI;
  if (r <= -Math.PI) r += TWO_PI;
  else if (r > Math.PI) r -= TWO_PI;
  return r;
}

/** Turn `current` toward `target` along the shortest arc, by at most `maxStep` radians. */
export function turnToward(current: number, target: number, maxStep: number): number {
  const diff = wrapAngle(target - current);
  if (Math.abs(diff) <= maxStep) return wrapAngle(target);
  return wrapAngle(current + Math.sign(diff) * maxStep);
}

export interface MoveResult {
  /** World-space direction (unit length, or 0 when idle). */
  x: number;
  z: number;
  /** Facing angle for a model that faces +Z at rotation.y = 0. */
  heading: number;
  moving: boolean;
}

/**
 * Converts input axes into a world direction relative to the camera yaw.
 * Camera orbit convention: camera sits at target + (sin(yaw), _, cos(yaw)) * distance,
 * so "forward" (away from the camera) is (-sin(yaw), 0, -cos(yaw)).
 */
export function moveFromInput(
  forward: number,
  right: number,
  cameraYaw: number,
  out: MoveResult,
): MoveResult {
  const s = Math.sin(cameraYaw);
  const c = Math.cos(cameraYaw);
  let x = -s * forward + c * right;
  let z = -c * forward - s * right;
  const len = Math.hypot(x, z);
  out.moving = len > 1e-6;
  if (out.moving) {
    x /= len;
    z /= len;
    out.heading = Math.atan2(x, z);
  }
  out.x = out.moving ? x : 0;
  out.z = out.moving ? z : 0;
  return out;
}
