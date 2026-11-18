/**
 * Allocation-free frame statistics. `tick` runs every frame and only does arithmetic;
 * averages are published at a fixed interval so the overlay can update the DOM rarely.
 */
export class FrameStats {
  fps = 0;
  frameMs = 0;
  /** Worst single frame (ms) during the last sample window. */
  worstMs = 0;

  private frames = 0;
  private windowStart = -1;
  private last = -1;
  private windowWorst = 0;

  constructor(private readonly sampleWindowMs = 500) {}

  /** Call once per frame with a monotonic timestamp in ms. Returns true when new averages were published. */
  tick(nowMs: number): boolean {
    if (this.last < 0) {
      this.last = nowMs;
      this.windowStart = nowMs;
      return false;
    }
    const dt = nowMs - this.last;
    this.last = nowMs;
    this.frames++;
    if (dt > this.windowWorst) this.windowWorst = dt;

    const elapsed = nowMs - this.windowStart;
    if (elapsed < this.sampleWindowMs) return false;

    this.fps = (this.frames * 1000) / elapsed;
    this.frameMs = elapsed / this.frames;
    this.worstMs = this.windowWorst;
    this.frames = 0;
    this.windowWorst = 0;
    this.windowStart = nowMs;
    return true;
  }
}
