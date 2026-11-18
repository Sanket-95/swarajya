import { DirectionalLight, GridHelper } from "three";
import { createEmptyScene } from "./core/emptyScene";
import { FrameStats } from "./core/frameStats";
import { Input } from "./core/input";
import { DEFAULT_PRESET, effectivePixelRatio, QUALITY_PRESETS } from "./core/quality";
import { createRenderer } from "./core/renderer";
import { DevPlayer } from "./player/devPlayer";
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
const input = new Input(renderer.domElement);

// Test-ground helpers: a sun for shape (no shadows on Low) and a 1 m grid to see movement.
const sun = new DirectionalLight(0xfff1dc, 1.6);
sun.position.set(30, 50, 20);
scene.add(sun);
const grid = new GridHelper(200, 200, 0x55603a, 0x6c7a45);
grid.position.y = 0.002;
scene.add(grid);

// The Mavala (pack char-mavala v1.0.0), controlled by the temporary dev controller.
const player = await DevPlayer.load(camera, input);
scene.add(player.root);

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

const MAX_DT = 0.1; // s; Session 1 replaces this with a fixed-step loop
let last = -1;
function frame(time: number): void {
  const dt = last < 0 ? 0 : Math.min(MAX_DT, (time - last) / 1000);
  last = time;
  player.update(dt);
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
      player,
      pause: () => {
        renderer.setAnimationLoop(null);
        last = -1;
      },
      resume: () => {
        renderer.setAnimationLoop(frame);
      },
    },
  });
}
