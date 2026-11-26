import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './VCXMart.css';

export function VCXMart() {
  return (
    <Section sectionId="vcx-mart" name="VCX Mart" hasScene={false}>
      <SectionComposition
        foreground={
          <div className="vcx-shell">
            <div className="chapter-topline vcx-topline">
              <span className="micro">06 — Commerce</span>
              <span className="micro">Under development</span>
            </div>

            <div className="vcx-layout">
              <div className="vcx-visual" aria-hidden="true">
                <span className="vcx-ghost">VCX</span>
                <div className="vcx-arch" />
                <div className="vcx-spot" />
                <div className="vcx-floor" />
                <div className="vcx-stack">
                  <span className="vcx-box vcx-box-a"><i /></span>
                  <span className="vcx-box vcx-box-b"><i /></span>
                  <span className="vcx-box vcx-box-c"><i /></span>
                </div>
                <div className="vcx-trolley">
                  <span className="vcx-shadow" />
                  <div className="vcx-basket">
                    <span className="vcx-item vcx-item-a"><i /></span>
                    <span className="vcx-item vcx-item-b"><i /></span>
                    <span className="vcx-item vcx-item-c"><i /></span>
                  </div>
                  <div className="vcx-frame vcx-frame-a" />
                  <div className="vcx-frame vcx-frame-b" />
                  <div className="vcx-handle" />
                  <span className="vcx-wheel vcx-wheel-a" />
                  <span className="vcx-wheel vcx-wheel-b" />
                </div>
                <span className="vcx-tag">Known as THE OG</span>
                <span className="vcx-caption micro">Multi-vendor / one place</span>
              </div>

              <div className="vcx-copy">
                <p className="p-kicker">Under Development</p>
                <h2 className="p-title">VCX <em>Mart</em></h2>
                <p className="p-lead">Commerce without boundaries.</p>
                <p className="p-body">
                  A multi-vendor marketplace built to bring products, sellers, and
                  customers into one considered commerce experience.
                </p>
                <span className="p-status">Status: Under Development</span>
              </div>
            </div>

            <div className="vcx-ticker">
              <span className="micro">Marketplace</span>
              <span className="micro">Multi-vendor</span>
              <span className="micro">Retail</span>
              <span className="micro">Product discovery</span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
