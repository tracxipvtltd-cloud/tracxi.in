import React from 'react';
import { Section, SectionComposition } from '../components/sections/Section';
import './SkillForge.css';

export function SkillForge() {
  return (
    <>
      <div className="sf-transition" aria-hidden="true">
        <span className="micro">Transition</span>
        <p>And this is where things get interesting.</p>
      </div>
      <Section sectionId="skillforge" name="SkillForge" hasScene={false}>
        <SectionComposition
          background={
            <div className="sf-bg" aria-hidden="true">
              <div className="sf-glow" />
              <div className="sf-grid" />
            </div>
          }
          foreground={
            <div className="sf-shell">
              <div className="chapter-topline sf-topline">
                <span className="micro">11 — Advanced learning</span>
                <span className="micro">Under development</span>
              </div>

              <div className="sf-layout">
                <div className="sf-copy">
                  <p className="p-kicker">Under Development</p>
                  <h2 className="p-title">Skill<em>Forge</em></h2>
                  <p className="p-lead">Built through mastery.</p>
                  <p className="p-body">
                    A platform for advanced skill development — where learning goes beyond theory and is shaped through practice, depth, and craft.
                  </p>
                  <span className="p-status">Status: Under Development</span>
                </div>

                <div className="sf-visual" aria-hidden="true">
                  <span className="sf-ghost">11</span>
                  <div className="sf-anvil">
                    <span className="sf-anvil-horn" />
                    <span className="sf-anvil-top" />
                    <span className="sf-anvil-body" />
                    <span className="sf-anvil-base" />
                  </div>
                  <span className="sf-bar" />
                  <div className="sf-hammer">
                    <span className="sf-hammer-head" />
                    <span className="sf-hammer-handle" />
                  </div>
                  <div className="sf-sparks">
                    <span className="sf-spark sf-spark-a" />
                    <span className="sf-spark sf-spark-b" />
                    <span className="sf-spark sf-spark-c" />
                    <span className="sf-spark sf-spark-d" />
                    <span className="sf-spark sf-spark-e" />
                  </div>
                  <span className="sf-caption sf-caption-a micro">Craft</span>
                  <span className="sf-caption sf-caption-b micro">Controlled heat</span>
                  <span className="sf-caption sf-caption-c micro">Precision / 11</span>
                </div>
              </div>

              <div className="sf-foot">
                <span className="micro">Metal</span>
                <span className="micro">Practice</span>
                <span className="micro">Mastery</span>
                <span className="micro sf-foot-right">Forge / 11</span>
              </div>
            </div>
          }
        />
      </Section>
    </>
  );
}
