import { WebGLRenderer } from "three";
import { effectivePixelRatio, type QualityPreset } from "./quality";

/** WebGL2 renderer configured from a quality preset (D-004). */
export function createRenderer(container: HTMLElement, preset: QualityPreset): WebGLRenderer {
  const renderer = new WebGLRenderer({
    antialias: preset.antialias,
    powerPreference: "high-performance",
    stencil: false,
  });
  renderer.setPixelRatio(effectivePixelRatio(window.devicePixelRatio, preset));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = preset.shadowMapSize > 0;
  container.appendChild(renderer.domElement);
  return renderer;
}
