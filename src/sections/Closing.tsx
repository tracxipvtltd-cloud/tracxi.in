/**
 * Closing — the final page of the Tracxi story.
 * A typographic resolution, not another product chapter.
 */
import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { logoConfig } from '../config/products';
import './Closing.css';

export function Closing() {
  return (
    <Section sectionId="closing-experience" name="Closing" hasScene={false}>
      <SectionComposition
        background={
          <div className="closing-bg" aria-hidden="true">
            <span className="closing-bg-num">13</span>
            <span className="closing-bg-arc" />
            <span className="closing-bg-glow" />
          </div>
        }
        foreground={
          <div className="closing-shell">
            <div className="closing-topline">
              <div className="closing-brand">
                <img
                  src={logoConfig.url}
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                />
                <span className="micro">Independent technology company</span>
              </div>
              <span className="micro closing-index">13 — Closing</span>
            </div>

            <div className="closing-main">
              <h2 className="closing-title">
                <span className="closing-title-sans">One company.</span>
                <span className="closing-title-serif">Multiple products.</span>
                <span className="closing-title-italic">One vision.</span>
              </h2>

              <div className="closing-aside">
                <p className="closing-body">
                  Building ideas across logistics, commerce, finance, learning and
                  technology — with intent, craft, and a long view.
                </p>
                <div className="closing-links">
                  <a href="#one-company-multiple-products" className="closing-link">
                    <span>Explore the ecosystem</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <a href="#hero" className="closing-link">
                    <span>Back to the beginning</span>
                    <ArrowUp size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="closing-bottom">
              <div className="closing-domains">
                <span className="micro">Logistics</span>
                <span className="micro">Commerce</span>
                <span className="micro">Finance</span>
                <span className="micro">Education</span>
                <span className="micro">Emerging technology</span>
              </div>
              <span className="micro closing-signoff">
                Independent technology company / 13
              </span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
