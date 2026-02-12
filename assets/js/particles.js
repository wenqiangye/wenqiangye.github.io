/**
 * Particle Background Effect
 */
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = this.getRandomColor();
  }

  getRandomColor() {
    const colors = [
      'rgba(100, 150, 255, ',
      'rgba(150, 100, 255, ',
      'rgba(100, 255, 150, ',
      'rgba(255, 150, 100, ',
      'rgba(255, 200, 100, ',
      'rgba(150, 200, 255, '
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // 边界反弹
    if (this.x < 0 || this.x > this.canvas.width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.speedY *= -1;
    }

    // 保持在画布范围内
    this.x = Math.max(0, Math.min(this.canvas.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height, this.y));
  }

  draw(ctx) {
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ParticleBackground {
  constructor(canvasId = 'particles-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 50;
    this.mouse = { x: undefined, y: undefined };

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.handleResize());
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseout', () => this.handleMouseOut());
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleMouseOut() {
    this.mouse.x = undefined;
    this.mouse.y = undefined;
  }

  connectParticles() {
    const distance = 150;

    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a + 1; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < distance) {
          const opacity = 1 - dist / distance;
          this.ctx.strokeStyle = `rgba(150, 150, 200, ${opacity * 0.3})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
          this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
          this.ctx.stroke();
        }
      }
    }

    // 连接鼠标和粒子
    if (this.mouse.x !== undefined && this.mouse.y !== undefined) {
      for (let i = 0; i < this.particles.length; i++) {
        const dx = this.mouse.x - this.particles[i].x;
        const dy = this.mouse.y - this.particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < distance) {
          const opacity = 1 - dist / distance;
          this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity * 0.5})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.mouse.x, this.mouse.y);
          this.ctx.lineTo(this.particles[i].x, this.particles[i].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw(this.ctx);
    }

    this.connectParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// 当DOM加载完成时初始化粒子背景
document.addEventListener('DOMContentLoaded', () => {
  new ParticleBackground('particles-canvas');
});
