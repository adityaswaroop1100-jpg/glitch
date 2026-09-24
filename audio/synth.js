/**
 * ═══════════════════════════════════════════════════════════════
 * GLITCH MATRIX — AAA WEB AUDIO SYNTHESIS ENGINE
 * Procedural audio graph with buses, convolution reverb, and SFX
 * ═══════════════════════════════════════════════════════════════
 */

let audioCtx = null;
let masterGain = null;
let compressor = null;
let ambientBus = null;
let sfxBus = null;
let uiBus = null;
let musicBus = null;
let reverbNode = null;
let reverbGain = null;

let isMuted = false;
let ambientOsc = null;
let ambientLfo = null;
let ambientNoise = null;
let ambientBlipTimer = null;

export function initAudioEngine() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();

  // 1. MASTER BUS: masterGain -> DynamicsCompressor -> destination
  compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-12, audioCtx.currentTime); // -12dB
  compressor.knee.setValueAtTime(30, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(4, audioCtx.currentTime);        // 4:1
  compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);  // 3ms
  compressor.release.setValueAtTime(0.25, audioCtx.currentTime);  // 250ms
  compressor.connect(audioCtx.destination);

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.42, audioCtx.currentTime);
  masterGain.connect(compressor);

  // 2. MIX BUSES
  ambientBus = audioCtx.createGain();
  ambientBus.gain.setValueAtTime(0.18, audioCtx.currentTime);
  ambientBus.connect(masterGain);

  sfxBus = audioCtx.createGain();
  sfxBus.gain.setValueAtTime(0.65, audioCtx.currentTime);
  sfxBus.connect(masterGain);

  uiBus = audioCtx.createGain();
  uiBus.gain.setValueAtTime(0.35, audioCtx.currentTime);
  uiBus.connect(masterGain);

  musicBus = audioCtx.createGain();
  musicBus.gain.setValueAtTime(0.0, audioCtx.currentTime);
  musicBus.connect(masterGain);

  // 3. PROCEDURAL CONVOLUTION REVERB (1.5s Exponential Decay Impulse)
  try {
    const rate = audioCtx.sampleRate;
    const length = Math.floor(rate * 1.5);
    const impulse = audioCtx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (rate * 0.35));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }
    reverbNode = audioCtx.createConvolver();
    reverbNode.buffer = impulse;

    reverbGain = audioCtx.createGain();
    reverbGain.gain.setValueAtTime(0.16, audioCtx.currentTime); // 16% wet
    reverbNode.connect(reverbGain);
    reverbGain.connect(masterGain);
  } catch (e) {
    console.warn('Convolver unavailable, continuing with dry mix.');
  }

  return audioCtx;
}

export function toggleAudioMute() {
  isMuted = !isMuted;
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.42, audioCtx.currentTime);
  }
  return isMuted;
}

export function getMuteState() {
  return isMuted;
}

/* ─── PROCEDURAL AMBIENT LOOP (40Hz Drone + Filtered Noise + Blips) ─── */
export function startAmbientLoop() {
  if (isMuted || !audioCtx || ambientOsc) return;

  try {
    // 40Hz Drone with ±2Hz LFO Detune
    ambientOsc = audioCtx.createOscillator();
    ambientOsc.type = 'sine';
    ambientOsc.frequency.setValueAtTime(40, audioCtx.currentTime);

    ambientLfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    ambientLfo.frequency.setValueAtTime(0.1, audioCtx.currentTime); // 0.1Hz sweep
    lfoGain.gain.setValueAtTime(2.0, audioCtx.currentTime);          // ±2Hz
    ambientLfo.connect(lfoGain);
    lfoGain.connect(ambientOsc.frequency);
    ambientLfo.start();

    // Filtered Pink/Brown Noise Floor
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.96 * b1 + white * 0.11;
      b2 = 0.86 * b2 + white * 0.25;
      output[i] = (b0 + b1 + b2) * 0.18;
    }
    ambientNoise = audioCtx.createBufferSource();
    ambientNoise.buffer = noiseBuffer;
    ambientNoise.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, audioCtx.currentTime);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.035, audioCtx.currentTime);

    ambientNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ambientBus);

    ambientOsc.connect(ambientBus);
    ambientOsc.start();
    ambientNoise.start();

    // Random Background Telemetry Blips every 8-15s (1200Hz sine, 30ms)
    scheduleRandomBlip();
  } catch (e) {
    console.warn('Ambient loop init error:', e);
  }
}

