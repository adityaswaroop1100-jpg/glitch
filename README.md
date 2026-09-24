# GLITCH MATRIX 🔴 — AAA MAINFRAME REPAIR PROTOCOL

> **A high-fidelity cyberpunk tech tournament experience engineered to $50k agency production standards.**  
> *"The mainframe is compromised. You have 5 minutes to restore 7 corrupted architectural sectors."*

---

## ⚡ Key Highlights & Visual Architecture

1. **Persistent Three.js WebGL Layer (`#webgl-canvas`)**
   - Rotating wireframe `TorusKnotGeometry` (cyber core) with iridescent cyan/magenta dynamic reactivity.
   - 800 floating particles moving in 3D volume with mouse parallax and volumetric exponential fog.
   - Direct gameplay link: wrong answers trigger severe geometry distortion, screen datamosh glitch spikes, and red hue flashes.

2. **AAA Atmospheric Depth Stack**
   - **Layer 1 (z: -10):** Three.js WebGL Core & Volumetric Fog.
   - **Layer 2 (z: -8):** Procedural animated noise canvas (12fps feTurbulence-like grain).
   - **Layer 3 (z: -6):** Ambient matrix rain (hex code stream restricted to outer 16% edges).
   - **Layer 4 (z: -4):** Radial vignette & chromatic edge glow.
   - **Layer 5 (z: -2):** Dual counter-rotating scanlines (moiré CRT effect) with a rolling CRT scan bar.
   - **Layer 6 (z: 100):** Corner cockpit HUD (`● REC` with rolling timecode, live CPU/MEM telemetry, audio waveform visualizer).

3. **Cinematic 4-Second Intro & 5-Second Outro**
   - **Intro:** Cyan center pixel → horizontal beam expansion → vertical CRT unroll → WebGL layer fade-in → typed signal acquisition → boot terminal typing → title slam with 60Hz bass drop.
   - **Outro:** CRT collapse → "MAINFRAME STABILIZED" → 20-block segmented loader → "ACCESS GRANTED" harmonic chord → typed operative debrief stats → "You survived the glitch." bass drop → confetti of bits → `[ PLAY AGAIN ]` and `[ SHARE RESULT ]`.

4. **Dedicated Web Audio Graph (`audio/synth.js`)**
   - Master bus with `DynamicsCompressorNode` for punchy broadcast loudness without clipping.
   - Distinct mix buses: `ambientBus`, `sfxBus`, `uiBus`.
   - Procedural 1.5s convolution reverb with exponential decay.
   - 40Hz sub-drone with ±2Hz LFO detune and subtle pink noise floor.
   - 13 synthesized sound effects (mechanical keycaps, bass drops, chimes, buzzers, stings, urgent ticks).

5. **Custom Cyberpunk Game Cursor**
   - 20x20 crosshair following with spring physics and velocity-based rotation.
   - Expands to a 32x32 magenta circle on hover of any interactive element.
   - Snaps to a 12x12 lime square with audio click on mouse down.
   - 6 fading trailing dots with smooth interpolation.

6. **Instant Skip on Wrong Answers Across All 7 Modules**
   - Wrong answers never trap or loop the player.
   - System shields decrease, red damage vignette flashes, and the game advances to the next question within 1.2–1.4 seconds.
   - A dedicated `[ SKIP QUESTION ]` button is available across all rounds.

---

## 🚀 Running the Application

### Option 1 — Local HTTP Server (Active)
```bash
# The background server is already serving on port 8080:
http://localhost:8080/
```

To run manually on any machine:
```bash
python3 -m http.server 8080
# Open http://localhost:8080 in Chrome, Safari, Edge, or Firefox
```

### Option 2 — Direct File Access
Simply double-click or open `index.html` directly in your browser. All assets, modules, and styles are structured to work reliably under both `http://` and `file://`.

---

## 📁 Modular Directory Structure

```
GLITCH_MATRIX/
├── index.html                  # Master HTML shell, Three.js WebGL scene, game loop
├── README.md                   # System documentation & configuration manual
├── data/
│   └── questions.js            # All 105 questions across 7 modules (100% preserved)
├── audio/
│   └── synth.js                # Web Audio synthesizer, mix buses & SFX engine
├── fx/
│   ├── particles.js            # Particle bursts, dual ripples, shockwaves, confetti
│   └── glitch.js               # Datamosh glitch, text scrambler, digital strip wipe
├── shaders/
│   ├── crt.frag                # CRT curvature, aberration, scanline post-processing
│   └── glitch.frag             # Datamosh, RGB split, block tear fragment shader
├── styles/
│   ├── typography.css          # Design tokens, fonts, module mood themes, buttons
│   ├── layers.css              # Depth stack, dual scanlines, corner HUD telemetry
│   └── glitch.css              # Stepped clip-path glitch, CRT power-on/collapse
└── ui/
    ├── hud.js                  # Cockpit HUD manager, live timecode & waveform
    └── modules/
        └── renderers.js        # 7 specialized module interfaces + 15 SVG logos
```

---

## 🎨 7 Distinct Module Lighting Moods

| Module # | Module Title | Visual & Lighting Theme | Dominant Colors |
|:---:|:---|:---|:---|
| **01** | **Spot The Glitch** | *Interrogation Room* (Clinical spotlight, optical reticle) | `#00e5ff` (Cyan), `#03070d` |
| **02** | **Emoji Decode** | *Neon Arcade* (Hyper-saturated phosphor nodes) | `#ff2d95` (Magenta), `#9d4edd` |
| **03** | **Unscramble** | *Mechanical Workshop* (Industrial tactile keycaps & sockets) | `#ffb800` (Amber), `#1a2332` |
| **04** | **Odd One Out** | *Pressure Chamber* (8s circular timer ring, alert tension) | `#ff3b30` (Crimson), `#ffb800` |
| **05** | **Tech Riddle** | *Vault Terminal* (Phosphor monochrome CRT stream) | `#7cff3d` (Phosphor Lime), `#020508` |
| **06** | **Tech Sequence** | *Circuit Floor* (PCB execution pipeline stages) | `#00d2ff` (Cobalt), `#38bdf8` |
| **07** | **Guess The Tech** | *Server Cathedral* (Classified intel dossier, green stamp) | `#7cff3d` (Lime), `#00e5ff` |

---

## ⚙️ Configuration & Game Settings

To modify tournament parameters (time limits, bonus points, lives), open `data/questions.js`:

```javascript
export const CONFIG = {
  TOTAL_TIME: 300,                // Total repair window in seconds (5 minutes)
  BASE_POINTS: 10,                // Base points per correct answer
  COMBO_THRESHOLDS: [1, 2, 3, 5], // Multiplier tiers for streaks
  GLITCH_BONUS: 5,                // Bonus points for clearing random glitch events
  ODD_ONE_OUT_TIMER: 8,           // Countdown timer for Module 4 (Odd One Out)
  MAX_LIVES: 3,                   // Starting shields before system collapse
  BOOT_LINES: [ ... ]             // Boot sequence terminal lines
};
```
