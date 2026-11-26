/**
 * Tracxi Scene Component
 * Base component for all 3D scenes with lifecycle management
 */

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { useSceneContext } from '../../context/SceneContext';
import { usePerformanceContext, usePixelRatio, useShadowConfig, useMaxLights, useTextureQuality, useGeometryDetail, useParticleCount } from '../../context/PerformanceContext';
import { useReducedMotion } from '../../hooks';
import { cn } from '../../utils';
import type { SceneConfig, ModelConfig, LightingConfig, CameraConfig } from '../../types';
import * as THREE from 'three';
import './Scene.css';

interface BaseSceneProps {
  /** Scene configuration */
  config: SceneConfig;
  /** Camera configuration */
  camera?: Partial<CameraConfig>;
  /** Lighting configuration */
  lighting?: LightingConfig;
  /** Models to load */
  models?: ModelConfig[];
  /** Custom scene setup function */
  onSetup?: (scene: THREE.Scene, three: ReturnType<typeof useThree>) => void;
  /** Custom animation loop */
  onAnimate?: (delta: number, three: ReturnType<typeof useThree>) => void;
  /** Cleanup function */
  onCleanup?: () => void;
  /** Children (additional scene content) */
  children?: React.ReactNode;
  /** ClassName for canvas container */
  className?: string;
}

/**
 * Base Scene Component
 * Handles scene lifecycle, performance adaptation, and cleanup
 */
