import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './MagicMatrix.css';

const tiles = Array.from({ length: 25 }, (_, i) => i);
const lit = new Set([6, 7, 8, 11, 12, 13, 16, 17, 18]);

export function MagicMatrix() {
  return (
    <Section sectionId="magic-matrix" name="Magic Matrix" hasScene={false}>
      <SectionComposition
        background={
          <div className="mm-bg" aria-hidden="true">
            <div className="mm-grid" />
            <div className="mm-glow" />
          </div>
        }
        foreground={
          <div className="mm-shell">
            <div className="chapter-topline mm-topline">
              <span className="micro">08 — Digital experiences</span>
              <span className="micro">Closed testing</span>
            </div>

            <div className="mm-layout">
              <div className="mm-copy">
                <p className="p-kicker">Closed Testing</p>
                <h2 className="p-title">Magic <em>Matrix</em></h2>
                <p className="p-lead">Enter another dimension.</p>
                <p className="p-body">
                  A digital experiences space exploring interactive, immersive, and game-like environments with a distinct visual identity.
                </p>
                <span className="p-status">Status: Closed Testing</span>
              </div>

              <div className="mm-visual" aria-hidden="true">
                <span className="mm-ghost">M</span>
                <div className="mm-matrix">
                  {tiles.map((t) => (
                    <span key={t} className={`mm-tile${lit.has(t) ? ' is-lit' : ''}`} />
                  ))}
                </div>
                <span className="mm-scan" />
                <span className="mm-annotation mm-annotation-a micro">Structured</span>
                <span className="mm-annotation mm-annotation-b micro">Dimensional</span>
                <span className="mm-annotation mm-annotation-c micro">Closed / 08</span>
              </div>
            </div>

            <div className="mm-foot">
              <span className="micro">Systems</span>
              <span className="micro">Geometry</span>
              <span className="micro">Depth</span>
              <span className="micro mm-foot-right">Restrained green / 08</span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
