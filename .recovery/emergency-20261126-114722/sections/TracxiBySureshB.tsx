/**
 * Tracxi by Suresh B Section
 * The product that started the journey
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './TracxiBySureshB.css';

export function TracxiBySureshB() {
  const product = getProductById('tracxi-by-suresh-b');

  return (
    <Section sectionId="tracxi-by-suresh-b" name="Tracxi by Suresh B" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="tracxi-by-suresh-b" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Published"
              title={product?.name || 'Tracxi by Suresh B'}
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
                  <strong>Category:</strong> Logistics & Supply Chain
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}