import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useInView, useOnScreen, useReducedMotion } from '../hooks'
import './Hero.css'

/* Hero (mobile): headline, copy and a swipeable row of stage cards that also advances on its own.
   Every card has the same layout: icon, stage name and a line on the left; three rows on the right. */

const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }
const Search = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><circle cx="10.5" cy="10.5" r="6.8" /><path d="m20.5 20.5-5.2-5.2" /></svg>)
const Gamepad = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><path d="M7 7h10a4.6 4.6 0 0 1 4.5 5.4l-.7 3.6a2.6 2.6 0 0 1-4.4 1.3L14.2 15H9.8l-2.2 2.3a2.6 2.6 0 0 1-4.4-1.3l-.7-3.6A4.6 4.6 0 0 1 7 7z" /><path d="M8 9.6v3M6.5 11.1h3M15.6 10.2h.01M17.8 12.2h.01" /></svg>)
const People = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><circle cx="9" cy="8" r="3.4" /><path d="M2.6 20v-.8a5.2 5.2 0 0 1 5.2-5.2h2.4a5.2 5.2 0 0 1 5.2 5.2v.8M16 4.8a3.4 3.4 0 0 1 0 6.4M18.4 14.4a5.2 5.2 0 0 1 3 4.8v.8" /></svg>)
const Group = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><circle cx="12" cy="7" r="3.2" /><circle cx="4.8" cy="9.4" r="2.4" /><circle cx="19.2" cy="9.4" r="2.4" /><path d="M6.2 20.5v-1a5 5 0 0 1 5-5h1.6a5 5 0 0 1 5 5v1M1.6 18.4v-.6a3.3 3.3 0 0 1 3.1-3.3M22.4 18.4v-.6a3.3 3.3 0 0 0-3.1-3.3" /></svg>)
const Target = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><circle cx="11" cy="13" r="8" /><circle cx="11" cy="13" r="4.2" /><path d="M11 13 20 4M16.5 3.5v4h4" /></svg>)
const Layers = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><path d="M12 2.8 2.6 7.6 12 12.4l9.4-4.8z" /><path d="m2.6 12 9.4 4.8 9.4-4.8M2.6 16.4l9.4 4.8 9.4-4.8" /></svg>)
const Cap = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><path d="M2.5 9.2 12 4.5l9.5 4.7L12 14z" /><path d="M6.4 11.4v4.6c0 1.2 2.6 2.6 5.6 2.6s5.6-1.4 5.6-2.6v-4.6M21.5 9.2v5.6" /></svg>)
const CalCheck = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><rect x="3.4" y="4.6" width="17.2" height="16.2" rx="3" /><path d="M3.4 9.6h17.2M8 2.8v3.4M16 2.8v3.4M9 15.2l2.2 2.2 4-4.2" /></svg>)
const Bars = (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="2.5" y="12" width="5" height="9" rx="2" /><rect x="9.5" y="7" width="5" height="14" rx="2" /><rect x="16.5" y="2.4" width="5" height="18.6" rx="2" /></svg>)
const Chevron = (p) => (<svg viewBox="0 0 24 24" {...sv} strokeWidth="2.4" {...p}><path d="m9.5 5.5 6.5 6.5-6.5 6.5" /></svg>)
const Chats = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><path d="M8.2 3.6h8.4a3.6 3.6 0 0 1 3.6 3.6v3.2a3.6 3.6 0 0 1-3.6 3.6h-.6" /><path d="M13.6 8.2H6.2a3.6 3.6 0 0 0-3.6 3.6v3.2a3.6 3.6 0 0 0 3.6 3.6h1.2v3l3.6-3h2.6a3.6 3.6 0 0 0 3.6-3.6v-3.2a3.6 3.6 0 0 0-3.6-3.6z" /></svg>)
const Duo = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><circle cx="8" cy="7" r="2.8" /><circle cx="17" cy="8" r="2.6" /><path d="M3 20c.4-3 2.2-4.8 5-4.8 1 0 1.9.2 2.6.7M13.4 16.2c.8-.5 1.7-.7 2.6-.7 2.4 0 4.2 1.6 4.6 4.3" /></svg>)

