"use client";

import html2canvas from "html2canvas-pro";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import clsx from "clsx";

// Global cache for sharing the document snapshot texture across multiple instances
let cachedDocTex: THREE.Texture | null = null;
const cachedDocSize = new THREE.Vector2();
let lastCaptureTime = 0;
let pendingCapturePromise: Promise<{ tex: THREE.Texture; w: number; h: number } | null> | null = null;
let activeInstancesCount = 0;

export interface LiquidGlassProps {
  className?: string;
  children?: React.ReactNode;
  radius?: number;
  thickness?: number;
  bezel?: number;
  ior?: number;
  blur?: number;
  specular?: number;
  tint?: number;
  backgroundImage?: string;
  repeatY?: boolean;
}

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`;

// Physics-based glass refraction shader.
// Ported from https://github.com/archisvaze/liquid-glass
// The background texture is a DOM snapshot taken by html2canvas and maps
// 1-to-1 with the canvas, so no aspect-ratio correction is needed.
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform vec2  uResolution;
uniform vec2  uGlassCenter;
uniform vec2  uGlassSize;
uniform float uRadius;
uniform float uBezel;
uniform float uThickness;
uniform float uIOR;
uniform float uBlur;
uniform float uSpecular;
uniform float uTint;
uniform sampler2D uBgTex;
uniform float uHasBg;

// Background projection uniforms
uniform vec4  uGlassRect;
uniform vec2  uViewportSize;
uniform vec2  uImgSize;
uniform vec2  uScroll;
uniform float uBgHeight;
uniform float uUseBgImage;

// Full document capture uniforms
uniform vec2  uDocSize;
uniform float uUseFullDoc;

float sdRoundedRect(vec2 p, vec2 h, float r) {
  vec2 q = abs(p) - h + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float surfaceHeight(float t) {
  float s = 1.0 - t;
  return pow(max(1.0 - s * s * s * s, 0.0), 0.25);
}

vec3 sampleBg(vec2 uv) {
  return texture2D(uBgTex, clamp(uv, 0.001, 0.999)).rgb;
}

vec3 sampleBgBlurred(vec2 uv, float r) {
  if (r < 0.5) return sampleBg(uv);
  
  vec2 px;
  if (uUseBgImage > 0.5) {
    px = r / uImgSize;
  } else if (uUseFullDoc > 0.5) {
    px = r / uDocSize;
  } else {
    px = r / uResolution;
  }
  
  vec3 s = vec3(0.0);
  s += sampleBg(uv + vec2(-0.94201, -0.39906) * px);
  s += sampleBg(uv + vec2( 0.94558, -0.76890) * px);
  s += sampleBg(uv + vec2(-0.09418, -0.92938) * px);
  s += sampleBg(uv + vec2( 0.34495,  0.29387) * px);
  s += sampleBg(uv + vec2(-0.91588, -0.45771) * px);
  s += sampleBg(uv + vec2(-0.81544,  0.48568) * px);
  s += sampleBg(uv + vec2(-0.38277, -0.56071) * px);
  s += sampleBg(uv + vec2(-0.12675,  0.84686) * px);
  s += sampleBg(uv + vec2( 0.89642,  0.41254) * px);
  s += sampleBg(uv + vec2( 0.18150, -0.30020) * px);
  s += sampleBg(uv + vec2(-0.01445, -0.16001) * px);
  s += sampleBg(uv + vec2( 0.59614,  0.71118) * px);
  s += sampleBg(uv + vec2( 0.49742, -0.47280) * px);
  s += sampleBg(uv + vec2( 0.80685,  0.04588) * px);
  s += sampleBg(uv + vec2(-0.32490, -0.03965) * px);
  s += sampleBg(uv + vec2(-0.60975,  0.06566) * px);
  return s / 16.0;
}

vec2 mapViewportToBgUV(vec2 viewportPx) {
  // Calculate Y relative to background
  float y_bg = viewportPx.y + uScroll.y;
  if (uBgHeight > 0.0) {
    y_bg = mod(y_bg, uBgHeight);
  }

  float containerW = uViewportSize.x;
  float containerH = (uBgHeight > 0.0) ? uBgHeight : uViewportSize.y;

  float u_bg = viewportPx.x / containerW;
  float v_bg = y_bg / containerH; // 0 at top, 1 at bottom

  float r_viewport = (containerH > 0.0) ? (containerW / containerH) : 1.0;
  float r_img = (uImgSize.y > 0.0) ? (uImgSize.x / uImgSize.y) : 1.0;

  vec2 texUV;
  if (r_viewport > r_img) {
    float k = r_img / r_viewport;
    texUV.x = u_bg;
    texUV.y = v_bg * k + (1.0 - k) * 0.5;
  } else {
    float k = r_viewport / r_img;
    texUV.x = u_bg * k + (1.0 - k) * 0.5;
    texUV.y = v_bg;
  }

  texUV.y = 1.0 - texUV.y; // Invert Y to match WebGL coordinate system
  return texUV;
}

void main() {
  vec2 screenPx = vec2(vUv.x, 1.0 - vUv.y) * uResolution;
  vec2 p        = screenPx - uGlassCenter;
  vec2 halfSize = uGlassSize * 0.5;

  // Clamp radius so it never exceeds the shorter half-dimension.
  // Without this, when radius > halfSize.y the SDF degenerates into a
  // bicircular (lens) shape and produces the "pointy ends" artifact.
  float r = min(uRadius, min(halfSize.x, halfSize.y));

  float sd = sdRoundedRect(p, halfSize, r);

  if (sd > 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Stay transparent while the first snapshot is loading (CSS fallback shows through)
  if (uHasBg < 0.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float distFromEdge = -sd;
  float bz = min(uBezel, r - 1.0);
  float t  = clamp(distFromEdge / bz, 0.0, 1.0);

  float h  = surfaceHeight(t);
  float h2 = surfaceHeight(min(t + 0.001, 1.0));
  float dh = (h2 - h) / 0.001;

  float slopeAngle   = atan(dh * (uThickness / bz));
  float sinR         = clamp(sin(slopeAngle) / uIOR, -1.0, 1.0);
  float thetaR       = asin(sinR);
  float displacement = h * uThickness * (tan(slopeAngle) - tan(thetaR));

  float eps = 0.5;
  vec2 grad;
  grad.x = sdRoundedRect(p + vec2(eps, 0.0), halfSize, r) - sd;
  grad.y = sdRoundedRect(p + vec2(0.0, eps), halfSize, r) - sd;
  grad = normalize(grad);

  vec2 offset = -grad * displacement;
  vec2 refractedPx = screenPx + offset;

  vec2 uvToSample;
  if (uUseBgImage > 0.5) {
    vec2 refractedViewportPx = uGlassRect.xy + refractedPx;
    uvToSample = mapViewportToBgUV(refractedViewportPx);
  } else if (uUseFullDoc > 0.5) {
    vec2 refractedViewportPx = uGlassRect.xy + refractedPx;
    vec2 docPx = refractedViewportPx + uScroll;
    uvToSample = vec2(docPx.x / uDocSize.x, 1.0 - (docPx.y / uDocSize.y));
  } else {
    uvToSample = vec2(refractedPx.x / uResolution.x, 1.0 - refractedPx.y / uResolution.y);
  }

  vec3 color = sampleBgBlurred(uvToSample, uBlur);

  vec2  lightDir      = normalize(vec2(0.5, -0.7));
  float rimDot        = abs(dot(grad, lightDir));
  float rimFalloff    = 1.0 - smoothstep(0.0, bz * 0.4, distFromEdge);
  float specHighlight = pow(rimDot * rimFalloff, 1.5);
  color += vec3(specHighlight * uSpecular);

  float innerShadow = 1.0 - smoothstep(0.0, bz * 0.6, distFromEdge);
  color *= mix(1.0, 0.7, innerShadow * 0.3);

  float innerRim = smoothstep(0.0, 2.0, distFromEdge)
                 * (1.0 - smoothstep(2.0, 5.0, distFromEdge));
  color += vec3(innerRim * 0.15 * uSpecular);

  color = mix(color, vec3(1.0), uTint);

  float alpha = smoothstep(0.0, 1.5, distFromEdge);
  gl_FragColor = vec4(color, alpha);
}`;

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function LiquidGlass({
  className,
  children,
  radius = 60,
  thickness = 50,
  bezel = 60,
  ior = 3.0,
  blur = 1.5,
  specular = 0.55,
  tint = 0.08,
  backgroundImage,
  repeatY = false,
}: LiquidGlassProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyRef = useRef(false);
  const activeRef = useRef(true);

  // Reference counting for the global cached texture to avoid memory leaks
  useEffect(() => {
    activeRef.current = true;
    activeInstancesCount++;
    return () => {
      activeRef.current = false;
      activeInstancesCount--;
      if (activeInstancesCount === 0) {
        cachedDocTex?.dispose();
        cachedDocTex = null;
        lastCaptureTime = 0;
      }
    };
  }, []);

  // Lets the RAF loop always read the latest prop values without restarting
  const propsRef = useRef({
    radius,
    thickness,
    bezel,
    ior,
    blur,
    specular,
    tint,
    repeatY,
  });
  useEffect(() => {
    propsRef.current = { radius, thickness, bezel, ior, blur, specular, tint, repeatY };
  }, [radius, thickness, bezel, ior, blur, specular, tint, repeatY]);

  // Snapshot the DOM behind the glass and upload it as the refraction texture
  const capture = useCallback(async () => {
    if (backgroundImage) return; // Skip DOM capture if using background image projection
    if (busyRef.current) return;
    const wrapper = wrapperRef.current;
    const material = materialRef.current;
    if (!wrapper || !material) return;

    busyRef.current = true;
    try {
      const now = Date.now();

      // If a fresh cached snapshot is available, reuse it instantly
      if (cachedDocTex && (now - lastCaptureTime < 200)) {
        material.uniforms.uBgTex.value = cachedDocTex;
        material.uniforms.uDocSize.value.copy(cachedDocSize);
        material.uniforms.uHasBg.value = 1.0;
        material.uniforms.uUseBgImage.value = 0.0;
        material.uniforms.uUseFullDoc.value = 1.0;
        busyRef.current = false;
        return;
      }

      let result;
      if (pendingCapturePromise) {
        result = await pendingCapturePromise;
      } else {
        pendingCapturePromise = (async () => {
          const docW = document.documentElement.scrollWidth;
          const docH = document.documentElement.scrollHeight;
          
          try {
            const snap = await html2canvas(document.body, {
              scale: Math.min(window.devicePixelRatio || 1, 1.2), // slightly lower scale to optimize memory/speed
              useCORS: true,
              allowTaint: true,
              logging: false,
              // Exclude all liquid glass wrappers from snapshot to avoid double-distortion mirror loops
              ignoreElements: (el) => {
                return el.hasAttribute("data-liquid-glass") || el.closest("[data-liquid-glass]") !== null;
              },
            });
            const tex = new THREE.CanvasTexture(snap);
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            return { tex, w: docW, h: docH };
          } catch (err) {
            console.warn("LiquidGlass: background capture failed", err);
            return null;
          }
        })();

        result = await pendingCapturePromise;
        pendingCapturePromise = null;
      }

      if (result && activeRef.current) {
        const prev = material.uniforms.uBgTex.value as THREE.Texture | null;
        if (prev && prev !== cachedDocTex) {
          prev.dispose();
        }

        cachedDocTex = result.tex;
        cachedDocSize.set(result.w, result.h);
        lastCaptureTime = Date.now();

        material.uniforms.uBgTex.value = result.tex;
        material.uniforms.uDocSize.value.copy(cachedDocSize);
        material.uniforms.uHasBg.value = 1.0;
        material.uniforms.uUseBgImage.value = 0.0;
        material.uniforms.uUseFullDoc.value = 1.0;
      }
    } catch (err) {
      console.warn("LiquidGlass: capture failed", err);
    } finally {
      busyRef.current = false;
    }
  }, [backgroundImage]);

  // Load background image if provided
  useEffect(() => {
    if (!backgroundImage) return;

    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      backgroundImage,
      (tex) => {
        if (!active) {
          tex.dispose();
          return;
        }
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        const material = materialRef.current;
        if (material) {
          const prev = material.uniforms.uBgTex.value as THREE.Texture | null;
          material.uniforms.uBgTex.value = tex;
          material.uniforms.uImgSize.value.set(tex.image.width, tex.image.height);
          material.uniforms.uUseBgImage.value = 1.0;
          material.uniforms.uHasBg.value = 1.0;
          prev?.dispose();
        }
      },
      undefined,
      (err) => {
        console.warn("LiquidGlass: failed to load backgroundImage", err);
      }
    );

    return () => {
      active = false;
    };
  }, [backgroundImage]);

  const scheduleCapture = useCallback(
    (delay = 150) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(capture, delay);
    },
    [capture],
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !supportsWebGL()) return;

    const bgContainer = wrapper.querySelector("[data-liquid-bg]");
    if (!bgContainer) return;

    // Create the canvas imperatively so each effect invocation gets a fresh
    // canvas element. This avoids React Strict Mode's double-invoke causing a
    // "context already exists" error when Three.js tries to re-create WebGL.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;";
    bgContainer.appendChild(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
      });
    } catch (err) {
      console.warn("LiquidGlass: could not create WebGL renderer", err);
      canvas.remove();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(wrapper.clientWidth || 1, wrapper.clientHeight || 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uResolution: { value: new THREE.Vector2() },
        uGlassCenter: { value: new THREE.Vector2() },
        uGlassSize: { value: new THREE.Vector2() },
        uRadius: { value: radius },
        uBezel: { value: bezel },
        uThickness: { value: thickness },
        uIOR: { value: ior },
        uBlur: { value: blur },
        uSpecular: { value: specular },
        uTint: { value: tint },
        uBgTex: { value: null },
        uHasBg: { value: 0.0 },
        // New uniforms
        uGlassRect: { value: new THREE.Vector4() },
        uViewportSize: { value: new THREE.Vector2() },
        uImgSize: { value: new THREE.Vector2() },
        uScroll: { value: new THREE.Vector2() },
        uBgHeight: { value: 0.0 },
        uUseBgImage: { value: 0.0 },
        uDocSize: { value: new THREE.Vector2() },
        uUseFullDoc: { value: 0.0 },
      },
      transparent: true,
      depthTest: false,
    });
    materialRef.current = material;
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    const updateRect = () => {
      const rect = wrapper.getBoundingClientRect();
      material.uniforms.uGlassRect.value.set(rect.left, rect.top, rect.width, rect.height);
    };

    function render() {
      const p = propsRef.current;
      const dpr = window.devicePixelRatio || 1;
      const w = renderer.domElement.width / dpr;
      const h = renderer.domElement.height / dpr;

      // Update glass bounding rect on every frame to handle animations and transitions
      updateRect();

      material.uniforms.uResolution.value.set(w, h);
      material.uniforms.uGlassCenter.value.set(w / 2, h / 2);
      material.uniforms.uGlassSize.value.set(w, h);
      material.uniforms.uRadius.value = p.radius;
      material.uniforms.uBezel.value = p.bezel;
      material.uniforms.uThickness.value = p.thickness;
      material.uniforms.uIOR.value = p.ior;
      material.uniforms.uBlur.value = p.blur;
      material.uniforms.uSpecular.value = p.specular;
      material.uniforms.uTint.value = p.tint;

      // Update scroll-related uniforms in real-time
      material.uniforms.uScroll.value.set(window.scrollX, window.scrollY);
      material.uniforms.uViewportSize.value.set(window.innerWidth, window.innerHeight);
      material.uniforms.uBgHeight.value = p.repeatY ? window.innerHeight : 0.0;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(render);
    }

    const ro = new ResizeObserver(() => {
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      if (w && h) {
        renderer.setSize(w, h);
        updateRect();
        if (!backgroundImage) {
          scheduleCapture(100);
        }
      }
    });
    ro.observe(wrapper);

    // Observe document layout changes (like expand/collapse accordions or dynamic images) to update refraction
    const docRo = new ResizeObserver(() => {
      if (!backgroundImage) {
        scheduleCapture(200);
      }
    });
    docRo.observe(document.body);

    // Observe window resizing to update the pixel ratio, size, and layout snapshot
    const onWindowResize = () => {
      renderer.setPixelRatio(window.devicePixelRatio);
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      if (w && h) {
        renderer.setSize(w, h);
      }
      updateRect();
      if (!backgroundImage) {
        scheduleCapture(200);
      }
    };
    window.addEventListener("resize", onWindowResize, { passive: true });

    // Do NOT capture while active scrolling is happening to guarantee 60fps.
    // Instead, update the glass rect coordinates and scroll offsets in real-time.
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      updateRect();
      
      // Fallback for browsers that don't support scrollend
      if (!backgroundImage && !("onscrollend" in window)) {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (busyRef.current) scheduleCapture(200);
          else capture();
        }, 150);
      }
    };
    
    const onScrollEnd = () => {
      if (backgroundImage) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (busyRef.current) scheduleCapture(150);
      else capture();
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });

    render();
    updateRect();
    capture();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      ro.disconnect();
      docRo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onWindowResize);
      (material.uniforms.uBgTex.value as THREE.Texture | null)?.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
      materialRef.current = null;
    };
  }, [backgroundImage, capture, scheduleCapture]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={wrapperRef}
      data-liquid-glass=""
      className={clsx("relative", className)}
      style={{ borderRadius: radius, overflow: "visible" }}
    >
      {/* Background container for canvas and fallback */}
      <div
        data-liquid-bg=""
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* CSS frosted-glass — visible instantly and acts as fallback if WebGL is unavailable */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(12px) saturate(1.5)",
            WebkitBackdropFilter: "blur(12px) saturate(1.5)",
            backgroundColor: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
      </div>

      {children && (
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  );
}
