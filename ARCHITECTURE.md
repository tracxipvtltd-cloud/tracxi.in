# Tracxi Architecture Documentation

## Overview

This document describes the technical architecture of the Tracxi parent company website — a premium, cinematic, immersive 3D experience built with React, TypeScript, Three.js, and GSAP.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Providers                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ AppContext  │  │SceneContext │  │AnimContext  │             │
│  │ (sections,  │  │ (3D scene   │  │ (GSAP       │             │
│  │  nav, theme)│  │  lifecycle) │  │  timelines) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PerformanceContext                          │    │
│  │  (adaptive quality, FPS monitoring, device capabilities) │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        App Layout                               │
│  ┌─────────────┐                                               │
│  │ Navigation  │  Fixed, minimal, logo + 2 nav items + dropdown│
│  └─────────────┘                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Main Content (13 Sections in Order)                     │   │
│  │ 1. Hero                    8. Magic Matrix              │   │
│  │ 2. Meet Our Founders       9. Wah Mahi Ring             │   │
│  │ 3. One Company...         10. Tracxi Learn              │   │
│  │ 4. Tracxi by Suresh B     11. SkillForge                │   │
│  │ 5. Tracxi 2.0             12. Vision AI                 │   │
│  │ 6. VCX Mart               13. Closing Experience        │   │
│  │ 7. Trackspense                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────┐                                               │
│  │ Footer      │  Minimal: logo, statement, copyright          │
│  └─────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Context System

### AppContext (`src/context/AppContext.tsx`)

Global application state:
- Current/previous section tracking
- Section navigation helpers
- Theme management (light/dark/system)
- Device capabilities
- Reduced motion preference

**Key Methods:**
```typescript
setCurrentSection(sectionId: SectionId)
navigateToSection(sectionId: SectionId)
navigateToNextSection()
navigateToPreviousSection()
setTheme('light' | 'dark' | 'system')
```

### SceneContext (`src/context/SceneContext.tsx`)

3D scene lifecycle management:
- Scene registration/unregistration
- Active scene tracking (max 1 concurrent)
- Scene preloading
- Scene mounting state

**Key Methods:**
```typescript
registerScene(config: SceneConfig)
unregisterScene(id: string)
setActiveScene(id: string)
getScene(id: string)
isSceneMounted(id: string)
preloadScene(id: string)
```

### AnimationContext (`src/context/AnimationContext.tsx`)

GSAP animation management:
- Global timeline
- Animation registration/cleanup
- ScrollTrigger management
- Bulk pause/resume/kill

**Key Methods:**
```typescript
createTimeline(config?: GSAPTimelineConfig)
createAnimation(config: AnimationConfig)
createScrollTrigger(config: ScrollAnimationConfig)
killAllAnimations()
pauseAllAnimations()
resumeAllAnimations()
```

### PerformanceContext (`src/context/PerformanceContext.tsx`)

Adaptive quality and monitoring:
- FPS monitoring (60fps target)
- Automatic quality adjustment
- Device capability detection
- Memory tracking

**Quality Levels:** low → medium → high → ultra

**Key Methods:**
```typescript
setQuality('low' | 'medium' | 'high' | 'ultra')
reportMetric(name: string, value: number)
usePixelRatio() → number
useShadowConfig() → { enabled, mapSize }
useMaxLights() → number
```

## Section Architecture

### Base Section Component (`src/components/sections/Section.tsx`)

Each section wraps content with:
- IntersectionObserver for scroll detection
- Scene registration (if `hasScene`)
- Keyboard navigation (arrow keys)
- Lifecycle callbacks (`onEnter`, `onLeave`)

```tsx
<Section
  sectionId="hero"
  name="Hero"
  hasScene={true}
  sceneId="hero"        // optional, defaults to sectionId
  scenePriority={10}    // loading priority
  onEnter={() => {}}
  onLeave={() => {}}
>
  <SectionComposition
    background={<Canvas3DScene />}
    foreground={<TextContent />}
  />
</Section>
```

### Section Composition Layers

