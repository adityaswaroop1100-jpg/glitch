// ═══════════════════════════════════════════════════════════════
// GLITCH MATRIX — DATAMOSH & SLICE GLITCH FRAGMENT SHADER
// ═══════════════════════════════════════════════════════════════
precision highp float;

uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime;
uniform float uGlitchIntensity;  // 0.0 to 1.0
uniform float uAberrationBoost;  // up to 0.02
uniform float uFramePersistence; // 0.4 blend factor

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;

  if (uGlitchIntensity > 0.001) {
    // 12 Horizontal Datamosh bands
    float bands = 12.0;
    float bandIndex = floor(uv.y * bands);
    float noiseVal = random(vec2(bandIndex, floor(uTime * 14.0)));

    if (noiseVal > 0.45) {
      float displacement = (noiseVal - 0.5) * 0.045 * uGlitchIntensity;
      uv.x += displacement;
    }

    // Occasional block tear
    if (random(vec2(floor(uTime * 20.0), bandIndex)) > 0.8) {
      uv.x += (random(vec2(uv.y, uTime)) - 0.5) * 0.08 * uGlitchIntensity;
    }
  }

  // Extreme RGB Split during glitch peak
  float splitOffset = 0.002 + uAberrationBoost * uGlitchIntensity * 2.5;
  float r = texture2D(tDiffuse, uv + vec2(splitOffset, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2(splitOffset, 0.0)).b;

  vec3 color = vec3(r, g, b);

  // Glitch white flash bursts
  if (uGlitchIntensity > 0.8 && random(vec2(uTime * 30.0, 1.0)) > 0.75) {
    color += vec3(0.18, 0.22, 0.25);
  }

  gl_FragColor = vec4(color, 1.0);
}
