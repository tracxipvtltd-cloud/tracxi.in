/**
 * Tracxi Scene Context
 * Manages 3D scene registration, activation, and lifecycle
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, ReactNode } from 'react';
import type { SceneContextValue, SceneConfig } from '../types';

// ============================================
// CONTEXT CREATION
// ============================================

const SceneContext = createContext<SceneContextValue | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

interface SceneProviderProps {
  children: ReactNode;
  maxConcurrentScenes?: number;
}

export function SceneProvider({ children, maxConcurrentScenes = 1 }: SceneProviderProps) {
  const [activeScene, setActiveSceneState] = useState<string | null>(null);
  const scenesRef = useRef<Map<string, SceneConfig>>(new Map());
  const mountedScenesRef = useRef<Set<string>>(new Set());
  const sceneOrderRef = useRef<string[]>([]);

  // Register a scene
  const registerScene = useCallback((scene: SceneConfig) => {
    scenesRef.current.set(scene.id, scene);
    if (!sceneOrderRef.current.includes(scene.id)) {
      sceneOrderRef.current.push(scene.id);
    }
  }, []);

  // Unregister a scene
  const unregisterScene = useCallback((id: string) => {
    scenesRef.current.delete(id);
    sceneOrderRef.current = sceneOrderRef.current.filter((s) => s !== id);
    mountedScenesRef.current.delete(id);
  }, []);

  // Set active scene with concurrency control
  const setActiveScene = useCallback((id: string) => {
    const scene = scenesRef.current.get(id);
    if (!scene) {
      console.warn(`Scene "${id}" not registered`);
      return;
    }

    // If we're at max concurrent scenes, unmount the oldest
    if (mountedScenesRef.current.size >= maxConcurrentScenes && !mountedScenesRef.current.has(id)) {
      const oldest = sceneOrderRef.current.find((s) => mountedScenesRef.current.has(s));
      if (oldest) {
        mountedScenesRef.current.delete(oldest);
      }
    }

    mountedScenesRef.current.add(id);
    setActiveSceneState(id);
  }, [maxConcurrentScenes]);

  // Get scene by ID
  const getScene = useCallback((id: string): SceneConfig | undefined => {
    return scenesRef.current.get(id);
  }, []);

  // Check if scene is mounted
  const isSceneMounted = useCallback((id: string): boolean => {
    return mountedScenesRef.current.has(id);
  }, []);

  // Get all registered scenes
  const getAllScenes = useCallback((): SceneConfig[] => {
    return Array.from(scenesRef.current.values());
  }, []);

  // Get mounted scenes
  const getMountedScenes = useCallback((): SceneConfig[] => {
    return Array.from(mountedScenesRef.current)
      .map((id) => scenesRef.current.get(id))
      .filter((s): s is SceneConfig => s !== undefined);
  }, []);

  // Preload scene assets
  const preloadScene = useCallback(async (id: string): Promise<void> => {
    const scene = scenesRef.current.get(id);
    if (!scene || scene.preload === false) return;

    // Dispatch preload event
    window.dispatchEvent(new CustomEvent('scene:preload', { detail: { sceneId: id } }));

    // Wait for scene to signal ready
    await new Promise<void>((resolve) => {
      const handler = (event: CustomEvent) => {
        if (event.detail.sceneId === id) {
          window.removeEventListener('scene:ready', handler);
          resolve();
        }
      };
      window.addEventListener('scene:ready', handler);

      // Timeout after 10 seconds
      setTimeout(() => {
        window.removeEventListener('scene:ready', handler);
        resolve();
      }, 10000);
    });
  }, []);

  const value = useMemo<SceneContextValue>(() => ({
    activeScene,
    scenes: scenesRef.current,
    registerScene,
    unregisterScene,
    setActiveScene,
    getScene,
    isSceneMounted,
    getAllScenes,
    getMountedScenes,
    preloadScene,
  }), [
    activeScene,
    registerScene,
    unregisterScene,
    setActiveScene,
    getScene,
    isSceneMounted,
    getAllScenes,
    getMountedScenes,
    preloadScene,
  ]);

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

// ============================================
// HOOK FOR USING SCENE CONTEXT
// ============================================

export function useSceneContext(): SceneContextValue {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useSceneContext must be used within a SceneProvider');
  }
  return context;
}

// ============================================
// SELECTOR HOOKS
// ============================================

export function useActiveScene(): string | null {
  const { activeScene } = useSceneContext();
  return activeScene;
}

export function useScene(sceneId: string): SceneConfig | undefined {
  const { getScene } = useSceneContext();
  return getScene(sceneId);
}

export function useIsSceneActive(sceneId: string): boolean {
  const { activeScene } = useSceneContext();
  return activeScene === sceneId;
}

export function useIsSceneMounted(sceneId: string): boolean {
  const { isSceneMounted } = useSceneContext();
  return isSceneMounted(sceneId);
}

// ============================================
// SCENE REGISTRATION HOOK
// ============================================

export function useRegisterScene(sceneConfig: SceneConfig): void {
  const { registerScene, unregisterScene } = useSceneContext();

  // Register on mount, unregister on unmount
  React.useEffect(() => {
    registerScene(sceneConfig);
    return () => unregisterScene(sceneConfig.id);
  }, [registerScene, unregisterScene, sceneConfig.id]);

  // Update config if it changes
  React.useEffect(() => {
    registerScene(sceneConfig);
  }, [registerScene, sceneConfig]);
}

// ============================================
// SCENE ACTIVATION HOOK
// ============================================

interface UseSceneActivationOptions {
  sceneId: string;
  enabled?: boolean;
  priority?: number;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export function useSceneActivation({
  sceneId,
  enabled = true,
  priority = 0,
  onActivate,
  onDeactivate,
}: UseSceneActivationOptions): void {
  const { setActiveScene, activeScene, isSceneMounted } = useSceneContext();
  const wasActiveRef = useRef(false);

  React.useEffect(() => {
    if (!enabled) return;

    const isActive = activeScene === sceneId;
    const mounted = isSceneMounted(sceneId);

    if (isActive && !wasActiveRef.current) {
      wasActiveRef.current = true;
      onActivate?.();
    } else if (!isActive && wasActiveRef.current) {
      wasActiveRef.current = false;
      onDeactivate?.();
    }
  }, [activeScene, enabled, sceneId, isSceneMounted, onActivate, onDeactivate]);

  // Expose activation function
  const activate = React.useCallback(() => {
    if (enabled) {
      setActiveScene(sceneId);
    }
  }, [enabled, sceneId, setActiveScene]);

  return activate;
}