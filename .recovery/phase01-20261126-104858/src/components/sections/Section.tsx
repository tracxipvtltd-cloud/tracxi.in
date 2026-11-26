/**
 * Tracxi Section Component
 * Base wrapper for all website sections with lifecycle management
 */

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useSceneContext } from '../../context/SceneContext';
import { cn } from '../../utils';
import type { SectionProps } from '../../types';
import './Section.css';

interface UseIntersectionReturn {
  ref: React.RefCallback<HTMLDivElement> | React.RefObject<HTMLDivElement> | null;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
  observe: (element: Element | null) => void;
  unobserve: (element: Element | null) => void;
}

function useIntersection(options?: IntersectionObserverInit): UseIntersectionReturn {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (element) {
      observerRef.current = new IntersectionObserver(([newEntry]) => {
        setEntry(newEntry);
      }, options);
      observerRef.current.observe(element);
    }
  }, [options]);

  const unobserve = useCallback((element: Element | null) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    isIntersecting: entry?.isIntersecting ?? false,
    entry,
    observe,
    unobserve,
    ref: observe, // Use observe as ref callback
  };
}

interface SectionWrapperProps extends SectionProps {
  /** Section identifier from sectionOrder */
  sectionId: string;
  /** Section display name */
  name: string;
  /** Section content */
  children: React.ReactNode;
  /** Whether this section has a 3D scene */
  hasScene?: boolean;
  /** Scene ID if different from sectionId */
  sceneId?: string;
  /** Priority for scene loading (higher = more important) */
  scenePriority?: number;
  /** Custom className */
  className?: string;
  /** Additional props passed to the section element */
  'data-section-id'?: string;
}

export function Section({
  sectionId,
  name,
  children,
  hasScene = false,
  sceneId,
  scenePriority = 0,
  className,
  isActive,
  isVisible,
  onEnter,
  onLeave,
  id,
  'data-section-id': dataSectionId,
  ...props
}: SectionWrapperProps) {
  const { currentSection, setCurrentSection, navigateToSection } = useAppContext();
  const { registerScene, unregisterScene, setActiveScene, isSceneMounted, preloadScene } = useSceneContext();
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasTriggeredEnter = useRef(false);
  const hasTriggeredLeave = useRef(false);

  const resolvedSceneId = sceneId || sectionId;
  const isCurrentSection = currentSection === sectionId;

  // Intersection observer for scroll-based activation
  const { ref: intersectionRef, isIntersecting } = useIntersection({
    rootMargin: '-10% 0px -10% 0px',
    threshold: 0.1,
  });

  // Combined ref
  const setRef = (node: HTMLDivElement | null): void => {
    sectionRef.current = node;
    // intersectionRef is the observe function, not a ref callback
    // The observe function from useIntersection is called directly in the useEffect below
  };

  // Register scene on mount
  useEffect(() => {
    if (hasScene) {
      registerScene({
        id: resolvedSceneId,
        name,
        enabled: true,
        priority: scenePriority,
        preload: scenePriority > 0,
        lazyLoad: true,
      });

      return () => {
        unregisterScene(resolvedSceneId);
      };
    }
  }, [hasScene, resolvedSceneId, name, scenePriority, registerScene, unregisterScene]);

  // Handle section enter/leave
  useEffect(() => {
    if (isCurrentSection && !hasTriggeredEnter.current) {
      hasTriggeredEnter.current = true;
      hasTriggeredLeave.current = false;
      onEnter?.();
      setCurrentSection(sectionId);

      // Activate scene if present
      if (hasScene) {
        setActiveScene(resolvedSceneId);
      }
    } else if (!isCurrentSection && hasTriggeredEnter.current && !hasTriggeredLeave.current) {
      hasTriggeredLeave.current = true;
      hasTriggeredEnter.current = false;
      onLeave?.();
    }
  }, [isCurrentSection, onEnter, onLeave, setCurrentSection, sectionId, hasScene, resolvedSceneId, setActiveScene]);

  // Handle intersection for preloading
  useEffect(() => {
    if (isIntersecting && hasScene && !isSceneMounted(resolvedSceneId)) {
      preloadScene(resolvedSceneId);
    }
  }, [isIntersecting, hasScene, resolvedSceneId, isSceneMounted, preloadScene]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCurrentSection) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        navigateToSection(getNextSection(sectionId));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateToSection(getPreviousSection(sectionId));
      }
    };

    if (isCurrentSection) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCurrentSection, sectionId, navigateToSection]);

  // Generate section classes
  const sectionClasses = useMemo(() => cn(
    'tracxi-section',
    `section-${sectionId}`,
    {
      'is-active': isCurrentSection,
      'is-visible': isVisible || isIntersecting,
      'has-scene': hasScene,
    },
    className
  ), [sectionId, isCurrentSection, isVisible, isIntersecting, hasScene, className]);

  return (
    <section
      ref={setRef}
      id={id || sectionId}
      data-section-id={dataSectionId || sectionId}
      data-section-name={name}
      className={sectionClasses}
      role="region"
      aria-label={name}
      {...props}
    >
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}

// Helper functions for navigation
function getNextSection(currentId: string): string {
  const { sectionOrder } = require('../../config/products');
  const currentIndex = sectionOrder.indexOf(currentId);
  if (currentIndex < sectionOrder.length - 1) {
    return sectionOrder[currentIndex + 1];
  }
  return currentId;
}

function getPreviousSection(currentId: string): string {
  const { sectionOrder } = require('../../config/products');
  const currentIndex = sectionOrder.indexOf(currentId);
  if (currentIndex > 0) {
    return sectionOrder[currentIndex - 1];
  }
  return currentId;
}

// ============================================
// SECTION COMPOSITION HELPERS
// ============================================

export interface SectionCompositionProps {
  /** Background content (e.g., 3D canvas) */
  background?: React.ReactNode;
  /** Foreground content (text, UI) */
  foreground?: React.ReactNode;
  /** Overlay content (fixed elements) */
  overlay?: React.ReactNode;
  /** Custom container className */
  containerClassName?: string;
}

/**
 * Compose a section with layered content
 */
export function SectionComposition({
  background,
  foreground,
  overlay,
  containerClassName,
}: SectionCompositionProps) {
  return (
    <div className={cn('section-composition', containerClassName)}>
      {background && <div className="section-background">{background}</div>}
      {foreground && <div className="section-foreground">{foreground}</div>}
      {overlay && <div className="section-overlay">{overlay}</div>}
    </div>
  );
}

/**
 * Section header component
 */
export interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ label, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn('section-header', className)}>
      {label && <span className="section-label">{label}</span>}
      <h1 className="section-title">{title}</h1>
      {description && <p className="section-description">{description}</p>}
    </header>
  );
}

/**
 * Section divider
 */
export function SectionDivider(className?: string) {
  return <hr className={cn('section-divider', className)} aria-hidden="true" />;
}