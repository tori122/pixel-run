import { CANVAS_WIDTH, GROUND_Y } from './config.js';

export class Ground {
  constructor() {
    this.segments = [];
    this.offset = 0;
    // Generate ground bumps
    for (let i = 0; i < CANVAS_WIDTH + 40; i += 2) {
      this.segments.push(Math.random() < 0.15 ? 1 : 0);
    }
  }

  update(speed) {
    this.offset += speed;
    while (this.offset >= 2) {
      this.offset -= 2;
      this.segments.shift();
      this.segments.push(Math.random() < 0.15 ? 1 : 0);
    }
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    // Main ground line
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 1);
    // Bumps
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i]) {
        const bx = i * 2 - this.offset;
        if (bx >= 0 && bx < CANVAS_WIDTH) {
          ctx.fillRect(bx, GROUND_Y + 2 + Math.floor(Math.random() * 3), 1, 1);
        }
      }
    }
  }
}
