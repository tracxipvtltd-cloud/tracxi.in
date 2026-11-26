/**
 * Hero Section - cinematic opening.
 * Existing 3D scene preserved; typography and composition art-directed.
 */
import React, { Suspense } from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import { CanvasWrapper } from '../components/3d/Canvas';
import { useReducedMotion } from '../hooks';
import './Hero.css';

const HeroScene = React.lazy(() => import('./HeroScene').then((m) => ({ default: m.HeroScene })));

function HeroFallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <div className="hero-fallback-form">
        <div className="hero-fallback-core" />
        <div className="hero-fallback-ring" />
      </div>
    </div>
  );
}

export function Hero() {
  const { prefersReducedMotion } = useReducedMotion();

  return (
    <Section sectionId="hero" name="Hero" hasScene={true} scenePriority={10}>
      <SectionComposition
        containerClassName="hero-composition"
        background={
          <div className="hero-scene-layer" aria-hidden="true">
            <div className="hero-scene-bg" />
            <CanvasWrapper
              className="hero-canvas"
              fallback={<HeroFallback />}
              loading={<HeroFallback />}
              error={<HeroFallback />}
              config={{ gl: { alpha: true, antialias: true, powerPreference: 'high-performance' }, shadows: true, dpr: [1, 1.5] }}
              camera={{ fov: 36, near: 0.1, far: 50, position: [0, 0.15, 9.5] }}
            >
              <Suspense fallback={null}>
                <HeroScene reducedMotion={prefersReducedMotion} />
              </Suspense>
            </CanvasWrapper>
            <div className="hero-scene-veil" />
          </div>
        }
        foreground={
          <div className="hero-shell">
            <div className="hero-topline">
              <p className="hero-eyebrow">
                <span className="hero-eyebrow-rule" aria-hidden="true" />
                Independent technology company
              </p>
              <span className="hero-index micro">01 / 13</span>
            </div>

            <div className="hero-main">
              <h1 className="hero-title">
                <span className="hero-title-line hero-title-line--sans">We build</span>
                <span className="hero-title-line hero-title-line--serif">what comes next.</span>
              </h1>

              <div className="hero-lower">
                <p className="hero-lead">
                  An independent technology company building products, platforms and experiences for the world ahead.
                </p>
                <div className="hero-actions">
                  <a href="#one-company-multiple-products" className="hero-btn hero-btn-primary">
                    <span>Explore our products</span>
                    <span className="hero-btn-arrow" aria-hidden="true">↗</span>
                  </a>
                  <a href="#meet-our-founders" className="hero-btn hero-btn-secondary">
                    <span>Meet our founders</span>
                    <span className="hero-btn-arrow" aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-bottom">
              <a href="#meet-our-founders" className="hero-scroll">
                <span className="hero-scroll-mark" aria-hidden="true" />
                <span>Scroll to explore</span>
              </a>
              <p className="hero-note micro">One company. Multiple products. One vision.</p>
            </div>
          </div>
        }
      />
    </Section>
  );
}
