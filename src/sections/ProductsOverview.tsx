/**
 * Product Ecosystem - editorial exhibition index.
 * No card grid; a typographic catalogue with material accents.
 */
import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import { ArrowUpRight } from 'lucide-react';
import './ProductsOverview.css';

const products = [
  { id: 'tracxi-by-suresh-b', name: 'Tracxi by Suresh B', domain: 'Logistics', status: 'Published', note: 'Where the journey began', tone: 'linear-gradient(180deg, #d8c99f, #8a7a52)' },
  { id: 'tracxi-2', name: 'Tracxi 2.0', domain: 'Local Cargo', status: 'Under Development', note: 'Moving local cargo forward', tone: 'linear-gradient(180deg, #aeb7c0, #5c646e)' },
  { id: 'vcx-mart', name: 'VCX Mart', domain: 'Commerce', status: 'Under Development', note: 'Commerce without boundaries', tone: 'linear-gradient(180deg, #e6d6b0, #b39a5e)' },
  { id: 'trackspense', name: 'Trackspense', domain: 'Personal Finance', status: 'Under Testing', note: 'Know where it goes', tone: 'linear-gradient(180deg, #cfd5dc, #7a838d)' },
  { id: 'magic-matrix', name: 'Magic Matrix', domain: 'Digital Experiences', status: 'Closed Testing', note: 'Enter another dimension', tone: 'linear-gradient(180deg, #8fc7a1, #2f6b45)' },
  { id: 'wah-mahi-ring', name: 'Wah Mahi Ring', domain: 'Luxury', status: 'Research & Development', note: 'An expression of elegance', tone: 'linear-gradient(180deg, #e8d7a8, #a98d4d)' },
  { id: 'tracxi-learn', name: 'Tracxi Learn', domain: 'Education', status: 'Under Development', note: 'Knowledge opens worlds', tone: 'linear-gradient(180deg, #e9e0cf, #b9a98c)' },
  { id: 'skillforge', name: 'SkillForge', domain: 'Advanced Learning', status: 'Under Development', note: 'Built through mastery', tone: 'linear-gradient(180deg, #e0a268, #8a4f25)' },
  { id: 'vision-ai', name: 'Vision AI', domain: 'Artificial Intelligence', status: 'LLM Under Training', note: 'Intelligence. Built closer.', tone: 'linear-gradient(180deg, #d9cfae, #6f6852)' },
];

export function ProductsOverview() {
  return (
    <Section sectionId="one-company-multiple-products" name="One Company. Multiple Products." hasScene={false}>
      <SectionComposition
        foreground={
          <div className="eco-shell">
            <aside className="eco-aside">
              <div className="eco-aside-top">
                <span className="micro">03 — The ecosystem</span>
                <span className="micro eco-aside-mark">T / 09</span>
              </div>
              <h2 className="eco-title">
                One company.<br />
                <em>Nine worlds.</em>
              </h2>
              <p className="eco-intro">
                Nine products, nine directions — connected by one company building for the world ahead.
              </p>
              <div className="eco-count">
                <span className="eco-count-num">09</span>
                <span className="micro">Products<br />One vision</span>
              </div>
            </aside>

            <div className="eco-index" aria-label="Product index">
              {products.map((p, i) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="eco-row"
                  style={{ '--tone': p.tone } as React.CSSProperties}
                >
                  <span className="eco-row-num micro" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="eco-row-tone" aria-hidden="true" />
                  <div className="eco-row-main">
                    <h3 className="eco-row-name">{p.name}</h3>
                    <p className="eco-row-note">{p.note}</p>
                  </div>
                  <span className="eco-row-domain micro">{p.domain}</span>
                  <span className="eco-row-status micro">{p.status}</span>
                  <span className="eco-row-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
                </a>
              ))}
            </div>
          </div>
        }
      />
    </Section>
  );
}
