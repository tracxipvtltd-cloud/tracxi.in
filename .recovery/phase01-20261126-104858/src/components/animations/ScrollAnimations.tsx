/**
 * Tracxi Scroll Animations
 * GSAP ScrollTrigger-based animation components
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useGSAP, useScrollTrigger } from '../../hooks';
import { useReducedMotion, useScrollProgress, useIntersection } from '../../hooks';
import type { AnimationConfig, ScrollAnimationConfig } from '../../types';

// ============================================
// SCROLL TRIGGER COMPONENT
// ============================================

interface ScrollTriggerProps {
  /** Trigger element or selector */
  trigger?: string | Element;
  /** Animation start position */
  start?: string;
  /** Animation end position */
  end?: string;
  /** Scrub value (true, number, or false) */
  scrub?: number | boolean;
  /** Pin the trigger element */
  pin?: boolean;
  /** Pin spacing */
  pinSpacing?: boolean;
  /** Anticipate pin */
  anticipatePin?: number;
  /** Show markers (debug) */
  markers?: boolean;
  /** Callback on enter */
  onEnter?: () => void;
  /** Callback on leave */
  onLeave?: () => void;
  /** Callback on enter back */
  onEnterBack?: () => void;
  /** Callback on leave back */
  onLeaveBack?: () => void;
  /** Callback on update */
  onUpdate?: (self: any) => void;
  /** Children */
  children?: React.ReactNode;
  /** Unique ID */
  id?: string;
}

export function ScrollTriggerComponent({
  trigger,
  start = 'top bottom',
  end = 'bottom top',
  scrub = true,
  pin = false,
  pinSpacing = true,
  anticipatePin = 0,
  markers = false,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
  onUpdate,
  children,
  id,
}: ScrollTriggerProps) {
  const prefersReducedMotion = useReducedMotion();
  const scrollTrigger = useScrollTrigger({
    id,
    trigger: trigger as any,
    start,
    end,
    scrub: prefersReducedMotion ? false : scrub,
    pin,
    pinSpacing,
    anticipatePin,
    markers,
  });

  // Handle callbacks
  useEffect(() => {
    if (!scrollTrigger) return;

    const callbacks = {
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
      onUpdate,
    };

    Object.entries(callbacks).forEach(([key, callback]) => {
      if (callback) {
        (scrollTrigger as any)[key] = callback;
      }
    });

    return () => {
      Object.keys(callbacks).forEach((key) => {
        if (callbacks[key as keyof typeof callbacks]) {
          (scrollTrigger as any)[key] = undefined;
        }
      });
    };
  }, [scrollTrigger, onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate]);

  // Refresh on resize
  useEffect(() => {
    if (scrollTrigger) {
      const handleResize = () => scrollTrigger.refresh();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [scrollTrigger]);

  return <>{children}</>;
}

// ============================================
// FADE IN ON SCROLL
// ============================================

interface FadeInProps {
  /** Trigger element */
  trigger?: string | Element;
  /** Start position */
  start?: string;
  /** End position */
  end?: string;
  /** Animation duration */
  duration?: number;
  /** Delay */
  delay?: number;
  /** Ease function */
  ease?: string;
  /** Stagger for multiple elements */
  stagger?: number;
  /** Children */
  children: React.ReactNode;
  /** ClassName for animated elements */
  className?: string;
  /** Element tag */
  as?: React.ElementType;
}

export function FadeIn({
  trigger,
  start = 'top 80%',
  end = 'bottom 20%',
  duration = 1,
  delay = 0,
  ease = 'power2.out',
  stagger = 0,
  children,
  className,
  as: Component = 'div',
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  const { createAnimation, isLoaded } = useGSAP();
  const elementRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!isLoaded || prefersReducedMotion || !elementRef.current) return;

    const elements = Array.from(elementRef.current.children) as HTMLElement[];
    if (elements.length === 0) return;

    elementsRef.current = elements;

    // Set initial state
    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.willChange = 'opacity, transform';
    });

    const animation = createAnimation({
      id: `fade-in-${Date.now()}`,
      targets: elements,
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      stagger,
      scrollTrigger: {
        trigger: trigger || elementRef.current,
        start,
        end,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      animation?.kill();
      elements.forEach((el) => {
        el.style.willChange = 'auto';
      });
    };
  }, [isLoaded, prefersReducedMotion, createAnimation, trigger, start, end, duration, delay, ease, stagger]);

  return (
    <Component
      ref={elementRef}
      className={className}
      style={{ opacity: prefersReducedMotion ? 1 : 0 }}
    >
      {children}
    </Component>
  );
}

