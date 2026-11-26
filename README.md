# Tracxi Parent Company Website

> **One Company. Multiple Products. One Vision.**

The official Tracxi parent-company website — a premium, cinematic, immersive 3D digital experience built with React, TypeScript, Three.js, and GSAP.

## 🎯 Project Overview

This website represents the Tracxi parent company and its ecosystem of products:
- **Tracxi by Suresh B** — Published logistics platform (the foundation)
- **Tracxi 2.0** — Under Development (next evolution)
- **VCX Mart** — Under Development (premium commerce)
- **Trackspense** — Under Testing (finance & expenses)
- **Magic Matrix** — Closed Testing (digital systems)
- **Wah Mahi Ring** — Research & Development (luxury jewelry)
- **Tracxi Learn** — Under Development (education)
- **SkillForge** — Under Development (skills mastery)
- **Vision AI** — LLM Under Training (internal AI project)

## 🛠 Technology Stack

| Category | Technologies |
|----------|--------------|
| **Core** | React 18, TypeScript, Vite |
| **3D** | Three.js, React Three Fiber, Drei |
| **Animation** | GSAP, ScrollTrigger |
| **Scrolling** | Lenis (smooth scroll) |
| **Styling** | CSS Variables, Modular CSS |
| **Icons** | Lucide React |
| **Assets** | GLB/glTF, Optimized textures |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
cd tracxi.in

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
npm run dev          # Start dev server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📁 Project Structure

```
src/
├── components/
│   ├── 3d/              # Three.js canvas & scene components
│   ├── animations/      # GSAP ScrollTrigger animations
│   ├── layout/          # Navigation, Footer
│   ├── sections/        # Section base components
│   └── ui/              # Reusable UI components
├── config/
│   └── products.ts      # Centralized product/founder data
├── context/
│   ├── AppContext.tsx   # Global app state
│   ├── SceneContext.tsx # 3D scene management
│   ├── AnimationContext.tsx # GSAP animation management
│   └── PerformanceContext.tsx # Performance monitoring
├── hooks/               # Custom React hooks
├── sections/            # Individual section implementations
├── styles/
│   ├── design-tokens.css  # Global design system tokens
│   ├── global.css         # Base styles & resets
│   └── index.css          # Main styles entry
├── types/               # TypeScript definitions
├── utils/               # Utility functions
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## 🎨 Design System

### Colors
- **Ivory Scale** — Warm backgrounds (`--color-ivory-*`)
- **Graphite Scale** — Text & dark surfaces (`--color-graphite-*`)
- **Silver Scale** — Metallic accents (`--color-silver-*`)
- **Champagne** — Restrained accent color (`--color-champagne-*`)

### Typography
- **Display** — Inter Display (headlines)
- **Body** — Inter (body text)
- **Mono** — JetBrains Mono (code)

### Spacing
Fluid/responsive spacing using `clamp()`:
- `--section-padding-x`: `clamp(1.5rem, 5vw, 6rem)`
- `--section-padding-y`: `clamp(4rem, 10vw, 12rem)`

### Breakpoints
- `xs`: 320px, `sm`: 480px, `md`: 768px, `lg`: 1024px, `xl`: 1280px, `2xl`: 1536px, `3xl`: 1920px

## ⚡ Performance Architecture

### Key Principles
- **Lazy loading** — Sections and 3D scenes load on demand
- **Single active scene** — Only one 3D scene renders at a time
- **Adaptive quality** — Automatically adjusts quality based on device performance
- **Reduced motion support** — Respects `prefers-reduced-motion`
- **WebGL fallback** — Graceful degradation when WebGL unavailable

### Quality Levels
| Level | Pixel Ratio | Shadows | Post-Processing | Max Lights | Particles |
|-------|-------------|---------|-----------------|------------|-----------|
| Low   | 1x          | Off     | Off             | 1          | 100       |
| Medium| 1.5x        | On      | Off             | 3          | 500       |
| High  | 2x          | On      | On              | 5          | 1000      |
| Ultra | Device DPR  | On      | On              | 8          | 2000      |

## 🧩 Adding New Sections

1. **Create section component** in `src/sections/`
2. **Add styles** in `src/sections/[SectionName].css`
3. **Register in** `src/App.tsx` sectionComponents map
4. **Add to sectionOrder** in `src/config/products.ts`
5. **Follow Section Development Guidelines** (see below)

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md) — Technical architecture overview
- [Development Roadmap](./DEVELOPMENT_ROADMAP.md) — Phased development plan
- [Performance Guidelines](./PERFORMANCE_GUIDELINES.md) — Performance best practices
- [Section Development Guidelines](./SECTION_DEVELOPMENT_GUIDELINES.md) — How to build sections

## 🔒 Rules & Constraints

### Logo Rule
**Only ONE logo** — the official Tracxi parent company logo:
```
https://res.cloudinary.com/dfisnbg4l/image/upload/v1795631828/657f5924-f124-48e5-8a7d-c85abc68a415.png
```

### Product Status Honesty
- Never represent unpublished projects as launched
- Statuses: Published, Under Development, Under Testing, Closed Testing, R&D, LLM Under Training

### No Generic Patterns
- No SaaS cards, no purple gradients, no neon, no gaming aesthetics
- Premium, minimal, cinematic, editorial, luxury technology aesthetic only

## 🤝 External AI Contributor Guidelines

See [SECTION_DEVELOPMENT_GUIDELINES.md](./SECTION_DEVELOPMENT_GUIDELINES.md) for complete rules.

Key principles:
- Work on **one section at a time**
- Never rewrite the entire project
- Use existing design tokens and components
- Ensure mobile responsiveness
- Clean up event listeners and animations
- Verify builds before submitting

## 📄 License

Proprietary — Tracxi Parent Company. All rights reserved.

---

Built with precision for the Tracxi ecosystem.