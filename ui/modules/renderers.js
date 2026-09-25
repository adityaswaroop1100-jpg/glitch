/* ═══════════════════════════════════════════════════════════════
   GLITCH MATRIX — MODULE RENDERERS (7 SPECIALIZED INTERFACES)
   ═══════════════════════════════════════════════════════════════ */

// Logo SVG Database for Module 1: Spot The Glitch (15 Logos)
function getLogoSvg(key) {
  switch (key) {
    case 'logo_nvidia': case 1:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#03080e"/>
        <path d="M 90 200 C 90 120, 150 90, 210 90 C 270 90, 310 130, 310 190 C 310 260, 250 290, 200 290 C 150 290, 120 250, 120 210" fill="none" stroke="#76b900" stroke-width="26" stroke-linecap="round"/>
        <path d="M 130 200 C 130 150, 170 130, 210 130 C 250 130, 275 160, 275 195 C 275 235, 235 255, 205 255" fill="none" stroke="#76b900" stroke-width="18" stroke-linecap="round"/>
        <!-- GLITCH: Red Hexagon pupil instead of black circle -->
        <polygon points="200,180 218,190 218,210 200,220 182,210 182,190" fill="#ff2a2a" stroke="#ff0055" stroke-width="3"/>
      </svg>`;
    case 'logo_snapchat': case 2:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#fffc00"/>
        <path d="M 200 90 C 145 90, 140 145, 140 190 C 140 220, 125 235, 115 240 C 105 245, 120 260, 145 252 C 160 248, 175 265, 185 272 C 195 278, 205 278, 215 272 C 225 265, 240 248, 255 252 C 280 260, 295 245, 285 240 C 275 235, 260 220, 260 190 C 260 145, 255 90, 200 90 Z" fill="#ffffff" stroke="#000000" stroke-width="10"/>
        <!-- GLITCH: Red Bowtie added at bottom -->
        <g transform="translate(200, 295)">
          <polygon points="-24,-12 0,0 -24,12" fill="#ff2a2a" stroke="#000" stroke-width="2"/>
          <polygon points="24,-12 0,0 24,12" fill="#ff2a2a" stroke="#000" stroke-width="2"/>
          <circle cx="0" cy="0" r="5" fill="#ff0055"/>
        </g>
      </svg>`;
    case 'logo_openai': case 3:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#101726"/>
        <g transform="translate(200,200)" stroke="#10a37f" stroke-width="14" fill="none" stroke-linecap="round">
          <path d="M 0 -85 A 60 60 0 0 1 65 -45 L 35 15"/>
          <path d="M 70 -35 A 60 60 0 0 1 70 55 L -10 25"/>
          <path d="M 70 35 A 60 60 0 0 1 -15 85 L -35 25"/>
          <path d="M 0 85 A 60 60 0 0 1 -65 45 L -35 -15"/>
          <!-- GLITCH: Broken disconnect gap on bottom-left -->
          <path d="M -70 35 A 60 60 0 0 1 -70 -10 L -45 -18" stroke-dasharray="25 20"/>
          <path d="M -70 -35 A 60 60 0 0 1 15 -85 L 35 -25"/>
        </g>
      </svg>`;
    case 'logo_android': case 4:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#0a0f1d"/>
        <line x1="140" y1="130" x2="115" y2="75" stroke="#3ddc84" stroke-width="12" stroke-linecap="round"/>
        <!-- GLITCH: Right antenna angled downward at 45 deg -->
        <line x1="260" y1="140" x2="305" y2="185" stroke="#ff2a2a" stroke-width="12" stroke-linecap="round"/>
        <path d="M 120 185 A 80 80 0 0 1 280 185 Z" fill="#3ddc84"/>
        <circle cx="160" cy="150" r="9" fill="#0a0f1d"/>
        <circle cx="240" cy="150" r="9" fill="#0a0f1d"/>
      </svg>`;
    case 'logo_xbox': case 5:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#0a0e17"/>
        <circle cx="200" cy="200" r="110" fill="#182232" stroke="#2a3a52" stroke-width="6"/>
        <!-- GLITCH: Blue glowing X instead of neon green -->
        <path d="M 130 130 Q 200 185 270 130 Q 220 200 270 270 Q 200 215 130 270 Q 180 200 130 130 Z" fill="#00d2ff" filter="drop-shadow(0 0 10px #00f0ff)"/>
      </svg>`;
    case 'logo_python': case 6:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#0c121e"/>
        <path d="M 195 100 L 155 100 C 130 100 120 115 120 140 L 120 170 L 205 170 L 205 185 L 105 185 C 80 185 70 205 70 235 L 70 250 C 70 275 85 295 115 295 L 140 295 L 140 265 C 140 245 155 230 175 230 L 235 230 C 255 230 270 215 270 195 L 270 140 C 270 115 250 100 225 100 Z" fill="#3776ab"/>
        <path d="M 205 300 L 245 300 C 270 300 280 285 280 260 L 280 230 L 195 230 L 195 215 L 295 215 C 320 215 330 195 330 165 L 330 150 C 330 125 315 105 285 105 L 260 105 L 260 135 C 260 155 245 170 225 170 L 165 170 C 145 170 130 185 130 205 L 130 260 C 130 285 150 300 175 300 Z" fill="#ffd43b"/>
        <!-- GLITCH: Blue snake eye is missing! -->
        <circle cx="245" cy="270" r="7" fill="#0c121e"/>
      </svg>`;
    case 'logo_discord': case 7:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#5865F2"/>
        <path d="M 270 130 C 250 120, 230 115, 210 112 C 208 116, 205 122, 203 127 C 180 123, 160 123, 137 127 C 135 122, 132 116, 130 112 C 110 115, 90 120, 70 130 C 35 185, 25 240, 30 290 C 55 310, 80 318, 105 318 C 112 308, 118 298, 123 287 C 105 280, 95 270, 90 260 C 95 264, 102 268, 110 272 C 150 290, 190 290, 230 272 C 238 268, 245 264, 250 260 C 245 270, 235 280, 217 287 C 222 298, 228 308, 235 318 C 260 318, 285 310, 310 290 C 315 235, 305 185, 270 130 Z" fill="#ffffff" transform="translate(30, -10) scale(0.85)"/>
        <circle cx="165" cy="190" r="16" fill="#5865F2"/>
        <circle cx="235" cy="190" r="16" fill="#5865F2"/>
        <!-- GLITCH: Frown instead of cheerful line -->
        <path d="M 180 230 Q 200 215 220 230" fill="none" stroke="#5865F2" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
    case 'logo_spotify': case 8:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#0e1520"/>
        <circle cx="200" cy="200" r="115" fill="#1ed760"/>
        <!-- GLITCH: 4 concentric sound waves instead of 3 -->
        <path d="M 125 155 Q 200 130 275 165" stroke="#000" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M 135 185 Q 200 162 265 192" stroke="#000" stroke-width="13" fill="none" stroke-linecap="round"/>
        <path d="M 145 215 Q 200 195 255 220" stroke="#000" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M 155 245 Q 200 228 245 248" stroke="#000" stroke-width="10" fill="none" stroke-linecap="round"/>
      </svg>`;
    case 'logo_github': case 9:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#ffffff"/>
        <path d="M 200 70 C 130 70, 75 125, 75 195 C 75 250, 110 295, 160 312 C 166 313, 168 309, 168 306 L 168 284 C 135 291, 128 268, 128 268 C 122 254, 114 250, 114 250 C 103 243, 115 243, 115 243 C 127 244, 133 256, 133 256 C 144 274, 161 269, 168 266 C 169 258, 172 253, 176 249 C 148 246, 118 235, 118 186 C 118 172, 123 161, 131 152 C 130 149, 125 135, 133 118 C 133 118, 144 114, 168 131 C 178 128, 189 127, 200 127 C 211 127, 222 128, 232 131 C 256 114, 267 118, 267 118 C 275 135, 270 149, 269 152 C 277 161, 282 172, 282 186 C 282 235, 252 246, 224 249 C 229 253, 233 261, 233 273 L 233 306 C 233 309, 235 313, 241 312 C 290 295, 325 250, 325 195 C 325 125, 270 70, 200 70 Z" fill="#24292e"/>
        <!-- GLITCH: 5th tentacle cut off completely with red indicator -->
        <rect x="188" y="275" width="24" height="24" fill="#ffffff" stroke="#ff2a2a" stroke-dasharray="3"/>
      </svg>`;
    case 'logo_linux': case 10:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#0d1424"/>
        <ellipse cx="200" cy="225" rx="65" ry="85" fill="#111827"/>
        <ellipse cx="200" cy="235" rx="42" ry="65" fill="#f9fafb"/>
        <ellipse cx="185" cy="140" rx="9" ry="14" fill="#fff"/><circle cx="186" cy="142" r="5" fill="#000"/>
        <ellipse cx="215" cy="140" rx="9" ry="14" fill="#fff"/><circle cx="214" cy="142" r="5" fill="#000"/>
        <polygon points="175,155 225,155 200,175" fill="#f59e0b"/>
        <!-- GLITCH: Left foot missing entirely -->
        <ellipse cx="235" cy="315" rx="28" ry="14" fill="#f59e0b"/>
        <circle cx="160" cy="315" r="14" fill="none" stroke="#ff2a2a" stroke-dasharray="4"/>
      </svg>`;
    case 'logo_vscode': case 11:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#181c2b"/>
        <path d="M 285 85 L 210 155 L 140 100 L 95 130 L 180 200 L 95 270 L 140 300 L 210 245 L 285 315 L 325 295 L 325 105 Z" fill="#007acc"/>
        <!-- GLITCH: Center fold is glowing purple instead of azure blue -->
        <polygon points="180,200 210,155 210,245" fill="#bf00ff" stroke="#ff00ea" stroke-width="2"/>
      </svg>`;
    case 'logo_docker': case 12:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#0a1220"/>
        <path d="M 80 240 C 95 200, 180 200, 240 215 C 290 225, 320 200, 340 180 C 335 220, 315 280, 240 280 C 160 280, 100 270, 80 240 Z" fill="#1d63ed"/>
        <circle cx="120" cy="235" r="5" fill="#fff"/>
        <rect x="145" y="180" width="22" height="18" fill="#0091ff" stroke="#0a1220" stroke-width="2"/>
        <rect x="170" y="180" width="22" height="18" fill="#0091ff" stroke="#0a1220" stroke-width="2"/>
        <rect x="195" y="180" width="22" height="18" fill="#0091ff" stroke="#0a1220" stroke-width="2"/>
        <!-- GLITCH: Topmost center container has Windows logo printed on it -->
        <g transform="translate(182, 155)">
          <rect x="0" y="0" width="24" height="20" fill="#f25022"/>
          <rect x="13" y="0" width="11" height="9" fill="#7fba00"/>
          <rect x="0" y="11" width="11" height="9" fill="#00a4ef"/>
          <rect x="13" y="11" width="11" height="9" fill="#ffb900"/>
        </g>
      </svg>`;
    case 'logo_bluetooth': case 13:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#0c1938"/>
        <ellipse cx="200" cy="200" rx="90" ry="130" fill="#0050d8" stroke="#003594" stroke-width="6"/>
        <!-- GLITCH: Missing diagonal cross-line creating a closed loop at bottom -->
        <path d="M 200 110 L 200 290 L 250 245 L 200 200 L 200 290" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="200" y1="200" x2="250" y2="155" stroke="#fff" stroke-width="16" stroke-linecap="round"/>
        <line x1="250" y1="155" x2="200" y2="110" stroke="#fff" stroke-width="16" stroke-linecap="round"/>
      </svg>`;
    case 'logo_steam': case 14:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#171a21"/>
        <circle cx="200" cy="200" r="115" fill="#1b2838" stroke="#2a475e" stroke-width="6"/>
        <path d="M 155 245 L 210 200 L 265 170" stroke="#66c0f4" stroke-width="20" stroke-linecap="round"/>
        <circle cx="265" cy="170" r="32" fill="none" stroke="#66c0f4" stroke-width="12"/>
        <circle cx="155" cy="245" r="22" fill="#66c0f4"/>
        <!-- GLITCH: Joint rivets colored neon red -->
        <circle cx="200" cy="200" r="6" fill="#ff0055"/>
        <circle cx="210" cy="190" r="5" fill="#ff0055"/>
        <circle cx="190" cy="210" r="5" fill="#ff0055"/>
      </svg>`;
    case 'logo_wifi': case 15:
    default:
      return `<svg class="logo-glitch-svg" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#080e1a"/>
        <circle cx="200" cy="200" r="110" fill="#ffffff"/>
        <path d="M 200 90 A 110 110 0 0 1 200 310 C 260 310 260 200 200 200 Z" fill="#000000"/>
        <path d="M 130 190 A 70 70 0 0 1 200 120" stroke="#000" stroke-width="12" fill="none" stroke-linecap="round"/>
        <!-- GLITCH: Bluetooth B rune silhouette placed inside black half -->
        <g transform="translate(245, 160) scale(0.6)">
          <path d="M 0 0 L 0 60 L 20 45 L 0 30 L 20 15 L 0 0 Z" fill="#00f0ff" stroke="#fff" stroke-width="4"/>
        </g>
      </svg>`;
  }
}

// ═══════════════════════════════════════════════════════════════
// MODULE 1: SPOT THE GLITCH (Interrogation Mood)
// ═══════════════════════════════════════════════════════════════
function renderSpotGlitch(mod, q, container) {
  document.body.setAttribute('data-mood', 'interrogation');
  const targetX = q.hit_center?.x ?? 0.50;
  const targetY = q.hit_center?.y ?? 0.50;
  const hitRadius = q.hit_center?.radius ?? 0.20;
  const imgSrc = q.image || 'assets/glitches/nvidia_glitch.jpg';

  container.innerHTML = `
    <div class="challenge-prompt-header">
      <div class="prompt-tag">// OPTICAL RECON SCAN // ${q.brand ? q.brand.toUpperCase() : 'TARGET IDENT'}</div>
      <div class="prompt-main-text">${q.prompt}</div>
    </div>

    <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);margin-bottom:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
      <span>CORRUPTION TYPE: <strong style="color:var(--magenta);">${q.glitch_type || 'TEXTURE ANOMALY'}</strong></span>
      <span id="spot-hud-coords" style="color:var(--cyan);font-weight:700;">SCANNER [X: 50% | Y: 50%] // READY</span>
      <span>DIFFICULTY: <strong style="color:var(--lime);">${q.difficulty ? q.difficulty.toUpperCase() : 'NORMAL'}</strong></span>
    </div>

    <div class="glitch-camera-viewport" id="spot-glitch-viewport" style="position:relative;border:1px solid var(--line-bright);border-radius:4px;overflow:hidden;background:#03070d;margin-bottom:18px;display:flex;align-items:center;justify-content:center;min-height:340px;cursor:crosshair;">
      <div class="camera-bracket bracket-tl"></div>
      <div class="camera-bracket bracket-tr"></div>
      <div class="camera-bracket bracket-bl"></div>
      <div class="camera-bracket bracket-br"></div>
      
      <!-- Optical Reticle Tracking Overlay -->
      <div id="spot-scanner-reticle" style="position:absolute;width:48px;height:48px;border:1.5px solid var(--cyan);border-radius:50%;pointer-events:none;transform:translate(-50%, -50%);display:none;z-index:25;box-shadow:0 0 14px rgba(0,229,255,0.45);transition:border-color 0.15s, box-shadow 0.15s;">
        <div style="position:absolute;top:50%;left:-10px;right:-10px;height:1px;background:rgba(0,229,255,0.6);"></div>
        <div style="position:absolute;left:50%;top:-10px;bottom:-10px;width:1px;background:rgba(0,229,255,0.6);"></div>
        <div style="position:absolute;top:50%;left:50%;width:6px;height:6px;background:var(--cyan);border-radius:50%;transform:translate(-50%, -50%);"></div>
      </div>

      <!-- High-Precision Image Frame -->
      <div id="spot-image-wrapper" style="position:relative;display:inline-block;max-width:100%;max-height:350px;">
        <img id="spot-glitch-img" src="${imgSrc}" alt="${q.brand}" style="max-height:350px;max-width:100%;object-fit:contain;border-radius:4px;display:block;user-select:none;pointer-events:none;box-shadow:0 0 30px rgba(0,0,0,0.85);"/>
        
        <!-- Target Anomaly Reveal Ring -->
        <div id="spot-target-highlight" style="position:absolute;width:68px;height:68px;border:2.5px solid var(--lime);border-radius:50%;pointer-events:none;transform:translate(-50%, -50%);display:none;z-index:20;left:${targetX * 100}%;top:${targetY * 100}%;">
          <span style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-family:var(--font-mono);font-size:0.65rem;color:var(--lime);white-space:nowrap;background:rgba(5,7,10,0.85);padding:2px 6px;border-radius:2px;border:1px solid var(--lime);">ANOMALY LOCKED</span>
        </div>

        <!-- Laser Hitbox Interactive Layer -->
        <div id="spot-glitch-hitbox" style="position:absolute;inset:0;cursor:crosshair;z-index:15;"></div>
      </div>
    </div>

    <!-- Dual Input Mode: Tactical Sector Inspection Chips -->
    <div style="margin-bottom:18px;">
      <div class="prompt-tag" style="color:var(--text-dim);margin-bottom:8px;">// TACTICAL ANOMALY CLASSIFICATION (CLICK IMAGE OR SELECT SECTOR):</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;">
        ${(q.options || []).map((opt, i) => `
          <button class="circuit-chip-btn option-btn spot-chip-btn" data-opt="${opt.replace(/"/g, '&quot;')}" onclick="window.handleSpotOption(this, '${opt.replace(/'/g, "\\'")}', '${q.answer ? q.answer.replace(/'/g, "\\'") : ''}')">
            [${String.fromCharCode(65 + i)}] ${opt}
          </button>
        `).join('')}
      </div>
    </div>

    <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);background:rgba(0,229,255,0.05);border:1px solid var(--line);padding:10px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <div><span style="color:var(--cyan);font-weight:700;">TACTICAL DIRECTIVE:</span> Click directly on the anomaly in the scanner OR select the matching sector chip above.</div>
      <button class="btn-cyber danger" style="padding:6px 14px;font-size:0.75rem;" onclick="skipQuestion()">[ SKIP QUESTION ]</button>
    </div>
  `;

  const hitbox = document.getElementById('spot-glitch-hitbox');
  const reticle = document.getElementById('spot-scanner-reticle');
  const coordsLabel = document.getElementById('spot-hud-coords');
  const highlight = document.getElementById('spot-target-highlight');

  if (hitbox) {
    hitbox.onmouseenter = () => { if (reticle) reticle.style.display = 'block'; };
    hitbox.onmouseleave = () => { if (reticle) reticle.style.display = 'none'; };

    hitbox.onmousemove = (e) => {
      const rect = hitbox.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;

      if (reticle) {
        reticle.style.left = (e.clientX - rect.left) + 'px';
        reticle.style.top = (e.clientY - rect.top) + 'px';
      }

      const dist = Math.hypot(xPct - targetX, yPct - targetY);
      const isNear = dist <= (hitRadius + 0.05);

      if (coordsLabel) {
        coordsLabel.textContent = `SCANNER [X: ${Math.round(xPct * 100)}% | Y: ${Math.round(yPct * 100)}%] ${isNear ? '⚠ ANOMALY NEAR' : 'ACTIVE'}`;
        coordsLabel.style.color = isNear ? 'var(--amber)' : 'var(--cyan)';
      }

      if (reticle) {
        if (isNear) {
          reticle.style.borderColor = 'var(--amber)';
          reticle.style.boxShadow = '0 0 16px rgba(255,184,0,0.6)';
        } else {
          reticle.style.borderColor = 'var(--cyan)';
          reticle.style.boxShadow = '0 0 14px rgba(0,229,255,0.45)';
        }
      }
    };

    hitbox.onclick = (e) => {
      if (window.G.answerLocked) return;
      window.G.answerLocked = true;

      const rect = hitbox.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;
      const dist = Math.hypot(clickX - targetX, clickY - targetY);
      const isHit = dist <= hitRadius;

      if (highlight) {
        highlight.style.display = 'block';
        highlight.style.borderColor = isHit ? 'var(--lime)' : 'var(--red)';
        highlight.style.boxShadow = isHit ? '0 0 25px rgba(124,255,61,0.7)' : '0 0 25px rgba(255,59,48,0.7)';
        const tag = highlight.querySelector('span');
        if (tag) {
          tag.textContent = isHit ? 'CORRUPTION PURGED ✓' : 'CORRUPTION DETECTED HERE ⚠';
          tag.style.color = isHit ? 'var(--lime)' : 'var(--red)';
          tag.style.borderColor = isHit ? 'var(--lime)' : 'var(--red)';
        }
      }

      if (isHit) {
        if (window.AudioGraph) window.AudioGraph.playTone(880, 0.12, 'sine', 0.15);
        if (window.FX) {
          window.FX.spawnBurst(e.clientX, e.clientY, '#7cff3d', 35);
          window.FX.spawnShockwave(e.clientX, e.clientY, '#7cff3d');
        }
        window.onCorrectAnswer(1, hitbox);
        window.showFeedback(q.successMsg || "ANOMALY ISOLATED & PURGED ✓", true);

        // Highlight matching chip button
        document.querySelectorAll('.spot-chip-btn').forEach(btn => {
          if (btn.dataset.opt === q.answer) btn.classList.add('success');
        });

        setTimeout(window.advanceQuestion, 1200);
      } else {
        if (window.AudioGraph) window.AudioGraph.playWrong();
        if (window.FX) window.FX.spawnShockwave(e.clientX, e.clientY, '#ff3b30');
        window.onWrongAnswer();
        window.showFeedback("MISALIGNED — REVEALING ANOMALY", false);

        // Highlight correct chip button
        document.querySelectorAll('.spot-chip-btn').forEach(btn => {
          if (btn.dataset.opt === q.answer) btn.classList.add('success');
        });

        setTimeout(window.advanceQuestion, 1400);
      }
    };
  }
}

window.handleSpotOption = function(btn, selected, answer) {
  if (window.G.answerLocked) return;
  window.G.answerLocked = true;
  const correct = selected === answer;

  const highlight = document.getElementById('spot-target-highlight');
  if (highlight) {
    highlight.style.display = 'block';
    highlight.style.borderColor = correct ? 'var(--lime)' : 'var(--red)';
    highlight.style.boxShadow = correct ? '0 0 25px rgba(124,255,61,0.7)' : '0 0 25px rgba(255,59,48,0.7)';
    const tag = highlight.querySelector('span');
    if (tag) {
      tag.textContent = correct ? 'CORRUPTION PURGED ✓' : 'CORRUPTION DETECTED HERE ⚠';
      tag.style.color = correct ? 'var(--lime)' : 'var(--red)';
      tag.style.borderColor = correct ? 'var(--lime)' : 'var(--red)';
    }
  }

  btn.classList.add(correct ? 'success' : 'danger');

  if (correct) {
    if (window.AudioGraph) window.AudioGraph.playCorrect();
    const rect = btn.getBoundingClientRect();
    if (window.FX) window.FX.spawnBurst(rect.left + rect.width / 2, rect.top, '#7cff3d', 30);
    window.onCorrectAnswer(1, btn);
    window.showFeedback("ANOMALY CLASSIFIED ✓", true);
    setTimeout(window.advanceQuestion, 1200);
  } else {
    window.onWrongAnswer();
    window.showFeedback("INCORRECT CLASSIFICATION", false);
    document.querySelectorAll('.spot-chip-btn').forEach(b => {
      if (b.dataset.opt === answer) b.classList.add('success');
    });
    setTimeout(window.advanceQuestion, 1400);
  }
};


// ═══════════════════════════════════════════════════════════════
// MODULE 2: EMOJI DECODE (Neon Arcade Mood)
// ═══════════════════════════════════════════════════════════════
function renderEmojiDecode(mod, q, container) {
  document.body.setAttribute('data-mood', 'arcade');
  const { html: optHTML } = window.optionsHTML(q.options, q.answer);
  container.innerHTML = `
    <div class="challenge-prompt-header">
      <div class="prompt-tag">// INTERCEPTED CYPHER TRANSMISSION</div>
      <div class="prompt-main-text">${q.prompt}</div>
    </div>

    <div class="emoji-nodes-track" style="display:flex;align-items:center;justify-content:center;gap:12px;margin:24px 0;">
      ${q.emojis.map((e, i) => `
        <div class="emoji-node-circle" id="node-${i}" style="width:70px;height:70px;display:flex;align-items:center;justify-content:center;font-size:2.2rem;background:rgba(255,45,149,0.08);border:2px solid rgba(255,45,149,0.4);border-radius:50%;box-shadow:0 0 15px rgba(255,45,149,0.2);">
          <span>${e}</span>
        </div>
        ${i < q.emojis.length - 1 ? '<div class="node-dash-connector" style="width:24px;height:2px;background:rgba(255,45,149,0.3);"></div>' : ''}
      `).join('')}
    </div>

    ${q.hint ? `
    <div style="max-width:540px;margin:0 auto 16px auto;font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);background:rgba(255,45,149,0.06);border:1px solid rgba(255,45,149,0.25);padding:10px 16px;text-align:center;">
      <span style="color:var(--magenta);font-weight:700;">HINT LOG:</span> ${q.hint}
    </div>` : ''}

    <div id="options-container">${optHTML}</div>
  `;
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// MODULE 3: UNSCRAMBLE (Mechanical Workshop Mood)
// ═══════════════════════════════════════════════════════════════
function getDerangedLetters(q) {
  const ansUpper = q.answer.toUpperCase().replace(/[^A-Z]/g, '');
  let letters = (q.scrambled && q.scrambled.length === ansUpper.length) ? [...q.scrambled] : ansUpper.split('');
  
  let attempts = 0;
  while ((letters.join('') === ansUpper || (letters.length > 3 && letters[0] === ansUpper[0] && letters[1] === ansUpper[1])) && attempts < 30) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    attempts++;
  }
  return letters;
}

function renderUnscramble(mod, q, container) {
  document.body.setAttribute('data-mood', 'mechanical');
  const ansUpper = q.answer.toUpperCase();
  window.G.unscrambleAnswer = new Array(ansUpper.length).fill(null);
  window.G.unscrambleUsed = [];
  const scrambledList = getDerangedLetters(q);

  container.innerHTML = `
    <div class="challenge-prompt-header">
      <div class="prompt-tag">// SCRAMBLED DATA SECTOR</div>
      <div class="prompt-main-text">${q.prompt}</div>
    </div>

    ${q.hint ? `
    <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);margin-bottom:14px;text-align:center;">
      <span style="color:var(--amber);font-weight:700;">SECTOR HINT:</span> ${q.hint}
    </div>` : ''}

    <!-- Recessed Target Sockets -->
    <div class="socket-slots-row" id="unscramble-sockets" style="display:flex;justify-content:center;gap:10px;margin:22px 0;">
      ${ansUpper.split('').map((_, i) => `
        <div class="socket-slot" id="uslot-${i}" onclick="window.removeLetterFromSlot(${i})" style="width:48px;height:54px;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:1.4rem;font-weight:900;border:2px dashed rgba(255,184,0,0.4);border-radius:4px;background:rgba(26,35,50,0.5);color:var(--amber);cursor:pointer;"></div>
      `).join('')}
    </div>

    <!-- Letter Keycaps Rack -->
    <div class="keycap-rack" id="unscramble-keycaps" style="display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:18px 0;">
      ${scrambledList.map((char, i) => `
        <button class="letter-keycap btn-cyber" id="keycap-${i}" data-char="${char}" onclick="window.placeKeycap('${char}', ${i})" style="min-width:48px;height:50px;font-size:1.25rem;">${char}</button>
      `).join('')}
    </div>

    <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-dim);text-align:center;margin-top:10px;">
      💡 TIP: Click tiles or type on your physical keyboard to place letters! Press [Backspace] to undo.
    </div>

    <div style="display:flex;justify-content:center;gap:14px;margin-top:18px;">
      <button class="btn-cyber danger" onclick="skipQuestion()">[ SKIP QUESTION ]</button>
      <button class="btn-cyber" onclick="window.clearUnscramble()">[ CLEAR SLOTS ]</button>
      <button class="btn-cyber success" onclick="window.submitUnscramble()">[ VERIFY WORD ]</button>
    </div>
  `;
}

window.placeKeycap = function(char, idx) {
  if (window.G.answerLocked || window.G.unscrambleUsed.includes(idx)) return;
  const firstEmpty = window.G.unscrambleAnswer.indexOf(null);
  if (firstEmpty === -1) return;

  if (window.AudioGraph) window.AudioGraph.playMechanicalClack();
  window.G.unscrambleAnswer[firstEmpty] = { char, keycapIdx: idx };
  window.G.unscrambleUsed.push(idx);

  const slot = document.getElementById('uslot-' + firstEmpty);
  if (slot) {
    slot.textContent = char;
    slot.style.borderStyle = 'solid';
    slot.style.borderColor = 'var(--amber)';
    slot.style.background = 'rgba(255,184,0,0.12)';
  }
  const cap = document.getElementById('keycap-' + idx);
  if (cap) {
    cap.style.opacity = '0.25';
    cap.style.pointerEvents = 'none';
  }

  if (!window.G.unscrambleAnswer.includes(null)) {
    setTimeout(window.submitUnscramble, 300);
  }
};

window.removeLetterFromSlot = function(slotIdx) {
  if (window.G.answerLocked || !window.G.unscrambleAnswer[slotIdx]) return;
  if (window.AudioGraph) window.AudioGraph.playClick();
  const item = window.G.unscrambleAnswer[slotIdx];
  window.G.unscrambleAnswer[slotIdx] = null;
  window.G.unscrambleUsed = window.G.unscrambleUsed.filter(i => i !== item.keycapIdx);

  const slot = document.getElementById('uslot-' + slotIdx);
  if (slot) {
    slot.textContent = '';
    slot.style.borderStyle = 'dashed';
    slot.style.borderColor = 'rgba(255,184,0,0.4)';
    slot.style.background = 'rgba(26,35,50,0.5)';
  }
  const cap = document.getElementById('keycap-' + item.keycapIdx);
  if (cap) {
    cap.style.opacity = '1';
    cap.style.pointerEvents = 'auto';
  }
};

window.clearUnscramble = function() {
  const q = window.getCurrentQuestion();
  renderUnscramble(window.MODULES[window.G.currentModule], q, document.getElementById('game-content'));
};

window.submitUnscramble = function() {
  if (window.G.answerLocked) return;
  const q = window.getCurrentQuestion();
  const entered = window.G.unscrambleAnswer.map(x => x ? x.char : '').join('').toUpperCase();
  const correct = entered === q.answer.toUpperCase();

  window.G.answerLocked = true;
  if (correct) {
    window.onCorrectAnswer(1, document.getElementById('unscramble-sockets'));
    window.showFeedback(q.successMsg || "WORD RESTORED ✓", true);
    setTimeout(window.advanceQuestion, 1200);
  } else {
    // Reveal correct solution in red
    const sockets = document.querySelectorAll('.socket-slot');
    q.answer.toUpperCase().split('').forEach((ch, idx) => {
      if (sockets[idx]) {
        sockets[idx].textContent = ch;
        sockets[idx].style.color = 'var(--red)';
        sockets[idx].style.borderColor = 'var(--red)';
        sockets[idx].style.borderStyle = 'solid';
      }
    });
    window.onWrongAnswer();
    window.showFeedback("CORRUPT (" + q.answer.toUpperCase() + ") — ADVANCING TO NEXT", false);
    setTimeout(window.advanceQuestion, 1400);
  }
};

// ═══════════════════════════════════════════════════════════════
// MODULE 4: ODD ONE OUT (Pressure Chamber Mood)
// ═══════════════════════════════════════════════════════════════
function renderOddOneOut(mod, q, container) {
  document.body.setAttribute('data-mood', 'pressure');
  window.G.oddTimeLeft = 8;
  const circumference = 2 * Math.PI * 46;

  // Shuffle display items so the outlier isn't always in the same position
  const displayItems = [...q.items];
  for (let i = displayItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [displayItems[i], displayItems[j]] = [displayItems[j], displayItems[i]];
  }
  window.G.currentOddItems = displayItems;

  container.innerHTML = `
    <div class="challenge-prompt-header">
      <div class="prompt-tag">// RAPID OUTLIER EXPULSION (8.00s LIMIT)</div>
      <div class="prompt-main-text">${q.prompt}</div>
    </div>

    <div class="odd-circle-timer-box" id="odd-timer-box" style="position:relative;width:110px;height:110px;margin:16px auto;display:flex;align-items:center;justify-content:center;">
      <svg class="timer-svg-ring" width="110" height="110" style="transform:rotate(-90deg);">
        <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="6"/>
        <circle id="odd-ring-bar" cx="55" cy="55" r="46" fill="none" stroke="var(--amber)" stroke-width="6"
          stroke-dasharray="${circumference}" stroke-dashoffset="0" style="transition:stroke-dashoffset 0.05s linear;"/>
      </svg>
      <div id="odd-ring-text" style="position:absolute;font-family:var(--font-display);font-size:1.8rem;font-weight:900;color:var(--amber);">8</div>
    </div>

    ${q.hint ? `
    <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-dim);text-align:center;margin-bottom:18px;">
      <span style="color:var(--amber);font-weight:700;">RADAR HINT:</span> ${q.hint}
    </div>` : ''}

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;" id="odd-options-grid">
      ${displayItems.map((item, i) => `
        <button class="circuit-chip-btn option-btn" id="odd-btn-${i}" data-val="${item.replace(/"/g, '&quot;')}" onclick="window.handleOddSelection(this, ${i})">
          [${i+1}] ${item}
        </button>
      `).join('')}
    </div>

    <div style="display:flex;justify-content:center;margin-top:20px;">
      <button class="btn-cyber danger" style="padding:8px 18px;font-size:0.75rem;" onclick="skipQuestion()">[ FORFEIT / SKIP QUESTION ]</button>
    </div>
  `;

  if (window.G.oddTimer) clearInterval(window.G.oddTimer);
  const startTime = Date.now();
  const totalMs = 8000;

  window.G.oddTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remainingMs = Math.max(0, totalMs - elapsed);
    const secs = Math.ceil(remainingMs / 1000);
    const offset = circumference * (1 - (remainingMs / totalMs));

    const ringBar = document.getElementById('odd-ring-bar');
    const ringText = document.getElementById('odd-ring-text');

    if (ringBar) ringBar.style.strokeDashoffset = offset;
    if (ringText) ringText.textContent = secs;

    if (secs <= 3) {
      if (ringBar) ringBar.style.stroke = 'var(--red)';
      if (ringText) ringText.style.color = 'var(--red)';
      if (window.AudioGraph) window.AudioGraph.playTone(700, 0.03, 'sine', 0.04);
    }

    if (remainingMs <= 0) {
      clearInterval(window.G.oddTimer);
      window.G.oddTimer = null;
      if (!window.G.answerLocked) {
        window.G.answerLocked = true;
        const normAns = String(q.answer).trim().toLowerCase();
        const allBtns = document.querySelectorAll('#odd-options-grid .circuit-chip-btn');
        allBtns.forEach(b => {
          b.style.pointerEvents = 'none';
          if (String(b.getAttribute('data-val')).trim().toLowerCase() === normAns) {
            b.classList.add('success');
          }
        });
        window.onWrongAnswer();
        window.showFeedback("TIME EXPIRED (" + q.answer + ") — ADVANCING TO NEXT", false);
        setTimeout(window.advanceQuestion, 1200);
      }
    }
  }, 50);
}

window.handleOddSelection = function(btn, idx) {
  if (window.G.answerLocked) return;
  window.G.answerLocked = true;
  if (window.G.oddTimer) { clearInterval(window.G.oddTimer); window.G.oddTimer = null; }

  const q = window.getCurrentQuestion();
  const currentItems = window.G.currentOddItems || q.items;
  const selectedItem = btn.getAttribute('data-val') || currentItems[idx];
  const normAns = String(q.answer).trim().toLowerCase();
  const normSelected = String(selectedItem).trim().toLowerCase();
  const correct = normSelected === normAns || (typeof q.answer === 'number' && idx === q.answer);

  // Freeze all buttons & highlight correct answer
  const allBtns = document.querySelectorAll('#odd-options-grid .circuit-chip-btn');
  allBtns.forEach(b => {
    b.style.pointerEvents = 'none';
    if (String(b.getAttribute('data-val')).trim().toLowerCase() === normAns) {
      b.classList.add('success');
    }
  });

  if (correct) {
    btn.classList.add('success');
    window.onCorrectAnswer(1, btn);
    window.showFeedback(q.successMsg || "OUTLIER ISOLATED ✓", true);
    setTimeout(window.advanceQuestion, 1200);
  } else {
    btn.classList.add('danger');
    window.onWrongAnswer();
    window.showFeedback("INCORRECT (" + q.answer + ") — ADVANCING TO NEXT", false);
    setTimeout(window.advanceQuestion, 1200);
  }
};

// ═══════════════════════════════════════════════════════════════
// MODULE 5: TECH RIDDLE (Vault Terminal Mood)
// ═══════════════════════════════════════════════════════════════
function renderTechRiddle(mod, q, container) {
  document.body.setAttribute('data-mood', 'vault');
  const { html: optHTML } = window.optionsHTML(q.options, q.answer);
  container.innerHTML = `
    <div class="challenge-prompt-header">
      <div class="prompt-tag">// ENCRYPTED RIDDLE BUFFER</div>
    </div>

    <div class="terminal-riddle-box" style="background:#020508;border:1px solid var(--lime);border-radius:4px;padding:22px;font-family:var(--font-mono);font-size:1.05rem;line-height:1.7;color:var(--lime);box-shadow:0 0 15px rgba(124,255,61,0.15);min-height:90px;position:relative;margin-bottom:20px;">
      <div id="riddle-stream-text" style="display:inline;"></div>
      <span class="terminal-cursor-block" style="display:inline-block;width:10px;height:1.1em;background:var(--lime);vertical-align:middle;animation:recBlink 0.6s infinite alternate;"></span>
    </div>

    <div id="riddle-options-box" style="display:none;">${optHTML}</div>
  `;

  const targetText = q.prompt;
  let charIdx = 0;
  const streamEl = document.getElementById('riddle-stream-text');

  function typeChar() {
    if (charIdx < targetText.length) {
      if (streamEl) streamEl.textContent += targetText[charIdx];
      charIdx++;
      if (Math.random() < 0.25 && window.AudioGraph) window.AudioGraph.playTone(450 + Math.random() * 200, 0.015, 'sine', 0.02);
      setTimeout(typeChar, 16 + Math.random() * 20);
    } else {
      const optBox = document.getElementById('riddle-options-box');
      if (optBox) optBox.style.display = 'block';
    }
  }
  setTimeout(typeChar, 180);
}

// ═══════════════════════════════════════════════════════════════
// MODULE 6: TECH SEQUENCE (Circuit Floor Mood)
// ═══════════════════════════════════════════════════════════════
function renderTechSequence(mod, q, container) {
  document.body.setAttribute('data-mood', 'circuit');
  const correctOrder = q.correctOrder || q.correct_order || [];
  const options = q.items || q.scrambled_options || q.scrambled || [];
  const totalStages = correctOrder.length;
  window.G.sequenceSlots = new Array(totalStages).fill(null);
  window.G.sequenceUsed = [];

  container.innerHTML = `
    <div class="challenge-prompt-header">
      <div class="prompt-tag">// PIPELINE RECONSTRUCTION (${totalStages} PHASES)</div>
      <div class="prompt-main-text">${q.prompt}</div>
    </div>

    <div class="pcb-circuit-bg" style="margin-bottom:20px;">
      <div class="prompt-tag" style="color:var(--cyan);margin-bottom:12px;">EXECUTION PIPELINE SEQUENCE:</div>
      <div class="seq-stage-slots" id="seq-stage-slots" style="display:flex;flex-direction:column;gap:8px;">
        ${correctOrder.map((_, i) => `
          <div class="stage-slot-bar" id="seq-slot-${i}" onclick="window.clearSequenceSlot(${i})" style="display:flex;align-items:center;gap:14px;padding:12px 18px;background:var(--bg-elevated);border:1px solid var(--line-bright);border-radius:4px;cursor:pointer;">
            <span class="stage-slot-num" style="font-family:var(--font-mono);font-size:0.75rem;color:var(--cyan);font-weight:700;">STAGE 0${i+1}</span>
            <span class="stage-slot-val" style="color:var(--text-mute);font-family:var(--font-mono);font-size:0.88rem;">[ EMPTY STAGE — CLICK STEP BELOW ]</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="margin:20px 0;">
      <div class="prompt-tag">// AVAILABLE PIPELINE STEPS (CLICK TO ALLOCATE):</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;" id="seq-chips-container">
        ${options.map((opt, i) => `
          <button class="circuit-chip-btn option-btn" id="seq-chip-${i}" onclick="window.assignSequenceStep('${opt.replace(/'/g, "\\'")}', ${i})">
            [+] ${opt}
          </button>
        `).join('')}
      </div>
    </div>

    <div style="display:flex;justify-content:center;gap:14px;margin-top:20px;">
      <button class="btn-cyber danger" onclick="skipQuestion()">[ SKIP QUESTION ]</button>
      <button class="btn-cyber" onclick="window.resetSequence()">[ CLEAR PIPELINE ]</button>
      <button class="btn-cyber success" onclick="window.submitSequence()">[ COMMIT PIPELINE ]</button>
    </div>
  `;
}

