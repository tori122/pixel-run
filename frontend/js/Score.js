import { viewport } from './config.js';

const SCORE_PER_TICK = 5; // 50점 단위: 매 프레임 +5, 10프레임마다 +50

export class Score {
  constructor() {
    this.value = 0;
    this.highScore = parseInt(localStorage.getItem('dinoHighScore') || '0', 10);
    this.flashTimer = 0;
    this.flashVisible = true;
  }

  get displayValue() {
    return Math.floor(this.value / 10) * 50;
  }

  update() {
    const prevDisplay = this.displayValue;
    this.value += SCORE_PER_TICK;
    const currDisplay = this.displayValue;

    if (Math.floor(prevDisplay / 500) !== Math.floor(currDisplay / 500) && currDisplay > 0) {
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
    const score = this.displayValue;
    if (score > this.highScore) {
      this.highScore = score;
      localStorage.setItem('dinoHighScore', String(this.highScore));
    }
  }

  draw(ctx, color) {
    ctx.fillStyle = color;
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';

    if (this.highScore > 0) {
      ctx.fillText('HI ' + String(this.highScore).padStart(5, '0'), viewport.width - 80, 15);
    }

    if (this.flashVisible) {
      ctx.fillText(String(this.displayValue).padStart(5, '0'), viewport.width - 10, 15);
    }
  }
}
