# Section Development Guidelines

## For External AI Contributors

This document establishes the rules and workflow for developing individual sections of the Tracxi website. **Read this completely before starting any work.**

---

## Golden Rules

### 1. One Section at a Time
- Work on **exactly one section** per session
- Do not modify other sections
- Do not touch global architecture without approval

### 2. Use Existing Infrastructure
- **Design tokens**: Use `var(--color-*)`, `var(--text-*)`, `var(--space-*)`, etc.
- **Components**: Extend `Section`, `SectionComposition`, `SectionHeader`
- **3D**: Use `AdaptiveCanvas`, `BaseScene`, `AdaptiveScene`
- **Animations**: Use `FadeIn`, `SlideUp`, `ScaleIn`, `TextReveal`, etc.
- **Hooks**: Use `useReducedMotion`, `useScrollProgress`, `useIntersection`, etc.

### 3. No New Dependencies
- Do not install packages without explicit approval
- Use what's already in `package.json`
- If you need something new, document why and request approval

### 4. Clean Code Standards
- Remove unused imports, variables, styles
- No `console.log` in production code
- No commented-out code blocks
- TypeScript strict mode compliance

### 5. Performance First
- Lazy load assets
- Respect quality levels
- Clean up all resources (Three.js, GSAP, listeners)
- Test on mobile

### 6. Accessibility Required
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Reduced motion fallback
- Focus states

---

## Section Development Workflow

### Step 1: Understand the Section
Read the section specification in `DEVELOPMENT_ROADMAP.md` and `ARCHITECTURE.md`. Note:
- Section ID and order
- 3D concept (if applicable)
- Content requirements
- Special transitions or interactions

### Step 2: Create Section Component
**File:** `src/sections/[SectionName].tsx`

```tsx
import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products'; // if product section
import { cn } from '../utils';
import './[SectionName].css';

export function [SectionName]() {
  const product = getProductById('section-id'); // if applicable

  return (
    <Section
      sectionId="section-id"
      name="Section Name"
      hasScene={true} // or false
      sceneId="section-id" // optional, defaults to sectionId
      scenePriority={5} // 1-10, higher = earlier preload
    >
      <SectionComposition
        background={
          // 3D scene if hasScene
          <AdaptiveCanvas sceneId="section-id" className="section-canvas">
            <Your3DSceneContent />
          </AdaptiveCanvas>
        }
        foreground={
          // Text/UI content
          <div className="section-content">
            <SectionHeader
              label="Status Label"
              title="Section Title"
              description="Description text"
              className="section-header"
            />
            <div className="section-details">
              {/* Additional content */}
            </div>
          </div>
        }
      />
    </Section>
  );
}
```

### Step 3: Create Section Styles
**File:** `src/sections/[SectionName].css`

```css
@import '../styles/design-tokens.css';

/* Use design tokens exclusively */
.section-content {
  padding: var(--space-8) var(--section-padding-x);
  max-width: var(--content-narrow);
  margin: 0 auto;
}

.section-header {
  margin-bottom: var(--space-12);
}

.section-header .section-title {
  font-size: var(--text-5xl);
}

/* Responsive: Mobile-first approach */
@media (max-width: 768px) {
  .section-header .section-title {
    font-size: var(--text-3xl);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none !important;
    transition: none !important;
  }
}

/* High contrast */
@media (prefers-contrast: high) {
  .element {
    border-width: 2px;
  }
}
```

### Step 4: Register in App
**File:** `src/App.tsx`

```typescript
// Add to lazy imports
const YourSection = lazy(() => import('./sections/YourSection').then(m => ({ default: m.YourSection })));

// Add to sectionComponents map
const sectionComponents: Record<string, React.ComponentType<any>> = {
  // ... existing
  'your-section-id': YourSection,
};

// Add to sectionMeta
const sectionMeta: Record<string, { name: string; hasScene: boolean }> = {
  // ... existing
  'your-section-id': { name: 'Your Section', hasScene: true },
};

// Ensure sectionOrder in config/products.ts includes your section ID
```

### Step 5: Verify
```bash
npm run dev      # Check dev server
npm run build    # Verify production build
npm run type-check # Verify TypeScript
```

---

## 3D Scene Development

### Use BaseScene or AdaptiveScene