window.assignSequenceStep = function(opt, chipIdx) {
  if (window.G.answerLocked || window.G.sequenceUsed.includes(chipIdx)) return;
  const firstEmpty = window.G.sequenceSlots.indexOf(null);
  if (firstEmpty === -1) return;

  if (window.AudioGraph) window.AudioGraph.playClick();
  window.G.sequenceSlots[firstEmpty] = { opt, chipIdx };
  window.G.sequenceUsed.push(chipIdx);

  const slot = document.getElementById('seq-slot-' + firstEmpty);
  if (slot) {
    const val = slot.querySelector('.stage-slot-val');
    if (val) {
      val.textContent = opt;
      val.style.color = 'var(--text)';
      val.style.fontWeight = '700';
    }
    slot.style.borderColor = 'var(--cyan)';
    slot.style.background = 'rgba(0, 229, 255, 0.08)';
  }
  const chip = document.getElementById('seq-chip-' + chipIdx);
  if (chip) {
    chip.style.opacity = '0.3';
    chip.style.pointerEvents = 'none';
  }

  // Auto-evaluate when all slots filled
  if (!window.G.sequenceSlots.includes(null)) {
    setTimeout(window.submitSequence, 350);
  }
};

window.clearSequenceSlot = function(slotIdx) {
  if (window.G.answerLocked || !window.G.sequenceSlots[slotIdx]) return;
  if (window.AudioGraph) window.AudioGraph.playClick();
  const item = window.G.sequenceSlots[slotIdx];
  window.G.sequenceSlots[slotIdx] = null;
  window.G.sequenceUsed = window.G.sequenceUsed.filter(i => i !== item.chipIdx);

  const slot = document.getElementById('seq-slot-' + slotIdx);
  if (slot) {
    const val = slot.querySelector('.stage-slot-val');
    if (val) {
      val.textContent = '[ EMPTY STAGE — CLICK STEP BELOW ]';
      val.style.color = 'var(--text-mute)';
      val.style.fontWeight = '400';
    }
    slot.style.borderColor = 'var(--line-bright)';
    slot.style.background = 'var(--bg-elevated)';
  }
  const chip = document.getElementById('seq-chip-' + item.chipIdx);
  if (chip) {
    chip.style.opacity = '1';
    chip.style.pointerEvents = 'auto';
  }
};

