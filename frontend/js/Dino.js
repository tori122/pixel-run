import { GROUND_Y, GRAVITY, JUMP_VELOCITY } from './config.js';
import { SPRITES } from './sprites.js';
import { drawPixels } from './utils.js';

export class Dino {
  constructor() {
    this.x = 25;
    this.y = GROUND_Y;
    this.width = 15;
    this.height = 17;
    this.ducking = false;
    this.jumping = false;
    this.vy = 0;
    this.frame = 0;
    this.frameTimer = 0;
    this.scale = 2.5;
    this.blinkTimer = 0;
  }

  get hitbox() {
    if (this.ducking) {
      return {
        x: this.x + 4,
        y: this.y - 12 * this.scale / 2.5,
        w: 18 * this.scale / 2.5 - 4,
        h: 12 * this.scale / 2.5,
      };
    }
    return {
      x: this.x + 4,
      y: this.y - this.height * this.scale / 2.5,
      w: this.width * this.scale / 2.5 - 4,
      h: this.height * this.scale / 2.5,
    };
  }

  jump() {
    if (!this.jumping) {
      this.jumping = true;
      this.vy = JUMP_VELOCITY;
      this.ducking = false;
    }
  }

  duck(active) {
    if (this.jumping) {
      if (active) this.vy = Math.max(this.vy, 4);
      return;
    }
    this.ducking = active;
  }

  update() {
    if (this.jumping) {
      this.vy += GRAVITY;
      this.y += this.vy;
      if (this.y >= GROUND_Y) {
        this.y = GROUND_Y;
        this.jumping = false;
        this.vy = 0;
      }
    }
    this.frameTimer++;
    if (this.frameTimer > 6) {
      this.frameTimer = 0;
      this.frame = 1 - this.frame;
    }
  }

  draw(ctx, color) {
    const s = this.scale;
    const drawY = this.ducking
      ? this.y - 12 * s / 2.5
      : this.y - this.height * s / 2.5;

    if (this.ducking) {
      drawPixels(ctx, SPRITES.dinoDuckBody, this.x, drawY, s / 2.5, color);
      const legSprite = this.frame === 0 ? SPRITES.dinoDuckLeg1 : SPRITES.dinoDuckLeg2;
      drawPixels(ctx, legSprite, this.x, drawY, s / 2.5, color);
    } else {
      drawPixels(ctx, SPRITES.dinoBody, this.x, drawY, s / 2.5, color);
      if (!this.jumping) {
        const legSprite = this.frame === 0 ? SPRITES.dinoLeg1Left : SPRITES.dinoLeg1Right;
        drawPixels(ctx, legSprite, this.x, drawY, s / 2.5, color);
      } else {
        drawPixels(ctx, SPRITES.dinoLeg1Left, this.x, drawY, s / 2.5, color);
      }
    }
  }
}
