/**
 * Tracxi Animation Context
 * Global animation management with GSAP
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';
import type { AnimationContextValue, GSAPTimelineConfig, AnimationConfig, ScrollAnimationConfig } from '../types';

type GsapApi = typeof import('gsap').gsap;
type ScrollTriggerStatic = typeof import('gsap/ScrollTrigger').ScrollTrigger;
type ScrollTriggerInstance = import('gsap/ScrollTrigger').ScrollTrigger;
type GSAPTimeline = ReturnType<GsapApi['timeline']>;
type GSAPTween = ReturnType<GsapApi['to']>;
type GSAPAnimation = GSAPTimeline | GSAPTween;

// ============================================
// CONTEXT CREATION
// ============================================

const AnimationContext = createContext<AnimationContextValue | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

interface AnimationProviderProps {
  children: ReactNode;
  reducedMotion?: boolean;
}

export function AnimationProvider({ children, reducedMotion = false }: AnimationProviderProps) {
  const globalTimelineRef = useRef<GSAPTimeline | null>(null);
  const animationsRef = useRef<Map<string, GSAPAnimation>>(new Map());
  const scrollTriggersRef = useRef<Map<string, ScrollTriggerInstance>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const gsapRef = useRef<GsapApi | null>(null);
  const scrollTriggerRef = useRef<ScrollTriggerStatic | null>(null);

  // Initialize GSAP
  useEffect(() => {
    let mounted = true;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapMod, stMod]) => {
      if (!mounted) return;
      const gsap = (gsapMod.gsap || gsapMod.default) as GsapApi;
      const ScrollTrigger = (stMod.ScrollTrigger || stMod.default) as ScrollTriggerStatic;
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;
      scrollTriggerRef.current = ScrollTrigger;
      setIsInitialized(true);
    }).catch((err) => {
      console.error('Failed to initialize GSAP', err);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Create global timeline
  const createGlobalTimeline = useCallback((config?: GSAPTimelineConfig): GSAPTimeline | null => {
    if (!gsapRef.current) return null;
    const tl = gsapRef.current.timeline(config?.defaults);
    if (config?.id) {
      globalTimelineRef.current = tl;
    }
    return tl;
  }, []);

  // Register animation
  const registerAnimation = useCallback((id: string, animation: GSAPAnimation) => {
    animationsRef.current.set(id, animation);
  }, []);

  // Unregister animation
  const unregisterAnimation = useCallback((id: string) => {
    const animation = animationsRef.current.get(id);
    if (animation) {
      animation.kill();
      animationsRef.current.delete(id);
    }
  }, []);

  // Kill all animations
  const killAllAnimations = useCallback(() => {
    if (gsapRef.current) {
      gsapRef.current.killTweensOf('*');
    }
    animationsRef.current.forEach((animation) => animation.kill());
    animationsRef.current.clear();
    scrollTriggersRef.current.forEach((st) => st.kill());
    scrollTriggersRef.current.clear();
  }, []);

  // Pause all animations
  const pauseAllAnimations = useCallback(() => {
    if (gsapRef.current) {
      gsapRef.current.globalTimeline.pause();
    }
    animationsRef.current.forEach((animation) => animation.pause());
    scrollTriggersRef.current.forEach((st) => st.disable());
  }, []);

  // Resume all animations
  const resumeAllAnimations = useCallback(() => {
    if (gsapRef.current) {
      gsapRef.current.globalTimeline.resume();
    }
    animationsRef.current.forEach((animation) => animation.resume());
    scrollTriggersRef.current.forEach((st) => st.enable());
  }, []);

  // Create timeline
  const createTimeline = useCallback((config?: GSAPTimelineConfig): GSAPTimeline | null => {
    if (!gsapRef.current) return null;
    const tl = gsapRef.current.timeline(config?.defaults);
    if (config?.paused) tl.pause();
    if (config?.id) {
      animationsRef.current.set(config.id, tl as any);
    }
    return tl;
  }, []);

  // Create animation
  const createAnimation = useCallback((config: AnimationConfig): GSAPAnimation | null => {
    if (!gsapRef.current) return null;
    const { id, targets, ...vars } = config as AnimationConfig & { targets?: any };
    if (!targets) return null;
    const animation = gsapRef.current.to(targets, vars as any);
    if (id) {
      animationsRef.current.set(id, animation);
    }
    return animation;
  }, []);

  // Create scroll animation
  const createScrollAnimation = useCallback((config: ScrollAnimationConfig): ScrollTriggerInstance | null => {
    if (!gsapRef.current || !scrollTriggerRef.current) return null;

    const { id, trigger, ...scrollConfig } = config;
    const st = scrollTriggerRef.current.create({
      trigger: trigger as any,
      ...(scrollConfig as any),
    } as any);

    if (id) {
      scrollTriggersRef.current.set(id, st);
    }

    return st;
  }, []);

  // Alias for context/type compatibility
  const createScrollTrigger = createScrollAnimation;

  // Get animation by ID
  const getAnimation = useCallback((id: string): GSAPAnimation | undefined => {
    return animationsRef.current.get(id);
  }, []);

  // Get scroll trigger by ID
  const getScrollTrigger = useCallback((id: string): ScrollTriggerInstance | undefined => {
    return scrollTriggersRef.current.get(id);
  }, []);

  // Refresh ScrollTrigger
  const refreshScrollTriggers = useCallback(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.refresh();
    }
  }, []);

  // Update reduced motion
  useEffect(() => {
    if (reducedMotion && gsapRef.current) {
      gsapRef.current.globalTimeline.timeScale(0);
    } else if (gsapRef.current) {
      gsapRef.current.globalTimeline.timeScale(1);
    }
  }, [reducedMotion]);

  const value = useMemo<AnimationContextValue>(() => ({
    globalTimeline: globalTimelineRef.current,
    scrollTriggers: scrollTriggersRef.current as unknown as Map<string, any>,
    registerAnimation: registerAnimation as any,
    unregisterAnimation,
    killAllAnimations,
    pauseAllAnimations,
    resumeAllAnimations,
    createTimeline: createTimeline as any,
    createAnimation: createAnimation as any,
    createScrollTrigger: createScrollTrigger as any,
    getAnimation: getAnimation as any,
    getScrollTrigger: getScrollTrigger as any,
    refreshScrollTriggers,
    isInitialized,
  }), [
    registerAnimation,
    unregisterAnimation,
    killAllAnimations,
    pauseAllAnimations,
    resumeAllAnimations,
    createTimeline,
    createAnimation,
    createScrollTrigger,
    getAnimation,
    getScrollTrigger,
    refreshScrollTriggers,
    isInitialized,
  ]);

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

// ============================================
// HOOK FOR USING ANIMATION CONTEXT
// ============================================

export function useAnimationContext(): AnimationContextValue {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
}

// ============================================
// SELECTOR HOOKS
// ============================================

export function useGlobalTimeline(): GSAPTimeline | null {
  const { globalTimeline } = useAnimationContext();
  return globalTimeline;
}

export function useIsAnimationsInitialized(): boolean {
  const { isInitialized } = useAnimationContext();
  return isInitialized;
}

// ============================================
// ANIMATION CREATION HOOKS
// ============================================

export function useCreateTimeline(config?: GSAPTimelineConfig): GSAPTimeline | null {
  const { createTimeline, isInitialized } = useAnimationContext();
  const timelineRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    if (isInitialized) {
      timelineRef.current = createTimeline(config);
    }
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isInitialized, createTimeline, config]);

  return timelineRef.current;
}

export function useCreateAnimation(config: AnimationConfig): GSAPAnimation | null {
  const { createAnimation, isInitialized, unregisterAnimation } = useAnimationContext();
  const animationRef = useRef<GSAPAnimation | null>(null);

  useEffect(() => {
    if (isInitialized && config.id) {
      animationRef.current = createAnimation(config);
    }
    return () => {
      if (animationRef.current && config.id) {
        unregisterAnimation(config.id);
        animationRef.current = null;
      }
    };
  }, [isInitialized, createAnimation, unregisterAnimation, config]);

  return animationRef.current;
}

export function useScrollTrigger(config: ScrollAnimationConfig): ScrollTriggerInstance | null {
  const { createScrollTrigger, isInitialized, unregisterAnimation } = useAnimationContext();
  const triggerRef = useRef<ScrollTriggerInstance | null>(null);

  useEffect(() => {
    if (isInitialized && config.id) {
      triggerRef.current = createScrollTrigger(config) as ScrollTriggerInstance | null;
    }
    return () => {
      if (triggerRef.current && config.id) {
        triggerRef.current.kill();
        unregisterAnimation(config.id);
        triggerRef.current = null;
      }
    };
  }, [isInitialized, createScrollTrigger, unregisterAnimation, config]);

  return triggerRef.current;
}

// ============================================
// CLEANUP HOOK
// ============================================

export function useAnimationCleanup(animationIds: string[]): void {
  const { unregisterAnimation } = useAnimationContext();

  useEffect(() => {
    return () => {
      animationIds.forEach((id) => unregisterAnimation(id));
    };
  }, [unregisterAnimation, animationIds]);
}

// Types are declared near imports for GSAP v3 module compatibility.