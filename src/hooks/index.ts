/**
 * Tracxi Custom Hooks
 * Reusable hooks for the entire application
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ============================================
// MEDIA QUERY HOOKS
// ============================================

export interface UseMediaQueryReturn {
  matches: boolean;
  mediaQuery: string;
}

export function useMediaQuery(query: string): UseMediaQueryReturn {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return { matches, mediaQuery: query };
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const breakpoints: Record<Breakpoint, number> = {
    xs: 320,
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,
  };

  const { matches } = useMediaQuery(`(max-width: ${breakpoints[breakpoint]}px)`);
  return matches;
}

export function useBreakpoints(): Record<Breakpoint, boolean> {
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  const result = {} as Record<Breakpoint, boolean>;

  breakpoints.forEach((bp) => {
    const { matches } = useMediaQuery(`(max-width: ${(
      { xs: 320, sm: 480, md: 768, lg: 1024, xl: 1280, '2xl': 1536, '3xl': 1920 } as Record<Breakpoint, number>
    )[bp]}px)`);
    result[bp] = matches;
  });

  return result;
}

// ============================================
// REDUCED MOTION HOOK
// ============================================

export interface UseReducedMotionReturn {
  prefersReducedMotion: boolean;
  prefersReducedMotionQuery: MediaQueryList;
}

export function useReducedMotion(): UseReducedMotionReturn {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const queryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    queryRef.current = query;
    setPrefersReducedMotion(query.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return { prefersReducedMotion, prefersReducedMotionQuery: queryRef.current! };
}

// ============================================
// DEVICE CAPABILITIES HOOK
// ============================================

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  hasHover: boolean;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
  webglSupport: boolean;
  webgl2Support: boolean;
  maxTextureSize: number;
  devicePixelRatio: number;
  memory?: number;
  cores?: number;
}

export interface UseDeviceCapabilitiesReturn {
  capabilities: DeviceCapabilities;
  updateCapabilities: () => void;
}

export function useDeviceCapabilities(): UseDeviceCapabilitiesReturn {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    hasHover: true,
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false,
    webglSupport: true,
    webgl2Support: true,
    maxTextureSize: 4096,
    devicePixelRatio: 1,
  });

  const updateCapabilities = useCallback(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);
    const isDesktop = !isMobile && !isTablet;

    let webglSupport = false;
    let webgl2Support = false;
    let maxTextureSize = 4096;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const gl2 = canvas.getContext('webgl2');
      webglSupport = !!gl;
      webgl2Support = !!gl2;
      if (gl) maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    } catch {
      // Ignore
    }

    setCapabilities({
      isMobile,
      isTablet,
      isDesktop,
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hasHover: window.matchMedia('(hover: hover)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      webglSupport,
      webgl2Support,
      maxTextureSize,
      devicePixelRatio: window.devicePixelRatio || 1,
      memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
      cores: navigator.hardwareConcurrency,
    });
  }, []);

  useEffect(() => {
    updateCapabilities();

    const handleResize = () => updateCapabilities();
    window.addEventListener('resize', handleResize);

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqContrast = window.matchMedia('(prefers-contrast: high)');
    const mqDark = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => updateCapabilities();
    mqReduced.addEventListener('change', handleChange);
    mqContrast.addEventListener('change', handleChange);
    mqDark.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mqReduced.removeEventListener('change', handleChange);
      mqContrast.removeEventListener('change', handleChange);
      mqDark.removeEventListener('change', handleChange);
    };
  }, [updateCapabilities]);

  return { capabilities, updateCapabilities };
}

// ============================================
// SCROLL HOOKS
// ============================================

export interface UseScrollReturn {
  scrollY: number;
  scrollX: number;
  scrollDirection: 'up' | 'down' | 'left' | 'right' | 'none';
  progress: number;
  isScrolling: boolean;
  velocity: number;
}

export function useScroll(): UseScrollReturn {
  const [state, setState] = useState<UseScrollReturn>({
    scrollY: 0,
    scrollX: 0,
    scrollDirection: 'none',
    progress: 0,
    isScrolling: false,
    velocity: 0,
  });

  const lastScrollY = useRef(0);
  const lastScrollX = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const rafIdRef = useRef<ReturnType<typeof requestAnimationFrame> | undefined>(undefined);

  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;

      const deltaY = scrollY - lastScrollY.current;
      const deltaX = scrollX - lastScrollX.current;

      const velocity = deltaTime > 0 ? Math.sqrt(deltaY ** 2 + deltaX ** 2) / deltaTime : 0;

      let direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'none';
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        direction = deltaY > 0 ? 'down' : 'up';
      } else if (deltaX !== 0) {
        direction = deltaX > 0 ? 'right' : 'left';
      }

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      setState({
        scrollY,
        scrollX,
        scrollDirection: direction,
        progress: Math.min(Math.max(progress, 0), 1),
        isScrolling: true,
        velocity,
      });

      lastScrollY.current = scrollY;
      lastScrollX.current = scrollX;
      lastTimeRef.current = now;

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, isScrolling: false }));
      }, 150);

      rafIdRef.current = requestAnimationFrame(updateScroll);
    };

    rafIdRef.current = requestAnimationFrame(updateScroll);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return state;
}

export function useScrollDirection(): 'up' | 'down' | 'none' {
  const { scrollDirection } = useScroll();
  return scrollDirection === 'up' || scrollDirection === 'down' ? scrollDirection : 'none';
}

export function useScrollProgress(): number {
  const { progress } = useScroll();
  return progress;
}

// ============================================
// INTERSECTION OBSERVER HOOK
// ============================================

export interface UseIntersectionReturn {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
  observe: (element: Element | null) => void;
  unobserve: (element: Element | null) => void;
}

export function useIntersection(
  options: IntersectionObserverInit = {}
): UseIntersectionReturn {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);

  const observe = useCallback((element: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (element) {
      elementRef.current = element;
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
  };
}

// ============================================
// GSAP HOOKS
// ============================================

let gsapModule: any = null;
let scrollTriggerModule: any = null;

async function loadGSAP() {
  if (!gsapModule) {
    gsapModule = await import('gsap');
  }
  if (!scrollTriggerModule) {
    scrollTriggerModule = await import('gsap/ScrollTrigger');
    if (gsapModule && scrollTriggerModule) {
      gsapModule.registerPlugin(scrollTriggerModule);
    }
  }
  return { gsap: gsapModule, ScrollTrigger: scrollTriggerModule };
}

export interface UseGSAPReturn {
  gsap: any;
  ScrollTrigger: any;
  createTimeline: (config?: any) => any;
  createAnimation: (config: any) => any;
  killAll: () => void;
  isLoaded: boolean;
}

export function useGSAP(): UseGSAPReturn {
  const [loaded, setLoaded] = useState(false);
  const timelinesRef = useRef<Map<string, any>>(new Map());
  const scrollTriggersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    loadGSAP().then(() => setLoaded(true));
  }, []);

  const createTimeline = useCallback((config?: any) => {
    if (!gsapModule) return null;
    const tl = gsapModule.timeline(config?.defaults);
    if (config?.id) {
      timelinesRef.current.set(config.id, tl);
    }
    return tl;
  }, []);

  const createAnimation = useCallback((config: any) => {
    if (!gsapModule) return null;
    return gsapModule.to(config);
  }, []);

  const killAll = useCallback(() => {
    if (gsapModule) {
      gsapModule.killTweensOf('*');
    }
    timelinesRef.current.forEach((tl) => tl.kill());
    timelinesRef.current.clear();
    scrollTriggersRef.current.forEach((st) => st.kill());
    scrollTriggersRef.current.clear();
  }, []);

  return {
    gsap: gsapModule,
    ScrollTrigger: scrollTriggerModule,
    createTimeline,
    createAnimation,
    killAll,
    isLoaded: loaded,
  };
}

export function useGSAPTimeline(config?: any) {
  const { createTimeline, isLoaded } = useGSAP();
  const timelineRef = useRef<any>(null);

  useEffect(() => {
    if (isLoaded) {
      timelineRef.current = createTimeline(config);
    }
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isLoaded, createTimeline, config]);

  return timelineRef.current;
}

export function useScrollTrigger(config: any) {
  const { ScrollTrigger, isLoaded } = useGSAP();
  const triggerRef = useRef<any>(null);

  useEffect(() => {
    if (!isLoaded || !ScrollTrigger) return;

    triggerRef.current = ScrollTrigger.create({
      trigger: config.trigger,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
      pin: config.pin,
      pinSpacing: config.pinSpacing,
      anticipatePin: config.anticipatePin,
      markers: config.markers,
      onEnter: () => {},
      onLeave: () => {},
      onEnterBack: () => {},
      onLeaveBack: () => {},
    });

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
        triggerRef.current = null;
      }
    };
  }, [isLoaded, ScrollTrigger, config]);

  return triggerRef.current;
}

// ============================================
// ANIMATION HOOKS
// ============================================

export function useAnimationFrame(callback: (time: number, delta: number) => void) {
  const requestRef = useRef<ReturnType<typeof requestAnimationFrame> | undefined>(undefined);
  const previousTimeRef = useRef(0);

  useEffect(() => {
    const animate = (time: number) => {
      const delta = time - previousTimeRef.current;
      previousTimeRef.current = time;
      callback(time, delta);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [callback]);
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// ============================================
// WINDOW SIZE HOOK
// ============================================

export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

// ============================================
// LOCAL STORAGE HOOK
// ============================================

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ============================================
// DEBOUNCED VALUE HOOK
// ============================================

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================
// PREVIOUS VALUE HOOK
// ============================================

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// ============================================
// MOUNT STATUS HOOK
// ============================================

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted;
}

// ============================================
// IDLE DETECTION HOOK
// ============================================

export function useIdle(timeout: number): boolean {
  const [idle, setIdle] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const reset = useCallback(() => {
    setIdle(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIdle(true), timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((event) => window.removeEventListener(event, reset));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reset]);

  return idle;
}

// ============================================
// COPY TO CLIPBOARD HOOK
// ============================================

export function useCopyToClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopied(false);
    }
  }, []);

  return [copied, copy];
}