import { describe, expect, it } from "vitest";
import { defineMission, RESPECT_TAGS } from "./index";

const noop = () => Promise.resolve();

describe("defineMission", () => {
  it("returns the same mission object for a valid id", () => {
    const mission = { id: "ch0-test-walk", load: noop, start: () => undefined, unload: noop };
    expect(defineMission(mission)).toBe(mission);
  });

  it("rejects ids that are not kebab-case", () => {
    expect(() => defineMission({ id: "Ch0 Test", load: noop, start: () => undefined, unload: noop })).toThrow(
      /Invalid mission id/,
    );
  });
});

describe("RESPECT_TAGS", () => {
  it("contains exactly the six tags from the rules", () => {
    expect(RESPECT_TAGS).toEqual(["revered", "ally", "civilian", "enemy", "animal", "prop"]);
  });
});
