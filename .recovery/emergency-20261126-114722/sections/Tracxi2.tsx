/**
 * Tracxi 2.0 Section
 * The next evolution of the Tracxi platform
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './Tracxi2.css';

export function Tracxi2() {
  const product = getProductById('tracxi-2');

  return (
    <Section sectionId="tracxi-2" name="Tracxi 2.0" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="tracxi-2" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Under Development"
              title={product?.name || 'Tracxi 2.0'}
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
                  <strong>Category:</strong> Logistics Platform
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}