import { viewport } from './config.js';

export class Cloud {
  constructor(x, y) {
    this.x = x || viewport.width + Math.random() * 100;
    this.y = y || 15 + Math.random() * 40;
    this.width = 30 + Math.random() * 20;
    this.speed = 0.5 + Math.random() * 0.5;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    const w = this.width;
    const h = w * 0.35;
    // Simple cloud shape
    ctx.fillRect(this.x + w * 0.15, this.y, w * 0.7, h * 0.5);
    ctx.fillRect(this.x, this.y + h * 0.3, w, h * 0.4);
    ctx.fillRect(this.x + w * 0.1, this.y + h * 0.5, w * 0.8, h * 0.3);
  }
}
