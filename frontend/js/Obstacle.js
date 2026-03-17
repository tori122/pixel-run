import { GROUND_Y } from './config.js';
import { SPRITES } from './sprites.js';
import { drawPixels } from './utils.js';

export class Obstacle {
  constructor(type, x, speed) {
    this.x = x;
    this.type = type; // 'cactusSmall', 'cactusLarge', 'cactusDouble', 'ptero'
    this.frame = 0;
    this.frameTimer = 0;
    this.scale = 2.5;
    this.speed = speed;

    if (type === 'cactusSmall') {
      this.width = 5 * this.scale / 2.5;
      this.height = 9 * this.scale / 2.5;
      this.y = GROUND_Y;
    } else if (type === 'cactusLarge') {
      this.width = 8 * this.scale / 2.5;
      this.height = 12 * this.scale / 2.5;
      this.y = GROUND_Y;
    } else if (type === 'cactusDouble') {
      this.width = 10 * this.scale / 2.5;
      this.height = 12 * this.scale / 2.5;
      this.y = GROUND_Y;
    } else if (type === 'ptero') {
      this.width = 7 * this.scale / 2.5;
      this.height = 6 * this.scale / 2.5;
      const heights = [GROUND_Y, GROUND_Y - 25, GROUND_Y - 45];
      this.y = heights[Math.floor(Math.random() * heights.length)];
    }
  }

  get hitbox() {
    if (this.type === 'ptero') {
      return {
        x: this.x + 2,
        y: this.y - this.height + 2,
        w: this.width - 4,
        h: this.height - 4,
      };
    }
    return {
      x: this.x + 2,
      y: this.y - this.height,
      w: this.width - 4,
      h: this.height,
    };
  }

  update() {
    this.x -= this.speed;
    if (this.type === 'ptero') {
      this.frameTimer++;
      if (this.frameTimer > 10) {
        this.frameTimer = 0;
        this.frame = 1 - this.frame;
      }
    }
  }

  draw(ctx, color) {
    const s = this.scale;
    const drawY = this.y - this.height;

    if (this.type === 'cactusSmall') {
      drawPixels(ctx, SPRITES.cactusSmall, this.x, drawY, s / 2.5, color);
    } else if (this.type === 'cactusLarge') {
      drawPixels(ctx, SPRITES.cactusLarge, this.x, drawY, s / 2.5, color);
    } else if (this.type === 'cactusDouble') {
      drawPixels(ctx, SPRITES.cactusDouble, this.x, drawY, s / 2.5, color);
    } else if (this.type === 'ptero') {
      const sprite = this.frame === 0 ? SPRITES.ptero1 : SPRITES.ptero2;
      drawPixels(ctx, sprite, this.x, drawY, s / 2.5, color);
    }
  }
}
