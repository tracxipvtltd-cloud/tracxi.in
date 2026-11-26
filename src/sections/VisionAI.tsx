import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './VisionAI.css';

export function VisionAI() {
  return (
    <Section sectionId="vision-ai" name="Vision AI" hasScene={false}>
      <SectionComposition
        background={
          <div className="vai-bg" aria-hidden="true">
            <div className="vai-grid" />
            <div className="vai-glow" />
          </div>
        }
        foreground={
          <div className="vai-shell">
            <div className="chapter-topline vai-topline">
              <span className="micro">12 — Artificial intelligence</span>
              <span className="micro">LLM under training</span>
            </div>

            <div className="vai-layout">
              <div className="vai-copy">
                <p className="p-kicker">LLM Under Training</p>
                <h2 className="p-title">Vision <em>AI</em></h2>
                <p className="p-lead">Intelligence. Built closer.</p>
                <p className="p-body">
                  An internal AI research direction focused on locally running models and a more private, controlled approach to intelligence.
                </p>
                <span className="p-status">Status: LLM Under Training</span>
              </div>

              <div className="vai-visual" aria-hidden="true">
                <span className="vai-ghost">12</span>
                <div className="vai-core">
                  <span className="vai-ring vai-ring-a" />
                  <span className="vai-ring vai-ring-b" />
                  <span className="vai-ring vai-ring-c" />
                  <span className="vai-ring vai-ring-d" />
                  <span className="vai-nucleus" />
                  <span className="vai-node vai-node-a" />
                  <span className="vai-node vai-node-b" />
                  <span className="vai-node vai-node-c" />
                  <span className="vai-node vai-node-d" />
                  <span className="vai-scan" />
                </div>
                <span className="vai-annotation vai-annotation-a micro">Local processing</span>
                <span className="vai-annotation vai-annotation-b micro">Internal research</span>
                <span className="vai-annotation vai-annotation-c micro">Layered / 12</span>
              </div>
            </div>

            <div className="vai-foot">
              <span className="micro">Local</span>
              <span className="micro">Private</span>
              <span className="micro">Under training</span>
              <span className="micro vai-foot-right">Not a public product / 12</span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
