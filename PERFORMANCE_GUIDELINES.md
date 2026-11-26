# Tracxi Performance Guidelines

## Performance Philosophy

> **"Zero Unnecessary Lag"**

Every architectural decision must prioritize smoothness. The target is 60fps on desktop and 30fps on mobile, with graceful degradation when hardware cannot keep up.

## Core Principles

### 1. Single Active Scene
Only ONE 3D scene renders at a time. The `SceneContext` enforces `maxConcurrentScenes = 1`. When a new section becomes active, the previous scene unmounts completely.

### 2. Lazy Load Everything
- Sections: `React.lazy()` with Suspense
- 3D Models: Load on scene mount, not app start
- Textures: Load on demand with quality variants
- Heavy libraries: Dynamic imports

### 3. Adaptive Quality
The `PerformanceContext` monitors FPS and automatically adjusts:
- Pixel ratio (1x → 2x)
- Shadow map resolution (512 → 4096)
- Post-processing (off → on)
- Light count (1 → 8)
- Particle count (100 → 2000)
- Texture quality (0.5x → 1x)
- Geometry detail (0.5x → 1x)

### 4. Respect User Preferences
- `prefers-reduced-motion`: Disable all animations
- `prefers-contrast: high`: Enhanced visibility
- `prefers-color-scheme`: System theme support
- Touch devices: Larger targets, no hover

## 3D Performance Budget

### Per Scene Limits (Target)

| Metric | Mobile | Desktop | Ultra |
|--------|--------|---------|-------|
| Draw Calls | < 50 | < 100 | < 150 |
| Triangles | < 50k | < 100k | < 200k |
| Texture Memory | < 50MB | < 100MB | < 200MB |
| Shader Complexity | Simple | Medium | Complex |
| Lights | 1-2 | 3-5 | 5-8 |
| Particles | 50-100 | 500-1000 | 1000-2000 |

### Model Optimization

```typescript
// Use Draco compression for GLB models
// Target: < 500KB per model (compressed)
// Use instancedMesh for repeated objects
// Implement LOD: high/medium/low detail models
```

### Texture Optimization

```typescript
// Use KTX2/Basis Universal format
// Generate mipmaps
// Use sRGB color space for albedo
// Linear color space for data textures (normal, roughness)
// Max resolution by quality:
//   Low: 512px, Medium: 1024px, High: 2048px, Ultra: 4096px
```

### Shader Guidelines

- Prefer MeshStandardMaterial over custom shaders
- Avoid complex fragment calculations
- Use baked lighting where possible
- Limit texture samples (< 8 per shader)
- Avoid dynamic branching in fragment shaders

## Animation Performance

### GSAP Best Practices

```typescript
// Use transform (x, y, scale) not layout properties (top, left, width)
// Use will-change sparingly, remove after animation
// Stagger animations to avoid simultaneous layout thrashing
// Use ScrollTrigger scrub for scroll-linked animations
// Kill animations on unmount (useAnimationCleanup)
```

### ScrollTrigger Optimization

```typescript
// Minimize trigger elements
// Use fast callbacks (onUpdate throttled)
// Avoid layout reads in callbacks
// Use anticipatePin for smooth pinning
// Refresh only when needed
```

### Reduced Motion Implementation

```typescript
// CSS: @media (prefers-reduced-motion: reduce)
// JS: useReducedMotion() hook
// GSAP: gsap.globalTimeline.timeScale(0)
// Result: Instant state changes, no transitions
```

## Loading Strategy

### Critical Path (Hero)
- Preload hero scene assets
- Inline critical CSS
- Preconnect to Cloudinary
- Preload hero model/textures

### High Priority (Early Sections)
- Preload on hover/near viewport
- Use `<link rel="preload">` for key assets
- Load when previous section is 50% visible

### Normal Priority (Later Sections)
- Load on intersection (IntersectionObserver)
- Show skeleton while loading
- Cancel if user scrolls past quickly

### Background (Non-critical)
- Load during idle time (requestIdleCallback)
- Lowest quality first, upgrade later
- Cache aggressively

## Memory Management

### Three.js Resource Disposal

```typescript
// Always dispose in cleanup:
// geometry.dispose()
// material.dispose()
// texture.dispose()
// renderTarget.dispose()
// shaderMaterial.uniforms = null
```

### Leak Prevention

- Use `useRef` for mutable values that shouldn't trigger renders
- Clean up event listeners in useEffect return
- Kill GSAP animations on unmount
- Dispose IntersectionObservers
- Cancel animation frames
- Clear timeouts/intervals

### Memory Monitoring

```typescript
// PerformanceContext tracks:
// - JS heap size (performance.memory)
// - GPU memory (estimated via draw calls × geometry)
// - Texture count × resolution
// Alerts at 80% budget
```

## Bundle Optimization

### Code Splitting

```typescript
// Vite config: manualChunks
// 'three': ['three', '@react-three/fiber', '@react-three/drei']
// 'gsap': ['gsap']
// 'vendor': ['react', 'react-dom', 'lucide-react']

// Section lazy loading:
// const Section = lazy(() => import('./sections/Section'))
```

### Tree Shaking

- Import only what you need: `import { Mesh } from 'three'`
- Avoid barrel exports that prevent shaking
- Use ES modules everywhere

