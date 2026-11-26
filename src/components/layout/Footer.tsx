/**
 * Tracxi Footer Component
 * A quiet closing band beneath the final chapter.
 */

import React from 'react';
import { logoConfig, companyStatement } from '../../config/products';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="tracxi-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-main">
          <a className="footer-brand" href="#hero" aria-label="Tracxi — back to top">
            <span className="footer-logo">
              <img
                src={logoConfig.url}
                alt={logoConfig.alt}
                width={56}
                height={56}
                loading="lazy"
              />
            </span>
            <span className="footer-brand-copy">
              <span className="footer-brand-line">Tracxi</span>
              <span className="footer-brand-note">{companyStatement}</span>
            </span>
          </a>

          <a className="footer-top" href="#hero">
            <span>Back to top</span>
            <span className="footer-top-mark" aria-hidden="true">↑</span>
          </a>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Tracxi. All rights reserved.
          </p>
          <p className="footer-note">Independent technology company</p>
        </div>
      </div>
    </footer>
  );
}
