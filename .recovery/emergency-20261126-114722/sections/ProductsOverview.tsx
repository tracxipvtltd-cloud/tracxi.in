/**
 * Products Overview Section
 * One Company. Multiple Products. - Grid of all products with status
 */

import React from 'react';
import { Section, SectionComposition, SectionHeader } from '../components/sections/Section';
import { products, getProductsInOrder, statusConfig, logoConfig, companyStatement } from '../config/products';
import { CheckCircle, Clock, FlaskConical, Lock, Zap, Brain } from 'lucide-react';
import { cn } from '../utils';
import './ProductsOverview.css';

function getStatusIcon(status: string) {
  switch (status) {
    case 'Published': return CheckCircle;
    case 'Under Development': return Clock;
    case 'Under Testing': return FlaskConical;
    case 'Closed Testing': return Lock;
    case 'Research & Development': return Zap;
    case 'LLM Under Training': return Brain;
    default: return CheckCircle;
  }
}

export function ProductsOverview() {
  const productsList = getProductsInOrder().filter(p => !p.isInternal);

  return (
    <Section sectionId="one-company-multiple-products" name="One Company. Multiple Products." hasScene={false}>
      <SectionComposition
        foreground={
          <div className="products-content">
            <SectionHeader
              label="Ecosystem"
              title="One Company. Multiple Products."
              description="Each product solves a distinct problem. Together, they form a unified ecosystem spanning logistics, commerce, finance, learning, and technology."
              className="products-header"
            />

            <div className="products-grid">
              {productsList.map((product) => {
                const StatusIcon = getStatusIcon(product.status);
                return (
                  <article key={product.id} className={cn('product-card', `status-${product.status.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`)}>
                    <div className="product-icon" aria-hidden="true">
                      <StatusIcon size={28} />
                    </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-short-desc">{product.shortDescription}</p>
                  </div>

                  <div className="product-status">
                    <StatusBadge status={product.status} />
                  </div>

                  <div className="product-tags" aria-hidden="true">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="product-tag">{tag}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="products-footer">
              <p className="company-statement">{companyStatement}</p>
              <img
                src={logoConfig.url}
                alt={logoConfig.alt}
                width={logoConfig.width}
                height={logoConfig.height}
                className="footer-logo"
              />
            </div>
          </div>
        }
      />
    </Section>
  );
}

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = getStatusIcon(status);

  if (!config) return null;

  return (
    <span className={cn('status-badge', `status-${status.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`)}>
      <Icon size={12} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}