```tsx
import { BaseScene } from '../components/3d/Scene';
import * as THREE from 'three';

function Your3DScene() {
  return (
    <BaseScene
      config={{ id: 'your-scene', name: 'Your Scene', enabled: true, priority: 5 }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      lighting={{
        ambient: { color: '#ffffff', intensity: 0.5 },
        directional: [{
          color: '#ffffff',
          intensity: 1,
          position: [5, 10, 5],
          castShadow: true,
        }],
      }}
      onSetup={(scene, three) => {
        // Add your objects to scene
        // three.scene.add(yourMesh)
      }}
      onAnimate={(delta, three) => {
        // Animation logic (respects reduced motion automatically)
      }}
      onCleanup={() => {
        // Dispose geometries, materials, textures
      }}
    >
      {/* Additional declarative content */}
    </BaseScene>
  );
}
```

### Loading Models

```tsx
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function ModelWrapper() {
  const gltf = useLoader(GLTFLoader, '/models/your-model.glb');
  return <primitive object={gltf.scene} />;
}
```

### Quality-Adaptive Code

```tsx
import { usePerformanceContext, useParticleCount, useGeometryDetail } from '../context/PerformanceContext';

function AdaptiveEffect() {
  const particleCount = useParticleCount(); // Adapts to quality
  const geometryDetail = useGeometryDetail(); // 0.5 - 1.0

  // Use these values for particle systems, LOD selection, etc.
}
```

### Resource Disposal (CRITICAL)

```tsx
onCleanup={() => {
  // Dispose everything you created:
  geometry?.dispose();
  material?.dispose();
  texture?.dispose();
  renderTarget?.dispose();
  
  // Clear arrays/objects holding Three.js objects
  meshesRef.current = [];
  
  // Cancel any animations/requestAnimationFrame
  if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
}}
```

---

## Animation Development

### Using Built-in Components

```tsx
import { FadeIn, SlideUp, ScaleIn, TextReveal, Counter } from '../components/animations/ScrollAnimations';

function AnimatedContent() {
  return (
    <FadeIn start="top 80%" stagger={0.1}>
      <h2>Title</h2>
      <p>Description</p>
    </FadeIn>
    
    <SlideUp distance={40} stagger={0.1}>
      <div>Card 1</div>
      <div>Card 2</div>
    </SlideUp>
    
    <TextReveal splitBy="words" stagger={0.03}>
      This text reveals word by word
    </TextReveal>
    
    <Counter to={1000} duration={2} suffix="+" />
  );
}
```

### Custom GSAP Animations

```tsx
import { useGSAP } from '../hooks';

function CustomAnimation() {
  const { createAnimation, createTimeline, isLoaded } = useGSAP();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !elementRef.current) return;

    const tl = createTimeline({ id: 'my-timeline' });
    tl.to(elementRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 80%',
      },
    });

    return () => tl?.kill();
  }, [isLoaded, createTimeline]);

  return <div ref={elementRef}>Content</div>;
}
```

### Reduced Motion Handling

```tsx
import { useReducedMotion } from '../hooks';

function Component() {
  const prefersReducedMotion = useReducedMotion();

  // Option 1: Conditional rendering
  if (prefersReducedMotion) {
    return <StaticVersion />;
  }

  // Option 2: Inline styles
  return (
    <div style={{ opacity: prefersReducedMotion ? 1 : 0 }}>
      <AnimatedContent />
    </div>
  );
}
```

---

## Responsive Design Requirements

### Breakpoints (Use These)
```css
/* Mobile first - min-width media queries for progressive enhancement */
/* Or max-width for desktop-first - be consistent */

@media (max-width: 1024px) { /* Tablet landscape */ }
@media (max-width: 768px)  { /* Tablet portrait */ }
@media (max-width: 480px)  { /* Mobile */ }
```

### Fluid Typography
```css
/* Use clamp() for fluid sizing */
/* Already defined in design tokens: */
--text-5xl: clamp(3rem, 2.25rem + 3.75vw, 5.5rem);
--section-padding-x: clamp(1.5rem, 5vw, 6rem);
```

### Touch Targets
```css
/* Minimum 44×44px for interactive elements */
.button {
  min-height: 44px;
  min-width: 44px;
}

/* Disable hover on touch devices */
@media (hover: none) {
  .button:hover {
    /* No hover styles */
  }
}
```

### 3D Canvas Responsive
- Canvas automatically fills container
- `AdaptiveCanvas` adjusts pixelRatio based on quality
- Test canvas performance at each breakpoint

---

## Accessibility Checklist

### Required for Every Section

