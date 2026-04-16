import {
  CANVAS_WIDTH, CANVAS_HEIGHT, INITIAL_SPEED, MAX_SPEED,
  SPEED_INCREMENT, MIN_OBSTACLE_GAP,
} from './config.js';
import { SPRITES } from './sprites.js';
import { drawPixels, checkCollision } from './utils.js';
import { spriteLoader } from './SpriteLoader.js';
import { saveScore, loadRanking } from './api.js';
import { Dino } from './Dino.js';
import { Obstacle } from './Obstacle.js';
import { Ground } from './Ground.js';
import { Cloud } from './Cloud.js';
import { NightMode } from './NightMode.js';
import { Score } from './Score.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

class Game {
  constructor() {
    this.state = 'idle'; // 'idle', 'playing', 'gameover'
    this.dino = new Dino();
    this.ground = new Ground();
    this.obstacles = [];
    this.clouds = [];
    this.nightMode = new NightMode();
    this.score = new Score();
    this.speed = INITIAL_SPEED;
    this.obstacleTimer = 0;
    this.cloudTimer = 0;
    this.gameOverDelay = 0;

    spriteLoader.init().catch((err) => console.warn('[Game] SpriteLoader init failed:', err));

    // Pre-populate clouds
    for (let i = 0; i < 3; i++) {
      this.clouds.push(new Cloud(100 + i * 200, 15 + Math.random() * 40));
    }

    this.bindEvents();
    this.loop();
  }

  bindEvents() {
    const handleAction = (action) => {
      if (action === 'jump') {
        if (this.state === 'idle') {
          this.start();
        } else if (this.state === 'gameover') {
          if (this.gameOverDelay <= 0) this.restart();
        } else {
          this.dino.jump();
        }
      }
      if (action === 'duckStart' && this.state === 'playing') {
        this.dino.duck(true);
      }
      if (action === 'duckEnd' && this.state === 'playing') {
        this.dino.duck(false);
      }
    };

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleAction('jump');
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleAction('duckStart');
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowDown') {
        handleAction('duckEnd');
      }
    });

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const y = touch.clientY - rect.top;
      if (y > rect.height * 0.6) {
        handleAction('duckStart');
      } else {
        handleAction('jump');
      }
    });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleAction('duckEnd');
    });

    // Responsive canvas
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    const maxW = window.innerWidth * 0.95;
    const maxH = window.innerHeight * 0.8;
    const ratio = CANVAS_WIDTH / CANVAS_HEIGHT;

    let w = maxW;
    let h = w / ratio;
    if (h > maxH) {
      h = maxH;
      w = h * ratio;
    }

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }

  start() {
    this.state = 'playing';
    this.dino.jump();
  }

  restart() {
    this.state = 'playing';
    this.dino = new Dino();
    this.obstacles = [];
    this.speed = INITIAL_SPEED;
    this.score = new Score();
    this.score.highScore = parseInt(localStorage.getItem('dinoHighScore') || '0', 10);
    this.obstacleTimer = 0;
    this.ground = new Ground();
    this.nightMode = new NightMode();
    this.dino.jump();
  }

  spawnObstacle() {
    const types = ['cactusSmall', 'cactusLarge', 'cactusDouble'];
    // Pterodactyls after score 200
    if (Math.floor(this.score.value) > 200) {
      types.push('ptero');
    }
    const type = types[Math.floor(Math.random() * types.length)];
    this.obstacles.push(new Obstacle(type, CANVAS_WIDTH + 10, this.speed));
  }

  update() {
    if (this.state === 'gameover') {
      if (this.gameOverDelay > 0) this.gameOverDelay--;
      return;
    }
    if (this.state !== 'playing') return;

    // Speed up
    if (this.speed < MAX_SPEED) {
      this.speed += SPEED_INCREMENT;
    }

    this.dino.update();
    this.ground.update(this.speed);
    this.score.update();
    this.nightMode.update(Math.floor(this.score.value));

    // Obstacles
    this.obstacleTimer++;
    const minGap = Math.max(MIN_OBSTACLE_GAP - this.speed * 3, 40);
    if (this.obstacleTimer > minGap + Math.random() * 40) {
      this.spawnObstacle();
      this.obstacleTimer = 0;
    }

    for (const obs of this.obstacles) {
      obs.speed = this.speed;
      obs.update();
    }
    this.obstacles = this.obstacles.filter((o) => o.x > -50);

    // Clouds
    this.cloudTimer++;
    if (this.cloudTimer > 120 + Math.random() * 80) {
      this.clouds.push(new Cloud());
      this.cloudTimer = 0;
    }
    for (const cloud of this.clouds) cloud.update();
    this.clouds = this.clouds.filter((c) => c.x > -60);

    // Collision
    const dinoHB = this.dino.hitbox;
    for (const obs of this.obstacles) {
      if (checkCollision(dinoHB, obs.hitbox)) {
        this.gameOver();
        return;
      }
    }
  }

  gameOver() {
    this.state = 'gameover';
    this.score.save();
    this.gameOverDelay = 20; // Prevent instant restart

    const playerName = document.getElementById('playerName').value.trim() || 'anonymous';
    const finalScore = Math.floor(this.score.value);
    saveScore(playerName, finalScore).then(() => loadRanking());
  }

  draw() {
    const colors = this.nightMode.getColors();

    // Background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    document.body.style.background = colors.bg;

    // Night elements (moon, stars)
    this.nightMode.draw(ctx, colors.fg);

    // Clouds
    for (const cloud of this.clouds) cloud.draw(ctx, colors.cloudFg);

    // Ground
    this.ground.draw(ctx, colors.fg);

    // Obstacles
    for (const obs of this.obstacles) obs.draw(ctx, colors.fg);

    // Dino
    this.dino.draw(ctx, colors.fg);

    // Score
    this.score.draw(ctx, colors.fg);

    // Idle screen
    if (this.state === 'idle') {
      ctx.fillStyle = colors.fg;
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS SPACE TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      ctx.font = '9px monospace';
      ctx.fillText('or tap the screen', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 5);
    }

    // Game over screen
    if (this.state === 'gameover') {
      ctx.fillStyle = colors.fg;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('G A M E  O V E R', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15);

      // Restart icon
      const rx = CANVAS_WIDTH / 2 - 12;
      const ry = CANVAS_HEIGHT / 2;
      drawPixels(ctx, SPRITES.restart, rx, ry, 2.2, colors.fg);
    }
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

// ── Start ──
new Game();