window.resetSequence = function() {
  const q = window.getCurrentQuestion();
  renderTechSequence(window.MODULES[window.G.currentModule], q, document.getElementById('game-content'));
};

window.submitSequence = function() {
  if (window.G.answerLocked) return;
  const q = window.getCurrentQuestion();
  const correctOrder = q.correctOrder || q.correct_order || [];
  const currentPipeline = window.G.sequenceSlots.map(s => s ? s.opt : '');
  const isComplete = currentPipeline.every(s => s && s.length > 0);
  const isCorrect = isComplete && (JSON.stringify(currentPipeline) === JSON.stringify(correctOrder));

  window.G.answerLocked = true;

  if (isCorrect) {
    const slots = document.querySelectorAll('.stage-slot-bar');
    slots.forEach(s => {
      s.style.borderColor = 'var(--lime)';
      s.style.background = 'rgba(124, 255, 61, 0.12)';
    });
    window.onCorrectAnswer(1, document.getElementById('seq-stage-slots'));
    window.showFeedback(q.successMsg || "PIPELINE RESTORED ✓", true);
    setTimeout(window.advanceQuestion, 1200);
  } else {
    // Show correct order immediately and advance without getting stuck!
    const slots = document.querySelectorAll('.stage-slot-bar');
    slots.forEach((s, idx) => {
      s.style.borderColor = 'var(--red)';
      s.style.background = 'rgba(255, 59, 48, 0.14)';
      const val = s.querySelector('.stage-slot-val');
      if (val && correctOrder[idx]) {
        val.innerHTML = `<span style="text-decoration:line-through;color:var(--red);margin-right:8px;">${currentPipeline[idx] || 'VACANT'}</span> <span style="color:var(--lime);font-weight:700;">✓ ${correctOrder[idx]}</span>`;
      }
    });
    window.onWrongAnswer();
    window.showFeedback("INCORRECT SEQUENCE — ADVANCING TO NEXT", false);
    setTimeout(window.advanceQuestion, 1400);
  }
};

