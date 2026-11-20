import React, { useState } from 'react'
import './Packages.css'

/* "Assessment packages" (mobile): three tabs, one package card at a time. */

const PACKS = [
  {
    key: 'proficiency', name: 'Proficiency', c: '#1e2d5a', lede: 'A focused assessment and individual insight',
    items: ['Managerial Profile (self-assessment)', '360 Feedback', 'Individual Manager Report', 'Optional: Structured Interview'],
    best: 'Organizations starting with manager self-awareness and stakeholder feedback.',
  },
  {
    key: 'complete', name: 'Complete', c: '#16806f', lede: 'The full diagnostic picture — individual, team, and organizational', badge: 'Most complete',
    items: ['Everything in Proficiency', 'Workplace Effectiveness Survey', 'Resilience to Change Assessment', 'Team Assessment (same model)', 'Individual + Executive Reports'],
    best: 'Organizations that want to understand people AND the conditions around them.',
  },
  {
    key: 'flex', name: 'Flex', c: '#c2570c', lede: 'Choose the combination that fits your specific situation',
    items: ['Any combination of the above assessments', 'Configurable by cohort or programme', 'Speak with us to design the right scope'],
    best: 'Organizations with a specific context or existing frameworks to work within.',
  },
]

const Check = () => (<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.4 3.2 3.1L13 4.6" /></svg>)

export default function Packages() {
  const [on, setOn] = useState(1)
  const p = PACKS[on]
  return (
    <section className="pk" id="packages">
      <p className="pk-eyebrow">Assessment packages</p>
      <h2 className="pk-h">Start at the depth <em>your context requires.</em></h2>
      <p className="pk-sub">No invented pricing. The right package depends on what your organization needs.</p>

      <div className="pk-tabs" role="tablist" aria-label="Packages">
        {PACKS.map((x, i) => (
          <button key={x.key} type="button" role="tab" aria-selected={on === i} className={on === i ? 'on' : ''}
            style={{ '--c': x.c }} onClick={() => setOn(i)}>{x.name}</button>
        ))}
      </div>

      <article className={`pk-card ${p.badge ? 'pk-card--hi' : ''}`} style={{ '--c': p.c }} role="tabpanel" key={p.key}>
        {p.badge && <span className="pk-badge">{p.badge}</span>}
        <h3>{p.name}</h3>
        <p className="pk-lede">{p.lede}</p>
        <ul>{p.items.map((t) => <li key={t}><Check />{t}</li>)}</ul>
        <div className="pk-best"><small>Best for</small><p>{p.best}</p></div>
        <a className="pk-link" href="#contact">Explore {p.name} →</a>
      </article>

      <p className="pk-foot">Pricing is tailored to your organization’s size and programme scope. <a href="#contact">Speak with us</a> — no obligation.</p>
    </section>
  )
}
