/**
 * Tracxi Navigation Component
 * Clean, readable 2D navigation. No theme toggle for 2D review phase.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAppContext, useCurrentSection } from '../../context/AppContext';
import { sectionOrder, logoConfig } from '../../config/products';
import { cn } from '../../utils';
import './Navigation.css';

const navigationItems = [
  { id: 'founders', label: 'Founders', sectionId: 'meet-our-founders' },
  { id: 'products', label: 'Products', sectionId: 'one-company-multiple-products' },
] as const;

const sectionLabels: Record<string, string> = {
  'tracxi-by-suresh-b': 'Tracxi by Suresh B',
  'tracxi-2': 'Tracxi 2.0',
  'vcx-mart': 'VCX Mart',
  'trackspense': 'Trackspense',
  'magic-matrix': 'Magic Matrix',
  'wah-mahi-ring': 'Wah Mahi Ring',
  'tracxi-learn': 'Tracxi Learn',
  'skillforge': 'SkillForge',
  'vision-ai': 'Vision AI',
};

export function Navigation() {
  const { navigateToSection } = useAppContext();
  const currentSection = useCurrentSection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [currentSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (sectionId: string) => {
    navigateToSection(sectionId);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const productSections = sectionOrder.slice(3, -1);

  return (
    <nav
      ref={navRef}
      className={cn('tracxi-navigation', {
        'is-scrolled': isScrolled,
        'mobile-open': isMobileMenuOpen,
      })}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-container">
        <button className="nav-logo" onClick={() => handleNavClick('hero')} aria-label="Tracxi - Back to top">
          <img src={logoConfig.url} alt={logoConfig.alt} width={60} height={60} loading="eager" decoding="async" />
        </button>

        <div className="nav-desktop">
          <div className="nav-items">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={cn('nav-item', { active: currentSection === item.sectionId })}
                onClick={() => handleNavClick(item.sectionId)}
                aria-current={currentSection === item.sectionId ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}

            <div
              className="nav-dropdown-container"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={cn('nav-item nav-dropdown-trigger', { active: activeDropdown === 'products' })}
                onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
                aria-expanded={activeDropdown === 'products'}
                aria-haspopup="true"
              >
                All Products
                <ChevronDown className={cn('nav-dropdown-icon', { open: activeDropdown === 'products' })} size={16} aria-hidden="true" />
              </button>
              {activeDropdown === 'products' && (
                <div className="nav-dropdown" role="menu">
                  {productSections.map((sectionId) => (
                    <button
                      key={sectionId}
                      className={cn('nav-dropdown-item', { active: currentSection === sectionId })}
                      onClick={() => handleNavClick(sectionId)}
                      role="menuitem"
                    >
                      {sectionLabels[sectionId] || sectionId}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="nav-mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="nav-mobile-content">
            <div className="nav-mobile-items">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  className={cn('nav-mobile-item', { active: currentSection === item.sectionId })}
                  onClick={() => handleNavClick(item.sectionId)}
                >
                  {item.label}
                </button>
              ))}
              <div className="nav-mobile-dropdown">
                <button
                  className={cn('nav-mobile-item nav-mobile-dropdown-trigger', { active: activeDropdown === 'products' })}
                  onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
                  aria-expanded={activeDropdown === 'products'}
                >
                  All Products
                  <ChevronDown className={cn('nav-dropdown-icon', { open: activeDropdown === 'products' })} size={16} aria-hidden="true" />
                </button>
                {activeDropdown === 'products' && (
                  <div className="nav-mobile-dropdown-content" role="menu">
                    {productSections.map((sectionId) => (
                      <button
                        key={sectionId}
                        className={cn('nav-mobile-dropdown-item', { active: currentSection === sectionId })}
                        onClick={() => handleNavClick(sectionId)}
                        role="menuitem"
                      >
                        {sectionLabels[sectionId] || sectionId}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="nav-mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
      )}
    </nav>
  );
}