// ============================================
// SLIDE UP ON SCROLL
// ============================================

interface SlideUpProps extends Omit<FadeInProps, 'ease'> {
  /** Slide distance */
  distance?: number;
}

export function SlideUp({
  trigger,
  start = 'top 85%',
  end = 'bottom 15%',
  duration = 1.2,
  delay = 0,
  distance = 50,
  stagger = 0.1,
  children,
  className,
  as: Component = 'div',
}: SlideUpProps) {
  const prefersReducedMotion = useReducedMotion();
  const { createAnimation, isLoaded } = useGSAP();
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLoaded || prefersReducedMotion || !elementRef.current) return;

    const elements = Array.from(elementRef.current.children) as HTMLElement[];
    if (elements.length === 0) return;

    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `translateY(${distance}px)`;
      el.style.willChange = 'opacity, transform';
    });

    const animation = createAnimation({
      id: `slide-up-${Date.now()}`,
      targets: elements,
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: trigger || elementRef.current,
        start,
        end,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      animation?.kill();
      elements.forEach((el) => {
        el.style.willChange = 'auto';
      });
    };
  }, [isLoaded, prefersReducedMotion, createAnimation, trigger, start, end, duration, delay, distance, stagger]);

  return (
    <Component
      ref={elementRef}
      className={className}
      style={{ opacity: prefersReducedMotion ? 1 : 0 }}
    >
      {children}
    </Component>
  );
}

// ============================================
// SCALE IN ON SCROLL
// ============================================

interface ScaleInProps extends Omit<FadeInProps, 'ease'> {
  /** Initial scale */
  fromScale?: number;
}

export function ScaleIn({
  trigger,
  start = 'top 80%',
  end = 'bottom 20%',
  duration = 0.8,
  delay = 0,
  fromScale = 0.9,
  stagger = 0.05,
  children,
  className,
  as: Component = 'div',
}: ScaleInProps) {
  const prefersReducedMotion = useReducedMotion();
  const { createAnimation, isLoaded } = useGSAP();
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLoaded || prefersReducedMotion || !elementRef.current) return;

    const elements = Array.from(elementRef.current.children) as HTMLElement[];
    if (elements.length === 0) return;

    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `scale(${fromScale})`;
      el.style.willChange = 'opacity, transform';
    });

    const animation = createAnimation({
      id: `scale-in-${Date.now()}`,
      targets: elements,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: 'back.out(1.5)',
      stagger,
      scrollTrigger: {
        trigger: trigger || elementRef.current,
        start,
        end,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      animation?.kill();
      elements.forEach((el) => {
        el.style.willChange = 'auto';
      });
    };
  }, [isLoaded, prefersReducedMotion, createAnimation, trigger, start, end, duration, delay, fromScale, stagger]);

  return (
    <Component
      ref={elementRef}
      className={className}
      style={{ opacity: prefersReducedMotion ? 1 : 0 }}
    >
      {children}
    </Component>
  );
}

// ============================================
// PARALLAX ON SCROLL
// ============================================

interface ParallaxProps {
  /** Parallax speed (0-1) */
  speed?: number;
  /** Direction */
  direction?: 'vertical' | 'horizontal';
  /** Children */
  children: React.ReactNode;
  /** ClassName */
  className?: string;
}

