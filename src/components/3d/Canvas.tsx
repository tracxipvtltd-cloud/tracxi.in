/**
 * Tracxi Canvas Component
 * Optimized Three.js canvas wrapper with performance monitoring
 */

import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { usePerformanceContext } from '../../context/PerformanceContext';
import { cn } from '../../utils';
import './Canvas.css';

interface CanvasWrapperProps {
  /** Canvas configuration */
  config?: Record<string, any>;
  /** Camera configuration */
  camera?: Record<string, any>;
  /** Children (scene content) */
  children: React.ReactNode;
  /** Whether canvas is active/visible */
  isActive?: boolean;
  /** Fallback content when WebGL unavailable */
  fallback?: React.ReactNode;
  /** Loading content */
  loading?: React.ReactNode;
  /** Error content */
  error?: React.ReactNode;
  /** Callback on canvas ready */
  onReady?: (gl: any) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Custom className */
  className?: string;
  /** Style */
  style?: React.CSSProperties;
}

export function CanvasWrapper({
  config = {},
  camera = {},
  children,
  isActive = true,
  fallback,
  loading,
  error,
  onReady,
  onError,
  className,
  ...props
}: CanvasWrapperProps) {
  const { currentQuality } = usePerformanceContext();
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Check WebGL support
  const checkWebGLSupport = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return !!gl;
    } catch {
      return false;
    }
  }, []);

  const webglAvailable = checkWebGLSupport();

  // Handle WebGL context lost
  useEffect(() => {
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setHasError(true);
      onError?.(new Error('WebGL context lost'));
    };

    const handleContextRestored = () => {
      setHasError(false);
    };

    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, [onError]);

  // Show fallback if WebGL not available
  if (!webglAvailable) {
    return (
      <div
        ref={canvasRef}
        className={cn('tracxi-canvas-wrapper', 'webgl-unavailable', className)}
        {...props}
        role="img"
        aria-label="3D content not available - WebGL not supported"
      >
        {fallback || (
          <div className="canvas-fallback">
            <p>3D experience requires WebGL support</p>
            <p className="fallback-hint">Please use a modern browser with WebGL enabled</p>
          </div>
        )}
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div
        ref={canvasRef}
        className={cn('tracxi-canvas-wrapper', 'canvas-error', className)}
        {...props}
        role="alert"
        aria-live="polite"
      >
        {error || (
          <div className="canvas-error-content">
            <p>Unable to load 3D experience</p>
            <button onClick={() => { setHasError(false); window.location.reload(); }}>
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  // Merge configs
  const canvasConfig = useMemo(() => ({
    gl: {
      alpha: true,
      antialias: currentQuality.name !== 'low',
      depth: true,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: currentQuality.name === 'low' ? 'low-power' : 'high-performance',
      ...config.gl,
    },
    camera: {
      fov: 50,
      near: 0.1,
      far: 1000,
      position: [0, 0, 5],
      ...camera,
    } as any,
    shadows: true,
    ...config,
  }), [config, camera, currentQuality]);

  return (
    <div
      ref={canvasRef}
      className={cn('tracxi-canvas-wrapper', {
        'is-active': isActive,
        'is-ready': isReady,
      }, className)}
      {...props}
    >
      {!isActive && loading ? (
        <div className="canvas-loading" aria-hidden="true">
          {loading}
        </div>
      ) : null}

      <R3FCanvas
        {...canvasConfig}
        onCreated={({ gl }) => {
          setIsReady(true);
          onReady?.(gl);
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {children}
      </R3FCanvas>
    </div>
  );
}

/**
 * Adaptive Canvas - automatically adjusts quality based on performance
 */
interface AdaptiveCanvasProps extends Omit<CanvasWrapperProps, 'config'> {
  /** Scene ID for performance tracking */
  sceneId: string;
}

export function AdaptiveCanvas({ sceneId, children, ...props }: AdaptiveCanvasProps) {
  const { currentQuality, reportMetric } = usePerformanceContext();

  const config = useMemo(() => ({
    gl: {
      alpha: true,
      antialias: currentQuality.name !== 'low',
      depth: true,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: currentQuality.name === 'low' ? 'low-power' : 'high-performance',
    },
    camera: {
      fov: 50,
      near: 0.1,
      far: 1000,
    },
    shadows: true,
  }), [currentQuality]);

  // Report scene metrics
  useEffect(() => {
    const QUALITY_LEVEL_ORDER = ['low', 'medium', 'high', 'ultra'] as const;
    reportMetric(`scene:${sceneId}:quality`, QUALITY_LEVEL_ORDER.indexOf(currentQuality.name));
    return () => {
      reportMetric(`scene:${sceneId}:unmount`, Date.now());
    };
  }, [sceneId, currentQuality.name, reportMetric]);

  return <CanvasWrapper config={config} {...props}>{children}</CanvasWrapper>;
}

/**
 * Canvas Performance Monitor Component
 * Renders FPS and performance stats in development
 */
export function CanvasPerformanceMonitor() {
  const { fps, frameTime, memoryUsage, currentQuality } = usePerformanceContext();
  const [showStats, setShowStats] = useState(false);

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className={cn('canvas-perf-monitor', { open: showStats })}>
      <button
        className="perf-toggle"
        onClick={() => setShowStats(!showStats)}
        aria-label={showStats ? 'Hide performance stats' : 'Show performance stats'}
      >
        {showStats ? '×' : '📊'}
      </button>

      {showStats && (
        <div className="perf-stats">
          <div className="perf-stat">
            <span className="perf-label">FPS</span>
            <span className={cn('perf-value', { low: fps < 30, good: fps >= 55 })}>{Math.round(fps)}</span>
          </div>
          <div className="perf-stat">
            <span className="perf-label">Frame</span>
            <span className="perf-value">{frameTime.toFixed(1)}ms</span>
          </div>
          <div className="perf-stat">
            <span className="perf-label">Memory</span>
            <span className="perf-value">{memoryUsage}MB</span>
          </div>
          <div className="perf-stat">
            <span className="perf-label">Quality</span>
            <span className="perf-value">{currentQuality.name}</span>
          </div>
          <div className="perf-stat">
            <span className="perf-label">DPR</span>
            <span className="perf-value">{currentQuality.pixelRatio}x</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Scene Suspense Wrapper
 * Handles loading states for lazy-loaded scenes
 */
interface SceneSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  sceneId: string;
}

export function SceneSuspense({ children, fallback, sceneId }: SceneSuspenseProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scene will dispatch 'scene:ready' when loaded
    const handleReady = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.sceneId === sceneId) {
        setIsLoaded(true);
      }
    };

    window.addEventListener('scene:ready', handleReady as EventListener);
    return () => window.removeEventListener('scene:ready', handleReady as EventListener);
  }, [sceneId]);

  if (!isLoaded) {
    return (
      <div className="scene-suspense-fallback" aria-busy="true" aria-label="Loading 3D scene">
        {fallback || (
          <div className="scene-loading">
            <div className="loading-spinner" aria-hidden="true" />
            <p>Loading {sceneId}...</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}