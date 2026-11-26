/**
 * Tracxi Learn Section
 * Education reimagined
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './TracxiLearn.css';

export function TracxiLearn() {
  const product = getProductById('tracxi-learn');

  return (
    <Section sectionId="tracxi-learn" name="Tracxi Learn" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="tracxi-learn" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Under Development"
              title={product?.name || 'Tracxi Learn'}
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
                  <strong>Category:</strong> Education & Learning
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}