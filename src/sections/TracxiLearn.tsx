import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './TracxiLearn.css';

export function TracxiLearn() {
  return (
    <Section sectionId="tracxi-learn" name="Tracxi Learn" hasScene={false}>
      <SectionComposition
        foreground={
          <div className="trl-shell">
            <div className="chapter-topline trl-topline">
              <span className="micro">10 — Education</span>
              <span className="micro">Under development</span>
            </div>

            <div className="trl-layout">
              <div className="trl-visual" aria-hidden="true">
                <div className="trl-arch" />
                <div className="trl-sun" />
                <div className="trl-floor" />
                <div className="trl-books">
                  <span className="trl-book trl-book-a"><i /></span>
                  <span className="trl-book trl-book-b"><i /></span>
                  <span className="trl-book trl-book-c"><i /></span>
                  <span className="trl-book trl-book-d"><i /></span>
                </div>
                <div className="trl-open">
                  <span className="trl-page trl-page-l">
                    <i className="trl-line trl-line-a" />
                    <i className="trl-line trl-line-b" />
                    <i className="trl-line trl-line-c" />
                  </span>
                  <span className="trl-page trl-page-r">
                    <i className="trl-line trl-line-d" />
                    <i className="trl-line trl-line-e" />
                    <i className="trl-line trl-line-f" />
                  </span>
                  <span className="trl-spine" />
                </div>
                <span className="trl-annotation trl-annotation-a micro">Knowledge</span>
                <span className="trl-annotation trl-annotation-b micro">Access</span>
              </div>

              <div className="trl-copy">
                <p className="p-kicker">Under Development</p>
                <h2 className="p-title">Tracxi <em>Learn</em></h2>
                <p className="p-lead">Knowledge opens worlds.</p>
                <p className="p-body">
                  A learning platform focused on knowledge access, education, and helping people grow through structured, meaningful content.
                </p>
                <span className="p-status">Status: Under Development</span>
              </div>
            </div>

            <div className="trl-foot">
              <span className="micro">Education</span>
              <span className="micro">Knowledge</span>
              <span className="micro">Opportunity</span>
              <span className="micro trl-foot-right">Architecture of learning / 10</span>
            </div>
          </div>
        }
      />
    </Section>
  );
}
