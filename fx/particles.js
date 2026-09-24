/**
 * ═══════════════════════════════════════════════════════════════
 * GLITCH MATRIX — FX & PARTICLE ENGINE
 * Reusable visual effect primitives: burst, trail, ripple,
 * shockwave, confetti of bits, ambient data stream
 * ═══════════════════════════════════════════════════════════════
 */

// 1. BURST PARTICLE SYSTEM (Canvas-accelerated with Object Pool)
let particleCanvas = null;
let particleCtx = null;
let activeParticles = [];
const particlePool = [];

export function initParticleCanvas() {
  if (particleCanvas) return;
  particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'fx-particle-canvas';
  particleCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9950;';
  document.body.appendChild(particleCanvas);
  particleCtx = particleCanvas.getContext('2d');

  const resize = () => {
    particleCanvas.width = window.innerWidth * window.devicePixelRatio;
    particleCanvas.height = window.innerHeight * window.devicePixelRatio;
    particleCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };
  window.addEventListener('resize', resize);
  resize();

  requestAnimationFrame(particleLoop);
}

function getParticleFromPool() {
  return particlePool.pop() || { x: 0, y: 0, vx: 0, vy: 0, life: 1, decay: 0.02, size: 2, color: '#00e5ff' };
}

export function spawnParticleBurst(x, y, color = '#7cff3d', count = 35) {
  initParticleCanvas();
  for (let i = 0; i < count; i++) {
    const p = getParticleFromPool();
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 2.5; // slight upward pop
    p.life = 1.0;
    p.decay = 0.015 + Math.random() * 0.025;
    p.size = 2 + Math.random() * 3.5;
    p.color = color;
    activeParticles.push(p);
  }
}

function particleLoop() {
  if (particleCtx && activeParticles.length > 0) {
    particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravity
      p.vx *= 0.98; // drag
      p.life -= p.decay;

      if (p.life <= 0) {
        particlePool.push(activeParticles.splice(i, 1)[0]);
      } else {
        particleCtx.fillStyle = p.color;
        particleCtx.globalAlpha = p.life;
        particleCtx.fillRect(p.x, p.y, p.size, p.size);
      }
    }
    particleCtx.globalAlpha = 1.0;
  }
  requestAnimationFrame(particleLoop);
}

// 2. DUAL RIPPLE SYSTEM (Button Click Point)
export function spawnDualRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const x = e ? (e.clientX - rect.left) : rect.width / 2;
  const y = e ? (e.clientY - rect.top) : rect.height / 2;

  [0, 80].forEach(delay => {
    setTimeout(() => {
      const r = document.createElement('span');
      r.className = 'cyber-dual-ripple';
      r.style.left = x + 'px';
      r.style.top = y + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 450);
    }, delay);
  });
}

// 3. SHOCKWAVE SYSTEM (Full-Screen Concentric Rings)
export function spawnShockwave(color = 'rgba(0, 229, 255, 0.4)') {
  const container = document.createElement('div');
  container.className = 'shockwave-container';
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9980;display:flex;align-items:center;justify-content:center;';

  [0, 100, 200].forEach((delay, idx) => {
    setTimeout(() => {
      const ring = document.createElement('div');
      ring.className = 'shockwave-ring';
      ring.style.cssText = `border: 2px solid ${color};`;
      container.appendChild(ring);
    }, delay);
  });

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1100);
}

// 4. CONFETTI OF BITS (200 falling glyphs: 0/1/█/▓)
export function spawnConfettiOfBits() {
  const chars = ['0', '1', '█', '▓', '░', 'SYS', 'ACK'];
  const count = 200;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;overflow:hidden;';

  for (let i = 0; i < count; i++) {
    const bit = document.createElement('div');
    bit.className = 'falling-bit';
    bit.textContent = chars[Math.floor(Math.random() * chars.length)];
    bit.style.left = Math.random() * 100 + 'vw';
    bit.style.animationDelay = (Math.random() * 1.8) + 's';
    bit.style.animationDuration = (2.2 + Math.random() * 1.5) + 's';
    bit.style.fontSize = (0.7 + Math.random() * 0.7) + 'rem';
    bit.style.color = Math.random() < 0.75 ? 'var(--lime)' : 'var(--cyan)';
    container.appendChild(bit);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4500);
}

// 5. AMBIENT DATA STREAM (Matrix-like subtle vertical columns on outer 15%)
let ambientCanvas = null;
let ambientCtx = null;
const ambientColumns = [];

export function initAmbientDataStream() {
  if (ambientCanvas) return;
  ambientCanvas = document.createElement('canvas');
  ambientCanvas.id = 'ambient-stream-canvas';
  ambientCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:0.18;';
  document.body.appendChild(ambientCanvas);
  ambientCtx = ambientCanvas.getContext('2d');

  const resize = () => {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
    const colCount = Math.floor(ambientCanvas.width / 24);
    ambientColumns.length = 0;
    for (let i = 0; i < colCount; i++) {
      // Only place streams on outer 16% on left and right
      const xPct = i / colCount;
      if (xPct < 0.16 || xPct > 0.84) {
        ambientColumns.push({
          x: i * 24,
          y: Math.random() * ambientCanvas.height,
          speed: 1.2 + Math.random() * 2.2,
          chars: '0123456789ABCDEF!#%'
        });
      }
    }
  };
  window.addEventListener('resize', resize);
  resize();

  function streamLoop() {
    if (ambientCtx) {
      ambientCtx.fillStyle = 'rgba(5, 7, 10, 0.25)';
      ambientCtx.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      ambientCtx.font = '10px "IBM Plex Mono", monospace';
      ambientCtx.fillStyle = '#00e5ff';

      ambientColumns.forEach(col => {
        const char = col.chars[Math.floor(Math.random() * col.chars.length)];
        ambientCtx.fillText(char, col.x, col.y);
        col.y += col.speed;
        if (col.y > ambientCanvas.height) {
          col.y = -20;
          col.speed = 1.2 + Math.random() * 2.2;
        }
      });
    }
    requestAnimationFrame(streamLoop);
  }
  requestAnimationFrame(streamLoop);
}

if (typeof window !== 'undefined') {
  window.FX = {
    initParticles: initParticleCanvas,
    spawnBurst: spawnParticleBurst,
    spawnDualRipple,
    spawnShockwave,
    spawnConfettiOfBits,
    startAmbientStream: initAmbientDataStream
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.FX;
}


