/**
 * Quality presets (SETUP_PROMPT.md §1.1). Session 0 only uses the renderer-level settings;
 * the Adaptive Quality Governor (Session 1) steps between these presets at runtime.
 */
export type QualityPresetId = "low" | "medium" | "high";

export interface QualityPreset {
  readonly id: QualityPresetId;
  readonly label: string;
  /** Upper bound for renderer pixel ratio (1.0 on Low, 1.5 on Medium/High). */
  readonly maxPixelRatio: number;
  /** Multiplier on canvas size before the pixel ratio is applied. */
  readonly renderScale: number;
  readonly antialias: boolean;
  /** 0 disables shadows. */
  readonly shadowMapSize: number;
  /** Camera far plane / distance culling, in metres. */
  readonly viewDistance: number;
  readonly maxActiveNpcs: number;
  readonly maxSimpleNpcs: number;
}

export const QUALITY_PRESETS: Readonly<Record<QualityPresetId, QualityPreset>> = {
  low: {
    id: "low",
    label: "Low",
    maxPixelRatio: 1.0,
    renderScale: 1.0,
    antialias: false,
    shadowMapSize: 0,
    viewDistance: 250,
    maxActiveNpcs: 12,
    maxSimpleNpcs: 40,
  },
  medium: {
    id: "medium",
    label: "Medium",
    maxPixelRatio: 1.5,
    renderScale: 1.0,
    antialias: true,
    shadowMapSize: 1024,
    viewDistance: 450,
    maxActiveNpcs: 16,
    maxSimpleNpcs: 60,
  },
  high: {
    id: "high",
    label: "High",
    maxPixelRatio: 1.5,
    renderScale: 1.0,
    antialias: true,
    shadowMapSize: 2048,
    viewDistance: 700,
    maxActiveNpcs: 24,
    maxSimpleNpcs: 80,
  },
};

/** Low is the default in development (D-005). */
export const DEFAULT_PRESET: QualityPresetId = "low";

export function effectivePixelRatio(devicePixelRatio: number, preset: QualityPreset): number {
  const dpr = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  return Math.min(dpr, preset.maxPixelRatio) * preset.renderScale;
}