export function Parallax({
  speed = 0.3,
  direction = 'vertical',
  children,
  className,
}: ParallaxProps) {
  const prefersReducedMotion = useReducedMotion();
  const scrollY = useScrollProgress();
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) return;

    const updateTransform = () => {
      const y = scrollY * window.innerHeight * speed;
      elementRef.current!.style.transform = direction === 'vertical'
        ? `translateY(${y}px)`
        : `translateX(${y}px)`;
    };

    updateTransform();

    const handleScroll = () => {
      requestAnimationFrame(updateTransform);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY, speed, direction, prefersReducedMotion]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        willChange: 'transform',
        transform: prefersReducedMotion ? 'none' : undefined,
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// PIN ON SCROLL
// ============================================

interface PinProps {
  /** Trigger element */
  trigger?: string | Element;
  /** Start position */
  start?: string;
  /** End position */
  end?: string;
  /** Pin spacing */
  pinSpacing?: boolean;
  /** Children */
  children: React.ReactNode;
  /** ClassName */
  className?: string;
}

export function Pin({
  trigger,
  start = 'top top',
  end = 'bottom bottom',
  pinSpacing = true,
  children,
  className,
}: PinProps) {
  const prefersReducedMotion = useReducedMotion();

  useScrollTrigger({
    id: `pin-${Date.now()}`,
    trigger: trigger as any,
    start,
    end,
    pin: !prefersReducedMotion,
    pinSpacing,
    scrub: 1,
  });

  return (
    <div className={className}>
      {children}
    </div>
  );
}

// ============================================
// TEXT REVEAL ON SCROLL
// ============================================

interface TextRevealProps {
  /** Text to reveal */
  text: string;
  /** Split by */
  splitBy?: 'chars' | 'words' | 'lines';
  /** Animation duration */
  duration?: number;
  /** Stagger */
  stagger?: number;
  /** Ease */
  ease?: string;
  /** Start position */
  start?: string;
  /** ClassName */
  className?: string;
  /** Tag */
  as?: React.ElementType;
}

