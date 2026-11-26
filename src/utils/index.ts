/**
 * Tracxi Utility Functions
 * Shared utilities for the entire application
 */

// ============================================
// CLASS NAME UTILITIES
// ============================================

export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .flatMap((cls) => {
      if (!cls) return [];
      if (typeof cls === 'string') return cls;
      return Object.entries(cls)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .join(' ');
}

// ============================================
// DEBOUNCE & THROTTLE
// ============================================

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let result: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: ThisParameterType<T> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, limit);
    }
  };
}

// ============================================
// ANIMATION UTILITIES
// ============================================

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clampResult = true
): number {
  const result = outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  return clampResult ? clamp(result, Math.min(outMin, outMax), Math.max(outMin, outMax)) : result;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInOutExpo(t: number): number {
  return t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

export function easeOutCirc(t: number): number {
  return Math.sqrt(1 - Math.pow(t - 1, 2));
}

// ============================================
// DOM UTILITIES
// ============================================

export function getScrollParent(element: Element | null): Element | null {
  if (!element) return null;
  const style = getComputedStyle(element);
  const overflow = style.overflow + style.overflowY + style.overflowX;
  if (/(auto|scroll|overlay)/.test(overflow)) return element;
  return getScrollParent(element.parentElement);
}

export function isElementInViewport(
  element: Element,
  threshold = 0
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const vertInView = rect.top <= windowHeight * (1 - threshold) && rect.bottom >= windowHeight * threshold;
  const horInView = rect.left <= windowWidth * (1 - threshold) && rect.right >= windowWidth * threshold;
  return vertInView && horInView;
}

export function getElementOffset(element: Element): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}

// ============================================
// MEDIA QUERY UTILITIES
// ============================================

export function createMediaQuery(breakpoint: number): MediaQueryList {
  return window.matchMedia(`(max-width: ${breakpoint}px)`);
}

export function matchesBreakpoint(breakpoint: number): boolean {
  return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// ============================================
// DEVICE DETECTION
// ============================================

export function detectDeviceCapabilities(): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  hasHover: boolean;
  webglSupport: boolean;
  webgl2Support: boolean;
  devicePixelRatio: number;
} {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);
  const isDesktop = !isMobile && !isTablet;

  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasHover = window.matchMedia('(hover: hover)').matches;

  let webglSupport = false;
  let webgl2Support = false;
  try {
    const canvas = document.createElement('canvas');
    webglSupport = !!canvas.getContext('webgl');
    webgl2Support = !!canvas.getContext('webgl2');
  } catch {
    // Ignore
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasTouch,
    hasHover,
    webglSupport,
    webgl2Support,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

// ============================================
// COLOR UTILITIES
// ============================================

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function lerpColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return color1;
  const r = Math.round(lerp(c1.r, c2.r, factor));
  const g = Math.round(lerp(c1.g, c2.g, factor));
  const b = Math.round(lerp(c1.b, c2.b, factor));
  return rgbToHex(r, g, b);
}

// ============================================
// ASSET LOADING
// ============================================

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(sources.map(preloadImage));
}

export function loadScript(src: string): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ============================================
// RANDOM UTILITIES
// ============================================

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================
// STRING UTILITIES
// ============================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function truncate(text: string, length: number, suffix = '…'): string {
  if (text.length <= length) return text;
  return text.slice(0, length - suffix.length) + suffix;
}

// ============================================
// PERFORMANCE UTILITIES
// ============================================

export function measurePerformance<T>(
  name: string,
  fn: () => T,
  onMeasure?: (duration: number) => void
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  if (onMeasure) onMeasure(duration);
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
  return result;
}

export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  onMeasure?: (duration: number) => void
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  if (onMeasure) onMeasure(duration);
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
  return result;
}

// ============================================
// ID GENERATION
// ============================================

let idCounter = 0;
export function generateId(prefix = 'id'): string {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ============================================
// OBJECT UTILITIES
// ============================================

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmpty(obj: unknown): boolean {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
}

// ============================================
// URL UTILITIES
// ============================================

export function isExternalUrl(url: string): boolean {
  return /^(https?:\/\/|\/\/)/.test(url);
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function addUrlParams(url: string, params: Record<string, string>): string {
  const urlObj = new URL(url, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  return urlObj.toString();
}

// ============================================
// STORAGE UTILITIES
// ============================================

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota exceeded or other errors
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// ============================================
// EVENT UTILITIES
// ============================================

export function createEventEmitter<T extends Record<string, unknown[]>>() {
  const listeners: { [K in keyof T]?: Array<(...args: T[K]) => void> } = {};

  const emitter = {
    on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): () => void {
      const list = (listeners[event] ??= []);
      list.push(listener);
      return () => emitter.off(event, listener);
    },
    off<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void {
      const list = listeners[event];
      if (!list) return;
      const index = list.indexOf(listener);
      if (index > -1) list.splice(index, 1);
    },
    emit<K extends keyof T>(event: K, ...args: T[K]): void {
      const list = listeners[event];
      if (!list) return;
      list.forEach((listener) => listener(...args));
    },
    once<K extends keyof T>(event: K, listener: (...args: T[K]) => void): () => void {
      const off = emitter.on(event, (...args) => {
        off();
        listener(...args);
      });
      return off;
    },
    clear(): void {
      (Object.keys(listeners) as Array<keyof T>).forEach((key) => {
        listeners[key] = [];
      });
    },
  };

  return emitter;
}

// ============================================
// LIFECYCLE UTILITIES
// ============================================

export function onMount(callback: () => void | (() => void)): () => void {
  let cleanup: (() => void) | undefined;
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        cleanup = callback() as () => void;
      });
    } else {
      cleanup = callback() as () => void;
    }
  }
  return () => {
    if (cleanup) cleanup();
  };
}

export function onUnmount(callback: () => void): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', callback, { once: true });
  }
}