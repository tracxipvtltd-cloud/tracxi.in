import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './Tracxi2.css';

export function Tracxi2() {
  return (
    <Section sectionId="tracxi-2" name="Tracxi 2.0" hasScene={false}>
      <SectionComposition
        background={
          <div className="t2-bg" aria-hidden="true">
            <div className="t2-grid" />
            <div className="t2-glow" />
          </div>
        }
        foreground={
          <div className="t2-shell">
            <div className="chapter-topline t2-topline">
              <span className="micro">05 — Local cargo</span>
              <span className="micro">Under development</span>
            </div>

            <div className="t2-grid-layout">
              <div className="t2-copy">
                <p className="p-kicker">Under Development</p>
                <h2 className="p-title">Tracxi <em>2.0</em></h2>
                <p className="p-lead">The next evolution of delivery.</p>
                <p className="p-body">
                  Local cargo booking and logistics, reimagined with a sharper product experience and a clearer path for movement.
                </p>
                <span className="p-status">Status: Under Development</span>
              </div>

              <div className="t2-visual" aria-hidden="true">
                <span className="t2-ghost">2.0</span>
                <div className="t2-map">
                  <span className="t2-ring t2-ring-a" />
                  <span className="t2-ring t2-ring-b" />
                  <span className="t2-ring t2-ring-c" />
                  <svg className="t2-route" viewBox="0 0 520 520" fill="none">
                    <path d="M86 330 C150 330, 160 220, 240 220 C330 220, 330 330, 430 300" stroke="rgba(200,176,94,0.22)" strokeWidth="1.5" />
                    <path d="M86 330 C150 330, 160 220, 240 220 C330 220, 330 330, 430 300" stroke="rgba(200,176,94,0.75)" strokeWidth="1.8" strokeDasharray="6 12" />
                    <circle cx="86" cy="330" r="5" fill="#101214" stroke="#c8b05e" strokeWidth="1.5" />
                    <circle cx="240" cy="220" r="4" fill="#c8b05e" />
                    <circle cx="430" cy="300" r="5" fill="#101214" stroke="#c8b05e" strokeWidth="1.5" />
                  </svg>
                  <span className="t2-node t2-node-a" />
                  <span className="t2-node t2-node-b" />
                  <span className="t2-node t2-node-c" />
                  <div className="t2-van">
                    <span className="t2-van-body" />
                    <span className="t2-van-cab" />
                    <span className="t2-van-window" />
                    <span className="t2-van-wheel t2-wheel-a" />
                    <span className="t2-van-wheel t2-wheel-b" />
                  </div>
                  <span className="t2-label t2-label-a micro">Local cargo</span>
                  <span className="t2-label t2-label-b micro">Route 02</span>
                  <span className="t2-label t2-label-c micro">In development</span>
                </div>
              </div>
            </div>

            <div className="t2-foot">
              <span className="micro">Booking</span>
              <span className="micro">Movement</span>
              <span className="micro">Infrastructure</span>
              <span className="micro t2-foot-right">Tracxi 2.0 / 2026</span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
