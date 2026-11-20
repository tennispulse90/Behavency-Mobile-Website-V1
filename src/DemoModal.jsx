import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './DemoModal.css'

/* "Request a demo" popup: full screen, close button top right (Escape and the browser's Back-free close also work).
   It is drawn outside the scaled page (in document.body) so it always fills the real screen.
   The form is sent with Netlify Forms as "demo" (a matching hidden form sits in index.html so Netlify can find it). */

const COUNTRIES = [
  ['Hungary', '+36'], ['Austria', '+43'], ['Belgium', '+32'], ['Bulgaria', '+359'], ['Croatia', '+385'], ['Cyprus', '+357'],
  ['Czech Republic', '+420'], ['Denmark', '+45'], ['Estonia', '+372'], ['Finland', '+358'], ['France', '+33'], ['Georgia', '+995'],
  ['Germany', '+49'], ['Greece', '+30'], ['Iceland', '+354'], ['Ireland', '+353'], ['Italy', '+39'], ['Latvia', '+371'],
  ['Lithuania', '+370'], ['Luxembourg', '+352'], ['Malta', '+356'], ['Netherlands', '+31'], ['Norway', '+47'], ['Poland', '+48'],
  ['Portugal', '+351'], ['Romania', '+40'], ['Serbia', '+381'], ['Slovakia', '+421'], ['Slovenia', '+386'], ['Spain', '+34'],
  ['Sweden', '+46'], ['Switzerland', '+41'], ['Turkey', '+90'], ['Ukraine', '+380'], ['United Arab Emirates', '+971'],
  ['United Kingdom', '+44'], ['United States', '+1'], ['Canada', '+1'], ['Australia', '+61'], ['India', '+91'], ['Other', ''],
]
const EMPLOYEES = ['1–49', '50–249', '250–999', '1,000–4,999', '5,000+']
const HELP = [
  'Assessing our managers (self-assessment & 360 feedback)',
  'Team engagement through the team game & reflection',
  'Manager training & development plans',
  'Measuring the impact of development',
  'Understanding the organisational barriers around managers',
]

export default function DemoModal({ open, onClose }) {
  const [state, setState] = useState('idle')
  const [dial, setDial] = useState('+36')
  const first = useRef(null)
  const closeBtn = useRef(null)

  // lock the page behind, focus the first field, close on Escape
  useEffect(() => {
    if (!open) return undefined
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const t = setTimeout(() => (first.current || closeBtn.current)?.focus(), 60)
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { html.style.overflow = prev; clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  useEffect(() => { if (!open) setState((s) => (s === 'sent' ? 'idle' : s)) }, [open])

  if (!open) return null

  const onCountry = (e) => {
    const code = COUNTRIES.find(([n]) => n === e.target.value)?.[1] ?? ''
    setDial(code)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    // the ticked "How can we help?" options go as one line
    const help = data.getAll('help-option')
    data.delete('help-option')
    data.set('help', help.join('; '))
    data.set('marketing-consent', data.get('marketing-consent') ? 'yes' : 'no')
    setState('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset(); setDial('+36')
      setState('sent')
    } catch {
      setState('error')
    }
  }

  return createPortal(
    <div className="dm" role="dialog" aria-modal="true" aria-labelledby="dm-title">
      <div className="dm-top">
        <span className="dm-logo" aria-hidden="true">
          <span className="dm-mark"><svg viewBox="0 0 12 12"><circle cx="3.2" cy="3.2" r="1.7" /><circle cx="8.8" cy="3.2" r="1.7" /><circle cx="3.2" cy="8.8" r="1.7" /><circle cx="8.8" cy="8.8" r="1.7" /></svg></span>
          Behavency
        </span>
        <button ref={closeBtn} type="button" className="dm-close" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <div className="dm-scroll">
        <div className="dm-in">
          <h2 id="dm-title" className="dm-title">Request a <em>demo</em></h2>
          {state === 'sent' ? (
            <div className="dm-done" role="status">
              <span className="dm-done-ico"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
              <h3>Thank you.</h3>
              <p>We’ve got your request and we’ll be in touch soon.</p>
              <button type="button" className="dm-btn" onClick={onClose}>Close</button>
            </div>
          ) : (
            <>
              <p className="dm-sub">Simply fill out the form and we’ll be in touch soon.</p>
              <form name="demo" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit} className="dm-form">
                <input type="hidden" name="form-name" value="demo" />
                <p className="dm-hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

                <div className="dm-row">
                  <label className="dm-f"><span>First Name*</span><input ref={first} name="first-name" autoComplete="given-name" required /></label>
                  <label className="dm-f"><span>Last Name*</span><input name="last-name" autoComplete="family-name" required /></label>
                </div>

                <div className="dm-f">
                  <span id="dm-phone">Phone Number*</span>
                  <div className="dm-row dm-row--phone">
                    <select name="country" aria-label="Country" defaultValue="Hungary" onChange={onCountry} autoComplete="country-name">
                      {COUNTRIES.map(([n]) => <option key={n}>{n}</option>)}
                    </select>
                    <input name="phone" type="tel" aria-labelledby="dm-phone" autoComplete="tel" required
                      value={dial} onChange={(e) => setDial(e.target.value)} />
                  </div>
                </div>

                <div className="dm-row">
                  <label className="dm-f"><span>Work Email*</span><input name="email" type="email" autoComplete="email" required /></label>
                  <label className="dm-f"><span>Company Name*</span><input name="company" autoComplete="organization" required /></label>
                </div>

                <div className="dm-row">
                  <label className="dm-f"><span>Job Title*</span><input name="job-title" autoComplete="organization-title" required /></label>
                  <label className="dm-f"><span>Employees*</span>
                    <select name="employees" defaultValue="" required>
                      <option value="" disabled>Please Select</option>
                      {EMPLOYEES.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  </label>
                </div>

                <fieldset className="dm-help">
                  <legend>How can we help?</legend>
                  {HELP.map((h) => (
                    <label key={h} className="dm-check"><input type="checkbox" name="help-option" value={h} /><i aria-hidden="true" /><span>{h}</span></label>
                  ))}
                </fieldset>

                <label className="dm-check dm-consent"><input type="checkbox" name="marketing-consent" value="yes" /><i aria-hidden="true" /><span>I agree to receive marketing electronic communications from Behavency</span></label>

                <button className="dm-btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit'}</button>
                {state === 'error' && <p className="dm-err" role="alert">Something went wrong. Please try again.</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
