/**
 * Vision AI Section
 * Internal AI project - local computation & private intelligence
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById } from '../config/products';
import { cn } from '../utils';
import './VisionAI.css';

export function VisionAI() {
  const product = getProductById('vision-ai');

  return (
    <Section sectionId="vision-ai" name="Vision AI" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="vision-ai" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="LLM Under Training"
              title={product?.name || 'Vision AI'}
              description={product?.description}
              className="product-header"
            />

            <div className="product-details">
              <p className="product-full-desc">
                {product?.description}
              </p>

              <div className="product-notice">
                <p>
                  <strong>Note:</strong> Vision AI is an internal research project. It is not a public product
                  and should not be represented as a finished AI service.
                </p>
              </div>

              <div className="product-meta">
                <span className="meta-item">
                  <strong>Status:</strong> {product?.status}
                </span>
                <span className="meta-item">
                  <strong>Category:</strong> Local AI & Machine Intelligence
                </span>
                <span className="meta-item internal-badge">
                  Internal Project
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}