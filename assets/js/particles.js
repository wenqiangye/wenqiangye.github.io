/**
 * Particle Background Effect
 */
(function() {
  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 1;
      this.speedY = (Math.random() - 0.5) * 1;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = this.getRandomColor();
    }

    getRandomColor() {
      const colors = [
        [100, 150, 255],
        [150, 100, 255],
        [100, 255, 150],
        [255, 150, 100],
        [255, 200, 100],
        [150, 200, 255]
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 边界反弹
      if (this.x - this.size < 0 || this.x + this.size > this.canvas.width) {
        this.speedX *= -1;
        this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
      }
      if (this.y - this.size < 0 || this.y + this.size > this.canvas.height) {
        this.speedY *= -1;
        this.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.y));
      }
    }

    draw(ctx) {
      const rgbColor = this.color;
      ctx.fillStyle = `rgba(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class ParticleBackground {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) {
        console.warn('Particle canvas not found');
        return;
      }

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      if (!this.ctx) {
        console.warn('Could not get 2D context from canvas');
        return;
      }

      this.particles = [];
      this.particleCount = 60;
      this.mouse = { x: null, y: null };
      this.isRunning = false;
      this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

      this.init();
      this.setupEventListeners();
      this.isRunning = true;
      this.animate();
    }

    init() {
      // 使用实际的客户端宽高
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      // 清空粒子
      this.particles = [];

      // 创建粒子
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(new Particle(this.canvas));
      }

      // 绘制背景
      this.drawBackground();
    }

    drawBackground() {
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
      if (this.isDarkMode) {
        gradient.addColorStop(0, '#1e1e2e');
        gradient.addColorStop(1, '#2d2d3d');
      } else {
        gradient.addColorStop(0, '#f5f7fa');
        gradient.addColorStop(1, '#c3cfe2');
      }
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupEventListeners() {
      window.addEventListener('resize', () => this.handleResize());
      document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      document.addEventListener('mouseleave', () => this.handleMouseOut());
    }

    handleResize() {
      this.init();
    }

    handleMouseMove(e) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }

    handleMouseOut() {
      this.mouse.x = null;
      this.mouse.y = null;
    }

    connectParticles() {
      const distance = 150;

      for (let a = 0; a < this.particles.length; a++) {
        for (let b = a + 1; b < this.particles.length; b++) {
          const dx = this.particles[a].x - this.particles[b].x;
          const dy = this.particles[a].y - this.particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < distance) {
            const opacity = (1 - dist / distance) * 0.3;
            this.ctx.strokeStyle = `rgba(150, 150, 200, ${opacity})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
            this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
            this.ctx.stroke();
          }
        }
      }

      // 连接鼠标和粒子
      if (this.mouse.x !== null && this.mouse.y !== null) {
        for (let i = 0; i < this.particles.length; i++) {
          const dx = this.mouse.x - this.particles[i].x;
          const dy = this.mouse.y - this.particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < distance) {
            const opacity = (1 - dist / distance) * 0.5;
            this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
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
      if (!this.isRunning) return;

      this.drawBackground();

      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
        this.particles[i].draw(this.ctx);
      }

      this.connectParticles();
      requestAnimationFrame(() => this.animate());
    }
  }

  // 初始化
  function init() {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
      new ParticleBackground('particles-canvas');
    }

    // 初始化主题切换按钮
    initThemeToggle();
  }

  // 主题切换函数
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    // 设置按钮的data-theme属性，保持与html同步
    const html = document.documentElement;
    function syncTheme() {
      const isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        toggleBtn.setAttribute('data-theme', 'dark');
      } else {
        toggleBtn.removeAttribute('data-theme');
      }
    }

    // 初始同步
    syncTheme();

    // 切换主题
    toggleBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';

      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }

      syncTheme();
    });

    // 监听系统主题变化（可选）
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        syncTheme();
      });
    }
  }

  // 多种方式确保脚本运行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else {
    init();
  }

  // 备用方案
  window.addEventListener('load', init, false);
})();

