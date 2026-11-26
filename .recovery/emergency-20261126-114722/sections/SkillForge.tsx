/**
 * SkillForge Section
 * Where raw potential meets refined mastery
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { getProductById, skillforgeTransition } from '../config/products';
import { cn } from '../utils';
import './SkillForge.css';

export function SkillForge() {
  const product = getProductById('skillforge');

  return (
    <Section sectionId="skillforge" name="SkillForge" hasScene={true}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="skillforge" className="product-canvas">
            <div className="scene-placeholder" aria-hidden="true">
              <div className="scene-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="product-content">
            <SectionHeader
              label="Under Development"
              title={product?.name || 'SkillForge'}
              description={product?.description}
              className="product-header"
            />

            <div className="product-details">
              <p className="product-full-desc">
                {product?.description}
              </p>

              {/* Special transition text */}
              <div className="skillforge-transition" aria-hidden="true">
                <p>{skillforgeTransition.text}</p>
              </div>

              <div className="product-meta">
                <span className="meta-item">
                  <strong>Status:</strong> {product?.status}
                </span>
                <span className="meta-item">
                  <strong>Category:</strong> Skills & Mastery
                </span>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}