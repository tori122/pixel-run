import { CANVAS_WIDTH, NIGHT_CYCLE_SCORE, NIGHT_TRANSITION_FRAMES } from './config.js';
import { SPRITES } from './sprites.js';
import { drawPixels, lerpColor } from './utils.js';

export class NightMode {
  constructor() {
    this.active = false;
    this.opacity = 0;
    this.moonX = CANVAS_WIDTH - 60;
    this.moonY = 20;
    this.stars = [];
    for (let i = 0; i < 5; i++) {
      this.stars.push({
        x: 50 + Math.random() * (CANVAS_WIDTH - 100),
        y: 10 + Math.random() * 40,
      });
    }
    this.phase = 0; // moon phase 0-5
  }

  update(score) {
    const cycle = Math.floor(score / NIGHT_CYCLE_SCORE);
    const shouldBeNight = cycle % 2 === 1;

    if (shouldBeNight && !this.active) {
      this.active = true;
      this.phase = (this.phase + 1) % 6;
      // Regenerate stars
      for (let i = 0; i < this.stars.length; i++) {
        this.stars[i].x = 50 + Math.random() * (CANVAS_WIDTH - 100);
        this.stars[i].y = 10 + Math.random() * 40;
      }
    } else if (!shouldBeNight && this.active) {
      this.active = false;
    }

    const target = this.active ? 1 : 0;
    this.opacity += (target - this.opacity) * (1 / NIGHT_TRANSITION_FRAMES);
    if (Math.abs(this.opacity - target) < 0.01) this.opacity = target;
  }

  getColors() {
    const t = this.opacity;
    const bg = lerpColor([247, 247, 247], [32, 33, 36], t);
    const fg = lerpColor([83, 83, 83], [200, 200, 200], t);
    return {
      bg: `rgb(${bg[0]},${bg[1]},${bg[2]})`,
      fg: `rgb(${fg[0]},${fg[1]},${fg[2]})`,
      cloudFg: `rgba(${fg[0]},${fg[1]},${fg[2]},0.3)`,
    };
  }

  draw(ctx, color) {
    if (this.opacity < 0.01) return;
    ctx.globalAlpha = this.opacity;

    // Moon
    const ms = 2;
    drawPixels(ctx, SPRITES.moon, this.moonX, this.moonY, ms, color);

    // Stars
    for (const star of this.stars) {
      drawPixels(ctx, SPRITES.star, star.x, star.y, 2, color);
    }

    ctx.globalAlpha = 1;
  }
}
