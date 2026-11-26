/**
 * Trackspense Section
 * Intelligent expense tracking
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './Trackspense.css';

export function Trackspense() {
  const product = getProductById('trackspense');

  return (
    <Section sectionId="trackspense" name="Trackspense" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="trackspense" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Under Testing"
              title={product?.name || 'Trackspense'}
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
                  <strong>Category:</strong> Finance & Expenses
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}