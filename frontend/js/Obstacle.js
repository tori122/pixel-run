import { viewport } from './config.js';
import { spriteLoader } from './SpriteLoader.js';
import { drawPlaceholder } from './utils.js';

export class Obstacle {
  constructor(type, x, speed) {
    this.x = x;
    this.type = type;
    this.frame = 0;
    this.frameTimer = 0;
    this.speed = speed;

    const config = spriteLoader.getConfig();

    if (type === 'flying') {
      const flyConfig = config?.flyingObstacles?.[0];
      this.width = flyConfig?.size?.w || 118;
      this.height = flyConfig?.size?.h || 84;
      const heights = [viewport.groundY, viewport.groundY - 42, viewport.groundY - 77];
      this.y = heights[Math.floor(Math.random() * heights.length)];
      this._hitboxConfig = flyConfig?.hitbox || { x: 3, y: 3, w: 112, h: 78 };
      this._spriteKeys = ['obstacle-fly-1', 'obstacle-fly-2'];
    } else {
      const obsConfig = config?.obstacles?.find((o) => o.type === type);
      this.width = obsConfig?.size?.w || 70;
      this.height = obsConfig?.size?.h || 134;
      this.y = viewport.groundY;
      this._hitboxConfig = obsConfig?.hitbox || { x: 3, y: 0, w: this.width - 6, h: this.height };
      const sprites = obsConfig?.sprites || [];
      this._spriteKeys = sprites.map((s) => s.replace(/\.\w+$/, ''));
    }
  }

  get hitbox() {
    const hb = this._hitboxConfig;
    const drawY = this.y - this.height;
    return { x: this.x + hb.x, y: drawY + hb.y, w: hb.w, h: hb.h };
  }

  update() {
    this.x -= this.speed;
    this.frameTimer++;
    if (this.frameTimer > 10) {
      this.frameTimer = 0;
      this.frame = 1 - this.frame;
    }
  }

  draw(ctx, color) {
    const drawY = this.y - this.height;
    const key = this._spriteKeys[this.frame] || this._spriteKeys[0];

    if (key) {
      const img = spriteLoader.getImage(key);
      if (img) {
        ctx.drawImage(img, this.x, drawY, this.width, this.height);
        return;
      }
    }
    drawPlaceholder(ctx, this.x, drawY, this.width, this.height, this.type);
  }
}
