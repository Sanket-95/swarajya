/**
 * Minimal keyboard + mouse input (Session 1 replaces this with the full input system).
 * Click the canvas to capture the mouse (pointer lock); Esc releases it.
 * Mouse deltas are accumulated and consumed once per frame; no per-frame allocations.
 */
export class Input {
  private readonly down = new Set<string>();
  private dx = 0;
  private dy = 0;
  private wheel = 0;

  constructor(private readonly target: HTMLElement) {
    window.addEventListener("keydown", (e) => {
      this.down.add(e.code);
    });
    window.addEventListener("keyup", (e) => {
      this.down.delete(e.code);
    });
    window.addEventListener("blur", () => {
      this.down.clear();
    });
    target.addEventListener("click", () => {
      if (!this.locked) void target.requestPointerLock();
    });
    document.addEventListener("mousemove", (e) => {
      if (!this.locked) return;
      this.dx += e.movementX;
      this.dy += e.movementY;
    });
    target.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.wheel += Math.sign(e.deltaY);
      },
      { passive: false },
    );
  }

  get locked(): boolean {
    return document.pointerLockElement === this.target;
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  /** -1..1 from two keys. */
  axis(negative: string, positive: string): number {
    return (this.isDown(positive) ? 1 : 0) - (this.isDown(negative) ? 1 : 0);
  }

  /** Returns and resets accumulated mouse movement (px) and wheel steps. */
  consumeMouse(out: { dx: number; dy: number; wheel: number }): void {
    out.dx = this.dx;
    out.dy = this.dy;
    out.wheel = this.wheel;
    this.dx = 0;
    this.dy = 0;
    this.wheel = 0;
  }
}
