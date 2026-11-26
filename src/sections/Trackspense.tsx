import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './Trackspense.css';

export function Trackspense() {
  return (
    <Section sectionId="trackspense" name="Trackspense" hasScene={false}>
      <SectionComposition
        foreground={
          <div className="trk-shell">
            <div className="chapter-topline trk-topline">
              <span className="micro">07 — Personal finance</span>
              <span className="micro">Under testing</span>
            </div>

            <div className="trk-layout">
              <div className="trk-copy">
                <p className="p-kicker">Under Testing</p>
                <h2 className="p-title">Track<em>spense</em></h2>
                <p className="p-lead">Know where it goes.</p>
                <p className="p-body">
                  Expense management and personal finance, designed to make everyday money decisions feel clearer and more intentional.
                </p>
                <span className="p-status">Status: Under Testing</span>
              </div>

              <div className="trk-visual" aria-hidden="true">
                <div className="trk-circle" />
                <div className="trk-ring" />
                <div className="trk-wallet">
                  <span className="trk-wallet-back" />
                  <span className="trk-wallet-flap" />
                  <span className="trk-wallet-body" />
                  <span className="trk-card trk-card-a" />
                  <span className="trk-card trk-card-b" />
                  <span className="trk-wallet-mark">T</span>
                </div>
                <div className="trk-coin trk-coin-a">₹</div>
                <div className="trk-coin trk-coin-b">₹</div>
                <div className="trk-coin trk-coin-c">₹</div>
                <div className="trk-receipt">
                  <span className="trk-receipt-mark">₹</span>
                  <span className="trk-receipt-line trk-line-a" />
                  <span className="trk-receipt-line trk-line-b" />
                  <span className="trk-receipt-line trk-line-c" />
                  <span className="trk-receipt-line trk-line-d" />
                </div>
                <span className="trk-annotation trk-annotation-a micro">Balance</span>
                <span className="trk-annotation trk-annotation-b micro">Clarity</span>
              </div>
            </div>

            <div className="trk-foot">
              <span className="micro">Expense tracking</span>
              <span className="micro">Financial clarity</span>
              <span className="micro trk-foot-right">Warm neutral / 07</span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
