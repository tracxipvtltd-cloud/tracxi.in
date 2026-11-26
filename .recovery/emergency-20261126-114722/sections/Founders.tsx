/**
 * Founders Section
 * Meet Our Founders - Editorial layout with two founder profiles
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { ExternalLink, User } from 'lucide-react';
import { founders, getFoundersInOrder } from '../config/products';
import { cn } from '../utils';
import './Founders.css';

export function Founders() {
  const foundersList = getFoundersInOrder();

  return (
    <Section sectionId="meet-our-founders" name="Meet Our Founders" hasScene={false}>
      <SectionComposition
        foreground={
          <div className="founders-content">
            <SectionHeader
              label="Leadership"
              title="Meet Our Founders"
              description="Two founders. One shared vision. Building an ecosystem of products that redefine their categories."
              className="founders-header"
            />

            <div className="founders-grid">
              {foundersList.map((founder) => (
                <article key={founder.id} className="founder-card">
                  <div className="founder-portrait" aria-hidden="true">
                    <User size={48} />
                  </div>

                  <div className="founder-info">
                    <h2 className="founder-name">{founder.name}</h2>
                    <p className="founder-title">{founder.title}</p>
                    <p className="founder-bio">{founder.shortBio}</p>

                    {founder.portfolioUrl && (
                      <a
                        href={founder.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="founder-portfolio"
                        aria-label={`View ${founder.name}'s portfolio`}
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                        <span>View Portfolio</span>
                      </a>
                    )}
                  </div>

                  <div className="founder-products">
                    <h3 className="founder-products-label">Products</h3>
                    <ul className="founder-products-list">
                      {founder.associatedProducts.map((productId) => (
                        <li key={productId} className="founder-product-item">
                          {productId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </li>
                      ))}
                    </ul>
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