- [ ] Semantic HTML structure
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-hidden="true"` on decorative 3D content
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] Reduced motion: instant state, no animation
- [ ] Color contrast: 4.5:1 minimum (AA)
- [ ] Screen reader: meaningful text alternatives

### Testing
```bash
# Manual testing:
# 1. Tab through entire section
# 2. Use screen reader (NVDA/VoiceOver)
# 3. Enable reduced motion in OS
# 4. Enable high contrast in OS
# 5. Zoom to 200%
```

---

## Performance Checklist

### Before Submitting

- [ ] Section lazy-loads (not in initial bundle)
- [ ] 3D scene only mounts when section active
- [ ] Scene unmounts cleanly (no memory leaks)
- [ ] Models/textures load on demand
- [ ] Uses `AdaptiveCanvas` for quality adaptation
- [ ] Particle counts respect `useParticleCount()`
- [ ] Light count respects `useMaxLights()`
- [ ] Animations use transform/opacity only
- [ ] No layout thrashing in scroll callbacks
- [ ] `will-change` added/removed appropriately
- [ ] Tested with CPU 4x throttle
- [ ] Tested on mobile device

### Profiling
```bash
# In Chrome DevTools:
# 1. Performance tab → Record scroll session
# 2. Check for long tasks (> 50ms)
# 3. Memory tab → Heap snapshot before/after section
# 4. Look for detached DOM nodes, Three.js objects
```

---

## Code Quality Standards

### TypeScript
- Strict mode: no `any`, no implicit any
- Proper types for all props
- Use types from `src/types/index.ts`
- Export component types if reused

### React
- Functional components with hooks
- Proper cleanup in `useEffect`
- Memoize with `useMemo`/`useCallback` when needed
- Avoid inline object creation in render

### CSS
- Only use design tokens (no hardcoded values)
- BEM-ish naming: `.section-element--modifier`
- Mobile-first or consistent approach
- No `!important` (except utilities)

### File Organization
```
src/sections/
├── YourSection.tsx      # Main component
├── YourSection.css      # Styles only
├── YourScene.tsx        # 3D scene (if complex)
└── index.ts             # Exports (optional)
```

---

## Review Process

### Self-Review Checklist
Before requesting review, verify:

- [ ] Follows all guidelines above
- [ ] No new dependencies added
- [ ] Uses existing design tokens
- [ ] Uses existing components/hooks
- [ ] Clean TypeScript (no errors)
- [ ] Clean build (`npm run build`)
- [ ] Works in dev (`npm run dev`)
- [ ] Mobile responsive
- [ ] Reduced motion works
- [ ] High contrast works
- [ ] No console errors/warnings
- [ ] No memory leaks (tested)
- [ ] Accessible (tested)
- [ ] Performance acceptable (tested)

### What Reviewers Check
1. Architecture compliance
2. Design token usage
3. Performance patterns
4. Accessibility compliance
5. Code quality
6. Mobile experience
7. Cleanup completeness

---

## Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|------------------|
| Hardcoding colors/spacing | Use `var(--color-*)`, `var(--space-*)` |
| Multiple active 3D scenes | Use `SceneContext` (max 1) |
| Forgetting Three.js disposal | Always implement `onCleanup` |
| Animating `top`/`left`/`width` | Animate `transform`/`opacity` only |
| No reduced motion fallback | Use `useReducedMotion()` hook |
| Loading all models at start | Lazy load in `onSetup` |
| Adding npm packages | Request approval first |
| Modifying other sections | Work on one section only |
| Skipping mobile testing | Test on real device |
| Console.log in production | Remove before commit |

---

## Communication

### When Stuck
- Document the issue clearly
- Reference specific files/lines
- Explain what you've tried
- Propose options with trade-offs

### When Done
- Provide summary of changes
- Note any deviations from guidelines
- List testing performed
- Flag any known issues

---

## Version Control

### Branch Naming
```
section/[section-id]-[brief-description]
# Example: section/hero-3d-scene
```

### Commit Messages
```
feat(section): implement hero 3D scene with adaptive quality

- Add HeroScene component with metallic core
- Implement scroll-driven camera animation
- Add reduced motion fallback
- Optimize for mobile performance
```

---

## Resources

### Key Files to Reference
- `src/styles/design-tokens.css` — All design tokens
- `src/components/sections/Section.tsx` — Section base
- `src/components/3d/Canvas.tsx` — Canvas wrappers
- `src/components/3d/Scene.tsx` — Scene base classes
- `src/components/animations/ScrollAnimations.tsx` — Animation components
- `src/hooks/index.ts` — All custom hooks
- `src/context/*.tsx` — Context providers
- `src/config/products.ts` — Product/founder data

### Documentation
- `ARCHITECTURE.md` — Technical architecture
- `PERFORMANCE_GUIDELINES.md` — Performance requirements
- `DEVELOPMENT_ROADMAP.md` — Phase plans and concepts

---

*These guidelines ensure consistency, performance, and maintainability across all sections. When in doubt, ask before implementing.*