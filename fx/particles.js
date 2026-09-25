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

// 5. THE MATRIX DIGITAL RAIN (Authentic Katakana + White Heads + Fading Trails)
let ambientCanvas = null;
let ambientCtx = null;
const ambientColumns = [];
const MATRIX_CHARS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789:・."=*+-<>¦｜XYZGLITCH';

export function initAmbientDataStream() {
  if (ambientCanvas) return;
  ambientCanvas = document.createElement('canvas');
  ambientCanvas.id = 'ambient-stream-canvas';
  ambientCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:0.38;';
  document.body.appendChild(ambientCanvas);
  ambientCtx = ambientCanvas.getContext('2d');

  const resize = () => {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
    const fontSize = 14;
    const colCount = Math.floor(ambientCanvas.width / fontSize);
    ambientColumns.length = 0;

    for (let i = 0; i < colCount; i++) {
      const isEdge = (i / colCount < 0.22) || (i / colCount > 0.78);
      ambientColumns.push({
        x: i * fontSize,
        y: Math.random() * -ambientCanvas.height,
        speed: (isEdge ? 2.5 : 1.6) + Math.random() * 2.2,
        length: 12 + Math.floor(Math.random() * 16),
        chars: [],
        fontSize: isEdge ? 13 : 11,
        alpha: isEdge ? 0.85 : 0.42
      });
    }
  };
  window.addEventListener('resize', resize);
  resize();

  function streamLoop() {
    if (ambientCtx) {
      // Atmospheric semi-transparent fade for classic Matrix motion trail
      ambientCtx.fillStyle = 'rgba(2, 6, 3, 0.16)';
      ambientCtx.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);

      ambientColumns.forEach(col => {
        // Randomly regenerate characters
        if (Math.random() < 0.3 || col.chars.length === 0) {
          col.chars = [];
          for (let c = 0; c < col.length; c++) {
            col.chars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
          }
        }

        ambientCtx.font = `${col.fontSize}px 'JetBrains Mono', 'Courier New', monospace`;

        // Draw the trail of characters
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - (j * col.fontSize * 1.25);
          if (charY < 0 || charY > ambientCanvas.height + 30) continue;

          const char = col.chars[j] || MATRIX_CHARS[0];

          if (j === 0) {
            // Iconic Matrix White-Hot Leading Head
            ambientCtx.fillStyle = '#ffffff';
            ambientCtx.shadowColor = '#00ff41';
            ambientCtx.shadowBlur = 8;
            ambientCtx.globalAlpha = Math.min(1.0, col.alpha + 0.2);
            ambientCtx.fillText(char, col.x, charY);
            ambientCtx.shadowBlur = 0;
          } else if (j < 4) {
            // Bright Phosphor Green Body
            ambientCtx.fillStyle = '#00ff66';
            ambientCtx.globalAlpha = col.alpha;
            ambientCtx.fillText(char, col.x, charY);
          } else {
            // Deep Fading Tail
            const fade = Math.max(0.08, col.alpha * (1 - (j / col.length)));
            ambientCtx.fillStyle = '#008f11';
            ambientCtx.globalAlpha = fade;
            ambientCtx.fillText(char, col.x, charY);
          }
        }

        col.y += col.speed;
        if (col.y - (col.length * col.fontSize * 1.25) > ambientCanvas.height) {
          col.y = Math.random() * -100;
          col.speed = (col.fontSize > 12 ? 2.4 : 1.5) + Math.random() * 2.0;
        }
      });

      ambientCtx.globalAlpha = 1.0;
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


