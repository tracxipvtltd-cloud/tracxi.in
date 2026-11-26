import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './WahMahiRing.css';

export function WahMahiRing() {
  return (
    <Section sectionId="wah-mahi-ring" name="Wah Mahi Ring" hasScene={false}>
      <SectionComposition
        background={
          <div className="wmr-bg" aria-hidden="true">
            <div className="wmr-glow" />
            <div className="wmr-cone" />
          </div>
        }
        foreground={
          <div className="wmr-shell">
            <div className="chapter-topline wmr-topline">
              <span className="micro">09 — Luxury</span>
              <span className="micro">Research &amp; development</span>
            </div>

            <div className="wmr-layout">
              <div className="wmr-copy">
                <p className="p-kicker">Research &amp; Development</p>
                <h2 className="p-title">Wah Mahi <em>Ring</em></h2>
                <p className="p-lead">An expression of elegance.</p>
                <p className="p-body">
                  A luxury product vision exploring refined design, material presence, and the quiet confidence of a premium wearable object.
                </p>
                <span className="p-status">Status: Research &amp; Development</span>
              </div>

              <div className="wmr-visual" aria-hidden="true">
                <span className="wmr-ghost">09</span>
                <div className="wmr-pedestal" />
                <div className="wmr-ring">
                  <span className="wmr-band" />
                  <span className="wmr-setting" />
                  <span className="wmr-gem" />
                  <span className="wmr-band-shine" />
                </div>
                <div className="wmr-reflection" />
                <span className="wmr-caption wmr-caption-a micro">Material study</span>
                <span className="wmr-caption wmr-caption-b micro">Silver / Champagne</span>
              </div>
            </div>

            <div className="wmr-foot">
              <span className="micro">Jewellery</span>
              <span className="micro">Precision</span>
              <span className="micro">Reflection</span>
              <span className="micro wmr-foot-right">R&amp;D / 09</span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