```
┌─────────────────────────────────────┐
│ Section (overflow: hidden)          │
│  ┌───────────────────────────────┐  │
│  │ SectionComposition            │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ .section-background     │  │  │  ← 3D Canvas (z-index: 0)
│  │  │  (position: absolute)   │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ .section-foreground     │  │  │  ← Text/UI (z-index: 10)
│  │  │  (position: relative)   │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ .section-overlay        │  │  │  ← Fixed elements (z-index: 20)
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Lazy Loading

Sections are lazy-loaded via `React.lazy()` in `App.tsx`:
```typescript
const HeroSection = lazy(() => import('./sections/Hero'));
```

Skeleton loaders show while sections load.

## 3D Scene Architecture

### Canvas Wrapper (`src/components/3d/Canvas.tsx`)

`CanvasWrapper` — Base Three.js canvas with:
- WebGL support detection
- Error boundary for context loss
- Loading/error/fallback states
- Performance monitor (dev only)

`AdaptiveCanvas` — Quality-adaptive canvas:
- Reads from PerformanceContext
- Adjusts pixelRatio, shadows, post-processing
- Reports scene metrics

### Scene Base (`src/components/3d/Scene.tsx`)

`BaseScene` — Declarative scene component:
- Lighting setup from config
- Quality-adaptive props
- Custom setup/animate/cleanup hooks
- Automatic resource disposal

`AdaptiveScene` — Quality-aware scene:
- Limits lights based on quality
- Adjusts shadow quality

### Scene Lifecycle

```
Mount
  ├── Register in SceneContext
  ├── Configure renderer (pixelRatio, shadows, toneMapping)
  ├── Setup camera
  ├── Setup lighting (ambient, directional, point, spot)
  ├── Custom onSetup()
  ├── Dispatch 'scene:ready' event
  │
  ├── Animation Loop (useFrame)
  │   ├── Custom onAnimate(delta)
  │   └── Report frame metrics (1% sample)
  │
Unmount
  ├── Run cleanup functions
  ├── Custom onCleanup()
  ├── Dispose lights & shadows
  └── Unregister from SceneContext
```

## Animation Architecture

### GSAP Integration

GSAP loaded dynamically via `useGSAP` hook:
- Registers ScrollTrigger plugin
- Provides timeline/animation factories
- Manages global cleanup

### Scroll Animations (`src/components/animations/ScrollAnimations.tsx`)

Pre-built animation components:
- `FadeIn` — Opacity + translateY
- `SlideUp` — Staggered slide up
- `ScaleIn` — Scale from 0.9
- `Parallax` — Transform based on scroll
- `Pin` — Pin element during scroll
- `TextReveal` — Word/char/line reveal
- `Counter` — Animated numbers
- `ScrollProgressBar` — Page progress indicator
- `ViewportAnimation` — IntersectionObserver-triggered

### Reduced Motion

All animations respect `prefers-reduced-motion`:
- Hook: `useReducedMotion()` → boolean
- CSS: `@media (prefers-reduced-motion: reduce)`
- GSAP: `timeScale(0)` when reduced motion active

## Performance Architecture

### Adaptive Quality System

```
Device Detection → Initial Quality → FPS Monitoring → Quality Adjustment
     │                    │                   │                    │
     ▼                    ▼                   ▼                    ▼
