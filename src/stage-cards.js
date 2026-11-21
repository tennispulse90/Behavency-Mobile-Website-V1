// Stage cards (option 1, "Short card, plays once"): a short card before each of the four stages.
// "01 · Stage 1 of 4 · Identify", then the stage's promise in large type; the first word is in the stage colour and the
// other words fill in by themselves, then a short arc draws. Plays once, when the card comes into view.
// Each card takes the background of the stage it opens. Ported unchanged from the "Phone Stage Starts" link (option 1 only).
(function () {
  const STAGES = [
    { sel: '#identify', name: 'Identify', promise: 'Reveal strengths and gaps', color: '#2f6fdb' },
    { sel: '#engage', name: 'Engage', promise: 'Experience how the team works together', color: '#7a4bd6' },
    { sel: '#build', name: 'Build', promise: 'Build the right capabilities', color: '#e0761c' },
    { sel: '#measure', name: 'Measure', promise: 'Prove the impact', color: '#14a07c' },
  ];

  const css = `
  .bpc { position: relative; overflow: hidden; font-family: Inter, Arial, sans-serif; }
  .bpc .bpc-in { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 64px 22px 40px; position: relative; z-index: 1; }
  .bpc .bpc-eb { display: inline-flex; align-items: center; gap: 9px; }
  .bpc .bpc-eb::before, .bpc .bpc-eb::after { content: ""; width: 18px; height: 1.5px; background: var(--k); opacity: .45; }
  .bpc .bpc-num { font: 700 11.5px/1 Inter, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: var(--k); white-space: nowrap; }
  .bpc .bpc-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--k); opacity: .6; }
  .bpc .bpc-name { font: italic 500 21px/1 "Playfair Display", Georgia, serif; color: #0f1b3d; }
  .bpc .bpc-stmt { font: 500 33px/1.16 "Playfair Display", Georgia, serif; letter-spacing: -.01em; color: #0f1b3d; margin: 18px 0 0; max-width: 340px; }
  .bpc.fill .bpc-stmt span { color: #d6d2e0; transition: color .55s ease; }
  .bpc.fill .bpc-stmt span.on { color: #0f1b3d; }
  .bpc .bpc-stmt span.k { color: var(--k) !important; }
  .bpc .bpc-fade { opacity: 0; transform: translateY(18px); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); }
  .bpc.in .bpc-fade { opacity: 1; transform: none; }
  .bpc.in .bpc-fade.d2 { transition-delay: .15s; }
  .bpc svg.bpc-sarc { width: 210px; height: 28px; margin-top: 16px; overflow: visible; }
  .bpc svg.bpc-sarc path { fill: none; stroke: var(--k); stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 300; stroke-dashoffset: 300; transition: stroke-dashoffset 1.2s cubic-bezier(.45,.05,.25,1); }
  .bpc.arc svg.bpc-sarc path { stroke-dashoffset: 0; }
  @media (prefers-reduced-motion: reduce) { .bpc * { transition: none !important; } }`;

  const SARC = '<svg class="bpc-sarc" viewBox="0 0 210 28" aria-hidden="true"><path d="M4 25 Q105 -6 206 25"/></svg>';

  function card(s, i, bg) {
    const words = s.promise.split(' ');
    const n = document.createElement('section');
    n.className = 'bpc bpc1 fill'; n.style.setProperty('--k', s.color); n.style.background = bg;
    n.setAttribute('aria-label', `Stage ${i + 1} of 4: ${s.name}`);
    const eb = `<div class="bpc-eb bpc-fade"><span class="bpc-num">0${i + 1} · Stage ${i + 1} of 4</span><i class="bpc-dot"></i><span class="bpc-name">${s.name}</span></div>`;
    const stmt = `<div class="bpc-stmt bpc-fade d2">${words.map((w, j) => `<span class="${j === 0 ? 'k' : ''}">${w}</span>`).join(' ')}.</div>`;
    n.innerHTML = `<div class="bpc-in">${eb}${stmt}${SARC}</div>`;
    return n;
  }

  function playOnce(n) {
    if (n.classList.contains('in')) return;
    n.classList.add('in');
    const sp = [...n.querySelectorAll('.bpc-stmt span:not(.k)')];
    sp.forEach((w, j) => setTimeout(() => w.classList.add('on'), 650 + j * 170));
    setTimeout(() => n.classList.add('arc'), 650 + sp.length * 170 + 300);
  }

  function init() {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    STAGES.forEach((s, i) => { const t = document.querySelector(s.sel); if (!t) return; t.parentNode.insertBefore(card(s, i, getComputedStyle(t).backgroundColor), t); });
    let tick = 0;
    const check = () => { tick = 0; document.querySelectorAll('.bpc').forEach((n) => {
      const r = n.querySelector('.bpc-eb').getBoundingClientRect();
      if (r.top < innerHeight * 0.72 && r.bottom > 0) playOnce(n);
    }); };
    addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(check); }, { passive: true });
    setTimeout(() => { if (scrollY > 200) check(); }, 2500);
  }
  const wait = setInterval(() => { if (document.querySelector('#measure')) { clearInterval(wait); setTimeout(init, 300); } }, 300);
})();
