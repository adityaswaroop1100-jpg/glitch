// ═══════════════════════════════════════════════════════════════
// GLITCH MATRIX — CRT POST-PROCESSING FRAGMENT SHADER
// ═══════════════════════════════════════════════════════════════
precision highp float;

uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime;
uniform float uCurvature;        // 0.06 barrel distortion
uniform float uAberration;       // 0.003 chromatic offset
uniform float uScanlineIntensity;// 0.08 scanline darkening
uniform float uScanlineCount;    // 600.0
uniform float uNoiseIntensity;   // 0.04 film grain
uniform float uVignette;         // 0.5
uniform float uBloom;            // 0.4

varying vec2 vUv;

// Barrel distortion coordinate warp
vec2 curveUV(vec2 uv, float curve) {
  uv = uv * 2.0 - 1.0;
  vec2 offset = abs(uv.yx) / vec2(curve * 12.0, curve * 12.0);
  uv = uv + uv * offset * offset;
  uv = uv * 0.5 + 0.5;
  return uv;
}

// Procedural pseudo-random hash
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  
  // Apply subtle CRT curvature
  if (uCurvature > 0.0) {
    uv = curveUV(uv, uCurvature);
  }

  // Black out border outside CRT glass curve
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.02, 0.027, 0.04, 1.0);
    return;
  }

  // Radial Chromatic Aberration
  vec2 dir = uv - vec2(0.5);
  float dist = length(dir);
  vec2 rUv = uv + dir * (uAberration * (1.0 + dist));
  vec2 bUv = uv - dir * (uAberration * (1.0 + dist));

  float r = texture2D(tDiffuse, rUv).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, bUv).b;
  vec3 color = vec3(r, g, b);

  // Scanlines (sine wave)
  float scanline = sin(uv.y * uResolution.y * 1.5) * 0.5 + 0.5;
  color -= color * scanline * uScanlineIntensity;

  // Rolling scan bar (8s loop moving top to bottom)
  float rollY = fract(uTime * 0.125);
  float rollBar = smoothstep(0.08, 0.0, abs(uv.y - rollY));
  color += vec3(0.0, 0.9, 1.0) * rollBar * 0.035;

  // Film Grain Noise
  float grain = hash(uv * uResolution + fract(uTime * 17.13)) * 2.0 - 1.0;
  color += grain * uNoiseIntensity;

  // Subtle Bloom on High Lumens
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  if (luma > 0.75) {
    color += color * (luma - 0.75) * uBloom;
  }

  // Circular Vignette
  float vignette = smoothstep(0.75, 0.35, length(uv - 0.5));
  color *= mix(1.0, vignette, uVignette);

  // CRT Phosphor slight green-cyan tint lift
  color = mix(color, color * vec3(0.92, 1.05, 1.02), 0.35);

  gl_FragColor = vec4(color, 1.0);
}
