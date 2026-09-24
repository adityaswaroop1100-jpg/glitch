/**
 * ═══════════════════════════════════════════════════════════════
 * GLITCH MATRIX — GLITCH & TRANSITION ENGINE
 * Full-screen datamosh, SVG displacement, digital strip wipe,
 * and data corruption text scrambler
 * ═══════════════════════════════════════════════════════════════
 */

// 1. DATA CORRUPTION TEXT SCRAMBLER
const SCRAMBLE_POOL = ['#', '!', '?', '%', '&', '0', '1', 'X', '9', '*', '$', '/', '█', '▓'];

export function scrambleText(element, finalValue, duration = 140) {
  if (!element) return;
  const start = Date.now();
  const targetStr = String(finalValue);
  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    if (elapsed >= duration) {
      clearInterval(interval);
      element.textContent = targetStr;
      return;
    }
    let result = '';
    for (let i = 0; i < targetStr.length; i++) {
      if (Math.random() < 0.65) {
        result += SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
      } else {
        result += targetStr[i];
      }
    }
    element.textContent = result;
  }, 32);
}

// 2. FULL-SCREEN DATAMOSH GLITCH TRIGGER (300ms)
export function triggerFullDatamoshGlitch() {
  const overlay = document.getElementById('screen-glitch-layer');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 320);
  }

  // Brief viewport horizontal jitter
  const app = document.getElementById('app-viewport');
  if (app) {
    app.classList.add('screen-shake-jitter');
    setTimeout(() => app.classList.remove('screen-shake-jitter'), 280);
  }
}

// 3. SVG DISPLACEMENT GLITCH (Applied to Target Element)
export function applyDisplacementGlitch(targetElement, duration = 200) {
  if (!targetElement) return;
  targetElement.style.filter = 'url(#svg-glitch-filter)';
  const filter = document.getElementById('svg-glitch-turbulence');
  if (!filter) return;

  const start = Date.now();
  const anim = setInterval(() => {
    const progress = (Date.now() - start) / duration;
    if (progress >= 1.0) {
      clearInterval(anim);
      targetElement.style.filter = '';
      filter.setAttribute('baseFrequency', '0');
    } else {
      const freq = Math.sin(progress * Math.PI) * 0.85;
      filter.setAttribute('baseFrequency', '0 ' + freq.toFixed(3));
    }
  }, 25);
}

// 4. DIGITAL STRIP WIPE (Section 1D: 20 vertical strips dissection)
export function triggerDigitalStripWipe(callback) {
  const container = document.getElementById('digital-wipe-container');
  if (!container) {
    if (callback) callback();
    return;
  }

  container.innerHTML = '';
  container.style.display = 'flex';
  const stripCount = 20;

  for (let i = 0; i < stripCount; i++) {
    const strip = document.createElement('div');
    strip.className = 'digital-wipe-strip';
    strip.style.animationDelay = (i * 25) + 'ms';
    container.appendChild(strip);
  }

  // Trigger halfway callback to swap views behind wipe
  setTimeout(() => {
    if (callback) callback();
  }, 300);

  setTimeout(() => {
    container.style.display = 'none';
    container.innerHTML = '';
  }, 750);
}

if (typeof window !== 'undefined') {
  window.GlitchFX = {
    scrambleText,
    triggerFullDatamoshGlitch,
    applySvgDisplacement: applyDisplacementGlitch,
    applyDisplacementGlitch,
    triggerDigitalStripWipe
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.GlitchFX;
}


