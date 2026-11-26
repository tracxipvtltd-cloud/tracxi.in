/**
 * Tracxi Application Context
 * Global state management for the application
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { AppContextValue, DeviceCapabilities, SectionId } from '../types';
import { sectionOrder } from '../config/products';

// ============================================
// CONTEXT CREATION
// ============================================

const AppContext = createContext<AppContextValue | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

interface AppProviderProps {
  children: ReactNode;
  initialSection?: SectionId;
}

export function AppProvider({ children, initialSection = 'hero' }: AppProviderProps) {
  const [currentSection, setCurrentSectionState] = useState<SectionId>(initialSection);
  const [previousSection, setPreviousSection] = useState<SectionId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
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
  const [reducedMotion, setReducedMotion] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Update device capabilities
  const updateDeviceCapabilities = useCallback((capabilities: Partial<DeviceCapabilities>) => {
    setDeviceCapabilities((prev) => ({ ...prev, ...capabilities }));
  }, []);

  // Set current section with transition handling
  const setCurrentSection = useCallback((section: SectionId) => {
    if (section !== currentSection) {
      setPreviousSection(currentSection);
      setIsTransitioning(true);
      setCurrentSectionState(section);

      // Reset transitioning state after a delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }
  }, [currentSection]);

  // Set theme
  const setThemeMode = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // Apply to document
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Initialize theme
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    if (theme === 'system' && mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    }
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Navigation helpers
  const navigateToSection = useCallback((sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navigateToNextSection = useCallback(() => {
    const currentIndex = (sectionOrder as readonly string[]).indexOf(currentSection);
    const nextSection = (sectionOrder as readonly string[])[currentIndex + 1] as SectionId | undefined;
    if (nextSection !== undefined) {
      navigateToSection(nextSection);
    }
  }, [currentSection, navigateToSection]);

  const navigateToPreviousSection = useCallback(() => {
    const currentIndex = (sectionOrder as readonly string[]).indexOf(currentSection);
    const prevSection = (sectionOrder as readonly string[])[currentIndex - 1] as SectionId | undefined;
    if (prevSection !== undefined) {
      navigateToSection(prevSection);
    }
  }, [currentSection, navigateToSection]);

  const value = useMemo<AppContextValue>(() => ({
    currentSection,
    previousSection,
    isTransitioning,
    deviceCapabilities,
    reducedMotion,
    theme,
    setCurrentSection,
    setIsTransitioning,
    setTheme: setThemeMode,
    // Additional helpers
    navigateToSection,
    navigateToNextSection,
    navigateToPreviousSection,
    updateDeviceCapabilities,
  }), [
    currentSection,
    previousSection,
    isTransitioning,
    deviceCapabilities,
    reducedMotion,
    theme,
    setCurrentSection,
    setIsTransitioning,
    setThemeMode,
    navigateToSection,
    navigateToNextSection,
    navigateToPreviousSection,
    updateDeviceCapabilities,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ============================================
// HOOK FOR USING APP CONTEXT
// ============================================

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// ============================================
// SELECTOR HOOKS
// ============================================

export function useCurrentSection(): SectionId {
  const { currentSection } = useAppContext();
  return currentSection;
}

export function useIsTransitioning(): boolean {
  const { isTransitioning } = useAppContext();
  return isTransitioning;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const { deviceCapabilities } = useAppContext();
  return deviceCapabilities;
}

export function useReducedMotion(): boolean {
  const { reducedMotion } = useAppContext();
  return reducedMotion;
}

export function useTheme(): 'light' | 'dark' | 'system' {
  const { theme } = useAppContext();
  return theme;
}