const CARDS = [
  {
    key: 'identify', tone: 'blue', icon: <Search />, title: 'Identify', sub: 'Reveal strengths and gaps.', kind: 'bars',
    badge: { n: '6', l: 'Areas explored' },
    rows: [{ t: 'Trust & Inclusivity', v: 32, c: 'red' }, { t: 'Clarity & Alignment', v: 62, c: 'amber' }, { t: 'Execution & Accountability', v: 78, c: 'green' }],
  },
  {
    key: 'engage', tone: 'violet', icon: <Gamepad />, title: 'Engage', sub: 'Explore team behaviours through play.', kind: 'pills',
    rows: [{ t: 'Interactive team game', pill: '45 min', icon: <Group /> }, { t: 'Guided post-game reflection', pill: '90 min', icon: <Chats /> }, { t: 'Team insight report', pill: 'Action plan', icon: <Layers /> }],
  },
  {
    key: 'build', tone: 'amber', icon: <People />, title: 'Build', sub: 'Turn insights into real development.', kind: 'pills',
    rows: [{ t: 'Training modules', pill: 'E-learning · Live sessions', icon: <Cap /> }, { t: 'Team-based exercises', pill: 'Group workshops', icon: <Duo /> }, { t: 'Practical action plan', pill: 'Individual development', icon: <CalCheck /> }],
  },
  {
    key: 'measure', tone: 'teal', icon: <Bars />, title: 'Measure', sub: 'Track programme results and team progress.', kind: 'pills',
    rows: [{ t: 'See what changed', pill: 'Team behaviours and dynamics', icon: <Target /> }, { t: 'Track development', pill: 'Progress across key areas', icon: <Bars /> }, { t: 'Identify what’s next', pill: 'Emerging team priorities', icon: <Search /> }],
  },
]

const HOLD_MS = 4600

export default function Hero() {
  const [rootRef, seen] = useInView(0.15)
  const [trackRef, onScreen] = useOnScreen(0.4)
  const reduced = useReducedMotion()
  const scroller = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i) => {
    const el = scroller.current
    if (!el) return
    const card = el.children[i]
    if (card) el.scrollTo({ left: card.offsetLeft - el.children[0].offsetLeft, behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  // keep the dots in step with swipes
  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    const step = el.children[1].offsetLeft - el.children[0].offsetLeft
    setActive(Math.min(CARDS.length - 1, Math.max(0, Math.round(el.scrollLeft / step))))
  }

  // automatic advance: only on screen, not while the visitor is touching it, never with reduced motion
  useEffect(() => {
    if (!onScreen || paused || reduced) return undefined
    const t = setTimeout(() => goTo((active + 1) % CARDS.length), HOLD_MS)
    return () => clearTimeout(t)
  }, [onScreen, paused, reduced, active, goTo])

  return (
    <section ref={rootRef} className={`hr ${seen ? 'is-in' : ''}`} id="hero">
      <div className="hr-eyebrow rv" style={{ '--i': 0 }}>
        <span className="hr-dash" aria-hidden="true" />
        <span className="hr-pill">LOWER YOUR MANAGEMENT RISK</span>
        <span className="hr-dash" aria-hidden="true" />
      </div>

      <h1 className="hr-title rv" style={{ '--i': 1 }}>
        <span className="hr-title-main">Your managers<br />want to lead well.</span>
        <em className="hr-title-em">Most don’t know<br />where they’re<br />falling short.</em>
      </h1>

      <p className="hr-sub rv" style={{ '--i': 2 }}>
        When things keep changing, that gap is a business risk. Behavency finds it early, helps managers close it — and proves it worked.
      </p>

      <div className="hr-carousel rv" style={{ '--i': 3 }} ref={trackRef}
        onTouchStart={() => setPaused(true)} onTouchEnd={() => setTimeout(() => setPaused(false), 2500)}>
        <div className="hr-track" ref={scroller} onScroll={onScroll} role="list" aria-label="Behavency stages">
          {CARDS.map((c, i) => (
            <article key={c.key} role="listitem" className={`hr-card hr-card--${c.tone} ${active === i ? 'is-active' : ''}`} aria-label={c.title}>
              <header className="hr-head">
                <span className="hr-card-ico">{c.icon}</span>
                <div className="hr-ht">
                  <h3>{c.title}</h3>
                  <p>{c.sub}</p>
                </div>
                {c.badge && <div className="hr-badge"><strong>{c.badge.n}</strong><span>{c.badge.l}</span></div>}
              </header>
              <ul className={`hr-rows hr-rows--${c.kind}`}>
                {c.rows.map((r, k) => (
                  <li key={r.t} className="hr-row">
                    {r.icon && <span className="hr-ri">{r.icon}</span>}
                    <strong className="hr-rl">{r.t}</strong>
                    {r.v != null && <span className="hr-bar"><i className={`hr-fill--${r.c}`} style={{ '--w': `${r.v}%`, '--d': `${k * 130}ms` }} /></span>}
                    {r.v != null && <em className={`hr-cp hr-cp--${r.c}`}>{r.v}%</em>}
                    {r.pill && <em className="hr-cp">{r.pill}</em>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="hr-dots" role="tablist" aria-label="Choose a card">
          {CARDS.map((c, i) => (
            <button key={c.key} type="button" role="tab" aria-selected={active === i} aria-label={c.title}
              className={`hr-dot ${active === i ? 'is-active' : ''}`} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>

    </section>
  )
}
