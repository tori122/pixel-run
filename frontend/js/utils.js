export function drawPixels(ctx, pixels, x, y, scale, color) {
  ctx.fillStyle = color;
  for (const [px, py, w, h] of pixels) {
    ctx.fillRect(x + px * scale, y + py * scale, (w || 1) * scale, (h || 1) * scale);
  }
}

export function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function checkCollision(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
