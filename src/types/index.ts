/**
 * Tracxi Type Definitions
 * Centralized type system for the entire application
 */

// ============================================
// BASE TYPES
// ============================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export type SectionId = string;

export interface SectionProps extends BaseComponentProps {
  sectionId: SectionId;
  isActive?: boolean;
  isVisible?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

// ============================================
// 3D / SCENE TYPES
// ============================================

export interface SceneConfig {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  preload?: boolean;
  lazyLoad?: boolean;
  fallback?: React.ReactNode;
}

export interface CanvasConfig {
  id: string;
  width?: number;
  height?: number;
  pixelRatio?: number;
  shadows?: boolean;
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  glAttributes?: {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
    powerPreference?: 'default' | 'high-performance' | 'low-power';
  };
}

export interface CameraConfig {
  fov?: number;
  near?: number;
  far?: number;
  position?: [number, number, number];
  target?: [number, number, number];
}

export interface LightingConfig {
  ambient?: {
    color: string;
    intensity: number;
  };
  directional?: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    target?: [number, number, number];
    castShadow?: boolean;
  }>;
  point?: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    distance?: number;
    decay?: number;
    castShadow?: boolean;
  }>;
  spot?: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    target: [number, number, number];
    angle?: number;
    penumbra?: number;
    decay?: number;
    castShadow?: boolean;
  }>;
}

export interface ModelConfig {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  animation?: {
    clipName?: string;
    loop?: boolean;
    speed?: number;
  };
}

export interface TextureConfig {
  path: string;
  wrapS?: number;
  wrapT?: number;
  minFilter?: number;
  magFilter?: number;
  format?: number;
  type?: number;
  generateMipmaps?: boolean;
  colorSpace?: string;
}

export interface PostProcessingConfig {
  enabled: boolean;
  effects: Array<{
    type: 'bloom' | 'ssao' | 'taa' | 'fxaa' | 'vignette' | 'color-correction' | 'depth-of-field';
    params: Record<string, unknown>;
    enabled: boolean;
  }>;
  renderPriority: number;
}

// ============================================
// ANIMATION TYPES
// ============================================

export interface AnimationConfig {
  id: string;
  trigger?: 'scroll' | 'mount' | 'hover' | 'click' | 'viewport';
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  repeat?: number;
  yoyo?: boolean;
  scrub?: number | boolean;
  start?: string;
  end?: string;
  markers?: boolean;
}

export interface ScrollAnimationConfig extends AnimationConfig {
  trigger: 'scroll';
  scrub: number | boolean;
  start: string;
  end: string;
  pin?: boolean;
  pinSpacing?: boolean;
  anticipatePin?: number;
}

export interface ViewportAnimationConfig extends AnimationConfig {
  trigger: 'viewport';
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
}

export interface GSAPTimelineConfig {
  id: string;
  defaults?: {
    duration?: number;
    ease?: string;
  };
  paused?: boolean;
  repeat?: number;
  yoyo?: boolean;
  onComplete?: () => void;
  onReverseComplete?: () => void;
}

export interface TransitionConfig {
  fromScene: string;
  toScene: string;
  type: 'camera' | 'scene' | 'environment' | 'material' | 'particle' | 'light' | 'composite';
  duration: number;
  ease: string;
  steps: TransitionStep[];
}

export interface TransitionStep {
  type: 'camera-move' | 'scene-swap' | 'env-change' | 'object-animate' | 'material-morph' | 'particle-dissolve' | 'light-shift';
  duration: number;
  delay?: number;
  ease?: string;
  params: Record<string, unknown>;
  onStart?: () => void;
  onComplete?: () => void;
}

// ============================================
// PERFORMANCE TYPES
// ============================================

export interface PerformanceConfig {
  maxFPS?: number;
  targetFPS?: number;
  adaptiveQuality?: boolean;
  qualityLevels?: QualityLevel[];
  mobileQuality?: QualityLevel;
  reduceMotion?: boolean;
  suspendOffscreen?: boolean;
  maxConcurrentScenes?: number;
  textureBudget?: number;
  geometryBudget?: number;
  enableStats?: boolean;
}

export interface QualityLevel {
  name: 'low' | 'medium' | 'high' | 'ultra';
  pixelRatio: number;
  shadowMapSize: number;
  enablePostProcessing: boolean;
  enableShadows: boolean;
  maxLights: number;
  textureQuality: number;
  geometryDetail: number;
  particleCount: number;
}

