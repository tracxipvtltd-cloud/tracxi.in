/**
 * Hero Section
 * The opening cinematic experience for Tracxi parent company website
 */

import React, { useEffect, useRef } from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { logoConfig } from '../config/products';
import { useReducedMotion } from '../hooks';
import './Hero.css';

export function Hero() {

  return (
    <Section sectionId="hero" name="Hero" hasScene={false}>
      <SectionComposition
        background={
          <div className="hero-background" aria-hidden="true">
            <HeroCore />
          </div>
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
                href="#one-company-multiple-products"
                className="hero-cta hero-cta-primary"
                aria-label="Explore our products"
              >
                Explore our products
              </a>
              <a
                href="#meet-our-founders"
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
 * TRACXI CORE visual
 * Temporary CSS-based sculpture rendered outside Canvas for runtime stability.
 * TODO(Phase 02): replace with real R3F/Three geometry inside a valid Canvas.
 */
function HeroCore() {
  const { prefersReducedMotion } = useReducedMotion();
  const rotateRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const animateFn = () => {
      const elapsed = performance.now();
      const rotation = (elapsed % 20000) / 20000;
      const core = document.querySelector('.hero-core-shape') as HTMLElement | null;
      if (core) {
        core.style.transform = `rotateY(${rotation * 360}deg) rotateX(${rotation * 15}deg)`;
      }
      rotateRef.current = requestAnimationFrame(animateFn);
    };
    rotateRef.current = requestAnimationFrame(animateFn);

    return () => {
      if (rotateRef.current) cancelAnimationFrame(rotateRef.current);
    };
  }, [prefersReducedMotion]);

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