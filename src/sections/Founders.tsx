/**
 * Founders Section - editorial leadership chapter.
 * No cards, no invented biographies.
 */
import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import { ArrowUpRight } from 'lucide-react';
import './Founders.css';

const founders = [
  {
    id: 'suresh-bodepudi',
    index: '01',
    nameFirst: 'Suresh',
    nameLast: 'Bodepudi',
    role: 'Founder',
    association: 'Associated with Tracxi by Suresh B, the product that started the journey.',
    initials: 'SB',
    note: 'The product that began the journey',
    align: 'left',
    productHref: '#tracxi-by-suresh-b',
  },
  {
    id: 'varun-teja-bodepudi',
    index: '02',
    nameFirst: 'Varun Teja',
    nameLast: 'Bodepudi',
    role: 'Founder',
    association:
      'Technology vision and expanding Tracxi across logistics, commerce, financial technology, education and emerging technology.',
    initials: 'VB',
    note: 'The ecosystem, expanding',
    align: 'right',
    portfolioUrl: 'https://varuntejabodepudi.netlify.app',
  },
];

export function Founders() {
  return (
    <Section sectionId="meet-our-founders" name="Meet Our Founders" hasScene={false}>
      <SectionComposition
        foreground={
          <div className="fd-shell">
            <div className="fd-topline">
              <span className="micro">02 — Leadership</span>
              <span className="micro">Meet our founders</span>
            </div>

            <header className="fd-head">
              <h2 className="fd-title">
                Two founders.<br />
                <em>One long view.</em>
              </h2>
              <div className="fd-head-side">
                <p className="fd-intro">
                  A considered vision, shaped by two founders building across industries with long-term intent.
                </p>
                <span className="fd-count micro">02 / Founders</span>
              </div>
            </header>

            <div className="fd-profiles">
              {founders.map((f) => (
                <article
                  key={f.id}
                  className={`fd-profile fd-profile--${f.align}`}
                >
                  <div className="fd-portrait-wrap">
                    <span className="fd-portrait-index micro" aria-hidden="true">{f.index}</span>
                    <div
                      className="fd-portrait"
                      role="img"
                      aria-label={`Portrait placeholder for ${f.nameFirst} ${f.nameLast}`}
                    >
                      <span className="fd-portrait-grid" aria-hidden="true" />
                      <span className="fd-initials" aria-hidden="true">{f.initials}</span>
                      <span className="fd-portrait-caption">Portrait forthcoming</span>
                      <span className="fd-portrait-frame" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="fd-copy">
                    <p className="fd-role micro">{f.role}</p>
                    <h3 className="fd-name">
                      {f.nameFirst}<br />
                      <em>{f.nameLast}</em>
                    </h3>
                    <p className="fd-assoc">{f.association}</p>
                    <div className="fd-copy-foot">
                      <span className="fd-note micro">{f.note}</span>
                      {f.portfolioUrl && (
                        <a
                          href={f.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fd-link"
                        >
                          <span>View Portfolio</span>
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      )}
                      {f.productHref && (
                        <a href={f.productHref} className="fd-link">
                          <span>View the product</span>
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        }
      />
    </Section>
  );
}
