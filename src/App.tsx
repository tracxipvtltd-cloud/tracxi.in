/**
 * Tracxi Main Application Component
 * Root component with all providers and layout
 */

import React, { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { SceneProvider } from './context/SceneContext';
import { AnimationProvider } from './context/AnimationContext';
import { PerformanceProvider } from './context/PerformanceContext';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { Section, SectionComposition } from './components/sections/Section';
import { logoConfig, sectionOrder, companyStatement } from './config/products';
import { useAppContext } from './context/AppContext';
import { useDeviceCapabilities } from './hooks';
import './styles/index.css';
import './App.css';

// Lazy load section components for code splitting
const HeroSection = lazy(() => import('./sections/Hero').then(m => ({ default: m.Hero })));
const FoundersSection = lazy(() => import('./sections/Founders').then(m => ({ default: m.Founders })));
const ProductsOverviewSection = lazy(() => import('./sections/ProductsOverview').then(m => ({ default: m.ProductsOverview })));
const TracxiBySureshBSection = lazy(() => import('./sections/TracxiBySureshB').then(m => ({ default: m.TracxiBySureshB })));
const Tracxi2Section = lazy(() => import('./sections/Tracxi2').then(m => ({ default: m.Tracxi2 })));
const VCXMartSection = lazy(() => import('./sections/VCXMart').then(m => ({ default: m.VCXMart })));
const TrackspenseSection = lazy(() => import('./sections/Trackspense').then(m => ({ default: m.Trackspense })));
const MagicMatrixSection = lazy(() => import('./sections/MagicMatrix').then(m => ({ default: m.MagicMatrix })));
const WahMahiRingSection = lazy(() => import('./sections/WahMahiRing').then(m => ({ default: m.WahMahiRing })));
const TracxiLearnSection = lazy(() => import('./sections/TracxiLearn').then(m => ({ default: m.TracxiLearn })));
const SkillForgeSection = lazy(() => import('./sections/SkillForge').then(m => ({ default: m.SkillForge })));
const VisionAISection = lazy(() => import('./sections/VisionAI').then(m => ({ default: m.VisionAI })));
const ClosingSection = lazy(() => import('./sections/Closing').then(m => ({ default: m.Closing })));

// Section component map
const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  'meet-our-founders': FoundersSection,
  'one-company-multiple-products': ProductsOverviewSection,
  'tracxi-by-suresh-b': TracxiBySureshBSection,
  'tracxi-2': Tracxi2Section,
  'vcx-mart': VCXMartSection,
  'trackspense': TrackspenseSection,
  'magic-matrix': MagicMatrixSection,
  'wah-mahi-ring': WahMahiRingSection,
  'tracxi-learn': TracxiLearnSection,
  'skillforge': SkillForgeSection,
  'vision-ai': VisionAISection,
  'closing-experience': ClosingSection,
};



// Section metadata
const sectionMeta: Record<string, { name: string; hasScene: boolean }> = {
  hero: { name: 'Hero', hasScene: false },
  'meet-our-founders': { name: 'Meet Our Founders', hasScene: false },
  'one-company-multiple-products': { name: 'One Company. Multiple Products.', hasScene: false },
  'tracxi-by-suresh-b': { name: 'Tracxi by Suresh B', hasScene: false },
  'tracxi-2': { name: 'Tracxi 2.0', hasScene: false },
  'vcx-mart': { name: 'VCX Mart', hasScene: false },
  'trackspense': { name: 'Trackspense', hasScene: false },
  'magic-matrix': { name: 'Magic Matrix', hasScene: false },
  'wah-mahi-ring': { name: 'Wah Mahi Ring', hasScene: false },
  'tracxi-learn': { name: 'Tracxi Learn', hasScene: false },
  'skillforge': { name: 'SkillForge', hasScene: false },
  'vision-ai': { name: 'Vision AI', hasScene: false },
  'closing-experience': { name: 'Closing Experience', hasScene: false },
};

function SectionLoader({ sectionId }: { sectionId: string }) {
  const Component = sectionComponents[sectionId];
  const meta = sectionMeta[sectionId];

  if (!Component) {
    return (
      <Section sectionId={sectionId} name={meta?.name || sectionId} hasScene={meta?.hasScene}>
        <SectionComposition foreground={
          <div className="section-placeholder">
            <p>Section "{sectionId}" not yet implemented</p>
          </div>
        } />
      </Section>
    );
  }

  return (
    <Suspense fallback={<SectionSkeleton sectionId={sectionId} />}>
      <Component />
    </Suspense>
  );
}

function SectionSkeleton({ sectionId }: { sectionId: string }) {
  const meta = sectionMeta[sectionId];
  return (
    <Section sectionId={sectionId} name={meta?.name || sectionId} hasScene={meta?.hasScene}>
      <SectionComposition foreground={
        <div className="section-skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>
      } />
    </Section>
  );
}

function AppContent() {
  const { currentSection } = useAppContext();
  const { capabilities } = useDeviceCapabilities();

  // Add device classes to body
  React.useEffect(() => {
    const body = document.body;
    if (capabilities.isMobile) body.classList.add('device-mobile');
    if (capabilities.isTablet) body.classList.add('device-tablet');
    if (capabilities.isDesktop) body.classList.add('device-desktop');
    if (capabilities.hasTouch) body.classList.add('has-touch');
    if (!capabilities.hasHover) body.classList.add('no-hover');
    if (capabilities.prefersReducedMotion) body.classList.add('reduce-motion');
    if (!capabilities.webglSupport) body.classList.add('no-webgl');

    return () => {
      body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'has-touch', 'no-hover', 'reduce-motion', 'no-webgl');
    };
  }, [capabilities]);

  return (
    <div className="tracxi-app">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content" className="tracxi-main" role="main">
        {sectionOrder.map((sectionId) => (
          <SectionLoader key={sectionId} sectionId={sectionId} />
        ))}
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll Progress Bar */}
      <div className="scroll-progress" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100} aria-label="Page scroll progress">
        <div className="scroll-progress-bar" />
      </div>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <SceneProvider maxConcurrentScenes={1}>
        <AnimationProvider>
          <PerformanceProvider>
            <AppContent />
          </PerformanceProvider>
        </AnimationProvider>
      </SceneProvider>
    </AppProvider>
  );
}

export default App;