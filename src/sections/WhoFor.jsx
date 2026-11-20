import React, { useCallback, useRef, useState } from 'react'
import './WhoFor.css'

/* "Who it's for" (mobile): three audience cards you swipe through (the next one peeks in), with colour-coded tabs above
   that jump to a card and follow the swipe. "Includes" is shown as small tags. */

const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const IconHR = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><rect x="3.5" y="4" width="17" height="16" rx="3" /><path d="M7.5 15.5 10.5 12l2.5 2.5 4-4.5" /></svg>)
const IconPeople = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 19.5v-.6A4.9 4.9 0 0 1 7.9 14h2.2a4.9 4.9 0 0 1 4.9 4.9v.6M15.6 5a3.2 3.2 0 0 1 0 6.1M18 14.2a4.9 4.9 0 0 1 3 4.6v.7" /></svg>)
const IconBoard = (p) => (<svg viewBox="0 0 24 24" {...sv} {...p}><path d="M4 20V10M10 20V5M16 20v-7M21 20H3" /><circle cx="16" cy="9" r="1.6" /></svg>)

const WHO = [
  {
    key: 'hr', tab: 'HR & L&D', title: 'HR & L&D Teams', c: '#1e2d5a', tint: '#e9edf6', Icon: IconHR,
    p: 'You need evidence. You’ve run programmes before and had no way to prove they worked. Behavency gives you before-and-after data, participant-level reporting, and an organizational view that speaks the language of a board.',
    inc: ['Facilitators', 'HR Directors', 'L&D Managers', 'Organizational Development'],
  },
  {
    key: 'mgr', tab: 'Managers', title: 'Managers & Participants', c: '#16806f', tint: '#e3f3ef', Icon: IconPeople,
    p: 'This isn’t another survey you’ll never see the results of. The assessment feeds directly into your own report, your own development priorities, and your own programme. It’s about you — not about ticking a box.',
    inc: ['Line Managers', 'Mid Managers', 'Team Leads'],
  },
  {
    key: 'lead', tab: 'Leadership', title: 'Leadership & Boards', c: '#6d28d9', tint: '#f0e9fd', Icon: IconBoard,
    p: 'You need to know whether your management layer is fit for where the organization is going. And whether the money spent on development last year made any difference. Behavency gives you an organizational view that makes both questions answerable.',
    inc: ['CEOs', 'CHROs', 'Executive Teams', 'Investors'],
  },
]

export default function WhoFor() {
  const trk = useRef(null)
  const [on, setOn] = useState(0)
  const [dragging, setDragging] = useState(false)

  const target = useCallback((i) => {
    const t = trk.current
    return t.children[i].offsetLeft - t.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft)
  }, [])
  const current = useCallback(() => {
    const t = trk.current
    let best = 0, d = 1e9
    for (let i = 0; i < t.children.length; i++) { const dd = Math.abs(target(i) - t.scrollLeft); if (dd < d) { d = dd; best = i } }
    return best
  }, [target])
  const go = (i) => { trk.current.scrollTo({ left: target(i), behavior: 'smooth' }); setOn(i) }

  // mouse drag for computers (phones swipe natively)
  const drag = useRef({ down: false, sx: 0, sl: 0 })
  const down = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { down: true, sx: e.clientX, sl: trk.current.scrollLeft }
    setDragging(true); trk.current.setPointerCapture(e.pointerId)
  }
  const move = (e) => { if (drag.current.down) trk.current.scrollLeft = drag.current.sl - (e.clientX - drag.current.sx) }
  const up = () => {
    if (!drag.current.down) return
    drag.current.down = false; setDragging(false)
    const { sl } = drag.current
    let from = -1
    for (let i = 0; i < WHO.length; i++) if (Math.abs(target(i) - sl) < 5) { from = i; break }
    let t = current()
    const dx = trk.current.scrollLeft - sl
    if (from >= 0 && t === from && Math.abs(dx) > 40) t = Math.max(0, Math.min(WHO.length - 1, from + Math.sign(dx)))
    go(t)
  }

  return (
    <section className="wf" id="who-its-for">
      <p className="wf-eyebrow">Who it’s for</p>
      <h2 className="wf-h">Three different people. <em>One connected system.</em></h2>

      <div className="wf-tabs" role="tablist" aria-label="Who it’s for">
        {WHO.map((w, i) => (
          <button key={w.key} type="button" role="tab" aria-selected={on === i} className={on === i ? 'on' : ''}
            style={{ '--c': w.c, '--t': w.tint }} onClick={() => go(i)}>
            <w.Icon aria-hidden="true" />{w.tab}
          </button>
        ))}
      </div>

      <div className={`wf-trk ${dragging ? 'drag' : ''}`} ref={trk} onScroll={() => setOn(current())}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {WHO.map((w) => (
          <article key={w.key} className="wf-card" style={{ '--c': w.c, '--t': w.tint }} aria-label={w.title}>
            <div className="wf-top">
              <span className="wf-ico"><w.Icon /></span>
              <h3>{w.title}</h3>
            </div>
            <p className="wf-p">{w.p}</p>
            <div className="wf-inc">
              <small>Includes</small>
              <ul>{w.inc.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>

      <div className="wf-dots">
        {WHO.map((w, i) => (
          <button key={w.key} type="button" aria-label={w.title} className={on === i ? 'on' : ''} style={{ '--c': w.c }} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  )
}
