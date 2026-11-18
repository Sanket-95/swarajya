import type { WebGLRenderer } from "three";
import type { FrameStats } from "../core/frameStats";
import type { QualityPreset } from "../core/quality";

interface ChromeMemory {
  usedJSHeapSize: number;
}

function heapMb(): string {
  const memory = (performance as Performance & { memory?: ChromeMemory }).memory;
  return memory ? (memory.usedJSHeapSize / 1048576).toFixed(1) : "n/a";
}

/**
 * Dev overlay: FPS, frame ms, draw calls, triangles, geometries, textures, JS heap.
 * Updated only when FrameStats publishes (2 Hz), so the per-frame path stays allocation-free.
 * Toggle with F3.
 */
export class DevOverlay {
  private readonly el: HTMLPreElement;
  private visible = true;

  constructor(
    parent: HTMLElement,
    private readonly renderer: WebGLRenderer,
    private readonly preset: QualityPreset,
  ) {
    this.el = document.createElement("pre");
    this.el.setAttribute("aria-label", "Developer performance overlay");
    Object.assign(this.el.style, {
      position: "fixed",
      top: "8px",
      left: "8px",
      margin: "0",
      padding: "6px 8px",
      font: "12px/1.35 ui-monospace, Consolas, monospace",
      color: "#e8f5e0",
      background: "rgba(0, 0, 0, 0.6)",
      borderRadius: "4px",
      pointerEvents: "none",
      zIndex: "10",
      whiteSpace: "pre",
    });
    parent.appendChild(this.el);
    window.addEventListener("keydown", (e) => {
      if (e.code === "F3") {
        e.preventDefault();
        this.visible = !this.visible;
        this.el.style.display = this.visible ? "block" : "none";
      }
    });
  }

  /** Call right after `renderer.render` on frames where `stats.tick` returned true. */
  update(stats: FrameStats): void {
    if (!this.visible) return;
    const { render, memory } = this.renderer.info;
    this.el.textContent =
      `FPS   ${stats.fps.toFixed(0)}\n` +
      `ms    ${stats.frameMs.toFixed(2)} (worst ${stats.worstMs.toFixed(1)})\n` +
      `calls ${render.calls}\n` +
      `tris  ${render.triangles}\n` +
      `geo   ${memory.geometries}\n` +
      `tex   ${memory.textures}\n` +
      `heap  ${heapMb()} MB\n` +
      `preset ${this.preset.label}`;
  }
}
