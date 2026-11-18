import { describe, expect, it } from "vitest";
import { FrameStats } from "./frameStats";

describe("FrameStats", () => {
  it("publishes averages after the sample window", () => {
    const stats = new FrameStats(500);
    let published = false;
    // 60 FPS ≈ 16.667 ms per frame for a little over 500 ms.
    for (let i = 0; i <= 31; i++) published = stats.tick(i * (1000 / 60)) || published;
    expect(published).toBe(true);
    expect(stats.fps).toBeCloseTo(60, 0);
    expect(stats.frameMs).toBeCloseTo(16.67, 1);
  });

  it("tracks the worst frame in the window", () => {
    const stats = new FrameStats(100);
    stats.tick(0);
    stats.tick(16);
    stats.tick(66); // 50 ms spike
    stats.tick(82);
    stats.tick(120);
    expect(stats.worstMs).toBe(50);
  });

  it("does not publish before the window is full", () => {
    const stats = new FrameStats(500);
    expect(stats.tick(0)).toBe(false);
    expect(stats.tick(16)).toBe(false);
    expect(stats.fps).toBe(0);
  });
});
