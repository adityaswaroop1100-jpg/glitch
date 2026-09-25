/**
 * ═══════════════════════════════════════════════════════════════
 * GLITCH MATRIX — HUD & COCKPIT CONTROLLER
 * Corner atmospheric readouts, running timecode, real-time waveform,
 * and 3-zone cockpit bar
 * ═══════════════════════════════════════════════════════════════
 */

function scrambleText(element, finalValue, duration = 140) {
  if (typeof window !== 'undefined' && window.GlitchFX && window.GlitchFX.scrambleText) {
    window.GlitchFX.scrambleText(element, finalValue, duration);
  } else if (element) {
    element.textContent = finalValue;
  }
}

let waveformCanvas = null;
let waveformCtx = null;
let startTime = Date.now();
let telemetryInterval = null;

export function initHUDController() {
  initWaveform();
  initTimecodeAndTelemetry();
}

// 1. RUNNING TIMECODE & SYSTEM TELEMETRY (Every 800ms)
function initTimecodeAndTelemetry() {
  if (telemetryInterval) clearInterval(telemetryInterval);

  telemetryInterval = setInterval(() => {
    // Timecode (hh:mm:ss:ff)
    const elapsed = Date.now() - startTime;
    const sec = Math.floor(elapsed / 1000) % 60;
    const min = Math.floor(elapsed / 60000) % 60;
    const hrs = Math.floor(elapsed / 3600000);
    const frames = Math.floor((elapsed % 1000) / 40); // 25fps frames
    const tcEl = document.getElementById('hud-timecode-val');
    if (tcEl) {
      tcEl.textContent = 
        String(hrs).padStart(2, '0') + ':' +
        String(min).padStart(2, '0') + ':' +
        String(sec).padStart(2, '0') + ':' +
        String(frames).padStart(2, '0');
    }

    // Top-Right Live CPU/MEM/NET Stats
    const cpu = Math.floor(48 + Math.random() * 32);
    const mem = (3.8 + Math.random() * 0.8).toFixed(1);
    const net = Math.floor(120 + Math.random() * 85);
    const statsEl = document.getElementById('corner-stats-text');
    if (statsEl) {
      statsEl.textContent = `CPU ${cpu}% // MEM ${mem}GB // NET ${net}MB/S`;
    }

    // Session ID occasional glitch
    if (Math.random() < 0.25) {
      const sTag = document.getElementById('session-tag');
      if (sTag) scrambleText(sTag, 'GH-047-KX', 90);
    }
  }, 800);
}

// 2. CORNER ANIMATED AUDIO WAVEFORM (60x20px Canvas)
function initWaveform() {
  waveformCanvas = document.getElementById('corner-waveform-canvas');
  if (!waveformCanvas) return;
  waveformCtx = waveformCanvas.getContext('2d');
  waveformCanvas.width = 60;
  waveformCanvas.height = 20;

  function renderWave() {
    if (waveformCtx) {
      waveformCtx.clearRect(0, 0, 60, 20);
      waveformCtx.fillStyle = 'rgba(0, 255, 65, 0.85)';

      const bars = 10;
      const barWidth = 4;
      const spacing = 2;
      const time = Date.now() * 0.008;

      for (let i = 0; i < bars; i++) {
        const height = Math.abs(Math.sin(time + i * 0.8)) * 14 + 3;
        const x = i * (barWidth + spacing);
        const y = 20 - height;
        waveformCtx.fillRect(x, y, barWidth, height);
      }
    }
    requestAnimationFrame(renderWave);
  }
  requestAnimationFrame(renderWave);
}

// 3. UPDATE HUD STATE (Called from main game loop)
export function updateCockpitHUD(G, CONFIG, MODULES, getComboMultiplier) {
  // Zone 1: Module dots
  const dots = document.getElementById('module-dots');
  if (dots) {
    dots.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const d = document.createElement('div');
      d.className = 'mod-dot';
      if (i < G.currentModule) d.classList.add('completed');
      else if (i === G.currentModule) d.classList.add('active');
      dots.appendChild(d);
    }
  }
  const modLabel = document.getElementById('module-label');
  if (modLabel) modLabel.textContent = `${G.currentModule + 1} / 7`;

  // Zone 2: Shields
  const livesEl = document.getElementById('lives-display');
  if (livesEl) {
    livesEl.innerHTML = '';
    for (let i = 0; i < CONFIG.MAX_LIVES; i++) {
      const s = document.createElement('div');
      s.className = 'shield-unit';
      if (i < G.lives) {
        s.classList.add('active');
        if (G.lives === 1) s.classList.add('critical');
      } else {
        s.classList.add('destroyed');
      }
      livesEl.appendChild(s);
    }
  }

  // Zone 3: Time
  const tEl = document.getElementById('timer-display');
  const tStatus = document.getElementById('timer-label');
  if (tEl) {
    const m = Math.floor(G.timeLeft / 60);
    const sec = G.timeLeft % 60;
    tEl.textContent = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    tEl.classList.remove('amber', 'red');

    if (G.timeLeft <= 30) {
      tEl.classList.add('red');
      if (tStatus) tStatus.textContent = 'CRITICAL OVERLOAD';
    } else if (G.timeLeft <= 120) {
      tEl.classList.add('amber');
      if (tStatus) tStatus.textContent = 'SYSTEM UNSTABLE';
    } else {
      if (tStatus) tStatus.textContent = 'SYSTEM STABLE';
    }
  }

  // Critical pulse under 10s
  const hud = document.getElementById('hud');
  if (hud) {
    if (G.timeLeft <= 10 && G.timeLeft > 0) hud.classList.add('critical-pulse');
    else hud.classList.remove('critical-pulse');
  }

  // Score scramble
  const sEl = document.getElementById('score-display');
  if (sEl && sEl.dataset.lastScore !== String(G.score)) {
    scrambleText(sEl, String(G.score).padStart(4, '0'), 130);
    sEl.dataset.lastScore = String(G.score);
  }

  // Combo badge
  const comboEl = document.getElementById('combo-hud');
  if (comboEl) {
    const m = getComboMultiplier();
    comboEl.textContent = G.combo >= 2 ? `OVERCLOCK ×${m}` : '';
  }

  // 2px Progress bar
  const fill = document.getElementById('hud-progress-fill');
  if (fill) {
    const base = (G.currentModule / 7) * 100;
    const qPart = (G.currentQuestion / (3 * 7)) * 100;
    fill.style.width = Math.min(100, Math.round(base + qPart)) + '%';
  }

  // Update left asymmetric panel
  const mod = MODULES[G.currentModule];
  if (mod) {
    const stageBadge = document.getElementById('intel-stage-badge');
    if (stageBadge) stageBadge.textContent = `// MODULE 0${G.currentModule + 1}`;
    const title = document.getElementById('intel-title');
    if (title) title.textContent = mod.title;
    const lore = document.getElementById('intel-lore');
    if (lore) lore.textContent = mod.subtitle;
    const counter = document.getElementById('intel-counter');
    if (counter) counter.textContent = `${G.currentQuestion + 1} / 3`;
  }
}

if (typeof window !== 'undefined') {
  window.HUD = {
    startHUD: initHUDController,
    initHUD: initHUDController,
    updateHUD: updateCockpitHUD
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.HUD;
}


