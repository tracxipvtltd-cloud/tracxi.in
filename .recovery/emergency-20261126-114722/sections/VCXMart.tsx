/**
 * VCX Mart Section
 * Premium commerce marketplace
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './VCXMart.css';

export function VCXMart() {
  const product = getProductById('vcx-mart');

  return (
    <Section sectionId="vcx-mart" name="VCX Mart" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="vcx-mart" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Under Development"
              title={product?.name || 'VCX Mart'}
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
                  <strong>Category:</strong> Commerce Marketplace
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}