### Dependency Audit

```bash
# Regular audits:
npm run build -- --analyze
# Check for duplicate packages
# Remove unused dependencies
# Prefer native APIs over polyfills
```

## Runtime Optimizations

### Renderer Settings

```typescript
// AdaptiveCanvas applies these based on quality:
{
  antialias: quality !== 'low',
  powerPreference: quality === 'low' ? 'low-power' : 'high-performance',
  pixelRatio: Math.min(quality.pixelRatio, window.devicePixelRatio),
  shadows: quality.enableShadows,
}
```

### Frame Budget

Target: 16.67ms per frame (60fps)

```
┌─────────────────────────────────────────────┐
│ Frame (16.67ms)                             │
├─────────────────────────────────────────────┤
│ JS Execution          │  4-6ms             │
│ React Render          │  2-4ms             │
│ Three.js Update       │  2-4ms             │
│ GPU Render            │  4-8ms             │
│ Browser Paint         │  1-2ms             │
├─────────────────────────────────────────────┤
│ Headroom              │  2-4ms             │
└─────────────────────────────────────────────┘
```

### Profiling Tools

```bash
# Development:
# - React DevTools Profiler
# - Chrome DevTools Performance tab
# - Three.js Inspector (r3f debug)
# - Custom PerformanceContext metrics

# Production:
# - Lighthouse CI
# - Web Vitals (web-vitals library)
# - RUM (Real User Monitoring)
```

## Mobile-Specific Optimizations

### Touch Devices
- Disable hover effects (`@media (hover: none)`)
- Increase touch targets to 44×44px minimum
- Reduce particle count by 50%
- Simplify shaders (no complex frag calculations)
- Use `touch-action: manipulation` on interactive elements

### iOS Safari
- Avoid `position: fixed` on canvas containers
- Use `-webkit-overflow-scrolling: touch`
- Test with `requestAnimationFrame` throttling
- Handle `webglcontextlost` gracefully

### Android Chrome
- Enable `will-change` only during animations
- Use `transform3d` for GPU acceleration
- Avoid excessive `box-shadow` on animated elements

## Network Optimization

### Asset Delivery
- Serve from CDN with HTTP/2 or HTTP/3
- Enable Brotli compression (better than gzip)
- Set long-term cache headers for hashed assets
- Use `Cache-Control: public, max-age=31536000, immutable`

### Critical Resources
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://res.cloudinary.com" crossorigin>

<!-- Preload hero assets -->
<link rel="preload" as="image" href="hero-model.glb">
<link rel="preload" as="fetch" href="hero-texture.ktx2" crossorigin>
```

## Monitoring & Alerting

### Development Metrics

```typescript
// PerformanceContext reports:
// - fps (target: 60)
// - frameTime (target: < 16.67ms)
// - memoryUsage (MB)
// - qualityLevel (low/medium/high/ultra)
// - sceneLoadTime (ms)
// - assetLoadTime (ms)
```

### Production Metrics

Track via Web Vitals:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **TTFB** (Time to First Byte) < 600ms
- **FCP** (First Contentful Paint) < 1.8s

### Custom Metrics

```typescript
// Report from scenes:
reportMetric('scene:hero:loadTime', loadTime)
reportMetric('scene:hero:firstFrame', firstFrameTime)
reportMetric('scene:hero:memoryPeak', peakMemory)
reportMetric('animation:scroll:jank', jankCount)
```

## Testing Procedures

### Performance Test Checklist

- [ ] DevTools Performance: Record 10s scroll session
- [ ] Check for long tasks (> 50ms)
- [ ] Verify no memory growth over 5 min
- [ ] Test on low-end device (or throttle CPU 4x)
- [ ] Test with network throttling (3G)
- [ ] Verify reduced motion works
- [ ] Check bundle size (`npm run build` output)
- [ ] Run Lighthouse (target: 90+ Performance)

### Regression Prevention

- CI runs Lighthouse on every PR
- Bundle size check in CI (fail if > 200KB gzipped JS)
- Performance budgets in `package.json` scripts
- Automated visual regression for 3D scenes

## Emergency Optimizations

If performance is critically bad:

1. **Disable post-processing** globally
2. **Reduce pixel ratio** to 1x
3. **Disable shadows** globally
4. **Cut particle counts** by 75%
5. **Swap to low-poly models**
6. **Disable non-critical animations**
7. **Show static images** instead of 3D

These are controlled via `PerformanceContext.setQuality('low')`.

---

## Quick Reference: DO / DON'T

### DO ✅
- Use `AdaptiveCanvas` for all 3D scenes
- Register scenes in `SceneContext`
- Clean up all Three.js resources
- Use `useAnimationCleanup` for GSAP
- Respect `prefers-reduced-motion`
- Lazy load sections with `React.lazy`
- Profile before optimizing
- Test on real mobile devices

### DON'T ❌
- Mount multiple 3D scenes simultaneously
- Load all models at app start
- Use layout-triggering CSS properties in animations
- Forget to dispose geometries/materials/textures
- Assume desktop performance = mobile performance
- Add animations without reduced motion fallback
- Use heavy post-processing on mobile
- Skip performance testing before merge

---

*These guidelines are enforced through code review and CI checks. Update as we learn more about real-world performance.*