/**
 * Hero Section
 * The opening cinematic experience for Tracxi parent company website
 */

import React, { useEffect, useRef } from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { logoConfig } from '../config/products';
import { useSceneContext } from '../context/SceneContext';
import { usePerformanceContext } from '../context/PerformanceContext';
import { useReducedMotion } from '../hooks';
import './Hero.css';

export function Hero() {
  const { registerScene, setActiveScene } = useSceneContext();
  const { currentQuality } = usePerformanceContext();

  // Register hero scene
  React.useEffect(() => {
    registerScene({
      id: 'hero',
      name: 'Hero',
      enabled: true,
      priority: 10,
      preload: true,
      lazyLoad: false,
    });
    setActiveScene('hero');
  }, [registerScene, setActiveScene]);

  return (
    <Section sectionId="hero" name="Hero" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="hero" className="hero-canvas">
            <HeroCore />
          </AdaptiveCanvas>
        }
        foreground={
          <div className="hero-content">
            <div className="hero-logo">
              <img
                src={logoConfig.url}
                alt={logoConfig.alt}
                width={logoConfig.width}
                height={logoConfig.height}
              />
            </div>

            <SectionHeader
              label="Independent"
              title="One company."
              description="Multiple products. Supporting ideas across logistics, commerce, finance, learning and technology."
              className="hero-header"
            />

            <div className="hero-ctas">
              <a
                href="#"
                className="hero-cta hero-cta-primary"
                aria-label="Explore our products"
              >
                Explore our products
              </a>
              <a
                href="#"
                className="hero-cta hero-cta-secondary"
                aria-label="Meet our founders"
              >
                Meet our founders
              </a>
            </div>

            <div className="hero-scroll-indicator" aria-label="Scroll to explore content">
              <span>Scroll</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          </div>
        }
      />
    </Section>
  );
}

/**
 * TRACXI CORE 3D Object
 * Central abstract metallic sculpture
 */
function HeroCore() {
  const { reportMetric } = usePerformanceContext();
  const reducedMotion = useReducedMotion().prefersReducedMotion;

  useEffect(() => {
    const check = setInterval(() => {
      const canvas = document.querySelector('.hero-canvas canvas') as HTMLCanvasElement | null;
      if (canvas?.width > 0) {
        clearInterval(check);
        reportMetric('scene:hero:ready', Date.now());
      }
    }, 100);
    return () => clearInterval(check);
  }, [reportMetric]);

  const rotateRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const animateFn = (now: number) => {
      const elapsed = now - performance.now() - 10000;
      const rotation = (elapsed % 20000) / 20000;
      const core = document.querySelector('.hero-core-shape') as HTMLElement | null;
      if (core) {
        core.style.transform = `rotateY(${rotation * 360}deg) rotateX(${rotation * 15}deg)`;
      }
      rotateRef.current = requestAnimationFrame(animateFn);
    };
    animateFn(performance.now());

    return () => {
      if (rotateRef.current) cancelAnimationFrame(rotateRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-core" aria-hidden="true" role="img" title="Tracxi Core - abstract metallic sculpture">
      <div className="hero-core-shape" aria-hidden="true">
        <div className="hero-core-primary">
          <div className="hero-core-base">
            <div className="hero-core-facet hero-front" aria-hidden="true" />
            <div className="hero-core-facet hero-side" aria-hidden="true" />
            <div className="hero-core-facet hero-top" aria-hidden="true" />
          </div>
          <div className="hero-core-secondary">
            <div className="hero-core-facet hero-front2" aria-hidden="true" />
            <div className="hero-core-facet hero-side2" aria-hidden="true" />
          </div>
        </div>
        <div className="hero-core-accent" aria-hidden="true" />
      </div>
      <div className="hero-core-orbit" aria-hidden="true">
        <div className="hero-core-orbit-item" aria-hidden="true" />
        <div className="hero-core-orbit-item" aria-hidden="true" />
        <div className="hero-core-orbit-item" aria-hidden="true" />
      </div>
    </div>
  );
}