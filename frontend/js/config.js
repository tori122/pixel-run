// Viewport: Game.js resize()에서 디스플레이 크기에 맞게 업데이트
export const viewport = {
  width: 600,
  height: 150,
  get groundY() { return this.height - 30; },
};
export const GRAVITY = 0.6;
export const JUMP_VELOCITY = -11.5;
export const INITIAL_SPEED = 5;
export const MAX_SPEED = 13;
export const SPEED_INCREMENT = 0.001;
export const MIN_OBSTACLE_GAP = 90;
export const NIGHT_CYCLE_SCORE = 700;
export const NIGHT_TRANSITION_FRAMES = 60;