Mobile?           Low/Medium/          30 FPS threshold      Step down/up
Memory?             High/Ultra          55 FPS threshold      one level
WebGL2?                                           1% frame sampling
DPR?
```

### Single Scene Policy

**Only ONE 3D scene active at a time.**
- `SceneContext` enforces `maxConcurrentScenes = 1`
- Previous scene unmounts when new scene activates
- Prevents GPU memory exhaustion

### Asset Loading Strategy

- **Critical**: Hero scene (preload=true, lazyLoad=false)
- **High**: Early product scenes (preload=true, lazyLoad=true)
- **Normal**: Later scenes (preload=false, lazyLoad=true)
- **Background**: Non-critical assets

### Texture Optimization

- Quality-based texture resolution (0.5x - 1x)
- Mipmaps enabled
- sRGB color space
- Compressed formats (KTX2/Basis) for production

### Geometry Optimization

- Quality-based LOD (0.5x - 1x detail)
- InstancedMesh for repeated objects
- Frustum culling (Three.js default)
- GPU instancing for particles

## Responsive Architecture

### Breakpoint System

CSS variables for breakpoints:
```css
--bp-xs: 320px; --bp-sm: 480px; --bp-md: 768px;
--bp-lg: 1024px; --bp-xl: 1280px; --bp-2xl: 1536px;
```

### Device Classes on `<body>`

Applied via `useDeviceCapabilities` hook:
- `.device-mobile` / `.device-tablet` / `.device-desktop`
- `.has-touch` / `.no-hover`
- `.reduce-motion`
- `.no-webgl` / `.webgl-supported`

### Fluid Typography

```css
--text-5xl: clamp(3rem, 2.25rem + 3.75vw, 5.5rem);
--section-padding-x: clamp(1.5rem, 5vw, 6rem);
```

### 3D Responsive Adaptation

- Canvas pixelRatio capped at quality level
- Mobile: reduced particle count, simpler shaders
- Touch: disable hover effects, larger hit targets
- Orientation: handle resize gracefully

## Accessibility Architecture

### Semantic HTML

- `<nav role="navigation">` with `aria-label`
- `<main role="main">` for content
- `<section role="region" aria-label="...">` for sections
- `<footer role="contentinfo">`
- Proper heading hierarchy (h1 → h2 → h3)

### Keyboard Navigation

- Skip link (first focusable element)
- Arrow keys navigate sections (when focused)
- Focus visible on all interactive elements
- Focus trapping in mobile menu

### Screen Reader Support

- `aria-current="section"` on active section
- `aria-label` on icon-only buttons
- `aria-hidden="true"` on decorative 3D content
- Live regions for dynamic content

### Reduced Motion

- Global `prefers-reduced-motion` detection
- All animations disabled via CSS + JS
- Scroll behavior: `auto` instead of `smooth`

### High Contrast

- Enhanced borders
- Removed subtle color distinctions
- Focus outlines: 3px minimum

## Error Handling & Fallbacks

### WebGL Fallback

```tsx
<CanvasWrapper
  fallback={<StaticHeroImage />}
  error={<ErrorMessage />}
  loading={<SkeletonLoader />}
/>
```

### Error Boundaries

- Section-level error boundaries (React.Suspense)
- Scene-level error boundaries
- Global error logging (dev)

### Graceful Degradation

| Feature | Fallback |
|---------|----------|
| WebGL | Static images |
| GSAP | CSS transitions |
| IntersectionObserver | Immediate show |
| WebGL2 | WebGL1 context |
| High DPR | 1x pixel ratio |

## State Management

### Context-Based (No Redux/Zustand)

All global state via React Context:
- AppContext: sections, navigation, theme
- SceneContext: 3D scenes
- AnimationContext: GSAP timelines
- PerformanceContext: quality, metrics

### Local State

- Component state via `useState`/`useReducer`
- Refs for DOM access and mutable values
- No prop drilling (context for cross-component)

## Build & Deployment

### Vite Configuration

- Code splitting by vendor (three, gsap, react)
- ESNext target for modern browsers
- Chunk size warning at 1000kb
- Dependency optimization for heavy libs

### Production Optimizations

- Minification (esbuild)
- Tree shaking
- Asset hashing
- Gzip/Brotli compression
- Preload critical assets

## Future Extensibility

### Adding New Sections

1. Create component in `src/sections/`
2. Add to `sectionOrder` in `config/products.ts`
3. Register in `App.tsx` sectionComponents
4. Follow Section Development Guidelines

### Adding New 3D Scenes

1. Extend `BaseScene` or create custom
2. Register in `SceneContext` with config
3. Use `AdaptiveCanvas` for quality adaptation
4. Implement `onSetup`/`onAnimate`/`onCleanup`

### Adding New Animations

1. Create in `components/animations/`
2. Use `useGSAP` hook for GSAP access
3. Register for cleanup in `AnimationContext`
4. Respect `prefers-reduced-motion`

## Security Considerations

- No user input → no XSS risk
- No authentication → no auth concerns
- CSP headers recommended for production
- External image domain: `res.cloudinary.com` (preconnect)
- No eval/dynamic code execution