function scheduleRandomBlip() {
  if (ambientBlipTimer) clearTimeout(ambientBlipTimer);
  const nextDelay = 8000 + Math.random() * 7000;
  ambientBlipTimer = setTimeout(() => {
    if (!isMuted && audioCtx) {
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ambientBus);
        osc.start(now);
        osc.stop(now + 0.03);
      } catch (e) {}
    }
    scheduleRandomBlip();
  }, nextDelay);
}

export function stopAmbientLoop() {
  if (ambientBlipTimer) clearTimeout(ambientBlipTimer);
  if (ambientOsc) {
    try {
      ambientOsc.stop();
      ambientOsc.disconnect();
      ambientOsc = null;
    } catch (e) {}
  }
  if (ambientLfo) {
    try {
      ambientLfo.stop();
      ambientLfo.disconnect();
      ambientLfo = null;
    } catch (e) {}
  }
  if (ambientNoise) {
    try {
      ambientNoise.stop();
      ambientNoise.disconnect();
      ambientNoise = null;
    } catch (e) {}
  }
}

/* ─── AAA SYNTHESIZED SFX LIBRARY ─── */

// 1. Blip (880Hz sine, 20ms)
export function playBlip() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain);
    gain.connect(uiBus);
    osc.start(now);
    osc.stop(now + 0.02);
  } catch (e) {}
}

// 2. Click (1200Hz square + lowpass sweep 2000->400Hz, 40ms)
export function playClick() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(uiBus);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {}
}

// 3. Correct (Two notes 880->1320Hz, 120ms total, triangle wave + reverb)
export function playCorrect() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [
      { f: 880, t: 0, d: 0.06 },
      { f: 1320, t: 0.05, d: 0.12 }
    ].forEach(n => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.22, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(sfxBus);
      if (reverbNode) gain.connect(reverbNode);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  } catch (e) {}
}

// 4. Wrong (80Hz square + detune 5Hz, 250ms, filtered at 800Hz)
export function playWrong() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [80, 85].forEach(f => {
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(sfxBus);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  } catch (e) {}
}

// 5. Combo (Pitch scales with combo: base 440 + combo * 110Hz)
export function playCombo(combo = 1) {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const baseFreq = 440 + Math.min(10, combo) * 110;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(sfxBus);
    if (reverbNode) gain.connect(reverbNode);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {}
}

// 6. Life Lost (White noise + pitch-down sweep 400->60Hz, 400ms)
export function playLifeLost() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    // Swept oscillator
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);
    oscGain.gain.setValueAtTime(0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(oscGain);
    oscGain.connect(sfxBus);
    osc.start(now);
    osc.stop(now + 0.4);

    // Filtered noise pop
    const bufSize = Math.floor(audioCtx.sampleRate * 0.15);
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;
    const nGain = audioCtx.createGain();
    nGain.gain.setValueAtTime(0.2, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(nGain);
    nGain.connect(sfxBus);
    noise.start(now);
  } catch (e) {}
}

// 7. Heartbeat (60Hz sine, 100ms)
export function playHeartbeat(fast = false) {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(fast ? 85 : 60, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.1);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(sfxBus);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {}
}