export interface AssetLoadingConfig {
  priority: 'critical' | 'high' | 'normal' | 'low' | 'background';
  preload: boolean;
  retryAttempts: number;
  timeout: number;
  fallback?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface LazyLoadConfig {
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// ============================================
// RESPONSIVE TYPES
// ============================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface BreakpointValues<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  '3xl'?: T;
  base: T;
}

export interface ResponsiveConfig {
  breakpoints: Record<Breakpoint, number>;
  containerWidths: Record<Breakpoint, string>;
  fontSizes: Record<Breakpoint, Record<string, string>>;
  spacing: Record<Breakpoint, Record<string, string>>;
}

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

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  sectionId?: string;
  external?: boolean;
  order: number;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

export interface NavigationConfig {
  logo: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  items: NavItem[];
  mobileMenuEnabled: boolean;
  sticky: boolean;
  transparent: boolean;
  hideOnScroll?: boolean;
  showOnScrollUp?: boolean;
}

// ============================================
// FOOTER TYPES
// ============================================

export interface FooterConfig {
  logo: {
    url: string;
    alt: string;
  };
  statement: string;
  copyright: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  social?: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
}

// ============================================
// ACCESSIBILITY TYPES
// ============================================

export interface AccessibilityConfig {
  enableSkipLinks: boolean;
  enableFocusTrapping: boolean;
  enableLiveRegions: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

export interface ARIAProps {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-disabled'?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-level'?: number;
  'aria-setsize'?: number;
  'aria-posinset'?: number;
}

// ============================================
// ERROR HANDLING TYPES
// ============================================

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface FallbackConfig {
  component: React.ComponentType<{ error: Error; reset: () => void }>;
  onReset?: () => void;
  onError?: (error: Error) => void;
}

export interface WebGLFallbackConfig {
  enabled: boolean;
  message: string;
  showImage?: string;
  onFallback?: () => void;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseScrollReturn {
  scrollY: number;
  scrollX: number;
  scrollDirection: 'up' | 'down' | 'left' | 'right' | 'none';
  progress: number;
  isScrolling: boolean;
  velocity: number;
}

export interface UseIntersectionReturn {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
  observe: (element: Element | null) => void;
  unobserve: (element: Element | null) => void;
}

export interface UseMediaQueryReturn {
  matches: boolean;
  mediaQuery: string;
}

export interface UseReducedMotionReturn {
  prefersReducedMotion: boolean;
  prefersReducedMotionQuery: MediaQueryList;
}

export interface UseDeviceCapabilitiesReturn {
  capabilities: DeviceCapabilities;
  updateCapabilities: () => void;
}

export interface UseGSAPReturn {
  gsap: any;
  ScrollTrigger: any;
  createTimeline: (config?: any) => any;
  createAnimation: (config: any) => any;
  killAll: () => void;
  isLoaded: boolean;
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface AppContextValue {
  currentSection: SectionId;
  previousSection: SectionId | null;
  isTransitioning: boolean;
  deviceCapabilities: DeviceCapabilities;
  reducedMotion: boolean;
  theme: 'light' | 'dark' | 'system';
  setCurrentSection: (section: SectionId) => void;
  setIsTransitioning: (transitioning: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  navigateToSection: (section: SectionId) => void;
  navigateToNextSection: () => void;
  navigateToPreviousSection: () => void;
  updateDeviceCapabilities: (caps: Partial<DeviceCapabilities>) => void;
}

export interface SceneContextValue {
  activeScene: string | null;
  scenes: Map<string, SceneConfig>;
  registerScene: (scene: SceneConfig) => void;
  unregisterScene: (id: string) => void;
  setActiveScene: (id: string) => void;
  getScene: (id: string) => SceneConfig | undefined;
  isSceneMounted: (id: string) => boolean;
  getAllScenes: () => SceneConfig[];
  getMountedScenes: () => SceneConfig[];
  preloadScene: (id: string) => Promise<void>;
}

export interface AnimationContextValue {
  globalTimeline: any;
  scrollTriggers: Map<string, any>;
  registerAnimation: (id: string, animation: any) => void;
  unregisterAnimation: (id: string) => void;
  killAllAnimations: () => void;
  pauseAllAnimations: () => void;
  resumeAllAnimations: () => void;
  createTimeline: (config?: any) => any;
  createAnimation: (config: any) => any;
  createScrollTrigger: (config: any) => any;
  getAnimation: (id: string) => any;
  getScrollTrigger: (id: string) => any;
  refreshScrollTriggers: () => void;
  isInitialized: boolean;
}

export interface PerformanceContextValue {
  config: PerformanceConfig;
  currentQuality: QualityLevel;
  fps: number;
  frameTime: number;
  memoryUsage: number;
  setQuality: (level: QualityLevel['name']) => void;
  reportMetric: (name: string, value: number) => void;
  getMetric: (name: string) => number | undefined;
  updateConfig: (config: Partial<PerformanceConfig>) => void;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullable<T> = T extends null | undefined ? never : T;

export type ValueOf<T> = T[keyof T];

export type Entries<T> = [keyof T, T[keyof T]][];

export type Constructor<T = unknown> = new (...args: unknown[]) => T;

// ============================================
// EVENT TYPES
// ============================================

export interface CustomEventMap {
  'section:enter': CustomEvent<{ sectionId: string }>;
  'section:leave': CustomEvent<{ sectionId: string }>;
  'section:transition:start': CustomEvent<{ from: string; to: string }>;
  'section:transition:end': CustomEvent<{ from: string; to: string }>;
  'scene:load': CustomEvent<{ sceneId: string }>;
  'scene:unload': CustomEvent<{ sceneId: string }>;
  'animation:start': CustomEvent<{ animationId: string }>;
  'animation:complete': CustomEvent<{ animationId: string }>;
  'performance:quality-change': CustomEvent<{ level: QualityLevel['name'] }>;
  'performance:low-fps': CustomEvent<{ fps: number }>;
  'webgl:context-lost': CustomEvent<{ canvas: HTMLCanvasElement }>;
  'webgl:context-restored': CustomEvent<{ canvas: HTMLCanvasElement }>;
  'resize': CustomEvent<{ width: number; height: number }>;
  'orientation-change': CustomEvent<{ orientation: 'portrait' | 'landscape' }>;
}