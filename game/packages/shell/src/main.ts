import { createEmptyScene } from "./core/emptyScene";
import { FrameStats } from "./core/frameStats";
import { DEFAULT_PRESET, effectivePixelRatio, QUALITY_PRESETS } from "./core/quality";
import { createRenderer } from "./core/renderer";
import { DevOverlay } from "./ui/devOverlay";

const container = document.getElementById("app");
if (!container) throw new Error("#app container missing in index.html");

const preset = QUALITY_PRESETS[DEFAULT_PRESET];
const renderer = createRenderer(container, preset);
const { scene, camera } = createEmptyScene(
  preset,
  container.clientWidth / Math.max(1, container.clientHeight),
);
const stats = new FrameStats();
const overlay = import.meta.env.DEV ? new DevOverlay(document.body, renderer, preset) : null;

function onResize(): void {
  if (!container) return;
  const w = container.clientWidth;
  const h = Math.max(1, container.clientHeight);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(effectivePixelRatio(window.devicePixelRatio, preset));
  renderer.setSize(w, h);
}
window.addEventListener("resize", onResize);

// Shaders are compiled before the first frame (no first-frame spike).
await renderer.compileAsync(scene, camera);

function frame(time: number): void {
  renderer.render(scene, camera);
  if (stats.tick(time)) overlay?.update(stats);
}
renderer.setAnimationLoop(frame);

// Dev-only console handle (Session 1 adds leakCheck() here).
if (import.meta.env.DEV) {
  Object.assign(window, {
    __swarajya: {
      renderer,
      scene,
      camera,
      pause: () => {
        renderer.setAnimationLoop(null);
      },
      resume: () => {
        renderer.setAnimationLoop(frame);
      },
    },
  });
}