export function BaseScene({
  config,
  camera = {},
  lighting = {},
  models = [],
  onSetup,
  onAnimate,
  onCleanup,
  children,
  className,
}: BaseSceneProps) {
  const { scene, camera: r3fCamera, gl, size, viewport } = useThree();
  const { currentQuality, reportMetric } = usePerformanceContext();
  const { isSceneMounted, setActiveScene } = useSceneContext();
  const prefersReducedMotion = useReducedMotion();
  const pixelRatio = usePixelRatio();
  const { enabled: shadowsEnabled, mapSize: shadowMapSize } = useShadowConfig();
  const maxLights = useMaxLights();
  const textureQuality = useTextureQuality();
  const geometryDetail = useGeometryDetail();
  const particleCount = useParticleCount();

  const mountedRef = useRef(false);
  const animationIdRef = useRef<number>();
  const cleanupFnsRef = useRef<(() => void)[]>([]);
  const lightsRef = useRef<THREE.Light[]>([]);
  const modelsRef = useRef<THREE.Group[]>([]);

  // Scene setup on mount
  useEffect(() => {
    mountedRef.current = true;

    // Configure renderer
    gl.setPixelRatio(Math.min(pixelRatio, window.devicePixelRatio));
    gl.shadowMap.enabled = shadowsEnabled;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    (gl as any).physicallyCorrectLights = true;

    // Configure camera
    if (camera.position) {
      r3fCamera.position.set(...camera.position);
    }
    if (camera.target) {
      r3fCamera.lookAt(...camera.target);
    }
    if (camera.fov && 'fov' in r3fCamera) {
      (r3fCamera as any).fov = camera.fov;
      r3fCamera.updateProjectionMatrix();
    }
    r3fCamera.near = camera.near ?? 0.1;
    r3fCamera.far = camera.far ?? 1000;
    r3fCamera.updateProjectionMatrix();

    // Setup lighting
    setupLighting(lighting, maxLights);

    // Custom setup
    onSetup?.(scene, { scene, camera: r3fCamera, gl, size, viewport });

    // Mark scene as ready
    window.dispatchEvent(new CustomEvent('scene:ready', { detail: { sceneId: config.id } }));

    return () => {
      mountedRef.current = false;
      // Run cleanup functions
      cleanupFnsRef.current.forEach((fn) => fn());
      cleanupFnsRef.current = [];
      // Custom cleanup
      onCleanup?.();
      // Dispose of lights
      lightsRef.current.forEach((light) => {
        if (light.shadow?.map) light.shadow.map.dispose();
        if (light.shadow?.camera) {
          light.shadow.camera.left = 0;
          light.shadow.camera.right = 0;
          light.shadow.camera.top = 0;
          light.shadow.camera.bottom = 0;
        }
      });
      lightsRef.current = [];
    };
  }, [config.id, gl, r3fCamera, scene, size, viewport, pixelRatio, shadowsEnabled, maxLights, camera, lighting, onSetup, onCleanup]);

  // Animation loop
  useFrame((state, delta) => {
    if (!mountedRef.current) return;
    if (prefersReducedMotion) return;

    // Custom animation
    onAnimate?.(delta, state);

    // Dispatch frame metric
    if (Math.random() < 0.01) { // Sample 1% of frames
      reportMetric(`scene:${config.id}:frameTime`, delta * 1000);
    }
  });

  // Handle scene activation
  useEffect(() => {
    const isActive = isSceneMounted(config.id);
    if (isActive) {
      setActiveScene(config.id);
    }
  }, [config.id, isSceneMounted, setActiveScene]);

  // Render nothing - this is a logic component
  // Actual 3D content should be composed as children
  return (
    <group className={cn('tracxi-scene', className)}>
      {/* Ambient Light */}
      {lighting.ambient && (
        <ambientLight
          key="ambient"
          color={lighting.ambient.color}
          intensity={lighting.ambient.intensity * currentQuality.pixelRatio}
        />
      )}

      {/* Directional Lights */}
      {lighting.directional?.map((light, index) => (
        index < maxLights && (
          <directionalLight
            key={`dir-${index}`}
            color={light.color}
            intensity={light.intensity * currentQuality.pixelRatio}
            position={light.position}
            target={light.target ? [0, 0, 0] : undefined}
            castShadow={light.castShadow && shadowsEnabled}
            shadow-mapSize={shadowMapSize}
            shadow-cameraNear={0.1}
            shadow-cameraFar={light.distance || 50}
            shadow-cameraLeft={-10}
            shadow-cameraRight={10}
            shadow-cameraTop={10}
            shadow-cameraBottom={-10}
            shadow-bias={-0.0001}
          />
        )
      ))}

      {/* Point Lights */}
      {lighting.point?.map((light, index) => (
        index < maxLights && (
          <pointLight
            key={`point-${index}`}
            color={light.color}
            intensity={light.intensity * currentQuality.pixelRatio}
            position={light.position}
            distance={light.distance || 50}
            decay={light.decay ?? 2}
            castShadow={light.castShadow && shadowsEnabled}
            shadow-mapSize={shadowMapSize}
          />
        )
      ))}

      {/* Spot Lights */}
      {lighting.spot?.map((light, index) => (
        index < maxLights && (
          <spotLight
            key={`spot-${index}`}
            color={light.color}
            intensity={light.intensity * currentQuality.pixelRatio}
            position={light.position}
            target={light.target}
            angle={light.angle ?? Math.PI / 6}
            penumbra={light.penumbra ?? 0.1}
            decay={light.decay ?? 2}
            distance={light.distance || 50}
            castShadow={light.castShadow && shadowsEnabled}
            shadow-mapSize={shadowMapSize}
          />
        )
      ))}

      {/* Models would be loaded here via useLoader or Suspense */}
      {children}
    </group>
  );
}

/**
 * Setup lighting based on config
 */
function setupLighting(lighting: LightingConfig, maxLights: number) {
  // Lights are handled declaratively in JSX above
  // This function is for any imperative setup needed
}

/**
 * Scene Wrapper with Suspense and Error Boundary
 */
interface SceneWrapperProps {
  config: SceneConfig;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
}

export function SceneWrapper({
  config,
  children,
  fallback,
  errorFallback,
  className,
}: SceneWrapperProps) {
  const { registerScene, unregisterScene } = useSceneContext();

  useEffect(() => {
    registerScene(config);
    return () => unregisterScene(config.id);
  }, [config, registerScene, unregisterScene]);

  return (
    <div className={cn('scene-wrapper', className)}>
      <React.Suspense fallback={fallback || <SceneLoading />}>
        <React.ErrorBoundary
          fallback={errorFallback || <SceneError />}
        >
          {children}
        </React.ErrorBoundary>
      </React.Suspense>
    </div>
  );
}

