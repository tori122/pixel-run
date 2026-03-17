import { CANVAS_WIDTH } from './config.js';

export class Score {
  constructor() {
    this.value = 0;
    this.highScore = parseInt(localStorage.getItem('dinoHighScore') || '0', 10);
    this.flashTimer = 0;
    this.flashVisible = true;
  }

  update() {
    const prev = Math.floor(this.value);
    this.value += 0.1;
    const curr = Math.floor(this.value);

    if (Math.floor(prev / 100) !== Math.floor(curr / 100) && curr > 0) {
      this.flashTimer = 30;
    }

    if (this.flashTimer > 0) {
      this.flashTimer--;
      this.flashVisible = Math.floor(this.flashTimer / 3) % 2 === 0;
    } else {
      this.flashVisible = true;
    }
  }

  save() {
    if (Math.floor(this.value) > this.highScore) {
      this.highScore = Math.floor(this.value);
      localStorage.setItem('dinoHighScore', String(this.highScore));
    }
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';

    // High score
    if (this.highScore > 0) {
      ctx.fillText('HI ' + String(this.highScore).padStart(5, '0'), CANVAS_WIDTH - 80, 15);
    }

    // Current score
    if (this.flashVisible) {
      ctx.fillText(String(Math.floor(this.value)).padStart(5, '0'), CANVAS_WIDTH - 10, 15);
    }
  }
}