// ═══════════════════════════════════════════════════════════════
// MODULE 7: GUESS TECH (Server Cathedral Mood)
// ═══════════════════════════════════════════════════════════════
function renderGuessTech(mod, q, container) {
  document.body.setAttribute('data-mood', 'cathedral');
  window.G.cluesRevealed = 1;
  window.G.guessing = false;
  renderGuessTechView(mod, q, container, 1, false);
}

function renderGuessTechView(mod, q, container, cluesRevealed, guessing) {
  const maxClues = (q.clues && q.clues.length) || 3;
  const multiplier = Math.max(1, maxClues + 1 - cluesRevealed);
  const { html: optHTML } = window.optionsHTML(q.options, q.answer);

  const imageHTML = q.image ? `
    <div style="margin:16px 0;position:relative;background:#000;border:1px solid var(--line);text-align:center;padding:12px;border-radius:4px;">
      <img src="${q.image}" alt="Visual Clue" style="max-height:220px;max-width:100%;object-fit:contain;" onerror="this.style.display='none'"/>
      <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--cyan);margin-top:6px;">EVIDENCE LOG: ${q.cropArea || 'SECTOR SCAN'}</div>
    </div>
  ` : '';

  let cluesHTML = '';
  for (let i = 0; i < maxClues; i++) {
    if (i < cluesRevealed) {
      cluesHTML += `
        <div class="classified-clue-card" style="margin-bottom:10px;padding:12px 16px;background:var(--bg-elevated);border-left:3px solid var(--lime);border-radius:2px;">
          <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--lime);margin-bottom:4px;">INTEL DOSSIER // DECRYPTED CLUE 0${i+1}</div>
          <div style="font-size:0.95rem;color:var(--text);font-weight:600;">${q.clues[i]}</div>
        </div>
      `;
    } else {
      cluesHTML += `
        <div class="classified-clue-card locked" style="margin-bottom:10px;padding:12px 16px;background:rgba(18,24,38,0.5);border-left:3px solid var(--text-dim);border-radius:2px;">
          <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-dim);margin-bottom:4px;">INTEL DOSSIER // CLUE 0${i+1} [CLASSIFIED]</div>
          <div style="font-size:0.9rem;color:var(--text-mute);font-family:var(--font-mono);"><span style="letter-spacing:2px;">████████████████████</span> [RESTRICTED ACCESS]</div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div class="challenge-prompt-header">
      <div class="prompt-tag">// CLASSIFIED EVIDENCE VAULT</div>
      <div class="prompt-main-text">${q.prompt || 'Identify the technology from the intelligence dossier.'}</div>
    </div>

    <!-- Green Stamp Target -->
    <div id="identified-stamp" class="stamp-container">RESTORED</div>

    <div class="vault-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-family:var(--font-mono);font-size:0.82rem;color:var(--lime);font-weight:700;">ACCURACY MULTIPLIER: ×${multiplier}</span>
        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-dim);">TIER: FINAL REPAIR</span>
      </div>

      ${imageHTML}
      ${cluesHTML}

      ${!guessing ? `
        <div style="display:flex;gap:14px;margin-top:20px;">
          <button class="btn-cyber primary" onclick="window.handleGuessNow()">[ SUBMIT ESTIMATE (×${multiplier}) ]</button>
          ${cluesRevealed < maxClues ? `<button class="btn-cyber" onclick="window.handleRevealClue()">[ REVEAL NEXT CLUE ]</button>` : ''}
        </div>
      ` : `
        <div class="prompt-tag" style="margin-top:20px;">// SUBMIT MATCHING TECHNOLOGY:</div>
        ${optHTML}
      `}
    </div>
  `;
}

window.handleRevealClue = function() {
  if (window.G.answerLocked) return;
  window.G.cluesRevealed++;
  if (window.AudioGraph) window.AudioGraph.playHover();
  const mod = window.MODULES[window.G.currentModule];
  const q = window.getCurrentQuestion();
  renderGuessTechView(mod, q, document.getElementById('game-content'), window.G.cluesRevealed, false);
};

window.handleGuessNow = function() {
  window.G.guessing = true;
  if (window.AudioGraph) window.AudioGraph.playClick();
  const mod = window.MODULES[window.G.currentModule];
  const q = window.getCurrentQuestion();
  renderGuessTechView(mod, q, document.getElementById('game-content'), window.G.cluesRevealed, true);
};

// Export to window
window.RENDERERS = {
  spot_the_glitch: renderSpotGlitch,
  emoji_decode: renderEmojiDecode,
  unscramble: renderUnscramble,
  odd_one_out: renderOddOneOut,
  tech_riddle: renderTechRiddle,
  tech_sequence: renderTechSequence,
  guess_technology: renderGuessTech
};