// 8. Glitch Bitcrusher Noise (8-bit quantization simulation, 150ms)
export function playGlitchNoise() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const samples = Math.floor(audioCtx.sampleRate * 0.15);
    const buf = audioCtx.createBuffer(1, samples, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    const steps = 8; // 8-bit quantization
    for (let i = 0; i < samples; i++) {
      const raw = Math.random() * 2 - 1;
      data[i] = Math.round(raw * steps) / steps;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buf;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(sfxBus);
    source.start(now);
  } catch (e) {}
}

// 9. Bass Drop (60Hz sine, 400ms decay)
export function playBassDrop() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(sfxBus);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {}
}

// 10. Boot Arpeggio (C-E-G ascending, sine)
export function playBootArpeggio() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [261.63, 329.63, 392.00].forEach((f, i) => {
      const t = now + i * 0.08;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(uiBus);
      osc.start(t);
      osc.stop(t + 0.16);
    });
  } catch (e) {}
}

// 11. Final Reverb Chord (Major chord C-E-G held 800ms + reverb tail)
export function playFinalChord() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(sfxBus);
      if (reverbNode) gain.connect(reverbNode);
      osc.start(now);
      osc.stop(now + 0.85);
    });
  } catch (e) {}
}

// 12. Mechanical Clack (for Unscramble keycaps)
export function playMechanicalClack() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(uiBus);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {}
}

// 13. Urgent Tick (1500Hz sine, 15ms, pan left)
export function playUrgentTick() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    osc.connect(gain);
    gain.connect(uiBus);
    osc.start(now);
    osc.stop(now + 0.015);
  } catch (e) {}
}

function playTone(freq = 440, dur = 0.08, type = 'sine', vol = 0.1) {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(g);
    g.connect(uiBus || masterGain || audioCtx.destination);
    osc.start(now);
    osc.stop(now + dur);
  } catch (e) {}
}

// 14. Time Stasis Ice Resonance (Crystals freezing)
function playStasis() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [1046.5, 1318.5, 1567.98, 2093.0].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.05);
      gain.gain.setValueAtTime(0.12, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(sfxBus);
      osc.start(now + i * 0.05);
      osc.stop(now + 0.65);
    });
  } catch (e) {}
}

// 15. De-Noise Laser Zap
function playDeNoise() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(sfxBus);
    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {}
}

// 16. Firewall Shield Forcefield Swell
function playShieldDeploy() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(sfxBus);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {}
}

// 17. Speed Rush Decrypt Chime
function playSpeedBonus() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [587.33, 880, 1174.66, 1760].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      gain.gain.setValueAtTime(0.18, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(sfxBus);
      osc.start(now + i * 0.04);
      osc.stop(now + 0.55);
    });
  } catch (e) {}
}

// 18. Achievement Fanfare
function playAchievement() {
  if (isMuted || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(sfxBus);
      osc.start(now + i * 0.08);
      osc.stop(now + 0.75);
    });
  } catch (e) {}
}

// 19. Dynamic Combo Scale (Ascending pitch with streak)
function playComboScale(streak = 1) {
  if (isMuted || !audioCtx) return;
  try {
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99, 1046.50];
    const pitch = scale[Math.min(streak, scale.length - 1)];
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = streak >= 4 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(pitch, now);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(sfxBus);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {}
}

if (typeof window !== 'undefined') {
  window.AudioGraph = {
    init: initAudioEngine,
    startDrone: startAmbientLoop,
    stopDrone: stopAmbientLoop,
    toggleMute: toggleAudioMute,
    isMuted: getMuteState,
    playTone,
    playClick,
    playHover: playBlip,
    playCorrect,
    playWrong,
    playCombo,
    playComboScale,
    playLifeLost,
    playHeartbeat,
    playGlitch: playGlitchNoise,
    playComplete: playFinalChord,
    playMechanicalClack,
    playBassDrop,
    playBootArpeggio,
    playAccessGranted: playFinalChord,
    playUrgentTick,
    playStasis,
    playDeNoise,
    playShieldDeploy,
    playSpeedBonus,
    playAchievement
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.AudioGraph;
}


