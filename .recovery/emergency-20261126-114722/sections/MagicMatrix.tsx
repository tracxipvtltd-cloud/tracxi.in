/**
 * Magic Matrix Section
 * Dimensional digital matrix
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './MagicMatrix.css';

export function MagicMatrix() {
  const product = getProductById('magic-matrix');

  return (
    <Section sectionId="magic-matrix" name="Magic Matrix" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="magic-matrix" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Closed Testing"
              title={product?.name || 'Magic Matrix'}
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
                  <strong>Category:</strong> Digital Systems
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}