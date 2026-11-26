/**
 * Closing Experience Section
 * Final cinematic closing
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { AdaptiveCanvas } from '../components/3d/Canvas';
import { logoConfig, companyStatement } from '../config/products';
import { cn } from '../utils';
import './Closing.css';

export function Closing() {
  return (
    <Section sectionId="closing-experience" name="Closing Experience" hasScene={false}>
      <SectionComposition
        background={
          <AdaptiveCanvas sceneId="closing-experience" className="closing-canvas">
            <div className="closing-scene-placeholder" aria-hidden="true">
              <div className="closing-core" />
            </div>
          </AdaptiveCanvas>
        }
        foreground={
          <div className="closing-content">
            <div className="closing-logo">
              <img
                src={logoConfig.url}
                alt={logoConfig.alt}
                width={logoConfig.width}
                height={logoConfig.height}
              />
            </div>

            <SectionHeader
              title="One Company. Multiple Products. One Vision."
              description="This is just the beginning. The Tracxi ecosystem continues to evolve."
              className="closing-header"
            />

            <div className="closing-statement">
              {companyStatement}
            </div>
          </div>
        }
      />
    </Section>
  );
}