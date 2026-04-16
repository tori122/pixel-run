import { viewport } from './config.js';
import { spriteLoader } from './SpriteLoader.js';

export class Ground {
  constructor() {
    this.segments = [];
    this.offset = 0;
    // Generate ground bumps (placeholder fallback)
    for (let i = 0; i < viewport.width + 40; i += 2) {
      this.segments.push(Math.random() < 0.15 ? 1 : 0);
    }
  }

  update(speed) {
    this.offset += speed;

    const img = spriteLoader.getImage('ground');
    if (img) {
      const tileW = spriteLoader.getSize('ground')?.w || img.width;
      if (this.offset >= tileW) this.offset -= tileW;
    } else {
      while (this.offset >= 2) {
        this.offset -= 2;
        this.segments.shift();
        this.segments.push(Math.random() < 0.15 ? 1 : 0);
      }
    }
  }

  draw(ctx, color) {
    const img = spriteLoader.getImage('ground');
    if (img) {
      const size = spriteLoader.getSize('ground');
      const tileW = size?.w || img.width;
      const tileH = size?.h || img.height;
      const drawY = viewport.groundY - tileH + 1;
      let x = -this.offset;
      while (x < viewport.width) {
        ctx.drawImage(img, x, drawY, tileW, tileH);
        x += tileW;
      }
      return;
    }

    // Placeholder: existing fillRect rendering
    ctx.fillStyle = color;
    ctx.fillRect(0, viewport.groundY, viewport.width, 1);
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i]) {
        const bx = i * 2 - this.offset;
        if (bx >= 0 && bx < viewport.width) {
          ctx.fillRect(bx, viewport.groundY + 2 + Math.floor(Math.random() * 3), 1, 1);
        }
      }
    }
  }
}
