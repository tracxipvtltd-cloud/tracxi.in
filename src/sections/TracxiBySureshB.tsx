import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import { ArrowUpRight } from 'lucide-react';
import './TracxiBySureshB.css';

function Van({ className = '' }: { className?: string }) {
  return (
    <div className={`tb-van ${className}`} aria-hidden="true">
      <span className="tb-van-shadow" />
      <span className="tb-van-box" />
      <span className="tb-van-cab" />
      <span className="tb-van-window" />
      <span className="tb-van-line" />
      <span className="tb-wheel tb-wheel-a" />
      <span className="tb-wheel tb-wheel-b" />
    </div>
  );
}

export function TracxiBySureshB() {
  return (
    <Section sectionId="tracxi-by-suresh-b" name="Tracxi by Suresh B" hasScene={false}>
      <SectionComposition
        background={
          <div className="tb-scene" aria-hidden="true">
            <div className="tb-sky" />
            <div className="tb-sun" />
            <div className="tb-horizon" />
            <div className="tb-road">
              <span className="tb-road-line" />
              <span className="tb-road-edge tb-road-edge-a" />
              <span className="tb-road-edge tb-road-edge-b" />
            </div>
            <div className="tb-distance" />
            <Van className="tb-van-1" />
            <Van className="tb-van-2" />
            <div className="tb-route" aria-hidden="true">
              <svg viewBox="0 0 520 260" fill="none">
                <path
                  d="M18 214 C 110 214, 120 92, 236 92 S 372 158, 492 58"
                  stroke="rgba(138, 122, 82, 0.62)"
                  strokeWidth="1.6"
                  strokeDasharray="4 9"
                />
                <circle cx="18" cy="214" r="4" fill="#8a7a52" />
                <circle cx="236" cy="92" r="3" fill="rgba(23, 21, 15, 0.45)" />
                <circle cx="492" cy="58" r="4" fill="#8a7a52" />
                <text className="tb-route-text" x="18" y="238">ORIGIN</text>
                <text className="tb-route-text tb-route-text--accent" x="492" y="40" textAnchor="end">DESTINATION</text>
              </svg>
            </div>
            <div className="tb-grain" />
            <div className="tb-scrim" />
          </div>
        }
        foreground={
          <div className="tb-shell">
            <div className="chapter-topline tb-topline">
              <span className="micro">04 — Logistics</span>
              <span className="micro">Published / Live</span>
            </div>

            <div className="tb-copy">
              <p className="p-kicker">Published</p>
              <h2 className="p-title">
                Tracxi by<br />
                <em>Suresh B</em>
              </h2>
              <p className="p-lead">Where the journey began.</p>
              <p className="p-body">
                The original Tracxi application — built around connecting cargo
                movement and transportation.
              </p>
              <div className="tb-actions">
                <span className="p-status">Status: Published</span>
                <a href="#one-company-multiple-products" className="tb-link">
                  <span>Explore the ecosystem</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        }
      />
    </Section>
  );
}
