/**
 * Tracxi Performance Context
 * Performance monitoring and adaptive quality management
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';
import type { PerformanceContextValue, PerformanceConfig, QualityLevel, DeviceCapabilities } from '../types';

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  maxFPS: 60,
  targetFPS: 60,
  adaptiveQuality: true,
  qualityLevels: [
    { name: 'low', pixelRatio: 1, shadowMapSize: 512, enablePostProcessing: false, enableShadows: false, maxLights: 1, textureQuality: 0.5, geometryDetail: 0.5, particleCount: 100 },
    { name: 'medium', pixelRatio: 1.5, shadowMapSize: 1024, enablePostProcessing: false, enableShadows: true, maxLights: 3, textureQuality: 0.75, geometryDetail: 0.75, particleCount: 500 },
    { name: 'high', pixelRatio: 2, shadowMapSize: 2048, enablePostProcessing: true, enableShadows: true, maxLights: 5, textureQuality: 1, geometryDetail: 1, particleCount: 1000 },
    { name: 'ultra', pixelRatio: Math.min(window.devicePixelRatio || 1, 2), shadowMapSize: 4096, enablePostProcessing: true, enableShadows: true, maxLights: 8, textureQuality: 1, geometryDetail: 1, particleCount: 2000 },
  ],
  mobileQuality: { name: 'low', pixelRatio: 1, shadowMapSize: 512, enablePostProcessing: false, enableShadows: false, maxLights: 1, textureQuality: 0.5, geometryDetail: 0.5, particleCount: 50 },
  reduceMotion: false,
  suspendOffscreen: true,
  maxConcurrentScenes: 1,
  textureBudget: 100, // MB
  geometryBudget: 100000, // triangles
  enableStats: false,
};

const QUALITY_LEVEL_ORDER: QualityLevel['name'][] = ['low', 'medium', 'high', 'ultra'];

// ============================================
// CONTEXT CREATION
// ============================================

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

interface PerformanceProviderProps {
  children: ReactNode;
  config?: Partial<PerformanceConfig>;
  deviceCapabilities?: DeviceCapabilities;
}

export function PerformanceProvider({ children, config, deviceCapabilities }: PerformanceProviderProps) {
  const [performanceConfig, setPerformanceConfig] = useState<PerformanceConfig>({
    ...DEFAULT_PERFORMANCE_CONFIG,
    ...config,
  });
  const [currentQuality, setCurrentQuality] = useState<QualityLevel>(
    performanceConfig.qualityLevels.find((q) => q.name === 'high') || performanceConfig.qualityLevels[2]
  );
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.67);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const rafIdRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const metricsRef = useRef<Map<string, number>>(new Map());

  // Determine initial quality based on device
  useEffect(() => {
    if (deviceCapabilities) {
      const isMobile = deviceCapabilities.isMobile || deviceCapabilities.isTablet;
      const hasWebGL2 = deviceCapabilities.webgl2Support;
      const dpr = Math.min(deviceCapabilities.devicePixelRatio, 2);
      const memory = deviceCapabilities.memory || 4;

      let qualityName: QualityLevel['name'] = 'medium';

      if (isMobile) {
        qualityName = memory >= 4 ? 'medium' : 'low';
      } else if (hasWebGL2 && memory >= 8 && dpr >= 1.5) {
        qualityName = 'high';
      } else if (hasWebGL2 && memory >= 16 && dpr >= 2) {
        qualityName = 'ultra';
      }

      const quality = performanceConfig.qualityLevels.find((q) => q.name === qualityName);
      if (quality) setCurrentQuality(quality);
    }
  }, [deviceCapabilities, performanceConfig.qualityLevels]);

  // FPS Monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    setIsMonitoring(true);

    const measureFrame = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      frameTimesRef.current.push(delta);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      frameCountRef.current++;
      if (frameCountRef.current % 30 === 0) {
        const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const currentFps = 1000 / avgFrameTime;
        setFps(Math.round(currentFps));
        setFrameTime(avgFrameTime);

        // Adaptive quality
        if (performanceConfig.adaptiveQuality) {
          if (currentFps < 30 && currentQuality.name !== 'low') {
            const lowerIndex = QUALITY_LEVEL_ORDER.indexOf(currentQuality.name) - 1;
            if (lowerIndex >= 0) {
              const lowerQuality = performanceConfig.qualityLevels.find((q) => q.name === QUALITY_LEVEL_ORDER[lowerIndex]);
              if (lowerQuality) setCurrentQuality(lowerQuality);
            }
          } else if (currentFps > 55 && currentQuality.name !== 'ultra') {
            const higherIndex = QUALITY_LEVEL_ORDER.indexOf(currentQuality.name) + 1;
            if (higherIndex < QUALITY_LEVEL_ORDER.length) {
              const higherQuality = performanceConfig.qualityLevels.find((q) => q.name === QUALITY_LEVEL_ORDER[higherIndex]);
              if (higherQuality) setCurrentQuality(higherQuality);
            }
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(measureFrame);
    };

    rafIdRef.current = requestAnimationFrame(measureFrame);
  }, [isMonitoring, performanceConfig.adaptiveQuality, currentQuality.name]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  }, []);

  useEffect(() => {
    startMonitoring();
    return stopMonitoring;
  }, [startMonitoring, stopMonitoring]);

  // Memory monitoring (if available)
  useEffect(() => {
    if (!('memory' in performance)) return;

    const interval = setInterval(() => {
      const mem = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory;
      setMemoryUsage(Math.round(mem.usedJSHeapSize / 1024 / 1024)); // MB
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Set quality level
  const setQuality = useCallback((level: QualityLevel['name']) => {
    const quality = performanceConfig.qualityLevels.find((q) => q.name === level);
    if (quality) {
      setCurrentQuality(quality);
      // Dispatch event for other systems
      window.dispatchEvent(new CustomEvent('performance:quality-change', { detail: { level } }));
    }
  }, [performanceConfig.qualityLevels]);

  // Report custom metric
  const reportMetric = useCallback((name: string, value: number) => {
    metricsRef.current.set(name, value);
  }, []);

  // Get metric
  const getMetric = useCallback((name: string): number | undefined => {
    return metricsRef.current.get(name);
  }, []);

  // Update config
  const updateConfig = useCallback((newConfig: Partial<PerformanceConfig>) => {
    setPerformanceConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const value = useMemo<PerformanceContextValue>(() => ({
    config: performanceConfig,
    currentQuality,
    fps,
    frameTime,
    memoryUsage,
    setQuality,
    reportMetric,
    getMetric,
    updateConfig,
    startMonitoring,
    stopMonitoring,
  }), [
    performanceConfig,
    currentQuality,
    fps,
    frameTime,
    memoryUsage,
    setQuality,
    reportMetric,
    getMetric,
    updateConfig,
    startMonitoring,
    stopMonitoring,
  ]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

// ============================================
// HOOK FOR USING PERFORMANCE CONTEXT
// ============================================

export function usePerformanceContext(): PerformanceContextValue {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  return context;
}

// ============================================
// SELECTOR HOOKS
// ============================================

export function useCurrentQuality(): QualityLevel {
  const { currentQuality } = usePerformanceContext();
  return currentQuality;
}

export function useFPS(): number {
  const { fps } = usePerformanceContext();
  return fps;
}

export function useFrameTime(): number {
  const { frameTime } = usePerformanceContext();
  return frameTime;
}

export function useMemoryUsage(): number {
  const { memoryUsage } = usePerformanceContext();
  return memoryUsage;
}

export function usePerformanceConfig(): PerformanceConfig {
  const { config } = usePerformanceContext();
  return config;
}

export function useSetQuality(): (level: QualityLevel['name']) => void {
  const { setQuality } = usePerformanceContext();
  return setQuality;
}

export function useReportMetric(): (name: string, value: number) => void {
  const { reportMetric } = usePerformanceContext();
  return reportMetric;
}

// ============================================
// QUALITY HOOKS FOR COMPONENTS
// ============================================

export function useQualitySetting<T>(
  settings: Record<QualityLevel['name'], T>,
  fallback?: T
): T {
  const { currentQuality } = usePerformanceContext();
  return settings[currentQuality.name] ?? fallback ?? settings.medium;
}

export function usePixelRatio(): number {
  const { currentQuality } = usePerformanceContext();
  return currentQuality.pixelRatio;
}

export function useShadowConfig(): { enabled: boolean; mapSize: number } {
  const { currentQuality } = usePerformanceContext();
  return {
    enabled: currentQuality.enableShadows,
    mapSize: currentQuality.shadowMapSize,
  };
}

export function usePostProcessingConfig(): { enabled: boolean } {
  const { currentQuality } = usePerformanceContext();
  return { enabled: currentQuality.enablePostProcessing };
}

export function useMaxLights(): number {
  const { currentQuality } = usePerformanceContext();
  return currentQuality.maxLights;
}

export function useTextureQuality(): number {
  const { currentQuality } = usePerformanceContext();
  return currentQuality.textureQuality;
}

export function useGeometryDetail(): number {
  const { currentQuality } = usePerformanceContext();
  return currentQuality.geometryDetail;
}

export function useParticleCount(): number {
  const { currentQuality } = usePerformanceContext();
  return currentQuality.particleCount;
}