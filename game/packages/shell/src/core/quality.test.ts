import { describe, expect, it } from "vitest";
import { DEFAULT_PRESET, effectivePixelRatio, QUALITY_PRESETS } from "./quality";

describe("quality presets", () => {
  it("defaults to Low in development", () => {
    expect(DEFAULT_PRESET).toBe("low");
  });

  it("caps pixel ratio at 1.0 on Low and 1.5 on Medium/High", () => {
    expect(effectivePixelRatio(2, QUALITY_PRESETS.low)).toBe(1);
    expect(effectivePixelRatio(2, QUALITY_PRESETS.medium)).toBe(1.5);
    expect(effectivePixelRatio(3, QUALITY_PRESETS.high)).toBe(1.5);
    expect(effectivePixelRatio(1, QUALITY_PRESETS.high)).toBe(1);
  });

  it("falls back to 1 for invalid device pixel ratios", () => {
    expect(effectivePixelRatio(Number.NaN, QUALITY_PRESETS.medium)).toBe(1);
    expect(effectivePixelRatio(0, QUALITY_PRESETS.medium)).toBe(1);
  });

  it("keeps Low within the NPC budgets", () => {
    expect(QUALITY_PRESETS.low.maxActiveNpcs).toBeLessThanOrEqual(12);
    expect(QUALITY_PRESETS.low.maxSimpleNpcs).toBeLessThanOrEqual(40);
    expect(QUALITY_PRESETS.low.shadowMapSize).toBeLessThanOrEqual(512);
  });
});
