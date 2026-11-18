import { describe, expect, it } from "vitest";
import { moveFromInput, turnToward, wrapAngle, type MoveResult } from "./motion";

const out = (): MoveResult => ({ x: 0, z: 0, heading: 0, moving: false });

describe("wrapAngle", () => {
  it("wraps into (-PI, PI]", () => {
    expect(wrapAngle(3 * Math.PI)).toBeCloseTo(Math.PI);
    expect(wrapAngle(-3 * Math.PI)).toBeCloseTo(Math.PI);
    expect(wrapAngle(0.5)).toBeCloseTo(0.5);
  });
});

describe("turnToward", () => {
  it("takes the shortest arc across ±PI", () => {
    const r = turnToward(Math.PI - 0.1, -Math.PI + 0.1, 0.05);
    expect(r).toBeCloseTo(Math.PI - 0.05);
  });
  it("snaps when within one step", () => {
    expect(turnToward(0, 0.02, 0.05)).toBeCloseTo(0.02);
  });
});

describe("moveFromInput", () => {
  it("W moves away from the camera (camera behind at yaw = PI → +Z)", () => {
    const r = moveFromInput(1, 0, Math.PI, out());
    expect(r.moving).toBe(true);
    expect(r.x).toBeCloseTo(0);
    expect(r.z).toBeCloseTo(1);
    expect(r.heading).toBeCloseTo(0);
  });
  it("D moves to the camera's right", () => {
    const r = moveFromInput(0, 1, 0, out()); // camera at +Z looking -Z → right is +X
    expect(r.x).toBeCloseTo(1);
    expect(r.z).toBeCloseTo(0);
  });
  it("diagonals are normalised", () => {
    const r = moveFromInput(1, 1, 0.3, out());
    expect(Math.hypot(r.x, r.z)).toBeCloseTo(1);
  });
  it("no input → not moving", () => {
    expect(moveFromInput(0, 0, 1, out()).moving).toBe(false);
  });
});