export function TextReveal({
  text,
  splitBy = 'words',
  duration = 0.8,
  stagger = 0.03,
  ease = 'power3.out',
  start = 'top 85%',
  className,
  as: Component = 'p',
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const { createAnimation, isLoaded } = useGSAP();
  const elementRef = useRef<HTMLElement>(null);

  // Split text
  const parts = React.useMemo(() => {
    switch (splitBy) {
      case 'chars':
        return text.split('').map((char) => char === ' ' ? ' ' : char);
      case 'words':
        return text.split(/(\s+)/).filter((w) => w.length > 0);
      case 'lines':
        return text.split('\n');
      default:
        return [text];
    }
  }, [text, splitBy]);

  useEffect(() => {
    if (!isLoaded || prefersReducedMotion || !elementRef.current) return;

    const spans = Array.from(elementRef.current.querySelectorAll('span')) as HTMLElement[];
    if (spans.length === 0) return;

    spans.forEach((span) => {
      span.style.opacity = '0';
      span.style.transform = 'translateY(100%)';
      span.style.display = 'inline-block';
      span.style.willChange = 'opacity, transform';
    });

    const animation = createAnimation({
      id: `text-reveal-${Date.now()}`,
      targets: spans,
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: elementRef.current,
        start,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      animation?.kill();
      spans.forEach((span) => {
        span.style.willChange = 'auto';
      });
    };
  }, [isLoaded, prefersReducedMotion, createAnimation, duration, stagger, ease, start]);

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component
      ref={elementRef}
      className={className}
      style={{ overflow: 'hidden' }}
    >
      {parts.map((part, i) => (
        <span key={i} style={{ whiteSpace: splitBy === 'chars' ? 'nowrap' : 'normal' }}>
          {part}
        </span>
      ))}
    </Component>
  );
}

// ============================================
// COUNTER ANIMATION
// ============================================

interface CounterProps {
  /** End value */
  to: number;
  /** Start value */
  from?: number;
  /** Duration */
  duration?: number;
  /** Ease */
  ease?: string;
  /** Decimals */
  decimals?: number;
  /** Prefix */
  prefix?: string;
  /** Suffix */
  suffix?: string;
  /** Formatter */
  formatter?: (value: number) => string;
  /** Start position */
  start?: string;
  /** ClassName */
  className?: string;
}

export function Counter({
  to,
  from = 0,
  duration = 2,
  ease = 'power2.out',
  decimals = 0,
  prefix = '',
  suffix = '',
  formatter,
  start = 'top 85%',
  className,
}: CounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const { createAnimation, isLoaded } = useGSAP();
  const elementRef = useRef<HTMLElement>(null);
  const valueRef = useRef({ value: from });

  useEffect(() => {
    if (!isLoaded || !elementRef.current) return;

    if (prefersReducedMotion) {
      const finalValue = formatter ? formatter(to) : to.toFixed(decimals);
      elementRef.current.textContent = `${prefix}${finalValue}${suffix}`;
      return;
    }

    const obj = { value: from };

    const animation = createAnimation({
      id: `counter-${Date.now()}`,
      targets: obj,
      value: to,
      duration,
      ease,
      onUpdate: () => {
        if (elementRef.current) {
          const displayValue = formatter
            ? formatter(obj.value)
            : obj.value.toFixed(decimals);
          elementRef.current.textContent = `${prefix}${displayValue}${suffix}`;
        }
      },
      scrollTrigger: {
        trigger: elementRef.current,
        start,
        toggleActions: 'play none none reset',
      },
    });

    return () => animation?.kill();
  }, [isLoaded, prefersReducedMotion, createAnimation, to, from, duration, ease, decimals, prefix, suffix, formatter, start]);

  return (
    <span
      ref={elementRef}
      className={className}
      style={{ display: 'inline-block', minWidth: '2ch' }}
    >
      {prefersReducedMotion
        ? `${prefix}${formatter ? formatter(to) : to.toFixed(decimals)}${suffix}`
        : `${prefix}${from.toFixed(decimals)}${suffix}`}
    </span>
  );
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

interface ScrollProgressBarProps {
  /** Height */
  height?: number;
  /** Color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Position */
  position?: 'top' | 'bottom';
  /** ClassName */
  className?: string;
}

export function ScrollProgressBar({
  height = 3,
  color = 'var(--color-accent-primary)',
  backgroundColor = 'var(--color-border-subtle)',
  position = 'top',
  className,
}: ScrollProgressBarProps) {
  const progress = useScrollProgress();

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: color,
          transformOrigin: 'left',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}

// ============================================
// VIEWPORT ANIMATION
// ============================================

interface ViewportAnimationProps {
  /** Animation config */
  animation: Omit<AnimationConfig, 'trigger'>;
  /** Root margin */
  rootMargin?: string;
  /** Threshold */
  threshold?: number | number[];
  /** Once only */
  once?: boolean;
  /** Children */
  children: React.ReactNode;
  /** ClassName */
  className?: string;
}

export function ViewportAnimation({
  animation,
  rootMargin = '0px',
  threshold = 0.1,
  once = true,
  children,
  className,
}: ViewportAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const { createAnimation, isLoaded } = useGSAP();
  const elementRef = useRef<HTMLElement>(null);
  const { observe, unobserve, isIntersecting } = useIntersection({
    rootMargin,
    threshold,
    triggerOnce: once,
  });

  useEffect(() => {
    if (elementRef.current) {
      observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        unobserve(elementRef.current);
      }
    };
  }, [observe, unobserve]);

  useEffect(() => {
    if (!isLoaded || prefersReducedMotion || !isIntersecting || !elementRef.current) return;

    const anim = createAnimation({
      ...animation,
      targets: elementRef.current,
    });

    return () => anim?.kill();
  }, [isLoaded, prefersReducedMotion, isIntersecting, createAnimation, animation]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}