/**
 * Loading state for scene
 */
function SceneLoading() {
  return (
    <div className="scene-loading-overlay" aria-busy="true" aria-label="Loading 3D scene">
      <div className="scene-loading-content">
        <div className="loading-ring" aria-hidden="true">
          <div className="loading-ring-inner" />
        </div>
        <p>Initializing scene...</p>
      </div>
    </div>
  );
}

/**
 * Error state for scene
 */
function SceneError() {
  return (
    <div className="scene-error-overlay" role="alert">
      <div className="scene-error-content">
        <p>Unable to load 3D scene</p>
        <p className="error-hint">Your device may not support this experience</p>
      </div>
    </div>
  );
}

/**
 * Adaptive Scene - adjusts quality based on performance
 */
interface AdaptiveSceneProps extends Omit<BaseSceneProps, 'config'> {
  sceneId: string;
  sceneName: string;
}

export function AdaptiveScene({
  sceneId,
  sceneName,
  ...props
}: AdaptiveSceneProps) {
  const { currentQuality } = usePerformanceContext();

  const config = useMemo(() => ({
    id: sceneId,
    name: sceneName,
    enabled: true,
    priority: 1,
    preload: false,
    lazyLoad: true,
  }), [sceneId, sceneName]);

  // Adjust props based on quality
  const adaptedProps = useMemo(() => ({
    ...props,
    lighting: {
      ...props.lighting,
      directional: props.lighting?.directional?.slice(0, currentQuality.maxLights),
      point: props.lighting?.point?.slice(0, currentQuality.maxLights),
      spot: props.lighting?.spot?.slice(0, currentQuality.maxLights),
    },
  }), [props, currentQuality]);

  return <BaseScene config={config} {...adaptedProps} />;
}

/**
 * Scene Transition Component
 * Handles smooth transitions between scenes
 */
interface SceneTransitionProps {
  fromScene: string;
  toScene: string;
  progress: number; // 0-1
  type: 'camera' | 'scene' | 'environment' | 'material' | 'particle' | 'light' | 'composite';
  onComplete?: () => void;
  children: React.ReactNode;
}

export function SceneTransition({
  fromScene,
  toScene,
  progress,
  type,
  onComplete,
  children,
}: SceneTransitionProps) {
  const { scene, camera, gl } = useThree();
  const completedRef = useRef(false);

  useFrame(() => {
    if (progress >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    } else if (progress < 1) {
      completedRef.current = false;
    }
  });

  // This component would contain transition logic
  // For now, it just renders children
  return <>{children}</>;
}

/**
 * Scene Environment Component
 * Sets up scene environment (background, fog, etc.)
 */
interface SceneEnvironmentProps {
  background?: string | THREE.Texture | THREE.Color;
  fog?: {
    color: string | THREE.Color;
    near: number;
    far: number;
  } | false;
  toneMapping?: THREE.ToneMapping;
  exposure?: number;
}

export function SceneEnvironment({
  background = '#0a0a0a',
  fog = { color: '#0a0a0a', near: 10, far: 100 },
  toneMapping = THREE.ACESFilmicToneMapping,
  exposure = 1,
}: SceneEnvironmentProps) {
  const { scene, gl } = useThree();

  useEffect(() => {
    // Background
    if (typeof background === 'string') {
      scene.background = new THREE.Color(background);
    } else if (background instanceof THREE.Texture) {
      scene.background = background;
    } else if (background instanceof THREE.Color) {
      scene.background = background;
    } else {
      scene.background = null;
    }

    // Fog
    if (fog) {
      scene.fog = new THREE.Fog(
        typeof fog.color === 'string' ? new THREE.Color(fog.color) : fog.color,
        fog.near,
        fog.far
      );
    } else {
      scene.fog = null;
    }

    // Tone mapping
    gl.toneMapping = toneMapping;
    gl.toneMappingExposure = exposure;
  }, [background, fog, toneMapping, exposure, scene, gl]);

  return null;
}