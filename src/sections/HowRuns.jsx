import React from 'react'
import './HowRuns.css'

/* "How it runs" (mobile): five steps on a vertical timeline. Each step: who is involved, the step, one line, roughly how long. */

const STEPS = [
  { who: 'You and Behavency', t: 'Kick-off', p: 'We agree the goals, the group of managers and the timeline. Participants get their invitations.', d: '≈ 1 week', c: '#1e2d5a' },
  { who: 'Managers and their teams', t: 'Assessment', p: 'Self-assessment, 360 feedback, the barriers survey and resilience, with optional interviews.', d: '≈ 2–3 weeks', c: '#1d5f6e' },
  { who: 'Participants and facilitator', t: 'Results and game', p: 'Individual and group reports. The team game and reflection turn results into commitment.', d: '≈ 1–2 weeks', c: '#16806f' },
  { who: 'Managers', t: 'Training and Masterplans', p: 'Programmes matched to each manager’s priorities, each with a Masterplan for practice at work.', d: '≈ 2–3 months', c: '#7a8a35' },
  { who: 'You and Behavency', t: 'Measure', p: 'A follow-up check shows what changed in behaviour and in the conditions around the managers.', d: 'After 3–6 months', c: '#e08a1e' },
]

export default function HowRuns() {
  return (
    <section className="hw" id="how-it-runs">
      <div className="hw-pill"><span className="hw-dash" aria-hidden="true" /><b>How it runs</b><i aria-hidden="true" /><span>From kick-off to measurable change</span></div>
      <h2 className="hw-h">One programme, <em>five clear steps.</em></h2>
      <p className="hw-sub">You always know what happens next, who is involved and roughly how long it takes.</p>

      <ol className="hw-steps">
        {STEPS.map((s, i) => (
          <li key={s.t} className="hw-step" style={{ '--c': s.c, '--n': STEPS[i + 1] ? STEPS[i + 1].c : s.c }}>
            <span className="hw-num" aria-hidden="true">{i + 1}</span>
            <div className="hw-card">
              <small>{s.who}</small>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
              <span className="hw-chip">{s.d}</span>
            </div>
          </li>
        ))}
      </ol>
      <p className="hw-note">Timings are placeholders to confirm.</p>
    </section>
  )
}
