/**
 * Wah Mahi Ring Section
 * Luxury ring with metallic reflections
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './WahMahiRing.css';

export function WahMahiRing() {
  const product = getProductById('wah-mahi-ring');

  return (
    <Section sectionId="wah-mahi-ring" name="Wah Mahi Ring" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="wah-mahi-ring" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Research & Development"
              title={product?.name || 'Wah Mahi Ring'}
              description={product?.description}
              className="product-header"
            />

            <div className="product-details">
              <p className="product-full-desc">
                {product?.description}
              </p>

              <div className="product-meta">
                <span className="meta-item">
                  <strong>Status:</strong> {product?.status}
                </span>
                <span className="meta-item">
                  <strong>Category:</strong> Luxury Jewelry
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}